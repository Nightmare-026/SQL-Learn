'use client';

// ============ Module page: Theory / Quiz / Practice / Summary (spec §16.4) ============

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, ClipboardList, Terminal, CheckCircle2, Lock, ArrowLeft, ArrowRight, Home, ChevronDown, AlertTriangle, RotateCw, BadgeCheck, ArrowDown } from 'lucide-react';
import type { Module } from '@/types/content';
import { loadModule } from '@/lib/content/registry';
import { MODULE_INDEX, levelOfModule } from '@/lib/content/registry';
import { useProgressStore } from '@/lib/progress/store';
import { useLang, useT } from '@/lib/i18n/store';
import { AnimatedTutorial } from '@/components/sqllearn/AnimatedTutorial';
import { QuizTab } from '@/components/sqllearn/QuizTab';
import { Diagram } from '@/components/sqllearn/Diagram';
import { SQLCode, SQLChip } from '@/components/sqllearn/SQLDisplay';
import { LEVEL_META } from '@/lib/content/registry';
import { isModuleUnlocked } from '@/lib/progress/unlock';
import { LazyPracticeConsole, ConsoleSuspense } from '@/components/sqllearn/LazyPracticeConsole';

export function ModulePage({ moduleNumber, onNavigate }: { moduleNumber: number; onNavigate: (route: string) => void }) {
  const t = useT();
  const lang = useLang();
  const [module, setModule] = useState<Module | null>(null);
  const [loadError, setLoadError] = useState(false);
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
    setLoadError(false);
    setModule(null);
    loadModule(moduleNumber)
      .then((m) => {
        if (!alive) return;
        setModule(m);
        setTab('theory');
        // start at the first unpassed task (moduleNumber captured at effect start)
        const prog = useProgressStore.getState().modules[m.id];
        const doneIds = new Set(prog?.tasksCompleted ?? []);
        const firstOpenIdx = m.tasks.findIndex((tsk) => !doneIds.has(tsk.id));
        setPracticeTask(firstOpenIdx === -1 ? 0 : firstOpenIdx);
      })
      .catch(() => {
        if (alive) setLoadError(true);
      });
    touch();
    setLastModule(`module-${String(moduleNumber).padStart(2, '0')}`);
    return () => { alive = false; };
  }, [moduleNumber, touch, setLastModule]);

  const entry = MODULE_INDEX[moduleNumber];
  const levelMeta = LEVEL_META[levelOfModule(moduleNumber)];

  const retryLoad = () => {
    setLoadError(false);
    loadModule(moduleNumber)
      .then((m) => { setModule(m); setTab('theory'); })
      .catch(() => setLoadError(true));
  };

  if (!mounted) return null;
  if (loadError) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-danger-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-danger-500" />
        </div>
        <h2 className="font-heading text-xl font-bold text-neutral-800 mb-2">{t('error.moduleLoad.title')}</h2>
        <p className="text-sm text-neutral-600 mb-6">{t('error.moduleLoad.desc')}</p>
        <button onClick={retryLoad} className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition">
          <RotateCw className="w-4 h-4" /> {t('common.retry')}
        </button>
      </div>
    );
  }
  if (!module) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-neutral-500">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm">{t('common.loading')}</p>
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
          <span>📝 {module.quiz.length} {t('module.quizCount')}</span>
          <span className="inline-flex items-center gap-1 text-success-700"><BadgeCheck className="w-3.5 h-3.5" />{t('theory.verified')}</span>
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
            <ConsoleSuspense label={t('common.loading')}>
              <LazyPracticeConsole
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
            </ConsoleSuspense>
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
    // `count` is the task's new hint total; only the newly revealed hint counts.
    const prev = useProgressStore.getState().modules[moduleId]?.hintsUsed?.[taskId] ?? 0;
    useProgressStore.getState().recordHints(moduleId, taskId, count);
    useProgressStore.getState().bumpStats({ totalHintsUsed: Math.max(0, count - prev) });
  }
}

