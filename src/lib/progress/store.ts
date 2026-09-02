'use client';

// ============ Progress store: Zustand + localStorage (spec §18) ============

import { useMemo } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';

import { freshProgress, emptyModuleProgress } from '@/types/progress';
import type { ModuleProgress, ProgressState, ProgressStats } from '@/types/progress';
import type { Lang } from '@/types/content';
import { MODULE_INDEX, TOTAL_MODULES, TOTAL_PROJECTS, moduleNumberToId, levelOfModule } from '@/lib/content/registry';
import { isModuleUnlocked } from './unlock';
import { useLangStore } from '@/lib/i18n/store';

/** localStorage can throw (Safari private mode, quota, disabled cookies). */
const safeLocalStorage: StateStorage = {
  getItem: (name) => {
    try { return localStorage.getItem(name); } catch { return null; }
  },
  setItem: (name, value) => {
    try { localStorage.setItem(name, value); } catch { /* storage full/blocked — keep in-memory state */ }
  },
  removeItem: (name) => {
    try { localStorage.removeItem(name); } catch { /* noop */ }
  },
};

interface ProgressActions {
  touch: () => void;
  setLanguage: (lang: Lang) => void;
  markTheoryRead: (moduleId: string) => void;
  markTaskCompleted: (moduleId: string, taskId: string) => void;
  markTaskSkipped: (moduleId: string, taskId: string) => void;
  unskipTask: (moduleId: string, taskId: string) => void;
  recordHints: (moduleId: string, taskId: string, count: number) => void;
  recordQuiz: (moduleId: string, score: number) => void;
  recordProjectTask: (projectId: string, taskId: string) => void;
  bumpStats: (partial: Partial<ProgressStats>) => void;
  setLastModule: (moduleId: string) => void;
  resetAll: () => void;
  importState: (raw: string) => boolean;
  exportState: () => string;
}

