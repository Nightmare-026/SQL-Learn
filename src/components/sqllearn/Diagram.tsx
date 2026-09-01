'use client';

// ============ Concept diagrams (SVG, spec §7 diagram field) ============

import React from 'react';
import type { DiagramKind } from '@/types/content';

export function Diagram({ kind }: { kind: DiagramKind }) {
  return (
    <div className="my-4 rounded-xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-white p-4 overflow-x-auto custom-scroll">
      <svg viewBox="0 0 640 190" className="w-full min-w-[520px] h-auto" role="img" aria-label="Concept diagram">
        {render(kind)}
      </svg>
    </div>
  );
}

const C = {
  blue: '#2563EB',
  blueFill: '#DBEAFE',
  green: '#059669',
  greenFill: '#D1FAE5',
  amber: '#D97706',
  amberFill: '#FFEDD5',
  red: '#DC2626',
  redFill: '#FEE2E2',
  slate: '#64748B',
  slateFill: '#F1F5F9',
  ink: '#0F172A',
};

function box(x: number, y: number, w: number, h: number, label: string | string[], fill: string, stroke: string, rx = 8) {
  const lines = Array.isArray(label) ? label : [label];
  const startY = y + h / 2 - (lines.length - 1) * 8 + 4;
  return (
    <g key={`${x}-${y}-${label}`}>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth="1.5" />
      {lines.map((l, i) => (
        <text key={i} x={x + w / 2} y={startY + i * 16} textAnchor="middle" fontSize="12" fontWeight="600" fill={C.ink} fontFamily="var(--font-inter), sans-serif">
          {l}
        </text>
      ))}
    </g>
  );
}

function arrow(x1: number, y1: number, x2: number, y2: number, color = C.slate, label?: string) {
  return (
    <g key={`${x1}-${y1}-a`}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.8" markerEnd="url(#arrowhead)" />
      {label && (
        <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} textAnchor="middle" fontSize="10" fill={C.slate} fontFamily="var(--font-inter), sans-serif">
          {label}
        </text>
      )}
    </g>
  );
}

