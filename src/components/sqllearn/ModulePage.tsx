'use client';

// ============ Module page: Theory / Quiz / Practice / Summary (spec §16.4) ============

import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, ClipboardList, Terminal, CheckCircle2, Lock, ArrowLeft, ArrowRight, Home, ChevronDown } from 'lucide-react';
import type { Module } from '@/types/content';
import { loadModule } from '@/lib/content/registry';
import { MODULE_INDEX, levelOfModule } from '@/lib/content/registry';
import { useProgressStore } from '@/lib/progress/store';
import { useLang, useT } from '@/lib/i18n/store';
import { AnimatedTutorial } from '@/components/sqllearn/AnimatedTutorial';
import { QuizTab } from '@/components/sqllearn/QuizTab';
import { PracticeConsole } from '@/components/sqllearn/PracticeConsole';
import { Diagram } from '@/components/sqllearn/Diagram';
import { SQLCode, SQLChip } from '@/components/sqllearn/SQLDisplay';
import { LEVEL_META } from '@/lib/content/registry';
import { isModuleUnlocked } from '@/lib/progress/unlock';

export function ModulePage({ moduleNumber, onNavigate }: { moduleNumber: number; onNavigate: (route: string) => void }) {
  const t = useT();
  const lang = useLang();
  const [module, setModule] = useState<Module | null>(null);
  const [tab, setTab] = useState<'theory' | 'quiz' | 'practice' | 'summary'>('theory');
  const [practiceTask, setPracticeTask] = useState(0);
  const [mounted, setMounted] = useState(false);
  const progress = useProgressStore();
  const mp = useProgressStore((s) => s.modules[`module-${String(moduleNumber).padStart(2, '0')}`]);
  const unlocked = isModuleUnlocked(moduleNumber, progress);
  const bumpStats = useProgressStore((s) => s.bumpStats);
  const markTheoryRead = useProgressStore((s) => s.markTheoryRead);
  const recordQuiz = useProgressStore((s) => s.recordQuiz);
  const setLastModule = useProgressStore((s) => s.setLastModule);
  const touch = useProgressStore((s) => s.touch);

  useEffect(() => {
    setMounted(true);
    let alive = true;
    loadModule(moduleNumber).then((m) => {
      if (!alive) return;
      setModule(m);
      setTab('theory');
      // start at the first unpassed task (moduleNumber captured at effect start)
      const prog = useProgressStore.getState().modules[m.id];
      const doneIds = new Set(prog?.tasksCompleted ?? []);
      const firstOpenIdx = m.tasks.findIndex((tsk) => !doneIds.has(tsk.id));
      setPracticeTask(firstOpenIdx === -1 ? 0 : firstOpenIdx);
    });
    touch();
    setLastModule(`module-${String(moduleNumber).padStart(2, '0')}`);
    return () => { alive = false; };
  }, [moduleNumber, touch, setLastModule]);

  const entry = MODULE_INDEX[moduleNumber];
  const levelMeta = LEVEL_META[levelOfModule(moduleNumber)];

  if (!mounted) return null;
  if (!module) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-neutral-500">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm">Loading module…</p>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7 text-neutral-400" />
        </div>
        <h2 className="font-heading text-xl font-bold text-neutral-800 mb-2">{t('module.locked.title')}</h2>
        <p className="text-sm text-neutral-600 mb-6">{t('module.locked.desc')}</p>
        <button onClick={() => onNavigate('/')} className="rounded-xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition">{t('nav.home')}</button>
      </div>
    );
  }

  const tabs = [
    { id: 'theory', icon: BookOpen, label: t('module.tab.theory') },
    { id: 'quiz', icon: ClipboardList, label: t('module.tab.quiz') },
    { id: 'practice', icon: Terminal, label: t('module.tab.practice') },
    { id: 'summary', icon: CheckCircle2, label: t('module.tab.summary') },
  ] as const;

  const theoryRead = mp?.theoryRead ?? false;
  const passed = mp?.tasksCompleted ?? [];
  const quizBest = mp?.quizBestScore ?? null;
  const completed = mp?.status === 'completed';
  const nextUnlockedNum = moduleNumber < 60 ? moduleNumber + 1 : null;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 text-xs mb-2">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${levelMeta.badge}`}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: levelMeta.dot }} />
            {t(`level.${entry.level}`)}
          </span>
          <span className="text-neutral-500">M{moduleNumber}</span>
          {completed && <span className="text-success-600 font-bold text-[10px]">✓ {t('status.completed')}</span>}
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 leading-tight mb-1">{module.title[lang]}</h1>
        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
          <span>⏱ {entry.estimatedTime}</span>
          <span>⌨ {entry.taskCount} {t('stats.tasks').toLowerCase()}</span>
          <span>📝 4 quiz</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-neutral-200 overflow-x-auto custom-scroll">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              tab === id ? 'border-brand-600 text-brand-700' : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {id === 'practice' && passed.length > 0 && <span className="text-[10px] bg-success-100 text-success-700 rounded-full px-1.5">{passed.length}/{entry.taskCount}</span>}
            {id === 'quiz' && quizBest !== null && <span className="text-[10px] bg-brand-100 text-brand-700 rounded-full px-1.5">{quizBest}%</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'theory' && (
        <TheoryTab module={module} theoryRead={theoryRead} onRead={() => markTheoryRead(module.id)} />
      )}
      {tab === 'quiz' && (
        <QuizTab module={module} onScore={(pct) => { recordQuiz(module.id, pct); bumpStats({}); }} />
      )}
      {tab === 'practice' && (
        <div className="h-[calc(100vh-260px)] min-h-[520px]">
          <div className="lg:hidden mb-3 rounded-xl border border-warning-200 bg-warning-50 px-4 py-3 text-xs text-warning-800 leading-relaxed">
            <b>⚠ {t('mobile.warn.title')}</b> — {t('mobile.warn.desc')}
          </div>
          <div className="h-full rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden flex flex-col">
            <PracticeConsole
              dataset={module.dataset}
              driver={{
                tasks: module.tasks,
                taskIndex: Math.min(practiceTask, module.tasks.length - 1),
                setTaskIndex: (i: number) => setPracticeTask(i),
                onTaskPassed: (taskId) => {
                  markTaskCompleted(module.id, taskId);
                  // auto-advance to the next unpassed task
                  const idx = module.tasks.findIndex((tsk) => tsk.id === taskId);
                  for (let i = idx + 1; i < module.tasks.length; i++) {
                    if (!passed.includes(module.tasks[i].id)) { setPracticeTask(i); return; }
                  }
                },
                onTaskSkipped: (taskId) => markTaskSkipped(module.id, taskId),
                onHintsUsed: (taskId, count) => recordHints(module.id, taskId, count),
                completedTasks: passed,
                skippedTasks: mp?.tasksSkipped ?? [],
                hintsUsed: mp?.hintsUsed ?? {},
                datasetLabel: module.dataset,
              }}
              onQueryRun={() => bumpStats({ totalQueriesRun: 1 })}
            />
          </div>
        </div>
      )}
      {tab === 'summary' && (
        <SummaryTab module={module} onNavigate={onNavigate} nextUnlocked={nextUnlockedNum} />
      )}

      {/* Footer nav */}
      <div className="mt-8 flex items-center justify-between gap-2 border-t border-neutral-200 pt-4">
        <button
          onClick={() => onNavigate(moduleNumber > 1 ? `/module/${moduleNumber - 1}` : '/')}
          disabled={moduleNumber === 1}
          className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:border-neutral-400 disabled:opacity-30 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {t('module.prev')}
        </button>
        <button onClick={() => onNavigate('/')} className="text-xs text-neutral-500 hover:text-brand-600 inline-flex items-center gap-1 transition">
          <Home className="w-3.5 h-3.5" /> {t('nav.home')}
        </button>
        <button
          onClick={() => nextUnlockedNum && onNavigate(`/module/${nextUnlockedNum}`)}
          disabled={!nextUnlockedNum || !completed}
          className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-40 transition"
        >
          {t('module.next')} <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  function markTaskCompleted(moduleId: string, taskId: string) {
    useProgressStore.getState().markTaskCompleted(moduleId, taskId);
  }
  function markTaskSkipped(moduleId: string, taskId: string) {
    useProgressStore.getState().markTaskSkipped(moduleId, taskId);
  }
  function recordHints(moduleId: string, taskId: string, count: number) {
    useProgressStore.getState().recordHints(moduleId, taskId, count);
    useProgressStore.getState().bumpStats({ totalHintsUsed: count });
  }
}

