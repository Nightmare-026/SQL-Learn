'use client';

// ============ Animated Tutorial (spec §24: typing + row highlighting + controls) ============
// Player shows ONLY steps that have code (real animation); narrative intro/outro
// steps render as lead-in/outro cards. While the query types, the live source
// table highlights matching rows (highlightWhere evaluated by the real engine —
// zero content mistakes); steps with run:true execute and reveal the result.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, Clapperboard, Lightbulb, CheckCircle2, Zap, Table2 } from 'lucide-react';
import type { Module, TutorialStep } from '@/types/content';
import { tokenizeSql } from '@/lib/sql/tokenizer';
import { DbContext } from '@/lib/sql/engine';
import { ResultTable } from './SQLDisplay';
import { useLang, useT } from '@/lib/i18n/store';

const SPEEDS = [1, 1.5, 2] as const;
const DISPLAY_ROWS = 10;

type SourceData = {
  table: string;
  columns: string[];        // without rowid
  rows: (string | number | null)[][]; // display rows (first cell = rowid)
  matchedIds: Set<number> | null;      // null = highlight all (table scan)
  matchedCount: number;
  total: number;
};

export function AnimatedTutorial({ module }: { module: Module }) {
  const lang = useLang();
  const { intro, outro, animSteps } = useMemo(() => {
    const steps = module.tutorial.steps;
    const hasCode = steps.map((s) => s.code != null);
    const first = hasCode.indexOf(true);
    const last = hasCode.lastIndexOf(true);
    return {
      intro: first > 0 ? steps.slice(0, first) : [],
      outro: last >= 0 && last < steps.length - 1 ? steps.slice(last + 1) : [],
      animSteps: steps.filter((s) => s.code != null),
    };
  }, [module]);

  if (animSteps.length === 0) return null; // player only where animation exists

  return (
    <div className="space-y-4">
      {intro.map((s, i) => (
        <p key={i} className="rounded-xl bg-brand-50/50 border border-brand-100 px-4 py-3 text-sm text-neutral-700 leading-relaxed">
          <span className="text-brand-500 mr-1">✦</span>{s.explanation[lang]}
        </p>
      ))}
      <TutorialPlayer module={module} steps={animSteps} />
      {outro.map((s, i) => (
        <p key={i} className="rounded-xl bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm text-neutral-700 leading-relaxed">
          <span className="text-neutral-400 mr-1">✓</span>{s.explanation[lang]}
        </p>
      ))}
    </div>
  );
}

