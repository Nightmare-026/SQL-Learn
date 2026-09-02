'use client';

// ============ Shared SQL display components ============

import React, { useMemo } from 'react';
import { tokenizeSql } from '@/lib/sql/tokenizer';

/** Syntax-highlighted SQL block with line numbers. */
export function SQLCode({ code, className = '' }: { code: string; className?: string }) {
  const html = useMemo(() => {
    const tokens = tokenizeSql(code);
    return tokens
      .map((t) => (t.cls ? `<span class="${t.cls}">${escapeHtml(t.text)}</span>` : escapeHtml(t.text)))
      .join('');
  }, [code]);
  const lineCount = code.split('\n').length;
  return (
    <div className={`relative rounded-lg border bg-neutral-900 sql-dark overflow-x-auto custom-scroll ${className}`}>
      <div className="flex min-w-0">
        <div className="select-none py-3 pl-3 pr-2 text-right text-neutral-600 text-[11px] leading-[1.6] sql-code">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre className="py-3 pl-3 pr-4 flex-1 min-w-0 sql-code whitespace-pre" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Compact SQL chip (syntax highlighted, no line numbers). */
export function SQLChip({ code }: { code: string }) {
  const html = useMemo(() => {
    const tokens = tokenizeSql(code);
    return tokens
      .map((t) => (t.cls ? `<span class="${t.cls}">${escapeHtml(t.text)}</span>` : escapeHtml(t.text)))
      .join('');
  }, [code]);
  return (
    <code
      className="block rounded-md bg-neutral-900 sql-dark px-3 py-2 sql-code whitespace-pre-wrap break-words custom-scroll"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** Result table renderer with NULL display. */
export function ResultTable({
  columns,
  rows,
  maxRows = 200,
  highlightRows,
  fadeRows,
  compact = false,
}: {
  columns: string[];
  rows: (string | number | null)[][];
  maxRows?: number;
  highlightRows?: Set<number>;
  fadeRows?: Set<number>;
  compact?: boolean;
}) {
  if (!columns.length && !rows.length) {
    return <div className="text-neutral-500 text-sm p-3">—</div>;
  }
  const shown = rows.slice(0, maxRows);
  const cell = (v: string | number | null) => {
    if (v === null || v === undefined) return <span className="italic text-danger-500">NULL</span>;
    if (typeof v === 'number') return formatNumber(v);
    return String(v) === '' ? <span className="text-neutral-400">(&apos;&apos;)</span> : String(v);
  };
  return (
    <div className="overflow-auto custom-scroll rounded-lg border border-neutral-200 bg-white">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-neutral-100 border-b border-neutral-200">
            {columns.map((c, i) => (
              <th
                key={i}
                className={`font-semibold text-neutral-700 ${compact ? 'px-2 py-1.5 text-[11px]' : 'px-3 py-2 text-xs'} whitespace-nowrap sql-code`}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shown.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-3 py-3 text-neutral-500 text-sm italic">
                (0 rows)
              </td>
            </tr>
          )}
          {shown.map((row, ri) => (
            <tr
              key={ri}
              className={`border-b border-neutral-100 last:border-0 ${
                highlightRows?.has(ri) ? 'table-row-highlight' : fadeRows?.has(ri) ? 'table-row-faded' : 'odd:bg-white even:bg-neutral-50/60'
              }`}
            >
              {row.map((v, ci) => (
                <td key={ci} className={`${compact ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'} whitespace-nowrap sql-code max-w-[260px] truncate`}>
                  {cell(v)}
                </td>
              ))}
            </tr>
          ))}
          {rows.length > maxRows && (
            <tr>
              <td colSpan={columns.length} className="px-3 py-2 text-xs text-neutral-500 italic">
                … {rows.length - maxRows} more rows
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function formatNumber(n: number) {
  if (Number.isInteger(n)) return String(n);
  return String(Math.round(n * 1e6) / 1e6);
}
