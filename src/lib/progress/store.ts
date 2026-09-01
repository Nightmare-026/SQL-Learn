'use client';

// ============ Progress store: Zustand + localStorage (spec §18) ============

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { freshProgress, emptyModuleProgress } from '@/types/progress';
import type { ModuleProgress, ProgressState, ProgressStats } from '@/types/progress';
import type { Lang } from '@/types/content';
import { MODULE_INDEX, TOTAL_MODULES, TOTAL_PROJECTS, moduleNumberToId, levelOfModule } from '@/lib/content/registry';
import { isModuleUnlocked } from './unlock';

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
          const parsed = JSON.parse(raw);
          // accept both wrapped {state} and bare progress
          const data = parsed?.state?.modules ? parsed.state : parsed;
          if (!data || typeof data !== 'object' || !data.modules) return false;
          set({
            version: data.version ?? '1.0',
            lastAccessed: new Date().toISOString(),
            language: data.language === 'hi' ? 'hi' : 'en',
            currentLevel: data.currentLevel ?? 'beginner',
            returning: true,
            modules: data.modules ?? {},
            projects: data.projects ?? {},
            lastModule: data.lastModule ?? null,
            stats: {
              totalQueriesRun: data.stats?.totalQueriesRun ?? 0,
              totalTasksCompleted: data.stats?.totalTasksCompleted ?? 0,
              totalHintsUsed: data.stats?.totalHintsUsed ?? 0,
              timeSpentSeconds: data.stats?.timeSpentSeconds ?? 0,
            },
          });
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
      storage: createJSONStorage(() => localStorage),
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
  return useProgressStore((s) => {
    const completed = Object.values(s.modules).filter((m) => m.status === 'completed');
    const byLevel = { beginner: 0, intermediate: 0, advanced: 0 } as Record<string, number>;
    for (const id of Object.keys(s.modules)) {
      const number = Number(id.replace('module-', ''));
      const level = levelOfModule(number);
      if (s.modules[id].status === 'completed') byLevel[level]++;
    }
    const tasksCompleted = Object.values(s.modules).reduce(
      (sum, m) => sum + m.tasksCompleted.length, 0
    );
    const projectsCompleted = Object.values(s.projects).filter((p) => p.status === 'completed').length;
    return {
      overallPercent: Math.round((completed.length / TOTAL_MODULES) * 100),
      levelProgress: {
        beginner: { completed: byLevel.beginner, total: 20 },
        intermediate: { completed: byLevel.intermediate, total: 20 },
        advanced: { completed: byLevel.advanced, total: 20 },
      },
      modulesCompleted: completed.length,
      tasksCompleted,
      projectsCompleted,
      queriesRun: s.stats.totalQueriesRun,
    };
  });
}

export function useUnlocked(moduleNumber: number): boolean {
  return useProgressStore((s) => isModuleUnlocked(moduleNumber, s));
}

export function isProjectUnlocked(projectModuleNumber: number, progress: ProgressState): boolean {
  return isModuleUnlocked(projectModuleNumber, progress);
}

export { moduleNumberToId, TOTAL_PROJECTS };
