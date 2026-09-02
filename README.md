<div align="center">

# 🎓 SQL Learn

### Master SQL — From First Query to Production Expert

[![Live Demo](https://img.shields.io/badge/Live_Demo-Active-success?style=for-the-badge&logo=vercel)](https://sql-learn-two.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![SQLite WASM](https://img.shields.io/badge/SQLite-WebAssembly-654FF0?style=for-the-badge&logo=webassembly)](https://sql.js.org/)

**A commercial-grade, standalone interactive SQL learning academy that runs 100% in-browser.**  
Zero backend dependencies. Zero monthly database hosting bills. Sub-millisecond query execution.

[🌐 Explore Live Demo](https://sql-learn-two.vercel.app/) · [📁 GitHub Repository](https://github.com/Nightmare-026/SQL-Learn)

</div>

---

## 🧭 Commercial & Acquisition Overview

**SQL Learn** is a turnkey educational software asset designed for digital creators, educators, course creators, and EdTech founders. Built entirely on modern web standards with **Next.js 16**, **TypeScript 5**, **Tailwind CSS v4**, and **SQLite WebAssembly (`sql.js`)**, this application requires **no server-side database, no API subscriptions, and no ongoing backend maintenance costs**.

### 💼 Why This Codebase is Turnkey & High-Value
- **Zero Ongoing Infrastructure Costs:** Executes all SQL queries, tests, and diff validations client-side in WebAssembly. Deploy to Vercel, Netlify, Cloudflare Pages, or static S3 for essentially $0/month.
- **100% Complete Content (60/60 Modules):** No placeholders, no lorem-ipsum. Every single module includes authentic theory, interactive code animations, step-by-step tasks, automated test validators, and quizzes.
- **Bilingual English & Hinglish:** 1-Click language toggle instantly switches all lesson explanations, analogies, step hints, and error translations.
- **Client-Side Progress & Portability:** Student progress is tracked via Zustand + `localStorage` and includes a 1-click **JSON Backup Export & Import** feature so learners never lose progress.
- **Clean IP & Ownership Trail:** Sole-authored codebase using 100% permissive dependencies (MIT/Apache-2.0 compatible UI primitives from Radix UI and Lucide).

---

## ✨ Feature Breakdown

### 🗺️ 1. Complete 60-Module Visual Curriculum Roadmap

A structured, node-based visual learning journey divided into three progressive mastery tiers:

| Track | Module Range | Key Topics & Competencies | Capstone Milestones |
| :--- | :--- | :--- | :--- |
| 🟢 **Beginner Foundations** | **M01 – M20** | Relational tables, `SELECT`, `WHERE` filtering, boolean logic (`AND`/`OR`/`NOT`), math arithmetic, sorting (`ORDER BY`), aggregate math (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`), and group filtering (`GROUP BY`, `HAVING`). | **M10 & M20** (Foundations Capstone) |
| 🟡 **Intermediate Queries** | **M21 – M40** | Multi-table relational joins (`INNER`, `LEFT`, `RIGHT`, `FULL OUTER`, `CROSS`), correlated subqueries, set operations (`UNION`, `INTERSECT`, `EXCEPT`), string operations, date-time parsing, and conditional `CASE WHEN`. | **M30 & M40** (Joins & Subqueries Capstone) |
| 🔴 **Advanced Mastery** | **M41 – M60** | Window functions (`ROW_NUMBER`, `RANK`, `DENSE_RANK`, `LEAD`, `LAG`, `NTILE`), Common Table Expressions (`WITH`, Recursive CTEs), Query Optimization (`EXPLAIN QUERY PLAN`, B-Tree indexes), ACID transactions, and DDL schema design. | **M49, M59 & M60** (Full-Stack Data Engineering Capstones) |

- **Search & Filter:** Instant search by keyword, SQL clause, track level, and completion status.
- **Interactive Pathways:** Visual unlocked/locked badges with direct "Resume Next Module" navigation.

---

### 🖥️ 2. User-Adjustable Split-Screen IDE Workspace

A desktop-first IDE layout with seamless fallback to single-pane views on mobile devices:

| Workspace Mode | Layout Behavior | Purpose |
| :--- | :--- | :--- |
| 🖥️ **Split IDE** | Dual-pane layout with draggable central splitter (20% – 80% range) and double-click 50/50 reset | Read theory while writing and testing queries simultaneously |
| 📖 **Zen Reader** | Full-width centered theory view | Distraction-free reading, studying syntax rules, and reviewing code walkthroughs |
| ⚡ **Full Console** | Full-width query terminal and schema inspector | Writing and testing multi-table or recursive queries with expanded result sets |

---

### ⚡ 3. SQL Lifecycle Visualizer

Interactive execution simulator explaining why SQL queries execute in a different logical order than written:

$$\text{FROM \& JOIN} \longrightarrow \text{WHERE} \longrightarrow \text{GROUP BY} \longrightarrow \text{HAVING} \longrightarrow \text{SELECT} \longrightarrow \text{ORDER BY} \longrightarrow \text{LIMIT / OFFSET}$$

- **Real-Time Funnel Volume:** Shows exact row count reductions at each filter stage.
- **Interactive Step Navigation:** Click any lifecycle phase to read conceptual breakdowns and beginner-friendly developer tips in English and Hinglish.

---

### 🛡️ 4. In-Browser SQLite WebAssembly Engine

Powered by official [`sql.js`](https://sql.js.org/) (SQLite compiled to WebAssembly binary):

- **Instant Zero-Latency Execution:** Sub-millisecond response times without round-trip network lag.
- **3 Preloaded Production Datasets:**
  1. 🏫 **School Database:** 5 relational tables (`students`, `courses`, `enrollments`, `grades`, `departments`).
  2. 🛒 **E-Commerce Database:** 6 relational tables (`customers`, `orders`, `order_items`, `products`, `categories`, `reviews`).
  3. 📊 **Advanced Analytics Database:** Multi-dimensional schemas for window analytics, index profiling, and recursive hierarchies.
- **Schema Explorer:** Real-time tree view showing table columns, primary keys, foreign keys, and live row previews.

---

### 🔍 5. Automated Verification & Visual Diff Diagnostics

- **Reference Engine Validation:** Compares student query output against an isolated reference database.
- **Visual Diff Diagnostics:** Highlights missing rows, unexpected extra rows, and column order mismatches.
- **Humanized Error Parser:** Translates cryptic SQLite error messages into plain English and Hinglish guidance with actionable hints.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) | High-performance React application architecture |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type checking with 0 build errors |
| **SQL Engine** | [sql.js (SQLite WASM)](https://sql.js.org/) | In-browser database engine loaded lazily via WebAssembly |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern CSS variables, design tokens, and custom scrollbars |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) / [Lucide](https://lucide.dev/) | Accessible, unstyled primitives with clean vector icons |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) | Persistent client state with JSON backup export/import |

---

## 🚀 Quick Start & Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.18.0 or higher)
- `npm`, `pnpm`, or `yarn`

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/Nightmare-026/SQL-Learn.git
cd SQL-Learn

# 2. Install dependencies
npm install

# 3. Run development server (port 3000)
npm run dev

# 4. Open http://localhost:3000
```

---

## 📦 Deployment Guide (Zero-Config)

Because SQL Learn has zero backend database requirements, it can be deployed in under 2 minutes:

### Deploy to Vercel (Recommended)
1. Push your repository to GitHub.
2. Log in to [vercel.com](https://vercel.com) and click **"Add New Project"** → **"Import Git Repository"**.
3. Select `SQL-Learn` (Framework Preset: **Next.js**).
4. Click **"Deploy"**. No environment variables are required.

### Deploy to Netlify / Cloudflare / Static Host
- Build command: `npm run build`
- Output directory: `.next` or standalone build
- Environment variables: None required (`.env.example` provided for optional custom domain tagging).

---

## 📂 Project Structure

```text
SQL-Learn/
├── public/
│   └── sql-wasm/               # SQLite WebAssembly binary (sql-wasm.wasm)
├── src/
│   ├── app/
│   │   ├── globals.css         # Tailwind CSS v4 design tokens and syntax styles
│   │   ├── layout.tsx          # Root layout with fonts, metadata & viewport
│   │   └── page.tsx            # Main hash router (Landing, Roadmap, Sandbox, Settings)
│   ├── components/
│   │   └── sqllearn/
│   │       ├── CurriculumRoadmap.tsx       # 60-module visual roadmap with filters
│   │       ├── ModulePage.tsx              # Resizable split-screen workspace
│   │       ├── PracticeConsole.tsx         # SQL editor, schema explorer & live results
│   │       ├── SQLLifecycleVisualizer.tsx  # 7-stage visual execution order simulator
│   │       ├── AnimatedTutorial.tsx        # Dynamic code typing & row highlight engine
│   │       ├── QuizTab.tsx                 # Interactive module quizzes with scoring
│   │       ├── SQLDisplay.tsx              # Syntax-highlighted code tables & chips
│   │       └── Diagram.tsx                 # Relational schema and Venn diagrams
│   ├── content/
│   │   ├── datasets/                       # Seed SQL schemas (School, E-Commerce, Analytics)
│   │   └── modules/                        # 60 fully-authored modules (M01 – M60)
│   ├── lib/
│   │   ├── content/registry.ts             # Module registry and level categorization
│   │   ├── progress/store.ts               # Zustand store + JSON export/import
│   │   ├── sql/
│   │   │   ├── engine.ts                   # sql.js WebAssembly context & runner
│   │   │   ├── tokenizer.ts               # Custom SQL syntax tokenizer
│   │   │   ├── validator.ts               # Isolated reference validation & diff engine
│   │   │   └── errorMatcher.ts            # Bilingual friendly error translator
│   │   └── i18n/store.ts                   # English & Hinglish translation dictionaries
│   └── types/
│       ├── content.ts                      # TypeScript schemas for modules & tasks
│       └── progress.ts                     # User progress & stats type definitions
├── .env.example                # Sample environment configuration
├── next.config.ts              # Security headers (CSP, X-Frame-Options, WASM eval)
├── LICENSE                     # Proprietary software license
└── package.json
```

---

## 📜 Available NPM Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `next dev -p 3000 --webpack` | Starts local development server |
| `npm run build` | `next build --webpack` | Compiles optimized production bundle |
| `npm run start` | `next start` | Runs the compiled production build locally |
| `npx tsc --noEmit` | `tsc --noEmit` | Validates strict TypeScript types |
| `npm run lint` | `eslint .` | Runs ESLint code quality suite |

---

## 📄 License & Intellectual Property

© 2025-2026 SQL Learn. All rights reserved.

This software and associated documentation files are proprietary intellectual property. All underlying open-source dependencies (Radix UI, Tailwind CSS, sql.js, Lucide) use permissive MIT/Apache-2.0 licenses. For commercial acquisition, licensing, or white-label inquiries, please contact the repository owner.
