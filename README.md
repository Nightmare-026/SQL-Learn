<div align="center">

# 🎓 SQL Learn

### Master SQL — From First Query to Production Expert

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![SQLite WASM](https://img.shields.io/badge/SQLite-WebAssembly-654FF0?style=for-the-badge&logo=webassembly)](https://sql.js.org/)

**A production-grade, interactive SQL learning platform that runs 100% in-browser.**
No database setup. No server configuration. No installation. Just open and learn.

[Live Demo](#) · [Report Bug](https://github.com/Nightmare-026/SQL-Learn/issues) · [Request Feature](https://github.com/Nightmare-026/SQL-Learn/issues)

</div>

---

## 🧭 Overview

**SQL Learn** is an end-to-end SQL education platform built for learners who want more than passive tutorials. It combines a **structured 60-module curriculum**, a **real-time in-browser SQLite engine**, and a **professional IDE-style workspace** — all packaged inside a single web application with zero backend dependencies.

Whether you're writing your first `SELECT *` or mastering recursive CTEs and window functions, SQL Learn provides instant feedback, automated verification, and visual explanations at every step.

---

## ✨ Core Features

### 🗺️ 60-Module Visual Curriculum Roadmap

| Track | Modules | Topics |
| :--- | :--- | :--- |
| 🟢 **Beginner Foundations** | M01 – M20 | Tables, `SELECT`, `WHERE`, arithmetic, sorting, aggregates (`COUNT`, `SUM`, `AVG`), `GROUP BY`, `HAVING` |
| 🟡 **Intermediate Queries** | M21 – M40 | `INNER JOIN`, `LEFT/RIGHT JOIN`, subqueries, set operations (`UNION`, `INTERSECT`, `EXCEPT`), string & date functions, `CASE WHEN` |
| 🔴 **Advanced Mastery** | M41 – M60 | Window functions (`ROW_NUMBER`, `RANK`, `LEAD/LAG`), CTEs (recursive), query optimization (`EXPLAIN`, indexes), transactions (`ACID`), DDL schema design |

- **Capstone Projects** at milestone modules (M10, M20, M30, M40, M49, M59, M60)
- **Search & Filter** by SQL keyword, track, or completion status
- **Interactive Node Map** with visual dependency connections between modules

---

### 🖥️ Adjustable Split-Screen Workspace

A professional IDE-grade learning environment with three view modes:

| Mode | Description |
| :--- | :--- |
| 🖥️ **Split IDE** | Theory + code editor side-by-side with draggable resizer (20% – 80%) |
| 📖 **Zen Reader** | Full-width theory panel for distraction-free reading |
| ⚡ **Full Console** | Full-width code editor for focused query writing |

- **Drag to resize** — click and drag the central splitter bar freely
- **Double-click to reset** — instantly restore balanced 50/50 layout

---

### ⚡ SQL Lifecycle Visualizer

Visual query execution simulator demonstrating the logical processing order:

```
FROM & JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT/OFFSET
```

Step-by-step funnel with real-time row transformation metrics, visual analogies, and practical tips — available in both **English** and **Hinglish**.

---

### 🛡️ In-Browser SQLite Engine (Zero-Backend)

Powered by [`sql.js`](https://sql.js.org/) (SQLite compiled to WebAssembly):

- **Instant execution** — sub-millisecond query response, no network latency
- **Preloaded datasets:**
  - 🏫 **School DB** — Students, Courses, Enrollments, Grades, Departments (5 tables)
  - 🛒 **E-Commerce DB** — Customers, Orders, Order Items, Products, Categories, Reviews (6 tables)
  - 📊 **Analytics DB** — Multi-dimensional tables for window functions, indexes, and complex joins
- **Schema Explorer** — browse tables, column types, primary keys, foreign keys, and live data previews

---

### 🔍 Automated Verification & Diagnostics

- Output validation against isolated reference databases
- Visual diff highlighting: missing rows, extra rows, column order mismatches
- Beginner-friendly error translation with actionable fix suggestions

---

### 🌐 Bilingual Support

Full **English** and **Hinglish** coverage across all 60 modules — theory, practice tasks, hints, and error explanations — toggled with a single click.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) | High-performance React architecture |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict end-to-end type safety |
| **SQL Engine** | [sql.js (SQLite WASM)](https://sql.js.org/) | Zero-latency in-browser SQL execution |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Design tokens, animations, responsive layout |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, accessible vector icons |
| **State** | [Zustand](https://github.com/pmndrs/zustand) | Persistent client-side progress via `localStorage` |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18.18.0 or higher
- `npm`, `pnpm`, or `yarn`

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Nightmare-026/SQL-Learn.git
cd SQL-Learn

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open http://localhost:3000
```

---

## 📂 Project Structure

```text
SQL-Learn/
├── public/                     # Static assets (SQL datasets, WASM binary)
├── src/
│   ├── app/
│   │   ├── globals.css         # Tailwind v4 styles, scrollbars, SQL syntax themes
│   │   ├── layout.tsx          # Root layout with fonts & metadata
│   │   └── page.tsx            # Main router (Landing, Dashboard, Sandbox, Projects, Settings)
│   ├── components/
│   │   └── sqllearn/
│   │       ├── CurriculumRoadmap.tsx       # 60-module interactive roadmap
│   │       ├── ModulePage.tsx              # Resizable split-screen workspace
│   │       ├── PracticeConsole.tsx         # SQL editor, schema explorer & results
│   │       ├── SQLLifecycleVisualizer.tsx  # 7-stage query execution visualizer
│   │       ├── AnimatedTutorial.tsx        # Typing animation & row highlighter
│   │       ├── QuizTab.tsx                 # Module quizzes & scoring
│   │       ├── SQLDisplay.tsx              # Syntax-highlighted code & result tables
│   │       └── Diagram.tsx                 # Relational & set operation diagrams
│   ├── lib/
│   │   ├── content/registry.ts             # Module index, metadata & categorization
│   │   ├── progress/store.ts               # Zustand progress store & persistence
│   │   ├── sql/
│   │   │   ├── engine.ts                   # SQLite WASM database context & runner
│   │   │   ├── tokenizer.ts               # SQL syntax highlighter tokenizer
│   │   │   ├── validator.ts               # Query verification & diff analyzer
│   │   │   └── errorMatcher.ts            # Human-friendly error explanations
│   │   └── i18n/store.ts                   # EN/HI translation dictionaries
│   └── types/
│       └── content.ts                      # TypeScript module & task definitions
├── tsconfig.json
└── package.json
```

---

## 📜 Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Compile production-optimized build |
| `npm run start` | Serve production build locally |
| `npx tsc --noEmit` | Validate TypeScript type correctness |

---

## 📄 License

© 2025 SQL Learn. All rights reserved.

This project is proprietary software. Unauthorized copying, distribution, modification, or use of this software, in whole or in part, is strictly prohibited without prior written permission from the author. For licensing inquiries, please open an issue or contact the author directly.
