# Worklog — SQL Learning Platform Build

---
Task ID: 1
Agent: main (Super Z)
Task: Build complete SQL Learning Platform per /home/z/my-project/upload/LearnSQL.md spec

Work Log:
- Read full spec (3359 lines): 60 modules, 300 tasks, 240 quiz questions, 10 projects, EN/HI, sql.js, localStorage progress
- Initialized fullstack env (Next.js 16 + Tailwind 4 + shadcn/ui), installed sql.js@1.14.2, copied WASM to /public/sql-wasm
- Architecture decisions: hash-based routing inside single `/` route (sandbox-safe), runtime expected-result computation from solution queries (guarantees validation correctness), deterministic seeded datasets

Stage Summary:
- Foundation ready; building engine + content next

---
Task ID: 2-3-5-6-7-8 (partial)
Agent: main (Super Z)
Task: Author + validate all 60 modules / 316 tasks / 240 quiz questions

Work Log:
- Authored 60 modules across beginner-*.ts, intermediate-*.ts, advanced-*.ts (theory, tutorials, syntax, examples, mistakes, quizzes, tasks with 3-level hints, EN/HI)
- Built builder.ts DSL; registry.ts; index.ts (auto-generated)
- Fixed double-wrap bug in defineModule; verified 316 solutions execute via scripts/validate-content.ts
- Fixed quiz facts against real seeded data via scripts/validate-quiz.ts (dataset facts: eco revenue 37.8M/aov 75593; adv revenue 51.5M/aov 102928; 66/65 delivered customers)
- Reworked M51 (SQLite views are read-only), M48 (DATE literals), M37/M38 (ecommerce data), M58 (advanced dataset)
- Added engine splitSql/execScript (statement-wise, BEGIN/CASE-aware) + exec prepare-fallback for PRAGMA/zero-row

Stage Summary:
- ALL TASK SOLUTIONS VALID (316), ALL QUIZ FACTS VALID (60 output_prediction), structure checks pass
- Remaining: projects, UI, E2E

---
Task ID: 8-16 (complete)
Agent: main (Super Z)
Task: UI + full E2E verification of the SQL Learning Platform

Work Log:
- Built all UI: TopBar (modules dropdown w/ level locks, EN/HI toggle, progress), landing, dashboard, module page (theory/quiz/practice/summary tabs), 3-panel console (schema tree + editor w/ syntax highlighting + results/validation/diff/hints), animated tutorial engine, quiz engine (MCQ + output prediction + query building + fill blanks), projects (10), search, sandbox, settings (backup/export/import/reset)
- 20 SVG concept diagrams; 900+ EN/HI strings; mobile warning banner
- Fixed: sql.js browser WASM (copied sql-wasm-browser.wasm), zustand selector infinite loop (getSnapshot cache), useRef import, task auto-advance + first-unpassed init, verifyQuery builder field
- E2E (agent-browser): golden path M1 full completion (theory read → quiz 100% → 3/5 tasks → module complete → M2 unlock → navigation), Hinglish toggle, dashboard, search (7 "join" hits), sandbox run (real e-commerce tables), settings import/export (40-module backup → advanced unlock → M41 window functions pass at 102927.66), hints 1→3 + skip, mobile viewport + warning banner
- Final state: 0 browser console errors, 0 lint errors (3 cosmetic warnings), all 316 task solutions + 60 quiz facts + 69 project tasks + 3 datasets validated

Stage Summary:
- Platform complete and browser-verified per spec (27 locked requirements)

---
Task ID: 17
Agent: main (Super Z)
Task: Rebuild all concept diagrams as REAL-TABLE visualizations (user feedback: explain DB concepts through actual tables with labeled rows/columns, not abstract boxes)

