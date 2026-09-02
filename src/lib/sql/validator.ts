'use client';

// ============ Result validation engine (spec §9) ============

import { DEFAULT_RULES } from '@/types/content';
import type { Cell, DiffInfo, QueryResult, ValidationRules } from '@/types/content';

export function resolveRules(partial: Partial<ValidationRules> | undefined): ValidationRules {
  return { ...DEFAULT_RULES, ...(partial ?? {}) };
}

// ---------- Normalization ----------

function normalizeCell(cell: Cell, rules: ValidationRules): Cell {
  if (cell === null || cell === undefined) return null;
  if (typeof cell === 'string') {
    let s = cell;
    if (rules.trimWhitespace) s = s.trim();
    if (!rules.caseSensitiveData) s = s.toLowerCase();
    return s;
  }
  // numbers: round to tolerance buckets
  const t = rules.numericTolerance;
  return Math.round(cell / t) * t;
}

function normalizeRows(rows: Cell[][], rules: ValidationRules): Cell[][] {
  return rows.map((r) => r.map((c) => normalizeCell(c, rules)));
}

function rowKey(row: Cell[]): string {
  return row.map((c) => (c === null ? '\u0000' : String(c))).join('\u0001');
}

// ---------- Column comparison ----------

export function columnsMatch(userCols: string[], expectedCols: string[], rules: ValidationRules): boolean {
  if (userCols.length !== expectedCols.length) return false;
  if (!rules.checkColumnNames) return true;
  if (rules.ignoreColumnOrder) {
    const a = [...userCols].map((c) => c.toLowerCase().trim()).sort();
    const b = [...expectedCols].map((c) => c.toLowerCase().trim()).sort();
    return a.every((v, i) => v === b[i]);
  }
  return userCols.every((c, i) => c.toLowerCase().trim() === expectedCols[i].toLowerCase().trim());
}

// ---------- Row comparison ----------

function sortRows(rows: Cell[][]): Cell[][] {
  return [...rows].sort((a, b) => rowKey(a).localeCompare(rowKey(b)));
}

export function rowsMatch(userRows: Cell[][], expectedRows: Cell[][], rules: ValidationRules): boolean {
  const u = normalizeRows(userRows, rules);
  const e = normalizeRows(expectedRows, rules);
  if (u.length !== e.length) return false;
  if (u.length === 0) return true;
  if (rules.ignoreRowOrder) {
    const us = sortRows(u);
    const es = sortRows(e);
    return us.every((row, i) => rowKey(row) === rowKey(es[i]));
  }
  return u.every((row, i) => rowKey(row) === rowKey(e[i]));
}

// ---------- Diff generation (spec §9.4) ----------

export function buildDiff(user: QueryResult | null, expected: QueryResult | null): DiffInfo | undefined {
  if (!expected) return undefined;
  const got = user ?? { columns: [], rows: [] };
  const analysis: string[] = [];

  if (got.columns.length !== expected.columns.length) {
    analysis.push(
      `Column count: expected ${expected.columns.length}, got ${got.columns.length}`
    );
  }
  if (got.rows.length !== expected.rows.length) {
    const diff = got.rows.length - expected.rows.length;
    analysis.push(
      `Row count: expected ${expected.rows.length}, got ${got.rows.length} (${diff > 0 ? 'extra' : 'missing'} ${Math.abs(diff)} row${Math.abs(diff) === 1 ? '' : 's'})`
    );
  }
  if (analysis.length === 0 && got.rows.length > 0) {
    analysis.push('Row values or order differ — compare the tables below');
  }

  return {
    expectedColumns: expected.columns,
    gotColumns: got.columns,
    expectedRows: expected.rows,
    gotRows: got.rows,
    analysis,
  };
}

// ---------- Full validation ----------

export interface ValidationOutcome {
  matched: boolean;
  reason: 'columns' | 'rows' | 'empty' | 'no-result' | null;
  diff?: DiffInfo;
}

export function validateResult(
  userResult: QueryResult | null,
  expectedResult: QueryResult | null,
  partialRules?: Partial<ValidationRules>
): ValidationOutcome {
  const rules = resolveRules(partialRules);
  if (!expectedResult || expectedResult.rows.length === 0) {
    // Expected empty result: user must also produce zero rows
    const matched = !!userResult && userResult.rows.length === 0;
    return {
      matched,
      reason: matched ? null : 'empty',
      diff: matched ? undefined : buildDiff(userResult, expectedResult),
    };
  }
  if (!userResult) {
    return { matched: false, reason: 'no-result', diff: buildDiff(null, expectedResult) };
  }
  if (!columnsMatch(userResult.columns, expectedResult.columns, rules)) {
    return { matched: false, reason: 'columns', diff: buildDiff(userResult, expectedResult) };
  }
  if (!rowsMatch(userResult.rows, expectedResult.rows, rules)) {
    return { matched: false, reason: 'rows', diff: buildDiff(userResult, expectedResult) };
  }
  return { matched: true, reason: null };
}
