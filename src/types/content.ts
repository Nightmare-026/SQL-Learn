// ============ CORE CONTENT TYPES (spec §22) ============

export type Lang = 'en' | 'hi';
export type Localized = { en: string; hi: string };
export type LocalizedList = { en: string[]; hi: string[] };

export type ModuleLevel = 'beginner' | 'intermediate' | 'advanced';
export type TaskDifficulty = 'very_easy' | 'easy' | 'medium' | 'hard' | 'very_hard';
export type ModuleStatus = 'locked' | 'unlocked' | 'in_progress' | 'completed';
export type DatasetId = 'school' | 'ecommerce' | 'advanced';

export interface Module {
  id: string;                     // "module-01"
  number: number;
  level: ModuleLevel;
  dataset: DatasetId;
  title: Localized;
  estimatedTime: string;
  concepts: string[];             // for search indexing
  learningObjectives: LocalizedList;
  theory: TheorySection[];
  tutorial: TutorialSpec;
  syntax: SyntaxInfo;
  examples: Example[];
  commonMistakes: CommonMistake[];
  summary: LocalizedList;         // "What you learned" recap
  quiz: QuizQuestion[];
  tasks: PracticeTask[];
  diagram: DiagramKind;
}

export interface TheorySection {
  heading: Localized;
  paragraphs: LocalizedList;      // en paragraphs + hi paragraphs
  bullets?: LocalizedList;
  diagram?: DiagramKind;
}

export type DiagramKind =
  | 'tables' | 'select-flow' | 'filter' | 'sort' | 'join-venn'
  | 'group-buckets' | 'subquery-nest' | 'window-frame' | 'cte-chain'
  | 'index-tree' | 'transaction' | 'null-concept' | 'distinct'
  | 'limit-paginate' | 'case-branch' | 'union-merge' | 'trigger-flow'
  | 'acid' | 'normalization' | 'data-types';

export interface TutorialSpec {
  title: Localized;
  /** code typed in the step (cumulative final query text for that step) */
  steps: TutorialStep[];
}

export interface TutorialStep {
  code: string | null;            // null = explanation-only step
  run?: boolean;                  // execute the typed code at end of step
  table?: { name: string; highlightWhere?: string; fadeOthers?: boolean };
  explanation: Localized;
}

export interface SyntaxInfo {
  template: string;
  parts: { part: string; description: Localized }[];
}

export interface Example {
  tag: TaskDifficulty;
  query: string;
  note?: Localized;               // shown before output
  explanation: Localized;
}

export interface CommonMistake {
  mistake: Localized;
  correction: Localized;
}

// ============ PRACTICE TASKS ============

export interface PracticeTask {
  id: string;                     // "task-1"
  difficulty: TaskDifficulty;
  /** business context + instruction, EN & HI */
  description: Localized;
  /** authoritative solution query — expected result computed at runtime */
  solution: string;
  /**
   * For DDL tasks (CREATE VIEW/INDEX/TRIGGER): after user query runs, this query
   * is executed on the user's DB and compared with same query run against a
   * reference DB where `solution` was applied.
   */
  verifyQuery?: string;
  /** expected column names (optional, purely informative for the user) */
  expectedColumns?: string[];
  hints: [Hint, Hint, Hint];
  validation: Partial<ValidationRules>;
}

export interface Hint {
  level: 1 | 2 | 3;
  type: 'concept' | 'structure' | 'partial';
  content: Localized;
}

export interface ValidationRules {
  ignoreColumnOrder: boolean;
  ignoreRowOrder: boolean;
  caseSensitiveData: boolean;
  trimWhitespace: boolean;
  numericTolerance: number;
  checkColumnNames: boolean;
}

export const DEFAULT_RULES: ValidationRules = {
  ignoreColumnOrder: true,
  ignoreRowOrder: true,
  caseSensitiveData: false,
  trimWhitespace: true,
  numericTolerance: 0.01,
  checkColumnNames: false,
};

// ============ QUERY RESULTS ============

export type Cell = string | number | null;
export interface QueryResult {
  columns: string[];
  rows: Cell[][];
}

export interface QueryError {
  message: string;
}

export type QueryOutput =
  | { kind: 'result'; result: QueryResult; elapsedMs: number }
  | { kind: 'error'; error: string };

// ============ VALIDATION ============

export interface ValidationResult {
  status: 'SUCCESS' | 'WRONG' | 'ERROR';
  message: Localized | string;
  diff?: DiffInfo;
  technicalError?: string;
  suggestion?: Localized | string;
  userResult?: QueryResult;
  expectedResult?: QueryResult;
}

export interface DiffInfo {
  expectedColumns: string[];
  gotColumns: string[];
  expectedRows: Cell[][];
  gotRows: Cell[][];
  analysis: string[];
}

// ============ QUIZ ============

export type QuizQuestion =
  | MCQQuestion
  | OutputPredictionQuestion
  | QueryBuildingQuestion
  | FillBlanksQuestion;

export interface MCQQuestion {
  type: 'mcq';
  question: Localized;
  options: Localized[];
  correctIndex: number;
  explanation: Localized;
}

export interface OutputPredictionQuestion {
  type: 'output_prediction';
  queryShown: string;
  question: Localized;
  options: { label: string; result: QueryResult | { error: string } }[];
  correctIndex: number;
  explanation: Localized;
}

export interface QueryBuildingQuestion {
  type: 'query_building';
  description: Localized;
  wordBank: string[];
  correctSequence: string[];
  explanation: Localized;
}

export interface FillBlanksQuestion {
  type: 'fill_blanks';
  template: string;               // "SELECT ___(salary) FROM employees ___ department"
  blanks: { options: string[]; correct: string }[];
  explanation: Localized;
}

// ============ PROJECTS ============

export interface Project {
  id: string;                     // "p1" | "lp1" | "capstone"
  kind: 'mini' | 'level' | 'capstone';
  moduleNumber: number;           // associated module
  order: number;
  title: Localized;
  subtitle: Localized;
  dataset: DatasetId;
  intro: Localized;
  skillsTested: string[];
  estimatedTime: string;
  tasks: ProjectTask[];
}

export interface ProjectTask {
  id: string;
  difficulty: TaskDifficulty;
  businessContext: Localized;
  taskDescription: Localized;
  solution: string;
  verifyQuery?: string;
  expectedColumns?: string[];
  hints: [Hint, Hint, Hint];
  validation: Partial<ValidationRules>;
}