function render(kind: DiagramKind): React.ReactNode {
  switch (kind) {
    case 'tables':
      return (
        <>
          {defs()}
          {box(40, 20, 160, 64, ['students', '50 rows'], C.blueFill, C.blue)}
          {box(300, 20, 130, 64, ['id  name', 'grade  city'], C.slateFill, C.slate)}
          {box(480, 20, 120, 64, ['cells =', 'one value'], C.amberFill, C.amber)}
          {arrow(210, 52, 296, 52, C.blue)}
          {arrow(434, 52, 476, 52, C.amber)}
          <text x={255} y={115} textAnchor="middle" fontSize="11" fill={C.slate} fontFamily="var(--font-inter), sans-serif">a table</text>
          <text x={368} y={115} textAnchor="middle" fontSize="11" fill={C.slate} fontFamily="var(--font-inter), sans-serif">columns (properties)</text>
          <text x={540} y={115} textAnchor="middle" fontSize="11" fill={C.slate} fontFamily="var(--font-inter), sans-serif">row ∩ column</text>
          {box(40, 140, 200, 40, 'rows = records', C.greenFill, C.green)}
          {box(360, 140, 200, 40, 'related via keys', C.blueFill, C.blue)}
        </>
      );
    case 'select-flow':
      return (
        <>
          {defs()}
          {box(40, 60, 110, 56, 'SELECT', C.blueFill, C.blue)}
          {box(190, 60, 110, 56, 'FROM', C.greenFill, C.green)}
          {box(340, 60, 110, 56, 'WHERE', C.amberFill, C.amber)}
          {box(490, 60, 110, 56, 'ORDER BY', C.slateFill, C.slate)}
          {arrow(154, 88, 186, 88)}
          {arrow(304, 88, 336, 88)}
          {arrow(454, 88, 486, 88)}
          <text x={95} y={140} textAnchor="middle" fontSize="10" fill={C.slate} fontFamily="var(--font-inter), sans-serif">what columns</text>
          <text x={245} y={140} textAnchor="middle" fontSize="10" fill={C.slate} fontFamily="var(--font-inter), sans-serif">which table</text>
          <text x={395} y={140} textAnchor="middle" fontSize="10" fill={C.slate} fontFamily="var(--font-inter), sans-serif">filter rows</text>
          <text x={545} y={140} textAnchor="middle" fontSize="10" fill={C.slate} fontFamily="var(--font-inter), sans-serif">sort output</text>
        </>
      );
    case 'filter':
      return (
        <>
          {defs()}
          {box(60, 20, 120, 40, ['WHERE', 'grade = \'A\''], C.amberFill, C.amber)}
          {Array.from({ length: 5 }, (_, i) => box(260, 10 + i * 34, 90, 26, i % 2 === 0 ? '✓ pass' : '✗ drop', i % 2 === 0 ? C.greenFill : C.redFill, i % 2 === 0 ? C.green : C.red))}
          {box(430, 30, 150, 44, 'result', C.blueFill, C.blue)}
          {arrow(184, 40, 256, 40, C.green)}
          {arrow(184, 75, 256, 105, C.red)}
          {arrow(354, 44, 426, 52, C.blue, 'survivors')}
        </>
      );
    case 'sort':
      return (
        <>
          {defs()}
          {Array.from({ length: 6 }, (_, i) => box(80, 12 + i * 30, 110, 22, `row ${7 - i}`, i < 2 ? C.greenFill : i < 4 ? C.amberFill : C.slateFill, i < 2 ? C.green : i < 4 ? C.amber : C.slate))}
          {box(300, 66, 130, 44, 'ORDER BY', C.blueFill, C.blue)}
          {Array.from({ length: 6 }, (_, i) => box(500, 12 + i * 30, 100, 22, `row ${i + 1}`, i < 2 ? C.greenFill : i < 4 ? C.amberFill : C.slateFill, i < 2 ? C.green : i < 4 ? C.amber : C.slate))}
          {arrow(196, 88, 296, 88, C.blue, 'ASC')}
          {arrow(434, 88, 496, 88, C.blue)}
        </>
      );
    case 'distinct':
      return (
        <>
          {defs()}
          {Array.from({ length: 8 }, (_, i) => box(70, 8 + i * 22, 100, 16, ['Delhi', 'Mumbai', 'Delhi', 'Pune', 'Delhi', 'Jaipur', 'Pune', 'Surat'][i], C.slateFill, C.slate))}
          {box(260, 62, 110, 48, 'DISTINCT', C.blueFill, C.blue)}
          {['Delhi', 'Mumbai', 'Pune', 'Jaipur', 'Surat'].map((c, i) => box(460, 20 + i * 30, 100, 22, c, C.greenFill, C.green))}
          {arrow(176, 88, 256, 88, C.blue)}
          {arrow(374, 88, 456, 88, C.green, 'uniques')}
        </>
      );
    case 'limit-paginate':
      return (
        <>
          {defs()}
          {Array.from({ length: 10 }, (_, i) => box(70, 8 + i * 18, 90, 13, `row ${i + 1}`, i < 3 ? C.greenFill : C.slateFill, i < 3 ? C.green : C.slate, 4))}
          {box(240, 55, 120, 44, 'LIMIT 3', C.blueFill, C.blue)}
          {box(450, 12, 60, 22, '1', C.greenFill, C.green)}
          {box(450, 44, 60, 22, '2', C.greenFill, C.green)}
          {box(450, 76, 60, 22, '3', C.greenFill, C.green)}
          {box(540, 44, 70, 30, 'page 1', C.amberFill, C.amber)}
          {arrow(166, 40, 236, 60, C.blue)}
          {arrow(364, 60, 446, 40, C.green)}
          <text x={575} y={120} textAnchor="middle" fontSize="10" fill={C.slate} fontFamily="var(--font-inter), sans-serif">OFFSET n → page n+1</text>
        </>
      );
    case 'null-concept':
      return (
        <>
          {defs()}
          {box(50, 40, 140, 40, 'email column', C.slateFill, C.slate)}
          {box(250, 10, 120, 30, "'rahul@…'", C.greenFill, C.green)}
          {box(250, 60, 120, 30, 'NULL', C.redFill, C.red)}
          {box(250, 110, 120, 30, "''  (empty)", C.amberFill, C.amber)}
          {arrow(194, 50, 246, 25, C.green)}
          {arrow(194, 60, 246, 75, C.red, 'IS NULL')}
          {arrow(194, 70, 246, 125, C.amber)}
          {box(440, 55, 160, 44, ['three different', 'things!'], C.blueFill, C.blue)}
        </>
      );
    case 'group-buckets':
      return (
        <>
          {defs()}
          {Array.from({ length: 12 }, (_, i) => box(50 + (i % 4) * 40, 14 + Math.floor(i / 4) * 26, 32, 20, ['🟢', '🟡', '🔴'][i % 3], C.slateFill, C.slate, 4))}
          {box(260, 50, 120, 50, 'GROUP BY', C.blueFill, C.blue)}
          {box(440, 14, 140, 32, '🟢 → 4 rows', C.greenFill, C.green)}
          {box(440, 62, 140, 32, '🟡 → 4 rows', C.amberFill, C.amber)}
          {box(440, 110, 140, 32, '🔴 → 4 rows', C.redFill, C.red)}
          {arrow(216, 70, 256, 70, C.blue, 'buckets')}
          {arrow(384, 62, 436, 30, C.green)}
          {arrow(384, 75, 436, 78, C.amber)}
          {arrow(384, 88, 436, 126, C.red)}
        </>
      );
    case 'subquery-nest':
      return (
        <>
          {defs()}
          {box(180, 14, 280, 44, 'outer query', C.blueFill, C.blue)}
          {box(230, 76, 180, 44, 'subquery', C.amberFill, C.amber)}
          {box(280, 138, 80, 36, 'data', C.greenFill, C.green)}
          {arrow(320, 60, 320, 74, C.blue, 'reads result of')}
          {arrow(320, 122, 320, 136, C.amber, 'scans')}
          <text x={510} y={90} fontSize="10" fill={C.slate} fontFamily="var(--font-inter), sans-serif">inner runs first →</text>
          <text x={510} y={106} fontSize="10" fill={C.slate} fontFamily="var(--font-inter), sans-serif">outer consumes it</text>
        </>
      );
    case 'join-venn':
      return (
        <>
          {defs()}
          <circle cx="250" cy="85" r="70" fill={C.blueFill} fillOpacity="0.6" stroke={C.blue} strokeWidth="2" />
          <circle cx="390" cy="85" r="70" fill={C.amberFill} fillOpacity="0.6" stroke={C.amber} strokeWidth="2" />
          <text x={200} y={30} fontSize="12" fontWeight="700" fill={C.blue} fontFamily="var(--font-inter), sans-serif">table A</text>
          <text x={410} y={30} fontSize="12" fontWeight="700" fill={C.amber} fontFamily="var(--font-inter), sans-serif">table B</text>
          <text x={195} y={90} fontSize="11" fill={C.ink} fontFamily="var(--font-inter), sans-serif">LEFT</text>
          <text x={398} y={90} fontSize="11" fill={C.ink} fontFamily="var(--font-inter), sans-serif">RIGHT</text>
          <text x={300} y={88} textAnchor="middle" fontSize="11" fontWeight="700" fill={C.ink} fontFamily="var(--font-inter), sans-serif">INNER</text>
          <text x={300} y={140} textAnchor="middle" fontSize="10" fill={C.slate} fontFamily="var(--font-inter), sans-serif">matches only</text>
          <text x={300} y={168} textAnchor="middle" fontSize="10" fill={C.slate} fontFamily="var(--font-inter), sans-serif">FULL OUTER = everything</text>
        </>
      );
    case 'window-frame':
      return (
        <>
          {defs()}
          {Array.from({ length: 8 }, (_, i) => box(50 + i * 60, 50, 50, 24, `r${i + 1}`, i === 3 ? C.greenFill : C.slateFill, i === 3 ? C.green : C.slate, 5))}
          <path d="M 50 92 L 50 100 L 290 100 L 290 92" fill="none" stroke={C.blue} strokeWidth="2" />
          <text x={170} y={116} textAnchor="middle" fontSize="10" fill={C.blue} fontFamily="var(--font-inter), sans-serif">frame: rows before current</text>
          <text x={270} y={44} textAnchor="middle" fontSize="10" fontWeight="700" fill={C.green} fontFamily="var(--font-inter), sans-serif">current row</text>
          {box(400, 70, 200, 40, 'OVER (PARTITION …', C.amberFill, C.amber)}
          <text x={320} y={150} textAnchor="middle" fontSize="10" fill={C.slate} fontFamily="var(--font-inter), sans-serif">GROUP BY collapses rows; OVER keeps them all</text>
        </>
      );
    case 'cte-chain':
      return (
        <>
          {defs()}
          {box(40, 60, 120, 48, 'WITH raw', C.slateFill, C.slate)}
          {box(210, 60, 120, 48, 'step2', C.blueFill, C.blue)}
          {box(380, 60, 120, 48, 'step3', C.greenFill, C.green)}
          {box(530, 60, 90, 48, 'answer', C.amberFill, C.amber)}
          {arrow(164, 84, 206, 84)}
          {arrow(334, 84, 376, 84)}
          {arrow(504, 84, 526, 84)}
          <text x={320} y={140} textAnchor="middle" fontSize="10" fill={C.slate} fontFamily="var(--font-inter), sans-serif">named steps, readable top to bottom</text>
        </>
      );
    case 'index-tree':
      return (
        <>
          {defs()}
          {box(260, 12, 120, 34, 'root', C.blueFill, C.blue)}
          {box(150, 72, 100, 30, 'k < 50', C.slateFill, C.slate)}
          {box(390, 72, 100, 30, 'k ≥ 50', C.slateFill, C.slate)}
          {box(80, 132, 70, 26, 'rows…', C.greenFill, C.green)}
          {box(180, 132, 70, 26, 'rows…', C.greenFill, C.green)}
          {box(390, 132, 70, 26, 'rows…', C.greenFill, C.green)}
          {box(490, 132, 70, 26, 'rows…', C.greenFill, C.green)}
          {arrow(290, 48, 220, 70)}
          {arrow(350, 48, 420, 70)}
          {arrow(180, 104, 125, 130)}
          {arrow(220, 104, 210, 130)}
          {arrow(420, 104, 415, 130)}
          {arrow(460, 104, 515, 130)}
          <text x={320} y={172} textAnchor="middle" fontSize="10" fill={C.slate} fontFamily="var(--font-inter), sans-serif">O(log n) tree walk instead of O(n) scan</text>
        </>
      );
    case 'transaction':
      return (
        <>
          {defs()}
          {box(40, 66, 100, 40, 'BEGIN', C.blueFill, C.blue)}
          {box(180, 40, 110, 34, 'stmt 1', C.slateFill, C.slate)}
          {box(180, 90, 110, 34, 'stmt 2', C.slateFill, C.slate)}
          {box(340, 66, 110, 40, 'COMMIT', C.greenFill, C.green)}
          {box(340, 120, 110, 34, 'ROLLBACK', C.redFill, C.red)}
          {arrow(144, 86, 176, 60, C.slate)}
          {arrow(144, 86, 176, 105, C.slate)}
          {arrow(294, 86, 336, 84, C.green)}
          <line x1="294" y1="107" x2="336" y2="130" stroke={C.red} strokeWidth="1.8" markerEnd="url(#arrowhead)" />
          <text x={500} y={80} fontSize="10" fill={C.green} fontFamily="var(--font-inter), sans-serif">all changes</text>
          <text x={500} y={94} fontSize="10" fill={C.green} fontFamily="var(--font-inter), sans-serif">permanent</text>
          <text x={480} y={140} fontSize="10" fill={C.red} fontFamily="var(--font-inter), sans-serif">nothing happened</text>
        </>
      );
    case 'case-branch':
      return (
        <>
          {defs()}
          {box(40, 70, 100, 40, 'CASE', C.blueFill, C.blue)}
          {box(200, 20, 140, 30, "WHEN a THEN 'x'", C.amberFill, C.amber)}
          {box(200, 70, 140, 30, "WHEN b THEN 'y'", C.amberFill, C.amber)}
          {box(200, 120, 140, 30, "ELSE 'z'", C.slateFill, C.slate)}
          {box(430, 70, 90, 34, 'value', C.greenFill, C.green)}
          {arrow(144, 90, 196, 36)}
          {arrow(144, 90, 196, 85)}
          {arrow(144, 90, 196, 135)}
          {arrow(344, 85, 426, 85, C.green, 'first match wins')}
          {box(430, 130, 90, 26, 'END', C.blueFill, C.blue)}
        </>
      );
    case 'union-merge':
      return (
        <>
          {defs()}
          {box(60, 40, 120, 48, ['arm 1', 'rows A'], C.blueFill, C.blue)}
          {box(60, 110, 120, 48, ['arm 2', 'rows B'], C.amberFill, C.amber)}
          {box(280, 75, 120, 48, 'UNION', C.greenFill, C.green)}
          {box(480, 75, 110, 48, 'stacked', C.greenFill, C.green)}
          {arrow(184, 64, 276, 84, C.blue)}
          {arrow(184, 134, 276, 110, C.amber)}
          {arrow(404, 99, 476, 99, C.green)}
          <text x={340} y={150} textAnchor="middle" fontSize="10" fill={C.slate} fontFamily="var(--font-inter), sans-serif">UNION dedups · UNION ALL keeps all</text>
        </>
      );
    case 'trigger-flow':
      return (
        <>
          {defs()}
          {box(50, 70, 130, 44, 'INSERT/UPDATE', C.amberFill, C.amber)}
          {box(240, 70, 130, 44, 'TRIGGER fires', C.redFill, C.red)}
          {box(430, 70, 140, 44, 'auto action', C.greenFill, C.green)}
          {arrow(184, 92, 236, 92, C.amber)}
          {arrow(374, 92, 426, 92, C.green)}
          <text x={590} y={40} textAnchor="middle" fontSize="10" fill={C.slate} fontFamily="var(--font-inter), sans-serif">NEW = incoming</text>
          <text x={590} y={55} textAnchor="middle" fontSize="10" fill={C.slate} fontFamily="var(--font-inter), sans-serif">OLD = outgoing</text>
        </>
      );
    case 'acid':
      return (
        <>
          {defs()}
          {box(40, 30, 130, 44, ['A', 'all or nothing'], C.blueFill, C.blue)}
          {box(190, 30, 130, 44, ['C', 'rules hold'], C.greenFill, C.green)}
          {box(340, 30, 130, 44, ['I', 'feels alone'], C.amberFill, C.amber)}
          {box(490, 30, 130, 44, ['D', 'survives crash'], C.redFill, C.red)}
          {box(190, 110, 300, 40, 'the reliability contract', C.slateFill, C.slate)}
        </>
      );
    case 'normalization':
      return (
        <>
          {defs()}
          {box(40, 24, 150, 34, '1NF atomic', C.slateFill, C.slate)}
          {box(40, 80, 150, 34, '2NF whole key', C.blueFill, C.blue)}
          {box(40, 136, 150, 34, '3NF no chains', C.greenFill, C.green)}
          {box(280, 80, 140, 40, 'entities', C.amberFill, C.amber)}
          {box(470, 55, 130, 34, 'PK identity', C.blueFill, C.blue)}
          {box(470, 110, 130, 34, 'FK relations', C.greenFill, C.green)}
          {arrow(194, 41, 276, 85)}
          {arrow(194, 97, 276, 97)}
          {arrow(194, 153, 276, 108)}
          {arrow(424, 90, 466, 72)}
          {arrow(424, 100, 466, 126)}
        </>
      );
    case 'data-types':
      return (
        <>
          {defs()}
          {box(40, 20, 150, 34, 'INTEGER ids, counts', C.blueFill, C.blue)}
          {box(40, 70, 150, 34, 'TEXT names, cities', C.greenFill, C.green)}
          {box(40, 120, 150, 34, 'DECIMAL money', C.amberFill, C.amber)}
          {box(280, 45, 150, 34, 'DATE ISO', C.slateFill, C.slate)}
          {box(280, 100, 150, 34, 'NULL unknown', C.redFill, C.red)}
          <text x={480} y={60} fontSize="10" fill={C.slate} fontFamily="var(--font-inter), sans-serif">types are promises:</text>
          <text x={480} y={76} fontSize="10" fill={C.slate} fontFamily="var(--font-inter), sans-serif">bad data cannot enter</text>
          <text x={480} y={92} fontSize="10" fill={C.slate} fontFamily="var(--font-inter), sans-serif">maths becomes safe</text>
        </>
      );
    default:
      return null;
  }
}

function defs() {
  return (
    <defs>
      <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill={C.slate} />
      </marker>
    </defs>
  );
}
