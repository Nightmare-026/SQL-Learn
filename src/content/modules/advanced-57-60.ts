'use client';

// Modules 57-60: Execution Plans · Data Modeling · Mini Project 4 · Capstone

import { defineModule, section, step, example, mistake, mcq, outputQ, buildQ, blanksQ, task } from './builder';
import type { Module } from '@/types/content';

export const modules: Module[] = [
  defineModule({
    n: 57,
    title: ['Execution Plans', 'Execution Plans'],
    time: '25 min',
    concepts: ['execution plan', 'query plan', 'scan', 'search', 'temp b-tree', 'sort', 'bottleneck', 'composite detail'],
    diagram: 'index-tree',
    objectives: [
      ['Read multi-line plans with subqueries and sorts', 'Subqueries aur sorts wali multi-line plans padhna'],
      ['Identify bottlenecks: scans on big tables, temp sorts', 'Bottlenecks dhoondhna: badi tables par scans, temp sorts'],
      ['Iterate: plan → fix → re-plan', 'Iterate karna: plan → fix → dobara plan'],
    ],
    theory: [
      section(
        ['A plan is a story', 'Plan ek kahani hai'],
        [
          [
            'EXPLAIN QUERY PLAN narrates the query as numbered steps: subqueries first (smaller id numbers run deeper), each line declaring its table, its access method (SCAN / SEARCH USING INDEX / SEARCH USING COVERING INDEX) and its job (filter, sort via TEMP B-TREE, group). Reading top-to-bottom IS the execution logic — with practice you see the query\'s cost before running it.',
            'EXPLAIN QUERY PLAN query ko numbered steps ki kahani ki tarah sunata hai: pehle subqueries (chote id numbers gehri chalti hain), har line apni table, apna access method (SCAN / SEARCH USING INDEX / SEARCH USING COVERING INDEX) aur apna kaam (filter, TEMP B-TREE se sort, group) batati hai. Upar se neeche padhna hi execution logic hai — practice se aap query ka daam chalane se pehle dekhne lagenge.',
          ],
          [
            'The two red flags to hunt: SCAN on a large table (every row read — the earlier modules\' villain, now named), and "USE TEMP B-TREE FOR ORDER BY/GROUP BY" (the engine must sort intermediate results itself — sometimes unavoidable, often index-fixable: an index matching the sort order removes the temp tree).',
            'Do red flags dhoondhne hain: badi table par SCAN (har row padhi jaati — pichle modules ka villain, ab naam ke saath), aur "USE TEMP B-TREE FOR ORDER BY/GROUP BY" (engine ko beech ka result khud sort karna padta hai — kabhi zaroori, aksar index se thik: sort order se match karta index temp tree khatam kar deta hai).',
          ],
        ],
        [],
        'index-tree'
      ),
      section(
        ['The improvement loop', 'Improvement ka loop'],
        [
          [
            'Professional workflow: EXPLAIN → find the worst line → fix (index the column, rewrite the predicate, shrink earlier) → EXPLAIN again → compare. Two plans side by side tell the whole story: "SCAN orders" became "SEARCH orders USING INDEX idx…". The loop is the discipline; the specific fix is always one of the levers from Module 56.',
            'Professional workflow: EXPLAIN → sabse buri line dhoondo → theek karo (column index karo, predicate rewrite karo, pehle sikodo) → dobara EXPLAIN → compare. Do plans saath-saath poori kahani kehte hain: "SCAN orders" ban gaya "SEARCH orders USING INDEX idx…". Loop hi discipline hai; khaas fix hamesha Module 56 ke levers me se ek hota hai.',
          ],
          [
            'A sobering truth for honesty: small dev databases choose scans because they ARE optimal at that size — the planner is cost-based, not rule-based. You optimise for the SHAPE the production data will have: thousands of rows, selective filters, real indexes. Trust the plan, but read it at the right scale.',
            'Imаandari ka ek sach: chhote dev databases scan chunti hain kyunki us size par wo OPTIMAL hi hote hain — planner cost-based hai, rule-based nahi. Aap us SHAPE ke liye optimise karte hain jo production data ka hoga: hazaron rows, selective filters, asli indexes. Plan par bharosa karo — par sahi scale par padho.',
          ],
        ],
        [
          ['Steps run: subqueries (deep) → outer (shallow)', 'Steps aise chalte hain: subqueries (geehri) → outer (upar)'],
          ['Red flags: big-table SCANs, TEMP B-TREE sorts', 'Red flags: badi table ke SCAN, TEMP B-TREE sorts'],
          ['Loop: plan → fix → re-plan → compare', 'Loop: plan → fix → re-plan → compare'],
        ]
      ),
    ],
    tutorial: {
      title: ['Reading a full story', 'Poora story padhna'],
      steps: [
        step(null, [
          'A query with a subquery and a sort — its plan reads like a three-act play.',
          'Ek query jisme subquery aur sort hai — iska plan teen-act play ki tarah padha jaata hai.',
        ]),
        step("EXPLAIN QUERY PLAN\nSELECT name FROM customers\nWHERE id IN (SELECT customer_id FROM orders WHERE status = 'delivered');", [
          'Two steps: the subquery SEARCHes orders by status; the outer SEARCHes customers by primary key.',
          'Do steps: subquery orders ko status se SEARCH karti hai; outer customers ko primary key se.',
        ], { table: 'orders' }),
        step('EXPLAIN QUERY PLAN SELECT city, COUNT(*) FROM customers GROUP BY city;', [
          'A GROUP BY via TEMP B-TREE — the engine builds the groups itself.',
          'GROUP BY TEMP B-TREE se — engine groups khud banata hai.',
        ], { table: 'customers' }),
        step("CREATE INDEX idx_customers_city ON customers(city);\nEXPLAIN QUERY PLAN SELECT city, COUNT(*) FROM customers GROUP BY city;", [
          'Index on city: the grouping can read pre-sorted data — the temp tree disappears (in many such shapes).',
          'city par index: grouping pehle-sorted data padh sakti hai — temp tree gayab (aise kai shapes me).',
        ], { table: 'customers' }),
        step("EXPLAIN QUERY PLAN\nSELECT o.status, ROUND(SUM(p.amount), 2) AS revenue\nFROM orders o JOIN payments p ON p.order_id = o.id\nGROUP BY o.status ORDER BY revenue DESC;", [
          'A full analytics plan: joins, grouping, sorting — every line a decision you can now read.',
          'Poora analytics plan: joins, grouping, sorting — har line ek faisla jo aap ab padh sakte hain.',
        ], { run: true, table: 'orders' }),
      ],
    },
    syntax: {
      template: 'EXPLAIN QUERY PLAN <your query>;\n-- read: SCAN (bad on big tables) · SEARCH USING INDEX (good)\n--        USING COVERING INDEX (best) · TEMP B-TREE (sort cost)',
      parts: [
        { part: 'step ids', description: ['Smaller = deeper (runs first)', 'Chhota = gehra (pehle chalta hai)'] },
        { part: 'SCAN', description: ['Full table read', 'Poori table padhi gayi'] },
        { part: 'SEARCH USING INDEX', description: ['Directed tree walk', 'Directed tree walk'] },
        { part: 'TEMP B-TREE', description: ['Engine-side sort for ORDER/GROUP', 'ORDER/GROUP ke liye engine-side sort'] },
      ],
    },
    examples: [
      example('very_easy', 'EXPLAIN QUERY PLAN SELECT * FROM payments WHERE payment_method = \'upi\';', [
        'One line, one decision: scan or search?',
        'Ek line, ek faisla: scan ya search?',
      ]),
      example('easy', 'EXPLAIN QUERY PLAN SELECT * FROM orders ORDER BY customer_id;', [
        'Sort plans: does an index cover the order, or does a temp tree appear?',
        'Sort plans: kya index order cover karta hai, ya temp tree aata hai?',
      ]),
      example('medium', 'EXPLAIN QUERY PLAN SELECT c.city, COUNT(*) FROM customers c JOIN orders o ON o.customer_id = c.id GROUP BY c.city;', [
        'A join+group plan: two access paths plus a grouping step.',
        'Join+group plan: do access path aur grouping step.',
      ]),
      example('hard', "EXPLAIN QUERY PLAN SELECT name FROM products WHERE price > (SELECT AVG(price) FROM products);", [
        'A subquery plan: the average computes deep, the outer compares per row.',
        'Subquery plan: average gehrai me compute hota hai, outer har row par compare.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Reading plans only for the outer query', 'Sirf outer query ke plan padhna'],
        ['Subqueries get their own plan lines (with deeper ids). A "fast" outer query over a slow subquery is still slow — read every line.', 'Subqueries ki apni plan lines hoti hain (geehre ids ke saath). Slow subquery ke upar "fast" outer query phir bhi slow hai — har line padho.']
      ),
      mistake(
        ['Panic-fixing TEMP B-TREE on small data', 'Chhote data par TEMP B-TREE se panic'],
        ['Temp sorts on 100 rows cost nothing. Chase them when intermediate sets are large or the query runs constantly (dashboards, APIs).', '100 rows par temp sort ka koi daam nahi. Unhe tab pechhо jab beech ka set bada ho ya query bar-bar chale (dashboards, APIs).']
      ),
      mistake(
        ['Trusting rules over costs', 'Costs ki jagah rules par bharosa'],
        ['The planner may scan a tiny table deliberately — cheaper than tree descent. Fight the plan only with EXPLAIN evidence, never vibes.', 'Planner chhoti table par jaan-boojh kar scan kar sakta hai — tree utarne se sasta. Plan se lado sirf EXPLAIN saboot ke saath, kabhi feelings se nahi.']
      ),
    ],
    summary: [
      ['Plans narrate steps: ids, access methods, jobs', 'Plans steps sunaate hain: ids, access methods, kaam'],
      ['Hunt big-table SCANs and avoidable temp sorts', 'Badi-table SCAN aur avoidable temp sorts ka shikar karo'],
      ['Index matching a sort order can remove temp trees', 'Sort order se match karta index temp trees hata sakta hai'],
      ['Plan → fix → re-plan is the improvement loop', 'Plan → fix → re-plan hi improvement loop hai'],
    ],
    quiz: [
      mcq(
        ['In a plan, what does a deeper step id (like 2 vs 4) usually mean?', 'Plan me gehra step id (jaise 2 vs 4) aksar kya matlab rakhta hai?'],
        [
          ['It runs later', 'Wo baad me chalta hai'],
          ['It runs first (subqueries execute before consuming steps)', 'Wo pehle chalta hai (subqueries consumer steps se pehle chalti hain)'],
          ['It is slower', 'Wo slow hai'],
          ['It uses more memory', 'Wo zyada memory leta hai'],
        ],
        1,
        ['Inner/deeper steps feed outer ones — they execute first, and their cost propagates upward.', 'Andar/gehre steps bahar walon ko feed karte hain — wo pehle chalte hain, aur unka daam upar failta hai.']
      ),
      outputQ(
        'EXPLAIN QUERY PLAN SELECT * FROM customers ORDER BY name;',
        ['What sort mechanism appears (no name index)?', 'Kaunsa sort mechanism dikhta hai (name index ke bina)?'],
        [
          { label: 'A', result: { columns: ['id', 'parent', 'notused', 'detail'], rows: [[3, 0, 0, 'SCAN customers'], [5, 0, 0, 'USE TEMP B-TREE FOR ORDER BY']] } },
          { label: 'B', result: { columns: ['id', 'parent', 'notused', 'detail'], rows: [[2, 0, 0, 'SEARCH customers USING INDEX idx_customers_city']] } },
          { label: 'C', result: { error: 'Error: near "ORDER": syntax error' } },
          { label: 'D', result: { columns: ['id', 'parent', 'notused', 'detail'], rows: [[4, 0, 0, 'SCAN customers USING COVERING INDEX']] } },
        ],
        0,
        ['Without a city index: scan the table, then sort via a temporary B-tree — two cost lines to optimise.', 'City index ke bina: table scan, phir temporary B-tree se sort — optimise karne ki do cost lines.']
      ),
      buildQ(
        ['Build: explain a grouped query', 'Banao: grouped query ka explain'],
        ['EXPLAIN', 'QUERY', 'PLAN', 'SELECT', 'city', 'COUNT(*)', 'FROM', 'customers', 'GROUP BY', 'city'],
        ['EXPLAIN', 'QUERY', 'PLAN', 'SELECT', 'city', ',', 'COUNT', '(', '*', ')', 'FROM', 'customers', 'GROUP', 'BY', 'city'],
        ['EXPLAIN QUERY PLAN prefixes any query.', 'EXPLAIN QUERY PLAN kisi bhi query ke aage lagta hai.']
      ),
      blanksQ(
        '___ QUERY ___ SELECT * FROM t WHERE x = 1;',
        [
          { options: ['EXPLAIN', 'ANALYZE', 'DESCRIBE'], correct: 'EXPLAIN' },
          { options: ['PLAN', 'PATH', 'PROFILE'], correct: 'PLAN' },
        ],
        ['EXPLAIN QUERY PLAN — the three-word magnifier.', 'EXPLAIN QUERY PLAN — teen-shabd ka magnifier.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The single-line read: EXPLAIN QUERY PLAN for payments WHERE payment_method = \'upi\'. Submit the EXPLAIN statement.',
          'Single-line padhna: payments WHERE payment_method = \'upi\' ka EXPLAIN QUERY PLAN. EXPLAIN statement submit karo.',
        ],
        sol: "EXPLAIN QUERY PLAN SELECT * FROM payments WHERE payment_method = 'upi';",
        hints: [
          ['One statement, one plan line.', 'Ek statement, ek plan line.'],
          ['EXPLAIN QUERY PLAN SELECT * FROM payments WHERE payment_method = \'upi\';', 'EXPLAIN QUERY PLAN SELECT * FROM payments WHERE payment_method = \'upi\';'],
          ['Note the access method the engine picked.', 'Engine ne kaunsa access method chuna — note karo.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'The subquery story: EXPLAIN QUERY PLAN for SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE status = \'delivered\'). Submit it.',
          'Subquery story: SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE status = \'delivered\') ka EXPLAIN QUERY PLAN. Submit karo.',
        ],
        sol: "EXPLAIN QUERY PLAN SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE status = 'delivered');",
        hints: [
          ['Two steps in the output — read both.', 'Output me do steps — dono padho.'],
          ["EXPLAIN QUERY PLAN SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE status = 'delivered');", "EXPLAIN QUERY PLAN SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE status = 'delivered');"],
          ['The subquery step carries a deeper id.', 'Subquery step gehra id rakhta hai.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'The temp-tree spotter: EXPLAIN QUERY PLAN for customers ORDER BY city (no index) — see the TEMP B-TREE. Then CREATE INDEX idx_cust_city ON customers(city) and EXPLAIN again. Submit all three statements.',
          'Temp-tree spotter: customers ORDER BY city (bina index) ka EXPLAIN QUERY PLAN — TEMP B-TREE dekho. Phir CREATE INDEX idx_cust_city ON customers(city) aur dobara EXPLAIN. Teeno statements submit karo.',
        ],
        sol: 'EXPLAIN QUERY PLAN SELECT * FROM customers ORDER BY city;\nCREATE INDEX idx_cust_city ON customers(city);\nEXPLAIN QUERY PLAN SELECT * FROM customers ORDER BY city;',
        hints: [
          ['Before-index plan shows the temp sort; after-index plan may lose it.', 'Index-se-pehle plan temp sort dikhata hai; index ke baad gayab ho sakta hai.'],
          ['Create the index, re-explain, compare the two plans.', 'Index banao, dobara explain karo, dono plans compare karo.'],
          ['The before/after pair is the deliverable.', 'Before/after jodi hi deliverable hai.'],
        ],
        verifyQuery: "SELECT name FROM sqlite_master WHERE type='index' AND name='idx_cust_city'",
      }),
      task({
        d: 'hard',
        desc: [
          'The join plan: EXPLAIN QUERY PLAN for the status-revenue query — SELECT o.status, SUM(p.amount) FROM orders o JOIN payments p ON p.order_id = o.id GROUP BY o.status. Submit the EXPLAIN.',
          'Join plan: status-revenue query ka EXPLAIN QUERY PLAN — SELECT o.status, SUM(p.amount) FROM orders o JOIN payments p ON p.order_id = o.id GROUP BY o.status. EXPLAIN submit karo.',
        ],
        sol: 'EXPLAIN QUERY PLAN SELECT o.status, SUM(p.amount) FROM orders o JOIN payments p ON p.order_id = o.id GROUP BY o.status;',
        hints: [
          ['Three jobs: two accesses plus a group.', 'Teen kaam: do access aur ek group.'],
          ['EXPLAIN QUERY PLAN SELECT o.status, SUM(p.amount) FROM orders o JOIN payments p ON p.order_id = o.id GROUP BY o.status;', 'EXPLAIN QUERY PLAN SELECT o.status, SUM(p.amount) FROM orders o JOIN payments p ON p.order_id = o.id GROUP BY o.status;'],
          ['Identify which table gets scanned vs searched.', 'Kaunsi table scan hoti hai aur kaunsi search — pehchano.'],
        ],
      }),
      task({
        d: 'very_hard',
        desc: [
          'The full optimisation loop: (1) EXPLAIN the slow-shaped query — SELECT * FROM orders WHERE substr(order_date, 1, 7) = \'2023-06\'; (2) EXPLAIN the sargable rewrite (June range); (3) CREATE INDEX idx_orders_status ON orders(status); (4) EXPLAIN SELECT status, COUNT(*) FROM orders GROUP BY status. All four statements, one submission — the complete before/after portfolio.',
          'Poora optimisation loop: (1) slow-shape query ka EXPLAIN — SELECT * FROM orders WHERE substr(order_date, 1, 7) = \'2023-06\'; (2) sargable rewrite ka EXPLAIN (June range); (3) CREATE INDEX idx_orders_status ON orders(status); (4) EXPLAIN SELECT status, COUNT(*) FROM orders GROUP BY status. Chaar statements, ek submission — poora before/after portfolio.',
        ],
        sol: "EXPLAIN QUERY PLAN SELECT * FROM orders WHERE substr(order_date, 1, 7) = '2023-06';\nEXPLAIN QUERY PLAN SELECT * FROM orders WHERE order_date >= '2023-06-01' AND order_date < '2023-07-01';\nCREATE INDEX idx_orders_status ON orders(status);\nEXPLAIN QUERY PLAN SELECT status, COUNT(*) FROM orders GROUP BY status;",
        hints: [
          ['Four statements: bad plan, good plan, new index, improved group plan.', 'Chaar statements: bura plan, achha plan, naya index, behtar group plan.'],
          ["The rewrite comparison is lines 1-2; the index work is lines 3-4.", "Rewrite comparison lines 1-2 hai; index kaam lines 3-4."],
          ['Read all four outputs — that is the practice.', 'Chaarо output padho — wahi practice hai.'],
        ],
        verifyQuery: "SELECT name FROM sqlite_master WHERE type='index' AND name='idx_orders_status'",
      }),
    ],
  }),

  defineModule({
    n: 58,
    title: ['Data Modeling', 'Data Modeling'],
    time: '30 min',
    concepts: ['data modeling', 'normalization', '1nf', '2nf', '3nf', 'primary key', 'foreign key', 'relationships', 'erd'],
    diagram: 'normalization',
    objectives: [
      ['Model entities, keys and relationships', 'Entities, keys aur relationships model karna'],
      ['Normalise to 3NF step by step', 'Step-by-step 3NF tak normalise karna'],
      ['Read and design ER-style structures', 'ER-style structures padhna aur design karna'],
    ],
    theory: [
      section(
        ['From spreadsheet to schema', 'Spreadsheet se schema tak'],
        [
          [
            'Data modelling is deciding WHAT tables exist, WHAT columns each holds, and HOW they relate — before a single query is written. The core ideas: one table per ENTITY (customer, product, order), a PRIMARY KEY identifying each row (often a synthetic id), and FOREIGN KEYS expressing relationships (order.customer_id → customers.id). Get this right and every query you know becomes natural; get it wrong and no query technique saves you.',
            'Data modelling ka matlab hai decide karna KAUNSI tables hain, HAR ek me kaunse columns, aur wo kaise judi hain — pehli query likhe se pehle. Core ideas: har ENTITY ki ek table (customer, product, order), har row ko pehchanne wala PRIMARY KEY (aksar synthetic id), aur relationships batane wale FOREIGN KEYS (order.customer_id → customers.id). Ye sahi karo to aapki har query natural ho jaati hai; galat karo to koi query technique nahi bachata.',
          ],
          [
            'Relationship shapes: one-to-many (a customer has many orders — FK on the "many" side), many-to-many (students ⨝ courses — resolved through a junction table enrollments with two FKs; our order_items is exactly this between orders and products), and one-to-one (rare; usually merging or splitting for security/size).',
            'Relationship shapes: one-to-many (ek customer ke kai orders — FK "many" side par), many-to-many (students ⨝ courses — enrollments junction table se solve, do FKs ke saath; hamara order_items orders aur products ke beech yahi hai), aur one-to-one (rare; aksar security/size ke liye merge ya split).',
          ],
        ],
        [],
        'normalization'
      ),
      section(
        ['Normalisation: the 1-2-3 ladder', 'Normalisation: 1-2-3 ki seedhi'],
        [
          [
            '1NF: atomic values, no repeating groups — one phone per cell, no "phone1, phone2" columns. 2NF: no partial dependency on a composite key — every non-key column depends on the WHOLE key (order_items keyed by (order, product) correctly carries quantity; putting product NAME there would depend only on product — 2NF violation). 3NF: no transitive dependency — non-key columns must not depend on other non-key columns (storing city AND city_region in customers: region depends on city, not the key — move region to a cities table).',
            '1NF: atomic values, koi repeating groups nahi — ek cell me ek phone, koi "phone1, phone2" columns nahi. 2NF: composite key par partial dependency nahi — har non-key column PURE key par depend kare (order_items jo (order, product) key se hai, quantity sahi rakhta hai; wahan product ka NAAM rakhna sirf product par depend karta — 2NF violation). 3NF: transitive dependency nahi — non-key columns doosre non-key columns par depend na karein (customers me city AUR city_region: region city par depend karta hai, key par nahi — region ko cities table me le jao).',
          ],
          [
            'Normalise to eliminate anomalies: without 3NF, updating a city\'s region means hunting every customer row (update anomaly); a city with no customers loses its region entirely (deletion anomaly); new-city facts need fake customers (insertion anomaly). Normal forms are not pedantry — they are anomaly insurance.',
            'Normalise anamalies hataane ke liye: 3NF ke bina city ka region update karna har customer row shikar karna hai (update anomaly); jiski city customers nahi, uska region poora gayab (deletion anomaly); nayi city ke facts ke liye fake customers chahiye (insertion anomaly). Normal forms pedantry nahi — anomaly insurance hain.',
          ],
        ],
        [
          ['One table per entity; PK identifies; FK relates', 'Har entity ki ek table; PK pehchanta hai; FK jodta hai'],
          ['1NF atomic · 2NF whole-key · 3NF no transitive', '1NF atomic · 2NF pure-key · 3NF no transitive'],
          ['M:N needs a junction table with two FKs', 'M:N ko junction table chahiye, do FKs ke saath'],
        ]
      ),
    ],
    tutorial: {
      title: ['Modelling a school', 'School ka modelling'],
      steps: [
        step(null, [
          'Design check: our school database walked the ladder — let\'s verify each form on the real schema.',
          'Design check: hamari school database seedhi chadhi hai — asli schema par har form verify karte hain.',
        ]),
        step("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%';", [
          'Nine-plus entities: customers, products, orders, order_items, payments, reviews… — one table each.',
          'Nau+ entities: customers, products, orders, order_items, payments, reviews… — har ek ki ek table.',
        ], { table: 'customers' }),
        step('PRAGMA table_info(customers);', [
          'Atomic columns only — every cell a single value. 1NF holds.',
          'Sirf atomic columns — har cell ek single value. 1NF ka paalan hai.',
        ], { table: 'customers' }),
        step('PRAGMA foreign_key_list(order_items);', [
          'The junction: two FKs (order, product) — the M:N resolver, with quantity/subtotal depending on the WHOLE pair. 2NF holds.',
          'Junction: do FKs (order, product) — M:N solver, quantity/subtotal PURE pair par depend karte hain. 2NF ka paalan hai.',
        ], { table: 'order_items' }),
        step("SELECT city, COUNT(*) FROM customers GROUP BY city ORDER BY COUNT(*) DESC LIMIT 5;", [
          'City repeats across customers but nothing DERIVED from city is stored in the row — no transitive dependency. 3NF holds.',
          'City customers me repeat hota hai par city se KUCH DERIVE hone wala row me store nahi — koi transitive dependency nahi. 3NF ka paalan hai.',
        ], { run: true, table: 'customers' }),
      ],
    },
    syntax: {
      template: 'CREATE TABLE parent (\n  id INTEGER PRIMARY KEY,\n  …\n);\nCREATE TABLE child (\n  id INTEGER PRIMARY KEY,\n  parent_id INTEGER REFERENCES parent(id),\n  …\n);',
      parts: [
        { part: 'PRIMARY KEY', description: ['Row identity — usually synthetic id', 'Row ki pehchan — aksar synthetic id'] },
        { part: 'REFERENCES', description: ['Declares the foreign key relationship', 'Foreign key relationship declare karta hai'] },
        { part: 'junction table', description: ['Two FKs resolve many-to-many', 'Do FKs many-to-many solve karte hain'] },
      ],
    },
    examples: [
      example('very_easy', "PRAGMA table_info(orders);", [
        'Inspecting a table\'s columns and types — modelling made visible.',
        'Table ke columns aur types dekhna — modelling dikhta hai.',
      ]),
      example('easy', 'PRAGMA foreign_key_list(orders);', [
        'Orders reference customers — the relationship, as a foreign key.',
        'Orders customers ko reference karte hain — relationship, foreign key ki tarah.',
      ]),
      example('medium', 'CREATE TABLE IF NOT EXISTS cities (name TEXT PRIMARY KEY, region TEXT);\nSELECT COUNT(*) FROM cities;', [
        'A normalisation refactor: regions move to their own table (3NF repair, demonstrated in sandbox spirit).',
        'Normalisation refactor: regions apni table me chale jaate hain (3NF repair, sandbox bhaav me).',
      ]),
      example('hard', "SELECT sql FROM sqlite_master WHERE name = 'order_items';", [
        'Reading the DDL of the junction table — the whole design in one statement.',
        'Junction table ki DDL padhna — ek statement me poora design.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Storing derived data (city + region together)', 'Derived data store karna (city + region saath)'],
        ['Derived columns drift: update one, miss the other. Compute on read (JOIN to the reference table) or enforce with triggers — never duplicate facts.', 'Derived columns badalte hain: ek update karo, doosra chhoot jaata hai. Read par compute karo (reference table se JOIN) ya triggers se enforce karo — facts duplicate kabhi nahi.']
      ),
      mistake(
        ['Missing junction tables for M:N', 'M:N ke liye junction table missing'],
        ['"A student takes many courses; a course has many students" cannot be two FK columns — it needs enrollments(student_id, course_id). Arrays-in-a-column are the 1NF sin.', '"Ek student kai courses leta hai; ek course me kai students" — ye do FK columns nahi ban sakte, enrollments(student_id, course_id) chahiye. Column me array rakhna 1NF ka paap hai.']
      ),
      mistake(
        ['Natural keys that drift (email as PK)', 'Badalte natural keys (email ko PK banana)'],
        ['Emails change; ids should be stable and meaningless. Surrogate keys survive business reality.', 'Email badalta hai; ids stable aur be-matlab hone chahiye. Surrogate keys business sachaiya jhel lete hain.']
      ),
    ],
    summary: [
      ['Model entities → keys → relationships, in that order', 'Entities → keys → relationships, isi order me'],
      ['1NF atomic; 2NF whole-key; 3NF no transitive chains', '1NF atomic; 2NF pure-key; 3NF transitive chain nahi'],
      ['M:N always resolves through a junction table', 'M:N hamesha junction table se solve hota hai'],
      ['Surrogate keys, enforced FKs, zero derived facts', 'Surrogate keys, enforced FKs, zero derived facts'],
    ],
    quiz: [
      mcq(
        ['A students⨝courses relationship is many-to-many. What does it need?', 'Students⨝courses ka relationship many-to-many hai. Use kya chahiye?'],
        [
          ['A courses.student_id column', 'courses.student_id column'],
          ['A students.course_id column', 'students.course_id column'],
          ['A junction table with both foreign keys', 'Dono foreign keys wali junction table'],
          ['Nothing — SQLite handles it automatically', 'Kuch nahi — SQLite khud sambhal leta hai'],
        ],
        2,
        ['Many-to-many needs a third table (like enrollments or order_items) carrying both keys.', 'Many-to-many ko teesri table chahiye (jaise enrollments ya order_items) jo dono keys rakhe.']
      ),
      outputQ(
        "SELECT COUNT(*) FROM sqlite_master WHERE type = 'table' AND name IN ('customers', 'products', 'orders', 'order_items', 'payments');",
        ['How many of the schema\'s five core tables exist?', 'Schema ki paanch core tables me se kitni exist karti hain?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[5]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[4]] } },
          { label: 'C', result: { columns: ['COUNT(*)'], rows: [[0]] } },
          { label: 'D', result: { error: 'Error: no such table: sqlite_master' } },
        ],
        0,
        ['All five entities exist — the model walked the ladder correctly.', 'Paanchon entities exist karti hain — model ne seedhi sahi chadhi.']
      ),
      buildQ(
        ['Build: a child table referencing customers', 'Banao: customers ko reference karti child table'],
        ['CREATE', 'TABLE', 'notes', '(', 'id', 'INTEGER', 'PRIMARY', 'KEY', 'customer_id', 'INTEGER', 'REFERENCES', 'customers', '(', 'id', ')', ')'],
        ['CREATE', 'TABLE', 'notes', '(', 'id', 'INTEGER', 'PRIMARY', 'KEY', ',', 'customer_id', 'INTEGER', 'REFERENCES', 'customers', '(', 'id', ')', ')'],
        ['PK + FK: the two pillars of every child table.', 'PK + FK: har child table ke do stambh.']
      ),
      blanksQ(
        'CREATE TABLE enrollments (student_id INTEGER ___ students(id), course_id INTEGER ___ courses(id));',
        [
          { options: ['REFERENCES', 'FOREIGN', 'JOINS'], correct: 'REFERENCES' },
          { options: ['REFERENCES', 'KEY', 'POINTS'], correct: 'REFERENCES' },
        ],
        ['Each FK column REFERENCES its parent table.', 'Har FK column apni parent table ko REFERENCES karta hai.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The census: count the e-commerce schema\'s five core tables (customers, products, orders, order_items, payments) via sqlite_master. Columns: n.',
          'Census: sqlite_master se e-commerce schema ki paanch core tables gino (customers, products, orders, order_items, payments). Columns: n.',
        ],
        sol: "SELECT COUNT(*) AS n FROM sqlite_master WHERE type = 'table' AND name IN ('customers','products','orders','order_items','payments');",
        hints: [
          ['sqlite_master knows every object.', 'sqlite_master har object ko jaanta hai.'],
          ["SELECT COUNT(*) AS n FROM sqlite_master WHERE type='table' AND name IN ('customers','products','orders','order_items','payments');", "SELECT COUNT(*) AS n FROM sqlite_master WHERE type='table' AND name IN ('customers','products','orders','order_items','payments');"],
          ['Five — the entities all modelled.', 'Paanch — saari entities modelled.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'The relationship map: list the foreign keys of the order_items table (PRAGMA foreign_key_list) — verifying the junction design. Submit the PRAGMA statement.',
          'Relationship map: order_items table ke foreign keys list karo (PRAGMA foreign_key_list) — junction design verify karte hue. PRAGMA statement submit karo.',
        ],
        sol: 'PRAGMA foreign_key_list(order_items);',
        hints: [
          ['PRAGMA foreign_key_list(table) reveals the design.', 'PRAGMA foreign_key_list(table) design khol deta hai.'],
          ['PRAGMA foreign_key_list(order_items);', 'PRAGMA foreign_key_list(order_items);'],
          ['Two FKs: orders and products — the M:N junction.', 'Do FKs: orders aur products — M:N junction.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'The modelling move: CREATE TABLE IF NOT EXISTS cities (name TEXT PRIMARY KEY, region TEXT); INSERT five distinct customer cities with regions (e.g. Delhi North, Mumbai West, Bangalore South, Hyderabad South, Chennai South); then SELECT name, region FROM cities. Sandbox-style schema work.',
          'Modelling move: CREATE TABLE IF NOT EXISTS cities (name TEXT PRIMARY KEY, region TEXT); paanch distinct customer cities regions ke saath INSERT karo (jaise Delhi North, Mumbai West, Bangalore South, Hyderabad South, Chennai South); phir SELECT name, region FROM cities. Sandbox-style schema kaam.',
        ],
        sol: "CREATE TABLE IF NOT EXISTS cities (name TEXT PRIMARY KEY, region TEXT);\nINSERT OR IGNORE INTO cities (name, region) VALUES\n  ('Delhi', 'North'), ('Mumbai', 'West'), ('Bangalore', 'South'), ('Hyderabad', 'South'), ('Chennai', 'South');\nSELECT name, region FROM cities;",
        hints: [
          ['Design first (CREATE), then populate (INSERT), then read.', 'Pehle design (CREATE), phir populate (INSERT), phir read.'],
          ['These five cities all exist in the customers table — the JOIN will find every one.', 'Ye paanch cities customers table me maujood hain — JOIN har ek ko dhoondh lega.'],
          ['The derived region is computed via the relationship, never stored in customers.', 'Derived region relationship se compute hota hai, customers me store nahi.'],
        ],
        verifyQuery: 'SELECT name, region FROM cities',
      }),
      task({
        d: 'hard',
        desc: [
          'The 3NF demonstration: using your cities table, list customers (name, city and region — JOIN customers to cities) — the derived fact computed via relationship, never stored in the customer rows. Columns: name, city, region. LIMIT 10, sorted by name.',
          '3NF demonstration: apni cities table se customers dikhao (name, city aur region — customers ko cities se JOIN) — derived fact relationship se computed, customer rows me kabhi store nahi. Columns: name, city, region. LIMIT 10, naam se sorted.',
        ],
        sol: 'SELECT s.name, s.city, c.region\nFROM customers s JOIN cities c ON c.name = s.city\nORDER BY s.name LIMIT 10;',
        hints: [
          ['The join replaces the stored column — that is 3NF in action.', 'Join stored column ki jagah leta hai — yahi 3NF live hai.'],
          ['Use alias s for customers (the seeded table) and c for your cities table.', 'customers ke liye alias s aur apni cities table ke liye c use karo.'],
          ['All five cities exist among customers — every join row finds its region.', 'Paanchon cities customers me hain — har join row apna region dhoondh leti hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'The designer\'s certificate: CREATE a new table order_notes (id INTEGER PRIMARY KEY, order_id INTEGER REFERENCES orders(id), note TEXT); INSERT one note (order 1, \'first order — handled by support\'); then SELECT order_id, note FROM order_notes. A modelled extension, end to end.',
          'Designer ka certificate: nayi table order_notes banaо (id INTEGER PRIMARY KEY, order_id INTEGER REFERENCES orders(id), note TEXT); ek note INSERT karo (order 1, \'first order — handled by support\'); phir SELECT order_id, note FROM order_notes. Ek modelled extension, shuru se ant tak.',
        ],
        sol: "CREATE TABLE IF NOT EXISTS order_notes (id INTEGER PRIMARY KEY, order_id INTEGER REFERENCES orders(id), note TEXT);\nINSERT INTO order_notes (order_id, note) VALUES (1, 'first order - handled by support');\nSELECT order_id, note FROM order_notes;",
        hints: [
          ['CREATE (with FK), INSERT, SELECT — the modeller\'s loop.', 'CREATE (with FK), INSERT, SELECT — the modeller\'s loop.'],
          ['CREATE (FK ke saath), INSERT, SELECT — modeller ka loop.', 'CREATE (FK ke saath), INSERT, SELECT — modeller ka loop.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: 'SELECT order_id, note FROM order_notes',
      }),
    ],
  }),

  defineModule({
    n: 59,
    title: ['🎯 Mini Project 4: Performance Optimization', '🎯 Mini Project 4: Performance Optimization'],
    time: '45 min',
    concepts: ['project', 'optimization', 'index', 'explain query plan', 'sargable', 'benchmark', 'covering index'],
    diagram: 'index-tree',
    objectives: [
      ['Diagnose and fix four slow query shapes', 'Chaar slow query shapes ka diagnosis aur fix'],
      ['Prove every fix with before/after plans', 'Har fix ko before/after plans se saabit karna'],
      ['Build the optimisation loop as a habit', 'Optimisation loop ko aadat banana'],
    ],
    theory: [
      section(
        ['The performance desk', 'Performance desk'],
        [
          [
            'Four "complaints" arrive from the (imaginary) production floor: a monthly report that scans, a status lookup that scans, a leaderboard that sorts in a temp tree, and a join that reads too much. Your job is the full professional loop on each: EXPLAIN the bad shape, apply the right lever (sargable rewrite, targeted index, covering index, early reduction), EXPLAIN the improvement, and submit the before/after pair.',
            '(Kalpanik) production floor se chaar "shikayatein" aati hain: ek monthly report jo scan karti hai, ek status lookup jo scan karti hai, ek leaderboard jo temp tree me sort hota hai, aur ek join jo bahut padhti hai. Aapka kaam har ek par poora professional loop hai: bade shape ka EXPLAIN, sahi lever lagao (sargable rewrite, targeted index, covering index, early reduction), sudhaar ka EXPLAIN, aur before/after jodi submit karo.',
          ],
          [
            'Discipline of the desk: never fix without a plan, never claim without a re-plan. The scripts you submit are literally deployable: the CREATE INDEX lines belong in migration files; the rewrites belong in the report code. Treat this project as your first performance review — because it is.',
            'Desk ki discipline: bina plan fix kabhi nahi, bina re-plan dawa kabhi nahi. Aapke submit kiye scripts seedha deployable hain: CREATE INDEX lines migration files me jaate hain; rewrites report code me. Ise apna pehla performance review maano — kyunki yahi hai.',
          ],
        ],
        [
          ['EXPLAIN → lever → EXPLAIN → submit', 'EXPLAIN → lever → EXPLAIN → submit'],
          ['Indexes go to migrations; rewrites go to code', 'Indexes migrations me; rewrites code me'],
          ['4 tasks · any 3 + quiz to reach the Capstone', '4 tasks · koi bhi 3 + quiz Capstone tak'],
        ],
        'index-tree'
      ),
    ],
    tutorial: {
      title: ['The loop on one complaint', 'Ek shikayat par loop'],
      steps: [
        step(null, [
          'Complaint: "the June orders report is slow." The loop, end to end.',
          'Shikayat: "June orders report slow hai." Poora loop, shuru se ant tak.',
        ]),
        step("EXPLAIN QUERY PLAN SELECT COUNT(*) FROM orders WHERE substr(order_date, 1, 7) = '2023-06';", [
          'Diagnosis: the function over order_date forces a SCAN — the bad shape named.',
          'Diagnosis: order_date par function SCAN par majboor karti hai — bura shape naam mila.',
        ], { table: 'orders' }),
        step("EXPLAIN QUERY PLAN SELECT COUNT(*) FROM orders\nWHERE order_date >= '2023-06-01' AND order_date < '2023-07-01';", [
          'Fix 1 (rewrite): sargable range — the index walks, SCAN becomes SEARCH.',
          'Fix 1 (rewrite): sargable range — index chalti hai, SCAN SEARCH bana.',
        ], { table: 'orders' }),
        step("CREATE INDEX idx_orders_status_date ON orders(status, order_date);\nEXPLAIN QUERY PLAN SELECT COUNT(*) FROM orders WHERE status = 'delivered' AND order_date >= '2023-06-01';", [
          'Fix 2 (index): a composite serving status+date lookups — the query now seeks directly.',
          'Fix 2 (index): status+date lookups serve karne wala composite — query ab seedha seek karti hai.',
        ], { table: 'orders' }),
        step("SELECT COUNT(*) AS june_orders FROM orders\nWHERE order_date >= '2023-06-01' AND order_date < '2023-07-01';", [
          'The deliverable: the same answer, now from a healthy plan.',
          'Deliverable: wahi jawab, ab sehatmand plan se.',
        ], { run: true, table: 'orders' }),
      ],
    },
    syntax: {
      template: 'EXPLAIN QUERY PLAN <bad shape>;\n<rewrite or CREATE INDEX …>;\nEXPLAIN QUERY PLAN <fixed shape>;',
      parts: [
        { part: 'before', description: ['Name the cost', 'Daam ka naam lo'] },
        { part: 'lever', description: ['Sargable rewrite · targeted index · covering index', 'Sargable rewrite · targeted index · covering index'] },
        { part: 'after', description: ['Prove the change', 'Badlav saabit karo'] },
      ],
    },
    examples: [
      example('easy', "EXPLAIN QUERY PLAN SELECT * FROM orders WHERE status = 'pending';", [
        'Diagnosis first: does the status lookup scan or search?',
        'Pehla diagnosis: status lookup scan karti hai ya search?',
      ]),
      example('medium', "CREATE INDEX idx_pay_method_amount ON payments(payment_method, amount);\nEXPLAIN QUERY PLAN SELECT payment_method, SUM(amount) FROM payments GROUP BY payment_method;", [
        'A composite covering the group — from temp tree to index order.',
        'Group cover karne wala composite — temp tree se index order tak.',
      ]),
      example('hard', "EXPLAIN QUERY PLAN SELECT pr.name FROM products pr JOIN order_items oi ON oi.product_id = pr.id WHERE oi.order_id = 42;", [
        'Join diagnosis: which side scans, which side seeks?',
        'Join diagnosis: kaunsi taraf scan, kaunsi seek?',
      ]),
    ],
    mistakes: [
      mistake(
        ['Submitting fixes without the before-plan', 'Before-plan ke bina fixes submit karna'],
        ['Without the "before", nobody — including you — can verify the improvement existed. The pair is the proof.', '"Before" ke bina koi — aap khud shaamil — nahi verify kar sakta ki sudhaar tha hi. Jodi hi saboot hai.']
      ),
      mistake(
        ['Indexing blindly ("more indexes = faster")', 'Andhepan se index karna ("zyada index = fast")'],
        ['Every index costs writes. Index exactly what the plans show you needing — this project tells you which.', 'Har index writes ka daam leta hai. Plans jo dikhaate hain wahi index karo — ye project batata hai kaunsa.']
      ),
      mistake(
        ['Rewriting queries that were already healthy', 'Pehle se sehatmand queries rewrite karna'],
        ['Read the plan before touching anything. A SEARCH plan needs no rewrite — leave it, move to the real bottleneck.', 'Kuch chhue se pehle plan padho. SEARCH plan ko rewrite nahi chahiye — chhodо, asli bottleneck par jao.']
      ),
    ],
    summary: [
      ['Four complaints, four full loops, real levers', 'Chaar shikayatein, chaar poore loop, asli levers'],
      ['The before/after plan pair is the deliverable', 'Before/after plan jodi hi deliverable hai'],
      ['Deploys as migrations (indexes) and code (rewrites)', 'Migrations (indexes) aur code (rewrites) ki tarah deploy hota hai'],
      ['One module left: the Capstone', 'Ek module bacha: Capstone'],
    ],
    quiz: [
      mcq(
        ['What is the FIRST step of any optimisation?', 'Kisi bhi optimisation ka PEHLA step kya hai?'],
        [
          ['Add an index on every column', 'Har column par index lagana'],
          ['EXPLAIN QUERY PLAN to see the current strategy', 'EXPLAIN QUERY PLAN se current strategy dekhna'],
          ['Rewrite the query from scratch', 'Query shuru se rewrite karna'],
          ['Increase database memory', 'Database memory badhana'],
        ],
        1,
        ['Diagnosis precedes treatment — always. The plan names the cost you are paying.', 'Il se pehle diagnosis — hamesha. Plan us daam ka naam batata hai jo aap de rahe ho.']
      ),
      outputQ(
        "EXPLAIN QUERY PLAN SELECT * FROM orders WHERE status = 'delivered';",
        ['With a plain orders table (no status index), what appears?', '(Status index ke bina) plain orders table par kya dikhta hai?'],
        [
          { label: 'A', result: { columns: ['id', 'parent', 'notused', 'detail'], rows: [[2, 0, 0, 'SCAN orders']] } },
          { label: 'B', result: { columns: ['id', 'parent', 'notused', 'detail'], rows: [[3, 0, 0, "SEARCH orders USING INDEX idx_orders_status (status=?)"]] } },
          { label: 'C', result: { error: 'Error: no such column: status' } },
          { label: 'D', result: { columns: ['detail'], rows: [['SORT orders']] } },
        ],
        0,
        ['No status index → every row read → SCAN. The fix is one CREATE INDEX away.', 'Status index nahi → har row padhi → SCAN. Fix ek CREATE INDEX door hai.']
      ),
      buildQ(
        ['Build: the status index (the fix)', 'Banao: status index (fix)'],
        ['CREATE', 'INDEX', 'idx_orders_status', 'ON', 'orders', '(', 'status', ')'],
        ['CREATE', 'INDEX', 'idx_orders_status', 'ON', 'orders', '(', 'status', ')'],
        ['Index the filtered column — the targeted fix.', 'Filtered column par index — targeted fix.']
      ),
      blanksQ(
        'EXPLAIN ___ PLAN is the magnifier; ___ QUERY is the complaint being read.',
        [
          { options: ['QUERY', 'INDEX', 'TABLE'], correct: 'QUERY' },
          { options: ['SELECT', 'EXPLAIN', 'DESCRIBE'], correct: 'SELECT' },
        ],
        ['EXPLAIN QUERY PLAN over the SELECT in question.', 'Sawal wali SELECT par EXPLAIN QUERY PLAN.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Complaint 1 — the June scan: EXPLAIN the bad shape (substr on order_date), then EXPLAIN the sargable rewrite. Submit both EXPLAIN statements.',
          'Shikayat 1 — June scan: bura shape (order_date par substr) EXPLAIN karo, phir sargable rewrite EXPLAIN karo. Dono EXPLAIN statements submit karo.',
        ],
        sol: "EXPLAIN QUERY PLAN SELECT * FROM orders WHERE substr(order_date, 1, 7) = '2023-06';\nEXPLAIN QUERY PLAN SELECT * FROM orders WHERE order_date >= '2023-06-01' AND order_date < '2023-07-01';",
        hints: [
          ['Bad plan first, good plan second — the diagnostic pair.', 'Bad plan first, good plan second — the diagnostic pair.'],
          ['Pehla bura plan, doosra achha plan — diagnostic jodi.', 'Pehla bura plan, doosra achha plan — diagnostic jodi.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'Complaint 2 — the status lookup: CREATE INDEX idx_orders_status ON orders(status); then EXPLAIN SELECT * FROM orders WHERE status = \'pending\'. Submit both.',
          'Shikayat 2 — status lookup: CREATE INDEX idx_orders_status ON orders(status); phir EXPLAIN SELECT * FROM orders WHERE status = \'pending\'. Dono submit karo.',
        ],
        sol: "DROP INDEX IF EXISTS idx_orders_status;\nCREATE INDEX idx_orders_status ON orders(status);\nEXPLAIN QUERY PLAN SELECT * FROM orders WHERE status = 'pending';",
        hints: [
          ['One index, one re-plan.', 'One index, one re-plan.'],
          ['Ek index, ek re-plan.', 'Ek index, ek re-plan.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: "SELECT name FROM sqlite_master WHERE type='index' AND name='idx_orders_status'",
      }),
      task({
        d: 'medium',
        desc: [
          'Complaint 3 — the grouping cost: EXPLAIN SELECT payment_method, COUNT(*) FROM payments GROUP BY payment_method (temp tree visible); CREATE INDEX idx_pay_method ON payments(payment_method); EXPLAIN again. Submit all three.',
          'Shikayat 3 — grouping ka daam: EXPLAIN SELECT payment_method, COUNT(*) FROM payments GROUP BY payment_method (temp tree dikhega); CREATE INDEX idx_pay_method ON payments(payment_method); dobara EXPLAIN. Teeno submit karo.',
        ],
        sol: "EXPLAIN QUERY PLAN SELECT payment_method, COUNT(*) FROM payments GROUP BY payment_method;\nCREATE INDEX idx_pay_method ON payments(payment_method);\nEXPLAIN QUERY PLAN SELECT payment_method, COUNT(*) FROM payments GROUP BY payment_method;",
        hints: [
          ['Grouping over index order can drop the temp tree.', 'Grouping over index order can drop the temp tree.'],
          ['Index order par grouping temp tree gira sakti hai.', 'Index order par grouping temp tree gira sakti hai.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: "SELECT name FROM sqlite_master WHERE type='index' AND name='idx_pay_method'",
      }),
      task({
        d: 'hard',
        desc: [
          'Complaint 4 — the join breadth: EXPLAIN the wide join (SELECT pr.name FROM products pr JOIN order_items oi ON oi.product_id = pr.id WHERE oi.order_id = 42); CREATE INDEX idx_oi_order ON order_items(order_id); EXPLAIN again. Submit all three.',
          'Shikayat 4 — join ki chaudai: wide join EXPLAIN karo (SELECT pr.name FROM products pr JOIN order_items oi ON oi.product_id = pr.id WHERE oi.order_id = 42); CREATE INDEX idx_oi_order ON order_items(order_id); dobara EXPLAIN. Teeno submit karo.',
        ],
        sol: "EXPLAIN QUERY PLAN SELECT pr.name FROM products pr JOIN order_items oi ON oi.product_id = pr.id WHERE oi.order_id = 42;\nCREATE INDEX idx_oi_order ON order_items(order_id);\nEXPLAIN QUERY PLAN SELECT pr.name FROM products pr JOIN order_items oi ON oi.product_id = pr.id WHERE oi.order_id = 42;",
        hints: [
          ['Index the join/filter column on the big table — the classic fix.', 'Index the join/filter column on the big table — the classic fix.'],
          ['Badi table par join/filter column index karo — classic fix.', 'Badi table par join/filter column index karo — classic fix.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: "SELECT name FROM sqlite_master WHERE type='index' AND name='idx_oi_order'",
      }),
    ],
  }),

  defineModule({
    n: 60,
    title: ['👑 Capstone: Business Intelligence System', '👑 Capstone: Business Intelligence System'],
    time: '120 min',
    concepts: ['capstone', 'bi', 'analytics', 'windows', 'cte', 'view', 'index', 'trigger', 'dashboard', 'clv', 'churn'],
    diagram: 'group-buckets',
    objectives: [
      ['Assemble a complete BI layer: segmentation, growth, rankings, CLV, churn', 'Poora BI layer banana: segmentation, growth, rankings, CLV, churn'],
      ['Ship reusable assets: a view, indexes, a trigger', 'Reusable assets banana: ek view, indexes, ek trigger'],
      ['Demonstrate mastery of all 59 prior modules', 'Pichle 59 modules ki mastery dikhana'],
    ],
    theory: [
      section(
        ['The graduation build', 'Graduation ka build'],
        [
          [
            'The Capstone is the whole course in one system: eight analyst-grade deliverables over the full advanced database, each requiring a different pillar — window ranking, recursive thinking, CTE pipelines, conditional pivots, LEFT-JOIN anti-analysis, view packaging, index strategy, and trigger automation. This is exactly the shape of real BI work: a stack of composable, documented, performant queries that a business can run forever.',
            'Capstone poora course ek system me hai: poore advanced database par aath analyst-grade deliverables, har ek alag stambh maangta hai — window ranking, recursive soch, CTE pipelines, conditional pivots, LEFT-JOIN anti-analysis, view packaging, index strategy, aur trigger automation. Yahi asli BI kaam ka shape hai: composable, documented, performant queries ka stack jo business hamesha chala sake.',
          ],
          [
            'Work the way you now know how: state the metric, name the grain, build the pipeline, validate by result, then productionise (view/index/trigger). Eight tasks, any three plus the quiz complete the course — but attempt them all: the Capstone is where everything clicks together, and the muscle memory is the real certificate.',
            'Ab aapko jo tareeka aata hai wahi kaam karo: metric bolo, grain ka naam lo, pipeline banao, result se validate karo, phir productionise karo (view/index/trigger). Aath tasks, koi bhi teen aur quiz course complete karta hai — par sab try karo: Capstone me sab kuch click hota hai, aur muscle memory hi asli certificate hai.',
          ],
        ],
        [
          ['8 deliverables · any 3 + quiz to graduate', '8 deliverables · koi bhi 3 + quiz graduate hone ke liye'],
          ['Metric → grain → pipeline → validate → productionise', 'Metric → grain → pipeline → validate → productionise'],
          ['Everything from M1-M59, composed', 'M1-M59 ka sab kuch, jodа hua'],
        ],
        'cte-chain'
      ),
      section(
        ['The deliverables', 'Deliverables'],
        [
          [
            'D1 Customer spend ranking with tier labels. D2 Month-over-month revenue growth with a CASE health flag. D3 Product league table by revenue with RANK. D4 The reusable analytics VIEW (v_monthly_revenue). D5 Churn watchlist via LEFT JOIN anti-analysis. D6 Top customers per segment (windows + partition). D7 The performance pack (composite index + verified plan). D8 The automation trigger (audit log on payment updates). Together: one BI system.',
            'D1 Customer spend ranking tier labels ke saath. D2 Month-over-month revenue growth CASE health flag ke saath. D3 Product league table revenue se RANK ke saath. D4 Reusable analytics VIEW (v_monthly_revenue). D5 Churn watchlist LEFT JOIN anti-analysis se. D6 Har segment ke top customers (windows + partition). D7 Performance pack (composite index + verified plan). D8 Automation trigger (payment updates par audit log). Sab milkar: ek BI system.',
          ],
        ]
      ),
    ],
    tutorial: {
      title: ['The template of mastery', 'Mastery ka template'],
      steps: [
        step(null, [
          'One full pass of the production loop — the pattern every capstone task follows.',
          'Production loop ka ek poora chakkar — har capstone task ka pattern.',
        ]),
        step('WITH spend AS (\n  SELECT c.id, c.name, SUM(p.amount) AS total\n  FROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id\n  GROUP BY c.id, c.name\n)', [
          'Step 1 — the pipeline: per-customer spend, named.',
          'Step 1 — pipeline: per-customer kharch, naamda.',
        ], { table: 'customers' }),
        step("WITH spend AS (…)\nSELECT name, ROUND(total, 2) AS total,\n  CASE WHEN total >= 1000000 THEN 'platinum'\n       WHEN total >= 500000 THEN 'gold'\n       ELSE 'silver' END AS tier\nFROM spend ORDER BY total DESC LIMIT 5;", [
          'Step 2 — the business layer: tiers via CASE, sorted.',
          'Step 2 — business layer: CASE se tiers, sorted.',
        ], { table: 'customers' }),
        step("CREATE VIEW IF NOT EXISTS v_top_customers AS\nWITH spend AS (SELECT c.id, c.name, SUM(p.amount) AS total FROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id GROUP BY c.id, c.name)\nSELECT name, ROUND(total, 2) AS total, CASE WHEN total >= 1000000 THEN 'platinum' WHEN total >= 500000 THEN 'gold' ELSE 'silver' END AS tier FROM spend;\nSELECT name, total, tier FROM v_top_customers LIMIT 3;", [
          'Step 3 — productionise: the pipeline becomes a view, consumed in one line.',
          'Step 3 — productionise: pipeline view ban jaata hai, ek line me consumed.',
        ], { table: 'customers' }),
        step("EXPLAIN QUERY PLAN SELECT * FROM v_top_customers LIMIT 1;", [
          'Step 4 — verify the engine sees what you expect. The loop closes.',
          'Step 4 — verify karo ki engine wahi dekh raha hai jo aap chahte ho. Loop band.',
        ], { run: true, table: 'customers' }),
      ],
    },
    syntax: {
      template: 'WITH pipeline AS (…)\nSELECT business_logic FROM pipeline\n  [CREATE VIEW … / CREATE INDEX … / CREATE TRIGGER …]\n[EXPLAIN QUERY PLAN …];',
      parts: [
        { part: 'pipeline', description: ['Named, composable steps', 'Naamde, composable steps'] },
        { part: 'business logic', description: ['Windows, CASE, pivots', 'Windows, CASE, pivots'] },
        { part: 'productionise', description: ['Views, indexes, triggers — the BI assets', 'Views, indexes, triggers — BI assets'] },
      ],
    },
    examples: [
      example('medium', "WITH monthly AS (\n  SELECT substr(o.order_date,1,7) AS month, ROUND(SUM(p.amount),2) AS revenue\n  FROM orders o JOIN payments p ON p.order_id = o.id GROUP BY substr(o.order_date,1,7)\n)\nSELECT month, revenue FROM monthly ORDER BY month DESC LIMIT 3;", [
        'The monthly core of D2, standalone.',
        'D2 ka monthly core, akela.',
      ]),
      example('hard', "SELECT o.status, COUNT(*) AS n,\n  RANK() OVER (ORDER BY COUNT(*) DESC) AS rnk\nFROM orders o GROUP BY o.status ORDER BY rnk;", [
        'D3\'s ranking shape applied to statuses.',
        'D3 ka ranking shape statuses par.',
      ]),
      example('very_hard', "SELECT segment_name, name, spend FROM (\n  SELECT cs.segment_name, c.name, SUM(p.amount) AS spend,\n    ROW_NUMBER() OVER (PARTITION BY cs.segment_name ORDER BY SUM(p.amount) DESC, c.id) AS rn\n  FROM customer_segments cs JOIN customers c ON c.id = cs.customer_id\n  JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id\n  GROUP BY cs.segment_name, c.id, c.name\n) WHERE rn = 1;", [
        'D6\'s partitioned top-per-group over segments.',
        'D6 ka partitioned top-per-group segments par.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Building giant one-shot queries', 'Giant one-shot queries banana'],
        ['Compose: small CTE steps, each validated, then assembled. A 40-line single blob is where mistakes hide.', 'Compose karo: chhote CTE steps, har ek validated, phir jodo. 40-line ka single blob wahi hai jagah jahan galtiyan chhupti hain.']
      ),
      mistake(
        ['Skipping validation of the view/index/trigger steps', 'View/index/trigger steps ki validation skip karna'],
        ['Every productionised asset gets a consume-test: SELECT from the view, EXPLAIN over the index, fire the trigger. Assets that are never tested are not shipped — they are hoped.', 'Har productionised asset ka consume-test hota hai: view se SELECT, index par EXPLAIN, trigger chalao. Jo kabhi test nahi hue wo shipped nahi — umeed ke bharose rakhe gaye hain.']
      ),
      mistake(
        ['Rounding inside pipelines', 'Pipeline ke andar rounding'],
        ['Round at the FINAL presentation layer only. Intermediate rounding drags pennies through every join and window.', 'Rounding sirf FINAL presentation layer par. Beech ka rounding har join aur window me cents ghis-ta hai.']
      ),
    ],
    summary: [
      ['Eight deliverables compose into one BI system', 'Aath deliverables milkar ek BI system banate hain'],
      ['Pipeline → business logic → productionise → verify', 'Pipeline → business logic → productionise → verify'],
      ['Views, indexes, triggers are the shipped assets', 'Views, indexes, trigger hi shipped assets hain'],
      ['Course complete — SQL expert unlocked', 'Course complete — SQL expert unlocked'],
    ],
    quiz: [
      mcq(
        ['Which asset makes a BI query reusable across teams?', 'Kaunsa asset BI query ko teams ke beech reusable banata hai?'],
        [
          ['A transaction', 'Ek transaction'],
          ['A view', 'Ek view'],
          ['A recursive CTE', 'Ek recursive CTE'],
          ['A ROLLBACK', 'Ek ROLLBACK'],
        ],
        1,
        ['Views persist named queries as consumable "tables" — the sharing layer of BI.', 'Views naamde queries ko consumable "tables" ki tarah bachate hain — BI ka sharing layer.']
      ),
      outputQ(
        'SELECT COUNT(*) FROM (SELECT DISTINCT customer_id FROM orders o JOIN payments p ON p.order_id = o.id WHERE o.status = \'delivered\');',
        ['Customers who have received a delivered order:', 'Delivered order paane wale customers:'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[65]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[98]] } },
          { label: 'C', result: { columns: ['COUNT(*)'], rows: [[500]] } },
          { label: 'D', result: { error: 'Error: misuse of aggregate' } },
        ],
        0,
        ['100 delivered orders come from 65 distinct customers — the satisfied base.', '100 delivered orders 65 alag customers se — satisfied base.']
      ),
      buildQ(
        ['Build: the monthly revenue CTE (the D2 core)', 'Banao: monthly revenue CTE (D2 ka core)'],
        ['WITH', 'monthly', 'AS', '(', 'SELECT', 'substr(o.order_date, 1, 7)', 'AS', 'month', 'SUM(p.amount)', 'AS', 'revenue', 'FROM', 'orders', 'o', 'JOIN', 'payments', 'p', 'ON', 'p.order_id = o.id', 'GROUP BY', 'substr(o.order_date, 1, 7)', ')'],
        ['WITH', 'monthly', 'AS', '(', 'SELECT', 'substr', '(', 'o', '.', 'order_date', ',', '1', ',', '7', ')', 'AS', 'month', ',', 'SUM', '(', 'p', '.', 'amount', ')', 'AS', 'revenue', 'FROM', 'orders', 'o', 'JOIN', 'payments', 'p', 'ON', 'p', '.', 'order_id', '=', 'o', '.', 'id', 'GROUP', 'BY', 'substr', '(', 'o', '.', 'order_date', ',', '1', ',', '7', ')', ')'],
        ['The pipeline every growth query builds on.', 'Wo pipeline jis par har growth query banti hai.']
      ),
      blanksQ(
        'WITH monthly AS (…) SELECT month, ___(revenue) OVER (ORDER ___ month) AS prev FROM monthly;',
        [
          { options: ['LAG', 'SUM', 'RANK'], correct: 'LAG' },
          { options: ['BY', 'ON', 'AS'], correct: 'BY' },
        ],
        ['The growth window: LAG over ordered months.', 'Growth window: ordered months par LAG.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_hard',
        desc: [
          'D1 — The value board: per-customer total spend with tier labels — platinum (≥ 1,000,000), gold (≥ 500,000), else silver. Columns: name, total (rounded), tier. Sorted by total descending. LIMIT 10.',
          'D1 — Value board: per-customer total spend tier labels ke saath — platinum (≥ 1,000,000), gold (≥ 5,00,000), warna silver. Columns: name, total (rounded), tier. Total se utarte sorted. LIMIT 10.',
        ],
        sol: "WITH spend AS (\n  SELECT c.name, SUM(p.amount) AS total\n  FROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id\n  GROUP BY c.id, c.name\n)\nSELECT name, ROUND(total, 2) AS total,\n  CASE WHEN total >= 1000000 THEN 'platinum' WHEN total >= 500000 THEN 'gold' ELSE 'silver' END AS tier\nFROM spend ORDER BY total DESC LIMIT 10;",
        hints: [
          ['Pipeline (spend) then business layer (CASE tiers).', 'Pipeline (spend) then business layer (CASE tiers).'],
          ['Pehle pipeline (spend) phir business layer (CASE tiers).', 'Pehle pipeline (spend) phir business layer (CASE tiers).'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'D2 — The growth monitor: month, revenue (rounded), growth_pct (1 decimal, NULL for the first month), and a health flag — CASE: \'surge\' if growth ≥ 20, \'dip\' if ≤ −20, else \'steady\' (also \'start\' for the first month). Columns: month, revenue, growth_pct, health. Sorted by month. LIMIT 12.',
          'D2 — Growth monitor: month, revenue (rounded), growth_pct (1 decimal, pehle mahine ka NULL), aur health flag — CASE: \'surge\' agar growth ≥ 20, \'dip\' agar ≤ −20, warna \'steady\' (pehle mahine ka \'start\'). Columns: month, revenue, growth_pct, health. Month se sorted. LIMIT 12.',
        ],
        sol: "WITH monthly AS (\n  SELECT substr(o.order_date, 1, 7) AS month, SUM(p.amount) AS revenue\n  FROM orders o JOIN payments p ON p.order_id = o.id\n  GROUP BY substr(o.order_date, 1, 7)\n), growth AS (\n  SELECT month, revenue, LAG(revenue) OVER (ORDER BY month) AS prev FROM monthly\n)\nSELECT month, ROUND(revenue, 2) AS revenue,\n  ROUND(100.0 * (revenue - prev) / prev, 1) AS growth_pct,\n  CASE WHEN prev IS NULL THEN 'start'\n       WHEN 100.0 * (revenue - prev) / prev >= 20 THEN 'surge'\n       WHEN 100.0 * (revenue - prev) / prev <= -20 THEN 'dip'\n       ELSE 'steady' END AS health\nFROM growth ORDER BY month LIMIT 12;",
        hints: [
          ['Three levels: sums → lag → flags; NULL-safe first month.', 'Three levels: sums → lag → flags; NULL-safe first month.'],
          ['Teen level: sums → lag → flags; pehla mahina NULL-safe.', 'Teen level: sums → lag → flags; pehla mahina NULL-safe.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'D3 — The product league: products ranked by total revenue (SUM of order_items.subtotal) with DENSE_RANK. Columns: name, revenue (rounded), drnk. Sorted by drnk, name. Top 10 only.',
          'D3 — Product league: products total revenue (order_items.subtotal ka SUM) se DENSE_RANK ke saath ranked. Columns: name, revenue (rounded), drnk. drnk, name se sorted. Sirf top 10.',
        ],
        sol: "WITH product_rev AS (\n  SELECT pr.name, SUM(oi.subtotal) AS revenue\n  FROM order_items oi JOIN products pr ON pr.id = oi.product_id\n  GROUP BY pr.id, pr.name\n)\nSELECT name, ROUND(revenue, 2) AS revenue,\n  DENSE_RANK() OVER (ORDER BY revenue DESC) AS drnk\nFROM product_rev ORDER BY drnk, name LIMIT 10;",
        hints: [
          ['Aggregate first; dense rank the aggregate.', 'Aggregate first; dense rank the aggregate.'],
          ['Pehle aggregate; aggregate ko dense rank karo.', 'Pehle aggregate; aggregate ko dense rank karo.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'medium',
        desc: [
          'D4 — The shipped view: CREATE VIEW v_monthly_revenue (month, revenue per month via the chain), then SELECT month, revenue from it — sorted by month, LIMIT 6. The BI asset.',
          'D4 — Shipped view: CREATE VIEW v_monthly_revenue (month, chain se monthly revenue), phir usse month, revenue padho — month se sorted, LIMIT 6. BI asset.',
        ],
        sol: "DROP VIEW IF EXISTS IF;\nCREATE VIEW IF NOT EXISTS v_monthly_revenue AS\nSELECT substr(o.order_date, 1, 7) AS month, SUM(p.amount) AS revenue\nFROM orders o JOIN payments p ON p.order_id = o.id\nGROUP BY substr(o.order_date, 1, 7);\nSELECT month, revenue FROM v_monthly_revenue ORDER BY month LIMIT 6;",
        hints: [
          ['The view body is the familiar pipeline.', 'The view body is the familiar pipeline.'],
          ['View body wahi familiar pipeline hai.', 'View body wahi familiar pipeline hai.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: 'SELECT month, revenue FROM v_monthly_revenue ORDER BY month LIMIT 6',
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'D5 — The churn watchlist: customers whose LAST order is older than 2023-07-01 (max order_date per customer < that date) — name and last_order. Columns: name, last_order. Sorted by last_order, name. LIMIT 10.',
          'D5 — Churn watchlist: jinke customers ka aakhri order 2023-07-01 se purana hai (per-customer max order_date < wo date) — name aur last_order. Columns: name, last_order. last_order, name se sorted. LIMIT 10.',
        ],
        sol: "WITH last_order AS (\n  SELECT c.name, MAX(o.order_date) AS last_order\n  FROM customers c JOIN orders o ON o.customer_id = c.id\n  GROUP BY c.id, c.name\n)\nSELECT name, last_order FROM last_order\nWHERE last_order < '2023-07-01'\nORDER BY last_order, name LIMIT 10;",
        hints: [
          ['MAX(order_date) per customer, then a date threshold — the churn pattern.', 'MAX(order_date) per customer, then a date threshold — the churn pattern.'],
          ['Per customer MAX(order_date), phir date threshold — churn pattern.', 'Per customer MAX(order_date), phir date threshold — churn pattern.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'D6 — Segment champions: the top spender PER segment (ROW_NUMBER partitioned by segment_name over the seg→customer→order→payment chain). Columns: segment_name, name, spend (rounded). Sorted by segment_name.',
          'D6 — Segment champions: HAR segment ka top spender (seg→customer→order→payment chain par segment_name se partitioned ROW_NUMBER). Columns: segment_name, name, spend (rounded). segment_name se sorted.',
        ],
        sol: "SELECT segment_name, name, spend FROM (\n  SELECT cs.segment_name, c.name, ROUND(SUM(p.amount), 2) AS spend,\n    ROW_NUMBER() OVER (PARTITION BY cs.segment_name ORDER BY SUM(p.amount) DESC, c.id) AS rn\n  FROM customer_segments cs JOIN customers c ON c.id = cs.customer_id\n  JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id\n  GROUP BY cs.segment_name, c.id, c.name\n) WHERE rn = 1 ORDER BY segment_name;",
        hints: [
          ['Top-1-per-group over the four-table chain.', 'Top-1-per-group over the four-table chain.'],
          ['Chaar-table chain par Top-1-per-group.', 'Chaar-table chain par Top-1-per-group.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'D7 — The performance pack: CREATE INDEX idx_cap_orders_cust_date ON orders(customer_id, order_date); EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 7 ORDER BY order_date; — submit both; the composite index must appear in the plan.',
          'D7 — Performance pack: CREATE INDEX idx_cap_orders_cust_date ON orders(customer_id, order_date); EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 7 ORDER BY order_date; — dono submit karo; composite index plan me dikhna chahiye.',
        ],
        sol: "DROP INDEX IF EXISTS idx_cap_orders_cust_date;\nCREATE INDEX idx_cap_orders_cust_date ON orders(customer_id, order_date);\nEXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 7 ORDER BY order_date;",
        hints: [
          ['One composite, one verified plan — the deployable pair.', 'One composite, one verified plan — the deployable pair.'],
          ['Ek composite, ek verified plan — deployable jodi.', 'Ek composite, ek verified plan — deployable jodi.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: "SELECT name FROM sqlite_master WHERE type='index' AND name='idx_cap_orders_cust_date'",
      }),
      task({
        d: 'very_hard',
        desc: [
          'D8 — The automation: CREATE TABLE cap_audit (id INTEGER PRIMARY KEY AUTOINCREMENT, payment_id INTEGER, old_amount DECIMAL(10,2), new_amount DECIMAL(10,2), at DATETIME DEFAULT CURRENT_TIMESTAMP); CREATE TRIGGER trg_cap_audit AFTER UPDATE OF amount ON payments inserting both amounts; UPDATE payment 6 by +1; verify the audit row (payment_id, old_amount, new_amount). The living BI system.',
          'D8 — Automation: CREATE TABLE cap_audit (id INTEGER PRIMARY KEY AUTOINCREMENT, payment_id INTEGER, old_amount DECIMAL(10,2), new_amount DECIMAL(10,2), at DATETIME DEFAULT CURRENT_TIMESTAMP); CREATE TRIGGER trg_cap_audit AFTER UPDATE OF amount ON payments jo dono amounts dale; payment 6 ko +1 karo; audit row verify karo (payment_id, old_amount, new_amount). Jeeta-jaagta BI system.',
        ],
        sol: "CREATE TABLE IF NOT EXISTS cap_audit (id INTEGER PRIMARY KEY AUTOINCREMENT, payment_id INTEGER, old_amount DECIMAL(10,2), new_amount DECIMAL(10,2), at DATETIME DEFAULT CURRENT_TIMESTAMP);\nDROP TRIGGER IF EXISTS trg_cap_audit;\nCREATE TRIGGER trg_cap_audit AFTER UPDATE OF amount ON payments\nBEGIN\n  INSERT INTO cap_audit (payment_id, old_amount, new_amount) VALUES (OLD.id, OLD.amount, NEW.amount);\nEND;\nUPDATE payments SET amount = amount + 1 WHERE id = 6;\nSELECT payment_id, old_amount, new_amount FROM cap_audit WHERE payment_id = 6;",
        hints: [
          ['Table, trigger, fire, verify — the graduation ritual.', 'Table, trigger, fire, verify — the graduation ritual.'],
          ['Table, trigger, fire, verify — graduation ritual.', 'Table, trigger, fire, verify — graduation ritual.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: 'SELECT payment_id, old_amount, new_amount FROM cap_audit WHERE payment_id = 6',
      }),
      task({
        d: 'very_hard',
        desc: [
          'D9 — Revenue by region: state-wise revenue with customer count — customers→orders→payments, group by state. Columns: state, revenue (rounded), customers (distinct). Sorted by revenue descending. LIMIT 10.',
          'D9 — Region-wise revenue: state ke hisab se revenue, customer count ke saath — customers→orders→payments, state se group. Columns: state, revenue (rounded), customers (distinct). Revenue se utarte sorted. LIMIT 10.',
        ],
        sol: "SELECT c.state, ROUND(SUM(p.amount), 2) AS revenue, COUNT(DISTINCT c.id) AS customers\nFROM customers c\nJOIN orders o ON o.customer_id = c.id\nJOIN payments p ON p.order_id = o.id\nGROUP BY c.state ORDER BY revenue DESC LIMIT 10;",
        hints: [
          ['Three tables, one group, two aggregates (SUM + COUNT DISTINCT).', 'Teen tables, ek group, do aggregates (SUM + COUNT DISTINCT).'],
          ['COUNT(DISTINCT c.id) inside the grouped join counts unique buyers per state.', 'Grouped join ke andar COUNT(DISTINCT c.id) har state ke unique buyers ginta hai.'],
          ['Maharashtra and Delhi states lead by customer count in this data.', 'Is data me Maharashtra aur Delhi customer count me aage hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'D10 — Customer Lifetime Value: per customer — order count (orders_), lifetime spend (total, rounded) and average order value (aov = total ÷ orders_, rounded). One row per customer with at least one paid order. Columns: name, orders_, total, aov. Sorted by total descending. LIMIT 8.',
          'D10 — Customer Lifetime Value: har customer ke liye — order count (orders_), lifetime kharch (total, rounded) aur average order value (aov = total ÷ orders_, rounded). Kam se kam ek paid order wale har customer ki ek row. Columns: name, orders_, total, aov. Total se utarte sorted. LIMIT 8.',
        ],
        sol: "WITH cust AS (\n  SELECT c.name, COUNT(o.id) AS orders_, SUM(p.amount) AS total\n  FROM customers c\n  JOIN orders o ON o.customer_id = c.id\n  JOIN payments p ON p.order_id = o.id\n  GROUP BY c.id, c.name\n)\nSELECT name, orders_, ROUND(total, 2) AS total, ROUND(total / orders_, 2) AS aov\nFROM cust ORDER BY total DESC LIMIT 8;",
        hints: [
          ['Pipeline first (counts + sums per customer), then the ratio column.', 'Pehle pipeline (per customer counts + sums), phir ratio column.'],
          ['aov = total / orders_ computed in the final SELECT over the CTE.', 'aov = total / orders_ final SELECT me CTE ke upar compute hota hai.'],
          ['Isha Verma tops CLV in this dataset.', 'Is dataset me Isha Verma CLV me sabse upar hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'D11 — Inventory movement: the running net inventory position per entry over inventory_log (running total of change_quantity by id), showing the 12 most recent entries (id descending) with their running totals. Columns: id, change_quantity, running_total. (Compute ascending, display descending.)',
          'D11 — Inventory movement: inventory_log ki har entry par net running position (id se change_quantity ka running total), 12 sabse naye entries (id se utarte) apne running totals ke saath. Columns: id, change_quantity, running_total. (Chadhta compute karo, utarta dikhao.)',
        ],
        sol: "SELECT id, change_quantity, running_total FROM (\n  SELECT id, change_quantity,\n    SUM(change_quantity) OVER (ORDER BY id) AS running_total\n  FROM inventory_log\n) ORDER BY id DESC LIMIT 12;",
        hints: [
          ['The window ORDER BY defines "running"; the outer ORDER BY flips display.', 'Window ka ORDER BY "running" define karta hai; bahar ka ORDER BY display ulta karta hai.'],
          ['SUM(change_quantity) OVER (ORDER BY id) — the cumulative frame.', 'SUM(change_quantity) OVER (ORDER BY id) — cumulative frame.'],
          ['The top row (latest id) shows the final net position.', 'Sabse upar wali row (latest id) final net position dikhati hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'D12 — The executive dashboard: ONE row with five KPIs — total revenue (revenue), total orders (orders), average order value (aov), delivered count (delivered), distinct buyers (buyers). All rounded where money (aov, revenue 2 decimals). Headers checked: revenue, orders, aov, delivered, buyers.',
          'D12 — Executive dashboard: EK row me paanch KPIs — total revenue (revenue), kul orders (orders), average order value (aov), delivered count (delivered), distinct buyers (buyers). Jahan paisa wahan rounded (aov, revenue 2 decimals). Headers check honge: revenue, orders, aov, delivered, buyers.',
        ],
        sol: "SELECT\n  ROUND(SUM(p.amount), 2) AS revenue,\n  COUNT(DISTINCT o.id) AS orders,\n  ROUND(SUM(p.amount) / COUNT(DISTINCT o.id), 2) AS aov,\n  SUM(CASE WHEN o.status = 'delivered' THEN 1 ELSE 0 END) AS delivered,\n  COUNT(DISTINCT o.customer_id) AS buyers\nFROM orders o JOIN payments p ON p.order_id = o.id;",
        hints: [
          ['One join, five aggregates, one row — the CEO slide.', 'Ek join, paanch aggregates, ek row — CEO slide.'],
          ["The delivered KPI uses the conditional-count idiom: SUM(CASE WHEN o.status = 'delivered' THEN 1 ELSE 0 END).", "Delivered KPI conditional-count idiom use karta hai: SUM(CASE WHEN o.status = 'delivered' THEN 1 ELSE 0 END)."],
          ['Expected shape: ≈ 39M revenue, 500 orders, ≈ 78K aov, 98 delivered, 95 buyers.', 'Expected shape: ≈ 39M revenue, 500 orders, ≈ 78K aov, 98 delivered, 95 buyers.'],
        ],
        rules: { checkColumnNames: true },
      }),
    ],
  }),
];
