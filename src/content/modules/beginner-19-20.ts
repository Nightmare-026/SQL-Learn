'use client';

// Modules 19-20: LIMIT & OFFSET · Level Project 1: School Report Generator

import { defineModule, section, step, example, mistake, mcq, outputQ, buildQ, blanksQ, task } from './builder';
import type { Module } from '@/types/content';

export const modules: Module[] = [
  defineModule({
    n: 19,
    title: ['LIMIT & OFFSET', 'LIMIT & OFFSET'],
    time: '25 min',
    concepts: ['limit', 'offset', 'pagination', 'top n', 'page', 'skip'],
    diagram: 'limit-paginate',
    objectives: [
      ['Cap results with LIMIT for Top-N queries', 'Top-N queries ke liye LIMIT se results rokna'],
      ['Skip rows with OFFSET for pages of results', 'Pages ke liye OFFSET se rows skip karna'],
      ['Combine LIMIT + ORDER BY correctly', 'LIMIT + ORDER BY sahi jodna'],
    ],
    theory: [
      section(
        ['Top-N and pages', 'Top-N aur pages'],
        [
          [
            'Dashboards never show 50,000 rows — they show the top 10. LIMIT caps the number of rows returned: ORDER BY score DESC LIMIT 5 is precisely "the five best scores". Paired with sorting, LIMIT turns any ranking question into a five-word answer, and it is the cheapest performance optimisation in SQL: fewer rows moved means faster queries.',
            'Dashboards kabhi 50,000 rows nahi dikhati — wo top 10 dikhati hain. LIMIT lauti rows ki ginti rokta hai: ORDER BY score DESC LIMIT 5 ka exact matlab "paanch best scores". Sorting ke saath, LIMIT har ranking sawal ko paanch-shabdi jawab bana deta hai, aur yeh SQL ka sabse sasta performance optimization hai: kam rows move matlab fast query.',
          ],
          [
            'OFFSET skips rows before the cap applies: LIMIT 10 OFFSET 20 means "ignore the first 20, then give me 10" — rows 21 to 30. That is page 3 of a ten-per-page listing, which is why LIMIT/OFFSET powers pagination in countless real apps. SQLite also allows the portable spelling LIMIT 10, 20 (limit, offset) — but the keyword form is clearer and we use it throughout.',
            'OFFSET cap lagne se pehle rows skip karta hai: LIMIT 10 OFFSET 20 ka matlab "pehli 20 chhodo, phir 10 do" — rows 21 se 30. Wahi das-per-page listing ka page 3 hai, isi liye LIMIT/OFFSET paginating duniya bhar ke apps me chalta hai. SQLite portable spelling LIMIT 10, 20 (limit, offset) bhi allow karta hai — par keyword form saaf hai aur hum wahi use karenge.',
          ],
        ],
        [],
        'limit-paginate'
      ),
      section(
        ['The iron rule: sort, then slice', 'Iron rule: pehle sort, phir slice'],
        [
          [
            'LIMIT without ORDER BY is meaningless as a "top" — you get an arbitrary handful. Always state which ordering defines the top: highest salary, newest date, best score. The engine sorts first, then takes the slice, so LIMIT always honours the ORDER BY immediately before it.',
            'ORDER BY ke bina LIMIT "top" ke liye meaningless hai — aapko koi bhi arbitrary thaili milti hai. Hamesha batao kaunsa ordering "top" define karta hai: sabse unchi salary, naya date, best score. Engine pehle sort karta hai, phir slice leta hai, isliye LIMIT hamesha apne turant pehle wale ORDER BY ko maanta hai.',
          ],
          [
            'OFFSET pitfalls worth knowing: deep pages get slower (the engine still produces and discards skipped rows), and inserts between page loads can shift items between pages. Production systems sometimes switch to keyset pagination (WHERE id > last_seen LIMIT 10) — a technique you will recognise when you meet it.',
            'OFFSET ke pitfalls jaan-ne layak: gehre pages slow hote hain (engine skip ki gayi rows phir bhi banata aur phenkta hai), aur page loads ke beech inserts items ko pages ke beech khisaak sakte hain. Production systems kabhi keyset pagination par switch karte hain (WHERE id > last_seen LIMIT 10) — jab miloge to pehchano ge.',
          ],
        ],
        [
          ['LIMIT caps; OFFSET skips; together they paginate', 'LIMIT rokta hai; OFFSET skip karta hai; dono milke paginate karte hain'],
          ['ORDER BY before LIMIT, always, for meaningful tops', 'Sahi tops ke liye hamesha LIMIT se pehle ORDER BY'],
          ['LIMIT 0 shows nothing; large LIMIT is harmless', 'LIMIT 0 kuch nahi dikhata; bada LIMIT nuksaan nahi karta'],
        ]
      ),
    ],
    tutorial: {
      title: ['Top of the class', 'Class ka top'],
      steps: [
        step(null, [
          'The awards ceremony needs the top 3 scorers, then the next page of results. Sort, cap, skip — three moves.',
          'Awards ceremony ko top 3 scorers chahiye, phir agla page. Sort, cap, skip — teen moves.',
        ]),
        step('SELECT s.name, e.score\nFROM students s JOIN enrollments e ON e.student_id = s.id\nWHERE e.score IS NOT NULL\nORDER BY e.score DESC;', [
          'Simpler preview — all graded scores, best first. (JOINs formally arrive in the intermediate level.)',
          'Simple preview — saare graded scores, best pehle. (JOINs formally intermediate level me aate hain.)',
        ], { table: 'enrollments' }),
        step('SELECT id, score FROM enrollments WHERE score IS NOT NULL ORDER BY score DESC LIMIT 5;', [
          'The cap: exactly the five best scores.',
          'Cap: exactly paanch best scores.',
        ], { table: 'enrollments', highlightWhere: 'score >= 95' }),
        step('SELECT id, score FROM enrollments WHERE score IS NOT NULL ORDER BY score DESC LIMIT 5 OFFSET 5;', [
          'Skip the first five, take the next five — ranks 6 to 10, i.e. page two.',
          'Pehli paanch chhodo, agli paanch lo — rank 6 se 10, yaani page do.',
        ], { table: 'enrollments', highlightWhere: 'score >= 90' }),
        step('SELECT name, salary FROM teachers ORDER BY salary DESC LIMIT 3;', [
          'A Top-3 on a different table — the pattern is universal.',
          'Doosri table par Top-3 — pattern universal hai.',
        ], { run: true, table: 'teachers' }),
      ],
    },
    syntax: {
      template: 'SELECT columns\nFROM table\n[WHERE condition]\n[ORDER BY col]\nLIMIT n [OFFSET m];',
      parts: [
        { part: 'LIMIT n', description: ['Return at most n rows', 'Kam se kam… yaani zyada se zyada n rows'] },
        { part: 'OFFSET m', description: ['Skip the first m rows first', 'Pehle m rows skip karo'] },
        { part: 'position', description: ['Always the final clause', 'Hamesha aakhri clause'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT name, salary FROM teachers ORDER BY salary DESC LIMIT 3;', [
        'The three highest-paid teachers.',
        'Teen sabse zyada salary wale teachers.',
      ]),
      example('easy', 'SELECT name FROM students ORDER BY name LIMIT 5;', [
        'The first five names alphabetically.',
        'Alphabetically pehle paanch naam.',
      ]),
      example('medium', 'SELECT name, age FROM students ORDER BY age DESC, name LIMIT 4;', [
        'The four oldest students, tie-broken by name.',
        'Chaar sabse bade students, naam se tiebreak.',
      ]),
      example('hard', 'SELECT name, city FROM students ORDER BY city, name LIMIT 10 OFFSET 10;', [
        'Page two of the city-grouped directory.',
        'City-grouped directory ka page do.',
      ]),
    ],
    mistakes: [
      mistake(
        ['LIMIT without ORDER BY for "top" queries', '"Top" queries ke liye ORDER BY ke bina LIMIT'],
        ['Without a sort, LIMIT returns arbitrary rows — not the best, not the newest, just whichever. Always pair the two.', 'Sort ke bina LIMIT arbitrary rows deti hai — best nahi, naya nahi, bas jo bhi mile. Hamesha dono jodo.']
      ),
      mistake(
        ['Thinking OFFSET is the ending row number', 'OFFSET ko ending row number samajhna'],
        ['OFFSET 20 LIMIT 10 skips 20 rows and returns 10 — rows 21-30. OFFSET is the count skipped, not the last row.', 'OFFSET 20 LIMIT 10 — 20 rows skip, 10 rows return — rows 21-30. OFFSET skip ki gayi ginti hai, aakhri row nahi.']
      ),
      mistake(
        ['Placing LIMIT before ORDER BY', 'ORDER BY se pehle LIMIT rakhna'],
        ['LIMIT is the final clause. The engine will reject LIMIT first, order later.', 'LIMIT aakhri clause hai. Engine LIMIT ko pehle nahi maanega, order baad me.']
      ),
    ],
    summary: [
      ['LIMIT caps row count — the Top-N tool', 'LIMIT row count rokta hai — Top-N tool'],
      ['OFFSET skips rows — pagination pages', 'OFFSET rows skip karta hai — pagination ke pages'],
      ['Sort before you slice: ORDER BY then LIMIT', 'Slice karne se pehle sort: ORDER BY phir LIMIT'],
      ['LIMIT 0 returns nothing; combine freely with WHERE', 'LIMIT 0 kuch nahi deta; WHERE ke saath aaram se jodo'],
    ],
    quiz: [
      mcq(
        ['Which query reliably returns the 5 oldest students?', 'Kaunsi query bharosemand tareeke se 5 sabse bade students deti hai?'],
        [
          ['SELECT name FROM students LIMIT 5;', 'SELECT name FROM students LIMIT 5;'],
          ['SELECT name FROM students ORDER BY age DESC LIMIT 5;', 'SELECT name FROM students ORDER BY age DESC LIMIT 5;'],
          ['SELECT name FROM students WHERE age > 20 LIMIT 5;', 'SELECT name FROM students WHERE age > 20 LIMIT 5;'],
          ['SELECT name FROM students OFFSET 5;', 'SELECT name FROM students OFFSET 5;'],
        ],
        1,
        ['"Oldest" needs the age sort; LIMIT then caps it. The others are arbitrary or filtered differently.', '"Sabse bade" ke liye age sort chahiye; LIMIT phir rok deta hai. Baaki arbitrary ya alag filtered hain.']
      ),
      outputQ(
        'SELECT name, salary FROM teachers ORDER BY salary DESC LIMIT 1;',
        ['What single row comes back?', 'Kaunsi akeli row aati hai?'],
        [
          { label: 'A', result: { columns: ['name', 'salary'], rows: [['Dr. Vikas Nair', 95000]] } },
          { label: 'B', result: { columns: ['name', 'salary'], rows: [['Mr. Rohan Desai', 40000]] } },
          { label: 'C', result: { columns: ['name', 'salary'], rows: [['Dr. Rajesh Verma', 85000]] } },
          { label: 'D', result: { error: 'Error: near "LIMIT": syntax error' } },
        ],
        0,
        ['Highest salary is 95000 — Dr. Vikas Nair, the 20-year veteran.', 'Sabse unchi salary 95000 hai — Dr. Vikas Nair, 20 saal wale veteran.']
      ),
      buildQ(
        ['Build: the top 2 highest salaries', 'Banao: top 2 sabse unchi salary'],
        ['FROM', 'teachers', 'ORDER', 'SELECT', 'salary', 'BY', 'DESC', 'LIMIT', '2'],
        ['SELECT', 'salary', 'FROM', 'teachers', 'ORDER', 'BY', 'salary', 'DESC', 'LIMIT', '2'],
        ['Sort descending, cap at two.', 'Utarate hue sort karo, do par rokо.']
      ),
      blanksQ(
        'SELECT name FROM students ORDER BY age DESC LIMIT 5 ___ 5;',
        [{ options: ['OFFSET', 'SKIP', 'NEXT', 'PAGE'], correct: 'OFFSET' }],
        ['OFFSET skips rows after sorting, before capping.', 'OFFSET sorting ke baad, cap se pehle rows skip karta hai.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Award shortlist: the top 3 teacher salaries. Show name and salary, highest first.',
          'Award shortlist: top 3 teacher salaries. Name aur salary dikhao, sabse unchi pehle.',
        ],
        sol: 'SELECT name, salary FROM teachers ORDER BY salary DESC LIMIT 3;',
        hints: [
          ['Sort descending, cap at three.', 'Utarate sort, teen par rok.'],
          ['SELECT name, salary FROM teachers ORDER BY salary DESC LIMIT 3;', 'SELECT name, salary FROM teachers ORDER BY salary DESC LIMIT 3;'],
          ['95000, 85000, 78000 appear in that order.', '95000, 85000, 78000 isi order me aate hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'easy',
        desc: [
          'Alphabet roll-call, first page: the first 5 student names alphabetically.',
          'Alphabet roll-call, pehla page: alphabetically pehle 5 student naam.',
        ],
        sol: 'SELECT name FROM students ORDER BY name LIMIT 5;',
        hints: [
          ['Ascending sort plus a cap of five.', 'Chadhta sort aur paanch ki cap.'],
          ['SELECT name FROM students ORDER BY name LIMIT 5;', 'SELECT name FROM students ORDER BY name LIMIT 5;'],
          ['Abhinav Bansal leads the list.', 'Abhinav Bansal list me sabse aage hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'medium',
        desc: [
          'The senior club: the 5 oldest students, ties broken alphabetically. Show name and age.',
          'Senior club: 5 sabse bade students, ties alphabetically toote. Name aur age dikhao.',
        ],
        sol: 'SELECT name, age FROM students ORDER BY age DESC, name LIMIT 5;',
        hints: [
          ['Two-level sort, then the cap.', 'Do-level sort, phir cap.'],
          ['SELECT name, age FROM students ORDER BY age DESC, name LIMIT 5;', 'SELECT name, age FROM students ORDER BY age DESC, name LIMIT 5;'],
          ['21-year-olds lead the page.', '21 saal wale page pe lead karte hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'Page two of the directory: student names 6 through 10 alphabetically (skip the first 5, take the next 5). Show the names.',
          'Directory ka page do: alphabetically naam 6 se 10 (pehle 5 chhodo, agli 5 lo). Naam dikhao.',
        ],
        sol: 'SELECT name FROM students ORDER BY name LIMIT 5 OFFSET 5;',
        hints: [
          ['OFFSET 5 skips the first page.', 'OFFSET 5 pehla page skip karta hai.'],
          ['SELECT name FROM students ORDER BY name LIMIT 5 OFFSET 5;', 'SELECT name FROM students ORDER BY name LIMIT 5 OFFSET 5;'],
          ['Rows 6-10 of the sorted list appear.', 'Sorted list ki rows 6-10 dikhti hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'Honourable mentions: exam ranks 4 through 8 — the graded enrollments with the 4th to 8th highest scores (skip top 3, take next 5), tie-broken by id ascending. Show student_id, score, ordered by score descending then id.',
          'Honourable mentions: exam rank 4 se 8 — graded enrollments jinke scores 4th se 8th sabse unche hain (top 3 chhodo, agli 5 lo), ties id se chadhte hue toote. student_id, score dikhao, score utarte phir id chadhte order me.',
        ],
        sol: 'SELECT student_id, score FROM enrollments WHERE score IS NOT NULL ORDER BY score DESC, id LIMIT 5 OFFSET 3;',
        hints: [
          ['Filter NULLs, sort two levels, skip 3, cap 5.', 'NULL filter karo, do level sort karo, 3 skip karo, 5 par rokо.'],
          ['SELECT student_id, score FROM enrollments WHERE score IS NOT NULL ORDER BY score DESC, id LIMIT 5 OFFSET 3;', 'SELECT student_id, score FROM enrollments WHERE score IS NOT NULL ORDER BY score DESC, id LIMIT 5 OFFSET 3;'],
          ['Scores 99 and 98 territory — ranks 4-8 exactly.', '99 aur 98 wale scores ka ilaaka — exactly rank 4-8.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),

  defineModule({
    n: 20,
    title: ['🏆 Level Project: School Report Generator', '🏆 Level Project: School Report Generator'],
    time: '45 min',
    concepts: ['project', 'report', 'combine', 'select', 'where', 'order by', 'limit', 'null', 'distinct', 'aggregate preview'],
    diagram: 'select-flow',
    objectives: [
      ['Solve eight realistic school-office requests with everything from Modules 1-19', 'Modules 1-19 ki saari knowledge se aath real school-office requests solve karna'],
      ['Translate fuzzy office language into precise, validated queries', 'Fuzzy office bhasha ko precise, validated queries me badalna'],
      ['Earn the Beginner badge and unlock the Intermediate level', 'Beginner badge kamao aur Intermediate level unlock karo'],
    ],
    theory: [
      section(
        ['The final boss of Beginner level', 'Beginner level ka final boss'],
        [
          [
            'The school office is preparing its annual report and has sent eight requests covering every skill from this level: projection, aliases, DISTINCT, filters with all operators, NULL handling, three-level sorting, Top-N with LIMIT and OFFSET, and one gentle preview of counting. Each request is a small, self-contained deliverable — exactly how real reporting work arrives: as a queue of precise questions.',
            'School office apni annual report taiyar kar rahi hai aur aath requests bheji hain jo is level ki har skill cover karti hain: projection, aliases, DISTINCT, saare operators wale filters, NULL handling, teen-level sorting, LIMIT/OFFSET wala Top-N, aur counting ka ek gentle preview. Har request chhota, self-contained deliverable hai — real reporting kaam bilkul aise hi aata hai: precise sawalon ki queue.',
          ],
          [
            'Work methodically: read the request twice, list the columns, choose the filter, decide the sort, then cap or offset if asked. The validator checks results — so multiple query styles pass, and hints nudge rather than reveal. Finish 3 of 5 tasks plus the quiz to complete the module and unlock Intermediate.',
            'Tariki se kaam karo: request do baar padho, columns list karo, filter chuno, sort decide karo, phir cap ya offset agar maanga hai. Validator results check karta hai — isliye kai query styles pass hote hain, aur hints nudge karte hain reveal nahi. 5 me se 3 tasks aur quiz complete karke module poora karo aur Intermediate unlock karo.',
          ],
        ],
        [
          ['Read → columns → filter → sort → cap', 'Padho → columns → filter → sort → cap'],
          ['Result validation, not text matching', 'Result validation, text matching nahi'],
          ['3/5 tasks + 70% quiz = level complete', '3/5 tasks + 70% quiz = level complete'],
        ],
        'limit-paginate'
      ),
      section(
        ['What "report quality" means', 'Report quality ka matlab'],
        [
          [
            'A report query is judged on four things: right columns (exactly what was asked), right rows (the filter the office meant, not almost), right order (stated explicitly, never left to chance), and right shape (capped, paginated, deduplicated as requested). Textbook SQL is correct syntax; report SQL is correct meaning.',
            'Report query char cheezon par judge hoti hai: sahi columns (exactly jo maanga gaya), sahi rows (office ka matlab, lagbhag nahi), sahi order (saaf likha hua, chance par kabhi nahi), aur sahi shape (cap, paginated, dedup jaisa maanga). Textbook SQL sahi syntax hai; report SQL sahi matlab hai.',
          ],
          [
            'When you finish, the Intermediate level opens with the E-Commerce database: customers, products, orders and payments — twice the tables, real money, and the analytics toolset: aggregates, GROUP BY, subqueries and JOINs.',
            'Khatam karte hi Intermediate level khulta hai E-Commerce database ke saath: customers, products, orders aur payments — dugni tables, real paise, aur analytics toolset: aggregates, GROUP BY, subqueries aur JOINs.',
          ],
        ]
      ),
    ],
    tutorial: {
      title: ['A report request, dissected', 'Ek report request, chiir-faad'],
      steps: [
        step(null, [
          'Watch the five questions you should ask of every request — applied to one real example.',
          'Har request se poochne wale paanch sawal — ek real example par dekho.',
        ]),
        step('-- "Senior Delhi students for the awards night"\nSELECT name, age\nFROM students\nWHERE city = \'Delhi\' AND age >= 18;', [
          'Q1 Which columns? name, age. Q2 Which rows? Delhi AND adults. Both answered.',
          'Q1 Kaunse columns? name, age. Q2 Kaunsi rows? Delhi AUR bade. Dono jawab de diye.',
        ], { table: 'students', highlightWhere: "city = 'Delhi' AND age >= 18" }),
        step('-- Q3 What order? "Most senior first"\nSELECT name, age FROM students\nWHERE city = \'Delhi\' AND age >= 18\nORDER BY age DESC;', [
          'Sorting is stated explicitly — never implied.',
          'Sorting saaf likhi jaati hai — kabhi imply nahi.',
        ], { table: 'students', highlightWhere: "city = 'Delhi' AND age >= 18" }),
        step('-- Q4 What shape? "The top 3"\nSELECT name, age FROM students\nWHERE city = \'Delhi\' AND age >= 18\nORDER BY age DESC, name\nLIMIT 3;', [
          'The cap turns a filter into a podium.',
          'Cap filter ko podium bana deta hai.',
        ], { table: 'students', highlightWhere: "city = 'Delhi' AND age >= 18" }),
        step('SELECT COUNT(*) AS delhi_seniors\nFROM students\nWHERE city = \'Delhi\' AND age >= 18;', [
          'Q5 Number or rows? Sometimes the answer is a count — a preview of the aggregate level ahead.',
          'Q5 Number ya rows? Kabhi jawab count hota hai — aage wale aggregate level ka preview.',
        ], { run: true, table: 'students', highlightWhere: "city = 'Delhi' AND age >= 18" }),
      ],
    },
    syntax: {
      template: '-- The complete Beginner template:\nSELECT columns [AS aliases]\nFROM table\n[WHERE conditions]\n[ORDER BY col1 [dir], col2 [dir]]\n[LIMIT n [OFFSET m]];',
      parts: [
        { part: 'SELECT …', description: ['Projection + aliases', 'Projection + aliases'] },
        { part: 'WHERE …', description: ['=, <>, ranges, IN, LIKE, IS NULL, AND/OR/NOT', '=, <>, ranges, IN, LIKE, IS NULL, AND/OR/NOT'] },
        { part: 'ORDER BY …', description: ['Deterministic sequence with tiebreaks', 'Tiebreaks ke saath deterministic sequence'] },
        { part: 'LIMIT …', description: ['Top-N and pagination', 'Top-N aur pagination'] },
      ],
    },
    examples: [
      example('easy', "SELECT name, city FROM students WHERE city IN ('Delhi','Mumbai') ORDER BY city, name;", [
        'A clean grouped listing — two cities, sorted inside.',
        'Saaf grouped listing — do cities, andar sorted.',
      ]),
      example('medium', 'SELECT name, age FROM students WHERE age BETWEEN 18 AND 20 AND grade IS NOT NULL ORDER BY age DESC, name LIMIT 10;', [
        'Range + NULL guard + two-level sort + cap: a genuine report query.',
        'Range + NULL guard + do-level sort + cap: asli report query.',
      ]),
      example('hard', 'SELECT DISTINCT city FROM students WHERE grade = \'A\' ORDER BY city;', [
        'Which cities produce honour students — unique, filtered, sorted.',
        'Kaunsi cities honour students deti hain — unique, filtered, sorted.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Almost-right filters (city OR grade when the office said AND)', 'Lagbhag-sahi filters (office ne AND bola tha par city OR grade)'],
        ['Report requests hinge on operator choices. Re-read the sentence; look for "and", "or", "except", "only", "at least".', 'Report requests operators par khadi hoti hain. Sentence dobara padho; "and", "or", "except", "only", "at least" dhoondo.']
      ),
      mistake(
        ['Skipping ORDER BY because results "look sorted anyway"', 'Results "waise bhi sorted dikhte hain" isliye ORDER BY chhod dena'],
        ['Looks are accidents; reports are contracts. If a sequence matters, write it.', 'Dikhte hue accident hain; reports contract hain. Sequence matter karta hai to likho.']
      ),
      mistake(
        ['One giant query instead of eight small ones', 'Aath choti queries ki jagah ek giant query'],
        ['Deliverables are separate — one statement per request. Composite monsters are harder to validate and debug.', 'Deliverables alag hain — har request ek statement. Composite monsters validate aur debug karne me mushkil.']
      ),
    ],
    summary: [
      ['Eight requests, every Beginner skill, one project', 'Aath requests, har Beginner skill, ek project'],
      ['Report quality = columns, rows, order, shape', 'Report quality = columns, rows, order, shape'],
      ['Result-matching validates meaning, not wording', 'Result-matching matlab validate karta hai, wording nahi'],
      ['Next stop: E-Commerce analytics', 'Agla station: E-Commerce analytics'],
    ],
    quiz: [
      mcq(
        ['The office asks for "the top 5 paid teachers". Which pieces does the query need?', 'Office "top 5 paid teachers" maangti hai. Query me kaunse tukde chahiye?'],
        [
          ['Projection only', 'Sirf projection'],
          ['Projection + ORDER BY salary DESC + LIMIT 5', 'Projection + ORDER BY salary DESC + LIMIT 5'],
          ['WHERE salary > 5', 'WHERE salary > 5'],
          ['DISTINCT salary', 'DISTINCT salary'],
        ],
        1,
        ['"Top 5" = sort by the ranking column descending, then cap at five.', '"Top 5" = ranking column se utarte sort karo, phir paanch par rokо.']
      ),
      outputQ(
        "SELECT COUNT(*) FROM students WHERE city = 'Mumbai';",
        ['The Mumbai cohort size?', 'Mumbai cohort ka size?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[8]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[7]] } },
          { label: 'C', result: { columns: ['COUNT(*)'], rows: [[50]] } },
          { label: 'D', result: { error: 'Error: no such column: Mumbai' } },
        ],
        0,
        ['Eight students live in Mumbai — one less than Delhi\'s… actually Delhi has 7, Mumbai tops with 8.', 'Aath students Mumbai me rehte hain — Delhi ke 7 se ek zyada… haan, Mumbai 8 ke saath top par hai.']
      ),
      buildQ(
        ['Build page one of the payroll board: top 3 names by salary', 'Payroll board ka page one banao: salary se top 3 naam'],
        ['FROM', 'teachers', 'ORDER', 'SELECT', 'name', 'BY', 'salary', 'DESC', 'LIMIT', '3'],
        ['SELECT', 'name', 'FROM', 'teachers', 'ORDER', 'BY', 'salary', 'DESC', 'LIMIT', '3'],
        ['Sort, cap, done.', 'Sort, cap, ho gaya.']
      ),
      blanksQ(
        "SELECT DISTINCT city FROM students ORDER ___ city LIMIT ___;",
        [
          { options: ['BY', 'ON', 'WITH', 'AS'], correct: 'BY' },
          { options: ['3', 'ALL', '*', '0'], correct: '3' },
        ],
        ['ORDER BY sorts the unique list; LIMIT caps it.', 'ORDER BY unique list ko sort karta hai; LIMIT rokta hai.']
      ),
    ],
    tasks: [
      task({
        d: 'easy',
        desc: [
          'REQUEST 1 — Cover page: the school\'s five most experienced teachers, most experienced first, ties by name. Show name and experience_years.',
          'REQUEST 1 — Cover page: school ke paanch sabse experienced teachers, sabse experienced pehle, ties naam se. Name aur experience_years dikhao.',
        ],
        sol: 'SELECT name, experience_years FROM teachers ORDER BY experience_years DESC, name LIMIT 5;',
        hints: [
          ['Two-level descending sort plus a cap.', 'Do-level utarta sort aur ek cap.'],
          ['SELECT name, experience_years FROM teachers ORDER BY experience_years DESC, name LIMIT 5;', 'SELECT name, experience_years FROM teachers ORDER BY experience_years DESC, name LIMIT 5;'],
          ['Vikas Nair (20 years) leads.', 'Vikas Nair (20 saal) sabse aage.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'easy',
        desc: [
          'REQUEST 2 — Contact audit: students with a missing email, sorted by name. Show name only.',
          'REQUEST 2 — Contact audit: email missing wale students, naam se sorted. Sirf naam dikhao.',
        ],
        sol: 'SELECT name FROM students WHERE email IS NULL ORDER BY name;',
        hints: [
          ['The only correct NULL test plus a sort.', 'Sahi NULL test aur ek sort.'],
          ['SELECT name FROM students WHERE email IS NULL ORDER BY name;', 'SELECT name FROM students WHERE email IS NULL ORDER BY name;'],
          ['Nine rows, alphabetical.', 'Nau rows, alphabetical.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'medium',
        desc: [
          'REQUEST 3 — Merit list: graded enrollments (score IS NOT NULL) with score 90 or above, sorted by score descending with id ascending tiebreak. Show student_id, course_id and score.',
          'REQUEST 3 — Merit list: graded enrollments (score IS NOT NULL) jinka score 90 ya usse upar hai, score utarte aur id chadhte tiebreak ke saath sorted. student_id, course_id aur score dikhao.',
        ],
        sol: 'SELECT student_id, course_id, score FROM enrollments WHERE score IS NOT NULL AND score >= 90 ORDER BY score DESC, id ASC;',
        hints: [
          ['Threshold filter, NULL guard, two-level sort.', 'Threshold filter, NULL guard, do-level sort.'],
          ['SELECT student_id, course_id, score FROM enrollments WHERE score IS NOT NULL AND score >= 90 ORDER BY score DESC, id ASC;', 'SELECT student_id, course_id, score FROM enrollments WHERE score IS NOT NULL AND score >= 90 ORDER BY score DESC, id ASC;'],
          ['Perfect 100s lead the list.', 'Perfect 100s list me lead karte hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'medium',
        desc: [
          'REQUEST 4 — Regional roll: students from Delhi, Mumbai or Bangalore, grouped by city (A→Z) and by name within each city. Show name and city.',
          'REQUEST 4 — Regional roll: Delhi, Mumbai ya Bangalore ke students, city (A→Z) se grouped aur har city me naam se. Name aur city dikhao.',
        ],
        sol: "SELECT name, city FROM students WHERE city IN ('Delhi', 'Mumbai', 'Bangalore') ORDER BY city, name;",
        hints: [
          ['IN for the city set; two-level ascending sort.', 'City set ke liye IN; do-level chadhta sort.'],
          ["SELECT name, city FROM students WHERE city IN ('Delhi','Mumbai','Bangalore') ORDER BY city, name;", "SELECT name, city FROM students WHERE city IN ('Delhi','Mumbai','Bangalore') ORDER BY city, name;"],
          ['Bangalore block first (alphabetically), then Delhi, then Mumbai.', 'Bangalore block pehle (alphabetically), phir Delhi, phir Mumbai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'REQUEST 5 — The honour cities: unique cities that have at least one grade-A student, alphabetical. Show the city column only.',
          'REQUEST 5 — Honour cities: wo unique cities jahan kam se kam ek grade-A student hai, alphabetical. Sirf city column dikhao.',
        ],
        sol: "SELECT DISTINCT city FROM students WHERE grade = 'A' ORDER BY city;",
        hints: [
          ['DISTINCT + WHERE + ORDER BY stack in this order.', 'DISTINCT + WHERE + ORDER BY isi order me lagte hain.'],
          ["SELECT DISTINCT city FROM students WHERE grade = 'A' ORDER BY city;", "SELECT DISTINCT city FROM students WHERE grade = 'A' ORDER BY city;"],
          ['Filtering happens before deduplication — that ordering is what makes the answer right.', 'Filtering dedup se pehle hoti hai — yahi ordering jawab ko sahi banati hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'REQUEST 6 — Page 3 of the honour roll: grade-A students sorted by name, rows 11 through 15 (skip 10, take 5). Show name and grade.',
          'REQUEST 6 — Honour roll ka page 3: grade-A students naam se sorted, rows 11 se 15 (10 skip karo, 5 lo). Name aur grade dikhao.',
        ],
        sol: "SELECT name, grade FROM students WHERE grade = 'A' ORDER BY name LIMIT 5 OFFSET 10;",
        hints: [
          ['Sorted slice: LIMIT 5 OFFSET 10.', 'Sorted slice: LIMIT 5 OFFSET 10.'],
          ["SELECT name, grade FROM students WHERE grade = 'A' ORDER BY name LIMIT 5 OFFSET 10;", "SELECT name, grade FROM students WHERE grade = 'A' ORDER BY name LIMIT 5 OFFSET 10;"],
          ['Twelve grade-A students exist — this page shows the last two.', 'Barah grade-A students hain — ye page aakhri do dikhata hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'REQUEST 7 — The compact card: one row with three numbers — total students (aliased total), unique hometowns (hometowns), and students with emails (with_email). Headers checked.',
          'REQUEST 7 — Compact card: ek row me teen numbers — kul students (aliased total), unique hometowns (hometowns), aur email wale students (with_email). Headers check honge.',
        ],
        sol: 'SELECT COUNT(*) AS total, COUNT(DISTINCT city) AS hometowns, COUNT(email) AS with_email FROM students;',
        hints: [
          ['COUNT(*) vs COUNT(DISTINCT) vs COUNT(col) — three flavours in one row.', 'COUNT(*) vs COUNT(DISTINCT) vs COUNT(col) — ek row me teen flavours.'],
          ['SELECT COUNT(*) AS total, COUNT(DISTINCT city) AS hometowns, COUNT(email) AS with_email FROM students;', 'SELECT COUNT(*) AS total, COUNT(DISTINCT city) AS hometowns, COUNT(email) AS with_email FROM students;'],
          ['Expected: 50, 10, 41.', 'Expected: 50, 10, 41.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'very_hard',
        desc: [
          'REQUEST 8 — The watch-list: adults (18+) from non-metro cities (not Delhi, Mumbai, Bangalore, Hyderabad) with grades worse than B (i.e. grade IN (\'C\',\'D\',\'F\')), sorted by grade then name. Show name, city, grade, age. The office calls it "students who need support".',
          'REQUEST 8 — Watch-list: non-metro cities (Delhi, Mumbai, Bangalore, Hyderabad ke alawa) ke bade (18+) students jinke grades B se kharab hain (yaani grade IN (\'C\',\'D\',\'F\')), grade phir naam se sorted. Name, city, grade, age dikhao. Office isse "support chahiye wale students" kehti hai.',
        ],
        sol: "SELECT name, city, grade, age FROM students WHERE age >= 18 AND city NOT IN ('Delhi','Mumbai','Bangalore','Hyderabad') AND grade IN ('C','D','F') ORDER BY grade, name;",
        hints: [
          ['Three conditions: age, city exclusion set, grade set.', 'Teen conditions: age, city exclusion set, grade set.'],
          ["SELECT name, city, grade, age FROM students WHERE age >= 18 AND city NOT IN ('Delhi','Mumbai','Bangalore','Hyderabad') AND grade IN ('C','D','F') ORDER BY grade, name;", "SELECT name, city, grade, age FROM students WHERE age >= 18 AND city NOT IN ('Delhi','Mumbai','Bangalore','Hyderabad') AND grade IN ('C','D','F') ORDER BY grade, name;"],
          ['C-grades first, then D, then F — alphabetical grade order.', 'Pehle C-grades, phir D, phir F — alphabetical grade order.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),
];
