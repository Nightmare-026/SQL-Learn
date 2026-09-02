'use client';

// ============ Quiz engine: 4 question types (spec §13) ============

import React, { useMemo, useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, Trophy, BookOpen, ClipboardList, AlertTriangle } from 'lucide-react';
import type { Module, QuizQuestion } from '@/types/content';
import { SQLChip, ResultTable } from './SQLDisplay';
import { useProgressStore } from '@/lib/progress/store';
import { useT } from '@/lib/i18n/store';

export function QuizTab({ module, onScore }: { module: Module; onScore: (scorePct: number) => void }) {
  const t = useT();
  const [phase, setPhase] = useState<'intro' | 'q' | 'done'>('intro');
  const [qIdx, setQIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [wasRight, setWasRight] = useState(false);

  const questions = module.quiz;
  const q = questions[qIdx];

  const finish = (finalCorrect: number) => {
    const pct = Math.round((finalCorrect / questions.length) * 100);
    onScore(pct);
    setPhase('done');
  };

  const answer = (right: boolean) => {
    setAnswered(true);
    setWasRight(right);
    if (right) setCorrect((c) => c + 1);
  };

  const next = () => {
    const newCorrect = correct;
    if (qIdx + 1 >= questions.length) {
      finish(newCorrect);
    } else {
      setQIdx(qIdx + 1);
      setAnswered(false);
    }
  };

  const restart = () => { setPhase('q'); setQIdx(0); setCorrect(0); setAnswered(false); };

  if (phase === 'intro') {
    return (
      <div className="max-w-xl mx-auto text-center py-12 px-4">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="w-7 h-7 text-brand-600" aria-hidden="true" />
        </div>
        <h3 className="font-heading text-xl font-bold text-neutral-800 mb-2">{t('quiz.intro.title')} — {module.title[useProgressStore.getState().language]}</h3>
        <p className="text-sm text-neutral-600 mb-6">{t('quiz.intro.desc')}</p>
        <button
          onClick={() => setPhase('q')}
          className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition"
        >
          {t('quiz.start')}
        </button>
      </div>
    );
  }

  if (phase === 'done') {
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <div className="max-w-xl mx-auto text-center py-12 px-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
          {pct >= 70 ? <Trophy className="w-8 h-8 text-success-600" aria-hidden="true" /> : <BookOpen className="w-8 h-8 text-brand-600" aria-hidden="true" />}
        </div>
        <h3 className="font-heading text-xl font-bold text-neutral-800 mb-2">{t('quiz.results')}</h3>
        <div className="text-4xl font-heading font-bold mb-1" style={{ color: pct >= 70 ? '#059669' : '#D97706' }}>{pct}%</div>
        <p className="text-sm text-neutral-600 mb-6">{correct}/{questions.length} · {pct >= 70 ? t('quiz.passed') : t('quiz.failed')}</p>
        <button onClick={restart} className="rounded-xl border border-neutral-300 bg-white px-5 py-2 text-sm font-semibold text-neutral-700 hover:border-neutral-400 inline-flex items-center gap-1.5 transition">
          <RotateCcw className="w-3.5 h-3.5" /> {t('quiz.retry')}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 text-xs text-neutral-500">
        <span>{t('quiz.question')} {qIdx + 1} {t('quiz.of')} {questions.length}</span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div key={i} className={`w-6 h-1.5 rounded-full ${i < qIdx ? 'bg-brand-500' : i === qIdx ? 'bg-brand-600' : 'bg-neutral-200'}`} />
          ))}
        </div>
      </div>
      <QuestionCard key={qIdx} q={q} answered={answered} wasRight={wasRight} onAnswer={answer} />
      {answered && (
        <button
          onClick={next}
          className="mt-6 w-full rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 inline-flex items-center justify-center gap-1.5 transition"
        >
          {qIdx + 1 >= questions.length ? <><Trophy className="w-4 h-4" /> {t('quiz.results')}</> : <>{t('quiz.next')} <ArrowRight className="w-4 h-4" /></>}
        </button>
      )}
    </div>
  );
}

function QuestionCard({ q, answered, wasRight, onAnswer }: { q: QuizQuestion; answered: boolean; wasRight: boolean; onAnswer: (right: boolean) => void }) {
  const lang = useProgressStore((s) => s.language);
  const t = useT();
  switch (q.type) {
    case 'mcq':
      return <MCQ q={q} answered={answered} wasRight={wasRight} onAnswer={onAnswer} lang={lang} />;
    case 'output_prediction':
      return <OutputPrediction q={q} answered={answered} wasRight={wasRight} onAnswer={onAnswer} lang={lang} />;
    case 'query_building':
      return <QueryBuilding q={q} answered={answered} wasRight={wasRight} onAnswer={onAnswer} lang={lang} />;
    case 'fill_blanks':
      return <FillBlanks q={q} answered={answered} wasRight={wasRight} onAnswer={onAnswer} lang={lang} />;
  }
}

