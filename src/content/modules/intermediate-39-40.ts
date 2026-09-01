'use client';

// Modules 39-40: CASE Statement · Level Project 2: E-Commerce Analytics

import { defineModule, section, step, example, mistake, mcq, outputQ, buildQ, blanksQ, task } from './builder';
import type { Module } from '@/types/content';

export const modules: Module[] = [
  defineModule({
    n: 39,
    title: ['CASE Statement', 'CASE Statement'],
    time: '30 min',
    concepts: ['case', 'when', 'then', 'else', 'end', 'conditional logic', 'branching', 'bucketing', 'pivot'],
    diagram: 'case-branch',
    objectives: [
      ['Write conditional columns with CASE/WHEN/THEN/ELSE/END', 'CASE/WHEN/THEN/ELSE/END se conditional columns likhna'],
      ['Bucket continuous values into labels', 'Continuous values ko labels me bucket karna'],
      ['Count conditionally with CASE inside aggregates', 'Aggregates ke andar CASE se conditional counting'],
    ],
    theory: [
      section(
        ['If-then, in SQL', 'SQL me if-then'],
        [
          [
            'SQL has no if-statements — it has CASE, an expression that walks down conditions and returns the first THEN that matches: CASE WHEN price >= 20000 THEN \'premium\' WHEN price >= 5000 THEN \'mid\' ELSE \'budget\' END. Read it as a ladder: each WHEN tested top to bottom, first hit wins, ELSE is the fallback (NULL if omitted), END closes it.',
            'SQL me if-statements nahi hote — CASE hai, ek expression jo conditions neeche chalta hai aur pehli match hone wali THEN lauta deta hai: CASE WHEN price >= 20000 THEN \'premium\' WHEN price >= 5000 THEN \'mid\' ELSE \'budget\' END. Ise seedhi (ladder) ki tarah padho: har WHEN upar se neeche test hota hai, pehli hit jeet-ti hai, ELSE fallback hai (chhoda to NULL), END band karta hai.',
          ],
          [
            'CASE is an EXPRESSION — it produces a value, so it can live anywhere a value lives: as a SELECT column (labelling rows), inside ORDER BY (custom sort orders), inside WHERE logic, and most powerfully inside aggregates: SUM(CASE WHEN status = \'delivered\' THEN 1 ELSE 0 END) counts delivered rows — the conditional-count idiom that powers dashboards.',
            'CASE ek EXPRESSION hai — ye value banata hai, isliye jahan value reh sakti hai wahan reh sakta hai: SELECT column ki tarah (rows ko label karta hua), ORDER BY ke andar (custom sort orders), WHERE logic me, aur sabse powerful — aggregates ke andar: SUM(CASE WHEN status = \'delivered\' THEN 1 ELSE 0 END) delivered rows ginta hai — wahi conditional-count idiom jo dashboards chalata hai.',
          ],
        ],
        [],
        'case-branch'
      ),
      section(
        ['Buckets and pivots', 'Buckets aur pivots'],
        [
          [
            'The bucketing use turns numbers into business language: price → budget/mid/premium, rating → poor/ok/great, age → bands. Once bucketed, GROUP BY on the CASE (or its alias in SQLite) turns raw tables into the labelled summaries executives actually read.',
            'Bucketing ka use numbers ko business bhasha me badalta hai: price → budget/mid/premium, rating → poor/ok/great, age → bands. Bucket hone ke baad CASE (ya SQLite me uske alias) par GROUP BY raw tables ko wo labelled summaries banata hai jo executives sach me padhte hain.',
          ],
          [
            'Stack several conditional counts in one GROUP BY row and you have a hand-made pivot: status counts as separate columns per month, tier counts per city — the Excel pivot-table experience, written as one query. Combined with LEFT JOIN it becomes the full engagement matrix pattern you glimpsed earlier.',
            'Ek GROUP BY row me kai conditional counts stack karo aur haath ka bana pivot ready: month ke hisab se status counts alag columns me, city ke hisab se tier counts — Excel pivot-table ka experience, ek query me likha. LEFT JOIN ke saath yahi poora engagement matrix pattern banta hai jo aapne pehle glimp kiya tha.',
          ],
        ],
        [
          ['CASE returns a value — usable everywhere a value fits', 'CASE value lauta deta hai — jahan value fit ho wahan usable'],
          ['Conditions test top-down; first WHEN wins', 'Conditions upar se neeche test hoti hain; pehla WHEN jeet-ta hai'],
          ['SUM(CASE WHEN … THEN 1 ELSE 0 END) = conditional count', 'SUM(CASE WHEN … THEN 1 ELSE 0 END) = conditional count'],
          ['Bucket + GROUP BY = executive-readable summaries', 'Bucket + GROUP BY = executive-readable summaries'],
        ]
      ),
    ],
    tutorial: {
      title: ['Labelling the catalogue', 'Catalogue ko label karna'],
      steps: [
        step(null, [
          'Marketing wants price tiers, and the ops dashboard wants per-status counts — both are CASE work.',
          'Marketing price tiers chahta hai, aur ops dashboard status-wise counts — dono CASE ka kaam hai.',
        ]),
        step("SELECT name, price,\n  CASE WHEN price >= 20000 THEN 'premium'\n       WHEN price >= 5000 THEN 'mid'\n       ELSE 'budget' END AS tier\nFROM products ORDER BY price DESC LIMIT 8;", [
          'Numbers become business words, computed per row.',
          'Numbers business shabd ban jaate hain, har row par computed.',
        ], { table: 'products' }),
        step("SELECT\n  CASE WHEN price >= 20000 THEN 'premium'\n       WHEN price >= 5000 THEN 'mid'\n       ELSE 'budget' END AS tier,\n  COUNT(*) AS products\nFROM products GROUP BY tier ORDER BY products DESC;", [
          'Grouping BY the case output (alias works in SQLite) — a labelled summary.',
          'Case ke output se GROUP (SQLite me alias chalta hai) — labelled summary.',
        ], { table: 'products' }),
        step("SELECT\n  SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered,\n  SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled,\n  SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending\nFROM orders;", [
          'The pivot row: three conditional counts in one result — a dashboard in one statement.',
          'Pivot row: ek result me teen conditional counts — ek statement me dashboard.',
        ], { table: 'orders' }),
        step("SELECT c.city,\n  SUM(CASE WHEN c.customer_type = 'vip' THEN 1 ELSE 0 END) AS vips,\n  SUM(CASE WHEN c.customer_type = 'premium' THEN 1 ELSE 0 END) AS premium\nFROM customers c GROUP BY c.city ORDER BY c.city LIMIT 8;", [
          'A per-city tier pivot — cities as rows, tiers as columns.',
          'Per-city tier pivot — cities rows ki tarah, tiers columns ki tarah.',
        ], { run: true, table: 'customers' }),
      ],
    },
    syntax: {
      template: "SELECT CASE WHEN cond1 THEN val1\n            WHEN cond2 THEN val2\n            ELSE val3 END AS alias\nFROM …;\n-- conditional count:\nSELECT SUM(CASE WHEN cond THEN 1 ELSE 0 END) AS n FROM …;",
      parts: [
        { part: 'CASE WHEN', description: ['Starts the ladder; first true wins', 'Ladder shuru; pehla sach jeet-ta hai'] },
        { part: 'ELSE', description: ['Fallback (NULL when omitted)', 'Fallback (chhoda to NULL)'] },
        { part: 'END', description: ['Closes the expression — required', 'Expression band karta hai — zaroori'] },
        { part: 'inside SUM/COUNT', description: ['Conditional aggregation idiom', 'Conditional aggregation idiom'] },
      ],
    },
    examples: [
      example('very_easy', "SELECT name,\n  CASE WHEN stock_quantity = 0 THEN 'out'\n       ELSE 'in' END AS stock_state\nFROM products ORDER BY id LIMIT 6;", [
        'A two-branch labelling of stock state.',
        'Stock state ka do-branch label.',
      ]),
      example('easy', "SELECT\n  CASE WHEN amount >= 100000 THEN 'large'\n       WHEN amount >= 50000 THEN 'medium'\n       ELSE 'small' END AS size,\n  COUNT(*) AS payments\nFROM payments GROUP BY size ORDER BY payments DESC;", [
        'Payment sizes bucketed and counted.',
        'Payment sizes bucket aur count.',
      ]),
      example('medium', "SELECT c.city,\n  SUM(CASE WHEN c.customer_type = 'vip' THEN 1 ELSE 0 END) AS vips\nFROM customers c GROUP BY c.city ORDER BY vips DESC, c.city LIMIT 6;", [
        'Conditional count as a per-city KPI.',
        'Per-city KPI ki tarah conditional count.',
      ]),
      example('hard', "SELECT\n  SUM(CASE WHEN o.status = 'delivered' THEN p.amount ELSE 0 END) AS delivered_revenue,\n  SUM(CASE WHEN o.status = 'cancelled' THEN p.amount ELSE 0 END) AS cancelled_revenue\nFROM orders o JOIN payments p ON p.order_id = o.id;", [
        'Conditional SUM over a join — revenue split by status in one row.',
        'JOIN par conditional SUM — ek row me status-wise revenue.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Forgetting END', 'END bhool jaana'],
        ['CASE without END is a syntax error the engine flags at the next clause. END is the closing bracket of the ladder.', 'END ke bina CASE syntax error hai jo engine agle clause par dikha deta hai. END ladder ka closing bracket hai.']
      ),
      mistake(
        ['WHEN order mistakes for overlapping ranges', 'Overlapping ranges me WHEN ka order galat'],
        ['Price >= 5000 first would swallow premium products into mid. Order thresholds descending (or ascending) consistently — the ladder takes the FIRST match.', 'Price >= 5000 pehle likha to premium products mid me chala jaayega. Thresholds consistently descending (ya ascending) rakho — ladder PEHL match leta hai.']
      ),
      mistake(
        ['COUNT(*) instead of SUM(CASE…1…0)', 'SUM(CASE…1…0) ki jagah COUNT(*)'],
        ['COUNT(*) counts every row regardless of the branch. The idiom is SUM(CASE WHEN … THEN 1 ELSE 0 END) — 1s added, 0s ignored.', 'COUNT(*) branch dekhe bina har row ginta hai. Idiom hai SUM(CASE WHEN … THEN 1 ELSE 0 END) — 1s jude, 0s ignore.']
      ),
    ],
    summary: [
      ['CASE is an expression producing a value, usable anywhere', 'CASE ek expression hai jo value deta hai, kahin bhi usable'],
      ['WHENs test top-down; first match wins; ELSE is fallback', 'WHENs upar se neeche; pehla match jeet-ta hai; ELSE fallback'],
      ['Conditional counting: SUM(CASE WHEN … THEN 1 ELSE 0 END)', 'Conditional counting: SUM(CASE WHEN … THEN 1 ELSE 0 END)'],
      ['Bucket + GROUP BY builds executive-grade summaries', 'Bucket + GROUP BY executive-grade summaries banata hai'],
    ],
    quiz: [
      mcq(
        ["For price = 30000, what does CASE WHEN price >= 5000 THEN 'mid' WHEN price >= 20000 THEN 'premium' END return?", "price = 30000 ke liye, CASE WHEN price >= 5000 THEN 'mid' WHEN price >= 20000 THEN 'premium' END kya return karega?"],
        [
          ["'premium'", "'premium'"],
          ["'mid' — the first WHEN already matched", "'mid' — pehla WHEN pehle hi match ho gaya"],
          ['NULL', 'NULL'],
          ['An error', 'Error'],
        ],
        1,
        ['The ladder takes the FIRST true WHEN — 30000 satisfies >= 5000, so mid wins before premium is ever tested. Order matters!', 'Ladder PEHLE sach WHEN leta hai — 30000 >= 5000 satisfy karta hai, isliye premium test hone se pehle mid jeet jaata hai. Order matter karta hai!']
      ),
      outputQ(
        "SELECT SUM(CASE WHEN customer_type = 'vip' THEN 1 ELSE 0 END) AS vips FROM customers;",
        ['How many VIPs does the conditional count report?', 'Conditional count kitne VIPs dikhata hai?'],
        [
          { label: 'A', result: { columns: ['vips'], rows: [[15]] } },
          { label: 'B', result: { columns: ['vips'], rows: [[100]] } },
          { label: 'C', result: { columns: ['vips'], rows: [[33]] } },
          { label: 'D', result: { error: 'Error: near "ELSE": syntax error' } },
        ],
        0,
        ['1 for each VIP row, 0 otherwise — the sum is the VIP count: 15.', 'Har VIP row ke liye 1, warna 0 — sum hi VIP count hai: 15.']
      ),
      buildQ(
        ['Build: products labelled cheap (price < 1000) or normal', 'Banao: products ko label karo cheap (price < 1000) ya normal'],
        ['CASE', 'WHEN', 'price', '<', '1000', "THEN", "'cheap'", 'ELSE', "'normal'", 'END', 'SELECT', 'name', 'FROM', 'products'],
        ['SELECT', 'name', ',', 'CASE', 'WHEN', 'price', '<', '1000', "THEN", "'cheap'", 'ELSE', "'normal'", 'END', 'FROM', 'products'],
        ['CASE WHEN … THEN … ELSE … END after the column.', 'Column ke baad CASE WHEN … THEN … ELSE … END.']
      ),
      blanksQ(
        "SELECT ___ WHEN price >= 20000 ___ 'premium' ___ 'budget' ___ AS tier FROM products;",
        [
          { options: ['CASE', 'IF', 'WHEN'], correct: 'CASE' },
          { options: ['THEN', 'ELSE', 'WHEN'], correct: 'THEN' },
          { options: ['ELSE', 'THEN', 'WHEN'], correct: 'ELSE' },
          { options: ['END', 'CASE', 'DONE'], correct: 'END' },
        ],
        ['The four pillars: CASE, THEN, ELSE, END.', 'Chaar stambh: CASE, THEN, ELSE, END.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Stock labels: product name and a state column — "out" when stock_quantity is 0, else "in". Columns: name, state. Sorted by name. LIMIT 10.',
          'Stock labels: product naam aur state column — stock_quantity 0 ho to "out", warna "in". Columns: name, state. Naam se sorted. LIMIT 10.',
        ],
        sol: "SELECT name,\n  CASE WHEN stock_quantity = 0 THEN 'out' ELSE 'in' END AS state\nFROM products ORDER BY name LIMIT 10;",
        hints: [
          ['Two branches are enough here.', 'Yahan do branch kaafi hain.'],
          ["SELECT name, CASE WHEN stock_quantity = 0 THEN 'out' ELSE 'in' END AS state FROM products ORDER BY name LIMIT 10;", "SELECT name, CASE WHEN stock_quantity = 0 THEN 'out' ELSE 'in' END AS state FROM products ORDER BY name LIMIT 10;"],
          ['Fifteen products are out of stock across the catalogue.', 'Catalogue me pandrah products out of stock hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'easy',
        desc: [
          'Price tiers: tier counts — premium (price ≥ 20000), mid (5000–19999.99), budget (< 5000) — one row per tier with counts. Columns: tier, products. Sorted by tier alphabetically.',
          'Price tiers: tier counts — premium (price ≥ 20000), mid (5000–19999.99), budget (< 5000) — har tier ki ek row counts ke saath. Columns: tier, products. Tier se alphabetically sorted.',
        ],
        sol: "SELECT\n  CASE WHEN price >= 20000 THEN 'premium'\n       WHEN price >= 5000 THEN 'mid'\n       ELSE 'budget' END AS tier,\n  COUNT(*) AS products\nFROM products GROUP BY tier ORDER BY tier;",
        hints: [
          ['Thresholds descending; ELSE catches budget.', 'Thresholds utarte hue; ELSE budget pakadta hai.'],
          ["SELECT CASE WHEN price >= 20000 THEN 'premium' WHEN price >= 5000 THEN 'mid' ELSE 'budget' END AS tier, COUNT(*) AS products FROM products GROUP BY tier ORDER BY tier;", "SELECT CASE WHEN price >= 20000 THEN 'premium' WHEN price >= 5000 THEN 'mid' ELSE 'budget' END AS tier, COUNT(*) AS products FROM products GROUP BY tier ORDER BY tier;"],
          ['45 premium, ~77 mid, ~78 budget.', '45 premium, ~77 mid, ~78 budget.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'medium',
        desc: [
          'The status pivot: one row with three conditional counts — delivered, cancelled, pending (aliased exactly so). Columns: delivered, cancelled, pending.',
          'Status pivot: ek row me teen conditional counts — delivered, cancelled, pending (bilkul aise hi aliased). Columns: delivered, cancelled, pending.',
        ],
        sol: "SELECT\n  SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered,\n  SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled,\n  SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending\nFROM orders;",
        hints: [
          ['Three SUM(CASE …) expressions, one row.', 'Teen SUM(CASE …) expressions, ek row.'],
          ["SELECT SUM(CASE WHEN status='delivered' THEN 1 ELSE 0 END) AS delivered, SUM(CASE WHEN status='cancelled' THEN 1 ELSE 0 END) AS cancelled, SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) AS pending FROM orders;", "SELECT SUM(CASE WHEN status='delivered' THEN 1 ELSE 0 END) AS delivered, SUM(CASE WHEN status='cancelled' THEN 1 ELSE 0 END) AS cancelled, SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) AS pending FROM orders;"],
          ['98 · 105 · 105.', '98 · 105 · 105.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'hard',
        desc: [
          'The tier census by city: per city, VIP count and premium count as two columns (conditional counts). Columns: city, vips, premium. Sorted by city. Only cities with at least one VIP or premium… simply all cities, zeros included.',
          'Tier census by city: har city me VIP count aur premium count do columns ki tarah (conditional counts). Columns: city, vips, premium. City se sorted. Saari cities, zero shaamil.',
        ],
        sol: "SELECT c.city,\n  SUM(CASE WHEN c.customer_type = 'vip' THEN 1 ELSE 0 END) AS vips,\n  SUM(CASE WHEN c.customer_type = 'premium' THEN 1 ELSE 0 END) AS premium\nFROM customers c GROUP BY c.city ORDER BY c.city;",
        hints: [
          ['No WHERE — grouping handles the matrix; ELSE 0 keeps zeros.', 'WHERE nahi — grouping matrix sambhaal leta hai; ELSE 0 zeros rakhta hai.'],
          ["SELECT c.city, SUM(CASE WHEN c.customer_type='vip' THEN 1 ELSE 0 END) AS vips, SUM(CASE WHEN c.customer_type='premium' THEN 1 ELSE 0 END) AS premium FROM customers c GROUP BY c.city ORDER BY c.city;", "SELECT c.city, SUM(CASE WHEN c.customer_type='vip' THEN 1 ELSE 0 END) AS vips, SUM(CASE WHEN c.customer_type='premium' THEN 1 ELSE 0 END) AS premium FROM customers c GROUP BY c.city ORDER BY c.city;"],
          ['Jaipur shows the largest numbers.', 'Jaipur sabse bade numbers dikhata hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'The monthly health pivot: per month (substr order_date), delivered count, cancelled count and delivered revenue (ROUND). Columns: month, delivered, cancelled, revenue. Sorted by month. (Join orders→payments for revenue; conditional aggregates carry the load.)',
          'Monthly health pivot: har mahine (substr order_date) ke liye delivered count, cancelled count aur delivered revenue (ROUND). Columns: month, delivered, cancelled, revenue. Month se sorted. (Revenue ke liye orders→payments join; conditional aggregates saara kaam karte hain.)',
        ],
        sol: "SELECT substr(o.order_date, 1, 7) AS month,\n  SUM(CASE WHEN o.status = 'delivered' THEN 1 ELSE 0 END) AS delivered,\n  SUM(CASE WHEN o.status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled,\n  ROUND(SUM(CASE WHEN o.status = 'delivered' THEN p.amount ELSE 0 END), 2) AS revenue\nFROM orders o JOIN payments p ON p.order_id = o.id\nGROUP BY substr(o.order_date, 1, 7) ORDER BY month;",
        hints: [
          ['Three conditional aggregates: two counting 1/0, one summing amount/0.', 'Teen conditional aggregates: do 1/0 ginte, ek amount/0 jodta.'],
          ["ROUND(SUM(CASE WHEN o.status='delivered' THEN p.amount ELSE 0 END), 2) — revenue for delivered only.", "ROUND(SUM(CASE WHEN o.status='delivered' THEN p.amount ELSE 0 END), 2) — sirf delivered ka revenue."],
          ['Twelve rows — the monthly executive view.', 'Barah rows — monthly executive view.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),

  defineModule({
    n: 40,
    title: ['🏆 Level Project 2: E-Commerce Analytics', '🏆 Level Project 2: E-Commerce Analytics'],
    time: '60 min',
    concepts: ['project', 'analytics', 'aggregates', 'join', 'group by', 'having', 'subquery', 'case', 'revenue', 'bi'],
    diagram: 'group-buckets',
    objectives: [
      ['Deliver a full analytics pack with the Intermediate toolkit', 'Intermediate toolkit se poora analytics pack deliver karna'],
      ['Compose JOINs, GROUP BY, HAVING, subqueries and CASE at will', 'JOINs, GROUP BY, HAVING, subqueries aur CASE at will jodna'],
      ['Earn the Intermediate badge and unlock Advanced', 'Intermediate badge kamao aur Advanced unlock karo'],
    ],
    theory: [
      section(
        ['The quarterly business review', 'Quarterly business review'],
        [
          [
            'The CTO asks for a quarterly review pack — ten requests spanning the whole Intermediate toolkit: the revenue chain, per-status economics, tier behaviour, product league tables, monthly trends, city matrices, conditional pivots, cohort-style subqueries and one composite "one number" KPI. This is the graduation exam of analysis: no new syntax, just composition under pressure.',
            'CTO quarterly review pack maangta hai — das requests jo poora Intermediate toolkit cover karti hain: revenue chain, status-wise economics, tier behaviour, product league tables, monthly trends, city matrices, conditional pivots, cohort-style subqueries aur ek composite "ek number" KPI. Yeh analysis ka graduation exam hai: koi naya syntax nahi, bas pressure me composition.',
          ],
          [
            'Method that survives scale: name the metric, name the grain, name the tables, then compose — join → filter → group → gate → sort → round. Every task below is one pass through that loop. When a task feels heavy, you are skipping a step — usually "name the grain".',
            'Scale jeetne wala method: metric ka naam do, grain ka naam do, tables ka naam do, phir jodo — join → filter → group → gate → sort → round. Neeche ka har task us loop ka ek chakkar hai. Task bhaari lage to koi step chhoot raha hai — aksar "grain ka naam".',
          ],
        ],
        [
          ['join → filter → group → gate → sort → round', 'join → filter → group → gate → sort → round'],
          ['Name the metric and grain BEFORE writing', 'Likne se PEHLE metric aur grain ka naam lo'],
          ['10 tasks · pass any 3 + the quiz to level up', '10 tasks · koi bhi 3 + quiz se level up'],
        ],
        'cte-chain'
      ),
      section(
        ['What unlocks next', 'Aage kya khulta hai'],
        [
          [
            'Finishing Intermediate unlocks the Advanced database — the e-commerce world extended with reviews, shipping, inventory logs and customer segments — and the expert toolkit: window functions (RANK, LAG, running totals), CTEs (named steps, recursion), views, indexes, transactions, triggers and query optimisation. The finish line is the Capstone: a complete BI system built by you.',
            'Intermediate khatam hone par Advanced database khulta hai — e-commerce duniya reviews, shipping, inventory logs aur customer segments ke saath — aur expert toolkit: window functions (RANK, LAG, running totals), CTEs (naam wale steps, recursion), views, indexes, transactions, triggers aur query optimisation. Finish line hai Capstone: aapke haath se bana poora BI system.',
          ],
        ]
      ),
    ],
    tutorial: {
      title: ['One full pass of the loop', 'Loop ka ek poora chakkar'],
      steps: [
        step(null, [
          'Watch the method on the headline request: "monthly delivered revenue for the QBR".',
          'Headline request par method dekho: "QBR ke liye monthly delivered revenue".',
        ]),
        step('-- Metric: SUM(p.amount) filtered to delivered\n-- Grain: month\n-- Tables: orders + payments', [
          'Naming the three things before writing — the anti-panic ritual.',
          'Likne se pehle teeno cheezein naam karna — anti-panic ritual.',
        ], { table: 'orders' }),
        step("SELECT substr(o.order_date, 1, 7) AS month, ROUND(SUM(p.amount), 2) AS revenue\nFROM orders o JOIN payments p ON p.order_id = o.id\nWHERE o.status = 'delivered'", [
          'Join the chain, filter the status — revenue per month taking shape.',
          'Chain join karo, status filter karo — monthly revenue ban rahi hai.',
        ], { table: 'orders' }),
        step("SELECT substr(o.order_date, 1, 7) AS month, ROUND(SUM(p.amount), 2) AS revenue\nFROM orders o JOIN payments p ON p.order_id = o.id\nWHERE o.status = 'delivered'\nGROUP BY substr(o.order_date, 1, 7) ORDER BY month;", [
          'Group to month grain, sort — the finished line chart data.',
          'Month grain par group, sort — complete line chart data.',
        ], { table: 'orders' }),
        step("SELECT ROUND(SUM(p.amount), 2) AS total_delivered_revenue\nFROM orders o JOIN payments p ON p.order_id = o.id\nWHERE o.status = 'delivered';", [
          'The one-number version — the CEO slide.',
          'Ek-number wala version — CEO slide.',
        ], { run: true, table: 'orders' }),
      ],
    },
    syntax: {
      template: '-- The Intermediate composition template:\nSELECT dim, ROUND(AGG(metric), 2) AS alias [, SUM(CASE …) AS pivot]\nFROM table_a a\n[INNER|LEFT] JOIN table_b b ON …\n[WHERE row_filter]\nGROUP BY dim\n[HAVING gate]\n[ORDER BY dim];',
      parts: [
        { part: 'join chain', description: ['Assemble the tables carrying metric and dimensions', 'Metric aur dimensions wali tables jodo'] },
        { part: 'CASE pivots', description: ['Conditional columns when one row must carry several counts', 'Conditional columns jab ek row me kai counts hone'] },
        { part: 'subqueries', description: ['Compare against computed benchmarks', 'Computed benchmarks se compare karo'] },
      ],
    },
    examples: [
      example('medium', "SELECT c.customer_type, COUNT(*) AS customers FROM customers c GROUP BY c.customer_type ORDER BY customers DESC;", [
        'The base split — 52 / 33 / 15.',
        'Base split — 52 / 33 / 15.',
      ]),
      example('hard', "SELECT o.status, COUNT(*) AS n, ROUND(SUM(p.amount), 2) AS revenue\nFROM orders o JOIN payments p ON p.order_id = o.id\nGROUP BY o.status ORDER BY n DESC;", [
        'Status economics — volume and value together.',
        'Status economics — volume aur value saath.',
      ]),
      example('very_hard', "SELECT pr.name, ROUND(SUM(oi.subtotal), 2) AS revenue\nFROM order_items oi JOIN products pr ON pr.id = oi.product_id\nGROUP BY pr.id, pr.name ORDER BY revenue DESC LIMIT 5;", [
        'The product league table top five.',
        'Product league table ka top panch.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Summing order-level amounts twice through order_items', 'order_items se hote hue order-level amounts do baar jodna'],
        ['Joining payments to order_items multiplies payment rows per item and inflates sums. Aggregate each grain separately, or use order_items.subtotal for product maths.', 'Payments ko order_items se join karne par payment rows item-wise guni hoti hain aur sums fool jaate hain. Har grain alag aggregate karo, ya product ke hisaab ke liye order_items.subtotal use karo.']
      ),
      mistake(
        ['Losing the filter side (delivered vs total revenue mixups)', 'Filter side kho dena (delivered vs total revenue ka mixup)'],
        ['Label your KPIs honestly: delivered_revenue vs revenue. Same query, one WHERE apart — the difference IS the metric.', 'KPIs imaandari se label karo: delivered_revenue vs revenue. Same query, ek WHERE ka farq — wahi farq metric hai.']
      ),
      mistake(
        ['Rounding mid-computation', 'Beech me rounding'],
        ['ROUND once at the END of an expression. Round-then-sum drags cents errors through every row.', 'ROUND ek baar expression ke END par. Pehle round phir sum har row me cents error ghis-ta hai.']
      ),
    ],
    summary: [
      ['The QBR pack: 10 requests, full toolkit composition', 'QBR pack: 10 requests, poore toolkit ki composition'],
      ['join → filter → group → gate → sort → round', 'join → filter → group → gate → sort → round'],
      ['Grain first; metrics labelled honestly; round last', 'Pehle grain; metrics imaandari se labelled; round aakhir me'],
      ['Next level: windows, CTEs, views, optimisation — expert territory', 'Agla level: windows, CTEs, views, optimisation — expert territory'],
    ],
    quiz: [
      mcq(
        ['Which pair best names the two aggregates for a status-economics report?', 'Status-economics report ke liye kaunsi jodi aggregates ke best naam hain?'],
        [
          ['SUM(amount) and MAX(amount)', 'SUM(amount) aur MAX(amount)'],
          ['COUNT(*) and SUM(amount)', 'COUNT(*) aur SUM(amount)'],
          ['MIN(status) and COUNT(*)', 'MIN(status) aur COUNT(*)'],
          ['AVG(name) and SUM(id)', 'AVG(name) aur SUM(id)'],
        ],
        1,
        ['Volume (how many orders) plus value (how much money) — the volume/value pair every status review needs.', 'Volume (kitne orders) plus value (kitna paisa) — wo volume/value jodi jo har status review chahiye.']
      ),
      outputQ(
        "SELECT COUNT(*) FROM orders WHERE status = 'processing';",
        ['Orders mid-pipeline right now:', 'Abhi pipeline me kaam ho rahe orders:'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[97]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[105]] } },
          { label: 'C', result: { columns: ['COUNT(*)'], rows: [[98]] } },
          { label: 'D', result: { error: 'Error: no such column: status' } },
        ],
        0,
        ['97 orders are in processing — pending/cancelled tie at 105, delivered 98, shipped 95.', '97 orders processing me hain — pending/cancelled 105-105 par barabar, delivered 98, shipped 95.']
      ),
      buildQ(
        ['Build: the status pivot row (delivered + cancelled counts)', 'Banao: status pivot row (delivered + cancelled counts)'],
        ['SUM', 'CASE', 'WHEN', "status = 'delivered'", 'THEN', '1', 'ELSE', '0', 'END', 'SELECT', 'FROM', 'orders'],
        ['SELECT', 'SUM', '(', 'CASE', 'WHEN', "status = 'delivered'", 'THEN', '1', 'ELSE', '0', 'END', ')', 'FROM', 'orders'],
        ['Wrap the CASE in SUM — the conditional count.', 'CASE ko SUM me wrap karo — conditional count.']
      ),
      blanksQ(
        "SELECT o.status, ROUND(SUM(p.amount), 2) FROM orders o ___ payments p ON p.order_id = o.id GROUP ___ o.status;",
        [
          { options: ['JOIN', 'UNION', 'ON'], correct: 'JOIN' },
          { options: ['BY', 'ON', 'AS'], correct: 'BY' },
        ],
        ['Join the money, group the dimension.', 'Paisa jodo, dimension group karo.'],
      ),
    ],
    tasks: [
      task({
        d: 'easy',
        desc: [
          'QBR 1 — Top line: total lifetime revenue, rounded, aliased revenue.',
          'QBR 1 — Top line: kul lifetime revenue, rounded, aliased revenue.',
        ],
        sol: 'SELECT ROUND(SUM(amount), 2) AS revenue FROM payments;',
        hints: [
          ['The money table alone suffices.', 'Money table akeli kaafi hai.'],
          ['SELECT ROUND(SUM(amount), 2) AS revenue FROM payments;', 'SELECT ROUND(SUM(amount), 2) AS revenue FROM payments;'],
          ['≈ 38,969,045.', '≈ 38,969,045.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'easy',
        desc: [
          'QBR 2 — Status economics: per order status, the order count and total revenue (rounded). Columns: status, orders, revenue. Sorted by orders descending.',
          'QBR 2 — Status economics: har order status ke liye order count aur total revenue (rounded). Columns: status, orders, revenue. Orders se utarte sorted.',
        ],
        sol: 'SELECT o.status, COUNT(*) AS orders, ROUND(SUM(p.amount), 2) AS revenue\nFROM orders o JOIN payments p ON p.order_id = o.id\nGROUP BY o.status ORDER BY orders DESC;',
        hints: [
          ['Join, group the dimension, two aggregates.', 'Join karo, dimension group karo, do aggregates.'],
          ['SELECT o.status, COUNT(*) AS orders, ROUND(SUM(p.amount),2) AS revenue FROM orders o JOIN payments p ON p.order_id = o.id GROUP BY o.status ORDER BY orders DESC;', 'SELECT o.status, COUNT(*) AS orders, ROUND(SUM(p.amount),2) AS revenue FROM orders o JOIN payments p ON p.order_id = o.id GROUP BY o.status ORDER BY orders DESC;'],
          ['pending/cancelled (105) lead by count.', 'pending/cancelled (105) count me aage.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'medium',
        desc: [
          'QBR 3 — Tier value: per customer type, customer count and average spend per customer (total payments ÷ distinct customers, rounded). Columns: customer_type, customers, avg_spend. Sorted by customer_type.',
          'QBR 3 — Tier value: har customer type ke liye customer count aur average spend per customer (total payments ÷ distinct customers, rounded). Columns: customer_type, customers, avg_spend. customer_type se sorted.',
        ],
        sol: "SELECT c.customer_type, COUNT(DISTINCT c.id) AS customers, ROUND(SUM(p.amount) / COUNT(DISTINCT c.id), 2) AS avg_spend\nFROM customers c\nJOIN orders o ON o.customer_id = c.id\nJOIN payments p ON p.order_id = o.id\nGROUP BY c.customer_type ORDER BY c.customer_type;",
        hints: [
          ['One join chain through three tables; distinct customers as the denominator.', 'Teen tables ki ek join chain; denominator me distinct customers.'],
          ['SELECT c.customer_type, COUNT(DISTINCT c.id) AS customers, ROUND(SUM(p.amount)/COUNT(DISTINCT c.id),2) AS avg_spend FROM … GROUP BY c.customer_type ORDER BY c.customer_type;', 'SELECT c.customer_type, COUNT(DISTINCT c.id) AS customers, ROUND(SUM(p.amount)/COUNT(DISTINCT c.id),2) AS avg_spend FROM … GROUP BY c.customer_type ORDER BY c.customer_type;'],
          ['VIPs average the highest spend per head.', 'VIPs per head sabse unchi average spend rakhte hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'medium',
        desc: [
          'QBR 4 — League table: top 5 products by total line revenue (SUM of order_items.subtotal), rounded. Columns: name, revenue. Sorted by revenue descending.',
          'QBR 4 — League table: total line revenue (order_items.subtotal ka SUM) se top 5 products, rounded. Columns: name, revenue. Revenue se utarte sorted.',
        ],
        sol: 'SELECT pr.name, ROUND(SUM(oi.subtotal), 2) AS revenue\nFROM order_items oi JOIN products pr ON pr.id = oi.product_id\nGROUP BY pr.id, pr.name ORDER BY revenue DESC LIMIT 5;',
        hints: [
          ['Product grain maths live in order_items — no payments join.', 'Product grain ka maths order_items me hai — payments join nahi.'],
          ['SELECT pr.name, ROUND(SUM(oi.subtotal),2) AS revenue FROM order_items oi JOIN products pr ON pr.id = oi.product_id GROUP BY pr.id, pr.name ORDER BY revenue DESC LIMIT 5;', 'SELECT pr.name, ROUND(SUM(oi.subtotal),2) AS revenue FROM order_items oi JOIN products pr ON pr.id = oi.product_id GROUP BY pr.id, pr.name ORDER BY revenue DESC LIMIT 5;'],
          ['Titan-family products crowd the top.', 'Titan-family products top par bhirdhe hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'QBR 5 — Big spenders: customers whose total spend exceeds 800,000 — name and total (rounded), sorted by total descending. Columns: name, total.',
          'QBR 5 — Big spenders: jinka total kharch 800,000 paar — naam aur total (rounded), total se utarte sorted. Columns: name, total.',
        ],
        sol: 'SELECT c.name, ROUND(SUM(p.amount), 2) AS total\nFROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id\nGROUP BY c.id, c.name HAVING SUM(p.amount) > 800000\nORDER BY total DESC;',
        hints: [
          ['Group per customer, gate with HAVING on the aggregate.', 'Per customer group karo, aggregate par HAVING se gate lagao.'],
          ['SELECT c.name, ROUND(SUM(p.amount),2) AS total FROM … GROUP BY c.id, c.name HAVING SUM(p.amount) > 800000 ORDER BY total DESC;', 'SELECT c.name, ROUND(SUM(p.amount),2) AS total FROM … GROUP BY c.id, c.name HAVING SUM(p.amount) > 800000 ORDER BY total DESC;'],
          ['A dozen-ish names cross the line.', 'Darjan bhar naam lakeer paar karte hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'QBR 6 — The monthly pivot: per month, delivered count, cancelled count and delivered revenue (rounded). Columns: month, delivered, cancelled, revenue. Sorted by month.',
          'QBR 6 — Monthly pivot: har mahine ke liye delivered count, cancelled count aur delivered revenue (rounded). Columns: month, delivered, cancelled, revenue. Month se sorted.',
        ],
        sol: "SELECT substr(o.order_date, 1, 7) AS month,\n  SUM(CASE WHEN o.status = 'delivered' THEN 1 ELSE 0 END) AS delivered,\n  SUM(CASE WHEN o.status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled,\n  ROUND(SUM(CASE WHEN o.status = 'delivered' THEN p.amount ELSE 0 END), 2) AS revenue\nFROM orders o JOIN payments p ON p.order_id = o.id\nGROUP BY substr(o.order_date, 1, 7) ORDER BY month;",
        hints: [
          ['Three conditional aggregates at month grain.', 'Month grain par teen conditional aggregates.'],
          ['GROUP BY substr(o.order_date,1,7) with the CASE trio from Module 39.', 'GROUP BY substr(o.order_date,1,7) aur Module 39 ka CASE trio.'],
          ['Twelve rows, chart-ready.', 'Barah rows, chart-ready.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'QBR 7 — City tier matrix: per city, total customers and delivered-order customers (distinct), keeping cities where nobody delivered. Columns: city, customers, delivered_buyers. Sorted by city.',
          'QBR 7 — City tier matrix: har city me kul customers aur delivered-order customers (distinct), wo cities bhi jahan kisi ko delivery nahi mili. Columns: city, customers, delivered_buyers. City se sorted.',
        ],
        sol: "SELECT c.city,\n  COUNT(DISTINCT c.id) AS customers,\n  COUNT(DISTINCT CASE WHEN o.status = 'delivered' THEN o.customer_id END) AS delivered_buyers\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nGROUP BY c.city ORDER BY c.city;",
        hints: [
          ['LEFT JOIN keeps every city; CASE inside COUNT(DISTINCT …) counts only delivered buyers (NULL else).', 'LEFT JOIN har city bachata hai; COUNT(DISTINCT …) ke andar CASE sirf delivered buyers ginta hai (warna NULL).'],
          ['COUNT(DISTINCT CASE WHEN … THEN customer_id END) — the NULL-else does the filtering.', 'COUNT(DISTINCT CASE WHEN … THEN customer_id END) — NULL-else hi filtering karta hai.'],
          ['Some cities show delivered_buyers < customers — their quiet share.', 'Kuch cities me delivered_buyers < customers — unka chupa hua hissa.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'QBR 8 — The benchmark report: per customer tier, total revenue PLUS a flag column "above_average" (1/0) marking tiers whose revenue exceeds the average tier revenue (subquery over the same grouped data). Columns: customer_type, revenue, above_average. Sorted by customer_type.',
          'QBR 8 — Benchmark report: har customer tier ke liye total revenue PLUS ek flag column "above_average" (1/0) jo bataye ki tier ki revenue average tier revenue se zyada hai (same grouped data par subquery). Columns: customer_type, revenue, above_average. customer_type se sorted.',
        ],
        sol: "WITH tier_revenue AS (\n  SELECT c.customer_type, SUM(p.amount) AS revenue\n  FROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id\n  GROUP BY c.customer_type\n)\nSELECT customer_type, ROUND(revenue, 2) AS revenue,\n  CASE WHEN revenue > (SELECT AVG(revenue) FROM tier_revenue) THEN 1 ELSE 0 END AS above_average\nFROM tier_revenue ORDER BY customer_type;",
        hints: [
          ['A CTE named tier_revenue (Module 46 preview) makes the self-comparison clean — or repeat the grouped subquery twice.', 'CTE naam tier_revenue (Module 46 preview) self-comparison saaf rakhta hai — ya grouped subquery do baar repeat karo.'],
          ['WITH tier_revenue AS (…) SELECT …, CASE WHEN revenue > (SELECT AVG(revenue) FROM tier_revenue) THEN 1 ELSE 0 END …;', 'WITH tier_revenue AS (…) SELECT …, CASE WHEN revenue > (SELECT AVG(revenue) FROM tier_revenue) THEN 1 ELSE 0 END …;'],
          ['Premium and regular revenue differ; one tier must sit above the mean.', 'Premium aur regular revenue alag hain; koi ek tier mean se upar hoga hi.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'QBR 9 — Category depth: parent category name and its total product-line revenue (through subs), only for parents whose revenue exceeds 5,000,000. Columns: name, revenue. Sorted by revenue descending. (Self-join categories parent→sub, join products, order_items.)',
          'QBR 9 — Category depth: parent category ka naam aur uska total product-line revenue (subs se hote hue), sirf wo parents jinki revenue 5,000,000 paar. Columns: name, revenue. Revenue se utarte sorted. (categories parent→sub self-join, products, order_items join.)',
        ],
        sol: 'SELECT parent.name, ROUND(SUM(oi.subtotal), 2) AS revenue\nFROM categories parent\nJOIN categories sub ON sub.parent_category_id = parent.id\nJOIN products pr ON pr.category_id = sub.id\nJOIN order_items oi ON oi.product_id = pr.id\nGROUP BY parent.id, parent.name\nHAVING SUM(oi.subtotal) > 5000000\nORDER BY revenue DESC;',
        hints: [
          ['Four joins: parent→sub→products→order_items; group at parent grain.', 'Chaar joins: parent→sub→products→order_items; parent grain par group.'],
          ['HAVING SUM(oi.subtotal) > 5000000 gates the parents.', 'HAVING SUM(oi.subtotal) > 5000000 parents ko gate karta hai.'],
          ['Electronics-style parents dominate.', 'Electronics jaise parents haavi hote hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'QBR 10 — The one-number KPI: a single aliased number aov (average order value): total payments divided by total orders, rounded to 2 decimals. One row.',
          'QBR 10 — Ek-number KPI: ek aliased number aov (average order value): total payments ÷ total orders, 2 decimals par rounded. Ek row.',
        ],
        sol: 'SELECT ROUND((SELECT SUM(amount) FROM payments) / (SELECT COUNT(*) FROM orders), 2) AS aov;',
        hints: [
          ['Two scalar subqueries, one division.', 'Do scalar subqueries, ek division.'],
          ['SELECT ROUND((SELECT SUM(amount) FROM payments) / (SELECT COUNT(*) FROM orders), 2) AS aov;', 'SELECT ROUND((SELECT SUM(amount) FROM payments) / (SELECT COUNT(*) FROM orders), 2) AS aov;'],
          ['≈ 77938.09 — the number every slide quotes.', '≈ 77938.09 — wo number jo har slide quote karta hai.'],
        ],
        rules: { checkColumnNames: true },
      }),
    ],
  }),
];
