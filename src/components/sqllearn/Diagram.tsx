'use client';

// ============ Concept diagrams — REAL-TABLE based (spec §7 diagram field) ============
// Every concept is explained on actual mini database tables:
// header row = columns, data rows = records, with labeled highlights,
// extent arrows (COLUMN / ROW / CELL) and transformation arrows.
// Pedagogical labels are bilingual (EN/HI); table data & SQL keywords stay
// English because they mirror what the learner will actually type.

import React from 'react';
import type { DiagramKind } from '@/types/content';
import { useLang } from '@/lib/i18n/store';

const TH = 20; // title bar height
const HH = 24; // header row height
const RH = 22; // data row height
const PAD = 7; // cell text padding

const C = {
  blue: '#2563EB', blueFill: '#DBEAFE', blueDeep: '#1D4ED8',
  green: '#059669', greenFill: '#D1FAE5',
  amber: '#D97706', amberFill: '#FFEDD5',
  red: '#DC2626', redFill: '#FEE2E2',
  slate: '#64748B', slateFill: '#F1F5F9', slateDeep: '#334155',
  ink: '#0F172A', zebra: '#F1F5F9',
  head: '#1E293B', grid: '#E2E8F0', border: '#94A3B8',
};
const F = 'var(--font-inter), sans-serif';
const M = 'ui-monospace, SFMono-Regular, Menlo, monospace';

type L = (en: string, hi: string) => string;

// ---------- geometry ----------
const widths = (cols: Col[]) => cols.map((c) => c.w);
const tblW = (cols: Col[]) => cols.reduce((a, b) => a + b.w, 0);
const colX = (x: number, cols: Col[], i: number) => x + cols.slice(0, i).reduce((a, b) => a + b.w, 0);
const rowY = (y: number, i: number) => y + TH + HH + i * RH;
const rowCY = (y: number, i: number) => rowY(y, i) + RH / 2;
const tblH = (n: number) => TH + HH + n * RH;

// ---------- mini table ----------
interface Col { label: string; w: number; pk?: boolean; fk?: boolean }
interface TProps {
  x: number; y: number;
  name: string; tag?: string;
  cols: Col[];
  rows: string[][];
  hlCols?: number[];                       // blue column band (the "picked" columns)
  hlRows?: number[];                       // green row band (survivors / current)
  dropRows?: number[];                     // red faded rows (dropped)
  hlCells?: [number, number][];            // amber cell (row ∩ column story)
  tints?: Record<string, string>;          // "r,c" -> custom cell fill
  rowTints?: Record<number, string>;       // custom row fill (partitions / buckets)
  marks?: Record<number, 'pass' | 'drop'>; // ✓ / ✗ circles right of the row
  strike?: number[];                       // strikethrough rows
  partitions?: number[];                   // thick separator above these row indices
  result?: boolean;                        // green title bar (query output)
  fade?: boolean;                          // whole table dimmed (ghost)
}

function Tbl(p: TProps) {
  const { x, y, cols, rows } = p;
  const W = tblW(cols);
  const H = tblH(rows.length);
  const ws = widths(cols);
  const hlCols = new Set(p.hlCols ?? []);
  const hlRows = new Set(p.hlRows ?? []);
  const dropRows = new Set(p.dropRows ?? []);
  const strike = new Set(p.strike ?? []);
  const hlCells = p.hlCells ?? [];
  const tints = p.tints ?? {};
  const rowTints = p.rowTints ?? {};
  const marks = p.marks ?? {};
  const n = rows.length;
  const accent = p.result ? C.green : C.blue;

  return (
    <g opacity={p.fade ? 0.5 : 1}>
      {/* zebra striping */}
      {rows.map((_, i) =>
        i % 2 === 1 && !hlRows.has(i) && !dropRows.has(i) && rowTints[i] === undefined ? (
          <rect key={`z${i}`} x={x} y={rowY(y, i)} width={W} height={RH} fill={C.zebra} opacity={0.55} />
        ) : null
      )}
      {/* row bands */}
      {rows.map((_, i) => {
        if (hlRows.has(i)) return <rect key={`rb${i}`} x={x} y={rowY(y, i)} width={W} height={RH} fill={C.greenFill} opacity={0.85} />;
        if (dropRows.has(i)) return <rect key={`rb${i}`} x={x} y={rowY(y, i)} width={W} height={RH} fill={C.redFill} opacity={0.7} />;
        if (rowTints[i] !== undefined) return <rect key={`rb${i}`} x={x} y={rowY(y, i)} width={W} height={RH} fill={rowTints[i]} opacity={0.75} />;
        return null;
      })}
      {/* green left edge for highlighted rows */}
      {[...hlRows].map((i) => (
        <rect key={`lb${i}`} x={x} y={rowY(y, i)} width={3.5} height={RH} fill={C.green} rx={1} />
      ))}
      {/* column bands */}
      {[...hlCols].map((c) => (
        <rect key={`cb${c}`} x={colX(x, cols, c)} y={y + TH + HH} width={cols[c].w} height={n * RH} fill={C.blueFill} opacity={0.6} />
      ))}
      {/* custom cell tints */}
      {Object.entries(tints).map(([k, fill]) => {
        const [r, c] = k.split(',').map(Number);
        return <rect key={`t${k}`} x={colX(x, cols, c)} y={rowY(y, r)} width={cols[c].w} height={RH} fill={fill} opacity={0.9} />;
      })}
      {/* amber hero cells */}
      {hlCells.map(([r, c]) => (
        <rect key={`hc${r}-${c}`} x={colX(x, cols, c)} y={rowY(y, r)} width={cols[c].w} height={RH} fill={C.amberFill} stroke={C.amber} strokeWidth={1.3} />
      ))}
      {/* header row */}
      <rect x={x} y={y + TH} width={W} height={HH} fill={C.head} />
      {cols.map((col, c) =>
        hlCols.has(c) ? <rect key={`hh${c}`} x={colX(x, cols, c)} y={y + TH} width={col.w} height={HH} fill={C.blueFill} /> : null
      )}
      {cols.map((col, c) => (
        <text
          key={`ht${c}`}
          x={colX(x, cols, c) + col.w / 2}
          y={y + TH + HH / 2 + 3.5}
          textAnchor="middle"
          fontSize={9.5}
          fontWeight="700"
          fill={hlCols.has(c) ? C.blueDeep : '#E2E8F0'}
          fontFamily={F}
        >
          {col.pk ? '🔑 ' : col.fk ? '🔗 ' : ''}{col.label}
        </text>
      ))}
      {/* grid lines */}
      {cols.slice(1).map((_, c) => (
        <line key={`v${c}`} x1={colX(x, cols, c + 1)} y1={y + TH + HH} x2={colX(x, cols, c + 1)} y2={y + H} stroke={C.grid} strokeWidth={1} />
      ))}
      {rows.slice(1).map((_, i) => (
        <line key={`h${i}`} x1={x} y1={rowY(y, i + 1)} x2={x + W} y2={rowY(y, i + 1)} stroke={C.grid} strokeWidth={1} />
      ))}
      {(p.partitions ?? []).map((i) => (
        <line key={`p${i}`} x1={x} y1={rowY(y, i)} x2={x + W} y2={rowY(y, i)} stroke={C.slateDeep} strokeWidth={2.2} />
      ))}
      {/* outer border */}
      <rect x={x} y={y} width={W} height={H} rx={6} fill="none" stroke={C.border} strokeWidth={1.4} />
      {/* title bar */}
      <path
        d={`M ${x} ${y + 6} Q ${x} ${y} ${x + 6} ${y} L ${x + W - 6} ${y} Q ${x + W} ${y} ${x + W} ${y + 6} L ${x + W} ${y + TH} L ${x} ${y + TH} Z`}
        fill={accent}
      />
      <text x={x + 9} y={y + 14.5} fontSize={10.5} fontWeight="700" fill="#fff" fontFamily={F}>▦ {p.name}</text>
      {p.tag && <text x={x + W - 8} y={y + 14.5} textAnchor="end" fontSize={8.5} fill="#fff" opacity={0.9} fontFamily={F}>{p.tag}</text>}
      {/* cell text */}
      {rows.map((row, r) =>
        row.map((v, c) => (
          <text
            key={`c${r}-${c}`}
            x={colX(x, cols, c) + PAD}
            y={rowCY(y, r) + 3.5}
            fontSize={9.5}
            fill={dropRows.has(r) || p.fade ? '#94A3B8' : C.ink}
            opacity={dropRows.has(r) ? 0.6 : 1}
            fontFamily={c === 0 && !isNaN(Number(String(v).replace(/[₹,]/g, ''))) ? M : F}
          >
            {v}
          </text>
        ))
      )}
      {/* strikethrough (duplicates) */}
      {[...strike].map((r) => (
        <line key={`s${r}`} x1={x + 4} y1={rowCY(y, r) + 2} x2={x + W - 4} y2={rowCY(y, r) + 2} stroke={C.red} strokeWidth={1.4} opacity={0.8} />
      ))}
      {/* pass / drop marks */}
      {Object.entries(marks).map(([r, m]) => {
        const i = Number(r);
        const pass = m === 'pass';
        return (
          <g key={`m${r}`}>
            <circle cx={x + W + 14} cy={rowCY(y, i)} r={8} fill={pass ? C.greenFill : C.redFill} stroke={pass ? C.green : C.red} strokeWidth={1.3} />
            <text x={x + W + 14} y={rowCY(y, i) + 3.5} textAnchor="middle" fontSize={9} fontWeight="800" fill={pass ? C.green : C.red} fontFamily={F}>
              {pass ? '✓' : '✗'}
            </text>
          </g>
        );
      })}
    </g>
  );
}

