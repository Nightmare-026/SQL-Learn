'use client';

import type { Database as SqlJsDatabase } from 'sql.js';
import type { Cell, DatasetId, QueryResult } from '@/types/content';

// ============ sql.js engine singleton (spec §4, §8) ============
// sql.js is loaded via dynamic import so the JS wrapper stays OUT of the
// initial page bundle — it is only fetched when a query console first runs.

type SqlJs = { Database: new (data?: ArrayBuffer) => SqlJsDatabase };

let SQL: SqlJs | null = null;
let initPromise: Promise<SqlJs> | null = null;

/** Hard limits — protect the UI thread from pathological user input. */
export const ENGINE_LIMITS = {
  maxQueryChars: 100_000,   // ~100 KB of SQL text per run
  maxStatements: 500,       // statements per script
} as const;

export class EngineError extends Error {
  constructor(message: string, readonly code: 'LOAD_FAILED' | 'TOO_LARGE' | 'SEED_FAILED') {
    super(message);
    this.name = 'EngineError';
  }
}

export async function getSqlJs(): Promise<SqlJs> {
  if (SQL) return SQL;
  if (!initPromise) {
    initPromise = (async () => {
      const { default: initSqlJs } = await import('sql.js');
      const sql = await initSqlJs({ locateFile: (f) => `/sql-wasm/${f}` });
      SQL = sql as unknown as SqlJs;
      return SQL;
    })();
    // Never cache a rejection: allow a retry after a transient WASM failure.
    initPromise.catch(() => { initPromise = null; });
  }
  return initPromise;
}

const seedPromises: Partial<Record<DatasetId, Promise<string>>> = {};

/** Seed SQL text, lazily code-split per dataset. */
async function loadSeed(dataset: DatasetId): Promise<string> {
  if (!seedPromises[dataset]) {
    seedPromises[dataset] = (async () => {
      if (dataset === 'school') {
        const m = await import('@/content/datasets/school');
        return m.SCHOOL_SEED;
      }
      if (dataset === 'ecommerce') {
        const m = await import('@/content/datasets/ecommerce');
        return m.ECOMMERCE_SEED;
      }
      const m = await import('@/content/datasets/advanced');
      return m.ADVANCED_SEED;
    })();
  }
  return seedPromises[dataset]!;
}

/** Create a fresh database seeded with the given dataset. */
export async function createSeededDb(dataset: DatasetId): Promise<SqlJsDatabase> {
  let SqlJsCtor: SqlJs;
  let seed: string;
  try {
    [SqlJsCtor, seed] = await Promise.all([getSqlJs(), loadSeed(dataset)]);
  } catch (e) {
    throw new EngineError(
      e instanceof EngineError ? e.message : `Failed to load the SQL engine (${e instanceof Error ? e.message : String(e)})`,
      'LOAD_FAILED'
    );
  }
  const db = new SqlJsCtor.Database();
  db.exec('PRAGMA foreign_keys = ON;');
  try {
    db.exec(seed);
  } catch (e) {
    db.close();
    console.error(`Seed error for ${dataset}:`, e);
    throw new EngineError(`Dataset "${dataset}" failed to initialize: ${e instanceof Error ? e.message : String(e)}`, 'SEED_FAILED');
  }
  return db;
}

/** Fast snapshot/clone of a database (for isolated validation runs). */
export function cloneDb(db: SqlJsDatabase, SqlJsCtor: SqlJs): SqlJsDatabase {
  return new SqlJsCtor.Database(db.export());
}

// ============ Execution helpers ============

export interface ExecOk {
  ok: true;
  result: QueryResult | null; // null for statements without result sets
  elapsedMs: number;
  mutated: boolean;           // DDL/DML detected
}
export interface ExecFail {
  ok: false;
  error: string;
  elapsedMs: number;
}
export type ExecOutcome = ExecOk | ExecFail;

const MUTATION_RE =
  /^\s*(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|REPLACE|BEGIN|COMMIT|ROLLBACK|VACUUM|ATTACH|DETACH|PRAGMA)\b/i;

/** Recover columns for zero-row SELECTs / PRAGMAs (sql.js exec omits them). */
function tryPrepare(db: SqlJsDatabase, query: string): QueryResult | null {
  const noTrailing = query.trim().replace(/;+\s*$/, '');
  if (!noTrailing || /;/.test(noTrailing)) return null; // single statements only
  let stmt: any = null;
  try {
    stmt = db.prepare(query);
    const columns = (stmt.getColumnNames?.() ?? []) as string[];
    if (!columns.length) return null;
    const rows: Cell[][] = [];
    while (stmt.step()) {
      rows.push((stmt.get() as unknown[]).map(toCell));
    }
    return { columns, rows };
  } catch {
    return null;
  } finally {
    try { stmt?.free?.(); } catch { /* noop */ }
  }
}

