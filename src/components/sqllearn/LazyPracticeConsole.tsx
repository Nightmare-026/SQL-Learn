'use client';

// ============ Lazy-loaded Practice Console ============
// The console pulls the whole SQL engine (sql.js) into its chunk. Loading it
// lazily keeps the engine OUT of the initial page bundle, so landing,
// dashboard, theory and quizzes paint fast even on slow connections.
//
// NOTE: never statically import PracticeConsole here — that would pull the
// engine chunk back into the eager bundle.

import React from 'react';

export const LazyPracticeConsole = React.lazy(() =>
  import('./PracticeConsole').then((m) => ({ default: m.PracticeConsole }))
);

export function ConsoleSuspense({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <React.Suspense
      fallback={
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-neutral-500">
          <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">{label}</p>
        </div>
      }
    >
      {children}
    </React.Suspense>
  );
}
