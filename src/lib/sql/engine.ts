'use client';

import initSqlJs, { type Database as SqlJsDatabase } from 'sql.js';
import type { Cell, DatasetId, QueryResult } from '@/types/content';

// ============ sql.js engine singleton (spec §4, §8) ============

let SQL: Awaited<ReturnType<typeof initSqlJs>> | null = null;
let initPromise: Promise<Awaited<ReturnType<typeof initSqlJs>>> | null = null;

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

export async function getSqlJs() {
  if (SQL) return SQL;
  if (!initPromise) {
    initPromise = initSqlJs({ locateFile: (f) => `/sql-wasm/${f}` }).then((sql) => {
      SQL = sql;
      return sql;
    });
  }
  return initPromise;
}

/** Create a fresh database seeded with the given dataset. */
export async function createSeededDb(dataset: DatasetId): Promise<SqlJsDatabase> {
  const [SQL, seed] = await Promise.all([getSqlJs(), loadSeed(dataset)]);
  const db = new SQL.Database();
  db.exec('PRAGMA foreign_keys = ON;');
  try {
    db.exec(seed);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`Seed error for ${dataset}:`, e);
    throw e;
  }
  return db;
}

/** Fast snapshot/clone of a database (for isolated validation runs). */
export function cloneDb(db: SqlJsDatabase, SqlJsCtor: Awaited<ReturnType<typeof initSqlJs>>): SqlJsDatabase {
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

export function exec(db: SqlJsDatabase, query: string): ExecOutcome {
  const t0 = performance.now();
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
    return { ok: true, mutated, elapsedMs, result: null };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e), elapsedMs: performance.now() - t0 };
  }
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
  private SQL: Awaited<ReturnType<typeof initSqlJs>> | null = null;
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
   * query, without ever mutating the live task DB.
   */
  async runUserAndVerify(userQuery: string, verifyQuery?: string): Promise<{ exec: ExecOutcome; verify: ExecOutcome | null }> {
    const SQL = await getSqlJs();
    const db = await this.ensure();
    const clone = cloneDb(db, SQL);
    try {
      const out = exec(clone, userQuery);
      let verify: ExecOutcome | null = null;
      if (out.ok && verifyQuery) {
        verify = exec(clone, verifyQuery);
      }
      return { exec: out, verify };
    } finally {
      clone.close();
    }
  }

  /**
   * Reference result: clone → apply solution → (run verifyQuery or solution).
   */
  async referenceResult(solution: string, verifyQuery?: string): Promise<QueryResult | null> {
    const SQL = await getSqlJs();
    const db = await this.ensure();
    const clone = cloneDb(db, SQL);
    try {
      const sol = exec(clone, solution);
      if (!sol.ok) return null;
      const finalQuery = verifyQuery ?? solution;
      const fin = exec(clone, finalQuery);
      if (!fin.ok) return null;
      return fin.result;
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