export type ProgressStore = ProgressState & ProgressActions;

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...freshProgress(),

      touch: () => set({ lastAccessed: new Date().toISOString(), returning: true }),

      setLanguage: (language) => set({ language }),

      markTheoryRead: (moduleId) =>
        set((s) => {
          const mp = s.modules[moduleId] ?? emptyModuleProgress();
          return { modules: { ...s.modules, [moduleId]: { ...mp, theoryRead: true } } };
        }),

      markTaskCompleted: (moduleId, taskId) =>
        set((s) => {
          const mp = s.modules[moduleId] ?? emptyModuleProgress();
          if (mp.tasksCompleted.includes(taskId)) return {};
          const tasksCompleted = [...mp.tasksCompleted, taskId];
          const tasksSkipped = mp.tasksSkipped.filter((t) => t !== taskId);
          const next = { ...mp, tasksCompleted, tasksSkipped };
          finalize(next, moduleId, s);
          return {
            modules: { ...s.modules, [moduleId]: next },
            stats: { ...s.stats, totalTasksCompleted: s.stats.totalTasksCompleted + 1 },
          };
        }),

      markTaskSkipped: (moduleId, taskId) =>
        set((s) => {
          const mp = s.modules[moduleId] ?? emptyModuleProgress();
          if (mp.tasksSkipped.includes(taskId) || mp.tasksCompleted.includes(taskId)) return {};
          const next = { ...mp, tasksSkipped: [...mp.tasksSkipped, taskId] };
          finalize(next, moduleId, s);
          return { modules: { ...s.modules, [moduleId]: next } };
        }),

      unskipTask: (moduleId, taskId) =>
        set((s) => {
          const mp = s.modules[moduleId] ?? emptyModuleProgress();
          return {
            modules: {
              ...s.modules,
              [moduleId]: { ...mp, tasksSkipped: mp.tasksSkipped.filter((t) => t !== taskId) },
            },
          };
        }),

      recordHints: (moduleId, taskId, count) =>
        set((s) => {
          const mp = s.modules[moduleId] ?? emptyModuleProgress();
          const hintsUsed = { ...mp.hintsUsed, [taskId]: count };
          return { modules: { ...s.modules, [moduleId]: { ...mp, hintsUsed } } };
        }),

      recordQuiz: (moduleId, score) =>
        set((s) => {
          const mp = s.modules[moduleId] ?? emptyModuleProgress();
          const next: ModuleProgress = {
            ...mp,
            quizBestScore: mp.quizBestScore === null ? score : Math.max(mp.quizBestScore, score),
            quizAttempts: mp.quizAttempts + 1,
          };
          finalize(next, moduleId, s);
          return { modules: { ...s.modules, [moduleId]: next } };
        }),

      recordProjectTask: (projectId, taskId) =>
        set((s) => {
          const pp = s.projects[projectId] ?? { status: 'in_progress' as const, tasksCompleted: [] };
          if (pp.tasksCompleted.includes(taskId)) return {};
          const tasksCompleted = [...pp.tasksCompleted, taskId];
          const proj = PROJECT_TOTALS[projectId] ?? 5;
          const status = tasksCompleted.length >= proj ? ('completed' as const) : ('in_progress' as const);
          return { projects: { ...s.projects, [projectId]: { status, tasksCompleted } } };
        }),

      bumpStats: (partial) =>
        set((s) => ({
          stats: {
            totalQueriesRun: s.stats.totalQueriesRun + (partial.totalQueriesRun ?? 0),
            totalTasksCompleted: s.stats.totalTasksCompleted + (partial.totalTasksCompleted ?? 0),
            totalHintsUsed: s.stats.totalHintsUsed + (partial.totalHintsUsed ?? 0),
            timeSpentSeconds: s.stats.timeSpentSeconds + (partial.timeSpentSeconds ?? 0),
          },
        })),

      setLastModule: (moduleId) => set({ lastModule: moduleId }),

      resetAll: () => {
        const lang = get().language;
        set({ ...freshProgress(lang), returning: true });
      },

      importState: (raw) => {
        try {
          const parsed: unknown = JSON.parse(raw);
          // accept both wrapped {state} and bare progress
          const data = (parsed as { state?: { modules?: unknown } })?.state?.modules
            ? (parsed as { state: Record<string, unknown> }).state
            : parsed;
          if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
          const d = data as Record<string, unknown>;
          const language = d.language === 'hi' ? 'hi' : 'en';
          set({
            version: typeof d.version === 'string' ? d.version : '1.0',
            lastAccessed: new Date().toISOString(),
            language,
            currentLevel: d.currentLevel === 'intermediate' || d.currentLevel === 'advanced' ? d.currentLevel : 'beginner',
            returning: true,
            modules: sanitizeModules(d.modules),
            projects: sanitizeProjects(d.projects),
            lastModule: typeof d.lastModule === 'string' ? d.lastModule : null,
            stats: sanitizeStats(d.stats),
          });
          // Keep the UI language store in sync so the whole interface
          // (not just task text) follows the imported preference.
          useLangStore.getState().setLang(language);
          return true;
        } catch {
          return false;
        }
      },

      exportState: () => {
        const s = get();
        const payload = {
          version: s.version,
          lastAccessed: new Date().toISOString(),
          language: s.language,
          currentLevel: s.currentLevel,
          modules: s.modules,
          projects: s.projects,
          lastModule: s.lastModule,
          stats: s.stats,
        };
        return JSON.stringify(payload, null, 2);
      },
    }),
    {
      name: 'sqlLearnProgress',
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (s) => ({
        version: s.version,
        lastAccessed: s.lastAccessed,
        language: s.language,
        currentLevel: s.currentLevel,
        returning: s.returning,
        modules: s.modules,
        projects: s.projects,
        lastModule: s.lastModule,
        stats: s.stats,
      }),
    }
  )
);

// Project task totals for completion detection
const PROJECT_TOTALS: Record<string, number> = {
  p1: 5, p2: 6, p3: 6, p4: 5, p5: 5, p6: 4,
  lp1: 8, lp2: 10, lp3: 8, capstone: 12,
};

// ---------- import sanitizers (defend against malformed backup files) ----------

