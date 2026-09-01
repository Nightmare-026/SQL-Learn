# 📘 SQL Learning Platform — Complete Architecture & Development Plan

> **Document Type:** Technical Architecture & Requirements Specification  
> **Version:** 1.0 (Final)  
> **Status:** Requirements Locked — Approved for Development  
> **Total Modules:** 60 | **Total Decisions:** 27 | **Est. Effort:** 3,200+ hours

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Locked Requirements (27 Decisions)](#2-locked-requirements)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture](#4-system-architecture)
5. [Database Design](#5-database-design)
6. [Curriculum Structure (60 Modules)](#6-curriculum-structure)
7. [Module Content Template](#7-module-content-template)
8. [Practice Console Architecture](#8-practice-console-architecture)
9. [Query Validation Engine](#9-query-validation-engine)
10. [Hint System](#10-hint-system)
11. [Error Feedback System](#11-error-feedback-system)
12. [Sandbox Mode](#12-sandbox-mode)
13. [Quiz System](#13-quiz-system)
14. [Projects & Capstone](#14-projects--capstone)
15. [UI/UX Design System](#15-uiux-design-system)
16. [Navigation & Page Structure](#16-navigation--page-structure)
17. [Language System (EN/HI)](#17-language-system)
18. [Progress Tracking System](#18-progress-tracking-system)
19. [Search & Filter System](#19-search--filter-system)
20. [Component Architecture](#20-component-architecture)
21. [File & Folder Structure](#21-file--folder-structure)
22. [TypeScript Type Definitions](#22-typescript-type-definitions)
23. [Content Creation Guidelines](#23-content-creation-guidelines)
24. [Animated Tutorial System](#24-animated-tutorial-system)
25. [Mobile Support Strategy](#25-mobile-support-strategy)
26. [Development Roadmap](#26-development-roadmap)
27. [Testing Strategy](#27-testing-strategy)
28. [Deployment & Hosting](#28-deployment--hosting)
29. [Performance Requirements](#29-performance-requirements)
30. [Success Metrics](#30-success-metrics)
31. [Final Checklist](#31-final-checklist)
32. [Appendix: Glossary](#32-appendix-glossary)

---

## 1. Executive Summary

### 1.1 Vision

Build a **complete, free, browser-based SQL learning platform** that takes users from zero knowledge to industry-level SQL expertise through 60 structured modules, interactive practice console, and real-world projects — all without requiring signup, servers, or payment.

### 1.2 Problem Statement

| Current Pain Point | Our Solution |
|---|---|
| SQL tutorials are theory-heavy, practice-light | 300 interactive practice tasks with live validation |
| Practice environments require setup (MySQL/PostgreSQL install) | Browser-based SQLite (sql.js) — zero setup |
| Content jumps from basic to advanced without progression | 60 micro-modules with gradual difficulty |
| No feedback on wrong queries | Friendly error explanations + SQLite raw errors |
| English-only content excludes Hindi speakers | Full dual-language toggle (EN/HI) |
| Progress lost when switching devices | localStorage + backup/export system |

### 1.3 Core Value Propositions

| # | Value | Implementation |
|---|---|---|
| 1 | **Zero Friction Start** | No signup, no server, no payment — instant learning |
| 2 | **Complete Journey** | 60 modules: Beginner (20) → Intermediate (20) → Advanced (20) |
| 3 | **Real Practice** | 3-panel IDE console with live SQLite execution |
| 4 | **Smart Validation** | Result-matching engine (not exact string match) |
| 5 | **Progressive Learning** | 5 tasks per module (Very Easy → Very Hard) |
| 6 | **Dual Language** | Full English + Hinglish content toggle |
| 7 | **100% Free & Offline** | Client-side only, works without internet after load |
| 8 | **Industry-Ready** | 10 projects including capstone BI system |

### 1.4 Target Users

| Persona | Description | Primary Need |
|---|---|---|
| **Complete Beginner** | Never touched SQL, possibly student or career switcher | Gentle, structured introduction |
| **College Student** | Learning DBMS in curriculum, needs practice | Exam-oriented clear explanations |
| **Job Seeker** | Preparing for data analyst/developer interviews | Practical query skills, common patterns |
| **Working Developer** | Knows programming, weak in SQL | Quick reference, advanced topics |

### 1.5 Success Definition

- User completes Beginner level without external help
- User can write JOIN, GROUP BY, subquery queries confidently
- User can solve real business problems with SQL after Capstone
- Platform feels professional (Coursera-level UI quality)

---

## 2. Locked Requirements

All 27 requirements finalized through structured Q&A. No changes without version update.

| # | Category | Decision | Key Details |
|---|----------|----------|-------------|
| 1 | Target Audience | All Levels | 3 difficulty tracks, complete journey |
| 2 | Module Structure | Complete | Theory + Animated Tutorial + Quiz + Console + Projects |
| 3 | Validation System | Hybrid | Result-match + Progressive tasks + Hints + Sandbox |
| 4 | Database Engine | SQLite (Browser) | sql.js WASM, offline capable, no server |
| 5 | Progress Saving | localStorage | No accounts, backup code export available |
| 6 | Theme | Light Mode | Educational, clean, Coursera-inspired |
| 7 | Language | Dual Toggle (EN/HI) | All content in both English & Hinglish |
| 8 | Tech Stack | React + TypeScript + Tailwind | shadcn/ui, Framer Motion, professional grade |
| 9 | Gamification | None | No XP, badges, streaks — professional tone |
| 10 | Module Organization | Level-Based Groups | Beginner → Intermediate → Advanced, linear within |
| 11 | Total Modules | 60 (20/20/20) | Micro-modules, every concept dedicated |
| 12 | Dataset | School + E-Commerce | School for Beginner, E-Com for Inter/Adv |
| 13 | Practice Tasks | 5 per module | Very Easy → Easy → Medium → Hard → Very Hard |
| 14 | Video Content | Animated Text Tutorials | Code typing animations, no recorded videos |
| 15 | Quiz Format | All 4 Types | MCQ + Output Prediction + Query Building + Fill Blanks |
| 16 | Projects | 10 Total | 6 Mini + 3 Level finals + 1 Capstone |
| 17 | Console Layout | 3-Panel IDE | Schema (left) + Editor (center) + Results (right) |
| 18 | Mobile Support | Desktop-First | Mobile = theory/quiz only, console view-only |
| 19 | SQL Editor | Basic | Syntax highlighting only, no autocomplete |
| 20 | Hint System | 3-Level Progressive | Concept → Structure → Partial Solution |
| 21 | Error Feedback | Friendly + Raw | Simple explanation + SQLite technical error |
| 22 | Sandbox Mode | Full DDL/DML | CREATE/INSERT/UPDATE/DELETE + Reset button |
| 23 | Completion Criteria | Both Required | 3/5 tasks AND 70% quiz score |
| 24 | Navigation | Top Bar + Dropdown | Compact, maximum content space |
| 25 | Homepage | Landing Page | Hero + Features + CTA + Stats |
| 26 | Search | Search + Filters | Keyword + Level filter + Status filter |
| 27 | Development | All-at-Once | Complete product, 6-month build, perfect launch |

---

## 3. Technology Stack

### 3.1 Stack Overview

```
┌─────────────────────────────────────────────────────┐
│                  TECHNOLOGY STACK                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  UI LAYER                                           │
│  ├── React 18.x (Component architecture)            │
│  ├── TypeScript 5.x (Type safety, DX)               │
│  ├── Tailwind CSS 3.x (Utility-first styling)       │
│  ├── shadcn/ui (Pre-built components)               │
│  ├── Radix UI (Accessible primitives)               │
│  ├── Framer Motion 10.x (Animations)                │
│  └── Lucide React (Icon library)                    │
│                                                     │
│  STATE MANAGEMENT                                   │
│  ├── Zustand 4.x (Global state store)               │
│  └── localStorage (Progress persistence)            │
│                                                     │
│  DATABASE LAYER                                     │
│  ├── sql.js 1.x (SQLite compiled to WASM)           │
│  ├── Custom Query Runner (Execution wrapper)        │
│  └── Result Comparator (Validation engine)          │
│                                                     │
│  CONTENT LAYER                                      │
│  ├── JSON (Module definitions, tasks, quizzes)      │
│  ├── Markdown/MDX (Theory content)                  │
│  └── Custom Animation Engine (Tutorials)            │
│                                                     │
│  BUILD & DEV TOOLS                                  │
│  ├── Vite 5.x (Build tool, fast HMR)                │
│  ├── Vitest 1.x (Unit testing)                      │
│  ├── ESLint + Prettier (Code quality)               │
│  └── TypeScript Strict Mode                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3.2 Why These Choices

| Technology | Reason | Alternative Rejected |
|---|---|---|
| **React 18** | Industry standard, huge ecosystem, shadcn/ui compatibility | Vue (smaller ecosystem for this use) |
| **TypeScript** | Type safety for 60-module content structures, catches content bugs | JavaScript (runtime errors in content) |
| **Tailwind CSS** | Rapid UI development, consistent design tokens, small bundle | CSS Modules (slower development) |
| **shadcn/ui** | Beautiful accessible components, copy-paste ownership, Radix-based | Material UI (heavier, opinionated) |
| **sql.js** | SQLite in browser, WASM = fast, no server needed | Server-based MySQL (hosting cost, complexity) |
| **Zustand** | Lightweight, simple API, perfect for this scale | Redux (overkill), Context (performance) |
| **Vite** | Fastest build tool, excellent DX | Webpack (slower, more config) |

### 3.3 Dependencies (package.json)

```json
{
  "name": "sql-learning-platform",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint . --ext ts,tsx",
    "format": "prettier --write ."
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "sql.js": "^1.8.0",
    "zustand": "^4.4.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.263.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-tabs": "^1.0.0",
    "@radix-ui/react-tooltip": "^1.0.0",
    "@radix-ui/react-progress": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/sql.js": "^1.4.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.1.0",
    "vite": "^4.4.0",
    "vitest": "^0.34.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.45.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "prettier": "^3.0.0"
  }
}
```

### 3.4 SQLite Feature Support (sql.js)

| Feature | Supported | Notes |
|---|---|---|
| SELECT, WHERE, ORDER BY, LIMIT | ✅ | Full support |
| All JOIN types (INNER, LEFT, RIGHT, FULL, CROSS, SELF) | ✅ | Full support |
| GROUP BY, HAVING | ✅ | Full support |
| Aggregate functions (COUNT, SUM, AVG, MIN, MAX) | ✅ | Full support |
| Subqueries (scalar, correlated, EXISTS) | ✅ | Full support |
| CTEs (WITH clause, including recursive) | ✅ | SQLite 3.8.3+ |
| Window Functions (ROW_NUMBER, RANK, LAG, LEAD, etc.) | ✅ | SQLite 3.25+ |
| CASE statements | ✅ | Full support |
| Views (CREATE, DROP, UPDATE) | ✅ | Full support |
| Indexes (CREATE INDEX) | ✅ | Full support |
| Transactions (BEGIN, COMMIT, ROLLBACK) | ✅ | Full support |
| Triggers | ✅ | Full support |
| String functions (UPPER, LOWER, SUBSTR, etc.) | ✅ | Full support |
| Date functions (DATE, DATETIME, strftime) | ✅ | Full support |
| **Stored Procedures** | ❌ | Not in SQLite — covered as theory-only with alternatives |
| **User Management (GRANT/REVOKE)** | ❌ | Not applicable — theory module only |

---

## 4. System Architecture

### 4.1 High-Level Architecture (Client-Side Only)

```
┌─────────────────────────────────────────────────────────────────┐
│                    BROWSER (100% Client-Side)                    │
│                                                                 │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐      │
│  │  React App   │   │    sql.js    │   │ localStorage  │      │
│  │  (UI Layer)  │◄─►│  (SQLite     │   │  (Progress    │      │
│  │              │   │   Engine)    │   │   Store)      │      │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘      │
│         │                  │                   │              │
│  ┌──────▼──────────────────▼───────────────────▼───────┐      │
│  │                 Application Core                     │      │
│  │  ┌────────────────────────────────────────────────┐ │      │
│  │  │  Module Manager                                 │ │      │
│  │  │  (Loads module content, animations, tasks)     │ │      │
│  │  └────────────────────────────────────────────────┘ │      │
│  │  ┌────────────────────────────────────────────────┐ │      │
│  │  │  Progress Tracker                               │ │      │
│  │  │  (localStorage read/write, completion logic)   │ │      │
│  │  └────────────────────────────────────────────────┘ │      │
│  │  ┌────────────────────────────────────────────────┐ │      │
│  │  │  Query Validator                               │ │      │
│  │  │  (Execute query, compare results, diff view)   │ │      │
│  │  └────────────────────────────────────────────────┘ │      │
│  │  ┌────────────────────────────────────────────────┐ │      │
│  │  │  Hint Manager                                  │ │      │
│  │  │  (3-level progressive hints, unlock logic)     │ │      │
│  │  └────────────────────────────────────────────────┘ │      │
│  │  ┌────────────────────────────────────────────────┐ │      │
│  │  │  Quiz Engine                                   │ │      │
│  │  │  (4 question types, scoring, retry logic)      │ │      │
│  │  └────────────────────────────────────────────────┘ │      │
│  │  ┌────────────────────────────────────────────────┐ │      │
│  │  │  Language System                               │ │      │
│  │  │  (EN/HI toggle, content loading)               │ │      │
│  │  └────────────────────────────────────────────────┘ │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              Content Bundle (Static)                  │      │
│  │  ├── modules/beginner/ (20 JSON files)              │      │
│  │  ├── modules/intermediate/ (20 JSON files)          │      │
│  │  ├── modules/advanced/ (20 JSON files)              │      │
│  │  ├── projects/ (10 JSON files)                      │      │
│  │  ├── datasets/ (3 SQL seed files)                   │      │
│  │  └── locales/ (en.json, hi.json)                    │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              sql.js WASM (~1.2 MB)                    │      │
│  │  (Loaded once, cached, all DB operations)            │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

NO SERVER REQUIRED — Deploy as static files
```

### 4.2 Data Flow: Query Execution

```
USER FLOW (Practice Task):

[1] User types query
     │
     ▼
[2] Clicks "RUN" button
     │
     ▼
[3] Query sent to sql.js engine
     │
     ├── ERROR path:
     │   ├── SQLite error captured
     │   ├── Error pattern matcher runs
     │   │   (detects common typos: FORM→FROM, etc.)
     │   └── Friendly explanation generated
     │   └── Display: Friendly message + Raw technical error
     │
     └── SUCCESS path:
         ├── Query executes
         ├── Result set extracted (rows + columns)
         │
         ├── NORMALIZATION:
         │   ├── Trim whitespace in string values
         │   ├── Round decimals to tolerance (0.01)
         │   ├── Sort rows (if no ORDER BY in expected)
         │   └── Map column names (if aliases expected)
         │
         ├── COMPARISON:
         │   ├── Column count check
         │   ├── Column names check (if required)
         │   ├── Row count check
         │   └── Cell-by-cell value comparison
         │
         └── RESULT:
             ├── MATCH → "✅ Correct!" + Next task unlock
             └── NO MATCH → "❌ Output doesn't match" +
                 Diff view (Expected vs Got) +
                 Hint suggestion
```

### 4.3 Data Flow: Module Progression

```
MODULE COMPLETION FLOW:

[Module Page Load]
     │
     ▼
[User reads Theory] ──(auto-track scroll/read time)──► Mark "theory_read": true
     │
     ▼
[User attempts Practice Tasks]
     │
     ├── Task 1: Pass ✓ (stored in progress)
     ├── Task 2: Pass ✓
     ├── Task 3: Pass ✓
     ├── Task 4: Fail ✗ (retry allowed)
     └── Task 5: Not attempted
     │
     ▼
[3/5 tasks passed] ──► tasks_requirement: MET ✓
     │
     ▼
[User takes Quiz (4 questions)]
     │
     ├── Q1: MCQ → Correct
     ├── Q2: Output Prediction → Correct
     ├── Q3: Query Building → Wrong
     └── Q4: Fill Blanks → Correct
     │
     ▼
[Score: 75%] ──► 70%+ → quiz_requirement: MET ✓
     │
     ▼
[ALL REQUIREMENTS MET]
     │
     ├── Progress saved to localStorage
     ├── Module marked: COMPLETED ✓
     ├── Next module: UNLOCKED 🔓
     ├── Congratulation UI shown 🎉
     └── "Next Module" button appears
```

---

## 5. Database Design

### 5.1 Dataset Progression Strategy

| Level | Database | Complexity | Rationale |
|---|---|---|---|
| Beginner (M1-20) | School | Simple (5 tables) | Relatable context, simple columns |
| Intermediate (M21-40) | E-Commerce | Medium (6 tables) | Real-world, natural JOIN scenarios |
| Advanced (M41-60) | E-Commerce + Extensions | Complex (10 tables) | Complex relationships, analytics |

### 5.2 School Database Schema (Beginner)

```sql
-- ============================================
-- SCHOOL DATABASE — Beginner Modules (M1-M20)
-- 5 Tables, ~275 total records
-- ============================================

CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    grade TEXT CHECK(grade IN ('A', 'B', 'C', 'D', 'F')),
    city TEXT,
    age INTEGER CHECK(age BETWEEN 15 AND 25),
    email TEXT,
    enrollment_date DATE
);

CREATE TABLE teachers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT,
    experience_years INTEGER,
    salary DECIMAL(10, 2),
    hire_date DATE
);

CREATE TABLE departments (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    head_teacher_id INTEGER,
    budget DECIMAL(10, 2),
    FOREIGN KEY (head_teacher_id) REFERENCES teachers(id)
);

CREATE TABLE courses (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    teacher_id INTEGER,
    department_id INTEGER,
    credits INTEGER CHECK(credits BETWEEN 1 AND 5),
    max_students INTEGER DEFAULT 30,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE enrollments (
    id INTEGER PRIMARY KEY,
    student_id INTEGER,
    course_id INTEGER,
    enrollment_date DATE,
    score DECIMAL(5, 2),
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- INDEXES for practice demonstration
CREATE INDEX idx_students_city ON students(city);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
```

**Seed Data Volume:**

| Table | Records | Notable Fields |
|---|---|---|
| students | 50 | 10 cities, grades A-F distribution |
| teachers | 10 | 5 subjects, 1-20 years experience |
| departments | 5 | Science, Math, Arts, Commerce, Sports |
| courses | 15 | 3 per department, varied credits |
| enrollments | 200 | Scores 0-100, some NULLs (in progress) |

**Sample Seed Data (Excerpt):**

```sql
INSERT INTO students (id, name, grade, city, age, email, enrollment_date) VALUES
(1, 'Rahul Sharma', 'A', 'Delhi', 18, 'rahul@example.com', '2023-06-15'),
(2, 'Priya Patel', 'B', 'Mumbai', 19, 'priya@example.com', '2023-06-16'),
(3, 'Amit Kumar', 'A', 'Delhi', 20, 'amit@example.com', '2023-06-17'),
-- ... (47 more records)
(50, 'Sneha Reddy', 'C', 'Hyderabad', 18, 'sneha@example.com', '2023-07-01');

INSERT INTO teachers (id, name, subject, experience_years, salary, hire_date) VALUES
(1, 'Dr. Rajesh Verma', 'Mathematics', 15, 85000.00, '2010-06-01'),
(2, 'Prof. Sunita Singh', 'Physics', 12, 78000.00, '2012-01-15'),
-- ... (8 more records)
```

### 5.3 E-Commerce Database Schema (Intermediate)

```sql
-- ============================================
-- E-COMMERCE DATABASE — Intermediate (M21-M40)
-- 6 Tables, ~2,300 total records
-- ============================================

CREATE TABLE customers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    city TEXT,
    state TEXT,
    registration_date DATE,
    customer_type TEXT CHECK(customer_type IN ('regular', 'premium', 'vip'))
);

CREATE TABLE categories (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    parent_category_id INTEGER,
    FOREIGN KEY (parent_category_id) REFERENCES categories(id)
);

CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    category_id INTEGER,
    created_date DATE,
    is_active BOOLEAN DEFAULT 1,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER,
    order_date DATETIME,
    total_amount DECIMAL(10, 2),
    status TEXT CHECK(status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE order_items (
    id INTEGER PRIMARY KEY,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER CHECK(quantity > 0),
    unit_price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE payments (
    id INTEGER PRIMARY KEY,
    order_id INTEGER,
    payment_date DATETIME,
    amount DECIMAL(10, 2),
    payment_method TEXT CHECK(payment_method IN ('credit_card', 'debit_card', 'upi', 'netbanking', 'cod')),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Indexes
CREATE INDEX idx_customers_city ON customers(city);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_order_items_order ON order_items(order_id);
```

**Seed Data Volume:**

| Table | Records | Notable Fields |
|---|---|---|
| customers | 100 | 15 cities, 10 states, 3 customer types |
| categories | 20 | 5 parent categories, 15 subcategories |
| products | 200 | Prices ₹100-₹50,000, varied stock |
| orders | 500 | Jan-Dec 2023, 5 statuses |
| order_items | 1,000+ | 1-5 items per order |
| payments | 500 | 5 payment methods |

### 5.4 Advanced Database Schema (Advanced)

```sql
-- ============================================
-- ADVANCED DATABASE — Advanced (M41-M60)
-- All E-Commerce tables PLUS 4 new tables
-- ~4,300 total records
-- ============================================

-- (All E-Commerce tables from 5.3 included)

CREATE TABLE reviews (
    id INTEGER PRIMARY KEY,
    product_id INTEGER,
    customer_id INTEGER,
    rating INTEGER CHECK(rating BETWEEN 1 AND 5),
    comment TEXT,
    review_date DATE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE shipping (
    id INTEGER PRIMARY KEY,
    order_id INTEGER,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    shipping_status TEXT CHECK(shipping_status IN ('packed', 'in_transit', 'out_for_delivery', 'delivered', 'returned')),
    tracking_number TEXT,
    estimated_delivery DATE,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE inventory_log (
    id INTEGER PRIMARY KEY,
    product_id INTEGER,
    change_quantity INTEGER,
    change_type TEXT CHECK(change_type IN ('restock', 'sale', 'return', 'adjustment')),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE customer_segments (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER,
    segment_name TEXT CHECK(segment_name IN ('new_customer', 'regular', 'loyal', 'at_risk', 'churned', 'vip')),
    assigned_date DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Advanced indexes for optimization practice
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_shipping_status ON shipping(shipping_status);
CREATE INDEX idx_inventory_product_time ON inventory_log(product_id, timestamp);
```

**Additional Seed Data:**

| Table | Records | Purpose |
|---|---|---|
| reviews | 500 | Window functions, sentiment analysis |
| shipping | 400 | Complex status tracking, date calculations |
| inventory_log | 1,000 | Running totals, time-series analysis |
| customer_segments | 150 | Segmentation queries, CTEs |

---

## 6. Curriculum Structure

### 6.1 Complete 60-Module Map

#### 🟢 BEGINNER LEVEL — School Database (Modules 1-20)

| # | Module Title | Concepts Covered | Task Difficulty Range |
|---|---|---|---|
| 1 | What is Database & SQL? | DB basics, RDBMS, tables, rows, columns, SQL purpose | ⭐ to ⭐⭐ |
| 2 | Database vs Spreadsheet | When DBs are better, advantages, use cases | ⭐ to ⭐⭐ |
| 3 | SQL Syntax Basics | Statements, clauses, case sensitivity, semicolons, formatting | ⭐ to ⭐⭐⭐ |
| 4 | Data Types Overview | INTEGER, TEXT, REAL, DATE, DECIMAL, NULL concept | ⭐ to ⭐⭐ |
| 5 | SELECT Fundamentals | Single column selection, basic SELECT * | ⭐ to ⭐⭐ |
| 6 | SELECT Multiple Columns | Comma separation, column order, selecting specific sets | ⭐ to ⭐⭐⭐ |
| 7 | Column Aliases (AS) | Renaming output columns, AS keyword, aliases without AS | ⭐ to ⭐⭐⭐ |
| 8 | DISTINCT | Removing duplicates, single/multiple column DISTINCT | ⭐ to ⭐⭐⭐ |
| 9 | WHERE Introduction | Filtering rows, basic conditions, comparison operators intro | ⭐ to ⭐⭐ |
| 10 | **🎯 Mini Project 1: Student Directory** | Combine M1-M9 concepts | ⭐⭐ to ⭐⭐⭐⭐ |
| 11 | Comparison Operators | =, <>, !=, <, >, <=, >= with numbers and text | ⭐ to ⭐⭐⭐ |
| 12 | Logical Operators | AND, OR, NOT, operator precedence, parentheses | ⭐⭐ to ⭐⭐⭐⭐ |
| 13 | BETWEEN | Range queries, inclusive bounds, NOT BETWEEN, dates/numbers | ⭐ to ⭐⭐⭐ |
| 14 | IN Operator | Multiple value matching, IN vs OR, NOT IN | ⭐ to ⭐⭐⭐ |
| 15 | LIKE & Wildcards | % (any chars), _ (single char), case sensitivity, patterns | ⭐⭐ to ⭐⭐⭐⭐ |
| 16 | NULL Handling | IS NULL, IS NOT NULL, why = NULL fails, NULL in calculations | ⭐⭐ to ⭐⭐⭐ |
| 17 | ORDER BY Basics | Single column sort, ASC (default), DESC, text/number sorting | ⭐ to ⭐⭐⭐ |
| 18 | ORDER BY Multiple Columns | Multi-column sort, sort priority, mixing ASC/DESC | ⭐⭐ to ⭐⭐⭐⭐ |
| 19 | LIMIT & OFFSET | Result limiting, pagination (LIMIT/OFFSET), combining with ORDER BY | ⭐⭐ to ⭐⭐⭐⭐ |
| 20 | **🏆 Level Project: School Report Generator** | All M1-M19 concepts combined | ⭐⭐⭐ to ⭐⭐⭐⭐⭐ |

#### 🟡 INTERMEDIATE LEVEL — E-Commerce Database (Modules 21-40)

| # | Module Title | Concepts Covered | Prerequisites |
|---|---|---|---|
| 21 | Aggregate Functions Intro | What aggregates do, COUNT/SUM/AVG/MIN/MAX overview | M1-M20 |
| 22 | COUNT Deep Dive | COUNT(*), COUNT(column), COUNT(DISTINCT), NULL behavior | M21 |
| 23 | SUM & AVG | Total calculations, averages, rounding, NULL handling | M21 |
| 24 | MIN & MAX | Finding extremes, dates, text, combining with WHERE | M21 |
| 25 | GROUP BY Fundamentals | Row grouping, aggregate context, single column grouping | M21-M24 |
| 26 | GROUP BY Multiple Columns | Multi-column grouping, grouping hierarchy | M25 |
| 27 | HAVING Clause | Filtering groups, WHERE vs HAVING, aggregate conditions | M25-M26 |
| 28 | Subqueries Introduction | Nested queries, scalar subqueries, execution order | M1-M27 |
| 29 | WHERE Subqueries | Subquery in WHERE, comparison operators, IN with subquery | M28 |
| 30 | **🎯 Mini Project 2: Sales Analytics** | Aggregates + GROUP BY + subqueries | M21-M29 |
| 31 | SELECT Subqueries | Subquery in SELECT, correlated subqueries, computed columns | M28-M29 |
| 32 | EXISTS Operator | EXISTS vs IN, correlated EXISTS, NOT EXISTS | M28-M31 |
| 33 | INNER JOIN | Table relationships, matching rows, ON condition, aliases | M1-M32 |
| 34 | LEFT JOIN | All left rows + matching right, NULL for non-matches | M33 |
| 35 | RIGHT JOIN | All right rows + matching left, LEFT vs RIGHT equivalence | M34 |
| 36 | FULL OUTER JOIN | All rows from both tables, NULL handling both sides | M34-M35 |
| 37 | CROSS JOIN & SELF JOIN | Cartesian product, self-referencing, practical uses | M33-M36 |
| 38 | UNION & UNION ALL | Combining result sets, duplicate handling, column matching | M1-M37 |
| 39 | CASE Statement | Conditional logic, WHEN/THEN/ELSE, CASE in SELECT/WHERE/ORDER | M1-M38 |
| 40 | **🏆 Level Project: E-Commerce Analytics** | All M21-M39 combined, business intelligence queries | M21-M39 |

#### 🔴 ADVANCED LEVEL — Full Database (Modules 41-60)

| # | Module Title | Concepts Covered | Prerequisites |
|---|---|---|---|
| 41 | Window Functions Intro | OVER clause, PARTITION BY, ORDER BY in windows, vs GROUP BY | M1-M40 |
| 42 | ROW_NUMBER | Sequential numbering, partitioning, deduplication use case | M41 |
| 43 | RANK & DENSE_RANK | Ranking with gaps, dense ranking, competition scenarios | M42 |
| 44 | LAG & LEAD | Previous/next row access, default values, time-series analysis | M41 |
| 45 | Running Totals & Moving Averages | Cumulative SUM, window frames (ROWS BETWEEN), moving calculations | M41-M44 |
| 46 | CTE Introduction | WITH clause, readability, single CTE, naming | M1-M40 |
| 47 | Multiple CTEs | Comma-separated CTEs, chaining, step-by-step query building | M46 |
| 48 | Recursive CTEs | Hierarchy traversal, employee-manager trees, category trees, anchor + recursive part | M46-M47 |
| 49 | **🎯 Mini Project 3: Advanced Analytics** | Window functions + CTEs combined | M41-M48 |
| 50 | Views | CREATE VIEW, virtual tables, simplifying complex queries, view security | M1-M49 |
| 51 | Updating Views | Updatable view rules, WITH CHECK OPTION, view limitations | M50 |
| 52 | Indexes | CREATE INDEX, index types, when to index, performance impact, EXPLAIN QUERY PLAN | M1-M51 |
| 53 | Transactions | BEGIN/COMMIT/ROLLBACK, atomicity, practical transaction scenarios | M1-M52 |
| 54 | ACID Properties | Atomicity, Consistency, Isolation, Durability — theory + SQLite examples | M53 |
| 55 | Triggers | CREATE TRIGGER, BEFORE/AFTER, INSERT/UPDATE/DELETE events, audit logs | M1-M54 |
| 56 | Query Optimization | EXPLAIN QUERY PLAN, identifying slow queries, optimization strategies | M52 |
| 57 | Execution Plans | Reading query plans, identifying bottlenecks, full scan vs index scan | M56 |
| 58 | Data Modeling | Normalization (1NF, 2NF, 3NF), relationships (1:1, 1:N, M:N), ERD basics | M1-M57 |
| 59 | **🎯 Mini Project 4: Performance Optimization** | Indexing + optimization + analysis | M52-M58 |
| 60 | **👑 Capstone: Business Intelligence System** | ALL concepts from M1-M59, complete data analysis system | M1-M59 |

### 6.2 Module Difficulty Progression

```
DIFFICULTY CURVE ACROSS 60 MODULES:

Easy    ┤ ████
        │ ████████
Medium  │      ████████████
        │           ████████████████
Hard    │                ████████████████████
        │                        ████████████████████
V.Hard  │                                    ██████████
        └────────────────────────────────────────────────►
          M1        M20        M40        M60
          │         │          │          │
       Beginner   Level 1   Level 2   Capstone
```

---

## 7. Module Content Template

### 7.1 Standard 7-Section Structure

Every module follows this exact structure (60 modules × 7 sections = 420 content sections):

```
┌─────────────────────────────────────────────────┐
│ MODULE [X]: [TITLE]                             │
│ Level: [Beginner/Intermediate/Advanced]         │
│ Estimated Time: [XX minutes]                    │
├─────────────────────────────────────────────────┤
│                                                 │
│ SECTION 1: 📖 THEORY                            │
│ ├── Concept explanation (simple → complex)     │
│ ├── Real-world analogy (EN + HI)               │
│ ├── Visual diagrams (SVG/Mermaid)               │
│ ├── Why this concept matters                   │
│ └── Key terminology defined                     │
│                                                 │
│ SECTION 2: 🎬 ANIMATED TUTORIAL                │
│ ├── Code typing animation (sequential)          │
│ ├── Table visualization (rows highlighted)      │
│ ├── Result comparison animation                 │
│ └── Play/Pause/Replay controls                  │
│                                                 │
│ SECTION 3: 💡 SYNTAX & EXAMPLES                │
│ ├── Syntax box (color-coded)                    │
│ ├── Example 1: Easy (with output)               │
│ ├── Example 2: Medium (with output)             │
│ ├── Example 3: Hard (with output)               │
│ ├── Example 4: Very Hard (with output)          │
│ └── "Try it yourself" → link to console         │
│                                                 │
│ SECTION 4: ⚠️ COMMON MISTAKES                  │
│ ├── Mistake #1: Description + correct approach │
│ ├── Mistake #2: Description + correct approach │
│ ├── Mistake #3: Description + correct approach │
│ └── 💡 Pro tips                                 │
│                                                 │
│ SECTION 5: 📝 QUIZ (4 questions, 70% to pass)  │
│ ├── Q1: MCQ (theory check)                     │
│ ├── Q2: Output Prediction (logic check)        │
│ ├── Q3: Query Building (practical check)       │
│ ├── Q4: Fill in Blanks (syntax check)          │
│ └── Unlimited retries, explanations shown       │
│                                                 │
│ SECTION 6: ⌨ PRACTICE CONSOLE (5 tasks)       │
│ ├── Task 1: ⭐ Very Easy                       │
│ ├── Task 2: ⭐⭐ Easy                          │
│ ├── Task 3: ⭐⭐⭐ Medium                      │
│ ├── Task 4: ⭐⭐⭐⭐ Hard                      │
│ ├── Task 5: ⭐⭐⭐⭐⭐ Very Hard               │
│ └── 3-level hints per task                     │
│                                                 │
│ SECTION 7: ✅ COMPLETION                       │
│ ├── Requirements checklist                     │
│ ├── Progress summary                           │
│ ├── Next module preview + unlock               │
│ └── "What you learned" recap                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 7.2 Module JSON Schema

```json
{
  "id": "module-32",
  "number": 32,
  "level": "intermediate",
  "title": {
    "en": "LEFT JOIN",
    "hi": "LEFT JOIN Samajhna"
  },
  "estimatedTime": "25 minutes",
  "prerequisites": ["module-31", "module-33"],
  "learningObjectives": {
    "en": [
      "Understand what LEFT JOIN returns",
      "Write LEFT JOIN queries with correct syntax",
      "Identify when to use LEFT JOIN vs INNER JOIN"
    ],
    "hi": [
      "LEFT JOIN kya return karta hai samajhna",
      "LEFT JOIN queries sahi syntax se likhna",
      " kab LEFT JOIN vs INNER JOIN use karna hai"
    ]
  },
  "theory": {
    "sections": [
      {
        "heading": { "en": "...", "hi": "..." },
        "content": { "en": "...", "hi": "..." },
        "diagram": "path/to/diagram.svg"
      }
    ]
  },
  "animatedTutorial": {
    "steps": [
      {
        "codeTyped": "SELECT * FROM employees LEFT JOIN departments ON ...",
        "tableState": { "highlightedRows": [1, 3, 5] },
        "explanation": { "en": "...", "hi": "..." }
      }
    ]
  },
  "syntax": {
    "template": "SELECT columns FROM table1 LEFT JOIN table2 ON condition",
    "components": [
      { "part": "SELECT columns", "description": { "en": "...", "hi": "..." } }
    ]
  },
  "examples": [
    {
      "difficulty": "easy",
      "query": "SELECT e.name, d.name FROM employees e LEFT JOIN departments d ON e.dept_id = d.id",
      "output": { "columns": ["name", "name"], "rows": [["Rahul", "Sales"], ["Amit", null]] },
      "explanation": { "en": "...", "hi": "..." }
    }
  ],
  "commonMistakes": [
    {
      "mistake": { "en": "...", "hi": "..." },
      "correction": { "en": "...", "hi": "..." }
    }
  ],
  "quiz": {
    "questions": [
      {
        "type": "mcq",
        "question": { "en": "...", "hi": "..." },
        "options": [{ "en": "...", "hi": "..." }],
        "correctIndex": 2,
        "explanation": { "en": "...", "hi": "..." }
      }
    ]
  },
  "practiceTasks": [
    {
      "id": "task-1",
      "difficulty": "very_easy",
      "description": { "en": "...", "hi": "..." },
      "expectedResult": {
        "columns": ["name", "department"],
        "rows": [["Rahul", "Sales"], ["Amit", null]]
      },
      "hints": [
        { "level": 1, "type": "concept", "content": { "en": "...", "hi": "..." } },
        { "level": 2, "type": "structure", "content": { "en": "...", "hi": "..." } },
        { "level": 3, "type": "partial", "content": { "en": "...", "hi": "..." } }
      ],
      "validation": {
        "ignoreColumnOrder": false,
        "ignoreRowOrder": true,
        "checkColumnNames": false,
        "numericTolerance": 0.01
      }
    }
  ]
}
```

---

## 8. Practice Console Architecture

### 8.1 3-Panel IDE Layout (Desktop)

```
┌─────────────────────────────────────────────────────────────────┐
│  M32: LEFT JOIN        [📋 Tasks ▾] [💡 Hints] [⚙ Settings]    │
├──────────────┬──────────────────────────┬──────────────────────┤
│              │                          │                      │
│  📚 SCHEMA   │  ⌨ QUERY EDITOR         │  📊 RESULTS          │
│  (Left Panel)│  (Center Panel)          │  (Right Panel)       │
│              │                          │                      │
│  📁 school_db│  ┌────────────────────┐ │  ┌────┬────────┐    │
│              │  │ 1| SELECT e.name,  │ │  │name│ dept   │    │
│  📄 students │  │ 2|   d.dept_name   │ │  ├────┼────────┤    │
│   ├─id 🔑    │  │ 3| FROM employees  │ │  │Rahu│ Sales  │    │
│   ├─name     │  │ 4|   e             │ │  │Amit│ NULL   │    │
│   ├─grade    │  │ 5| LEFT JOIN       │ │  │Priy│ HR     │    │
│   ├─city     │  │ 6|   departments d │ │  └────┴────────┘    │
│   └─email    │  │ 7|   ON e.dept_id  │ │                      │
│              │  │ 8|   = d.id;       │ │  ✅ 3 rows returned  │
│  📄 teachers │  └────────────────────┘ │                      │
│   ├─id 🔑    │                          │  🎯 Task 2/5         │
│   ├─name     │  [▶ RUN] [↺ RESET]      │  ✅ CORRECT!         │
│   └─...      │  [🗑 CLEAR] [📋 COPY]   │     [Next Task →]    │
│              │                          │                      │
│  📄 courses  │  Query took: 0.003s     │  📊 Stats:           │
│   └─...      │  Rows: 3                │  Attempts: 2         │
│              │                          │  Hints used: 1      │
│  [Click to   │                          │                      │
│   preview    │                          │                      │
│   data]      │                          │                      │
├──────────────┴──────────────────────────┴──────────────────────┤
│  📋 TASK 2/5: ⭐⭐ Easy                                       │
│  Show all employees with their department names. Include      │
│  employees who DON'T have a department (show NULL).           │
│                                                                 │
│  [💡 Hint 1] [💡 Hint 2] [💡 Hint 3] [⏭ Skip Task]           │
├───────────────────────────────────────────────────────────────┤
│  Task Progress: [T1 ✅] [T2 🔄] [T3 ⬜] [T4 ⬜] [T5 ⬜]        │
│  Passed: 1/5 (Need 3/5 to complete)                           │
└───────────────────────────────────────────────────────────────┘
```

### 8.2 Panel Specifications

| Panel | Width (Desktop) | Contents | Interactions |
|---|---|---|---|
| **Schema Panel** | 220px fixed | Database tree, tables, columns, PK/FK indicators | Click table → preview data (modal), click column → highlight in editor |
| **Editor Panel** | Flexible (remaining) | SQL input, line numbers, syntax highlighting | Type query, keyboard shortcuts (Ctrl+Enter = Run) |
| **Results Panel** | 35% of remaining | Results table, validation feedback, task progress | Scroll results, see diff on wrong answer |
| **Task Bar** | Bottom fixed | Task description, hint buttons, skip option, progress | Click hints (progressive unlock), next task |

### 8.3 Editor Features (Basic)

| Feature | Implemented | Notes |
|---|---|---|
| SQL Syntax Highlighting | ✅ | Keywords (blue), strings (green), numbers (orange), comments (gray) |
| Line Numbers | ✅ | Left gutter |
| Multi-line Support | ✅ | Enter creates newline |
| Tab Support | ✅ | Tab inserts 2 spaces |
| Query History | ❌ | Not in v1 |
| Autocomplete | ❌ | Explicitly rejected (Requirement #19) |
| Auto-format | ❌ | Not in v1 |
| Error Detection | ❌ | Only on RUN (via SQLite error) |

### 8.4 Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Enter` / `Cmd + Enter` | Run query |
| `Ctrl + L` | Clear editor |
| `Esc` | Close modals/preview |
| `Tab` | Insert 2 spaces |

---

## 9. Query Validation Engine

### 9.1 Validation Algorithm

```typescript
// PSEUDO-CODE — Actual implementation in TypeScript

async function validateUserQuery(
  userQuery: string,
  task: PracticeTask,
  dbInstance: Database
): Promise<ValidationResult> {

  // STEP 1: Execute user's query
  let userResult: QueryResult;
  try {
    userResult = await dbInstance.execute(userQuery);
  } catch (error) {
    // STEP 2a: Handle execution error
    return {
      status: 'ERROR',
      friendlyMessage: generateFriendlyError(error),
      technicalError: error.message,
      suggestion: detectCommonMistake(error) // FORM→FROM etc.
    };
  }

  // STEP 2b: Query executed successfully, now compare results
  const expected = task.expectedResult;
  const rules = task.validation;

  // STEP 3: Column comparison
  const columnCheck = compareColumns(
    userResult.columns,
    expected.columns,
    rules
  );

  if (!columnCheck.match) {
    return {
      status: 'WRONG',
      message: 'Column structure doesn\'t match',
      diff: generateColumnDiff(userResult, expected)
    };
  }

  // STEP 4: Row comparison
  const normalizedUser = normalizeRows(userResult.rows, rules);
  const normalizedExpected = normalizeRows(expected.rows, rules);

  const rowCheck = compareRows(normalizedUser, normalizedExpected, rules);

  if (!rowCheck.match) {
    return {
      status: 'WRONG',
      message: 'Output rows don\'t match expected result',
      diff: generateRowDiff(normalizedUser, normalizedExpected)
    };
  }

  // STEP 5: Everything matches!
  return {
    status: 'SUCCESS',
    message: '✅ Correct! Well done!',
    rowCount: userResult.rows.length
  };
}
```

### 9.2 Result Normalization Rules

| Rule | Default | When to Change | Example |
|---|---|---|---|
| `ignoreColumnOrder` | `false` | `true` if task doesn't specify column order | Task: "show name and salary" — either order OK |
| `ignoreRowOrder` | `true` | `false` if task has ORDER BY requirement | Task: "sort by salary DESC" — order matters |
| `caseSensitiveData` | `false` | `true` for case-specific tasks | Task: "match exact product name case" |
| `trimWhitespace` | `true` | Never change | 'Rahul ' == 'Rahul' |
| `numericTolerance` | `0.01` | `0.001` for precise calculations | AVG(salary) = 52345.67 vs 52345.68 |
| `checkColumnNames` | `false` | `true` if aliases required | Task: "show as 'total_salary'" |

### 9.3 Comparison Logic Detail

```typescript
function compareColumns(userCols, expectedCols, rules): boolean {
  if (rules.checkColumnNames) {
    // Exact column name matching (including aliases)
    return arraysEqual(userCols, expectedCols);
  }
  // Just count check
  return userCols.length === expectedCols.length;
}

function normalizeRows(rows, rules): NormalizedRow[] {
  return rows.map(row =>
    row.map(cell => {
      if (typeof cell === 'string') {
        if (rules.trimWhitespace) cell = cell.trim();
        if (!rules.caseSensitiveData) cell = cell.toLowerCase();
      }
      if (typeof cell === 'number') {
        cell = round(cell, rules.numericTolerance);
      }
      if (cell === null || cell === undefined) {
        cell = null; // Normalize both null and undefined
      }
      return cell;
    })
  );
}

function compareRows(userRows, expectedRows, rules): boolean {
  if (userRows.length !== expectedRows.length) return false;

  let userSorted = userRows;
  let expectedSorted = expectedRows;

  if (rules.ignoreRowOrder) {
    // Sort both by stringified representation for comparison
    userSorted = [...userRows].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    expectedSorted = [...expectedRows].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  }

  return userSorted.every((row, i) =>
    row.every((cell, j) => cellEquals(cell, expectedSorted[i][j]))
  );
}
```

### 9.4 Diff View Generation

When validation fails, show visual comparison:

```
❌ OUTPUT DOESN'T MATCH

┌───────────── Expected ─────────────┐
│  name    │  department             │
│  Rahul   │  Sales                  │
│  Amit    │  (NULL)                 │
│  Priya   │  HR                     │
└────────────────────────────────────┘

┌───────────── Your Output ──────────┐
│  name    │  department             │
│  Rahul   │  Sales                  │
│  Priya   │  HR                     │
└────────────────────────────────────┘

📊 Analysis:
├── Row count: Expected 3, Got 2 (missing 1 row)
├── Amit with NULL department missing
│
💡 Likely issue: You used INNER JOIN instead of LEFT JOIN
💡 Try: LEFT JOIN departments d ON e.dept_id = d.id
```

---

## 10. Hint System

### 10.1 3-Level Progressive Structure

Each of the 300 practice tasks has exactly 3 hints, unlocked sequentially:

| Level | Type | Content Style | Example (LEFT JOIN Task) |
|---|---|---|---|
| **Level 1** | Concept | Plain language reminder, no code | "LEFT JOIN left table ke SAARE rows rakhta hai. Right table me match na ho to NULL aata hai." |
| **Level 2** | Structure | Query skeleton with blanks | `SELECT ___ FROM employees ___ departments ___ ON ___ = ___` |
| **Level 3** | Partial | Almost-complete query, one blank | `SELECT e.name, d.name FROM employees e LEFT JOIN departments d ON e.___ = d.id` |

### 10.2 Hint Unlock Logic

```
HINT FLOW:

[Task Active]
     │
     ▼
[💡 Hint 1] ← Always available (free)
     │ Click
     ▼
[Hint 1 shown] [💡 Hint 2 appears]
     │ Click
     ▼
[Hint 2 shown] [💡 Hint 3 appears]
     │ Click
     ▼
[Hint 3 shown] [❌ No more hints]
     │
     ▼
[⏭ Skip Task option appears after all 3 hints]

RULES:
├── Hints don't unlock each other until clicked
├── Hint usage tracked (1-3 per task)
├── Skipped tasks don't count toward 3/5 requirement
└── Hint usage shown in stats (encourage independent solving)
```

### 10.3 Hint Content Template (JSON)

```json
{
  "taskId": "module-32-task-2",
  "hints": [
    {
      "level": 1,
      "type": "concept",
      "content": {
        "en": "LEFT JOIN keeps ALL rows from the left table. If there's no match in the right table, the right columns show NULL.",
        "hi": "LEFT JOIN left table ke SAARE rows rakhta hai. Right table me match nahi mila to right columns me NULL dikhta hai."
      }
    },
    {
      "level": 2,
      "type": "structure",
      "content": {
        "en": "SELECT [columns] FROM [left_table] LEFT JOIN [right_table] ON [join_condition]",
        "hi": "SELECT [columns] FROM [left_table] LEFT JOIN [right_table] ON [join_condition]"
      }
    },
    {
      "level": 3,
      "type": "partial",
      "content": {
        "en": "SELECT e.name, d.name FROM employees e LEFT JOIN departments d ON e.dept_id = ___",
        "hi": "Sirf last blank bachi hai — departments table ki id column ka naam kya hai?"
      }
    }
  ]
}
```

---

## 11. Error Feedback System

### 11.1 Error Display Structure

When query execution fails:

```
┌─────────────────────────────────────────────────────┐
│ ❌ QUERY ERROR                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  💡 Aapne "FORM" likha hai —                    │
│     correct keyword "FROM" hai.                   │
│     (Yeh bahut common typo hai!)                  │
│                                                     │
│  ──────── Technical Details ────────               │
│  SQLite Error: near "FORM": syntax error          │
│  Line: 1, Column: 14                              │
│                                                     │
│  [✏️ Fix in Editor]  [💡 Show Hint]               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 11.2 Common Error Pattern Detection

| Error Pattern | SQLite Message Fragment | Friendly Suggestion |
|---|---|---|
| `FORM` instead of `FROM` | `near "FORM": syntax error` | "Aapne FORM likha hai — FROM hona chahiye" |
| `WERE` instead of `WHERE` | `near "WERE": syntax error` | "WERE → WHERE spelling check karo" |
| Missing semicolon (rare in SQLite) | Usually OK | N/A (SQLite doesn't require semicolons) |
| Missing quotes | `near "A": syntax error` | "String values ko quotes me rakho: 'A' ya \"A\"" |
| Wrong table name | `no such table: student` | "Table 'student' nahi mila. Schema dekho — 'students' hai" |
| Wrong column name | `no such column: nam` | "Column 'nam' nahi hai. Schema panel me columns dekho" |
| Unclosed string | `unterminated string` | "Quote close karna bhool gaye — '..." ' missing" |
| Invalid operator | `near "<>=": syntax error` | "Invalid operator. Valid: =, <>, <, >, <=, >=" |

### 11.3 Error Feedback Priority

```
ERROR DISPLAY ORDER:
1. Friendly explanation (if pattern detected)
2. Technical SQLite error (always shown)
3. Action buttons (Fix / Hint)
```

---

## 12. Sandbox Mode

### 12.1 Sandbox Features

| Feature | Status | Notes |
|---|---|---|
| CREATE TABLE | ✅ Allowed | User can create own tables |
| INSERT INTO | ✅ Allowed | Add data to any table |
| UPDATE | ✅ Allowed | Modify existing data |
| DELETE | ✅ Allowed | Remove rows |
| DROP TABLE | ✅ Allowed | Remove tables (including seeded ones) |
| ALTER TABLE | ✅ Allowed | Modify table structure |
| CREATE VIEW/INDEX/TRIGGER | ✅ Allowed | All DDL supported |
| Transactions | ✅ Allowed | BEGIN/COMMIT/ROLLBACK |
| **Reset Database** | ✅ Button | Restores original seed data |
| **Save Sandbox State** | ❌ Not in v1 | localStorage space limitation |
| **Export/Import** | ❌ Not in v1 | Future feature |

### 12.2 Isolation Architecture

```
DATABASE INSTANCES:

┌─────────────────────────────────────┐
│  Module Task Database               │
│  (Fresh instance per module)        │
│  ├── Task validation runs here      │
│  ├── Resets on module entry         │
│  └── Isolated from sandbox          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Sandbox Database                   │
│  (Persistent during session)        │
│  ├── User experiments here          │
│  ├── CREATE/DROP allowed            │
│  ├── Reset button restores seed     │
│  └── Isolated from tasks            │
└─────────────────────────────────────┘

RULE: Kisi bhi module task me sandbox
      ka asar NAHI padta, aur vice versa.
```

### 12.3 Sandbox UI

```
┌─────────────────────────────────────────────┐
│ 🧪 SANDBOX MODE (Free Practice)           │
│ [ℹ️ How it works] [🔄 Reset Database]     │
├─────────────────────────────────────────────┤
│                                             │
│  (Same 3-panel layout as console)           │
│  But NO task bar, NO validation             │
│  Just: Schema + Editor + Results            │
│                                             │
│  User can:                                  │
│  ✅ Create own tables                      │
│  ✅ Modify existing data                    │
│  ✅ Drop tables (yolo mode)                │
│  ✅ Practice without judgment               │
│                                             │
│  [🔄 Reset] = Original data restore hoga  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 13. Quiz System

### 13.1 Question Type Specifications

#### Type 1: MCQ (Multiple Choice)

```json
{
  "type": "mcq",
  "question": {
    "en": "What does LEFT JOIN return when there's no match in the right table?",
    "hi": "LEFT JOIN me right table se match na mile to kya return hota hai?"
  },
  "options": [
    { "en": "Only matching rows", "hi": "Sirf matching rows" },
    { "en": "All left rows with NULL for right columns", "hi": "Saare left rows, right columns me NULL" },
    { "en": "An error", "hi": "Error aata hai" },
    { "en": "All rows from both tables", "hi": "Dono tables ke saare rows" }
  ],
  "correctIndex": 1,
  "explanation": {
    "en": "LEFT JOIN preserves ALL rows from left table. Non-matching right table columns become NULL.",
    "hi": "LEFT JOIN left table ke saare rows rakhta hai. Non-matching right columns NULL ban jate hain."
  }
}
```

#### Type 2: Output Prediction

```json
{
  "type": "output_prediction",
  "queryShown": "SELECT COUNT(*), city FROM students GROUP BY city HAVING COUNT(*) > 2 ORDER BY COUNT(*) DESC;",
  "question": {
    "en": "What will this query return?",
    "hi": "Yeh query kya return karegi?"
  },
  "options": [
    {
      "label": "A",
      "result": { "columns": ["COUNT(*)", "city"], "rows": [["15", "Delhi"], ["12", "Mumbai"]] }
    },
    {
      "label": "B",
      "result": { "columns": ["COUNT(*)", "city"], "rows": [["15", "Delhi"]] }
    },
    {
      "label": "C",
      "result": { "columns": ["COUNT(*)", "city"], "rows": [["15", "Delhi"], ["12", "Mumbai"], ["8", "Bangalore"]] }
    },
    {
      "label": "D",
      "result": { "error": "Error: Invalid syntax" }
    }
  ],
  "correctIndex": 0,
  "explanation": {
    "en": "HAVING filters groups with COUNT > 2. ORDER BY sorts by count descending. Only Delhi and Mumbai have more than 2 students.",
    "hi": "HAVING un groups ko filter karta hai jinka COUNT > 2 hai. Sirf Delhi aur Mumbai me 2 se zyada students hain."
  }
}
```

#### Type 3: Query Building (Drag-Drop)

```json
{
  "type": "query_building",
  "description": {
    "en": "Build a query to find average salary by department",
    "hi": "Department-wise average salary nikalne ki query banao"
  },
  "wordBank": ["SELECT", "AVG(salary)", "FROM", "employees", "GROUP BY", "department"],
  "correctSequence": ["SELECT", "AVG(salary)", "FROM", "employees", "GROUP BY", "department"],
  "explanation": {
    "en": "SELECT the aggregate, FROM the table, GROUP BY the category",
    "hi": "Pehle aggregate select karo, phir table, phir group by category"
  }
}
```

#### Type 4: Fill in Blanks

```json
{
  "type": "fill_blanks",
  "template": "SELECT ___(salary), department FROM employees ___ department",
  "blanks": [
    {
      "position": 0,
      "options": ["AVG", "COUNT", "MAX", "MIN"],
      "correct": "AVG"
    },
    {
      "position": 1,
      "options": ["GROUP BY", "ORDER BY", "WHERE", "HAVING"],
      "correct": "GROUP BY"
    }
  ],
  "explanation": {
    "en": "AVG for average, GROUP BY to group results by department",
    "hi": "Average ke liye AVG, results ko department me group karne ke liye GROUP BY"
  }
}
```

### 13.2 Quiz Rules

| Rule | Value |
|---|---|
| Questions per module | 4 (one of each type, rotating which specific question) |
| Pass threshold | 70% (3/4 correct) |
| Retry limit | Unlimited |
| Time limit | None |
| Feedback | Instant, with explanation |
| Question order | Fixed (not randomized — consistent learning) |
| Wrong answer behavior | Show correct + explanation, user can continue |
| Score calculation | `correct_count / total_questions × 100` |
| Best score tracking | Only best attempt stored in progress |

---

## 14. Projects & Capstone

### 14.1 Project Timeline

```
MODULES:  1────10────20────30────40────50────60
          │    │    │    │    │    │    │
          ▼    ▼    ▼    ▼    ▼    ▼    ▼
          🛠️  🎯   🏆   🎯   🏆   🎯   👑
          P1   P1   LP1  P2   LP2  P3   CAPSTONE
                    📗              📘
                    Beginner        Intermediate
                                     + Advanced
```

### 14.2 Project Specifications

#### 🎯 Mini Projects (6)

| # | Module | Project | Dataset | Tasks | Est. Time |
|---|---|---|---|---|---|
| P1 | M10 | Student Directory Queries | School | 5 | 20 min |
| P2 | M30 | Sales Analytics | E-Commerce | 6 | 30 min |
| P3 | M49 | Advanced Analytics (Windows+CTE) | Advanced | 6 | 40 min |
| P4 | M40 | Order Management Queries | E-Commerce | 5 | 25 min |
| P5 | M50 | Review System Analytics | Advanced | 5 | 30 min |
| P6 | M59 | Performance Optimization | Advanced | 4 | 45 min |

#### 🏆 Level Projects (3)

| # | Module | Project | Dataset | Tasks | Est. Time |
|---|---|---|---|---|---|
| LP1 | M20 | School Report Generator | School | 8 | 45 min |
| LP2 | M40 | E-Commerce Analytics | E-Commerce | 10 | 60 min |
| LP3 | M60 | Dashboard Data Layer | Advanced | 8 | 75 min |

#### 👑 Capstone (1)

| # | Module | Project | Dataset | Tasks | Est. Time |
|---|---|---|---|---|---|
| CAP | M60 | Complete BI System | Advanced | 12 | 120 min |

### 14.3 Project Task Structure

```typescript
interface ProjectTask {
  id: string;
  order: number;
  businessContext: {
    en: string;  // "The marketing team wants to understand customer distribution by city..."
    hi: string;
  };
  taskDescription: {
    en: string;  // "Write a query that shows..."
    hi: string;
  };
  expectedOutput: {
    columns: string[];
    rows: (string | number | null)[][];
  };
  hints: Hint[];  // 3-level progressive
  validation: ValidationConfig;
  skillsTested: string[];  // ["JOIN", "GROUP BY", "ORDER BY"]
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
}
```

### 14.4 Capstone Project: Business Intelligence System

```yaml
Project: Complete BI System
Module: 60 (Final)
Dataset: Full Advanced Database (10 tables)
Total Tasks: 12
Estimated Time: 120 minutes

Tasks:
  1. Customer Segmentation Analysis
     - Use: CTE + Window Functions
     - Output: Customer segments with purchase frequency and value

  2. Sales Trend Analysis (Month-over-Month)
     - Use: LAG/LEAD + Date functions
     - Output: Monthly sales with growth percentage

  3. Product Performance Ranking
     - Use: RANK + JOIN + Aggregate
     - Output: Products ranked by revenue with category

  4. Customer Lifetime Value Calculation
     - Use: Multiple CTEs + Aggregates
     - Output: CLV per customer with segment

  5. Inventory Movement Analysis
     - Use: Running totals + Window functions
     - Output: Stock levels over time per product

  6. Top Customers per Category
     - Use: Window function + PARTITION BY
     - Output: Top 3 customers per product category

  7. Churn Risk Identification
     - Use: LEFT JOIN + Date calculations
     - Output: Customers inactive for 90+ days

  8. Revenue by Region Analysis
     - Use: Multiple JOINs + GROUP BY
     - Output: State-wise revenue with customer count

  9. Automated Audit View
     - Use: CREATE VIEW + Complex query
     - Output: Reusable sales_summary view

  10. Performance Index Creation
      - Use: CREATE INDEX + EXPLAIN
      - Output: Indexes on frequently queried columns

  11. Trigger for Inventory Logging
      - Use: CREATE TRIGGER
      - Output: Auto-log inventory changes

  12. Executive Dashboard Query Pack
      - Use: Everything combined
      - Output: 5 dashboard-ready queries
```

---

## 15. UI/UX Design System

### 15.1 Color Palette

```yaml
# Light Educational Theme — Coursera-Inspired

Primary (Blue — Trust, Learning):
  50:  "#EFF6FF"
  100: "#DBEAFE"
  200: "#BFDBFE"
  300: "#93C5FD"
  400: "#60A5FA"
  500: "#3B82F6"  # Main actions, links
  600: "#2563EB"  # Hover states
  700: "#1D4ED8"  # Active states
  800: "#1E40AF"
  900: "#1E3A8A"

Secondary (Green — Success, Completion):
  50:  "#ECFDF5"
  500: "#10B981"  # Success, correct answers
  600: "#059669"
  700: "#047857"

Accent (Orange — Highlights, Warnings):
  50:  "#FFF7ED"
  500: "#F59E0B"  # Warning, hints
  600: "#D97706"
  700: "#B45309"

Danger (Red — Errors, Delete):
  50:  "#FEF2F2"
  500: "#EF4444"  # Error states, wrong answers
  600: "#DC2626"
  700: "#B91C1C"

Neutral (Gray — Text, Backgrounds):
  50:  "#F8FAFC"  # Page background
  100: "#F1F5F9"  # Card backgrounds
  200: "#E2E8F0"  # Borders, dividers
  300: "#CBD5E1"
  400: "#94A3B8"
  500: "#64748B"  # Muted text
  600: "#475569"
  700: "#334155"  # Secondary text
  800: "#1E293B"
  900: "#0F172A"  # Main text, headings
```

### 15.2 Typography

```yaml
Fonts:
  Primary UI: "Inter" (400, 500, 600, 700)
    - Body text, buttons, navigation
    - Fallback: system-ui, -apple-system, sans-serif

  Headings: "Poppins" (600, 700)
    - Page titles, section headers
    - Fallback: sans-serif

  Code/SQL: "JetBrains Mono" (400, 500)
    - Query editor, code blocks, results
    - Fallback: "Fira Code", "Consolas", monospace

Font Sizes (Tailwind Scale):
  xs:    "0.75rem"   # 12px — captions, badges
  sm:    "0.875rem"  # 14px — secondary text
  base:  "1rem"      # 16px — body text
  lg:    "1.125rem"  # 18px — emphasized text
  xl:    "1.25rem"   # 20px — card titles
  2xl:   "1.5rem"    # 24px — section headers
  3xl:   "1.875rem"  # 30px — page titles
  4xl:   "2.25rem"   # 36px — hero text
```

### 15.3 Spacing & Layout

```yaml
Spacing (Tailwind Default):
  1:  "4px"
  2:  "8px"
  3:  "12px"
  4:  "16px"   # Standard component padding
  6:  "24px"   # Card padding
  8:  "32px"   # Section spacing
  12: "48px"   # Major section breaks
  16: "64px"   # Page-level spacing

Border Radius:
  sm:   "6px"   # Small buttons, badges
  md:   "10px"  # Buttons, inputs
  lg:   "16px"  # Cards, panels
  full: "9999px" # Pills, circular buttons

Shadows:
  sm: "0 1px 2px rgba(0,0,0,0.05)"
  md: "0 4px 6px rgba(0,0,0,0.07)"
  lg: "0 10px 15px rgba(0,0,0,0.1)"

Max Content Width:
  Reading content: "800px" (optimal line length)
  Console: "1440px" (full workspace)
  Landing page: "1200px"
```

### 15.4 Component States

```yaml
Button States:
  Default: bg-primary-500, text-white
  Hover: bg-primary-600, translateY(-1px), shadow-md
  Active: bg-primary-700, translateY(0)
  Disabled: bg-neutral-200, text-neutral-400, cursor-not-allowed
  Focus: outline-2, outline-primary-500, outline-offset-2

Card States:
  Default: bg-white, border-neutral-200, shadow-sm
  Hover: border-primary-300, shadow-md
  Selected: border-primary-500, ring-1, ring-primary-200

Input States:
  Default: bg-white, border-neutral-300
  Focus: border-primary-500, ring-2, ring-primary-200
  Error: border-danger-500, ring-2, ring-danger-200

Module Status Colors:
  Completed: bg-success-50, border-success-500, icon-check
  Current: bg-primary-50, border-primary-500, icon-play
  Locked: bg-neutral-50, border-neutral-200, icon-lock
```

---

## 16. Navigation & Page Structure

### 16.1 Top Navigation Bar

```
┌─────────────────────────────────────────────────────────────┐
│  🎓 SQL Learn    [📚 Modules ▾]  [🔍 Search]  [EN|HI] [⚙️]  │
│                                    ┌─────────┐              │
│                                    │ 23% ▓▓░ │ Progress     │
└────────────────────────────────────┴─────────┴──────────────┘
```

### 16.2 Modules Dropdown

```
[📚 Modules ▾] Click →
┌─────────────────────────────────────┐
│ 🟢 BEGINNER (8/20 completed)       │
│ ├── M1: Intro to SQL         ✅    │
│ ├── M2: SELECT Basics        ✅    │
│ ├── M3: WHERE Clause         ✅    │
│ ├── ...                            │
│ ├── M10: Mini Project 1      🔒    │
│ └── M20: Level Project       🔒    │
│                                     │
│ 🟡 INTERMEDIATE (0/20)  🔒 LOCKED  │
│ Complete Beginner to unlock        │
│                                     │
│ 🔴 ADVANCED (0/20)       🔒 LOCKED │
│ Complete Intermediate to unlock    │
│                                     │
│ 🧪 Sandbox                          │
│ 📊 My Projects                      │
└─────────────────────────────────────┘
```

### 16.3 Page Structure

```
ROUTES:

/                     → Landing Page (new users) / Dashboard (returning)
/dashboard            → User progress overview
/module/:id           → Module page (theory/quiz/console tabs)
/module/:id/quiz      → Quiz section
/module/:id/console   → Practice console
/projects             → All projects list
/project/:id          → Individual project
/search               → Search & filter page
/sandbox              → Free practice sandbox
/settings             → Language, backup, reset progress
```

### 16.4 Module Page Tabs

```
┌─────────────────────────────────────────────────┐
│  Module 32: LEFT JOIN                           │
│  Level: Intermediate | Est: 25 min              │
├─────────────────────────────────────────────────┤
│  [📖 Theory] [📝 Quiz] [⌨ Practice] [✅ Done]  │
├─────────────────────────────────────────────────┤
│                                                 │
│              (Active Tab Content)               │
│                                                 │
│  Theory:    Full theory + animated tutorial     │
│  Quiz:      4 questions, instant feedback       │
│  Practice:  3-panel console with 5 tasks        │
│  Done:      Completion status + next module     │
│                                                 │
├─────────────────────────────────────────────────┤
│  ← Previous Module    [🏠 Home]    Next Module →│
└─────────────────────────────────────────────────┘
```

---

## 17. Language System

### 17.1 Toggle Behavior

```
LANGUAGE TOGGLE:

Header: [🇬🇧 EN] [🇮🇳 HI]

Click EN → All content in English
Click HI → All content in Hinglish (Roman Hindi)

PREFERENCE:
├── Saved to localStorage
├── Default: Browser language detection
│   ├── navigator.language starts with 'hi' → HI
│   └── Otherwise → EN
└── Toggle is instant (no page reload)
```

### 17.2 Content Localization Structure

```typescript
// Every content string has both languages
interface LocalizedString {
  en: string;  // English version
  hi: string;  // Hinglish version (Roman script)
}

// Example Module Content
const moduleContent = {
  title: {
    en: "LEFT JOIN",
    hi: "LEFT JOIN (Samajhna)"  // Technical terms in English
  },
  theory: {
    en: "LEFT JOIN returns all rows from the left table, and matching rows from the right table. If there's no match, the right table's columns will contain NULL.",
    hi: "LEFT JOIN left table ke saare rows return karta hai, aur right table se matching rows. Agar match nahi milta, to right table ke columns me NULL hota hai."
  }
};

// Queries ALWAYS in English (industry standard)
// Only explanations toggle
```

### 17.3 Translation Coverage

| Content Type | Translated | Notes |
|---|---|---|
| UI Labels (buttons, nav) | ✅ Both | Full translation |
| Theory explanations | ✅ Both | Full translation |
| Task descriptions | ✅ Both | Business context translated |
| Hints (3 levels) | ✅ Both | Full translation |
| Quiz questions & options | ✅ Both | Full translation |
| Error messages (friendly) | ✅ Both | Technical errors in English only |
| **SQL Queries** | ❌ English only | Industry standard |
| **Column/Table names** | ❌ English only | Database standard |
| Code comments | ✅ Both | Comments translated |

---

## 18. Progress Tracking System

### 18.1 localStorage Schema

```json
{
  "sqlLearnProgress": {
    "version": "1.0",
    "lastAccessed": "2025-01-15T10:30:00Z",
    "language": "en",
    "currentLevel": "beginner",
    "modules": {
      "module-01": {
        "status": "completed",
        "theoryRead": true,
        "tasksCompleted": ["task-1", "task-2", "task-3", "task-4", "task-5"],
        "tasksSkipped": [],
        "quizBestScore": 100,
        "quizAttempts": 2,
        "hintsUsed": {
          "task-1": 0,
          "task-2": 1,
          "task-3": 0
        },
        "completedAt": "2025-01-10T15:20:00Z"
      },
      "module-02": {
        "status": "in-progress",
        "theoryRead": true,
        "tasksCompleted": ["task-1", "task-2"],
        "quizBestScore": null,
        "quizAttempts": 0
      }
    },
    "projects": {
      "project-01": {
        "status": "in-progress",
        "tasksCompleted": ["task-1", "task-2"]
      }
    },
    "unlockedModules": ["module-01", "module-02", "module-03"],
    "lastModule": "module-02",
    "stats": {
      "totalQueriesRun": 147,
      "totalTasksCompleted": 12,
      "totalHintsUsed": 5,
      "timeSpent": 4500
    }
  }
}
```

### 18.2 Progress Calculation

```typescript
function calculateProgress(progress: ProgressState): ProgressSummary {
  const completedModules = Object.values(progress.modules)
    .filter(m => m.status === 'completed').length;

  const totalTasks = countAllTasks(); // 300
  const completedTasks = Object.values(progress.modules)
    .reduce((sum, m) => sum + m.tasksCompleted.length, 0);

  return {
    overallPercent: (completedModules / 60) * 100,
    levelProgress: {
      beginner: countCompleted('beginner') / 20,
      intermediate: countCompleted('intermediate') / 20,
      advanced: countCompleted('advanced') / 20
    },
    tasksCompleted: `${completedTasks}/${totalTasks}`,
    projectsCompleted: countCompletedProjects() / 10
  };
}
```

### 18.3 Module Unlock Logic

```typescript
function isModuleUnlocked(moduleId: string, progress: ProgressState): boolean {
  const module = getModuleById(moduleId);

  // Module 1 always unlocked
  if (module.number === 1) return true;

  // Previous module must be complete
  const prevModule = getModuleById(`module-${module.number - 1}`);
  const prevProgress = progress.modules[prevModule.id];

  if (!prevProgress || prevProgress.status !== 'completed') {
    return false;
  }

  // Level boundary check
  // Module 21 (Intermediate start) requires ALL beginner modules complete
  if (module.number === 21) {
    return areAllModulesCompleted('beginner', progress);
  }
  if (module.number === 41) {
    return areAllModulesCompleted('intermediate', progress);
  }

  return true;
}
```

### 18.4 Backup & Export

```
SETTINGS PAGE → Backup Section:

┌─────────────────────────────────────────────┐
│ 💾 Progress Backup                         │
├─────────────────────────────────────────────┤
│                                             │
│ [📋 Copy Backup Code]                      │
│   ↓ Copies JSON to clipboard              │
│                                             │
│ [📥 Download Backup File]                 │
│   ↓ Downloads .json file                  │
│                                             │
│ [📤 Import Progress]                       │
│   ↓ Paste backup code or upload file      │
│                                             │
│ [🗑 Reset All Progress]                    │
│   ↓ Confirmation dialog → Clear all       │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 19. Search & Filter System

### 19.1 Search Interface

```
┌─────────────────────────────────────────────────────┐
│ 🔍 Search modules...                    [Search]   │
│ [Level: All ▾] [Status: All ▾] [Clear Filters]     │
└─────────────────────────────────────────────────────┘

RESULTS:
┌─────────────────────────────────────────────────────┐
│ Found 4 modules for "join"                         │
├─────────────────────────────────────────────────────┤
│ 🟢 M32: INNER JOIN              ✅ Completed       │
│    Introduction to joining tables...                │
│                                                     │
│ 🟢 M33: LEFT JOIN               🔓 Unlocked        │
│    Keep all left rows, match right...              │
│                                                     │
│ 🟢 M34: RIGHT JOIN              🔒 Locked          │
│    All right rows... (Complete M33 first)          │
│                                                     │
│ 🟢 M37: CROSS JOIN & Self JOIN  🔒 Locked          │
│    Cartesian products and self-joins...            │
└─────────────────────────────────────────────────────┘
```

### 19.2 Filter Options

| Filter | Options | Behavior |
|---|---|---|
| **Level** | All / 🟢 Beginner / 🟡 Intermediate / 🔴 Advanced | Filter by module level |
| **Status** | All / ✅ Completed / 🔓 Unlocked / 🔒 Locked | Filter by completion state |

### 19.3 Search Scope

| Field | Searched | Weight |
|---|---|---|
| Module title | ✅ | Highest (title match first) |
| Module description | ✅ | Medium |
| Key concepts | ✅ | Medium |
| Task descriptions | ❌ | Not searched (too noisy) |

---

## 20. Component Architecture

### 20.1 Complete Component Tree

```
App
├── Providers
│   ├── LanguageProvider (Context — EN/HI toggle)
│   └── TooltipProvider (Radix)
│
├── Layout
│   ├── TopBar
│   │   ├── Logo
│   │   ├── NavigationDropdown (Modules ▾)
│   │   │   ├── LevelSection (Beginner/Inter/Adv)
│   │   │   │   ├── ModuleItem (status icon + name)
│   │   │   │   └── LevelProgressBar
│   │   │   ├── SandboxLink
│   │   │   └── ProjectsLink
│   │   ├── SearchTrigger (→ /search)
│   │   ├── LanguageToggle (EN/HI)
│   │   ├── ProgressIndicator (percentage bar)
│   │   └── SettingsMenu (⚙️)
│   │
│   ├── MobileWarning (conditional: < 1024px)
│   └── Footer
│       ├── About
│       └── Version info
│
├── Pages
│   ├── LandingPage
│   │   ├── HeroSection
│   │   │   ├── Headline ("SQL Seekho, Expert Bano")
│   │   │   ├── SubHeadline
│   │   │   ├── CTAButtons (Start Learning / Try Sandbox)
│   │   │   └── ConsolePreviewMock (visual)
│   │   ├── FeaturesGrid (6 feature cards)
│   │   ├── StatsStrip (60 modules, 300 tasks, etc.)
│   │   ├── LearningPathPreview (3 level cards)
│   │   ├── DatasetShowcase (school + e-commerce)
│   │   └── FinalCTA
│   │
│   ├── DashboardPage (returning users)
│   │   ├── ContinueLearningCard (last module)
│   │   ├── OverallProgress (circular + linear)
│   │   ├── LevelBreakdown (3 progress bars)
│   │   ├── ModuleGrid (visible: unlocked + next 3 locked)
│   │   └── QuickActions (Sandbox, Projects, Search)
│   │
│   ├── ModulePage (/:moduleId)
│   │   ├── ModuleHeader
│   │   │   ├── ModuleTitle (localized)
│   │   │   ├── MetaInfo (level, est time, status)
│   │   │   └── ModuleTabs (Theory/Quiz/Practice/Summary)
│   │   │
│   │   ├── TheoryTab
│   │   │   ├── AnimatedTutorial
│   │   │   │   ├── CodeTyperAnimation (types query)
│   │   │   │   ├── TableVisualization (highlight rows)
│   │   │   │   ├── ResultAnimation (slides in)
│   │   │   │   └── AnimationControls (Play/Pause/Replay)
│   │   │   ├── TheoryContent (Markdown renderer)
│   │   │   │   ├── LocalizedText (EN/HI)
│   │   │   │   └── DiagramComponents (SVG)
│   │   │   ├── SyntaxBox (color-coded)
│   │   │   ├── ExamplesList
│   │   │   │   └── ExampleCard (query + output + explanation)
│   │   │   ├── CommonMistakesSection
│   │   │   └── TheoryProgressTracker (scroll tracking)
│   │   │
│   │   ├── QuizTab
│   │   │   ├── QuizIntro (instructions)
│   │   │   ├── QuizQuestion (wrapper)
│   │   │   │   ├── MCQQuestion
│   │   │   │   ├── OutputPredictionQuestion
│   │   │   │   │   └── ResultTablePreview
│   │   │   │   ├── QueryBuilderQuestion
│   │   │   │   │   ├── WordBank (draggable)
│   │   │   │   │   └── QuerySlot (drop zone)
│   │   │   │   └── FillBlanksQuestion
│   │   │   │       └── BlankInput (click to fill)
│   │   │   ├── QuizFeedback (correct/wrong + explanation)
│   │   │   ├── QuizProgress (Q1/4, Q2/4...)
│   │   │   ├── QuizResults (score, pass/fail, retry)
│   │   │   └── QuizRetryButton
│   │   │
│   │   ├── PracticeTab (Console)
│   │   │   └── ConsoleLayout (3-panel)
│   │   │       ├── SchemaPanel
│   │   │       │   ├── DatabaseTree
│   │   │       │   │   ├── TableNode (expandable)
│   │   │       │   │   │   └── ColumnNode (with type icon)
│   │   │       │   │   └── ForeignKeyIndicator
│   │   │       │   └── TablePreviewModal (click table)
│   │   │       │
│   │   │       ├── EditorPanel
│   │   │       │   ├── SQLInput (textarea + highlighting)
│   │   │       │   │   ├── LineNumbers
│   │   │       │   │   └── SyntaxHighlightLayer
│   │   │       │   ├── EditorToolbar
│   │   │       │   │   ├── RunButton (Ctrl+Enter)
│   │   │       │   │   ├── ResetButton
│   │   │       │   │   ├── ClearButton
│   │   │       │   │   └── CopyButton
│   │   │       │   └── QueryStats (time, rows)
│   │   │       │
│   │   │       ├── ResultsPanel
│   │   │       │   ├── ResultsTable
│   │   │       │   │   ├── ColumnHeaders
│   │   │       │   │   └── DataRows (with NULL display)
│   │   │       │   ├── ValidationFeedback
│   │   │       │   │   ├── SuccessMessage (✅)
│   │   │       │   │   ├── ErrorMessage (❌)
│   │   │       │   │   ├── DiffView (expected vs got)
│   │   │       │   │   └── NextTaskButton
│   │   │       │   └── ErrorDisplay (friendly + technical)
│   │   │       │
│   │   │       ├── TaskBar (bottom)
│   │   │       │   ├── TaskDescription (localized)
│   │   │       │   ├── DifficultyStars (⭐ to ⭐⭐⭐⭐⭐)
│   │   │       │   ├── HintButtons (3, progressive unlock)
│   │   │       │   │   └── HintDisplay (modal/inline)
│   │   │       │   ├── SkipTaskButton
│   │   │       │   └── TaskProgress (T1✅ T2🔄 T3⬜...)
│   │   │       │
│   │   │       └── ConsoleModals
│   │   │           ├── TablePreviewModal
│   │   │           └── HintModal
│   │   │
│   │   └── SummaryTab
│   │       ├── CompletionChecklist
│   │       ├── LearningRecap
│   │       ├── NextModulePreview
│   │       └── NextModuleButton (unlocked?)
│   │
│   ├── ProjectsPage
│   │   ├── ProjectList (filter by type)
│   │   └── ProjectCard (status, difficulty, dataset)
│   │
│   ├── ProjectPage (/:projectId)
│   │   ├── ProjectHeader
│   │   ├── ProjectIntro (business context)
│   │   ├── ProjectTasks (sequential)
│   │   │   └── ProjectTaskCard
│   │   │       ├── BusinessContext
│   │   │       ├── TaskDescription
│   │   │       ├── Console (same as module)
│   │   │       └── TaskResult
│   │   └── ProjectSummary
│   │
│   ├── SearchPage
│   │   ├── SearchInput
│   │   ├── FilterDropdowns (Level, Status)
│   │   └── SearchResults
│   │       └── SearchResultCard
│   │
│   ├── SandboxPage
│   │   ├── SandboxIntro (warning + how it works)
│   │   ├── SandboxConsole (3-panel, no tasks)
│   │   └── ResetDatabaseButton (confirmation)
│   │
│   └── SettingsPage
│       ├── LanguageSetting
│       ├── ProgressBackup
│       │   ├── CopyBackupCode
│       │   ├── DownloadBackupFile
│       │   └── ImportProgress
│       └── ResetProgress (danger zone)
│
└── Shared Components
    ├── Button (variants: primary, secondary, outline, ghost, danger)
    ├── Card (with header, content, footer slots)
    ├── Dialog (Radix modal)
    ├── DropdownMenu (Radix)
    ├── Tabs (Radix)
    ├── Tooltip (Radix)
    ├── Progress (linear + circular)
    ├── Badge (status, level, difficulty)
    ├── Toast (notifications)
    ├── Skeleton (loading states)
    └── EmptyState (no data fallback)
```

---

## 21. File & Folder Structure

```
sql-learning-platform/
│
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── sql-wasm/                      # sql.js WASM files (copied from node_modules)
│       ├── sql-wasm.js
│       └── sql-wasm.wasm
│
├── src/
│   ├── components/
│   │   ├── ui/                         # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── badge.tsx
│   │   │   └── toast.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── TopBar.tsx
│   │   │   ├── NavigationDropdown.tsx
│   │   │   ├── SearchTrigger.tsx
│   │   │   ├── LanguageToggle.tsx
│   │   │   ├── ProgressIndicator.tsx
│   │   │   ├── MobileWarning.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── landing/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesGrid.tsx
│   │   │   ├── StatsStrip.tsx
│   │   │   ├── LearningPathPreview.tsx
│   │   │   ├── DatasetShowcase.tsx
│   │   │   └── ConsolePreviewMock.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── ContinueLearningCard.tsx
│   │   │   ├── OverallProgress.tsx
│   │   │   ├── LevelBreakdown.tsx
│   │   │   └── QuickActions.tsx
│   │   │
│   │   ├── module/
│   │   │   ├── ModuleHeader.tsx
│   │   │   ├── ModuleTabs.tsx
│   │   │   │
│   │   │   ├── theory/
│   │   │   │   ├── TheoryTab.tsx
│   │   │   │   ├── AnimatedTutorial.tsx
│   │   │   │   ├── CodeTyperAnimation.tsx
│   │   │   │   ├── TableVisualization.tsx
│   │   │   │   ├── ResultAnimation.tsx
│   │   │   │   ├── AnimationControls.tsx
│   │   │   │   ├── SyntaxBox.tsx
│   │   │   │   ├── ExampleCard.tsx
│   │   │   │   └── CommonMistakes.tsx
│   │   │   │
│   │   │   ├── quiz/
│   │   │   │   ├── QuizTab.tsx
│   │   │   │   ├── QuizQuestion.tsx
│   │   │   │   ├── MCQQuestion.tsx
│   │   │   │   ├── OutputPrediction.tsx
│   │   │   │   ├── QueryBuilder.tsx
│   │   │   │   ├── FillBlanks.tsx
│   │   │   │   ├── QuizFeedback.tsx
│   │   │   │   └── QuizResults.tsx
│   │   │   │
│   │   │   └── summary/
│   │   │       └── SummaryTab.tsx
│   │   │
│   │   ├── console/                    # Shared: Module + Project + Sandbox
│   │   │   ├── ConsoleLayout.tsx
│   │   │   │
│   │   │   ├── schema/
│   │   │   │   ├── SchemaPanel.tsx
│   │   │   │   ├── DatabaseTree.tsx
│   │   │   │   ├── TableNode.tsx
│   │   │   │   ├── ColumnNode.tsx
│   │   │   │   └── TablePreviewModal.tsx
│   │   │   │
│   │   │   ├── editor/
│   │   │   │   ├── EditorPanel.tsx
│   │   │   │   ├── SQLInput.tsx
│   │   │   │   ├── SyntaxHighlighter.tsx
│   │   │   │   └── EditorToolbar.tsx
│   │   │   │
│   │   │   ├── results/
│   │   │   │   ├── ResultsPanel.tsx
│   │   │   │   ├── ResultsTable.tsx
│   │   │   │   ├── ValidationFeedback.tsx
│   │   │   │   ├── DiffView.tsx
│   │   │   │   └── ErrorDisplay.tsx
│   │   │   │
│   │   │   ├── taskbar/
│   │   │   │   ├── TaskBar.tsx
│   │   │   │   ├── TaskDescription.tsx
│   │   │   │   ├── HintSystem.tsx
│   │   │   │   └── TaskProgress.tsx
│   │   │   │
│   │   │   └── shared/
│   │   │       ├── QueryRunner.tsx
│   │   │       └── ResetButton.tsx
│   │   │
│   │   ├── projects/
│   │   │   ├── ProjectsList.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectHeader.tsx
│   │   │   └── ProjectTaskCard.tsx
│   │   │
│   │   ├── search/
│   │   │   ├── SearchPage.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   ├── FilterControls.tsx
│   │   │   └── SearchResultCard.tsx
│   │   │
│   │   └── sandbox/
│   │       ├── SandboxPage.tsx
│   │       └── SandboxIntro.tsx
│   │
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ModulePage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── ProjectPage.tsx
│   │   ├── SearchPage.tsx
│   │   ├── SandboxPage.tsx
│   │   └── SettingsPage.tsx
│   │
│   ├── hooks/
│   │   ├── useSQLite.ts              # DB instance management
│   │   ├── useQueryExecution.ts      # Run query, get results
│   │   ├── useValidation.ts          # Compare results
│   │   ├── useProgress.ts            # Progress read/write
│   │   ├── useLanguage.ts            # Language context
│   │   ├── useModule.ts              # Module data loading
│   │   └── useAnimation.ts           # Tutorial animations
│   │
│   ├── lib/
│   │   ├── sql/
│   │   │   ├── database.ts           # DB initialization, seeding
│   │   │   ├── executor.ts           # Query execution wrapper
│   │   │   ├── validator.ts          # Result comparison engine
│   │   │   ├── normalizer.ts         # Result normalization
│   │   │   ├── errorMatcher.ts       # Common error detection
│   │   │   └── schemas.ts            # Table schema definitions
│   │   │
│   │   ├── progress/
│   │   │   ├── storage.ts            # localStorage manager
│   │   │   ├── backup.ts             # Export/import
│   │   │   └── unlockLogic.ts        # Module unlock rules
│   │   │
│   │   ├── content/
│   │   │   ├── moduleLoader.ts       # Load module JSON
│   │   │   ├── contentCache.ts       # Cache loaded modules
│   │   │   └── searchIndex.ts        # Search index builder
│   │   │
│   │   └── utils/
│   │       ├── cn.ts                 # Class name merge
│   │       ├── formatters.ts         # Number, date formatting
│   │       └── constants.ts          # App constants
│   │
│   ├── store/
│   │   ├── appStore.ts               # Global app state (Zustand)
│   │   ├── progressStore.ts          # Progress state (Zustand)
│   │   ├── consoleStore.ts           # Console state (Zustand)
│   │   └── quizStore.ts              # Quiz state (Zustand)
│   │
│   ├── content/                      # 📚 ALL CONTENT (the heart!)
│   │   ├── modules/
│   │   │   ├── beginner/
│   │   │   │   ├── module-01.json
│   │   │   │   ├── module-02.json
│   │   │   │   ├── ...
│   │   │   │   ├── module-10-project.json
│   │   │   │   ├── ...
│   │   │   │   └── module-20-project.json
│   │   │   │
│   │   │   ├── intermediate/
│   │   │   │   ├── module-21.json
│   │   │   │   ├── ...
│   │   │   │   └── module-40-project.json
│   │   │   │
│   │   │   └── advanced/
│   │   │       ├── module-41.json
│   │   │       ├── ...
│   │   │       └── module-60-capstone.json
│   │   │
│   │   ├── projects/
│   │   │   ├── mini/
│   │   │   │   ├── project-p1.json
│   │   │   │   ├── project-p2.json
│   │   │   │   └── ...
│   │   │   ├── level/
│   │   │   │   ├── project-lp1.json
│   │   │   │   ├── project-lp2.json
│   │   │   │   └── project-lp3.json
│   │   │   └── capstone/
│   │   │       └── project-capstone.json
│   │   │
│   │   ├── datasets/
│   │   │   ├── school-database.sql   # Schema + seed data
│   │   │   ├── ecommerce-database.sql
│   │   │   └── advanced-database.sql
│   │   │
│   │   └── locales/
│   │       ├── ui-en.json            # UI strings (buttons, labels)
│   │       └── ui-hi.json
│   │
│   ├── types/
│   │   ├── module.ts                 # Module, Task, Hint types
│   │   ├── quiz.ts                   # Question types
│   │   ├── console.ts                # Console, Result types
│   │   ├── progress.ts               # Progress state types
│   │   ├── project.ts                # Project types
│   │   └── database.ts               # DB result types
│   │
│   ├── App.tsx                       # Router setup
│   ├── main.tsx                      # Entry point
│   ├── index.css                     # Tailwind + custom styles
│   └── vite-env.d.ts
│
├── tests/
│   ├── unit/
│   │   ├── validator.test.ts
│   │   ├── normalizer.test.ts
│   │   ├── errorMatcher.test.ts
│   │   ├── progress.test.ts
│   │   ├── unlockLogic.test.ts
│   │   └── language.test.ts
│   │
│   ├── integration/
│   │   ├── queryExecution.test.ts
│   │   ├── moduleCompletion.test.ts
│   │   └── consoleWorkflow.test.tsx
│   │
│   └── content/
│       ├── allModulesLoad.test.ts
│       ├── allTasksValid.test.ts
│       └── allQuizzesValid.test.ts
│
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

## 22. TypeScript Type Definitions

### 22.1 Core Types (types/module.ts)

```typescript
// ============ MODULE TYPES ============

export type ModuleLevel = 'beginner' | 'intermediate' | 'advanced';
export type TaskDifficulty = 'very_easy' | 'easy' | 'medium' | 'hard' | 'very_hard';
export type ModuleStatus = 'locked' | 'unlocked' | 'in_progress' | 'completed';

export interface LocalizedString {
  en: string;
  hi: string;
}

export interface Module {
  id: string;                    // "module-01"
  number: number;                // 1
  level: ModuleLevel;
  title: LocalizedString;
  estimatedTime: string;         // "25 minutes"
  prerequisites: string[];       // Module IDs
  learningObjectives: LocalizedString[];
  theory: TheoryContent;
  animatedTutorial: AnimatedTutorial;
  syntax: SyntaxInfo;
  examples: Example[];
  commonMistakes: CommonMistake[];
  quiz: Quiz;
  practiceTasks: PracticeTask[];
}

export interface TheoryContent {
  sections: TheorySection[];
}

export interface TheorySection {
  heading: LocalizedString;
  content: LocalizedString;
  diagram?: string;              // SVG path
}

export interface AnimatedTutorial {
  steps: TutorialStep[];
}

export interface TutorialStep {
  codeTyped: string;             // Code to type
  tableState: TableState;        // Which rows highlighted
  explanation: LocalizedString;
}

export interface SyntaxInfo {
  template: string;
  components: SyntaxComponent[];
}

export interface SyntaxComponent {
  part: string;
  description: LocalizedString;
}

export interface Example {
  difficulty: TaskDifficulty;
  query: string;
  output: QueryResult;
  explanation: LocalizedString;
}

export interface CommonMistake {
  mistake: LocalizedString;
  correction: LocalizedString;
}

// ============ TASK TYPES ============

export interface PracticeTask {
  id: string;                    // "task-1"
  difficulty: TaskDifficulty;
  description: LocalizedString;
  expectedResult: QueryResult;
  hints: Hint[];
  validation: ValidationConfig;
}

export interface Hint {
  level: 1 | 2 | 3;
  type: 'concept' | 'structure' | 'partial';
  content: LocalizedString;
}

// ============ QUERY RESULT TYPES ============

export interface QueryResult {
  columns: string[];
  rows: QueryRow[];
}

export type QueryRow = (string | number | null)[];

export interface QueryError {
  message: string;
  line?: number;
  column?: number;
}

export type QueryOutput = QueryResult | QueryError;

// ============ VALIDATION TYPES ============

export interface ValidationConfig {
  ignoreColumnOrder: boolean;
  ignoreRowOrder: boolean;
  caseSensitiveData: boolean;
  trimWhitespace: boolean;
  numericTolerance: number;
  checkColumnNames: boolean;
}

export interface ValidationResult {
  status: 'SUCCESS' | 'WRONG' | 'ERROR';
  message: string;
  diff?: DiffInfo;
  technicalError?: string;
  suggestion?: string;
}

export interface DiffInfo {
  expectedColumns: string[];
  gotColumns: string[];
  expectedRows: QueryRow[];
  gotRows: QueryRow[];
  analysis: string[];            // Human-readable diff analysis
}
```

### 22.2 Quiz Types (types/quiz.ts)

```typescript
// ============ QUIZ TYPES ============

export type QuizQuestionType =
  | 'mcq'
  | 'output_prediction'
  | 'query_building'
  | 'fill_blanks';

export interface Quiz {
  questions: QuizQuestion[];
}

export type QuizQuestion =
  | MCQQuestion
  | OutputPredictionQuestion
  | QueryBuildingQuestion
  | FillBlanksQuestion;

export interface BaseQuizQuestion {
  type: QuizQuestionType;
  explanation: LocalizedString;
}

export interface MCQQuestion extends BaseQuizQuestion {
  type: 'mcq';
  question: LocalizedString;
  options: LocalizedString[];
  correctIndex: number;
}

export interface OutputPredictionQuestion extends BaseQuizQuestion {
  type: 'output_prediction';
  queryShown: string;
  question: LocalizedString;
  options: OutputOption[];
  correctIndex: number;
}

export interface OutputOption {
  label: string;                 // "A", "B", "C", "D"
  result: QueryResult | { error: string };
}

export interface QueryBuildingQuestion extends BaseQuizQuestion {
  type: 'query_building';
  description: LocalizedString;
  wordBank: string[];
  correctSequence: string[];
}

export interface FillBlanksQuestion extends BaseQuizQuestion {
  type: 'fill_blanks';
  template: string;              // "SELECT ___ FROM ___"
  blanks: FillBlank[];
}

export interface FillBlank {
  position: number;
  options: string[];
  correct: string;
}
```

### 22.3 Progress Types (types/progress.ts)

```typescript
// ============ PROGRESS TYPES ============

export interface ProgressState {
  version: string;
  lastAccessed: string;
  language: 'en' | 'hi';
  currentLevel: ModuleLevel;
  modules: Record<string, ModuleProgress>;
  projects: Record<string, ProjectProgress>;
  unlockedModules: string[];
  lastModule: string | null;
  stats: ProgressStats;
}

export interface ModuleProgress {
  status: ModuleStatus;
  theoryRead: boolean;
  tasksCompleted: string[];      // Task IDs
  tasksSkipped: string[];
  quizBestScore: number | null;
  quizAttempts: number;
  hintsUsed: Record<string, number>;  // taskId → count
  completedAt: string | null;
}

export interface ProjectProgress {
  status: ModuleStatus;
  tasksCompleted: string[];
}

export interface ProgressStats {
  totalQueriesRun: number;
  totalTasksCompleted: number;
  totalHintsUsed: number;
  timeSpentSeconds: number;
}

export interface ProgressSummary {
  overallPercent: number;
  levelProgress: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  modulesCompleted: number;
  tasksCompleted: string;
  projectsCompleted: number;
}
```

---

## 23. Content Creation Guidelines

### 23.1 Theory Writing Standards

| Aspect | English Version | Hinglish Version |
|---|---|---|
| **Tone** | Friendly, encouraging, professional | Same friendly tone, Roman Hindi |
| **Length** | 300-800 words per module | Similar length (can be slightly shorter) |
| **Reading level** | Grade 8-10 (accessible) | Simple conversational Hindi |
| **Technical terms** | Define on first use | Keep in English, explain in Hinglish |
| **Examples** | Relatable (students, shopping) | Same examples, Hinglish context |
| **Analogies** | Everyday comparisons | Indian context (cricket, food, family) |

### 23.2 Writing Template (Theory Section)

```markdown
## Structure for Each Theory Section:

### 1. HOOK (1-2 lines)
- Why this concept matters
- Real-world problem it solves
- Example: "Imagine you have 10,000 customers and need to find only those from Delhi..."

### 2. CONCEPT (2-3 paragraphs)
- What it is (simple definition)
- How it works (mechanism)
- What it looks like (syntax preview)

### 3. ANALOGY (1 paragraph)
- Real-world comparison
- Example: "GROUP BY is like sorting your clothes into different bags before counting"

### 4. VISUAL (diagram/SVG)
- Concept visualization
- Data flow diagram
- Before/after comparison

### 5. SYNTAX BOX
- Color-coded syntax
- Each part explained

### 6. EXAMPLES (3-5, easy → hard)
- Example with explanation
- Expected output shown
- "Why this works" note

### 7. COMMON MISTAKES (2-3)
- Mistake + why it happens + correct approach

### 8. SUMMARY (bullet points)
- Key takeaways
- What to remember
```

### 23.3 Task Creation Rules

| Rule | Detail |
|---|---|
| **Business context** | Every task starts with real scenario ("Marketing team wants...") |
| **Progressive difficulty** | VE: single concept → VH: 3+ concepts combined |
| **Clear expected output** | Task description implies exact output format |
| **Testable** | Task must be automatically verifiable (result matching) |
| **No ambiguity** | "Top 5" means exactly 5 rows, "sort by salary" means salary DESC |
| **Hints prepared** | All 3 hints written before task finalized |

### 23.4 Task Description Template

```
BUSINESS CONTEXT:
[Who needs this data and why — 1-2 lines]

TASK:
[Specific, unambiguous instruction — 1-2 lines]

EXPECTED OUTPUT:
[If not obvious, show expected column names/format]

EXAMPLE FORMAT:
"Marketing team wants to target customers in Delhi.
Write a query to show all customers from Delhi,
including their name and email.
Sort results by name alphabetically."
```

### 23.5 Quiz Question Standards

| Question Type | Testing Goal | Creation Rule |
|---|---|---|
| **MCQ** | Concept understanding | One clear correct answer, 3 plausible but wrong distractors |
| **Output Prediction** | Query logic | 4 outputs: correct, subtly wrong (row count/order/values), error |
| **Query Building** | Syntax order | All needed words in bank, no extra words (or 1-2 distractors) |
| **Fill Blanks** | Syntax recall | 3-4 options per blank, common wrong answers as distractors |

---

## 24. Animated Tutorial System

### 24.1 Animation Types

| Animation | Purpose | Duration |
|---|---|---|
| **Code Typing** | Show query being written | 3-8 seconds |
| **Row Highlighting** | Show which rows are affected | 2-4 seconds |
| **Row Fading** | Show filtered-out rows | 1-2 seconds |
| **Result Reveal** | Show output appearing | 2-3 seconds |
| **Step Transition** | Move to next explanation | 1 second |

### 24.2 Animation Implementation

```typescript
// PSEUDO-CODE for animation engine

interface AnimationStep {
  type: 'code_typing' | 'highlight' | 'fade' | 'result' | 'explanation';
  content: string | TableState;
  duration: number;
  explanation: LocalizedString;
}

class TutorialAnimator {
  private steps: AnimationStep[];
  private currentStep: number = 0;
  private isPlaying: boolean = false;

  play(): void {
    this.isPlaying = true;
    this.executeStep(this.steps[this.currentStep]);
  }

  pause(): void {
    this.isPlaying = false;
  }

  replay(): void {
    this.currentStep = 0;
    this.play();
  }

  private executeStep(step: AnimationStep): Promise<void> {
    return new Promise((resolve) => {
      switch (step.type) {
        case 'code_typing':
          this.typeCode(step.content, step.duration);
          break;
        case 'highlight':
          this.highlightRows(step.content);
          break;
        // ... other cases
      }
      setTimeout(resolve, step.duration);
    });
  }
}
```

### 24.3 Tutorial UI

```
┌─────────────────────────────────────────────┐
│ 🎬 Tutorial: WHERE Clause                  │
├─────────────────────────────────────────────┤
│                                             │
│  Query:                                     │
│  SELECT * FROM students                     │
│  WHERE grade = 'A';    ← Types out         │
│         ▓▓▓▓ (typing cursor)               │
│                                             │
│  Table:                                     │
│  ┌────┬────────┬───────┐                   │
│  │ id │ name   │ grade │                   │
│  ├────┼────────┼───────┤                   │
│  │ 1  │ Rahul  │   A   │ ← Highlighted    │
│  │ 2  │ Priya  │   B   │ ← Faded (0.3)    │
│  │ 3  │ Amit   │   A   │ ← Highlighted    │
│  └────┴────────┴───────┘                   │
│                                             │
│  💡 Explanation:                            │
│  "WHERE grade = 'A' means: only rows       │
│   where grade is 'A' will be shown"        │
│                                             │
│  [▶ Play] [⏸ Pause] [↺ Replay] [⏭ Next]   │
│  Step 2/5                                   │
└─────────────────────────────────────────────┘
```

---

## 25. Mobile Support Strategy

### 25.1 Breakpoint Behavior

| Breakpoint | Width | Behavior |
|---|---|---|
| **Mobile** | < 768px | Theory + Quiz only, Console blocked |
| **Tablet** | 768px - 1023px | Theory + Quiz + limited Console (stacked) |
| **Desktop** | ≥ 1024px | Full experience, 3-panel console |

### 25.2 Mobile Experience

```
MOBILE (< 768px):

┌─────────────────────────────┐
│ ⚠️ Desktop Recommended     │
│ "Console ke liye desktop   │
│  use karein. Theory aur    │
│  Quiz mobile pe bhi       │
│  available hai!"           │
│ [📖 Continue to Theory]   │
│ [📝 Continue to Quiz]     │
└─────────────────────────────┘

ALLOWED on Mobile:
├── ✅ Landing page (full)
├── ✅ Dashboard (full)
├── ✅ Theory reading (full)
├── ✅ Quiz (full, touch-friendly)
├── ✅ Progress viewing
└── ✅ Settings

BLOCKED on Mobile:
├── ❌ Practice Console (typing queries)
├── ❌ Sandbox
└── ❌ Projects (console-based)
```

### 25.3 Tablet Experience (768-1023px)

```
TABLET (768-1023px):

Console Layout (Stacked 2-Panel):
┌─────────────────────────────┐
│ [📚 Schema] ← Slide-out    │
├─────────────────────────────┤
│                             │
│  Editor (top 60%)           │
│  SELECT * FROM students    │
│  WHERE grade = 'A';        │
│                             │
├─────────────────────────────┤
│  Results (bottom 40%)       │
│  ┌──┬────┬─────┐          │
│  │id│name│grade│          │
│  │1 │Rahu│  A  │          │
│  └──┴────┴─────┘          │
│                             │
├─────────────────────────────┤
│ Task bar + buttons          │
└─────────────────────────────┘
```

---

## 26. Development Roadmap

### 26.1 All-at-Once Development Plan (26 Weeks / 6 Months)

```
┌──────────────────────────────────────────────────────────┐
│              DEVELOPMENT TIMELINE                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  PHASE 1: FOUNDATION (Weeks 1-4)                        │
│  ├── Week 1: Project setup, CI/CD, design tokens       │
│  ├── Week 2: Core components (Button, Card, etc.)      │
│  ├── Week 3: sql.js integration, DB seeding             │
│  └── Week 4: Basic console (3-panel, query execution)   │
│                                                          │
│  PHASE 2: CORE FEATURES (Weeks 5-8)                     │
│  ├── Week 5: Query validation engine                    │
│  ├── Week 6: Hint system + error feedback               │
│  ├── Week 7: Quiz system (all 4 types)                  │
│  └── Week 8: Progress tracking + localStorage           │
│                                                          │
│  PHASE 3: BEGINNER CONTENT (Weeks 9-12)                 │
│  ├── Week 9: School dataset (schema + seed data)        │
│  ├── Week 10: Modules 1-10 content                      │
│  ├── Week 11: Modules 11-19 content                     │
│  └── Week 12: Module 20 (Level Project 1) + animations  │
│                                                          │
│  PHASE 4: INTERMEDIATE CONTENT (Weeks 13-16)            │
│  ├── Week 13: E-Commerce dataset                        │
│  ├── Week 14: Modules 21-30 content                     │
│  ├── Week 15: Modules 31-39 content                     │
│  └── Week 16: Module 40 (Level Project 2) + animations  │
│                                                          │
│  PHASE 5: ADVANCED CONTENT (Weeks 17-20)                │
│  ├── Week 17: Advanced dataset extensions               │
│  ├── Week 18: Modules 41-50 content                     │
│  ├── Week 19: Modules 51-59 content                     │
│  └── Week 20: Module 60 (Capstone) + animations         │
│                                                          │
│  PHASE 6: REMAINING PROJECTS (Weeks 21-22)              │
│  ├── Week 21: Mini projects P1-P6                       │
│  └── Week 22: Level projects LP1-LP3                    │
│                                                          │
│  PHASE 7: LANGUAGES & POLISH (Weeks 23-24)              │
│  ├── Week 23: Hinglish translations (all content)       │
│  └── Week 24: Landing page, search, dashboard           │
│                                                          │
│  PHASE 8: TESTING & LAUNCH (Weeks 25-26)                │
│  ├── Week 25: Comprehensive testing, bug fixes          │
│  ├── Week 26: Performance optimization, DEPLOY 🚀       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 26.2 Content Volume Summary

| Content Item | Count | Est. Hours |
|---|---|---|
| Theory sections | 60 | 180 (3 hrs/module) |
| Animated tutorials | 60 | 90 (1.5 hrs/module) |
| Practice tasks | 300 | 150 (0.5 hrs/task) |
| Hints (3 per task) | 900 | 75 |
| Quiz questions | 240 | 60 |
| Projects | 10 | 100 (10 hrs/project avg) |
| Project tasks | 60 | 60 |
| Datasets (3) | 3 | 30 |
| Hinglish translation | All | 200 |
| **TOTAL CONTENT** | — | **~945 hours** |

### 26.3 Development Effort

| Development Item | Est. Hours |
|---|---|
| Foundation + setup | 40 |
| Core components | 60 |
| Console (3-panel + editor) | 80 |
| Validation engine | 60 |
| Quiz system (4 types) | 80 |
| Progress + localStorage | 40 |
| Animated tutorial engine | 60 |
| Language system | 40 |
| Search + filters | 30 |
| Landing + dashboard | 40 |
| Testing + fixes | 100 |
| Deployment + optimization | 30 |
| **TOTAL DEVELOPMENT** | **~660 hours** |

### 26.4 Grand Total: ~1,600 hours (Content + Development)

---

## 27. Testing Strategy

### 27.1 Test Coverage Matrix

| Test Type | What's Tested | Tool | Coverage Target |
|---|---|---|---|
| **Unit Tests** | Validation logic, progress, unlock rules, error matcher | Vitest | 90% of lib functions |
| **Integration Tests** | Query execution → validation → feedback flow | Vitest + Testing Library | All console workflows |
| **Content Validation** | All 60 modules load, all tasks valid, all quizzes correct | Custom script | 100% of content |
| **E2E Tests** (manual) | Complete user journey: Module 1 → Capstone | Manual checklist | All critical paths |

### 27.2 Critical Test Scenarios

```yaml
# Content Validation Script (must pass before launch):

test_all_modules:
  - 60 modules exist
  - All have valid JSON structure
  - All have 5 practice tasks
  - All tasks have non-empty expected results
  - All tasks have 3 hints
  - All quiz questions have valid correct answers
  - All expected queries actually execute without error
  - All expected results match expected query output

test_all_projects:
  - 10 projects exist
  - All tasks have valid expected results
  - Capstone has 12 tasks

test_datasets:
  - School DB seeds correctly (275 records)
  - E-Commerce DB seeds correctly (2,300 records)
  - Advanced DB seeds correctly (4,300 records)
  - Reset function restores original state

test_validation_engine:
  - Correct query → SUCCESS
  - Wrong column order (when ignored) → SUCCESS
  - Wrong row order (when ORDER BY required) → WRONG
  - Common typo (FORM) → friendly error suggestion
  - Syntax error → friendly + technical error
  - Correct result but extra column → WRONG with diff
```

### 27.3 Performance Testing

| Metric | Target | Test Method |
|---|---|---|
| Initial page load | < 3 seconds | Lighthouse |
| Module load | < 500ms (after initial) | Profiling |
| Query execution (simple) | < 100ms | Timing |
| Query execution (complex JOIN) | < 500ms | Timing |
| Memory usage (with DB loaded) | < 200MB | Chrome DevTools |
| Bundle size (JS) | < 500KB gzipped | Build analysis |
| sql.js WASM | ~1.2MB (loaded once, cached) | Network tab |

---

## 28. Deployment & Hosting

### 28.1 Hosting Options (Ranked)

| Rank | Platform | Cost | Pros | Cons |
|---|---|---|---|---|
| 1 | **Vercel** | Free (personal) | Perfect React/Vite support, CDN, previews | Custom domain on paid |
| 2 | **Netlify** | Free (100GB bandwidth) | Easy, forms, redirects | Less generous free tier |
| 3 | **GitHub Pages** | Free | Simple, versioned | 1GB limit, no SPA routing by default |

### 28.2 Build & Deploy Configuration

```yaml
# vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/sql-wasm/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

### 28.3 Optimization Checklist

- [ ] Lazy load module content (route-based code splitting)
- [ ] Compress SQLite WASM (~1.2MB, immutable cache)
- [ ] Preload critical fonts (Inter, Poppins)
- [ ] SVG icons only (no PNG unless necessary)
- [ ] Gzip/Brotli compression (hosting handles)
- [ ] Image optimization (if any)
- [ ] Critical CSS inlining
- [ ] Bundle analysis (remove unused dependencies)

---

## 29. Performance Requirements

### 29.1 Load Time Targets

| Scenario | Target | Critical? |
|---|---|---|
| First visit (cold) | < 3 seconds | ✅ Yes |
| Return visit (cached) | < 1 second | ✅ Yes |
| Module switch (after load) | < 200ms | ✅ Yes |
| Query execution (simple) | < 100ms | ✅ Yes |
| Query execution (complex) | < 500ms | ⚠️ Acceptable |
| Animation start | < 100ms | ⚠️ Acceptable |

### 29.2 Resource Budget

| Resource | Budget | Notes |
|---|---|---|
| JavaScript bundle | < 500KB (gzipped) | React + app code |
| SQLite WASM | ~1.2MB | Loaded once, cached forever |
| Fonts | < 200KB | Inter + Poppins + JetBrains Mono |
| CSS | < 100KB | Tailwind (purged) |
| Module content (per module) | < 50KB | JSON, lazy loaded |
| Total initial load | < 2MB | Acceptable for learning platform |

---

## 30. Success Metrics

### 30.1 User Engagement Targets

| Metric | Target | Measurement |
|---|---|---|
| Module completion rate | > 60% | (Modules completed / Modules started) |
| Average session time | > 15 minutes | Analytics |
| Return user rate (7-day) | > 40% | localStorage + analytics |
| Full platform completion | > 10% | Users completing all 60 modules |

### 30.2 Learning Effectiveness

| Metric | Target | Measurement |
|---|---|---|
| Task success rate (first attempt) | > 50% | Query validation logs |
| Quiz pass rate (first attempt) | > 70% | Quiz scoring |
| Hint usage rate | < 30% | Hints used / tasks attempted |
| Project completion rate | > 40% | Projects completed / started |

### 30.3 Technical Health

| Metric | Target | Measurement |
|---|---|---|
| Error rate (console errors) | < 1% | Error tracking |
| Page load success | > 99% | Uptime monitoring |
| SQLite WASM load success | > 99% | Feature detection |

---

## 31. Final Checklist

### 31.1 Pre-Development Checklist

- [x] All 27 requirements locked and documented
- [x] Design system tokens defined
- [x] Database schemas finalized (3 datasets)
- [x] Component architecture documented
- [x] TypeScript types defined
- [x] Content templates created
- [x] File structure planned
- [x] Development roadmap approved

### 31.2 Pre-Launch Checklist

**Content:**
- [ ] All 60 modules complete (theory + tutorial + examples)
- [ ] All 300 practice tasks written and validated
- [ ] All 900 hints written (3 per task)
- [ ] All 240 quiz questions validated
- [ ] All 10 projects complete and testable
- [ ] All content in both EN and HI

**Technical:**
- [ ] All unit tests passing (>90% coverage)
- [ ] All integration tests passing
- [ ] Content validation script passes (100%)
- [ ] Performance targets met
- [ ] Mobile warning implemented
- [ ] Search + filters working
- [ ] Landing page polished
- [ ] Language toggle instant

**UX:**
- [ ] Error feedback friendly + technical
- [ ] Hint system progressive (3 levels)
- [ ] Diff view on wrong answers
- [ ] Progress persistence working
- [ ] Backup/export system working
- [ ] Reset progress working (with confirmation)

**Deployment:**
- [ ] Build passes without errors
- [ ] Deployed to production
- [ ] Custom domain configured (if any)
- [ ] Performance monitoring active
- [ ] Error tracking active

---

## 32. Appendix: Glossary

| Term | Definition |
|---|---|
| **sql.js** | SQLite compiled to WebAssembly, runs in browser |
| **WASM** | WebAssembly — binary format for fast browser execution |
| **VLSM** | Variable Length Subnet Masking (not used here, listed for clarity) |
| **DDL** | Data Definition Language (CREATE, ALTER, DROP) |
| **DML** | Data Manipulation Language (INSERT, UPDATE, DELETE) |
| **DQL** | Data Query Language (SELECT) |
| **CTE** | Common Table Expression (WITH clause) |
| **Window Function** | Function that operates across rows (RANK, LAG, etc.) |
| **localStorage** | Browser storage that persists across sessions |
| **Hinglish** | Hindi written in Roman/English script |
| **shadcn/ui** | Copy-paste React component library built on Radix |
| **Zustand** | Lightweight React state management library |
| **Result Matching** | Validating queries by comparing output, not exact string |
| **Progressive Hints** | Hints that unlock sequentially (3 levels) |
| **3-Panel IDE** | Schema + Editor + Results layout |

---

## Document Control

| Version | Date | Changes | Author |
|---|---|---|---|
| 0.1 | — | Initial requirements gathering (27 questions) | — |
| 0.5 | — | Draft architecture compiled | — |
| **1.0** | **Current** | **Final complete document — approved for development** | **—** |

---

> 🎯 **This document is the single source of truth for the SQL Learning Platform. All 27 requirements are locked. Development can begin.**

**Next Steps:**
1. Set up project repository (React + Vite + TypeScript)
2. Implement design system (Tailwind + shadcn/ui)
3. Integrate sql.js with School database
4. Build Module 1 as proof of concept
5. Iterate and expand

---

*End of Document — SQL Learning Platform Architecture v1.0*