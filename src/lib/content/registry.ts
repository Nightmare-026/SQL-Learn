'use client';

// ============ Content registry: lightweight index + lazy module loading ============

import type { Module, ModuleLevel, Project, DatasetId } from '@/types/content';

export interface ModuleIndexEntry {
  id: string;
  number: number;
  level: ModuleLevel;
  dataset: DatasetId;
  titleEn: string;
  titleHi: string;
  concepts: string[];
  taskCount: number;
  hasQuiz: boolean;
  estimatedTime: string;
}

export const TOTAL_MODULES = 60;
export const TOTAL_TASKS = 300;
export const TOTAL_PROJECTS = 10;

export function levelOfModule(n: number): ModuleLevel {
  if (n <= 20) return 'beginner';
  if (n <= 40) return 'intermediate';
  return 'advanced';
}

export function moduleNumberToId(n: number): string {
  return `module-${String(n).padStart(2, '0')}`;
}

export function moduleIdToNumber(id: string): number {
  return Number(id.replace('module-', ''));
}

// Level display meta (spec colors)
export const LEVEL_META: Record<ModuleLevel, { dot: string; labelKey: string; badge: string }> = {
  beginner: { dot: '#10B981', labelKey: 'level.beginner', badge: 'bg-success-50 text-success-700 border-success-500' },
  intermediate: { dot: '#F59E0B', labelKey: 'level.intermediate', badge: 'bg-warning-50 text-warning-700 border-warning-500' },
  advanced: { dot: '#EF4444', labelKey: 'level.advanced', badge: 'bg-danger-50 text-danger-700 border-danger-500' },
};

// ---------- Registry core ----------
// Module title/concept data is provided by the generated curriculum index,
// so navigation/search work without loading any module body.
import { CURRICULUM_INDEX } from '@/content/modules/index';

export const MODULE_INDEX: Record<number, ModuleIndexEntry> = CURRICULUM_INDEX;

export function getModuleIndexEntry(n: number): ModuleIndexEntry | undefined {
  return MODULE_INDEX[n];
}

// ---------- Lazy module body loading ----------
const moduleCache = new Map<string, Module>();
const modulePromises = new Map<string, Promise<Module>>();

export async function loadModule(n: number): Promise<Module> {
  const id = moduleNumberToId(n);
  const cached = moduleCache.get(id);
  if (cached) return cached;
  let p = modulePromises.get(id);
  if (!p) {
    p = import('@/content/modules/registry').then((m) => m.getModule(n));
    modulePromises.set(id, p);
  }
  const mod = await p;
  moduleCache.set(id, mod);
  return mod;
}

export function cachedModule(n: number): Module | undefined {
  return moduleCache.get(moduleNumberToId(n));
}

// ---------- Projects ----------
let projectsCache: Project[] | null = null;
export async function loadProjects(): Promise<Project[]> {
  if (projectsCache) return projectsCache;
  const m = await import('@/content/projects/index');
  projectsCache = m.ALL_PROJECTS;
  return projectsCache;
}

// ---------- Search (spec §19) ----------
export interface SearchHit {
  entry: ModuleIndexEntry;
  score: number;
}

export function searchModules(query: string, level: ModuleLevel | 'all', status: 'all' | 'completed' | 'unlocked' | 'locked', statusFn: (n: number) => 'completed' | 'unlocked' | 'locked'): SearchHit[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const hits: SearchHit[] = [];
  for (const entry of Object.values(MODULE_INDEX)) {
    if (level !== 'all' && entry.level !== level) continue;
    const st = statusFn(entry.number);
    if (status === 'completed' && st !== 'completed') continue;
    if (status === 'unlocked' && st !== 'unlocked') continue;
    if (status === 'locked' && st !== 'locked') continue;
    let score = 0;
    if (terms.length === 0) score = 1;
    for (const t of terms) {
      if (entry.titleEn.toLowerCase().includes(t)) score += 10;
      if (entry.titleHi.toLowerCase().includes(t)) score += 10;
      if (entry.concepts.some((c) => c.toLowerCase().includes(t))) score += 5;
    }
    if (score > 0) hits.push({ entry, score: score + (61 - entry.number) / 100 });
  }
  return hits.sort((a, b) => b.score - a.score);
}