function TutorialPlayer({ module, steps }: { module: Module; steps: TutorialStep[] }) {
  const t = useT();
  const lang = useLang();
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [typedChars, setTypedChars] = useState(0);
  const [speedIdx, setSpeedIdx] = useState(0);
  const [source, setSource] = useState<SourceData | null>(null);
  const [tableError, setTableError] = useState(false);
  const [runResult, setRunResult] = useState<{ columns: string[]; rows: (string | number | null)[][] } | null>(null);
  const ctxRef = useRef<DbContext | null>(null);
  const cacheRef = useRef<Map<string, SourceData>>(new Map());
  const advanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const step = steps[stepIdx];
  const fullCode = step?.code ?? '';
  const speed = SPEEDS[speedIdx];
  const charsPerTick = Math.max(2, Math.round(3 * speed));
  const typedPct = fullCode ? Math.round((typedChars / fullCode.length) * 100) : 0;

  // Row-highlight trigger: when typing reaches the WHERE/ON/HAVING/GROUP BY clause
  const triggerIdx = useMemo(() => {
    const m = fullCode.toUpperCase().match(/\b(WHERE|HAVING|GROUP\s+BY|ON)\b/);
    return m ? m.index : fullCode.length;
  }, [fullCode]);
  const rowsActive = typedChars >= triggerIdx;

  const clearTimers = () => {
    if (advanceRef.current) clearTimeout(advanceRef.current);
    advanceRef.current = null;
    if (typeTimerRef.current) clearTimeout(typeTimerRef.current);
    typeTimerRef.current = null;
  };

  const resetStep = useCallback((idx: number, autoplay = false) => {
    clearTimers();
    setStepIdx(idx);
    setTypedChars(0);
    setRunResult(null);
    setPlaying(autoplay);
  }, []);

  // Load the source table (highlight set evaluated by the real engine).
  const loadTable = useCallback(async (tbl: { name: string; highlightWhere?: string; fadeOthers?: boolean } | undefined) => {
    if (!tbl?.name) { setSource(null); return; }
    const key = `${tbl.name}|${tbl.highlightWhere ?? ''}`;
    const cached = cacheRef.current.get(key);
    if (cached) { setSource(cached); return; }
    try {
      if (!ctxRef.current) {
        ctxRef.current = new DbContext(module.dataset);
        await ctxRef.current.ensure();
      }
      const ctx = ctxRef.current;
      const disp = await ctx.run(`SELECT rowid, * FROM ${tbl.name} LIMIT ${DISPLAY_ROWS}`);
      if (!disp.ok || !disp.result) throw new Error('table fetch failed');
      const totalOut = await ctx.run(`SELECT COUNT(*) AS _c FROM ${tbl.name}`);
      const total = Number(totalOut.ok ? totalOut.result?.rows?.[0]?.[0] ?? 0 : 0);
      let matchedIds: Set<number> | null = null;
      let matchedCount = total;
      if (tbl.highlightWhere) {
        const mOut = await ctx.run(`SELECT rowid FROM ${tbl.name} WHERE ${tbl.highlightWhere}`);
        if (mOut.ok && mOut.result) {
          matchedIds = new Set(mOut.result.rows.map((r) => Number(r[0])));
          matchedCount = matchedIds.size;
        }
      } else {
        // no condition → whole-table scan: highlight every displayed row
        matchedIds = new Set(disp.result.rows.map((r) => Number(r[0])));
        matchedCount = total;
      }
      const data: SourceData = {
        table: tbl.name,
        columns: disp.result.columns.slice(1),
        rows: disp.result.rows,
        matchedIds,
        matchedCount,
        total,
      };
      cacheRef.current.set(key, data);
      setSource(data);
      setTableError(false);
    } catch {
      // Engine unavailable — code typing still works, table pane degrades gracefully.
      setTableError(true);
      setSource(null);
    }
  }, [module.dataset]);

  // Typing + auto-advance state machine.
  useEffect(() => {
    if (!playing) return;
    if (typedChars < fullCode.length) {
      typeTimerRef.current = setTimeout(() => {
        setTypedChars((c) => Math.min(fullCode.length, c + charsPerTick));
      }, 18);
      return () => { if (typeTimerRef.current) clearTimeout(typeTimerRef.current); };
    }
    // typing complete for this step
    if (advanceRef.current) return; // already scheduled
    const advance = () => {
      advanceRef.current = null;
      if (stepIdx < steps.length - 1) {
        setStepIdx(stepIdx + 1);
        setTypedChars(0);
        setRunResult(null);
        // playing continues → typing effect picks up the next step
      } else {
        setPlaying(false);
      }
    };
    if (step?.run) {
      const runIt = async () => {
        try {
          if (!ctxRef.current) {
            ctxRef.current = new DbContext(module.dataset);
            await ctxRef.current.ensure();
          }
          const out = await ctxRef.current.runIsolated(fullCode);
          if (out.ok && out.result) setRunResult(out.result);
          else setRunResult(null);
        } catch {
          setRunResult(null);
        }
      };
      runIt();
      advanceRef.current = setTimeout(advance, Math.round(2400 / speed));
    } else {
      advanceRef.current = setTimeout(advance, Math.round(1500 / speed));
    }
    return () => { /* advance timer cleaned by clearTimers on pause/reset */ };
  }, [playing, typedChars, fullCode, stepIdx, speed]);

  // Fetch source table when the shown step changes (during playback or after manual jump).
  useEffect(() => {
    const tbl = step?.table;
    if (!playing && typedChars === 0 && !source) return; // idle before first play → placeholder
    void loadTable(tbl);
  }, [stepIdx, playing]);

  useEffect(() => () => clearTimers(), []);

  const typedCode = fullCode.slice(0, typedChars);
  const hlHtml = useMemo(() => {
    const tokens = tokenizeSql(typedCode);
    return tokens
      .map((tk) => (tk.cls ? `<span class="${tk.cls}">${esc(tk.text)}</span>` : esc(tk.text)))
      .join('');
  }, [typedCode]);

  const onPlayPause = () => {
    if (playing) { clearTimers(); setPlaying(false); return; }
    if (typedChars >= fullCode.length && stepIdx === steps.length - 1) {
      // finished the whole tutorial → replay from the beginning
      resetStep(0, true);
      return;
    }
    if (typedChars >= fullCode.length && advanceRef.current === null) {
      // single step finished but not last (or paused mid-hold) → restart this step
      setTypedChars(0);
      setRunResult(null);
    }
    setPlaying(true);
  };

  const cycleSpeed = () => setSpeedIdx((i) => (i + 1) % SPEEDS.length);

  const done = !playing && typedChars >= fullCode.length;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      {/* header */}
      <div className="px-4 py-3 bg-brand-50/60 border-b border-brand-100 flex items-center justify-between gap-2 flex-wrap">
        <h3 className="font-heading font-bold text-brand-800 text-sm flex items-center gap-1.5"><Clapperboard className="w-4 h-4 shrink-0" aria-hidden="true" /> {t('theory.tutorial')} — {module.tutorial.title[lang]}</h3>
        <div className="flex items-center gap-1.5">
          <button
            onClick={cycleSpeed}
            className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-[11px] font-bold text-neutral-700 hover:border-brand-400 hover:text-brand-700 transition tabular-nums"
            title={t('theory.speed')}
            aria-label={`${t('theory.speed')}: ${speed}x`}
          >
            {speed}×
          </button>
          <button
            onClick={onPlayPause}
            className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 transition"
          >
            {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {playing ? t('theory.pause') : done ? t('theory.replay') : t('theory.play')}
          </button>
          <button onClick={() => resetStep(0)} className="rounded-lg border border-neutral-300 bg-white p-1.5 text-neutral-600 hover:border-neutral-400 transition" title={t('theory.replay')} aria-label={t('theory.replay')}>
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-neutral-100">
        {/* code pane */}
        <div className="p-4 min-w-0">
          <div className="rounded-xl bg-neutral-900 sql-dark p-3.5 min-h-[120px]">
            <pre className="sql-code whitespace-pre-wrap break-words min-h-[1.6em] text-neutral-100" dangerouslySetInnerHTML={{ __html: hlHtml }} />
            {playing && typedChars < fullCode.length && <span className="text-cyan-300 sql-code typing-cursor" aria-hidden />}
          </div>
          <div className="mt-2.5 h-1 rounded-full bg-neutral-200 overflow-hidden" role="progressbar" aria-valuenow={typedPct} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-[width] duration-150" style={{ width: `${typedPct}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-neutral-400">
            <span className="tabular-nums">{typedPct}%</span>
            <span className="inline-flex items-center gap-1">{step?.run ? <><Zap className="w-3 h-3 text-success-600" aria-hidden="true" /> runs live</> : '—'}</span>
          </div>
        </div>

        {/* explanation + live table + result */}
        <div className="p-4 min-w-0 flex flex-col gap-3">
          <p className="text-sm text-neutral-700 leading-relaxed flex gap-2"><Lightbulb className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" aria-hidden="true" /><span>{step?.explanation[lang]}</span></p>

          {source ? (
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wide text-neutral-500 flex items-center gap-1"><Table2 className="w-3 h-3" aria-hidden="true" /> {source.table} · {t('theory.liveTable')}</span>
                {rowsActive && (
                  <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 tabular-nums ${source.matchedCount > 0 ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'bg-neutral-100 text-neutral-500 border border-neutral-200'}`}>
                    {source.matchedCount}/{source.total} {t('theory.rowsMatch')}
                  </span>
                )}
              </div>
              <div className="rounded-lg border border-neutral-200 max-h-[240px] overflow-auto custom-scroll bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-100 border-b border-neutral-200 sticky top-0">
                      {source.columns.map((c, i) => (
                        <th key={i} className="px-2 py-1.5 text-[10px] font-semibold text-neutral-600 whitespace-nowrap sql-code">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {source.rows.map((r, ri) => {
                      const rid = Number(r[0]);
                      const matched = source.matchedIds?.has(rid) ?? false;
                      const cls = rowsActive
                        ? matched ? 'tut-row tut-row-hl' : (step?.table?.fadeOthers ?? true) ? 'tut-row tut-row-faded' : 'tut-row'
                        : 'tut-row';
                      return (
                        <tr key={ri} className={cls} style={{ transitionDelay: `${Math.min(ri * 30, 240)}ms` }}>
                          {r.slice(1).map((v, ci) => (
                            <td key={ci} className="px-2 py-1 text-[11px] whitespace-nowrap sql-code max-w-[180px] truncate text-neutral-700">{fmtCell(v)}</td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : !tableError && (
            <button
              onClick={onPlayPause}
              className="rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50/60 px-4 py-6 text-sm text-neutral-500 hover:border-brand-300 hover:text-brand-600 transition text-left"
            >
              <span className="flex items-center gap-1.5"><Play className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> {t('theory.pressPlay')}</span>
            </button>
          )}

          {runResult && (
            <div className="tut-reveal">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wide text-success-700 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" aria-hidden="true" /> {t('theory.result')}</span>
                <span className="text-[10px] font-bold text-neutral-400 tabular-nums">{runResult.rows.length} rows</span>
              </div>
              <ResultTable columns={runResult.columns} rows={runResult.rows} maxRows={6} compact />
            </div>
          )}
        </div>
      </div>

      {/* footer — steps */}
      <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-100 text-xs text-neutral-500 flex items-center justify-between gap-3">
        <span className="tabular-nums">{t('theory.step')} {stepIdx + 1}/{steps.length}</span>
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => resetStep(i)}
              aria-label={`${t('theory.step')} ${i + 1}`}
              className={`w-2 h-2 rounded-full transition ${i === stepIdx ? 'bg-brand-600 scale-125' : i < stepIdx ? 'bg-brand-300' : 'bg-neutral-300 hover:bg-neutral-400'}`}
            />
          ))}
        </div>
        <button onClick={() => resetStep(Math.min(stepIdx + 1, steps.length - 1), playing)} disabled={stepIdx >= steps.length - 1} className="inline-flex items-center gap-0.5 font-semibold text-neutral-600 hover:text-brand-700 disabled:opacity-30 transition" aria-label={t('module.next')}>
          {t('module.next')} <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function fmtCell(v: string | number | null) {
  if (v === null || v === undefined) return <span className="italic text-danger-500">NULL</span>;
  if (typeof v === 'number') return String(Number.isInteger(v) ? v : Math.round(v * 1e6) / 1e6);
  return String(v) === '' ? <span className="text-neutral-400">(&apos;&apos;)</span> : String(v);
}
