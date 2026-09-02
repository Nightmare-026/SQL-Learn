'use client';

// Modules 45-48: Running Totals & Moving Averages · CTE Introduction · Multiple CTEs · Recursive CTEs

import { defineModule, section, step, example, mistake, mcq, outputQ, buildQ, blanksQ, task } from './builder';
import type { Module } from '@/types/content';

export const modules: Module[] = [
  defineModule({
    n: 45,
    title: ['Running Totals & Moving Averages', 'Running Totals & Moving Averages'],
    time: '30 min',
    concepts: ['running total', 'cumulative sum', 'moving average', 'window frame', 'rows between', 'preceding', 'following'],
    diagram: 'window-frame',
    objectives: [
      ['Compute cumulative sums with window frames', 'Window frames se cumulative sums nikalna'],
      ['Build moving averages over N rows', 'N rows par moving averages banana'],
      ['Master ROWS BETWEEN PRECEDING/FOLLOWING syntax', 'ROWS BETWEEN PRECEDING/FOLLOWING syntax par kabzа'],
    ],
    theory: [
      section(
        ['Frames: sizing the window', 'Frames: window ka size'],
        [
          [
            'By default, SUM(x) OVER (ORDER BY t) is a RUNNING total: each row sums itself and everything before it — the frame "expands" as you walk. But many analyses need a FIXED window: the last 7 days, the previous 3 rows, a centered band. The frame clause ROWS BETWEEN … AND … sizes it precisely.',
            'Default roop se, SUM(x) OVER (ORDER BY t) ek RUNNING total hai: har row khud ko aur apne se pehle sab jodti hai — chalte-chalte frame "failti" hai. Par kai analyses ko FIXED window chahiye: pichle 7 din, pichli 3 rows, ek centered band. Frame clause ROWS BETWEEN … AND … use exactly naap kar size karti hai.',
          ],
          [
            'The vocabulary: ROWS BETWEEN 2 PRECEDING AND CURRENT ROW = "this row plus the two before" (a 3-row moving window); ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW = running total (the default with ORDER BY); ROWS BETWEEN 3 PRECEDING AND 1 FOLLOWING = centered bands. UNBOUNDED PRECEDING means "from the partition start".',
            'Bhasha: ROWS BETWEEN 2 PRECEDING AND CURRENT ROW = "ye row aur isse pehle ki do" (3-row moving window); ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW = running total (ORDER BY ke saath default); ROWS BETWEEN 3 PRECEDING AND 1 FOLLOWING = centered bands. UNBOUNDED PRECEDING ka matlab "partition ki shuruaat se".',
          ],
        ],
        [],
        'window-frame'
      ),
      section(
        ['Running and moving in business', 'Business me running aur moving'],
        [
          [
            'Running totals answer "how much have we made SO FAR" — the cumulative revenue line every dashboard has, inventory positions over time (our inventory_log is built exactly for this), bank balance ledgers. Moving averages answer "what is the TREND" — smoothing daily noise into a 7-day line, the analyst\'s standard de-noiser.',
            'Running totals ka jawab: "AB tak kitna kamaya" — wo cumulative revenue line jo har dashboard me hai, samay ke saath inventory positions (hamara inventory_log isi bana hai), bank balance ledgers. Moving averages ka jawab: "TREND kya hai" — rozana ke shor ko 7-din ki line me smooth karna, analyst ka standard de-noiser.',
          ],
        ],
        [
          ['SUM + ORDER BY + default frame = running total', 'SUM + ORDER BY + default frame = running total'],
          ['ROWS BETWEEN n PRECEDING AND CURRENT ROW = moving window', 'ROWS BETWEEN n PRECEDING AND CURRENT ROW = moving window'],
          ['AVG over a frame = moving average (the smoother)', 'Frame par AVG = moving average (smoother)'],
        ]
      ),
    ],
    tutorial: {
      title: ['Cumulative and smooth', 'Cumulative aur smooth'],
      steps: [
        step(null, [
          'Two questions, one table: how much inventory has moved SO FAR (running), and what is the rolling trend (moving).',
          'Do sawal, ek table: AB tak kitna inventory hila (running), aur rolling trend kya hai (moving).',
        ]),
        step('SELECT id, product_id, change_quantity, change_type FROM inventory_log ORDER BY id LIMIT 6;', [
          'The raw ledger — every entry a movement.',
          'Raw ledger — har entry ek movement.',
        ], { table: 'inventory_log' }),
        step('SELECT id, change_quantity,\n  SUM(change_quantity) OVER (ORDER BY id) AS running_total\nFROM inventory_log ORDER BY id LIMIT 8;', [
          'Each row\'s cumulative movement — the balance line.',
          'Har row ki cumulative movement — balance line.',
        ], { table: 'inventory_log' }),
        step('SELECT id, change_quantity,\n  ROUND(AVG(change_quantity) OVER (ORDER BY id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS mov_avg_3\nFROM inventory_log ORDER BY id LIMIT 8;', [
          'A 3-entry moving average — noise smoothed, trend visible.',
          '3-entry moving average — shor smooth, trend dikhta hai.',
        ], { table: 'inventory_log' }),
        step("SELECT id, change_type, change_quantity,\n  SUM(CASE WHEN change_type = 'restock' THEN change_quantity ELSE 0 END) OVER (ORDER BY id) AS restocked_so_far\nFROM inventory_log ORDER BY id LIMIT 8;", [
          'CASE inside a window: cumulative RESTOCKS only — frames compose with everything.',
          'Window ke andar CASE: sirf cumulative RESTOCKS — frames sab kuch ke saath jude hain.',
        ], { run: true, table: 'inventory_log' }),
      ],
    },
    syntax: {
      template: 'SUM(col) OVER (ORDER BY seq)                                   -- running\nSUM(col) OVER (ORDER BY seq ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)  -- explicit\nAVG(col) OVER (ORDER BY seq ROWS BETWEEN n PRECEDING AND CURRENT ROW)         -- moving',
      parts: [
        { part: 'ROWS BETWEEN', description: ['Starts the frame clause', 'Frame clause shuru karta hai'] },
        { part: 'n PRECEDING', description: ['n rows before the current', 'current se pehle n rows'] },
        { part: 'CURRENT ROW', description: ['Includes the row itself', 'Row khud shaamil'] },
        { part: 'UNBOUNDED PRECEDING', description: ['From the partition start', 'Partition ki shuruaat se'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT id, change_quantity, SUM(change_quantity) OVER (ORDER BY id) AS running_total FROM inventory_log LIMIT 6;', [
        'The cumulative inventory movement.',
        'Cumulative inventory movement.',
      ]),
      example('easy', 'SELECT id, change_quantity,\n  ROUND(AVG(change_quantity) OVER (ORDER BY id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS avg3\nFROM inventory_log LIMIT 6;', [
        'A 3-row moving average of movement size.',
        'Movement size ka 3-row moving average.',
      ]),
      example('medium', 'SELECT id, change_quantity,\n  SUM(change_quantity) OVER (PARTITION BY product_id ORDER BY id) AS product_total\nFROM inventory_log WHERE product_id = 43 ORDER BY id LIMIT 8;', [
        'Per-product running totals — frames restart at each partition.',
        'Per-product running totals — har partition par frames restart.',
      ]),
      example('hard', "SELECT id, change_type,\n  SUM(CASE WHEN change_type = 'restock' THEN change_quantity ELSE 0 END) OVER (ORDER BY id) AS restock_running,\n  SUM(CASE WHEN change_type = 'sale' THEN change_quantity ELSE 0 END) OVER (ORDER BY id) AS sale_running\nFROM inventory_log ORDER BY id LIMIT 6;", [
        'Two cumulative lines side by side — restocks up, sales down, the story of stock.',
        'Do cumulative lines saath-saath — restocks upar, sales neeche, stock ki kahani.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Running total without ORDER BY', 'ORDER BY ke bina running total'],
        ['SUM(x) OVER () with no ORDER BY gives the GRAND TOTAL on every row — a classic surprise. ORDER BY is what makes it "running".', 'ORDER BY ke bina SUM(x) OVER () har row par GRAND TOTAL deta hai — classic surprise. "Running" banane wala ORDER BY hi hai.']
      ),
      mistake(
        ['Expecting RANGE semantics from ROWS', 'ROWS se RANGE semantics expect karna'],
        ['ROWS counts physical rows; RANGE (the alternative) groups equal ORDER BY values together. For daily data with one row per day they coincide; with duplicates they diverge — know which you asked for.', 'ROWS physical rows ginta hai; RANGE (alternative) barabar ORDER BY values ko saath jodta hai. Ek-row-per-day data par dono same; duplicates par alag — pata rakho kya maanga tha.']
      ),
      mistake(
        ['Forgetting frames restart per partition', 'Frames har partition par restart hona bhool jaana'],
        ['PARTITION BY product_id + running total = a separate running line per product, all resetting at product boundaries. That is usually exactly right — but be aware it is not one global line.', 'PARTITION BY product_id + running total = har product ki alag running line, product boundaries par reset. Aksar wahi sahi hota hai — par jaan lo ki ek global line nahi hai.']
      ),
    ],
    summary: [
      ['ORDER BY + SUM = running total; the frame expands per row', 'ORDER BY + SUM = running total; frame har row par failti hai'],
      ['ROWS BETWEEN n PRECEDING AND CURRENT ROW sizes moving windows', 'ROWS BETWEEN n PRECEDING AND CURRENT ROW moving window ka size'],
      ['AVG over a frame smooths; per-partition frames restart', 'Frame par AVG smooth karta hai; per-partition frames restart'],
      ['CASE inside windows makes conditional cumulative lines', 'Windows ke andar CASE conditional cumulative lines banata hai'],
    ],
    quiz: [
      mcq(
        ['What does SUM(x) OVER (ORDER BY t) compute per row?', 'SUM(x) OVER (ORDER BY t) har row par kya compute karta hai?'],
        [
          ['The grand total on every row', 'Har row par grand total'],
          ['The running total: this row plus all previous rows', 'Running total: ye row aur saari pichli rows'],
          ['The row\'s own value', 'Row ki apni value'],
          ['The average of all rows', 'Saari rows ka average'],
        ],
        1,
        ['ORDER BY makes the default frame "unbounded preceding to current" — a running sum.', 'ORDER BY default frame "unbounded preceding to current" banata hai — running sum.']
      ),
      outputQ(
        'SELECT id, change_quantity, SUM(change_quantity) OVER (ORDER BY id) AS rt FROM inventory_log ORDER BY id LIMIT 3;',
        ['The first three running totals:', 'Pehle teen running totals:'],
        [
          { label: 'A', result: { columns: ['id', 'change_quantity', 'rt'], rows: [[1, -1, -1], [2, -7, -8], [3, -9, -17]] } },
          { label: 'B', result: { columns: ['id', 'change_quantity', 'rt'], rows: [[1, -1, -1], [2, -7, -7], [3, -9, -9]] } },
          { label: 'C', result: { columns: ['id', 'change_quantity', 'rt'], rows: [[1, -1, 5826], [2, -7, 5826], [3, -9, 5826]] } },
          { label: 'D', result: { error: 'Error: misuse of window' } },
        ],
        0,
        ['Running: −1, then −1 + −7 = −8, then −17 — each row accumulates the past.', 'Running: −1, phir −1 + −7 = −8, phir −17 — har row past jodti hai.']
      ),
      buildQ(
        ['Build: cumulative inventory movement', 'Banao: cumulative inventory movement'],
        ['id', 'change_quantity', 'SUM', 'change_quantity', 'OVER', 'ORDER BY id', 'SELECT', 'FROM', 'inventory_log', 'running_total', 'AS'],
        ['SELECT', 'id', ',', 'change_quantity', ',', 'SUM', '(', 'change_quantity', ')', 'OVER', '(', 'ORDER', 'BY', 'id', ')', 'AS', 'running_total', 'FROM', 'inventory_log'],
        ['SUM + OVER (ORDER BY id) — the running pattern.', 'SUM + OVER (ORDER BY id) — running pattern.']
      ),
      blanksQ(
        'SELECT AVG(x) OVER (ORDER BY t ROWS ___ 2 PRECEDING ___ CURRENT ROW) FROM t1;',
        [
          { options: ['BETWEEN', 'AND', 'FROM'], correct: 'BETWEEN' },
          { options: ['AND', 'TO', 'WITH'], correct: 'AND' },
        ],
        ['ROWS BETWEEN n PRECEDING AND CURRENT ROW — the moving window.', 'ROWS BETWEEN n PRECEDING AND CURRENT ROW — moving window.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The ledger line: cumulative change_quantity over inventory_log (by id). Columns: id, change_quantity, running_total. LIMIT 8 by id.',
          'Ledger line: inventory_log par cumulative change_quantity (id se). Columns: id, change_quantity, running_total. Id se LIMIT 8.',
        ],
        sol: 'SELECT id, change_quantity,\n  SUM(change_quantity) OVER (ORDER BY id) AS running_total\nFROM inventory_log ORDER BY id LIMIT 8;',
        hints: [
          ['SUM with ORDER BY — the default running frame.', 'ORDER BY ke saath SUM — default running frame.'],
          ['SELECT id, change_quantity, SUM(change_quantity) OVER (ORDER BY id) AS running_total FROM inventory_log ORDER BY id LIMIT 8;', 'SELECT id, change_quantity, SUM(change_quantity) OVER (ORDER BY id) AS running_total FROM inventory_log ORDER BY id LIMIT 8;'],
          ['The totals walk negative as sales dominate early.', 'Totals shuru me sales ke dominance se negative chalte hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'easy',
        desc: [
          'Smoothed movement: 3-row moving average of change_quantity (rounded to 2 decimals, aliased avg3). Columns: id, change_quantity, avg3. LIMIT 8 by id.',
          'Smoothed movement: change_quantity ka 3-row moving average (2 decimals par, aliased avg3). Columns: id, change_quantity, avg3. Id se LIMIT 8.',
        ],
        sol: 'SELECT id, change_quantity,\n  ROUND(AVG(change_quantity) OVER (ORDER BY id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS avg3\nFROM inventory_log ORDER BY id LIMIT 8;',
        hints: [
          ['Add the frame clause to AVG.', 'AVG par frame clause jodo.'],
          ['SELECT id, change_quantity, ROUND(AVG(change_quantity) OVER (ORDER BY id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS avg3 FROM inventory_log ORDER BY id LIMIT 8;', 'SELECT id, change_quantity, ROUND(AVG(change_quantity) OVER (ORDER BY id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS avg3 FROM inventory_log ORDER BY id LIMIT 8;'],
          ['Early rows average fewer than 3 entries — expected.', 'Shuru ki rows 3 se kam entries ka average leti hain — expected.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'medium',
        desc: [
          'Monthly revenue line: cumulative monthly revenue (running total of monthly SUMs). Columns: month, revenue, cumulative (rounded). Sorted by month. LIMIT 8.',
          'Monthly revenue line: monthly SUMs ka cumulative (running total). Columns: month, revenue, cumulative (rounded). Month se sorted. LIMIT 8.',
        ],
        sol: "SELECT month, ROUND(revenue, 2) AS revenue,\n  ROUND(SUM(revenue) OVER (ORDER BY month), 2) AS cumulative\nFROM (\n  SELECT substr(o.order_date, 1, 7) AS month, SUM(p.amount) AS revenue\n  FROM orders o JOIN payments p ON p.order_id = o.id\n  GROUP BY substr(o.order_date, 1, 7)\n) ORDER BY month LIMIT 8;",
        hints: [
          ['Group monthly first, then run SUM over the months.', 'Pehle monthly group karo, phir months par SUM chalao.'],
          ['Monthly sum then running sum: group months first, then SUM over the months.', 'Final: month, revenue, cumulative — all rounded.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
      }),
      task({
        d: 'hard',
        desc: [
          'Product 43\'s story: entries for product 43 only, with the per-product running total of change_quantity. Columns: id, change_quantity, product_total. Sorted by id. LIMIT 10.',
          'Product 43 ki kahani: sirf product 43 ki entries, change_quantity ka per-product running total ke saath. Columns: id, change_quantity, product_total. Id se sorted. LIMIT 10.',
        ],
        sol: 'SELECT id, change_quantity,\n  SUM(change_quantity) OVER (PARTITION BY product_id ORDER BY id) AS product_total\nFROM inventory_log WHERE product_id = 43 ORDER BY id LIMIT 10;',
        hints: [
          ['Filter to the product, then partition by it (habit beats necessity).', 'Product par filter karo, phir usse partition karo (aadat zarurat se badi hai).'],
          ['SELECT id, change_quantity, SUM(change_quantity) OVER (PARTITION BY product_id ORDER BY id) AS product_total FROM inventory_log WHERE product_id = 43 ORDER BY id LIMIT 10;', 'SELECT id, change_quantity, SUM(change_quantity) OVER (PARTITION BY product_id ORDER BY id) AS product_total FROM inventory_log WHERE product_id = 43 ORDER BY id LIMIT 10;'],
          ['Product 43 accumulates the largest positive total in the data.', 'Product 43 data me sabse bada positive total jodta hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'The two-line story: cumulative restocks and cumulative sales (both as positive numbers) side by side, by entry id. Columns: id, restocked, sold (running CASE-sums, rounded 2). Sorted by id. LIMIT 10.',
          'Do-line ki kahani: cumulative restocks aur cumulative sales (dono positive numbers) saath-saath, entry id se. Columns: id, restocked, sold (running CASE-sums, 2 par rounded). Id se sorted. LIMIT 10.',
        ],
        sol: "SELECT id,\n  ROUND(SUM(CASE WHEN change_type = 'restock' THEN change_quantity ELSE 0 END) OVER (ORDER BY id), 2) AS restocked,\n  ROUND(SUM(CASE WHEN change_type = 'sale' THEN ABS(change_quantity) ELSE 0 END) OVER (ORDER BY id), 2) AS sold\nFROM inventory_log ORDER BY id LIMIT 10;",
        hints: [
          ['CASE inside each SUM window; ABS keeps sales positive.', 'Har SUM window ke andar CASE; ABS sales ko positive rakhta hai.'],
          ["SUM(CASE WHEN change_type='restock' THEN change_quantity ELSE 0 END) OVER (ORDER BY id).", "SUM(CASE WHEN change_type='restock' THEN change_quantity ELSE 0 END) OVER (ORDER BY id)."],
          ['The gap between the lines is current stock movement.', 'Dono lines ka gap current stock movement hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),

  defineModule({
    n: 46,
    title: ['CTE Introduction', 'CTE Introduction'],
    time: '25 min',
    concepts: ['cte', 'with', 'common table expression', 'named subquery', 'readability', 'refactor'],
    diagram: 'cte-chain',
    objectives: [
      ['Name a query step with WITH', 'WITH se ek query step ko naam dena'],
      ['Refactor nested subqueries into readable CTE chains', 'Nested subqueries ko readable CTE chains me refactor karna'],
      ['Understand CTE scope: one statement, many uses', 'CTE scope samajhna: ek statement, kai uses'],
    ],
    theory: [
      section(
        ['Subqueries get names', 'Subqueries ko naam milte hain'],
        [
          [
            'Deep nesting buries meaning: SELECT … FROM (SELECT … FROM (SELECT …)) — three levels of anonymous parentheses. A CTE (Common Table Expression) hoists each step to a named, temporary result: WITH monthly AS (SELECT …) SELECT … FROM monthly. Read top-down: define the steps, then the final question. Same engine work, radically better story.',
            'Gehra nesting matlab ko dafan karta hai: SELECT … FROM (SELECT … FROM (SELECT …)) — teen level ki be-naam brackets. CTE (Common Table Expression) har step ko ek naamde, temporary result par le aata hai: WITH monthly AS (SELECT …) SELECT … FROM monthly. Upar se neeche padho: steps define karo, phir final sawal. Engine ka kaam same, kahani kaafi behtar.',
          ],
          [
            'A CTE exists only for the ONE statement that follows it — think of it as a named subquery, not a stored table. You can reference it multiple times in that statement (a power you will use immediately), and the engine decides whether to materialise or inline it — you get readability for free, performance unchanged.',
            'CTE sirf us EK statement ke liye jeeta hai jo uske baad aata hai — ise named subquery samjho, stored table nahi. Us statement me aap use kai baar reference kar sakte ho (wo power aap turant use karoge), aur engine decide karta hai materialise kare ya inline — readability free milti hai, performance waise hi.',
          ],
        ],
        [],
        'cte-chain'
      ),
      section(
        ['When to reach for WITH', 'WITH kab pakadna'],
        [
          [
            'Three smells demand a CTE: (1) the same subquery appears twice — name it once, use it twice; (2) nesting exceeds two levels — flatten into steps; (3) a step has business meaning ("monthly_revenue", "active_customers") — naming documents intent. Query review culture treats an un-named triple-nested subquery the way code review treats a 300-line function.',
            'Teen signs CTE maangte hain: (1) wahi subquery do baar aa rahi hai — ek baar naam do, do baar use karo; (2) nesting do level paar — steps me flat karo; (3) kisi step ka business meaning hai ("monthly_revenue", "active_customers") — naam dena intent document karta hai. Query review culture be-naam triple-nested subquery ko waise dekhti hai jaise code review 300-line function ko.',
          ],
        ],
        [
          ['WITH name AS (…) defines a step', 'WITH name AS (…) ek step define karta hai'],
          ['Scope: the single following statement', 'Scope: uske turant baad wala akela statement'],
          ['Reusable: reference the CTE many times', 'Reusable: CTE ko kai baar reference karo'],
        ]
      ),
    ],
    tutorial: {
      title: ['Naming the steps', 'Steps ko naam dena'],
      steps: [
        step(null, [
          'Rebuild the month-over-month growth query — this time each step visible and named.',
          'Month-over-month growth query dobara banao — is baar har step dikhta aur naamdaar.',
        ]),
        step("WITH monthly AS (\n  SELECT substr(o.order_date, 1, 7) AS month, SUM(p.amount) AS revenue\n  FROM orders o JOIN payments p ON p.order_id = o.id\n  GROUP BY substr(o.order_date, 1, 7)\n)\nSELECT month, ROUND(revenue, 2) FROM monthly ORDER BY month LIMIT 6;", [
          'Step 1 named: monthly. The final SELECT simply reads from it.',
          'Step 1 ka naam: monthly. Final SELECT bas usse padhta hai.',
        ], { table: 'orders' }),
        step("WITH monthly AS (\n  SELECT substr(o.order_date, 1, 7) AS month, SUM(p.amount) AS revenue\n  FROM orders o JOIN payments p ON p.order_id = o.id\n  GROUP BY substr(o.order_date, 1, 7)\n)\nSELECT month, ROUND(revenue, 2) AS revenue,\n  ROUND(revenue - LAG(revenue) OVER (ORDER BY month), 2) AS change\nFROM monthly ORDER BY month LIMIT 6;", [
          'LAG runs over the named step — one level of nesting replaced by one name.',
          'LAG naamde step par chalta hai — ek nesting level ki jagah ek naam.',
        ], { table: 'orders' }),
        step("WITH monthly AS (\n  SELECT substr(o.order_date, 1, 7) AS month, SUM(p.amount) AS revenue\n  FROM orders o JOIN payments p ON p.order_id = o.id\n  GROUP BY substr(o.order_date, 1, 7)\n)\nSELECT ROUND(AVG(revenue), 2) AS avg_month, MAX(revenue) AS best_month\nFROM monthly;", [
          'The same CTE powering a totally different final question — reuse for free.',
          'Wahi CTE ek bilkul alag final sawal chala raha hai — reuse free me.',
        ], { run: true, table: 'orders' }),
      ],
    },
    syntax: {
      template: 'WITH name AS (\n  SELECT …\n)\nSELECT … FROM name [JOIN name2 …];',
      parts: [
        { part: 'WITH name AS', description: ['Names the step', 'Step ko naam deta hai'] },
        { part: '(SELECT …)', description: ['The step body — an ordinary query', 'Step ka body — ek aam query'] },
        { part: 'final SELECT', description: ['Uses the name like a table', 'Naam ko table ki tarah use karta hai'] },
      ],
    },
    examples: [
      example('very_easy', "WITH counts AS (SELECT COUNT(*) AS orders FROM orders)\nSELECT * FROM counts;", [
        'The smallest possible CTE — a named single number.',
        'Sabse chhota mumkin CTE — ek naamdaar single number.',
      ]),
      example('easy', "WITH monthly AS (\n  SELECT substr(order_date, 1, 7) AS month, COUNT(*) AS orders FROM orders GROUP BY substr(order_date, 1, 7)\n)\nSELECT month, orders FROM monthly ORDER BY month LIMIT 6;", [
        'Monthly volumes via a named step.',
        'Naamde step se monthly volumes.',
      ]),
      example('medium', "WITH spend AS (\n  SELECT c.name, c.city, SUM(p.amount) AS total\n  FROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id\n  GROUP BY c.id, c.name, c.city\n)\nSELECT city, ROUND(AVG(total), 2) AS avg_spend FROM spend GROUP BY city ORDER BY city LIMIT 6;", [
        'Two analyses, two clean steps: per-customer spend, then city averages.',
        'Do analyses, do saaf steps: per-customer kharch, phir city averages.',
      ]),
      example('hard', "WITH monthly AS (\n  SELECT substr(o.order_date, 1, 7) AS month, SUM(p.amount) AS revenue\n  FROM orders o JOIN payments p ON p.order_id = o.id GROUP BY substr(o.order_date, 1, 7)\n)\nSELECT month, ROUND(revenue, 2) AS revenue,\n  ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month)) / LAG(revenue) OVER (ORDER BY month), 1) AS growth_pct\nFROM monthly WHERE LAG(revenue) OVER (ORDER BY month) IS NOT NULL ORDER BY month;", [
        'The full growth query, readable top to bottom.',
        'Poora growth query, upar se neeche padhne layak. (Note: this final WHERE pattern runs in SQLite as shown in practice via an extra level — see tasks.)',
      ]),
    ],
    mistakes: [
      mistake(
        ['Missing comma between multiple CTEs', 'Kai CTEs ke beech comma bhoolna'],
        ['WITH a AS (…) WITH b AS (…) fails. Multiple CTEs chain with commas: WITH a AS (…), b AS (…) — next module\'s whole topic.', 'WITH a AS (…) WITH b AS (…) fail hota hai. Kai CTEs comma se judte hain: WITH a AS (…), b AS (…) — agle module ka poora topic.']
      ),
      mistake(
        ['Using the CTE outside its statement', 'CTE ko uske statement ke bahar use karna'],
        ['A CTE lives for one statement only. Two queries wanting the same step must each write their own WITH (or graduate to a VIEW — Module 50).', 'CTE sirf ek statement ke liye jeeta hai. Same step chahti do queries ko apna-apan WITH likhna hoga (ya VIEW — Module 50 — ki taraf badhna hoga).']
      ),
      mistake(
        ['Naming CTEs after real tables then wondering which is used', 'CTE ko asli table ke naam par rakh kar confuse hona'],
        ['A CTE name shadows a real table name in that statement — legal, treacherous. Give steps distinct, descriptive names: monthly, spend, active_buyers.', 'CTE ka naam us statement me asli table ke naam ko dhaak deta hai — legal, khatarnak. Steps ko alag, matlab wale naam do: monthly, spend, active_buyers.']
      ),
    ],
    summary: [
      ['CTEs name subquery steps with WITH … AS (…)', 'CTEs WITH … AS (…) se subquery steps ko naam dete hain'],
      ['Scope: exactly the following statement', 'Scope: uske turant baad wala statement'],
      ['Reference them repeatedly within the statement', 'Statement ke andar unhe baar-baar reference karo'],
      ['Readability for free; performance untouched', 'Readability free; performance untouched'],
    ],
    quiz: [
      mcq(
        ['How long does a CTE exist?', 'CTE kitni der zinda rehta hai?'],
        [
          ['Forever, like a table', 'Hamesha, table ki tarah'],
          ['For the single statement that follows the WITH clause', 'WITH clause ke turant baad wale akele statement ke liye'],
          ['For the whole session', 'Poore session ke liye'],
          ['Until you drop it', 'Jab tak aap use drop nahi karte'],
        ],
        1,
        ['A CTE is a named subquery: defined, used, gone — one statement.', 'CTE ek named subquery hai: define, use, khatam — ek statement.']
      ),
      outputQ(
        "WITH n AS (SELECT COUNT(*) AS c FROM customers)\nSELECT c FROM n;",
        ['What single value returns?', 'Kaunsi single value aati hai?'],
        [
          { label: 'A', result: { columns: ['c'], rows: [[100]] } },
          { label: 'B', result: { columns: ['c'], rows: [[500]] } },
          { label: 'C', result: { error: 'Error: near "WITH": syntax error' } },
          { label: 'D', result: { columns: ['c'], rows: [[15]] } },
        ],
        0,
        ['The CTE counts customers: 100 — then the final SELECT simply reads it.', 'CTE customers ginta hai: 100 — phir final SELECT bas use padhta hai.']
      ),
      buildQ(
        ['Build: a monthly-volumes CTE then read from it', 'Banao: monthly-volumes CTE phir usse padho'],
        ['WITH', 'monthly', 'AS', '(', 'SELECT', 'substr(order_date, 1, 7)', 'AS', 'month', 'COUNT(*)', 'FROM', 'orders', 'GROUP BY', ')', 'SELECT', '*', 'FROM', 'monthly'],
        ['WITH', 'monthly', 'AS', '(', 'SELECT', 'substr', '(', 'order_date', ',', '1', ',', '7', ')', 'AS', 'month', ',', 'COUNT', '(', '*', ')', 'FROM', 'orders', 'GROUP', 'BY', 'substr', '(', 'order_date', ',', '1', ',', '7', ')', ')', 'SELECT', '*', 'FROM', 'monthly'],
        ['WITH name AS (body) SELECT … FROM name.', 'WITH naam AS (body) SELECT … FROM naam.']
      ),
      blanksQ(
        '___ monthly AS (SELECT …) ___ * FROM monthly;',
        [
          { options: ['WITH', 'AS', 'CTE'], correct: 'WITH' },
          { options: ['SELECT', 'FROM', 'WHERE'], correct: 'SELECT' },
        ],
        ['WITH opens; the final SELECT consumes.', 'WITH kholta hai; final SELECT use karta hai.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The named count: using a CTE named counts, show the number of customers. Columns: c.',
          'Naamdaar count: counts naam ki CTE se customers ki ginti dikhao. Columns: c.',
        ],
        sol: 'WITH counts AS (SELECT COUNT(*) AS c FROM customers)\nSELECT c FROM counts;',
        hints: [
          ['WITH counts AS (…) SELECT c FROM counts;', 'WITH counts AS (…) SELECT c FROM counts;'],
          ['The CTE is a one-line subquery with an alias inside.', 'CTE ek-line ki subquery hai, andar alias ke saath.'],
          ['The answer is 100.', 'Jawab 100 hai.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'Named monthly volumes: a CTE monthly (month, orders) then read month and orders from it, sorted by month. LIMIT 8.',
          'Naamdaar monthly volumes: CTE monthly (month, orders) phir usse month aur orders padho, month se sorted. LIMIT 8.',
        ],
        sol: "WITH monthly AS (\n  SELECT substr(order_date, 1, 7) AS month, COUNT(*) AS orders\n  FROM orders GROUP BY substr(order_date, 1, 7)\n)\nSELECT month, orders FROM monthly ORDER BY month LIMIT 8;",
        hints: [
          ['Body: group orders by month; final: plain read.', 'Body: orders month se group; final: simple read.'],
          ['WITH monthly AS (SELECT substr(order_date,1,7) AS month, COUNT(*) AS orders FROM orders GROUP BY substr(order_date,1,7)) SELECT month, orders FROM monthly ORDER BY month LIMIT 8;', 'WITH monthly AS (SELECT substr(order_date,1,7) AS month, COUNT(*) AS orders FROM orders GROUP BY substr(order_date,1,7)) SELECT month, orders FROM monthly ORDER BY month LIMIT 8;'],
          ['41-42 orders per month.', 'Har mahine 41-42 orders.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'medium',
        desc: [
          'City averages via a named spend step: CTE spend (name, city, total per customer), then average spend per city (rounded). Columns: city, avg_spend. Sorted by city.',
          'Naamde spend step se city averages: CTE spend (name, city, per-customer total), phir har city ka average kharch (rounded). Columns: city, avg_spend. City se sorted.',
        ],
        sol: "WITH spend AS (\n  SELECT c.name, c.city, SUM(p.amount) AS total\n  FROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id\n  GROUP BY c.id, c.name, c.city\n)\nSELECT city, ROUND(AVG(total), 2) AS avg_spend FROM spend GROUP BY city ORDER BY city;",
        hints: [
          ['Step 1: per-customer totals (three-table join). Step 2: average them per city.', 'Step 1: per-customer totals (teen-table join). Step 2: unka per-city average.'],
          ['WITH spend AS (…) SELECT city, ROUND(AVG(total), 2) AS avg_spend FROM spend GROUP BY city ORDER BY city;', 'WITH spend AS (…) SELECT city, ROUND(AVG(total), 2) AS avg_spend FROM spend GROUP BY city ORDER BY city;'],
          ['This is the "average of sums" done RIGHT — one sum per customer, then averaged.', 'Yeh "sums ka average" SAHI tarah se — ek customer ek sum, phir average.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'Best and average month: CTE monthly (month, revenue per month), then one row with avg_month and best_month (both rounded). Columns: avg_month, best_month.',
          'Best aur average mahina: CTE monthly (month, monthly revenue), phir ek row me avg_month aur best_month (dono rounded). Columns: avg_month, best_month.',
        ],
        sol: "WITH monthly AS (\n  SELECT substr(o.order_date, 1, 7) AS month, SUM(p.amount) AS revenue\n  FROM orders o JOIN payments p ON p.order_id = o.id\n  GROUP BY substr(o.order_date, 1, 7)\n)\nSELECT ROUND(AVG(revenue), 2) AS avg_month, ROUND(MAX(revenue), 2) AS best_month FROM monthly;",
        hints: [
          ['Aggregate the aggregates — legal and clean inside a CTE.', 'Aggregates ka aggregate — CTE ke andar legal aur saaf.'],
          ['WITH monthly AS (…) SELECT ROUND(AVG(revenue),2) AS avg_month, ROUND(MAX(revenue),2) AS best_month FROM monthly;', 'WITH monthly AS (…) SELECT ROUND(AVG(revenue),2) AS avg_month, ROUND(MAX(revenue),2) AS best_month FROM monthly;'],
          ['February is the best month (≈ 3.75M).', 'February best mahina hai (≈ 3.75M).'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'very_hard',
        desc: [
          'Above-average months: CTE monthly, then (using a second nested level or a CTE that includes the average via subquery) show months whose revenue exceeds the average monthly revenue — month and revenue (rounded). Columns: month, revenue. Sorted by revenue descending.',
          'Average-se-upar mahine: CTE monthly, phir (doosra nested level ya subquery se average shaamil karke) wo mahine dikhao jinki revenue average monthly revenue se zyada hai — month aur revenue (rounded). Columns: month, revenue. Revenue se utarte sorted.',
        ],
        sol: "WITH monthly AS (\n  SELECT substr(o.order_date, 1, 7) AS month, SUM(p.amount) AS revenue\n  FROM orders o JOIN payments p ON p.order_id = o.id\n  GROUP BY substr(o.order_date, 1, 7)\n)\nSELECT month, ROUND(revenue, 2) AS revenue\nFROM monthly\nWHERE revenue > (SELECT AVG(revenue) FROM monthly)\nORDER BY revenue DESC;",
        hints: [
          ['The CTE referenced TWICE: outer rows and the scalar average.', 'CTE DO baar reference: outer rows aur scalar average.'],
          ['WHERE revenue > (SELECT AVG(revenue) FROM monthly) — CTE reuse in action.', 'WHERE revenue > (SELECT AVG(revenue) FROM monthly) — CTE reuse kaam par.'],
          ['A handful of strong months beat the mean.', 'Chand majboot mahine mean ko haraate hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),

  defineModule({
    n: 47,
    title: ['Multiple CTEs', 'Multiple CTEs'],
    time: '25 min',
    concepts: ['multiple ctes', 'chaining', 'with', 'comma', 'pipeline', 'stepwise'],
    diagram: 'cte-chain',
    objectives: [
      ['Chain several named steps with commas', 'Comma se kai naamde steps jodna'],
      ['Build on earlier CTEs inside later ones', 'Pichle CTEs par naye CTEs banana'],
      ['Design pipelines: raw → steps → answer', 'Pipelines design karna: raw → steps → jawab'],
    ],
    theory: [
      section(
        ['Commas make pipelines', 'Comma se pipeline banti hai'],
        [
          [
            'One WITH carries any number of steps, comma-separated: WITH a AS (…), b AS (…), c AS (…) SELECT … — and here is the superpower: later steps can USE earlier ones. b can select FROM a; c can join b with a raw table. Each step stays small, single-purpose, and readable — SQL finally reads like a data pipeline.',
            'Ek WITH me koi bhi number of steps aa sakte hain, comma-separated: WITH a AS (…), b AS (…), c AS (…) SELECT … — aur yahi superpower hai: baad wale steps PICHLE walo ko use kar sakte hain. b a se select kar sakta hai; c ko b ke saath raw table join kar sakta hai. Har step chhota, single-purpose aur readable rehta hai — SQL aakhir data pipeline ki tarah padhta hai.',
          ],
          [
            'Execution is strictly top-down among steps: a before b before c. That determinism is the design win — each CTE is a checkpoint you can run standalone while debugging (just temporarily make it the final SELECT).',
            'Execution steps me strictly upar se neeche hoti hai: a pehle, phir b, phir c. Wahi determinism design ki jeet hai — har CTE ek checkpoint hai jo debugging me akela chalaya ja sakta hai (bas usse temporarily final SELECT bana do).',
          ],
        ],
        [],
        'cte-chain'
      ),
      section(
        ['Pipeline design', 'Pipeline design'],
        [
          [
            'The professional shape of a complex query: RAW steps (clean the data: filter, rename, derive) → BUSINESS steps (join, aggregate, window) → ANSWER (the final SELECT, usually trivial). Naming carries the entire narrative: raw_orders → delivered_only → monthly → growth. Reviewers read the names and already understand the query.',
            'Complex query ka professional shape: RAW steps (data saaf karo: filter, rename, derive) → BUSINESS steps (join, aggregate, window) → JAWAB (final SELECT, aksar trivial). Poora narrative naam le kar chalta hai: raw_orders → delivered_only → monthly → growth. Reviewers naam padhte hi query samajh jaate hain.',
          ],
        ],
        [
          ['WITH a AS (…), b AS (…), c AS (…) — comma-chained', 'WITH a AS (…), b AS (…), c AS (…) — comma se jude'],
          ['Later steps read earlier steps', 'Baad wale steps pehle wale padhte hain'],
          ['Raw → business → answer: the pipeline shape', 'Raw → business → jawab: pipeline ka shape'],
        ]
      ),
    ],
    tutorial: {
      title: ['A three-step pipeline', 'Teen-step pipeline'],
      steps: [
        step(null, [
          'Goal: delivered revenue per month, compared with the overall monthly average. Three named steps tell the story.',
          'Goal: har mahine delivered revenue, overall monthly average ke muqable. Teen naamde steps kahani sunate hain.',
        ]),
        step("WITH delivered AS (\n  SELECT o.id, o.order_date, p.amount\n  FROM orders o JOIN payments p ON p.order_id = o.id\n  WHERE o.status = 'delivered'\n)", [
          'Step 1 — RAW: only delivered orders with money attached.',
          'Step 1 — RAW: sirf delivered orders, paisa jude hue.',
        ], { table: 'orders' }),
        step("WITH delivered AS (\n  SELECT o.id, o.order_date, p.amount FROM orders o JOIN payments p ON p.order_id = o.id WHERE o.status = 'delivered'\n),\nmonthly AS (\n  SELECT substr(order_date, 1, 7) AS month, SUM(amount) AS revenue\n  FROM delivered GROUP BY substr(order_date, 1, 7)\n)", [
          'Step 2 — BUSINESS: monthly revenue built FROM step 1.',
          'Step 2 — BUSINESS: monthly revenue STEP 1 se bani.',
        ], { table: 'orders' }),
        step("WITH delivered AS (\n  SELECT o.id, o.order_date, p.amount FROM orders o JOIN payments p ON p.order_id = o.id WHERE o.status = 'delivered'\n),\nmonthly AS (\n  SELECT substr(order_date, 1, 7) AS month, SUM(amount) AS revenue FROM delivered GROUP BY substr(order_date, 1, 7)\n)\nSELECT month, ROUND(revenue, 2) AS revenue,\n  ROUND((SELECT AVG(revenue) FROM monthly), 2) AS overall_avg\nFROM monthly ORDER BY month LIMIT 6;", [
          'Step 3 — ANSWER: each month beside the pipeline\'s own average.',
          'Step 3 — JAWAB: har mahina pipeline ke apne average ke saath.',
        ], { table: 'orders' }),
        step("WITH delivered AS (\n  SELECT o.id, p.amount FROM orders o JOIN payments p ON p.order_id = o.id WHERE o.status = 'delivered'\n)\nSELECT ROUND(SUM(amount), 2) AS total_delivered FROM delivered;", [
          'Reuse the same first step for a completely different answer — pipelines compose.',
          'Wahi pehla step bilkul alag jawab ke liye — pipeline jud jaate hain.',
        ], { run: true, table: 'orders' }),
      ],
    },
    syntax: {
      template: 'WITH step1 AS (\n  SELECT …\n),\nstep2 AS (\n  SELECT … FROM step1 …\n),\nstep3 AS (\n  SELECT … FROM step2 [JOIN …]\n)\nSELECT … FROM step3;',
      parts: [
        { part: 'comma between CTEs', description: ['WITH a AS (…), b AS (…)', 'WITH a AS (…), b AS (…)'] },
        { part: 'step reuse', description: ['Later bodies read earlier names', 'Baad wale body pehle naam padhte hain'] },
        { part: 'final SELECT', description: ['Reads the last step (usually)', 'Aakhri step padhta hai (aksar)'] },
      ],
    },
    examples: [
      example('easy', "WITH vips AS (\n  SELECT id, name, city FROM customers WHERE customer_type = 'vip'\n), vip_orders AS (\n  SELECT o.id, o.customer_id FROM orders o JOIN vips v ON v.id = o.customer_id\n)\nSELECT COUNT(*) AS vip_orders FROM vip_orders;", [
        'Two steps: define VIPs, count their orders.',
        'Do steps: VIPs define karo, unke orders gino.',
      ]),
      example('medium', "WITH spend AS (\n  SELECT c.name, SUM(p.amount) AS total FROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id GROUP BY c.id, c.name\n), big AS (\n  SELECT * FROM spend WHERE total > 1000000\n)\nSELECT COUNT(*) AS big_spenders FROM big;", [
        'A filtered step on top of an aggregate step.',
        'Aggregate step ke upar ek filtered step.',
      ]),
      example('hard', "WITH monthly AS (\n  SELECT substr(o.order_date,1,7) AS month, SUM(p.amount) AS revenue FROM orders o JOIN payments p ON p.order_id = o.id GROUP BY substr(o.order_date,1,7)\n), with_avg AS (\n  SELECT month, revenue, (SELECT AVG(revenue) FROM monthly) AS avg_rev FROM monthly\n)\nSELECT month, ROUND(revenue,2) AS revenue FROM with_avg WHERE revenue > avg_rev ORDER BY revenue DESC;", [
        'Average-months via a pipeline — raw, enriched, filtered.',
        'Pipeline se average-mahine — raw, enriched, filtered.',
      ]),
    ],
    mistakes: [
      mistake(
        ['WITH repeated instead of commas', 'Comma ki jagah WITH dobara likhna'],
        ['WITH a AS (…) WITH b AS (…) is a syntax error. Chain with commas — WITH appears exactly once.', 'WITH a AS (…) WITH b AS (…) syntax error hai. Comma se jodo — WITH exactly ek baar aata hai.']
      ),
      mistake(
        ['Forward references (using a CTE defined later)', 'Aage reference karna (baad me define ki gayi CTE use karna)'],
        ['b can use a, but a cannot use b. Steps resolve top-down — order your definitions accordingly.', 'b, a ko use kar sakta hai, par a, b ko nahi. Steps upar se neeche resolve hote hain — definitions usi order me rakho.']
      ),
      mistake(
        ['God-CTEs: one giant step doing everything', 'God-CTE: ek giant step jo sab kar de'],
        ['If a CTE body exceeds ~15 lines, it hides two steps. Split it — the pipeline is the whole point.', 'CTE body ~15 lines paar jaye to wo do steps chhupa raha hai. Todo — pipeline hi asli point hai.']
      ),
    ],
    summary: [
      ['Multiple CTEs comma-chain under one WITH', 'Kai CTEs ek WITH ke neeche comma se judte hain'],
      ['Each step may read the steps above it', 'Har step apne upar wale steps padh sakta hai'],
      ['Raw → business → answer keeps complex queries readable', 'Raw → business → jawab complex queries readable rakhta hai'],
      ['Debug any step by making it the final SELECT', 'Kisi bhi step ko final SELECT bana kar debug karo'],
    ],
    quiz: [
      mcq(
        ['How do you define three CTEs in one statement?', 'Ek statement me teen CTEs kaise define karte hain?'],
        [
          ['WITH a AS (…) WITH b AS (…) WITH c AS (…)', 'WITH a AS (…) WITH b AS (…) WITH c AS (…)'],
          ['WITH a AS (…), b AS (…), c AS (…)', 'WITH a AS (…), b AS (…), c AS (…)'],
          ['CTE a, b, c AS (…)', 'CTE a, b, c AS (…)'],
          ['Three separate statements', 'Teen alag statements'],
        ],
        1,
        ['One WITH, comma-separated definitions — and later ones may use earlier ones.', 'Ek WITH, comma-separated definitions — aur baad wale pehle walo ko use kar sakte hain.']
      ),
      outputQ(
        "WITH tens AS (SELECT 10 AS v), doubled AS (SELECT v * 2 AS v FROM tens)\nSELECT v FROM doubled;",
        ['What does the chained CTE return?', 'Chained CTE kya return karta hai?'],
        [
          { label: 'A', result: { columns: ['v'], rows: [[20]] } },
          { label: 'B', result: { columns: ['v'], rows: [[10]] } },
          { label: 'C', result: { columns: ['v'], rows: [[5]] } },
          { label: 'D', result: { error: 'Error: near ",": syntax error' } },
        ],
        0,
        ['doubled reads tens: 10 × 2 = 20 — chaining works exactly as it reads.', 'doubled, tens ko padhta hai: 10 × 2 = 20 — chaining bilkul waise hi chalta hai jaise padha jaata hai.']
      ),
      buildQ(
        ['Build: two chained steps (tens → doubled)', 'Banao: do jude steps (tens → doubled)'],
        ['WITH', 'tens', 'AS', '(', 'SELECT', '10', 'AS', 'v', ')', ',', 'doubled', 'AS', '(', 'SELECT', 'v', '*', '2', 'AS', 'v', 'FROM', 'tens', ')', 'SELECT', 'v', 'FROM', 'doubled'],
        ['WITH', 'tens', 'AS', '(', 'SELECT', '10', 'AS', 'v', ')', ',', 'doubled', 'AS', '(', 'SELECT', 'v', '*', '2', 'AS', 'v', 'FROM', 'tens', ')', 'SELECT', 'v', 'FROM', 'doubled'],
        ['Comma between steps; second reads the first.', 'Steps ke beech comma; doosra pehla padhta hai.']
      ),
      blanksQ(
        'WITH a AS (SELECT 1) ___ b AS (SELECT 2) SELECT * ___ b;',
        [
          { options: [',', 'WITH', 'AND'], correct: ',' },
          { options: ['FROM', 'WHERE', 'WITH'], correct: 'FROM' },
        ],
        ['Comma chains; FROM reads.', 'Comma jodta hai; FROM padhta hai.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The doubler: CTE tens (SELECT 10 AS v), then doubled (v * 2 from tens), final SELECT v from doubled. Columns: v.',
          'Doubler: CTE tens (SELECT 10 AS v), phir doubled (tens se v * 2), final SELECT doubled se v. Columns: v.',
        ],
        sol: 'WITH tens AS (SELECT 10 AS v),\ndoubled AS (SELECT v * 2 AS v FROM tens)\nSELECT v FROM doubled;',
        hints: [
          ['Two steps, one comma.', 'Do steps, ek comma.'],
          ['WITH tens AS (SELECT 10 AS v), doubled AS (SELECT v * 2 AS v FROM tens) SELECT v FROM doubled;', 'WITH tens AS (SELECT 10 AS v), doubled AS (SELECT v * 2 AS v FROM tens) SELECT v FROM doubled;'],
          ['The answer is 20.', 'Jawab 20 hai.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'VIP order pipeline: CTE vips (vip customers), then vip_orders (orders by vips), final: count aliased vip_orders. Columns: vip_orders.',
          'VIP order pipeline: CTE vips (vip customers), phir vip_orders (vips ke orders), final: count aliased vip_orders. Columns: vip_orders.',
        ],
        sol: "WITH vips AS (\n  SELECT id FROM customers WHERE customer_type = 'vip'\n),\nvip_orders AS (\n  SELECT o.id FROM orders o JOIN vips v ON v.id = o.customer_id\n)\nSELECT COUNT(*) AS vip_orders FROM vip_orders;",
        hints: [
          ['Step 1 filters people; step 2 joins orders; final counts.', 'Step 1 log filter karta hai; step 2 orders jodta hai; final ginta hai.'],
          ["WITH vips AS (SELECT id FROM customers WHERE customer_type='vip'), vip_orders AS (SELECT o.id FROM orders o JOIN vips v ON v.id=o.customer_id) SELECT COUNT(*) AS vip_orders FROM vip_orders;", "WITH vips AS (SELECT id FROM customers WHERE customer_type='vip'), vip_orders AS (SELECT o.id FROM orders o JOIN vips v ON v.id=o.customer_id) SELECT COUNT(*) AS vip_orders FROM vip_orders;"],
          ['15 VIPs, ~75 orders among them.', '15 VIPs, unme ~75 orders.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'medium',
        desc: [
          'The big-spender pipeline: CTE spend (per-customer totals), CTE big (spend over 1,000,000), final count aliased big_spenders. Columns: big_spenders.',
          'Big-spender pipeline: CTE spend (per-customer totals), CTE big (10,00,000 se upar spend), final count aliased big_spenders. Columns: big_spenders.',
        ],
        sol: "WITH spend AS (\n  SELECT c.id, SUM(p.amount) AS total\n  FROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id\n  GROUP BY c.id\n),\nbig AS (\n  SELECT * FROM spend WHERE total > 1000000\n)\nSELECT COUNT(*) AS big_spenders FROM big;",
        hints: [
          ['Step 1 aggregate; step 2 filter; final count.', 'Step 1 aggregate; step 2 filter; final count.'],
          ['WITH spend AS (…), big AS (SELECT * FROM spend WHERE total > 1000000) SELECT COUNT(*) AS big_spenders FROM big;', 'WITH spend AS (…), big AS (SELECT * FROM spend WHERE total > 1000000) SELECT COUNT(*) AS big_spenders FROM big;'],
          ['Roughly twenty customers cross a million.', 'Lagbhag bees customers million paar karte hain.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'hard',
        desc: [
          'Average-months pipeline (three steps): delivered (delivered orders + amounts), monthly (revenue per month FROM delivered), final: months above the average monthly revenue — month, revenue (rounded). Sorted by revenue descending.',
          'Average-mahine pipeline (teen steps): delivered (delivered orders + amounts), monthly (delivered se monthly revenue), final: average monthly revenue se upar wale mahine — month, revenue (rounded). Revenue se utarte sorted.',
        ],
        sol: "WITH delivered AS (\n  SELECT o.order_date, p.amount FROM orders o JOIN payments p ON p.order_id = o.id WHERE o.status = 'delivered'\n),\nmonthly AS (\n  SELECT substr(order_date, 1, 7) AS month, SUM(amount) AS revenue FROM delivered GROUP BY substr(order_date, 1, 7)\n)\nSELECT month, ROUND(revenue, 2) AS revenue\nFROM monthly\nWHERE revenue > (SELECT AVG(revenue) FROM monthly)\nORDER BY revenue DESC;",
        hints: [
          ['Raw → business → answer, exactly as taught.', 'Raw → business → jawab, jaise sikhaya gaya.'],
          ['The final WHERE reuses monthly via scalar subquery.', 'Final WHERE scalar subquery se monthly ko dobara use karta hai.'],
          ['A few strong delivered-months beat the mean.', 'Chand majboot delivered-mahine mean ko haraate hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'The full growth pipeline: CTE monthly (revenue per month), CTE growth (adds LAG prev and growth_pct), final: month, revenue, growth_pct (both rounded) for months WITH a previous month. Sorted by month. LIMIT 8. Columns: month, revenue, growth_pct.',
          'Poora growth pipeline: CTE monthly (monthly revenue), CTE growth (LAG prev aur growth_pct jodta hai), final: month, revenue, growth_pct (dono rounded) sirf un mahino ke jinka pichla mahina hai. Month se sorted. LIMIT 8. Columns: month, revenue, growth_pct.',
        ],
        sol: "WITH monthly AS (\n  SELECT substr(o.order_date, 1, 7) AS month, SUM(p.amount) AS revenue\n  FROM orders o JOIN payments p ON p.order_id = o.id\n  GROUP BY substr(o.order_date, 1, 7)\n),\ngrowth AS (\n  SELECT month, revenue,\n    LAG(revenue) OVER (ORDER BY month) AS prev\n  FROM monthly\n)\nSELECT month, ROUND(revenue, 2) AS revenue,\n  ROUND(100.0 * (revenue - prev) / prev, 1) AS growth_pct\nFROM growth\nWHERE prev IS NOT NULL\nORDER BY month LIMIT 8;",
        hints: [
          ['The window lives in the middle step; the filter in the final one.', 'Window beech wale step me; filter final me.'],
          ['Window lives in the middle step; the final SELECT filters.', 'growth_pct formula: 100.0 * (revenue - prev) / prev, rounded to 1.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),

  defineModule({
    n: 48,
    title: ['Recursive CTEs', 'Recursive CTEs'],
    time: '30 min',
    concepts: ['recursive cte', 'with recursive', 'anchor', 'recursive member', 'hierarchy', 'tree', 'generation'],
    diagram: 'cte-chain',
    objectives: [
      ['Understand anchor + recursive member structure', 'Anchor + recursive member ka structure samajhna'],
      ['Traverse hierarchies (category trees) upward and downward', 'Hierarchies (category trees) upar-neeche traverse karna'],
      ['Generate number/date series with recursion', 'Recursion se number/date series banana'],
    ],
    theory: [
      section(
        ['A query that feeds itself', 'Ek query jo khud ko feed karti hai'],
        [
          [
            'A recursive CTE has two parts joined by UNION ALL: the ANCHOR — a normal seed query (SELECT 1 AS n) — and the RECURSIVE MEMBER, which selects FROM the CTE itself (SELECT n + 1 FROM counter WHERE n < 10). The engine runs the anchor, then repeatedly applies the member to each batch of new rows until nothing new appears. Result: 1 through 10, generated from thin air.',
            'Recursive CTE ke do hixon hote hain UNION ALL se jude: ANCHOR — ek aam seed query (SELECT 1 AS n) — aur RECURSIVE MEMBER, jo CTE khud se select karta hai (SELECT n + 1 FROM counter WHERE n < 10). Engine anchor chalata hai, phir member ko naye rows ke har batch par lagata lagata hai jab tak kuch naya na bane. Result: 1 se 10 tak, hawa se bane.',
          ],
          [
            'The two flagship uses: hierarchy traversal (walk the category tree from a parent down to all descendants, or from a node up to its ancestors) and series generation (numbers, dates — fill a calendar, drive a simulation). The WHERE in the member is the termination condition; without it, recursion would never stop (SQLite caps it and errors).',
            'Do flagship use: hierarchy traversal (category tree ko parent se neeche saare descendants tak, ya node se upar ancestors tak chalo) aur series generation (numbers, dates — calendar bharo, simulation chalao). Member ka WHERE termination condition hai; uske bina recursion kabhi rukega nahi (SQLite use rok kar error deta hai).',
          ],
        ],
        [],
        'cte-chain'
      ),
      section(
        ['Walking the category tree', 'Category tree par chalna'],
        [
          [
            'Our categories form a two-level tree, but the pattern generalises to any depth. Downward walk: start from a chosen node (anchor), then the member joins tree_edges ON child.parent = current.node, accumulating depth as it goes. Each recursion level peels one more generation: children, grandchildren, and so on until leaves.',
            'Hamari categories do-level ka tree banati hain, par pattern kisi bhi depth tak jaata hai. Neeche ki walk: chune hue node se shuru (anchor), phir member tree_edges ko current node ke children se jodta hai, saath me depth jodte hue. Har recursion level ek aur generation kholta hai: children, grandchildren… jab tak patte na milen.',
          ],
        ],
        [
          ['Anchor seeds; member references the CTE itself', 'Anchor beej deta hai; member CTE khud ko reference karta hai'],
          ['UNION ALL glues the parts; WHERE terminates', 'UNION ALL hisson jodta hai; WHERE rok lagata hai'],
          ['Hierarchies and series are the two killer uses', 'Hierarchies aur series — do killer uses'],
        ]
      ),
    ],
    tutorial: {
      title: ['Counting and climbing', 'Gintī aur chadhna'],
      steps: [
        step(null, [
          'First a generated series, then the category tree walked downward from a parent.',
          'Pehla ek generated series, phir category tree parent se neeche walk ki gayi.',
        ]),
        step('WITH RECURSIVE counter(n) AS (\n  SELECT 1\n  UNION ALL\n  SELECT n + 1 FROM counter WHERE n < 10\n)\nSELECT n FROM counter;', [
          'The hello-world of recursion: 1..10 with no table at all.',
          'Recursion ka hello-world: 1..10, bina kisi table ke.',
        ], { table: 'categories' }),
        step('WITH RECURSIVE tree(node, depth) AS (\n  SELECT id, 0 FROM categories WHERE parent_category_id IS NULL AND id = 1\n  UNION ALL\n  SELECT c.id, tree.depth + 1\n  FROM categories c JOIN tree ON c.parent_category_id = tree.node\n)\nSELECT node, depth FROM tree;', [
          'Walking Electronics (id 1): the anchor is the parent; the member joins children at each level.',
          'Electronics (id 1) par walk: anchor parent hai; member har level par children jodta hai.',
        ], { table: 'categories' }),
        step('WITH RECURSIVE tree(node, depth) AS (\n  SELECT id, 0 FROM categories WHERE id = 2\n  UNION ALL\n  SELECT c.id, tree.depth + 1 FROM categories c JOIN tree ON c.parent_category_id = tree.node\n),\nlabelled AS (\n  SELECT t.node, t.depth, cat.name FROM tree JOIN categories cat ON cat.id = t.node\n)\nSELECT name, depth FROM labelled;', [
          'Adding names to the walk — the tree becomes readable.',
          'Walk me naam jodna — tree padhne-layak ban jaata hai.',
        ], { table: 'categories' }),
        step("WITH RECURSIVE dates(d) AS (\n  SELECT '2023-12-01'\n  UNION ALL\n  SELECT DATE(d, '+1 day') FROM dates WHERE d < '2023-12-03'\n)\nSELECT d FROM dates;", [
          'Series generation with DATE arithmetic: each step adds one day — a calendar built from nothing.',
          'DATE arithmetic se series generation: har step ek din jodta hai — kuch nahi se bana calendar.',
        ], { run: true, table: 'orders' }),
      ],
    },
    syntax: {
      template: 'WITH RECURSIVE name(cols) AS (\n  anchor_query              -- seed\n  UNION ALL\n  recursive_member           -- SELECT … FROM name … [WHERE stop]\n)\nSELECT … FROM name;',
      parts: [
        { part: 'WITH RECURSIVE', description: ['Enables self-reference', 'Self-reference allow karta hai'] },
        { part: 'anchor', description: ['The seed rows', 'Beej rows'] },
        { part: 'UNION ALL', description: ['Glues anchor and member', 'Anchor aur member jodta hai'] },
        { part: 'recursive member', description: ['Reads the CTE; must reference it once', 'CTE padhta hai; use ek baar reference karta hai'] },
      ],
    },
    examples: [
      example('very_easy', 'WITH RECURSIVE counter(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM counter WHERE n < 10)\nSELECT n FROM counter;', [
        'The number series 1-10, generated.',
        'Number series 1-10, generated.',
      ]),
      example('easy', 'WITH RECURSIVE tree(node, depth) AS (\n  SELECT id, 0 FROM categories WHERE id = 9\n  UNION ALL\n  SELECT c.id, tree.depth + 1 FROM categories c JOIN tree ON c.parent_category_id = tree.node\n)\nSELECT t.node, t.depth, c.name FROM tree t JOIN categories c ON c.id = t.node;', [
        'The Home & Kitchen subtree: parent plus its three children.',
        'Home & Kitchen ka subtree: parent aur uske teen children.',
      ]),
      example('medium', "WITH RECURSIVE dates(d) AS (\n  SELECT '2023-06-01'\n  UNION ALL\n  SELECT DATE(d, '+1 day') FROM dates WHERE d < '2023-06-07'\n)\nSELECT d FROM dates;", [
        'A generated date series — June 1 to 7.',
        'Generated date series — 1 se 7 June.',
      ]),
      example('hard', "WITH RECURSIVE counter(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM counter WHERE n < 12),\nmonths AS (SELECT substr(o.order_date, 1, 7) AS m, SUM(p.amount) AS revenue FROM orders o JOIN payments p ON p.order_id = o.id GROUP BY substr(o.order_date, 1, 7))\nSELECT counter.n FROM counter WHERE counter.n NOT IN (SELECT CAST(replace(m, '-', '') AS INTEGER) / 100 FROM months) LIMIT 5;", [
        'A quirky composition: the counter drives set logic against the months (read carefully, then write your own in the tasks).',
        'Ek ajeeb composition: counter months ke set logic ko chalata hai (dhyan se padho, phir tasks me apna likho).',
      ]),
    ],
    mistakes: [
      mistake(
        ['Forgetting the RECURSIVE keyword', 'RECURSIVE keyword bhool jaana'],
        ['WITH tree AS (… UNION ALL SELECT … FROM tree …) fails — plain WITH forbids self-reference. The keyword is the licence.', 'WITH tree AS (… UNION ALL SELECT … FROM tree …) fail hota hai — plain WITH self-reference mana karta hai. Keyword hi licence hai.']
      ),
      mistake(
        ['No termination condition in the member', 'Member me koi termination condition na hona'],
        ['SELECT n + 1 FROM counter with no WHERE grows forever; SQLite stops at the recursion cap and errors. Always bound the member.', 'WHERE ke bina SELECT n + 1 FROM counter hamesha badhta hai; SQLite recursion cap par rok kar error deta hai. Member ko hamesha bound karo.']
      ),
      mistake(
        ['Multiple self-references in one member', 'Ek member me kai self-references'],
        ['Standard SQL allows exactly one reference to the recursive CTE inside the member. Rewriter patterns (e.g., two traversals) need two CTEs or aggregation outside.', 'Standard SQL member ke andar recursive CTE ka exactly ek reference allow karta hai. Do traversals jaise patterns do CTEs ya bahar aggregation maangte hain.']
      ),
    ],
    summary: [
      ['WITH RECURSIVE = anchor UNION ALL self-reading member', 'WITH RECURSIVE = anchor UNION ALL khud-padhne wala member'],
      ['The member must have a termination condition', 'Member me termination condition zaroori hai'],
      ['Traverses hierarchies in both directions', 'Hierarchies ko dono direction me traverse karta hai'],
      ['Generates number and date series from nothing', 'Numbers aur dates ki series kuch bhi nahi se banata hai'],
    ],
    quiz: [
      mcq(
        ['What are the two parts of a recursive CTE?', 'Recursive CTE ke do hisse kya hain?'],
        [
          ['SELECT and FROM', 'SELECT aur FROM'],
          ['An anchor query and a recursive member', 'Ek anchor query aur ek recursive member'],
          ['JOIN and UNION', 'JOIN aur UNION'],
          ['WHERE and HAVING', 'WHERE aur HAVING'],
        ],
        1,
        ['The anchor seeds rows; the member consumes the CTE to produce more, until exhaustion.', 'Anchor rows deta hai; member CTE ko use kar kar aur rows banata hai, jab tak khatam na ho.']
      ),
      outputQ(
        'WITH RECURSIVE c(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM c WHERE n < 5) SELECT SUM(n) FROM c;',
        ['What does the sum of the generated series equal?', 'Generated series ka sum kya hai?'],
        [
          { label: 'A', result: { columns: ['SUM(n)'], rows: [[15]] } },
          { label: 'B', result: { columns: ['SUM(n)'], rows: [[10]] } },
          { label: 'C', result: { columns: ['SUM(n)'], rows: [[5]] } },
          { label: 'D', result: { error: 'Error: recursive reference in a non-recursive CTE' } },
        ],
        0,
        ['The series is 1,2,3,4,5 — summing to 15.', 'Series hai 1,2,3,4,5 — jodkar 15.']
      ),
      buildQ(
        ['Build: the 1-to-5 counter', 'Banao: 1 se 5 tak counter'],
        ['WITH', 'RECURSIVE', 'c(n)', 'AS', '(', 'SELECT', '1', 'UNION', 'ALL', 'SELECT', 'n', '+', '1', 'FROM', 'c', 'WHERE', 'n', '<', '5', ')', 'SELECT', 'n', 'FROM', 'c'],
        ['WITH', 'RECURSIVE', 'c', '(', 'n', ')', 'AS', '(', 'SELECT', '1', 'UNION', 'ALL', 'SELECT', 'n', '+', '1', 'FROM', 'c', 'WHERE', 'n', '<', '5', ')', 'SELECT', 'n', 'FROM', 'c'],
        ['RECURSIVE, anchor 1, member n+1 while n < 5.', 'RECURSIVE, anchor 1, member n+1 jab tak n < 5.']
      ),
      blanksQ(
        'WITH ___ c(n) AS (SELECT 1 UNION ___ SELECT n+1 FROM c WHERE n < 3) SELECT n FROM c;',
        [
          { options: ['RECURSIVE', 'CTE', 'LOOP'], correct: 'RECURSIVE' },
          { options: ['ALL', 'DISTINCT', 'ONLY'], correct: 'ALL' },
        ],
        ['RECURSIVE unlocks self-reference; UNION ALL glues.', 'RECURSIVE self-reference kholta hai; UNION ALL jodta hai.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The counter: generate numbers 1 through 10 (one column n).',
          'Counter: 1 se 10 tak numbers banao (ek column n).',
        ],
        sol: 'WITH RECURSIVE counter(n) AS (\n  SELECT 1\n  UNION ALL\n  SELECT n + 1 FROM counter WHERE n < 10\n)\nSELECT n FROM counter;',
        hints: [
          ['Anchor 1, member +1, stop at 10.', 'Anchor 1, member +1, 10 par rok.'],
          ['WITH RECURSIVE counter(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM counter WHERE n < 10) SELECT n FROM counter;', 'WITH RECURSIVE counter(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM counter WHERE n < 10) SELECT n FROM counter;'],
          ['Ten rows, 1..10.', 'Das rows, 1..10.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'easy',
        desc: [
          'The subtree of Fashion (id 5): node id, name and depth (parent = 0), walking downward. Columns: node, name, depth. Sorted by depth, node.',
          'Fashion (id 5) ka subtree: node id, naam aur depth (parent = 0), neeche ki walk. Columns: node, name, depth. Depth, node se sorted.',
        ],
        sol: "WITH RECURSIVE tree(node, depth) AS (\n  SELECT id, 0 FROM categories WHERE id = 5\n  UNION ALL\n  SELECT c.id, tree.depth + 1 FROM categories c JOIN tree ON c.parent_category_id = tree.node\n)\nSELECT t.node, c.name, t.depth FROM tree t JOIN categories c ON c.id = t.node\nORDER BY t.depth, t.node;",
        hints: [
          ['Anchor: the parent row. Member: children of current nodes.', 'Anchor: parent row. Member: current nodes ke children.'],
          ['WITH RECURSIVE tree(node, depth) AS (SELECT id, 0 FROM categories WHERE id = 5 UNION ALL SELECT c.id, tree.depth+1 FROM categories c JOIN tree ON c.parent_category_id = tree.node) SELECT t.node, c.name, t.depth FROM tree t JOIN categories c ON c.id = t.node ORDER BY t.depth, t.node;', 'WITH RECURSIVE tree(node, depth) AS (SELECT id, 0 FROM categories WHERE id = 5 UNION ALL SELECT c.id, tree.depth+1 FROM categories c JOIN tree ON c.parent_category_id = tree.node) SELECT t.node, c.name, t.depth FROM tree t JOIN categories c ON c.id = t.node ORDER BY t.depth, t.node;'],
          ['Four rows: Fashion plus three children.', 'Chaar rows: Fashion aur teen children.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'medium',
        desc: [
          'A week of dates: generate DATE values from 2023-06-01 to 2023-06-07 (one column d).',
          'Ek hafta ke dates: 2023-06-01 se 2023-06-07 tak DATE values banao (ek column d).',
        ],
        sol: "WITH RECURSIVE dates(d) AS (\n  SELECT '2023-06-01'\n  UNION ALL\n  SELECT DATE(d, '+1 day') FROM dates WHERE d < '2023-06-07'\n)\nSELECT d FROM dates;",
        hints: [
          ['DATE arithmetic: DATE(d, \'+1 day\').', 'Date ka maths: DATE(d, \'+1 day\').'],
          ["WITH RECURSIVE dates(d) AS (SELECT '2023-06-01' UNION ALL SELECT DATE(d, '+1 day') FROM dates WHERE d < '2023-06-07') SELECT d FROM dates;", "WITH RECURSIVE dates(d) AS (SELECT '2023-06-01' UNION ALL SELECT DATE(d, '+1 day') FROM dates WHERE d < '2023-06-07') SELECT d FROM dates;"],
          ['Seven rows.', 'Saat rows.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'The whole forest: every category with its depth below its ROOT ancestor (roots are parents themselves — depth 0). Columns: node, name, depth. Sorted by node. (Hint: anchor = all roots; member = children, depth+1.)',
          'Poora jungle: har category apne ROOT ancestor se neeche apni depth ke saath (roots khud parents hain — depth 0). Columns: node, name, depth. Node se sorted. (Hint: anchor = saare roots; member = children, depth+1.)',
        ],
        sol: "WITH RECURSIVE tree(node, depth) AS (\n  SELECT id, 0 FROM categories WHERE parent_category_id IS NULL\n  UNION ALL\n  SELECT c.id, tree.depth + 1 FROM categories c JOIN tree ON c.parent_category_id = tree.node\n)\nSELECT t.node, c.name, t.depth FROM tree t JOIN categories c ON c.id = t.node\nORDER BY t.node;",
        hints: [
          ['The anchor becomes "all roots" (parent IS NULL).', 'Anchor ban jaata hai "saare roots" (parent IS NULL).'],
          ['WITH RECURSIVE tree(node, depth) AS (SELECT id, 0 FROM categories WHERE parent_category_id IS NULL UNION ALL SELECT c.id, tree.depth+1 FROM categories c JOIN tree ON c.parent_category_id = tree.node) SELECT t.node, c.name, t.depth FROM tree t JOIN categories c ON c.id = t.node ORDER BY t.node;', 'WITH RECURSIVE tree(node, depth) AS (SELECT id, 0 FROM categories WHERE parent_category_id IS NULL UNION ALL SELECT c.id, tree.depth+1 FROM categories c JOIN tree ON c.parent_category_id = tree.node) SELECT t.node, c.name, t.depth FROM tree t JOIN categories c ON c.id = t.node ORDER BY t.node;'],
          ['All 20 categories appear with depth 0 or 1.', 'Saari 20 categories depth 0 ya 1 ke saath dikhti hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'The December calendar check: generate all dates of December 2023 (1..31), then LEFT JOIN payments (payment_date\'s date part) to find days with ZERO payments. Columns: d, payments (aliased). Sorted by d. (Series + LEFT JOIN + date function — the full stack.)',
          'December calendar check: December 2023 ke saare dates (1..31) banao, phir payments (payment_date ka date part) LEFT JOIN karke wo din dhoondo jinke ZERO payments hain. Columns: d, payments (aliased). d se sorted. (Series + LEFT JOIN + date function — poora stack.)',
        ],
        sol: "WITH RECURSIVE dates(d) AS (\n  SELECT '2023-12-01'\n  UNION ALL\n  SELECT DATE(d, '+1 day') FROM dates WHERE d < '2023-12-31'\n),\npaid AS (\n  SELECT DATE(payment_date) AS day FROM payments\n)\nSELECT d, COUNT(paid.day) AS payments\nFROM dates LEFT JOIN paid ON paid.day = d\nGROUP BY d ORDER BY d;",
        hints: [
          ['Series step, payment-days step, LEFT JOIN with COUNT of the right side.', 'Series step, payment-days step, right side ke COUNT ke saath LEFT JOIN.'],
          ['Series step + payment-days step + LEFT JOIN with COUNT of the right side.', 'COUNT(paid.day) skips NULL days — zero-payment days show 0.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),
];
