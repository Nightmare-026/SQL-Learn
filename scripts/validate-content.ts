/**
 * Validate ALL task solutions against the seeded databases — mirroring the
 * app's runtime validation semantics:
 *  - plain tasks: solution's last result set (exec + prepare fallback)
 *  - verify tasks (DDL/views/triggers): solution script runs statement-wise
 *    (expected errors tolerated), then verifyQuery determines the result
 * Run: bun scripts/validate-content.ts
 */
import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { MODULE_BODIES } from '../src/content/modules/registry';

const SQL = await initSqlJs({
  wasmBinary: fs.readFileSync(path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm')),
} as any);

const load = (p: string) => {
  const raw = fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
  return JSON.parse(raw.match(/export const \w+ = (".*");\n/s)![1]);
};
const SEEDS: Record<string, string> = {
  school: load('src/content/datasets/school.ts'),
  ecommerce: load('src/content/datasets/ecommerce.ts'),
  advanced: load('src/content/datasets/advanced.ts'),
};

interface Q { columns: string[]; rows: unknown[][]; }
function run(db: any, sql: string): { ok: true; result: Q | null } | { ok: false; error: string } {
  try {
    const r = db.exec(sql);
    const last = r[r.length - 1];
    if (last && last.columns && last.columns.length) {
      return { ok: true, result: { columns: [...last.columns], rows: last.values.map((v: unknown[]) => [...v]) } };
    }
    if (r.length === 0) {
      // zero-row SELECT / PRAGMA — prepare fallback (single statement only).
      // NOTE: prepare errors here are NOT statement failures (e.g. re-preparing
      // DDL whose exec already succeeded) — swallow them.
      const t = sql.trim().replace(/;+\s*$/, '');
      if (t && !t.includes(';')) {
        let stmt: any = null;
        try {
          stmt = db.prepare(sql);
          const cols = stmt.getColumnNames();
          if (cols.length) {
            const rows: unknown[][] = [];
            while (stmt.step()) rows.push([...stmt.get()]);
            stmt.free();
            return { ok: true, result: { columns: [...cols], rows } };
          }
          stmt.free();
        } catch {
          try { stmt?.free?.(); } catch { /* noop */ }
        }
      }
    }
    return { ok: true, result: null };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

/** Statement splitter mirroring src/lib/sql/engine.ts splitSql. */
function splitSql(script: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inStr = false;
  let strCh = '';
  let blockDepth = 0;
  let parenDepth = 0;
  let i = 0;
  const n = script.length;
  const isIdent = (c: string) => /[A-Za-z0-9_]/.test(c);
  while (i < n) {
    const ch = script[i]!;
    const next = script[i + 1];
    if (!inStr && ch === '-' && next === '-') {
      const end = script.indexOf('\n', i);
      const stop = end === -1 ? n : end;
      cur += script.slice(i, stop);
      i = stop;
      continue;
    }
    if (!inStr && ch === '/' && next === '*') {
      const end = script.indexOf('*/', i + 2);
      const stop = end === -1 ? n : end + 2;
      cur += script.slice(i, stop);
      i = stop;
      continue;
    }
    if (inStr) {
      cur += ch;
      if (ch === strCh) inStr = false;
      i++;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      inStr = true;
      strCh = ch;
      cur += ch;
      i++;
      continue;
    }
    if (/[A-Za-z]/.test(ch)) {
      let j = i;
      while (j < n && isIdent(script[j]!)) j++;
      const word = script.slice(i, j).toUpperCase();
      if (word === 'BEGIN' || word === 'CASE') blockDepth++;
      else if (word === 'END') blockDepth = Math.max(0, blockDepth - 1);
      cur += script.slice(i, j);
      i = j;
      continue;
    }
    if (ch === '(') parenDepth++;
    if (ch === ')') parenDepth = Math.max(0, parenDepth - 1);
    if (ch === ';' && blockDepth === 0 && parenDepth === 0) {
      if (cur.trim()) out.push(cur.trim());
      cur = '';
      i++;
      continue;
    }
    cur += ch;
    i++;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

function runScript(db: any, script: string): { lastResult: Q | null; errors: string[] } {
  const errors: string[] = [];
  let lastResult: Q | null = null;
  for (const st of splitSql(script)) {
    const out = run(db, st);
    if (out.ok) {
      if (out.result) lastResult = out.result;
    } else {
      errors.push(out.error);
    }
  }
  return { lastResult, errors };
}

let failures = 0;
let checked = 0;

for (const mod of [...MODULE_BODIES].sort((a, b) => a.number - b.number)) {
  const db = new SQL.Database();
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(SEEDS[mod.dataset]);

  for (const t of mod.tasks) {
    checked++;
    const script = runScript(db, t.solution);
    if (t.verifyQuery) {
      const v = run(db, t.verifyQuery);
      if (!v.ok) {
        console.log(`✗ M${mod.number}.${t.id} VERIFY ERROR: ${v.error}`);
        failures++;
        continue;
      }
      if (!v.result || (v.result.columns.length === 0 && v.result.rows.length === 0)) {
        console.log(`✗ M${mod.number}.${t.id} VERIFY EMPTY (view/object must be observable)`);
        failures++;
        continue;
      }
    } else {
      if (script.errors.length) {
        console.log(`✗ M${mod.number}.${t.id} SOLUTION ERROR: ${script.errors[0]}`);
        console.log(`   SQL: ${t.solution.slice(0, 130).replace(/\n/g, ' ')}…`);
        failures++;
        continue;
      }
      if (!script.lastResult) {
        console.log(`✗ M${mod.number}.${t.id} SOLUTION RETURNS NO RESULT SET`);
        console.log(`   SQL: ${t.solution.slice(0, 130).replace(/\n/g, ' ')}…`);
        failures++;
        continue;
      }
      if (script.lastResult.rows.length === 0 && !/expect|zero|healthy|integrity/i.test(t.description.en)) {
        console.log(`⚠ M${mod.number}.${t.id} empty result (ok if intentional): ${t.description.en.slice(0, 80)}`);
      }
    }
  }
  db.close();
}

console.log(`\nChecked ${checked} tasks across ${MODULE_BODIES.length} modules.`);
if (failures === 0) {
  console.log('ALL TASK SOLUTIONS VALID');
} else {
  console.log(`${failures} FAILURES`);
  process.exit(1);
}