Work Log:
- Rewrote src/components/sqllearn/Diagram.tsx entirely: new reusable SVG `Tbl` mini-table renderer (title bar, PK/FK header badges, zebra rows, column bands, row bands, cell tints, ✓/✗ marks, strikethrough, partitions) + annotation helpers (chip, vExt ↕ for COLUMN, hExt ↔ for ROW, leader lines, arrows per color)
- All 20 DiagramKind cases rebuilt on real tables: tables (flagship: students table w/ COLUMN/ROW/CELL/PK annotations), select-flow (projection), filter (WHERE row survive/drop), sort (connector lines showing reorder), distinct (strikethrough dupes), limit-paginate (page 1/2 row tints), null-concept (NULL vs '' vs value cells), group-buckets (city color groups → COUNT/SUM result), join-venn (customers↔orders FK match lines → joined result), subquery-nest (inner AVG table feeds outer WHERE), window-frame (partitions + running_sum computed column), cte-chain (3-table pipeline), index-tree (users table + B-tree path), transaction (before/mid/COMMIT/ROLLBACK), case-branch (marks→grade computed column), union-merge (stack + dedup), trigger-flow (INSERT → audit_log auto row), acid (4 mini-table panels), normalization (messy table → split students/departments w/ FK link), data-types (typed columns + rejected row)
- Bilingual labels: useLang() from @/lib/i18n/store; all pedagogical labels/captions EN+HI (table data & SQL keywords stay English deliberately)
- Fixed 7 pre-existing blank diagram slots (section(…, []) passed as diagram arg → TS never[] errors, rendered EMPTY svg boxes since original build): M10 → select-flow, M19 → limit-paginate, M30 → group-buckets, M39 → cte-chain, M49 → window-frame, M58 → index-tree, M60 → cte-chain. src TS errors 23 → 16 (all remaining pre-existing)
- Layout fixes via VLM screenshot verification loop: tables flagship (vExt inside name column band, ROW highlight moved to last row, CELL leader exits below table), join-venn (labels repositioned off table bottoms/marks), select-flow, filter legend, subquery-nest chip/labels, window-frame partition labels, data-types rejected label, normalization note, union-merge arrow, trigger-flow stray arrow removed
- Verified in browser (agent-browser + VLM): all 20 kinds + 7 newly assigned = every diagram module page screenshot-verified CLEAN (m1,4,5,8,10,11,16,17,19,21,30,36,38,39,45,46,49,53,54,55,57,58); HI toggle verified (Hindi labels प्राइमरी की/कॉलम/पंक्ति/सेल render); fresh page loads 0 console errors
- bun validate-content: 316 tasks VALID · validate-quiz: 60 VALID · validate-projects: 69 VALID

Stage Summary:
- All 123 diagram usages across 60 modules now render real-table concept diagrams (was: abstract boxes + 7 blank boxes)
- Diagram component ~1030 lines, deterministic geometry helpers, bilingual
- No new TS errors; all content validation still passes

---
Task ID: 18
Agent: main (Super Z)
Task: Expert hardening pass — comprehensive content quality, performance, security, and exception-handling improvements (user feedback: "make learning contents better/comprehensive/understandable, clean consistent structured, no broken/vague/wrong content, improve performance, fast secure, handle all user-interaction exceptions, industry-standard diagrams")

Work Log:
- AUDIT: read all core files (page.tsx, ModulePage, PracticeConsole, QuizTab, AnimatedTutorial, Diagram, engine, stores, validator, errorMatcher, locales, types, next.config); ran all validators (316 tasks / 60 quiz / 69 project tasks / blanks — all VALID); verified all 20 diagram kinds for technical correctness (math, join semantics, NULL semantics, ACID, normalization — all correct)
- CRITICAL BUG FIXES:
  * HintPill invisible regression: internal open=false state + no toggle → ALL hints hidden. Fixed (parent-controlled reveal), progressive reveal now 0→task.hints.length, per-task state reset via render-phase adjustment pattern
  * XSS in SandboxRunner: highlighter escaped only & (not < >) → HTML injection via user query. Fixed with escapeHtml; verified in browser with <img onerror>/<script> payload → renders as plain text, no execution
  * Landing page literal "\n" bug: JSX text renders backslash-n as text in mock console → replaced with template literal (real newlines)
  * WASM/engine failure → infinite spinner (no .catch): PracticeConsole + SandboxRunner + ModulePage + ProjectsPage now show bilingual error panel with Retry; engine initPromise rejection is no longer cached (retry works)
  * Hint stats inflation: bumpStats used absolute count per reveal (+2 for opening hint 2) → now only +1 for newly revealed hints
  * Language desync: importState set progress.language without syncing useLangStore → mixed-language UI. Now synced
- CONTENT QUALITY:
  * Friendly errors localized (were always-English via `t === 'dummy' ? 'en' : 'en'`) + suggestion line now displayed
  * QuizTab: t0() hardcoded English labels → locales (quiz.build.desc etc.); intro title lang-aware
  * ModulePage/Settings/Sandbox: all hardcoded English strings localized (confirm buttons, stats labels, quiz count, project not-found/unlock, loading)
  * Diagram precision: window-frame OVER chip now shows ORDER BY id (running sums require it — industry-precise)
  * Consistent stats: TOTAL_TASKS derived from curriculum index (316) everywhere (was 300 on landing vs 316 on dashboard); quiz 240, hints 948; metadata + hero copy updated
  * Fixed 15 pre-existing TS errors: ProjectTask difficulty union → TaskDifficulty (14 in projects/index.ts), never[] list in dashboard
