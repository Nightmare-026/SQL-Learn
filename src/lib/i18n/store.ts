'use client';

import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import type { Lang } from '@/types/content';
import { ui } from '@/content/locales';

/** localStorage can throw (private mode / quota) — degrade to memory only. */
const safeLocalStorage: StateStorage = {
  getItem: (name) => {
    try { return localStorage.getItem(name); } catch { return null; }
  },
  setItem: (name, value) => {
    try { localStorage.setItem(name, value); } catch { /* noop */ }
  },
  removeItem: (name) => {
    try { localStorage.removeItem(name); } catch { /* noop */ }
  },
};

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
    { name: 'sqlLearnLang', storage: createJSONStorage(() => safeLocalStorage) }
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
