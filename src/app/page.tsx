'use client';

// ============ TopBar + hash router shell + all pages (single route app) ============

import React, { Component, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode, type ErrorInfo } from 'react';
import { GraduationCap, Search, Globe, Settings, ChevronDown, PlayCircle, BookOpen, Terminal, FlaskConical, Lock, CheckCircle2, TrendingUp, Trophy, Database, ArrowRight, Star, ClipboardList, FileText, AlertTriangle, RotateCw } from 'lucide-react';
import { MODULE_INDEX, TOTAL_MODULES, TOTAL_TASKS, TOTAL_PROJECTS, TOTAL_QUIZZES, loadProjects, LEVEL_META, levelOfModule, searchModules } from '@/lib/content/registry';
import { useProgressStore, useProgressSummary } from '@/lib/progress/store';
import { useLangStore, useLang, useT } from '@/lib/i18n/store';
import { isModuleUnlocked } from '@/lib/progress/unlock';
import { nextTargetModule } from '@/lib/progress/unlock';
import { ModulePage } from '@/components/sqllearn/ModulePage';
import { LazyPracticeConsole, ConsoleSuspense } from '@/components/sqllearn/LazyPracticeConsole';
import { DbContext, ENGINE_LIMITS } from '@/lib/sql/engine';
import { SQLChip, ResultTable } from '@/components/sqllearn/SQLDisplay';
import { tokenizeSql } from '@/lib/sql/tokenizer';
import { Loader2, Play, Trash2, Copy } from 'lucide-react';
import { toast } from 'sonner';

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---------------- Router ----------------
export default function App() {
  const [route, setRoute] = useState('/');
  const touch = useProgressStore((s) => s.touch);
  const hydrated = useHydrated();

  useEffect(() => {
    const apply = () => setRoute(window.location.hash.slice(1) || '/');
    apply();
    window.addEventListener('hashchange', apply);
    // Surface uncaught async failures as a toast instead of silence.
    const onReject = (e: PromiseRejectionEvent) => {
      console.warn('Unhandled rejection:', e.reason);
    };
    window.addEventListener('unhandledrejection', onReject);
    return () => {
      window.removeEventListener('hashchange', apply);
      window.removeEventListener('unhandledrejection', onReject);
    };
  }, []);

  const navigate = useCallback((r: string) => {
    window.location.hash = r;
    setRoute(r);
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => { if (hydrated) touch(); }, [hydrated, touch]);

  if (!hydrated) return null;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <TopBar route={route} onNavigate={navigate} />
      <main className="flex-1 w-full">
        <AppErrorBoundary>
          <PageRouter route={route} onNavigate={navigate} />
        </AppErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

// ---------------- Error boundary (graceful crash, never a white screen) ----------------
class AppErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Render crash:', error, info.componentStack);
  }
  render() {
    if (this.state.error) {
      const lang = useLangStore.getState().lang;
      const L = (en: string, hi: string) => (lang === 'hi' ? hi : en);
      return (
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-danger-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 text-danger-500" />
          </div>
          <h2 className="font-heading text-xl font-bold text-neutral-800 mb-2">{L('Something went wrong', 'Kuch galat ho gaya')}</h2>
          <p className="text-sm text-neutral-600 mb-2">
            {L('An unexpected error occurred. Your progress is safe — reload the page to continue.', 'Achanak koi error aaya. Aapka progress safe hai — page reload karke continue karo.')}
          </p>
          <p className="text-[11px] text-neutral-400 mb-6 break-words max-w-md mx-auto">{this.state.error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
          >
            <RotateCw className="w-4 h-4" /> {L('Reload page', 'Page reload karo')}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function PageRouter({ route, onNavigate }: { route: string; onNavigate: (r: string) => void }) {
  // routes: / /dashboard /module/N /projects /project/ID /search /sandbox /settings
  if (route === '/') return <RootSwitch onNavigate={onNavigate} />;
  if (route === '/dashboard') return <DashboardPage onNavigate={onNavigate} />;
  const moduleMatch = route.match(/^\/module\/(\d+)$/);
  if (moduleMatch) return <ModulePage moduleNumber={Number(moduleMatch[1])} onNavigate={onNavigate} />;
  if (route === '/projects') return <ProjectsPage onNavigate={onNavigate} />;
  const projectMatch = route.match(/^\/project\/([\w-]+)$/);
  if (projectMatch) return <ProjectPage key={projectMatch[1]} projectId={projectMatch[1]} onNavigate={onNavigate} />;
  if (route === '/search') return <SearchPage onNavigate={onNavigate} />;
  if (route === '/sandbox') return <SandboxPage />;
  if (route === '/settings') return <SettingsPage />;
  return <LandingPage onNavigate={onNavigate} />;
}

function RootSwitch({ onNavigate }: { onNavigate: (r: string) => void }) {
  const summary = useProgressSummary();
  return summary.modulesCompleted > 0 ? <DashboardPage onNavigate={onNavigate} /> : <LandingPage onNavigate={onNavigate} />;
}

/** Hydration-safe mount detector (no setState-in-effect). */
function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

// ---------------- TopBar ----------------
function TopBar({ route, onNavigate }: { route: string; onNavigate: (r: string) => void }) {
  const t = useT();
  const summary = useProgressSummary();
  const lang = useLang();
  const setLang = useLangStore((s) => s.setLang);
  const setPLang = useProgressStore((s) => s.setLanguage);
  const [menuOpen, setMenuOpen] = useState(false);
  const progress = useProgressStore();

  const levelStats = useMemo(() => {
    const stats = { beginner: 0, intermediate: 0, advanced: 0 };
    for (const [id, mp] of Object.entries(progress.modules)) {
      if (mp.status === 'completed') {
        const n = Number(id.replace('module-', ''));
        stats[levelOfModule(n)]++;
      }
    }
    return stats;
  }, [progress.modules]);

  const statusOf = (n: number): 'completed' | 'unlocked' | 'locked' => {
    if (progress.modules[`module-${String(n).padStart(2, '0')}`]?.status === 'completed') return 'completed';
    if (isModuleUnlocked(n, progress)) return 'unlocked';
    return 'locked';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-3 h-14">
          <button onClick={() => onNavigate('/')} className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center group-hover:bg-brand-700 transition">
              <GraduationCap className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-heading font-bold text-neutral-900 hidden sm:block">SQL Learn</span>
          </button>

          {/* Modules dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 transition"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">{t('nav.modules')}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute left-0 top-full mt-2 z-50 w-80 max-w-[calc(100vw-24px)] rounded-2xl border border-neutral-200 bg-white shadow-xl overflow-hidden">
                  <div className="max-h-[70vh] overflow-y-auto custom-scroll">
                    {(['beginner', 'intermediate', 'advanced'] as const).map((level) => {
                      const levelLocked = level === 'intermediate' ? levelStats.beginner < 20 : level === 'advanced' ? levelStats.intermediate < 20 : false;
                      return (
                        <div key={level} className="border-b border-neutral-100 last:border-0">
                          <div className="flex items-center justify-between px-3 py-2 bg-neutral-50/70 sticky top-0">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-neutral-700">
                              <span className="w-2 h-2 rounded-full" style={{ background: LEVEL_META[level].dot }} />
                              {t(`level.${level}`)}
                            </span>
                            <span className={`text-[10px] ${levelLocked ? 'text-neutral-400' : 'text-neutral-500'}`}>
                              {levelStats[level]}/20 {levelLocked && <Lock className="w-3 h-3 inline -mt-0.5" />}
                            </span>
                          </div>
                          <div className="py-1">
                            {Object.values(MODULE_INDEX).filter((e) => e.level === level).map((e) => {
                              const st = statusOf(e.number);
                              const isProject = [10, 20, 30, 40, 49, 59, 60].includes(e.number);
                              return (
                                <button
                                  key={e.id}
                                  disabled={st === 'locked'}
                                  onClick={() => { onNavigate(`/module/${e.number}`); setMenuOpen(false); }}
                                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-left transition ${
                                    st === 'locked' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-50/60'
                                  }`}
                                >
                                  <span className="text-[10px] text-neutral-400 w-6 shrink-0">M{e.number}</span>
                                  <span className={`text-xs truncate flex-1 ${st === 'completed' ? 'text-neutral-500' : 'text-neutral-700'}`}>
                                    {isProject && '🎯 '}{e.titleEn}
                                  </span>
                                  {st === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-success-500 shrink-0" />}
                                  {st === 'locked' && <Lock className="w-3 h-3 text-neutral-300 shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t border-neutral-200 bg-neutral-50 p-1.5 flex gap-1">
                    <button onClick={() => { onNavigate('/sandbox'); setMenuOpen(false); }} className="flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-white transition flex items-center justify-center gap-1">
                      <FlaskConical className="w-3.5 h-3.5" /> {t('nav.sandbox')}
                    </button>
                    <button onClick={() => { onNavigate('/projects'); setMenuOpen(false); }} className="flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-white transition flex items-center justify-center gap-1">
                      <Trophy className="w-3.5 h-3.5" /> {t('nav.projects')}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button onClick={() => onNavigate('/search')} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 transition">
            <Search className="w-4 h-4" />
            <span className="hidden lg:inline">{t('nav.search')}</span>
          </button>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            {/* language toggle */}
            <div className="flex items-center rounded-lg border border-neutral-200 overflow-hidden text-xs font-bold">
              <button
                onClick={() => { setLang('en'); setPLang('en'); }}
                className={`px-2.5 py-1 transition ${lang === 'en' ? 'bg-brand-600 text-white' : 'bg-white text-neutral-600 hover:bg-neutral-50'}`}
              >EN</button>
              <button
                onClick={() => { setLang('hi'); setPLang('hi'); }}
                className={`px-2.5 py-1 transition ${lang === 'hi' ? 'bg-brand-600 text-white' : 'bg-white text-neutral-600 hover:bg-neutral-50'}`}
              >HI</button>
            </div>

            {/* progress */}
            <div className="hidden sm:flex items-center gap-2 min-w-[90px]">
              <div className="flex-1 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${summary.overallPercent}%` }} />
              </div>
              <span className="text-[10px] font-bold text-neutral-500 tabular-nums">{summary.overallPercent}%</span>
            </div>

            <button onClick={() => onNavigate('/settings')} className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="sm:hidden h-1 bg-neutral-200"><div className="h-full bg-brand-500 transition-all" style={{ width: `${summary.overallPercent}%` }} /></div>
    </header>
  );
}

// ---------------- Footer ----------------
function Footer() {
  const t = useT();
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
        <span>{t('footer.about')}</span>
        <span className="flex items-center gap-1"><Database className="w-3 h-3" /> {t('footer.madeWith')}</span>
      </div>
    </footer>
  );
}

// ---------------- Landing ----------------
function LandingPage({ onNavigate }: { onNavigate: (r: string) => void }) {
  const t = useT();
  const lang = useLang();
  const [target] = useState(() => nextTargetModule(useProgressStore.getState()));

  const features = [
    { icon: Terminal, title: t('feature.console.title'), desc: t('feature.console.desc') },
    { icon: CheckCircle2, title: t('feature.validation.title'), desc: t('feature.validation.desc') },
    { icon: Star, title: t('feature.hints.title'), desc: t('feature.hints.desc') },
    { icon: ClipboardList, title: t('feature.quiz.title'), desc: t('feature.quiz.desc') },
    { icon: Trophy, title: t('feature.projects.title'), desc: t('feature.projects.desc') },
    { icon: Globe, title: t('feature.language.title'), desc: t('feature.language.desc') },
  ];

  const levels = (['beginner', 'intermediate', 'advanced'] as const).map((level) => {
    const mods = Object.values(MODULE_INDEX).filter((e) => e.level === level);
    const first = mods[0];
    return { level, first, count: mods.length, meta: LEVEL_META[level] };
  });

  return (
    <div>
      {/* hero */}
      <section className="relative overflow-hidden border-b border-neutral-200 bg-gradient-to-b from-brand-50/70 via-white to-white">
        <div className="max-w-5xl mx-auto px-4 pt-14 pb-16 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm">
            ⚡ {t('landing.hero.badge')}
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mt-4 mb-3 text-neutral-900 tracking-tight">
            {t('landing.hero.title1')}<br />
            <span className="text-brand-600">{t('landing.hero.title2')}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 leading-relaxed mb-8">
            {t('landing.hero.sub')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate(`/module/${target}`)}
              className="rounded-xl bg-brand-600 px-7 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition"
            >
              ▶ {t('landing.cta.start')}
            </button>
            <button
              onClick={() => onNavigate('/sandbox')}
              className="rounded-xl border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 hover:border-brand-400 hover:bg-brand-50/40 transition"
            >
              <FlaskConical className="w-4 h-4 inline -mt-0.5 mr-1" /> {t('landing.cta.sandbox')}
            </button>
          </div>
          {/* mini console mock */}
          <div className="mt-12 mx-auto max-w-2xl rounded-2xl border border-neutral-200 shadow-lg bg-neutral-900 overflow-hidden text-left">
            <div className="flex gap-1.5 px-3 py-2 border-b border-neutral-700/60">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" /><span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" /><span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
            </div>
            <div className="grid grid-cols-[120px_1fr] text-[11px]">
              <div className="border-r border-neutral-700/60 p-2.5 space-y-1 text-neutral-400 sql-code">
                <div className="text-neutral-500 text-[9px] uppercase">schema</div>
                <div>📄 students</div><div>📄 teachers</div><div>📄 courses</div>
              </div>
              <div className="p-3">
                <pre className="sql-code text-neutral-200 whitespace-pre-wrap">{`SELECT name, city
FROM students
WHERE city = 'Delhi';`}</pre>
                <div className="mt-3 rounded-lg bg-neutral-800/70 p-2 sql-code text-green-300">✓ 7 rows · 0.8ms</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* stats strip */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
          {[
            [TOTAL_MODULES, t('stats.modules')],
            [TOTAL_TASKS, t('stats.tasks')],
            [TOTAL_QUIZZES, t('stats.quiz')],
            [TOTAL_PROJECTS, t('stats.projects')],
            [TOTAL_TASKS * 3, t('stats.hints')],
          ].map(([n, label]) => (
            <div key={label as string}>
              <div className="font-heading text-2xl font-bold text-brand-600">{n}</div>
              <div className="text-[10px] uppercase tracking-wide text-neutral-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* features */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="font-heading text-2xl font-bold text-neutral-800 text-center mb-8">{t('landing.features.title')}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-brand-200 transition">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
                <f.icon className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="font-heading font-bold text-sm text-neutral-800 mb-1.5">{f.title}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* levels */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="font-heading text-2xl font-bold text-neutral-800 text-center mb-2">{t('landing.stats.title')}</h2>
          <p className="text-center text-sm text-neutral-500 mb-8">{t('landing.hero.sub').split('.')[0]}.</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {levels.map(({ level, first, count, meta }) => (
              <button
                key={level}
                onClick={() => onNavigate(`/module/${first.number}`)}
                className="rounded-2xl border border-neutral-200 bg-white p-5 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 transition group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 rounded-full" style={{ background: meta.dot }} />
                  <span className="font-heading font-bold text-sm text-neutral-800">{t(`level.${level}`)}</span>
                  <span className="ml-auto text-[10px] text-neutral-400">{count} modules</span>
                </div>
                <p className="text-xs text-neutral-500 mb-3">{t(`level.${level}.desc`)}</p>
                <div className="text-xs font-semibold text-brand-600 group-hover:text-brand-700 flex items-center gap-1">
                  M{first.number}: {first.titleEn} <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* final CTA */}
      <section className="border-t border-neutral-200 bg-gradient-to-b from-white to-brand-50/60">
        <div className="max-w-2xl mx-auto px-4 py-14 text-center">
          <h2 className="font-heading text-2xl font-bold text-neutral-800 mb-2">{t('landing.hero.title1')} <span className="text-brand-600">{t('landing.hero.title2')}</span></h2>
          <button onClick={() => onNavigate(`/module/${target}`)} className="mt-4 rounded-xl bg-brand-600 px-7 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-700 transition">
            ▶ {t('landing.cta.start')}
          </button>
        </div>
      </section>
    </div>
  );
}

// ---------------- Dashboard ----------------
function DashboardPage({ onNavigate }: { onNavigate: (r: string) => void }) {
  const t = useT();
  const summary = useProgressSummary();
  const progress = useProgressStore();
  const lang = useLang();
  const [target] = useState(() => nextTargetModule(useProgressStore.getState()));
  const targetEntry = MODULE_INDEX[target];

  const visibleModules = useMemo(() => {
    const list: number[] = [];
    for (let n = 1; n <= 60; n++) {
      if (isModuleUnlocked(n, progress)) {
        list.push(n);
        if (list.length >= 4) break;
      }
    }
    return list;
  }, [progress]);

  const statusOf = (n: number) => {
    const id = `module-${String(n).padStart(2, '0')}`;
    const mp = progress.modules[id];
    if (mp?.status === 'completed') return 'completed';
    if (mp && (mp.tasksCompleted.length || mp.quizBestScore !== null)) return 'in-progress';
    return 'unlocked';
  };

  const stats = [
    { icon: BookOpen, label: t('dash.modulesDone'), value: `${summary.modulesCompleted}/${TOTAL_MODULES}` },
    { icon: Terminal, label: t('dash.tasksDone'), value: `${summary.tasksCompleted}/${TOTAL_TASKS}` },
    { icon: TrendingUp, label: t('dash.queries'), value: String(summary.queriesRun) },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-neutral-900">{t('dash.welcome')}</h1>
        <p className="text-sm text-neutral-500 mt-1">{t('app.tagline')} · {summary.overallPercent}%</p>
      </div>

      {/* continue card */}
      <div className="rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-50 to-white p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-wide text-brand-600 mb-1">{t('dash.continue')}</div>
          <div className="font-heading font-bold text-lg text-neutral-800">M{target}: {lang === 'hi' ? targetEntry.titleHi : targetEntry.titleEn}</div>
          <div className="text-xs text-neutral-500">{t(`level.${targetEntry.level}`)} · {targetEntry.estimatedTime}</div>
        </div>
        <button onClick={() => onNavigate(`/module/${target}`)} className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition flex items-center gap-2 justify-center">
          <PlayCircle className="w-4 h-4" /> {t('dash.continue')}
        </button>
      </div>

      {/* stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
            <s.icon className="w-4 h-4 text-brand-500 mb-2" />
            <div className="font-heading text-xl font-bold text-neutral-800">{s.value}</div>
            <div className="text-[10px] text-neutral-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* levels progress */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wide text-neutral-500 mb-4">{t('dash.levelBreak')}</h3>
        <div className="space-y-3">
          {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
            <div key={level}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-neutral-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: LEVEL_META[level].dot }} />
                  {t(`level.${level}`)}
                </span>
                <span className="text-neutral-500">{summary.levelProgress[level].completed}/{summary.levelProgress[level].total}</span>
              </div>
              <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${(summary.levelProgress[level].completed / 20) * 100}%`, background: LEVEL_META[level].dot }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* module grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wide text-neutral-500">{t('dash.continue')}</h3>
          <button onClick={() => onNavigate('/search')} className="text-xs text-brand-600 hover:text-brand-700 font-semibold">{t('common.viewAll')}</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {visibleModules.map((n) => {
            const e = MODULE_INDEX[n];
            const st = statusOf(n);
            return (
              <button key={n} onClick={() => onNavigate(`/module/${n}`)} className="rounded-xl border border-neutral-200 bg-white p-4 text-left hover:border-brand-300 hover:shadow-sm transition flex items-start gap-3">
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${st === 'completed' ? 'bg-success-100 text-success-700' : st === 'in-progress' ? 'bg-brand-100 text-brand-700' : 'bg-neutral-100 text-neutral-500'}`}>
                  {st === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : n}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-neutral-800 truncate">{lang === 'hi' ? e.titleHi : e.titleEn}</div>
                  <div className="text-[11px] text-neutral-500">{t(`level.${e.level}`)} · M{n}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* quick actions */}
      <div className="grid grid-cols-3 gap-3 pb-4">
        {[
          { icon: FlaskConical, label: t('nav.sandbox'), route: '/sandbox' },
          { icon: Trophy, label: t('nav.projects'), route: '/projects' },
          { icon: Search, label: t('nav.search'), route: '/search' },
        ].map((a) => (
          <button key={a.route} onClick={() => onNavigate(a.route)} className="rounded-xl border border-neutral-200 bg-white p-4 flex flex-col items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:border-brand-300 hover:shadow-sm transition">
            <a.icon className="w-5 h-5 text-brand-500" />
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------- Projects ----------------
function ProjectsPage({ onNavigate }: { onNavigate: (r: string) => void }) {
  const t = useT();
  const lang = useLang();
  const [projects, setProjects] = useState<Awaited<ReturnType<typeof loadProjects>> | null>(null);
  const [loadError, setLoadError] = useState(false);
  const progress = useProgressStore();

  useEffect(() => {
    let alive = true;
    loadProjects()
      .then((p) => { if (alive) setProjects(p); })
      .catch(() => { if (alive) setLoadError(true); });
    return () => { alive = false; };
  }, []);

  if (loadError) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-danger-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-danger-500" />
        </div>
        <h2 className="font-heading text-xl font-bold text-neutral-800 mb-2">{t('error.projectLoad.title')}</h2>
        <p className="text-sm text-neutral-600 mb-6">{t('error.moduleLoad.desc')}</p>
        <button onClick={() => { setLoadError(false); loadProjects().then(setProjects).catch(() => setLoadError(true)); }} className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition">
          <RotateCw className="w-4 h-4" /> {t('common.retry')}
        </button>
      </div>
    );
  }
  if (!projects) {
    return <div className="max-w-5xl mx-auto px-4 py-24 text-center"><div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  }

  const sorted = [...projects].sort((a, b) => a.order - b.order);
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-heading text-2xl font-bold text-neutral-900 mb-1">🏆 {t('projects.title')}</h1>
      <p className="text-sm text-neutral-500 mb-6 max-w-2xl">{t('projects.desc')}</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {sorted.map((p) => {
          const pp = progress.projects[p.id];
          const done = pp?.tasksCompleted.length ?? 0;
          const unlocked = isModuleUnlocked(p.moduleNumber, progress);
          const kindLabel = t(`projects.kind.${p.kind}`);
          return (
            <button
              key={p.id}
              disabled={!unlocked}
              onClick={() => onNavigate(`/project/${p.id}`)}
              className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition ${
                unlocked ? 'border-neutral-200 hover:border-brand-300 hover:shadow-md' : 'border-neutral-200 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase rounded-full px-2 py-0.5 ${
                  p.kind === 'capstone' ? 'bg-amber-100 text-amber-700' : p.kind === 'level' ? 'bg-brand-100 text-brand-700' : 'bg-neutral-100 text-neutral-600'
                }`}>{kindLabel}</span>
                {p.kind === 'capstone' && <span>👑</span>}
                <span className="ml-auto text-[10px] text-neutral-400">{p.estimatedTime}</span>
              </div>
              <h3 className="font-heading font-bold text-sm text-neutral-800 mb-1">{lang === 'hi' ? p.title.hi : p.title.en}</h3>
              <p className="text-xs text-neutral-500 mb-3 line-clamp-2">{lang === 'hi' ? p.subtitle.hi : p.subtitle.en}</p>
              <div className="flex items-center gap-3 text-[11px] text-neutral-500">
                <span>⌨ {done}/{p.tasks.length} {t('projects.tasks')}</span>
                {!unlocked && <span className="flex items-center gap-1 text-neutral-400"><Lock className="w-3 h-3" /> {t('projects.locked')} M{p.moduleNumber}</span>}
              </div>
              {p.tasks.length > 0 && (
                <div className="mt-2.5 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${(done / p.tasks.length) * 100}%` }} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProjectPage({ projectId, onNavigate }: { projectId: string; onNavigate: (r: string) => void }) {
  const t = useT();
  const lang = useLang();
  const [projects, setProjects] = useState<Awaited<ReturnType<typeof loadProjects>> | null>(null);
  const [taskIdx, setTaskIdx] = useState(0);
  const progress = useProgressStore();
  const recordProjectTask = useProgressStore((s) => s.recordProjectTask);
  const bumpStats = useProgressStore((s) => s.bumpStats);

  useEffect(() => {
    let alive = true;
    loadProjects()
      .then((p) => { if (alive) setProjects(p); })
      .catch(() => { if (alive) setProjects([]); });
    return () => { alive = false; };
  }, []);
  // NOTE: task selection resets naturally — PageRouter renders this component
  // with key={projectId}, so switching projects remounts it with fresh state.
  if (!projects) return <div className="max-w-5xl mx-auto px-4 py-24 text-center"><div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  const project = projects.find((p) => p.id === projectId);
  if (!project) return <div className="max-w-3xl mx-auto px-4 py-24 text-center text-neutral-500">{t('projects.notFound')}</div>;
  if (!isModuleUnlocked(project.moduleNumber, progress)) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <Lock className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
        <p className="text-sm text-neutral-600">{t('projects.lockedDesc').replace('{n}', String(project.moduleNumber))}</p>
      </div>
    );
  }

  const pp = progress.projects[project.id] ?? { status: 'in_progress' as const, tasksCompleted: [] };
  const done = pp.tasksCompleted.length;
  const firstOpen = project.tasks.findIndex((task) => !pp.tasksCompleted.includes(task.id));
  const activeIdx = Math.max(0, taskIdx === 0 && firstOpen > 0 ? firstOpen : taskIdx);
  const task = project.tasks[activeIdx];

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6">
      <button onClick={() => onNavigate('/projects')} className="text-xs text-neutral-500 hover:text-brand-600 mb-3 inline-flex items-center gap-1">
        <ArrowRight className="w-3 h-3 rotate-180" /> {t('projects.title')}
      </button>
      <div className="mb-5">
        <div className="flex items-center gap-2 text-xs mb-1">
          <span className={`text-[10px] font-bold uppercase rounded-full px-2 py-0.5 ${
            project.kind === 'capstone' ? 'bg-amber-100 text-amber-700' : project.kind === 'level' ? 'bg-brand-100 text-brand-700' : 'bg-neutral-100 text-neutral-600'
          }`}>{t(`projects.kind.${project.kind}`)}</span>
          <span className="text-neutral-400">{project.estimatedTime} · M{project.moduleNumber}</span>
        </div>
        <h1 className="font-heading text-2xl font-bold text-neutral-900">{project.kind === 'capstone' ? '👑 ' : ''}{lang === 'hi' ? project.title.hi : project.title.en}</h1>
        <p className="text-sm text-neutral-600 mt-2 max-w-3xl leading-relaxed">{lang === 'hi' ? project.intro.hi : project.intro.en}</p>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 h-2 rounded-full bg-neutral-100 overflow-hidden max-w-xs">
            <div className="h-full bg-brand-500 rounded-full" style={{ width: `${(done / project.tasks.length) * 100}%` }} />
          </div>
          <span className="text-xs text-neutral-500 font-semibold">{done}/{project.tasks.length} {t('projects.tasks')}</span>
        </div>
      </div>

      <div className="h-[calc(100vh-330px)] min-h-[480px] rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden flex flex-col">
        <ConsoleSuspense label={t('common.loading')}>
          <LazyPracticeConsole
            dataset={project.dataset}
            driver={{
              tasks: project.tasks as never,
              taskIndex: activeIdx,
              setTaskIndex: setTaskIdx,
              onTaskPassed: (taskId) => recordProjectTask(project.id, taskId),
              onTaskSkipped: () => {},
              onHintsUsed: (taskId, count) => {
                // Only newly revealed hints count toward the stats total.
                bumpStats({ totalHintsUsed: 1 });
              },
              completedTasks: pp.tasksCompleted,
              skippedTasks: [],
              hintsUsed: {},
              datasetLabel: project.dataset,
            }}
            onQueryRun={() => bumpStats({ totalQueriesRun: 1 })}
          />
        </ConsoleSuspense>
      </div>

      {pp.status === 'completed' && (
        <div className="mt-4 rounded-2xl border border-success-200 bg-success-50 p-4 text-center font-semibold text-success-700">
          🏆 {t('projects.done')}
        </div>
      )}
    </div>
  );
}

// ---------------- Search ----------------
function SearchPage({ onNavigate }: { onNavigate: (r: string) => void }) {
  const t = useT();
  const lang = useLang();
  const [q, setQ] = useState('');
  const [level, setLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [status, setStatus] = useState<'all' | 'completed' | 'unlocked' | 'locked'>('all');
  const progress = useProgressStore();

  const statusFn = (n: number): 'completed' | 'unlocked' | 'locked' => {
    if (progress.modules[`module-${String(n).padStart(2, '0')}`]?.status === 'completed') return 'completed';
    if (isModuleUnlocked(n, progress)) return 'unlocked';
    return 'locked';
  };

  const hits = useMemo(() => searchModules(q, level, status, statusFn), [q, level, status, statusFn, progress]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-heading text-2xl font-bold text-neutral-900 mb-4">🔍 {t('search.title')}</h1>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm mb-5 space-y-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('search.placeholder')}
          className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition"
          autoFocus
        />
        <div className="flex flex-wrap gap-2">
          <select value={level} onChange={(e) => setLevel(e.target.value as never)} className="rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs font-semibold text-neutral-700 bg-white outline-none">
            <option value="all">{t('search.level')}: {t('search.all')}</option>
            <option value="beginner">🟢 {t('level.beginner')}</option>
            <option value="intermediate">🟡 {t('level.intermediate')}</option>
            <option value="advanced">🔴 {t('level.advanced')}</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value as never)} className="rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs font-semibold text-neutral-700 bg-white outline-none">
            <option value="all">{t('search.status')}: {t('search.all')}</option>
            <option value="completed">✓ {t('status.completed')}</option>
            <option value="unlocked">🔓 {t('status.unlocked')}</option>
            <option value="locked">🔒 {t('status.locked')}</option>
          </select>
          {(q || level !== 'all' || status !== 'all') && (
            <button onClick={() => { setQ(''); setLevel('all'); setStatus('all'); }} className="rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs text-neutral-500 hover:border-neutral-400 transition">
              {t('search.clear')}
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-neutral-500 mb-3">
        {hits.length} {t('search.found')}{q && <> “{q}”</>}
      </p>

      {hits.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">
          {t('search.none')}<br /><span className="text-xs text-neutral-400">{t('search.suggest')}</span>
        </div>
      ) : (
        <div className="space-y-2">
          {hits.map(({ entry }) => {
            const st = statusFn(entry.number);
            return (
              <button
                key={entry.id}
                disabled={st === 'locked'}
                onClick={() => onNavigate(`/module/${entry.number}`)}
                className={`w-full rounded-xl border bg-white p-4 text-left flex items-center gap-3 transition ${
                  st === 'locked' ? 'border-neutral-200 opacity-60' : 'border-neutral-200 hover:border-brand-300 hover:shadow-sm'
                }`}
              >
                <span className="text-[10px] text-neutral-400 w-8 shrink-0">M{entry.number}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-neutral-800 truncate">{lang === 'hi' ? entry.titleHi : entry.titleEn}</div>
                  <div className="text-[11px] text-neutral-500 truncate">{entry.concepts.slice(0, 5).join(' · ')}</div>
                </div>
                <span className={`text-[10px] font-bold shrink-0 ${st === 'completed' ? 'text-success-600' : st === 'unlocked' ? 'text-brand-600' : 'text-neutral-400'}`}>
                  {st === 'completed' ? '✓' : st === 'unlocked' ? '🔓' : '🔒'}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------- Sandbox ----------------
function SandboxPage() {
  const t = useT();
  const [dataset, setDataset] = useState<'school' | 'ecommerce' | 'advanced'>('ecommerce');
  const [key, setKey] = useState(0);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6">
      <div className="mb-5">
        <h1 className="font-heading text-2xl font-bold text-neutral-900">🧪 {t('sandbox.title')}</h1>
        <p className="text-sm text-neutral-600 mt-1 max-w-2xl leading-relaxed">{t('sandbox.desc')}</p>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <select value={dataset} onChange={(e) => { setDataset(e.target.value as never); setKey((k) => k + 1); }} className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-white outline-none">
            <option value="school">🏫 School (5 tables)</option>
            <option value="ecommerce">🛒 E-Commerce (6 tables)</option>
            <option value="advanced">🚀 Advanced (10 tables)</option>
          </select>
          {confirmReset ? (
            <span className="flex items-center gap-2 text-xs">
              <span className="text-neutral-600">{t('sandbox.resetConfirm')}</span>
              <button onClick={() => { setKey((k) => k + 1); setConfirmReset(false); toast.success(t('common.resetDone')); }} className="rounded-lg bg-danger-600 px-3 py-1 text-white font-semibold hover:bg-danger-700 transition">{t('common.yes')}</button>
              <button onClick={() => setConfirmReset(false)} className="rounded-lg border border-neutral-300 px-3 py-1 text-neutral-600">{t('common.no')}</button>
            </span>
          ) : (
            <button onClick={() => setConfirmReset(true)} className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:border-danger-400 hover:text-danger-600 transition">
              🔄 {t('console.resetDb')}
            </button>
          )}
          <span className="text-[11px] text-neutral-400">{t('sandbox.warning')}</span>
        </div>
      </div>
      <div className="h-[calc(100vh-300px)] min-h-[480px] rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden flex flex-col">
        <SandboxConsole key={`${dataset}-${key}`} dataset={dataset} />
      </div>
    </div>
  );
}

function SandboxConsole({ dataset }: { dataset: string }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2.5 border-b border-neutral-200 bg-white rounded-t-2xl text-sm font-semibold text-neutral-700">
        {dataset} · free practice
      </div>
      <div className="flex-1 min-h-0">
        <SandboxRunner dataset={dataset} />
      </div>
    </div>
  );
}

function SandboxRunner({ dataset }: { dataset: string }) {
  const t = useT();
  const ctxRef = useRef<DbContext | null>(null);
  const [query, setQuery] = useState('SELECT name FROM sqlite_master WHERE type=\'table\';');
  const [ready, setReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [runState, setRunState] = useState<{ kind: 'idle' | 'running' | 'result' | 'error'; result?: any; error?: string; ms?: number; rows?: number }>({ kind: 'idle' });
  const textRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    let alive = true;
    const ctx = new DbContext(dataset as never);
    ctxRef.current = ctx;
    ctx
      .ensure()
      .then(() => { if (alive) setReady(true); })
      .catch((e: unknown) => { if (alive) setInitError(e instanceof Error ? e.message : String(e)); });
    return () => { alive = false; };
  }, [dataset]);

  const retryInit = useCallback(() => {
    const ctx = new DbContext(dataset as never);
    ctxRef.current = ctx;
    setInitError(null);
    setReady(false);
    ctx
      .ensure()
      .then(() => setReady(true))
      .catch((e: unknown) => setInitError(e instanceof Error ? e.message : String(e)));
  }, [dataset]);

  const run = async () => {
    if (!ctxRef.current || !query.trim() || runState.kind === 'running') return;
    setRunState({ kind: 'running' });
    try {
      const out = await ctxRef.current.run(query);
      if (out.ok) {
        setRunState({ kind: 'result', result: out.result, ms: out.elapsedMs, rows: out.result?.rows.length ?? 0 });
        if (out.mutated) { await ctxRef.current.ensure(); }
      } else {
        setRunState({ kind: 'error', error: out.error });
      }
    } catch (e) {
      setRunState({ kind: 'error', error: e instanceof Error ? e.message : String(e) });
    }
  };

  const hlHtml = useMemo(() => {
    const tokens = tokenizeSql(query);
    return tokens.map((tk) => tk.cls ? `<span class="${tk.cls}">${escapeHtml(tk.text)}</span>` : escapeHtml(tk.text)).join('');
  }, [query]);

  if (initError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center h-full">
        <div className="w-12 h-12 rounded-2xl bg-danger-50 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-danger-600" />
        </div>
        <p className="text-sm font-bold text-danger-700">{t('error.dbLoad.title')}</p>
        <p className="text-xs text-neutral-500 max-w-md leading-relaxed">{t('error.dbLoad.desc')}</p>
        <p className="text-[11px] text-neutral-400 max-w-md break-words">{initError}</p>
        <button onClick={retryInit} className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition">
          <RotateCw className="w-3.5 h-3.5" /> {t('common.retry')}
        </button>
      </div>
    );
  }
  if (!ready) return <div className="flex items-center justify-center h-full"><Loader2 className="w-5 h-5 animate-spin text-brand-500" /></div>;

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="editor-stack flex-1 min-h-[140px] relative">
        <pre ref={preRef} aria-hidden className="absolute inset-0 p-4 overflow-hidden whitespace-pre-wrap break-words sql-code pointer-events-none" dangerouslySetInnerHTML={{ __html: hlHtml }} />
        <textarea
          ref={textRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); } }}
          onScroll={() => { if (textRef.current && preRef.current) { preRef.current.scrollTop = textRef.current.scrollTop; } }}
          spellCheck={false}
          className="absolute inset-0 p-4 w-full h-full bg-transparent outline-none resize-none sql-code overflow-auto custom-scroll"
        />
      </div>
      <div className="flex items-center gap-2 px-3 py-2 border-t border-neutral-200 bg-neutral-50/60">
        <button onClick={run} disabled={!query.trim()} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-40 transition">
          <Play className="w-3.5 h-3.5" /> {t('console.run')}
        </button>
        <button onClick={() => setQuery('')} className="rounded-lg border border-neutral-300 bg-white p-1.5 text-neutral-600 hover:border-neutral-400 transition"><Trash2 className="w-3.5 h-3.5" /></button>
        <button onClick={async () => {
                try {
                  await navigator.clipboard?.writeText(query);
                  toast.success(t('console.copied'));
                } catch {
                  toast.error(t('common.copyFail'));
                }
              }} className="rounded-lg border border-neutral-300 bg-white p-1.5 text-neutral-600 hover:border-neutral-400 transition"><Copy className="w-3.5 h-3.5" /></button>
        <div className="ml-auto text-xs text-neutral-500">
          {runState.kind === 'result' && `${runState.rows} rows · ${runState.ms?.toFixed(1)}ms`}
        </div>
      </div>
      <div className="flex-1 min-h-[120px] overflow-auto custom-scroll border-t border-neutral-200 p-3 bg-white">
        {runState.kind === 'idle' && <p className="text-sm text-neutral-400 text-center pt-8">{t('console.empty')}</p>}
        {runState.kind === 'running' && <Loader2 className="w-5 h-5 animate-spin text-brand-500 mx-auto mt-8" />}
        {runState.kind === 'error' && (
          <div className="rounded-xl border border-danger-200 bg-danger-50 p-3">
            <div className="font-bold text-danger-700 text-sm mb-1">❌ Error</div>
            <code className="text-xs text-danger-800 sql-code break-words">{runState.error}</code>
          </div>
        )}
        {runState.kind === 'result' && (runState.result
          ? <ResultTable columns={runState.result.columns} rows={runState.result.rows} />
          : <p className="text-sm text-neutral-500 text-center pt-8">{t('console.noResults')}</p>)}
      </div>
    </div>
  );
}

// ---------------- Settings ----------------
function SettingsPage() {
  const t = useT();
  const lang = useLang();
  const setLangL = useLangStore((s) => s.setLang);
  const setPLang = useProgressStore((s) => s.setLanguage);
  const stats = useProgressStore((s) => s.stats);
  const resetAll = useProgressStore((s) => s.resetAll);
  const exportState = useProgressStore((s) => s.exportState);
  const importState = useProgressStore((s) => s.importState);
  const [confirmReset, setConfirmReset] = useState(false);
  const [importText, setImportText] = useState('');
  const [copied, setCopied] = useState(false);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
      <h1 className="font-heading text-2xl font-bold text-neutral-900 mb-1">⚙️ {t('settings.title')}</h1>

      {/* language */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h3 className="font-heading font-bold text-sm text-neutral-800 mb-1">🌐 {t('settings.language')}</h3>
        <p className="text-xs text-neutral-500 mb-3">{t('settings.language.desc')}</p>
        <div className="flex gap-2">
          {(['en', 'hi'] as const).map((l) => (
            <button
              key={l}
              onClick={() => { setLangL(l); setPLang(l); }}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition border ${
                lang === l ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-neutral-700 border-neutral-300 hover:border-brand-400'
              }`}
            >
              {l === 'en' ? '🇬🇧 English' : '🇮🇳 Hinglish'}
            </button>
          ))}
        </div>
      </section>

      {/* stats */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h3 className="font-heading font-bold text-sm text-neutral-800 mb-3">📊 {t('settings.stats')}</h3>
        <div className="grid grid-cols-4 gap-3 text-center">
          <Stat label={t('dash.queries')} value={stats.totalQueriesRun} />
          <Stat label={t('dash.tasksDone')} value={stats.totalTasksCompleted} />
          <Stat label={t('summary.stats.hints')} value={stats.totalHintsUsed} />
          <Stat label={t('settings.timeSpent')} value={`${Math.floor(stats.timeSpentSeconds / 60)}m`} />
        </div>
      </section>

      {/* backup */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h3 className="font-heading font-bold text-sm text-neutral-800 mb-1">💾 {t('settings.backup')}</h3>
        <p className="text-xs text-neutral-500 mb-3">{t('settings.backup.desc')}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={async () => {
              try {
                await navigator.clipboard?.writeText(exportState());
                setCopied(true);
                toast.success(t('common.backupCopied'));
                setTimeout(() => setCopied(false), 2000);
              } catch {
                toast.error(t('common.copyFail'));
              }
            }}
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:border-brand-400 transition"
          >
            {copied ? `✓ ${t('common.copied')}` : `📋 ${t('settings.copy')}`}
          </button>
          <button
            onClick={() => {
              try {
                const blob = new Blob([exportState()], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = 'sql-learn-backup.json'; a.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
              } catch {
                toast.error(t('common.copyFail'));
              }
            }}
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:border-brand-400 transition"
          >
            📥 {t('settings.download')}
          </button>
        </div>
        <div className="rounded-xl border border-neutral-200 p-3">
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder={t('settings.importPlaceholder')}
            className="w-full h-20 text-xs font-mono outline-none resize-none custom-scroll bg-transparent"
          />
          <button
            onClick={() => {
              const ok = importState(importText);
              if (ok) { toast.success(t('settings.importOk')); setImportText(''); }
              else toast.error(t('settings.importFail'));
            }}
            disabled={!importText.trim()}
            className="mt-2 rounded-lg bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-40 transition"
          >
            📤 {t('settings.importBtn')}
          </button>
        </div>
      </section>

      {/* danger zone */}
      <section className="rounded-2xl border border-danger-200 bg-danger-50/50 p-5">
        <h3 className="font-heading font-bold text-sm text-danger-800 mb-1 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" /> {t('settings.danger')}
        </h3>
        {confirmReset ? (
          <div className="flex items-center gap-2 mt-3 text-xs">
            <span className="text-danger-800">{t('settings.resetConfirm')}</span>
            <button onClick={() => { resetAll(); toast.success(t('common.progressReset')); setConfirmReset(false); }} className="rounded-lg bg-danger-600 px-3 py-1 text-white font-semibold hover:bg-danger-700 transition">{t('common.yes')}</button>
            <button onClick={() => setConfirmReset(false)} className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-neutral-600">{t('common.cancel')}</button>
          </div>
        ) : (
          <button onClick={() => setConfirmReset(true)} className="mt-3 rounded-xl border border-danger-300 bg-white px-4 py-2 text-xs font-semibold text-danger-700 hover:bg-danger-100 transition">
            🗑 {t('settings.resetAll')}
          </button>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-neutral-50 p-2.5">
      <div className="font-heading text-lg font-bold text-neutral-800">{value}</div>
      <div className="text-[9px] uppercase text-neutral-500">{label}</div>
    </div>
  );
}