- PERFORMANCE:
  * sql.js moved to dynamic import inside engine (wrapper no longer in eager bundle)
  * PracticeConsole lazy-loaded via React.lazy + Suspense (shared LazyPracticeConsole module; ModulePage + ProjectPage use it)
  * Verified with performance API: fresh theory page loads 23 JS resources with ZERO wasm/sql.js/console chunks (engine fetched only when Practice tab opened)
- SECURITY:
  * next.config.ts security headers: CSP (wasm-unsafe-eval, object-src none, frame-ancestors self, etc.), X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy — verified live via curl
  * ENGINE_LIMITS: 100k char query cap, 500 statement/script cap (DoS guard)
  * importState deep sanitization: module-id regex, array/number clamps, "completed" demoted unless genuinely ≥3 tasks AND quiz ≥70; malicious import verified safe (no crash, no fake completion)
  * Safe localStorage adapters for both zustand persist stores (private mode / quota errors)
- EXCEPTION HANDLING:
  * AppErrorBoundary (React class boundary) wrapping the router — graceful bilingual crash panel instead of white screen
  * unhandledrejection listener (console.warn)
  * All async interactions wrapped: clipboard (3 sites, error toasts), blob download, AnimatedTutorial run, loadModule/loadProjects, sandbox run
  * ProjectPage stale taskIdx across project switches → fixed via key={projectId} remount
  * Task-switch state leaks (hints/results/attempts) → render-phase reset
- VALIDATION (final): 0 src TS errors (was 15), 0 lint errors (2 cosmetic warnings, baseline was 3), all content validators pass, dev server 200, browser E2E verified: landing (stats + mock console), M1 theory (VLM clean), hints 1→2 visible + task pass + auto-advance, sandbox XSS neutralized (VLM), Hindi UI + diagram + quiz feedback + settings confirm, mobile 390px layout (VLM clean, warning banner), malicious + valid imports, language sync, code-split network proof

Stage Summary:
- Learning platform hardened across all 4 requested dimensions (content quality, performance, security, exception handling)
- 6 user-visible bug fixes (hints, XSS, \n literal, spinners, stats, language sync) + 15 TS errors eliminated
- All 316 tasks / 60 quiz facts / 69 project tasks still VALID; browser-verified with zero console errors

---
Task ID: 19
Agent: main (Super Z)
Task: Diagnose "website not opening" report + fix root cause

