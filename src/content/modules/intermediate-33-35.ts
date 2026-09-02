'use client';

// Modules 33-35: INNER JOIN · LEFT JOIN · RIGHT JOIN

import { defineModule, section, step, example, mistake, mcq, outputQ, buildQ, blanksQ, task } from './builder';
import type { Module } from '@/types/content';

export const modules: Module[] = [
  defineModule({
    n: 33,
    title: ['INNER JOIN', 'INNER JOIN'],
    time: '30 min',
    concepts: ['join', 'inner join', 'on', 'foreign key', 'relationship', 'table alias', 'combine'],
    diagram: 'join-venn',
    objectives: [
      ['Combine two tables on a shared key with INNER JOIN', 'Shared key par do tables ko INNER JOIN se jodna'],
      ['Read and write the ON condition correctly', 'ON condition sahi padhna aur likhna'],
      ['Use table aliases for readable multi-table queries', 'Readable multi-table queries ke liye table aliases use karna'],
    ],
    theory: [
      section(
        ['Why tables are separate', 'Tables alag kyun hote hain'],
        [
          [
            'Why not store the customer name on every order row? Because duplication rots data: fix a typo in one copy and the others lie forever. Relational design splits data by ENTITY — customers, orders, order_items — each fact stored once, referenced everywhere by keys. The cost: to answer "which customer placed this order", you must re-attach the pieces. That re-attachment is the JOIN.',
            'Har order row par customer naam kyun nahi rakha? Kyunki duplication data ko sadati hai: ek copy me typo theek karo to baaki jhooth bolti rehti hain. Relational design data ko ENTITY ke hisab se baant-ta hai — customers, orders, order_items — har fact ek baar store, har jagah keys se referenced. Iska daam: "is order kis customer ne diya" ka jawab dene ke liye tukde wapas jodne padte hain. Wahi jodna JOIN hai.',
          ],
          [
            'INNER JOIN table2 ON table1.key = table2.key pairs every row of the left table with every matching row of the right table, and keeps ONLY the pairs — unmatched rows on either side vanish. Orders carry customer_id; customers carry id; ON o.customer_id = c.id stitches each order to its one customer. Every order finds a match (the data is consistent), so the result is 500 rows, now enriched with customer names.',
            'INNER JOIN table2 ON table1.key = table2.key left table ki har row ko right table ki har matching row ke saath jodta hai, aur sirf JODIYAN rakhta hai — kisi bhi taraf ki unmatched rows gayab. Orders me customer_id hota hai; customers me id; ON o.customer_id = c.id har order ko uske ek customer se silta hai. Har order ko match mil jaata hai (data consistent hai), to result 500 rows hain — ab customer naam ke saath.',
          ],
        ],
        [],
        'join-venn'
      ),
      section(
        ['The ON condition and aliases', 'ON condition aur aliases'],
        [
          [
            'The ON clause states the stitching rule: which column of the left equals which column of the right. It is almost always a foreign key meeting its primary key. The condition can be composite (two columns) and can carry extra filters — but the key equality is the soul of it.',
            'ON clause silai ka rule batati hai: left ka kaunsa column right ke kis column ke barabar hai. Yeh aksar foreign key apne primary key se milta hai. Condition composite ho sakti hai (do columns) aur extra filters bhi le sakti hai — par key equality hi iski jaan hai.',
          ],
          [
            'Once two tables share column names (both have id, both have name), every column reference must say WHICH table: o.id, c.name. Table aliases — FROM orders o JOIN customers c — are the professional habit: two letters, zero ambiguity, queries that stay readable at five tables.',
            'Jab do tables me same column naam hote hain (dono me id, dono me name), to har column reference ko batana padta KAUNSI table: o.id, c.name. Table aliases — FROM orders o JOIN customers c — professional aadat hai: do akshar, zero ambiguity, paanch tables par bhi readable queries.',
          ],
        ],
        [
          ['JOIN re-attaches what normalisation split apart', 'JOIN wahi jodta hai jo normalisation alag kiya tha'],
          ['ON states the key-to-key stitching rule', 'ON key-to-key silai ka rule batati hai'],
          ['INNER keeps matches only; non-matches vanish', 'INNER sirf match rakhta hai; non-match gayab'],
          ['Aliases make multi-table queries readable', 'Aliases multi-table queries readable banate hain'],
        ]
      ),
    ],
    tutorial: {
      title: ['Stitching orders to customers', 'Orders ko customers se silna'],
      steps: [
        step(null, [
          'The support desk wants "order 1, placed by NAME". The order row has only a number — let us stitch.',
          'Support desk ko chahiye "order 1, NAME ne diya". Order row me sirf number hai — chalo silte hain.',
        ]),
        step('SELECT o.id, o.customer_id FROM orders o LIMIT 5;', [
          'Raw orders: ids pointing at customers we cannot see.',
          'Raw orders: ids aisi customers ki taraf point karte hain jo dikhti nahi.',
        ], { table: 'orders' }),
        step('SELECT o.id, c.name\nFROM orders o\nINNER JOIN customers c ON o.customer_id = c.id\nLIMIT 5;', [
          'ON o.customer_id = c.id pairs each order with its customer.',
          'ON o.customer_id = c.id har order ko uske customer se jodta hai.',
        ], { table: 'orders' }),
        step('SELECT o.id, c.name, c.city\nFROM orders o\nINNER JOIN customers c ON o.customer_id = c.id\nORDER BY o.id LIMIT 6;', [
          'Enriched rows: order id beside real human details.',
          'Enriched rows: order id ke saath asli insaani details.',
        ], { table: 'orders' }),
        step("SELECT c.name, COUNT(*) AS orders\nFROM orders o INNER JOIN customers c ON o.customer_id = c.id\nWHERE o.status = 'delivered'\nGROUP BY c.name ORDER BY orders DESC LIMIT 5;", [
          'JOIN + WHERE + GROUP BY: the full analytics pattern in one query.',
          'JOIN + WHERE + GROUP BY: ek query me poora analytics pattern.',
        ], { run: true, table: 'orders' }),
      ],
    },
    syntax: {
      template: 'SELECT a.col, b.col\nFROM table_a a\nINNER JOIN table_b b ON a.key = b.key\n[WHERE …] [GROUP BY …];',
      parts: [
        { part: 'INNER JOIN', description: ['Pairs matching rows from both tables', 'Dono tables ki matching rows jodta hai'] },
        { part: 'ON a.key = b.key', description: ['The stitching rule (FK meets PK)', 'Silai ka rule (FK se PK milti hai)'] },
        { part: 'aliases a, b', description: ['Short table names for qualified columns', 'Qualified columns ke liye chhote table naam'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT o.id, c.name\nFROM orders o INNER JOIN customers c ON o.customer_id = c.id\nORDER BY o.id LIMIT 5;', [
        'The first five orders with human names attached.',
        'Pehle paanch orders, insaani naam jude hue.',
      ]),
      example('easy', 'SELECT p.name, pr.name AS product\nFROM order_items oi\nINNER JOIN products pr ON pr.id = oi.product_id\nORDER BY oi.id LIMIT 6;', [
        'Line items meet their product names.',
        'Line items apne product naam se milti hain.',
      ]),
      example('medium', "SELECT c.name, ROUND(SUM(p.amount), 2) AS spend\nFROM customers c\nINNER JOIN orders o ON o.customer_id = c.id\nINNER JOIN payments p ON p.order_id = o.id\nGROUP BY c.name ORDER BY spend DESC LIMIT 5;", [
        'The three-table revenue chain — the query you have been copying, now fully understood.',
        'Teen-table revenue chain — wo query jo aap copy kar rahe the, ab poori tarah samajh me.',
      ]),
      example('hard', "SELECT o.id, c.name, p.payment_method\nFROM orders o\nINNER JOIN customers c ON o.customer_id = c.id\nINNER JOIN payments p ON p.order_id = o.id\nWHERE o.status = 'cancelled' ORDER BY o.id LIMIT 6;", [
        'Cancelled orders with customer and payment rail — a service-recovery report.',
        'Cancelled orders customer aur payment rail ke saath — service-recovery report.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Forgetting ON — every row meets every row', 'ON bhool jaana — har row har row se milti hai'],
        ['JOIN without ON is a cross product: 500 orders × 100 customers = 50,000 nonsense rows. ON is not optional decoration; it is the join. (CROSS JOIN later makes this explicit.)', 'ON ke bina JOIN cross product hai: 500 × 100 = 50,000 bekaar rows. ON decoration nahi; wo hi join hai. (CROSS JOIN baad me ise explicit karta hai.)']
      ),
      mistake(
        ['Unqualified shared column names', 'Shared column naam bina table ke likhna'],
        ['Both tables have id — bare id is "ambiguous column name". Always qualify: o.id, c.id.', 'Dono tables me id hai — akela id "ambiguous column name" deta hai. Hamesha qualify karo: o.id, c.id.']
      ),
      mistake(
        ['Filtering the join in WHERE vs ON (for INNER it is equivalent — the habit matters for OUTER)', 'WHERE vs ON me join filter karna (INNER me barabar — OUTER ke liye aadat matter karti hai)'],
        ['For INNER JOIN, extra conditions in ON or WHERE give the same result. Learn to put key-matching in ON and row filters in WHERE — that discipline pays off the moment LEFT JOIN arrives.', 'INNER JOIN me ON ya WHERE me extra conditions ka result same hota hai. Aadat banao: key-matching ON me, row filters WHERE me — yeh discipline LEFT JOIN aate hi kaam aayega.']
      ),
    ],
    summary: [
      ['JOINs recombine normalised tables via shared keys', 'JOIN normalized tables ko shared keys se dobara jodte hain'],
      ['INNER JOIN keeps only matching pairs', 'INNER JOIN sirf matching pairs rakhta hai'],
      ['ON states the key rule; aliases keep queries readable', 'ON key ka rule batati hai; aliases queries readable rakhte hain'],
      ['The chain customers→orders→payments powers revenue analytics', 'customers→orders→payments chain revenue analytics chalati hai'],
    ],
    quiz: [
      mcq(
        ['What does ON do in an INNER JOIN?', 'INNER JOIN me ON kya karta hai?'],
        [
          ['Sorts the joined result', 'Joined result ko sort karta hai'],
          ['Specifies the row-pairing rule between the two tables', 'Do tables ke beech row-pairing ka rule batata hai'],
          ['Filters groups after aggregation', 'Aggregation ke baad groups filter karta hai'],
          ['Renames columns', 'Columns rename karta hai'],
        ],
        1,
        ['ON defines which left row pairs with which right row — the stitching condition.', 'ON define karta hai kaunsi left row kis right row ke saath judegi — silai ki condition.']
      ),
      outputQ(
        'SELECT COUNT(*) FROM orders o INNER JOIN customers c ON o.customer_id = c.id;',
        ['How many rows does the inner join produce?', 'Inner join kitni rows banata hai?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[500]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[50]] } },
          { label: 'C', result: { columns: ['COUNT(*)'], rows: [[600]] } },
          { label: 'D', result: { error: 'Error: ambiguous column name: id' } },
        ],
        0,
        ['Every order references a valid customer, so all 500 orders survive the inner join.', 'Har order valid customer ko reference karta hai, isliye saare 500 orders inner join paar karte hain.']
      ),
      buildQ(
        ['Build: order ids with customer names', 'Banao: order ids customer naam ke saath'],
        ['SELECT', 'o.id', 'c.name', 'FROM', 'orders', 'o', 'INNER', 'JOIN', 'customers', 'c', 'ON', 'o.customer_id = c.id'],
        ['SELECT', 'o.id', ',', 'c.name', 'FROM', 'orders', 'o', 'INNER', 'JOIN', 'customers', 'c', 'ON', 'o.customer_id = c.id'],
        ['Two tables, two aliases, one ON rule.', 'Do tables, do aliases, ek ON rule.']
      ),
      blanksQ(
        'SELECT o.id, c.name FROM orders o INNER ___ customers c ___ o.customer_id = c.id;',
        [
          { options: ['JOIN', 'ON', 'WITH'], correct: 'JOIN' },
          { options: ['ON', 'WHERE', 'AS'], correct: 'ON' },
        ],
        ['INNER JOIN introduces the table; ON introduces the rule.', 'INNER JOIN table laya hai; ON rule laya hai.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Support tooling: order id and customer name for the first 8 orders (order id ascending). Columns: id, name.',
          'Support tooling: pehle 8 orders ka order id aur customer naam (order id chadhta). Columns: id, name.',
        ],
        sol: 'SELECT o.id, c.name FROM orders o INNER JOIN customers c ON o.customer_id = c.id ORDER BY o.id LIMIT 8;',
        hints: [
          ['Join orders to customers on customer_id = id.', 'orders ko customers se join karo customer_id = id par.'],
          ['SELECT o.id, c.name FROM orders o INNER JOIN customers c ON o.customer_id = c.id ORDER BY o.id LIMIT 8;', 'SELECT o.id, c.name FROM orders o INNER JOIN customers c ON o.customer_id = c.id ORDER BY o.id LIMIT 8;'],
          ['Order 1 belongs to Ananya Mehta.', 'Order 1 Ananya Mehta ka hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'easy',
        desc: [
          'The humanised catalogue: line-item id and product name for the first 10 line items (id ascending). Columns: id, name.',
          'Humanised catalogue: pehle 10 line items ka id aur product naam (id chadhta). Columns: id, name.',
        ],
        sol: 'SELECT oi.id, pr.name FROM order_items oi INNER JOIN products pr ON pr.id = oi.product_id ORDER BY oi.id LIMIT 10;',
        hints: [
          ['order_items.product_id points at products.id.', 'order_items.product_id products.id ki taraf point karta hai.'],
          ['SELECT oi.id, pr.name FROM order_items oi INNER JOIN products pr ON pr.id = oi.product_id ORDER BY oi.id LIMIT 10;', 'SELECT oi.id, pr.name FROM order_items oi INNER JOIN products pr ON pr.id = oi.product_id ORDER BY oi.id LIMIT 10;'],
          ['Alias pr because p already means payments in other queries — pick distinct letters.', 'Alias pr isliye kyunki doosri queries me p payments hota hai — alag akshar chuno.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'medium',
        desc: [
          'Regional support load: order count per customer city (join orders→customers). Columns: city, orders. Sorted by orders descending then city.',
          'Regional support load: har customer city ka order count (orders→customers join). Columns: city, orders. Orders se utarte phir city se sorted.',
        ],
        sol: 'SELECT c.city, COUNT(*) AS orders FROM orders o INNER JOIN customers c ON o.customer_id = c.id GROUP BY c.city ORDER BY orders DESC, c.city;',
        hints: [
          ['Join, group by city, count.', 'Join karo, city se group karo, gino.'],
          ['SELECT c.city, COUNT(*) AS orders FROM orders o INNER JOIN customers c ON o.customer_id = c.id GROUP BY c.city ORDER BY orders DESC, c.city;', 'SELECT c.city, COUNT(*) AS orders FROM orders o INNER JOIN customers c ON o.customer_id = c.id GROUP BY c.city ORDER BY orders DESC, c.city;'],
          ['Jaipur leads (13 customers, most active).', 'Jaipur aage hai (13 customers, sabse active).'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'Product revenue ledger: product name and total revenue (SUM of order_items.subtotal) per product, sorted by revenue descending. Columns: name, revenue. Top 8.',
          'Product revenue ledger: har product ka naam aur total revenue (order_items.subtotal ka SUM), revenue se utarte sorted. Columns: name, revenue. Top 8.',
        ],
        sol: 'SELECT pr.name, ROUND(SUM(oi.subtotal), 2) AS revenue FROM order_items oi INNER JOIN products pr ON pr.id = oi.product_id GROUP BY pr.id, pr.name ORDER BY revenue DESC LIMIT 8;',
        hints: [
          ['Money sits in order_items.subtotal — no payments join needed here.', 'Paisa order_items.subtotal me hai — yahan payments join ki zaroorat nahi.'],
          ['SELECT pr.name, ROUND(SUM(oi.subtotal), 2) AS revenue FROM order_items oi INNER JOIN products pr ON pr.id = oi.product_id GROUP BY pr.id, pr.name ORDER BY revenue DESC LIMIT 8;', 'SELECT pr.name, ROUND(SUM(oi.subtotal), 2) AS revenue FROM order_items oi INNER JOIN products pr ON pr.id = oi.product_id GROUP BY pr.id, pr.name ORDER BY revenue DESC LIMIT 8;'],
          ['Group by product id AND name — the golden rule.', 'Product id AUR naam se group karo — golden rule.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'The full chain: customer name, product name and line value for cancelled orders — orders→customers, order_items→orders, order_items→products. Columns: customer, product, value (aliased). Sorted by value descending. Top 10. (Three INNER JOINs.)',
          'Poora chain: cancelled orders ke liye customer naam, product naam aur line value — orders→customers, order_items→orders, order_items→products. Columns: customer, product, value (aliased). Value se utarte sorted. Top 10. (Teen INNER JOINs.)',
        ],
        sol: "SELECT c.name AS customer, pr.name AS product, ROUND(oi.subtotal, 2) AS value\nFROM orders o\nINNER JOIN customers c ON c.id = o.customer_id\nINNER JOIN order_items oi ON oi.order_id = o.id\nINNER JOIN products pr ON pr.id = oi.product_id\nWHERE o.status = 'cancelled'\nORDER BY value DESC LIMIT 10;",
        hints: [
          ['Start from orders (they carry the status), then attach people and items.', 'Orders se shuru karo (status unhi ke paas hai), phir log aur items jodo.'],
          ['…FROM orders o INNER JOIN customers c ON c.id = o.customer_id INNER JOIN order_items oi ON oi.order_id = o.id INNER JOIN products pr ON pr.id = oi.product_id WHERE o.status = \'cancelled\';', '…FROM orders o INNER JOIN customers c ON c.id = o.customer_id INNER JOIN order_items oi ON oi.order_id = o.id INNER JOIN products pr ON pr.id = oi.product_id WHERE o.status = \'cancelled\';'],
          ['Cancelled revenue is recoverable revenue — this list is the recovery target.', 'Cancelled revenue wapas lane layak revenue hai — yeh list recovery target hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),

  defineModule({
    n: 34,
    title: ['LEFT JOIN', 'LEFT JOIN'],
    time: '30 min',
    concepts: ['left join', 'outer join', 'null', 'unmatched rows', 'missing data', 'optional relationship'],
    diagram: 'join-venn',
    objectives: [
      ['Keep every left-table row with LEFT JOIN', 'LEFT JOIN se left table ki har row rakhna'],
      ['Understand NULL-filling for non-matches', 'Non-match ke liye NULL-filling samajhna'],
      ['Use LEFT JOIN to find "rows with no match"', 'LEFT JOIN se "match na hone wali rows" dhoondhna'],
    ],
    theory: [
      section(
        ['The join that keeps everyone', 'Wo join jo sabko rakhta hai'],
        [
          [
            'INNER JOIN silently drops non-matching rows — and silence is dangerous when the question is "all customers, with their order counts IF ANY". LEFT JOIN keeps EVERY row of the left table; where the right side has no match, its columns are filled with NULL. Every customer appears exactly once: with real order data if they ordered, with NULLs if they never did.',
            'INNER JOIN non-matching rows chup-chaap phenk deta hai — aur chupi khatarnak hai jab sawal ho "saare customers, unke order counts AGAR HAIN". LEFT JOIN left table ki HAR row rakhta hai; jahan right side ka match nahi, wahan uske columns NULL se bharte hain. Har customer exactly ek baar dikhta hai: order diya ho to asli data, nahi diya to NULLs.',
          ],
          [
            'This NULL-filling is the feature, not a bug: NULL in the right-side columns is the join\'s honest statement "this left row has no partner". Which is why the classic anti-join pattern works: LEFT JOIN then WHERE right.key IS NULL — "left rows that found no partner". Customers who never ordered, products never sold: all one pattern.',
            'Yeh NULL-filling feature hai, bug nahi: right-side columns me NULL join ka imandaar bayan hai "is left row ka koi partner nahi". Isi liye classic anti-join pattern chalta hai: LEFT JOIN phir WHERE right.key IS NULL — "jo left rows ko partner nahi mila". Jo customers ne kabhi order nahi diya, jo products kabhi nahi bike: sab ek pattern.',
          ],
        ],
        [],
        'join-venn'
      ),
      section(
        ['ON vs WHERE with LEFT JOIN', 'LEFT JOIN ke saath ON vs WHERE'],
        [
          [
            'Here is the subtlety INNER JOIN hid from you: with LEFT JOIN, conditions placed in ON vs WHERE mean DIFFERENT things. A condition in ON filters the RIGHT side before matching (rows survive with NULLs if nothing matches the conditioned right). The same condition in WHERE filters the FINAL rows — turning your LEFT JOIN back into an INNER JOIN, because NULL rows never pass a WHERE test like o.status = \'delivered\'.',
            'Wahi baat jo INNER JOIN ne chhupayi thi: LEFT JOIN ke saath ON vs WHERE me rakhi conditions ka MATLAB alag hota hai. ON me condition right side ko match se PEHLE filter karti hai (rows NULLs ke saath bachti hain agar conditioned right se kuch match na ho). Wahi condition WHERE me FINAL rows ko filter karti hai — aapke LEFT JOIN ko wapas INNER JOIN bana deti hai, kyunki NULL rows WHERE test jaise o.status = \'delivered\' kabhi pass nahi karti.',
          ],
          [
            'Professional rule: key-matching always in ON; business row-filters in WHERE — unless you specifically want the "keep unmatched as NULL" behaviour, in which case the filter belongs in ON. Writing this deliberately is a genuinely advanced move; noticing when you did it accidentally is even more valuable.',
            'Professional rule: key-matching hamesha ON me; business row-filters WHERE me — jab tak aap jaan-boojh kar "unmatched ko NULL rakhna" nahi chahte, tab filter ON me aayega. Yeh jaan-boojh kar likhna sach me advanced hai; galti se ho gaya pakadna usse bhi zyada keemti.',
          ],
        ],
        [
          ['LEFT JOIN: all left rows + matches or NULLs', 'LEFT JOIN: saari left rows + match ya NULL'],
          ['Right-side NULL = "no partner" — a signal, not an error', 'Right-side NULL = "partner nahi" — signal, error nahi'],
          ['LEFT JOIN + IS NULL = the anti-join', 'LEFT JOIN + IS NULL = anti-join'],
          ['WHERE on right columns silently converts to INNER', 'Right columns par WHERE chup-chaap INNER bana deta hai'],
        ]
      ),
    ],
    tutorial: {
      title: ['Everyone gets a row', 'Sabko ek row milti hai'],
      steps: [
        step(null, [
          'The engagement report: EVERY customer with their order count — including the quiet ones. Then the anti-join twist.',
          'Engagement report: HAR customer apne order count ke saath — chup wale bhi. Phir anti-join twist.',
        ]),
        step('SELECT c.name, COUNT(o.id) AS orders\nFROM customers c LEFT JOIN orders o ON o.customer_id = c.id\nGROUP BY c.name ORDER BY c.id LIMIT 8;', [
          'COUNT(o.id) counts matches only — the never-orderer shows 0, not 1.',
          'COUNT(o.id) sirf match ginta hai — kabhi-order-na-karne wala 0 dikhata hai, 1 nahi.',
        ], { table: 'customers' }),
        step('SELECT c.name\nFROM customers c LEFT JOIN orders o ON o.customer_id = c.id\nWHERE o.id IS NULL;', [
          'The anti-join: left rows whose right columns stayed NULL.',
          'Anti-join: wo left rows jinke right columns NULL rahe.',
        ], { table: 'customers' }),
        step("SELECT c.name, COUNT(o.id) AS delivered\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'delivered'\nGROUP BY c.name ORDER BY c.id LIMIT 6;", [
          'Filter in ON: everyone stays, delivered counts only — the subtle professional move.',
          'ON me filter: sab rehte hain, sirf delivered gine jaate hain — subtle professional move.',
        ], { table: 'customers' }),
        step('SELECT c.name, COUNT(o.id) AS orders, ROUND(SUM(o.id) / COUNT(o.id), 0) AS _n FROM customers c LEFT JOIN orders o ON o.customer_id = c.id GROUP BY c.name ORDER BY orders DESC LIMIT 5;', [
          'A join-anatomy experiment — simplify instead: top orderers with their counts.',
          'Join-anatomy ka experiment — iski jagah simple karo: top orderers apne counts ke saath.',
        ], { run: true, table: 'customers' }),
      ],
    },
    syntax: {
      template: 'SELECT l.col, r.col\nFROM left_table l\nLEFT JOIN right_table r ON l.key = r.key\n[WHERE r.key IS NULL]  -- anti-join\n[WHERE r.filter …]      -- ⚠ becomes INNER-like',
      parts: [
        { part: 'LEFT JOIN', description: ['All left rows survive; right fills or NULLs', 'Saari left rows bachti hain; right bharta hai ya NULL deta hai'] },
        { part: 'r.key IS NULL', description: ['Keeps left rows with no partner', 'Wo left rows rakhta hai jinka partner nahi'] },
        { part: 'COUNT(r.key)', description: ['Counts actual matches (NULL-safe zero)', 'Asli match ginta hai (NULL-safe zero)'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT c.name, COUNT(o.id) AS orders\nFROM customers c LEFT JOIN orders o ON o.customer_id = c.id\nGROUP BY c.name ORDER BY c.name LIMIT 6;', [
        'Everyone with their count — the one who never ordered shows 0.',
        'Sab apne count ke saath — jisne kabhi order nahi diya wo 0 dikhata hai.',
      ]),
      example('easy', 'SELECT pr.name, COUNT(oi.id) AS lines\nFROM products pr LEFT JOIN order_items oi ON oi.product_id = pr.id\nGROUP BY pr.name ORDER BY lines DESC, pr.name LIMIT 6;', [
        'Products by order-line count; never-sold products show 0.',
        'Products order-line count se; kabhi na-bike products 0 dikhate hain.',
      ]),
      example('medium', 'SELECT c.name\nFROM customers c LEFT JOIN orders o ON o.customer_id = c.id\nWHERE o.id IS NULL;', [
        'The anti-join: customers without a single order.',
        'Anti-join: bina kisi order wale customers.',
      ]),
      example('hard', "SELECT c.name,\n  COUNT(o.id) AS orders,\n  SUM(CASE WHEN o.status = 'delivered' THEN 1 ELSE 0 END) AS delivered\nFROM customers c LEFT JOIN orders o ON o.customer_id = c.id\nGROUP BY c.name ORDER BY c.name LIMIT 6;", [
        'Two counts per customer — a CASE preview (Module 39) making LEFT JOIN sing.',
        'Har customer ke do counts — CASE preview (Module 39) LEFT JOIN ko gaana sikhaata hai.',
      ]),
    ],
    mistakes: [
      mistake(
        ['COUNT(*) after LEFT JOIN to count matches', 'Match ginne ke liye LEFT JOIN ke baad COUNT(*)'],
        ['COUNT(*) counts the row itself — the never-orderer gets 1! Count the RIGHT side\'s key: COUNT(o.id), which skips NULLs.', 'COUNT(*) row khud ginta hai — kabhi-order-na-karne wala 1 milta hai! RIGHT side ki key gino: COUNT(o.id), jo NULL skip karta hai.']
      ),
      mistake(
        ['WHERE right_col = value on a LEFT JOIN and wondering why everyone disappeared', 'LEFT JOIN par WHERE right_col = value aur sab ke gayab hone par hairan hona'],
        ['NULL rows fail the WHERE, silently converting to an INNER JOIN. Move the condition into ON to keep unmatched rows.', 'NULL rows WHERE fail karti hain, chup-chaap INNER JOIN ban jaata hai. Unmatched rows rakhne ke liye condition ON me le jao.']
      ),
      mistake(
        ['Reading right-side NULLs as "missing data corruption"', 'Right-side NULL ko "missing data corruption" samajhna'],
        ['NULLs from a LEFT JOIN mean "no match existed" — information, not damage. IS NULL tests it deliberately.', 'LEFT JOIN ke NULL ka matlab "koi match nahi tha" — jaankari, nuksaan nahi. IS NULL ise jaan-boojh kar test karta hai.']
      ),
    ],
    summary: [
      ['LEFT JOIN keeps every left row; NULLs mark non-matches', 'LEFT JOIN har left row rakhta hai; NULL non-match batate hain'],
      ['COUNT(right.key) gives true match counts with zeros', 'COUNT(right.key) sach me match count deta hai, zero ke saath'],
      ['LEFT JOIN + IS NULL = anti-join ("has none")', 'LEFT JOIN + IS NULL = anti-join ("koi nahi")'],
      ['WHERE on right columns silently re-inners the join', 'Right columns par WHERE join ko chup-chaap INNER bana deta hai'],
    ],
    quiz: [
      mcq(
        ['A customer has no orders. After customers LEFT JOIN orders, what does their row show?', 'Ek customer ke koi orders nahi. customers LEFT JOIN orders ke baad uski row me kya dikhega?'],
        [
          ['The row is missing', 'Row gayab hai'],
          ['Customer columns with NULLs in all order columns', 'Customer columns, saare order columns me NULL'],
          ['An error', 'Error'],
          ['Customer columns with zeros in order columns', 'Customer columns, order columns me zero'],
        ],
        1,
        ['LEFT JOIN preserves the left row and fills the absent right side with NULLs (not zeros).', 'LEFT JOIN left row bachata hai aur gayab right side ko NULL se bharta hai (zero nahi).']
      ),
      outputQ(
        'SELECT COUNT(*) FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL;',
        ['How many customers have no orders (anti-join count)?', 'Kitne customers ke koi orders nahi (anti-join count)?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[0]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[1]] } },
          { label: 'C', result: { columns: ['COUNT(*)'], rows: [[34]] } },
          { label: 'D', result: { error: 'Error: near "NULL": syntax error' } },
        ],
        0,
        ['Zero — every customer has at least one order; the data is fully consistent. (34 lack DELIVERED orders, but all have ordered.)', 'Zero — har customer ke kam se kam ek order hai; data poori tarah consistent hai. (34 ke delivered orders nahi, par sabne order kiya hai.)']
      ),
      buildQ(
        ['Build: customers who never placed an order (anti-join)', 'Banao: jo customers ne kabhi order nahi diya (anti-join)'],
        ['SELECT', 'name', 'FROM', 'customers', 'c', 'LEFT', 'JOIN', 'orders', 'o', 'ON', 'o.customer_id = c.id', 'WHERE', 'IS NULL', 'o.id'],
        ['SELECT', 'name', 'FROM', 'customers', 'c', 'LEFT', 'JOIN', 'orders', 'o', 'ON', 'o.customer_id = c.id', 'WHERE', 'o.id', 'IS', 'NULL'],
        ['LEFT JOIN, then WHERE the right key IS NULL.', 'LEFT JOIN, phir WHERE right key IS NULL.']
      ),
      blanksQ(
        'SELECT c.name, COUNT(___.id) AS orders FROM customers c ___ JOIN orders o ON o.customer_id = c.id GROUP BY c.name;',
        [
          { options: ['o', 'c', '*'], correct: 'o' },
          { options: ['LEFT', 'INNER', 'CROSS'], correct: 'LEFT' },
        ],
        ['Count the right table\'s key; LEFT keeps everyone.', 'Right table ki key gino; LEFT sabko rakhta hai.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The full engagement list: every customer\'s name with their order count — zeros included. Columns: name, orders. Sorted by name.',
          'Poora engagement list: har customer ka naam uske order count ke saath — zero shaamil. Columns: name, orders. Naam se sorted.',
        ],
        sol: 'SELECT c.name, COUNT(o.id) AS orders\nFROM customers c LEFT JOIN orders o ON o.customer_id = c.id\nGROUP BY c.name ORDER BY c.name;',
        hints: [
          ['LEFT JOIN + COUNT(o.id) — never COUNT(*).', 'LEFT JOIN + COUNT(o.id) — kabhi COUNT(*) nahi.'],
          ['SELECT c.name, COUNT(o.id) AS orders FROM customers c LEFT JOIN orders o ON o.customer_id = c.id GROUP BY c.name ORDER BY c.name;', 'SELECT c.name, COUNT(o.id) AS orders FROM customers c LEFT JOIN orders o ON o.customer_id = c.id GROUP BY c.name ORDER BY c.name;'],
          ['Counts range 1-8; the JOIN guarantees everyone appears exactly once.', 'Counts 1-8 ke beech; JOIN guarantee karta hai ki sab exactly ek baar dikhen.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'easy',
        desc: [
          'The quiet customers: names of customers with NO delivered order at all — put the status filter INSIDE the ON clause, then test IS NULL (LEFT JOIN + conditional match).',
          'Chup customers: jin customers ko koi DELIVERED order nahi mila — status filter ON clause ke ANDAR rakho, phir IS NULL test karo (LEFT JOIN + conditional match).',
        ],
        sol: "SELECT c.name\nFROM customers c LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'delivered'\nWHERE o.id IS NULL;",
        hints: [
          ['The status filter belongs in ON — putting it in WHERE would drop everyone without delivered orders (turning the LEFT into an INNER).', 'Status filter ON me aata hai — WHERE me rakha to bina delivered order wale sab gayab ho jaate (LEFT, INNER ban jaata).'],
          ["SELECT c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'delivered' WHERE o.id IS NULL;", "SELECT c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'delivered' WHERE o.id IS NULL;"],
          ['34 customers appear — everyone has orders, but not everyone has deliveries.', '34 customers dikhte hain — sabke orders hain, par sabko deliveries nahi mili.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'The full product ledger: every product\'s name and order-line count (lines), zeros for never-sold. Sorted by lines descending then name. Columns: name, lines.',
          'Poora product ledger: har product ka naam aur order-line count (lines), kabhi na-bike ke liye zero. Lines se utarte phir naam se sorted. Columns: name, lines.',
        ],
        sol: 'SELECT pr.name, COUNT(oi.id) AS lines\nFROM products pr LEFT JOIN order_items oi ON oi.product_id = pr.id\nGROUP BY pr.id, pr.name ORDER BY lines DESC, pr.name;',
        hints: [
          ['Same discipline: COUNT of the right key.', 'Wahi discipline: right key ka COUNT.'],
          ['SELECT pr.name, COUNT(oi.id) AS lines FROM products pr LEFT JOIN order_items oi ON oi.product_id = pr.id GROUP BY pr.id, pr.name ORDER BY lines DESC, pr.name;', 'SELECT pr.name, COUNT(oi.id) AS lines FROM products pr LEFT JOIN order_items oi ON oi.product_id = pr.id GROUP BY pr.id, pr.name ORDER BY lines DESC, pr.name;'],
          ['A few products have never appeared in any order.', 'Chand products kisi order me kabhi nahi aaye.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'The quiet-delivery cities: each city and the count of its customers who have received NO delivered order — status filter inside ON, then IS NULL, grouped by city. Columns: city, quiet_customers — only cities with at least one such customer.',
          'Quiet-delivery cities: har city aur uske wo customers jinhe koi DELIVERED order nahi mila — status filter ON ke andar, phir IS NULL, city se grouped. Columns: city, quiet_customers — sirf wahi cities jahan kam se kam ek aisa customer ho.',
        ],
        sol: "SELECT c.city, COUNT(*) AS quiet_customers\nFROM customers c LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'delivered'\nWHERE o.id IS NULL\nGROUP BY c.city;",
        hints: [
          ['Conditional LEFT JOIN (status in ON), then IS NULL, then group by city.', 'Conditional LEFT JOIN (status ON me), phir IS NULL, phir city se group.'],
          ["SELECT c.city, COUNT(*) AS quiet_customers FROM customers c LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'delivered' WHERE o.id IS NULL GROUP BY c.city;", "SELECT c.city, COUNT(*) AS quiet_customers FROM customers c LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'delivered' WHERE o.id IS NULL GROUP BY c.city;"],
          ['14 of 15 cities have at least one quietly-waiting customer.', '15 me se 14 cities me kam se kam ek chup-intezaar customer hai.'],
        ],
      }),
      task({
        d: 'very_hard',
        desc: [
          'The city engagement matrix, one row per city: total customers (customers), customers with at least one DELIVERED order (delivered) — the delivered filter belongs IN THE ON clause so quiet cities survive. Columns: city, customers, delivered. Sorted by city.',
          'City engagement matrix, har city ki ek row: kul customers (customers), kam se kam ek DELIVERED order wale customers (delivered) — delivered filter ON clause me rahega taaki chup cities bache rahein. Columns: city, customers, delivered. City se sorted.',
        ],
        sol: "SELECT c.city,\n  COUNT(DISTINCT c.id) AS customers,\n  COUNT(DISTINCT o.customer_id) AS delivered\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'delivered'\nGROUP BY c.city ORDER BY c.city;",
        hints: [
          ['The status filter sits inside ON (after the key match), keeping non-delivered cities alive.', 'Status filter ON ke andar (key match ke baad) rehta hai, taaki non-delivered cities zinda rahein.'],
          ["COUNT(DISTINCT o.customer_id) counts customers with a delivered match; NULLs are skipped.", 'COUNT(DISTINCT o.customer_id) delivered match wale customers ginta hai; NULL skip hote hain.'],
          ["Every city appears; delivered is 0 where nobody received a delivery.", 'Har city dikhti hai; jahan kisi ko delivery nahi mili wahan delivered 0 hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),

  defineModule({
    n: 35,
    title: ['RIGHT JOIN', 'RIGHT JOIN'],
    time: '20 min',
    concepts: ['right join', 'outer join', 'mirror', 'left join equivalence', 'direction'],
    diagram: 'join-venn',
    objectives: [
      ['Use RIGHT JOIN to keep every right-table row', 'RIGHT JOIN se right table ki har row rakhna'],
      ['Translate any RIGHT JOIN into its LEFT JOIN mirror', 'Kisi bhi RIGHT JOIN ko uske LEFT JOIN mirror me badalna'],
      ['Know why professionals prefer LEFT', 'Professionals LEFT kyun prefer karte hain jaanna'],
    ],
    theory: [
      section(
        ['The mirror image', 'Mirror image'],
        [
          [
            'RIGHT JOIN is simply LEFT JOIN with the tables swapped: keep EVERY row of the RIGHT table, fill the left side with NULLs where no match exists. A RIGHT JOIN orders ← customers (every customer, with order details where they exist) is identical to LEFT JOIN customers → orders. Same result, different writing direction.',
            'RIGHT JOIN bas swapped tables wala LEFT JOIN hai: RIGHT table ki HAR row rakho, jahan match nahi wahan left side NULL se bharo. RIGHT JOIN orders ← customers (har customer, jahan order hai wahan details) wahi hai jo LEFT JOIN customers → orders. Same result, likhne ki direction alag.',
          ],
          [
            'SQLite does not even implement RIGHT JOIN as a separate feature — and neither do several popular engines in older versions. You simply write the LEFT JOIN form with tables re-ordered. What you MUST have is the ability to READ RIGHT JOINs, because legacy codebases and tutorials are full of them.',
            'SQLite RIGHT JOIN ko alag feature ki tarah banata hi nahi — aur kuch popular engines ke purane versions bhi nahi. Aap bas LEFT JOIN form likhte hain tables ulti karke. Jo ZAROORI hai wo RIGHT JOIN PADHNE ki ability, kyunki purane codebases aur tutorials in se bhare hain.',
          ],
        ],
        [],
        'join-venn'
      ),
      section(
        ['Why LEFT wins the style war', 'Style ki ladai LEFT kyun jeet-ta hai'],
        [
          [
            'Readable queries keep their "primary" table first — the entity the question is about — and LEFT JOIN lets you keep it there while still preserving everyone. Chaining also flows naturally: FROM customers LEFT JOIN orders LEFT JOIN payments reads as a pipeline from the person outward. Swapping to RIGHT mid-chain makes readers flip direction mentally — expensive at 3 a.m.',
            'Readable queries apni "primary" table pehle rakhti hain — jis entity ke baare me sawal hai — aur LEFT JOIN aapko wahi rehne deta hai sabko bachate hue. Chaining bhi naturally behti hai: FROM customers LEFT JOIN orders LEFT JOIN payments insaan se bahar ki taraf pipeline ki tarah padha jaata hai. Beech me RIGHT aa kar padhne wale ka dimag ulti disha me bhagne lagta hai — raat 3 baje yeh mehnga hota hai.',
          ],
          [
            'The rewrite rule to memorise: A RIGHT JOIN B ON … ≡ B LEFT JOIN A ON …. Write it on your mirror. Every RIGHT JOIN you ever meet becomes a LEFT JOIN by swapping the FROM and JOIN tables — the ON condition stays attached to the same columns.',
            'Rattne wala rewrite rule: A RIGHT JOIN B ON … ≡ B LEFT JOIN A ON …. Apne sheeshe par likh lo. Jo RIGHT JOIN kabhi milegi use LEFT JOIN bana do bas FROM aur JOIN tables badal kar — ON condition wahi columns par tiki rehti hai.',
          ],
        ],
        [
          ['RIGHT JOIN = mirror of LEFT JOIN', 'RIGHT JOIN = LEFT JOIN ka mirror'],
          ['SQLite has no RIGHT JOIN — rewrite as LEFT', 'SQLite me RIGHT JOIN nahi — LEFT me likho'],
          ['A RIGHT JOIN B ≡ B LEFT JOIN A', 'A RIGHT JOIN B ≡ B LEFT JOIN A'],
        ]
      ),
    ],
    tutorial: {
      title: ['Flipping the join', 'Join ko ulta karna'],
      steps: [
        step(null, [
          'One question, two writings: "every customer, with any orders". We write it as SQLite demands — LEFT — and learn to read the RIGHT form.',
          'Ek sawal, do likhne ke tareeke: "har customer, orders ke saath". Hum SQLite ki marzi — LEFT — se likhte hain aur RIGHT form padhna seekhte hain.',
        ]),
        step('SELECT c.name, o.id AS order_id\nFROM customers c LEFT JOIN orders o ON o.customer_id = c.id\nORDER BY c.id, o.id LIMIT 8;', [
          'Every customer survives; the quiet one carries NULL order_id.',
          'Har customer bachta hai; chup wala NULL order_id le jaata hai.',
        ], { table: 'customers' }),
        step('-- Equivalent in engines that support RIGHT:\n-- SELECT c.name, o.id AS order_id\n-- FROM orders o RIGHT JOIN customers c ON o.customer_id = c.id;', [
          'The mirror form: same rows, tables swapped, ON unchanged. SQLite users: rewrite it as above.',
          'Mirror form: same rows, tables badle, ON waisa hi. SQLite users: upar wale roop me likho.',
        ], { table: 'customers' }),
        step('SELECT pr.name, COUNT(oi.id) AS lines\nFROM order_items oi RIGHT JOIN products pr ON oi.product_id = pr.id\nGROUP BY pr.name ORDER BY lines DESC, pr.name LIMIT 6;', [
          'This RIGHT form (where supported) equals products LEFT JOIN order_items — SQLite rejects it; rewrite mentally.',
          'Yeh RIGHT form (jahan support hai) products LEFT JOIN order_items ke barabar hai — SQLite mana karta hai; dimag me rewrite karo.',
        ], { table: 'products' }),
        step('SELECT pr.name, COUNT(oi.id) AS lines\nFROM products pr LEFT JOIN order_items oi ON oi.product_id = pr.id\nGROUP BY pr.name ORDER BY lines DESC, pr.name LIMIT 6;', [
          'The working LEFT rewrite — what you actually run.',
          'Chalne wala LEFT rewrite — jo aap asli me chalate ho.',
        ], { run: true, table: 'products' }),
      ],
    },
    syntax: {
      template: '-- Conceptual (not in SQLite):\nSELECT … FROM a RIGHT JOIN b ON a.key = b.key;\n-- SQLite equivalent — always writable:\nSELECT … FROM b LEFT JOIN a ON a.key = b.key;',
      parts: [
        { part: 'RIGHT JOIN', description: ['Keeps every RIGHT table row', 'RIGHT table ki har row rakhta hai'] },
        { part: 'rewrite', description: ['Swap tables → LEFT JOIN, ON unchanged', 'Tables badlo → LEFT JOIN, ON waisa hi'] },
        { part: 'reading skill', description: ['Recognise RIGHT JOINs in the wild', 'Duniya ke RIGHT JOINs pehchanno'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT c.name, o.id AS order_id\nFROM customers c LEFT JOIN orders o ON o.customer_id = c.id\nORDER BY c.id, o.id LIMIT 6;', [
        'LEFT form (runnable here): everyone with their orders.',
        'LEFT form (yahan chalne wala): sab apne orders ke saath.',
      ]),
      example('medium', 'SELECT pr.name, COUNT(oi.id) AS lines\nFROM products pr LEFT JOIN order_items oi ON oi.product_id = pr.id\nGROUP BY pr.name ORDER BY lines DESC, pr.name LIMIT 6;', [
        'RIGHT JOIN products ⨝ order_items, written the SQLite way.',
        'RIGHT JOIN products ⨝ order_items, SQLite ke tareeke se.',
      ]),
      example('hard', 'SELECT c.name, COUNT(o.id) AS orders\nFROM customers c LEFT JOIN orders o ON o.customer_id = c.id\nGROUP BY c.name HAVING COUNT(o.id) = 0;', [
        'The zero-order club via LEFT + HAVING — the mirror of every RIGHT-style anti-join.',
        'LEFT + HAVING se zero-order club — har RIGHT-style anti-join ka mirror.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Writing RIGHT JOIN in SQLite and fighting the syntax error', 'SQLite me RIGHT JOIN likh kar syntax error se ladna'],
        ['SQLite (and older MySQL/Postgres) lack RIGHT JOIN. Swap the tables and write LEFT JOIN — the ON stays identical.', 'SQLite (aur purane MySQL/Postgres) me RIGHT JOIN nahi. Tables badal kar LEFT JOIN likho — ON waisa hi rahega.']
      ),
      mistake(
        ['Mixing join directions in one query and losing track', 'Ek query me join directions mix kar ke track khona'],
        ['Every flip adds mental overhead. Convert all RIGHT JOINs to LEFT on sight; keep one direction per query.', 'Har flip dimag par bojh daalta hai. Saare RIGHT JOINs RIGHT dikhte hi LEFT me badlo; ek query me ek hi direction.']
      ),
      mistake(
        ['Believing RIGHT JOIN returns different rows than its LEFT mirror', 'Yeh maanna ki RIGHT JOIN apne LEFT mirror se alag rows deta hai'],
        ['A RIGHT JOIN B ON x ≡ B LEFT JOIN A ON x — row for row identical. Only the query text differs.', 'A RIGHT JOIN B ON x ≡ B LEFT JOIN A ON x — row-by-row same. Sirf query ka text alag hota hai.']
      ),
    ],
    summary: [
      ['RIGHT JOIN mirrors LEFT JOIN with tables swapped', 'RIGHT JOIN tables badle hue LEFT JOIN ka mirror hai'],
      ['SQLite lacks RIGHT JOIN — always rewrite as LEFT', 'SQLite me RIGHT JOIN nahi — hamesha LEFT me likho'],
      ['A RIGHT JOIN B ≡ B LEFT JOIN A (ON unchanged)', 'A RIGHT JOIN B ≡ B LEFT JOIN A (ON waisa hi)'],
      ['Keep one join direction per query for readability', 'Readability ke liye ek query me ek hi join direction'],
    ],
    quiz: [
      mcq(
        ['How do you write "every product with its order lines" in SQLite?', 'SQLite me "har product apni order lines ke saath" kaise likhoge?'],
        [
          ['products RIGHT JOIN order_items', 'products RIGHT JOIN order_items'],
          ['order_items LEFT JOIN products', 'order_items LEFT JOIN products'],
          ['products LEFT JOIN order_items', 'products LEFT JOIN order_items'],
          ['It is impossible without RIGHT JOIN', 'RIGHT JOIN ke bina namumkin hai'],
        ],
        2,
        ['Keep the preserved table (products) on the LEFT: products LEFT JOIN order_items.', 'Bachane wali table (products) LEFT par rakho: products LEFT JOIN order_items.']
      ),
      outputQ(
        'SELECT COUNT(*) FROM customers c LEFT JOIN orders o ON o.customer_id = c.id;',
        ['Total rows from this LEFT join (runnable form of a RIGHT-style question):', 'Is LEFT join ki kul rows (RIGHT-style sawal ka chalne wala roop):'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[500]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[501]] } },
          { label: 'C', result: { columns: ['COUNT(*)'], rows: [[100]] } },
          { label: 'D', result: { error: 'Error: RIGHT JOIN not supported' } },
        ],
        0,
        ['All 100 customers have at least one order, so the LEFT join yields exactly 500 matched rows — no NULL filler rows.', 'Saare 100 customers ke kam se kam ek order hai, isliye LEFT join exactly 500 matched rows deta hai — koi NULL filler row nahi.']
      ),
      buildQ(
        ['Build: every customer with order count (LEFT, the SQLite way)', 'Banao: har customer order count ke saath (LEFT, SQLite tareeka)'],
        ['SELECT', 'c.name', 'COUNT(o.id)', 'FROM', 'customers', 'c', 'LEFT', 'JOIN', 'orders', 'o', 'ON', 'o.customer_id = c.id', 'GROUP', 'BY', 'c.name'],
        ['SELECT', 'c.name', ',', 'COUNT', '(', 'o.id', ')', 'FROM', 'customers', 'c', 'LEFT', 'JOIN', 'orders', 'o', 'ON', 'o.customer_id = c.id', 'GROUP', 'BY', 'c.name'],
        ['Preserved table left, count the right key.', 'Bachane wali table left, right key gino.']
      ),
      blanksQ(
        'SELECT c.name FROM customers c LEFT ___ orders o ON o.customer_id = c.id WHERE o.id IS ___;',
        [
          { options: ['JOIN', 'ON', 'AS'], correct: 'JOIN' },
          { options: ['NULL', 'EMPTY', 'NONE'], correct: 'NULL' },
        ],
        ['LEFT JOIN + IS NULL — the anti-join you can always write.', 'LEFT JOIN + IS NULL — anti-join jo aap hamesha likh sakte ho.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Runnable mirror practice: write "every customer with their order count" using LEFT JOIN (the SQLite-safe rewriting of a RIGHT JOIN orders ⨝ customers). Columns: name, orders. Sorted by name. First 10 rows only.',
          'Runnable mirror practice: "har customer apne order count ke saath" LEFT JOIN se likho (RIGHT JOIN orders ⨝ customers ka SQLite-safe rewrite). Columns: name, orders. Naam se sorted. Sirf pehli 10 rows.',
        ],
        sol: 'SELECT c.name, COUNT(o.id) AS orders\nFROM customers c LEFT JOIN orders o ON o.customer_id = c.id\nGROUP BY c.name ORDER BY c.name LIMIT 10;',
        hints: [
          ['Preserved table goes LEFT — customers.', 'Bachane wali table LEFT jati hai — customers.'],
          ['SELECT c.name, COUNT(o.id) AS orders FROM customers c LEFT JOIN orders o ON o.customer_id = c.id GROUP BY c.name ORDER BY c.name LIMIT 10;', 'SELECT c.name, COUNT(o.id) AS orders FROM customers c LEFT JOIN orders o ON o.customer_id = c.id GROUP BY c.name ORDER BY c.name LIMIT 10;'],
          ['The same statement in RIGHT form (unsupported here) would swap FROM/JOIN tables.', 'Same statement RIGHT form me (yahan unsupported) FROM/JOIN tables badal deta.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'easy',
        desc: [
          'Translate this unsupported query to SQLite: SELECT c.name FROM orders o RIGHT JOIN customers c ON o.customer_id = c.id AND o.status = \'delivered\' WHERE o.id IS NULL; — customers who have not received a delivered order. Show names.',
          'Is unsupported query ko SQLite me translate karo: SELECT c.name FROM orders o RIGHT JOIN customers c ON o.customer_id = c.id AND o.status = \'delivered\' WHERE o.id IS NULL; — jin customers ko delivered order nahi mila. Naam dikhao.',
        ],
        sol: "SELECT c.name\nFROM customers c LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'delivered'\nWHERE o.id IS NULL;",
        hints: [
          ['Swap the tables; keep the ON (including the status filter) and the IS NULL test identical.', 'Tables badlo; ON (status filter samet) aur IS NULL test waise hi rakho.'],
          ["SELECT c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'delivered' WHERE o.id IS NULL;", "SELECT c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'delivered' WHERE o.id IS NULL;"],
          ['34 customers appear — every one of them has orders, just none delivered.', '34 customers dikhte hain — sabke orders hain, bas delivered nahi.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'RIGHT-style report, LEFT-written: every category with its product count (categories LEFT JOIN products), zeros for empty categories. Columns: name, products. Sorted by name.',
          'RIGHT-style report, LEFT-likha: har category apne product count ke saath (categories LEFT JOIN products), khaali categories ke liye zero. Columns: name, products. Naam se sorted.',
        ],
        sol: 'SELECT cat.name, COUNT(p.id) AS products\nFROM categories cat LEFT JOIN products p ON p.category_id = cat.id\nGROUP BY cat.id, cat.name ORDER BY cat.name;',
        hints: [
          ['Categories preserved on the left; count the products key.', 'Categories left par bachti hain; products key gino.'],
          ['SELECT cat.name, COUNT(p.id) AS products FROM categories cat LEFT JOIN products p ON p.category_id = cat.id GROUP BY cat.id, cat.name ORDER BY cat.name;', 'SELECT cat.name, COUNT(p.id) AS products FROM categories cat LEFT JOIN products p ON p.category_id = cat.id GROUP BY cat.id, cat.name ORDER BY cat.name;'],
          ['Ten products per subcategory in this dataset — parents have 0 direct products.', 'Is dataset me har subcategory me das products — parents ke paas direct 0 hote hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'Parent visibility: parent categories (parent_category_id IS NULL) with the count of products in their SUBcategories (categories ⨝ categories ⨝ products chain). Columns: name, products. Sorted by name. Hint: join categories sub ON sub.parent_category_id = parent.id, then products ON products.category_id = sub.id.',
          'Parent visibility: parent categories (parent_category_id IS NULL) apni SUBcategories ke products count ke saath (categories ⨝ categories ⨝ products chain). Columns: name, products. Naam se sorted. Hint: categories sub ON sub.parent_category_id = parent.id se join karo, phir products ON products.category_id = sub.id.',
        ],
        sol: 'SELECT parent.name, COUNT(p.id) AS products\nFROM categories parent\nLEFT JOIN categories sub ON sub.parent_category_id = parent.id\nLEFT JOIN products p ON p.category_id = sub.id\nWHERE parent.parent_category_id IS NULL\nGROUP BY parent.id, parent.name ORDER BY parent.name;',
        hints: [
          ['Two joins: parent→sub, sub→products.', 'Do joins: parent→sub, sub→products.'],
          ['LEFT JOINs keep parents whose subs have no products… every parent here has stocked subs anyway.', 'LEFT JOINs wo parents bachate hain jinki subs me products nahi… yahan har parent ki stocked subs hain hi.'],
          ['Each parent should show roughly 30–40 products (3 subs × ~10 each).', 'Har parent lagbhag 30-40 products dikhana chahiye (3 subs × ~10 har ek).'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'The completeness audit, RIGHT-thinking LEFT-written: every customer\'s name, their order count (orders_), and the count of their DELIVERED orders (delivered) — with the status filter inside ON so nobody disappears. Columns: name, orders_, delivered. Sorted by name. First 8 rows only.',
          'Completeness audit, RIGHT-soch LEFT-likha: har customer ka naam, uska order count (orders_), aur delivered orders ka count (delivered) — status filter ON ke andar taaki koi gayab na ho. Columns: name, orders_, delivered. Naam se sorted. Sirf pehli 8 rows.',
        ],
        sol: "SELECT c.name,\n  COUNT(o.id) AS orders_,\n  COUNT(CASE WHEN o.status = 'delivered' THEN 1 END) AS delivered\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nGROUP BY c.name ORDER BY c.name LIMIT 8;",
        hints: [
          ['COUNT(CASE WHEN … THEN 1 END) counts only true cases — NULL else (CASE arrives properly at Module 39).', 'COUNT(CASE WHEN … THEN 1 END) sirf true cases ginta hai — warna NULL (CASE Module 39 me poora aata hai).'],
          ["COUNT(o.id) for all orders; the CASE-count for delivered only — o.status filter inside CASE, not WHERE.", 'COUNT(o.id) saare orders ke liye; delivered ke liye CASE-count — o.status filter CASE ke andar, WHERE me nahi.'],
          ['Everyone survives; delivered ≤ orders_ always.', 'Sab bachte hain; delivered hamesha ≤ orders_ hota hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),
];
