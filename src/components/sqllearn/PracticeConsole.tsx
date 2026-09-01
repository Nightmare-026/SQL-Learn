'use client';

// ============ 3-Panel Practice Console (spec §8) ============

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Database, Play, RotateCcw, Trash2, Copy, Check, ChevronRight, Lightbulb, SkipForward, PanelLeft, Loader2, AlertTriangle, RotateCw } from 'lucide-react';
import { DbContext, type SchemaMeta, type TableMeta } from '@/lib/sql/engine';
import type { Cell, PracticeTask, QueryResult } from '@/types/content';
import { tokenizeSql } from '@/lib/sql/tokenizer';
import { validateResult, resolveRules } from '@/lib/sql/validator';
import { matchFriendlyError } from '@/lib/sql/errorMatcher';
import { ResultTable } from './SQLDisplay';
import { useT } from '@/lib/i18n/store';
import { useProgressStore } from '@/lib/progress/store';
import { toast } from 'sonner';

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export interface ConsoleTaskDriver {
  tasks: PracticeTask[];
  taskIndex: number;
  setTaskIndex: (i: number) => void;
  onTaskPassed: (taskId: string) => void;
  onTaskSkipped: (taskId: string) => void;
  onHintsUsed: (taskId: string, count: number) => void;
  completedTasks: string[];
  skippedTasks: string[];
  hintsUsed: Record<string, number>;
  datasetLabel: string;
}

type RunState =
  | { kind: 'idle' }
  | { kind: 'running' }
  | { kind: 'result'; result: QueryResult | null; elapsedMs: number; mutated: boolean }
  | { kind: 'error'; error: string }
  | { kind: 'success'; result: QueryResult | null; message: string }
  | { kind: 'wrong'; result: QueryResult | null; expected: QueryResult | null; analysis: string[] }
  | { kind: 'verify-success'; result: QueryResult | null; message: string };

