# 🎓 SQL Learn — Master SQL from Zero to Expert

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![WebAssembly](https://img.shields.io/badge/SQLite-WebAssembly-654FF0?style=for-the-badge&logo=webassembly)](https://sql.js.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> **SQL Learn** is a modern, production-grade interactive SQL learning academy that runs **100% in-browser** using SQLite WebAssembly. No database setup, server configuration, or software installation required.

---

## ✨ Key Highlights & Features

### 🗺️ Visual Curriculum Roadmap (`60 Connected Modules`)
* **Structured Learning Tracks**:
  * 🟢 **Beginner Foundations (M01 – M20)**: Tables, `SELECT`, `WHERE` filtering, arithmetic, sorting, aggregates (`COUNT`, `SUM`, `AVG`), and group filtering (`GROUP BY`, `HAVING`).
  * 🟡 **Intermediate Queries (M21 – M40)**: `INNER JOIN`, `LEFT/RIGHT JOIN`, subqueries, set operations (`UNION`, `INTERSECT`, `EXCEPT`), string manipulation, date-time functions, and conditional `CASE WHEN`.
  * 🔴 **Advanced Mastery (M41 – M60)**: Window functions (`ROW_NUMBER`, `RANK`, `DENSE_RANK`, `LEAD/LAG`), Common Table Expressions (`WITH`, Recursive CTEs), Query Optimization (`EXPLAIN`, Indexes), Transactions (`ACID`), and DDL schema design.
* **Capstone Milestones**: Special capstone projects at key milestone modules (M10, M20, M30, M40, M49, M59, M60).
* **Interactive Filter & Search**: Search modules by SQL keyword or filter by track and completion status.

### 🖥️ User-Adjustable Split-Screen Workspace
* **Dual-Pane Desktop IDE**: Theory, syntax explanations, and animated tutorials on the left; schema explorer, code editor, and live output on the right.
* **Interactive Draggable Resizer**: Click and drag the central splitter bar to customize panel widths freely (from 20% to 80%).
* **1-Click 50/50 Reset**: Double-click the splitter bar anytime to restore balanced 50/50 split.
* **Workspace View Modes**:
  * 🖥️ **Split IDE**: Simultaneous reading and query practice.
  * 📖 **Zen Reader**: Maximize theory to full width for distraction-free reading.
  * ⚡ **Full Console**: Maximize practice editor to full width for writing complex queries.

### ⚡ Interactive SQL Lifecycle Visualizer
* **Visual Query Execution Simulator**: Demonstrates why SQL executes in a different logical order than written:
  $$\text{FROM \& JOIN} \longrightarrow \text{WHERE} \longrightarrow \text{GROUP BY} \longrightarrow \text{HAVING} \longrightarrow \text{SELECT} \longrightarrow \text{ORDER BY} \longrightarrow \text{LIMIT / OFFSET}$$
* **Step-by-step Funnel**: Real-time pipeline volume meter showing row transformations, visual analogies, and practical developer tips in both English and Hinglish.

### 🛡️ In-Browser SQLite WebAssembly Engine
* Powered by `sql.js` (WASM) for instant sub-millisecond local execution without network latency.
* **Preloaded Datasets**:
  * 🏫 **School Database**: 5 relational tables (Students, Courses, Enrollments, Grades, Departments).
  * 🛒 **E-Commerce Database**: 6 relational tables (Customers, Orders, Order Items, Products, Categories, Reviews).
  * 📊 **Advanced Analytics Database**: Multi-dimensional tables for window functions, indexes, and complex joins.
* **Schema Explorer**: 1-click toggle to view tables, column types, primary keys, and foreign key relations with live table data preview.

### 🔍 Automated Verification & Diff Diagnostics
* Automatic output validation against isolated reference databases.
* Instant visual diff highlighting missing rows, extra rows, and column order mismatches.
* Intelligent beginner-friendly error translation with actionable hints.

### 🌐 Bilingual Support (English & Hinglish)
* 1-Click language toggle (`EN` / `HI`) across all 60 module theories, practice tasks, step-by-step hints, and error explanations.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) | High-performance React application architecture |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict end-to-end type safety |
| **Database Engine** | [sql.js (SQLite WASM)](https://sql.js.org/) | Zero-latency, zero-backend in-browser SQL execution |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern design system tokens, smooth animations, responsive layout |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, accessible vector icons |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) | Persistent client-side progress tracking via `localStorage` |

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.18.0 or higher recommended)
* `npm`, `pnpm`, or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Nightmare-026/SQL-Learn.git
   cd SQL-Learn
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to start learning.

---

## 📂 Project Structure

```text
SQL-Learn/
├── public/                     # Static assets (SQL datasets, WASM binary)
├── src/
│   ├── app/
│   │   ├── globals.css         # Tailwind v4 styles, custom scrollbars, SQL syntax themes
│   │   ├── layout.tsx          # Root HTML layout with fonts & metadata
│   │   └── page.tsx            # Main router (Landing, Dashboard, Sandbox, Projects, Settings)
│   ├── components/
│   │   └── sqllearn/
│   │       ├── CurriculumRoadmap.tsx       # 60-Module interactive roadmap component
│   │       ├── ModulePage.tsx              # Resizable split-screen workspace
│   │       ├── PracticeConsole.tsx         # SQL editor, schema explorer & scrollable results
│   │       ├── SQLLifecycleVisualizer.tsx  # 7-stage query execution order simulator
│   │       ├── AnimatedTutorial.tsx        # Typing code animation & row highlighter
│   │       ├── QuizTab.tsx                 # Interactive module quizzes & scoring
│   │       ├── SQLDisplay.tsx              # Syntax-highlighted code & result tables
│   │       └── Diagram.tsx                 # Relational & set operation diagrams
│   ├── lib/
│   │   ├── content/registry.ts             # 60-Module index, metadata, & level categorizations
│   │   ├── progress/store.ts               # Zustand store for user progress & persistence
│   │   ├── sql/
│   │   │   ├── engine.ts                   # SQLite WASM database context & runner
│   │   │   ├── tokenizer.ts                # SQL syntax highlighter tokenizer
│   │   │   ├── validator.ts                # Query verification & diff analyzer
│   │   │   └── errorMatcher.ts             # Human-friendly SQL error explanations
│   │   └── i18n/store.ts                   # Bilingual EN/HI translation dictionaries
│   └── types/
│       └── content.ts                      # TypeScript definitions for modules & tasks
├── tsconfig.json               # TypeScript compiler configuration
└── package.json                # Project dependencies and scripts
```

---

## 📜 Available NPM Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `next dev -p 3000 --webpack` | Starts the Next.js development server |
| `npm run build` | `next build` | Compiles the production-optimized build |
| `npm run start` | `next start` | Runs the production build locally |
| `npx tsc --noEmit` | `tsc --noEmit` | Validates TypeScript type correctness |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/Nightmare-026/SQL-Learn/issues).

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to use and adapt for personal or educational purposes.
