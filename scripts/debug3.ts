// Exact copies from validator
function run(db: any, sql: string): any {
  try {
    const r = db.exec(sql);
    const last = r[r.length - 1];
    if (last && last.columns && last.columns.length) {
      return { ok: true, result: { columns: [...last.columns], rows: last.values.map((v: any[]) => [...v]) } };
    }
    if (r.length === 0) {
      const t = sql.trim().replace(/;+\s*$/, '');
      if (t && !t.includes(';')) {
        const stmt = db.prepare(sql);
        const cols = stmt.getColumnNames();
        if (cols.length) {
          const rows: any[][] = [];
          while (stmt.step()) rows.push([...stmt.getAsArray()]);
          stmt.free();
          return { ok: true, result: { columns: [...cols], rows } };
        }
        stmt.free();
      }
    }
    return { ok: true, result: null };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}
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
    if (!inStr && ch === '-' && next === '-') { const end = script.indexOf('\n', i); const stop = end === -1 ? n : end; cur += script.slice(i, stop); i = stop; continue; }
    if (!inStr && ch === '/' && next === '*') { const end = script.indexOf('*/', i + 2); const stop = end === -1 ? n : end + 2; cur += script.slice(i, stop); i = stop; continue; }
    if (inStr) { cur += ch; if (ch === strCh) inStr = false; i++; continue; }
    if (ch === "'" || ch === '"' || ch === '`') { inStr = true; strCh = ch; cur += ch; i++; continue; }
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
    if (ch === ';' && blockDepth === 0 && parenDepth === 0) { if (cur.trim()) out.push(cur.trim()); cur = ''; i++; continue; }
    cur += ch;
    i++;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
function runScript(db: any, script: string): any {
  const errors: string[] = [];
  let lastResult: any = null;
  for (const st of splitSql(script)) {
    const out = run(db, st);
    if (out.ok) { if (out.result) lastResult = out.result; }
    else errors.push(out.error);
  }
  return { lastResult, errors };
}

const initSqlJs = require('sql.js');
const fs = require('fs');
const SQL = await initSqlJs({ wasmBinary: fs.readFileSync('node_modules/sql.js/dist/sql-wasm.wasm') });
const load = (p: string) => JSON.parse(fs.readFileSync(p, 'utf8').match(/export const \w+ = (".*");\n/s)[1]);
const db = new SQL.Database();
db.exec('PRAGMA foreign_keys = ON;');
db.exec(load('src/content/datasets/advanced.ts'));
const sol = "DROP VIEW IF EXISTS vips;\nCREATE VIEW vips AS SELECT id FROM customers WHERE customer_type = 'vip';\nSELECT COUNT(*) AS c FROM vips;";
const res = runScript(db, sol);
console.log('errors:', res.errors, 'lastResult:', JSON.stringify(res.lastResult).slice(0, 100));