export function PracticeConsole({ dataset, driver, onQueryRun }: { dataset: string; driver: ConsoleTaskDriver; onQueryRun?: () => void }) {
  const t = useT();
  const ctxRef = useRef<DbContext | null>(null);
  const [ready, setReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [schema, setSchema] = useState<SchemaMeta | null>(null);
  const [query, setQuery] = useState('');
  const [runState, setRunState] = useState<RunState>({ kind: 'idle' });
  const [attempts, setAttempts] = useState(0);
  const [hintsOpen, setHintsOpen] = useState(0);
  const [preview, setPreview] = useState<{ table: TableMeta; result: QueryResult | null } | null>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const task = driver.tasks[driver.taskIndex];
  const passedSet = useMemo(() => new Set(driver.completedTasks), [driver.completedTasks]);

  // Init DB per dataset — with error state + retry (never a dead spinner).
  // NOTE: all mount sites remount this component when `dataset` changes
  // (key-remount), so the effect only runs its async init once per instance.
  useEffect(() => {
    let alive = true;
    const ctx = new DbContext(dataset as never);
    ctxRef.current = ctx;
    ctx
      .ensure()
      .then(() => ctx.schema())
      .then((s) => {
        if (!alive) return;
        setSchema(s);
        setReady(true);
      })
      .catch((e: unknown) => {
        if (!alive) return;
        setInitError(e instanceof Error ? e.message : String(e));
      });
    return () => { alive = false; };
  }, [dataset]);

  const retryInit = useCallback(() => {
    const ctx = new DbContext(dataset as never);
    ctxRef.current = ctx;
    setInitError(null);
    setReady(false);
    ctx
      .ensure()
      .then(() => ctx.schema())
      .then((s) => { setSchema(s); setReady(true); })
      .catch((e: unknown) => setInitError(e instanceof Error ? e.message : String(e)));
  }, [dataset]);

  // Seed editor with a starter when task changes
  useEffect(() => {
    if (task && query.trim() === '') setQuery('SELECT * FROM ' + (schema?.tables[0]?.name ?? 'students') + ' LIMIT 5;');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driver.taskIndex, schema]);

  // Reset per-task interaction state when the selected task changes.
  // Render-phase adjustment (React-documented pattern) — avoids an effect.
  const [prevTaskIdx, setPrevTaskIdx] = useState(driver.taskIndex);
  if (prevTaskIdx !== driver.taskIndex) {
    setPrevTaskIdx(driver.taskIndex);
    setHintsOpen(0);
    setAttempts(0);
    setRunState({ kind: 'idle' });
  }

  const handleRun = useCallback(async () => {
    if (!ctxRef.current || !query.trim() || runState.kind === 'running') return;
    const ctx = ctxRef.current;
    setRunState({ kind: 'running' });
    onQueryRun?.();
    try {
      if (!task) {
        // sandbox-style free run
        const out = await ctx.run(query);
        if (out.ok) {
          setRunState({ kind: 'result', result: out.result, elapsedMs: out.elapsedMs, mutated: out.mutated });
          if (out.mutated) { const s = await ctx.schema(); setSchema(s); }
        } else setRunState({ kind: 'error', error: out.error });
        return;
      }
      const { exec, script, verify } = await ctx.runUserAndVerify(query, task.verifyQuery);
      setAttempts((a) => a + 1);
      if (task.verifyQuery) {
        // verify-based (DDL) task: compare verify results against reference
        if (verify) {
          const expected = await ctx.referenceResult(task.solution, task.verifyQuery);
          const outcome = validateResult(verify, expected, task.validation);
          if (outcome.matched) {
            setRunState({ kind: 'verify-success', result: verify, message: t('console.correct') });
            driver.onTaskPassed(task.id);
            return;
          }
        }
        // not matched or verify failed
        const execErr = script.errors.length ? script.errors[script.errors.length - 1] : null;
        if (execErr) {
          setRunState({ kind: 'error', error: execErr.error });
          if (verify) {
            const expected = await ctx.referenceResult(task.solution, task.verifyQuery);
            const outcome = validateResult(verify, expected, task.validation);
            if (outcome.matched) {
              setRunState({ kind: 'verify-success', result: verify, message: t('console.correct') });
              driver.onTaskPassed(task.id);
            }
          }
        } else if (verify) {
          const expected = await ctx.referenceResult(task.solution, task.verifyQuery);
          const outcome = validateResult(verify, expected, task.validation);
          setRunState({ kind: 'wrong', result: verify, expected, analysis: outcome.diff?.analysis ?? [] });
        } else {
          setRunState({ kind: 'result', result: script.lastResult, elapsedMs: script.elapsedMs, mutated: script.mutated });
        }
        return;
      }
      if (!exec.ok) {
        setRunState({ kind: 'error', error: exec.error });
        return;
      }
      const expected = await ctx.referenceResult(task.solution, undefined);
      const outcome = validateResult(exec.result, expected, task.validation);
      if (outcome.matched) {
        setRunState({ kind: 'success', result: exec.result, message: t('console.correct') });
        driver.onTaskPassed(task.id);
      } else if (exec.result === null && !script.lastResult) {
        setRunState({ kind: 'result', result: null, elapsedMs: script.elapsedMs, mutated: script.mutated });
      } else {
        setRunState({ kind: 'wrong', result: exec.result, expected, analysis: outcome.diff?.analysis ?? [] });
      }
    } catch (e) {
      setRunState({ kind: 'error', error: e instanceof Error ? e.message : String(e) });
    }
  }, [query, runState.kind, task, ctxRef, driver, t, onQueryRun, schema]);

  // Ctrl+Enter
  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
  };

  // sync scroll
  const onScroll = () => {
    if (textRef.current && preRef.current) {
      preRef.current.scrollTop = textRef.current.scrollTop;
      preRef.current.scrollLeft = textRef.current.scrollLeft;
    }
  };

  const hlHtml = useMemo(() => {
    const tokens = tokenizeSql(query + '\n');
    return tokens
      .map((tk) => (tk.cls ? `<span class="${tk.cls}">${escapeHtml(tk.text)}</span>` : escapeHtml(tk.text)))
      .join('');
  }, [query]);

  if (initError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-danger-50 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-danger-600" />
        </div>
        <p className="text-sm font-bold text-danger-700">{t('error.dbLoad.title')}</p>
        <p className="text-xs text-neutral-500 max-w-md leading-relaxed">{t('error.dbLoad.desc')}</p>
        <p className="text-[11px] text-neutral-400 max-w-md break-words">{initError}</p>
        <button
          onClick={retryInit}
          className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
        >
          <RotateCw className="w-3.5 h-3.5" /> {t('common.retry')}
        </button>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-neutral-500">
        <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
        <p className="text-sm">{t('common.loadingDb')}</p>
      </div>
    );
  }

  const passCount = driver.completedTasks.length;
  const needCount = Math.min(3, driver.tasks.length);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-neutral-200 bg-white/70 backdrop-blur rounded-t-2xl">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-semibold text-neutral-800 truncate">
            {t('console.task')} {driver.taskIndex + 1}/{driver.tasks.length}
          </span>
          <DifficultyStars n={task ? diffToStars(task.difficulty) : 0} />
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span className="hidden md:inline">{t('console.dataset')}: <b className="text-neutral-700">{driver.datasetLabel}</b></span>
          <span className="hidden lg:inline text-neutral-300">|</span>
          <span className="hidden lg:inline">{t('console.ctrlEnter')}</span>
        </div>
      </div>

      {/* ===== 3-panel grid ===== */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[230px_1fr_minmax(300px,37%)] xl:grid-cols-[240px_1fr_minmax(340px,37%)]">
        {/* Schema panel */}
        <div className="hidden lg:flex flex-col min-h-0 border-r border-neutral-200 bg-white">
          <SchemaPanel schema={schema} onPreview={async (tbl) => {
            const r = await ctxRef.current?.peek(tbl.name);
            setPreview({ table: tbl, result: r ?? null });
          }} />
        </div>

        {/* Editor */}
        <div className="flex flex-col min-h-0 border-r border-neutral-200 bg-white">
          <div className="editor-stack flex-1 min-h-[160px] relative">
            <pre ref={preRef} aria-hidden className="absolute inset-0 p-4 overflow-hidden whitespace-pre-wrap break-words sql-code pointer-events-none" dangerouslySetInnerHTML={{ __html: hlHtml }} />
            <textarea
              ref={textRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              onScroll={onScroll}
              spellCheck={false}
              className="absolute inset-0 p-4 w-full h-full bg-transparent outline-none resize-none sql-code overflow-auto custom-scroll"
              placeholder="-- SQL likho... Ctrl+Enter to run"
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-2 border-t border-neutral-200 bg-neutral-50/60">
            <button
              onClick={handleRun}
              disabled={runState.kind === 'running' || !query.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 active:translate-y-px disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <Play className="w-3.5 h-3.5" /> {t('console.run')}
            </button>
            <button onClick={() => setQuery('')} className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-xs text-neutral-700 hover:border-neutral-400 transition" title={t('console.clear')}>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard?.writeText(query);
                  toast.success(t('console.copied'));
                } catch {
                  toast.error(t('common.copyFail'));
                }
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-xs text-neutral-700 hover:border-neutral-400 transition"
              title={t('console.copy')}
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <div className="ml-auto text-xs text-neutral-500">
              {runState.kind === 'result' && runState.result && `${runState.result.rows.length} ${t('console.rows')} · ${runState.elapsedMs.toFixed(1)}ms`}
              {runState.kind === 'result' && !runState.result && t('console.noResults')}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col min-h-0 bg-white overflow-hidden">
          <ResultsPanel runState={runState} task={task} onFix={() => textRef.current?.focus()} />
        </div>
      </div>

      {/* ===== Task bar ===== */}
      {task && (
        <div className="border-t border-neutral-200 bg-neutral-50 rounded-b-2xl">
          <div className="px-4 py-3 border-b border-neutral-200">
            <p className="text-sm text-neutral-800 leading-relaxed">
              <b className="text-brand-700">{t('console.task')} {driver.taskIndex + 1}:</b>{' '}
              <LocalizedTaskDesc task={task} />
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5">
            {task.hints.slice(0, hintsOpen).map((h, i) => (
              <HintPill key={i} level={i + 1} type={h.type} content={h.content} />
            ))}
            {hintsOpen < task.hints.length && (
              <button
                onClick={() => {
                  const next = Math.min(task.hints.length, hintsOpen + 1);
                  setHintsOpen(next);
                  driver.onHintsUsed(task.id, next);
                }}
                className="inline-flex items-center gap-1 rounded-full border border-warning-500 bg-warning-50 px-3 py-1 text-xs font-semibold text-warning-700 hover:bg-warning-100 transition"
              >
                <Lightbulb className="w-3 h-3" /> {t('console.showHint')} {hintsOpen + 1}
              </button>
            )}
            {!passedSet.has(task.id) && hintsOpen >= task.hints.length && (
              <button
                onClick={() => { driver.onTaskSkipped(task.id); }}
                className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs text-neutral-600 hover:border-neutral-400 transition"
              >
                <SkipForward className="w-3 h-3" /> {t('console.skip')}
              </button>
            )}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-neutral-500">{t('console.attempts')}: {attempts}</span>
              <TaskDots tasks={driver.tasks} completed={driver.completedTasks} skipped={driver.skippedTasks} current={driver.taskIndex} onSelect={driver.setTaskIndex} />
            </div>
          </div>
          <div className="px-4 pb-2.5 text-xs text-neutral-500">
            {t('console.need')} {needCount}/{driver.tasks.length} · {t('console.toComplete')}
          </div>
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50" onClick={() => setPreview(null)}>
          <div className="w-full max-w-3xl max-h-[80vh] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
              <h3 className="font-heading font-bold text-neutral-800">{preview.table.name} <span className="text-xs font-normal text-neutral-500">({preview.table.rowCount} rows)</span></h3>
              <button onClick={() => setPreview(null)} className="text-neutral-400 hover:text-neutral-700"><PanelLeft className="w-4 h-4" /></button>
            </div>
            <div className="p-4 overflow-auto custom-scroll">
              <ResultTable columns={preview.result?.columns ?? []} rows={preview.result?.rows ?? []} maxRows={50} compact />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LocalizedTaskDesc({ task }: { task: PracticeTask }) {
  return <TaskDescI18n task={task} />;
}

function TaskDescI18n({ task }: { task: PracticeTask }) {
  const lang = useProgressStore((s) => s.language);
  return <>{task.description[lang]}</>;
}

function diffToStars(d: string): number {
  return { very_easy: 1, easy: 2, medium: 3, hard: 4, very_hard: 5 }[d] ?? 1;
}

function DifficultyStars({ n }: { n: number }) {
  return (
    <span className="text-warning-500 text-[10px] leading-none" aria-label={`difficulty ${n}/5`}>
      {Array.from({ length: 5 }, (_, i) => (i < n ? '★' : '☆')).join('')}
    </span>
  );
}

function SchemaPanel({ schema, onPreview }: { schema: SchemaMeta | null; onPreview: (t: TableMeta) => void }) {
  const t = useT();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  if (!schema) return null;
  return (
    <div className="flex flex-col min-h-0">
      <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-neutral-500 border-b border-neutral-100">
        {t('console.schema')} · {schema.tables.length} tables
      </div>
      <div className="flex-1 overflow-y-auto custom-scroll py-1">
        {schema.tables.map((tbl) => (
          <div key={tbl.name} className="select-none">
            <button
              onClick={() => setOpen((o) => ({ ...o, [tbl.name]: !o[tbl.name] }))}
              onDoubleClick={() => onPreview(tbl)}
              className="w-full flex items-center gap-1.5 px-3 py-1.5 text-left hover:bg-brand-50/60 transition group"
            >
              <ChevronRight className={`w-3 h-3 text-neutral-400 transition-transform ${open[tbl.name] ? 'rotate-90' : ''}`} />
              <span className="text-xs font-semibold text-neutral-700 sql-code">{tbl.name}</span>
              <span className="ml-auto text-[10px] text-neutral-400">{tbl.rowCount}</span>
            </button>
            <button onClick={() => onPreview(tbl)} className="block w-full text-left px-3 py-0.5 text-[10px] text-brand-600 hover:text-brand-700 opacity-0 group-hover:opacity-100 hidden">
              preview
            </button>
            {open[tbl.name] && (
              <div className="pb-1">
                {tbl.columns.map((c) => (
                  <div key={c.name} className="flex items-center gap-1.5 pl-8 pr-3 py-0.5 text-[11px] text-neutral-600 sql-code">
                    {c.pk && <span className="text-amber-500" title="primary key">🔑</span>}
                    <span className={c.pk ? 'font-bold' : ''}>{c.name}</span>
                    <span className="ml-auto text-neutral-400 text-[9px]">{c.type}</span>
                  </div>
                ))}
                {tbl.foreignKeys.map((f, i) => (
                  <div key={i} className="pl-8 pr-3 py-0.5 text-[10px] text-green-700 sql-code">
                    → {f.table}.{f.to}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {schema.views.length > 0 && (
          <>
            <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wide text-neutral-400">views</div>
            {schema.views.map((v) => (
              <div key={v.name} className="px-3 py-1 text-xs text-neutral-600 sql-code">▸ {v.name}</div>
            ))}
          </>
        )}
      </div>
      <div className="px-3 py-2 text-[10px] text-neutral-400 border-t border-neutral-100">click = expand · double-click = preview</div>
    </div>
  );
}

function ResultsPanel({ runState, task, onFix }: { runState: RunState; task: PracticeTask | undefined; onFix: () => void }) {
  const t = useT();
  if (runState.kind === 'idle') {
    return <Centered><p className="text-sm text-neutral-500">{t('console.empty')}</p></Centered>;
  }
  if (runState.kind === 'running') {
    return <Centered><Loader2 className="w-5 h-5 animate-spin text-brand-500 mb-2" /><p className="text-sm text-neutral-500">…</p></Centered>;
  }
  if (runState.kind === 'error') {
    const friendly = matchFriendlyError(runState.error);
    const lang = useProgressStore.getState().language;
    return (
      <div className="p-4 overflow-y-auto custom-scroll">
        <div className="rounded-xl border border-danger-200 bg-danger-50 p-4">
          <div className="font-bold text-danger-700 mb-1">❌ {t('console.error')}</div>
          {friendly && (
            <div className="mb-2">
              <p className="text-sm text-danger-900/90 leading-relaxed">{friendly.title[lang]}</p>
              {friendly.suggestion && (
                <p className="text-xs text-danger-800/80 leading-relaxed mt-1.5 flex gap-1.5">
                  <span className="shrink-0 font-bold">💡</span>
                  <span>{friendly.suggestion[lang]}</span>
                </p>
              )}
            </div>
          )}
          <div className="mt-2 pt-2 border-t border-danger-200">
            <div className="text-[10px] font-bold uppercase text-danger-600 mb-1">{t('console.technical')}</div>
            <code className="text-xs text-danger-800 sql-code break-words">{runState.error}</code>
          </div>
          <button onClick={onFix} className="mt-3 rounded-lg border border-danger-300 bg-white px-3 py-1 text-xs font-semibold text-danger-700 hover:bg-danger-100 transition">✏ {t('console.fixEditor')}</button>
        </div>
      </div>
    );
  }
  if (runState.kind === 'success' || runState.kind === 'verify-success') {
    return (
      <div className="flex flex-col min-h-0 h-full">
        <div className="m-4 rounded-xl border border-success-200 bg-success-50 p-3 flex items-center gap-2">
          <Check className="w-5 h-5 text-success-600" />
          <span className="font-semibold text-success-700">{runState.message}</span>
        </div>
        {runState.result && (
          <div className="px-4 pb-4 overflow-auto custom-scroll min-h-0 flex-1">
            <ResultTable columns={runState.result.columns} rows={runState.result.rows} />
          </div>
        )}
      </div>
    );
  }
  if (runState.kind === 'result') {
    return (
      <div className="flex flex-col min-h-0 h-full">
        {runState.result ? (
          <div className="p-4 overflow-auto custom-scroll min-h-0 flex-1">
            <ResultTable columns={runState.result.columns} rows={runState.result.rows} />
          </div>
        ) : (
          <Centered><p className="text-sm text-neutral-500">{t('console.noResults')}</p></Centered>
        )}
      </div>
    );
  }
  // wrong
  return (
    <div className="flex flex-col min-h-0 h-full overflow-y-auto custom-scroll">
      <div className="m-4 rounded-xl border border-danger-200 bg-danger-50 p-4">
        <div className="font-bold text-danger-700 mb-1">❌ {t('console.wrong')}</div>
        {runState.analysis.length > 0 && (
          <ul className="text-xs text-danger-900/80 list-disc list-inside space-y-0.5">
            {runState.analysis.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        )}
      </div>
      {runState.expected && (
        <>
          <div className="px-4 pb-2 text-[10px] font-bold uppercase tracking-wide text-neutral-500">{t('console.expected')}</div>
          <div className="px-4"><ResultTable columns={runState.expected.columns} rows={runState.expected.rows} maxRows={12} compact /></div>
        </>
      )}
      {runState.result && (
        <>
          <div className="px-4 pt-4 pb-2 text-[10px] font-bold uppercase tracking-wide text-neutral-500">{t('console.yourOutput')}</div>
          <div className="px-4 pb-4"><ResultTable columns={runState.result.columns} rows={runState.result.rows} maxRows={12} compact /></div>
        </>
      )}
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 flex items-center justify-center p-6 text-center">{children}</div>;
}

function HintPill({ level, type, content }: { level: number; type: string; content: { en: string; hi: string } }) {
  const lang = useProgressStore((s) => s.language);
  const t = useT();
  // Parent controls which levels are revealed; this pill always shows its
  // content once rendered (previously an internal `open=false` state made
  // every hint invisible — a regression that hid ALL hints).
  return (
    <div className="flex items-start gap-2 rounded-lg border border-warning-200 bg-warning-50 px-3 py-1.5 max-w-full">
      <span className="text-[10px] font-bold uppercase text-warning-700 mt-0.5 shrink-0">{t('console.hint')} {level}</span>
      <div className="text-xs text-neutral-800 leading-relaxed break-words">
        {content[lang]}
        {type === 'structure' || type === 'partial' ? (
          <code className="block mt-1 rounded bg-neutral-900 text-neutral-100 px-2 py-1 sql-code text-[11px] whitespace-pre-wrap break-words">{content[lang]}</code>
        ) : null}
      </div>
    </div>
  );
}

function TaskDots({ tasks, completed, skipped, current, onSelect }: { tasks: PracticeTask[]; completed: string[]; skipped: string[]; current: number; onSelect: (i: number) => void }) {
  const done = new Set(completed);
  const skip = new Set(skipped);
  return (
    <div className="flex items-center gap-1">
      {tasks.map((task, i) => (
        <button
          key={task.id}
          onClick={() => onSelect(i)}
          title={task.id}
          className={`w-6 h-6 rounded-md text-[10px] font-bold flex items-center justify-center transition ${
            i === current
              ? 'bg-brand-600 text-white ring-2 ring-brand-200'
              : done.has(task.id)
                ? 'bg-success-100 text-success-700 border border-success-500'
                : skip.has(task.id)
                  ? 'bg-neutral-100 text-neutral-400 border border-neutral-300'
                  : 'bg-white text-neutral-400 border border-neutral-200 hover:border-neutral-400'
          }`}
        >
          {done.has(task.id) ? '✓' : skip.has(task.id) ? '»' : i + 1}
        </button>
      ))}
    </div>
  );
}