function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
}
function numRecord(v: unknown): Record<string, number> {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return {};
  const out: Record<string, number> = {};
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    if (typeof val === 'number' && Number.isFinite(val) && val >= 0) out[k] = val;
  }
  return out;
}
function clampNum(v: unknown, max: number): number {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.min(v, max) : 0;
}
function sanitizeModules(v: unknown): ProgressState['modules'] {
  const out: ProgressState['modules'] = {};
  if (!v || typeof v !== 'object' || Array.isArray(v)) return out;
  for (const [id, raw] of Object.entries(v as Record<string, unknown>)) {
    if (!/^module-\d{1,3}$/.test(id) || !raw || typeof raw !== 'object') continue;
    const m = raw as Record<string, unknown>;
    const tasksCompleted = strArray(m.tasksCompleted);
    const quizBest = typeof m.quizBestScore === 'number' ? Math.max(0, Math.min(100, Math.round(m.quizBestScore))) : null;
    // "completed" only survives if the completion criteria actually hold
    // (≥3 tasks passed AND quiz ≥ 70) — otherwise demote to in_progress.
    const genuine = tasksCompleted.length >= 3 && (quizBest ?? 0) >= 70;
    out[id] = {
      theoryRead: m.theoryRead === true,
      tasksCompleted,
      tasksSkipped: strArray(m.tasksSkipped),
      hintsUsed: numRecord(m.hintsUsed),
      quizBestScore: quizBest,
      quizAttempts: clampNum(m.quizAttempts, 1000),
      status: m.status === 'completed' && genuine ? 'completed' : 'in_progress',
      completedAt: m.status === 'completed' && genuine && typeof m.completedAt === 'string' ? m.completedAt : null,
    };
  }
  return out;
}
function sanitizeProjects(v: unknown): ProgressState['projects'] {
  const out: ProgressState['projects'] = {};
  if (!v || typeof v !== 'object' || Array.isArray(v)) return out;
  for (const [id, raw] of Object.entries(v as Record<string, unknown>)) {
    if (!/^[\w-]{1,32}$/.test(id) || !raw || typeof raw !== 'object') continue;
    const p = raw as Record<string, unknown>;
    out[id] = {
      status: p.status === 'completed' ? 'completed' : 'in_progress',
      tasksCompleted: strArray(p.tasksCompleted),
    };
  }
  return out;
}
function sanitizeStats(v: unknown): ProgressStats {
  const s = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>;
  return {
    totalQueriesRun: clampNum(s.totalQueriesRun, 100_000_000),
    totalTasksCompleted: clampNum(s.totalTasksCompleted, 100_000),
    totalHintsUsed: clampNum(s.totalHintsUsed, 1_000_000),
    timeSpentSeconds: clampNum(s.timeSpentSeconds, 100_000_000),
  };
}

/** Apply completion criteria (spec #23: 3/5 tasks AND quiz ≥ 70%). */
function finalize(mp: ModuleProgress, moduleId: string, _s: ProgressState) {
  const number = Number(moduleId.replace('module-', ''));
  const totalTasks = MODULE_INDEX[number]?.taskCount ?? 5;
  const passed = mp.tasksCompleted.length;
  const quizOk = (mp.quizBestScore ?? 0) >= 70;
  if (passed >= Math.min(3, totalTasks) && quizOk) {
    mp.status = 'completed';
    mp.completedAt = mp.completedAt ?? new Date().toISOString();
  } else if (mp.status !== 'completed') {
    mp.status = 'in_progress';
  }
}

// ============ Derived selectors ============

export function useModuleStatus(moduleId: string): ModuleProgress | undefined {
  return useProgressStore((s) => s.modules[moduleId]);
}

export function useProgressSummary() {
  const modules = useProgressStore((s) => s.modules);
  const projects = useProgressStore((s) => s.projects);
  const stats = useProgressStore((s) => s.stats);
  return useMemo(() => {
    const byLevel = { beginner: 0, intermediate: 0, advanced: 0 } as Record<string, number>;
    let modulesCompleted = 0;
    for (const [id, mp] of Object.entries(modules)) {
      if (mp.status !== 'completed') continue;
      modulesCompleted++;
      const n = Number(id.replace('module-', ''));
      const level = levelOfModule(n);
      byLevel[level] = (byLevel[level] ?? 0) + 1;
    }
    const tasksCompleted = Object.values(modules).reduce((sum, m) => sum + m.tasksCompleted.length, 0);
    const projectsCompleted = Object.values(projects).filter((p) => p.status === 'completed').length;
    return {
      overallPercent: Math.round((modulesCompleted / TOTAL_MODULES) * 100),
      levelProgress: {
        beginner: { completed: byLevel.beginner, total: 20 },
        intermediate: { completed: byLevel.intermediate, total: 20 },
        advanced: { completed: byLevel.advanced, total: 20 },
      },
      modulesCompleted,
      tasksCompleted,
      projectsCompleted,
      queriesRun: stats.totalQueriesRun,
    };
  }, [modules, projects, stats]);
}

export function useUnlocked(moduleNumber: number): boolean {
  return useProgressStore((s) => isModuleUnlocked(moduleNumber, s));
}

export function isProjectUnlocked(projectModuleNumber: number, progress: ProgressState): boolean {
  return isModuleUnlocked(projectModuleNumber, progress);
}

export { moduleNumberToId, TOTAL_PROJECTS };