// ============ Theory tab ============
function TheoryTab({ module, theoryRead, onRead }: { module: Module; theoryRead: boolean; onRead: () => void }) {
  const lang = useLang();
  const t = useT();
  return (
    <div className="space-y-6">
      <AnimatedTutorial module={module} />

      {/* objectives */}
      <div className="rounded-2xl border border-brand-100 bg-brand-50/40 p-4">
        <h4 className="text-xs font-bold uppercase tracking-wide text-brand-700 mb-2">🎯 {t('theory.objectives')}</h4>
        <ul className="space-y-1">
          {module.learningObjectives[lang].map((o, i) => (
            <li key={i} className="text-sm text-neutral-700 flex gap-2"><span className="text-brand-500">▸</span>{o}</li>
          ))}
        </ul>
      </div>

      {/* theory sections */}
      {module.theory.map((sec, i) => (
        <section key={i} className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-5">
          <h3 className="font-heading font-bold text-lg text-neutral-800 mb-3">{sec.heading[lang]}</h3>
          {sec.paragraphs[lang].map((p, j) => (
            <p key={j} className="text-sm text-neutral-700 leading-relaxed mb-3 last:mb-0">{p}</p>
          ))}
          {sec.bullets && (
            <ul className="mt-3 space-y-1.5">
              {sec.bullets[lang].map((b, j) => (
                <li key={j} className="text-sm text-neutral-600 flex gap-2"><span className="text-success-500">✓</span>{b}</li>
              ))}
            </ul>
          )}
          {sec.diagram && <Diagram kind={sec.diagram} />}
        </section>
      ))}

      {/* syntax */}
      <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 bg-neutral-50 border-b border-neutral-200 text-xs font-bold uppercase tracking-wide text-neutral-500">{t('theory.syntax')}</div>
        <div className="p-4">
          <SQLCode code={module.syntax.template} />
          <div className="mt-3 grid gap-2">
            {module.syntax.parts.map((p, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 text-sm">
                <code className={`sql-code font-bold shrink-0 ${i % 2 ? 'text-purple-700' : 'text-blue-700'}`}>{p.part}</code>
                <span className="text-neutral-600 text-xs sm:text-sm">{p.description[lang]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* examples */}
      <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 bg-neutral-50 border-b border-neutral-200 text-xs font-bold uppercase tracking-wide text-neutral-500">{t('theory.examples')}</div>
        <div className="divide-y divide-neutral-100">
          {module.examples.map((ex, i) => (
            <ExampleRow key={i} query={ex.query} explanation={ex.explanation[lang]} tag={ex.tag} />
          ))}
        </div>
      </section>

      {/* mistakes */}
      <section className="rounded-2xl border border-warning-200 bg-warning-50/50 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-warning-200 text-xs font-bold uppercase tracking-wide text-warning-700">⚠ {t('theory.mistakes')}</div>
        <div className="divide-y divide-warning-100">
          {module.commonMistakes.map((m, i) => (
            <div key={i} className="p-4 grid md:grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase text-danger-600 mb-1">✗ {t('theory.mistake')}</div>
                <p className="text-sm text-neutral-700 leading-relaxed">{m.mistake[lang]}</p>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-success-600 mb-1">✓ {t('theory.fix')}</div>
                <p className="text-sm text-neutral-700 leading-relaxed">{m.correction[lang]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* mark read */}
      <div className="flex justify-center pb-2">
        <button
          onClick={onRead}
          disabled={theoryRead}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition inline-flex items-center gap-2 ${
            theoryRead ? 'bg-success-50 text-success-700 border border-success-300' : 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {theoryRead ? t('module.theoryReadDone') : t('module.theoryRead')}
        </button>
      </div>
    </div>
  );
}

function ExampleRow({ query, explanation, tag }: { query: string; explanation: string; tag: string }) {
  const [open, setOpen] = useState(false);
  const label = { very_easy: '★', easy: '★★', medium: '★★★', hard: '★★★★', very_hard: '★★★★★' }[tag] ?? '★';
  return (
    <div className="p-4">
      <button onClick={() => setOpen(!open)} className="w-full text-left flex items-center gap-2 group">
        <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        <SQLChip code={query} />
        <span className="text-warning-500 text-[10px] shrink-0 ml-auto">{label}</span>
      </button>
      {open && (
        <p className="mt-3 pl-6 text-sm text-neutral-600 leading-relaxed border-l-2 border-brand-200">{explanation}</p>
      )}
    </div>
  );
}

// ============ Summary tab ============
function SummaryTab({ module, onNavigate, nextUnlocked }: { module: Module; onNavigate: (r: string) => void; nextUnlocked: number | null }) {
  const t = useT();
  const lang = useLang();
  const mp = useProgressStore((s) => s.modules[module.id]);
  const passed = mp?.tasksCompleted ?? [];
  const quizBest = mp?.quizBestScore ?? null;
  const hintsUsed = Object.values(mp?.hintsUsed ?? {}).reduce((a, b) => a + b, 0);
  const tasksOk = passed.length >= Math.min(3, module.tasks.length);
  const quizOk = (quizBest ?? 0) >= 70;
  const completed = mp?.status === 'completed';

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      <div className="text-center">
        <div className="text-4xl mb-2">{completed ? '🏆' : '🧭'}</div>
        <h2 className="font-heading text-xl font-bold text-neutral-800">{completed ? t('summary.completed') : t('summary.title')}</h2>
        <p className="text-sm text-neutral-500 mt-1">{completed ? '' : t('summary.notYet')}</p>
      </div>

      {/* checklist */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm divide-y divide-neutral-100">
        <div className="px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-neutral-500">{t('summary.checklist')}</div>
        <div className="flex items-center gap-3 p-4">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${tasksOk ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-400'}`}>{tasksOk ? '✓' : '○'}</span>
          <span className="text-sm text-neutral-700">{t('summary.req.tasks')} <b className={tasksOk ? 'text-success-700' : 'text-neutral-500'}>({passed.length}/{module.tasks.length})</b></span>
        </div>
        <div className="flex items-center gap-3 p-4">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${quizOk ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-400'}`}>{quizOk ? '✓' : '○'}</span>
          <span className="text-sm text-neutral-700">{t('summary.req.quiz')} <b className={quizOk ? 'text-success-700' : 'text-neutral-500'}>({quizBest ?? 0}%)</b></span>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label={t('summary.stats.tasks')} value={`${passed.length}/${module.tasks.length}`} />
        <StatCard label={t('summary.stats.quiz')} value={`${quizBest ?? 0}%`} />
        <StatCard label={t('summary.stats.hints')} value={String(hintsUsed)} />
      </div>

      {/* recap */}
      <div className="rounded-2xl border border-brand-100 bg-brand-50/40 p-4">
        <h4 className="text-xs font-bold uppercase tracking-wide text-brand-700 mb-2">📚 {t('summary.recap')}</h4>
        <ul className="space-y-1.5">
          {module.summary[lang].map((s, i) => (
            <li key={i} className="text-sm text-neutral-700 flex gap-2"><span className="text-brand-500">▸</span>{s}</li>
          ))}
        </ul>
      </div>

      {/* next module */}
      {nextUnlocked && (
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase text-neutral-400">{t('summary.next')}</div>
            <div className="text-sm font-semibold text-neutral-800">M{nextUnlocked}: {MODULE_INDEX[nextUnlocked]?.titleEn}</div>
          </div>
          <button
            onClick={() => onNavigate(`/module/${nextUnlocked}`)}
            disabled={!completed}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-40 transition shrink-0"
          >
            {completed ? t('summary.next') : t('summary.nextLocked')}
          </button>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-3 text-center">
      <div className="text-lg font-heading font-bold text-neutral-800">{value}</div>
      <div className="text-[10px] text-neutral-500 uppercase tracking-wide">{label}</div>
    </div>
  );
}