// ============ Theory tab ============
function TheoryTab({ module, theoryRead, onRead }: { module: Module; theoryRead: boolean; onRead: () => void }) {
  const lang = useLang();
  const t = useT();
  const { resumeY, goToResume } = useResumeReading(module.id);

  return (
    <div>
      <AnimatedTutorial module={module} />

      {/* Lesson content — spans the full page container, same width as header/tabs/practice */}
      <div>

        {/* Lesson intro — "What you'll learn" callout */}
        <Reveal>
          <div id={`${module.id}-obj`} className="scroll-mt-20 mt-6 rounded-xl bg-neutral-100/90 p-5">
            <h4 className="text-[13px] font-bold text-neutral-800 mb-2.5">🎯 {t('theory.objectives')}</h4>
            <ul className={`grid gap-x-10 gap-y-1.5 ${module.learningObjectives[lang].length > 1 ? 'sm:grid-cols-2' : ''}`}>
              {module.learningObjectives[lang].map((o, i) => (
                <li key={i} className="text-[14px] text-neutral-700 leading-relaxed flex gap-2.5">
                  <span className="text-brand-600 shrink-0 mt-0.5">▸</span>{o}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Theory sections — flat editorial prose, numbered H2 */}
        {module.theory.map((sec, i) => (
          <Reveal key={i}>
            <section id={`${module.id}-sec-${i}`} className="scroll-mt-20 pt-8 pb-7 border-t border-neutral-200 first:border-t-0">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-heading font-bold text-brand-600 text-lg tabular-nums shrink-0">{i + 1}.</span>
                <h2 className="font-heading font-bold text-[22px] leading-snug text-neutral-900 flex-1 min-w-0">{sec.heading[lang]}</h2>
                <span className="text-[11px] font-bold text-neutral-400 shrink-0 tabular-nums hidden sm:inline">~{estimateSectionMinutes(sec, lang)} {t('theory.minRead')}</span>
              </div>
              <div className="space-y-4 max-w-3xl">
                {sec.paragraphs[lang].map((p, j) => (
                  <p key={j} className="text-[15px] leading-7 text-neutral-800">{p}</p>
                ))}
              </div>
              {sec.bullets && (
                <div className="mt-5 rounded-xl bg-neutral-100/90 p-5">
                  <div className="text-[13px] font-bold text-neutral-800 mb-2.5">✓ {t('theory.keyPoints')}</div>
                  <ul className={`grid gap-x-10 gap-y-1.5 ${sec.bullets[lang].length > 1 ? 'sm:grid-cols-2' : ''}`}>
                    {sec.bullets[lang].map((b, j) => (
                      <li key={j} className="text-[14px] text-neutral-700 leading-relaxed flex gap-2.5">
                        <span className="text-success-600 shrink-0 mt-0.5">✓</span>{b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {sec.diagram && (
                <div className="mt-5 rounded-xl border border-neutral-200 overflow-x-auto custom-scroll">
                  <Diagram kind={sec.diagram} />
                </div>
              )}
            </section>
          </Reveal>
        ))}

        {/* Syntax — dark code block + parts */}
        <Reveal>
          <section id={`${module.id}-syntax`} className="scroll-mt-20 pt-8 pb-7 border-t border-neutral-200">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-heading font-bold text-brand-600 text-lg shrink-0">⌨</span>
              <h2 className="font-heading font-bold text-[22px] leading-snug text-neutral-900">{t('theory.syntax')}</h2>
            </div>
            <SQLCode code={module.syntax.template} />
            <div className="mt-4 grid gap-2.5">
              {module.syntax.parts.map((p, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                  <code className={`sql-code font-bold shrink-0 ${i % 2 ? 'text-purple-700' : 'text-blue-700'}`}>{p.part}</code>
                  <span className="text-[14px] text-neutral-700 leading-relaxed">{p.description[lang]}</span>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Examples */}
        <Reveal>
          <section id={`${module.id}-examples`} className="scroll-mt-20 pt-8 pb-7 border-t border-neutral-200">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-heading font-bold text-brand-600 text-lg shrink-0">💡</span>
              <h2 className="font-heading font-bold text-[22px] leading-snug text-neutral-900">{t('theory.examples')}</h2>
            </div>
            <div className="divide-y divide-neutral-200 border-y border-neutral-200">
              {module.examples.map((ex, i) => (
                <ExampleRow key={i} query={ex.query} explanation={ex.explanation[lang]} tag={ex.tag} />
              ))}
            </div>
          </section>
        </Reveal>

        {/* Common mistakes — amber editorial callout */}
        <Reveal>
          <section id={`${module.id}-mistakes`} className="scroll-mt-20 pt-8 pb-7 border-t border-neutral-200">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-heading font-bold text-warning-600 text-lg shrink-0">⚠</span>
              <h2 className="font-heading font-bold text-[22px] leading-snug text-neutral-900">{t('theory.mistakes')}</h2>
            </div>
            <div className="space-y-4">
              {module.commonMistakes.map((m, i) => (
                <div key={i} className="rounded-xl border-l-4 border-warning-400 bg-warning-50/60 p-4 grid md:grid-cols-2 gap-3">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wide text-danger-600 mb-1">✗ {t('theory.mistake')}</div>
                    <p className="text-[14px] text-neutral-700 leading-relaxed">{m.mistake[lang]}</p>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wide text-success-600 mb-1">✓ {t('theory.fix')}</div>
                    <p className="text-[14px] text-neutral-700 leading-relaxed">{m.correction[lang]}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* mark read */}
        <div className="flex justify-center py-8">
          <button
            onClick={onRead}
            disabled={theoryRead}
            className={`rounded-xl px-6 py-3 text-sm font-semibold transition inline-flex items-center gap-2 ${
              theoryRead ? 'bg-success-50 text-success-700 border border-success-300' : 'bg-brand-600 text-white hover:bg-brand-700 shadow-md'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {theoryRead ? t('module.theoryReadDone') : t('module.theoryRead')}
          </button>
        </div>
      </div>

      {/* resume reading pill */}
      {resumeY !== null && (
        <button
          onClick={goToResume}
          className="fixed bottom-6 right-4 sm:right-6 z-40 inline-flex items-center gap-2 rounded-full bg-neutral-900/90 backdrop-blur text-white px-4 py-2.5 text-xs font-semibold shadow-lg hover:bg-neutral-800 transition"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          {t('theory.resume')}
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
        </button>
      )}
    </div>
  );
}

function useResumeReading(moduleId: string) {
  // Lazy init from sessionStorage (client-only render — parent gates on `mounted`),
  // so no synchronous setState is needed inside an effect.
  const [resumeY, setResumeY] = useState<number | null>(() => {
    try {
      const saved = Number(sessionStorage.getItem(`theory-scroll:${moduleId}`) ?? '0');
      return saved > 600 ? saved : null;
    } catch { return null; }
  });
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        try { sessionStorage.setItem(`theory-scroll:${moduleId}`, String(window.scrollY)); } catch { /* ignore */ }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [moduleId]);
  // auto-dismiss the pill after 10s so it never lingers
  useEffect(() => {
    if (resumeY === null) return;
    const timer = setTimeout(() => setResumeY(null), 10000);
    return () => clearTimeout(timer);
  }, [resumeY]);
  const goToResume = () => {
    if (resumeY === null) return;
    setResumeY(null);
    window.scrollTo({ top: resumeY, behavior: 'smooth' });
  };
  return { resumeY, goToResume };
}

// Evaluated at client-bundle load; falls back to false during SSR/prerender.
const PREFERS_REDUCED_MOTION = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Subtle scroll-reveal (respects prefers-reduced-motion; content visible even if IO is unavailable). */
function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const skip = PREFERS_REDUCED_MOTION || typeof IntersectionObserver === 'undefined';
  const [shown, setShown] = useState(skip);
  useEffect(() => {
    if (shown) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setShown(true); io.disconnect(); }
    }, { rootMargin: '0px 0px -32px 0px', threshold: 0.03 });
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);
  return (
    <div ref={ref} style={{ willChange: 'opacity, transform' }} className={`transition-[opacity,transform] duration-500 ease-out ${shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
      {children}
    </div>
  );
}

function estimateSectionMinutes(sec: Module['theory'][number], lang: 'en' | 'hi'): number {
  const words =
    sec.paragraphs[lang].join(' ').split(/\s+/).filter(Boolean).length +
    (sec.bullets?.[lang] ?? []).join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
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
    <div className="space-y-6">
      {completed && <Confetti onceKey={`celebrated:${module.id}`} />}
      <div className="text-center">
        <div className="text-4xl mb-2">{completed ? '🏆' : '🧭'}</div>
        <h2 className="font-heading text-xl font-bold text-neutral-800">{completed ? t('summary.completed') : t('summary.title')}</h2>
        {completed ? (
          <div className="mt-3 mx-auto max-w-md rounded-2xl bg-gradient-to-r from-brand-50 via-success-50 to-brand-50 border border-success-200 px-5 py-3">
            <p className="font-heading font-bold text-success-700">🎉 {t('summary.celebrate')}</p>
            <p className="text-xs text-neutral-600 mt-0.5">{t('summary.celebrateSub')}</p>
          </div>
        ) : (
          <p className="text-sm text-neutral-500 mt-1">{t('summary.notYet')}</p>
        )}
      </div>

      {/* checklist + recap — side by side on wide screens */}
      <div className="grid gap-6 lg:grid-cols-2 items-start">
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

        <div className="rounded-2xl border border-brand-100 bg-brand-50/40 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wide text-brand-700 mb-2">📚 {t('summary.recap')}</h4>
          <ul className="space-y-1.5">
            {module.summary[lang].map((s, i) => (
              <li key={i} className="text-sm text-neutral-700 flex gap-2"><span className="text-brand-500">▸</span>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label={t('summary.stats.tasks')} value={`${passed.length}/${module.tasks.length}`} />
        <StatCard label={t('summary.stats.quiz')} value={`${quizBest ?? 0}%`} />
        <StatCard label={t('summary.stats.hints')} value={String(hintsUsed)} />
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

/** One-shot, dependency-free CSS confetti burst (skipped under prefers-reduced-motion). */
function Confetti({ onceKey }: { onceKey: string }) {
  const [fire, setFire] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let seen = false;
    try { seen = sessionStorage.getItem(onceKey) === '1'; } catch { /* private mode */ }
    if (!seen) {
      setFire(true);
      try { sessionStorage.setItem(onceKey, '1'); } catch { /* ignore */ }
    }
  }, [onceKey]);
  const pieces = useMemo(
    () =>
      Array.from({ length: 64 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.9,
        dur: 2.4 + Math.random() * 1.8,
        color: ['#4f46e5', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7', '#ec4899'][i % 7],
        w: 5 + Math.random() * 5,
        round: Math.random() > 0.6,
      })),
    []
  );
  if (!fire) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      <style>{`@keyframes sqlconf-fall{0%{transform:translateY(-8vh) rotate(0);opacity:1}100%{transform:translateY(108vh) rotate(660deg);opacity:.5}}`}</style>
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top: '-4vh',
            left: `${p.left}%`,
            width: p.w,
            height: p.w * (p.round ? 1 : 1.7),
            background: p.color,
            borderRadius: p.round ? '50%' : 2,
            animation: `sqlconf-fall ${p.dur}s ${p.delay}s cubic-bezier(.2,.5,.5,1) forwards`,
          }}
        />
      ))}
    </div>
  );
}