// ---------- MCQ — ARIA radiogroup semantics + arrow/number-key navigation ----------
function MCQ({ q, answered, wasRight, onAnswer, lang }: any) {
  const [picked, setPicked] = useState<number | null>(null);
  const optRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const pick = (i: number) => {
    if (answered) return;
    setPicked(i);
    onAnswer(i === q.correctIndex);
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (answered) return;
    const count = q.options.length;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      optRefs.current[(i + 1) % count]?.focus();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      optRefs.current[(i - 1 + count) % count]?.focus();
    } else if (/^[1-9]$/.test(e.key) && Number(e.key) <= count) {
      e.preventDefault();
      pick(Number(e.key) - 1);
      optRefs.current[Number(e.key) - 1]?.focus();
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-5">
      <p className="text-sm font-semibold text-neutral-800 mb-4 leading-relaxed">{q.question[lang]}</p>
      <div
        role="radiogroup"
        aria-label={q.question[lang]}
        className="space-y-2"
      >
        {q.options.map((opt: any, i: number) => {
          const isPicked = picked === i;
          const isCorrect = i === q.correctIndex;
          return (
            <button
              key={i}
              ref={(el) => { optRefs.current[i] = el; }}
              role="radio"
              aria-checked={isPicked}
              disabled={answered}
              onClick={() => pick(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`w-full text-left rounded-xl border px-4 py-2.5 text-sm transition flex items-center gap-2 ${
                answered && isCorrect
                  ? 'border-success-500 bg-success-50 text-success-800'
                  : answered && isPicked
                    ? 'border-danger-500 bg-danger-50 text-danger-800'
                    : isPicked
                      ? 'border-brand-400 bg-brand-50/40 text-neutral-700'
                      : 'border-neutral-200 hover:border-brand-400 hover:bg-brand-50/40 text-neutral-700'
              }`}
            >
              <span className="w-6 h-6 rounded-md bg-neutral-100 text-neutral-600 text-xs font-bold flex items-center justify-center shrink-0" aria-hidden="true">{String.fromCharCode(65 + i)}</span>
              {opt[lang]}
            </button>
          );
        })}
      </div>
      {!answered && (
        <p className="mt-3 text-[11px] text-neutral-400 flex items-center gap-1.5">
          <kbd className="kbd">1</kbd>–<kbd className="kbd">{Math.min(9, q.options.length)}</kbd>
          <span aria-hidden="true">·</span> <kbd className="kbd">↑</kbd> <kbd className="kbd">↓</kbd>
        </p>
      )}
      {answered && <Feedback right={wasRight} explanation={q.explanation[lang]} />}
    </div>
  );
}

// ---------- Output prediction ----------
function OutputPrediction({ q, answered, wasRight, onAnswer, lang }: any) {
  const t = useT();
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-5">
      <p className="text-sm font-semibold text-neutral-800 mb-1">{q.question[lang]}</p>
      <p className="text-[11px] text-neutral-500 mb-3">{t('quiz.query')}</p>
      <SQLChip code={q.queryShown} />
      <div className="mt-4 space-y-2">
        {q.options.map((opt: any) => {
          const isPicked = picked === opt.label;
          const isCorrect = opt.label === q.options[q.correctIndex].label;
          return (
            <button
              key={opt.label}
              disabled={answered}
              onClick={() => { setPicked(opt.label); onAnswer(isCorrect); }}
              className={`w-full text-left rounded-xl border p-3 transition ${
                answered && isCorrect
                  ? 'border-success-500 bg-success-50'
                  : answered && isPicked
                    ? 'border-danger-500 bg-danger-50'
                    : 'border-neutral-200 hover:border-brand-400'
              }`}
            >
              <div className="text-xs font-bold text-neutral-600 mb-1.5">Option {opt.label}</div>
              {'error' in opt.result ? (
                <code className="text-xs text-danger-700 sql-code flex items-center gap-1"><AlertTriangle className="w-3 h-3 shrink-0" aria-hidden="true" /> {opt.result.error}</code>
              ) : (
                <ResultTable columns={opt.result.columns} rows={opt.result.rows} maxRows={4} compact />
              )}
            </button>
          );
        })}
      </div>
      {answered && <Feedback right={wasRight} explanation={q.explanation[lang]} />}
    </div>
  );
}

