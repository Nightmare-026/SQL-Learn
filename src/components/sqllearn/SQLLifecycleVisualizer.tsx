'use client';

// ============ Interactive SQL Lifecycle Visualizer ============
// Visualizes the logical execution order of SQL queries:
// 1. FROM & JOIN  -> 2. WHERE  -> 3. GROUP BY  -> 4. HAVING  -> 5. SELECT  -> 6. ORDER BY  -> 7. LIMIT
// Shows why SQL is written SELECT ... FROM ..., but executed FROM ... SELECT ...

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Layers, Filter, Grid, CheckCircle2, ArrowDown, Database, ArrowRight } from 'lucide-react';
import { useLang, useT } from '@/lib/i18n/store';

interface StageInfo {
  step: number;
  clause: string;
  writtenOrder: number;
  name: { en: string; hi: string };
  action: { en: string; hi: string };
  analogy: { en: string; hi: string };
  sampleSnippet: string;
  rowsBefore: number;
  rowsAfter: number;
  statusBadge: string;
}

const LIFECYCLE_STAGES: StageInfo[] = [
  {
    step: 1,
    clause: 'FROM & JOIN',
    writtenOrder: 2,
    name: { en: 'Load Tables & Join Data', hi: 'Tables ko Memory me Load & Join karo' },
    action: {
      en: 'The database engine locates source tables and combines rows based on join conditions into a virtual working table.',
      hi: 'Database engine pehle saare source tables dhundta hai aur unhe virtual table me merge karta hai.',
    },
    analogy: {
      en: 'Getting all ingredients out onto the kitchen counter.',
      hi: 'Kitchen counter par saare ingredients nikal kar rakhna.',
    },
    sampleSnippet: 'FROM students JOIN scores ON students.id = scores.student_id',
    rowsBefore: 100,
    rowsAfter: 100,
    statusBadge: '100 Total Rows Loaded',
  },
  {
    step: 2,
    clause: 'WHERE',
    writtenOrder: 3,
    name: { en: 'Filter Individual Rows', hi: 'Individual Rows ko Filter karo' },
    action: {
      en: 'Evaluates row-level conditions. Discards any row that does not meet the criteria before any grouping happens.',
      hi: 'Row-level condition check karta hai. Jo rows match nahi hoti unhe turant hata deta hai.',
    },
    analogy: {
      en: 'Throwing away spoiled ingredients before cooking.',
      hi: 'Kharab ingredients ko alag nikal kar fekna.',
    },
    sampleSnippet: "WHERE city = 'Delhi' AND score >= 50",
    rowsBefore: 100,
    rowsAfter: 42,
    statusBadge: '58 Rows Filtered Out (42 Remain)',
  },
  {
    step: 3,
    clause: 'GROUP BY',
    writtenOrder: 4,
    name: { en: 'Group Rows into Buckets', hi: 'Rows ko Categories me Baanto' },
    action: {
      en: 'Collapses multiple rows into summary buckets based on common values (e.g., grouping by department or country).',
      hi: 'Common values ke basis par multiple rows ko group/bucket me collect karta hai.',
    },
    analogy: {
      en: 'Sorting ingredients into separate bowls.',
      hi: 'Sabhi items ko alag-alag katoriyo me classify karna.',
    },
    sampleSnippet: 'GROUP BY department_id',
    rowsBefore: 42,
    rowsAfter: 8,
    statusBadge: '42 Rows Collapsed into 8 Groups',
  },
  {
    step: 4,
    clause: 'HAVING',
    writtenOrder: 5,
    name: { en: 'Filter Grouped Buckets', hi: 'Grouped Buckets ko Filter karo' },
    action: {
      en: 'Evaluates aggregate conditions on whole groups. Groups failing the condition are removed.',
      hi: 'Pure groups par condition check karta hai (e.g., COUNT > 5). Jo group fail hota hai wo bahar.',
    },
    analogy: {
      en: 'Keeping only bowls that have enough food for everyone.',
      hi: 'Sirf wahi katoriya rakhna jinme paryapt khana ho.',
    },
    sampleSnippet: 'HAVING AVG(score) >= 75',
    rowsBefore: 8,
    rowsAfter: 5,
    statusBadge: '3 Groups Removed (5 Groups Remain)',
  },
  {
    step: 5,
    clause: 'SELECT',
    writtenOrder: 1,
    name: { en: 'Compute & Project Columns', hi: 'Columns ko Calculate & Pick karo' },
    action: {
      en: 'Selects the specific columns to output, calculates expressions, formats aliases, and evaluates aggregate functions like COUNT/AVG.',
      hi: 'Output columns select karta hai, expressions calculate karta hai aur aliases assign karta hai.',
    },
    analogy: {
      en: 'Plating the finished dish nicely.',
      hi: 'Bane hue khane ko plate me serve karna.',
    },
    sampleSnippet: 'SELECT department_id, AVG(score) AS avg_score',
    rowsBefore: 5,
    rowsAfter: 5,
    statusBadge: 'Calculated 2 Target Columns',
  },
  {
    step: 6,
    clause: 'ORDER BY',
    writtenOrder: 6,
    name: { en: 'Sort the Result Rows', hi: 'Final Output ko Sort karo' },
    action: {
      en: 'Sorts the final rows in ascending (ASC) or descending (DESC) order. Can use aliases defined in SELECT.',
      hi: 'Results ko ascending ya descending order me arrange karta hai.',
    },
    analogy: {
      en: 'Arranging the served plates in order of preference.',
      hi: 'Plates ko unki rating ke hisab se line me lagana.',
    },
    sampleSnippet: 'ORDER BY avg_score DESC',
    rowsBefore: 5,
    rowsAfter: 5,
    statusBadge: 'Sorted 5 Rows Descending',
  },
  {
    step: 7,
    clause: 'LIMIT / OFFSET',
    writtenOrder: 7,
    name: { en: 'Slice Top N Rows', hi: 'Sirf Top N Results rakho' },
    action: {
      en: 'Restricts the maximum number of rows returned to the client and optionally skips offset rows.',
      hi: 'Final output se sirf top N rows ko rakhta hai.',
    },
    analogy: {
      en: 'Taking only the top 3 best dishes to the competition.',
      hi: 'Top 3 winners ko select karna.',
    },
    sampleSnippet: 'LIMIT 3 OFFSET 0',
    rowsBefore: 5,
    rowsAfter: 3,
    statusBadge: 'Top 3 Rows Returned',
  },
];