// ---------- annotation helpers ----------
function chip(cx: number, cy: number, text: string, fill: string, textColor = '#fff', mono = true) {
  const w = text.length * 5.9 + 18;
  return (
    <g>
      <rect x={cx - w / 2} y={cy - 11} width={w} height={22} rx={11} fill={fill} />
      <text x={cx} y={cy + 3.5} textAnchor="middle" fontSize={10} fontWeight="700" fill={textColor} fontFamily={mono ? M : F}>{text}</text>
    </g>
  );
}

function txt(x: number, y: number, s: string, o?: { size?: number; color?: string; bold?: boolean; anchor?: 'start' | 'middle' | 'end'; mono?: boolean }) {
  const { size = 10, color = C.ink, bold = false, anchor = 'start', mono = false } = o ?? {};
  return (
    <text x={x} y={y} fontSize={size} fontWeight={bold ? 700 : 400} fill={color} textAnchor={anchor} fontFamily={mono ? M : F}>{s}</text>
  );
}

function arrow(x1: number, y1: number, x2: number, y2: number, color: keyof typeof C = 'slate', label?: string, labelAbove = true) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C[color]} strokeWidth={1.9} markerEnd={`url(#ah-${color})`} />
      {label && (
        <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 + (labelAbove ? -6 : 13)} textAnchor="middle" fontSize={9} fontWeight="600" fill={C[color]} fontFamily={F}>
          {label}
        </text>
      )}
    </g>
  );
}

/** vertical extent indicator ↕ (points at a COLUMN) */
function vExt(x: number, y1: number, y2: number, color = C.blue) {
  return (
    <g>
      <line x1={x} y1={y1 + 5} x2={x} y2={y2 - 5} stroke={color} strokeWidth={1.7} />
      <polygon points={`${x - 4.5},${y1 + 7} ${x + 4.5},${y1 + 7} ${x},${y1}`} fill={color} />
      <polygon points={`${x - 4.5},${y2 - 7} ${x + 4.5},${y2 - 7} ${x},${y2}`} fill={color} />
    </g>
  );
}

/** horizontal extent indicator ↔ (points at a ROW) */
function hExt(x1: number, x2: number, y: number, color = C.green) {
  return (
    <g>
      <line x1={x1 + 5} y1={y} x2={x2 - 5} y2={y} stroke={color} strokeWidth={1.7} />
      <polygon points={`${x1 + 7},${y - 4.5} ${x1 + 7},${y + 4.5} ${x1},${y}`} fill={color} />
      <polygon points={`${x2 - 7},${y - 4.5} ${x2 - 7},${y + 4.5} ${x2},${y}`} fill={color} />
    </g>
  );
}

function leader(x1: number, y1: number, x2: number, y2: number, color = C.amber, dashed = true) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} strokeDasharray={dashed ? '3 3' : undefined} />;
}

