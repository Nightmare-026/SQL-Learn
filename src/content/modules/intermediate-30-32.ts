'use client';

// Modules 30-32: Mini Project 2 (Sales Analytics) · SELECT Subqueries · EXISTS

import { defineModule, section, step, example, mistake, mcq, outputQ, buildQ, blanksQ, task } from './builder';
import type { Module } from '@/types/content';

export const modules: Module[] = [
  defineModule({
    n: 30,
    title: ['🎯 Mini Project 2: Sales Analytics', '🎯 Mini Project 2: Sales Analytics'],
    time: '30 min',
    concepts: ['project', 'sales analytics', 'aggregates', 'group by', 'having', 'subquery', 'revenue'],
    diagram: 'group-buckets',
    objectives: [
      ['Solve six sales-analytics requests with aggregates, grouping and subqueries', 'Aggregates, grouping aur subqueries se chhe sales-analytics requests solve karna'],
      ['Compute real KPIs: revenue, AOV, top spenders, month trends', 'Asli KPIs compute karna: revenue, AOV, top spenders, month trends'],
      ['Think in metrics — the language of the analytics team', 'Metrics ki bhasha me sochna — analytics team ki language'],
    ],
    theory: [
      section(
        ['The analytics desk', 'Analytics desk'],
        [
          [
            'You have joined the analytics team of the e-commerce shop. Six requests sit in the queue, each phrased as a business question: total revenue, revenue per rail, big customers, product performance, monthly trend, and one funnel metric. Every request maps to the aggregate toolkit you just built — aggregates, GROUP BY, HAVING and subqueries — plus the JOIN patterns you have seen in previews.',
            'Aap e-commerce shop ki analytics team me jud gaye hain. Queue me chhe requests hain, har ek business sawal ki tarah: total revenue, rail-wise revenue, bade customers, product performance, monthly trend, aur ek funnel metric. Har request usi aggregate toolkit par baithti hai jo aapne abhi banaya — aggregates, GROUP BY, HAVING aur subqueries — plus JOIN patterns jo previews me dikhe.',
          ],
          [
            'The professional loop for analytics requests: restate the metric in plain words ("revenue = SUM of payments"), choose the grain ("per month" ⇒ group by month expression), apply gates ("only rails with 100+ payments" ⇒ HAVING), and round money to 2 decimals for presentation. Numbers persuade only when they are trustworthy AND readable.',
            'Analytics requests ka professional loop: metric ko saaf shabdon me dohrao ("revenue = payments ka SUM"), grain chuno ("per month" ⇒ month expression se group), gates lagao ("sirf 100+ payments wali rails" ⇒ HAVING), aur presentation ke liye paisa 2 decimals par round karo. Numbers tabhi persuade karte hain jab wo bharosemand AUR padhne-layak hon.',
          ],
        ],
        [
          ['Metric → expression · grain → GROUP BY · gate → HAVING', 'Metric → expression · grain → GROUP BY · gate → HAVING'],
          ['Round money for humans, keep exactness for math', 'Insaan ke liye paisa round karo, maths ke liye exact rakho'],
          ['The join trio customers→orders→payments powers revenue work', 'customers→orders→payments join trio revenue kaam chalata hai'],
        ],
        []
      ),
    ],
    tutorial: {
      title: ['The revenue line', 'Revenue line'],
      steps: [
        step(null, [
          'Warm up the loop on the headline metric: lifetime revenue, then revenue per payment rail.',
          'Headline metric par loop warm up karo: lifetime revenue, phir har rail ki revenue.',
        ]),
        step('SELECT ROUND(SUM(amount), 2) AS lifetime_revenue FROM payments;', [
          'One number every stakeholder knows by heart.',
          'Ek number jo har stakeholder ratna jaanta hai.',
        ], { table: 'payments' }),
        step('SELECT payment_method, ROUND(SUM(amount), 2) AS revenue FROM payments GROUP BY payment_method ORDER BY revenue DESC;', [
          'The same metric at rail grain, sorted.',
          'Wahi metric rail grain par, sorted.',
        ], { table: 'payments' }),
        step("SELECT c.name, ROUND(SUM(p.amount), 2) AS spend FROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id GROUP BY c.id ORDER BY spend DESC LIMIT 5;", [
          'Top spenders — the VIP watchlist.',
          'Top spenders — VIP watchlist.',
        ], { table: 'customers' }),
        step("SELECT substr(o.order_date, 1, 7) AS month, ROUND(SUM(p.amount), 2) AS revenue FROM orders o JOIN payments p ON p.order_id = o.id GROUP BY substr(o.order_date, 1, 7) ORDER BY month LIMIT 6;", [
          'The monthly revenue line — chart-ready.',
          'Monthly revenue line — chart-ready.',
        ], { run: true, table: 'orders' }),
      ],
    },
    syntax: {
      template: '-- The analytics template:\nSELECT dim, ROUND(AGG(metric), 2) AS alias\nFROM joins…\n[WHERE …]\nGROUP BY dim\n[HAVING gate]\nORDER BY …;',
      parts: [
        { part: 'dim', description: ['The dimension/grain column', 'Dimension/grain column'] },
        { part: 'ROUND(AGG(…), 2)', description: ['The metric, human-rounded', 'Metric, insaan ke hisaab se rounded'] },
        { part: 'HAVING gate', description: ['Business thresholds on the metric', 'Metric par business thresholds'] },
      ],
    },
    examples: [
      example('easy', 'SELECT ROUND(SUM(amount), 2) AS revenue FROM payments WHERE payment_method = \'upi\';', [
        'One rail\'s contribution to the top line.',
        'Top line me ek rail ka yogdaan.',
      ]),
      example('medium', 'SELECT status, COUNT(*) AS orders FROM orders GROUP BY status ORDER BY orders DESC;', [
        'Pipeline distribution, sorted by load.',
        'Pipeline distribution, load se sorted.',
      ]),
      example('hard', "SELECT c.customer_type, ROUND(AVG(p.amount), 2) AS avg_order FROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id GROUP BY c.customer_type ORDER BY avg_order DESC;", [
        'Average order value by tier — do richer customers pay more per order?',
        'Tier-wise average order value — kya ameer customers har order par zyada dete hain?',
      ]),
    ],
    mistakes: [
      mistake(
        ['Averaging sums (the ratio trap)', 'Sums ka average lena (ratio trap)'],
        ['AVERAGE of per-customer sums ≠ overall average — the denominator changes. Compute AVG on the base rows, or on correctly grouped data, never on pre-summed rows.', 'Per-customer sums ka AVERAGE ≠ overall average — denominator badal jaata hai. AVG base rows par ya sahi grouped data par compute karo, kabhi pre-summed rows par nahi.']
      ),
      mistake(
        ['Forgetting to join payments and then summing order amounts', 'Payments join karna bhool kar order amounts sum karna'],
        ['Orders carry status, not money; amounts live in payments (and order_items). Join the money table before any SUM.', 'Orders me status hota hai, paisa nahi; amounts payments (aur order_items) me hain. Kisi bhi SUM se pehle money table join karo.']
      ),
      mistake(
        ['Ungrouped labels in grouped reports', 'Grouped reports me ungrouped labels'],
        ['Every dimension in the SELECT must reappear in GROUP BY — the golden rule from Module 25 holds in every project query.', 'SELECT ka har dimension GROUP BY me wapas aana chahiye — Module 25 ka golden rule har project query me lagu hai.']
      ),
    ],
    summary: [
      ['Six requests, the full aggregate toolkit, real KPIs', 'Chhe requests, poora aggregate toolkit, asli KPIs'],
      ['Metric · grain · gate · round — the analytics loop', 'Metric · grain · gate · round — analytics loop'],
      ['Revenue lives in payments; funnel lives across customers→orders', 'Revenue payments me rehta hai; funnel customers→orders ke paar'],
      ['Next: correlated subqueries and EXISTS', 'Aage: correlated subqueries aur EXISTS'],
    ],
    quiz: [
      mcq(
        ['Which expression gives lifetime revenue?', 'Lifetime revenue kaunsi expression deti hai?'],
        [
          ['SUM(amount) over payments', 'payments par SUM(amount)'],
          ['COUNT(*) over orders', 'orders par COUNT(*)'],
          ['MAX(amount) over payments', 'payments par MAX(amount)'],
          ['SUM(price) over products', 'products par SUM(price)'],
        ],
        0,
        ['Revenue is money actually paid — the sum of payment amounts.', 'Revenue wo paisa hai jo asli me paid hua — payment amounts ka sum.']
      ),
      outputQ(
        'SELECT payment_method, COUNT(*) AS uses FROM payments GROUP BY payment_method ORDER BY uses DESC LIMIT 1;',
        ['The most-used payment rail:', 'Sabse zyada use hone wala payment rail:'],
        [
          { label: 'A', result: { columns: ['payment_method', 'uses'], rows: [['netbanking', 107]] } },
          { label: 'B', result: { columns: ['payment_method', 'uses'], rows: [['upi', 104]] } },
          { label: 'C', result: { columns: ['payment_method', 'uses'], rows: [['cod', 95]] } },
          { label: 'D', result: { error: 'Error: near "LIMIT": syntax error' } },
        ],
        0,
        ['Netbanking leads usage at 107 payments; upi (104) and credit_card (103) follow.', 'Netbanking 107 payments ke saath usage me sabse aage; upi (104) aur credit_card (103) peechhe.']
      ),
      buildQ(
        ['Build: revenue per payment rail', 'Banao: har payment rail ki revenue'],
        ['payment_method', 'ROUND(SUM(amount), 2)', 'SELECT', 'FROM', 'payments', 'GROUP BY', 'AS', 'revenue', 'BY'],
        ['SELECT', 'payment_method', ',', 'ROUND', '(', 'SUM', '(', 'amount', ')', ',', '2', ')', 'AS', 'revenue', 'FROM', 'payments', 'GROUP', 'BY', 'payment_method'],
        ['Dimension, rounded metric, GROUP BY dimension.', 'Dimension, rounded metric, GROUP BY dimension.']
      ),
      blanksQ(
        'SELECT ___(amount) AS revenue FROM payments;',
        [{ options: ['SUM', 'COUNT', 'MIN', 'AVG'], correct: 'SUM' }],
        ['SUM of payment amounts is lifetime revenue.', 'Payment amounts ka SUM hi lifetime revenue hai.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'KPI 1 — Top line: lifetime total revenue from all payments, rounded to 2 decimals, aliased revenue.',
          'KPI 1 — Top line: saari payments se lifetime total revenue, 2 decimals par rounded, aliased revenue.',
        ],
        sol: 'SELECT ROUND(SUM(amount), 2) AS revenue FROM payments;',
        hints: [
          ['One aggregate on the money table.', 'Money table par ek aggregate.'],
          ['SELECT ROUND(SUM(amount), 2) AS revenue FROM payments;', 'SELECT ROUND(SUM(amount), 2) AS revenue FROM payments;'],
          ['≈ 38.97 million.', '≈ 38.97 million.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'easy',
        desc: [
          'KPI 2 — Rail revenue: revenue per payment method (rounded), sorted by revenue descending. Columns: payment_method, revenue.',
          'KPI 2 — Rail revenue: har payment method ki revenue (rounded), revenue se utarte sorted. Columns: payment_method, revenue.',
        ],
        sol: 'SELECT payment_method, ROUND(SUM(amount), 2) AS revenue FROM payments GROUP BY payment_method ORDER BY revenue DESC;',
        hints: [
          ['Group by rail, round the sum, sort the result.', 'Rail se group, sum ko round, result ko sort.'],
          ['SELECT payment_method, ROUND(SUM(amount), 2) AS revenue FROM payments GROUP BY payment_method ORDER BY revenue DESC;', 'SELECT payment_method, ROUND(SUM(amount), 2) AS revenue FROM payments GROUP BY payment_method ORDER BY revenue DESC;'],
          ['netbanking leads on both usage and revenue.', 'netbanking usage aur revenue dono me sabse aage.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'medium',
        desc: [
          'KPI 3 — Order status load: for each order status, the order count and total revenue collected on that status\'s orders, sorted by orders descending. Columns: status, orders, revenue. (Join orders→payments; round revenue.)',
          'KPI 3 — Order status load: har order status ke liye order count aur us status ke orders par total revenue, orders se utarte sorted. Columns: status, orders, revenue. (orders→payments join; revenue round.)',
        ],
        sol: 'SELECT o.status, COUNT(*) AS orders, ROUND(SUM(p.amount), 2) AS revenue\nFROM orders o JOIN payments p ON p.order_id = o.id\nGROUP BY o.status ORDER BY orders DESC;',
        hints: [
          ['Two aggregates at status grain over the joined pair.', 'Joined pair par status grain me do aggregates.'],
          ['SELECT o.status, COUNT(*) AS orders, ROUND(SUM(p.amount),2) AS revenue FROM orders o JOIN payments p ON p.order_id = o.id GROUP BY o.status ORDER BY orders DESC;', 'SELECT o.status, COUNT(*) AS orders, ROUND(SUM(p.amount),2) AS revenue FROM orders o JOIN payments p ON p.order_id = o.id GROUP BY o.status ORDER BY orders DESC;'],
          ['pending and cancelled (105 each) lead the counts.', 'pending aur cancelled (105-105) counts me aage.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'KPI 4 — VIP revenue line: total revenue from orders placed by VIP customers only, rounded, aliased vip_revenue. (Join customers→orders→payments.)',
          'KPI 4 — VIP revenue line: sirf VIP customers ke orders se total revenue, rounded, aliased vip_revenue. (customers→orders→payments join.)',
        ],
        sol: "SELECT ROUND(SUM(p.amount), 2) AS vip_revenue\nFROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id\nWHERE c.customer_type = 'vip';",
        hints: [
          ['Filter the tier BEFORE aggregating — WHERE, not HAVING.', 'Aggregate se PEHLE tier filter karo — WHERE, HAVING nahi.'],
          ["SELECT ROUND(SUM(p.amount), 2) AS vip_revenue FROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id WHERE c.customer_type = 'vip';", "SELECT ROUND(SUM(p.amount), 2) AS vip_revenue FROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id WHERE c.customer_type = 'vip';"],
          ['15 VIPs generate a hefty share of the top line.', '15 VIPs top line ka bada hissa banate hain.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'hard',
        desc: [
          'KPI 5 — The monthly line: revenue per month (substr of order_date to YYYY-MM), rounded, sorted by month. Columns: month, revenue. (Join orders→payments.)',
          'KPI 5 — Monthly line: har mahine ki revenue (order_date ka substr YYYY-MM tak), rounded, month se sorted. Columns: month, revenue. (orders→payments join.)',
        ],
        sol: "SELECT substr(o.order_date, 1, 7) AS month, ROUND(SUM(p.amount), 2) AS revenue\nFROM orders o JOIN payments p ON p.order_id = o.id\nGROUP BY substr(o.order_date, 1, 7) ORDER BY month;",
        hints: [
          ['Group by the month expression on the ORDER date.', 'ORDER date par month expression se group karo.'],
          ["SELECT substr(o.order_date,1,7) AS month, ROUND(SUM(p.amount),2) AS revenue FROM orders o JOIN payments p ON p.order_id=o.id GROUP BY substr(o.order_date,1,7) ORDER BY month;", "SELECT substr(o.order_date,1,7) AS month, ROUND(SUM(p.amount),2) AS revenue FROM orders o JOIN payments p ON p.order_id=o.id GROUP BY substr(o.order_date,1,7) ORDER BY month;"],
          ['Twelve points on the line — chart-ready.', 'Line par barah points — chart-ready.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'KPI 6 — The heavy hitters: customers whose total spend exceeds the AVERAGE per-customer total spend. Show name and total (rounded, aliased total), sorted by total descending. (Nested pattern from Module 29 task 5 — inner average over per-customer sums.)',
          'KPI 6 — Heavy hitters: wo customers jinka total kharch per-customer average se zyada hai. Name aur total dikhao (rounded, aliased total), total se utarte sorted. (Module 29 task 5 ka nested pattern — per-customer sums par inner average.)',
        ],
        sol: 'SELECT c.name, ROUND(SUM(p.amount), 2) AS total\nFROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id\nGROUP BY c.id, c.name\nHAVING SUM(p.amount) > (\n  SELECT AVG(s) FROM (\n    SELECT SUM(p2.amount) AS s FROM payments p2 JOIN orders o2 ON o2.id = p2.order_id GROUP BY o2.customer_id\n  )\n)\nORDER BY total DESC;',
        hints: [
          ['Group per customer; gate against the nested average.', 'Per customer group karo; nested average se gate lagao.'],
          ['HAVING SUM(p.amount) > (SELECT AVG(s) FROM (SELECT SUM(p2.amount) AS s FROM … GROUP BY o2.customer_id));', 'HAVING SUM(p.amount) > (SELECT AVG(s) FROM (SELECT SUM(p2.amount) AS s FROM … GROUP BY o2.customer_id));'],
          ['About half the customer base — the big half — appears.', 'Lagbhag aadhi customer base — badi aadhi — dikhti hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),

  defineModule({
    n: 31,
    title: ['SELECT Subqueries', 'SELECT Subqueries'],
    time: '25 min',
    concepts: ['subquery', 'select list', 'correlated subquery', 'computed column', 'outer reference', 'per row'],
    diagram: 'subquery-nest',
    objectives: [
      ['Place subqueries in the SELECT list as computed columns', 'SELECT list me subqueries ko computed columns ki tarah rakhna'],
      ['Understand correlated subqueries: inner reading outer columns', 'Correlated subqueries samajhna: inner outer ke columns padhna'],
      ['Use per-row subqueries for comparisons beside data', 'Data ke saath comparison ke liye per-row subqueries use karna'],
    ],
    theory: [
      section(
        ['A column that is a query', 'Ek column jo khud query hai'],
      [
          [
            'You met scalar subqueries as fixed reference values (the average beside each product). Now the upgrade: the inner query can REFERENCE the outer row. For every product row, SELECT …, (SELECT COUNT(*) FROM order_items oi WHERE oi.product_id = p.id) AS times_ordered — a per-row count computed on the fly. This is a correlated subquery: correlated because the inner query\'s answer changes with each outer row.',
            'Aapne scalar subqueries fixed reference values ki tarah milda hai (har product ke saath average). Ab upgrade: inner query outer ROW ko reference kar sakti hai. Har product row ke liye, SELECT …, (SELECT COUNT(*) FROM order_items oi WHERE oi.product_id = p.id) AS times_ordered — ek per-row count jo turant compute hota hai. Yeh correlated subquery hai: correlated kyunki inner query ka jawab har outer row ke saath badalta hai.',
          ],
          [
            'Execution model: the engine walks the outer result row by row; for each, it runs the inner query with that row\'s values plugged in. With 200 products that is 200 tiny inner executions — fine at our scale, worth optimising at Google scale (indexes make each lookup fast; the Optimisation modules cover this).',
            'Execution model: engine outer result ko row-by-row chalta hai; har row ke liye inner query us row ki values daal kar chalata hai. 200 products par 200 chhoti inner executions — hamare scale par theek, Google scale par optimisation layak (indexes har lookup fast rakhte hain; Optimisation modules isse cover karte hain).',
          ],
        ],
        [],
        'subquery-nest'
      ),
      section(
        ['When to reach for correlation', 'Correlation kab use karna'],
        [
          [
            'The test: does the inner question depend on the outer row? "How many times was THIS product ordered?" — yes, correlated. "What is the average price overall?" — no, independent. Correlated subqueries shine for per-row lookups: counts, existence flags (next module), max-of-mine, latest-of-mine. When the same correlated pattern starts appearing everywhere, a JOIN with GROUP BY is often the cleaner refactor — both tools coexist in professional code.',
            'Test: kya inner sawal outer row par depend karta hai? "YE product kitni baar order hua?" — haan, correlated. "Overall average price kya hai?" — nahi, independent. Correlated subqueries per-row lookups ke liye best hain: counts, existence flags (agla module), max-of-mine, latest-of-mine. Jab wahi correlated pattern har jagah dikhne lage, to JOIN + GROUP BY aksar saaf refactor hota hai — dono tools professional code me saath jeete hain.',
          ],
        ],
        [
          ['Correlated: inner references outer columns', 'Correlated: inner outer ke columns reference karti hai'],
          ['Per-row execution — cost scales with outer size', 'Per-row execution — cost outer size ke saath badhta hai'],
          ['Independent subqueries compute once', 'Independent subqueries ek baar compute hoti hain'],
        ]
      ),
    ],
    tutorial: {
      title: ['Per-row answers', 'Per-row jawab'],
      steps: [
        step(null, [
          'The catalogue review wants each product\'s order frequency beside its name. Correlation time.',
          'Catalogue review har product ke naam ke saath uski order frequency chahta hai. Correlation ka time.',
        ]),
        step('SELECT name, price FROM products LIMIT 5;', [
          'Plain projection — the base we enrich next.',
          'Simple projection — jise hum aage bharte hain.',
        ], { table: 'products' }),
        step('SELECT name, price,\n  (SELECT COUNT(*) FROM order_items oi WHERE oi.product_id = p.id) AS times_ordered\nFROM products p LIMIT 6;', [
          'The inner query reads p.id — different answer per row.',
          'Inner query p.id padhti hai — har row par alag jawab.',
        ], { table: 'products' }),
        step('SELECT name, price,\n  (SELECT SUM(oi.quantity) FROM order_items oi WHERE oi.product_id = p.id) AS units_sold\nFROM products p ORDER BY units_sold DESC LIMIT 6;', [
          'Ranking by a per-row aggregate — best sellers via correlation.',
          'Per-row aggregate se ranking — correlation se best sellers.',
        ], { table: 'products' }),
        step('SELECT name, price,\n  (SELECT ROUND(AVG(r.rating), 1) FROM reviews r WHERE r.product_id = p.id) AS avg_rating\nFROM products p ORDER BY avg_rating DESC LIMIT 6;', [
          'Reviews live in the ADVANCED dataset — this one runs there (a preview of level 3).',
          'Reviews ADVANCED dataset me hain — yeh wahan chalti hai (level 3 ka preview).',
        ], { run: true, table: 'products' }),
      ],
    },
    syntax: {
      template: 'SELECT col,\n  (SELECT AGG(col2) FROM t2 WHERE t2.key = outer.key) AS alias\nFROM outer_table;',
      parts: [
        { part: '(SELECT …)', description: ['Computed column in the SELECT list', 'SELECT list me computed column'] },
        { part: 't2.key = outer.key', description: ['The correlation — inner reads outer row values', 'Correlation — inner outer row ki values padhti hai'] },
        { part: 'AS alias', description: ['Always name the computed column', 'Computed column ko hamesha naam do'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT name, (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) AS orders FROM customers c LIMIT 6;', [
        'Each customer\'s order count — the per-row lookup classic.',
        'Har customer ka order count — per-row lookup classic.',
      ]),
      example('easy', 'SELECT name, price, (SELECT ROUND(AVG(price), 2) FROM products) AS catalogue_avg FROM products p ORDER BY price DESC LIMIT 5;', [
        'Independent reference value beside each row (not correlated).',
        'Har row ke saath independent reference value (correlated nahi).',
      ]),
      example('medium', 'SELECT name,\n  (SELECT COUNT(*) FROM order_items oi WHERE oi.product_id = p.id) AS lines\nFROM products p ORDER BY lines DESC, name LIMIT 8;', [
        'Which products generated the most order lines?',
        'Kis products ne sabse zyada order lines banayi?',
      ]),
      example('hard', 'SELECT c.name,\n  (SELECT SUM(p2.amount) FROM payments p2 JOIN orders o2 ON o2.id = p2.order_id WHERE o2.customer_id = c.id) AS spend\nFROM customers c ORDER BY spend DESC LIMIT 5;', [
        'Per-customer lifetime spend as a correlated column — the VIP view.',
        'Per-customer lifetime spend correlated column ki tarah — VIP view.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Forgetting the correlation condition (inner scans everything)', 'Correlation condition bhool jaana (inner sab kuch scan karti hai)'],
        ['Without WHERE oi.product_id = p.id, every row gets the SAME global count — a silently wrong report. The correlation is the whole point.', 'WHERE oi.product_id = p.id ke bina har row ko SAME global count milta hai — chup-chaap galat report. Correlation hi asli point hai.']
      ),
      mistake(
        ['Multi-row correlated subqueries in the SELECT list', 'SELECT list me multi-row correlated subqueries'],
        ['The column slot needs one value per row — "row value misused" if the inner returns several. Use aggregates inside the inner query.', 'Column slot ko har row par ek value chahiye — inner kai de to "row value misused". Inner query ke andar aggregates use karo.']
      ),
      mistake(
        ['Correlating on the wrong join key', 'Galat join key par correlate karna'],
        ['product_id in order_items points at products.id; customer_id in orders points at customers.id. Wrong key = plausible-looking nonsense.', 'order_items ka product_id products.id ki taraf; orders ka customer_id customers.id ki taraf point karta hai. Galat key = sahi dikhne wala bakwas.']
      ),
    ],
    summary: [
      ['SELECT-list subqueries add computed columns per row', 'SELECT-list subqueries har row par computed columns jodti hain'],
      ['Correlated inner queries reference outer row columns', 'Correlated inner queries outer row ke columns reference karti hain'],
      ['Independent inner queries compute once, correlated per row', 'Independent inner ek baar, correlated har row par compute hoti hain'],
      ['Aggregates inside keep inner results single-valued', 'Andar aggregates inner results single-valued rakhte hain'],
    ],
    quiz: [
      mcq(
        ['What makes a subquery correlated?', 'Subquery correlated kya banata hai?'],
        [
          ['It uses JOIN inside', 'Iske andar JOIN use hota hai'],
          ['It references columns from the outer query', 'Wo outer query ke columns reference karti hai'],
          ['It returns multiple rows', 'Wo multiple rows laati hai'],
          ['It is written on one line', 'Wo ek line me likhi jaati hai'],
        ],
        1,
        ['Correlation = the inner query\'s answer depends on the current outer row.', 'Correlation = inner query ka jawab current outer row par depend karta hai.']
      ),
      outputQ(
        'SELECT name, (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) AS orders FROM customers c ORDER BY id LIMIT 2;',
        ['What appears beside the first two customers?', 'Pehle do customers ke saath kya dikhta hai?'],
        [
          { label: 'A', result: { columns: ['name', 'orders'], rows: [['Ananya Mehta', 3], ['Aisha Joshi', 7]] } },
          { label: 'B', result: { columns: ['name', 'orders'], rows: [['Ananya Mehta', 500]] } },
          { label: 'C', result: { columns: ['name'], rows: [['Ananya Mehta'], ['Aisha Joshi']] } },
          { label: 'D', result: { error: 'Error: no such column: c.id' } },
        ],
        0,
        ['Each customer gets their OWN order count — 3 for Ananya, 7 for Aisha (per-row answers).', 'Har customer ko APNA order count milta hai — Ananya ko 3, Aisha ko 7 (per-row jawab).']
      ),
      buildQ(
        ['Build: each product with its own order-line count', 'Banao: har product apni order-line count ke saath'],
        ['name', 'SELECT', 'FROM', 'products', '(', 'SELECT', 'COUNT(*)', 'order_items', 'oi.product_id = p.id', 'WHERE', ')', 'AS', 'lines', 'p'],
        ['SELECT', 'name', ',', '(', 'SELECT', 'COUNT', '(', '*', ')', 'FROM', 'order_items', 'WHERE', 'oi.product_id = p.id', ')', 'AS', 'lines', 'FROM', 'products', 'p'],
        ['Column, correlated count, alias; FROM products p for the reference.', 'Column, correlated count, alias; reference ke liye FROM products p.']
      ),
      blanksQ(
        'SELECT name, (___ COUNT(*) FROM order_items oi ___ oi.product_id = p.id) AS lines FROM products p;',
        [
          { options: ['SELECT', 'FROM', 'WHERE'], correct: 'SELECT' },
          { options: ['WHERE', 'ON', 'AND'], correct: 'WHERE' },
        ],
        ['Inner SELECT … WHERE correlation; outer alias p is referenced.', 'Inner SELECT … WHERE correlation; outer alias p reference hota hai.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Customer card: each customer\'s name and THEIR order count (correlated), aliased orders. LIMIT is not needed — the full list.',
          'Customer card: har customer ka naam aur USKA order count (correlated), aliased orders. LIMIT ki zaroorat nahi — poori list.',
        ],
        sol: 'SELECT name, (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) AS orders FROM customers c;',
        hints: [
          ['The inner query counts orders matching THIS customer.', 'Inner query IS customer ke orders ginta hai.'],
          ['Correlate with o.customer_id = c.id inside the inner WHERE.', 'Inner WHERE me o.customer_id = c.id se correlate karo.'],
          ['SELECT name, (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) AS orders FROM customers c;', 'SELECT name, (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) AS orders FROM customers c;'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'easy',
        desc: [
          'The busy catalogue: product names and how many order LINES each generated (correlated count on order_items), aliased lines — sorted by lines descending, name ascending. Columns: name, lines.',
          'Busy catalogue: product ke naam aur har ek ne kitni order LINES banayi (order_items par correlated count), aliased lines — lines se utarte, naam se chadhte sorted. Columns: name, lines.',
        ],
        sol: 'SELECT name, (SELECT COUNT(*) FROM order_items oi WHERE oi.product_id = p.id) AS lines FROM products p ORDER BY lines DESC, name;',
        hints: [
          ['Correlate on oi.product_id = p.id, then sort by the computed column.', 'oi.product_id = p.id par correlate karo, phir computed column se sort karo.'],
          ['SELECT name, (SELECT COUNT(*) FROM order_items oi WHERE oi.product_id = p.id) AS lines FROM products p ORDER BY lines DESC, name;', 'SELECT name, (SELECT COUNT(*) FROM order_items oi WHERE oi.product_id = p.id) AS lines FROM products p ORDER BY lines DESC, name;'],
          ['Nulls sort last in DESC in SQLite — products never ordered trail the list.', 'SQLite me DESC me NULL aakhir me aate hain — jo products kabhi order nahi hue wo list ke aakhir me hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'medium',
        desc: [
          'Spend power: each customer\'s name and lifetime spend (correlated SUM through orders→payments), rounded, aliased spend — sorted by spend descending. Columns: name, spend. Top 8 only.',
          'Spend power: har customer ka naam aur lifetime kharch (orders→payments se correlated SUM), rounded, aliased spend — spend se utarte sorted. Columns: name, spend. Sirf top 8.',
        ],
        sol: 'SELECT c.name, ROUND((SELECT SUM(p2.amount) FROM payments p2 JOIN orders o2 ON o2.id = p2.order_id WHERE o2.customer_id = c.id), 2) AS spend FROM customers c ORDER BY spend DESC LIMIT 8;',
        hints: [
          ['The inner query joins payments→orders filtered to THIS customer, then SUMs.', 'Inner query payments→orders join karke IS customer tak simat kar SUM leti hai.'],
          ['SELECT c.name, ROUND((SELECT SUM(p2.amount) FROM payments p2 JOIN orders o2 ON o2.id = p2.order_id WHERE o2.customer_id = c.id), 2) AS spend FROM customers c ORDER BY spend DESC LIMIT 8;', 'SELECT c.name, ROUND((SELECT SUM(p2.amount) FROM payments p2 JOIN orders o2 ON o2.id = p2.order_id WHERE o2.customer_id = c.id), 2) AS spend FROM customers c ORDER BY spend DESC LIMIT 8;'],
          ['Umesh Rao tops the board in this data.', 'Is data me Umesh Rao board par sabse upar hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'The units board: each product\'s name and TOTAL units sold (correlated SUM of quantity), aliased units — sorted by units descending, then name. Columns: name, units.',
          'Units board: har product ka naam aur TOTAL beche gaye units (quantity ka correlated SUM), aliased units — units se utarte, phir naam se sorted. Columns: name, units.',
        ],
        sol: 'SELECT name, (SELECT SUM(oi.quantity) FROM order_items oi WHERE oi.product_id = p.id) AS units FROM products p ORDER BY units DESC, name;',
        hints: [
          ['Same shape as the count — but SUM(oi.quantity).', 'Count jaisa hi shape — par SUM(oi.quantity).'],
          ['Same shape as the count — but SUM(oi.quantity). — write the full statement with the correlated subquery.', 'Full statement likho correlated subquery ke saath.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'The insider metric: each customer\'s name, their order count (orders_) and their average order value — AVG of their payments through orders — rounded to 2 decimals (avg_value). Columns: name, orders_, avg_value. Headers checked. Only customers with at least 1 order. (Two correlated subqueries in one SELECT list.)',
          'Insider metric: har customer ka naam, unka order count (orders_) aur unka average order value — unke orders ke through payments ka AVG — 2 decimals par (avg_value). Columns: name, orders_, avg_value. Headers check honge. Sirf kam se kam 1 order wale customers. (Ek SELECT list me do correlated subqueries.)',
        ],
        sol: "SELECT c.name,\n  (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) AS orders_,\n  (SELECT ROUND(AVG(p2.amount), 2) FROM payments p2 JOIN orders o2 ON o2.id = p2.order_id WHERE o2.customer_id = c.id) AS avg_value\nFROM customers c\nWHERE (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) > 0;",
        hints: [
          ['Two correlated columns plus a correlated existence filter in WHERE.', 'Do correlated columns aur WHERE me correlated existence filter.'],
          ['Wrap AVG in ROUND(..., 2) inside the inner query.', 'Inner query me AVG ko ROUND(..., 2) me wrap karo.'],
          ['The filter can reuse the first subquery: WHERE (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) > 0.', 'Filter pehli subquery dobara use kar sakta hai: WHERE (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) > 0.'],
        ],
        rules: { checkColumnNames: true },
      }),
    ],
  }),

  defineModule({
    n: 32,
    title: ['EXISTS Operator', 'EXISTS Operator'],
    time: '25 min',
    concepts: ['exists', 'not exists', 'correlated', 'semijoin', 'existence check', 'double not exists'],
    diagram: 'subquery-nest',
    objectives: [
      ['Test row existence with EXISTS instead of collecting sets', 'Sets jama karne ki jagah EXISTS se row existence test karna'],
      ['Write correlated EXISTS with the outer reference', 'Outer reference ke saath correlated EXISTS likhna'],
      ['Solve "has at least one / has none" questions cleanly', '"kam se kam ek hai / koi nahi" wale sawal saaf-saaf solve karna'],
    ],
    theory: [
      section(
        ['Membership vs existence', 'Membership vs existence'],
        [
          [
            'IN (SELECT customer_id FROM orders WHERE …) collects the whole set, then tests membership. EXISTS flips the perspective: it asks the engine to FIND one matching row — (SELECT … WHERE o.customer_id = c.id) — and stops at the first hit. EXISTS returns only TRUE or FALSE; the inner SELECT list is irrelevant (SELECT 1 or SELECT * — nobody reads it).',
            'IN (SELECT customer_id FROM orders WHERE …) poora set jama karta hai, phir membership test karta hai. EXISTS perspective ulta kar deta hai: wo engine se kehta hai ek matching ROW dhoondho — (SELECT … WHERE o.customer_id = c.id) — aur pehli hit par ruk jaao. EXISTS sirf TRUE ya FALSE deta hai; inner SELECT list ki koi value nahi (SELECT 1 ya SELECT * — koi padhta nahi).',
          ],
          [
            'EXISTS is almost always written correlated — the inner WHERE references the outer row (c.id). Semantically it is a "semi-join": keep outer rows that have at least one match, WITHOUT duplicating outer rows per match (a JOIN would). "Which customers have a delivered order" with EXISTS gives each customer once, no matter how many deliveries.',
            'EXISTS aksar correlated hi likha jaata hai — inner WHERE outer row (c.id) ko reference karta hai. Semantically yeh "semi-join" hai: wo outer rows rakhta hai jinka kam se kam ek match ho, BINA har match par outer row duplicate kiye (JOIN karti). "Kis-kis customers ko delivered order mila" EXISTS se har customer ek baar aata hai, chahe deliveries kitni bhi hon.',
          ],
        ],
        [],
        'subquery-nest'
      ),
      section(
        ['NOT EXISTS — the anti-join', 'NOT EXISTS — anti-join'],
        [
          [
            'NOT EXISTS keeps outer rows with ZERO matches: customers who never ordered, products never sold, categories with no active items. This is the bulletproof replacement for the NOT IN NULL-trap: a missing inner value cannot poison it, because nothing is collected — existence is simply tested per row.',
            'NOT EXISTS wahi outer rows rakhta hai jinka ZERO match ho: jin customers ne kabhi order nahi diya, jo products kabhi nahi bike, jinki categories me koi active item nahi. Yahi NOT IN ke NULL-trap ka bulletproof replacement hai: inner ki missing value ise zeher nahi kar sakti, kyunki kuch jama nahi hota — existence bas har row par test hoti hai.',
          ],
          [
            'The crown jewel of EXISTS thinking is the double-negative: "categories that have NO product that is out of stock" = NOT EXISTS (a product in this category that IS out of stock). You will build one such query in the tasks — it is the exact pattern behind countless real integrity checks.',
            'EXISTS sochne ka crown jewel double-negative hai: "wo categories jinka KOI product out of stock NAHI hai" = NOT EXISTS (is category ka koi product jo out of stock HO). Aap tasks me aisi ek query banaoge — yahi pattern duniya bhar ki real integrity checks ke peeche hai.',
          ],
        ],
        [
          ['EXISTS: TRUE/FALSE existence test, early exit', 'EXISTS: TRUE/FALSE existence test, jaldi rukna'],
          ['Correlated form: inner WHERE references outer', 'Correlated form: inner WHERE outer ko reference karta hai'],
          ['NOT EXISTS: safe anti-join, NULL-proof', 'NOT EXISTS: safe anti-join, NULL-proof'],
        ]
      ),
    ],
    tutorial: {
      title: ['Finding the never-orderers', 'Kabhi-order-na-karne wale dhoondhna'],
      steps: [
        step(null, [
          'Growth team wants customers who have never ordered. EXISTS gives the clean answer.',
          'Growth team un customers ko dhoondhna chahti hai jinhone kabhi order nahi diya. EXISTS saaf jawab deta hai.',
        ]),
        step('SELECT name FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id) LIMIT 5;', [
          'Positive side: customers WITH at least one order.',
          'Positive side: kam se kam ek order WALON wale customers.',
        ], { table: 'customers' }),
        step("SELECT name FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.status = 'delivered') LIMIT 5;", [
          'Customers without a single delivered order — each once, no duplicates, NULL-proof.',
          'Bina delivered order wale customers — har ek ek baar, no duplicates, NULL-proof.',
        ], { table: 'customers' }),
        step('SELECT name FROM products p WHERE NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.id) LIMIT 5;', [
          'Products that have never appeared in any order line.',
          'Wo products jo kisi bhi order line me kabhi nahi aaye.',
        ], { table: 'products' }),
        step("SELECT name FROM products p WHERE stock_quantity > 0 AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.id);", [
          'In stock but never sold — the mystery shelf.',
          'Stock me par kabhi nahi bika — mystery shelf.',
        ], { run: true, table: 'products' }),
      ],
    },
    syntax: {
      template: 'WHERE EXISTS (SELECT 1 FROM t2 WHERE t2.key = outer.key)\nWHERE NOT EXISTS (SELECT 1 FROM t2 WHERE t2.key = outer.key)',
      parts: [
        { part: 'EXISTS (…)', description: ['TRUE if the inner query finds any row', 'TRUE agar inner query koi row dhoondh le'] },
        { part: 'SELECT 1', description: ['The list is irrelevant — convention uses 1 or *', 'List ki koi value nahi — convention me 1 ya *'] },
        { part: 'NOT EXISTS', description: ['TRUE when zero rows match — the anti-join', 'TRUE jab zero rows match hon — anti-join'] },
      ],
    },
    examples: [
      example('very_easy', "SELECT name FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.status = 'delivered') LIMIT 6;", [
        'Customers yet to receive a delivered order — a clean anti-join with a status filter.',
        'Wo customers jinko abhi delivered order nahi mila — status filter ke saath saaf anti-join.',
      ]),
      example('easy', "SELECT name FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.status = 'pending');", [
        'Customers chasing a pending order.',
        'Pending order ka wait kar rahe customers.',
      ]),
      example('medium', 'SELECT name FROM products p WHERE NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.id);', [
        'Products that have never been part of any order.',
        'Wo products jo kisi order ka hissa kabhi nahi rahe.',
      ]),
      example('hard', "SELECT name FROM products p WHERE stock_quantity = 0 AND EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.id);", [
        'Out of stock yet still demanded — restock alerts.',
        'Stock khatam par demand abhi bhi — restock alerts.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Putting real effort into the EXISTS select list', 'EXISTS ke select list me mehnat karna'],
        ['SELECT 1 FROM … suffices — the engine only checks emptiness. Columns, DISTINCT, ORDER BY inside EXISTS are wasted effort.', 'SELECT 1 FROM … kaafi hai — engine sirf khaali-pan check karta hai. EXISTS ke andar columns, DISTINCT, ORDER BY bekaar mehnat hain.']
      ),
      mistake(
        ['Forgetting the correlation and testing a global fact', 'Correlation bhool kar global fact test karna'],
        ['EXISTS (SELECT 1 FROM orders) is TRUE for every row — the check must reference the outer row or it means nothing.', 'EXISTS (SELECT 1 FROM orders) har row ke liye TRUE hai — check outer row ko reference kare warna iska matlab kuch nahi.']
      ),
      mistake(
        ['Believing EXISTS duplicates rows per match', 'EXISTS ke har match par rows duplicate hone ka vishwas'],
        ['A JOIN multiplies rows by matches; EXISTS is a pure boolean per outer row. Each customer appears exactly once.', 'JOIN rows ko matches se guna karti hai; EXISTS har outer row ke liye pure boolean hai. Har customer exactly ek baar dikhta hai.']
      ),
    ],
    summary: [
      ['EXISTS tests existence — TRUE/FALSE, early exit, list irrelevant', 'EXISTS existence test karta hai — TRUE/FALSE, jaldi exit, list ki value nahi'],
      ['Almost always correlated with the outer row', 'Aksar outer row ke saath correlated'],
      ['NOT EXISTS = safe anti-join, NULL-proof "has none"', 'NOT EXISTS = safe anti-join, NULL-proof "koi nahi"'],
      ['Double negatives solve integrity checks', 'Double negatives integrity checks solve karte hain'],
    ],
    quiz: [
      mcq(
        ['Why does the EXISTS list conventionally say SELECT 1?', 'EXISTS ki list me conventionally SELECT 1 kyun likhte hain?'],
        [
          ['1 is faster than other values', '1 dusri values se fast hai'],
          ['The list is never read — only row existence matters', 'List kabhi nahi padhi jaati — sirf row existence matter karti hai'],
          ['It is required syntax', 'Yeh required syntax hai'],
          ['1 means "first row only"', '1 ka matlab "sirf pehli row"'],
        ],
        1,
        ['EXISTS returns a boolean; the engine stops at the first matching row, so column content is irrelevant.', 'EXISTS boolean deta hai; engine pehli matching row par rukta hai, isliye column content ki koi value nahi.']
      ),
      outputQ(
        "SELECT COUNT(*) FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.status = 'delivered');",
        ['How many customers have never RECEIVED a delivered order?', 'Kitne customers ko kabhi DELIVERED order nahi mila?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[34]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[0]] } },
          { label: 'C', result: { columns: ['COUNT(*)'], rows: [[66]] } },
          { label: 'D', result: { error: 'Error: no such column: c.id' } },
        ],
        0,
        ['34 customers have no delivered order yet — the status filter lives INSIDE the EXISTS subquery.', '34 customers ko abhi koi delivered order nahi mila — status filter EXISTS subquery ke ANDAR rehta hai.']
      ),
      buildQ(
        ['Build: customers with at least one delivered order (EXISTS)', 'Banao: kam se kam ek delivered order wale customers (EXISTS)'],
        ['SELECT', 'name', 'FROM', 'customers', 'c', 'WHERE', 'EXISTS', '(', 'SELECT', '1', 'FROM', 'orders', 'o', 'WHERE', 'o.customer_id = c.id', "status = 'delivered'", 'AND', ')'],
        ['SELECT', 'name', 'FROM', 'customers', 'c', 'WHERE', 'EXISTS', '(', 'SELECT', '1', 'FROM', 'orders', 'o', 'WHERE', 'o.customer_id = c.id', 'AND', "status = 'delivered'", ')'],
        ['EXISTS (correlated inner with its own status filter).', 'EXISTS (correlated inner apne status filter ke saath).']
      ),
      blanksQ(
        'SELECT name FROM customers c WHERE ___ ___ (SELECT 1 FROM orders o WHERE o.customer_id = c.id);',
        [
          { options: ['NOT', 'IN', 'IS'], correct: 'NOT' },
          { options: ['EXISTS', 'IN', 'NULL'], correct: 'EXISTS' },
        ],
        ['NOT EXISTS selects the never-orderers.', 'NOT EXISTS kabhi-order-na-karne wale chunta hai.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The engaged base: names of customers who have placed at least ONE order (EXISTS form).',
          'Engaged base: un customers ke naam jinhone kam se kam EK order diya hai (EXISTS form).',
        ],
        sol: 'SELECT name FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);',
        hints: [
          ['Positive existence — EXISTS with the correlation.', 'Positive existence — correlation ke saath EXISTS.'],
          ['Positive existence — EXISTS with the correlation. — write the full statement with the correlated subquery.', 'Full statement likho correlated subquery ke saath.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'The waiting list: names of customers who have NOT received a single delivered order yet (NOT EXISTS with a status filter).',
          'Waiting list: un customers ke naam jinko abhi tak ek bhi DELIVERED order nahi mila (status filter ke saath NOT EXISTS).',
        ],
        sol: "SELECT name FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.status = 'delivered');",
        hints: [
          ['The anti-join keeps non-matchers; the status filter goes INSIDE the inner query.', 'Anti-join non-matchers rakhta hai; status filter ANDAR wali query me jaata hai.'],
          ["SELECT name FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.status = 'delivered');", "SELECT name FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.status = 'delivered');"],
          ['34 customers appear — everyone else has at least one delivered order.', '34 customers dikhte hain — baaki sab ke paas kam se kam ek delivered order hai.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'The mystery shelf: names of in-stock products (stock_quantity > 0) that have never been bought in bulk — no order line for them with quantity 4 or more (NOT EXISTS).',
          'Mystery shelf: stock wale products (stock_quantity > 0) ke naam jo kabhi bulk me nahi kharide gaye — unki koi bhi order line quantity 4 ya usse zyada nahi (NOT EXISTS).',
        ],
        sol: 'SELECT name FROM products p WHERE p.stock_quantity > 0 AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.id AND oi.quantity >= 4);',
        hints: [
          ['The bulk condition goes INSIDE the NOT EXISTS; the stock condition stays outside.', 'Bulk condition NOT EXISTS ke ANDAR jaati hai; stock condition bahar rehti hai.'],
          ['SELECT name FROM products p WHERE p.stock_quantity > 0 AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.id AND oi.quantity >= 4);', 'SELECT name FROM products p WHERE p.stock_quantity > 0 AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.id AND oi.quantity >= 4);'],
          ['Sixteen in-stock products have never seen a bulk purchase.', 'Solah stock wale products kabhi bulk purchase nahi dekhe.'],
        ],
      }),
      task({
        d: 'hard',
        desc: [
          'Restock alarm: names of products that are OUT of stock (stock_quantity = 0) yet HAVE been ordered before (EXISTS on order_items).',
          'Restock alarm: wo products jo OUT of stock hain (stock_quantity = 0) par pehle order HO chuke hain (order_items par EXISTS).',
        ],
        sol: 'SELECT name FROM products p WHERE stock_quantity = 0 AND EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.id);',
        hints: [
          ['Two conditions: stock level and positive existence.', 'Do conditions: stock level aur positive existence.'],
          ['SELECT name FROM products p WHERE stock_quantity = 0 AND EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.id);', 'SELECT name FROM products p WHERE stock_quantity = 0 AND EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.id);'],
          ['These are your restock alerts.', 'Yahi aapke restock alerts hain.'],
        ],
      }),
      task({
        d: 'very_hard',
        desc: [
          'Integrity double-negative: names of subcategories (categories whose parent_category_id IS NOT NULL) that have NO out-of-stock product. (NOT EXISTS a product in this category with stock_quantity = 0.)',
          'Integrity double-negative: un subcategories ke naam (jin categories ka parent_category_id NOT NULL hai) jinka KOI out-of-stock product NAHI hai. (NOT EXISTS is category ka koi product jiska stock_quantity = 0 ho.)',
        ],
        sol: 'SELECT name FROM categories c\nWHERE c.parent_category_id IS NOT NULL\nAND NOT EXISTS (\n  SELECT 1 FROM products p WHERE p.category_id = c.id AND p.stock_quantity = 0\n);',
        hints: [
          ['Outer: subcategories. Inner: an out-of-stock product IN THIS category.', 'Outer: subcategories. Inner: ISI category me out-of-stock product.'],
          ['SELECT name FROM categories c WHERE c.parent_category_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM products p WHERE p.category_id = c.id AND p.stock_quantity = 0);', 'SELECT name FROM categories c WHERE c.parent_category_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM products p WHERE p.category_id = c.id AND p.stock_quantity = 0);'],
          ['Read the double negative aloud until it clicks.', 'Double negative ko zor se padho jab tak click na ho.'],
        ],
      }),
    ],
  }),
];