export function exec(db: SqlJsDatabase, query: string): ExecOutcome {
  const t0 = performance.now();
  if (query.length > ENGINE_LIMITS.maxQueryChars) {
    return { ok: false, error: `Query too large (${query.length.toLocaleString()} chars > ${ENGINE_LIMITS.maxQueryChars.toLocaleString()} limit)`, elapsedMs: 0 };
  }
  try {
    const stmts = db.exec(query);
    const elapsedMs = performance.now() - t0;
    const mutated = MUTATION_RE.test(query);
    const last = stmts[stmts.length - 1];
    if (last && last.columns && last.columns.length > 0) {
      return {
        ok: true,
        mutated,
        elapsedMs,
        result: { columns: [...last.columns], rows: last.values.map((r) => r.map(toCell)) },
      };
    }
    if (stmts.length === 0) {
      const prepared = tryPrepare(db, query);
      if (prepared) return { ok: true, mutated, elapsedMs, result: prepared };
    }
    return { ok: true, mutated, elapsedMs, result: null };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e), elapsedMs: performance.now() - t0 };
  }
}

/**
 * Split a SQL script into statements safely: respects string literals,
 * comments, parentheses, and BEGIN…END / CASE…END bodies (triggers).
 */
export function splitSql(script: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inStr = false;
  let strCh = '';
  let blockDepth = 0;   // BEGIN/CASE … END
  let parenDepth = 0;
  let i = 0;
  const n = script.length;
  const isIdentChar = (c: string) => /[A-Za-z0-9_]/.test(c);
  while (i < n) {
    const ch = script[i]!;
    const next = script[i + 1];
    // comments
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
      while (j < n && isIdentChar(script[j]!)) j++;
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

export interface ScriptResult {
  /** results of the LAST statement that produced a result set */
  lastResult: QueryResult | null;
  /** the last statement executed (text) */
  lastStatement: string;
  /** per-statement errors (expected-failure scripts may have some) */
  errors: { statement: string; error: string }[];
  /** true if any statement errored */
  hadErrors: boolean;
  elapsedMs: number;
  mutated: boolean;
}

/** Run a multi-statement script, continuing past errors (for DDL practice). */
export function execScript(db: SqlJsDatabase, script: string): ScriptResult {
  const t0 = performance.now();
  if (script.length > ENGINE_LIMITS.maxQueryChars) {
    return { lastResult: null, lastStatement: '', errors: [{ statement: '', error: `Script too large (${script.length.toLocaleString()} chars > limit)` }], hadErrors: true, elapsedMs: 0, mutated: false };
  }
  const statements = splitSql(script);
  if (statements.length > ENGINE_LIMITS.maxStatements) {
    return { lastResult: null, lastStatement: '', errors: [{ statement: '', error: `Too many statements (${statements.length} > ${ENGINE_LIMITS.maxStatements} limit)` }], hadErrors: true, elapsedMs: 0, mutated: false };
  }
  const errors: { statement: string; error: string }[] = [];
  let lastResult: QueryResult | null = null;
  let lastStatement = '';
  let mutated = false;
  for (const st of statements) {
    const out = exec(db, st);
    if (out.ok) {
      mutated = mutated || out.mutated;
      if (out.result) lastResult = out.result;
      lastStatement = st;
    } else {
      errors.push({ statement: st, error: out.error });
      lastStatement = st;
    }
  }
  return { lastResult, lastStatement, errors, hadErrors: errors.length > 0, elapsedMs: performance.now() - t0, mutated };
}

function toCell(v: unknown): Cell {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return v;
  if (typeof v === 'string') return v;
  // sql.js returns Uint8Array for BLOB
  if (v instanceof Uint8Array) return `[blob ${v.length} bytes]`;
  return String(v);
}

// ============ Schema metadata (for SchemaPanel tree) ============

export interface ColumnMeta {
  name: string;
  type: string;
  pk: boolean;
  notNull: boolean;
}
export interface TableMeta {
  name: string;
  columns: ColumnMeta[];
  rowCount: number;
  foreignKeys: { from: string; table: string; to: string }[];
  indexes: { name: string; columns: string[] }[];
}
export interface SchemaMeta {
  tables: TableMeta[];
  views: { name: string; sql: string }[];
}

export function readSchema(db: SqlJsDatabase): SchemaMeta {
  const tables: TableMeta[] = [];
  const views: { name: string; sql: string }[] = [];

  const objects = db.exec(
    `SELECT name, type, sql FROM sqlite_master WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%' ORDER BY name`
  );
  if (objects[0]) {
    for (const row of objects[0].values) {
      const name = String(row[0]);
      const type = String(row[1]);
      if (type === 'view') {
        views.push({ name, sql: String(row[2] ?? '') });
        continue;
      }
      const cols: ColumnMeta[] = [];
      const fks: { from: string; table: string; to: string }[] = [];
      const info = db.exec(`PRAGMA table_info("${name}")`);
      if (info[0]) {
        for (const c of info[0].values) {
          cols.push({
            name: String(c[1]),
            type: String(c[2] ?? ''),
            pk: Number(c[5]) > 0,
            notNull: Number(c[3]) > 0,
          });
        }
      }
      const fkInfo = db.exec(`PRAGMA foreign_key_list("${name}")`);
      if (fkInfo[0]) {
        for (const f of fkInfo[0].values) {
          fks.push({ from: String(f[3]), table: String(f[2]), to: String(f[4]) });
        }
      }
      const idxInfo = db.exec(`PRAGMA index_list("${name}")`);
      const indexes: { name: string; columns: string[] }[] = [];
      if (idxInfo[0]) {
        for (const ix of idxInfo[0].values) {
          const idxName = String(ix[1]);
          const colsList = db.exec(`PRAGMA index_info("${idxName}")`);
          const colNames = colsList[0] ? colsList[0].values.map((r) => String(r[2])) : [];
          if (!idxName.startsWith('sqlite_autoindex')) {
            indexes.push({ name: idxName, columns: colNames });
          }
        }
      }
      const count = db.exec(`SELECT COUNT(*) FROM "${name}"`);
      tables.push({ name, columns: cols, rowCount: Number(count[0]?.values[0]?.[0] ?? 0), foreignKeys: fks, indexes });
    }
  }
  return { tables, views };
}

/** Peek at first N rows of a table (for preview modal). */
export function previewTable(db: SqlJsDatabase, table: string, limit = 50): QueryResult | null {
  const safe = table.replace(/"/g, '""');
  const out = exec(db, `SELECT * FROM "${safe}" LIMIT ${limit}`);
  return out.ok ? out.result : null;
}

// ============ Managed database context ============

/**
 * A managed DB context: fresh seed on creation, supports reset,
 * isolated validation against clones, and mutation-safe task DB.
 */
export class DbContext {
  private db: SqlJsDatabase | null = null;
  private SQL: SqlJs | null = null;
  readonly dataset: DatasetId;

  constructor(dataset: DatasetId) {
    this.dataset = dataset;
  }

  async ensure(): Promise<SqlJsDatabase> {
    if (!this.db) {
      this.SQL = await getSqlJs();
      this.db = await createSeededDb(this.dataset);
    }
    return this.db;
  }

  async reset(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = await createSeededDb(this.dataset);
    }
  }

  /** Execute on the live DB. */
  async run(query: string): Promise<ExecOutcome> {
    const db = await this.ensure();
    return exec(db, query);
  }

  /** Execute on a pristine clone (does not touch live DB state). */
  async runIsolated(query: string): Promise<ExecOutcome> {
    const SQL = await getSqlJs();
    const db = await this.ensure();
    const clone = cloneDb(db, SQL);
    try {
      return exec(clone, query);
    } finally {
      clone.close();
    }
  }

  /**
   * Validate flow (spec §9): run user query on a clone, optionally run verify
   * query, without ever mutating the live task DB. Statement-wise execution
   * tolerates expected errors (FK rejections, RAISE(ABORT) demos) for
   * verify-based (DDL) tasks.
   */
  async runUserAndVerify(userQuery: string, verifyQuery?: string): Promise<{ exec: ExecOutcome; script: ScriptResult; verify: QueryResult | null; verifyError: string | null }> {
    const SQL = await getSqlJs();
    const db = await this.ensure();
    const clone = cloneDb(db, SQL);
    try {
      const statements = splitSql(userQuery);
      const single = statements.length === 1;
      if (single && !verifyQuery) {
        // fast path: plain query execution with full error surfacing
        const out = exec(clone, userQuery);
        return { exec: out, script: { lastResult: out.ok ? out.result : null, lastStatement: userQuery, errors: out.ok ? [] : [{ statement: userQuery, error: out.error }], hadErrors: !out.ok, elapsedMs: out.elapsedMs, mutated: out.ok ? out.mutated : false }, verify: null, verifyError: null };
      }
      const script = execScript(clone, userQuery);
      let verify: QueryResult | null = null;
      let verifyError: string | null = null;
      if (verifyQuery) {
        const v = exec(clone, verifyQuery);
        if (v.ok) verify = v.result;
        else verifyError = v.error;
      }
      return {
        exec: script.hadErrors
          ? { ok: false, error: script.errors[script.errors.length - 1]!.error, elapsedMs: script.elapsedMs }
          : { ok: true, mutated: script.mutated, elapsedMs: script.elapsedMs, result: script.lastResult },
        script,
        verify,
        verifyError,
      };
    } finally {
      clone.close();
    }
  }

  /**
   * Reference result: clone → apply solution (statement-wise, expected errors
   * tolerated) → run verifyQuery (or return the solution's own result set).
   */
  async referenceResult(solution: string, verifyQuery?: string): Promise<QueryResult | null> {
    const SQL = await getSqlJs();
    const db = await this.ensure();
    const clone = cloneDb(db, SQL);
    try {
      const script = execScript(clone, solution);
      if (verifyQuery) {
        const fin = exec(clone, verifyQuery);
        return fin.ok ? fin.result : null;
      }
      return script.lastResult;
    } finally {
      clone.close();
    }
  }

  async schema(): Promise<SchemaMeta> {
    const db = await this.ensure();
    return readSchema(db);
  }

  async peek(table: string, limit = 50): Promise<QueryResult | null> {
    const db = await this.ensure();
    return previewTable(db, table, limit);
  }
}
