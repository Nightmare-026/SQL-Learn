'use client';

// Modules 41-44: Window Functions Intro · ROW_NUMBER · RANK & DENSE_RANK · LAG & LEAD

import { defineModule, section, step, example, mistake, mcq, outputQ, buildQ, blanksQ, task } from './builder';
import type { Module } from '@/types/content';

export const modules: Module[] = [
  defineModule({
    n: 41,
    title: ['Window Functions Intro', 'Window Functions Intro'],
    time: '30 min',
    concepts: ['window function', 'over', 'partition by', 'frame', 'window order', 'vs group by'],
    diagram: 'window-frame',
    objectives: [
      ['Understand OVER: aggregates that keep every row', 'OVER samajhna: wo aggregates jo har row bachate hain'],
      ['Write PARTITION BY for per-group computation', 'Per-group computation ke liye PARTITION BY likhna'],
      ['Distinguish window functions from GROUP BY', 'Window functions ko GROUP BY se alag karna'],
    ],
    theory: [
      section(
        ['The problem windows solve', 'Window jo problem solve karte hain'],
        [
          [
            'GROUP BY answers "one row per group" — but many questions need the group\'s answer BESIDE every row: "each payment and the average payment of its month", "each product and its category\'s average price", "each row\'s running position". Collapsing to one row per group destroys the detail you still need.',
            'GROUP BY "har group ki ek row" ka jawab deta hai — par kai sawal group ka jawab HAR ROW ke saath maangte hain: "har payment aur uske mahine ka average payment", "har product aur uski category ka average price", "har row ka running position". Group par collapse karne se wo detail toot jaati hai jo abhi chahiye.',
          ],
          [
            'Window functions compute aggregates WITHOUT collapsing: AVG(amount) OVER (PARTITION BY month) puts the monthly average beside every row of that month. The "window" is the set of rows each row can see — its partition, ordered when needed. Every row survives, each carrying its context.',
            'Window functions aggregate dete hain bina collapse kiye: AVG(amount) OVER (PARTITION BY month) har mahine ka average us mahine ki har row ke saath rakh deta hai. "Window" un rows ka set hai jo har row dekh sakti hai — uska partition, zaroorat par ordered. Har row bachti hai, har ek apna context le kar.',
          ],
        ],
        [],
        'window-frame'
      ),
      section(
        ['The anatomy of OVER', 'OVER ki anatomy'],
        [
          [
            'Every window function call ends with OVER (…) — that is what makes it a window function. Inside: PARTITION BY col (which sub-group each row sees; omit = whole table), ORDER BY col (row order within the partition — essential for numbering and offset functions), and optionally a frame (ROWS BETWEEN … — the sliding subset, next modules). Aggregates like SUM, AVG, COUNT become window functions simply by adding OVER ( ).',
            'Har window function call OVER (…) par khatam hoti hai — wahi use window function banata hai. Andar: PARTITION BY col (har row kaunsa sub-group dekhe; chhoda to poori table), ORDER BY col (partition ke andar row order — numbering aur offset functions ke liye zaroori), aur optionally frame (ROWS BETWEEN … — sliding subset, agla module). SUM, AVG, COUNT jaise aggregates bas OVER ( ) jodne se hi window function ban jaate hain.',
          ],
          [
            'The golden contrast: GROUP BY shrinks (500 rows → 12 months); OVER preserves (500 rows → 500 rows, each enriched). Choose by the question: a summary slide wants GROUP BY; a row-level report with context wants OVER. You will use both daily.',
            'Golden contrast: GROUP BY sikodta hai (500 rows → 12 mahine); OVER bachata hai (500 rows → 500 rows, har ek enriched). Sawal se chuno: summary slide ko GROUP BY; row-level report with context ko OVER. Dono roz use honge.',
          ],
        ],
        [
          ['OVER (…) turns aggregates into window functions', 'OVER (…) aggregates ko window functions bana deta hai'],
          ['PARTITION BY = per-group; ORDER BY = within-group order', 'PARTITION BY = per-group; ORDER BY = group ke andar order'],
          ['Windows preserve rows; GROUP BY collapses them', 'Windows rows bachate hain; GROUP BY unhe sikodta hai'],
        ]
      ),
    ],
    tutorial: {
      title: ['Context beside every row', 'Har row ke saath context'],
      steps: [
        step(null, [
          'The monthly report needs each payment beside its month\'s average — detail plus context, no collapsing.',
          'Monthly report ko har payment apne mahine ke average ke saath chahiye — detail plus context, bina collapse.',
        ]),
        step('SELECT amount, ROUND(AVG(amount), 2) AS overall_avg FROM payments GROUP BY amount LIMIT 5;', [
          'Wait — grouping destroys the row list. Compare: GROUP BY gives one row per value… the contrast becomes visible.',
          'Ruko — grouping row list tod deta hai. Compare: GROUP BY har value ki ek row deta hai… contrast dikhta hai.',
        ], { table: 'payments' }),
        step('SELECT id, amount, ROUND(AVG(amount) OVER (), 2) AS overall_avg\nFROM payments ORDER BY id LIMIT 6;', [
          'OVER (): every row sees the whole table — average beside every payment, all rows kept.',
          'OVER (): har row poori table dekhti hai — har payment ke saath average, saari rows bachi.',
        ], { table: 'payments' }),
        step("SELECT id, amount, payment_method,\n  ROUND(AVG(amount) OVER (PARTITION BY payment_method), 2) AS rail_avg\nFROM payments ORDER BY payment_method, id LIMIT 8;", [
          'PARTITION BY rail: each row sees its own rail\'s average — grouped context, preserved detail.',
          'PARTITION BY rail: har row apni rail ka average dekhti hai — grouped context, detail bacha.',
        ], { table: 'payments' }),
        step("SELECT id, amount, ROUND(AVG(amount) OVER (PARTITION BY payment_method), 2) AS rail_avg,\n  ROUND(100.0 * amount / AVG(amount) OVER (PARTITION BY payment_method), 1) AS pct_of_rail_avg\nFROM payments ORDER BY id LIMIT 6;", [
          'Context in action: each payment versus its rail norm — a per-row insight GROUP BY cannot give.',
          'Context kaam me: har payment apne rail ke norm ke muqable — per-row insight jo GROUP BY nahi de sakta.',
        ], { run: true, table: 'payments' }),
      ],
    },
    syntax: {
      template: 'SELECT col,\n  AGG(col2) OVER (PARTITION BY col PART ORDER BY col3) AS alias\nFROM table;',
      parts: [
        { part: 'OVER (…)', description: ['Marks the function as a window function', 'Function ko window function banata hai'] },
        { part: 'PARTITION BY', description: ['The per-row sub-group (optional)', 'Per-row ka sub-group (optional)'] },
        { part: 'ORDER BY', description: ['Row order inside the partition (needed by numbering fns)', 'Partition ke andar row order (numbering fns ke liye)'] },
        { part: 'empty OVER ()', description: ['Whole table as the window', 'Poori table window ki tarah'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT id, amount, ROUND(AVG(amount) OVER (), 2) AS overall_avg FROM payments ORDER BY id LIMIT 5;', [
        'Every payment beside the global average — rows preserved.',
        'Har payment global average ke saath — rows bache hue.',
      ]),
      example('easy', "SELECT id, payment_method, amount,\n  ROUND(AVG(amount) OVER (PARTITION BY payment_method), 2) AS rail_avg\nFROM payments ORDER BY payment_method, id LIMIT 8;", [
        'Per-rail context beside each rail\'s payments.',
        'Har rail ke payments ke saath per-rail context.',
      ]),
      example('medium', "SELECT id, product_id, rating,\n  ROUND(AVG(rating) OVER (PARTITION BY product_id), 2) AS product_avg\nFROM reviews ORDER BY product_id, id LIMIT 8;", [
        'Each review beside its product\'s average rating (advanced dataset).',
        'Har review apne product ke average rating ke saath (advanced dataset).',
      ]),
      example('hard', "SELECT id, rating,\n  rating - ROUND(AVG(rating) OVER (), 2) AS vs_global\nFROM reviews ORDER BY vs_global DESC LIMIT 5;", [
        'Deviation from the mean per row — outlier hunting via windows.',
        'Mean se har row ka deviation — windows se outlier shikar.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Adding OVER to a column that is not an aggregate-friendly function', 'Aise function par OVER lagana jo aggregate-friendly nahi hai'],
        ['OVER works with aggregates (SUM/AVG/COUNT/MIN/MAX) and dedicated window functions (ROW_NUMBER, RANK…). UPPER(name) OVER () is an error.', 'OVER aggregates (SUM/AVG/COUNT/MIN/MAX) aur dedicated window functions (ROW_NUMBER, RANK…) ke saath chalta hai. UPPER(name) OVER () error hai.']
      ),
      mistake(
        ['Expecting GROUP BY-style one-row-per-group output from OVER', 'OVER se GROUP BY jaisi one-row-per-group output expect karna'],
        ['OVER never reduces rows. If the report wants one row per group, either GROUP BY, or window + filtering tricks you will meet later (ROW_NUMBER dedup).', 'OVER rows kabhi kam nahi karta. Report ko har group ki ek row chahiye to GROUP BY karo, ya window + filtering tricks (ROW_NUMBER dedup) jo aage milengi.']
      ),
      mistake(
        ['Forgetting the parentheses in OVER', 'OVER me parentheses bhool jaana'],
        ['OVER is always written OVER (…), even when empty. OVER alone is a syntax error.', 'OVER hamesha OVER (…) likha jaata hai, khaali ho tab bhi. Akela OVER syntax error hai.']
      ),
    ],
    summary: [
      ['Window functions compute across rows while keeping every row', 'Window functions rows ke paar compute karte hain, har row bachate hue'],
      ['OVER (…) is the required marker; empty = whole table', 'OVER (…) zaroori marker hai; khaali = poori table'],
      ['PARTITION BY scopes the window per group', 'PARTITION BY window ko per-group scope karta hai'],
      ['GROUP BY collapses; OVER preserves — choose by question', 'GROUP BY sikodta hai; OVER bachata hai — sawal se chuno'],
    ],
    quiz: [
      mcq(
        ['What is the key difference between GROUP BY and window functions?', 'GROUP BY aur window functions me kya bada farak hai?'],
        [
          ['Window functions are faster', 'Window functions fast hote hain'],
          ['GROUP BY collapses rows; window functions keep all rows', 'GROUP BY rows sikodta hai; window functions saari rows rakhte hain'],
          ['Window functions require JOINs', 'Window functions ko JOINs chahiye'],
          ['They are identical', 'Dono same hain'],
        ],
        1,
        ['OVER computes per-row context without losing the rows themselves.', 'OVER per-row context compute karta hai rows khoye bina.']
      ),
      outputQ(
        'SELECT COUNT(*) FROM (SELECT id, AVG(amount) OVER (PARTITION BY payment_method) AS rail_avg FROM payments);',
        ['How many rows does the window query return?', 'Window query kitni rows lauti hai?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[500]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[5]] } },
          { label: 'C', result: { columns: ['COUNT(*)'], rows: [[100]] } },
          { label: 'D', result: { error: 'Error: near "OVER": syntax error' } },
        ],
        0,
        ['Windows preserve rows: 500 payments in, 500 enriched rows out (5 partitions, no collapsing).', 'Windows rows bachate hain: andar 500 payments, bahar 500 enriched rows (5 partitions, koi collapse nahi).']
      ),
      buildQ(
        ['Build: each payment beside its rail average', 'Banao: har payment apne rail average ke saath'],
        ['id', 'amount', 'SELECT', 'AVG(amount)', 'OVER', 'PARTITION BY', 'payment_method', 'FROM', 'payments', 'rail_avg', 'AS'],
        ['SELECT', 'id', ',', 'amount', ',', 'AVG', '(', 'amount', ')', 'OVER', '(', 'PARTITION', 'BY', 'payment_method', ')', 'AS', 'rail_avg', 'FROM', 'payments'],
        ['Aggregate + OVER (PARTITION BY …).', 'Aggregate + OVER (PARTITION BY …).']
      ),
      blanksQ(
        'SELECT id, AVG(amount) ___ (PARTITION ___ payment_method) FROM payments;',
        [
          { options: ['OVER', 'ON', 'BY'], correct: 'OVER' },
          { options: ['BY', 'ON', 'AS'], correct: 'BY' },
        ],
        ['OVER introduces the window; PARTITION BY scopes it.', 'OVER window laya hai; PARTITION BY scope deta hai.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Global context: every payment id and amount beside the overall average payment (aliased overall_avg, rounded). Columns: id, amount, overall_avg. First 8 rows by id.',
          'Global context: har payment ka id aur amount overall average payment ke saath (aliased overall_avg, rounded). Columns: id, amount, overall_avg. Id se pehli 8 rows.',
        ],
        sol: 'SELECT id, amount, ROUND(AVG(amount) OVER (), 2) AS overall_avg FROM payments ORDER BY id LIMIT 8;',
        hints: [
          ['Empty OVER () — the whole table is the window.', 'Khaali OVER () — poori table window hai.'],
          ['SELECT id, amount, ROUND(AVG(amount) OVER (), 2) AS overall_avg FROM payments ORDER BY id LIMIT 8;', 'SELECT id, amount, ROUND(AVG(amount) OVER (), 2) AS overall_avg FROM payments ORDER BY id LIMIT 8;'],
          ['The same average (≈102927.66) repeats on every row.', 'Wahi average (≈102927.66) har row par repeat hota hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'easy',
        desc: [
          'Rail context: each payment beside ITS rail\'s average (partitioned), rounded. Columns: id, payment_method, amount, rail_avg. First 10 rows by payment_method then id.',
          'Rail context: har payment APNI rail ke average (partitioned) ke saath, rounded. Columns: id, payment_method, amount, rail_avg. Payment_method phir id se pehli 10 rows.',
        ],
        sol: "SELECT id, payment_method, amount,\n  ROUND(AVG(amount) OVER (PARTITION BY payment_method), 2) AS rail_avg\nFROM payments ORDER BY payment_method, id LIMIT 10;",
        hints: [
          ['PARTITION BY payment_method scopes the average.', 'PARTITION BY payment_method average ko scope karta hai.'],
          ['SELECT id, payment_method, amount, ROUND(AVG(amount) OVER (PARTITION BY payment_method), 2) AS rail_avg FROM payments ORDER BY payment_method, id LIMIT 10;', 'SELECT id, payment_method, amount, ROUND(AVG(amount) OVER (PARTITION BY payment_method), 2) AS rail_avg FROM payments ORDER BY payment_method, id LIMIT 10;'],
          ['Credit-card rows show their own norm, not the global one.', 'Credit-card rows apna norm dikhati hain, global nahi.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'medium',
        desc: [
          'Review context (advanced DB): each review id, product_id, rating beside its product\'s average rating (rounded, aliased product_avg). Columns: id, product_id, rating, product_avg. First 10 rows by product_id then id.',
          'Review context (advanced DB): har review ka id, product_id, rating uske product ke average rating ke saath (rounded, aliased product_avg). Columns: id, product_id, rating, product_avg. Product_id phir id se pehli 10 rows.',
        ],
        sol: 'SELECT id, product_id, rating,\n  ROUND(AVG(rating) OVER (PARTITION BY product_id), 2) AS product_avg\nFROM reviews ORDER BY product_id, id LIMIT 10;',
        hints: [
          ['Same pattern, new table (reviews).', 'Wahi pattern, nayi table (reviews).'],
          ['SELECT id, product_id, rating, ROUND(AVG(rating) OVER (PARTITION BY product_id), 2) AS product_avg FROM reviews ORDER BY product_id, id LIMIT 10;', 'SELECT id, product_id, rating, ROUND(AVG(rating) OVER (PARTITION BY product_id), 2) AS product_avg FROM reviews ORDER BY product_id, id LIMIT 10;'],
          ['Products with one review show that review as their average.', 'Jin products ki ek review hai wo wahi review average dikhate hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'Percent-of-rail: each payment as a percentage of its rail\'s average (rounded to 1 decimal), aliased pct_of_avg = 100.0 * amount / AVG(amount) OVER (PARTITION BY payment_method). Columns: id, payment_method, amount, pct_of_avg. First 8 rows by id.',
          'Percent-of-rail: har payment apni rail ke average ka percent (1 decimal par rounded), aliased pct_of_avg = 100.0 * amount / AVG(amount) OVER (PARTITION BY payment_method). Columns: id, payment_method, amount, pct_of_avg. Id se pehli 8 rows.',
        ],
        sol: "SELECT id, payment_method, amount,\n  ROUND(100.0 * amount / AVG(amount) OVER (PARTITION BY payment_method), 1) AS pct_of_avg\nFROM payments ORDER BY id LIMIT 8;",
        hints: [
          ['The window result is a value — usable inside arithmetic.', 'Window result ek value hai — arithmetic ke andar usable.'],
          ['SELECT id, payment_method, amount, ROUND(100.0 * amount / AVG(amount) OVER (PARTITION BY payment_method), 1) AS pct_of_avg FROM payments ORDER BY id LIMIT 8;', 'SELECT id, payment_method, amount, ROUND(100.0 * amount / AVG(amount) OVER (PARTITION BY payment_method), 1) AS pct_of_avg FROM payments ORDER BY id LIMIT 8;'],
          ['Values above 100 mark above-average payments.', '100 se upar wali values above-average payments hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'Rating deviation board: reviews whose rating deviates most from the GLOBAL average rating — id, product_id, rating, and deviation (rating − global avg, aliased deviation, rounded to 2 decimals). Sorted by deviation ascending (worst first). LIMIT 8.',
          'Rating deviation board: wo reviews jinka rating global average se sabse zyada hat-ta hai — id, product_id, rating, aur deviation (rating − global avg, aliased deviation, 2 decimals par). Deviation se chadhte (worst pehle) sorted. LIMIT 8.',
        ],
        sol: 'SELECT id, product_id, rating,\n  ROUND(rating - AVG(rating) OVER (), 2) AS deviation\nFROM reviews ORDER BY deviation ASC, id LIMIT 8;',
        hints: [
          ['rating − AVG(rating) OVER () — each row versus the norm.', 'rating − AVG(rating) OVER () — har row norm ke muqable.'],
          ['SELECT id, product_id, rating, ROUND(rating - AVG(rating) OVER (), 2) AS deviation FROM reviews ORDER BY deviation ASC, id LIMIT 8;', 'SELECT id, product_id, rating, ROUND(rating - AVG(rating) OVER (), 2) AS deviation FROM reviews ORDER BY deviation ASC, id LIMIT 8;'],
          ['1-star reviews lead the board (deviation ≈ −2.4).', '1-star reviews board par aage hain (deviation ≈ −2.4).'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),

  defineModule({
    n: 42,
    title: ['ROW_NUMBER', 'ROW_NUMBER'],
    time: '25 min',
    concepts: ['row_number', 'numbering', 'partition', 'sequence', 'deduplication', 'top n per group'],
    diagram: 'window-frame',
    objectives: [
      ['Number rows sequentially within partitions', 'Partitions ke andar rows ko sequence me number karna'],
      ['Deduplicate: keep first row per group', 'Dedup karna: har group ki pehli row rakhna'],
      ['Solve "Top N per group" — the interview classic', '"Top N per group" solve karna — interview classic'],
    ],
    theory: [
      section(
        ['Numbering that sees order', 'Order dekhne wala numbering'],
        [
          [
            'ROW_NUMBER() OVER (ORDER BY price DESC) stamps 1, 2, 3… down the result — a genuine sequence, unlike ids which can be arbitrary. Add PARTITION BY and the count restarts per group: ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY price DESC) numbers 1..10 within each category.',
            'ROW_NUMBER() OVER (ORDER BY price DESC) result par 1, 2, 3… ki chhaap lagata hai — asli sequence, ids ki tarah nahi jo arbitrary ho sakte hain. PARTITION BY jodo aur ginti har group me restart hoti hai: ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY price DESC) har category me 1..10 ginta hai.',
          ],
          [
            'Because the ORDER BY inside OVER is deterministic only when the sort keys are unique, professionals append a tiebreak (…, id) — otherwise numbering between equal rows is engine whim, and results flicker between runs.',
            'Kyunki OVER ke andar ORDER BY tabhi deterministic hai jab sort keys unique hon, professionals tiebreak (…, id) jodte hain — warna barabar rows ke beech numbering engine ki marzi hoti hai aur results har run me badalti dikhti hain.',
          ],
        ],
        [],
        'window-frame'
      ),
      section(
        ['The two killer patterns', 'Do killer patterns'],
        [
          [
            'Pattern 1 — DEDUPLICATION: keep one row per group by numbering within the group and keeping row 1. Rows duplicated by a join collapse to their best representative: SELECT … FROM (SELECT …, ROW_NUMBER() OVER (PARTITION BY dup_key ORDER BY quality DESC) rn FROM …) WHERE rn = 1. This replaces brittle DISTINCT hacks.',
            'Pattern 1 — DEDUPLICATION: group ke andar number karke row 1 rakhna. Join se duplicate hui rows apne best representative par collapse hoti hain: SELECT … FROM (SELECT …, ROW_NUMBER() OVER (PARTITION BY dup_key ORDER BY quality DESC) rn FROM …) WHERE rn = 1. Yeh nadan DISTINCT hacks ki jagah le leta hai.',
          ],
          [
            'Pattern 2 — TOP N PER GROUP: number within each group, keep rn <= N. "Top 3 spenders per city" is exactly this — GROUP BY cannot express it, windows make it three lines. Interviewers ask it precisely because it separates GROUP BY thinkers from window thinkers.',
            'Pattern 2 — TOP N PER GROUP: har group me number karo, rn <= N rakho. "har city ke top 3 spenders" yahi hai — GROUP BY ise express nahi kar sakta, windows teen line me kar dete hain. Interviewers isliye poochte hain kyunki ye GROUP BY sochne walon ko window sochne walon se alag karta hai.',
          ],
        ],
        [
          ['ROW_NUMBER needs ORDER BY inside OVER', 'ROW_NUMBER ko OVER ke andar ORDER BY chahiye'],
          ['rn = 1 per group = dedup pattern', 'har group me rn = 1 = dedup pattern'],
          ['rn <= N = Top-N-per-group pattern', 'rn <= N = Top-N-per-group pattern'],
        ]
      ),
    ],
    tutorial: {
      title: ['Number one in every city', 'Har city ka number one'],
      steps: [
        step(null, [
          'Marketing wants the top spender per city — GROUP BY\'s blind spot, ROW_NUMBER\'s home ground.',
          'Marketing ko har city ka top spender chahiye — GROUP BY ka andha spot, ROW_NUMBER ka ghar.',
        ]),
        step('SELECT c.name, c.city, ROUND(SUM(p.amount), 2) AS spend\nFROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id\nGROUP BY c.id, c.name, c.city LIMIT 5;', [
          'Step 1: spend per customer (the base every city ranking needs).',
          'Step 1: har customer ka kharch (wo base jo har city ranking ko chahiye).',
        ], { table: 'customers' }),
        step('SELECT name, city, spend,\n  ROW_NUMBER() OVER (PARTITION BY city ORDER BY spend DESC) AS rn\nFROM (\n  SELECT c.name, c.city, ROUND(SUM(p.amount), 2) AS spend\n  FROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id\n  GROUP BY c.id, c.name, c.city\n) LIMIT 8;', [
          'Number the spenders within each city — 1 marks the champion.',
          'Har city ke spenders ko number karo — 1 champion hai.',
        ], { table: 'customers' }),
        step('SELECT name, city, spend FROM (\n  SELECT c.name, c.city, ROUND(SUM(p.amount), 2) AS spend,\n    ROW_NUMBER() OVER (PARTITION BY city ORDER BY SUM(p.amount) DESC, c.id) AS rn\n  FROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id\n  GROUP BY c.id, c.name, c.city\n) WHERE rn = 1 LIMIT 8;', [
          'Keep rn = 1: the top spender of every city — Top-1-per-group, solved.',
          'rn = 1 rakho: har city ka top spender — Top-1-per-group, solve ho gaya.',
        ], { table: 'customers' }),
        step('SELECT rating, COUNT(*) FROM reviews GROUP BY rating;', [
          'A quick breath — next module ranks ratings with gaps; here just admire the distribution.',
          'Ek saans — agla module ratings ko gaps ke saath rank karta hai; yahan bas distribution dekho.',
        ], { run: true, table: 'reviews' }),
      ],
    },
    syntax: {
      template: 'ROW_NUMBER() OVER (PARTITION BY group_col ORDER BY sort_col [DESC], tiebreak)\n-- dedup / top-N pattern:\nSELECT … FROM (\n  SELECT …, ROW_NUMBER() OVER (PARTITION BY k ORDER BY v DESC) AS rn FROM …\n) WHERE rn <= n;',
      parts: [
        { part: 'ROW_NUMBER()', description: ['1, 2, 3… within each partition', 'har partition me 1, 2, 3…'] },
        { part: 'ORDER BY inside', description: ['Defines the sequence — mandatory for numbering', 'Sequence define karta hai — numbering ke liye zaroori'] },
        { part: 'WHERE rn <= n', description: ['The Top-N-per-group filter (outer query)', 'Top-N-per-group filter (outer query)'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT name, price, ROW_NUMBER() OVER (ORDER BY price DESC, id) AS rn FROM products LIMIT 6;', [
        'The overall price ranking, numbered.',
        'Overall price ranking, numbered.',
      ]),
      example('easy', 'SELECT name, category_id, price,\n  ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY price DESC, id) AS rn\nFROM products LIMIT 8;', [
        'Numbering restarts inside every category.',
        'Har category ke andar numbering restart hoti hai.',
      ]),
      example('medium', 'SELECT name, category_id, price FROM (\n  SELECT name, category_id, price,\n    ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY price DESC, id) AS rn\n  FROM products\n) WHERE rn = 1;', [
        'The priciest product per category — dedup in action.',
        'Har category ka sabse mehnga product — dedup kaam par.',
      ]),
      example('hard', 'SELECT name, city, spend FROM (\n  SELECT c.name, c.city, SUM(p.amount) AS spend,\n    ROW_NUMBER() OVER (PARTITION BY c.city ORDER BY SUM(p.amount) DESC, c.id) AS rn\n  FROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id\n  GROUP BY c.id, c.name, c.city\n) WHERE rn <= 2 ORDER BY city, spend DESC LIMIT 8;', [
        'Top 2 spenders per city — the interview classic, fully solved.',
        'Har city ke top 2 spenders — interview classic, poora solve.',
      ]),
    ],
    mistakes: [
      mistake(
        ['ROW_NUMBER without ORDER BY inside OVER', 'OVER ke andar ORDER BY ke bina ROW_NUMBER'],
        ['Numbering without order is engine whim — SQLite allows it, results are meaningless. Always provide the ORDER BY.', 'Bina order ke numbering engine ki marzi hai — SQLite allow karta hai, par result bekaar hai. Hamesha ORDER BY do.']
      ),
      mistake(
        ['No tiebreak on equal sort keys', 'Barabar sort keys par tiebreak na hona'],
        ['Two equal spends share no rule for who gets 1 — add id as the final sort key for deterministic results.', 'Do barabar spends ka kaun 1 le, koi rule nahi — deterministic results ke liye id ko final sort key banao.']
      ),
      mistake(
        ['Trying to filter rn in the same query level', 'rn ko usi query level par filter karna'],
        ['Window results cannot feed WHERE at the same level (they compute after). Wrap in a subquery (or CTE) and filter outside — exactly the pattern shown here.', 'Window results usi level ke WHERE ko feed nahi kar sakte (wo baad me compute hote hain). Subquery (ya CTE) me wrap karo aur bahar filter karo — yahi pattern yahan dikhaya hai.']
      ),
    ],
    summary: [
      ['ROW_NUMBER stamps a true sequence per partition', 'ROW_NUMBER har partition par asli sequence lagata hai'],
      ['Dedup: rn = 1 per group', 'Dedup: har group me rn = 1'],
      ['Top-N per group: rn <= N in an outer filter', 'Top-N per group: bahar ke filter me rn <= N'],
      ['Always add a unique tiebreak to the window ORDER BY', 'Window ORDER BY me hamesha unique tiebreak jodo'],
    ],
    quiz: [
      mcq(
        ['Why can\'t GROUP BY answer "top spender per city"?', 'GROUP BY "har city ka top spender" kyun nahi de sakta?'],
        [
          ['It cannot sum amounts', 'Wo amounts sum nahi kar sakta'],
          ['It collapses rows, losing the identity of individuals within groups', 'Wo rows sikod deta hai, groups ke andar log ki pehchan kho jaati hai'],
          ['Cities are text columns', 'Cities text columns hain'],
          ['It can — with HAVING', 'Kar sakta hai — HAVING ke saath'],
        ],
        1,
        ['GROUP BY gives the group\'s number, not the group\'s winner. ROW_NUMBER keeps individuals and ranks them.', 'GROUP BY group ka number deta hai, group ka winner nahi. ROW_NUMBER log ko bacha kar unhe rank karta hai.']
      ),
      outputQ(
        'SELECT name, price FROM (SELECT name, price, ROW_NUMBER() OVER (ORDER BY price DESC, id) AS rn FROM products) WHERE rn = 1;',
        ['Which single row returns?', 'Kaunsi akeli row aati hai?'],
        [
          { label: 'A', result: { columns: ['name', 'price'], rows: [['Pulse Zen 14 Gen5', 48541]] } },
          { label: 'B', result: { columns: ['name', 'price'], rows: [['Alpha Lite 7', 118]] } },
          { label: 'C', result: { columns: ['name', 'price'], rows: [['Titan Edge 96', 48914], ['Pulse Max 55 Gen3', 47883]] } },
          { label: 'D', result: { error: 'Error: misuse of window function' } },
        ],
        0,
        ['rn = 1 of the price-descending sequence: the single priciest product — Pulse Zen 14 Gen5 at 48541.', 'Price-utarte sequence ka rn = 1: akela sabse mehnga product — Pulse Zen 14 Gen5, 48541.']
      ),
      buildQ(
        ['Build: priciest product per category (dedup)', 'Banao: har category ka sabse mehnga product (dedup)'],
        ['name', 'category_id', 'price', 'SELECT', 'FROM', 'ROW_NUMBER()', 'OVER', 'PARTITION BY category_id', 'ORDER BY price DESC, id', 'WHERE rn = 1', 'AS rn'],
        ['SELECT', 'name', ',', 'category_id', ',', 'price', 'FROM', '(', 'SELECT', '*', ',', 'ROW_NUMBER', '(', ')', 'OVER', '(', 'PARTITION', 'BY', 'category_id', 'ORDER', 'BY', 'price', 'DESC', ',', 'id', ')', 'AS', 'rn', 'FROM', 'products', ')', 'WHERE', 'rn', '=', '1'],
        ['Number per category, filter rn = 1 outside.', 'Har category me number karo, bahar rn = 1 filter.']
      ),
      blanksQ(
        'SELECT … FROM (SELECT …, ROW_NUMBER() OVER (PARTITION ___ city ORDER BY spend ___) AS rn …) WHERE ___ = 1;',
        [
          { options: ['BY', 'ON', 'AS'], correct: 'BY' },
          { options: ['DESC', 'ASC'], correct: 'DESC' },
          { options: ['rn', 'id', 'city'], correct: 'rn' },
        ],
        ['The three blanks of the Top-1 pattern.', 'Top-1 pattern ke teen blanks.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Price ladder: products numbered by price descending (overall). Columns: name, price, rn. LIMIT 6.',
          'Price ladder: products price se utarte hue numbered (overall). Columns: name, price, rn. LIMIT 6.',
        ],
        sol: 'SELECT name, price, ROW_NUMBER() OVER (ORDER BY price DESC, id) AS rn FROM products LIMIT 6;',
        hints: [
          ['OVER with ORDER BY price DESC — plus id for stability.', 'OVER ke saath ORDER BY price DESC — stability ke liye id bhi.'],
          ['SELECT name, price, ROW_NUMBER() OVER (ORDER BY price DESC, id) AS rn FROM products LIMIT 6;', 'SELECT name, price, ROW_NUMBER() OVER (ORDER BY price DESC, id) AS rn FROM products LIMIT 6;'],
          ['Pulse Zen 14 Gen5 is rn 1.', 'Pulse Zen 14 Gen5 rn 1 hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'easy',
        desc: [
          'Category ladders: products numbered within their category (price descending, id tiebreak). Columns: name, category_id, price, rn. First 10 rows by category_id, rn.',
          'Category ladders: products apni category ke andar numbered (price utarti, id tiebreak). Columns: name, category_id, price, rn. Category_id, rn se pehli 10 rows.',
        ],
        sol: 'SELECT name, category_id, price,\n  ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY price DESC, id) AS rn\nFROM products ORDER BY category_id, rn LIMIT 10;',
        hints: [
          ['PARTITION BY category_id restarts the sequence.', 'PARTITION BY category_id sequence restart karta hai.'],
          ['SELECT name, category_id, price, ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY price DESC, id) AS rn FROM products ORDER BY category_id, rn LIMIT 10;', 'SELECT name, category_id, price, ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY price DESC, id) AS rn FROM products ORDER BY category_id, rn LIMIT 10;'],
          ['Each category shows 1..10 internally.', 'Har category andar se 1..10 dikhati hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'medium',
        desc: [
          'The premium shelf: priciest product PER category (dedup pattern). Columns: name, category_id, price. Sorted by category_id.',
          'Premium shelf: HAR category ka sabse mehnga product (dedup pattern). Columns: name, category_id, price. Category_id se sorted.',
        ],
        sol: 'SELECT name, category_id, price FROM (\n  SELECT name, category_id, price,\n    ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY price DESC, id) AS rn\n  FROM products\n) WHERE rn = 1 ORDER BY category_id;',
        hints: [
          ['Inner: number per category. Outer: keep rn = 1.', 'Andar: har category me number. Bahar: rn = 1 rakho.'],
          ['SELECT name, category_id, price FROM (SELECT name, category_id, price, ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY price DESC, id) AS rn FROM products) WHERE rn = 1 ORDER BY category_id;', 'SELECT name, category_id, price FROM (SELECT name, category_id, price, ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY price DESC, id) AS rn FROM products) WHERE rn = 1 ORDER BY category_id;'],
          ['Twenty rows — one champion per category.', 'Bees rows — har category ka ek champion.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'City champions: the TOP spender per city (customer spend through the full chain, ROW_NUMBER dedup). Columns: name, city, spend (rounded). Sorted by city.',
          'City champions: HAR city ka TOP spender (poori chain se customer kharch, ROW_NUMBER dedup). Columns: name, city, spend (rounded). City se sorted.',
        ],
        sol: 'SELECT name, city, spend FROM (\n  SELECT c.name, c.city, ROUND(SUM(p.amount), 2) AS spend,\n    ROW_NUMBER() OVER (PARTITION BY c.city ORDER BY SUM(p.amount) DESC, c.id) AS rn\n  FROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id\n  GROUP BY c.id, c.name, c.city\n) WHERE rn = 1 ORDER BY city;',
        hints: [
          ['Base: per-customer spend (GROUP BY c.id). Window: number per city. Filter: rn = 1.', 'Base: per-customer kharch (GROUP BY c.id). Window: har city me number. Filter: rn = 1.'],
          ['ROW_NUMBER() OVER (PARTITION BY c.city ORDER BY SUM(p.amount) DESC, c.id) — inside the grouped subquery.', 'ROW_NUMBER() OVER (PARTITION BY c.city ORDER BY SUM(p.amount) DESC, c.id) — grouped subquery ke andar.'],
          ['Fifteen rows — one champion per city.', 'Pandrah rows — har city ka ek champion.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'The elite three: TOP 3 customers by total spend — but exactly one query using ROW_NUMBER over the grouped chain, aliased rn, keeping rn <= 3. Columns: name, spend (rounded). Sorted by rn.',
          'Elite three: total kharch se TOP 3 customers — par bilkul ek query me grouped chain par ROW_NUMBER, aliased rn, rn <= 3 rakhte hue. Columns: name, spend (rounded). rn se sorted.',
        ],
        sol: 'SELECT name, spend FROM (\n  SELECT c.name, ROUND(SUM(p.amount), 2) AS spend,\n    ROW_NUMBER() OVER (ORDER BY SUM(p.amount) DESC, c.id) AS rn\n  FROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id\n  GROUP BY c.id, c.name\n) WHERE rn <= 3 ORDER BY rn;',
        hints: [
          ['No PARTITION — the whole table is one partition for a global top 3.', 'PARTITION nahi — global top 3 ke liye poori table ek partition hai.'],
          ['SELECT name, spend FROM (…, ROW_NUMBER() OVER (ORDER BY SUM(p.amount) DESC, c.id) AS rn …) WHERE rn <= 3 ORDER BY rn;', 'SELECT name, spend FROM (…, ROW_NUMBER() OVER (ORDER BY SUM(p.amount) DESC, c.id) AS rn …) WHERE rn <= 3 ORDER BY rn;'],
          ['Isha Verma leads the podium.', 'Isha Verma podium par sabse aage hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),

  defineModule({
    n: 43,
    title: ['RANK & DENSE_RANK', 'RANK & DENSE_RANK'],
    time: '25 min',
    concepts: ['rank', 'dense_rank', 'gaps', 'competition ranking', 'ties', 'leaderboard'],
    diagram: 'window-frame',
    objectives: [
      ['Rank with gaps (RANK) and without (DENSE_RANK)', 'Gaps ke saath (RANK) aur bina (DENSE_RANK) rank karna'],
      ['Choose the right ranking for ties', 'Ties ke liye sahi ranking chunna'],
      ['Build competition-style leaderboards', 'Competition-style leaderboards banana'],
    ],
    theory: [
      section(
        ['Three numbering philosophies', 'Numbering ki teen soch'],
        [
          [
            'ROW_NUMBER never repeats: ties get arbitrary distinct numbers. RANK shares position for ties but SKIPS ahead after: values 100, 100, 98 produce ranks 1, 1, 3 (two champions, next is third — the sports convention). DENSE_RANK also shares ties but never skips: 1, 1, 2 — the "podium places" convention.',
            'ROW_NUMBER kabhi repeat nahi karta: ties ko arbitrary alag numbers milte hain. RANK ties me position share karta hai par aage SKIP karta hai: values 100, 100, 98 ranks 1, 1, 3 deti hain (do champions, agla teesra — sports convention). DENSE_RANK bhi ties share karta hai par kabhi skip nahi karta: 1, 1, 2 — "podium places" convention.',
          ],
          [
            'Choosing between them is business logic, not style: a leaderboard where ten people share 1st should show the next person as 11th (RANK — how many are ahead) or 2nd (DENSE_RANK — which podium step). Interviewers probe exactly this distinction.',
            'Inme chunna business logic hai, style nahi: leaderboard jahan das log 1st share karte hain wahan agla insaan 11th dikhna chahiye (RANK — kitne aage hain) ya 2nd (DENSE_RANK — kaunsa podium step). Interviewers yahi farak probe karte hain.',
          ],
        ],
        [],
        'window-frame'
      ),
      section(
        ['Ranking real data', 'Asli data ko rank karna'],
        [
          [
            'Our reviews carry ratings 1-5 with ties everywhere. Ranking products by average rating with DENSE_RANK yields clean "tiers" (all 5.0-avg products on step 1); RANK would jump dramatically after the crowd. Same choice appears for sales leaderboards: three tied at 400 units — RANK tells the next seller "five people beat you", DENSE_RANK says "you are second-tier".',
            'Hamari reviews me ratings 1-5 hain, har jagah ties. Average rating se products ko DENSE_RANK karna saaf "tiers" deta hai (saare 5.0-avg products step 1 par); RANK bheed ke baad zor se koodta. Same choice sales leaderboard par: 400 units par teen tied — RANK agle seller ko batata hai "paanch log aage hain", DENSE_RANK bolta hai "tum doosre tier ke ho".',
          ],
        ],
        [
          ['RANK: ties share, then gap (1,1,3)', 'RANK: ties share, phir gap (1,1,3)'],
          ['DENSE_RANK: ties share, no gap (1,1,2)', 'DENSE_RANK: ties share, no gap (1,1,2)'],
          ['ROW_NUMBER: no sharing at all (1,2,3)', 'ROW_NUMBER: koi sharing nahi (1,2,3)'],
        ]
      ),
    ],
    tutorial: {
      title: ['The leaderboard problem', 'Leaderboard problem'],
      steps: [
        step(null, [
          'Rank products by total quantity sold — with ties — and watch RANK vs DENSE_RANK diverge.',
          'Products ko total quantity sold se rank karo — ties ke saath — aur RANK vs DENSE_RANK ka divergence dekho.',
        ]),
        step('SELECT pr.name, SUM(oi.quantity) AS units\nFROM order_items oi JOIN products pr ON pr.id = oi.product_id\nGROUP BY pr.id, pr.name ORDER BY units DESC LIMIT 8;', [
          'The raw leaderboard — note the ties in units.',
          'Raw leaderboard — units me ties dekho.',
        ], { table: 'order_items' }),
        step('SELECT name, units, RANK() OVER (ORDER BY units DESC) AS rnk\nFROM (\n  SELECT pr.name, SUM(oi.quantity) AS units\n  FROM order_items oi JOIN products pr ON pr.id = oi.product_id GROUP BY pr.id, pr.name\n) ORDER BY rnk, name LIMIT 8;', [
          'RANK: ties share a position; the next rank jumps past all of them.',
          'RANK: ties position share karte hain; agla rank unke paar kood jaata hai.',
        ], { table: 'order_items' }),
        step('SELECT name, units, DENSE_RANK() OVER (ORDER BY units DESC) AS drnk\nFROM (\n  SELECT pr.name, SUM(oi.quantity) AS units\n  FROM order_items oi JOIN products pr ON pr.id = oi.product_id GROUP BY pr.id, pr.name\n) ORDER BY drnk, name LIMIT 8;', [
          'DENSE_RANK: ties share, and the sequence stays tight — tiers, not gaps.',
          'DENSE_RANK: ties share, sequence tight rehta hai — tiers, gaps nahi.',
        ], { table: 'order_items' }),
        step('SELECT rating, COUNT(*) AS reviews,\n  RANK() OVER (ORDER BY COUNT(*) DESC) AS freq_rank\nFROM reviews GROUP BY rating ORDER BY freq_rank;', [
          'Rating frequency ranked: 5-star dominates (207 reviews), then 4 (108)…',
          'Rating frequency rank: 5-star haavi hai (207 reviews), phir 4 (108)…',
        ], { run: true, table: 'reviews' }),
      ],
    },
    syntax: {
      template: 'RANK() OVER (ORDER BY metric DESC)\nDENSE_RANK() OVER (ORDER BY metric DESC)\n-- both usable with PARTITION BY for per-group boards',
      parts: [
        { part: 'RANK()', description: ['Ties share; gaps follow (1,1,3)', 'Ties share; phir gap (1,1,3)'] },
        { part: 'DENSE_RANK()', description: ['Ties share; no gaps (1,1,2)', 'Ties share; no gap (1,1,2)'] },
        { part: 'PARTITION BY', description: ['Restart the board per group', 'Board har group me restart'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT rating, RANK() OVER (ORDER BY rating DESC) AS rnk FROM reviews LIMIT 6;', [
        'Row-level ranking by rating (ties visible immediately).',
        'Rating se row-level ranking (turant ties dikhte hain).',
      ]),
      example('easy', 'SELECT city, COUNT(*) AS customers,\n  RANK() OVER (ORDER BY COUNT(*) DESC) AS rnk\nFROM customers GROUP BY city ORDER BY rnk, city LIMIT 6;', [
        'City sizes ranked with ties (Kochi and Kolkata share).',
        'City sizes ties ke saath ranked (Kochi aur Kolkata share karte hain).',
      ]),
      example('medium', 'SELECT rating, COUNT(*) AS n,\n  RANK() OVER (ORDER BY COUNT(*) DESC) AS rnk,\n  DENSE_RANK() OVER (ORDER BY COUNT(*) DESC) AS dense\nFROM reviews GROUP BY rating ORDER BY rnk;', [
        'Both rankings side by side — the comparison that makes the difference stick.',
        'Dono rankings saath-saath — wahi comparison jo farak ko pakadva deta hai.',
      ]),
      example('hard', 'SELECT name, units, rnk FROM (\n  SELECT pr.name, SUM(oi.quantity) AS units,\n    RANK() OVER (ORDER BY SUM(oi.quantity) DESC) AS rnk\n  FROM order_items oi JOIN products pr ON pr.id = oi.product_id GROUP BY pr.id, pr.name\n) WHERE rnk <= 5 ORDER BY rnk, name;', [
        'The top-5 units leaderboard with ties intact (RANK semantics).',
        'Top-5 units leaderboard ties ke saath (RANK semantics).',
      ]),
    ],
    mistakes: [
      mistake(
        ['Reaching for ROW_NUMBER on leaderboards', 'Leaderboards par ROW_NUMBER pakadna'],
        ['Two sellers tied at the top would get 1 and 2 — an arbitrary lie. RANK/DENSE_RANK encode the tie honestly.', 'Do sellers top par tied hon to unhe 1 aur 2 milta — ek arbitrary jhooth. RANK/DENSE_RANK tie ko imandaari se likhte hain.']
      ),
      mistake(
        ['Misreading the gap: 1,1,3 as a bug', 'Gap ko galat padhna: 1,1,3 ko bug samajhna'],
        ['That IS RANK\'s contract: position equals "how many finished ahead of me plus one". No bug — a convention.', 'Wahi RANK ka contract hai: position matlab "mere se pehle khatam hue log + ek". Bug nahi — convention hai.']
      ),
      mistake(
        ['Ranking without PARTITION when a per-group board was wanted', 'Per-group board chahiye tha par bina PARTITION rank karna'],
        ['A global rank in a per-city leaderboard mixes cities. Add PARTITION BY city to restart the board per city.', 'Per-city leaderboard me global rank cities ko mila deta hai. Board har city me restart karne ke liye PARTITION BY city jodo.']
      ),
    ],
    summary: [
      ['RANK shares ties, then skips (1,1,3) — sports convention', 'RANK ties share karta hai, phir skip (1,1,3) — sports convention'],
      ['DENSE_RANK shares ties, no skip (1,1,2) — tier convention', 'DENSE_RANK ties share, no skip (1,1,2) — tier convention'],
      ['ROW_NUMBER never shares — use it for dedup, not boards', 'ROW_NUMBER kabhi share nahi — dedup ke liye, boards ke liye nahi'],
      ['PARTITION BY restarts any ranking per group', 'PARTITION BY har ranking ko group me restart karta hai'],
    ],
    quiz: [
      mcq(
        ['Scores 100, 100, 98. What does DENSE_RANK give?', 'Scores 100, 100, 98. DENSE_RANK kya deta hai?'],
        [
          ['1, 2, 3', '1, 2, 3'],
          ['1, 1, 2', '1, 1, 2'],
          ['1, 1, 3', '1, 1, 3'],
          ['1, 2, 2', '1, 2, 2'],
        ],
        1,
        ['Dense ranking never skips: two share first, the next distinct value takes step 2.', 'Dense ranking kabhi skip nahi karta: do log pehla share, agli distinct value step 2 leti hai.']
      ),
      outputQ(
        'SELECT COUNT(*) FROM (SELECT product_id, DENSE_RANK() OVER (ORDER BY product_id) dr FROM reviews);',
        ['How many rows return (DENSE_RANK preserves rows)?', 'Kitni rows aati hain (DENSE_RANK rows bachata hai)?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[500]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[200]] } },
          { label: 'C', result: { columns: ['COUNT(*)'], rows: [[5]] } },
          { label: 'D', result: { error: 'Error: near "OVER": syntax error' } },
        ],
        0,
        ['All ranking functions preserve row count: 500 reviews in, 500 ranked rows out.', 'Saare ranking functions row count bachate hain: andar 500 reviews, bahar 500 ranked rows.']
      ),
      buildQ(
        ['Build: cities ranked by customer count (ties shared)', 'Banao: customer count se cities ranked (ties shared)'],
        ['city', 'COUNT(*)', 'RANK()', 'OVER', 'ORDER BY COUNT(*) DESC', 'SELECT', 'FROM', 'customers', 'GROUP BY'],
        ['SELECT', 'city', ',', 'COUNT', '(', '*', ')', ',', 'RANK', '(', ')', 'OVER', '(', 'ORDER', 'BY', 'COUNT', '(', '*', ')', 'DESC', ')', 'FROM', 'customers', 'GROUP', 'BY', 'city'],
        ['Group, then rank the groups.', 'Group karo, phir groups ko rank karo.']
      ),
      blanksQ(
        'SELECT name, ___() OVER (___ BY units DESC) AS rnk FROM (…);',
        [
          { options: ['RANK', 'COUNT', 'AVG'], correct: 'RANK' },
          { options: ['ORDER', 'PARTITION', 'GROUP'], correct: 'ORDER' },
        ],
        ['Rank functions need ORDER BY inside the window.', 'Rank functions ko window ke andar ORDER BY chahiye.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Rating ladder: reviews ranked by rating descending (row level, ties shared via RANK). Columns: id, rating, rnk. LIMIT 6 (by id for stability… sort by id).',
          'Rating ladder: reviews rating se utarte hue ranked (row level, RANK se ties shared). Columns: id, rating, rnk. LIMIT 6 (stability ke liye id se sort).',
        ],
        sol: 'SELECT id, rating, RANK() OVER (ORDER BY rating DESC) AS rnk FROM reviews ORDER BY id LIMIT 6;',
        hints: [
          ['RANK over the raw rating column.', 'Raw rating column par RANK.'],
          ['SELECT id, rating, RANK() OVER (ORDER BY rating DESC) AS rnk FROM reviews ORDER BY id LIMIT 6;', 'SELECT id, rating, RANK() OVER (ORDER BY rating DESC) AS rnk FROM reviews ORDER BY id LIMIT 6;'],
          ['First reviews show ranks like 1, 3, 26 — gaps from ties.', 'Pehli reviews ranks 1, 3, 26 jaise dikhati hain — ties ke gaps.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'easy',
        desc: [
          'City size board: cities ranked by customer count descending (RANK, ties shared). Columns: city, customers, rnk. Sorted by rnk, then city.',
          'City size board: cities customer count se utarte hue ranked (RANK, ties shared). Columns: city, customers, rnk. rnk phir city se sorted.',
        ],
        sol: 'SELECT city, COUNT(*) AS customers,\n  RANK() OVER (ORDER BY COUNT(*) DESC) AS rnk\nFROM customers GROUP BY city ORDER BY rnk, city;',
        hints: [
          ['GROUP BY city first, rank the grouped counts.', 'Pehle city se GROUP BY, phir grouped counts ko rank karo.'],
          ['SELECT city, COUNT(*) AS customers, RANK() OVER (ORDER BY COUNT(*) DESC) AS rnk FROM customers GROUP BY city ORDER BY rnk, city;', 'SELECT city, COUNT(*) AS customers, RANK() OVER (ORDER BY COUNT(*) DESC) AS rnk FROM customers GROUP BY city ORDER BY rnk, city;'],
          ['Jaipur (13) is rank 1; Kochi and Kolkata (8) share rank 2.', 'Jaipur (13) rank 1; Kochi aur Kolkata (8) rank 2 share karte hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'medium',
        desc: [
          'The comparison board: rating frequencies with BOTH ranks — rnk (RANK) and dense (DENSE_RANK), side by side. Columns: rating, n, rnk, dense. Sorted by rnk.',
          'Comparison board: rating frequencies DONO ranks ke saath — rnk (RANK) aur dense (DENSE_RANK), saath-saath. Columns: rating, n, rnk, dense. rnk se sorted.',
        ],
        sol: 'SELECT rating, COUNT(*) AS n,\n  RANK() OVER (ORDER BY COUNT(*) DESC) AS rnk,\n  DENSE_RANK() OVER (ORDER BY COUNT(*) DESC) AS dense\nFROM reviews GROUP BY rating ORDER BY rnk;',
        hints: [
          ['Two window functions in one SELECT — perfectly legal.', 'Ek SELECT me do window functions — bilkul legal.'],
          ['SELECT rating, COUNT(*) AS n, RANK() OVER (ORDER BY COUNT(*) DESC) AS rnk, DENSE_RANK() OVER (ORDER BY COUNT(*) DESC) AS dense FROM reviews GROUP BY rating ORDER BY rnk;', 'SELECT rating, COUNT(*) AS n, RANK() OVER (ORDER BY COUNT(*) DESC) AS rnk, DENSE_RANK() OVER (ORDER BY COUNT(*) DESC) AS dense FROM reviews GROUP BY rating ORDER BY rnk;'],
          ['5 rows: 207, 108, 92, 51, 42 — no ties here, both ranks equal.', '5 rows: 207, 108, 92, 51, 42 — yahan koi tie nahi, dono ranks barabar.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'The units podium: top 5 RANKS (ties included, so possibly more than 5 rows) on total units sold per product. Columns: name, units, rnk. Sorted by rnk, name.',
          'Units podium: total units sold per product ke top 5 RANKS (ties shaamil, isliye 5 se zyada rows ho sakti hain). Columns: name, units, rnk. rnk, name se sorted.',
        ],
        sol: 'SELECT name, units, rnk FROM (\n  SELECT pr.name, SUM(oi.quantity) AS units,\n    RANK() OVER (ORDER BY SUM(oi.quantity) DESC) AS rnk\n  FROM order_items oi JOIN products pr ON pr.id = oi.product_id GROUP BY pr.id, pr.name\n) WHERE rnk <= 5 ORDER BY rnk, name;',
        hints: [
          ['Rank the grouped sums, filter rn… rnk <= 5 outside.', 'Grouped sums ko rank karo, bahar rnk <= 5 filter.'],
          ['SELECT name, units, rnk FROM (SELECT pr.name, SUM(oi.quantity) AS units, RANK() OVER (ORDER BY SUM(oi.quantity) DESC) AS rnk FROM … GROUP BY pr.id, pr.name) WHERE rnk <= 5 ORDER BY rnk, name;', 'SELECT name, units, rnk FROM (SELECT pr.name, SUM(oi.quantity) AS units, RANK() OVER (ORDER BY SUM(oi.quantity) DESC) AS rnk FROM … GROUP BY pr.id, pr.name) WHERE rnk <= 5 ORDER BY rnk, name;'],
          ['Ties at the same unit count share ranks — expect more than five rows.', 'Same unit count par ties rank share karti hain — paanch se zyada rows expect karo.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'Tier census per city: customers ranked WITHIN their city by spend (DENSE_RANK per partition) — show each city\'s tier-1 members only (drnk = 1). Columns: name, city, spend (rounded). Sorted by city, name. (Per-group dense ranking + filter.)',
          'Tier census per city: customers apni city ke andar kharch se ranked (per-partition DENSE_RANK) — sirf har city ke tier-1 members dikhao (drnk = 1). Columns: name, city, spend (rounded). City, name se sorted. (Per-group dense ranking + filter.)',
        ],
        sol: 'SELECT name, city, spend FROM (\n  SELECT c.name, c.city, ROUND(SUM(p.amount), 2) AS spend,\n    DENSE_RANK() OVER (PARTITION BY c.city ORDER BY SUM(p.amount) DESC) AS drnk\n  FROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id\n  GROUP BY c.id, c.name, c.city\n) WHERE drnk = 1 ORDER BY city, name;',
        hints: [
          ['Partition the dense rank by city; keep step 1 per city.', 'Dense rank ko city se partition karo; har city ka step 1 rakho.'],
          ['DENSE_RANK() OVER (PARTITION BY c.city ORDER BY SUM(p.amount) DESC) — ties share tier 1, so a city can crown several champions.', 'DENSE_RANK() OVER (PARTITION BY c.city ORDER BY SUM(p.amount) DESC) — ties tier 1 share karti hain, isliye ek city ke kai champion ho sakte hain.'],
          ['Cities with tied top spenders show multiple rows.', 'Jin cities ke top spenders tied hain wahan kai rows dikhengi.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),

  defineModule({
    n: 44,
    title: ['LAG & LEAD', 'LAG & LEAD'],
    time: '25 min',
    concepts: ['lag', 'lead', 'previous row', 'next row', 'time series', 'month over month', 'delta', 'default'],
    diagram: 'window-frame',
    objectives: [
      ['Read the previous and next row with LAG/LEAD', 'LAG/LEAD se pichli aur agli row padhna'],
      ['Compute period-over-period changes', 'Period-over-period badlav compute karna'],
      ['Handle first-row NULLs with the default argument', 'Default argument se pehli-row NULLs sambhalna'],
    ],
    theory: [
      section(
        ['The time-travelling functions', 'Time-travel karne wale functions'],
        [
          [
            'LAG(col) peeks at the PREVIOUS row of the ordered window; LEAD(col) peeks at the NEXT. They turn sequences into comparisons: this month\'s revenue beside last month\'s, this review beside the previous one. The window\'s ORDER BY defines "previous" — time, id, any sequence.',
            'LAG(col) ordered window ki PICHLI row dekh-ta hai; LEAD(col) agli row. Ye sequences ko comparisons bana dete hain: is mahine ki revenue pichle mahine ke saath, ye review pichle review ke saath. Window ka ORDER BY "pichla" define karta hai — time, id, koi bhi sequence.',
          ],
          [
            'LAG takes a second argument — the default for the first row (where no previous exists): LAG(x, 1, 0) yields 0 instead of NULL. That single feature makes delta columns safe to compute end to end. LEAD mirrors everything into the future.',
            'LAG doosra argument leta hai — pehli row ke liye default (jahan pichli row hoti hi nahi): LAG(x, 1, 0) NULL ki jagah 0 deta hai. Yahi ek feature delta columns ko shuru se ant tak safe compute karne deta hai. LEAD sab kuch future me mirror karta hai.',
          ],
        ],
        [],
        'window-frame'
      ),
      section(
        ['Month-over-month, the flagship use', 'Month-over-month, flagship use'],
        [
          [
            'Monthly revenue is a time series; growth = (this month − last month) / last month. With GROUP BY building the months, LAG(revenue) OVER (ORDER BY month) puts last month on every row, and the growth formula becomes one expression. This exact query pattern runs in every finance department on earth.',
            'Monthly revenue ek time series hai; growth = (is mahina − pichla mahina) / pichla mahina. GROUP BY mahine banata hai, LAG(revenue) OVER (ORDER BY month) har row par pichla mahina rakhta hai, aur growth formula ek expression ban jaata hai. Yahi query pattern duniya ke har finance department me chalta hai.',
          ],
          [
            'Watch the first row: no previous month exists, so LAG gives NULL — the growth expression becomes NULL too. Either filter that row, or supply LAG(revenue, 1, NULL) and let the report start at month two. Deciding this consciously is the mark of a careful analyst.',
            'Pehli row dekho: pichla mahina hota hi nahi, to LAG NULL deta hai — growth expression bhi NULL ho jaata hai. Ya wo row filter karo, ya LAG(revenue, 1, NULL) do aur report mahine do se shuru hone do. Yeh soch-smajh kar decide karna careful analyst ki nishani hai.',
          ],
        ],
        [
          ['LAG = previous row; LEAD = next row (window ORDER decides)', 'LAG = pichli row; LEAD = agli row (window ORDER decide karta hai)'],
          ['Second argument = offset; third = default for missing', 'Doosra argument = offset; teesra = missing ke liye default'],
          ['MoM growth: (x − LAG(x)) / LAG(x) — the flagship pattern', 'MoM growth: (x − LAG(x)) / LAG(x) — flagship pattern'],
        ]
      ),
    ],
    tutorial: {
      title: ['Growth analysis', 'Growth analysis'],
      steps: [
        step(null, [
          'The board asks: "how did revenue move month by month?" LAG turns history into arithmetic.',
          'Board poochta hai: "revenue mahine-dar-mahine kaise badli?" LAG history ko arithmetic bana deta hai.',
        ]),
        step("SELECT substr(o.order_date, 1, 7) AS month, ROUND(SUM(p.amount), 2) AS revenue\nFROM orders o JOIN payments p ON p.order_id = o.id\nGROUP BY substr(o.order_date, 1, 7) ORDER BY month LIMIT 6;", [
          'The monthly series — the base every growth analysis needs.',
          'Monthly series — wo base jo har growth analysis ko chahiye.',
        ], { table: 'orders' }),
        step("SELECT month, revenue, ROUND(LAG(revenue) OVER (ORDER BY month), 2) AS prev_month\nFROM (\n  SELECT substr(o.order_date, 1, 7) AS month, ROUND(SUM(p.amount), 2) AS revenue\n  FROM orders o JOIN payments p ON p.order_id = o.id GROUP BY substr(o.order_date, 1, 7)\n) ORDER BY month LIMIT 6;", [
          'LAG slides last month beside every month — January gets NULL.',
          'LAG har mahine ke saath pichla mahina rakhta hai — January ko NULL milta hai.',
        ], { table: 'orders' }),
        step("SELECT month, revenue, ROUND(revenue - LAG(revenue) OVER (ORDER BY month), 2) AS change\nFROM (\n  SELECT substr(o.order_date, 1, 7) AS month, SUM(p.amount) AS revenue\n  FROM orders o JOIN payments p ON p.order_id = o.id GROUP BY substr(o.order_date, 1, 7)\n) ORDER BY month LIMIT 6;", [
          'The delta column — money moved, per month.',
          'Delta column — har mahine kitna paisa hila.',
        ], { table: 'orders' }),
        step("SELECT month, revenue,\n  ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month)) / LAG(revenue) OVER (ORDER BY month), 1) AS growth_pct\nFROM (\n  SELECT substr(o.order_date, 1, 7) AS month, SUM(p.amount) AS revenue\n  FROM orders o JOIN payments p ON p.order_id = o.id GROUP BY substr(o.order_date, 1, 7)\n) WHERE LAG(revenue) OVER (ORDER BY month) IS NOT NULL ORDER BY month LIMIT 6;", [
          'Percentage growth, first month gracefully filtered — the finished KPI.',
          'Percent growth, pehla mahina saaf-saaf filter — complete KPI. (Hmm — window functions cannot appear in WHERE; the standard route is a subquery/CTE filter, coming in the next module\'s patterns.)',
        ], { run: true, table: 'orders' }),
      ],
    },
    syntax: {
      template: 'LAG(col [, offset [, default]]) OVER (ORDER BY sequence)\nLEAD(col [, offset [, default]]) OVER (ORDER BY sequence)',
      parts: [
        { part: 'LAG(col)', description: ['Value from the previous row', 'Pichli row ki value'] },
        { part: 'offset', description: ['How far back/forward (default 1)', 'Kitna peeche/aage (default 1)'] },
        { part: 'default', description: ['Fallback for edge rows (default NULL)', 'Edge rows ke liye fallback (default NULL)'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT id, rating, LAG(rating) OVER (ORDER BY id) AS prev_rating FROM reviews LIMIT 6;', [
        'Each review beside the previous one\'s rating.',
        'Har review pichle review ke rating ke saath.',
      ]),
      example('easy', "SELECT month, revenue, ROUND(LAG(revenue) OVER (ORDER BY month), 2) AS prev\nFROM (SELECT substr(order_date,1,7) AS month, SUM(amount) AS revenue FROM orders o JOIN payments p ON p.order_id = o.id GROUP BY substr(order_date,1,7))\nORDER BY month LIMIT 6;", [
        'The monthly series with last month beside it.',
        'Monthly series, pichla mahina saath me.',
      ]),
      example('medium', 'SELECT id, rating, LAG(rating, 1, 0) OVER (ORDER BY id) AS prev\nFROM reviews LIMIT 5;', [
        'Default 0 replaces the first row\'s NULL — deltas become safe.',
        'Default 0 pehli row ki NULL ki jagah — deltas safe ban jaate hain.',
      ]),
      example('hard', "SELECT month, ROUND(revenue, 2) AS revenue,\n  ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month)) / LAG(revenue) OVER (ORDER BY month), 1) AS growth_pct\nFROM (SELECT substr(order_date,1,7) AS month, SUM(amount) AS revenue FROM orders o JOIN payments p ON p.order_id = o.id GROUP BY substr(order_date,1,7))\nORDER BY month LIMIT 6;", [
        'Month-over-month growth percent — the finance KPI, fully assembled.',
        'Month-over-month growth percent — finance KPI, poora assembled.',
      ]),
    ],
    mistakes: [
      mistake(
        ['LAG without ORDER BY inside the window', 'Window ke andar ORDER BY ke bina LAG'],
        ['"Previous" is meaningless without a sequence — always ORDER BY time or id inside OVER.', 'Sequence ke bina "pichla" bekaar hai — OVER ke andar hamesha time ya id se ORDER BY karo.']
      ),
      mistake(
        ['Assuming LAG follows output order (outer ORDER BY)', 'LAG ko output order (outer ORDER BY) follow karta maanna'],
        ['LAG reads the window\'s internal ORDER BY, not the final display sort. A different outer ORDER does not change what "previous" was.', 'LAG window ke internal ORDER BY ko padhta hai, final display sort nahi. Alag outer ORDER "pichla" ko badalta nahi.']
      ),
      mistake(
        ['Forgetting the first row\'s NULL and reporting NULL growth', 'Pehli row ka NULL bhool kar NULL growth report karna'],
        ['Decide: filter the first row, or pass a default (LAG(x, 1, 0)). A report with a NULL first cell looks broken to executives.', 'Decide karo: pehli row filter karo, ya default do (LAG(x, 1, 0)). Pehla cell NULL wali report executives ko tooti dikhti hai.']
      ),
    ],
    summary: [
      ['LAG/LEAD fetch neighbouring rows from an ordered window', 'LAG/LEAD ordered window se padosi rows laate hain'],
      ['Perfect for deltas and period-over-period comparisons', 'Deltas aur period-over-period comparison ke liye perfect'],
      ['The default argument tames edge-row NULLs', 'Default argument edge-row NULLs ko kaam par lagata hai'],
      ['Window ORDER — not display order — defines "previous"', 'Window ORDER — display order nahi — "pichla" define karta hai'],
    ],
    quiz: [
      mcq(
        ['What does LAG(amount, 1, 0) return on the FIRST row of an ordered window?', 'Ordered window ki PEHLI row par LAG(amount, 1, 0) kya deta hai?'],
        [
          ['NULL', 'NULL'],
          ['0 — the supplied default', '0 — diya gaya default'],
          ['The last row\'s value', 'Aakhri row ki value'],
          ['An error', 'Error'],
        ],
        1,
        ['The third argument is the fallback when the offset reaches beyond the partition — here, 0.', 'Teesra argument fallback hai jab offset partition se bahar chala jaaye — yahan 0.']
      ),
      outputQ(
        "SELECT month, revenue FROM (\n  SELECT substr(order_date,1,7) AS month, ROUND(SUM(amount),2) AS revenue FROM orders o JOIN payments p ON p.order_id=o.id GROUP BY substr(order_date,1,7)\n) ORDER BY month LIMIT 2;",
        ['The first two monthly revenues (for your LAG math):', 'Pehle do monthly revenues (aapke LAG maths ke liye):'],
        [
          { label: 'A', result: { columns: ['month', 'revenue'], rows: [['2023-01', 4541975.4], ['2023-02', 4049229.7]] } },
          { label: 'B', result: { columns: ['month', 'revenue'], rows: [['2023-01', 2591595.6]] } },
          { label: 'C', result: { error: 'Error: no such column: month' } },
          { label: 'D', result: { columns: ['month', 'revenue'], rows: [['2023-02', 3745356.5], ['2023-03', 2626968.2]] } },
        ],
        0,
        ['January ≈ 4.54M and February ≈ 4.05M — February dipped by roughly 11%.', 'January ≈ 4.54M aur February ≈ 4.05M — February lagbhag 11% giri.']
      ),
      buildQ(
        ['Build: each review with the previous rating', 'Banao: har review pichle rating ke saath'],
        ['id', 'rating', 'LAG', 'rating', 'OVER', 'ORDER BY id', 'SELECT', 'FROM', 'reviews', 'prev_rating', 'AS'],
        ['SELECT', 'id', ',', 'rating', ',', 'LAG', '(', 'rating', ')', 'OVER', '(', 'ORDER', 'BY', 'id', ')', 'AS', 'prev_rating', 'FROM', 'reviews'],
        ['LAG(rating) over the id sequence.', 'id sequence par LAG(rating).']
      ),
      blanksQ(
        'SELECT revenue - ___(revenue) ___ (ORDER BY month) AS change FROM monthly;',
        [
          { options: ['LAG', 'LEAD', 'RANK'], correct: 'LAG' },
          { options: ['OVER', 'ON', 'BY'], correct: 'OVER' },
        ],
        ['LAG looks back over the ordered window.', 'LAG ordered window me peeche dekhta hai.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Review sequence: each review id and rating with the previous review\'s rating (aliased prev_rating). Columns: id, rating, prev_rating. LIMIT 6 by id.',
          'Review sequence: har review ka id aur rating pichle review ke rating ke saath (aliased prev_rating). Columns: id, rating, prev_rating. Id se LIMIT 6.',
        ],
        sol: 'SELECT id, rating, LAG(rating) OVER (ORDER BY id) AS prev_rating FROM reviews ORDER BY id LIMIT 6;',
        hints: [
          ['LAG(rating) OVER (ORDER BY id).', 'LAG(rating) OVER (ORDER BY id).'],
          ['SELECT id, rating, LAG(rating) OVER (ORDER BY id) AS prev_rating FROM reviews ORDER BY id LIMIT 6;', 'SELECT id, rating, LAG(rating) OVER (ORDER BY id) AS prev_rating FROM reviews ORDER BY id LIMIT 6;'],
          ['The first row\'s prev_rating is NULL — expected.', 'Pehli row ka prev_rating NULL hai — expected.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'easy',
        desc: [
          'Peek ahead: each review id and rating with the NEXT review\'s rating (aliased next_rating). Columns: id, rating, next_rating. LIMIT 6 by id.',
          'Aage jhaankna: har review ka id aur rating AGLE review ke rating ke saath (aliased next_rating). Columns: id, rating, next_rating. Id se LIMIT 6.',
        ],
        sol: 'SELECT id, rating, LEAD(rating) OVER (ORDER BY id) AS next_rating FROM reviews ORDER BY id LIMIT 6;',
        hints: [
          ['LEAD mirrors LAG into the future.', 'LEAD, LAG ka future mirror hai.'],
          ['SELECT id, rating, LEAD(rating) OVER (ORDER BY id) AS next_rating FROM reviews ORDER BY id LIMIT 6;', 'SELECT id, rating, LEAD(rating) OVER (ORDER BY id) AS next_rating FROM reviews ORDER BY id LIMIT 6;'],
          ['Now the LAST row carries NULL instead.', 'Ab AAKHRI row NULL le jaati hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'medium',
        desc: [
          'Monthly change: month, revenue (rounded) and the month-over-month absolute change (rounded, aliased change — NULL for the first month is fine). Columns: month, revenue, change. Sorted by month. LIMIT 8.',
          'Monthly change: month, revenue (rounded) aur month-over-month absolute change (rounded, aliased change — pehle mahine ka NULL theek hai). Columns: month, revenue, change. Month se sorted. LIMIT 8.',
        ],
        sol: "SELECT month, ROUND(revenue, 2) AS revenue,\n  ROUND(revenue - LAG(revenue) OVER (ORDER BY month), 2) AS change\nFROM (\n  SELECT substr(o.order_date, 1, 7) AS month, SUM(p.amount) AS revenue\n  FROM orders o JOIN payments p ON p.order_id = o.id\n  GROUP BY substr(o.order_date, 1, 7)\n) ORDER BY month LIMIT 8;",
        hints: [
          ['Group monthly revenue in a subquery, LAG it outside.', 'Monthly revenue subquery me group karo, LAG bahar lagao.'],
          ['SELECT month, ROUND(revenue,2) AS revenue, ROUND(revenue - LAG(revenue) OVER (ORDER BY month), 2) AS change FROM (…) ORDER BY month LIMIT 8;', 'SELECT month, ROUND(revenue,2) AS revenue, ROUND(revenue - LAG(revenue) OVER (ORDER BY month), 2) AS change FROM (…) ORDER BY month LIMIT 8;'],
          ['February\'s change ≈ −0.49M.', 'February ka change ≈ −0.49M.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'Growth percent: month, revenue (rounded) and month-over-month growth percent (rounded to 1 decimal, aliased growth_pct) — showing only months that HAVE a previous month (filter the first via subquery). Columns: month, revenue, growth_pct. Sorted by month. LIMIT 8.',
          'Growth percent: month, revenue (rounded) aur month-over-month growth percent (1 decimal par, aliased growth_pct) — sirf wahi mahine jinhe PICHLA mahina hai (pehle ko subquery se filter karo). Columns: month, revenue, growth_pct. Month se sorted. LIMIT 8.',
        ],
        sol: "SELECT month, ROUND(revenue, 2) AS revenue,\n  ROUND(100.0 * (revenue - prev) / prev, 1) AS growth_pct\nFROM (\n  SELECT month, revenue, LAG(revenue) OVER (ORDER BY month) AS prev\n  FROM (\n    SELECT substr(o.order_date, 1, 7) AS month, SUM(p.amount) AS revenue\n    FROM orders o JOIN payments p ON p.order_id = o.id\n    GROUP BY substr(o.order_date, 1, 7)\n  )\n) WHERE prev IS NOT NULL ORDER BY month LIMIT 8;",
        hints: [
          ['Two nested levels: monthly sums → LAG adds prev → filter+divide outside.', 'Do nested levels: monthly sums → LAG prev jodta hai → bahar filter+divide.'],
          ['WHERE prev IS NOT NULL cannot sit with the window in the same SELECT — nest one more level.', 'WHERE prev IS NOT NULL window ke saath usi SELECT me nahi reh sakta — ek level aur nest karo.'],
          ['February shows ≈ −10.8% growth.', 'February ≈ −10.8% growth dikhata hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'Inventory pulse: the first 10 inventory_log entries (by id) with their change_quantity and the change from the previous entry — lag_qty = LAG(change_quantity) — plus a "direction" label via CASE: "up" if change_quantity > lag_qty, "down" if smaller, "same" if equal, "start" when lag_qty IS NULL. Columns: id, change_quantity, lag_qty, direction. Sorted by id. LIMIT 10.',
          'Inventory pulse: inventory_log ki pehli 10 entries (id se) unke change_quantity aur pichli entry se change ke saath — lag_qty = LAG(change_quantity) — plus CASE se "direction" label: "up" agar change_quantity > lag_qty, "down" agar chhota, "same" agar barabar, "start" jab lag_qty NULL ho. Columns: id, change_quantity, lag_qty, direction. Id se sorted. LIMIT 10.',
        ],
        sol: "SELECT id, change_quantity, lag_qty,\n  CASE WHEN lag_qty IS NULL THEN 'start'\n       WHEN change_quantity > lag_qty THEN 'up'\n       WHEN change_quantity < lag_qty THEN 'down'\n       ELSE 'same' END AS direction\nFROM (\n  SELECT id, change_quantity, LAG(change_quantity) OVER (ORDER BY id) AS lag_qty\n  FROM inventory_log\n) ORDER BY id LIMIT 10;",
        hints: [
          ['Window + CASE, the two advanced pillars in one query.', 'Window + CASE — dono advanced stambh ek query me.'],
          ['Inner: LAG. Outer: CASE over the lagged column.', 'Andar: LAG. Bahar: lagged column par CASE.'],
          ['The first entry is "start" by design.', 'Pehli entry design ke hisaab se "start" hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),
];
