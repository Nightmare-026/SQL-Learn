'use client';

// ============ Module page: User-Adjustable Draggable Split-Screen Workspace ============

import React, { useEffect, useMemo, useRef, useState, useCallback, useSyncExternalStore } from 'react';
import {
  BookOpen,
  ClipboardList,
  Terminal,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ArrowRight,
  Home,
  ChevronDown,
  AlertTriangle,
  RotateCw,
  ArrowDown,
  Keyboard,
  Target,
  Lightbulb,
  Trophy,
  Compass,
  XCircle,
  Columns2,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelRightClose,
  GripVertical,
} from 'lucide-react';
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
import { isModuleUnlocked, nextTargetModule } from '@/lib/progress/unlock';
import { LazyPracticeConsole, ConsoleSuspense } from '@/components/sqllearn/LazyPracticeConsole';
import { SQLLifecycleVisualizer } from '@/components/sqllearn/SQLLifecycleVisualizer';

export type WorkspaceMode = 'split' | 'reader' | 'console';

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export function ModulePage({ moduleNumber, onNavigate }: { moduleNumber: number; onNavigate: (route: string) => void }) {
  const mounted = useIsMounted();
  const t = useT();
  const lang = useLang();
  const [module, setModule] = useState<Module | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [tab, setTab] = useState<'workspace' | 'theory' | 'quiz' | 'practice' | 'summary'>('workspace');
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>('split');
  const [splitRatio, setSplitRatio] = useState<number>(50); // percentage for left panel
  const [isDragging, setIsDragging] = useState(false);
  const [practiceTask, setPracticeTask] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const [prevModuleNum, setPrevModuleNum] = useState(moduleNumber);
  if (prevModuleNum !== moduleNumber) {
    setPrevModuleNum(moduleNumber);
    setModule(null);
    setLoadError(false);
  }

  const progress = useProgressStore();
  const mp = useProgressStore((s) => s.modules[`module-${String(moduleNumber).padStart(2, '0')}`]);
  const unlocked = isModuleUnlocked(moduleNumber, progress);
  const bumpStats = useProgressStore((s) => s.bumpStats);
  const markTheoryRead = useProgressStore((s) => s.markTheoryRead);
  const recordQuiz = useProgressStore((s) => s.recordQuiz);
  const setLastModule = useProgressStore((s) => s.setLastModule);
  const touch = useProgressStore((s) => s.touch);

  useEffect(() => {
    let alive = true;
    loadModule(moduleNumber)
      .then((m) => {
        if (!alive) return;
        setModule(m);
        setTab('workspace');
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
    return () => {
      alive = false;
    };
  }, [moduleNumber, touch, setLastModule]);

  // Handle pointer down on splitter divider
  const handleSplitterPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const rawPercent = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      // Clamp between 20% and 80%
      const clamped = Math.min(80, Math.max(20, Math.round(rawPercent * 10) / 10));
      setSplitRatio(clamped);
    };

    const onPointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }, []);

  const entry = MODULE_INDEX[moduleNumber];
  const levelMeta = LEVEL_META[levelOfModule(moduleNumber)];

  const retryLoad = () => {
    setLoadError(false);
    loadModule(moduleNumber)
      .then((m) => {
        setModule(m);
        setTab('workspace');
      })
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
        <button
          onClick={retryLoad}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
        >
          <RotateCw className="w-4 h-4" /> {t('common.retry')}
        </button>
      </div>
    );
  }
  if (!module) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center text-neutral-500">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm">{t('common.loading')}</p>
      </div>
    );
  }

  if (!unlocked) {
    const target = nextTargetModule(useProgressStore.getState());
    const targetEntry = MODULE_INDEX[target];
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7 text-neutral-400" />
        </div>
        <h2 className="font-heading text-xl font-bold text-neutral-800 mb-2">{t('module.locked.title')}</h2>
        <p className="text-sm text-neutral-600 mb-6">{t('module.locked.desc')}</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => onNavigate(`/module/${target}`)}
            className="rounded-xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
          >
            {t('module.locked.continue')} — M{target}: {lang === 'hi' ? targetEntry.titleHi : targetEntry.titleEn}
          </button>
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:border-neutral-400 transition"
          >
            <Home className="w-3.5 h-3.5" /> {t('nav.home')}
          </button>
        </div>
      </div>
    );
  }

  const theoryRead = mp?.theoryRead ?? false;
  const passed = mp?.tasksCompleted ?? [];
  const quizBest = mp?.quizBestScore ?? null;
  const completed = mp?.status === 'completed';
  const nextUnlockedNum = moduleNumber < 60 ? moduleNumber + 1 : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-3">
      {/* Module Title & View Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white border border-neutral-200 rounded-2xl px-4 py-3 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => onNavigate('/roadmap')}
            className="p-2 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition shrink-0"
            title="Back to Curriculum Roadmap"
          >
            <Compass className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs">
              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.2 text-[9px] font-bold ${levelMeta.badge}`}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: levelMeta.dot }} />
                {t(`level.${entry.level}`)}
              </span>
              <span className="text-neutral-500 font-bold text-[11px]">M{moduleNumber}</span>
              {completed && (
                <span className="text-success-700 bg-success-50 border border-success-200 px-1.5 py-0.2 rounded-full font-bold text-[9px] inline-flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3 text-success-600" /> {t('status.completed')}
                </span>
              )}
            </div>
            <h1 className="font-heading text-lg sm:text-xl font-bold text-neutral-900 leading-tight truncate">
              {module.title[lang]}
            </h1>
          </div>
        </div>

        {/* View Layout Switcher (Desktop) */}
        <div className="hidden lg:flex items-center gap-1.5 bg-neutral-100/90 p-1 rounded-xl border border-neutral-200 text-xs font-semibold shrink-0">
          <button
            onClick={() => {
              setTab('workspace');
              setWorkspaceMode('split');
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              tab === 'workspace' && workspaceMode === 'split'
                ? 'bg-white text-brand-700 shadow-sm font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
            title="Adjustable Split Workspace (Drag divider to resize)"
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Split IDE ({splitRatio}% / {100 - splitRatio}%)</span>
          </button>

          <button
            onClick={() => {
              setTab('workspace');
              setWorkspaceMode('reader');
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              tab === 'workspace' && workspaceMode === 'reader'
                ? 'bg-white text-brand-700 shadow-sm font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
            title="Expand Theory to 100%"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Zen Reader</span>
          </button>

          <button
            onClick={() => {
              setTab('workspace');
              setWorkspaceMode('console');
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              tab === 'workspace' && workspaceMode === 'console'
                ? 'bg-white text-brand-700 shadow-sm font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
            title="Expand Practice Console to 100%"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Full Console</span>
          </button>

          <div className="w-px h-4 bg-neutral-300 mx-1" />

          {/* Quiz & Summary quick buttons */}
          <button
            onClick={() => setTab('quiz')}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition ${
              tab === 'quiz' ? 'bg-brand-600 text-white font-bold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Quiz</span>
            {quizBest !== null && <span className="text-[10px] ml-0.5 opacity-90">{quizBest}%</span>}
          </button>

          <button
            onClick={() => setTab('summary')}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition ${
              tab === 'summary' ? 'bg-brand-600 text-white font-bold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Summary</span>
          </button>
        </div>

        {/* Mobile Tabs */}
        <div className="flex lg:hidden items-center gap-1 overflow-x-auto custom-scroll pb-1">
          {(['theory', 'practice', 'quiz', 'summary'] as const).map((tb) => (
            <button
              key={tb}
              onClick={() => setTab(tb)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition capitalize ${
                tab === tb ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {tb}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Area (Desktop Split vs Single Views) */}
      {tab === 'workspace' && (
        <div className="relative">
          {/* Desktop Dual-Pane Resizable Container */}
          <div
            ref={containerRef}
            className={`hidden lg:flex items-stretch gap-0 select-none ${
              isDragging ? 'cursor-col-resize select-none' : ''
            }`}
          >
            {/* Left Panel: Theory */}
            {(workspaceMode === 'split' || workspaceMode === 'reader') && (
              <div
                style={{
                  width: workspaceMode === 'split' ? `${splitRatio}%` : '100%',
                }}
                className={`${
                  workspaceMode === 'reader' ? 'max-w-4xl mx-auto' : ''
                } flex flex-col h-[calc(100vh-140px)] min-h-[600px] rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden transition-[width] duration-75 shrink-0`}
              >
                {/* Theory Panel Header with Collapse / Expand Controls */}
                <div className="flex items-center justify-between px-3.5 py-2 border-b border-neutral-200 bg-neutral-50/90 shrink-0">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                    <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                    <span>Theory & Concepts</span>
                    {workspaceMode === 'split' && (
                      <span className="text-[10px] text-neutral-400 font-normal">({Math.round(splitRatio)}%)</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs">
                    {workspaceMode === 'split' ? (
                      <>
                        <button
                          onClick={() => setWorkspaceMode('reader')}
                          className="inline-flex items-center gap-1 px-2 py-0.8 rounded-md border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition text-[11px]"
                          title="Expand Theory to Full Width"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span>Expand</span>
                        </button>
                        <button
                          onClick={() => setWorkspaceMode('console')}
                          className="inline-flex items-center gap-1 px-2 py-0.8 rounded-md border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition text-[11px]"
                          title="Collapse Theory (Give Full Room to Console)"
                        >
                          <PanelLeftClose className="w-3 h-3" />
                          <span>Hide</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setWorkspaceMode('split')}
                        className="inline-flex items-center gap-1 px-2 py-0.8 rounded-md border border-brand-200 bg-brand-50 text-brand-700 font-bold transition text-[11px]"
                        title="Restore 50/50 Split View"
                      >
                        <Minimize2 className="w-3 h-3" />
                        <span>Restore Split</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Theory Content with Scroll */}
                <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-6">
                  <TheoryTab module={module} theoryRead={theoryRead} onRead={() => markTheoryRead(module.id)} />
                </div>
              </div>
            )}

            {/* Draggable Vertical Splitter Handle */}
            {workspaceMode === 'split' && (
              <div
                onPointerDown={handleSplitterPointerDown}
                onDoubleClick={() => setSplitRatio(50)}
                title="Drag horizontally to resize panels · Double-click to reset 50/50"
                className={`group relative w-3 shrink-0 flex items-center justify-center cursor-col-resize transition-all ${
                  isDragging ? 'bg-brand-500/20' : 'hover:bg-brand-500/10'
                }`}
              >
                {/* Visual Line and Grip */}
                <div
                  className={`w-1 h-12 rounded-full transition-colors ${
                    isDragging ? 'bg-brand-600' : 'bg-neutral-300 group-hover:bg-brand-500'
                  }`}
                />
                <div
                  className={`absolute p-0.5 rounded bg-white border border-neutral-300 shadow-xs transition-opacity ${
                    isDragging ? 'opacity-100 text-brand-600 border-brand-400' : 'opacity-0 group-hover:opacity-100 text-neutral-500'
                  }`}
                >
                  <GripVertical className="w-3 h-3" />
                </div>
              </div>
            )}

            {/* Right Panel: Interactive Practice Console */}
            {(workspaceMode === 'split' || workspaceMode === 'console') && (
              <div
                style={{
                  width: workspaceMode === 'split' ? `${100 - splitRatio}%` : '100%',
                }}
                className={`${
                  workspaceMode === 'console' ? 'max-w-5xl mx-auto' : ''
                } flex flex-col h-[calc(100vh-140px)] min-h-[600px] rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden transition-[width] duration-75 shrink-0`}
              >
                {/* Console Panel Header with Collapse / Expand Controls */}
                <div className="flex items-center justify-between px-3.5 py-2 border-b border-neutral-200 bg-neutral-50/90 shrink-0">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                    <Terminal className="w-3.5 h-3.5 text-brand-600" />
                    <span>Practice Arena</span>
                    <span className="text-[10px] font-normal text-neutral-500">
                      ({passed.length}/{entry.taskCount} passed)
                    </span>
                    {workspaceMode === 'split' && (
                      <span className="text-[10px] text-neutral-400 font-normal">({Math.round(100 - splitRatio)}%)</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs">
                    {workspaceMode === 'split' ? (
                      <>
                        <button
                          onClick={() => setWorkspaceMode('reader')}
                          className="inline-flex items-center gap-1 px-2 py-0.8 rounded-md border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition text-[11px]"
                          title="Collapse Console (Give Full Room to Theory)"
                        >
                          <PanelRightClose className="w-3 h-3" />
                          <span>Hide</span>
                        </button>
                        <button
                          onClick={() => setWorkspaceMode('console')}
                          className="inline-flex items-center gap-1 px-2 py-0.8 rounded-md border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition text-[11px]"
                          title="Expand Console to Full Width"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span>Expand</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setWorkspaceMode('split')}
                        className="inline-flex items-center gap-1 px-2 py-0.8 rounded-md border border-brand-200 bg-brand-50 text-brand-700 font-bold transition text-[11px]"
                        title="Restore 50/50 Split View"
                      >
                        <Minimize2 className="w-3 h-3" />
                        <span>Restore Split</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Live Console Component */}
                <div className="flex-1 min-h-0 flex flex-col">
                  <ConsoleSuspense label={t('common.loading')}>
                    <LazyPracticeConsole
                      dataset={module.dataset}
                      driver={{
                        tasks: module.tasks,
                        taskIndex: Math.min(practiceTask, module.tasks.length - 1),
                        setTaskIndex: (i: number) => setPracticeTask(i),
                        onTaskPassed: (taskId) => {
                          markTaskCompleted(module.id, taskId);
                          const idx = module.tasks.findIndex((tsk) => tsk.id === taskId);
                          for (let i = idx + 1; i < module.tasks.length; i++) {
                            if (!passed.includes(module.tasks[i].id)) {
                              setPracticeTask(i);
                              return;
                            }
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
          </div>

          {/* Fallback for Mobile in workspace view */}
          <div className="lg:hidden bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm">
            <TheoryTab module={module} theoryRead={theoryRead} onRead={() => markTheoryRead(module.id)} />
          </div>
        </div>
      )}

      {/* Direct Mobile / Sub Tab Views */}
      {tab === 'theory' && (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-neutral-200 p-4 sm:p-6 shadow-sm">
          <TheoryTab module={module} theoryRead={theoryRead} onRead={() => markTheoryRead(module.id)} />
        </div>
      )}

      {tab === 'practice' && (
        <div className="h-[calc(100vh-140px)] min-h-[560px] rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <ConsoleSuspense label={t('common.loading')}>
            <LazyPracticeConsole
              dataset={module.dataset}
              driver={{
                tasks: module.tasks,
                taskIndex: Math.min(practiceTask, module.tasks.length - 1),
                setTaskIndex: (i: number) => setPracticeTask(i),
                onTaskPassed: (taskId) => {
                  markTaskCompleted(module.id, taskId);
                  const idx = module.tasks.findIndex((tsk) => tsk.id === taskId);
                  for (let i = idx + 1; i < module.tasks.length; i++) {
                    if (!passed.includes(module.tasks[i].id)) {
                      setPracticeTask(i);
                      return;
                    }
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
      )}

      {tab === 'quiz' && (
        <div className="max-w-3xl mx-auto">
          <QuizTab
            module={module}
            onScore={(pct) => {
              recordQuiz(module.id, pct);
              bumpStats({});
            }}
          />
        </div>
      )}

      {tab === 'summary' && (
        <div className="max-w-4xl mx-auto">
          <SummaryTab module={module} onNavigate={onNavigate} nextUnlocked={nextUnlockedNum} />
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-between gap-2 border-t border-neutral-200 pt-3">
        <button
          onClick={() => onNavigate(moduleNumber > 1 ? `/module/${moduleNumber - 1}` : '/')}
          disabled={moduleNumber === 1}
          className="inline-flex items-center gap-1 rounded-xl border border-neutral-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:border-neutral-400 disabled:opacity-30 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {t('module.prev')}
        </button>

        <button
          onClick={() => onNavigate('/roadmap')}
          className="text-xs font-semibold text-neutral-600 hover:text-brand-600 inline-flex items-center gap-1.5 transition"
        >
          <Compass className="w-4 h-4 text-brand-600" />
          <span>Curriculum Roadmap</span>
        </button>

        <button
          onClick={() => nextUnlockedNum && onNavigate(`/module/${nextUnlockedNum}`)}
          disabled={!nextUnlockedNum || !completed}
          className="inline-flex items-center gap-1 rounded-xl bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-40 transition shadow-sm"
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
    const prev = useProgressStore.getState().modules[moduleId]?.hintsUsed?.[taskId] ?? 0;
    useProgressStore.getState().recordHints(moduleId, taskId, count);
    useProgressStore.getState().bumpStats({ totalHintsUsed: Math.max(0, count - prev) });
  }
}

// ============ Theory Tab ============
function TheoryTab({ module, theoryRead, onRead }: { module: Module; theoryRead: boolean; onRead: () => void }) {
  const lang = useLang();
  const t = useT();
  const { resumeY, goToResume } = useResumeReading(module.id);

  return (
    <div className="space-y-6">
      <AnimatedTutorial module={module} />

      {/* SQL Lifecycle Explainer */}
      {[1, 2, 8, 21, 36, 45].includes(module.number) && (
        <Reveal>
          <SQLLifecycleVisualizer />
        </Reveal>
      )}

      {/* Lesson Objectives */}
      <Reveal>
        <div id={`${module.id}-obj`} className="scroll-mt-20 rounded-2xl bg-neutral-100/90 border border-neutral-200/80 p-4">
          <h4 className="text-xs font-bold text-neutral-800 mb-2 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-brand-600" aria-hidden="true" /> {t('theory.objectives')}
          </h4>
          <ul className={`grid gap-x-6 gap-y-1 ${module.learningObjectives[lang].length > 1 ? 'sm:grid-cols-2' : ''}`}>
            {module.learningObjectives[lang].map((o, i) => (
              <li key={i} className="text-xs text-neutral-700 leading-relaxed flex gap-2">
                <span className="text-brand-600 shrink-0 mt-0.5">▸</span>
                {o}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Theory Sections */}
      {module.theory.map((sec, i) => (
        <Reveal key={i}>
          <section id={`${module.id}-sec-${i}`} className="scroll-mt-20 pt-5 pb-4 border-t border-neutral-200 first:border-t-0">
            <div className="flex items-baseline gap-2.5 mb-2.5">
              <span className="font-heading font-bold text-brand-600 text-base tabular-nums shrink-0">{i + 1}.</span>
              <h2 className="font-heading font-bold text-lg leading-snug text-neutral-900 flex-1 min-w-0">
                {sec.heading[lang]}
              </h2>
              <span className="text-[10px] font-bold text-neutral-400 shrink-0 tabular-nums hidden sm:inline">
                ~{estimateSectionMinutes(sec, lang)} {t('theory.minRead')}
              </span>
            </div>
            <div className="space-y-3 max-w-3xl">
              {sec.paragraphs[lang].map((p, j) => (
                <p key={j} className="text-xs sm:text-[13px] leading-relaxed text-neutral-800">
                  {p}
                </p>
              ))}
            </div>
            {sec.bullets && (
              <div className="mt-3 rounded-xl bg-neutral-100/80 p-3.5">
                <div className="text-xs font-bold text-neutral-800 mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success-600" aria-hidden="true" /> {t('theory.keyPoints')}
                </div>
                <ul className={`grid gap-x-6 gap-y-1 ${sec.bullets[lang].length > 1 ? 'sm:grid-cols-2' : ''}`}>
                  {sec.bullets[lang].map((b, j) => (
                    <li key={j} className="text-xs text-neutral-700 leading-relaxed flex gap-1.5">
                      <span className="text-success-600 shrink-0 mt-0.5">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {sec.diagram && (
              <div className="mt-3 rounded-xl border border-neutral-200 overflow-x-auto custom-scroll">
                <Diagram kind={sec.diagram} />
              </div>
            )}
          </section>
        </Reveal>
      ))}

      {/* Syntax */}
      <Reveal>
        <section id={`${module.id}-syntax`} className="scroll-mt-20 pt-5 pb-4 border-t border-neutral-200">
          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="shrink-0">
              <Keyboard className="w-4 h-4 text-brand-600" aria-hidden="true" />
            </span>
            <h2 className="font-heading font-bold text-base text-neutral-900">{t('theory.syntax')}</h2>
          </div>
          <SQLCode code={module.syntax.template} />
          <div className="mt-3 grid gap-1.5">
            {module.syntax.parts.map((p, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 text-xs">
                <code className={`sql-code font-bold shrink-0 ${i % 2 ? 'text-purple-700' : 'text-blue-700'}`}>
                  {p.part}
                </code>
                <span className="text-neutral-700 leading-relaxed">{p.description[lang]}</span>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Examples */}
      <Reveal>
        <section id={`${module.id}-examples`} className="scroll-mt-20 pt-5 pb-4 border-t border-neutral-200">
          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="shrink-0">
              <Lightbulb className="w-4 h-4 text-brand-600" aria-hidden="true" />
            </span>
            <h2 className="font-heading font-bold text-base text-neutral-900">{t('theory.examples')}</h2>
          </div>
          <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-xl overflow-hidden bg-white">
            {module.examples.map((ex, i) => (
              <ExampleRow key={i} query={ex.query} explanation={ex.explanation[lang]} tag={ex.tag} />
            ))}
          </div>
        </section>
      </Reveal>

      {/* Common Mistakes */}
      <Reveal>
        <section id={`${module.id}-mistakes`} className="scroll-mt-20 pt-5 pb-4 border-t border-neutral-200">
          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="shrink-0">
              <AlertTriangle className="w-4 h-4 text-warning-600" aria-hidden="true" />
            </span>
            <h2 className="font-heading font-bold text-base text-neutral-900">{t('theory.mistakes')}</h2>
          </div>
          <div className="space-y-3">
            {module.commonMistakes.map((m, i) => (
              <div key={i} className="rounded-xl border-l-4 border-warning-400 bg-warning-50/60 p-3.5 grid md:grid-cols-2 gap-2.5">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-danger-600 mb-0.5 flex items-center gap-1">
                    <XCircle className="w-3 h-3" aria-hidden="true" /> {t('theory.mistake')}
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed">{m.mistake[lang]}</p>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-success-600 mb-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" aria-hidden="true" /> {t('theory.fix')}
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed">{m.correction[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Mark Theory Read Button */}
      <div className="flex justify-center py-4">
        <button
          onClick={onRead}
          disabled={theoryRead}
          className={`rounded-xl px-5 py-2.5 text-xs font-bold transition inline-flex items-center gap-1.5 ${
            theoryRead
              ? 'bg-success-50 text-success-700 border border-success-300'
              : 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          {theoryRead ? t('module.theoryReadDone') : t('module.theoryRead')}
        </button>
      </div>

      {/* Resume Pill */}
      {resumeY !== null && (
        <button
          onClick={goToResume}
          className="fixed bottom-6 right-4 sm:right-6 z-40 inline-flex items-center gap-2 rounded-full bg-neutral-900/90 backdrop-blur text-white px-3.5 py-2 text-xs font-semibold shadow-lg hover:bg-neutral-800 transition"
        >
          <ArrowDown className="w-3 h-3" />
          {t('theory.resume')}
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
        </button>
      )}
    </div>
  );
}

function useResumeReading(moduleId: string) {
  const [resumeY, setResumeY] = useState<number | null>(() => {
    try {
      const saved = Number(sessionStorage.getItem(`theory-scroll:${moduleId}`) ?? '0');
      return saved > 600 ? saved : null;
    } catch {
      return null;
    }
  });
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        try {
          sessionStorage.setItem(`theory-scroll:${moduleId}`, String(window.scrollY));
        } catch {
          /* ignore */
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [moduleId]);

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

const PREFERS_REDUCED_MOTION =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const skip = PREFERS_REDUCED_MOTION || typeof IntersectionObserver === 'undefined';
  const [shown, setShown] = useState(skip);
  useEffect(() => {
    if (shown) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -32px 0px', threshold: 0.03 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);
  return (
    <div
      ref={ref}
      style={{ willChange: 'opacity, transform' }}
      className={`transition-[opacity,transform] duration-500 ease-out ${
        shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}
    >
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
    <div className="p-3.5">
      <button onClick={() => setOpen(!open)} className="w-full text-left flex items-center gap-2 group">
        <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        <SQLChip code={query} />
        <span className="text-warning-500 text-[10px] shrink-0 ml-auto">{label}</span>
      </button>
      {open && (
        <p className="mt-2.5 pl-5 text-xs text-neutral-600 leading-relaxed border-l-2 border-brand-200">{explanation}</p>
      )}
    </div>
  );
}

// ============ Summary Tab ============
function SummaryTab({
  module,
  onNavigate,
  nextUnlocked,
}: {
  module: Module;
  onNavigate: (r: string) => void;
  nextUnlocked: number | null;
}) {
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
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 mx-auto ${
            completed ? 'bg-success-50' : 'bg-brand-50'
          }`}
        >
          {completed ? (
            <Trophy className="w-7 h-7 text-success-600" aria-hidden="true" />
          ) : (
            <Compass className="w-7 h-7 text-brand-600" aria-hidden="true" />
          )}
        </div>
        <h2 className="font-heading text-xl font-bold text-neutral-800">
          {completed ? t('summary.completed') : t('summary.title')}
        </h2>
        {completed ? (
          <div className="mt-3 mx-auto max-w-md rounded-2xl bg-gradient-to-r from-brand-50 via-success-50 to-brand-50 border border-success-200 px-5 py-3">
            <p className="font-heading font-bold text-success-700">🎉 {t('summary.celebrate')}</p>
            <p className="text-xs text-neutral-600 mt-0.5">{t('summary.celebrateSub')}</p>
          </div>
        ) : (
          <p className="text-sm text-neutral-500 mt-1">{t('summary.notYet')}</p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 items-start">
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm divide-y divide-neutral-100">
          <div className="px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-neutral-500">
            {t('summary.checklist')}
          </div>
          <div className="flex items-center gap-3 p-4">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                tasksOk ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-400'
              }`}
            >
              {tasksOk ? (
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <span className="text-[10px]">–</span>
              )}
            </span>
            <span className="text-sm text-neutral-700">
              {t('summary.req.tasks')}{' '}
              <b className={tasksOk ? 'text-success-700' : 'text-neutral-500'}>
                ({passed.length}/{module.tasks.length})
              </b>
            </span>
          </div>
          <div className="flex items-center gap-3 p-4">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                quizOk ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-400'
              }`}
            >
              {quizOk ? (
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <span className="text-[10px]">–</span>
              )}
            </span>
            <span className="text-sm text-neutral-700">
              {t('summary.req.quiz')}{' '}
              <b className={quizOk ? 'text-success-700' : 'text-neutral-500'}>({quizBest ?? 0}%)</b>
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-brand-100 bg-brand-50/40 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wide text-brand-700 mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" /> {t('summary.recap')}
          </h4>
          <ul className="space-y-1.5">
            {module.summary[lang].map((s, i) => (
              <li key={i} className="text-sm text-neutral-700 flex gap-2">
                <span className="text-brand-500">▸</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label={t('summary.stats.tasks')} value={`${passed.length}/${module.tasks.length}`} />
        <StatCard label={t('summary.stats.quiz')} value={`${quizBest ?? 0}%`} />
        <StatCard label={t('summary.stats.hints')} value={String(hintsUsed)} />
      </div>

      {nextUnlocked && (
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase text-neutral-400">{t('summary.next')}</div>
            <div className="text-sm font-semibold text-neutral-800">
              M{nextUnlocked}: {MODULE_INDEX[nextUnlocked]?.titleEn}
            </div>
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

function Confetti({ onceKey }: { onceKey: string }) {
  const [fire] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    try {
      if (sessionStorage.getItem(onceKey) === '1') return false;
      sessionStorage.setItem(onceKey, '1');
      return true;
    } catch {
      return true;
    }
  });

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