Work Log:
- Full server health check: Next.js dev on :3000 running (HTTP 200, ~25-50ms), Caddy proxy :81 healthy, WASM engine served correctly (658KB at /sql-wasm/sql-wasm-browser.wasm, HTTP 200), fresh browser session shows ZERO console errors, landing/dashboard/module pages render with content intact
- Diagnosed stale console errors (page.tsx:841/875-877) as Fast Refresh history artifacts — fresh session clean, source lines verified correct
- FOUND + FIXED real robustness bug: app is hash-router based (/#/module/N), but any hash-less path URL (/module/60, /projects, etc. from shared links, URL-mangling proxies/CDNs, search engines, or manual typing) hit a dead Next.js 404 with no navigation back — the most likely server-side contributor to "website not opening"
- FIX: added src/app/[...slug]/page.tsx catch-all — client-side redirect converts ANY path URL to equivalent hash URL via location.replace() (no back-button pollution). First tried next/navigation redirect() but it strips the fragment (/#/module/1 → /#/), so switched to deterministic client-side URL rewrite
- Verified: /module/1, /module/5, /module/60, /dashboard, /projects, /project/orders-analytics, /search, /sandbox, /settings all return HTTP 200 and render the app (deep link /module/1 shows full M1 module page, URL correctly becomes /#/module/1); tested both direct :3000 and proxy :81; root / unaffected; src/ TypeScript errors: 0
- Note: user's 98% progress (59/60 modules) lives in browser localStorage per-origin — unaffected by any server restart

Stage Summary:
- Website confirmed 100% healthy server-side; deep-link 404 robustness bug fixed with catch-all hash redirect
- All routes now work with OR without hash; zero console errors; zero src TS errors

---
Task ID: 20
Agent: main (Super Z)
Task: Engagement/UX upgrade — answer user's card-vs-page design question + implement anti-bore/anti-frustration features

Work Log:
- ANSWERED DESIGN QUESTION: current hybrid layout (ONE continuous scrollable page composed of distinct card-sections) is industry-standard (Khan Academy / freeCodeCamp / Coursera pattern) — separate pages per concept fragment reading flow with extra clicks; one undivided blob overwhelms. Kept hybrid, enhanced it.
- NEW in TheoryTab (ModulePage.tsx):
  * Sticky TOC rail (top-[57px], matches measured TopBar height) with numbered section chips (🎯 + 01..N + ⌨💡⚠), active-section tracking, smooth scroll, mobile horizontal scroll
  * Live reading progress: gradient bar + "X% read" label, rAF-throttled scroll math
  * Numbered gradient badges (01, 02...) on each theory section + per-section "~X min" estimate (word-count/180wpm heuristic)
  * Reveal scroll animations (IntersectionObserver once-only, opacity-0/translate-y-3 → visible; respects prefers-reduced-motion via module-level const; IO-missing fallback shows content)
  * Resume-reading: scroll position saved per module in sessionStorage (private-mode safe), floating "Resume reading ↓" pill on return (10s auto-dismiss), click → exact smooth scroll-back
- Module header: "Verified content · industry-standard SQL" trust badge (BadgeCheck icon)
- SummaryTab: completion celebration — dependency-free CSS confetti (64 pieces, 7 brand colors, once per session via sessionStorage flag, aria-hidden, reduced-motion skip) + gradient "Congratulations/Badhai ho!" banner
- 8 new i18n keys (EN+HI): theory.progress/minRead/resume/verified/goToSection, summary.celebrate/celebrateSub
- Fixed 3 lint errors during implementation: ref-during-render in resume hook (→ lazy useState initializer from sessionStorage), sync setState in effect (→ same lazy init + timer-only effect), unused eslint-disable; removed unused dismissResume
- VERIFIED in browser: sticky TOC renders + chip click scrolls (chip 4 → pos 1631, active chip "03"), progress bar updates (68% at mid-scroll, 96% near bottom), resume pill after reload → click restores exact 2500px, injected completed module → celebration banner + confetti + trophy + stats (VLM-verified clean, no layout issues), Hindi mode fully localized ("96% padha", "Aap kya seekhenge", chips in Hindi), test data cleaned, 0 console errors, code-splitting intact (0 wasm/engine resources on theory page)
- tsc: 0 src errors; eslint on changed files: clean

Stage Summary:
- Theory reading experience upgraded with orientation (TOC), progress feedback, time estimates, motion, and resume-reading
- Completion now celebrates (confetti + bilingual banner)
- Trust badge added; performance/security posture unchanged (verified)

---
Task ID: 21
Agent: main (Super Z)
Task: Convert ALL 60 module theory pages to the reference image format (SQLBolt-style editorial lesson layout) — user request: "learning content ko is image ke format me convert karo bina mistake ke sabhi pages ke"

Work Log:
- Analyzed both uploaded reference images via VLM: image 2 = SQLBolt "Introduction to SQL" lesson (clean editorial: narrow reading column, H2 subheadings, readable prose, gray "Did you know?" callouts, real data tables with caption "Table: Vehicles"); image 1 = styled lesson platform (duration badges, dark code blocks, warning callouts)
- REDESIGNED TheoryTab (ModulePage.tsx) to editorial lesson format:
  * Reading column: max-w-3xl mx-auto (narrow, lesson-like; TOC constrained to same column)
  * Removed all card chrome (rounded-2xl border shadow cards) → flat sections separated by border-t + generous pt-8/pb-7 spacing
  * Numbered H2 headings ("1. Heading" with brand-colored number prefix), text-[22px]
  * Editorial prose: text-[15px] leading-7 text-neutral-800 (darker, larger, more readable than previous 14px gray)
  * Section bullets → "Key takeaways/Zaroori baatein" gray callout panel (bg-neutral-100/90, mirrors SQLBolt's "Did you know?" box)
  * Objectives → gray intro callout at top
  * Diagrams (real tables) → bordered container with overflow-x-auto, keeps row/column/PK labels
  * Syntax → flat section, dark SQLCode block + parts
  * Examples → flat section with divide-y rows
  * Mistakes → amber left-border editorial callouts (Galti/Fix two-column)
  * Kept all engagement features: sticky TOC chips, reading progress bar, resume pill, Reveal animations, mark-read button, ~X min estimates (subtle, hidden on mobile), Verified badge in header
- Added i18n keys: theory.keyPoints (EN/HI), theory.lesson
- VERIFIED COMPREHENSIVELY:
  * Full 60-module sweep (scripts/sweep-modules.js): 60/60 OK — every module renders column, H2s (4-7), paragraphs (8-14), callouts (3-5), diagrams (5-6), read button, ZERO overflow
  * VLM visual checks: editorial layout PASS (flat sections, numbered H2, readable prose, gray callouts — "high-fidelity match to SQLBolt reference"), diagram table fits, examples + mistakes sections clean
  * Hindi mode: fully working ("Zaroori baatein", "32% padha", chips in Hindi)
  * Mobile 390px: layout clean; SQL code blocks contained (parent overflow-x-auto handles long lines — verified scrollable, not broken)
  * 0 console errors across entire sweep
  * Content validators: 316 tasks VALID, 60 quiz VALID, 69 project tasks VALID (content untouched — presentation-only change)
  * tsc 0 src errors, eslint clean

Stage Summary:
- All 60 theory pages now render in SQLBolt-style editorial lesson format matching the reference images
- Zero content changes (no mistake risk) — pure presentation layer; all validators still pass
- 60/60 module sweep verified: no overflow, no console errors, EN+HI, mobile OK

---
Task ID: 22
Agent: main (Super Z)
Task: Remove sticky section navigator + unify learning-content container width with all other components (user: "sticky section navigator ko remove karo aur learning content ke container page ko baki sabhi components ki width ke barabar rakho, with height and other consistency ka khyal rakhe aur design ko expert like designed consistent banao")

Work Log:
- REMOVED sticky TOC rail entirely (pill chips + reading-progress bar + "% read" label) from TheoryTab — user request
- Removed dead code: sections useMemo, useActiveSection hook, useReadingProgress hook, contentRef (2 fewer scroll listeners → perf win)
- WIDTH UNIFICATION — learning content container now spans the full page container (max-w-6xl = 1120px rendered), identical to header/tabs/practice/footer:
  * TheoryTab: max-w-3xl mx-auto wrapper removed; sections, dividers, objectives/keys callouts, diagrams, code blocks, examples, mistakes = full width
  * Prose paragraphs keep max-w-3xl measure cap (editorial typography — full-width 1100px text lines would be unreadable; headings/figures/cards still span full width = deliberate breakout pattern)
  * QuizTab: max-w-2xl mx-auto py-8 px-4 removed (also killed double px-4 padding vs root) — question cards full width; intro/done centered moment-screens kept
  * SummaryTab: max-w-2xl mx-auto py-4 removed — checklist + recap now side-by-side lg:grid-cols-2 (548px each), stats + next-module full width
  * Objectives + Key-takeaways lists: adaptive 2-col grid on sm+ when >1 item (fills wide cards deliberately)
- CONSISTENCY POLISH:
  * scroll-mt-[120px] → scroll-mt-20 (80px) recalibrated for TopBar-only sticky (was TOC-offset)
  * Resume-reading pill moved bottom-center → bottom-right (right-4 sm:right-6): sits in empty space right of the 768px prose measure instead of overlapping text (VLM had flagged the overlap)
  * Removed dead locale keys: theory.progress, theory.goToSection
- VERIFIED (agent-browser + VLM, EN + HI):
  * DOM measurements @1440px: header 1120/tab row 1120/objectives 1120/quiz card 1120/practice panel 1120/summary grid 1120 — ALL EQUAL, left edge 80px aligned; prose 768px measure; sticky TOC absent
  * VLM: no overlap/cutoff/misalignment across theory (M1+M5 diagrams), quiz, summary (2-col grid + confetti OK)
  * Mobile 390px: single column (grid collapses), edges align at 12px, no horizontal overflow, diagrams scale
  * Practice tab: SQL.js engine loads, editor renders, 1120px panel
  * Console: 0 errors; lint: 0 errors (2 pre-existing cosmetic warnings); compiles clean
- Content untouched — presentation-only change (all validators unaffected)

Stage Summary:
- Sticky section navigator gone; every tab's container now width-identical (1120px @1440 viewport) with unified vertical rhythm
- Design: editorial breakout layout (full-width structure + readable prose measure) — expert-consistent across all 60 modules

---
Task ID: 23
Agent: main (Super Z)
Task: Fix animated tutorial (show player ONLY where animation plays + make animation advanced/understandable) + fix blue-on-black code colors (user: "animation play karne wala feature sabhi slides par show hai jya animation hai bhi nahi... animation ko aur improve aur advanced banao... kahi kahi blue text aur uska background black hai — light cyan ya grey chahiye")

Work Log:
- ANALYSIS: tutorial data = 295 steps across 60 modules (225 with code + 70 explanation-only); every module follows pattern [narrative intro, 2-4 code steps, optional narrative outro]. Old player showed ALL steps incl. explanation-only ones → step 1 had NO animation, duplicated explanation text in both panes (user's screenshot showed exactly this). Also discovered: every code step has a `table: {name, highlightWhere, fadeOthers}` field that was NEVER rendered (dead spec §24 row-highlighting feature).
- PLAYER RESTRUCTURE (AnimatedTutorial.tsx, full rewrite):
  * Steps split: narrative intro → branded ✦ lead-in card ABOVE player; narrative outro → neutral ✓ closing card BELOW; player carousel contains ONLY code (animated) steps → "player only where animation plays"
  * Auto-play: types step → runs (if run:true) → 2.4s hold → auto-advances to next step → continues to end; Play becomes Pause mid-run and Replay when finished
  * Speed control: 1×/1.5×/2× button (chars-per-tick + hold delays scale)
  * LIVE SOURCE TABLE (the previously-dead feature, now real): on Play, engine fetches `SELECT rowid, * FROM <table> LIMIT 10` + `SELECT COUNT(*)` + `SELECT rowid FROM t WHERE <highlightWhere>` → as typing crosses the WHERE/HAVING/ON/GROUP BY clause, matching rows highlight (blue band + left accent), non-matching fade (0.28), staggered 30ms CSS transitions, "N/M rows match" chip — highlightWhere is evaluated by the REAL SQL ENGINE so highlighting is always semantically correct (e.g. `email = NULL` correctly matches 0 rows — teaching moment preserved); no condition → whole-table scan highlight
  * Result reveal: run steps execute via runIsolated → ResultTable pops in with tut-reveal animation + "✓ Result · N rows" header
  * Typing progress: gradient progressbar (aria progressbar) + % label + "runs live" hint
  * Per-table cache (Map ref) so step switches don't re-query; engine still lazy-loads ONLY on first Play (code-splitting preserved — placeholder "Press Play" card before first play)
  * Graceful degradation: engine failure → code typing still works, table pane hides, no crash
- COLOR FIX (blue-on-black): new `.sql-dark` CSS scope in globals.css with light high-contrast token palette — keyword #67E8F9 (light cyan, user-requested), function #C4B5FD, string #86EFAC, number #FCD34D, punct #CBD5E1 (light grey), operator #FDBA74, ident #E2E8F0, null #FCA5A5. Applied sql-dark to ALL dark code surfaces: SQLCode (theory syntax), SQLChip (examples + quiz query-building answers), AnimatedTutorial code pane, QuizTab fill-blanks dark block. Light-theme token colors unchanged for white editor.
- 6 new locale keys (EN/HI): theory.speed/liveTable/rowsMatch/pressPlay/result
- FIXED during verification: grid min-width blowout on mobile (live table forced 621px holder) → `min-w-0` on both player grid columns → table now scrolls inside its 332px bordered container
- VERIFIED (agent-browser + VLM, EN + HI, desktop 1280 + mobile 390):
  * M9: intro card → placeholder → Play → typing (light cyan keywords) → live table (6 highlighted + 4 faded of 10 shown, "7/50 rows match" chip — real data) → auto-advance → run step result reveal (6 real rows: Ritu Sharma Delhi 18...) → Step 3/3 + Replay
  * Speed cycle 1×→1.5×→2× works; step dots jump; pause/resume; replay-from-start
  * VLM: all states pass — no duplicated explanation panes, readable light cyan on dark (keyword computed color rgb(103,232,249) on rgb(15,23,42)), clean layout, result table distinct
  * Mobile 390: single column, table contained + internally scrollable, code panel readable
  * M33 (4 code steps, no outro) + M1 (intro+outro cards render bilingual) OK
  * 0 console errors, 0 lint errors (1 pre-existing warning), compiles clean; content untouched

Stage Summary:
- Tutorial player now appears with real animation in every visible step (explanation-only steps became narrative cards) — matches user request exactly
- Animation upgraded: auto-play with speed control, typing progress, live row-highlighting table (engine-evaluated, zero content-mistake risk), result reveal
- Blue-on-black eliminated across all dark code surfaces via .sql-dark light-cyan/grey theme