export function SQLLifecycleVisualizer() {
  const lang = useLang();
  const t = useT();
  const [activeStep, setActiveStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % LIFECYCLE_STAGES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const stage = LIFECYCLE_STAGES[activeStep];

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden my-6">
      {/* Header */}
      <div className="px-4 py-3.5 bg-gradient-to-r from-brand-50 to-white border-b border-brand-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-neutral-900">
              {lang === 'hi' ? 'SQL Lifecycle — Logical Execution Order' : 'SQL Logical Execution Order'}
            </h3>
            <p className="text-[11px] text-neutral-500">
              {lang === 'hi'
                ? 'Dekho SQL kaise execute hoti hai step-by-step (FROM se LIMIT tak)'
                : 'Watch how SQL processes queries step-by-step under the hood'}
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
            disabled={activeStep === 0}
            className="p-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 transition"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition"
          >
            {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoPlay ? (lang === 'hi' ? 'Roko' : 'Pause') : (lang === 'hi' ? 'Chalao' : 'Play Tour')}</span>
          </button>
          <button
            onClick={() => {
              setActiveStep(0);
              setAutoPlay(false);
            }}
            className="p-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 transition"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveStep((s) => Math.min(LIFECYCLE_STAGES.length - 1, s + 1))}
            disabled={activeStep === LIFECYCLE_STAGES.length - 1}
            className="p-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 transition"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pipeline Stepper Bar */}
      <div className="px-4 py-3 bg-neutral-50/80 border-b border-neutral-100 overflow-x-auto custom-scroll">
        <div className="flex items-center gap-1.5 min-w-[580px]">
          {LIFECYCLE_STAGES.map((st, i) => {
            const isCurrent = i === activeStep;
            const isPassed = i < activeStep;
            return (
              <React.Fragment key={st.clause}>
                <button
                  onClick={() => {
                    setActiveStep(i);
                    setAutoPlay(false);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                    isCurrent
                      ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-200'
                      : isPassed
                      ? 'bg-brand-100 text-brand-800 hover:bg-brand-200'
                      : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent ? 'bg-white text-brand-700' : isPassed ? 'bg-brand-600 text-white' : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span>{st.clause}</span>
                </button>
                {i < LIFECYCLE_STAGES.length - 1 && (
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isPassed ? 'text-brand-400' : 'text-neutral-300'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-5 grid lg:grid-cols-12 gap-5 items-start">
        {/* Left Side: Step Details & Explanation */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-100 text-brand-700 border border-brand-200">
              Execution Step {stage.step} of 7
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              (Written in SQL as #{stage.writtenOrder})
            </span>
          </div>

          <div>
            <h4 className="font-heading text-lg font-bold text-neutral-900 flex items-center gap-2">
              <span className="text-brand-600 font-mono">{stage.clause}</span>
              <span className="text-neutral-300">·</span>
              <span>{stage.name[lang]}</span>
            </h4>
            <p className="text-sm text-neutral-700 mt-1.5 leading-relaxed">
              {stage.action[lang]}
            </p>
          </div>

          {/* Real-world Analogy */}
          <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 p-3 text-xs text-amber-900 flex items-start gap-2">
            <span className="text-sm shrink-0">💡</span>
            <div>
              <strong className="font-semibold block mb-0.5">
                {lang === 'hi' ? 'Real-world Udhaharan:' : 'Real-world Analogy:'}
              </strong>
              <span>{stage.analogy[lang]}</span>
            </div>
          </div>

          {/* Sample Snippet */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wide text-neutral-500 block mb-1">
              {lang === 'hi' ? 'Sample Clause:' : 'SQL Clause in action:'}
            </span>
            <div className="rounded-xl bg-neutral-900 sql-dark p-3 text-xs font-mono text-cyan-300 overflow-x-auto">
              {stage.sampleSnippet}
            </div>
          </div>
        </div>

        {/* Right Side: Visual Flow & Row Transformation */}
        <div className="lg:col-span-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-brand-600" />
            <span>{lang === 'hi' ? 'Data Transformation' : 'Data Transformation'}</span>
          </h5>

          {/* Row Count Meter */}
          <div className="rounded-lg bg-white border border-neutral-200 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
              <span>Pipeline Volume</span>
              <span className="text-brand-600 font-bold">{stage.statusBadge}</span>
            </div>

            {/* Visual Funnel Bar */}
            <div className="h-3 rounded-full bg-neutral-100 overflow-hidden flex">
              <div
                className="h-full bg-brand-500 transition-all duration-500 rounded-full"
                style={{ width: `${Math.max(10, (stage.rowsAfter / 100) * 100)}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-neutral-500 pt-0.5">
              <span>Before: {stage.rowsBefore} rows</span>
              <ArrowRight className="w-3 h-3 text-neutral-400 mt-0.5" />
              <span>After: {stage.rowsAfter} rows</span>
            </div>
          </div>

          {/* Insight Callout */}
          <div className="text-[11px] text-neutral-600 leading-relaxed bg-white rounded-lg p-2.5 border border-neutral-200">
            {stage.clause === 'WHERE' && (
              <p>
                ⚠️ <strong>Key Insight:</strong> <code>WHERE</code> cannot filter aggregate functions like <code>SUM()</code> or <code>COUNT()</code> because <code>GROUP BY</code> has not executed yet!
              </p>
            )}
            {stage.clause === 'SELECT' && (
              <p>
                💡 <strong>Key Insight:</strong> Column aliases defined in <code>SELECT</code> (e.g. <code>AS total</code>) are NOT available in <code>WHERE</code>, but ARE available in <code>ORDER BY</code>.
              </p>
            )}
            {stage.clause === 'HAVING' && (
              <p>
                🎯 <strong>Key Insight:</strong> <code>HAVING</code> filters whole groups created by <code>GROUP BY</code>, whereas <code>WHERE</code> filters individual raw rows.
              </p>
            )}
            {['FROM & JOIN', 'GROUP BY', 'ORDER BY', 'LIMIT / OFFSET'].includes(stage.clause) && (
              <p>
                ⚡ <strong>Tip:</strong> The SQL query writer always specifies <code>SELECT</code> first, but the query planner evaluates <code>FROM</code> first to prepare data.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