function defs() {
  return (
    <defs>
      {(['slate', 'blue', 'green', 'amber', 'red'] as const).map((k) => (
        <marker key={k} id={`ah-${k}`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={C[k]} />
        </marker>
      ))}
    </defs>
  );
}

// ---------- per-kind canvas height ----------
const HEIGHTS: Record<string, number> = {
  tables: 254, 'select-flow': 252, filter: 268, sort: 258, distinct: 260,
  'limit-paginate': 278, 'null-concept': 250, 'group-buckets': 292,
  'join-venn': 362, 'subquery-nest': 264, 'window-frame': 272, 'cte-chain': 246,
  'index-tree': 296, transaction: 274, 'case-branch': 254, 'union-merge': 250,
  'trigger-flow': 264, acid: 214, normalization: 350, 'data-types': 226,
};

export function Diagram({ kind }: { kind: DiagramKind }) {
  const lang = useLang();
  const L: L = (en, hi) => (lang === 'hi' ? hi : en);
  const H = HEIGHTS[kind] ?? 260;
  return (
    <div className="my-4 rounded-xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-white p-4 overflow-x-auto custom-scroll">
      <svg viewBox={`0 0 640 ${H}`} className="w-full min-w-[520px] h-auto" role="img" aria-label="Concept diagram">
        {defs()}
        {render(kind, L)}
      </svg>
    </div>
  );
}

// ============ diagram compositions ============
function render(kind: DiagramKind, L: L): React.ReactNode {
  switch (kind) {
    // ---------------------------------------------------------------
    case 'tables': {
      // THE flagship: one real table, column / row / cell / PK all labeled
      const cols: Col[] = [
        { label: 'id', w: 46, pk: true },
        { label: 'name', w: 88 },
        { label: 'city', w: 78 },
        { label: 'grade', w: 56 },
        { label: 'age', w: 44 },
      ];
      const rows = [
        ['1', 'Rahul', 'Delhi', 'A', '17'],
        ['2', 'Priya', 'Mumbai', 'A', '16'],
        ['3', 'Amit', 'Delhi', 'B', '17'],
        ['4', 'Sara', 'Pune', 'A', '15'],
      ];
      return (
        <>
          <Tbl x={64} y={58} name="students" tag="4 rows" cols={cols} rows={rows} hlCols={[1]} hlRows={[3]} hlCells={[[3, 1]]} />
          {txt(20, 34, L('🔑 PRIMARY KEY', '🔑 प्राइमरी की'), { size: 9, color: C.blueDeep, bold: true })}
          {txt(154, 34, L('COLUMN', 'कॉलम'), { size: 9, color: C.blueDeep, bold: true, anchor: 'middle' })}
          {txt(154, 46, L('= one property', '= एक गुण'), { size: 8.5, color: C.slate, anchor: 'middle' })}
          {vExt(154, 102, 188, C.blue)}
          {hExt(380, 462, 179, C.green)}
          {txt(466, 182, L('ROW = 1 record', 'पंक्ति = 1 रिकॉर्ड'), { color: C.green, bold: true })}
          {txt(466, 195, L('(one student)', '(एक student)'), { size: 9, color: C.slate })}
          {leader(198, 190, 240, 214, C.amber)}
          {txt(244, 217, L('CELL = one value', 'सेल = एक वैल्यू'), { color: C.amber, bold: true })}
          {txt(244, 230, L('row 4 ∩ column "name" → "Sara"', 'row 4 ∩ "name" कॉलम → "Sara"'), { size: 8.5, color: C.slate })}
          {txt(220, 244, L('1 table = 1 entity · rows = records · columns = properties', '1 table = 1 entity · rows = records · columns = properties'), { anchor: 'middle', color: C.slate })}
        </>
      );
    }

    // ---------------------------------------------------------------
    case 'select-flow': {
      const cols: Col[] = [
        { label: 'id', w: 46, pk: true },
        { label: 'name', w: 86 },
        { label: 'city', w: 76 },
        { label: 'grade', w: 54 },
      ];
      const rows = [
        ['1', 'Rahul', 'Delhi', 'A'],
        ['2', 'Priya', 'Mumbai', 'A'],
        ['3', 'Amit', 'Delhi', 'B'],
        ['4', 'Sara', 'Pune', 'A'],
      ];
      const res: Col[] = [{ label: 'name', w: 86 }, { label: 'grade', w: 54 }];
      const resRows = [
        ['Rahul', 'A'],
        ['Priya', 'A'],
        ['Amit', 'B'],
        ['Sara', 'A'],
      ];
      return (
        <>
          {chip(70, 26, 'SELECT', C.blue)}
          {chip(170, 26, 'FROM', C.green)}
          {chip(270, 26, 'WHERE', C.amber)}
          {chip(385, 26, 'ORDER BY', C.slate)}
          {txt(70, 48, L('which columns', 'कौन से columns'), { size: 9, color: C.slate, anchor: 'middle' })}
          {txt(170, 48, L('which table', 'कौन सी table'), { size: 9, color: C.slate, anchor: 'middle' })}
          {txt(270, 48, L('filter rows', 'rows छानना'), { size: 9, color: C.slate, anchor: 'middle' })}
          {txt(385, 48, L('sort output', 'क्रम लगाना'), { size: 9, color: C.slate, anchor: 'middle' })}
          <line x1={30} y1={60} x2={610} y2={60} stroke={C.grid} strokeDasharray="4 4" />
          <Tbl x={40} y={78} name="students" tag="4 rows" cols={cols} rows={rows} hlCols={[1, 3]} />
          {vExt(302, 102, 210, C.blue)}
          {txt(330, 92, L('chosen ↓', 'चुने हुए ↓'), { size: 9, color: C.blueDeep, bold: true, anchor: 'middle' })}
          {arrow(308, 128, 352, 128, 'blue', L('keep these', 'ये रखो'))}
          <Tbl x={358} y={78} name="result" tag="4 rows" cols={res} rows={resRows} result />
          {txt(171, 224, L('FROM students — source table', 'FROM students — सोर्स टेबल'), { size: 9.5, color: C.slate, anchor: 'middle' })}
          {txt(429, 224, L('output: fewer columns, same rows', 'आउटपुट: कम columns, वही rows'), { size: 9.5, color: C.green, anchor: 'middle' })}
          {txt(320, 244, L('every query: pick table → pick columns → filter rows → sort', 'हर query: table चुनो → columns चुनो → rows छानो → क्रम लगाओ'), { anchor: 'middle', color: C.slate })}
        </>
      );
    }

    // ---------------------------------------------------------------
    case 'filter': {
      const cols: Col[] = [
        { label: 'id', w: 46, pk: true },
        { label: 'name', w: 86 },
        { label: 'city', w: 76 },
      ];
      const rows = [
        ['1', 'Rahul', 'Delhi'],
        ['2', 'Priya', 'Mumbai'],
        ['3', 'Amit', 'Delhi'],
        ['4', 'Sara', 'Pune'],
        ['5', 'Neha', 'Delhi'],
        ['6', 'Vikram', 'Jaipur'],
      ];
      const res: Col[] = [{ label: 'name', w: 86 }, { label: 'city', w: 76 }];
      const resRows = [
        ['Rahul', 'Delhi'],
        ['Amit', 'Delhi'],
        ['Neha', 'Delhi'],
      ];
      return (
        <>
          {chip(170, 26, `WHERE city = 'Delhi'`, C.amber)}
          {txt(400, 22, L('✓ keep = condition true', '✓ रखो = condition सही'), { size: 9.5, color: C.green })}
          {txt(400, 38, L('✗ drop = condition false', '✗ हटाओ = condition गलत'), { size: 9.5, color: C.red })}
          <Tbl
            x={40} y={48} name="students" tag="6 rows" cols={cols} rows={rows}
            hlRows={[0, 2, 4]} dropRows={[1, 3, 5]}
            marks={{ 0: 'pass', 1: 'drop', 2: 'pass', 3: 'drop', 4: 'pass', 5: 'drop' }}
          />
          {arrow(280, 130, 360, 130, 'green', L('only survivors', 'सिर्फ़ बची हुई rows'))}
          <Tbl x={366} y={48} name="result" tag="3 rows" cols={res} rows={resRows} result />
          {txt(144, 240, L('every row is checked', 'हर row जाँची जाती है'), { size: 9.5, color: C.slate, anchor: 'middle' })}
          {txt(447, 174, L('3 rows survived', '3 rows बचीं'), { size: 9.5, color: C.green, anchor: 'middle' })}
          {txt(320, 258, L('WHERE runs before SELECT — rows are filtered, then columns are picked', 'WHERE, SELECT से पहले चलता है — पहले rows छँटती हैं, फिर columns चुने जाते हैं'), { anchor: 'middle', color: C.slate })}
        </>
      );
    }

    // ---------------------------------------------------------------
    case 'sort': {
      const cols: Col[] = [
        { label: 'id', w: 46, pk: true },
        { label: 'name', w: 86 },
        { label: 'marks', w: 60 },
      ];
      const rows = [
        ['1', 'Rahul', '72'],
        ['2', 'Priya', '95'],
        ['3', 'Amit', '61'],
        ['4', 'Sara', '88'],
        ['5', 'Vikram', '45'],
      ];
      const sorted = [
        ['2', 'Priya', '95'],
        ['4', 'Sara', '88'],
        ['1', 'Rahul', '72'],
        ['3', 'Amit', '61'],
        ['5', 'Vikram', '45'],
      ];
      // source row index for each result position (ids 2,4,1,3,5)
      const map = [1, 3, 0, 2, 4];
      return (
        <>
          {chip(170, 26, 'ORDER BY marks DESC', C.blue)}
          <Tbl x={40} y={48} name="students" tag="5 rows" cols={cols} rows={rows} hlCols={[2]} />
          {map.map((src, j) => (
            <line key={`ln${j}`} x1={242} y1={rowCY(48, src)} x2={376} y2={rowCY(48, j)} stroke={j < 2 ? C.green : C.slate} strokeWidth={1.2} opacity={0.65} />
          ))}
          {chip(308, 84, L('same rows, new order', 'वही rows, नया क्रम'), C.blue, '#fff', false)}
          <Tbl x={382} y={48} name="result" tag="5 rows" cols={cols} rows={sorted} hlCols={[2]} result />
          {txt(542, 42, L('highest first ↓', 'सबसे ऊँचा पहले ↓'), { size: 9, color: C.blueDeep, anchor: 'middle', bold: true })}
          {txt(136, 218, L('arrival order (random)', 'आने का क्रम (random)'), { size: 9.5, color: C.slate, anchor: 'middle' })}
          {txt(478, 218, L('sorted: biggest → smallest', 'क्रम: बड़े से छोटे'), { size: 9.5, color: C.blueDeep, anchor: 'middle' })}
          {txt(320, 242, L('ORDER BY rearranges rows — it never adds, drops or changes them', 'ORDER BY rows का क्रम बदलता है — जोड़ता, हटाता या बदलता नहीं'), { anchor: 'middle', color: C.slate })}
        </>
      );
    }

    // ---------------------------------------------------------------
    case 'distinct': {
      const cols: Col[] = [{ label: 'city', w: 110 }];
      const rows = [['Delhi'], ['Mumbai'], ['Delhi'], ['Pune'], ['Delhi'], ['Jaipur']];
      const res: Col[] = [{ label: 'city', w: 110 }];
      const resRows = [['Delhi'], ['Mumbai'], ['Pune'], ['Jaipur']];
      return (
        <>
          {chip(150, 26, 'SELECT DISTINCT city', C.blue)}
          <Tbl
            x={60} y={48} name="students" tag="6 rows" cols={cols} rows={rows}
            dropRows={[2, 4]} strike={[2, 4]} hlRows={[0, 1, 3, 5]}
            marks={{ 2: 'drop', 4: 'drop' }}
          />
          {arrow(214, 130, 392, 130, 'blue', L('keep the 1st of each value', 'हर value की पहली row रखो'))}
          <Tbl x={400} y={48} name="result" tag="4 rows" cols={res} rows={resRows} result />
          {txt(455, 174, L('duplicates removed', 'duplicates हटा दिए'), { size: 9.5, color: C.green, anchor: 'middle' })}
          {txt(115, 240, L('crossed out = repeat', 'काटी हुई = दोहराई गई'), { size: 9.5, color: C.slate, anchor: 'middle' })}
          {txt(320, 250, L('DISTINCT scans the whole column, then keeps one row per unique value', 'DISTINCT पूरा column स्कैन करके हर unique value की एक row रखता है'), { anchor: 'middle', color: C.slate })}
        </>
      );
    }

    // ---------------------------------------------------------------
    case 'limit-paginate': {
      const cols: Col[] = [
        { label: 'id', w: 46, pk: true },
        { label: 'customer', w: 96 },
        { label: 'total', w: 66 },
      ];
      const rows = [
        ['1', 'Anita', '1200'],
        ['2', 'Bose', '850'],
        ['3', 'Chetan', '430'],
        ['4', 'Diya', '2100'],
        ['5', 'Eshan', '990'],
        ['6', 'Farah', '640'],
        ['7', 'Gita', '1750'],
      ];
      const resRows = [
        ['1', 'Anita', '1200'],
        ['2', 'Bose', '850'],
        ['3', 'Chetan', '430'],
      ];
      return (
        <>
          {chip(150, 26, 'LIMIT 3', C.blue)}
          {chip(268, 26, 'OFFSET 3', C.amber)}
          <Tbl
            x={70} y={52} name="orders" tag="7 rows" cols={cols} rows={rows}
            rowTints={{ 0: C.greenFill, 1: C.greenFill, 2: C.greenFill, 3: C.amberFill, 4: C.amberFill, 5: C.amberFill }}
          />
          {hExt(34, 66, 129, C.green)}
          {txt(30, 132, L('page 1', 'पेज 1'), { size: 9, color: C.green, bold: true, anchor: 'end' })}
          {hExt(34, 66, 195, C.amber)}
          {txt(30, 198, L('page 2', 'पेज 2'), { size: 9, color: C.amber, bold: true, anchor: 'end' })}
          {arrow(286, 118, 376, 118, 'blue', L('LIMIT 3 → page 1', 'LIMIT 3 → पेज 1'))}
          <Tbl x={382} y={52} name="result" tag="3 rows" cols={cols} rows={resRows} result rowTints={{ 0: C.greenFill, 1: C.greenFill, 2: C.greenFill }} />
          {txt(484, 178, L('OFFSET 3 → next page', 'OFFSET 3 → अगला पेज'), { size: 9.5, color: C.amber, anchor: 'middle', bold: true })}
          {txt(320, 266, L('LIMIT = page size · OFFSET = how many rows to skip', 'LIMIT = पेज का आकार · OFFSET = कितनी rows छोड़नी हैं'), { anchor: 'middle', color: C.slate })}
        </>
      );
    }

    // ---------------------------------------------------------------
    case 'null-concept': {
      const cols: Col[] = [
        { label: 'id', w: 46, pk: true },
        { label: 'name', w: 86 },
        { label: 'email', w: 120 },
      ];
      const rows = [
        ['1', 'Rahul', 'rahul@gmail.com'],
        ['2', 'Priya', 'NULL'],
        ['3', 'Amit', "''"],
        ['4', 'Neha', 'neha@out.in'],
      ];
      return (
        <>
          {chip(150, 26, 'WHERE email IS NULL', C.red)}
          <Tbl
            x={80} y={48} name="contacts" tag="4 rows" cols={cols} rows={rows}
            tints={{ '0,2': C.greenFill, '1,2': C.redFill, '2,2': C.amberFill }}
          />
          {leader(334, 68, 348, 64, C.green)}
          {txt(352, 62, L('a real value', 'एक असली value'), { color: C.green, bold: true })}
          {txt(352, 74, L('known & present', 'मौजूद और पता'), { size: 8.5, color: C.slate })}
          {leader(334, 124, 348, 124, C.red)}
          {txt(352, 120, L('NULL = unknown', 'NULL = पता नहीं'), { color: C.red, bold: true })}
          {txt(352, 133, L('missing — not 0, not ""', 'गायब — न 0, न ""'), { size: 8.5, color: C.slate })}
          {leader(334, 148, 348, 156, C.amber)}
          {txt(352, 158, L("'' = empty string", "'' = खाली string"), { color: C.amber, bold: true })}
          {txt(352, 171, L('a value! just blank', 'एक value! बस खाली'), { size: 8.5, color: C.slate })}
          {chip(170, 212, 'email = NULL ✗', C.red)}
          {chip(330, 212, 'email IS NULL ✓', C.green)}
          {txt(320, 238, L('NULL means "unknown" — comparing with = never works, use IS NULL', 'NULL का मतलब "पता नहीं" — = से कभी match नहीं होता, IS NULL लगाओ'), { anchor: 'middle', color: C.slate })}
        </>
      );
    }

    // ---------------------------------------------------------------
    case 'group-buckets': {
      const cols: Col[] = [
        { label: 'id', w: 46, pk: true },
        { label: 'city', w: 76 },
        { label: 'amount', w: 70 },
      ];
      const rows = [
        ['1', 'Delhi', '500'],
        ['2', 'Mumbai', '300'],
        ['3', 'Delhi', '800'],
        ['4', 'Pune', '200'],
        ['5', 'Delhi', '600'],
        ['6', 'Mumbai', '450'],
      ];
      const res: Col[] = [
        { label: 'city', w: 76 },
        { label: 'COUNT(*)', w: 72 },
        { label: 'SUM(amount)', w: 90 },
      ];
      const resRows = [
        ['Delhi', '3', '1900'],
        ['Mumbai', '2', '750'],
        ['Pune', '1', '200'],
      ];
      return (
        <>
          {chip(140, 26, 'GROUP BY city', C.blue)}
          {chip(330, 26, 'COUNT(*) · SUM(amount)', C.green)}
          <Tbl x={40} y={52} name="orders" tag="6 rows" cols={cols} rows={rows} rowTints={{ 0: C.greenFill, 2: C.greenFill, 4: C.greenFill, 1: C.amberFill, 5: C.amberFill, 3: C.slateFill }} />
          {txt(306, 88, L('6 rows collapse → 3 groups', '6 rows घटकर 3 groups'), { size: 9.5, color: C.blueDeep, bold: true, anchor: 'middle' })}
          {arrow(238, 140, 376, 107, 'green')}
          {arrow(238, 185, 376, 129, 'amber')}
          {arrow(238, 162, 376, 151, 'slate')}
          <Tbl x={382} y={52} name="result" tag="3 rows" cols={res} rows={resRows} result rowTints={{ 0: C.greenFill, 1: C.amberFill, 2: C.slateFill }} />
          {txt(136, 244, L('every row joins its bucket', 'हर row अपने bucket में जाती है'), { size: 9.5, color: C.slate, anchor: 'middle' })}
          {txt(320, 282, L('GROUP BY collapses rows: one summary row per group — aggregates do the math', 'GROUP BY rows गिराता है: हर group की एक summary row — गणना aggregates करते हैं'), { anchor: 'middle', color: C.slate })}
        </>
      );
    }

    // ---------------------------------------------------------------
    case 'join-venn': {
      const cCols: Col[] = [
        { label: 'id', w: 46, pk: true },
        { label: 'name', w: 86 },
      ];
      const cRows = [
        ['1', 'Rahul'],
        ['2', 'Priya'],
        ['3', 'Amit'],
      ];
      const oCols: Col[] = [
        { label: 'id', w: 46, pk: true },
        { label: 'cust_id', w: 62, fk: true },
        { label: 'item', w: 70 },
      ];
      const oRows = [
        ['101', '1', 'Laptop'],
        ['102', '2', 'Phone'],
        ['103', '1', 'Mouse'],
        ['104', '4', 'Cable'],
      ];
      const jCols: Col[] = [
        { label: 'name', w: 86 },
        { label: 'item', w: 70 },
      ];
      const jRows = [
        ['Rahul', 'Laptop'],
        ['Priya', 'Phone'],
        ['Rahul', 'Mouse'],
      ];
      return (
        <>
          {chip(210, 26, 'INNER JOIN … ON c.id = o.cust_id', C.blue)}
          <Tbl x={30} y={52} name="customers" tag="3 rows" cols={cCols} rows={cRows} dropRows={[2]} marks={{ 2: 'drop' }} />
          <Tbl x={300} y={52} name="orders" tag="4 rows" cols={oCols} rows={oRows} dropRows={[3]} marks={{ 3: 'drop' }} />
          <line x1={164} y1={rowCY(52, 0)} x2={298} y2={rowCY(52, 0)} stroke={C.green} strokeWidth={1.7} opacity={0.8} />
          <line x1={164} y1={rowCY(52, 0)} x2={298} y2={rowCY(52, 2)} stroke={C.green} strokeWidth={1.7} opacity={0.8} />
          <line x1={164} y1={rowCY(52, 1)} x2={298} y2={rowCY(52, 1)} stroke={C.green} strokeWidth={1.7} opacity={0.8} />
          {txt(231, 92, L('PK ↔ FK match', 'PK ↔ FK मैच'), { size: 9, color: C.blueDeep, bold: true, anchor: 'middle' })}
          {txt(150, 180, L('no order → dropped', 'कोई order नहीं → हटा'), { size: 8.5, color: C.red })}
          {txt(484, 198, L('no customer 4 ✗', 'customer 4 नहीं ✗'), { size: 8.5, color: C.red })}
          {arrow(66, 166, 268, 220, 'blue')}
          {arrow(400, 188, 348, 220, 'blue')}
          <Tbl x={250} y={224} name="joined result" tag="3 rows" cols={jCols} rows={jRows} result />
          {txt(320, 348, L('JOIN builds combined rows where keys match — unmatched rows drop (LEFT JOIN keeps them)', 'JOIN keys match करके combined rows बनाता है — बिना match वाली rows छूटती हैं (LEFT JOIN रखता है)'), { anchor: 'middle', color: C.slate })}
        </>
      );
    }

    // ---------------------------------------------------------------
    case 'subquery-nest': {
      const cols: Col[] = [
        { label: 'id', w: 46, pk: true },
        { label: 'amount', w: 70 },
      ];
      const rows = [
        ['1', '500'],
        ['2', '900'],
        ['3', '200'],
        ['4', '700'],
        ['5', '300'],
      ];
      const avgCols: Col[] = [{ label: 'AVG(amount)', w: 96 }];
      const avgRows = [['520']];
      const outRows = [
        ['2', '900'],
        ['4', '700'],
      ];
      return (
        <>
          {chip(105, 30, 'inner: AVG(amount)', C.blue)}
          <Tbl x={30} y={44} name="orders" tag="5 rows" cols={cols} rows={rows} rowTints={{ 1: C.greenFill, 3: C.greenFill, 0: C.slateFill, 2: C.slateFill, 4: C.slateFill }} />
          {arrow(150, 100, 226, 76, 'blue', L('runs first', 'पहले चलती है'), false)}
          <Tbl x={232} y={44} name="inner result" cols={avgCols} rows={avgRows} result />
          {arrow(330, 84, 356, 116, 'green', L('520 becomes a value', '520 एक value बनता है'), false)}
          <Tbl x={300} y={126} name="outer result" tag="2 rows" cols={cols} rows={outRows} result rowTints={{ 0: C.greenFill, 1: C.greenFill }} />
          {chip(358, 232, 'outer: WHERE amount > 520', C.amber)}
          {txt(320, 254, L('the inner query runs first — its result feeds the outer WHERE like a number', 'inner query पहले चलती है — उसका result outer WHERE को एक number की तरह मिलता है'), { anchor: 'middle', color: C.slate })}
        </>
      );
    }

    // ---------------------------------------------------------------
    case 'window-frame': {
      const cols: Col[] = [
        { label: 'id', w: 46, pk: true },
        { label: 'city', w: 76 },
        { label: 'amount', w: 70 },
        { label: 'running_sum', w: 86 },
      ];
      const rows = [
        ['1', 'Delhi', '100', '100'],
        ['2', 'Delhi', '200', '300'],
        ['3', 'Delhi', '150', '450'],
        ['4', 'Mumbai', '300', '300'],
        ['5', 'Mumbai', '250', '550'],
      ];
      return (
        <>
          {chip(240, 26, 'SUM(amount) OVER (PARTITION BY city ORDER BY id)', C.amber)}
          {txt(325, 46, L('new computed column', 'नया computed column'), { size: 9, color: C.blueDeep, bold: true, anchor: 'middle' })}
          <Tbl x={90} y={52} name="sales" tag="5 rows" cols={cols} rows={rows} hlCols={[3]} partitions={[3]} rowTints={{ 0: C.greenFill, 1: C.greenFill, 2: C.greenFill, 3: C.amberFill, 4: C.amberFill }} />
          {vExt(84, rowY(52, 0), rowY(52, 3), C.blue)}
          {txt(80, 122, L('frame', 'फ़्रेम'), { size: 9, color: C.blueDeep, bold: true, anchor: 'end' })}
          {txt(80, 135, L('(before + current)', '(पिछली + मौजूदा)'), { size: 8, color: C.slate, anchor: 'end' })}
          {txt(80, 155, L('current row', 'मौजूदा row'), { size: 9, color: C.green, bold: true, anchor: 'end' })}
          {txt(374, 122, L('partition 1 · Delhi', 'पार्टीशन 1 · Delhi'), { size: 9, color: C.green, bold: true })}
          {txt(374, 186, L('partition 2 · Mumbai', 'पार्टीशन 2 · Mumbai'), { size: 9, color: C.amber, bold: true })}
          {txt(374, 200, L('restarts at 300', '300 से फिर शुरू'), { size: 8, color: C.slate })}
          {txt(320, 262, L('GROUP BY collapses rows — OVER keeps every row and adds a computed column', 'GROUP BY rows गिरा देता है — OVER हर row रखता है और एक computed column जोड़ता है'), { anchor: 'middle', color: C.slate })}
        </>
      );
    }

    // ---------------------------------------------------------------
    case 'cte-chain': {
      const cols: Col[] = [
        { label: 'city', w: 76 },
        { label: 'amount', w: 70 },
      ];
      const rows = [
        ['Delhi', '500'],
        ['Mumbai', '300'],
        ['Delhi', '800'],
        ['Pune', '200'],
        ['Delhi', '600'],
      ];
      const cteRows = [
        ['Delhi', '500'],
        ['Delhi', '800'],
        ['Delhi', '600'],
      ];
      const ansCols: Col[] = [
        { label: 'city', w: 76 },
        { label: 'SUM(amount)', w: 90 },
      ];
      const ansRows = [['Delhi', '1900']];
      return (
        <>
          {chip(210, 38, L('① filter', '① छानो'), C.blue, '#fff', false)}
          {chip(438, 38, L('② aggregate', '② जोड़ो'), C.green, '#fff', false)}
          <Tbl x={24} y={56} name="orders" tag="raw · 5 rows" cols={cols} rows={rows} />
          {arrow(174, 120, 246, 120, 'blue', 'WHERE')}
          <Tbl x={252} y={56} name="delhi_cte" tag="3 rows" cols={cols} rows={cteRows} rowTints={{ 0: C.greenFill, 1: C.greenFill, 2: C.greenFill }} />
          {arrow(402, 111, 474, 111, 'green', 'SUM')}
          <Tbl x={480} y={56} name="answer" tag="1 row" cols={ansCols} rows={ansRows} result />
          {txt(320, 232, L('WITH names each step — a complex query now reads top to bottom', 'WITH हर step को नाम देता है — complex query अब ऊपर से नीचे पढ़ी जाती है'), { anchor: 'middle', color: C.slate })}
        </>
      );
    }

    // ---------------------------------------------------------------
    case 'index-tree': {
      const cols: Col[] = [
        { label: 'id', w: 46, pk: true },
        { label: 'name', w: 86 },
      ];
      const rows = [
        ['10', 'Asha'],
        ['20', 'Bharat'],
        ['30', 'Chetan'],
        ['40', 'Deepa'],
        ['50', 'Esha'],
        ['60', 'Farhan'],
      ];
      const node = (x: number, y: number, w: number, label: string) => (
        <g>
          <rect x={x} y={y} width={w} height={26} rx={6} fill={C.slateFill} stroke={C.slate} strokeWidth={1.4} />
          <text x={x + w / 2} y={y + 17} textAnchor="middle" fontSize={10} fontWeight="700" fill={C.ink} fontFamily={M}>{label}</text>
        </g>
      );
      return (
        <>
          {chip(170, 26, 'CREATE INDEX idx ON users(id)', C.blue)}
          <Tbl x={30} y={56} name="users" tag="6 rows" cols={cols} rows={rows} hlCols={[0]} />
          {txt(96, 250, L('no index → must read every row', 'no index → हर row पढ़नी पड़ती है'), { size: 9, color: C.red, anchor: 'middle' })}
          {vExt(24, rowY(56, 0), 232, C.red)}
          {txt(492, 44, L('B-tree index (sorted)', 'B-tree index (sorted)'), { size: 9.5, color: C.blueDeep, bold: true, anchor: 'middle' })}
          {node(475, 52, 70, '40')}
          {node(398, 120, 92, '10 · 30')}
          {node(502, 120, 96, '50 · 60')}
          {arrow(505, 78, 444, 118, 'blue')}
          {arrow(515, 78, 550, 118, 'green')}
          <path d="M 550 150 V 199 H 172" fill="none" stroke={C.green} strokeWidth={2} markerEnd="url(#ah-green)" />
          {txt(350, 192, L('find id=50 in 2 hops ✓', 'id=50 को 2 hops में ✓'), { size: 9.5, color: C.green, bold: true, anchor: 'middle' })}
          {txt(320, 284, L('an index is a sorted shortcut tree pointing straight at rows — O(log n)', 'index एक sorted shortcut tree है जो सीधे rows पर point करता है — O(log n)'), { anchor: 'middle', color: C.slate })}
        </>
      );
    }

    // ---------------------------------------------------------------
    case 'transaction': {
      const cols: Col[] = [
        { label: 'id', w: 46, pk: true },
        { label: 'name', w: 80 },
        { label: 'balance', w: 70 },
      ];
      const before = [
        ['1', 'Rahul', '1000'],
        ['2', 'Priya', '500'],
      ];
      const mid = [
        ['1', 'Rahul', '800'],
        ['2', 'Priya', '700'],
      ];
      return (
        <>
          {chip(70, 40, 'BEGIN', C.blue)}
          <Tbl x={30} y={64} name="accounts" tag="before" cols={cols} rows={before} />
          {chip(300, 96, 'UPDATE id 1: −200', C.amber)}
          {chip(300, 124, 'UPDATE id 2: +200', C.amber)}
          {arrow(230, 108, 386, 108, 'amber', L('2 statements', '2 statements'))}
          <Tbl x={392} y={64} name="accounts" tag="mid-state" cols={cols} rows={mid} hlCells={[[0, 2], [1, 2]]} />
          {arrow(490, 154, 300, 194, 'green')}
          {chip(300, 208, 'COMMIT ✓ saved: 800 / 700', C.green)}
          {txt(300, 226, L('all changes permanent', 'सब बदलाव permanent'), { size: 8.5, color: C.green, anchor: 'middle' })}
          {arrow(500, 154, 548, 194, 'red')}
          {chip(552, 208, 'ROLLBACK ↩ 1000 / 500', C.red)}
          {txt(552, 226, L('as if nothing happened', 'जैसे कुछ हुआ ही नहीं'), { size: 8.5, color: C.red, anchor: 'middle' })}
          {txt(320, 260, L('all statements succeed → COMMIT · any failure → ROLLBACK everything', 'सब statements सफ़ल → COMMIT · कोई fail → सब ROLLBACK'), { anchor: 'middle', color: C.slate })}
        </>
      );
    }

    // ---------------------------------------------------------------
    case 'case-branch': {
      const cols: Col[] = [
        { label: 'name', w: 86 },
        { label: 'marks', w: 60 },
      ];
      const rows = [
        ['Rahul', '92'],
        ['Priya', '75'],
        ['Amit', '58'],
        ['Sara', '45'],
        ['Vikram', '88'],
      ];
      const resCols: Col[] = [
        { label: 'name', w: 86 },
        { label: 'marks', w: 60 },
        { label: 'grade', w: 56 },
      ];
      const resRows = [
        ['Rahul', '92', 'A'],
        ['Priya', '75', 'B'],
        ['Amit', '58', 'C'],
        ['Sara', '45', 'C'],
        ['Vikram', '88', 'A'],
      ];
      return (
        <>
          {chip(170, 26, "CASE WHEN … THEN … END", C.blue)}
          <Tbl x={40} y={52} name="students" tag="5 rows" cols={cols} rows={rows} tints={{ '0,1': C.greenFill, '1,1': C.amberFill, '2,1': C.redFill, '3,1': C.redFill, '4,1': C.greenFill }} />
          {arrow(190, 120, 334, 120, 'blue', L('row by row, first match wins', 'row दर row, पहला match जीतता है'))}
          <Tbl x={340} y={52} name="result" tag="5 rows" cols={resCols} rows={resRows} result hlCols={[2]} tints={{ '0,2': C.greenFill, '1,2': C.amberFill, '2,2': C.redFill, '3,2': C.redFill, '4,2': C.greenFill }} />
          {txt(556, 40, '≥ 80 → A', { size: 9, color: C.green, bold: true, mono: true })}
          {txt(556, 54, '≥ 60 → B', { size: 9, color: C.amber, bold: true, mono: true })}
          {txt(556, 68, 'else → C', { size: 9, color: C.red, bold: true, mono: true })}
          {txt(320, 240, L('CASE checks each row top to bottom — the first matching WHEN wins', 'CASE हर row को ऊपर से नीचे जाँचता है — पहला match जीतता है'), { anchor: 'middle', color: C.slate })}
        </>
      );
    }

    // ---------------------------------------------------------------
    case 'union-merge': {
      const cols: Col[] = [
        { label: 'city', w: 76 },
        { label: 'total', w: 60 },
      ];
      const aRows = [
        ['Delhi', '40'],
        ['Mumbai', '30'],
      ];
      const bRows = [
        ['Mumbai', '30'],
        ['Pune', '25'],
      ];
      const resRows = [
        ['Delhi', '40'],
        ['Mumbai', '30'],
        ['Pune', '25'],
      ];
      return (
        <>
          {chip(320, 26, 'UNION', C.green)}
          {txt(300, 44, L('stack + remove duplicates', 'जोड़ो + duplicates हटाओ'), { size: 9, color: C.green, bold: true, anchor: 'middle' })}
          <Tbl x={40} y={52} name="sales_2023" tag="2 rows" cols={cols} rows={aRows} />
          <Tbl x={200} y={52} name="sales_2024" tag="2 rows" cols={cols} rows={bRows} dropRows={[0]} marks={{ 0: 'drop' }} />
          {arrow(180, 84, 426, 76, 'blue')}
          {arrow(364, 100, 426, 96, 'blue')}
          <Tbl x={432} y={52} name="result" tag="3 rows" cols={cols} rows={resRows} result />
          {txt(490, 172, L('UNION dedups identical rows', 'UNION identical rows हटाता है'), { size: 9, color: C.slate, anchor: 'middle' })}
          {txt(490, 186, L('UNION ALL would keep both Mumbais', 'UNION ALL दोनों Mumbai रखता'), { size: 9, color: C.slate, anchor: 'middle' })}
          {txt(320, 232, L('both arms must have the same column shapes — rows get stacked vertically', 'दोनों arms के column shapes same होने चाहिए — rows ऊपर-नीचे जुड़ती हैं'), { anchor: 'middle', color: C.slate })}
        </>
      );
    }

    // ---------------------------------------------------------------
    case 'trigger-flow': {
      const eCols: Col[] = [
        { label: 'id', w: 46, pk: true },
        { label: 'name', w: 80 },
        { label: 'salary', w: 66 },
      ];
      const eRows = [
        ['1', 'Rahul', '40000'],
        ['2', 'Priya', '35000'],
        ['3', 'Neha', '50000'],
      ];
      const lCols: Col[] = [
        { label: 'id', w: 40, pk: true },
        { label: 'action', w: 66 },
        { label: 'detail', w: 96 },
      ];
      const lRows = [
        ['1', 'INSERT', 'emp 3 · Neha'],
        ['2', 'UPDATE', 'emp 2 · 38000'],
      ];
      return (
        <>
          {chip(140, 40, 'AFTER INSERT ON employees', C.amber)}
          <Tbl x={40} y={64} name="employees" tag="3 rows" cols={eCols} rows={eRows} hlRows={[2]} />
          {txt(240, 163, L('INSERT adds this row', 'INSERT यह row जोड़ता है'), { size: 9, color: C.green, bold: true })}
          {arrow(236, 160, 384, 148, 'amber', L('trigger auto-fires', 'trigger अपने आप चलता है'))}
          <Tbl x={390} y={64} name="audit_log" tag="auto" cols={lCols} rows={lRows} hlRows={[0]} />
          {txt(491, 168, L('no human typed this row', 'यह row किसी ने टाइप नहीं की'), { size: 9, color: C.slate, anchor: 'middle' })}
          {chip(150, 210, L('NEW = new row', 'NEW = नई row'), C.green, '#fff', false)}
          {chip(330, 210, L('OLD = old values', 'OLD = पुरानी values'), C.slate, '#fff', false)}
          {txt(320, 250, L('a trigger is stored code that runs automatically on data events', 'trigger stored code है जो data events पर अपने आप चलता है'), { anchor: 'middle', color: C.slate })}
        </>
      );
    }

    // ---------------------------------------------------------------
    case 'acid': {
      const panel = (x: number, letter: string, word: string, color: string, table: React.ReactNode, note: string, noteHi: string) => (
        <g>
          {chip(x + 67, 34, `${letter} · ${word}`, color, '#fff', false)}
          {table}
          {txt(x + 67, 140, L(note, noteHi), { size: 8.5, color: C.slate, anchor: 'middle' })}
        </g>
      );
      return (
        <>
          {panel(20, 'A', 'Atomic', C.blue,
            <Tbl x={27} y={48} name="transfer" cols={[{ label: 'step', w: 60 }, { label: 'amount', w: 66 }]} rows={[['debit', '−500'], ['credit', '+500']]} hlRows={[0, 1]} />,
            'all or nothing — both happen, or neither', 'सब या कुछ नहीं — दोनों हों, या कोई नहीं')}
          {panel(175, 'C', 'Consistent', C.green,
            <Tbl x={182} y={48} name="price" cols={[{ label: 'col', w: 56 }, { label: 'value', w: 62 }]} rows={[['price', '499'], ['price', "'abc'"]]} dropRows={[1]} marks={{ 1: 'drop' }} />,
            'types & rules always hold', 'types और rules हमेशा लागू')}
          {panel(330, 'I', 'Isolated', C.amber,
            <Tbl x={337} y={48} name="view" cols={[{ label: 'txn A', w: 56 }, { label: 'txn B', w: 62 }]} rows={[['500', '—']]} tints={{ '0,1': C.slateFill }} />,
            'half-done work stays hidden', 'अधूरा काम छिपा रहता है')}
          {panel(485, 'D', 'Durable', C.red,
            <Tbl x={492} y={48} name="commit" cols={[{ label: 'write', w: 56 }, { label: 'saved', w: 62 }]} rows={[['rows', '💾 disk']]} hlRows={[0]} />,
            'committed data survives crashes', 'committed data crash से बचता है')}
          {txt(320, 200, L('ACID = the promise a real database makes to your data', 'ACID = असली database का आपके data से वादा'), { anchor: 'middle', color: C.slate })}
        </>
      );
    }

    // ---------------------------------------------------------------
    case 'normalization': {
      const mCols: Col[] = [
        { label: 'id', w: 46, pk: true },
        { label: 'name', w: 80 },
        { label: 'city', w: 72 },
        { label: 'dept', w: 48 },
        { label: 'hod', w: 70 },
      ];
      const mRows = [
        ['1', 'Rahul', 'Delhi', 'CS', 'Dr. Rao'],
        ['2', 'Priya', 'Mumbai', 'CS', 'Dr. Rao'],
        ['3', 'Amit', 'Delhi', 'CS', 'Dr. Rao'],
      ];
      const sCols: Col[] = [
        { label: 'id', w: 46, pk: true },
        { label: 'name', w: 80 },
        { label: 'city', w: 72 },
        { label: 'dept_id', w: 62, fk: true },
      ];
      const sRows = [
        ['1', 'Rahul', 'Delhi', '10'],
        ['2', 'Priya', 'Mumbai', '10'],
        ['3', 'Amit', 'Delhi', '10'],
      ];
      const dCols: Col[] = [
        { label: 'id', w: 46, pk: true },
        { label: 'dept', w: 48 },
        { label: 'hod', w: 70 },
      ];
      const dRows = [['10', 'CS', 'Dr. Rao']];
      return (
        <>
          <Tbl x={40} y={48} name="students (messy)" tag="repeats!" cols={mCols} rows={mRows} tints={{ '0,4': C.redFill, '1,4': C.redFill, '2,4': C.redFill }} />
          {txt(198, 172, L('"Dr. Rao" stored 3 times — update it 3 times!', '"Dr. Rao" 3 बार — 3 बार अपडेट करो!'), { size: 9, color: C.red, anchor: 'middle' })}
          {arrow(198, 180, 198, 206, 'blue', L('split into 2 tables', '2 tables में बाँटो'))}
          <Tbl x={40} y={212} name="students" tag="3 rows" cols={sCols} rows={sRows} />
          <Tbl x={380} y={212} name="departments" tag="1 row" cols={dCols} rows={dRows} />
          <line x1={304} y1={rowCY(212, 0)} x2={378} y2={rowCY(212, 0)} stroke={C.blue} strokeWidth={1.7} markerEnd="url(#ah-blue)" />
          {txt(340, 258, 'dept_id = id', { size: 8.5, color: C.blueDeep, bold: true, anchor: 'middle', mono: true })}
          {txt(560, 298, L('"Dr. Rao" now stored once', '"Dr. Rao" अब एक बार'), { size: 9, color: C.green, bold: true, anchor: 'middle' })}
          {txt(320, 338, L('say each fact once — connect tables with keys (PK ↔ FK)', 'हर तथ्य एक बार कहो — tables को keys से जोड़ो (PK ↔ FK)'), { anchor: 'middle', color: C.slate })}
        </>
      );
    }

    // ---------------------------------------------------------------
    case 'data-types': {
      const cols: Col[] = [
        { label: 'id', w: 46, pk: true },
        { label: 'name', w: 86 },
        { label: 'price', w: 76 },
        { label: 'joined', w: 84 },
      ];
      const rows = [
        ['1', 'Laptop', '45000.00', '2024-01-15'],
        ['2', 'Mouse', '899.50', '2024-03-02'],
        ['3', 'Keyboard', 'cheap?', '2024-05-01'],
      ];
      return (
        <>
          {txt(73, 56, 'INTEGER', { size: 8.5, color: C.blueDeep, bold: true, anchor: 'middle', mono: true })}
          {txt(139, 56, 'TEXT', { size: 8.5, color: C.green, bold: true, anchor: 'middle', mono: true })}
          {txt(220, 56, 'DECIMAL', { size: 8.5, color: C.amber, bold: true, anchor: 'middle', mono: true })}
          {txt(300, 56, 'DATE', { size: 8.5, color: C.slate, bold: true, anchor: 'middle', mono: true })}
          <Tbl x={50} y={64} name="products" tag="3 rows" cols={cols} rows={rows} tints={{ '2,2': C.redFill }} marks={{ 2: 'drop' }} />
          {txt(360, 119, L('DECIMAL → exact money math', 'DECIMAL → पैसे की सटीक गणना'), { size: 9, color: C.green, bold: true })}
          {txt(372, 163, L("rejected: price must be a number ✗", "मना: price number होना चाहिए ✗"), { size: 9, color: C.red })}
          {txt(360, 133, L('TEXT → names, cities', 'TEXT → नाम, शहर'), { size: 9, color: C.green })}
          {txt(320, 212, L('column types are promises — wrong data simply cannot enter', 'column के types वादे हैं — ग़लत data अंदर आ ही नहीं सकता'), { anchor: 'middle', color: C.slate })}
        </>
      );
    }

    default:
      return null;
  }
}
