/** Validate all project solutions execute. Run: bun scripts/validate-projects.ts */
import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { ALL_PROJECTS } from '../src/content/projects/index';

const SQL = await initSqlJs({
  wasmBinary: fs.readFileSync(path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm')),
} as any);
const load = (p: string) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', p), 'utf8').match(/export const \w+ = (".*");\n/s)![1]);
const SEEDS: Record<string, string> = {
  school: load('src/content/datasets/school.ts'),
  ecommerce: load('src/content/datasets/ecommerce.ts'),
  advanced: load('src/content/datasets/advanced.ts'),
};

let failures = 0;
let checked = 0;
for (const proj of ALL_PROJECTS) {
  const db = new SQL.Database();
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(SEEDS[proj.dataset]);
  for (const task of proj.tasks) {
    checked++;
    try {
      db.exec(task.solution);
      if (task.verifyQuery) {
        const r = db.exec(task.verifyQuery);
        if (!r.length) {
          console.log(`✗ ${proj.id}.${task.id} VERIFY EMPTY`);
          failures++;
        }
      }
    } catch (e: any) {
      console.log(`✗ ${proj.id}.${task.id} ERROR: ${e.message}`);
      failures++;
    }
  }
  db.close();
}
console.log(`\nChecked ${checked} project tasks across ${ALL_PROJECTS.length} projects.`);
console.log(failures === 0 ? 'ALL PROJECT SOLUTIONS VALID' : `${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
