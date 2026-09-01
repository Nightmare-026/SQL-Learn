'use client';

// Modules 49-52: Mini Project 3 (Advanced Analytics) · Views · Updating Views · Indexes

import { defineModule, section, step, example, mistake, mcq, outputQ, buildQ, blanksQ, task } from './builder';
import type { Module } from '@/types/content';

export const modules: Module[] = [
  defineModule({
    n: 49,
    title: ['🎯 Mini Project 3: Advanced Analytics', '🎯 Mini Project 3: Advanced Analytics'],
    time: '40 min',
    concepts: ['project', 'window functions', 'cte', 'rank', 'lag', 'running total', 'analytics'],
    diagram: 'window-frame',
    objectives: [
      ['Combine window functions and CTEs on the advanced database', 'Advanced database par window functions aur CTEs jodna'],
      ['Solve ranking, growth and segmentation problems', 'Ranking, growth aur segmentation problems solve karna'],
      ['Prove readiness for views, indexes and optimisation', 'Views, indexes aur optimisation ki taiyari saabit karna'],
    ],
    theory: [
      section(
        ['The analytics deep-end', 'Analytics ka gehra kinara'],
        [
          [
            'Six business requests, each demanding the expert toolkit on the full advanced database (with reviews, shipping, inventory and segments). You will rank sellers inside cities, compute shipping performance, track cumulative inventory, analyse review sentiment, month-over-month growth, and build a segmented customer view — every query a pipeline of named steps and windows.',
            'Chhe business requests, har ek poore advanced database par (reviews, shipping, inventory aur segments ke saath) expert toolkit maangti hai. Aap cities ke andar sellers rank karenge, shipping performance nikalenge, cumulative inventory track karenge, review sentiment analyse karenge, month-over-month growth, aur ek segmented customer view banaenge — har query naamde steps aur windows ki pipeline.',
          ],
          [
            'The winning rhythm stays the same: name the metric, name the grain, name the steps. Windows answer "compared to whom / ranked where / trend how"; CTEs keep those answers readable. If a query feels tangled, you have missed a step boundary — split it.',
            'Jeetne wala rhythm wahi hai: metric ka naam, grain ka naam, steps ka naam. Windows ka jawab "kis se compare / kahan rank / trend kaisa"; CTEs un jawabon ko readable rakhte hain. Query ulajhi lage to step boundary chhoot gayi hai — todo.',
          ],
        ],
        [
          ['Windows rank and compare; CTEs narrate', 'Windows rank aur compare karte hain; CTEs kahani sunate hain'],
          ['The advanced tables reward joins across domains', 'Advanced tables domains ke paar joins ka inaam deti hain'],
          ['6 tasks · any 3 + quiz to advance', '6 tasks · koi bhi 3 + quiz aage badhne ke liye'],
        ],
        []
      ),
    ],
    tutorial: {
      title: ['A ranked pipeline', 'Ranked pipeline'],
      steps: [
        step(null, [
          'Warm-up: the shipping league — how many orders reached each status, ranked by volume.',
          'Warm-up: shipping league — har status me kitne orders pahunchе, volume se ranked.',
        ]),
        step('SELECT shipping_status, COUNT(*) AS n\nFROM shipping\nGROUP BY shipping_status ORDER BY n DESC;', [
          'Raw volumes: delivered dominates (250).',
          'Raw volumes: delivered haavi hai (250).',
        ], { table: 'shipping' }),
        step('WITH status_counts AS (\n  SELECT shipping_status, COUNT(*) AS n FROM shipping GROUP BY shipping_status\n)\nSELECT shipping_status, n, RANK() OVER (ORDER BY n DESC) AS rnk\nFROM status_counts ORDER BY rnk;', [
          'A CTE step, then RANK over the step — the canonical analytics shape.',
          'Ek CTE step, phir step par RANK — canonical analytics shape.',
        ], { table: 'shipping' }),
        step("WITH monthly AS (\n  SELECT substr(s.estimated_delivery, 1, 7) AS month, COUNT(*) AS n\n  FROM shipping s WHERE s.shipping_status = 'delivered'\n  GROUP BY substr(s.estimated_delivery, 1, 7)\n)\nSELECT month, n, ROUND(100.0 * (n - LAG(n) OVER (ORDER BY month)) / LAG(n) OVER (ORDER BY month), 1) AS mom_pct\nFROM monthly WHERE LAG(n) OVER (ORDER BY month) IS NOT NULL ORDER BY month LIMIT 5;", [
          'Hmm — filter placement: wrap one more level. Pipelines iterate; tasks show the final form.',
          'Hmm — filter ka placement: ek level aur wrap karo. Pipelines iterate karte hain; tasks final form dikhate hain.',
        ], { table: 'shipping' }),
        step("SELECT segment_name, COUNT(*) AS customers FROM customer_segments GROUP BY segment_name ORDER BY customers DESC;", [
          'The segment census — the base of the final task.',
          'Segment census — aakhri task ka base.',
        ], { run: true, table: 'customer_segments' }),
      ],
    },
    syntax: {
      template: 'WITH step1 AS (…), step2 AS (SELECT …, WINDOW_FN() OVER (…) FROM step1)\nSELECT … FROM step2 [WHERE window-derived filter];',
      parts: [
        { part: 'steps', description: ['Named stages for grain and enrichment', 'Grain aur enrichment ke naamde stages'] },
        { part: 'windows', description: ['Ranking, offsets, cumulative frames', 'Ranking, offsets, cumulative frames'] },
        { part: 'outer filter', description: ['Window results need an outer level', 'Window results ko bahar ka level chahiye'] },
      ],
    },
    examples: [
      example('easy', 'SELECT shipping_status, COUNT(*) AS n, RANK() OVER (ORDER BY COUNT(*) DESC) AS rnk\nFROM shipping GROUP BY shipping_status ORDER BY rnk;', [
        'The shipping league, ranked in one statement.',
        'Shipping league, ek statement me ranked.',
      ]),
      example('medium', "SELECT rating, COUNT(*) AS n,\n  ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM reviews), 1) AS pct\nFROM reviews GROUP BY rating ORDER BY rating;", [
        'Rating distribution as percentages (subquery benchmark).',
        'Rating distribution percentages me (subquery benchmark).',
      ]),
      example('hard', "WITH monthly AS (\n  SELECT substr(o.order_date, 1, 7) AS month, SUM(p.amount) AS revenue\n  FROM orders o JOIN payments p ON p.order_id = o.id GROUP BY substr(o.order_date, 1, 7)\n), growth AS (\n  SELECT month, revenue, LAG(revenue) OVER (ORDER BY month) AS prev FROM monthly\n)\nSELECT month, ROUND(100.0 * (revenue - prev) / prev, 1) AS growth_pct\nFROM growth WHERE prev IS NOT NULL ORDER BY month LIMIT 6;", [
        'Month-over-month growth — the finance pipeline, fully assembled.',
        'Month-over-month growth — finance pipeline, poora assembled.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Filtering window results in the same SELECT', 'Window results ko usi SELECT me filter karna'],
        ['WHERE cannot see window outputs — wrap a level: FROM (SELECT …, LAG …) WHERE prev IS NOT NULL.', 'WHERE, window outputs ko dekh nahi sakta — ek level wrap karo: FROM (SELECT …, LAG …) WHERE prev IS NOT NULL.']
      ),
      mistake(
        ['Ranking across the whole table when the board is per group', 'Board per-group hai par poori table par rank karna'],
        ['"Top per city" needs PARTITION BY city — a global rank crowns one city\'s entire elite.', '"Har city ka top" ke liye PARTITION BY city chahiye — global rank ek hi city ki poori elite ko taaj pehna dega.']
      ),
      mistake(
        ['Mixing delivery-date grains (order vs estimated)', 'Delivery-date grains mix karna (order vs estimated)'],
        ['State your date source in words before writing: order_date (orders), payment_date (payments), estimated_delivery (shipping). Grain drifts silently otherwise.', 'Likhe se pehle date source shabdon me bolo: order_date (orders), payment_date (payments), estimated_delivery (shipping). Warna grain chup-chaap hat jaata hai.']
      ),
    ],
    summary: [
      ['Windows + CTEs = the analytics workhorse pair', 'Windows + CTEs = analytics ka workhorse jodi'],
      ['Rank inside PARTITIONs for per-group boards', 'Per-group boards ke liye PARTITION ke andar rank karo'],
      ['Growth = LAG pipeline with an outer filter', 'Growth = LAG pipeline bahar wale filter ke saath'],
      ['Next: views — saving queries as tables', 'Aage: views — queries ko tables ki tarah save karna'],
    ],
    quiz: [
      mcq(
        ['Which function gives month-over-month percentage change?', 'Month-over-month percent change kaunsa function deta hai?'],
        [
          ['RANK with ORDER BY month', 'ORDER BY month ke saath RANK'],
          ['LAG combined with arithmetic: (x − LAG(x)) / LAG(x)', 'LAG arithmetic ke saath: (x − LAG(x)) / LAG(x)'],
          ['ROW_NUMBER partitioned by month', 'month se partitioned ROW_NUMBER'],
          ['SUM with ROWS BETWEEN', 'ROWS BETWEEN ke saath SUM'],
        ],
        1,
        ['LAG fetches last month; the arithmetic makes it a growth rate.', 'LAG pichla mahina laata hai; arithmetic use growth rate bana deta hai.']
      ),
      outputQ(
        'SELECT shipping_status, COUNT(*) FROM shipping GROUP BY shipping_status ORDER BY COUNT(*) DESC LIMIT 1;',
        ['The busiest shipping status:', 'Sabse vyast shipping status:'],
        [
          { label: 'A', result: { columns: ['shipping_status', 'COUNT(*)'], rows: [['delivered', 250]] } },
          { label: 'B', result: { columns: ['shipping_status', 'COUNT(*)'], rows: [['returned', 48]] } },
          { label: 'C', result: { columns: ['shipping_status', 'COUNT(*)'], rows: [['packed', 39]] } },
          { label: 'D', result: { error: 'Error: no such column: shipping_status' } },
        ],
        0,
        ['250 of 400 shipments are delivered — 62.5% success.', '400 me se 250 shipments delivered hain — 62.5% safalta.']
      ),
      buildQ(
        ['Build: shipping status league with ranks', 'Banao: ranks ke saath shipping status league'],
        ['shipping_status', 'COUNT(*)', 'RANK()', 'OVER', 'ORDER BY COUNT(*) DESC', 'SELECT', 'FROM', 'shipping', 'GROUP BY'],
        ['SELECT', 'shipping_status', ',', 'COUNT', '(', '*', ')', ',', 'RANK', '(', ')', 'OVER', '(', 'ORDER', 'BY', 'COUNT', '(', '*', ')', 'DESC', ')', 'FROM', 'shipping', 'GROUP', 'BY', 'shipping_status'],
        ['Group statuses, then rank the counts.', 'Statuses group karo, phir counts rank karo.']
      ),
      blanksQ(
        'SELECT month, revenue, ___(revenue) OVER (___ BY month) AS prev FROM monthly;',
        [
          { options: ['LAG', 'SUM', 'RANK'], correct: 'LAG' },
          { options: ['ORDER', 'PARTITION', 'GROUP'], correct: 'ORDER' },
        ],
        ['LAG over the ordered months gives the previous value.', 'Ordered months par LAG pichli value deta hai.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The shipping league: statuses with counts and RANK (ties shared), ordered by volume. Columns: shipping_status, n, rnk. Sorted by rnk, shipping_status.',
          'Shipping league: statuses counts aur RANK ke saath (ties shared), volume se ordered. Columns: shipping_status, n, rnk. rnk, shipping_status se sorted.',
        ],
        sol: 'SELECT shipping_status, COUNT(*) AS n,\n  RANK() OVER (ORDER BY COUNT(*) DESC) AS rnk\nFROM shipping GROUP BY shipping_status ORDER BY rnk, shipping_status;',
        hints: [
          ['Group, then rank the grouped counts.', 'Group karo, phir grouped counts rank karo.'],
          ['SELECT shipping_status, COUNT(*) AS n, RANK() OVER (ORDER BY COUNT(*) DESC) AS rnk FROM shipping GROUP BY shipping_status ORDER BY rnk, shipping_status;', 'SELECT shipping_status, COUNT(*) AS n, RANK() OVER (ORDER BY COUNT(*) DESC) AS rnk FROM shipping GROUP BY shipping_status ORDER BY rnk, shipping_status;'],
          ['delivered 250, returned 48, packed 39…', 'delivered 250, returned 48, packed 39…'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'easy',
        desc: [
          'Sentiment census: rating distribution as counts and percent of all reviews (rounded to 1 decimal, aliased pct). Columns: rating, n, pct. Sorted by rating.',
          'Sentiment census: rating distribution counts aur saari reviews ka percent (1 decimal par, aliased pct). Columns: rating, n, pct. Rating se sorted.',
        ],
        sol: "SELECT rating, COUNT(*) AS n,\n  ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM reviews), 1) AS pct\nFROM reviews GROUP BY rating ORDER BY rating;",
        hints: [
          ['The denominator is a scalar subquery over the whole table.', 'Denominator poori table par scalar subquery hai.'],
          ['SELECT rating, COUNT(*) AS n, ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM reviews), 1) AS pct FROM reviews GROUP BY rating ORDER BY rating;', 'SELECT rating, COUNT(*) AS n, ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM reviews), 1) AS pct FROM reviews GROUP BY rating ORDER BY rating;'],
          ['5-star: 207 reviews ≈ 41.4%.', '5-star: 207 reviews ≈ 41.4%.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'medium',
        desc: [
          'Inventory pulse: the 15 latest inventory entries (by id) with a running total of change_quantity. Columns: id, change_quantity, running_total. Sorted by id descending (latest first). LIMIT 15.',
          'Inventory pulse: 15 sabse naye inventory entries (id se) change_quantity ke running total ke saath. Columns: id, change_quantity, running_total. Id se utarte (naye pehle) sorted. LIMIT 15.',
        ],
        sol: 'SELECT id, change_quantity, running_total FROM (\n  SELECT id, change_quantity,\n    SUM(change_quantity) OVER (ORDER BY id) AS running_total\n  FROM inventory_log\n) ORDER BY id DESC LIMIT 15;',
        hints: [
          ['Compute the running total ascending, then display descending.', 'Running total chadhta compute karo, phir utarta display karo.'],
          ['The inner OVER (ORDER BY id) defines "running"; the outer ORDER BY id DESC just flips the display.', 'Andar wala OVER (ORDER BY id) "running" define karta hai; bahar ka ORDER BY id DESC sirf display ulta karta hai.'],
          ['The top row shows the final cumulative position.', 'Sabse upar wali row final cumulative position dikhati hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'Top reviewers per product… actually: top 3 products by average rating (ROUND 2), with DENSE_RANK by avg rating (ties shared). Columns: product_id, avg_rating, drnk. Sorted by drnk, product_id. (Products with ≥ 2 reviews only — HAVING COUNT(*) >= 2.)',
          'Har product ke top reviewers… nahi, seedha: average rating se top 3 products (ROUND 2), DENSE_RANK avg rating se (ties shared). Columns: product_id, avg_rating, drnk. drnk, product_id se sorted. (Sirf ≥ 2 reviews wale products — HAVING COUNT(*) >= 2.)',
        ],
        sol: 'WITH product_avg AS (\n  SELECT product_id, ROUND(AVG(rating), 2) AS avg_rating\n  FROM reviews GROUP BY product_id HAVING COUNT(*) >= 2\n)\nSELECT product_id, avg_rating, DENSE_RANK() OVER (ORDER BY avg_rating DESC) AS drnk\nFROM product_avg ORDER BY drnk, product_id LIMIT 10;',
        hints: [
          ['Step 1: averages with the review-count gate. Step 2: dense rank.', 'Step 1: review-count gate ke saath averages. Step 2: dense rank.'],
          ['WITH product_avg AS (SELECT product_id, ROUND(AVG(rating),2) AS avg_rating FROM reviews GROUP BY product_id HAVING COUNT(*) >= 2) SELECT product_id, avg_rating, DENSE_RANK() OVER (ORDER BY avg_rating DESC) AS drnk FROM product_avg ORDER BY drnk, product_id LIMIT 10;', 'WITH product_avg AS (SELECT product_id, ROUND(AVG(rating),2) AS avg_rating FROM reviews GROUP BY product_id HAVING COUNT(*) >= 2) SELECT product_id, avg_rating, DENSE_RANK() OVER (ORDER BY avg_rating DESC) AS drnk FROM product_avg ORDER BY drnk, product_id LIMIT 10;'],
          ['Tied averages share steps — expect extra rows at the top.', 'Tied averages steps share karti hain — upar extra rows expect karo.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'The growth pipeline (delivered revenue): CTE monthly (delivered revenue per month over orders→payments), CTE growth (LAG prev), final: month, revenue (rounded), growth_pct (1 decimal) for months with a previous. Columns: month, revenue, growth_pct. Sorted by month.',
          'Growth pipeline (delivered revenue): CTE monthly (orders→payments par delivered monthly revenue), CTE growth (LAG prev), final: month, revenue (rounded), growth_pct (1 decimal) sirf pichla mahina walon ke liye. Columns: month, revenue, growth_pct. Month se sorted.',
        ],
        sol: "WITH monthly AS (\n  SELECT substr(o.order_date, 1, 7) AS month, SUM(p.amount) AS revenue\n  FROM orders o JOIN payments p ON p.order_id = o.id\n  WHERE o.status = 'delivered'\n  GROUP BY substr(o.order_date, 1, 7)\n),\ngrowth AS (\n  SELECT month, revenue, LAG(revenue) OVER (ORDER BY month) AS prev FROM monthly\n)\nSELECT month, ROUND(revenue, 2) AS revenue,\n  ROUND(100.0 * (revenue - prev) / prev, 1) AS growth_pct\nFROM growth WHERE prev IS NOT NULL ORDER BY month;",
        hints: [
          ['Three levels: sums → lag → filter+formula.', 'Teen levels: sums → lag → filter+formula.'],
          ['The delivered filter lives in the FIRST step (WHERE on raw rows).', 'Delivered filter PEHLE step me rehta hai (raw rows par WHERE).'],
          ['Eleven rows (Feb–Dec) — January is filtered by design.', 'Gyarah rows (Feb–Dec) — January design se filtered hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'The segment view: per segment_name, customer count and average customer spend (through segments→customers→orders→payments), rounded. Columns: segment_name, customers, avg_spend. Sorted by customers descending.',
          'Segment view: har segment_name ke liye customer count aur average customer spend (segments→customers→orders→payments se), rounded. Columns: segment_name, customers, avg_spend. Customers se utarte sorted.',
        ],
        sol: "WITH seg_spend AS (\n  SELECT cs.segment_name, c.id, SUM(p.amount) AS total\n  FROM customer_segments cs\n  JOIN customers c ON c.id = cs.customer_id\n  LEFT JOIN orders o ON o.customer_id = c.id\n  LEFT JOIN payments p ON p.order_id = o.id\n  GROUP BY cs.segment_name, c.id\n)\nSELECT segment_name, COUNT(*) AS customers, ROUND(AVG(total), 2) AS avg_spend\nFROM seg_spend GROUP BY segment_name ORDER BY customers DESC;",
        hints: [
          ['LEFT JOINs keep customers with zero orders (their spend is NULL — AVG skips).', 'LEFT JOINs zero-order customers bachate hain (unka kharch NULL — AVG skip karta hai).'],
          ['Step 1: spend per (segment, customer). Step 2: average per segment.', 'Step 1: har (segment, customer) ka kharch. Step 2: har segment ka average.'],
          ['regular (29) and vip (28) lead by count.', 'regular (29) aur vip (28) count me aage.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),

  defineModule({
    n: 50,
    title: ['Views', 'Views'],
    time: '25 min',
    concepts: ['view', 'create view', 'drop view', 'virtual table', 'reusable query', 'security', 'abstraction'],
    diagram: 'select-flow',
    objectives: [
      ['Save a query as a queryable view', 'Query ko queryable view ki tarah save karna'],
      ['Query views exactly like tables', 'Views ko table ki tarah hi query karna'],
      ['Understand views as saved queries, not copies', 'Views ko saved queries samajhna, copies nahi'],
    ],
    theory: [
      section(
        ['A query wearing a table costume', 'Table ke kapde pehni hui query'],
        [
          [
            'A VIEW is a saved SELECT with a name: CREATE VIEW delivered_orders AS SELECT … WHERE status = \'delivered\'. After that, delivered_orders behaves like a table — you SELECT from it, join it, aggregate it — while it is ALWAYS fresh: a view stores the QUERY, not the result. Underlying data changes; the view reflects it on the next read.',
            'VIEW ek saved SELECT hai jiska ek naam hai: CREATE VIEW delivered_orders AS SELECT … WHERE status = \'delivered\'. Uske baad delivered_orders table ki tarah behave karta hai — usse SELECT karo, join karo, aggregate karo — jabki wo HAMESHA fresh hai: view QUERY store karta hai, result nahi. Neeche ka data badle; view agli read par use reflect karta hai.',
          ],
          [
            'Why teams love views: reuse (the 40-line report query becomes a one-line table), abstraction (consumers see clean names, not the joins behind them), and access control (grant a view, hide the raw tables). Every serious data warehouse is experienced through layers of views.',
            'Teams views kyun pasand karte hain: reuse (40-line ki report query ek-line ki table ban jaati hai), abstraction (consumers saaf naam dekhte hain, peeche wale joins nahi), aur access control (view do, raw tables chhupao). Har serious data warehouse views ki paraton se experience hota hai.',
          ],
        ],
        [],
        'select-flow'
      ),
      section(
        ['Creating, using, dropping', 'Banana, use karna, hatana'],
        [
          [
            'CREATE VIEW name AS SELECT …; defines it. DROP VIEW IF EXISTS name; removes it (the IF EXISTS guard makes re-runs safe — recreate scripts use it constantly). You cannot create two views with the same name, hence the standard drop-then-create script pattern.',
            'CREATE VIEW name AS SELECT …; ise define karta hai. DROP VIEW IF EXISTS name; use hata deta hai (IF EXISTS guard re-runs safe banata hai — recreate scripts ise constantly use karte hain). Same naam ki do views nahi bana sakte, isliye standard drop-then-create script pattern hota hai.',
          ],
          [
            'A note on this console: your practice database resets per module — views you create vanish with the reset, which keeps every task reproducible. In a real database a view persists until dropped. In the Sandbox (full DDL rights), your views live for the whole session.',
            'Is console ke baare me ek note: aapka practice database har module par reset hota hai — aapki bani views reset ke saath gayab, isliye har task reproducible rehta hai. Asli database me view tab tak jeeta hai jab tak drop na ho. Sandbox me (full DDL rights) aapki views poore session jeete hain.',
          ],
        ],
        [
          ['CREATE VIEW name AS SELECT …', 'CREATE VIEW name AS SELECT …'],
          ['Views store queries — results are always fresh', 'Views queries store karte hain — results hamesha fresh'],
          ['DROP VIEW IF EXISTS before recreating', 'Recreate se pehle DROP VIEW IF EXISTS'],
        ]
      ),
    ],
    tutorial: {
      title: ['Building a reporting layer', 'Reporting layer banana'],
      steps: [
        step(null, [
          'We will turn the delivered-revenue pipeline into a view, then consume it like a table.',
          'Hum delivered-revenue pipeline ko view me badlenge, phir use table ki tarah use karenge.',
        ]),
        step("CREATE VIEW delivered_revenue_monthly AS\nSELECT substr(o.order_date, 1, 7) AS month, SUM(p.amount) AS revenue\nFROM orders o JOIN payments p ON p.order_id = o.id\nWHERE o.status = 'delivered'\nGROUP BY substr(o.order_date, 1, 7);", [
          'One CREATE VIEW — the pipeline is saved as a named object.',
          'Ek CREATE VIEW — pipeline ek naamde object ki tarah save.',
        ], { table: 'orders' }),
        step('SELECT * FROM delivered_revenue_monthly ORDER BY month LIMIT 6;', [
          'Query the view exactly like a table — months and revenue, always current.',
          'View ko table ki tarah hi query karo — months aur revenue, hamesha current.',
        ], { run: true, table: 'orders' }),
        step('SELECT month, ROUND(revenue, 2) AS revenue,\n  ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month)) / LAG(revenue) OVER (ORDER BY month), 1) AS growth\nFROM delivered_revenue_monthly ORDER BY month LIMIT 5;', [
          'Windows run over views; views feed queries — the layers stack.',
          'Windows views par chalte hain; views queries ko feed karte hain — paraten jama hoti hain.',
        ], { table: 'orders' }),
        step('DROP VIEW IF EXISTS delivered_revenue_monthly;', [
          'Clean removal — the standard ending of every view script.',
          'Saaf safai — har view script ka standard ending.',
        ], { run: true, table: 'orders' }),
      ],
    },
    syntax: {
      template: 'CREATE VIEW view_name AS\n  SELECT …;\n\nSELECT … FROM view_name …;\n\nDROP VIEW IF EXISTS view_name;',
      parts: [
        { part: 'CREATE VIEW', description: ['Saves the query under a name', 'Query ko naam ke neeche save karta hai'] },
        { part: 'query it', description: ['SELECT / JOIN / aggregate like a table', 'table ki tarah SELECT / JOIN / aggregate'] },
        { part: 'DROP VIEW IF EXISTS', description: ['Safe removal before recreate', 'Recreate se pehle safe removal'] },
      ],
    },
    examples: [
      example('very_easy', "CREATE VIEW big_payments AS SELECT * FROM payments WHERE amount > 100000;\nSELECT COUNT(*) FROM big_payments;", [
        'A filtered view, then a count over it.',
        'Ek filtered view, phir uspar count.',
      ]),
      example('easy', "CREATE VIEW vip_customers AS SELECT id, name, city FROM customers WHERE customer_type = 'vip';\nSELECT city, COUNT(*) FROM vip_customers GROUP BY city ORDER BY COUNT(*) DESC LIMIT 3;", [
        'Grouping over a view — reuse in action.',
        'View par grouping — reuse kaam me.',
      ]),
      example('medium', "CREATE VIEW monthly_revenue AS\nSELECT substr(o.order_date,1,7) AS month, SUM(p.amount) AS revenue\nFROM orders o JOIN payments p ON p.order_id = o.id GROUP BY substr(o.order_date,1,7);\nSELECT MAX(revenue) FROM monthly_revenue;", [
        'A pipeline view; downstream queries stay one-liners.',
        'Ek pipeline view; downstream queries one-liner rehte hain.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Creating a view that already exists', 'Pehle se maujood view banana'],
        ['The second CREATE fails with "table already exists". DROP VIEW IF EXISTS first — the standard script header.', 'Doosra CREATE "table already exists" se fail hota hai. Pehle DROP VIEW IF EXISTS — standard script header.']
      ),
      mistake(
        ['Believing views slow queries because they "materialise"', 'Yeh maanna ki views queries slow karte hain kyunki wo "materialise" hote hain'],
        ['A plain view is just a named query — the engine inlines it (Module 56 explains when separate "materialised" strategies matter).', 'Plain view bas ek naamde query hai — engine ise inline karta hai (Module 56 me samjhaata hai kab alag "materialised" strategies matter karti hain).']
      ),
      mistake(
        ['Forgetting views depend on their source tables', 'Views apni source tables par depend karte hain bhool jaana'],
        ['Drop or rename a column the view uses, and the view breaks ("no such column"). Change schemas consciously.', 'View jo column use karta hai use drop ya rename karo to view toot jaata hai ("no such column"). Schema jaan-boojh kar badlo.']
      ),
    ],
    summary: [
      ['A view is a saved query usable like a table', 'View ek saved query hai jo table ki tarah use hoti hai'],
      ['Always fresh — results computed at read time', 'Hamesha fresh — results read ke time compute hote hain'],
      ['DROP VIEW IF EXISTS guards recreation', 'DROP VIEW IF EXISTS recreation ko safe banata hai'],
      ['Views enable reuse, abstraction and access control', 'Views reuse, abstraction aur access control dete hain'],
    ],
    quiz: [
      mcq(
        ['What does a view store?', 'View kya store karta hai?'],
        [
          ['A copy of the query result', 'Query result ki copy'],
          ['The query definition itself', 'Query ki definition khud'],
          ['Nothing — it is a bookmark', 'Kuch nahi — wo bookmark hai'],
          ['The table schema only', 'Sirf table ka schema'],
        ],
        1,
        ['Views persist definitions; results are computed fresh on every read.', 'Views definitions bachate hain; results har read par fresh compute hote hain.']
      ),
      outputQ(
        "CREATE VIEW ups AS SELECT * FROM payments WHERE payment_method = 'upi';\nSELECT COUNT(*) FROM ups;",
        ['After creating this view, what does the count return?', 'Ye view banane ke baad count kya return karta hai?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[106]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[500]] } },
          { label: 'C', result: { columns: ['COUNT(*)'], rows: [[0]] } },
          { label: 'D', result: { error: 'Error: no such table: ups' } },
        ],
        0,
        ['The view filters to UPI payments: 106 rows visible through it.', 'View UPI payments par filter karti hai: usme 106 rows dikhti hain.']
      ),
      buildQ(
        ['Build: a view of expensive products', 'Banao: mehge products ka view'],
        ['CREATE', 'VIEW', 'expensive', 'AS', 'SELECT', '*', 'FROM', 'products', 'WHERE', 'price', '>', '10000'],
        ['CREATE', 'VIEW', 'expensive', 'AS', 'SELECT', '*', 'FROM', 'products', 'WHERE', 'price', '>', '10000'],
        ['CREATE VIEW name AS query.', 'CREATE VIEW naam AS query.']
      ),
      blanksQ(
        'CREATE ___ vip AS SELECT id FROM customers ___ customer_type = \'vip\';',
        [
          { options: ['VIEW', 'TABLE', 'INDEX'], correct: 'VIEW' },
          { options: ['WHERE', 'GROUP', 'ORDER'], correct: 'WHERE' },
        ],
        ['Views are created with CREATE VIEW; the body is an ordinary query.', 'Views CREATE VIEW se bante hain; body ek aam query hai.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The VIP lens: create a view vips of VIP customer ids, then count them via the view (aliased c).',
          'VIP lens: vips naam ka view banaо VIP customer ids ka, phir view se count karo (aliased c).',
        ],
        sol: "DROP VIEW IF EXISTS vips;\nCREATE VIEW vips AS SELECT id FROM customers WHERE customer_type = 'vip';\nSELECT COUNT(*) AS c FROM vips;",
        hints: [
          ['Two statements: CREATE then SELECT.', 'Do statements: pehle CREATE phir SELECT.'],
          ["CREATE VIEW vips AS SELECT id FROM customers WHERE customer_type = 'vip'; SELECT COUNT(*) AS c FROM vips;", "CREATE VIEW vips AS SELECT id FROM customers WHERE customer_type = 'vip'; SELECT COUNT(*) AS c FROM vips;"],
          ['20 VIPs in this dataset.', 'Is dataset me 20 VIPs.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'easy',
        desc: [
          'The pricewear view: create view big_spenders as customers whose total spend (through the full chain) exceeds 1,000,000 — then SELECT name from it. Columns shown: name.',
          'Pricewear view: big_spenders naam ka view banaо jinka total kharch (poori chain se) 10,00,000 paar hai — phir usse name SELECT karo. Columns: name.',
        ],
        sol: "DROP VIEW IF EXISTS big_spenders;\nCREATE VIEW big_spenders AS\nSELECT c.name\nFROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id\nGROUP BY c.id, c.name\nHAVING SUM(p.amount) > 1000000;\nSELECT name FROM big_spenders;",
        hints: [
          ['The view body is the grouped query; HAVING does the gating.', 'View body wahi grouped query hai; HAVING gate lagata hai.'],
          ['CREATE VIEW big_spenders AS (SELECT … GROUP BY … HAVING SUM(p.amount) > 1000000); SELECT name FROM big_spenders;', 'CREATE VIEW big_spenders AS (SELECT … GROUP BY … HAVING SUM(p.amount) > 1000000); SELECT name FROM big_spenders;'],
          ['About twenty names.', 'Lagbhag bees naam.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'The reporting layer: create view monthly_revenue (month, revenue per month over orders→payments), then SELECT month and revenue from it sorted by month, LIMIT 6.',
          'Reporting layer: monthly_revenue view banaо (month, revenue orders→payments se), phir usse month aur revenue padho month se sorted, LIMIT 6.',
        ],
        sol: "DROP VIEW IF EXISTS monthly_revenue;\nCREATE VIEW monthly_revenue AS\nSELECT substr(o.order_date, 1, 7) AS month, SUM(p.amount) AS revenue\nFROM orders o JOIN payments p ON p.order_id = o.id\nGROUP BY substr(o.order_date, 1, 7);\nSELECT month, revenue FROM monthly_revenue ORDER BY month LIMIT 6;",
        hints: [
          ['The familiar pipeline, now saved as a layer.', 'Wahi familar pipeline, ab ek layer ki tarah saved.'],
          ['CREATE VIEW monthly_revenue AS (SELECT substr(o.order_date,1,7) AS month, SUM(p.amount) AS revenue FROM … GROUP BY substr(o.order_date,1,7)); SELECT month, revenue FROM monthly_revenue ORDER BY month LIMIT 6;', 'CREATE VIEW monthly_revenue AS (SELECT substr(o.order_date,1,7) AS month, SUM(p.amount) AS revenue FROM … GROUP BY substr(o.order_date,1,7)); SELECT month, revenue FROM monthly_revenue ORDER BY month LIMIT 6;'],
          ['This task verifies the view — validation runs the verify query against your DB.', 'Ye task view ko verify karta hai — validation aapke DB par verify query chalati hai.'],
        ],
        verifyQuery: 'SELECT month, revenue FROM monthly_revenue ORDER BY month LIMIT 6',
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'The clean rollout: DROP VIEW IF EXISTS monthly_revenue, then CREATE it again (same definition), then SELECT month, ROUND(revenue, 2) from it sorted by month LIMIT 4 — proving idempotent scripting.',
          'Saaf rollout: DROP VIEW IF EXISTS monthly_revenue, phir use dobara CREATE karo (same definition), phir usse month, ROUND(revenue, 2) padho month se sorted LIMIT 4 — idempotent scripting saabit karte hue.',
        ],
        sol: "DROP VIEW IF EXISTS monthly_revenue;\nCREATE VIEW monthly_revenue AS\nSELECT substr(o.order_date, 1, 7) AS month, SUM(p.amount) AS revenue\nFROM orders o JOIN payments p ON p.order_id = o.id\nGROUP BY substr(o.order_date, 1, 7);\nSELECT month, ROUND(revenue, 2) FROM monthly_revenue ORDER BY month LIMIT 4;",
        hints: [
          ['Drop first, create second, read third — the script pattern.', 'Pehle drop, doosra create, teesra read — script pattern.'],
          ['Run both statements together; the validator checks the final state.', 'Dono statements saath chalao; validator final state check karta hai.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: "SELECT month, ROUND(revenue, 2) FROM monthly_revenue ORDER BY month LIMIT 4",
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'The analytics layer: create view seg_value (segment_name, customers, avg_spend — per segment through segments→customers→orders→payments, LEFT JOINs, rounded avg), then SELECT * from it ordered by customers DESC. (This is Module 49\'s last task, saved as a reusable layer.)',
          'Analytics layer: seg_value view banaо (segment_name, customers, avg_spend — segments→customers→orders→payments se, LEFT JOINs, rounded avg), phir usse SELECT * karo customers DESC se. (Ye Module 49 ka aakhri task hai, reusable layer ki tarah saved.)',
        ],
        sol: "DROP VIEW IF EXISTS seg_value;\nCREATE VIEW seg_value AS\nWITH seg_spend AS (\n  SELECT cs.segment_name, c.id, SUM(p.amount) AS total\n  FROM customer_segments cs\n  JOIN customers c ON c.id = cs.customer_id\n  LEFT JOIN orders o ON o.customer_id = c.id\n  LEFT JOIN payments p ON p.order_id = o.id\n  GROUP BY cs.segment_name, c.id\n)\nSELECT segment_name, COUNT(*) AS customers, ROUND(AVG(total), 2) AS avg_spend\nFROM seg_spend GROUP BY segment_name;\nSELECT * FROM seg_value ORDER BY customers DESC;",
        hints: [
          ['The whole CTE pipeline becomes the view body — views and CTEs stack.', 'Poora CTE pipeline view body ban jaata hai — views aur CTEs jud jaate hain.'],
          ['CREATE VIEW seg_value AS WITH seg_spend AS (…) SELECT segment_name, COUNT(*), ROUND(AVG(total),2) FROM seg_spend GROUP BY segment_name;', 'CREATE VIEW seg_value AS WITH seg_spend AS (…) SELECT segment_name, COUNT(*), ROUND(AVG(total),2) FROM seg_spend GROUP BY segment_name;'],
          ['regular and vip lead by customer count.', 'regular aur vip customer count me aage hain.'],
        ],
        verifyQuery: 'SELECT * FROM seg_value ORDER BY customers DESC',
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),

  defineModule({
    n: 51,
    title: ['Updating Views', 'Updating Views'],
    time: '20 min',
    concepts: ['updatable views', 'with check option', 'simple views', 'complex views', 'limitations'],
    diagram: 'select-flow',
    objectives: [
      ['Know when a view is updatable', 'Jaanna kab view updatable hota hai'],
      ['Explain why SQLite views are read-only', 'SQLite ke views read-only kyun hain batana'],
      ['Apply the base-table workflow around view limits', 'View ki seemaon ke aage-peeche base-table workflow lagana'],
    ],
    theory: [
      section(
        ['Simple views can change data', 'Simple views data badal sakte hain'],
        [
          [
            'In engines like SQL Server and PostgreSQL, a view over a single table with no aggregates or DISTINCT can be updated directly — UPDATE big_payments routes to the underlying rows. The standard even adds WITH CHECK OPTION to stop updates that would push a row outside the view\'s filter. That is the theory — and the interview question.',
            'SQL Server aur PostgreSQL jaise engines me, ek table par bina aggregates ya DISTINCT wala view seedha update ho sakta hai — UPDATE big_payments neeche wali rows tak jaata hai. Standard WITH CHECK OPTION bhi deta hai jo view ke filter se bahar wali update rokta hai. Yahi theory hai — aur interview ka sawal bhi.',
          ],
          [
            'SQLite takes the strict route: ALL its views are read-only. UPDATE through a view fails immediately with "cannot modify … because it is a view" — honest and immediate. The workaround is professional and universal: update the BASE table directly; the view reflects it instantly because it stores a query, not data. (Truly updatable views in SQLite are possible via INSTEAD OF triggers — an advanced bridge you now have the background to read.)',
            'SQLite strict rasta leta hai: uske SAB views read-only hote hain. View ke through UPDATE turant fail hota hai — "cannot modify … because it is a view" — imandaar aur turant. Hal professional aur universal hai: BASE table seedha update karo; view use turant reflect karta hai kyunki wo query store karta hai, data nahi. (SQLite me sach me updatable views INSTEAD OF triggers se bante hain — ek advanced bridge jiska background ab aapke paas hai.)',
          ],
        ],
        [],
        'select-flow'
      ),
      section(
        ['The SQLite reality (and WITH CHECK OPTION)', 'SQLite ki sachai (aur WITH CHECK OPTION)'],
        [
          [
            'WITH CHECK OPTION guards filtered updatable views in engines that support them: an UPDATE that would push a row outside the view\'s WHERE clause fails instead of silently ejecting it. SQLite does not implement the clause (its views are read-only anyway), but the CONCEPT is standard SQL — expect it in interviews and other engines.',
            'WITH CHECK OPTION filtered updatable views ko un engines me bachata hai jahan wo support hote hain: aisi UPDATE jo row ko view ke WHERE se bahar dhakel de, wo chup-chaap eject hone ki jagah fail hoti hai. SQLite ye clause implement nahi karta (waise bhi uske views read-only hain), par CONCEPT standard SQL hai — interviews aur dusre engines me expect karo.',
          ],
          [
            'So the SQLite workflow is: read through views, write to base tables. That separation is clean, explicit, and what the tasks below drill — including the instructive failure of trying to write through a view.',
            'To SQLite ka workflow hai: views se padho, base tables me likho. Ye separation saaf, explicit hai — aur neeche ke tasks yahi drill karte hain — view ke through likhne ki instructive failure samet.',
          ],
        ],
        [
          ['Simple single-table views are updatable', 'Simple single-table views updatable hote hain'],
          ['Aggregate/join views are read-only', 'Aggregate/join views read-only hote hain'],
          ['WITH CHECK OPTION blocks view-ejecting updates', 'WITH CHECK OPTION view-se-nikalne wale updates rokta hai'],
        ]
      ),
    ],
    tutorial: {
      title: ['Writing through the window', 'Khidki se likhna'],
      steps: [
        step(null, [
          'We create a simple view, update through it, and watch WITH CHECK OPTION defend the boundary.',
          'Hum simple view banate hain, uske through update karte hain, aur WITH CHECK OPTION ki boundary dekhte hain.',
        ]),
        step("CREATE VIEW big_payments AS SELECT * FROM payments WHERE amount > 100000;", [
          'A simple, filtered, updatable view over one table.',
          'Ek table par simple, filtered, updatable view.',
        ], { table: 'payments' }),
        step('SELECT COUNT(*) FROM big_payments;', [
          'How many rows the window shows.',
          'Khidki kitni rows dikhati hai.',
        ], { table: 'payments' }),
        step("UPDATE big_payments SET payment_method = 'upi' WHERE id = 1;\nSELECT payment_method FROM payments WHERE id = 1;", [
          'The update reached the real table — verified by reading the base directly.',
          'Update asli table tak pahuncha — base seedha padh kar verify.',
        ], { run: true, table: 'payments' }),
        step("CREATE VIEW big_checked AS SELECT * FROM payments WHERE amount > 100000 WITH CHECK OPTION;\nUPDATE big_checked SET amount = 500 WHERE id = 2;", [
          'WITH CHECK OPTION blocks the ejecting update with an error — the guard rail at work.',
          'WITH CHECK OPTION nikaalne wala update error se rokta hai — guard rail kaam par.',
        ], { run: true, table: 'payments' }),
      ],
    },
    syntax: {
      template: 'CREATE VIEW v AS SELECT … [WHERE filter] [WITH CHECK OPTION];\nUPDATE v SET col = value WHERE …;   -- routes to base table',
      parts: [
        { part: 'simple view', description: ['One table, no aggregates — updatable', 'Ek table, aggregates nahi — updatable'] },
        { part: 'WITH CHECK OPTION', description: ['Rejects updates that leave the view', 'Wo updates reject karta hai jo view chhod dein'] },
        { part: 'complex view', description: ['Aggregates/joins — read-only', 'Aggregates/joins — read-only'] },
      ],
    },
    examples: [
      example('very_easy', "CREATE VIEW upi_payments AS SELECT * FROM payments WHERE payment_method = 'upi';\nSELECT COUNT(*) FROM upi_payments;", [
        'A simple view you can both read and (carefully) write.',
        'Simple view jo aap padh bhi sakte ho aur (dhyan se) likh bhi.',
      ]),
      example('medium', "UPDATE (SELECT * FROM payments WHERE payment_method = 'cod') SET amount = amount WHERE id = 3;\nSELECT amount FROM payments WHERE id = 3;", [
        'An inline-view update reaching the base row. (The named-view form is cleaner — shown for understanding.)',
        'Inline-view update base row tak pahuncha. (Naam-wala form saaf hai — samajhne ke liye dikhaya.)',
      ]),
      example('hard', "CREATE VIEW cod_guard AS SELECT * FROM payments WHERE payment_method = 'cod' WITH CHECK OPTION;\nUPDATE cod_guard SET payment_method = 'upi' WHERE id = 5;", [
        'The guard rejects changing the rail — the row would leave the view.',
        'Guard rail badalne se mana karta hai — row view chhod degi.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Trying to UPDATE an aggregate view', 'Aggregate view ko UPDATE karne ki koshish'],
        ['Views over GROUP BY/SUM/joins are read-only. Update the base table; the view refreshes itself.', 'GROUP BY/SUM/joins wale views read-only hote hain. Base table update karo; view khud refresh ho jaayega.']
      ),
      mistake(
        ['Updating a filtered view without CHECK and losing rows from the window', 'CHECK ke bina filtered view update karna aur khidki se rows khona'],
        ['A row updated past the filter vanishes from the view (not the table). WITH CHECK OPTION makes that impossible.', 'Filter se paar update hui row view se gayab ho jaati hai (table se nahi). WITH CHECK OPTION use namumkin bana deta hai.']
      ),
      mistake(
        ['Believing view updates duplicate data', 'Yeh maanna ki view updates data duplicate karte hain'],
        ['There is only ever one copy — the base table. View writes route there directly.', 'Hamesha sirf ek copy hoti hai — base table. View ke writes seedha wahin jaate hain.']
      ),
    ],
    summary: [
      ['Simple single-table views pass updates to the base table', 'Simple single-table views updates base table tak le jaate hain'],
      ['Aggregate and join views are read-only', 'Aggregate aur join views read-only hote hain'],
      ['WITH CHECK OPTION guards the view\'s filter boundary', 'WITH CHECK OPTION view ki filter boundary bachata hai'],
      ['When blocked, update the base table directly', 'Jab block ho, base table seedha update karo'],
    ],
    quiz: [
      mcq(
        ["Which view can be updated (in SQLite)?", "(SQLite me) kaunsa view update ho sakta hai?"],
        [
          ['A view over two joined tables', 'Do joined tables wala view'],
          ['A view with GROUP BY and SUM', 'GROUP BY aur SUM wala view'],
          ['A simple view over one table with a WHERE filter', 'Ek table par WHERE filter wala simple view'],
          ['No view can ever be updated', 'Koi view kabhi update nahi ho sakta'],
        ],
        2,
        ['One table, no aggregates, no joins — the engine can map rows directly.', 'Ek table, na aggregates, na joins — engine rows seedha map kar sakta hai.']
      ),
      outputQ(
        "CREATE VIEW g AS SELECT id, amount FROM payments WHERE amount > 40000 WITH CHECK OPTION;\nUPDATE g SET amount = 10 WHERE id = 1;",
        ['What happens?', 'Kya hota hai?'],
        [
          { label: 'A', result: { error: 'Error: attempt to write a readonly row' } },
          { label: 'B', result: { columns: ['id', 'amount'], rows: [[1, 10]] } },
          { label: 'C', result: { error: 'View check failed' } },
          { label: 'D', result: { columns: [], rows: [] } },
        ],
        2,
        ['The new amount (10) would fall below the view\'s filter — WITH CHECK OPTION rejects it.', 'Naya amount (10) view ke filter se neeche girega — WITH CHECK OPTION mana karta hai.']
      ),
      buildQ(
        ['Build: a guarded COD view', 'Banao: guarded COD view'],
        ['CREATE', 'VIEW', 'cod_v', 'AS', 'SELECT', '*', 'FROM', 'payments', 'WHERE', "payment_method = 'cod'", 'WITH', 'CHECK', 'OPTION'],
        ['CREATE', 'VIEW', 'cod_v', 'AS', 'SELECT', '*', 'FROM', 'payments', 'WHERE', "payment_method = 'cod'", 'WITH', 'CHECK', 'OPTION'],
        ['Append WITH CHECK OPTION after the WHERE.', 'WHERE ke baad WITH CHECK OPTION lagao.']
      ),
      blanksQ(
        'CREATE VIEW v AS SELECT … WHERE filter WITH ___ ___;',
        [
          { options: ['CHECK', 'KEY', 'VIEW'], correct: 'CHECK' },
          { options: ['OPTION', 'ONLY', 'ON'], correct: 'OPTION' },
        ],
        ['WITH CHECK OPTION — the boundary guard.', 'WITH CHECK OPTION — boundary ka guard.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The lens: create view cod_payments over COD payments (simple), then count them via the view (aliased n).',
          'Lens: cod_payments view banao COD payments par (simple), phir view se count karo (aliased n).',
        ],
        sol: "DROP VIEW IF EXISTS cod_payments;\nCREATE VIEW cod_payments AS SELECT * FROM payments WHERE payment_method = 'cod';\nSELECT COUNT(*) AS n FROM cod_payments;",
        hints: [
          ['Create then count.', 'Pehle create, phir count.'],
          ['Run both statements together; the validator checks the final state.', 'Dono statements saath chalao; validator final state check karta hai.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: 'SELECT COUNT(*) AS n FROM cod_payments',
      }),
      task({
        d: 'easy',
        desc: [
          'The read-only lesson: create view upi_hi (UPI payments above 100000), then ATTEMPT an update through it (UPDATE upi_hi SET amount = amount WHERE id = 104) — SQLite refuses with "cannot modify upi_hi because it is a view"; that error IS the lesson. Then do it the right way: update the BASE table (payments, id 104, self-assignment) and SELECT the row through the view (id, amount).',
          'Read-only ka sabak: upi_hi view banaо (100000 se upar UPI payments), phir uske through update TRY karo (UPDATE upi_hi SET amount = amount WHERE id = 104) — SQLite "cannot modify upi_hi because it is a view" ke saath mana karta hai; wahi error hi sabak hai. Phir sahi tarika: BASE table update karo (payments, id 104, self-assignment) aur view se row SELECT karo (id, amount).',
        ],
        sol: "DROP VIEW IF EXISTS upi_hi;\nCREATE VIEW upi_hi AS SELECT * FROM payments WHERE payment_method = 'upi' AND amount > 100000;\nUPDATE upi_hi SET amount = amount WHERE id = 104;\nUPDATE payments SET amount = amount WHERE id = 104;\nSELECT id, amount FROM upi_hi WHERE id = 104;",
        hints: [
          ['The UPDATE through the view is EXPECTED to fail — that error is the demonstration.', 'View ke through UPDATE ka FAIL hona expected hai — wahi error demonstration hai.'],
          ['After the refused update, write to payments (the base table) instead, then read through the view.', 'Manа hone ke baad payments (base table) me likho, phir view se padho.'],
          ['The final SELECT through upi_hi proves the view reflects the base table perfectly.', 'upi_hi se aakhri SELECT saabit karta hai ki view base table ko perfectly reflect karta hai.'],
        ],
        verifyQuery: 'SELECT id, amount FROM upi_hi WHERE id = 104',
      }),
      task({
        d: 'medium',
        desc: [
          'The guard philosophy (SQLite style): create view cod_guard (COD payments only — no WITH CHECK OPTION, which SQLite does not support), then update the BASE table in a way that ejects the row from the view\'s world: UPDATE payments SET payment_method = \'upi\' WHERE id = 1. Then count the rows still inside the view (SELECT COUNT(*) AS still_cod FROM cod_guard) — id 1 has vanished from the view (alive in the table, outside the filter). This is exactly what WITH CHECK OPTION blocks in other engines; SQLite leaves the discipline to you.',
          'Guard ka falsafa (SQLite style): cod_guard view banaо (sirf COD payments — WITH CHECK OPTION nahi, jo SQLite support nahi karta), phir BASE table ko aise update karo jo row ko view ki duniya se bahar nikale: UPDATE payments SET payment_method = \'upi\' WHERE id = 1. Phir view ke andar bachi rows gino (SELECT COUNT(*) AS still_cod FROM cod_guard) — id 1 view se gayab (table me zinda, filter ke bahar). Yahi WITH CHECK OPTION doosre engines me rokta hai; SQLite discipline aap par chhodta hai.',
        ],
        sol: "DROP VIEW IF EXISTS cod_guard;\nCREATE VIEW cod_guard AS SELECT * FROM payments WHERE payment_method = 'cod';\nUPDATE payments SET payment_method = 'upi' WHERE id = 1;\nSELECT COUNT(*) AS still_cod FROM cod_guard;",
        hints: [
          ['Update payments (the base table), not the view — views refuse writes in SQLite.', 'payments (base table) update karo, view nahi — SQLite me views likhna mana karte hain.'],
          ['The view is a live filter: rows whose rail changes away from \'cod\' disappear from it.', 'View live filter hai: jiska rail \'cod\' se badla wo usse gayab ho jaata hai.'],
          ['SELECT COUNT(*) FROM cod_guard counts only rows still inside the filter.', 'SELECT COUNT(*) FROM cod_guard sirf filter ke andar wali rows ginta hai.'],
        ],
        verifyQuery: "SELECT COUNT(*) AS still_cod FROM cod_guard",
      }),
      task({
        d: 'hard',
        desc: [
          'The refresh proof: create view big_p (payments above 200000), update the BASE table row 2 with a real but harmless change (amount = amount + 1), then SELECT id, amount FROM big_p WHERE id = 2 — the view shows the NEW value instantly, proving views are live queries over the base table, not stale copies.',
          'Refresh ka saboot: big_p view banaо (200000 se upar payments), BASE table ki row 2 me real par harmless change karo (amount = amount + 1), phir SELECT id, amount FROM big_p WHERE id = 2 — view naya value turant dikhata hai; saabit hota hai ki views stale copy nahi, base table par live queries hain.',
        ],
        sol: "DROP VIEW IF EXISTS big_p;\nCREATE VIEW big_p AS SELECT * FROM payments WHERE amount > 200000;\nUPDATE payments SET amount = amount + 1 WHERE id = 2;\nSELECT id, amount FROM big_p WHERE id = 2;",
        hints: [
          ['Write to payments, read through big_p — the canonical SQLite workflow.', 'payments me likho, big_p se padho — SQLite ka canonical workflow.'],
          ['amount + 1 is a real change (the view MUST reflect it) yet harmless for validation.', 'amount + 1 asli change hai (view use reflect KARE) aur validation ke liye harmless.'],
          ['The selected amount is one greater than the original — freshness proven.', 'Selected amount original se ek zyada hai — freshness saabit.'],
        ],
        verifyQuery: 'SELECT id, amount FROM big_p WHERE id = 2',
      }),
      task({
        d: 'very_hard',
        desc: [
          'The full view lifecycle: DROP VIEW IF EXISTS cod_payments; CREATE VIEW cod_payments (COD payments); attempt the view-write once (UPDATE cod_payments SET amount = amount WHERE id = 50 — refused, as always in SQLite); write on the BASE table instead (UPDATE payments SET amount = amount WHERE id = 50); finally SELECT id, payment_method FROM cod_payments WHERE id = 50 — the whole script in one submission.',
          'Poora view lifecycle: DROP VIEW IF EXISTS cod_payments; CREATE VIEW cod_payments (COD payments); view-write ek baar try karo (UPDATE cod_payments SET amount = amount WHERE id = 50 — mana, jaise SQLite me hamesha); uski jagah BASE table par likho (UPDATE payments SET amount = amount WHERE id = 50); aakhir me SELECT id, payment_method FROM cod_payments WHERE id = 50 — poora script ek submission me.',
        ],
        sol: "DROP VIEW IF EXISTS cod_payments;\nCREATE VIEW cod_payments AS SELECT * FROM payments WHERE payment_method = 'cod';\nUPDATE cod_payments SET amount = amount WHERE id = 50;\nUPDATE payments SET amount = amount WHERE id = 50;\nSELECT id, payment_method FROM cod_payments WHERE id = 50;",
        hints: [
          ['Drop → create → attempt → base-write → verify: the deployment rhythm.', 'Drop → create → attempt → base-write → verify: deployment ka rhythm.'],
          ['The refused view-write mid-script is expected; later statements still run.', 'Beech me view-write ka mana hona expected hai; baad wale statements phir bhi chalte hain.'],
          ['The final SELECT through the view completes the lifecycle.', 'View se aakhri SELECT lifecycle poora karta hai.'],
        ],
        verifyQuery: "SELECT id, payment_method FROM cod_payments WHERE id = 50",
      }),
    ],
  }),

  defineModule({
    n: 52,
    title: ['Indexes', 'Indexes'],
    time: '30 min',
    concepts: ['index', 'create index', 'b-tree', 'lookup speed', 'full scan', 'write cost', 'explain query plan'],
    diagram: 'index-tree',
    objectives: [
      ['Create and drop indexes', 'Indexes banana aur hatana'],
      ['Understand B-tree lookups vs full scans', 'B-tree lookup aur full scan ka farak samajhna'],
      ['Read EXPLAIN QUERY PLAN output', 'EXPLAIN QUERY PLAN output padhna'],
    ],
    theory: [
      section(
        ['Why indexes exist', 'Indexes kyun exist karte hain'],
        [
          [
            'Without an index, finding "the customer named Swati" means reading EVERY row — a full table scan. Fine at 100 rows, catastrophic at 100 million. An index is a sorted auxiliary structure (a B-tree) keyed on one or more columns: the engine descends the tree in a handful of steps and lands directly on the matching rows — O(log n) instead of O(n).',
            'Index ke bina "Swati naam ka customer" dhoondhna har row padhna — full table scan. 100 rows par theek, 10 karod par aafat. Index ek sorted auxiliary structure hai (B-tree) ek ya zyada columns par keyed: engine chand steps me tree utarta hai aur seedha matching rows par land karta hai — O(n) ki jagah O(log n).',
          ],
          [
            'The trade is storage and write cost: every INSERT/UPDATE/DELETE must also maintain each index tree. Read-heavy columns earn their index; volatile tables with unused indexes pay rent for nothing. Indexing is engineering judgement, not decoration.',
            'Sauda hai storage aur write ka daam: har INSERT/UPDATE/DELETE ko har index tree bhi sambhalna padta hai. Read-heavy columns apna index kamate hain; badalte tables with bekaar indexes bina kaam ke kira dete hain. Indexing engineering ka faisla hai, decoration nahi.',
          ],
        ],
        [],
        'index-tree'
      ),
      section(
        ['Seeing it work', 'Ise kaam karte dekhna'],
        [
          [
            'EXPLAIN QUERY PLAN reveals the engine\'s choice: without an index you see "SCAN customers"; with an index on city you see "SEARCH customers USING INDEX … (city=?)". That single line tells you a query just got thousands of times faster at scale. You will read plans properly in Module 57 — here you meet the tool.',
            'EXPLAIN QUERY PLAN engine ka faisla dikhata hai: index ke bina "SCAN customers" dikhta hai; city par index ke saath "SEARCH customers USING INDEX … (city=?)". Ek hi line batati hai ki query scale par hazaaron guna fast ho gayi. Plans Module 57 me poore padhenge — yahan tool se m hota hai.',
          ],
          [
            'Our seed databases already ship indexes (idx_orders_customer and friends) — the schema panel shows them. Composite indexes (idx_inventory_product_time) cover multi-column lookups in one tree — order matters: (product_id, timestamp) serves product-first lookups, not timestamp-first.',
            'Hamare seed databases indexes ke saath aate hain (idx_orders_customer waghera) — schema panel dikhata hai. Composite indexes (idx_inventory_product_time) multi-column lookups ek tree me cover karte hain — order matter karta hai: (product_id, timestamp) product-first lookups serve karta hai, timestamp-first nahi.',
          ],
        ],
        [
          ['Index = sorted B-tree = fast directed lookups', 'Index = sorted B-tree = fast directed lookups'],
          ['Indexes cost writes and space — index deliberately', 'Indexes writes aur space khaate hain — jaan-boojh kar index karo'],
          ['EXPLAIN QUERY PLAN shows SCAN vs SEARCH USING INDEX', 'EXPLAIN QUERY PLAN SCAN vs SEARCH USING INDEX dikhata hai'],
        ]
      ),
    ],
    tutorial: {
      title: ['Scan vs search', 'Scan vs search'],
      steps: [
        step(null, [
          'Watch a query transform from SCAN to SEARCH the moment an index appears.',
          'Ek query ka SCAN se SEARCH me badalta dekho, jaise hi index aata hai.',
        ]),
        step("EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 42;", [
          'With the shipped index: SEARCH using idx_orders_customer — directed.',
          'Shipped index ke saath: idx_orders_customer se SEARCH — directed.',
        ], { table: 'orders' }),
        step('CREATE INDEX idx_products_price ON products(price);\nEXPLAIN QUERY PLAN SELECT * FROM products WHERE price > 40000;', [
          'A fresh index on price — range lookups now use the tree.',
          'Price par naya index — ab range lookups tree use karti hain.',
        ], { table: 'products' }),
        step('DROP INDEX idx_products_price;\nEXPLAIN QUERY PLAN SELECT * FROM products WHERE price > 40000;', [
          'Index removed — the engine falls back to a full scan. Speed is a choice you make.',
          'Index hata — engine full scan par wapas. Speed aapka faisla hai.',
        ], { table: 'products' }),
        step('EXPLAIN QUERY PLAN SELECT * FROM inventory_log WHERE product_id = 43 ORDER BY timestamp;', [
          'The composite index (product_id, timestamp) serves both the filter AND the order — a two-for-one.',
          'Composite index (product_id, timestamp) filter AUR order dono serve karta hai — do-ka-ek.',
        ], { run: true, table: 'inventory_log' }),
      ],
    },
    syntax: {
      template: 'CREATE [UNIQUE] INDEX index_name ON table(col1 [, col2, …]);\nDROP INDEX index_name;\nEXPLAIN QUERY PLAN SELECT …;',
      parts: [
        { part: 'CREATE INDEX', description: ['Builds the B-tree', 'B-tree banata hai'] },
        { part: 'UNIQUE', description: ['Also enforces uniqueness', 'Uniqueness bhi enforce karta hai'] },
        { part: 'EXPLAIN QUERY PLAN', description: ['Shows SCAN vs SEARCH USING INDEX', 'SCAN vs SEARCH USING INDEX dikhata hai'] },
      ],
    },
    examples: [
      example('very_easy', 'CREATE INDEX idx_products_price ON products(price);', [
        'A plain index on price — range queries accelerate.',
        'Price par aam index — range queries tez.',
      ]),
      example('easy', 'CREATE UNIQUE INDEX idx_customers_email ON customers(email);', [
        'A UNIQUE index enforces one email per customer — constraint plus speed.',
        'UNIQUE index ek customer ek email enforce karta hai — constraint plus speed.',
      ]),
      example('medium', 'CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);', [
        'A composite index — customer-first, date-second lookups.',
        'Composite index — customer pehle, date doosra lookups.',
      ]),
      example('hard', "EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 7 AND order_date >= '2023-06-01';", [
        'Reading the plan: does it use the index? (Run it and read the output!)',
        'Plan padhna: kya index use hota hai? (Chalao aur output padho!)',
      ]),
    ],
    mistakes: [
      mistake(
        ['Indexing every column "for speed"', 'Har column par "speed ke liye" index lagana'],
        ['Each index slows writes and eats space. Index the columns your queries actually filter and join on — and prove it with EXPLAIN.', 'Har index writes slow karta hai aur space khata hai. Un columns par index lagao jin par aapki queries sach me filter aur join karti hain — aur EXPLAIN se saabit karo.']
      ),
      mistake(
        ['Composite index column order forgotten', 'Composite index ka column order bhool jaana'],
        ['(a, b) serves WHERE a = … and WHERE a = … AND b = …, but NOT WHERE b = … alone. Leading column must appear in the lookup.', '(a, b) serve karta hai WHERE a = … aur WHERE a = … AND b = …, par WHERE b = … akela nahi. Leading column lookup me aana chahiye.']
      ),
      mistake(
        ['Assuming the index will be used', 'Yeh maanna ki index use hoga hi'],
        ['The planner chooses based on statistics; small tables often scan anyway (cheaper than tree descent). EXPLAIN QUERY PLAN is the only truth.', 'Planner statistics par faisla karta hai; chhoti tables aksar phir bhi scan karti hain (tree utarne se sasta). EXPLAIN QUERY PLAN hi akeli sachchai hai.']
      ),
    ],
    summary: [
      ['Indexes are sorted structures for directed lookups', 'Indexes directed lookups ke liye sorted structures hain'],
      ['They cost writes and storage — choose deliberately', 'Ye writes aur storage ka daam dete hain — jaan-boojh kar chuno'],
      ['Composite index order: leading column must be filtered', 'Composite index ka order: leading column filter hona chahiye'],
      ['EXPLAIN QUERY PLAN proves usage', 'EXPLAIN QUERY PLAN use saabit karta hai'],
    ],
    quiz: [
      mcq(
        ['What does an index primarily speed up?', 'Index mukhya roop se kya tez karta hai?'],
        [
          ['INSERT statements', 'INSERT statements'],
          ['Row lookups by indexed column values (WHERE, JOIN keys)', 'Indexed column values se row lookups (WHERE, JOIN keys)'],
          ['Disk backups', 'Disk backups'],
          ['Network transfer', 'Network transfer'],
        ],
        1,
        ['Indexes turn scans into tree descents for filtered lookups — at the cost of slower writes.', 'Index scans ko tree descent me badal dete hain filtered lookups ke liye — writes slow hone ke daam par.']
      ),
      outputQ(
        "EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 1;",
        ['What does the plan say (with the shipped index present)?', 'Plan kya kehta hai (shipped index maujood hone par)?'],
        [
          { label: 'A', result: { columns: ['id', 'parent', 'notused', 'detail'], rows: [[3, 0, 0, 'SEARCH orders USING INDEX idx_orders_customer (customer_id=?)']] } },
          { label: 'B', result: { columns: ['id', 'parent', 'notused', 'detail'], rows: [[2, 0, 0, 'SCAN orders']] } },
          { label: 'C', result: { error: 'Error: near "EXPLAIN": syntax error' } },
          { label: 'D', result: { columns: ['detail'], rows: [['USE INDEX orders']] } },
        ],
        0,
        ['The shipped idx_orders_customer converts the scan into a directed SEARCH.', 'Shipped idx_orders_customer scan ko directed SEARCH me badal deta hai.']
      ),
      buildQ(
        ['Build: an index on product price', 'Banao: product price par index'],
        ['CREATE', 'INDEX', 'idx_products_price', 'ON', 'products', '(', 'price', ')'],
        ['CREATE', 'INDEX', 'idx_products_price', 'ON', 'products', '(', 'price', ')'],
        ['CREATE INDEX name ON table(column).', 'CREATE INDEX naam ON table(column).']
      ),
      blanksQ(
        'CREATE ___ idx_x ON t(col); ___ INDEX idx_x;',
        [
          { options: ['INDEX', 'VIEW', 'TABLE'], correct: 'INDEX' },
          { options: ['DROP', 'DELETE', 'REMOVE'], correct: 'DROP' },
        ],
        ['Indexes are created and dropped — never updated in place.', 'Indexes bante aur girtе hain — kabhi jagah par update nahi hote.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The price index: create idx_products_price on products(price), then prove it with EXPLAIN QUERY PLAN for price > 40000 (submit both statements).',
          'Price index: products(price) par idx_products_price banao, phir price > 40000 ke liye EXPLAIN QUERY PLAN se saabit karo (dono statements submit karo).',
        ],
        sol: 'DROP INDEX IF EXISTS idx_products_price;\nCREATE INDEX idx_products_price ON products(price);\nEXPLAIN QUERY PLAN SELECT * FROM products WHERE price > 40000;',
        hints: [
          ['CREATE INDEX, then EXPLAIN QUERY PLAN.', 'Pehle CREATE INDEX, phir EXPLAIN QUERY PLAN.'],
          ['Run both statements together; the validator checks the final state.', 'Dono statements saath chalao; validator final state check karta hai.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: "SELECT name FROM sqlite_master WHERE type='index' AND name='idx_products_price'",
        rules: { checkColumnNames: false },
      }),
      task({
        d: 'easy',
        desc: [
          'The email guard: create a UNIQUE index idx_customers_email on customers(email), then verify it exists via sqlite_master (one row: name).',
          'Email guard: customers(email) par UNIQUE index idx_customers_email banao, phir sqlite_master se verify karo (ek row: name).',
        ],
        sol: 'CREATE UNIQUE INDEX idx_customers_email ON customers(email);\nSELECT name FROM sqlite_master WHERE type = \'index\' AND name = \'idx_customers_email\';',
        hints: [
          ['UNIQUE goes between CREATE and INDEX.', 'UNIQUE, CREATE aur INDEX ke beech aata hai.'],
          ['Run both statements together; the validator checks the final state.', 'Dono statements saath chalao; validator final state check karta hai.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: "SELECT name FROM sqlite_master WHERE type='index' AND name='idx_customers_email'",
      }),
      task({
        d: 'medium',
        desc: [
          'The composite: create idx_orders_customer_date on orders(customer_id, order_date), then EXPLAIN QUERY PLAN for customer_id = 7 AND order_date >= \'2023-06-01\' — submit both.',
          'Composite: orders(customer_id, order_date) par idx_orders_customer_date banao, phir customer_id = 7 AND order_date >= \'2023-06-01\' ke liye EXPLAIN QUERY PLAN — dono submit karo.',
        ],
        sol: "DROP INDEX IF EXISTS idx_orders_customer_date;\nCREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);\nEXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 7 AND order_date >= '2023-06-01';",
        hints: [
          ['Two columns, one index, leading column filtered first.', 'Do columns, ek index, leading column pehle filtered.'],
          ['Run both statements together; the validator checks the final state.', 'Dono statements saath chalao; validator final state check karta hai.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: "SELECT name FROM sqlite_master WHERE type='index' AND name='idx_orders_customer_date'",
      }),
      task({
        d: 'hard',
        desc: [
          'The lifecycle: DROP INDEX IF EXISTS idx_products_price; CREATE it again; then EXPLAIN QUERY PLAN the lookup price < 1000 — the full script in one submission.',
          'Lifecycle: DROP INDEX IF EXISTS idx_products_price; dobara CREATE karo; phir price < 1000 lookup par EXPLAIN QUERY PLAN — poora script ek submission me.',
        ],
        sol: 'DROP INDEX IF EXISTS idx_products_price;\nCREATE INDEX idx_products_price ON products(price);\nEXPLAIN QUERY PLAN SELECT * FROM products WHERE price < 1000;',
        hints: [
          ['Drop-guard, create, explain — the idempotent pattern.', 'Drop-guard, create, explain — idempotent pattern.'],
          ['Run both statements together; the validator checks the final state.', 'Dono statements saath chalao; validator final state check karta hai.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: "SELECT name FROM sqlite_master WHERE type='index' AND name='idx_products_price'",
      }),
      task({
        d: 'very_hard',
        desc: [
          'The analyst index: create a composite index on inventory_log(product_id, timestamp), then EXPLAIN QUERY PLAN for product_id = 43 ORDER BY timestamp — proving one tree serves filter AND sort. Submit both statements.',
          'Analyst index: inventory_log(product_id, timestamp) par composite index banao, phir product_id = 43 ORDER BY timestamp ke liye EXPLAIN QUERY PLAN — ek tree filter AUR sort dono serve karta hai. Dono statements submit karo.',
        ],
        sol: 'DROP INDEX IF EXISTS idx_inv_analysis;\nCREATE INDEX idx_inv_analysis ON inventory_log(product_id, timestamp);\nEXPLAIN QUERY PLAN SELECT * FROM inventory_log WHERE product_id = 43 ORDER BY timestamp;',
        hints: [
          ['The existing composite (idx_inventory_product_time) proves the pattern; your duplicate index is fine for practice.', 'Maujuda composite (idx_inventory_product_time) pattern saabit karta hai; aapka duplicate index practice ke liye theek hai.'],
          ['Run both statements together; the validator checks the final state.', 'Dono statements saath chalao; validator final state check karta hai.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: "SELECT name FROM sqlite_master WHERE type='index' AND name='idx_inv_analysis'",
      }),
    ],
  }),
];
