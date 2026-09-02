'use client';

// ============ Module registry: all 60 module bodies ============

import type { Module } from '@/types/content';
import { modules as b01 } from './beginner-01-03';
import { modules as b04 } from './beginner-04-06';
import { modules as b07 } from './beginner-07-09';
import { modules as b10 } from './beginner-10-12';
import { modules as b13 } from './beginner-13-15';
import { modules as b16 } from './beginner-16-18';
import { modules as b19 } from './beginner-19-20';
import { modules as i21 } from './intermediate-21-23';
import { modules as i24 } from './intermediate-24-26';
import { modules as i27 } from './intermediate-27-29';
import { modules as i30 } from './intermediate-30-32';
import { modules as i33 } from './intermediate-33-35';
import { modules as i36 } from './intermediate-36-38';
import { modules as i39 } from './intermediate-39-40';
import { modules as a41 } from './advanced-41-44';
import { modules as a45 } from './advanced-45-48';
import { modules as a49 } from './advanced-49-52';
import { modules as a53 } from './advanced-53-56';
import { modules as a57 } from './advanced-57-60';

const ALL: Module[] = [
  ...b01, ...b04, ...b07, ...b10, ...b13, ...b16, ...b19,
  ...i21, ...i24, ...i27, ...i30, ...i33, ...i36, ...i39,
  ...a41, ...a45, ...a49, ...a53, ...a57,
];

const MODULES_BY_NUMBER = new Map<number, Module>(ALL.map((m) => [m.number, m]));

export function getModule(n: number): Module {
  const m = MODULES_BY_NUMBER.get(n);
  if (!m) throw new Error(`Module ${n} not found`);
  return m;
}

export const MODULE_BODIES = ALL;
