'use client';

// Modules 21-23: Aggregate Functions Intro · COUNT Deep Dive · SUM & AVG

import { defineModule, section, step, example, mistake, mcq, outputQ, buildQ, blanksQ, task } from '../builder';
import type { Module } from '@/types/content';

export const modules: Module[] = [
  defineModule({
    n: 21,
    title: ['Aggregate Functions Intro', 'Aggregate Functions Intro'],
    time: '25 min',
    concepts: ['aggregate', 'count', 'sum', 'avg', 'min', 'max', 'group', 'collapse'],
    diagram: 'group-buckets',
    objectives: [
      ['Understand what aggregates do: many rows → one value', 'Samajhna aggregates kya karte hain: kai rows → ek value'],
      ['Use the five core aggregates on the e-commerce data', 'E-commerce data par paanch core aggregates use karna'],
      ['Know the golden rule: aggregates skip NULLs', 'Golden rule jaanna: aggregates NULLs skip karte hain'],
    ],
    theory: [
      section(
        ['From rows to answers', 'Rows se jawab tak'],
        [
          [
            'A new database greets you: customers, products, orders — 100, 200, 500 rows. Nobody wants to READ 500 rows; they want the number inside them: how many orders, what revenue, the cheapest product, the biggest spend. Aggregate functions collapse many rows into a single computed value: COUNT counts, SUM totals, AVG averages, MIN and MAX find the extremes.',
            'Ek naya database aapka swagat karta hai: customers, products, orders — 100, 200, 500 rows. Koi 500 rows ko PADHNA nahi chahta; log unke andar ka number chahte hain: kitne orders, kya revenue, sabse sasta product, sabse bada kharch. Aggregate functions kai rows ko ek computed value par collapse karte hain: COUNT ginta hai, SUM jodta hai, AVG average leta hai, MIN aur MAX extremes laate hain.',
          ],
          [
            'You met COUNT briefly in Beginner; now the full family arrives on real business data. An aggregate query answers questions like "how much money did we make" in one line — this is the exact toolset of every dashboard, KPI and report you have ever seen.',
            'COUNT se Beginner me mila tha; ab poora parivar real business data par aata hai. Aggregate query "humne kitna paisa kamaya" jaise sawal ek line me jawaab deti hai — yahi har dashboard, KPI aur report ka toolset hai jo aapne kabhi dekha hai.',
          ],
        ],
        [],
        'group-buckets'
      ),
      section(
        ['The shape of an aggregate query', 'Aggregate query ka shape'],
        [
          [
            'SELECT COUNT(*) FROM orders; returns a single cell: 500. SELECT MAX(price) FROM products; returns one number: 48914. When the SELECT list mixes an aggregate with a plain column — SELECT status, COUNT(*) FROM orders — the engine needs to know how to group rows by status first; that is GROUP BY, arriving properly in Module 25. For now: one aggregate, one answer.',
            'SELECT COUNT(*) FROM orders; ek single cell deta hai: 500. SELECT MAX(price) FROM products; ek number: 48914. Jab SELECT list me aggregate aur plain column mix hota hai — SELECT status, COUNT(*) FROM orders — engine ko pehle yeh jaanna hota hai ki rows status ke hisab se kaise group hote hain; wahi GROUP BY hai, Module 25 me poora aayega. Abhi: ek aggregate, ek jawab.',
          ],
          [
            'The golden rule to burn in now: every aggregate except COUNT(*) ignores NULLs. AVG(price) averages only known prices; SUM over zero known values returns NULL, not 0. Understanding this one rule prevents half of all aggregate bugs.',
            'Abhi se yaad kar lo golden rule: COUNT(*) ke alawa har aggregate NULL ignore karta hai. AVG(price) sirf pata wale prices ka average leta hai; agar koi value pata hi nahi to SUM 0 nahi, NULL deta hai. Yeh ek rule samajhna aadhi aggregate bugs rok deta hai.',
          ],
        ],
        [
          ['Aggregates: many rows in, one value out', 'Aggregates: andar kai rows, bahar ek value'],
          ['COUNT(*), SUM, AVG, MIN, MAX — the core five', 'COUNT(*), SUM, AVG, MIN, MAX — core paanch'],
          ['All but COUNT(*) skip NULL values', 'COUNT(*) ke alawa sab NULL skip karte hain'],
        ]
      ),
    ],
    tutorial: {
      title: ['First KPIs', 'Pehle KPIs'],
      steps: [
        step(null, [
          'Management wants the four headline numbers for the quarterly review. Each is one aggregate.',
          'Management ko quarterly review ke liye chaar headline numbers chahiye. Har ek ek aggregate hai.',
        ]),
        step('SELECT COUNT(*) AS total_orders FROM orders;', [
          '500 orders — the volume KPI.',
          '500 orders — volume KPI.',
        ], { table: 'orders' }),
        step('SELECT COUNT(*) AS total_orders, SUM(amount) AS revenue FROM orders o JOIN payments p ON p.order_id = o.id;', [
          'Hmm — a JOIN preview! Simpler first: aggregates on single tables. Revenue: SUM on payments.',
          'Hmm — JOIN ka preview! Pehle simple: single tables par aggregates. Revenue: payments par SUM.',
        ], { table: 'payments' }),
        step('SELECT SUM(amount) AS revenue, AVG(amount) AS avg_order FROM payments;', [
          'Revenue plus average payment — two KPIs in one row.',
          'Revenue aur average payment — ek row me do KPIs.',
        ], { table: 'payments' }),
        step('SELECT MIN(price) AS cheapest, MAX(price) AS priciest FROM products;', [
          'The price range — MIN and MAX bookend the catalogue.',
          'Price range — MIN aur MAX catalogue ke dono sire.',
        ], { run: true, table: 'products' }),
      ],
    },
    syntax: {
      template: 'SELECT COUNT(*) / SUM(col) / AVG(col) / MIN(col) / MAX(col)\nFROM table\n[WHERE condition];',
      parts: [
        { part: 'COUNT(*)', description: ['Counts rows (NULLs included)', 'Rows ginta hai (NULLs shaamil)'] },
        { part: 'SUM(col)', description: ['Total of known numeric values', 'Pata numeric values ka total'] },
        { part: 'AVG(col)', description: ['Mean of known values (NULLs skipped)', 'Pata values ka mean (NULLs skip)'] },
        { part: 'MIN / MAX', description: ['Smallest / largest known value', 'Sabse chhota / bada pata value'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT COUNT(*) FROM customers;', [
        '100 customers — the size of the base.',
        '100 customers — base ka size.',
      ]),
      example('easy', 'SELECT MAX(price) FROM products;', [
        'The priciest product in the catalogue: 48914.',
        'Catalogue me sabse mehnga product: 48914.',
      ]),
      example('medium', 'SELECT COUNT(*) AS orders, SUM(amount) AS revenue FROM payments;', [
        'Volume and value together — the dashboard pair.',
        'Volume aur value saath — dashboard jodi.',
      ]),
      example('hard', 'SELECT MIN(price) AS cheapest, MAX(price) AS priciest, ROUND(AVG(price), 2) AS average FROM products;', [
        'The full price profile in one row (ROUND tidies the average).',
        'Ek row me poora price profile (ROUND average ko saaf karta hai).',
      ]),
    ],
    mistakes: [
      mistake(
        ['Mixing aggregates with plain columns without GROUP BY', 'GROUP BY ke bina aggregates aur plain columns mix karna'],
        ['SELECT status, COUNT(*) FROM orders fails with "misuse of aggregate" in SQLite — the engine refuses to guess the groups. GROUP BY (Module 25) resolves it.', 'SELECT status, COUNT(*) FROM orders SQLite me "misuse of aggregate" error deta hai — engine groups guess nahi karta. GROUP BY (Module 25) ise theek karta hai.']
      ),
      mistake(
        ['Expecting SUM over empty input to be 0', 'Khaali input par SUM ka 0 hona expect karna'],
        ['SUM over zero rows returns NULL — "unknown total" — not zero. Guard with IFNULL(SUM(x), 0) when 0 is the business meaning.', 'Zero rows par SUM NULL deta hai — "unknown total" — zero nahi. Jab business ka matlab 0 ho to IFNULL(SUM(x), 0) use karo.']
      ),
      mistake(
        ['Averaging with COUNT(*) in your head', 'Dimag me COUNT(*) ke saath average nikalna'],
        ['AVG divides by the count of NON-NULL values only. If 10 of 50 emails are missing, AVG-related logic on email lengths sees 40, not 50.', 'AVG sirf NON-NULL values ki ginti se divide karta hai. Agar 50 me se 10 emails missing hain, to email par AVG logic 40 dekhta hai, 50 nahi.']
      ),
    ],
    summary: [
      ['Aggregates collapse many rows into one computed value', 'Aggregates kai rows ko ek computed value me collapse karte hain'],
      ['The core five: COUNT, SUM, AVG, MIN, MAX', 'Core paanch: COUNT, SUM, AVG, MIN, MAX'],
      ['All aggregates except COUNT(*) skip NULLs', 'COUNT(*) ke alawa sab aggregates NULLs skip karte hain'],
      ['Mixing aggregate + plain column requires GROUP BY', 'Aggregate + plain column ke liye GROUP BY zaroori hai'],
    ],
    quiz: [
      mcq(
        ['What does AVG(price) compute when some prices are NULL?', 'Jab kuch prices NULL hon to AVG(price) kya compute karta hai?'],
        [
          ['Average including NULLs as zero', 'NULLs ko zero maan kar average'],
          ['Average of the non-NULL prices only', 'Sirf non-NULL prices ka average'],
          ['NULL always', 'Hamesha NULL'],
          ['An error', 'Error'],
        ],
        1,
        ['Aggregates skip unknowns: the divisor is the count of known values.', 'Aggregates unknowns skip karte hain: divisor pata values ki ginti hai.']
      ),
      outputQ(
        'SELECT COUNT(*), SUM(amount) FROM payments;',
        ['Volume and total of all payments — what values?', 'Saari payments ka volume aur total — kaunsi values?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)', 'SUM(amount)'], rows: [[500, 38969045.0]] } },
          { label: 'B', result: { columns: ['COUNT(*)', 'SUM(amount)'], rows: [[100, 38969045.0]] } },
          { label: 'C', result: { columns: ['COUNT(*)', 'SUM(amount)'], rows: [[500, 0]] } },
          { label: 'D', result: { error: 'Error: misuse of aggregate' } },
        ],
        0,
        ['500 payments; the total revenue lands near 39 million (≈ 38,969,045).', '500 payments; total revenue lagbhag 39 million (≈ 38,969,045).']
      ),
      buildQ(
        ['Build: the number of products we sell', 'Banao: hum jitne products bechte hain unki ginti'],
        ['COUNT', 'SELECT', 'FROM', 'products', '(', '*', ')'],
        ['SELECT', 'COUNT', '(', '*', ')', 'FROM', 'products'],
        ['COUNT with star inside parentheses.', 'COUNT, star parentheses ke andar.']
      ),
      blanksQ(
        'SELECT ___(price) FROM products;',
        [{ options: ['MAX', 'COUNT', 'UPPER', 'LIKE'], correct: 'MAX' }],
        ['MAX finds the largest known price.', 'MAX sabse bada pata price laata hai.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Board meeting opener: how many customers do we serve? A single count.',
          'Board meeting ki shuruaat: hum kitne customers ko serve karte hain? Ek single count.',
        ],
        sol: 'SELECT COUNT(*) FROM customers;',
        hints: [
          ['COUNT(*) counts rows.', 'COUNT(*) rows ginta hai.'],
          ['SELECT COUNT(*) FROM customers;', 'SELECT COUNT(*) FROM customers;'],
          ['The answer is 100.', 'Jawab 100 hai.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'Catalogue range card: the lowest and highest product prices, aliased cheapest and priciest.',
          'Catalogue range card: sabse kam aur sabse zyada product price, aliased cheapest aur priciest.',
        ],
        sol: 'SELECT MIN(price) AS cheapest, MAX(price) AS priciest FROM products;',
        hints: [
          ['Two extremes, two aliases, one row.', 'Do extremes, do aliases, ek row.'],
          ['SELECT MIN(price) AS cheapest, MAX(price) AS priciest FROM products;', 'SELECT MIN(price) AS cheapest, MAX(price) AS priciest FROM products;'],
          ['118 and 48914.', '118 aur 48914.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'medium',
        desc: [
          'The daily dashboard: total payments received and the average payment, in one row, aliased total and average.',
          'Daily dashboard: kul payments aur average payment, ek row me, aliased total aur average.',
        ],
        sol: 'SELECT SUM(amount) AS total, AVG(amount) AS average FROM payments;',
        hints: [
          ['SUM and AVG pair naturally in one row.', 'SUM aur AVG ek row me naturally judte hain.'],
          ['SELECT SUM(amount) AS total, AVG(amount) AS average FROM payments;', 'SELECT SUM(amount) AS total, AVG(amount) AS average FROM payments;'],
          ['Average lands near 77938.', 'Average 77938 ke aaspaas aata hai.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'hard',
        desc: [
          'Operations snapshot for delivered orders: count and revenue of delivered orders only (orders where status = \'delivered\'), aliased delivered_orders and delivered_revenue.',
          'Delivered orders ka operations snapshot: sirf delivered orders (status = \'delivered\') ki ginti aur revenue, aliased delivered_orders aur delivered_revenue.',
        ],
        sol: "SELECT COUNT(*) AS delivered_orders, SUM(p.amount) AS delivered_revenue\nFROM orders o JOIN payments p ON p.order_id = o.id\nWHERE o.status = 'delivered';",
        hints: [
          ['First filter payments to delivered orders — a JOIN between orders and payments does it.', 'Pehle payments ko delivered orders tak simto — orders aur payments ke beech JOIN se hota hai.'],
          ["SELECT COUNT(*) AS delivered_orders, SUM(p.amount) AS delivered_revenue FROM orders o JOIN payments p ON p.order_id = o.id WHERE o.status = 'delivered';", "SELECT COUNT(*) AS delivered_orders, SUM(p.amount) AS delivered_revenue FROM orders o JOIN payments p ON p.order_id = o.id WHERE o.status = 'delivered';"],
          ['98 delivered orders. (JOINs get their own modules soon — copy the pattern for now.)', '98 delivered orders. (JOINs ke apne modules aane wale hain — abhi pattern copy karo.)'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'very_hard',
        desc: [
          'The inventory health card, one row, three numbers: product count (products), items in stock (in_stock = SUM of stock_quantity), and average stock per product (avg_stock). Headers checked.',
          'Inventory health card, ek row, teen numbers: product count (products), stock me items (in_stock = stock_quantity ka SUM), aur average stock per product (avg_stock). Headers check honge.',
        ],
        sol: 'SELECT COUNT(*) AS products, SUM(stock_quantity) AS in_stock, ROUND(AVG(stock_quantity), 2) AS avg_stock FROM products;',
        hints: [
          ['Three aggregates stack in one row; ROUND tidies the average.', 'Teen aggregates ek row me; ROUND average ko saaf karta hai.'],
          ['SELECT COUNT(*) AS products, SUM(stock_quantity) AS in_stock, ROUND(AVG(stock_quantity),2) AS avg_stock FROM products;', 'SELECT COUNT(*) AS products, SUM(stock_quantity) AS in_stock, ROUND(AVG(stock_quantity),2) AS avg_stock FROM products;'],
          ['200 products; roughly 47k items in stock.', '200 products; lagbhag 47k items stock me.'],
        ],
        rules: { checkColumnNames: true },
      }),
    ],
  }),

  defineModule({
    n: 22,
    title: ['COUNT Deep Dive', 'COUNT Deep Dive'],
    time: '25 min',
    concepts: ['count', 'count star', 'count column', 'count distinct', 'null behavior'],
    diagram: 'group-buckets',
    objectives: [
      ['Distinguish COUNT(*), COUNT(col) and COUNT(DISTINCT col)', 'COUNT(*), COUNT(col) aur COUNT(DISTINCT col) ka farak samajhna'],
      ['Use counts as data-quality probes', 'Counts ko data-quality probes ki tarah use karna'],
      ['Filter before counting with precision', 'Precision ke saath pehle filter phir count karna'],
    ],
    theory: [
      section(
        ['Three spellings, three meanings', 'Teen spellings, teen matlab'],
        [
          [
            'COUNT(*) counts ROWS — every row, regardless of any column\'s value, NULLs included. COUNT(col) counts KNOWN values of that column — NULL cells are skipped. COUNT(DISTINCT col) counts UNIQUE known values — both NULLs and repeats removed. Same function, three completely different questions: how many rows, how many filled cells, how many distinct values.',
            'COUNT(*) ROWS ginta hai — har row, kisi bhi column ki value chahe jo ho, NULLs shaamil. COUNT(col) us column ki KNOWN values ginta hai — NULL cells skip. COUNT(DISTINCT col) UNIQUE known values ginta hai — NULLs aur repeats dono hata diye. Same function, teen bilkul alag sawal: kitni rows, kitne bhare cells, kitni alag values.',
          ],
          [
            'In our data: 200 products (COUNT(*)), 200 known prices (COUNT(price) — price is never NULL here), and… how many DISTINCT categories do products cover? That question — "how many different X" — is the most-asked analytical question in business, and COUNT(DISTINCT) is its one-word answer.',
            'Hamare data me: 200 products (COUNT(*)), 200 pata prices (COUNT(price) — yahan price kabhi NULL nahi), aur… products kitne DISTINCT categories cover karte hain? Wo sawal — "kitne alag X" — business ka sabse zyada poocha jaane wala analytical sawal hai, aur COUNT(DISTINCT) uska ek-shabdi jawab hai.',
          ],
        ],
        [],
        'group-buckets'
      ),
      section(
        ['Counts as data-quality probes', 'Counts data-quality probes ki tarah'],
        [
          [
            'Comparing COUNT(*) with COUNT(col) measures completeness: 50 students, 41 known emails → 9 missing (18% of the base!). Analysts run these two side by side before trusting any column. In the e-commerce data, description and stock are always present — but in the wild, this probe catches broken imports and silent data loss daily.',
            'COUNT(*) ko COUNT(col) se compare karna completeness naapta hai: 50 students, 41 pata emails → 9 missing (base ka 18%!). Analysts kisi column par bharosa karne se pehle yeh do saath chalate hain. E-commerce data me description aur stock hamesha maujood hain — par bahar ki duniya me yeh probe roz broken imports aur chup data loss pakadta hai.',
          ],
          [
            'Counts also power funnel metrics: customers → orders → payments is a shrinkage story told with three COUNTs. You will build exactly that in the tasks.',
            'Counts funnel metrics bhi banate hain: customers → orders → payments ek shrinkage ki kahani hai jo teen COUNT se banti hai. Aap tasks me yahi banaoge.',
          ],
        ],
        [
          ['COUNT(*) = rows; COUNT(col) = known values', 'COUNT(*) = rows; COUNT(col) = pata values'],
          ['COUNT(DISTINCT col) = unique known values', 'COUNT(DISTINCT col) = unique pata values'],
          ['COUNT(*) − COUNT(col) = missing count', 'COUNT(*) − COUNT(col) = missing ginti'],
        ]
      ),
    ],
    tutorial: {
      title: ['The completeness probe', 'Completeness probe'],
      steps: [
        step(null, [
          'Before trusting the customers table, we probe its completeness — then measure the customer→order funnel.',
          'Customers table par bharosa karne se pehle hum completeness probe karte hain — phir customer→order funnel naapte hain.',
        ]),
        step('SELECT COUNT(*) AS rows, COUNT(email) AS with_email FROM customers;', [
          '100 rows, 100 known emails — the column is complete.',
          '100 rows, 100 pata emails — column complete hai.',
        ], { table: 'customers' }),
        step('SELECT COUNT(DISTINCT city) AS cities FROM customers;', [
          'Fifteen unique cities host our customer base.',
          'Pandrah unique cities hamari customer base ko sambhaalte hain.',
        ], { table: 'customers' }),
        step('SELECT COUNT(*) AS orders FROM orders;', [
          'The funnel widens: 100 customers produced 500 orders.',
          'Funnel chauda hota hai: 100 customers ne 500 orders diye.',
        ], { table: 'orders' }),
        step("SELECT COUNT(*) AS vip_orders FROM orders o JOIN customers c ON c.id = o.customer_id WHERE c.customer_type = 'vip';", [
          'Filtered counting: how many orders came from VIPs. (JOIN pattern — formalised later.)',
          'Filtered counting: VIPs se kitne orders aaye. (JOIN pattern — formalise baad me.)',
        ], { run: true, table: 'orders' }),
      ],
    },
    syntax: {
      template: 'SELECT COUNT(*) FROM t;        -- rows\nSELECT COUNT(col) FROM t;      -- known values\nSELECT COUNT(DISTINCT col) FROM t;  -- unique values',
      parts: [
        { part: 'COUNT(*)', description: ['All rows, NULLs included', 'Saari rows, NULLs shaamil'] },
        { part: 'COUNT(col)', description: ['Rows where col is known', 'Wo rows jahan col pata hai'] },
        { part: 'COUNT(DISTINCT col)', description: ['Unique known values', 'Unique pata values'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT COUNT(*) FROM order_items;', [
        '1480 line items — the finest-grained row count in the shop.',
        '1480 line items — shop ki sabse granular row ginti.',
      ]),
      example('easy', 'SELECT COUNT(DISTINCT payment_method) FROM payments;', [
        'How many payment methods are actually used: 5.',
        'Kitne payment methods asli me use hote hain: 5.'],
      ),
      example('medium', 'SELECT COUNT(*) AS total, COUNT(description) AS with_description FROM products;', [
        'A completeness probe on the catalogue: both come back 200 — clean data.',
        'Catalogue par completeness probe: dono 200 aate hain — saaf data.',
      ]),
      example('hard', 'SELECT COUNT(DISTINCT customer_id) AS buyers FROM orders;', [
        'How many different customers actually placed an order — the active-base metric.',
        'Kitne alag customers ne asli me order diya — active-base metric.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Using COUNT(col) to count rows', 'Rows ginne ke liye COUNT(col) use karna'],
        ['If col can be NULL, COUNT(col) undercounts. COUNT(*) is the row counter; COUNT(col) is the value counter.', 'Agar col NULL ho sakta hai to COUNT(col) kam ginta hai. COUNT(*) row counter hai; COUNT(col) value counter hai.']
      ),
      mistake(
        ['COUNT(DISTINCT a, b) portability assumptions', 'COUNT(DISTINCT a, b) portability assumptions'],
        ['SQLite accepts multiple columns in COUNT(DISTINCT …); several engines do not. The portable pattern is COUNT(DISTINCT a || \'-\' || b) or a subquery — learn the habit now.', 'SQLite COUNT(DISTINCT …) me kai columns leta hai; kuch engines nahi lete. Portable pattern hai COUNT(DISTINCT a || \'-\' || b) ya subquery — abhi aadat banao.']
      ),
      mistake(
        ['Counting filtered subsets with COUNT and no WHERE', 'WHERE ke bina COUNT se filtered subsets ganna'],
        ['COUNT sees only rows that survive WHERE. "How many delivered orders" needs the status filter INSIDE the same query or a CASE (later).', 'COUNT sirf wahi rows dekhta hai jo WHERE bacha le. "Kitne delivered orders" ke liye status filter usi query ke ANDAR ya CASE (baad me) chahiye.']
      ),
    ],
    summary: [
      ['COUNT(*) rows · COUNT(col) known · COUNT(DISTINCT) unique', 'COUNT(*) rows · COUNT(col) pata · COUNT(DISTINCT) unique'],
      ['The gap between the first two measures missing data', 'Pehle dono ka gap missing data naapta hai'],
      ['COUNT(DISTINCT) answers "how many different X"', 'COUNT(DISTINCT) "kitne alag X" ka jawab deta hai'],
      ['Filters inside the query shape what gets counted', 'Query ke andar ke filters shape karte hain ki kya gina jaayega'],
    ],
    quiz: [
      mcq(
        ['100 rows, 30 NULL cells in a column. What is COUNT(col)?', '100 rows, kisi column me 30 NULL cells. COUNT(col) kya hoga?'],
        [
          ['100', '100'],
          ['70', '70'],
          ['30', '30'],
          ['NULL', 'NULL'],
        ],
        1,
        ['COUNT(col) skips unknowns: 100 − 30 = 70 known values.', 'COUNT(col) unknowns skip karta hai: 100 − 30 = 70 pata values.']
      ),
      outputQ(
        'SELECT COUNT(DISTINCT city) FROM customers;',
        ['How many unique cities do customers live in?', 'Customers kitni unique cities me rehte hain?'],
        [
          { label: 'A', result: { columns: ['COUNT(DISTINCT city)'], rows: [[15]] } },
          { label: 'B', result: { columns: ['COUNT(DISTINCT city)'], rows: [[100]] } },
          { label: 'C', result: { columns: ['COUNT(DISTINCT city)'], rows: [[20]] } },
          { label: 'D', result: { error: 'Error: DISTINCT requires one column' } },
        ],
        0,
        ['The customer base spreads across 15 distinct cities.', 'Customer base 15 alag cities me phaili hai.']
      ),
      buildQ(
        ['Build: how many different statuses orders can have', 'Banao: orders ke kitne alag statuses ho sakte hain'],
        ['COUNT', 'SELECT', 'DISTINCT', 'status', 'FROM', 'orders', '(', ')'],
        ['SELECT', 'COUNT', '(', 'DISTINCT', 'status', ')', 'FROM', 'orders'],
        ['DISTINCT goes inside the COUNT parentheses.', 'DISTINCT COUNT ke parentheses ke andar aata hai.']
      ),
      blanksQ(
        'SELECT COUNT(___ email) FROM customers;',
        [{ options: ['DISTINCT', 'ALL', 'UNIQUE', 'EACH'], correct: 'DISTINCT' }],
        ['COUNT(DISTINCT email) counts unique addresses.', 'COUNT(DISTINCT email) unique addresses ginta hai.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Fulfilment volume check: how many line items exist across all orders? A single count on order_items.',
          'Fulfilment volume check: saare orders me kul kitne line items hain? order_items par ek single count.',
        ],
        sol: 'SELECT COUNT(*) FROM order_items;',
        hints: [
          ['Count the rows of the line-item table.', 'Line-item table ki rows gino.'],
          ['SELECT COUNT(*) FROM order_items;', 'SELECT COUNT(*) FROM order_items;'],
          ['1480 items.', '1480 items.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'Marketing reach: how many DIFFERENT cities do our customers live in? Aliased cities.',
          'Marketing reach: humare customers kitni ALAG cities me rehte hain? Aliased cities.',
        ],
        sol: 'SELECT COUNT(DISTINCT city) AS cities FROM customers;',
        hints: [
          ['DISTINCT inside COUNT.', 'COUNT ke andar DISTINCT.'],
          ['SELECT COUNT(DISTINCT city) AS cities FROM customers;', 'SELECT COUNT(DISTINCT city) AS cities FROM customers;'],
          ['Fifteen cities.', 'Pandrah cities.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'medium',
        desc: [
          'Catalogue completeness probe: one row with total products and products having a description, aliased total and with_description.',
          'Catalogue completeness probe: ek row me total products aur description wale products, aliased total aur with_description.',
        ],
        sol: 'SELECT COUNT(*) AS total, COUNT(description) AS with_description FROM products;',
        hints: [
          ['Two counts side by side reveal the gap.', 'Do counts saath-saath gap dikhate hain.'],
          ['SELECT COUNT(*) AS total, COUNT(description) AS with_description FROM products;', 'SELECT COUNT(*) AS total, COUNT(description) AS with_description FROM products;'],
          ['Both are 200 — clean data, gap zero.', 'Dono 200 hain — saaf data, gap zero.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'hard',
        desc: [
          'Active customer base: how many DISTINCT customers have placed at least one order? Aliased active_buyers.',
          'Active customer base: kitne ALAG customers ne kam se kam ek order diya hai? Aliased active_buyers.',
        ],
        sol: 'SELECT COUNT(DISTINCT customer_id) AS active_buyers FROM orders;',
        hints: [
          ['Distinct customer ids inside the orders table.', 'Orders table ke andar distinct customer ids.'],
          ['SELECT COUNT(DISTINCT customer_id) AS active_buyers FROM orders;', 'SELECT COUNT(DISTINCT customer_id) AS active_buyers FROM orders;'],
          ['Nearly every customer has ordered — expect close to 100.', 'Lagbhag har customer ne order diya hai — 100 ke aaspaas expect karo.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'very_hard',
        desc: [
          'The funnel card, one row, three numbers aliased customers, orders, buyers: total customers, total orders, and distinct customers among those orders. Headers checked.',
          'Funnel card, ek row, teen numbers aliased customers, orders, buyers: kul customers, kul orders, aur un orders me se distinct customers. Headers check honge.',
        ],
        sol: 'SELECT (SELECT COUNT(*) FROM customers) AS customers, (SELECT COUNT(*) FROM orders) AS orders, (SELECT COUNT(DISTINCT customer_id) FROM orders) AS buyers;',
        hints: [
          ['Three separate counts must appear in ONE row — scalar subqueries (next modules) do exactly that, or simply run the three counts and… the task needs one row: use three subqueries in the SELECT list.', 'Teen alag counts EK row me chahiye — scalar subqueries (agle modules) yahi karte hain, ya teeno counts alag-alag… task ko ek row chahiye: SELECT list me teen subqueries use karo.'],
          ['SELECT (SELECT COUNT(*) FROM customers) AS customers, (SELECT COUNT(*) FROM orders) AS orders, (SELECT COUNT(DISTINCT customer_id) FROM orders) AS buyers;', 'SELECT (SELECT COUNT(*) FROM customers) AS customers, (SELECT COUNT(*) FROM orders) AS orders, (SELECT COUNT(DISTINCT customer_id) FROM orders) AS buyers;'],
          ['Expected: 100, 500, and ~100. A first taste of subqueries — the real module arrives at 28.', 'Expected: 100, 500 aur ~100. Subqueries ka pehla swaad — asli module 28 par aata hai.'],
        ],
        rules: { checkColumnNames: true },
      }),
    ],
  }),

  defineModule({
    n: 23,
    title: ['SUM & AVG', 'SUM & AVG'],
    time: '25 min',
    concepts: ['sum', 'avg', 'total', 'average', 'mean', 'round', 'null', 'division'],
    diagram: 'group-buckets',
    objectives: [
      ['Total columns with SUM and average them with AVG', 'SUM se total aur AVG se average nikalna'],
      ['Round results for presentation with ROUND', 'Presentation ke liye ROUND se results saaf karna'],
      ['Predict NULL behaviour and empty-set results', 'NULL behaviour aur empty-set results predict karna'],
    ],
    theory: [
      section(
        ['Totals and means', 'Total aur mean'],
        [
          [
            'SUM adds up a numeric column across the surviving rows; AVG divides that total by the count of KNOWN values. They are the revenue and average-order-value of every dashboard. SUM(amount) over our payments is the company\'s lifetime revenue; AVG(amount) is how much a typical payment carries.',
            'SUM bach-chuki rows ke numeric column ko jodta hai; AVG us total ko KNOWN values ki ginti se divide karta hai. Yeh har dashboard ka revenue aur average-order-value hain. Hamari payments par SUM(amount) company ka lifetime revenue hai; AVG(amount) batata hai ki ek typical payment kitna le jaata hai.',
          ],
          [
            'Both skip NULLs — and this matters more than it sounds. If 5 of 200 prices were missing, AVG(price) divides by 195, silently excluding the unknowns from the denominator too. The average you get is "the average of what we know", which is usually right — but you must KNOW that is what you computed.',
            'Dono NULLs skip karte hain — aur iska matlab sunai deta hai. Agar 200 me se 5 prices missing hain, to AVG(price) 195 se divide karta hai, unknowns ko denominator se bhi chup-chaap nikaal kar. Jo average milta hai wo "jo hum jaante hain uska average" hai — jo aksar sahi hai — par aapko YE PATA hona chahiye ki aapne yahi compute kiya hai.',
          ],
        ],
        [],
        'group-buckets'
      ),
      section(
        ['Presentation and the empty case', 'Presentation aur khaali case'],
        [
          [
            'Raw averages often carry noisy decimals: AVG(amount) might return 77938.0900000001. ROUND(value, 2) trims to two decimals — a display nicety you will use in every report. Compute precisely, present cleanly: that is the professional contract with numbers.',
            'Raw averages me aksar shor wale decimals hote hain: AVG(amount) 77938.0900000001 de sakta hai. ROUND(value, 2) do decimals par kaat deta hai — har report me kaam aane wali display nicety. Precisely compute karo, saaf-saaf dikhao: numbers ke saath professional contract yahi hai.',
          ],
          [
            'The empty case is the interview favourite: SUM over ZERO rows returns NULL (an unknown total), not 0. If the business meaning of "no rows" is "zero revenue", wrap it: IFNULL(SUM(x), 0). AVG over zero rows is also NULL — and dividing by zero never happens, because there is nothing to divide.',
            'Khaali case interview ka favourite hai: ZERO rows par SUM NULL deta hai (unknown total), 0 nahi. Agar "koi row nahi" ka business matlab "zero revenue" hai, to wrap karo: IFNULL(SUM(x), 0). Zero rows par AVG bhi NULL hai — aur zero se divide kabhi nahi hota, kyunki divide karne ko kuch hai hi nahi.',
          ],
        ],
        [
          ['SUM total · AVG mean · both skip NULLs', 'SUM total · AVG mean · dono NULLs skip'],
          ['ROUND(x, 2) for presentation', 'Presentation ke liye ROUND(x, 2)'],
          ['Empty input: SUM/AVG return NULL, never 0 or error', 'Khaali input: SUM/AVG NULL dete hain, 0 ya error kabhi nahi'],
        ]
      ),
    ],
    tutorial: {
      title: ['Revenue maths', 'Revenue ka hisaab'],
      steps: [
        step(null, [
          'The finance team wants revenue, average payment, and a rounded view for the slide deck.',
          'Finance team ko revenue, average payment aur slide deck ke liye rounded view chahiye.',
        ]),
        step('SELECT SUM(amount) FROM payments;', [
          'Lifetime revenue: one very large number.',
          'Lifetime revenue: ek bahut bada number.',
        ], { table: 'payments' }),
        step('SELECT SUM(amount) AS revenue, AVG(amount) AS avg_payment FROM payments;', [
          'Revenue and average side by side.',
          'Revenue aur average saath-saath.',
        ], { table: 'payments' }),
        step('SELECT ROUND(AVG(amount), 2) AS avg_payment FROM payments;', [
          'Rounded for the slide — 77938.09 style, not 77938.09000001.',
          'Slide ke liye rounded — 77938.09 style, 77938.09000001 nahi.',
        ], { table: 'payments' }),
        step('SELECT SUM(subtotal) AS units_value FROM order_items WHERE quantity >= 3;', [
          'Filtered total: the value locked in bulk lines (quantity 3+).',
          'Filtered total: bulk lines (quantity 3+) me band value.',
        ], { run: true, table: 'order_items' }),
      ],
    },
    syntax: {
      template: 'SELECT SUM(col), AVG(col), ROUND(AVG(col), 2)\nFROM table\n[WHERE condition];',
      parts: [
        { part: 'SUM(col)', description: ['Total of known values', 'Pata values ka total'] },
        { part: 'AVG(col)', description: ['Mean of known values', 'Pata values ka mean'] },
        { part: 'ROUND(x, n)', description: ['Round to n decimals for display', 'Display ke liye n decimals par round'] },
        { part: 'IFNULL(SUM(x), 0)', description: ['Guard the empty case', 'Khaali case se bachav'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT SUM(stock_quantity) FROM products;', [
        'Every unit sitting in the warehouse, totalled.',
        'Warehouse me baitha har unit, jodkar.',
      ]),
      example('easy', 'SELECT ROUND(AVG(price), 2) FROM products;', [
        'The typical catalogue price: ≈ 8836.81.',
        'Typical catalogue price: ≈ 8836.81.',
      ]),
      example('medium', 'SELECT SUM(amount) AS revenue FROM payments WHERE payment_method = \'upi\';', [
        'Revenue through one payment rail only.',
        'Sirf ek payment rail se revenue.',
      ]),
      example('hard', 'SELECT SUM(subtotal) AS line_value, ROUND(AVG(subtotal), 2) AS avg_line FROM order_items WHERE quantity >= 2;', [
        'Filtered aggregates on the line-item grain.',
        'Line-item grain par filtered aggregates.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Averaging prices as if NULLs counted in the divisor', 'NULLs ko divisor me ginti maan kar average lena'],
        ['AVG divides by known values only. 195 known prices → divisor 195. State this when presenting averages.', 'AVG sirf pata values se divide karta hai. 195 pata prices → divisor 195. Average present karte waqt yeh batao.']
      ),
      mistake(
        ['Reporting 18-decimal averages to executives', 'Executives ko 18-decimal average dikhana'],
        ['ROUND(AVG(x), 2) belongs in every report-facing query. Compute raw if needed internally; present rounded.', 'Har report-facing query me ROUND(AVG(x), 2) hona chahiye. Andar raw rakho, bahar rounded dikhao.']
      ),
      mistake(
        ['SUM on a text column and hoping for the best', 'Text column par SUM karke bhagwan bharosa'],
        ['SQLite flexibly coerces some text to numbers and skips the rest — silent nonsense. SUM belongs to numeric columns, period.', 'SQLite kuch text ko chup-chaap numbers bana deta hai aur baaki skip — silent bakwas. SUM numeric columns ke liye hai, bas.']
      ),
    ],
    summary: [
      ['SUM totals; AVG averages; both ignore NULLs', 'SUM jodta hai; AVG average leta hai; dono NULL ignore karte hain'],
      ['ROUND(x, 2) for every displayed average', 'Har dikhaye jaane wale average ke liye ROUND(x, 2)'],
      ['Empty sets give NULL — guard with IFNULL when 0 is meant', 'Khaali set NULL deta hai — 0 matlab ho to IFNULL se bacho'],
      ['Filter first with WHERE, then aggregate', 'Pehle WHERE se filter, phir aggregate'],
    ],
    quiz: [
      mcq(
        ['What does SUM(amount) return when the WHERE filter matches zero rows?', 'Jab WHERE filter zero rows match kare to SUM(amount) kya deta hai?'],
        [
          ['0', '0'],
          ['NULL', 'NULL'],
          ['An error', 'Error'],
          ['The table total anyway', 'Phir bhi table ka total'],
        ],
        1,
        ['An unknown total: SUM over nothing is NULL. Use IFNULL(SUM(x), 0) when zero is the business answer.', 'Unknown total: kuch nahi bache to SUM NULL hai. Business ka jawab zero ho to IFNULL(SUM(x), 0) use karo.']
      ),
      outputQ(
        'SELECT ROUND(AVG(price), 2) FROM products;',
        ['The average product price, rounded:', 'Average product price, rounded:'],
        [
          { label: 'A', result: { columns: ['ROUND(AVG(price), 2)'], rows: [[8836.81]] } },
          { label: 'B', result: { columns: ['ROUND(AVG(price), 2)'], rows: [[48914]] } },
          { label: 'C', result: { columns: ['ROUND(AVG(price), 2)'], rows: [[118]] } },
          { label: 'D', result: { error: 'Error: no such function: ROUND' } },
        ],
        0,
        ['Two hundred prices average to about 8836.81 after rounding.', 'Do sau prices ka rounded average lagbhag 8836.81 hai.']
      ),
      buildQ(
        ['Build: total money paid via upi', 'Banao: upi se diya gaya kul paisa'],
        ['SUM', 'SELECT', 'amount', 'FROM', 'payments', 'WHERE', "payment_method = 'upi'"],
        ['SELECT', 'SUM', '(', 'amount', ')', 'FROM', 'payments', 'WHERE', "payment_method = 'upi'"],
        ['SUM with parentheses, filter after FROM.', 'SUM parentheses ke saath, FROM ke baad filter.']
      ),
      blanksQ(
        'SELECT ___(AVG(amount), 2) FROM payments;',
        [{ options: ['ROUND', 'TRIM', 'CASE', 'CAST'], correct: 'ROUND' }],
        ['ROUND(AVG(x), 2) is the presentation pattern.', 'ROUND(AVG(x), 2) presentation pattern hai.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Warehouse capacity check: total units in stock across all products. A single SUM.',
          'Warehouse capacity check: saare products ka kul stock units. Ek single SUM.',
        ],
        sol: 'SELECT SUM(stock_quantity) FROM products;',
        hints: [
          ['SUM on the stock column.', 'Stock column par SUM.'],
          ['SELECT SUM(stock_quantity) FROM products;', 'SELECT SUM(stock_quantity) FROM products;'],
          ['Roughly 47 thousand units.', 'Lagbhag 47 hazaar units.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'Pricing slide: average product price rounded to 2 decimals, aliased average_price.',
          'Pricing slide: average product price 2 decimals par rounded, aliased average_price.',
        ],
        sol: 'SELECT ROUND(AVG(price), 2) AS average_price FROM products;',
        hints: [
          ['ROUND wraps AVG.', 'ROUND AVG ko wrap karta hai.'],
          ['SELECT ROUND(AVG(price), 2) AS average_price FROM products;', 'SELECT ROUND(AVG(price), 2) AS average_price FROM products;'],
          ['≈ 8836.81.', '≈ 8836.81.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'medium',
        desc: [
          'Digital India audit: total revenue collected through UPI payments only, aliased upi_revenue.',
          'Digital India audit: sirf UPI payments se collected kul revenue, aliased upi_revenue.',
        ],
        sol: "SELECT SUM(amount) AS upi_revenue FROM payments WHERE payment_method = 'upi';",
        hints: [
          ['Filter the payment rail, then total.', 'Pehle payment rail filter karo, phir total.'],
          ["SELECT SUM(amount) AS upi_revenue FROM payments WHERE payment_method = 'upi';", "SELECT SUM(amount) AS upi_revenue FROM payments WHERE payment_method = 'upi';"],
          ['104 UPI payments contribute.', '104 UPI payments ka yogdaan.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'hard',
        desc: [
          'Bulk-order economics: for order lines with quantity 4 or more, the total line value (SUM of subtotal) and the average line value rounded to 2 decimals — one row, aliased bulk_value and bulk_average.',
          'Bulk-order economics: quantity 4 ya zyada wali order lines ke liye total line value (subtotal ka SUM) aur average line value 2 decimals par rounded — ek row, aliased bulk_value aur bulk_average.',
        ],
        sol: 'SELECT SUM(subtotal) AS bulk_value, ROUND(AVG(subtotal), 2) AS bulk_average FROM order_items WHERE quantity >= 4;',
        hints: [
          ['Filter on quantity, then two aggregates with aliases.', 'Quantity par filter, phir do aggregates aliases ke saath.'],
          ['SELECT SUM(subtotal) AS bulk_value, ROUND(AVG(subtotal), 2) AS bulk_average FROM order_items WHERE quantity >= 4;', 'SELECT SUM(subtotal) AS bulk_value, ROUND(AVG(subtotal), 2) AS bulk_average FROM order_items WHERE quantity >= 4;'],
          ['A few hundred lines qualify.', 'Kuch sàu lines qualify karti hain.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'very_hard',
        desc: [
          'The unit-economics card, one row: total catalogue value at list prices (list_value = SUM of price), total inventory value counting stock (inventory_value = SUM of price × stock_quantity), and average units per product rounded to 1 decimal (avg_units = AVG of stock_quantity). Headers checked. (Multiplication inside SUM works: SUM(price * stock_quantity).)',
          'Unit-economics card, ek row: list prices par catalogue ki total value (list_value = price ka SUM), stock ginte hue inventory value (inventory_value = price × stock_quantity ka SUM), aur average units per product 1 decimal par (avg_units = stock_quantity ka AVG). Headers check honge. (SUM ke andar multiplication chalta hai: SUM(price * stock_quantity).)',
        ],
        sol: 'SELECT SUM(price) AS list_value, SUM(price * stock_quantity) AS inventory_value, ROUND(AVG(stock_quantity), 1) AS avg_units FROM products;',
        hints: [
          ['SUM can add expressions, not just bare columns.', 'SUM sirf columns nahi, expressions bhi jod sakta hai.'],
          ['SELECT SUM(price) AS list_value, SUM(price * stock_quantity) AS inventory_value, ROUND(AVG(stock_quantity), 1) AS avg_units FROM products;', 'SELECT SUM(price) AS list_value, SUM(price * stock_quantity) AS inventory_value, ROUND(AVG(stock_quantity), 1) AS avg_units FROM products;'],
          ['Inventory value lands in the hundreds of millions.', 'Inventory value karodon me jaata hai.'],
        ],
        rules: { checkColumnNames: true },
      }),
    ],
  }),
];
