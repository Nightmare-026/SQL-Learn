'use client';

// ============ Friendly error feedback (spec §11) ============

import type { Localized } from '@/types/content';

export interface FriendlyError {
  title: Localized;
  suggestion: Localized | null;
}

interface Pattern {
  test: RegExp;
  build: (m: RegExpMatchArray) => FriendlyError;
}

const PATTERNS: Pattern[] = [
  {
    test: /near "FORM"/i,
    build: () => ({
      title: { en: `You typed "FORM" — the correct keyword is "FROM". Very common typo!`, hi: `Aapne "FORM" likha hai — sahi keyword "FROM" hai. Yeh bahut common typo hai!` },
      suggestion: null,
    }),
  },
  {
    test: /near "WERE"/i,
    build: () => ({
      title: { en: `"WERE" looks like a typo — the keyword is "WHERE".`, hi: `"WERE" spelling galat lag rahi hai — keyword "WHERE" hai.` },
      suggestion: null,
    }),
  },
  {
    test: /near "SELEC"/i,
    build: () => ({
      title: { en: `"SELEC" is incomplete — spell it "SELECT".`, hi: `"SELEC" adhura hai — poora spell karo "SELECT".` },
      suggestion: null,
    }),
  },
  {
    test: /near "GROUP"/i,
    build: () => ({
      title: { en: `SQLite expected a full clause here. "GROUP" must be followed by "BY" (GROUP BY).`, hi: `Yahan poori clause chahiye. "GROUP" ke baad "BY" aata hai (GROUP BY).` },
      suggestion: null,
    }),
  },
  {
    test: /no such table: (\w+)/i,
    build: (m) => ({
      title: {
        en: `Table "${m[1]}" doesn't exist in this database.`,
        hi: `Table "${m[1]}" is database me nahi hai.`,
      },
      suggestion: {
        en: `Check the Schema panel on the left for the exact table names.`,
        hi: `Left side ke Schema panel me sahi table names dekho.`,
      },
    }),
  },
  {
    test: /no such column: ([\w.]+)/i,
    build: (m) => {
      const raw = m[1];
      const col = raw.includes('.') ? raw.split('.')[1] : raw;
      return {
        title: {
          en: `Column "${col}" doesn't exist.`,
          hi: `Column "${col}" exist nahi karta.`,
        },
        suggestion: {
          en: `Open the table in the Schema panel to see its columns. If two tables both have this column, prefix it with the table name.`,
          hi: `Schema panel me table kholo aur columns dekho. Agar do tables me same column hai, to table name ke saath prefix karo.`,
        },
      };
    },
  },
  {
    test: /unterminated string/i,
    build: () => ({
      title: { en: `A string is missing its closing quote — '...' needs both quotes.`, hi: `String ka closing quote missing hai — '...' dono quotes chahiye.` },
      suggestion: null,
    }),
  },
  {
    test: /ambiguous column name: (\w+)/i,
    build: (m) => ({
      title: {
        en: `Column "${m[1]}" is ambiguous — it exists in more than one joined table.`,
        hi: `Column "${m[1]}" ambiguous hai — yeh ek se zyada tables me hai.`,
      },
      suggestion: {
        en: `Prefix it with the table (or alias) name, e.g. students.name`,
        hi: `Table (ya alias) ke naam se prefix karo, jaise students.name`,
      },
    }),
  },
  {
    test: /misuse of aggregate/i,
    build: () => ({
      title: {
        en: `You mixed an aggregate (like COUNT) with plain columns — add a GROUP BY for the plain columns.`,
        hi: `Aapne aggregate (jaise COUNT) aur normal columns mix kar diye — normal columns ke liye GROUP BY lagao.`,
      },
      suggestion: null,
    }),
  },
  {
    test: /no such function: (\w+)/i,
    build: (m) => ({
      title: { en: `Function "${m[1]}" doesn't exist in SQLite.`, hi: `Function "${m[1]}" SQLite me exist nahi karta.` },
      suggestion: {
        en: `Check spelling — common functions: COUNT, SUM, AVG, MIN, MAX, UPPER, LOWER, SUBSTR, ROUND, DATE.`,
        hi: `Spelling check karo — common functions: COUNT, SUM, AVG, MIN, MAX, UPPER, LOWER, SUBSTR, ROUND, DATE.`,
      },
    }),
  },
  {
    test: /wrong number of arguments to function (\w+)/i,
    build: (m) => ({
      title: { en: `Function "${m[1]}" got the wrong number of arguments.`, hi: `Function "${m[1]}" ko galat number of arguments diye gaye.` },
      suggestion: null,
    }),
  },
  {
    test: /FOREIGN KEY constraint failed/i,
    build: () => ({
      title: {
        en: `Foreign key constraint failed — you referenced an id that doesn't exist in the parent table.`,
        hi: `Foreign key constraint fail hua — aapne aisi id use ki jo parent table me nahi hai.`,
      },
      suggestion: null,
    }),
  },
  {
    test: /UNIQUE constraint failed/i,
    build: () => ({
      title: { en: `UNIQUE constraint failed — this value already exists.`, hi: `UNIQUE constraint fail hua — yeh value pehle se exist karti hai.` },
      suggestion: null,
    }),
  },
  {
    test: /NOT NULL constraint failed/i,
    build: () => ({
      title: { en: `NOT NULL constraint failed — a required value is missing.`, hi: `NOT NULL constraint fail hua — zaroori value missing hai.` },
      suggestion: null,
    }),
  },
  {
    test: /CHECK constraint failed/i,
    build: () => ({
      title: { en: `CHECK constraint failed — the value is outside the allowed range.`, hi: `CHECK constraint fail hua — value allowed range se bahar hai.` },
      suggestion: null,
    }),
  },
  {
    test: /near "___"/i,
    build: () => ({
      title: { en: `There's a leftover "___" blank in your query — replace it with real values.`, hi: `Aapki query me "___" blank bacha hai — usse real values se replace karo.` },
      suggestion: null,
    }),
  },
];

export function matchFriendlyError(rawError: string): FriendlyError | null {
  for (const p of PATTERNS) {
    const m = rawError.match(p.test);
    if (m) return p.build(m);
  }
  return null;
}

/** Extract line/column hints when SQLite reports positions. */
export function extractPosition(rawError: string): { line?: number; column?: number } {
  const near = rawError.match(/near "([^"]+)"/);
  if (!near) return {};
  return {};
}
