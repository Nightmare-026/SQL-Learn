/** Validate output_prediction quiz questions: run queryShown, compare with the marked-correct option. Run: bun scripts/validate-quiz.ts */
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

function run(db: any, sql: string) {
  try {
    const r = db.exec(sql);
    if (r.length && r[0].columns.length) {
      return { ok: true as const, columns: r[0].columns, rows: r[0].values.map((v: any[]) => [...v]) };
    }
    return { ok: true as const, columns: [], rows: [] };
  } catch (e: any) {
    return { ok: false as const, error: e.message };
  }
}

const norm = (v: unknown, colIdx: number, columns: string[]) => {
  if (columns[colIdx] === 'notused') return 0; // engine-internal, ignore
  if (columns[0] === 'id' && columns[colIdx] !== 'detail') return 0; // EXPLAIN step ids/parents vary by engine version
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return Math.round(v * 100) / 100;
  return String(v);
};
const rowsEq = (a: unknown[][], b: unknown[][], columns: string[] = []) => {
  const key = (r: unknown[]) => r.map((v, i) => norm(v, i, columns)).map((x) => (x === null ? '\u0000' : String(x))).join('\u0001');
  const sa = [...a].map(key).sort();
  const sb = [...b].map(key).sort();
  return sa.length === sb.length && sa.every((k, i) => k === sb[i]);
};

let failures = 0;
let checked = 0;

for (const mod of [...MODULE_BODIES].sort((a, b) => a.number - b.number)) {
  const db = new SQL.Database();
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(SEEDS[mod.dataset]);

  for (const q of mod.quiz) {
    if (q.type !== 'output_prediction') continue;
    checked++;
    const actual = run(db, q.queryShown);
    const correctOpt = q.options[q.correctIndex];
    const correctIsError = 'error' in correctOpt.result;
    if (!actual.ok) {
      if (!correctIsError) {
        console.log(`✗ M${mod.number} quiz: query errors: ${actual.error} | ${q.queryShown.slice(0, 80)}`);
        failures++;
      }
      continue;
    }
    if (correctIsError) {
      console.log(`✗ M${mod.number} quiz: correct option marked as ERROR but query runs fine | ${q.queryShown.slice(0, 80)}`);
      failures++;
      continue;
    }
    const want = correctOpt.result as { columns: string[]; rows: unknown[][] };
    if (!rowsEq(actual.rows, want.rows, actual.columns)) {
      console.log(`✗ M${mod.number} quiz: rows mismatch`);
      console.log(`   query: ${q.queryShown.slice(0, 100)}`);
      console.log(`   actual: ${JSON.stringify(actual.rows.slice(0, 6)).slice(0, 200)}`);
      console.log(`   marked: ${JSON.stringify(want.rows.slice(0, 6)).slice(0, 200)}`);
      failures++;
    }
  }
  db.close();
}

console.log(`\nChecked ${checked} output_prediction questions.`);
console.log(failures === 0 ? 'ALL QUIZ FACTS VALID' : `${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
