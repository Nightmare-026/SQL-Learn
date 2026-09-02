'use client';

// ============ Visual Interactive Curriculum Roadmap ============
// Interactive node-based pathway across all 60 modules:
// - Tracks: Beginner (M1-20), Intermediate (M21-40), Advanced (M41-60)
// - Milestones: Capstone Challenges (M10, M20, M30, M40, M49, M59, M60)
// - Progress: Active streak, completion checks, locked badges, instant navigation

import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Lock,
  CheckCircle2,
  PlayCircle,
  Search,
  BookOpen,
  ArrowRight,
  Filter,
  Sparkles,
  Target,
  Flame,
  Star,
  ChevronRight,
  Compass,
  Database,
  Layers,
} from 'lucide-react';
import { MODULE_INDEX, LEVEL_META, levelOfModule } from '@/lib/content/registry';
import { useProgressStore, useProgressSummary } from '@/lib/progress/store';
import { useLang, useT } from '@/lib/i18n/store';
import { isModuleUnlocked, nextTargetModule } from '@/lib/progress/unlock';

const CAPSTONE_MODULE_NUMBERS = [10, 20, 30, 40, 49, 59, 60];

export function CurriculumRoadmap({ onNavigate }: { onNavigate: (route: string) => void }) {
  const lang = useLang();
  const t = useT();
  const progress = useProgressStore();
  const summary = useProgressSummary();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unlocked' | 'completed' | 'capstones'>('all');

  const currentTarget = useMemo(() => nextTargetModule(progress), [progress]);

  const statusOf = (num: number): 'completed' | 'current' | 'unlocked' | 'locked' => {
    const id = `module-${String(num).padStart(2, '0')}`;
    const mp = progress.modules[id];
    if (mp?.status === 'completed') return 'completed';
    if (num === currentTarget) return 'current';
    if (isModuleUnlocked(num, progress)) return 'unlocked';
    return 'locked';
  };

  const tracks = useMemo(() => {
    const allModules = Object.values(MODULE_INDEX);
    return [
      {
        id: 'beginner' as const,
        name: { en: 'Beginner Foundations', hi: 'Beginner Foundations' },
        range: 'M01 – M20',
        color: '#10B981',
        modules: allModules.filter((m) => m.level === 'beginner'),
        desc: {
          en: 'Master tables, SELECT, WHERE filtering, operators, aggregates, and foundational databases.',
          hi: 'Tables, SELECT, WHERE filtering, basic math, aur aggregates seekho.',
        },
      },
      {
        id: 'intermediate' as const,
        name: { en: 'Intermediate Joins & Queries', hi: 'Intermediate Joins & Queries' },
        range: 'M21 – M40',
        color: '#F59E0B',
        modules: allModules.filter((m) => m.level === 'intermediate'),
        desc: {
          en: 'INNER/LEFT/FULL JOINs, Subqueries, UNIONs, String & Date functions, GROUP BY, and HAVING.',
          hi: 'Joins, Subqueries, Multi-table relations, aur advanced transformations.',
        },
      },
      {
        id: 'advanced' as const,
        name: { en: 'Advanced Mastery & Optimization', hi: 'Advanced Mastery & Optimization' },
        range: 'M41 – M60',
        color: '#EF4444',
        modules: allModules.filter((m) => m.level === 'advanced'),
        desc: {
          en: 'Window Functions (OVER, PARTITION), CTEs, Recursive Queries, Indexing, Transactions, and DDL.',
          hi: 'Window functions, CTEs, Performance optimization, aur Database Engineering.',
        },
      },
    ];
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header & Hero Stats */}
      <div className="rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-brand-50/40 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-bold border border-brand-200">
              <Compass className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'Complete 60-Module Learning Map' : '60-Module Interactive Learning Roadmap'}</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
              {lang === 'hi' ? 'SQL Learning Pathway' : 'Master SQL Curriculum'}
            </h1>
            <p className="text-sm text-neutral-600 max-w-xl leading-relaxed">
              {lang === 'hi'
                ? 'Zero se lekar SQL Pro tak ka step-by-step roadmap. Har level par hands-on exercises aur capstone projects hain.'
                : 'Follow the proven path from fundamental queries to high-performance analytics and database architecture.'}
            </p>
          </div>

          {/* Progress Overview Card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm min-w-[260px] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-neutral-500">Your Progress</span>
              <span className="text-xs font-bold text-brand-600 tabular-nums">{summary.overallPercent}% Completed</span>
            </div>
            <div className="h-2.5 rounded-full bg-neutral-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500"
                style={{ width: `${summary.overallPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-neutral-500 pt-1 border-t border-neutral-100">
              <span>{summary.modulesCompleted} / 60 Modules</span>
              <span>{summary.tasksCompleted} Tasks Passed</span>
            </div>

            {/* Resume Button */}
            <button
              onClick={() => onNavigate(`/module/${currentTarget}`)}
              className="w-full mt-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700 transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Continue M{currentTarget}: {MODULE_INDEX[currentTarget]?.titleEn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'hi' ? 'Search module, JOIN, CTE, Window...' : 'Search topics, JOIN, CTE, Window...'}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 text-xs font-medium outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {/* Level Filter */}
          <div className="flex rounded-xl border border-neutral-200 overflow-hidden text-xs font-bold bg-neutral-50 p-0.5">
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg transition capitalize ${
                  selectedLevel === lvl ? 'bg-white text-brand-700 shadow-sm font-bold' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex rounded-xl border border-neutral-200 overflow-hidden text-xs font-bold bg-neutral-50 p-0.5">
            {(['all', 'unlocked', 'completed', 'capstones'] as const).map((flt) => (
              <button
                key={flt}
                onClick={() => setSelectedFilter(flt)}
                className={`px-3 py-1.5 rounded-lg transition capitalize ${
                  selectedFilter === flt ? 'bg-white text-brand-700 shadow-sm font-bold' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {flt === 'capstones' ? '👑 Capstones' : flt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tracks Section */}
      <div className="space-y-12">
        {tracks
          .filter((t) => selectedLevel === 'all' || selectedLevel === t.id)
          .map((track) => {
            const filteredModules = track.modules.filter((m) => {
              const status = statusOf(m.number);
              const isCapstone = CAPSTONE_MODULE_NUMBERS.includes(m.number);

              if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matches =
                  m.titleEn.toLowerCase().includes(q) ||
                  m.titleHi.toLowerCase().includes(q) ||
                  m.concepts.some((c) => c.toLowerCase().includes(q));
                if (!matches) return false;
              }

              if (selectedFilter === 'completed' && status !== 'completed') return false;
              if (selectedFilter === 'unlocked' && status === 'locked') return false;
              if (selectedFilter === 'capstones' && !isCapstone) return false;

              return true;
            });

            if (filteredModules.length === 0) return null;

            const completedInTrack = track.modules.filter((m) => statusOf(m.number) === 'completed').length;
            const trackPct = Math.round((completedInTrack / track.modules.length) * 100);

            return (
              <div key={track.id} className="space-y-4">
                {/* Track Title Card */}
                <div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ background: track.color }} />
                    <h2 className="font-heading text-xl font-bold text-neutral-900">
                      {track.name[lang]} <span className="text-xs font-semibold text-neutral-400 ml-1">({track.range})</span>
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-600">
                    <span>{completedInTrack}/{track.modules.length} Completed</span>
                    <span className="text-neutral-300">·</span>
                    <span className="text-brand-600">{trackPct}%</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-500 max-w-3xl leading-relaxed">
                  {track.desc[lang]}
                </p>

                {/* Node Grid Pathway */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 pt-2">
                  {filteredModules.map((mod) => {
                    const status = statusOf(mod.number);
                    const isCapstone = CAPSTONE_MODULE_NUMBERS.includes(mod.number);
                    const isCurrent = status === 'current';
                    const isCompleted = status === 'completed';
                    const isLocked = status === 'locked';

                    return (
                      <button
                        key={mod.id}
                        disabled={isLocked}
                        onClick={() => onNavigate(`/module/${mod.number}`)}
                        className={`group relative rounded-2xl border text-left p-4 transition duration-200 flex flex-col justify-between min-h-[140px] ${
                          isCompleted
                            ? 'bg-white border-success-300 shadow-sm hover:shadow-md hover:border-success-400'
                            : isCurrent
                            ? 'bg-brand-50/50 border-brand-500 shadow-md ring-2 ring-brand-200 hover:shadow-lg'
                            : isLocked
                            ? 'bg-neutral-50 border-neutral-200 opacity-60 cursor-not-allowed'
                            : 'bg-white border-neutral-200 hover:border-brand-300 hover:shadow-sm'
                        }`}
                      >
                        {/* Top Row: Module Badge & State Icon */}
                        <div className="flex items-center justify-between w-full mb-2">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                isCompleted
                                  ? 'bg-success-100 text-success-700'
                                  : isCurrent
                                  ? 'bg-brand-600 text-white'
                                  : isLocked
                                  ? 'bg-neutral-200 text-neutral-600'
                                  : 'bg-neutral-100 text-neutral-700'
                              }`}
                            >
                              M{mod.number}
                            </span>
                            {isCapstone && (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                👑 Capstone
                              </span>
                            )}
                          </div>

                          {/* Status Icon */}
                          <div>
                            {isCompleted && <CheckCircle2 className="w-4 h-4 text-success-600" />}
                            {isCurrent && <PlayCircle className="w-4 h-4 text-brand-600 animate-pulse" />}
                            {isLocked && <Lock className="w-3.5 h-3.5 text-neutral-400" />}
                          </div>
                        </div>

                        {/* Title */}
                        <div className="flex-1 my-1">
                          <h3 className="font-heading font-bold text-xs text-neutral-800 leading-snug line-clamp-2 group-hover:text-brand-600 transition">
                            {lang === 'hi' ? mod.titleHi : mod.titleEn}
                          </h3>
                        </div>

                        {/* Bottom Info: Concepts & Time */}
                        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-500">
                          <span className="truncate max-w-[120px]">{mod.concepts[0] || 'SQL Query'}</span>
                          <span>{mod.estimatedTime}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
