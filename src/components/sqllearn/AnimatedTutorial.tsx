'use client';

// ============ Animated Tutorial (spec §24: typing + row highlighting + controls) ============

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';
import type { Module, TutorialStep } from '@/types/content';
import { tokenizeSql } from '@/lib/sql/tokenizer';
import { DbContext } from '@/lib/sql/engine';
import { ResultTable } from './SQLDisplay';
import { useProgressStore } from '@/lib/progress/store';
import { useT } from '@/lib/i18n/store';

export function AnimatedTutorial({ module }: { module: Module }) {
  const t = useT();
  const lang = useProgressStore((s) => s.language);
  const steps = module.tutorial.steps;
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [typedChars, setTypedChars] = useState(0);
  const [runResult, setRunResult] = useState<{ columns: string[]; rows: (string | number | null)[][] } | null>(null);
  const ctxRef = useRef<DbContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const step = steps[stepIdx];
  const fullCode = step?.code ?? '';

  // typing animation
  useEffect(() => {
    if (!playing || !fullCode) return;
    if (typedChars < fullCode.length) {
      timerRef.current = setTimeout(() => setTypedChars((c) => Math.min(fullCode.length, c + 3)), 18);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }
    // typing done → maybe run
    if (step?.run) {
      const runIt = async () => {
        if (!ctxRef.current) {
          ctxRef.current = new DbContext(module.dataset);
          await ctxRef.current.ensure();
        }
        const out = await ctxRef.current.runIsolated(fullCode);
        if (out.ok && out.result) setRunResult(out.result);
        else setRunResult(null);
      };
      runIt();
      setPlaying(false);
    } else {
      setPlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, typedChars, fullCode, stepIdx]);

  const reset = (idx = stepIdx) => {
    setStepIdx(idx);
    setTypedChars(0);
    setRunResult(null);
    setPlaying(false);
  };

  const goNext = () => {
    if (stepIdx < steps.length - 1) reset(stepIdx + 1);
  };

  const typedCode = fullCode.slice(0, typedChars);
  const hlHtml = useMemo(() => {
    const tokens = tokenizeSql(typedCode);
    return tokens
      .map((tk) => (tk.cls ? `<span class="${tk.cls}">${tk.text.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span>` : tk.text.replace(/&/g, '&amp;').replace(/</g, '&lt;')))
      .join('');
  }, [typedCode]);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-brand-50/60 border-b border-brand-100 flex items-center justify-between">
        <h3 className="font-heading font-bold text-brand-800 text-sm">🎬 {t('theory.tutorial')} — {module.tutorial.title[lang]}</h3>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              if (typedChars >= fullCode.length) { reset(); setPlaying(true); } else setPlaying(!playing);
            }}
            className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 transition"
          >
            {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {playing ? t('theory.pause') : typedChars >= (fullCode.length || 1) ? t('theory.replay') : t('theory.play')}
          </button>
          <button onClick={() => reset()} className="rounded-lg border border-neutral-300 bg-white p-1.5 text-neutral-600 hover:border-neutral-400 transition" title={t('theory.replay')}>
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button onClick={goNext} disabled={stepIdx >= steps.length - 1} className="rounded-lg border border-neutral-300 bg-white p-1.5 text-neutral-600 hover:border-neutral-400 disabled:opacity-30 transition" title={t('module.next')}>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
        {/* code pane */}
        <div className="p-4 min-h-[150px]">
          {fullCode ? (
            <div className="rounded-lg bg-neutral-900 p-3 min-h-[100px]">
              <pre className="sql-code whitespace-pre-wrap break-words min-h-[1.6em]" dangerouslySetInnerHTML={{ __html: hlHtml }} />
              {typedChars < fullCode.length && <span className="text-brand-400 sql-code">▍</span>}
            </div>
          ) : (
            <p className="text-sm text-neutral-500 italic">💡 {step?.explanation[lang]}</p>
          )}
        </div>
        {/* explanation + output */}
        <div className="p-4 flex flex-col gap-3">
          <p className="text-sm text-neutral-700 leading-relaxed">💡 {step?.explanation[lang]}</p>
          {runResult && (
            <ResultTable columns={runResult.columns} rows={runResult.rows} maxRows={6} compact />
          )}
        </div>
      </div>

      <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-100 text-xs text-neutral-500 flex items-center justify-between">
        <span>{t('theory.step')} {stepIdx + 1}/{steps.length}</span>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <button key={i} onClick={() => reset(i)} className={`w-2 h-2 rounded-full transition ${i === stepIdx ? 'bg-brand-600' : i < stepIdx ? 'bg-brand-300' : 'bg-neutral-300 hover:bg-neutral-400'}`} aria-label={`step ${i + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
