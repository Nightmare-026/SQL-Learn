'use client';

// ============ Module unlock logic (spec §18.3) ============

import type { ProgressState } from '@/types/progress';
import { levelOfModule } from '@/lib/content/registry';

/**
 * Linear unlock within a level; level boundaries require the whole previous
 * level completed (M21 needs all beginner done, M41 needs all intermediate).
 */
export function isModuleUnlocked(moduleNumber: number, progress: ProgressState): boolean {
  if (moduleNumber <= 1) return true;
  if (moduleNumber <= 20) {
    return isCompleted(moduleNumber - 1, progress);
  }
  if (moduleNumber === 21) {
    return allCompleted('beginner', progress);
  }
  if (moduleNumber <= 40) {
    return isCompleted(moduleNumber - 1, progress);
  }
  if (moduleNumber === 41) {
    return allCompleted('intermediate', progress);
  }
  return isCompleted(moduleNumber - 1, progress);
}

export function isCompleted(moduleNumber: number, progress: ProgressState): boolean {
  const id = `module-${String(moduleNumber).padStart(2, '0')}`;
  return progress.modules[id]?.status === 'completed';
}

export function allCompleted(level: 'beginner' | 'intermediate' | 'advanced', progress: ProgressState): boolean {
  const range = level === 'beginner' ? [1, 20] : level === 'intermediate' ? [21, 40] : [41, 60];
  for (let n = range[0]; n <= range[1]; n++) {
    if (!isCompleted(n, progress)) return false;
  }
  return true;
}

/** First module the user should continue with. */
export function nextTargetModule(progress: ProgressState): number {
  for (let n = 1; n <= 60; n++) {
    if (isModuleUnlocked(n, progress) && !isCompleted(n, progress)) return n;
  }
  return 60; // all done
}
