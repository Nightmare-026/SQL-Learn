'use client';

// Modules 27-29: HAVING · Subqueries Introduction · WHERE Subqueries

import { defineModule, section, step, example, mistake, mcq, outputQ, buildQ, blanksQ, task } from '../builder';
import type { Module } from '@/types/content';

export const modules: Module[] = [
  defineModule({
    n: 27,
    title: ['HAVING Clause', 'HAVING Clause'],
    time: '25 min',
    concepts: ['having', 'filter groups', 'where vs having', 'aggregate condition', 'group filter'],
    diagram: 'group-buckets',
    objectives: [
      ['Filter groups (not rows) with HAVING', 'HAVING se groups filter karna (rows nahi)'],
      ['Explain the WHERE vs HAVING division of labour', 'WHERE aur HAVING ka kaam-bantan samajhna'],
      ['Build reports that filter on aggregate values', 'Aggregate values par filter karne wali reports banana'],
    ],
    theory: [
      section(
        ['WHERE cannot filter what does not exist yet', 'WHERE wo nahi filter kar sakta jo abhi bana hi nahi'],
        [
          [
            '"Show cities with more than 5 students" — the filter target is a COUNT, which only exists AFTER grouping. WHERE runs before groups form, so it cannot see aggregates. HAVING is the group filter: it evaluates after GROUP BY, testing each finished bucket — HAVING COUNT(*) > 5 keeps only piles big enough.',
            '"5 se zyada students wali cities dikhao" — filter ka target COUNT hai, jo grouping ke BAAD hi banta hai. WHERE groups bante se pehle chalta hai, to aggregates ko dekh hi nahi sakta. HAVING group ka filter hai: wo GROUP BY ke baad chalta hai, har taiyar bucket ko test karta hai — HAVING COUNT(*) > 5 sirf kaafi badi paaltiyan rakhta hai.',
          ],
          [
            'This division of labour is the cleanest mental model in SQL: WHERE filters INPUT rows, HAVING filters OUTPUT groups. A query can use both: WHERE city <> \'Delhi\' first removes Delhi rows, then GROUP BY city, then HAVING COUNT(*) > 2 keeps only sufficiently-popular remaining cities.',
            'Yeh kaam-bantan SQL ka sabse saaf mental model hai: WHERE INPUT rows filter karta hai, HAVING OUTPUT groups. Ek query dono use kar sakti hai: pehle WHERE city <> \'Delhi\' Delhi rows hata deta hai, phir GROUP BY city, phir HAVING COUNT(*) > 2 sirf kaafi popular bachi cities rakhta hai.',
          ],
        ],
        [],
        'group-buckets'
      ),
      section(
        ['HAVING conditions are aggregate conditions', 'HAVING ki conditions aggregate conditions hoti hain'],
        [
          [
            'The HAVING clause may reference aggregates — COUNT(*), SUM(amount), AVG(price) — and the grouped labels. HAVING SUM(amount) > 1000000 means "keep groups whose total exceeds a million". In strict SQL engines HAVING can only see grouped and aggregated expressions; SQLite is permissive, but write it properly: aggregates in HAVING, raw columns in WHERE.',
            'HAVING clause aggregates refer kar sakti hai — COUNT(*), SUM(amount), AVG(price) — aur grouped labels. HAVING SUM(amount) > 1000000 ka matlab "wo groups rakho jinka total million se zyada hai". Strict SQL engines me HAVING sirf grouped aur aggregated expressions dekh sakta hai; SQLite permissive hai, par sahi likho: HAVING me aggregates, WHERE me raw columns.',
          ],
          [
            'A quick self-test when unsure which filter goes where: does the condition mention an aggregate? → HAVING. Does it test one row\'s own column against a value? → WHERE. Both? → both clauses, in the right order.',
            'Confusion ho to khud test karo: condition me aggregate ka zikr hai? → HAVING. Ek row ke apne column ki value test ho rahi hai? → WHERE. Dono? → dono clauses, sahi order me.',
          ],
        ],
        [
          ['WHERE: before grouping, on raw rows', 'WHERE: grouping se pehle, raw rows par'],
          ['HAVING: after grouping, on buckets', 'HAVING: grouping ke baad, buckets par'],
          ['Aggregate in the condition ⇒ HAVING', 'Condition me aggregate ⇒ HAVING'],
        ]
      ),
    ],
    tutorial: {
      title: ['Big piles only', 'Sirf badi paaltiyan'],
      steps: [
        step(null, [
          'Marketing wants "cities with real presence" — more than 5 customers. We build the group, then filter it.',
          'Marketing ko "real presence wali cities" chahiye — 5 se zyada customers. Pehle group, phir filter.',
        ]),
        step('SELECT city, COUNT(*) AS customers FROM customers GROUP BY city;', [
          'All fifteen city piles, unfiltered.',
          'Saari pandrah city paaltiyan, bina filter.',
        ], { table: 'customers' }),
        step('SELECT city, COUNT(*) AS customers FROM customers GROUP BY city HAVING COUNT(*) > 5;', [
          'Only piles with more than 5 members survive.',
          'Sirf 5 se zyada wali paaltiyan bachti hain.',
        ], { table: 'customers' }),
        step("SELECT city, COUNT(*) AS customers, ROUND(AVG(amount),2) AS avg_spend\nFROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id\nGROUP BY city HAVING COUNT(*) > 5;", [
          'A realistic triple-JOIN grouped report with a HAVING gate (JOIN training ahead — pattern preview).',
          'Ek realistic triple-JOIN grouped report, HAVING gate ke saath (JOIN training aage — pattern preview).',
        ], { table: 'customers' }),
        step("SELECT payment_method, COUNT(*) AS uses FROM payments WHERE amount > 50000 GROUP BY payment_method HAVING COUNT(*) > 20 ORDER BY uses DESC;", [
          'Both filters in one query: WHERE shrinks rows, HAVING shrinks groups.',
          'Ek query me dono filters: WHERE rows sikoda, HAVING groups sikoda.',
        ], { run: true, table: 'payments' }),
      ],
    },
    syntax: {
      template: 'SELECT group_col, AGG(col)\nFROM table\n[WHERE row_condition]\nGROUP BY group_col\nHAVING AGG(col) condition\n[ORDER BY …];',
      parts: [
        { part: 'WHERE row_condition', description: ['Pre-group row filter', 'Group se pehle row filter'] },
        { part: 'GROUP BY', description: ['Build the buckets', 'Buckets banao'] },
        { part: 'HAVING AGG(col) …', description: ['Post-group bucket filter', 'Group ke baad bucket filter'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT city, COUNT(*) FROM customers GROUP BY city HAVING COUNT(*) > 5;', [
        'Cities with real presence — the classic HAVING shape.',
        'Real presence wali cities — HAVING ka classic shape.',
      ]),
      example('easy', 'SELECT category_id, COUNT(*) AS products FROM products GROUP BY category_id HAVING COUNT(*) >= 12 ORDER BY products DESC;', [
        'Well-stocked categories only, sorted by depth.',
        'Sirf achhi tarah stocked categories, depth se sorted.',
      ]),
      example('medium', "SELECT status, COUNT(*) AS orders FROM orders WHERE order_date >= '2023-07-01' GROUP BY status HAVING COUNT(*) >= 40;", [
        'WHERE (date range on raw rows) + HAVING (group size) in one statement.',
        'Ek statement me WHERE (raw rows par date range) + HAVING (group size).',
      ]),
      example('hard', 'SELECT customer_id, SUM(amount) AS spend FROM orders o JOIN payments p ON p.order_id = o.id GROUP BY customer_id HAVING SUM(amount) > 1000000 ORDER BY spend DESC LIMIT 5;', [
        'Millionaire customers — filtered on the aggregate itself, Top-N on top.',
        'Millionaire customers — khud aggregate par filter, upar se Top-N.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Writing WHERE COUNT(*) > 5', 'WHERE COUNT(*) > 5 likhna'],
        ['Aggregates are illegal in WHERE — the groups do not exist yet. SQLite errors; the fix is HAVING.', 'WHERE me aggregates illegal hain — groups abhi bane hi nahi. SQLite error deta hai; fix hai HAVING.']
      ),
      mistake(
        ['Using HAVING for plain row filters', 'Simple row filters ke liye HAVING use karna'],
        ['HAVING city = \'Delhi\' works in SQLite but is wasteful and confusing: raw-column conditions belong in WHERE, which can use indexes.', 'HAVING city = \'Delhi\' SQLite me chal jaata hai par wasteful aur confusing hai: raw-column conditions WHERE me aati hain, jo indexes use kar sakte hain.']
      ),
      mistake(
        ['Forgetting HAVING sees post-aggregate values, not row values', 'HAVING ko row values dikhne ki ummeed'],
        ['HAVING AVG(amount) > 70000 compares each GROUP\'s average — every row being above 70000 is a different (WHERE) question entirely.', 'HAVING AVG(amount) > 70000 har GROUP ka average compare karta hai — har row 70000 se upar hona bilkul alag (WHERE) sawal hai.']
      ),
    ],
    summary: [
      ['HAVING filters groups after GROUP BY', 'HAVING, GROUP BY ke baad groups filter karta hai'],
      ['Aggregate conditions go in HAVING, never WHERE', 'Aggregate conditions HAVING me jaate hain, WHERE me kabhi nahi'],
      ['WHERE and HAVING coexist: rows first, buckets second', 'WHERE aur HAVING saath chalte hain: pehle rows, phir buckets'],
      ['SQLite tolerates sloppy HAVING; write it professionally anyway', 'SQLite sloppy HAVING maaf karta hai; phir bhi professional likho'],
    ],
    quiz: [
      mcq(
        ['"Categories with average price above 5000" — which clause filters that?', '"Average price 5000 se upar wali categories" — kaunsa clause use filter karega?'],
        [
          ['WHERE AVG(price) > 5000', 'WHERE AVG(price) > 5000'],
          ['HAVING AVG(price) > 5000', 'HAVING AVG(price) > 5000'],
          ['Both work identically', 'Dono same kaam karte hain'],
          ['Neither — needs a subquery', 'Koi nahi — subquery chahiye'],
        ],
        1,
        ['The condition tests an aggregate over groups, so it must be HAVING after GROUP BY category.', 'Condition groups par aggregate test karti hai, to GROUP BY category ke baad HAVING hi hoga.']
      ),
      outputQ(
        'SELECT city, COUNT(*) AS customers FROM customers GROUP BY city HAVING COUNT(*) > 6 ORDER BY customers DESC;',
        ['Which cities survive the filter?', 'Kaunsi cities filter paar karti hain?'],
        [
          { label: 'A', result: { columns: ['city', 'customers'], rows: [['Jaipur', 13]] } },
          { label: 'B', result: { columns: ['city', 'customers'], rows: [['Jaipur', 13], ['Kochi', 8], ['Kolkata', 8]] } },
          { label: 'C', result: { columns: ['city', 'customers'], rows: [['Jaipur', 13], ['Kochi', 8], ['Kolkata', 8], ['Bangalore', 7], ['Ahmedabad', 7]] } },
          { label: 'D', result: { error: 'Error: misuse of aggregate: COUNT()' } },
        ],
        1,
        ['Only three cities hold more than 6 customers: Jaipur 13, Kochi 8, Kolkata 8.', 'Sirf teen cities me 6 se zyada customers hain: Jaipur 13, Kochi 8, Kolkata 8.']
      ),
      buildQ(
        ['Build: product categories stocking 12+ products', 'Banao: 12+ products wali categories'],
        ['category_id', 'COUNT(*)', 'FROM', 'products', 'SELECT', 'GROUP BY', 'HAVING', '>=', '12'],
        ['SELECT', 'category_id', ',', 'COUNT', '(', '*', ')', 'FROM', 'products', 'GROUP', 'BY', 'category_id', 'HAVING', 'COUNT', '(', '*', ')', '>=', '12'],
        ['Group, then HAVING COUNT(*) >= 12.', 'Pehle group, phir HAVING COUNT(*) >= 12.']
      ),
      blanksQ(
        'SELECT city, COUNT(*) FROM customers GROUP BY city ___ COUNT(*) > 5;',
        [{ options: ['HAVING', 'WHERE', 'AND', 'IF'], correct: 'HAVING' }],
        ['Group filters live in HAVING.', 'Group filters HAVING me rehte hain.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Marketing presence: cities with MORE than 5 customers. Show city and the count.',
          'Marketing presence: 5 se ZYADA customers wali cities. City aur count dikhao.',
        ],
        sol: 'SELECT city, COUNT(*) FROM customers GROUP BY city HAVING COUNT(*) > 5;',
        hints: [
          ['The condition mentions COUNT ⇒ HAVING.', 'Condition me COUNT ka zikr hai ⇒ HAVING.'],
          ['SELECT city, COUNT(*) FROM customers GROUP BY city HAVING COUNT(*) > 5;', 'SELECT city, COUNT(*) FROM customers GROUP BY city HAVING COUNT(*) > 5;'],
          ['Three cities qualify.', 'Teen cities qualify karti hain.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'Deep inventory: categories with at least 12 products. Show category_id and products.',
          'Deep inventory: kam se kam 12 products wali categories. category_id aur products dikhao.',
        ],
        sol: 'SELECT category_id, COUNT(*) AS products FROM products GROUP BY category_id HAVING COUNT(*) >= 12;',
        hints: [
          ['HAVING with >= for the inclusive threshold.', 'Inclusive threshold ke liye >= wala HAVING.'],
          ['SELECT category_id, COUNT(*) AS products FROM products GROUP BY category_id HAVING COUNT(*) >= 12;', 'SELECT category_id, COUNT(*) AS products FROM products GROUP BY category_id HAVING COUNT(*) >= 12;'],
          ['A handful of categories qualify.', 'Chand categories qualify karti hain.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'Rail quality gate: payment methods that have been used at least 100 times. Show payment_method and uses, sorted by uses descending.',
          'Rail quality gate: kam se kam 100 baar use hue payment methods. payment_method aur uses dikhao, uses se utarte hue.',
        ],
        sol: 'SELECT payment_method, COUNT(*) AS uses FROM payments GROUP BY payment_method HAVING COUNT(*) >= 100 ORDER BY uses DESC;',
        hints: [
          ['Group the rail, gate the count, sort the survivors.', 'Rail ka group, count ka gate, survivors ka sort.'],
          ['SELECT payment_method, COUNT(*) AS uses FROM payments GROUP BY payment_method HAVING COUNT(*) >= 100 ORDER BY uses DESC;', 'SELECT payment_method, COUNT(*) AS uses FROM payments GROUP BY payment_method HAVING COUNT(*) >= 100 ORDER BY uses DESC;'],
          ['All five rails pass the gate.', 'Paanchon rails gate paar karte hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'Second-half momentum: statuses with at least 40 orders placed on or after 2023-07-01. Show status and orders. (WHERE before, HAVING after.)',
          'Second-half momentum: 2023-07-01 ya uske baad place hue kam se kam 40 orders wale statuses. Status aur orders dikhao. (Pehle WHERE, baad me HAVING.)',
        ],
        sol: "SELECT status, COUNT(*) AS orders FROM orders WHERE order_date >= '2023-07-01' GROUP BY status HAVING COUNT(*) >= 40;",
        hints: [
          ['One clause filters rows (date), the other filters groups (count).', 'Ek clause rows filter karta hai (date), doosra groups (count).'],
          ["SELECT status, COUNT(*) AS orders FROM orders WHERE order_date >= '2023-07-01' GROUP BY status HAVING COUNT(*) >= 40;", "SELECT status, COUNT(*) AS orders FROM orders WHERE order_date >= '2023-07-01' GROUP BY status HAVING COUNT(*) >= 40;"],
          ['~200 second-half orders spread across statuses.', '~200 second-half orders statuses me phaile hue.'],
        ],
      }),
      task({
        d: 'very_hard',
        desc: [
          'The VIP-gate report: cities whose customers\' TOTAL payment volume exceeds 2,000,000 — join customers→orders→payments, group by city, gate on SUM(amount) > 2000000, sorted by total descending. Columns: city, total. (JOIN pattern allowed — formal training at 33-37.)',
          'VIP-gate report: jin cities ke customers ka TOTAL payment volume 2,000,000 paar karta hai — customers→orders→payments join, city se group, SUM(amount) > 2000000 ka gate, total se utarta sorted. Columns: city, total. (JOIN pattern allowed — formal training 33-37 me.)',
        ],
        sol: 'SELECT c.city, ROUND(SUM(p.amount), 2) AS total\nFROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id\nGROUP BY c.city HAVING SUM(p.amount) > 2000000 ORDER BY total DESC;',
        hints: [
          ['Three tables joined, one group, one aggregate gate.', 'Teen tables joined, ek group, ek aggregate gate.'],
          ['SELECT c.city, ROUND(SUM(p.amount),2) AS total FROM customers c JOIN orders o ON o.customer_id=c.id JOIN payments p ON p.order_id=o.id GROUP BY c.city HAVING SUM(p.amount) > 2000000 ORDER BY total DESC;', 'SELECT c.city, ROUND(SUM(p.amount),2) AS total FROM customers c JOIN orders o ON o.customer_id=c.id JOIN payments p ON p.order_id=o.id GROUP BY c.city HAVING SUM(p.amount) > 2000000 ORDER BY total DESC;'],
          ['Several big cities cross the two-million line.', 'Kai badi cities do-million ki lakeer paar karti hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),

  defineModule({
    n: 28,
    title: ['Subqueries Introduction', 'Subqueries Introduction'],
    time: '25 min',
    concepts: ['subquery', 'nested query', 'inner query', 'outer query', 'scalar', 'execution order'],
    diagram: 'subquery-nest',
    objectives: [
      ['Read nested queries: inner first, outer second', 'Nested queries padhna: pehle inner, phir outer'],
      ['Use scalar subqueries as computed values', 'Scalar subqueries ko computed values ki tarah use karna'],
      ['Break impossible questions into two-step queries', 'Namumkin sawalon ko do-step queries me todna'],
    ],
    theory: [
      section(
        ['A query inside a query', 'Query ke andar query'],
      [
          [
            'Some questions cannot be answered in one flat statement: "how does each customer\'s spend compare to the AVERAGE spend?" The average is itself a query result — so you nest it: a subquery in parentheses, evaluated first, its result feeding the outer query. SQL lets queries nest several levels deep, each layer solving one step of the problem.',
            'Kuch sawal ek flat statement me nahi ulajhte: "har customer ka kharch average kharch se compare kaisa hai?" Average khud ek query ka result hai — to aap use nest kar dete hain: parentheses me subquery, pehle evaluate hoti hai, uska result outer query ko feed karta hai. SQL queries ko kai level deep nest karne deti hai, har layer problem ka ek step solve karti hai.',
          ],
          [
            'Execution always flows inner → outer (conceptually — engines optimise, but the logic reads bottom-up for scalar subqueries). A scalar subquery returns exactly ONE value — one row, one column — and can stand anywhere a value can: in SELECT, in WHERE comparisons, even inside another aggregate\'s argument.',
            'Execution hamesha inner → outer hoti hai (conceptually — engines optimise karte hain, par logic scalar subqueries ke liye neeche-se-upar padha jaata hai). Scalar subquery exactly EK value lautaati hai — ek row, ek column — aur wahan khadi ho sakti hai jahan koi bhi value ho sakti hai: SELECT me, WHERE comparisons me, doosre aggregate ke argument ke andar bhi.',
          ],
        ],
        [],
        'subquery-nest'
      ),
      section(
        ['Where subqueries appear', 'Subqueries kahan dikhte hain'],
        [
          [
            'Three great homes for subqueries: (1) in SELECT as a computed column — the funnel card you built earlier used three scalar subqueries; (2) in WHERE with comparison operators — WHERE price > (SELECT AVG(price) FROM products) finds above-average items; (3) in WHERE with IN — WHERE customer_id IN (SELECT customer_id FROM orders WHERE status = \'delivered\'), the membership test powered by a query. Each gets deeper treatment next module.',
            'Subqueries ke teen bade ghar: (1) SELECT me computed column ki tarah — funnel card jo aapne banaya tha usme teen scalar subqueries thi; (2) WHERE me comparison operators ke saath — WHERE price > (SELECT AVG(price) FROM products) average-se-upar wale items dhoondhta hai; (3) WHERE me IN ke saath — WHERE customer_id IN (SELECT customer_id FROM orders WHERE status = \'delivered\'), query se chalane wala membership test. Har ek ka gehra ilaaj agle module me.',
          ],
          [
            'Style matters: alias subqueries\' outputs, indent the inner query one level, and keep each layer answerable in one sentence — "the inner query finds the average; the outer finds products above it". Subqueries shine for one-shot steps; when a step gets reused, CTEs (Module 46) give it a name.',
            'Style matter karta hai: subqueries ke outputs alias karo, inner query ek level indent karo, aur har layer ek sentence me bolne layak rakho — "inner query average laati hai; outer usse upar wale products laata hai". Subqueries one-shot steps ke liye best hain; jab step reuse hona lage, CTEs (Module 46) use naam dete hain.',
          ],
        ],
        [
          ['Inner runs first; outer consumes its result', 'Pehle inner chalta hai; outer uska result use karta hai'],
          ['Scalar = one row, one column — usable as a value', 'Scalar = ek row, ek column — value ki tarah usable'],
          ['Homes: SELECT columns, WHERE comparisons, IN lists', 'Ghar: SELECT columns, WHERE comparisons, IN lists'],
        ]
      ),
    ],
    tutorial: {
      title: ['Two steps, one statement', 'Do step, ek statement'],
      steps: [
        step(null, [
          'Goal: products priced above the catalogue average. Step 1: find the average. Step 2: compare. Nesting does both at once.',
          'Goal: catalogue average se mehge products. Step 1: average nikaalo. Step 2: compare karo. Nesting dono ek saath karti hai.',
        ]),
        step('SELECT AVG(price) FROM products;', [
          'Step 1 alone: the average price (≈ 8836.81).',
          'Akela step 1: average price (≈ 8836.81).',
        ], { table: 'products' }),
        step('SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products);', [
          'Nested: the parenthesised average computes first, then the comparison filters row by row.',
          'Nested: bracket wala average pehle compute hota hai, phir comparison row-by-row filter karti hai.',
        ], { table: 'products', highlightWhere: 'price > 8836' }),
        step('SELECT name, price, (SELECT ROUND(AVG(price), 2) FROM products) AS average FROM products LIMIT 6;', [
          'A scalar subquery in the SELECT list — the reference value printed beside every row.',
          'SELECT list me scalar subquery — har row ke saath reference value printed.',
        ], { table: 'products' }),
        step('SELECT COUNT(*) AS above_average FROM products WHERE price > (SELECT AVG(price) FROM products);', [
          'Counting the survivors — how many products beat the average (45 by price > 10000 logic, similar magnitude).',
          'Bachon ki ginti — kitne products average se aage hain.',
        ], { run: true, table: 'products' }),
      ],
    },
    syntax: {
      template: 'SELECT col, (SELECT AGG(col2) FROM t2) AS ref\nFROM t1\nWHERE col > (SELECT AGG(col2) FROM t2);',
      parts: [
        { part: '(SELECT …)', description: ['Parenthesised inner query — runs first', 'Bracket wali inner query — pehle chalti hai'] },
        { part: 'scalar use', description: ['One-row-one-column result used as a value', 'Ek-row-ek-column result value ki tarah use'] },
        { part: 'indentation', description: ['Professional style indents inner queries', 'Professional style inner queries indent karta hai'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT (SELECT COUNT(*) FROM customers) AS customers, (SELECT COUNT(*) FROM orders) AS orders;', [
        'Two scalar subqueries, one row — the funnel card pattern.',
        'Do scalar subqueries, ek row — funnel card pattern.',
      ]),
      example('easy', 'SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products) LIMIT 6;', [
        'Above-average products — the canonical subquery example.',
        'Average-se-upar products — subquery ka canonical example.',
      ]),
      example('medium', 'SELECT name, price FROM products WHERE price < (SELECT AVG(price) FROM products) AND stock_quantity > 0 ORDER BY price LIMIT 6;', [
        'Below-average, in-stock bargains — subquery plus regular filters.',
        'Average-se-neeche, stock wale saste deals — subquery plus aam filters.',
      ]),
      example('hard', "SELECT COUNT(*) AS expensive FROM products WHERE price > (SELECT AVG(price) FROM products) AND is_active = 1;", [
        'Counting active products above average — two conditions, one nested.',
        'Average se upar active products ki ginti — do conditions, ek nested.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Forgetting the parentheses around the inner query', 'Inner query ke parentheses bhool jaana'],
        ['WHERE price > SELECT AVG(price)… is a syntax error. The parentheses ARE the subquery operator.', 'WHERE price > SELECT AVG(price)… syntax error hai. Parentheses HI subquery ka operator hain.']
      ),
      mistake(
        ['Scalar slot, multi-row result', 'Scalar jagah, multi-row result'],
        ['A subquery used as a value must return one row: "row value misused" or similar errors otherwise. Add LIMIT 1, aggregates, or switch to IN.', 'Value ki tarah use hone wali subquery ek row hi laoni chahiye: warna "row value misused" jaisa error. LIMIT 1, aggregates lagao, ya IN par switch karo.']
      ),
      mistake(
        ['Correlating too early', 'Bilkul shuru me hi correlate karna'],
        ['Keep first subqueries independent (no outer references). Correlated subqueries — inner queries reading outer columns — are powerful but arrive in Module 31.', 'Pehli subqueries independent rakho (outer ka reference nahi). Correlated subqueries — jo outer ke columns padhti hain — powerful hain par Module 31 me aate hain.']
      ),
    ],
    summary: [
      ['Subqueries nest one query inside another in parentheses', 'Subqueries ek query ko doosri ke andar bracket me rakhti hain'],
      ['Inner evaluates first; outer consumes the result', 'Pehle inner evaluate hota hai; outer result use karta hai'],
      ['Scalar subqueries return one value and slot in anywhere', 'Scalar subqueries ek value laati hain aur kahin bhi fit hoti hain'],
      ['Two-step questions become one nested statement', 'Do-step sawal ek nested statement ban jaate hain'],
    ],
    quiz: [
      mcq(
        ['Which runs FIRST in: SELECT name FROM products WHERE price > (SELECT AVG(price) FROM products)?', 'Kaunsa PEHLE chalta hai: SELECT name FROM products WHERE price > (SELECT AVG(price) FROM products)?'],
        [
          ['The outer SELECT', 'Outer SELECT'],
          ['The inner AVG subquery', 'Inner AVG subquery'],
          ['They run simultaneously', 'Dono saath chalte hain'],
          ['The engine decides randomly', 'Engine randomly decide karta hai'],
        ],
        1,
        ['Conceptually the inner query computes its value first; the outer query then compares every row against it.', 'Conceptually inner query pehle apni value compute karti hai; phir outer query har row ko usse compare karti hai.']
      ),
      outputQ(
        'SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products) ORDER BY price DESC LIMIT 3;',
        ['The three priciest above-average products:', 'Average se upar teen sabse mehge products:'],
        [
          { label: 'A', result: { columns: ['name', 'price'], rows: [['Titan Edge 96', 48914], ['Pulse Max 55 Gen3', 47883], ['Gamma Nova 48 Gen4', 47700]] } },
          { label: 'B', result: { columns: ['name', 'price'], rows: [['Alpha Lite 7', 118]] } },
          { label: 'C', result: { error: 'Error: row value misused' } },
          { label: 'D', result: { columns: ['name', 'price'], rows: [] } },
        ],
        0,
        ['Sorting the above-average set descending and capping at three yields the premium trio.', 'Above-average set ko utarte sort karke teen par rokne se premium trio milti hai.']
      ),
      buildQ(
        ['Build: customers above the average order count is hard — instead build products priced above the average (names only)', 'Banao: average order count se upar customers mushkil hai — uski jagah average price se upar products banao (sirf naam)'],
        ['SELECT', 'name', 'FROM', 'products', 'WHERE', 'price', '>', '(', 'SELECT', 'AVG', 'price', ')', 'FROM', 'products', '('],
        ['SELECT', 'name', 'FROM', 'products', 'WHERE', 'price', '>', '(', 'SELECT', 'AVG', '(', 'price', ')', 'FROM', 'products', ')'],
        ['Compare against the parenthesised average.', 'Bracket wale average se compare karo.']
      ),
      blanksQ(
        'SELECT name FROM products WHERE price ___ (___ AVG(price) FROM products);',
        [
          { options: ['>', 'FROM', 'LIKE'], correct: '>' },
          { options: ['SELECT', 'AVG', 'WHERE'], correct: 'SELECT' },
        ],
        ['Comparison operator, then the parenthesised inner query starting with SELECT.', 'Comparison operator, phir SELECT se shuru hone wali bracket wali inner query.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The stat card: total customers and total orders in ONE row — using two scalar subqueries, aliased customers and orders.',
          'Stat card: ek row me kul customers aur kul orders — do scalar subqueries se, aliased customers aur orders.',
        ],
        sol: 'SELECT (SELECT COUNT(*) FROM customers) AS customers, (SELECT COUNT(*) FROM orders) AS orders;',
        hints: [
          ['Wrap each COUNT in its own parenthesised SELECT.', 'Har COUNT ko apne bracket wale SELECT me wrap karo.'],
          ['SELECT (SELECT COUNT(*) FROM customers) AS customers, (SELECT COUNT(*) FROM orders) AS orders;', 'SELECT (SELECT COUNT(*) FROM customers) AS customers, (SELECT COUNT(*) FROM orders) AS orders;'],
          ['100 and 500.', '100 aur 500.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'easy',
        desc: [
          'Premium shelf: names and prices of products costing more than the catalogue average price.',
          'Premium shelf: catalogue average price se mehge products ke naam aur price.',
        ],
        sol: 'SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products);',
        hints: [
          ['The average lives in a subquery.', 'Average subquery me rehta hai.'],
          ['SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products);', 'SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products);'],
          ['Roughly 95 products qualify.', 'Lagbhag 95 products qualify karte hain.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'Bargain bin: names and prices of in-stock (stock_quantity > 0) products below the average price, sorted by price ascending.',
          'Bargain bin: average price se neeche wale stock (stock_quantity > 0) products ke naam aur price, price se chadhte sorted.',
        ],
        sol: 'SELECT name, price FROM products WHERE price < (SELECT AVG(price) FROM products) AND stock_quantity > 0 ORDER BY price ASC;',
        hints: [
          ['Subquery comparison plus a regular row filter, then sort.', 'Subquery comparison aur aam row filter, phir sort.'],
          ['SELECT name, price FROM products WHERE price < (SELECT AVG(price) FROM products) AND stock_quantity > 0 ORDER BY price ASC;', 'SELECT name, price FROM products WHERE price < (SELECT AVG(price) FROM products) AND stock_quantity > 0 ORDER BY price ASC;'],
          ['Cheapest first — 118 leads.', 'Sabse sasta pehle — 118 aage.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'The premium ratio: one row with aliased total_products and premium_products — the count of all products and the count priced above the catalogue average (computed via subquery).',
          'Premium ratio: ek row me aliased total_products aur premium_products — saare products ki ginti aur average se upar wale products ki ginti (subquery se).',
        ],
        sol: 'SELECT COUNT(*) AS total_products, (SELECT COUNT(*) FROM products WHERE price > (SELECT AVG(price) FROM products)) AS premium_products FROM products;',
        hints: [
          ['One plain aggregate plus one nested count in the SELECT list.', 'Ek plain aggregate aur SELECT list me ek nested count.'],
          ['SELECT COUNT(*) AS total_products, (SELECT COUNT(*) FROM products WHERE price > (SELECT AVG(price) FROM products)) AS premium_products FROM products;', 'SELECT COUNT(*) AS total_products, (SELECT COUNT(*) FROM products WHERE price > (SELECT AVG(price) FROM products)) AS premium_products FROM products;'],
          ['200 total, ~95 premium.', '200 total, ~95 premium.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'very_hard',
        desc: [
          'The comparison card: every product\'s name and price BESIDE the catalogue average (aliased avg_price from a scalar subquery) — only for products whose price is at least double the average. Sorted by price descending. Columns: name, price, avg_price.',
          'Comparison card: har product ka naam aur price catalogue average ke SAATH (scalar subquery se aliased avg_price) — sirf un products ka jinki price average se kam se kam double hai. Price se utarte sorted. Columns: name, price, avg_price.',
        ],
        sol: 'SELECT name, price, (SELECT ROUND(AVG(price), 2) FROM products) AS avg_price FROM products WHERE price >= 2 * (SELECT AVG(price) FROM products) ORDER BY price DESC;',
        hints: [
          ['The subquery appears twice — once as a column, once in the filter.', 'Subquery do baar aati hai — ek baar column, ek baar filter me.'],
          ['SELECT name, price, (SELECT ROUND(AVG(price),2) FROM products) AS avg_price FROM products WHERE price >= 2 * (SELECT AVG(price) FROM products) ORDER BY price DESC;', 'SELECT name, price, (SELECT ROUND(AVG(price),2) FROM products) AS avg_price FROM products WHERE price >= 2 * (SELECT AVG(price) FROM products) ORDER BY price DESC;'],
          ['The top premium products — 18000+ — appear with the ~8836.81 reference beside them.', 'Top premium products — 18000+ — ~8836.81 reference ke saath dikhte hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),

  defineModule({
    n: 29,
    title: ['WHERE Subqueries', 'WHERE Subqueries'],
    time: '25 min',
    concepts: ['subquery', 'where', 'in subquery', 'comparison subquery', 'membership', 'any', 'all'],
    diagram: 'subquery-nest',
    objectives: [
      ['Drive WHERE filters from subquery results', 'WHERE filters ko subquery results se chalana'],
      ['Use IN (SELECT …) for dynamic membership lists', 'Dynamic membership lists ke liye IN (SELECT …) use karna'],
      ['Compare against single-value subqueries safely', 'Single-value subqueries se safely compare karna'],
    ],
    theory: [
      section(
        ['The list that is itself a query', 'Wo list jo khud ek query hai'],
      [
          [
            'Module 14 taught IN with a hand-typed list. The professional upgrade: the list comes from a query. "Customers who have received a delivered order" becomes WHERE id IN (SELECT customer_id FROM orders WHERE status = \'delivered\') — the inner query collects the ids, the outer keeps matching members. Add one delivered order tomorrow and the answer updates automatically: no maintenance, no stale lists.',
            'Module 14 ne IN haath se likhi list ke saath sikhaya. Professional upgrade: list ek query se aati hai. "Jo customers delivered order paye hain" ban jaata hai WHERE id IN (SELECT customer_id FROM orders WHERE status = \'delivered\') — inner query ids jama karti hai, outer matching members rakhta hai. Kal ek delivered order jodo aur jawab khud update ho jaata hai: na maintenance, na purani list.',
          ],
          [
            'Comparison operators also accept single-value subqueries: WHERE price > (SELECT AVG(price)…) you already met. The rule for safety: comparison operators need the inner query to return ONE row; IN tolerates many rows (and zero rows — an empty list simply matches nothing, which is usually the correct semantics for "no qualifying members yet").',
            'Comparison operators bhi single-value subquery lete hain: WHERE price > (SELECT AVG(price)…) aap pehle hi mil chuka hai. Safety ka rule: comparison operators ko inner query se EK row chahiye; IN kai rows sahne ka taakat rakhta hai (aur zero rows bhi — khaali list kuch match nahi karti, jo aksar "abhi koi qualifying member nahi" ke liye sahi matlab hai).',
          ],
        ],
        [],
        'subquery-nest'
      ),
      section(
        ['Reading order and NOT IN', 'Padhne ka order aur NOT IN'],
        [
          [
            'Read IN-subqueries inside-out: inner SELECT defines the set, outer WHERE tests membership. When the inner query has its own WHERE, you have a two-stage filter — "of these particular rows, which belong to that set" — a pattern that covers an enormous range of business questions.',
            'IN-subqueries andar se bahar padho: inner SELECT set define karta hai, outer WHERE membership test karta hai. Jab inner query ka apna WHERE ho, aapke paas do-stage filter hai — "in rows me se, kaunse us set ke member hain" — ek pattern jo business ke bahut se sawalon ko cover karta hai.',
          ],
          [
            'NOT IN with subqueries inherits the NULL trap from Module 14: if the inner query can return NULLs, NOT IN breaks (returns nothing). Our ids are never NULL, so it is safe here — but the habit of checking "can the inner list contain NULL?" before writing NOT IN will save a production incident someday. NOT EXISTS (Module 32) is the bulletproof alternative.',
            'Subqueries ke saath NOT IN, Module 14 ka NULL trap virasat me leta hai: agar inner query NULL la sakti hai to NOT IN toot jaata hai (kuch nahi laata). Hamare ids kabhi NULL nahi, to yahan safe hai — par NOT IN likhne se pehle "kya inner list me NULL aa sakta hai?" check karne ki aadat kabhi ek production incident bachayegi. NOT EXISTS (Module 32) bulletproof alternative hai.',
          ],
        ],
        [
          ['IN (SELECT …): dynamic, self-updating membership', 'IN (SELECT …): dynamic, self-updating membership'],
          ['Comparison operators need single-row inner queries', 'Comparison operators ko single-row inner queries chahiye'],
          ['NOT IN + possible NULLs = danger; NOT EXISTS is safer', 'NOT IN + possible NULLs = khatra; NOT EXISTS safer hai'],
        ]
      ),
    ],
    tutorial: {
      title: ['The delivered set', 'Delivered set'],
      steps: [
        step(null, [
          'Retention question: which customers have received a delivered order? Build the set, then test membership.',
          'Retention sawal: kis-kis customers ko delivered order mila hai? Set banao, phir membership test karo.',
        ]),
        step("SELECT DISTINCT customer_id FROM orders WHERE status = 'delivered';", [
          'The inner query alone: ~95 distinct satisfied customers.',
          'Akeli inner query: ~95 alag santusht customers.',
        ], { table: 'orders' }),
        step("SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE status = 'delivered') LIMIT 8;", [
          'Membership test: outer rows filtered by the inner set.',
          'Membership test: outer rows inner set se filter.',
        ], { table: 'customers' }),
        step("SELECT COUNT(*) AS happy_customers FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE status = 'delivered');", [
          'Counting the members — the retention KPI.',
          'Members ki ginti — retention KPI.',
        ], { table: 'customers' }),
        step("SELECT name FROM customers WHERE id NOT IN (SELECT customer_id FROM orders WHERE status = 'delivered') LIMIT 5;", [
          'The complement: customers with zero delivered orders (ids are never NULL, so NOT IN is safe here).',
          'Complement: jinko koi delivered order nahi mila (ids kabhi NULL nahi, to NOT IN yahan safe hai).',
        ], { run: true, table: 'customers' }),
      ],
    },
    syntax: {
      template: "WHERE col IN (SELECT col2 FROM t2 [WHERE …])\nWHERE col > (SELECT AGG(col2) FROM t2)\nWHERE col NOT IN (SELECT …)",
      parts: [
        { part: 'IN (SELECT …)', description: ['Membership in a query-built set', 'Query se bane set me membership'] },
        { part: '> (SELECT …)', description: ['Comparison against one computed value', 'Ek computed value se comparison'] },
        { part: 'NOT IN (…)', description: ['Non-members; verify no NULLs possible', 'Non-members; NULLs na hone ki pushti karo'] },
      ],
    },
    examples: [
      example('very_easy', "SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE status = 'pending') LIMIT 6;", [
        'Customers with pending orders — the chase list.',
        'Pending orders wale customers — chase list.',
      ]),
      example('easy', "SELECT name, city FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE order_date >= '2023-12-01') LIMIT 6;", [
        'December-active customers.',
        'December me active customers.',
      ]),
      example('medium', 'SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products) AND stock_quantity > 0 ORDER BY price DESC LIMIT 6;', [
        'Subquery comparison combined with row filters, sorted.',
        'Subquery comparison row filters ke saath, sorted.',
      ]),
      example('hard', "SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE status = 'cancelled') AND customer_type = 'vip';", [
        'VIPs with cancelled orders — service recovery targets.',
        'Cancelled orders wale VIPs — service recovery targets.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Multi-row subquery against = ', 'Multi-row subquery ko = ke saath use karna'],
        ['= expects one row. Use IN for membership, or add aggregates/LIMIT to force a single value.', '= ek row expect karta hai. Membership ke liye IN use karo, ya single value pane ke liye aggregate/LIMIT lagao.']
      ),
      mistake(
        ['NOT IN over nullable inner columns', 'Nullable inner columns par NOT IN'],
        ['If the inner query yields any NULL, NOT IN returns zero rows forever. Check nullability, or use NOT EXISTS.', 'Agar inner query koi NULL de de to NOT IN hamesha zero rows deta hai. Nullability check karo, ya NOT EXISTS use karo.']
      ),
      mistake(
        ['Repeating a heavy subquery many times', 'Bhaari subquery ko baar-baar repeat karna'],
        ['If the same inner query appears twice, engines usually still compute it — later you will name it once with a CTE and reuse it everywhere.', 'Same inner query do baar aaye to engines aksar use dobara compute karti hain — baad me aap use CTE se ek baar naam karke har jagah reuse karoge.']
      ),
    ],
    summary: [
      ['IN (SELECT …) builds dynamic membership lists', 'IN (SELECT …) dynamic membership lists banata hai'],
      ['Comparisons need single-value inner queries', 'Comparisons ko single-value inner queries chahiye'],
      ['Inner WHERE creates two-stage filtering', 'Inner WHERE do-stage filtering banata hai'],
      ['Check NULL-safety before NOT IN subqueries', 'NOT IN subqueries se pehle NULL-safety check karo'],
    ],
    quiz: [
      mcq(
        ["What does WHERE id IN (SELECT customer_id FROM orders WHERE status = 'delivered') match?", "WHERE id IN (SELECT customer_id FROM orders WHERE status = 'delivered') kya match karta hai?"],
        [
          ['All customers', 'Sab customers'],
          ['Customers whose id appears among delivered orders', 'Wo customers jinki id delivered orders me dikhti hai'],
          ['Delivered orders', 'Delivered orders'],
          ['Nothing — subqueries cannot use IN', 'Kuch nahi — subqueries IN use nahi kar sakti'],
        ],
        1,
        ['The inner SELECT builds the id set; IN keeps outer rows whose id is a member.', 'Inner SELECT id set banata hai; IN wahi outer rows rakhta hai jinki id member hai.']
      ),
      outputQ(
        "SELECT COUNT(*) FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE status = 'delivered');",
        ['How many customers have received a delivered order?', 'Kitne customers ko delivered order mila hai?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[95]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[98]] } },
          { label: 'C', result: { columns: ['COUNT(*)'], rows: [[100]] } },
          { label: 'D', result: { error: 'Error: row value misused' } },
        ],
        0,
        ['98 delivered orders trace back to 95 distinct customers.', '98 delivered orders 95 alag customers tak jaate hain.']
      ),
      buildQ(
        ['Build: names of customers having delivered orders', 'Banao: delivered orders wale customers ke naam'],
        ['SELECT', 'name', 'FROM', 'customers', 'WHERE', 'id', 'IN', '(', 'SELECT', 'customer_id', 'FROM', 'orders', "status = 'delivered'", 'WHERE', ')'],
        ['SELECT', 'name', 'FROM', 'customers', 'WHERE', 'id', 'IN', '(', 'SELECT', 'customer_id', 'FROM', 'orders', 'WHERE', "status = 'delivered'", ')'],
        ['Outer membership, inner set-builder with its own WHERE.', 'Outer membership, inner set-builder apne WHERE ke saath.']
      ),
      blanksQ(
        'SELECT name FROM customers WHERE id ___ (SELECT customer_id ___ orders);',
        [
          { options: ['IN', '=', 'LIKE', 'BETWEEN'], correct: 'IN' },
          { options: ['FROM', 'IN', 'ON'], correct: 'FROM' },
        ],
        ['IN introduces the subquery; inside it, FROM orders.', 'IN subquery laata hai; uske andar FROM orders.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The chase list: names of customers who have at least one PENDING order.',
          'Chase list: un customers ke naam jinka kam se kam ek PENDING order hai.',
        ],
        sol: "SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE status = 'pending');",
        hints: [
          ['Inner: pending customer ids. Outer: membership.', 'Inner: pending customer ids. Outer: membership.'],
          ["SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE status = 'pending');", "SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE status = 'pending');"],
          ['105 pending orders, ~95 distinct customers.', '105 pending orders, ~95 alag customers.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'The satisfied base: names of customers who have received a DELIVERED order.',
          'Satisfied base: un customers ke naam jinhe DELIVERED order mila hai.',
        ],
        sol: "SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE status = 'delivered');",
        hints: [
          ['Same pattern, delivered set.', 'Wahi pattern, delivered set.'],
          ["SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE status = 'delivered');", "SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE status = 'delivered');"],
          ['95 customers appear.', '95 customers dikhte hain.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'The forgotten: names of customers with NO delivered order at all (NOT IN — ids are never NULL here).',
          'Bhule hue: jin customers ko koi DELIVERED order nahi mila (NOT IN — yahan ids kabhi NULL nahi).',
        ],
        sol: "SELECT name FROM customers WHERE id NOT IN (SELECT customer_id FROM orders WHERE status = 'delivered');",
        hints: [
          ['NOT IN keeps non-members of the set.', 'NOT IN set ke non-members rakhta hai.'],
          ["SELECT name FROM customers WHERE id NOT IN (SELECT customer_id FROM orders WHERE status = 'delivered');", "SELECT name FROM customers WHERE id NOT IN (SELECT customer_id FROM orders WHERE status = 'delivered');"],
          ['About five customers have never received a delivery.', 'Lagbhag paanch customers ko kabhi delivery nahi mili.'],
        ],
      }),
      task({
        d: 'hard',
        desc: [
          'VIP recovery: names and cities of VIP customers who have had a CANCELLED order.',
          'VIP recovery: un VIP customers ke naam aur cities jinka koi CANCELLED order raha hai.',
        ],
        sol: "SELECT name, city FROM customers WHERE customer_type = 'vip' AND id IN (SELECT customer_id FROM orders WHERE status = 'cancelled');",
        hints: [
          ['Outer row filter + inner set membership.', 'Outer row filter + inner set membership.'],
          ["SELECT name, city FROM customers WHERE customer_type = 'vip' AND id IN (SELECT customer_id FROM orders WHERE status = 'cancelled');", "SELECT name, city FROM customers WHERE customer_type = 'vip' AND id IN (SELECT customer_id FROM orders WHERE status = 'cancelled');"],
          ['A handful of VIPs need a goodwill call.', 'Chand VIPs ko goodwill call chahiye.'],
        ],
      }),
      task({
        d: 'very_hard',
        desc: [
          'Above-average buyers: names of customers whose TOTAL spend (SUM of their payments) exceeds the average per-customer spend — computed via a scalar subquery over a grouped join. Sorted… no, plain list; row order free. (Hint: inner = SELECT AVG(s) FROM (SELECT SUM(p.amount) AS s FROM payments p JOIN orders o ON p.order_id = o.id GROUP BY o.customer_id); outer = same join grouped, HAVING SUM > that value.)',
          'Average-se-upar buyers: un customers ke naam jinka TOTAL kharch (unki payments ka SUM) per-customer average kharch se zyada hai — grouped join par scalar subquery se. Plain list; row order free. (Hint: inner = SELECT AVG(s) FROM (SELECT SUM(p.amount) AS s FROM payments p JOIN orders o ON p.order_id = o.id GROUP BY o.customer_id); outer = wahi join grouped, HAVING SUM > wo value.)',
        ],
        sol: 'SELECT c.name\nFROM customers c\nJOIN orders o ON o.customer_id = c.id\nJOIN payments p ON p.order_id = o.id\nGROUP BY c.id, c.name\nHAVING SUM(p.amount) > (\n  SELECT AVG(s) FROM (\n    SELECT SUM(p2.amount) AS s FROM payments p2 JOIN orders o2 ON o2.id = p2.order_id GROUP BY o2.customer_id\n  )\n);',
        hints: [
          ['Two levels of nesting: innermost groups per customer; middle averages the totals.', 'Do level nesting: andar wali per-customer group karti hai; beech wali totals ka average leti hai.'],
          ['GROUP BY c.id, c.name with HAVING SUM(p.amount) > (SELECT AVG(s) FROM (…)).', 'GROUP BY c.id, c.name aur HAVING SUM(p.amount) > (SELECT AVG(s) FROM (…)).'],
          ['Roughly half the customers beat the average — that is how averages work.',
          'Lagbhag aadhe customers average se aage hain — averages aise hi kaam karte hain.'],
        ],
      }),
    ],
  }),
];
