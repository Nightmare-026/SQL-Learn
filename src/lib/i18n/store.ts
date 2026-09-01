'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Lang } from '@/types/content';
import { ui } from '@/content/locales';

interface LangStore {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
}

export const useLangStore = create<LangStore>()(
  persist(
    (set, get) => ({
      lang: 'en',
      setLang: (lang) => set({ lang }),
      toggle: () => set({ lang: get().lang === 'en' ? 'hi' : 'en' }),
    }),
    { name: 'sqlLearnLang', storage: createJSONStorage(() => localStorage) }
  )
);

/** Hook: t('nav.modules') → localized UI string. */
export function useT() {
  const lang = useLangStore((s) => s.lang);
  return (key: string): string => {
    const entry = ui[key];
    if (!entry) return key;
    return entry[lang];
  };
}

export function useLang(): Lang {
  return useLangStore((s) => s.lang);
}
