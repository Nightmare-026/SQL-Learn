'use client';

// Modules 24-26: MIN & MAX · GROUP BY Fundamentals · GROUP BY Multiple Columns

import { defineModule, section, step, example, mistake, mcq, outputQ, buildQ, blanksQ, task } from '../builder';
import type { Module } from '@/types/content';

export const modules: Module[] = [
  defineModule({
    n: 24,
    title: ['MIN & MAX', 'MIN & MAX'],
    time: '20 min',
    concepts: ['min', 'max', 'extremes', 'cheapest', 'priciest', 'oldest', 'newest', 'first', 'last'],
    diagram: 'sort',
    objectives: [
      ['Find extremes in numbers, text and dates', 'Numbers, text aur dates me extremes dhoondhna'],
      ['Combine MIN/MAX with WHERE filters', 'WHERE filters ke saath MIN/MAX combine karna'],
      ['Use extremes as business probes (cheapest, newest, longest)', 'Extremes ko business probes ki tarah use karna'],
    ],
    theory: [
      section(
        ['The bookends', 'Dono sire'],
        [
          [
            'MIN and MAX return the smallest and largest known value of a column — the bookends of your data. For numbers that is cheapest and priciest; for text, alphabetically first and last; for dates, the oldest record and the newest event. Every "what is our most X" question starts here.',
            'MIN aur MAX column ki sabse chhoti aur sabse badi pata value laate hain — aapke data ke dono sire. Numbers ke liye sasta aur mehnga; text ke liye alphabetically pehla aur aakhri; dates ke liye sabse purana record aur naya event. Har "hamara sabse X kya hai" sawal ki shuruaat yahin se hoti hai.',
          ],
          [
            'Like all aggregates they collapse many rows into one cell, skip NULLs, and respect WHERE — so MAX(price) within a category is that category\'s priciest item. Note what they return: the extreme VALUE, not the row that owns it. "Who bought the biggest order" needs more machinery (subqueries and JOINs, coming soon); "how big was the biggest order" is just MAX(amount).',
            'Sab aggregates ki tarah ye bhi kai rows ko ek cell me collapse karte hain, NULLs skip karte hain, aur WHERE ka izzat rakhte hain — to category ke andar MAX(price) usi category ka sabse mehnga item hai. Dhyan do ki wo kya laate hain: extreme VALUE, wo row nahi jiski wo hai. "Sabse bada order kisne kiya" ke liye aur machinery chahiye (subqueries aur JOINs, jaldi aayenge); "sabse bada order kitna bada tha" bas MAX(amount) hai.',
          ],
        ],
        [],
        'sort'
      ),
      section(
        ['Extremes as probes', 'Extremes probes ki tarah'],
        [
          [
            'MIN and MAX have a second life as data-quality probes: MAX(order_date) tells you how fresh your data is (is "today" inside it?), MIN(registration_date) finds your founding customer, and gaps between the extremes bound your timeline. Data teams run these before every migration and every report build.',
            'MIN aur MAX ka doosra janam data-quality probes ke roop me hai: MAX(order_date) batata hai data kitna fresh hai ("aaj" uske andar hai?), MIN(registration_date) founding customer dhoondhta hai, aur dono extremes ke beech ka gap aapki timeline ko bound karta hai. Data teams migration aur report banane se pehle yeh chalate hain.',
          ],
          [
            'One subtlety: MIN and MAX on TEXT columns follow collation (sort) rules, so \'Ananya\' < \'Zoya\' alphabetically — and in our ISO dates, MAX(date) is simply the latest day. Dates stored any other way break both MIN and MAX — one more reason ISO format is the law.',
            'Ek baat dhyan rakhni: TEXT columns par MIN aur MAX collation (sort) rules follow karte hain, to \'Ananya\' < \'Zoya\' alphabetically — aur hamari ISO dates me MAX(date) bas sabse naya din hai. Kisi doosri tarah store dates MIN aur MAX dono tod deti hain — ISO format kanun hone ki ek aur wajah.',
          ],
        ],
        [
          ['MIN/MAX work on numbers, text and dates', 'MIN/MAX numbers, text aur dates par chalte hain'],
          ['They return the extreme value, not the whole row', 'Ye extreme value laate hain, poori row nahi'],
          ['Great freshness probes: MAX(date) = how new is the data', 'Freshness probes: MAX(date) = data kitna naya hai'],
        ]
      ),
    ],
    tutorial: {
      title: ['Bookending the business', 'Business ke dono sire'],
      steps: [
        step(null, [
          'Four extremes, four stories: price range, newest order, founding customer, freshest enrolment.',
          'Chaar extremes, chaar kahaniyan: price range, naya order, pehla customer, naya enrolment.',
        ]),
        step('SELECT MIN(price) AS cheapest, MAX(price) AS priciest FROM products;', [
          'The catalogue price range in one row.',
          'Ek row me catalogue ka price range.',
        ], { table: 'products' }),
        step('SELECT MAX(order_date) AS newest_order FROM orders;', [
          'The most recent order — a freshness probe.',
          'Sabse haal ka order — freshness probe.',
        ], { table: 'orders' }),
        step('SELECT MIN(registration_date) AS first_customer FROM customers;', [
          'The day the shop opened its books.',
          'Jis din dukaan ne apni kitaab kholi.',
        ], { table: 'customers' }),
        step("SELECT MIN(amount) AS smallest, MAX(amount) AS largest FROM payments WHERE payment_method = 'credit_card';", [
          'Filtered extremes: the credit-card payment range.',
          'Filtered extremes: credit-card payments ka range.',
        ], { run: true, table: 'payments' }),
      ],
    },
    syntax: {
      template: 'SELECT MIN(col), MAX(col)\nFROM table\n[WHERE condition];',
      parts: [
        { part: 'MIN(col)', description: ['Smallest known value', 'Sabse chhoti pata value'] },
        { part: 'MAX(col)', description: ['Largest known value', 'Sabse badi pata value'] },
        { part: 'with WHERE', description: ['Extremes within a filtered subset', 'Filtered subset ke andar extremes'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT MAX(salary) FROM teachers;', [
        'A school throwback: the top salary (95000).',
        'School flashback: sabse upar salary (95000).',
      ]),
      example('easy', 'SELECT MIN(order_date) AS first_order, MAX(order_date) AS last_order FROM orders;', [
        'The full order timeline, bounded.',
        'Poora order timeline, bounded.',
      ]),
      example('medium', "SELECT MIN(amount) AS min_upi, MAX(amount) AS max_upi FROM payments WHERE payment_method = 'upi';", [
        'UPI payment size range.',
        'UPI payment size ka range.',
      ]),
      example('hard', 'SELECT MAX(quantity) AS biggest_line FROM order_items;', [
        'The largest single line-item quantity (5).',
        'Sabse badi single line-item quantity (5).',
      ]),
    ],
    mistakes: [
      mistake(
        ['Expecting MAX to return the product NAME', 'MAX se product ka NAAM expect karna'],
        ['MAX(price) is a number. To see the owning row, sort and LIMIT: ORDER BY price DESC LIMIT 1 — or learn subqueries (Module 28).', 'MAX(price) ek number hai. Owner row dekhne ke liye sort aur LIMIT: ORDER BY price DESC LIMIT 1 — ya subqueries seekho (Module 28).']
      ),
      mistake(
        ['Running MIN/MAX on non-ISO dates', 'Non-ISO dates par MIN/MAX chalana'],
        ['Day-first dates alphabetise wrongly, so "max" is a January date. ISO YYYY-MM-DD or nothing.', 'Day-first dates alphabetically galat chalte hain, to "max" January ka date ban jaata hai. ISO YYYY-MM-DD ya kuch nahi.']
      ),
      mistake(
        ['Forgetting MIN/MAX skip NULLs', 'MIN/MAX ka NULL skip karna bhool jaana'],
        ['If the extreme-looking rows have NULL, they simply do not participate. The max of known values may be smaller than you eyeballed.', 'Agar extreme lagne wali rows me NULL hai to wo race me hain hi nahi. Pata values ka max aapki nazar se chhota ho sakta hai.']
      ),
    ],
    summary: [
      ['MIN and MAX find the bookends of a column', 'MIN aur MAX column ke dono sire laate hain'],
      ['They return values, not rows — use ORDER BY + LIMIT for rows', 'Ye values laate hain, rows nahi — rows ke liye ORDER BY + LIMIT'],
      ['Powerful freshness probes: MIN/MAX on date columns', 'Freshness probes ke roop me tez: date columns par MIN/MAX'],
      ['Same NULL-skipping rules as other aggregates', 'Baaki aggregates jaise hi NULL-skip rules'],
    ],
    quiz: [
      mcq(
        ['Which query finds the largest single payment ever received?', 'Sabse badi single payment dhoondhne ke liye kaunsi query?'],
        [
          ['SELECT MAX(amount) FROM payments;', 'SELECT MAX(amount) FROM payments;'],
          ['SELECT amount FROM payments WHERE amount = MAX;', 'SELECT amount FROM payments WHERE amount = MAX;'],
          ['SELECT MAX(*) FROM payments;', 'SELECT MAX(*) FROM payments;'],
          ['SELECT COUNT(amount) FROM payments;', 'SELECT COUNT(amount) FROM payments;'],
        ],
        0,
        ['MAX on the amount column collapses 500 payments to the largest value.', 'amount column par MAX 500 payments ko sabse badi value par collapse karta hai.']
      ),
      outputQ(
        'SELECT MAX(price) FROM products;',
        ['What number comes back?', 'Kaunsa number aata hai?'],
        [
          { label: 'A', result: { columns: ['MAX(price)'], rows: [[48914]] } },
          { label: 'B', result: { columns: ['MAX(price)'], rows: [[50000]] } },
          { label: 'C', result: { columns: ['MAX(price)'], rows: [[200]] } },
          { label: 'D', result: { error: 'Error: misuse of aggregate' } },
        ],
        0,
        ['The priciest product costs exactly 48914.', 'Sabse mehnga product exactly 48914 ka hai.']
      ),
      buildQ(
        ['Build: the cheapest product price', 'Banao: sabse sasta product price'],
        ['SELECT', 'MIN', 'price', 'FROM', 'products', '(', ')'],
        ['SELECT', 'MIN', '(', 'price', ')', 'FROM', 'products'],
        ['MIN with the column in parentheses.', 'MIN, column parentheses ke andar.']
      ),
      blanksQ(
        'SELECT ___(order_date) FROM orders;',
        [{ options: ['MAX', 'MIN', 'TOP', 'LAST'], correct: 'MAX' }],
        ['MAX on a date column is the most recent one.', 'Date column par MAX sabse recent hota hai.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Procurement wants the cheapest catalogue price. A single MIN.',
          'Procurement ko sabse sasta catalogue price chahiye. Ek single MIN.',
        ],
        sol: 'SELECT MIN(price) FROM products;',
        hints: [
          ['MIN on the price column.', 'Price column par MIN.'],
          ['SELECT MIN(price) FROM products;', 'SELECT MIN(price) FROM products;'],
          ['The answer is 118.', 'Jawab 118 hai.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'Data freshness probe: the newest order date, aliased newest_order.',
          'Data freshness probe: sabse naya order date, aliased newest_order.',
        ],
        sol: 'SELECT MAX(order_date) AS newest_order FROM orders;',
        hints: [
          ['MAX on a date column.', 'Date column par MAX.'],
          ['SELECT MAX(order_date) AS newest_order FROM orders;', 'SELECT MAX(order_date) AS newest_order FROM orders;'],
          ['A December 2023 timestamp.', 'December 2023 ka timestamp.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'medium',
        desc: [
          'Founding story: the earliest customer registration date, aliased first_customer.',
          'Founding story: sabse pehli customer registration date, aliased first_customer.',
        ],
        sol: 'SELECT MIN(registration_date) AS first_customer FROM customers;',
        hints: [
          ['MIN on the registration timeline.', 'Registration timeline par MIN.'],
          ['SELECT MIN(registration_date) AS first_customer FROM customers;', 'SELECT MIN(registration_date) AS first_customer FROM customers;'],
          ['A 2022 date opens the story.', '2022 ki date kahani kholti hai.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'hard',
        desc: [
          'Cod payment range: the smallest and largest COD amounts, one row, aliased smallest and largest.',
          'COD payment range: sabse chhoti aur sabse badi COD amounts, ek row, aliased smallest aur largest.',
        ],
        sol: "SELECT MIN(amount) AS smallest, MAX(amount) AS largest FROM payments WHERE payment_method = 'cod';",
        hints: [
          ['Filter the rail first, then take both bookends.', 'Pehle rail filter karo, phir dono sire lo.'],
          ["SELECT MIN(amount) AS smallest, MAX(amount) AS largest FROM payments WHERE payment_method = 'cod';", "SELECT MIN(amount) AS smallest, MAX(amount) AS largest FROM payments WHERE payment_method = 'cod';"],
          ['95 COD payments bound the range.', '95 COD payments range banati hain.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'very_hard',
        desc: [
          'The catalogue range card for an investor deck, one row: cheapest price, priciest price, average price rounded to 2 decimals — aliased min_price, max_price, avg_price. Headers checked.',
          'Investor deck ke liye catalogue range card, ek row: sasta price, mehnga price, average price 2 decimals par — aliased min_price, max_price, avg_price. Headers check honge.',
        ],
        sol: 'SELECT MIN(price) AS min_price, MAX(price) AS max_price, ROUND(AVG(price), 2) AS avg_price FROM products;',
        hints: [
          ['Three aggregates, one row, three aliases.', 'Teen aggregates, ek row, teen aliases.'],
          ['SELECT MIN(price) AS min_price, MAX(price) AS max_price, ROUND(AVG(price), 2) AS avg_price FROM products;', 'SELECT MIN(price) AS min_price, MAX(price) AS max_price, ROUND(AVG(price), 2) AS avg_price FROM products;'],
          ['118 · 48914 · 8836.81.', '118 · 48914 · 8836.81.'],
        ],
        rules: { checkColumnNames: true },
      }),
    ],
  }),

  defineModule({
    n: 25,
    title: ['GROUP BY Fundamentals', 'GROUP BY Fundamentals'],
    time: '30 min',
    concepts: ['group by', 'grouping', 'aggregate context', 'buckets', 'per group', 'collapse'],
    diagram: 'group-buckets',
    objectives: [
      ['Collapse rows into one output row per group', 'Rows ko har group ki ek output row me collapse karna'],
      ['Mix group labels with aggregates correctly', 'Group labels aur aggregates sahi mix karna'],
      ['Internalise the golden rule: every non-aggregate column must be grouped', 'Golden rule: har non-aggregate column grouped hona chahiye'],
    ],
    theory: [
      section(
        ['Buckets, then math', 'Pehle buckets, phir hisaab'],
      [
          [
            'COUNT(*) answered "how many orders in total". The next question is always "how many orders per STATUS", "revenue per MONTH", "products per CATEGORY". GROUP BY splits rows into buckets by a column\'s values, then computes your aggregates once per bucket: SELECT status, COUNT(*) FROM orders GROUP BY status — five statuses in the data, five rows out.',
            'COUNT(*) ne "kul kitne orders" ka jawab diya. Agla sawal hamesha hota hai "har STATUS ke kitne orders", "har MONTH ki revenue", "har CATEGORY ke kitne products". GROUP BY rows ko kisi column ki values ke hisab se buckets me baant deta hai, phir aapke aggregates har bucket par ek baar compute karta hai: SELECT status, COUNT(*) FROM orders GROUP BY status — data me paanch statuses, bahar paanch rows.',
          ],
          [
            'Picture it physically: 500 order rows get sorted into 5 piles by status; a COUNT(*) stamp visits each pile and writes one row in the result — the pile label plus its count. GROUP BY is that pile-maker. It never changes stored data; it changes the SHAPE of the answer, from row-level to group-level.',
            'Ise physically socho: 500 order rows status ke hisab se 5 paatlion me baant jaate hain; COUNT(*) ka mohar har paalti par jaakar result me ek row likhta hai — paalti ka label aur uski ginti. GROUP BY wahi paalti banane wala hai. Ye stored data kabhi nahi badalta; ye jawab ka SHAPE badalta hai — row-level se group-level.',
          ],
        ],
        [],
        'group-buckets'
      ),
      section(
        ['The golden rule', 'Golden rule'],
        [
          [
            'When GROUP BY is active, every column in the SELECT list must be either INSIDE an aggregate or listed in the GROUP BY. Why? Each output row represents many input rows sharing the grouped value — so a bare product name in a category-level row is meaningless: which product\'s name? The engine refuses to guess (SQLite errors with "misuse of aggregate").',
            'Jab GROUP BY active hai, SELECT list ka har column ya to aggregate ke ANDAR hona chahiye ya GROUP BY me listed. Kyun? Har output row kai input rows ko represent karti hai jo grouped value share karti hain — to category-level row me product ka akela naam meaningless hai: KAUNSE product ka naam? Engine guess nahi karta (SQLite "misuse of aggregate" error deta hai).',
          ],
          [
            'GROUP BY also changes WHERE\'s reach: WHERE filters individual rows BEFORE grouping. If you want to filter the GROUPS themselves — "only categories with 10+ products" — that is HAVING\'s job, and it gets its own module (27).',
            'GROUP BY, WHERE ki pahunch bhi badal deta hai: WHERE grouping se PEHLE alag-alag rows filter karta hai. Agar aap GROUPS ko filter karna chahte ho — "sirf 10+ products wali categories" — wo HAVING ka kaam hai, aur uska apna module hai (27).',
          ],
        ],
        [
          ['One output row per distinct group value', 'Har distinct group value ki ek output row'],
          ['SELECT: aggregates + grouped labels only', 'SELECT: sirf aggregates + grouped labels'],
          ['WHERE filters rows before grouping', 'WHERE grouping se pehle rows filter karta hai'],
        ]
      ),
    ],
    tutorial: {
      title: ['Five piles of orders', 'Orders ki paanch paaltiyan'],
      steps: [
        step(null, [
          'Operations wants the order pipeline: how many orders sit in each status. We build the group, then enrich it.',
          'Operations ko order pipeline chahiye: har status me kitne orders hain. Pehle group banate hain, phir usse aur bharte hain.',
        ]),
        step('SELECT status, COUNT(*) FROM orders GROUP BY status;', [
          'Five piles, five rows — the pipeline at a glance.',
          'Paanch paaltiyan, paanch rows — pipeline ek nazar me.',
        ], { table: 'orders' }),
        step('SELECT status, COUNT(*) AS orders FROM orders GROUP BY status;', [
          'An alias makes the report read itself.',
          'Alias se report khud padhi jaane lagti hai.',
        ], { table: 'orders' }),
        step("SELECT payment_method, COUNT(*) AS uses, ROUND(AVG(amount), 2) AS avg_amount FROM payments GROUP BY payment_method;", [
          'Two aggregates per group: volume and typical size per payment rail.',
          'Har group par do aggregates: har payment rail ka volume aur typical size.',
        ], { table: 'payments' }),
        step("SELECT customer_type, COUNT(*) AS customers FROM customers GROUP BY customer_type;", [
          'The customer base, split into its three tiers.',
          'Customer base, apne teen tiers me baanti hui.',
        ], { run: true, table: 'customers' }),
      ],
    },
    syntax: {
      template: 'SELECT group_col, AGG(col)\nFROM table\n[WHERE row_condition]\nGROUP BY group_col;',
      parts: [
        { part: 'group_col', description: ['The bucket label — must appear in GROUP BY', 'Bucket ka label — GROUP BY me hona zaroori'] },
        { part: 'AGG(col)', description: ['Computed once per bucket', 'Har bucket par ek baar computed'] },
        { part: 'GROUP BY', description: ['Creates one output row per distinct value', 'Har distinct value ki ek output row banata hai'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT status, COUNT(*) FROM orders GROUP BY status;', [
        'The order pipeline — every status with its load.',
        'Order pipeline — har status apne load ke saath.',
      ]),
      example('easy', 'SELECT customer_type, COUNT(*) AS customers FROM customers GROUP BY customer_type;', [
        'The three-tier customer split: 52 regular, 33 premium, 15 VIP.',
        'Teen-tier customer split: 52 regular, 33 premium, 15 VIP.',
      ]),
      example('medium', 'SELECT category_id, COUNT(*) AS products FROM products GROUP BY category_id ORDER BY products DESC LIMIT 5;', [
        'Busiest categories by product count — grouping plus sorting plus a cap.',
        'Product count se sabse busy categories — grouping plus sorting plus cap.',
      ]),
      example('hard', "SELECT payment_method, COUNT(*) AS uses, ROUND(AVG(amount), 2) AS avg_amount FROM payments GROUP BY payment_method ORDER BY uses DESC;", [
        'A grouped, multi-aggregate, sorted payment-rail report.',
        'Grouped, multi-aggregate, sorted payment-rail report.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Bare columns beside aggregates without grouping', 'Grouping ke bina aggregates ke paas akela column'],
        ['SELECT name, COUNT(*) FROM products errors. Either drop name or GROUP BY name — the rule has no exceptions.', 'SELECT name, COUNT(*) FROM products error deta hai. Ya name hatao ya GROUP BY name likho — rule koi exception nahi maanta.']
      ),
      mistake(
        ['GROUP BY a column you never selected', 'Aise column par GROUP BY jo select hi nahi kiya'],
        ['Legal but usually a mistake: SELECT COUNT(*) FROM products GROUP BY category_id returns counts with NO labels — which count belongs to which category? Include the label.', 'Legal par aksar galti: SELECT COUNT(*) FROM products GROUP BY category_id bina label ke counts deta hai — kaunsa count kis category ka? Label shaamil karo.']
      ),
      mistake(
        ['Expecting WHERE to filter groups', 'WHERE se groups filter hone ki ummeed'],
        ['WHERE runs before grouping, on individual rows. "Groups with count > 10" needs HAVING (Module 27).', 'WHERE grouping se pehle, alag-alag rows par chalta hai. "count > 10 wale groups" ke liye HAVING chahiye (Module 27).']
      ),
    ],
    summary: [
      ['GROUP BY creates one output row per distinct value', 'GROUP BY har distinct value ki ek output row banata hai'],
      ['Aggregates compute per group; labels come from the grouped column', 'Aggregates har group par compute hote hain; labels grouped column se'],
      ['Golden rule: non-aggregated SELECT columns must be grouped', 'Golden rule: non-aggregated SELECT columns grouped hone chahiye'],
      ['WHERE filters rows BEFORE groups form', 'WHERE groups bante se PEHLE rows filter karta hai'],
    ],
    quiz: [
      mcq(
        ['Why is SELECT name, COUNT(*) FROM products invalid?', 'SELECT name, COUNT(*) FROM products invalid kyun hai?'],
        [
          ['COUNT cannot appear with columns', 'COUNT columns ke saath nahi aa sakta'],
          ['Each output row covers many products — which name would it show? Name must be grouped or aggregated', 'Har output row kai products ko cover karti hai — kaunsa naam dikhe? Naam grouped ya aggregated hona chahiye'],
          ['products has no name column', 'products me name column hai hi nahi'],
          ['It is valid SQL', 'Yeh valid SQL hai'],
        ],
        1,
        ['The engine refuses ambiguity: bare columns must participate in GROUP BY so every output row has a single, well-defined value for them.', 'Engine ambiguity mana karta hai: akela column GROUP BY me shaamil hona chahiye taaki har output row ke liye uski ek single, well-defined value ho.']
      ),
      outputQ(
        'SELECT customer_type, COUNT(*) FROM customers GROUP BY customer_type;',
        ['What rows come back?', 'Kaunsi rows aati hain?'],
        [
          { label: 'A', result: { columns: ['customer_type', 'COUNT(*)'], rows: [['regular', 52], ['premium', 33], ['vip', 15]] } },
          { label: 'B', result: { columns: ['customer_type', 'COUNT(*)'], rows: [['regular', 52]] } },
          { label: 'C', result: { columns: ['customer_type', 'COUNT(*)'], rows: [[52, 'regular'], [33, 'premium'], [15, 'vip']] } },
          { label: 'D', result: { error: 'Error: misuse of aggregate' } },
        ],
        0,
        ['Three distinct types → three rows, each with its count (order of rows is free).', 'Teen alag types → teen rows, har ek apne count ke saath (rows ka order free hai).']
      ),
      buildQ(
        ['Build: products per category', 'Banao: har category ke products'],
        ['category_id', 'COUNT(*)', 'FROM', 'products', 'SELECT', 'GROUP BY', ',', 'GROUP'],
        ['SELECT', 'category_id', ',', 'COUNT', '(', '*', ')', 'FROM', 'products', 'GROUP', 'BY', 'category_id'],
        ['Label first, aggregate second, GROUP BY the label.', 'Pehle label, phir aggregate, phir label par GROUP BY.']
      ),
      blanksQ(
        'SELECT status, ___(*) FROM orders ___ ___ status;',
        [
          { options: ['COUNT', 'SUM', 'MAX', 'GROUP'], correct: 'COUNT' },
          { options: ['GROUP', 'ORDER', 'WHERE', 'HAVING'], correct: 'GROUP' },
          { options: ['BY', 'ON', 'AS', 'WITH'], correct: 'BY' },
        ],
        ['COUNT per pile; GROUP BY builds the piles.', 'Har paalti par COUNT; GROUP BY paaltiyan banata hai.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Operations pipeline: order count for each status. Show status and the count.',
          'Operations pipeline: har status ka order count. Status aur count dikhao.',
        ],
        sol: 'SELECT status, COUNT(*) FROM orders GROUP BY status;',
        hints: [
          ['One label, one aggregate, one GROUP BY.', 'Ek label, ek aggregate, ek GROUP BY.'],
          ['SELECT status, COUNT(*) FROM orders GROUP BY status;', 'SELECT status, COUNT(*) FROM orders GROUP BY status;'],
          ['Five rows — one per status.', 'Paanch rows — har status ki ek.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'Membership tiers: customer count per customer_type, aliased customers.',
          'Membership tiers: har customer_type ka customer count, aliased customers.',
        ],
        sol: 'SELECT customer_type, COUNT(*) AS customers FROM customers GROUP BY customer_type;',
        hints: [
          ['Add an alias to the count.', 'Count par alias lagao.'],
          ['SELECT customer_type, COUNT(*) AS customers FROM customers GROUP BY customer_type;', 'SELECT customer_type, COUNT(*) AS customers FROM customers GROUP BY customer_type;'],
          ['regular 52, premium 33, vip 15.', 'regular 52, premium 33, vip 15.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'Payment-rail report: for each payment method, the number of payments and average amount rounded to 2 decimals. Columns: payment_method, uses, avg_amount (aliases checked).',
          'Payment-rail report: har payment method ke liye payments ki ginti aur average amount 2 decimals par. Columns: payment_method, uses, avg_amount (aliases check honge).',
        ],
        sol: 'SELECT payment_method, COUNT(*) AS uses, ROUND(AVG(amount), 2) AS avg_amount FROM payments GROUP BY payment_method;',
        hints: [
          ['Two aggregates per bucket, both aliased.', 'Har bucket par do aggregates, dono aliased.'],
          ['SELECT payment_method, COUNT(*) AS uses, ROUND(AVG(amount), 2) AS avg_amount FROM payments GROUP BY payment_method;', 'SELECT payment_method, COUNT(*) AS uses, ROUND(AVG(amount), 2) AS avg_amount FROM payments GROUP BY payment_method;'],
          ['Five rails: netbanking leads usage with 107.', 'Paanch rails: netbanking 107 ke saath usage me sabse aage.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'hard',
        desc: [
          'Category inventory: product count per category_id, most products first (sorted by the count descending, category_id ascending as tiebreak). Columns: category_id and products.',
          'Category inventory: har category_id ka product count, sabse zyada pehle (count se utarte, category_id chadhta tiebreak). Columns: category_id aur products.',
        ],
        sol: 'SELECT category_id, COUNT(*) AS products FROM products GROUP BY category_id ORDER BY products DESC, category_id ASC;',
        hints: [
          ['GROUP BY then ORDER BY — group, sort, done.', 'GROUP BY phir ORDER BY — group, sort, ho gaya.'],
          ['SELECT category_id, COUNT(*) AS products FROM products GROUP BY category_id ORDER BY products DESC, category_id ASC;', 'SELECT category_id, COUNT(*) AS products FROM products GROUP BY category_id ORDER BY products DESC, category_id ASC;'],
          ['Row order is checked here.', 'Yahan row order check hota hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'The fulfilment spread: for each order status, the number of orders AND the number of distinct customers who have orders in that status. Columns: status, orders, customers (aliases checked). Hint: COUNT(DISTINCT customer_id).',
          'Fulfilment spread: har order status ke liye orders ki ginti AUR us status me orders wale distinct customers ki ginti. Columns: status, orders, customers (aliases check honge). Hint: COUNT(DISTINCT customer_id).',
        ],
        sol: 'SELECT status, COUNT(*) AS orders, COUNT(DISTINCT customer_id) AS customers FROM orders GROUP BY status;',
        hints: [
          ['COUNT(*) for rows; COUNT(DISTINCT col) for unique actors.', 'Rows ke liye COUNT(*); unique actors ke liye COUNT(DISTINCT col).'],
          ['SELECT status, COUNT(*) AS orders, COUNT(DISTINCT customer_id) AS customers FROM orders GROUP BY status;', 'SELECT status, COUNT(*) AS orders, COUNT(DISTINCT customer_id) AS customers FROM orders GROUP BY status;'],
          ['Delivered orders come from ~95 different customers.', 'Delivered orders lagbhag 95 alag customers se aate hain.'],
        ],
        rules: { checkColumnNames: true },
      }),
    ],
  }),

  defineModule({
    n: 26,
    title: ['GROUP BY Multiple Columns', 'GROUP BY Multiple Columns'],
    time: '25 min',
    concepts: ['group by', 'multi-column grouping', 'grouping hierarchy', 'combination', 'sub-group'],
    diagram: 'group-buckets',
    objectives: [
      ['Group by several columns to create combined buckets', 'Kai columns se combined buckets banana'],
      ['Read multi-level output like a hierarchy', 'Multi-level output hierarchy ki tarah padhna'],
      ['Choose the right grain for the question', 'Sawal ke hisab se sahi grain chunna'],
    ],
    theory: [
      section(
        ['Combinations are buckets too', 'Combinations bhi buckets hain'],
        [
          [
            'Grouping by one column answers "per status". Grouping by two answers "per status AND per payment method" — every distinct COMBINATION becomes its own bucket. GROUP BY status, payment_method creates a row for (pending, upi), another for (pending, cod), another for (delivered, upi)… the cross of real combinations, each counted separately.',
            'Ek column se grouping "per status" ka jawab deti hai. Do se "per status AUR per payment method" — har distinct COMBINATION apna bucket ban jaata hai. GROUP BY status, payment_method (pending, upi) ki ek row banata hai, (pending, cod) ki doosri, (delivered, upi) ki doosri… real combinations ka cross, har ek alag-ginta hua.',
          ],
          [
            'Order of grouped columns changes only the output\'s reading order, not the maths: GROUP BY city, grade and GROUP BY grade, city produce the same rows (possibly shuffled). The golden rule extends naturally: EVERY non-aggregated SELECT column must appear in the GROUP BY list — two labels, two grouped columns.',
            'Grouped columns ka order sirf output ka reading order badalta hai, maths nahi: GROUP BY city, grade aur GROUP BY grade, city same rows dete hain (shayad shuffled). Golden rule naturally failta hai: har non-aggregated SELECT column GROUP BY list me hona chahiye — do labels, do grouped columns.',
          ],
        ],
        [],
        'group-buckets'
      ),
      section(
        ['Choosing the grain', 'Grain chunna'],
        [
          [
            'The "grain" of a query is what one output row represents: a customer? a city? a month? a customer-month? Analysts speak this language daily. Before writing a grouped query, state the grain out loud: "one row per product category" or "one row per city and grade". If you cannot say it, the query is not ready.',
            'Query ka "grain" hota hai ki uski ek output row kya represent karti hai: ek customer? ek city? ek mahina? customer-mahina? Analysts roz yahi bhasha bolte hain. Grouped query likhne se pehle grain bol kar bolo: "har product category ki ek row" ya "har city aur grade ki ek row". Agar bol nahi sakte, query ready nahi hai.',
          ],
          [
            'Finer grain answers finer questions: revenue per month becomes revenue per month per payment method when you add a column. But every extra column multiplies output rows and dilutes each count — the analyst\'s trade-off between detail and clarity. Start coarse, drill down when asked.',
            'Patla grain patle sawalon ka jawab deta hai: revenue per month, ek column jodte hi revenue per month per payment method ban jaata hai. Par har extra column output rows ko guna kar deta hai aur har count ko patla — detail aur clarity ka analyst wala trade-off. Mota shuru karo, poochne par drill down karo.',
          ],
        ],
        [
          ['One output row per distinct combination', 'Har distinct combination ki ek output row'],
          ['All non-aggregated columns must be grouped', 'Saare non-aggregated columns grouped hone chahiye'],
          ['State the grain before writing the query', 'Query likhne se pehle grain bolo'],
        ]
      ),
    ],
    tutorial: {
      title: ['Drilling down', 'Drill down karna'],
      steps: [
        step(null, [
          'From "revenue per payment method" to "revenue per method per month-ish shape" — watch the grain get finer.',
          '"har payment method ki revenue" se "method-month shape ki revenue" tak — grain ka patla hota dekho.',
        ]),
        step('SELECT payment_method, COUNT(*) AS uses FROM payments GROUP BY payment_method;', [
          'Coarse grain: five rows, one per rail.',
          'Mota grain: paanch rows, har rail ki ek.',
        ], { table: 'payments' }),
        step("SELECT payment_method, substr(payment_date, 6, 2) AS month, COUNT(*) AS uses FROM payments GROUP BY payment_method, substr(payment_date, 6, 2);", [
          'Finer grain: rail × month buckets (substr extracts the month — a date-function preview).',
          'Patla grain: rail × month buckets (substr month nikaalta hai — date-function preview).',
        ], { table: 'payments' }),
        step("SELECT payment_method, substr(payment_date, 6, 2) AS month, COUNT(*) AS uses, ROUND(AVG(amount),2) AS avg_amt FROM payments GROUP BY payment_method, substr(payment_date, 6, 2) LIMIT 8;", [
          'Two labels, two aggregates — a real dashboard extract.',
          'Do labels, do aggregates — asli dashboard extract.',
        ], { table: 'payments' }),
        step("SELECT status, customer_type, COUNT(*) AS combo FROM orders o JOIN customers c ON c.id = o.customer_id GROUP BY status, customer_type;", [
          'Grouping across tables (JOIN preview): status × customer tier buckets.',
          'Tables ke paar grouping (JOIN preview): status × customer tier buckets.',
        ], { run: true, table: 'orders' }),
      ],
    },
    syntax: {
      template: 'SELECT colA, colB, AGG(col)\nFROM table\nGROUP BY colA, colB;',
      parts: [
        { part: 'colA, colB', description: ['The combined bucket label', 'Combined bucket ka label'] },
        { part: 'GROUP BY colA, colB', description: ['One row per distinct (colA, colB) pair', 'Har distinct (colA, colB) pair ki ek row'] },
        { part: 'expressions', description: ['Groupable too: substr(date,1,7) for months', 'Expressions bhi: months ke liye substr(date,1,7)'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT city, customer_type, COUNT(*) FROM customers GROUP BY city, customer_type LIMIT 8;', [
        'City × tier buckets — who lives where at what level.',
        'City × tier buckets — kaun kahan rehta hai kis level par.',
      ]),
      example('easy', "SELECT substr(order_date, 1, 7) AS month, COUNT(*) AS orders FROM orders GROUP BY substr(order_date, 1, 7) ORDER BY month LIMIT 6;", [
        'Months as buckets (via substring) — the monthly volume chart data.',
        'Months buckets ki tarah (substring se) — monthly volume chart ka data.',
      ]),
      example('medium', "SELECT status, payment_method, COUNT(*) AS n FROM payments p JOIN orders o ON o.id = p.order_id GROUP BY status, payment_method LIMIT 8;", [
        'A two-column grouping across a JOIN — status × rail.',
        'JOIN ke paar do-column grouping — status × rail.',
      ]),
      example('hard', "SELECT city, customer_type, COUNT(*) AS customers FROM customers GROUP BY city, customer_type ORDER BY city, customer_type LIMIT 10;", [
        'A sorted city × tier matrix for the regional review.',
        'Regional review ke liye sorted city × tier matrix.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Adding a SELECT column and forgetting to group it', 'SELECT column jodna aur usse group karna bhool jaana'],
        ['The engine rejects stray bare columns when GROUP BY is active. Add the column to GROUP BY or wrap it in an aggregate.', 'GROUP BY active hone par engine extra akela column reject karta hai. Column ko GROUP BY me jodo ya aggregate me wrap karo.']
      ),
      mistake(
        ['Believing GROUP BY column order changes the aggregation', 'Yeh maanna ki GROUP BY column ka order aggregation badalta hai'],
        ['(city, grade) and (grade, city) compute identical buckets. Order only affects how humans read the output — and you control that with ORDER BY.', '(city, grade) aur (grade, city) identical buckets banate hain. Order sirf insaan ke padhne ko affect karta hai — aur wo aap ORDER BY se control karte ho.']
      ),
      mistake(
        ['Going too fine too fast', 'Bahut jaldi bahut patla grain'],
        ['Grouping by ids (customer_id, order_id…) explodes row counts and hides the story. Group by categories, dates, tiers — the dimensions people ask about.', 'Ids se grouping (customer_id, order_id…) rows ko phaila deti hai aur kahani chhupa deti hai. Categories, dates, tiers se group karo — jis dimensions ke baare me log poochte hain.']
      ),
    ],
    summary: [
      ['Multiple grouped columns create combined buckets', 'Kai grouped columns combined buckets banate hain'],
      ['Every non-aggregated SELECT column must be grouped', 'Har non-aggregated SELECT column grouped hona chahiye'],
      ['Column order in GROUP BY does not change the math', 'GROUP BY me column order maths nahi badalta'],
      ['State your grain first; start coarse, drill down on demand', 'Pehle grain bolo; mota shuru karo, demand par drill karo'],
    ],
    quiz: [
      mcq(
        ['GROUP BY city, grade creates a bucket for every…', 'GROUP BY city, grade har… ka bucket banata hai…'],
        [
          ['City', 'City'],
          ['Grade', 'Grade'],
          ['Distinct (city, grade) combination present in the data', 'Data me maujood har distinct (city, grade) combination'],
          ['Row', 'Row'],
        ],
        2,
        ['Two grouping columns → buckets are pairs: Delhi-A, Delhi-B, Mumbai-A are all separate groups.', 'Do grouping columns → buckets pairs hote hain: Delhi-A, Delhi-B, Mumbai-A sab alag groups.']
      ),
      outputQ(
        "SELECT substr(order_date,1,7) AS month, COUNT(*) AS orders FROM orders GROUP BY substr(order_date,1,7) ORDER BY month LIMIT 2;",
        ['What are the first two rows?', 'Pehli do rows kya hain?'],
        [
          { label: 'A', result: { columns: ['month', 'orders'], rows: [['2023-01', 42], ['2023-02', 42]] } },
          { label: 'B', result: { columns: ['month', 'orders'], rows: [['2023-12', 41]] } },
          { label: 'C', result: { columns: ['month', 'orders'], rows: [[42, '2023-01']] } },
          { label: 'D', result: { error: 'Error: misuse of aggregate' } },
        ],
        0,
        ['Twelve month-buckets, 41-42 orders each; January and February lead the sorted list.', 'Barah month-buckets, har ek me 41-42 orders; sorted list me January aur February aage.']
      ),
      buildQ(
        ['Build: customers per city and tier', 'Banao: har city aur tier ke customers'],
        ['city', 'customer_type', 'COUNT(*)', 'FROM', 'SELECT', 'GROUP BY', ',', 'customers'],
        ['SELECT', 'city', ',', 'customer_type', ',', 'COUNT', '(', '*', ')', 'FROM', 'customers', 'GROUP', 'BY', 'city', ',', 'customer_type'],
        ['Two labels, comma, aggregate, GROUP BY both labels.', 'Do labels, comma, aggregate, dono labels par GROUP BY.']
      ),
      blanksQ(
        'SELECT city, grade, COUNT(*) FROM students GROUP ___ city, ___;',
        [
          { options: ['BY', 'ON', 'AS'], correct: 'BY' },
          { options: ['grade', 'COUNT', 'id'], correct: 'grade' },
        ],
        ['Group by exactly the bare columns you selected.', 'Jin akela columns select kiye, unhi par group karo.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Where do our tiers live? Customer count per city and customer_type. Show all three columns (count not aliased).',
          'Hamare tiers kahan rehte hain? Har city aur customer_type ka customer count. Teeno columns dikhao (count alias nahi).',
        ],
        sol: 'SELECT city, customer_type, COUNT(*) FROM customers GROUP BY city, customer_type;',
        hints: [
          ['Two labels, both grouped.', 'Do labels, dono grouped.'],
          ['SELECT city, customer_type, COUNT(*) FROM customers GROUP BY city, customer_type;', 'SELECT city, customer_type, COUNT(*) FROM customers GROUP BY city, customer_type;'],
          ['Row order is free here.', 'Yahan row order free hai.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'Monthly volume: order count per month (use substr(order_date, 1, 7) as the month), sorted by month. Columns: month, orders.',
          'Monthly volume: har mahine ka order count (month ke liye substr(order_date, 1, 7)), month se sorted. Columns: month, orders.',
        ],
        sol: "SELECT substr(order_date, 1, 7) AS month, COUNT(*) AS orders FROM orders GROUP BY substr(order_date, 1, 7) ORDER BY month;",
        hints: [
          ['substr(order_date, 1, 7) yields YYYY-MM.', 'substr(order_date, 1, 7) se YYYY-MM milta hai.'],
          ["SELECT substr(order_date,1,7) AS month, COUNT(*) AS orders FROM orders GROUP BY substr(order_date,1,7) ORDER BY month;", "SELECT substr(order_date,1,7) AS month, COUNT(*) AS orders FROM orders GROUP BY substr(order_date,1,7) ORDER BY month;"],
          ['Twelve rows, 41-42 orders each.', 'Barah rows, har ek me 41-42 orders.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'medium',
        desc: [
          'Rail × month usage: payment count per payment_method and month (substr of payment_date), no sorting needed. Columns: payment_method, month, uses.',
          'Rail × month usage: har payment_method aur month (payment_date ka substr) ki payment count, sorting zaroori nahi. Columns: payment_method, month, uses.',
        ],
        sol: "SELECT payment_method, substr(payment_date, 1, 7) AS month, COUNT(*) AS uses FROM payments GROUP BY payment_method, substr(payment_date, 1, 7);",
        hints: [
          ['Group by rail AND month expression.', 'Rail AUR month expression se group karo.'],
          ["SELECT payment_method, substr(payment_date,1,7) AS month, COUNT(*) AS uses FROM payments GROUP BY payment_method, substr(payment_date,1,7);", "SELECT payment_method, substr(payment_date,1,7) AS month, COUNT(*) AS uses FROM payments GROUP BY payment_method, substr(payment_date,1,7);"],
          ['60 rows out (5 rails × 12 months).', '60 rows bahar (5 rails × 12 months).'],
        ],
      }),
      task({
        d: 'hard',
        desc: [
          'Regional tier matrix: customer count per city and customer_type, sorted by city then customer_type. Columns: city, customer_type, customers.',
          'Regional tier matrix: har city aur customer_type ka customer count, city phir customer_type se sorted. Columns: city, customer_type, customers.',
        ],
        sol: 'SELECT city, customer_type, COUNT(*) AS customers FROM customers GROUP BY city, customer_type ORDER BY city, customer_type;',
        hints: [
          ['GROUP BY both; ORDER BY both.', 'Dono par GROUP BY; dono par ORDER BY.'],
          ['SELECT city, customer_type, COUNT(*) AS customers FROM customers GROUP BY city, customer_type ORDER BY city, customer_type;', 'SELECT city, customer_type, COUNT(*) AS customers FROM customers GROUP BY city, customer_type ORDER BY city, customer_type;'],
          ['Row order IS checked — alphabetical double sort.', 'Row order check HOGA — alphabetical double sort.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'The engagement matrix: for each order status and customer tier, the order count AND distinct customers involved — across orders and customers tables. Columns: status, customer_type, orders, buyers. Sorted by status then customer_type. (JOIN pattern from the tutorial is allowed; formal JOIN training is Modules 33-37.)',
          'Engagement matrix: har order status aur customer tier ke liye order count AUR distinct customers — orders aur customers tables ke paar. Columns: status, customer_type, orders, buyers. Status phir customer_type se sorted. (Tutorial wala JOIN pattern allowed hai; formal JOIN training Modules 33-37 me.)',
        ],
        sol: 'SELECT o.status, c.customer_type, COUNT(*) AS orders, COUNT(DISTINCT o.customer_id) AS buyers FROM orders o JOIN customers c ON c.id = o.customer_id GROUP BY o.status, c.customer_type ORDER BY o.status, c.customer_type;',
        hints: [
          ['JOIN orders to customers (o.customer_id = c.id), then group by status and tier.', 'orders ko customers se JOIN karo (o.customer_id = c.id), phir status aur tier par group karo.'],
          ['SELECT o.status, c.customer_type, COUNT(*) AS orders, COUNT(DISTINCT o.customer_id) AS buyers FROM orders o JOIN customers c ON c.id = o.customer_id GROUP BY o.status, c.customer_type ORDER BY o.status, c.customer_type;', 'SELECT o.status, c.customer_type, COUNT(*) AS orders, COUNT(DISTINCT o.customer_id) AS buyers FROM orders o JOIN customers c ON c.id = o.customer_id GROUP BY o.status, c.customer_type ORDER BY o.status, c.customer_type;'],
          ['Fifteen status × tier combinations appear.', 'Status × tier ke pandrah combinations dikhte hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),
];