// ---------- Query building (click words) ----------
function QueryBuilding({ q, answered, wasRight, onAnswer, lang }: any) {
  const t = useT();
  const [seq, setSeq] = useState<string[]>([]);
  const shuffled = useMemo(() => shuffle(q.wordBank), [q.wordBank]);
  const remaining = useMemo(() => {
    const used = [...seq];
    return q.wordBank.filter((w: string) => {
      const i = used.indexOf(w);
      if (i >= 0) { used.splice(i, 1); return false; }
      return true;
    });
  }, [seq, q.wordBank]);

  const check = () => {
    const right = seq.length === q.correctSequence.length && seq.every((w, i) => w === q.correctSequence[i]);
    onAnswer(right);
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-5">
      <p className="text-sm font-semibold text-neutral-800 mb-1">{q.description[lang]}</p>
      <p className="text-[11px] text-neutral-500 mb-3">{t('quiz.build.desc')}</p>
      <div className="min-h-[44px] rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/30 p-2 flex flex-wrap gap-1.5 mb-3">
        {seq.map((w, i) => (
          <button key={`${w}-${i}`} disabled={answered} onClick={() => setSeq(seq.filter((_, j) => j !== i))} className="rounded-md bg-brand-600 text-white px-2.5 py-1 text-xs font-semibold sql-code hover:bg-brand-700 transition">
            {w} ×
          </button>
        ))}
        {seq.length === 0 && <span className="text-xs text-neutral-400 self-center px-2">…</span>}
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {remaining.map((w: string, i: number) => (
          <button key={`${w}-${i}`} disabled={answered} onClick={() => setSeq([...seq, w])} className="rounded-md border border-neutral-300 bg-white text-neutral-700 px-2.5 py-1 text-xs font-semibold sql-code hover:border-brand-400 hover:bg-brand-50 transition">
            {w}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={() => setSeq([])} disabled={answered} className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-600 hover:border-neutral-400 transition">{t('quiz.build.reset')}</button>
        {!answered && (
          <button onClick={check} disabled={seq.length === 0} className="rounded-lg bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-40 transition">
            {t('quiz.check')}
          </button>
        )}
      </div>
      {answered && (
        <div className="mt-4">
          <div className="rounded-lg bg-neutral-900 sql-dark p-3 mb-3">
            <SQLChip code={q.correctSequence.join(' ')} />
          </div>
          <Feedback right={wasRight} explanation={q.explanation[lang]} />
        </div>
      )}
    </div>
  );
}

// ---------- Fill blanks ----------
function FillBlanks({ q, answered, wasRight, onAnswer, lang }: any) {
  const t = useT();
  const [choices, setChoices] = useState<(string | null)[]>(q.blanks.map(() => null));
  // split template by ___
  const parts = q.template.split('___');
  const renderTemplate = () => {
    const out: React.ReactNode[] = [];
    parts.forEach((p, i) => {
      out.push(<span key={`p${i}`} className="sql-code">{p}</span>);
      if (i < q.blanks.length) {
        const b = q.blanks[i];
        const val = choices[i];
        const isCorrect = answered && val === b.correct;
        out.push(
          <select
            key={`b${i}`}
            value={val ?? ''}
            disabled={answered}
            onChange={(e) => {
              const next = [...choices];
              next[i] = e.target.value;
              setChoices(next);
            }}
            className={`mx-1 rounded-md border px-1.5 py-0.5 text-xs font-bold sql-code outline-none ${
              answered && isCorrect
                ? 'border-success-500 bg-success-50 text-success-700'
                : answered && val !== null && !isCorrect
                  ? 'border-danger-500 bg-danger-50 text-danger-700'
                  : 'border-brand-300 bg-brand-50/50 text-brand-800'
            }`}
          >
            <option value="">__</option>
            {b.options.map((o: string) => <option key={o} value={o}>{o}</option>)}
          </select>
        );
      }
    });
    return out;
  };
  const allFilled = choices.every((c) => c !== null);
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-5">
      <p className="text-xs text-neutral-500 mb-3 font-semibold uppercase tracking-wide">{t('quiz.blanks')}</p>
      <div className="rounded-xl bg-neutral-900 sql-dark p-4 text-neutral-100 text-sm leading-relaxed mb-4">{renderTemplate()}</div>
      {!answered && (
        <button
          onClick={() => {
            const right = choices.every((c, i) => c === q.blanks[i].correct);
            onAnswer(right);
          }}
          disabled={!allFilled}
          className="rounded-lg bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-40 transition"
        >
          {t('quiz.check')}
        </button>
      )}
      {answered && <Feedback right={wasRight} explanation={q.explanation[lang]} />}
    </div>
  );
}

function Feedback({ right, explanation }: { right: boolean; explanation: string }) {
  const t = useT();
  return (
    <div className={`mt-4 rounded-xl p-3.5 border ${right ? 'border-success-200 bg-success-50' : 'border-danger-200 bg-danger-50'}`}>
      <div className="flex items-center gap-1.5 font-bold text-sm mb-1">
        {right ? <CheckCircle2 className="w-4 h-4 text-success-600" /> : <XCircle className="w-4 h-4 text-danger-600" />}
        {right ? t('quiz.correct') : t('quiz.wrong')}
      </div>
      <p className="text-xs text-neutral-700 leading-relaxed"><b>{t('quiz.explanation')}:</b> {explanation}</p>
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
