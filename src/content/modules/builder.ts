'use client';

// ============ Content authoring builders ============
// Compact DSL so 60 modules stay readable and type-safe.

import type {
  CommonMistake, DiagramKind, Example, FillBlanksQuestion, Hint, Localized,
  LocalizedList, MCQQuestion, Module, ModuleLevel, OutputPredictionQuestion,
  PracticeTask, QueryBuildingQuestion, QuizQuestion, TaskDifficulty,
  TheorySection, TutorialStep, DatasetId,
} from '@/types/content';

const levelOfModule = (n: number): ModuleLevel => (n <= 20 ? 'beginner' : n <= 40 ? 'intermediate' : 'advanced');

/** [en, hi] pair shorthand */
export type L = [string, string];
export const loc = (p: L): Localized => ({ en: p[0], hi: p[1] });
export const locList = (arr: L[]): LocalizedList => ({
  en: arr.map((a) => a[0]),
  hi: arr.map((a) => a[1]),
});

export const hint = (level: 1 | 2 | 3, type: Hint['type'], content: L): Hint => ({
  level, type, content: loc(content),
});

/** Standard 3-level progressive hints: concept → structure → partial. */
export const h3 = (concept: L, structure: L, partial: L): [Hint, Hint, Hint] => [
  hint(1, 'concept', concept),
  hint(2, 'structure', structure),
  hint(3, 'partial', partial),
];

export const section = (heading: L, paragraphs: L[], bullets?: L[], diagram?: DiagramKind): TheorySection => ({
  heading: loc(heading),
  paragraphs: locList(paragraphs),
  bullets: bullets ? locList(bullets) : undefined,
  diagram,
});

export const example = (tag: TaskDifficulty, query: string, explanation: L, note?: L): Example => ({
  tag, query, explanation: loc(explanation), note: note ? loc(note) : undefined,
});

export const mistake = (m: L, c: L): CommonMistake => ({ mistake: loc(m), correction: loc(c) });

export interface TaskSpec {
  d: TaskDifficulty;
  desc: L;
  sol: string;
  verifyQuery?: string;
  cols?: string[];
  hints: [L, L, L];
  rules?: Partial<PracticeTask['validation']>;
}

export const task = (spec: TaskSpec): PracticeTask => ({
  id: '',
  difficulty: spec.d,
  description: loc(spec.desc),
  solution: spec.sol,
  verifyQuery: spec.verifyQuery,
  expectedColumns: spec.cols,
  hints: h3(spec.hints[0], spec.hints[1], spec.hints[2]),
  validation: spec.rules ?? {},
});

export const mcq = (question: L, options: L[], correctIndex: number, explanation: L): MCQQuestion => ({
  type: 'mcq', question: loc(question), options: options.map(loc), correctIndex, explanation: loc(explanation),
});

export const outputQ = (
  queryShown: string,
  question: L,
  options: { label: string; result: { columns: string[]; rows: (string | number | null)[][] } | { error: string } }[],
  correctIndex: number,
  explanation: L
): OutputPredictionQuestion => ({
  type: 'output_prediction', queryShown, question: loc(question), options, correctIndex, explanation: loc(explanation),
});

export const buildQ = (description: L, wordBank: string[], correctSequence: string[], explanation: L): QueryBuildingQuestion => ({
  type: 'query_building', description: loc(description), wordBank, correctSequence, explanation: loc(explanation),
});

export const blanksQ = (template: string, blanks: { options: string[]; correct: string }[], explanation: L): FillBlanksQuestion => ({
  type: 'fill_blanks', template, blanks, explanation: loc(explanation),
});

export interface ModuleSpec {
  n: number;
  title: L;
  time: string;
  concepts: string[];
  objectives: L[];
  theory: TheorySection[];
  tutorial: { title: L; steps: TutorialStep[] };
  syntax: { template: string; parts: { part: string; description: L }[] };
  examples: Example[];
  mistakes: CommonMistake[];
  summary: L[];
  quiz: QuizQuestion[];
  tasks: PracticeTask[];
  diagram: DiagramKind;
}

export const step = (
  code: string | null,
  explanation: L,
  opts?: { run?: boolean; table?: string; highlightWhere?: string; fadeOthers?: boolean }
): TutorialStep => ({
  code,
  explanation: loc(explanation),
  run: opts?.run,
  table: opts?.table ? { name: opts.table, highlightWhere: opts.highlightWhere, fadeOthers: opts.fadeOthers ?? true } : undefined,
});

export function defineModule(spec: ModuleSpec): Module {
  const level = levelOfModule(spec.n);
  const dataset: DatasetId = level === 'beginner' ? 'school' : level === 'intermediate' ? 'ecommerce' : 'advanced';
  return {
    id: `module-${String(spec.n).padStart(2, '0')}`,
    number: spec.n,
    level,
    dataset,
    title: loc(spec.title),
    estimatedTime: spec.time,
    concepts: spec.concepts,
    learningObjectives: locList(spec.objectives),
    theory: spec.theory,
    tutorial: { title: loc(spec.tutorial.title), steps: spec.tutorial.steps },
    syntax: { template: spec.syntax.template, parts: spec.syntax.parts.map((p) => ({ part: p.part, description: loc(p.description) })) },
    examples: spec.examples,
    commonMistakes: spec.mistakes,
    summary: locList(spec.summary),
    quiz: spec.quiz,
    tasks: spec.tasks.map((t, i) => ({ ...t, id: `task-${i + 1}` })),
    diagram: spec.diagram,
  };
}
