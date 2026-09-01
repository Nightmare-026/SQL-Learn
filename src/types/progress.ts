// ============ PROGRESS TYPES (spec §18) ============

import type { DatasetId, Lang, ModuleLevel, ModuleStatus } from './content';

export interface ModuleProgress {
  status: ModuleStatus;
  theoryRead: boolean;
  tasksCompleted: string[];
  tasksSkipped: string[];
  quizBestScore: number | null;
  quizAttempts: number;
  hintsUsed: Record<string, number>;
  completedAt: string | null;
}

export interface ProjectProgress {
  status: ModuleStatus;
  tasksCompleted: string[];
}

export interface ProgressStats {
  totalQueriesRun: number;
  totalTasksCompleted: number;
  totalHintsUsed: number;
  timeSpentSeconds: number;
}

export interface ProgressState {
  version: string;
  lastAccessed: string;
  language: Lang;
  currentLevel: ModuleLevel;
  returning: boolean;
  modules: Record<string, ModuleProgress>;
  projects: Record<string, ProjectProgress>;
  lastModule: string | null;
  stats: ProgressStats;
}

export interface ProgressSummary {
  overallPercent: number;
  levelProgress: Record<ModuleLevel, { completed: number; total: number }>;
  modulesCompleted: number;
  tasksCompleted: number;
  projectsCompleted: number;
  queriesRun: number;
}

export const LEVEL_DATASET: Record<ModuleLevel, DatasetId> = {
  beginner: 'school',
  intermediate: 'ecommerce',
  advanced: 'advanced',
};

export function emptyModuleProgress(): ModuleProgress {
  return {
    status: 'in_progress',
    theoryRead: false,
    tasksCompleted: [],
    tasksSkipped: [],
    quizBestScore: null,
    quizAttempts: 0,
    hintsUsed: {},
    completedAt: null,
  };
}

export function freshProgress(lang: Lang = 'en'): ProgressState {
  return {
    version: '1.0',
    lastAccessed: new Date().toISOString(),
    language: lang,
    currentLevel: 'beginner',
    returning: false,
    modules: {},
    projects: {},
    lastModule: null,
    stats: { totalQueriesRun: 0, totalTasksCompleted: 0, totalHintsUsed: 0, timeSpentSeconds: 0 },
  };
}
