'use client';

// Modules 36-38: FULL OUTER JOIN · CROSS JOIN & SELF JOIN · UNION & UNION ALL

import { defineModule, section, step, example, mistake, mcq, outputQ, buildQ, blanksQ, task } from './builder';
import type { Module } from '@/types/content';

export const modules: Module[] = [
  defineModule({
    n: 36,
    title: ['FULL OUTER JOIN', 'FULL OUTER JOIN'],
    time: '20 min',
    concepts: ['full outer join', 'outer join', 'both sides', 'null', 'symmetric', 'reconciliation'],
    diagram: 'join-venn',
    objectives: [
      ['Understand FULL OUTER JOIN: everyone from both tables', 'FULL OUTER JOIN samajhna: dono tables ke sab'],
      ['Emulate it in SQLite with LEFT + UNION + RIGHT-mirror', 'SQLite me LEFT + UNION + RIGHT-mirror se iski copy banana'],
      ['Recognise reconciliation-shaped problems', 'Reconciliation-shaped problems pehchanna'],
    ],
    theory: [
      section(
        ['Everyone, from both sides', 'Dono taraf ke sab log'],
        [
          [
            'INNER keeps matches. LEFT keeps the left side plus matches. RIGHT keeps the right side plus matches. FULL OUTER JOIN keeps EVERYTHING: every left row (NULL-filled if unmatched) and every right row (NULL-filled if unmatched) — the union of both outer joins. It answers "show me everything, matched where possible, and expose the orphans on both sides".',
            'INNER match rakhta hai. LEFT left side aur match rakhta hai. RIGHT right side aur match rakhta hai. FULL OUTER JOIN SAB kuch rakhta hai: har left row (unmatched ho to NULL-filled) aur har right row (unmatched ho to NULL-filled) — dono outer joins ka union. Yeh jawab deta hai "sab dikhao, jahan ho sake wahan jodo, aur dono taraf ke anaath bhi dikha do".',
          ],
          [
            'The classic use is reconciliation: two systems that SHOULD agree — inventory vs accounting, signups vs payments, A-list vs B-list. FULL OUTER JOIN lines them up and the NULL rows on either side are exactly the discrepancies to investigate. It is the auditor\'s join.',
            'Classic use hai reconciliation: do systems jo SAME honi chahiye — inventory vs accounting, signups vs payments, A-list vs B-list. FULL OUTER JOIN unhe line me lagata hai aur dono taraf ki NULL rows hi wahi discrepancies hain jo investigate karni hain. Yeh auditor ka join hai.',
          ],
        ],
        [],
        'join-venn'
      ),
      section(
        ['SQLite\'s workaround', 'SQLite ka jugaad'],
        [
          [
            'SQLite (before 3.47-era discussions) does not implement FULL OUTER JOIN directly — like RIGHT JOIN, you compose it: (A LEFT JOIN B) UNION ALL (B LEFT JOIN A WHERE A.key IS NULL). The first half carries all A rows with matches; the second half adds only the B rows that found no partner. Together: everyone, once, with NULLs exposing both kinds of orphan.',
            'SQLite RIGHT JOIN ki tarah FULL OUTER JOIN bhi directly nahi banata — ise aap jodte ho: (A LEFT JOIN B) UNION ALL (B LEFT JOIN A WHERE A.key IS NULL). Pehla aadha saari A rows match ke saath laata hai; doosra aadha sirf wahi B rows jodata hai jinko partner nahi mila. Dono milkar: sab log, ek baar, NULLs dono tarah ke anaath dikha rahe.',
          ],
          [
            'You will write this composition in the tasks — it is also the best exercise in OUTER-join thinking ever devised, because you must know precisely which rows each half contributes and why no row duplicates.',
            'Aap yeh composition tasks me likhoge — aur yahi OUTER-join soch ka sabse achha exercise hai, kyunki aapko exactly pata hona chahiye har aadha kaunsi rows deta hai aur koi row duplicate kyun nahi hoti.',
          ],
        ],
        [
          ['FULL OUTER = LEFT ∪ RIGHT-mirror, orphans from both sides', 'FULL OUTER = LEFT ∪ RIGHT-mirror, dono taraf ke anaath'],
          ['The reconciliation join: align two worlds, expose gaps', 'Reconciliation join: do duniya align karo, gaps dikhaо'],
          ['SQLite: compose with UNION ALL of two LEFT joins', 'SQLite: do LEFT joins ke UNION ALL se banao'],
        ]
      ),
    ],
    tutorial: {
      title: ['Two worlds, aligned', 'Do duniya, ek line me'],
      steps: [
        step(null, [
          'Scenario: a marketing list (customers) vs an orders log — who exists in one world but not the other? We build the FULL OUTER composition.',
          'Scenario: ek marketing list (customers) aur ek orders log — kaun ek duniya me hai par doosri me nahi? Hum FULL OUTER composition banate hain.',
        ]),
        step('SELECT c.name AS customer, o.id AS order_id\nFROM customers c LEFT JOIN orders o ON o.customer_id = c.id\nWHERE o.id IS NULL;', [
          'Left orphans: customers with no orders.',
          'Left anaath: bina orders wale customers.',
        ], { table: 'customers' }),
        step('SELECT c.name AS customer, o.id AS order_id\nFROM orders o LEFT JOIN customers c ON o.customer_id = c.id\nWHERE c.id IS NULL;', [
          'Right orphans: orders pointing at missing customers (none here — referential integrity holds).',
          'Right anaath: aise orders jo gayab customers ki taraf point karte hain (yahan koi nahi — referential integrity hai).',
        ], { table: 'orders' }),
        step('SELECT c.name AS customer, o.id AS order_id FROM customers c LEFT JOIN orders o ON o.customer_id = c.id\nUNION\nSELECT c.name AS customer, o.id AS order_id FROM orders o LEFT JOIN customers c ON o.customer_id = c.id;', [
          'A UNION-based approximation — the true composition uses UNION ALL with an IS NULL guard on the second half to avoid duplicates.',
          'UNION-based approximation — asli composition UNION ALL use karti hai doosre aadhe par IS NULL guard ke saath taaki duplicates na banein.',
        ], { table: 'customers' }),
        step('SELECT c.name, COUNT(o.id) AS orders FROM customers c LEFT JOIN orders o ON o.customer_id = c.id GROUP BY c.name HAVING COUNT(o.id) = 0;', [
          'The practical audit this enables: zero-order customers — the left-side gaps.',
          'Isse jo practical audit banta hai: zero-order customers — left-side ke gaps.',
        ], { run: true, table: 'customers' }),
      ],
    },
    syntax: {
      template: '-- Conceptual FULL OUTER (not in SQLite):\nSELECT … FROM a FULL OUTER JOIN b ON a.key = b.key;\n-- SQLite composition:\nSELECT …, b.col FROM a LEFT JOIN b ON a.key = b.key\nUNION ALL\nSELECT …, a.col FROM b LEFT JOIN a ON a.key = b.key WHERE a.key IS NULL;',
      parts: [
        { part: 'first half', description: ['All A rows, matched or NULL', 'Saari A rows, match ya NULL'] },
        { part: 'second half', description: ['Only B rows with no A match', 'Sirf wo B rows jinka A match nahi'] },
        { part: 'UNION ALL', description: ['Glues the halves; no dedup needed by construction', 'Dono aadhe jodta hai; design ke karib dedup ki zaroorat nahi'] },
      ],
    },
    examples: [
      example('easy', 'SELECT c.name AS customer, o.id AS order_id\nFROM customers c LEFT JOIN orders o ON o.customer_id = c.id\nWHERE o.id IS NULL;', [
        'Left orphans of the customers⨝orders reconciliation.',
        'customers⨝orders reconciliation ke left anaath.',
      ]),
      example('medium', "SELECT 'missing_customer' AS issue, o.id FROM orders o LEFT JOIN customers c ON c.id = o.customer_id WHERE c.id IS NULL\nUNION ALL\nSELECT 'never_ordered' AS issue, c.id FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL;", [
        'A combined discrepancy report — the reconciliation spirit (here: one never-ordered customer, zero broken references).',
        'Combined discrepancy report — reconciliation ki rooh (yahan: ek kabhi-order-na-karne wala customer, zero toote references).',
      ]),
      example('hard', "SELECT 'order_without_payment' AS issue, o.id\nFROM orders o LEFT JOIN payments p ON p.order_id = o.id WHERE p.id IS NULL;", [
        'Right-side orphan check on the payment chain — every order has exactly one payment here, so zero rows.',
        'Payment chain par right-side orphan check — yahan har order ka exactly ek payment hai, to zero rows.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Writing FULL OUTER JOIN in SQLite and hitting a syntax error', 'SQLite me FULL OUTER JOIN likh kar syntax error khana'],
        ['Compose it: LEFT join UNION ALL the right-mirror with an IS NULL guard. That composition IS the full outer join.', 'Compose karo: LEFT join UNION ALL right-mirror IS NULL guard ke saath. Wahi composition FULL OUTER JOIN hai.']
      ),
      mistake(
        ['Duplicating matched rows when composing', 'Compose karte hue matched rows duplicate karna'],
        ['The second half MUST filter WHERE a.key IS NULL, otherwise matched rows appear twice. UNION (plain) also dedups but hides genuine duplicates — use the guard.', 'Doosre aadhe me WHERE a.key IS NULL ZAROORI hai, warna matched rows do baar dikhti hain. Plain UNION bhi dedup karta hai par asli duplicates chhupa deta hai — guard use karo.']
      ),
      mistake(
        ['Reaching for FULL OUTER when a simple anti-join suffices', 'Simple anti-join kaafi ho wahan FULL OUTER use karna'],
        ['If you only need one side\'s orphans, LEFT JOIN + IS NULL is cheaper and clearer. FULL OUTER earns its keep only when both sides matter.', 'Agar sirf ek taraf ke anaath chahiye to LEFT JOIN + IS NULL sasta aur saaf hai. FULL OUTER tab hi apni value deta hai jab dono taraf matter karte hon.']
      ),
    ],
    summary: [
      ['FULL OUTER JOIN preserves both sides, NULL-filling orphans', 'FULL OUTER JOIN dono taraf bachata hai, anaath NULL-filled'],
      ['The reconciliation join for aligning two systems', 'Do systems align karne wala reconciliation join'],
      ['SQLite: two LEFT joins + UNION ALL + IS NULL guard', 'SQLite: do LEFT joins + UNION ALL + IS NULL guard'],
      ['One-sided questions need only LEFT JOIN + IS NULL', 'Ek-taraf wale sawal ke liye LEFT JOIN + IS NULL kaafi hai'],
    ],
    quiz: [
      mcq(
        ['Which rows does FULL OUTER JOIN always include?', 'FULL OUTER JOIN hamesha kaunsi rows rakhta hai?'],
        [
          ['Only matched pairs', 'Sirf matched pairs'],
          ['All left rows, matched or not', 'Saari left rows, match ho ya na ho'],
          ['All rows from both tables, matched or not', 'Dono tables ki saari rows, match ho ya na ho'],
          ['All right rows, matched or not', 'Saari right rows, match ho ya na ho'],
        ],
        2,
        ['FULL OUTER = LEFT ∪ RIGHT: every row of both tables survives, NULL-filled where unmatched.', 'FULL OUTER = LEFT ∪ RIGHT: dono tables ki har row bachti hai, unmatched jagah NULL-filled.']
      ),
      outputQ(
        "SELECT COUNT(*) FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL;",
        ['In the customers⨝orders reconciliation, how many left-side orphans?', 'customers⨝orders reconciliation me kitne left-side anaath?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[0]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[1]] } },
          { label: 'C', result: { columns: ['COUNT(*)'], rows: [[34]] } },
          { label: 'D', result: { error: 'Error: FULL OUTER JOIN not supported' } },
        ],
        0,
        ['Zero — every customer has at least one order; this reconciliation is clean. (34 lack DELIVERED orders, but all have ordered.)', 'Zero — har customer ke kam se kam ek order hai; ye reconciliation saaf hai. (34 ke delivered orders nahi hain, par sabne order kiya hai.)']
      ),
      buildQ(
        ['Build: left orphans — customers with no orders', 'Banao: left anaath — bina orders wale customers'],
        ['SELECT', 'name', 'FROM', 'customers', 'c', 'LEFT', 'JOIN', 'orders', 'o', 'ON', 'o.customer_id = c.id', 'WHERE', 'o.id', 'IS', 'NULL'],
        ['SELECT', 'name', 'FROM', 'customers', 'c', 'LEFT', 'JOIN', 'orders', 'o', 'ON', 'o.customer_id = c.id', 'WHERE', 'o.id', 'IS', 'NULL'],
        ['The left half of any reconciliation.', 'Kisi bhi reconciliation ka left aadha.']
      ),
      blanksQ(
        'SELECT c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id ___ ___;',
        [
          { options: ['IS', '=', 'NOT'], correct: 'IS' },
          { options: ['NULL', 'EMPTY', '0'], correct: 'NULL' },
        ],
        ['IS NULL exposes the left orphans.', 'IS NULL left anaath dikhata hai.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Left orphan audit: customers who have received NO delivered order (the left-side gap of the delivery reconciliation). Names only.',
          'Left orphan audit: jin customers ko koi DELIVERED order nahi mila (delivery reconciliation ka left-side gap). Sirf naam.',
        ],
        sol: "SELECT c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'delivered' WHERE o.id IS NULL;",
        hints: [
          ['The anti-join with the status filter inside ON — half of every full outer.', 'Anti-join — status filter ON ke andar — har full outer ka aadha.'],
          ["SELECT c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'delivered' WHERE o.id IS NULL;", "SELECT c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'delivered' WHERE o.id IS NULL;"],
          ['34 names return.', '34 naam aate hain.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'Right orphan audit: orders whose customer reference is broken (no matching customer). Order ids only. (Expect ZERO rows here — referential integrity holds; producing zero rows is the correct answer.)',
          'Right orphan audit: aise orders jinka customer reference toota hai (koi matching customer nahi). Sirf order ids. (Yahan ZERO rows expect karo — referential integrity hai; zero rows hi sahi jawab hai.)',
        ],
        sol: 'SELECT o.id FROM orders o LEFT JOIN customers c ON c.id = o.customer_id WHERE c.id IS NULL;',
        hints: [
          ['Mirror the anti-join on the other side.', 'Anti-join ko doosri taraf mirror karo.'],
          ['SELECT o.id FROM orders o LEFT JOIN customers c ON c.id = o.customer_id WHERE c.id IS NULL;', 'SELECT o.id FROM orders o LEFT JOIN customers c ON c.id = o.customer_id WHERE c.id IS NULL;'],
          ['Zero rows is the correct, healthy answer — an empty result is a valid result.', 'Zero rows hi sahi, sehatmand jawab hai — khaali result bhi ek valid result hai.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'Payment reconciliation: orders that have no payment recorded. Columns: id. (Every order should have exactly one payment — expect none missing.)',
          'Payment reconciliation: aise orders jinka koi payment record nahi. Columns: id. (Har order ka exactly ek payment hona chahiye — koi missing nahi hona chahiye.)',
        ],
        sol: 'SELECT o.id FROM orders o LEFT JOIN payments p ON p.order_id = o.id WHERE p.id IS NULL;',
        hints: [
          ['Anti-join on the money chain.', 'Money chain par anti-join.'],
          ['SELECT o.id FROM orders o LEFT JOIN payments p ON p.order_id = o.id WHERE p.id IS NULL;', 'SELECT o.id FROM orders o LEFT JOIN payments p ON p.order_id = o.id WHERE p.id IS NULL;'],
          ['Zero rows — every order is paid in this data.', 'Zero rows — is data me har order paid hai.'],
        ],
      }),
      task({
        d: 'hard',
        desc: [
          'The composed FULL OUTER audit (SQLite style): one query listing BOTH watchlist kinds with a label — customers with no delivered order (label "no_delivery", showing the customer id) and out-of-stock products (label "out_of_stock", showing the product id). Columns: issue, id. (UNION ALL of two anti-joins/filters.)',
          'Composed FULL OUTER audit (SQLite style): ek query me DONO tarah ki watchlist label ke saath — jin customers ko delivered order nahi mila (label "no_delivery", customer id) aur out-of-stock products (label "out_of_stock", product id). Columns: issue, id. (Do anti-joins/filters ka UNION ALL.)',
        ],
        sol: "SELECT 'no_delivery' AS issue, c.id AS id\nFROM customers c LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'delivered'\nWHERE o.id IS NULL\nUNION ALL\nSELECT 'out_of_stock' AS issue, p.id AS id\nFROM products p\nWHERE p.stock_quantity = 0;",
        hints: [
          ['A conditional anti-join and a plain filter, glued with UNION ALL, each with a literal label.', 'Ek conditional anti-join aur ek plain filter, UNION ALL se jude, har ek ek literal label ke saath.'],
          ["SELECT 'no_delivery' AS issue, c.id FROM customers c LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'delivered' WHERE o.id IS NULL UNION ALL SELECT 'out_of_stock' AS issue, p.id FROM products p WHERE p.stock_quantity = 0;", "SELECT 'no_delivery' AS issue, c.id FROM customers c LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'delivered' WHERE o.id IS NULL UNION ALL SELECT 'out_of_stock' AS issue, p.id FROM products p WHERE p.stock_quantity = 0;"],
          ['34 + 15 rows: the combined operations watchlist.', '34 + 15 rows: combined operations watchlist.'],
        ],
      }),
      task({
        d: 'very_hard',
        desc: [
          'The symmetric engagement view: every customer with their order count, PLUS the mirror — every order\'s id with its customer name — combined so that customers with zero orders appear once with NULL order id, and (hypothetically) unmatched orders would appear with NULL names. Columns: name, order_id. Use the LEFT + UNION ALL + IS NULL-guard composition over customers⨝orders. Sorted by order_id with NULLs first (SQLite default ASC), then name. LIMIT 12.',
          'Symmetric engagement view: har customer apne order count… nahi — har customer apne naam ke saath, PLUS mirror — har order ka id apne customer naam ke saath — aise jode ki zero-order wale customers ek baar NULL order id ke saath dikhein, aur (hypothetically) unmatched orders NULL naam ke saath. Columns: name, order_id. customers⨝orders par LEFT + UNION ALL + IS NULL-guard composition use karo. Order_id se sorted, NULLs pehle (SQLite default ASC), phir naam. LIMIT 12.',
        ],
        sol: "SELECT c.name, o.id AS order_id\nFROM customers c LEFT JOIN orders o ON o.customer_id = c.id\nUNION ALL\nSELECT c.name, o.id AS order_id\nFROM orders o LEFT JOIN customers c ON o.customer_id = c.id\nWHERE c.id IS NULL\nORDER BY order_id, name LIMIT 12;",
        hints: [
          ['First half: all customers with matches or NULLs. Second half: only orphan orders (none here).', 'Pehla aadha: saare customers match ya NULL ke saath. Doosra aadha: sirf anaath orders (yahan koi nahi).'],
          ['ORDER BY order_id puts the NULL (never-ordered) row first in ASC.', 'ORDER BY order_id ASC me NULL wali (kabhi-order-na-ki) row pehle aati hai.'],
          ['The one NULL order_id row leads, then real orders follow.', 'Ek NULL order_id wali row aage, phir asli orders.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),

  defineModule({
    n: 37,
    title: ['CROSS JOIN & SELF JOIN', 'CROSS JOIN & SELF JOIN'],
    time: '25 min',
    concepts: ['cross join', 'cartesian product', 'self join', 'same table', 'pairs', 'combinations', 'duplicate alias'],
    diagram: 'join-venn',
    objectives: [
      ['Generate every combination with CROSS JOIN', 'CROSS JOIN se har combination banana'],
      ['Join a table to itself with aliases for SELF JOIN', 'SELF JOIN ke liye aliases se table khud se jodna'],
      ['Solve pair-comparison problems (within one table)', 'Pair-comparison problems solve karna (ek hi table ke andar)'],
    ],
    theory: [
      section(
        ['Every row meets every row', 'Har row har row se milti hai'],
        [
          [
            'CROSS JOIN is the JOIN with no ON: it pairs EVERY row of the left with EVERY row of the right — the Cartesian product. 15 cities × 5 payment methods = 75 rows, no questions asked. Usually that is a bug (a forgotten ON); but when you deliberately need all combinations — candidate pairs, size×colour variants, calendar grids — CROSS JOIN is exactly the tool.',
            'CROSS JOIN wo JOIN hai jisme ON nahi hota: ye left ki HAR row ko right ki HAR row ke saath jodta hai — Cartesian product. 10 teachers × 5 departments = 50 rows, koi sawal nahi. Aksar yeh bug hota hai (ON bhool gaya); par jab aapko jaan-boojh kar saare combinations chahiye — candidate pairs, size×colour variants, calendar grids — to CROSS JOIN hi tool hai.',
          ],
          [
            'SELF JOIN joins a table with ITSELF — the same table twice under two aliases. The categories table is the perfect specimen: every row points at a parent row in the same table. Joining categories child ⨝ categories parent turns those numeric pointers into readable names: "Cookware — child of Home & Kitchen".',
            'SELF JOIN table ko KHUD se jodta hai — wahi table do aliases ke neeche do baar. Categories table perfect namuna hai: har row usi table ki parent row ki taraf point karti hai. Categories child ⨝ categories parent se wo numeric pointers padhne-layak naam ban jaate hain: "Cookware — Home & Kitchen ka child".',
          ],
        ],
        [],
        'join-venn'
      ),
      section(
        ['Pairs, comparisons and the alias discipline', 'Pairs, comparisons aur alias discipline'],
        [
          [
            'The classic SELF JOIN use is within-table comparison: find pairs of products in the SAME category (join products p1 ⨝ products p2 ON p1.category_id = p2.category_id AND p1.id < p2.id — the < halves the mirror, removing self-pairs and duplicates). That inequality trick — p1.id < p2.id — is the professional fingerprint of pair-generating queries.',
            'SELF JOIN ka classic use within-table comparison hai: SAME category ke product pairs dhoondho (join products p1 ⨝ products p2 ON p1.category_id = p2.category_id AND p1.id < p2.id — wo < mirror ko aadha karta hai, self-pairs aur duplicates hata deta hai). Wo inequality trick — p1.id < p2.id — pair-generating queries ki professional fingerprint hai.',
          ],
          [
            'Without distinct aliases, a self join cannot even be written: FROM products p1, products p2 — the engine needs two names for one table, and so does the reader. Choose alias names that carry MEANING (child/parent, a/b, cheaper/costlier) and self-joins start reading like prose.',
            'Alag aliases ke bina self join likha hi nahi ja sakta: FROM products p1, products p2 — engine ko ek table ke do naam chahiye, aur padhne wale ko bhi. Aise aliases chuno jime MATLAB ho (child/parent, a/b, cheaper/costlier) — self joins prose jaise padhne lagte hain.',
          ],
        ],
        [
          ['CROSS JOIN: no ON — every combination', 'CROSS JOIN: ON nahi — har combination'],
          ['SELF JOIN: one table, two meaningful aliases', 'SELF JOIN: ek table, do meaningful aliases'],
          ['p1.id < p2.id removes self-pairs and duplicates', 'p1.id < p2.id self-pairs aur duplicates hata deta hai'],
        ]
      ),
    ],
    tutorial: {
      title: ['Combinations and ancestors', 'Combinations aur ancestors'],
      steps: [
        step(null, [
          'Two show-stoppers: the full product pair matrix (cross), and the category family tree (self).',
          'Do show-stoppers: poora product pair matrix (cross), aur category ka family tree (self).',
        ]),
        step('SELECT c.city, pm.payment_method\nFROM (SELECT DISTINCT city FROM customers) c\nCROSS JOIN (SELECT DISTINCT payment_method FROM payments) pm\nORDER BY c.city, pm.payment_method LIMIT 8;', [
          '15 × 5 = 75 rows: every city mapped to every payment method — pure combination.',
          '15 × 5 = 75 rows: har city har payment method ke saath — pure combination.',
        ], { table: 'customers' }),
        step('SELECT child.name AS subcategory, parent.name AS parent_category\nFROM categories child\nINNER JOIN categories parent ON parent.id = child.parent_category_id\nORDER BY parent.id, child.id LIMIT 8;', [
          'SELF JOIN: one table twice — pointers become a readable family tree.',
          'SELF JOIN: ek table do baar — pointers readable family tree ban jaate hain.',
        ], { table: 'categories' }),
        step('SELECT p1.name AS cheaper, p2.name AS costlier\nFROM products p1 INNER JOIN products p2\n  ON p1.category_id = p2.category_id AND p1.price < p2.price AND p1.id < p2.id\nORDER BY p1.category_id, p1.id LIMIT 6;', [
          'Pair generation inside one table — the inequality keeps each pair once.',
          'Ek hi table ke andar pair banana — inequality har pair ko ek baar rakhti hai.',
        ], { table: 'products' }),
        step('SELECT COUNT(*) AS pairs\nFROM products p1 INNER JOIN products p2\n  ON p1.category_id = p2.category_id AND p1.id < p2.id;', [
          'Counting all within-category pairs at once.',
          'Saari within-category pairs ek saath ginna.',
        ], { run: true, table: 'products' }),
      ],
    },
    syntax: {
      template: 'SELECT a.col, b.col FROM t1 a CROSS JOIN t2 b;\n-- SELF:\nSELECT x.col, y.col\nFROM table x\nJOIN table y ON y.link = x.key [AND x.id < y.id];',
      parts: [
        { part: 'CROSS JOIN', description: ['No ON — full combination', 'ON nahi — poora combination'] },
        { part: 'two aliases', description: ['Same table appears as x and y', 'Wahi table x aur y ban ke aata hai'] },
        { part: 'x.id < y.id', description: ['Keeps each pair once, no self-pair', 'Har pair ek baar, self-pair nahi'] },
      ],
    },
    examples: [
      example('very_easy', "SELECT c.city, pm.payment_method\nFROM (SELECT DISTINCT city FROM customers) c\nCROSS JOIN (SELECT DISTINCT payment_method FROM payments) pm\nORDER BY c.city, pm.payment_method LIMIT 6;", [
        'The full pairing matrix — 75 combinations.',
        'Poora pairing matrix — 75 combinations.',
      ]),
      example('easy', 'SELECT child.name AS subcategory, parent.name AS parent\nFROM categories child JOIN categories parent ON parent.id = child.parent_category_id\nORDER BY parent.id, child.id LIMIT 6;', [
        'The category tree, readable at last.',
        'Category ka tree, ab padhne layak.',
      ]),
      example('medium', 'SELECT p1.name AS product_a, p2.name AS product_b\nFROM products p1 JOIN products p2 ON p1.category_id = p2.category_id AND p1.id < p2.id\nWHERE p1.category_id = 2 ORDER BY p1.id, p2.id LIMIT 6;', [
        'Every pair within category 2 — combinations inside one table.',
        'Category 2 ke andar har pair — ek hi table ke combinations.',
      ]),
      example('hard', "SELECT child.name AS sub, parent.name AS parent,\n  (SELECT COUNT(*) FROM products p WHERE p.category_id = child.id) AS sub_products\nFROM categories child\nLEFT JOIN categories parent ON parent.id = child.parent_category_id\nORDER BY parent.name, child.name LIMIT 12;", [
        'Tree plus counts — self join with a correlated subquery finishing the report.',
        'Tree plus counts — self join correlated subquery ke saath report complete.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Forgetting ON and creating an accidental 200×200 monster', 'ON bhool kar accidental 200×200 monster banana'],
        ['A JOIN without ON silently cross joins: 40,000 rows where you meant 1,480. Watch row counts — they tell on bad joins immediately.', 'ON ke bina JOIN chup-chaap cross join ban jaata hai: 1,480 ki jagah 40,000 rows. Row counts dekho — bure joins par turant bata dete hain.']
      ),
      mistake(
        ['Self join without aliases (or with meaningless ones)', 'Bina aliases (ya be-matlab aliases) ke self join'],
        ['FROM products JOIN products fails — the engine needs two distinct names. Use semantic aliases: cheaper/costlier, child/parent.', 'FROM products JOIN products fail hota hai — engine ko do alag naam chahiye. Semantic aliases lo: cheaper/costlier, child/parent.']
      ),
      mistake(
        ['Pair duplication without the inequality guard', 'Inequality guard ke bina pair duplication'],
        ['p1⨝p2 on category alone yields every pair TWICE plus self-pairs. Add AND p1.id < p2.id — one line, half the rows, all the meaning.', 'Sirf category par p1⨝p2 har pair DO baar deta hai plus self-pairs. AND p1.id < p2.id jodo — ek line, aadhi rows, poora matlab.']
      ),
    ],
    summary: [
      ['CROSS JOIN deliberately pairs every row with every row', 'CROSS JOIN jaan-boojh kar har row ko har row se jodta hai'],
      ['SELF JOIN = one table under two meaningful aliases', 'SELF JOIN = ek table do meaningful aliases ke neeche'],
      ['The id inequality keeps pair lists clean', 'Id inequality pair lists saaf rakhta hai'],
      ['Watch row counts — accidental crosses announce themselves', 'Row counts dekho — accidental cross khud bata dete hain'],
    ],
    quiz: [
      mcq(
        ['What distinguishes CROSS JOIN from INNER JOIN?', 'CROSS JOIN ko INNER JOIN se kya alag karta hai?'],
        [
          ['CROSS JOIN sorts its output', 'CROSS JOIN apna output sort karta hai'],
          ['CROSS JOIN has no ON condition — all combinations', 'CROSS JOIN me ON nahi hota — saare combinations'],
          ['CROSS JOIN removes duplicates', 'CROSS JOIN duplicates hata deta hai'],
          ['Nothing — they are identical', 'Kuch nahi — dono same hain'],
        ],
        1,
        ['No ON means no filter: every left row pairs with every right row.', 'ON na hone ka matlab no filter: har left row har right row ke saath judti hai.']
      ),
      outputQ(
        'SELECT COUNT(*) FROM (SELECT DISTINCT city FROM customers) c CROSS JOIN (SELECT DISTINCT payment_method FROM payments) pm;',
        ['How many rows does this cross join produce?', 'Yeh cross join kitni rows banata hai?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[75]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[15]] } },
          { label: 'C', result: { columns: ['COUNT(*)'], rows: [[5]] } },
          { label: 'D', result: { error: 'Error: near "CROSS": syntax error' } },
        ],
        0,
        ['15 distinct cities × 5 payment methods = 75 — pure multiplication, no matching needed.', '15 alag cities × 5 payment methods = 75 — seedhi multiplication, koi matching nahi.']
      ),
      buildQ(
        ['Build: subcategory with its parent name (self join)', 'Banao: subcategory apne parent naam ke saath (self join)'],
        ['child', 'name', 'parent', 'categories', 'JOIN', 'ON', 'parent.id = child.parent_category_id', 'SELECT', 'FROM', 'AS', 'sub', 'AS', 'parent_category'],
        ['child', '.', 'name', 'AS', 'sub', ',', 'parent', '.', 'name', 'AS', 'parent_category', 'FROM', 'categories', 'child', 'JOIN', 'categories', 'parent', 'ON', 'parent.id = child.parent_category_id'],
        ['Two aliases of one table, ON linking child pointer to parent id.', 'Ek table ke do aliases, ON child pointer ko parent id se jodta hai.']
      ),
      blanksQ(
        'SELECT p1.name, p2.name FROM products p1 ___ products p2 ON p1.category_id = p2.category_id AND p1.id ___ p2.id;',
        [
          { options: ['JOIN', 'CROSS'], correct: 'JOIN' },
          { options: ['<', '>', '='], correct: '<' },
        ],
        ['A pair join with the clean-pairs inequality.', 'Pair join clean-pairs inequality ke saath.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Coverage matrix: every customer city paired with every payment method (cross join of two distinct-value lists). Columns: city, payment_method. Sorted by city then payment_method. LIMIT 10.',
          'Coverage matrix: har customer city har payment method ke saath (do distinct-value lists ka cross join). Columns: city, payment_method. City phir payment_method se sorted. LIMIT 10.',
        ],
        sol: "SELECT c.city, pm.payment_method\nFROM (SELECT DISTINCT city FROM customers) c\nCROSS JOIN (SELECT DISTINCT payment_method FROM payments) pm\nORDER BY c.city, pm.payment_method LIMIT 10;",
        hints: [

          ['Cross the two DISTINCT lists — no ON clause.', 'Do DISTINCT lists ko cross karo — ON clause nahi.'],
          ['SELECT c.city, pm.payment_method FROM (SELECT DISTINCT city FROM customers) c CROSS JOIN (SELECT DISTINCT payment_method FROM payments) pm ORDER BY c.city, pm.payment_method LIMIT 10;', 'Wahi query — bas likho aur chalao.'],
          ['15 cities × 5 methods = 75 rows total; you show the first 10.', '15 cities × 5 methods = kul 75 rows; aap pehli 10 dikhate ho.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'easy',
        desc: [
          'Family tree: each subcategory with its parent category name. Columns: sub, parent. Sorted by parent then sub.',
          'Family tree: har subcategory apne parent category naam ke saath. Columns: sub, parent. Parent phir sub se sorted.',
        ],
        sol: 'SELECT child.name AS sub, parent.name AS parent\nFROM categories child JOIN categories parent ON parent.id = child.parent_category_id\nORDER BY parent.name, child.name;',
        hints: [
          ['One table, two aliases, ON child.parent → parent.id.', 'Ek table, do aliases, ON child.parent → parent.id.'],
          ['SELECT child.name AS sub, parent.name AS parent FROM categories child JOIN categories parent ON parent.id = child.parent_category_id ORDER BY parent.name, child.name;', 'SELECT child.name AS sub, parent.name AS parent FROM categories child JOIN categories parent ON parent.id = child.parent_category_id ORDER BY parent.name, child.name;'],
          ['15 subcategory→parent rows.', '15 subcategory→parent rows.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'medium',
        desc: [
          'Pair count: how many unordered pairs of products share the SAME category (self join with the inequality guard)? Single count aliased pairs.',
          'Pair count: same category wale kitne unordered product pairs hain (inequality guard wala self join)? Ek count, aliased pairs.',
        ],
        sol: 'SELECT COUNT(*) AS pairs\nFROM products p1 JOIN products p2\n  ON p1.category_id = p2.category_id AND p1.id < p2.id;',
        hints: [
          ['Join products to itself on category + p1.id < p2.id, then count.', 'products ko khud se join karo category + p1.id < p2.id par, phir gino.'],
          ['SELECT COUNT(*) AS pairs FROM products p1 JOIN products p2 ON p1.category_id = p2.category_id AND p1.id < p2.id;', 'SELECT COUNT(*) AS pairs FROM products p1 JOIN products p2 ON p1.category_id = p2.category_id AND p1.id < p2.id;'],
          ['Twenty categories × ~10 products each → 20 × 45 pairs = 900.', 'Bees categories × ~10 products har ek → 20 × 45 pairs = 900.'],
        ],
      }),
      task({
        d: 'hard',
        desc: [
          'Same-category neighbours: pairs of products in category 2 (Smartphones) only — cheaper first. Columns: product_a, product_b. Sorted by product_a, product_b. LIMIT 10.',
          'Same-category padosi: sirf category 2 (Smartphones) ke product pairs — sasta pehle. Columns: product_a, product_b. Product_a, product_b se sorted. LIMIT 10.',
        ],
        sol: "SELECT p1.name AS product_a, p2.name AS product_b\nFROM products p1 JOIN products p2\n  ON p1.category_id = p2.category_id AND p1.id < p2.id\nWHERE p1.category_id = 2\nORDER BY product_a, product_b LIMIT 10;",
        hints: [
          ['Add WHERE p1.category_id = 2 to the guarded self join.', 'Guarded self join par WHERE p1.category_id = 2 jodo.'],
          ['SELECT p1.name AS product_a, p2.name AS product_b FROM products p1 JOIN products p2 ON p1.category_id = p2.category_id AND p1.id < p2.id WHERE p1.category_id = 2 ORDER BY product_a, product_b LIMIT 10;', 'SELECT p1.name AS product_a, p2.name AS product_b FROM products p1 JOIN products p2 ON p1.category_id = p2.category_id AND p1.id < p2.id WHERE p1.category_id = 2 ORDER BY product_a, product_b LIMIT 10;'],
          ['45 pairs exist in a 10-product category.', '10-product category me 45 pairs hote hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'The comparison engine: for every pair of products in the same category, show the cheaper and the costlier with their prices and the price gap. Columns: cheaper, costlier, gap — gap = p2.price − p1.price (costlier minus cheaper), rounded to 2 decimals. Sorted by gap descending then cheaper. LIMIT 8. Only pairs where the gap is positive.',
          'Comparison engine: same category ke har product pair ke liye sasta aur mehga dikhao, unke prices aur price gap ke saath. Columns: cheaper, costlier, gap — gap = p2.price − p1.price (mehga minus sasta), 2 decimals par rounded. Gap se utarte phir cheaper se sorted. LIMIT 8. Sirf positive gap wale pairs.',
        ],
        sol: "SELECT p1.name AS cheaper, p2.name AS costlier, ROUND(p2.price - p1.price, 2) AS gap\nFROM products p1 JOIN products p2\n  ON p1.category_id = p2.category_id AND p1.price < p2.price AND p1.id < p2.id\nORDER BY gap DESC, cheaper LIMIT 8;",
        hints: [
          ['Two inequalities: one on id (no duplicates), one on price (positive gap).', 'Do inequality: ek id par (no duplicates), ek price par (positive gap).'],
          ['SELECT p1.name AS cheaper, p2.name AS costlier, ROUND(p2.price - p1.price, 2) AS gap FROM … ORDER BY gap DESC, cheaper LIMIT 8;', 'SELECT p1.name AS cheaper, p2.name AS costlier, ROUND(p2.price - p1.price, 2) AS gap FROM … ORDER BY gap DESC, cheaper LIMIT 8;'],
          ['Same-category price gaps reach five figures.', 'Same-category price gaps paanch-ank tak jaate hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),

  defineModule({
    n: 38,
    title: ['UNION & UNION ALL', 'UNION & UNION ALL'],
    time: '25 min',
    concepts: ['union', 'union all', 'combine', 'result sets', 'deduplicate', 'column alignment'],
    diagram: 'union-merge',
    objectives: [
      ['Stack result sets with UNION and UNION ALL', 'UNION aur UNION ALL se result sets stack karna'],
      ['Know the dedup difference and its cost', 'Dedup ka farq aur uski keemat jaanna'],
      ['Combine labelled reports into one answer', 'Labelled reports ko ek jawab me jodna'],
    ],
    theory: [
      section(
        ['Stacking answers', 'Jawab stack karna'],
        [
          [
            'JOINs widen rows (more columns); UNIONs lengthen results (more rows). UNION stacks the outputs of two SELECTs — one result below another. The rules: the same NUMBER of columns, with compatible types, matched position by position. Column NAMES come from the first SELECT. Fifteen VIPs + thirty-three premium customers become one forty-eight-row "valued" list — two filters, one answer.',
            'JOIN rows ko chauda karte hain (zyada columns); UNION results ko lamba karte hain (zyada rows). UNION do SELECT ke outputs stack karta hai — ek result doosre ke neeche. Rules: columns ki same GINTI, compatible types, position-by-position match. Column NAAM pehle SELECT se aate hain. Das teachers + pachaas students ek 60-row "log" list ban jaate hain — do alag tables, ek jawab.',
          ],
          [
            'UNION quietly removes duplicate rows (an expensive sort-and-compare); UNION ALL keeps every row as-is and is therefore faster and length-preserving. Professional default: UNION ALL unless dedup is genuinely wanted — "combined history" should keep both copies; "combined distinct behaviours" needs the dedup.',
            'UNION duplicate rows chup-chaap hata deta hai (mehngi sort-and-compare); UNION ALL har row waisi hi rakhta hai, isliye fast aur length-preserving. Professional default: UNION ALL jab tak dedup sach me na chaho — "combined history" me dono copies rehni chahiye; "combined distinct behaviours" ko dedup chahiye.',
          ],
        ],
        [],
        'union-merge'
      ),
      section(
        ['Labels and the reconciled report', 'Labels aur reconciled report'],
        [
          [
            'UNION queries shine when each arm carries a literal label column: SELECT \'vip\' AS tier, name FROM customers WHERE customer_type = \'vip\' UNION ALL SELECT \'premium\', name FROM customers WHERE customer_type = \'premium\'. One result, two provenances, immediately filterable and sortable as a whole. You used this pattern in the FULL OUTER composition — now it is yours deliberately.',
            'UNION queries tab chamakte hain jab har arm ek literal label column le: SELECT \'vip\' AS tier, name FROM customers WHERE customer_type = \'vip\' UNION ALL SELECT \'premium\', name FROM customers WHERE customer_type = \'premium\'. Ek result, do sources, turant filterable aur sortable. Yeh pattern aapne FULL OUTER composition me use kiya tha — ab ye jaan-boojh kar aapka hai.',
          ],
          [
            'One trap to respect: ORDER BY and LIMIT at the end apply to the COMBINED result (which is what you usually want), but each arm keeps its own WHERE, joins and grouping. Column order must match across arms exactly — the classic "4 columns vs 3" error announces itself loudly, which is mercy.',
            'Ek trap ka izzat karo: end me ORDER BY aur LIMIT COMBINED result par lagte hain (jo aksar wahi chahiye), par har arm ka apna WHERE, joins aur grouping rehta hai. Column order dono arms me exactly match hona chahiye — classic "4 vs 3 columns" error zor se aata hai, jo daya hai.',
          ],
        ],
        [
          ['UNION dedups (costly); UNION ALL keeps everything (fast)', 'UNION dedup karta hai (mehnga); UNION ALL sab rakhta hai (fast)'],
          ['Arms must align: column count and compatible types', 'Arms align hone chahiye: column count aur compatible types'],
          ['Literal label columns make combined results readable', 'Literal label columns combined results readable banate hain'],
        ]
      ),
    ],
    tutorial: {
      title: ['One list, many sources', 'Ek list, kai sources'],
      steps: [
        step(null, [
          'The school directory merge: teachers and students in one people list, each arm labelled.',
          'School directory merge: teachers aur students ek people list me, har arm labelled.',
        ]),
        step("SELECT 'teacher' AS role, name FROM teachers\nUNION ALL\nSELECT 'student', name FROM students\nORDER BY role, name LIMIT 8;", [
          'Two tables, one stacked list, labels leading the sort.',
          'Do tables, ek stacked list, labels sort ki tarah aage.',
        ], { table: 'students' }),
        step("SELECT 'school' AS source, name, city FROM students\nUNION ALL\nSELECT 'ecommerce', name, city FROM customers\nORDER BY source, name LIMIT 10;", [
          'Across datasets… careful — separate databases here. Within ONE database instead: premium and vip customers together.',
          'Datasets ke paar… dhyan — yahan alag databases hain. Ek hi database ke andar karo: premium aur vip customers saath.',
        ], { table: 'customers' }),
        step("SELECT 'premium' AS tier, name FROM customers WHERE customer_type = 'premium'\nUNION\nSELECT 'vip', name FROM customers WHERE customer_type = 'vip'\nORDER BY tier, name LIMIT 8;", [
          'Same table, two filters, UNION — dedup version.',
          'Wahi table, do filters, UNION — dedup wala.',
        ], { table: 'customers' }),
        step("SELECT 'never_ordered' AS issue, c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL\nUNION ALL\nSELECT 'out_of_stock', p.name FROM products p WHERE p.stock_quantity = 0\nORDER BY issue, name LIMIT 10;", [
          'The consolidated watchlist: two audits, one actionable list.',
          'Consolidated watchlist: do audits, ek actionable list.',
        ], { run: true, table: 'customers' }),
      ],
    },
    syntax: {
      template: "SELECT col1, col2 FROM a [WHERE …]\nUNION [ALL]\nSELECT col1, col2 FROM b [WHERE …]\n[ORDER BY …] [LIMIT …];",
      parts: [
        { part: 'UNION', description: ['Stacks and dedups', 'Stack karta hai aur dedup karta hai'] },
        { part: 'UNION ALL', description: ['Stacks everything — faster default', 'Sab stack karta hai — fast default'] },
        { part: 'column alignment', description: ['Same count, compatible types, first names win', 'Same count, compatible types, pehle naam jeet-te hain'] },
      ],
    },
    examples: [
      example('very_easy', "SELECT 'teacher' AS role, name FROM teachers UNION ALL SELECT 'student', name FROM students ORDER BY role, name LIMIT 8;", [
        'The people list — 60 rows, one result.',
        'People list — 60 rows, ek result.',
      ]),
      example('easy', "SELECT name FROM customers WHERE city = 'Jaipur'\nUNION\nSELECT name FROM customers WHERE customer_type = 'vip'\nORDER BY name;", [
        'Jaipur residents plus VIPs — deduped (a Jaipur VIP appears once).',
        'Jaipur ke rahiye plus VIPs — deduped (Jaipur ka VIP ek baar).',
      ]),
      example('medium', "SELECT 'cancelled' AS status, o.id FROM orders o WHERE o.status = 'cancelled'\nUNION ALL\nSELECT 'returned', s.id FROM shipping s WHERE s.shipping_status = 'returned'\nORDER BY status, id LIMIT 10;", [
        'A consolidated issues list across orders and shipping (advanced dataset preview).',
        'Orders aur shipping par consolidated issues list (advanced dataset preview).',
      ]),
      example('hard', "SELECT 'in_stock' AS state, COUNT(*) FROM products WHERE stock_quantity > 0\nUNION ALL\nSELECT 'out_of_stock', COUNT(*) FROM products WHERE stock_quantity = 0;", [
        'A two-row summary built from two counts — UNION as a report assembler.',
        'Do counts se bana do-row summary — UNION report assembler ki tarah.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Mismatched column counts across arms', 'Arms ke beech column count ka mismatch'],
        ['SELECT name, city … UNION SELECT name … is an error: arms must align perfectly. Add a literal or column to balance.', 'SELECT name, city … UNION SELECT name … error hai: arms perfect align hone chahiye. Balance karne ke liye literal ya column jodo.']
      ),
      mistake(
        ['Using UNION reflexively and paying the dedup tax', 'Aadat se UNION use karke dedup tax bharna'],
        ['UNION sorts and compares to remove duplicates. When rows cannot repeat (different tables), UNION ALL is free — make it the default reflex.', 'UNION duplicates hatane ke liye sort aur compare karta hai. Jab rows repeat ho hi nahi sakti (alag tables), UNION ALL free hai — ise default reflex banao.']
      ),
      mistake(
        ['Expecting each arm to keep its own ORDER', 'Har arm ka apna ORDER expect karna'],
        ['ORDER BY belongs at the END and governs the combined result. Per-arm ordering is meaningless in a stack; put sort keys in the final clause.', 'ORDER BY END me aata hai aur combined result par chalta hai. Stack me har arm ka alag ordering meaningless hai; sort keys final clause me rakho.']
      ),
    ],
    summary: [
      ['UNION stacks result sets; JOIN widens rows', 'UNION result sets stack karta hai; JOIN rows chauda karta hai'],
      ['Arms must match in column count and types', 'Arms column count aur types me match hone chahiye'],
      ['UNION dedups at a cost; UNION ALL is the fast default', 'UNION dedup karata hai ek keemat par; UNION ALL fast default hai'],
      ['Label columns turn stacks into readable reports', 'Label columns stacks ko readable reports banate hain'],
    ],
    quiz: [
      mcq(
        ['What is the difference between UNION and UNION ALL?', 'UNION aur UNION ALL me kya farak hai?'],
        [
          ['UNION ALL is invalid syntax', 'UNION ALL invalid syntax hai'],
          ['UNION removes duplicate rows; UNION ALL keeps them', 'UNION duplicate rows hata deta hai; UNION ALL rakhta hai'],
          ['UNION sorts; UNION ALL does not', 'UNION sort karta hai; UNION ALL nahi'],
          ['UNION combines columns; UNION ALL combines rows', 'UNION columns jodta hai; UNION ALL rows'],
        ],
        1,
        ['Dedup is the only difference — and it costs a sort. Choose ALL when duplicates are impossible or wanted.', 'Dedup hi akeli difference hai — aur uski keemat ek sort hai. ALL chuno jab duplicates impossible ya chahiye hon.']
      ),
      outputQ(
        "SELECT 'a' AS tag, COUNT(*) FROM customers WHERE customer_type = 'vip'\nUNION ALL\nSELECT 'b', COUNT(*) FROM customers WHERE customer_type = 'premium';",
        ['What two numbers come back (tag a, tag b)?', 'Kaunse do numbers aate hain (tag a, tag b)?'],
        [
          { label: 'A', result: { columns: ['tag', 'COUNT(*)'], rows: [['a', 15], ['b', 33]] } },
          { label: 'B', result: { columns: ['tag', 'COUNT(*)'], rows: [['a', 33], ['b', 15]] } },
          { label: 'C', result: { columns: ['tag', 'COUNT(*)'], rows: [['a', 48]] } },
          { label: 'D', result: { error: 'Error: SELECTs to the left and right of UNION do not have the same number of result columns' } },
        ],
        0,
        ['15 VIPs (tag a) and 33 premium (tag b) — arms aligned, labels carried.', '15 VIPs (tag a) aur 33 premium (tag b) — arms aligned, labels saath.']
      ),
      buildQ(
        ['Build: the people list (teachers + students, UNION ALL, labelled)', 'Banao: people list (teachers + students, UNION ALL, labelled)'],
        ["SELECT", "'teacher'", 'AS', 'role', ',', 'name', 'FROM', 'teachers', 'UNION', 'ALL', 'SELECT', "'student'", ',', 'name', 'FROM', 'students'],
        ['SELECT', "'teacher'", 'AS', 'role', ',', 'name', 'FROM', 'teachers', 'UNION', 'ALL', 'SELECT', "'student'", ',', 'name', 'FROM', 'students'],
        ['Label literal in each arm, then the shared name column.', 'Har arm me label literal, phir shared name column.']
      ),
      blanksQ(
        'SELECT name FROM a UNION ___ SELECT name FROM b;',
        [{ options: ['ALL', 'ONLY', 'EACH', 'DISTINCT'], correct: 'ALL' }],
        ['UNION ALL keeps duplicates and skips the dedup cost.', 'UNION ALL duplicates rakhta hai aur dedup ke bachta hai.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The valued list: customers labelled "vip" (vip tier) and "premium" (premium tier), stacked with UNION ALL. Columns: tier, name. Sorted by tier then name. LIMIT 12.',
          'Valued list: customers "vip" (vip tier) aur "premium" (premium tier) label ke saath, UNION ALL se stacked. Columns: tier, name. Tier phir naam se sorted. LIMIT 12.',
        ],
        sol: "SELECT 'vip' AS tier, name FROM customers WHERE customer_type = 'vip'\nUNION ALL\nSELECT 'premium', name FROM customers WHERE customer_type = 'premium'\nORDER BY tier, name LIMIT 12;",
        hints: [
          ['Literal label in the first arm; matching literal in the second.', 'Pehle arm me literal label; doosre me matching literal.'],
          ["SELECT 'vip' AS tier, name FROM customers WHERE customer_type = 'vip' UNION ALL SELECT 'premium', name FROM customers WHERE customer_type = 'premium' ORDER BY tier, name LIMIT 12;", "SELECT 'vip' AS tier, name FROM customers WHERE customer_type = 'vip' UNION ALL SELECT 'premium', name FROM customers WHERE customer_type = 'premium' ORDER BY tier, name LIMIT 12;"],
          ['48 rows total (15 vip + 33 premium); the sort interleaves both tiers.', 'Kul 48 rows (15 vip + 33 premium); sort dono tiers ko mix karke dikhata hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'easy',
        desc: [
          'The honour list: names of Jaipur residents UNION names of VIP customers — dedup version (a person matching both appears once). Sorted by name.',
          'Honour list: Jaipur ke rahne walon ke naam UNION VIP customers ke naam — dedup wala (dono criteria match karne wala ek baar dikhega). Naam se sorted.',
        ],
        sol: "SELECT name FROM customers WHERE city = 'Jaipur'\nUNION\nSELECT name FROM customers WHERE customer_type = 'vip'\nORDER BY name;",
        hints: [
          ['Two filters, one dedup union, one final sort.', 'Do filters, ek dedup union, ek final sort.'],
          ["SELECT name FROM customers WHERE city = 'Jaipur' UNION SELECT name FROM customers WHERE customer_type = 'vip' ORDER BY name;", "SELECT name FROM customers WHERE city = 'Jaipur' UNION SELECT name FROM customers WHERE customer_type = 'vip' ORDER BY name;"],
          ['13 Jaipur + 15 VIP, minus overlaps.', '13 Jaipur + 15 VIP, overlaps minus.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'medium',
        desc: [
          'The status summary: a two-row report of order counts — one row labelled "cancelled", one labelled "pending" — using UNION ALL of two counted arms. Columns: status, orders.',
          'Status summary: do-row report — ek row "cancelled", ek "pending" label wali, dono me order count — do counted arms ke UNION ALL se. Columns: status, orders.',
        ],
        sol: "SELECT 'cancelled' AS status, COUNT(*) AS orders FROM orders WHERE status = 'cancelled'\nUNION ALL\nSELECT 'pending', COUNT(*) FROM orders WHERE status = 'pending';",
        hints: [
          ['Each arm: a literal + a filtered count.', 'Har arm: ek literal + ek filtered count.'],
          ["SELECT 'cancelled' AS status, COUNT(*) AS orders FROM orders WHERE status = 'cancelled' UNION ALL SELECT 'pending', COUNT(*) FROM orders WHERE status = 'pending';", "SELECT 'cancelled' AS status, COUNT(*) AS orders FROM orders WHERE status = 'cancelled' UNION ALL SELECT 'pending', COUNT(*) FROM orders WHERE status = 'pending';"],
          ['105 and 105 — both statuses tie.', '105 aur 105 — dono statuses barabar.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'hard',
        desc: [
          'The consolidated watchlist: one list with two labelled arms — customers who never ordered (issue "never_ordered", show name) and products out of stock (issue "out_of_stock", show name). Columns: issue, name. Sorted by issue then name.',
          'Consolidated watchlist: ek list do labelled arms ke saath — jo customers ne kabhi order nahi diya (issue "never_ordered", naam dikhao) aur jo products out of stock hain (issue "out_of_stock", naam dikhao). Columns: issue, name. Issue phir naam se sorted.',
        ],
        sol: "SELECT 'never_ordered' AS issue, c.name\nFROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL\nUNION ALL\nSELECT 'out_of_stock', p.name FROM products p WHERE p.stock_quantity = 0\nORDER BY issue, name;",
        hints: [
          ['Arm 1: anti-join. Arm 2: simple filter. Glue: UNION ALL. Sort at the very end.', 'Arm 1: anti-join. Arm 2: simple filter. Glue: UNION ALL. Sort bilkul aakhir me.'],
          ["SELECT 'never_ordered' AS issue, c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL UNION ALL SELECT 'out_of_stock', p.name FROM products p WHERE p.stock_quantity = 0 ORDER BY issue, name;", "SELECT 'never_ordered' AS issue, c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL UNION ALL SELECT 'out_of_stock', p.name FROM products p WHERE p.stock_quantity = 0 ORDER BY issue, name;"],
          ['1 + 15 rows — the full watchlist.', '1 + 15 rows — poora watchlist.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'The city tier census: one row per city with two labelled counts stacked into two rows per city… no — cleaner: for each city, one row with the city and label "vip" plus its VIP count, UNION ALL label "premium" plus its premium count. Columns: city, tier, customers. Only cities where the count is at least 1. Sorted by city, then tier.',
          'City tier census: har city ki ek row label "vip" ke saath uske VIP count ki… nahi — saaf: har city ke liye ek row city + label "vip" + VIP count, UNION ALL city + label "premium" + premium count. Columns: city, tier, customers. Sirf count kam se kam 1 wale. City phir tier se sorted.',
        ],
        sol: "SELECT city, 'vip' AS tier, COUNT(*) AS customers FROM customers WHERE customer_type = 'vip' GROUP BY city\nUNION ALL\nSELECT city, 'premium', COUNT(*) FROM customers WHERE customer_type = 'premium' GROUP BY city\nORDER BY city, tier;",
        hints: [
          ['Each arm groups its own tier by city; labels go in the middle column.', 'Har arm apna tier city se group karta hai; labels beech wale column me.'],
          ["SELECT city, 'vip' AS tier, COUNT(*) AS customers FROM customers WHERE customer_type = 'vip' GROUP BY city UNION ALL SELECT city, 'premium', COUNT(*) FROM customers WHERE customer_type = 'premium' GROUP BY city ORDER BY city, tier;", "SELECT city, 'vip' AS tier, COUNT(*) AS customers FROM customers WHERE customer_type = 'vip' GROUP BY city UNION ALL SELECT city, 'premium', COUNT(*) FROM customers WHERE customer_type = 'premium' GROUP BY city ORDER BY city, tier;"],
          ['Filtered groups vanish automatically — cities without that tier simply produce no row.', 'Filtered groups khud gayab ho jaate hain — jis city me wo tier nahi, wahan row banti hi nahi.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),
];
