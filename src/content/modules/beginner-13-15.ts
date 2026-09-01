'use client';

// Modules 13-15: BETWEEN · IN Operator · LIKE & Wildcards

import { defineModule, section, step, example, mistake, mcq, outputQ, buildQ, blanksQ, task } from '../builder';
import type { Module } from '@/types/content';

export const modules: Module[] = [
  defineModule({
    n: 13,
    title: ['BETWEEN', 'BETWEEN'],
    time: '20 min',
    concepts: ['between', 'range', 'inclusive', 'not between', 'dates', 'numbers'],
    diagram: 'filter',
    objectives: [
      ['Filter ranges with BETWEEN, including both boundaries', 'BETWEEN se range filter karna, dono boundaries shaamil'],
      ['Use NOT BETWEEN for exclusions', 'Exclusions ke liye NOT BETWEEN use karna'],
      ['Apply BETWEEN to numbers, text and dates', 'Numbers, text aur dates par BETWEEN lagana'],
    ],
    theory: [
      section(
        ['Ranges without clunky comparisons', 'Bina bhari comparisons ke ranges'],
        [
          [
            'Age 18 to 20 written as comparisons is age >= 18 AND age <= 20 — readable, but a touch verbose and easy to get subtly wrong (a < instead of <= silently drops the boundary). BETWEEN states the intent directly: age BETWEEN 18 AND 20. It is inclusive on both ends — 18 and 20 both pass — which makes it the natural translation of phrases like "from 18 to 20" or "between ₹100 and ₹500".',
            'Age 18 se 20 ko comparisons me likhne par age >= 18 AND age <= 20 — padhne layak, par thoda lamba aur chup-galti ka risk (< ki jagah <= boundary chhod deta hai). BETWEEN matlab seedha boleta hai: age BETWEEN 18 AND 20. Dono ends inclusive hain — 18 aur 20 dono pass — isliye "18 se 20 tak" ya "₹100 aur ₹500 ke beech" jaise phrases ka natural translation hai.',
          ],
          [
            'BETWEEN works on numbers, text and dates alike — anything comparable. On dates it is a favourite for reporting windows: enrollment_date BETWEEN \'2023-06-15\' AND \'2023-06-30\' captures a fortnight exactly, boundaries included.',
            'BETWEEN numbers, text aur dates — kisi bhi comparable cheez par chalta hai. Dates par reporting window ka favourite hai: enrollment_date BETWEEN \'2023-06-15\' AND \'2023-06-30\' ek poora fortnight pakadta hai, boundaries shaamil.',
          ],
        ],
        [],
        'filter'
      ),
      section(
        ['Inclusive boundaries and the inversion', 'Inclusive boundaries aur ulta'],
        [
          [
            'The number-one interview question about BETWEEN: are the endpoints included? Yes — always, in every major engine. WHERE score BETWEEN 60 AND 79 includes both 60 and 79. If you need to exclude an endpoint, either shift the value or fall back to explicit comparisons.',
            'BETWEEN ka number-one interview sawal: endpoints included hain? Haan — hamesha, har bade engine me. WHERE score BETWEEN 60 AND 79 me 60 aur 79 dono aate hain. Endpoint nikaalna ho to value shift karo ya explicit comparisons par wapas jao.',
          ],
          [
            'NOT BETWEEN excludes the whole closed range and keeps everything else — the opposite band, boundaries dropped on both sides. Students NOT BETWEEN 18 AND 20 keeps 17 and 21 but never 18, 19 or 20. Like all negations on NULL-able columns, rows with NULL age disappear entirely.',
            'NOT BETWEEN poora closed range hata kar baaki sab rakhta hai — ulta band, dono boundaries bahar. Students NOT BETWEEN 18 AND 20 me 17 aur 21 rehte hain par 18, 19, 20 kabhi nahi. NULL-able columns par har negation ki tarah, NULL age wali rows poora gayab ho jaati hain.',
          ],
        ],
        [
          ['BETWEEN a AND b ≡ >= a AND <= b', 'BETWEEN a AND b ≡ >= a AND <= b'],
          ['Both endpoints included — always', 'Dono endpoints shaamil — hamesha'],
          ['NOT BETWEEN keeps everything outside the range', 'NOT BETWEEN range ke bahar ka sab rakhta hai'],
          ['NULL rows vanish from both forms', 'NULL rows dono forms me gayab'],
        ]
      ),
    ],
    tutorial: {
      title: ['Capturing a range', 'Range pakadna'],
      steps: [
        step(null, [
          'The exam office wants the "core age band" of 17 to 19. We build it with BETWEEN and then flip it with NOT.',
          'Exam office 17 se 19 ka "core age band" chahti hai. Hum BETWEEN se banate hain aur phir NOT se ulta karte hain.',
        ]),
        step('SELECT name, age FROM students WHERE age >= 17 AND age <= 19;', [
          'The comparison form — correct but wordy.',
          'Comparison form — sahi par lamba.',
        ], { table: 'students', highlightWhere: 'age >= 17 AND age <= 19' }),
        step('SELECT name, age FROM students WHERE age BETWEEN 17 AND 19;', [
          'The same rows, stated as a single readable range.',
          'Wahi rows, ek readable range ki tarah.',
        ], { table: 'students', highlightWhere: 'age BETWEEN 17 AND 19' }),
        step('SELECT name, age FROM students WHERE age NOT BETWEEN 17 AND 19;', [
          'The complement: 16 and 20+ students only.',
          'Complement: sirf 16 aur 20+ wale students.',
        ], { table: 'students', highlightWhere: 'age NOT BETWEEN 17 AND 19' }),
        step("SELECT name, enrollment_date FROM students WHERE enrollment_date BETWEEN '2023-06-15' AND '2023-06-20';", [
          'Date ranges work identically — ISO order guarantees correctness.',
          'Date ranges bhi waise hi — ISO order correctness guarantee karta hai.',
        ], { run: true, table: 'students', highlightWhere: "enrollment_date BETWEEN '2023-06-15' AND '2023-06-20'" }),
      ],
    },
    syntax: {
      template: 'WHERE col BETWEEN low AND high\nWHERE col NOT BETWEEN low AND high',
      parts: [
        { part: 'BETWEEN low AND high', description: ['Inclusive closed range', 'Inclusive closed range'] },
        { part: 'NOT BETWEEN', description: ['Everything outside the range', 'Range ke bahar ka sab'] },
        { part: 'AND', description: ['Separates the two bounds (part of BETWEEN)', 'Dono bounds ko alag karta hai (BETWEEN ka hissa)'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT name, age FROM students WHERE age BETWEEN 18 AND 20;', [
        'The core adult band, 18 and 20 included.',
        'Core adult band, 18 aur 20 shaamil.',
      ]),
      example('easy', 'SELECT name, salary FROM teachers WHERE salary BETWEEN 50000 AND 78000;', [
        'The mid-pay band — five teachers.',
        'Mid-pay band — paanch teachers.',
      ]),
      example('medium', "SELECT name, enrollment_date FROM students WHERE enrollment_date BETWEEN '2023-06-18' AND '2023-06-25';", [
        'A one-week enrolment window, boundaries included.',
        'Ek hafta ka enrolment window, boundaries shaamil.',
      ]),
      example('hard', "SELECT name, grade FROM students WHERE grade BETWEEN 'B' AND 'D';", [
        'Text ranges are alphabetical: B, C and D included.',
        'Text ranges alphabetical hote hain: B, C aur D shaamil.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Expecting BETWEEN to exclude the endpoints', 'BETWEEN ke endpoints ko exclude hone ki ummeed'],
        ['Both bounds are included. BETWEEN 18 AND 20 is >= 18 AND <= 20 — no more, no less.', 'Dono bounds shaamil hain. BETWEEN 18 AND 20 matlab >= 18 AND <= 20 — na kam, na zyada.']
      ),
      mistake(
        ['Reversing the bounds: BETWEEN 20 AND 18', 'Bounds ulta karna: BETWEEN 20 AND 18'],
        ['The lower bound must come first. A reversed BETWEEN matches nothing (no value is >= 20 and <= 18).', 'Lower bound pehle aana chahiye. Ulta BETWEEN kuch match nahi karta (koi value >= 20 aur <= 18 nahi hoti).']
      ),
      mistake(
        ['Using BETWEEN for DATETIME ranges that include the final day', 'Aakhri din shaamil karne ke liye DATETIME par BETWEEN'],
        ['With DATETIME, end at day start excludes that day\'s times. Use < next-day or date-only columns — our data uses DATE for exactly this reason.', 'DATETIME ke saath din ki shuruaat par rok lagane se us din ke times chhut jaate hain. < next-day use karo ya date-only columns — hamara data isi wajah se DATE use karta hai.']
      ),
    ],
    summary: [
      ['BETWEEN states inclusive ranges readably', 'BETWEEN inclusive ranges ko saaf-saaf batata hai'],
      ['Endpoints always included in every engine', 'Har engine me endpoints hamesha shaamil'],
      ['NOT BETWEEN keeps the outside band', 'NOT BETWEEN bahar wala band rakhta hai'],
      ['Works on numbers, text and ISO dates', 'Numbers, text aur ISO dates par chalta hai'],
    ],
    quiz: [
      mcq(
        ['Which rows does WHERE age BETWEEN 18 AND 20 keep?', 'WHERE age BETWEEN 18 AND 20 kaunsi rows rakhta hai?'],
        [
          ['18 and 20 only', 'Sirf 18 aur 20'],
          ['19 only', 'Sirf 19'],
          ['18, 19 and 20', '18, 19 aur 20'],
          ['Everything except 18–20', '18–20 ke alawa sab'],
        ],
        2,
        ['BETWEEN is inclusive on both boundaries — 18, 19, 20 all pass.', 'BETWEEN dono boundaries par inclusive hai — 18, 19, 20 teeno pass.']
      ),
      outputQ(
        'SELECT COUNT(*) FROM students WHERE age NOT BETWEEN 17 AND 19;',
        ['How many students are outside the 17-19 core band?', '17-19 core band ke bahar kitne students hain?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[9]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[41]] } },
          { label: 'C', result: { columns: ['COUNT(*)'], rows: [[0]] } },
          { label: 'D', result: { error: 'Error: near "NOT": syntax error' } },
        ],
        0,
        ['41 students are 17-19; the 9 others (16-year-olds and 20/21-year-olds) remain.', '41 students 17-19 hain; baqi 9 (16 saal aur 20/21 saal wale) reh jaate hain.']
      ),
      buildQ(
        ['Build: teachers with 5 to 15 years of experience', 'Banao: 5 se 15 saal experience wale teachers'],
        ['WHERE', 'BETWEEN', '5', 'AND', '15', 'SELECT', 'name', 'FROM', 'teachers', 'experience_years'],
        ['SELECT', 'name', 'FROM', 'teachers', 'WHERE', 'experience_years', 'BETWEEN', '5', 'AND', '15'],
        ['Column, BETWEEN, low, AND, high.', 'Column, BETWEEN, low, AND, high.']
      ),
      blanksQ(
        'SELECT name FROM students WHERE age ___ 18 ___ 20;',
        [
          { options: ['BETWEEN', 'IN', 'LIKE', 'FROM'], correct: 'BETWEEN' },
          { options: ['AND', 'TO', 'OR', 'UNTIL'], correct: 'AND' },
        ],
        ['BETWEEN … AND … defines the closed range.', 'BETWEEN … AND … closed range define karta hai.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The young-adults programme serves ages 18 through 20 inclusive. Show name and age.',
          'Young-adults programme 18 se 20 (shaamil) tak ki umar serve karta hai. Name aur age dikhao.',
        ],
        sol: 'SELECT name, age FROM students WHERE age BETWEEN 18 AND 20;',
        hints: [
          ['One BETWEEN clause, bounds inclusive.', 'Ek BETWEEN clause, bounds inclusive.'],
          ['SELECT name, age FROM students WHERE age BETWEEN 18 AND 20;', 'SELECT name, age FROM students WHERE age BETWEEN 18 AND 20;'],
          ['Equivalent comparisons form also passes.', 'Equivalent comparisons form bhi pass hoti hai.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'Mid-band payroll review: teachers earning from 50000 to 78000 inclusive. Show name and salary.',
          'Mid-band payroll review: 50000 se 78000 (shaamil) kamane wale teachers. Name aur salary dikhao.',
        ],
        sol: 'SELECT name, salary FROM teachers WHERE salary BETWEEN 50000 AND 78000;',
        hints: [
          ['Money ranges behave exactly like number ranges.', 'Money ranges bilkul number ranges jaisi hain.'],
          ['SELECT name, salary FROM teachers WHERE salary BETWEEN 50000 AND 78000;', 'SELECT name, salary FROM teachers WHERE salary BETWEEN 50000 AND 78000;'],
          ['Five teachers fall in this band.', 'Paanch teachers is band me aate hain.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'June 15-30 enrolment window audit: students who enrolled between 2023-06-15 and 2023-06-30 (both days included). Show name and enrollment_date.',
          '15-30 June enrolment window audit: 2023-06-15 aur 2023-06-30 ke beech (dono din shaamil) enrolle hue students. Name aur enrollment_date dikhao.',
        ],
        sol: "SELECT name, enrollment_date FROM students WHERE enrollment_date BETWEEN '2023-06-15' AND '2023-06-30';",
        hints: [
          ['ISO date strings compare correctly inside BETWEEN.', 'ISO date strings BETWEEN me sahi compare hoti hain.'],
          ["SELECT name, enrollment_date FROM students WHERE enrollment_date BETWEEN '2023-06-15' AND '2023-06-30';", "SELECT name, enrollment_date FROM students WHERE enrollment_date BETWEEN '2023-06-15' AND '2023-06-30';"],
          ['June enrolments dominate this dataset.', 'June ke enrolments is dataset me zyada hain.'],
        ],
      }),
      task({
        d: 'hard',
        desc: [
          'Remedial programme: students OUTSIDE the 17-19 age band (strictly younger or older). Show name and age.',
          'Remedial programme: 17-19 age band ke BAHAR ke students (strictly chhote ya bade). Name aur age dikhao.',
        ],
        sol: 'SELECT name, age FROM students WHERE age NOT BETWEEN 17 AND 19;',
        hints: [
          ['NOT BETWEEN keeps the complement band.', 'NOT BETWEEN complement band rakhta hai.'],
          ['SELECT name, age FROM students WHERE age NOT BETWEEN 17 AND 19;', 'SELECT name, age FROM students WHERE age NOT BETWEEN 17 AND 19;'],
          ['Nine students (age 16, 20 or 21) appear.', 'Nau students (age 16, 20 ya 21) dikhte hain.'],
        ],
      }),
      task({
        d: 'very_hard',
        desc: [
          'Alphabet slice for the printed directory: students whose names fall alphabetically between \'A\' and \'D\' inclusive — i.e. name BETWEEN \'A\' AND \'D\' — combined with the adult band (age BETWEEN 18 AND 20). Show name and age. (Text ranges are alphabetical; every name starting A-D qualifies, since longer strings like \'Divya\' extend past \'D\' only when compared in full — test and observe.)',
          'Print directory ke liye alphabetical slice: jinke naam \'A\' se \'D\' tak (shaamil) aate hain — yaani name BETWEEN \'A\' AND \'D\' — adult band (age BETWEEN 18 AND 20) ke saath. Name aur age dikhao. (Text ranges alphabetical hain; A-D se shuru har naam qualify karta hai — test karke dekho.)',
        ],
        sol: "SELECT name, age FROM students WHERE name BETWEEN 'A' AND 'D' AND age BETWEEN 18 AND 20;",
        hints: [
          ['Two BETWEEN clauses joined by AND.', 'AND se jude do BETWEEN clauses.'],
          ["SELECT name, age FROM students WHERE name BETWEEN 'A' AND 'D' AND age BETWEEN 18 AND 20;", "SELECT name, age FROM students WHERE name BETWEEN 'A' AND 'D' AND age BETWEEN 18 AND 20;"],
          ["Careful: 'D' alone excludes names starting D followed by letters (e.g. 'Deepak') — that edge behaviour is exactly what the task asks you to observe.", "Dhyan: sirf 'D' un naam ko exclude karta hai jo D se shuru hote hain (jaise 'Deepak') — yahi edge behaviour task dekhne ko kehta hai."],
        ],
      }),
    ],
  }),

  defineModule({
    n: 14,
    title: ['IN Operator', 'IN Operator'],
    time: '20 min',
    concepts: ['in', 'not in', 'set membership', 'list', 'multiple values', 'subquery'],
    diagram: 'filter',
    objectives: [
      ['Match a column against a list of values with IN', 'IN se column ko values ki list se match karna'],
      ['Replace long OR chains with clean IN lists', 'Lambi OR chains ki jagah saaf IN lists'],
      ['Use NOT IN and know its NULL danger', 'NOT IN use karna aur uska NULL khatra jaanna'],
    ],
    theory: [
      section(
        ['Set membership, in one word', 'Ek shabd me set membership'],
        [
          [
            'Filtering "Delhi, Mumbai, Bangalore or Hyderabad" with ORs repeats the column four times: city = \'Delhi\' OR city = \'Mumbai\' OR …. IN compresses the whole idea: city IN (\'Delhi\', \'Mumbai\', \'Bangalore\', \'Hyderabad\'). Read it as "the city is a member of this list" — one condition, any number of values, no column repetition.',
            '"Delhi, Mumbai, Bangalore ya Hyderabad" ko ORs se filter karna column ko chaar baar repeat karta hai: city = \'Delhi\' OR city = \'Mumbai\' OR …. IN poora idea compress karta hai: city IN (\'Delhi\', \'Mumbai\', \'Bangalore\', \'Hyderabad\'). Ise padho "city is list ka member hai" — ek condition, koi bhi number of values, column repeat nahi.',
          ],
          [
            'IN shines exactly when a business question names a set: "these five payment methods", "our top three cities", "these product SKUs". It scales to hundreds of values, stays readable, and later accepts a subquery as its list — which is where it becomes a genuinely advanced tool (Module 29).',
            'IN exactly tab chamkta hai jab business sawal set batata hai: "ye paanch payment methods", "hamari top teen cities", "ye product SKUs". Yeh sainkdon values tak scale karta hai, readable rehta hai, aur baad me apni list ke roop me subquery bhi leta hai — wahi isse advanced tool banata hai (Module 29).',
          ],
        ],
        [],
        'filter'
      ),
      section(
        ['NOT IN and the NULL trap', 'NOT IN aur NULL ka trap'],
        [
          [
            'NOT IN keeps rows whose value is outside the list: city NOT IN (\'Delhi\') gives everyone else. But beware the classic trap: if the list contains a NULL — say (\'Delhi\', NULL) — NOT IN returns NOTHING at all, forever, because "x not equal to NULL" is unknown for every row. A missing value poisons the whole NOT IN list.',
            'NOT IN wahi rows rakhta hai jinki value list ke bahar ho: city NOT IN (\'Delhi\') sab baaki deta hai. Par classic trap: agar list me NULL ho — maano (\'Delhi\', NULL) — to NOT In KUCH bhi nahi laata, hamesha, kyunki "x not equal to NULL" har row ke liye unknown hai. Ek missing value poora NOT IN list zeher bana deti hai.',
          ],
          [
            'Plain IN is NULL-safe in the benign direction: NULL rows simply never match (unknown is not a member). The professional habit: use IN freely; treat NOT IN with respect, and prefer NOT EXISTS or a LEFT JOIN check when the list might contain NULLs — those arrive in the intermediate level.',
            'Plain IN NULL-safe hai bhedbhav nahi karta: NULL rows bas kabhi match nahi hoti (unknown member nahi). Professional aadat: IN aaram se use karo; NOT IN ko izzat do, aur jab list me NULL ho sakte hain to NOT EXISTS ya LEFT JOIN check prefer karo — wo intermediate level me aayenge.',
          ],
        ],
        [
          ['IN replaces OR chains on one column', 'IN ek column par OR chains ki jagah'],
          ['Any number of values in the parentheses', 'Parentheses me koi bhi number of values'],
          ['NOT IN + NULL in list = zero rows', 'NOT IN + list me NULL = zero rows'],
          ['IN accepts a subquery as its list (later)', 'IN apni list me subquery leta hai (baad me)'],
        ]
      ),
    ],
    tutorial: {
      title: ['The metro set', 'Metro set'],
      steps: [
        step(null, [
          'A programme targets the four metros. We compare the OR-chain and IN forms, then flip to NOT IN.',
          'Ek programme chaar metros ko target karta hai. Hum OR-chain aur IN forms compare karte hain, phir NOT IN par aate hain.',
        ]),
        step("SELECT name, city FROM students WHERE city = 'Delhi' OR city = 'Mumbai' OR city = 'Bangalore' OR city = 'Hyderabad';", [
          'The verbose way — four repetitions of the column.',
          'Lamba tareeka — column ke chaar repeats.',
        ], { table: 'students', highlightWhere: "city IN ('Delhi','Mumbai','Bangalore','Hyderabad')" }),
        step("SELECT name, city FROM students WHERE city IN ('Delhi', 'Mumbai', 'Bangalore', 'Hyderabad');", [
          'The IN form — same rows, one condition, scales to any list size.',
          'IN form — wahi rows, ek condition, kisi bhi list size tak scale.',
        ], { table: 'students', highlightWhere: "city IN ('Delhi','Mumbai','Bangalore','Hyderabad')" }),
        step("SELECT name, city FROM students WHERE city NOT IN ('Delhi', 'Mumbai', 'Bangalore', 'Hyderabad');", [
          'The complement: students from every other city.',
          'Complement: har doosri city ke students.',
        ], { table: 'students', highlightWhere: "city NOT IN ('Delhi','Mumbai','Bangalore','Hyderabad')" }),
        step("SELECT name, city FROM students WHERE city IN ('Jaipur', 'Lucknow');", [
          'A shorter set — two cities, one tidy condition.',
          'Chhota set — do cities, ek saaf condition.',
        ], { run: true, table: 'students', highlightWhere: "city IN ('Jaipur','Lucknow')" }),
      ],
    },
    syntax: {
      template: "WHERE col IN (v1, v2, v3)\nWHERE col NOT IN (v1, v2, v3)",
      parts: [
        { part: 'IN (list)', description: ['Value matches any list member', 'Value list ke kisi member se match ho'] },
        { part: 'NOT IN (list)', description: ['Value matches no list member', 'Value list ke kisi member se match na ho'] },
        { part: '( )', description: ['Comma-separated values, quoted if text', 'Comma-separated values, text ho to quoted'] },
      ],
    },
    examples: [
      example('very_easy', "SELECT name, city FROM students WHERE city IN ('Pune', 'Jaipur');", [
        'A two-city set, no column repetition.',
        'Do-city set, column repeat nahi.',
      ]),
      example('easy', "SELECT name FROM teachers WHERE subject IN ('Physics', 'Chemistry');", [
        'The science faculty in one condition.',
        'Ek condition me science faculty.',
      ]),
      example('medium', "SELECT name, grade FROM students WHERE grade IN ('A', 'B');", [
        'The passing-with-honours set: grades A and B.',
        'Passing-with-honours set: grades A aur B.',
      ]),
      example('hard', "SELECT name, city FROM students WHERE city NOT IN ('Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow', 'Ahmedabad') OR city IS NULL;", [
        'NOT IN with the full city list — plus the IS NULL guard, because NULL cities vanish otherwise.',
        'Poore city list ke saath NOT IN — aur IS NULL guard, kyunki NULL cities warna gayab ho jaati hain.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Leaving out quotes in IN lists: IN (Delhi, Mumbai)', 'IN list me quotes chhodna: IN (Delhi, Mumbai)'],
        ['Unquoted names parse as columns — "no such column: Delhi". Text values need single quotes.', 'Bina quote ke naam columns ban jaate hain — "no such column: Delhi". Text values ko single quotes chahiye.']
      ),
      mistake(
        ['NOT IN with a possibly-NULL subquery list', 'Ho sakta hai NULL wali subquery list ke saath NOT IN'],
        ['One NULL member makes NOT IN return zero rows. With our data, city is never NULL — but learn the trap now, before you meet it at work.', 'Ek NULL member NOT IN ko zero rows de deta hai. Hamare data me city kabhi NULL nahi — par abhi trap seekh lo, kaam par milne se pehle.']
      ),
      mistake(
        ['Using IN to compare multiple columns at once', 'Ek saath kai columns compare karne ke liye IN use karna'],
        ['IN tests one column against values. For row-wise comparison of column pairs, you need ORs of tuples or EXISTS (later).', 'IN ek column ko values se test karta hai. Column pairs ki row-wise comparison ke liye tuples ke ORs ya EXISTS chahiye (baad me).']
      ),
    ],
    summary: [
      ['IN matches a column against a value list', 'IN column ko value list se match karta hai'],
      ['Cleaner and safer than OR chains on one column', 'Ek column par OR chains se saaf aur safe'],
      ['NOT IN is dangerous with NULLs in the list', 'List me NULL ke saath NOT IN khatarnak hai'],
      ['IN later accepts subqueries — a big-level tool', 'IN baad me subqueries leta hai — bade level ka tool'],
    ],
    quiz: [
      mcq(
        ["What does city IN ('Delhi', 'Mumbai') NOT do that an OR chain does?", "city IN ('Delhi', 'Mumbai') wo kya NAHI karta jo OR chain karti hai?"],
        [
          ['Return rows for either city', 'Kisi bhi city ki rows dena'],
          ['Repeat the column name for each value', 'Har value ke liye column ka naam repeat karna'],
          ['Filter rows by equality', 'Equality se rows filter karna'],
          ['Work with text values', 'Text values ke saath kaam karna'],
        ],
        1,
        ['IN compresses the same logic without repeating the column — same results, cleaner statement.', 'IN wahi logic column repeat kiye bina compress karta hai — same result, saaf statement.']
      ),
      outputQ(
        "SELECT COUNT(*) FROM students WHERE city IN ('Delhi', 'Mumbai', 'Bangalore', 'Hyderabad');",
        ['Students from the four metros — total?', 'Chaar metros ke students — total?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[31]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[15]] } },
          { label: 'C', result: { columns: ['COUNT(*)'], rows: [[50]] } },
          { label: 'D', result: { error: 'Error: no such column: Delhi' } },
        ],
        0,
        ['Delhi 7 + Mumbai 8 + Bangalore 8 + Hyderabad 8 = 31 students.', 'Delhi 7 + Mumbai 8 + Bangalore 8 + Hyderabad 8 = 31 students.']
      ),
      buildQ(
        ['Build: students in grades A or B', 'Banao: grade A ya B wale students'],
        ["IN", 'SELECT', 'name', 'FROM', 'students', 'WHERE', 'grade', "('A', 'B')"],
        ['SELECT', 'name', 'FROM', 'students', 'WHERE', 'grade', 'IN', "('A', 'B')"],
        ['Column, IN, parenthesised quoted list.', 'Column, IN, bracket me quoted list.']
      ),
      blanksQ(
        "SELECT name FROM teachers WHERE subject ___ ('Physics', ___);",
        [
          { options: ['IN', 'BETWEEN', 'LIKE', 'IS'], correct: 'IN' },
          { options: ["'Chemistry'", 'Chemistry', 'Biology', 'Mathematics'], correct: "'Chemistry'" },
        ],
        ['IN introduces the list; text members are quoted.', 'IN list laya hai; text members quoted hote hain.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Twin-city event: students from Pune or Jaipur. Show name and city.',
          'Twin-city event: Pune ya Jaipur ke students. Name aur city dikhao.',
        ],
        sol: "SELECT name, city FROM students WHERE city IN ('Pune', 'Jaipur');",
        hints: [
          ['A two-member IN list.', 'Do-member IN list.'],
          ["SELECT name, city FROM students WHERE city IN ('Pune', 'Jaipur');", "SELECT name, city FROM students WHERE city IN ('Pune', 'Jaipur');"],
          ['An OR chain passes too — IN is simply cleaner.', 'OR chain bhi pass hoti hai — IN bas saaf hai.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'Science faculty meeting: teachers of Physics or Chemistry. Show name and subject.',
          'Science faculty meeting: Physics ya Chemistry ke teachers. Name aur subject dikhao.',
        ],
        sol: "SELECT name, subject FROM teachers WHERE subject IN ('Physics', 'Chemistry');",
        hints: [
          ['IN works on any text column.', 'IN kisi bhi text column par chalta hai.'],
          ["SELECT name, subject FROM teachers WHERE subject IN ('Physics', 'Chemistry');", "SELECT name, subject FROM teachers WHERE subject IN ('Physics', 'Chemistry');"],
          ['Four teachers belong to the two science subjects.', 'Chaar teachers do science subjects se belong karte hain.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'The metro tutoring programme covers Delhi, Mumbai, Bangalore and Hyderabad. Show name and city of covered students.',
          'Metro tutoring programme Delhi, Mumbai, Bangalore aur Hyderabad ko cover karta hai. Covered students ka naam aur city dikhao.',
        ],
        sol: "SELECT name, city FROM students WHERE city IN ('Delhi', 'Mumbai', 'Bangalore', 'Hyderabad');",
        hints: [
          ['Four cities, one IN list.', 'Chaar cities, ek IN list.'],
          ["SELECT name, city FROM students WHERE city IN ('Delhi', 'Mumbai', 'Bangalore', 'Hyderabad');", "SELECT name, city FROM students WHERE city IN ('Delhi', 'Mumbai', 'Bangalore', 'Hyderabad');"],
          ['31 students are covered.', '31 students cover hote hain.'],
        ],
      }),
      task({
        d: 'hard',
        desc: [
          'Non-metro outreach: students from any city EXCEPT the four metros. Show name and city.',
          'Non-metro outreach: chaar metros ke ALAWA kisi bhi city ke students. Name aur city dikhao.',
        ],
        sol: "SELECT name, city FROM students WHERE city NOT IN ('Delhi', 'Mumbai', 'Bangalore', 'Hyderabad');",
        hints: [
          ['NOT IN keeps the complement of the list.', 'NOT IN list ka complement rakhta hai.'],
          ["SELECT name, city FROM students WHERE city NOT IN ('Delhi', 'Mumbai', 'Bangalore', 'Hyderabad');", "SELECT name, city FROM students WHERE city NOT IN ('Delhi', 'Mumbai', 'Bangalore', 'Hyderabad');"],
          ['19 students remain (no NULL cities in this data).', '19 students rehte hain (is data me NULL cities nahi hain).'],
        ],
      }),
      task({
        d: 'very_hard',
        desc: [
          'Honour-roll screening: grade-A or grade-B students, aged 16 through 18 (inclusive), from Jaipur, Lucknow or Ahmedabad — three set conditions combined. Show name, grade, age, city.',
          'Honour-roll screening: grade-A ya grade-B students, 16 se 18 saal (shaamil), Jaipur, Lucknow ya Ahmedabad se — teen set conditions jodi hui. Name, grade, age, city dikhao.',
        ],
        sol: "SELECT name, grade, age, city FROM students WHERE grade IN ('A', 'B') AND age BETWEEN 16 AND 18 AND city IN ('Jaipur', 'Lucknow', 'Ahmedabad');",
        hints: [
          ['IN for grades, BETWEEN for the age band, IN for cities — all ANDed.', 'Grades ke liye IN, age band ke liye BETWEEN, cities ke liye IN — sab AND se jude.'],
          ["SELECT name, grade, age, city FROM students WHERE grade IN ('A','B') AND age BETWEEN 16 AND 18 AND city IN ('Jaipur','Lucknow','Ahmedabad');", "SELECT name, grade, age, city FROM students WHERE grade IN ('A','B') AND age BETWEEN 16 AND 18 AND city IN ('Jaipur','Lucknow','Ahmedabad');"],
          ['Very few students pass all three tests — that narrowness is the point of ANDed sets.', 'Bahut kam students teeno tests pass karte hain — yahi tang hona ANDed sets ka point hai.'],
        ],
      }),
    ],
  }),

  defineModule({
    n: 15,
    title: ['LIKE & Wildcards', 'LIKE & Wildcards'],
    time: '25 min',
    concepts: ['like', 'wildcard', 'pattern', 'percent', 'underscore', 'ilike', 'case insensitive'],
    diagram: 'filter',
    objectives: [
      ['Match text patterns with LIKE and % / _ wildcards', 'LIKE aur % / _ wildcards se text patterns match karna'],
      ['Search prefixes, suffixes and substrings', 'Prefixes, suffixes aur substrings search karna'],
      ['Escape wildcards and control case-sensitivity', 'Wildcards escape karna aur case-sensitivity control karna'],
    ],
    theory: [
      section(
        ['Patterns, not exact values', 'Patterns, exact values nahi'],
        [
          [
            'Equality needs the full exact string. But real searches are fuzzy: "names starting with R", "emails ending in .com", "products containing the word Pro". LIKE is SQL\'s pattern matcher: WHERE name LIKE \'R%\' matches every value that starts with capital R. The % wildcard means "any characters, any length, including none".',
            'Equality ko poori exact string chahiye. Par real searches fuzzy hoti hain: "R se shuru hone wale naam", ".com par khatam hone wale emails", "Pro word wale products". LIKE SQL ka pattern matcher hai: WHERE name LIKE \'R%\' har us value se match karta hai jo capital R se shuru hoti hai. % wildcard ka matlab "koi bhi characters, koi bhi length, koi nahi bhi chalega".',
          ],
          [
            'The second wildcard, underscore _, matches exactly ONE character: \'_a%\' finds names whose second letter is a. Combine them: \'%an%\' finds any name containing "an" anywhere (Ananya, Rohan, Divyansh…). % is "anything", _ is "exactly one thing" — that precision difference powers clever patterns.',
            'Doosra wildcard, underscore _, exactly EK character se match karta hai: \'_a%\' un naam ko dhoondhta hai jinka doosra letter a hai. Inhe jodo: \'%an%\' har wo naam dhoondhta hai jisme "an" kahin bhi ho (Ananya, Rohan…). % hai "kuch bhi", _ hai "exactly ek" — yahi precision difference smart patterns banata hai.',
          ],
        ],
        [],
        'filter'
      ),
      section(
        ['Case, escapes and negation', 'Case, escape aur negation'],
        [
          [
            'LIKE is case-sensitive in SQLite: \'r%\' will not match \'Rahul\'. Two portable fixes: store consistent case (our data does), or use LOWER(name) LIKE LOWER(\'R%\') to compare both sides lowercase. MySQL behaves the opposite way (case-insensitive by default) — knowing the difference saves a day of debugging someday.',
            'SQLite me LIKE case-sensitive hai: \'r%\' \'Rahul\' se match nahi karega. Do portable fixes: consistent case store karo (hamara data karta hai), ya LOWER(name) LIKE LOWER(\'R%\') se dono sides lowercase compare karo. MySQL ulta hota hai (default case-insensitive) — yeh difference jaanna kabhi ek din bacha sakta hai.',
          ],
          [
            'To search for a literal % or _ character itself, escape it with your chosen escape char: LIKE \'50\\%\' ESCAPE \'\\\' matches the literal text "50%". And NOT LIKE inverts the pattern — everyone who does not match.',
            'Literal % ya _ character khud dhoondhne ke liye use escape karo: LIKE \'50\\%\' ESCAPE \'\\\' literal text "50%" se match karta hai. Aur NOT LIKE pattern ulta kar deta hai — jo match nahi karte wo sab.',
          ],
        ],
        [
          ['% = any characters (even zero); _ = exactly one', '% = koi bhi characters (zero bhi); _ = exactly ek'],
          ['LIKE \'R%\' prefix; \'%R\' suffix; \'%R%\' contains', 'LIKE \'R%\' prefix; \'%R\' suffix; \'%R%\' contains'],
          ['SQLite LIKE is case-sensitive; LOWER() both sides to be safe', 'SQLite LIKE case-sensitive hai; dono sides LOWER() karo'],
          ['NOT LIKE inverts the pattern', 'NOT LIKE pattern ulta karta hai'],
        ]
      ),
    ],
    tutorial: {
      title: ['Hunting names', 'Naam dhoondhna'],
      steps: [
        step(null, [
          'The office needs "all students whose name starts with R" for roll-call order. We build the pattern step by step.',
          'Office roll-call ke liye "jinke naam R se shuru hote hain" chahti hai. Hum pattern step-by-step banate hain.',
        ]),
        step("SELECT name FROM students WHERE name LIKE 'R%';", [
          "The % stands for 'anything after R' — prefix search.",
          "% ka matlab 'R ke baad kuch bhi' — prefix search.",
        ], { table: 'students', highlightWhere: "name LIKE 'R%'" }),
        step("SELECT name FROM students WHERE name LIKE '%an%';", [
          'Surrounding the fragment with % turns it into a contains-search.',
          'Fragment ke around % laga kar contains-search ban jaata hai.',
        ], { table: 'students', highlightWhere: "name LIKE '%an%'" }),
        step("SELECT name FROM students WHERE name LIKE '_a%';", [
          'Underscore pins the second character to a — exactly one letter.',
          'Underscore doosre character ko a par fix karta hai — exactly ek letter.',
        ], { table: 'students', highlightWhere: "name LIKE '_a%'" }),
        step("SELECT email FROM students WHERE email LIKE '%@example.com';", [
          'Suffix search: every classic email domain in one pattern.',
          'Suffix search: ek pattern me purane email domain ke sab.',
        ], { run: true, table: 'students', highlightWhere: "email LIKE '%@example.com'" }),
      ],
    },
    syntax: {
      template: "WHERE col LIKE 'pattern'\n%  any characters\n_  exactly one character",
      parts: [
        { part: "'R%'", description: ['Starts with R', 'R se shuru'] },
        { part: "'%an%'", description: ['Contains "an" anywhere', 'Kahin bhi "an" ho'] },
        { part: "'_a%'", description: ['Second letter is a', 'Doosra letter a'] },
        { part: 'NOT LIKE', description: ['Everything that does not match', 'Jo match nahi karte wo sab'] },
      ],
    },
    examples: [
      example('very_easy', "SELECT name FROM students WHERE name LIKE 'S%';", [
        'Names starting with S — the attendance call-in list.',
        'S se shuru hone wale naam — attendance call-in list.',
      ]),
      example('easy', "SELECT name FROM teachers WHERE name LIKE '%Verma';", [
        'Suffix search: the Vermas on staff.',
        'Suffix search: staff me Verma ji.',
      ]),
      example('medium', "SELECT name FROM students WHERE name LIKE '%ya%';", [
        'Contains-search: every name with "ya" inside (Ananya, Divya, Aditya…).',
        'Contains-search: jisme "ya" ho (Ananya, Divya, Aditya…).',
      ]),
      example('hard', "SELECT name FROM students WHERE LOWER(name) LIKE 'r%' AND city = 'Delhi';", [
        'Case-controlled prefix search combined with a city filter.',
        'Case-controlled prefix search, city filter ke saath.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Using * as the wildcard (regex habits)', 'Wildcard ki jagah * use karna (regex ki aadat)'],
        ['SQL wildcards are % and _, never *. WHERE name LIKE \'R*\' matches nothing useful.', 'SQL wildcards % aur _ hain, * kabhi nahi. WHERE name LIKE \'R*\' kuch kaam ka nahi deta.']
      ),
      mistake(
        ['Forgetting SQLite LIKE is case-sensitive', 'SQLite LIKE ka case-sensitive hona bhool jaana'],
        ["'r%' misses 'Rahul'. Use the exact stored case, or LOWER() both sides.", "'r%' se 'Rahul' miss ho jaata hai. Exact stored case use karo, ya dono sides LOWER() lagao."],
      ),
      mistake(
        ['Using LIKE for exact equality', 'Exact equality ke liye LIKE use karna'],
        ["LIKE 'Delhi' behaves like = 'Delhi' with overhead. Use = when no wildcards are involved.", "LIKE 'Delhi' ka behaviour = 'Delhi' jaisa hai extra overhead ke saath. Wildcard na ho to = use karo."],
      ),
    ],
    summary: [
      ['LIKE matches patterns: % any characters, _ exactly one', 'LIKE patterns match karta hai: % koi bhi, _ exactly ek'],
      ['%R prefix · R% suffix — wait: R% prefix, %R suffix, %R% contains', 'R% prefix · %R suffix · %R% contains'],
      ['Case-sensitive in SQLite — LOWER() both sides when unsure', 'SQLite me case-sensitive — doubt ho to dono sides LOWER()'],
      ['NOT LIKE inverts; escape literal % and _ with ESCAPE', 'NOT LIKE ulta karta hai; literal %/_ ko ESCAPE se bachao'],
    ],
    quiz: [
      mcq(
        ["Which pattern finds every name whose SECOND letter is 'a'?", "Kaunsa pattern un naam ko dhoondhta hai jinka DOOSRA letter 'a' hai?"],
        [
          ["LIKE 'a%'", "LIKE 'a%'"],
          ["LIKE '_a%'", "LIKE '_a%'"],
          ["LIKE '%a'", "LIKE '%a'"],
          ["LIKE 'a_'", "LIKE 'a_'"],
        ],
        1,
        ['One underscore consumes the first character, then a anchors the second position, % allows the rest.', 'Ek underscore pehla character kha jaata hai, phir a doosri position par baithta hai, % baaki sab allow karta hai.']
      ),
      outputQ(
        "SELECT COUNT(*) FROM students WHERE name LIKE 'R%';",
        ['How many student names start with R?', 'Kitne student naam R se shuru hote hain?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[5]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[50]] } },
          { label: 'C', result: { columns: ['COUNT(*)'], rows: [[0]] } },
          { label: 'D', result: { error: 'Error: near "%": syntax error' } },
        ],
        0,
        ['Five names: Radhika Reddy, Ritu Nair, Ritu Sharma, Rohan Kapoor, Rohan Mehta.', 'Paanch naam: Radhika Reddy, Ritu Nair, Ritu Sharma, Rohan Kapoor, Rohan Mehta.']
      ),
      buildQ(
        ['Build: emails ending with example.com', 'Banao: example.com par khatam hone wale emails'],
        ['SELECT', 'email', 'FROM', 'students', 'WHERE', 'LIKE', "'%@example.com'"],
        ['SELECT', 'email', 'FROM', 'students', 'WHERE', 'email', 'LIKE', "'%@example.com'"],
        ['Column, LIKE, then the suffix pattern.', 'Column, LIKE, phir suffix pattern.']
      ),
      blanksQ(
        "SELECT name FROM students WHERE name LIKE '___%';",
        [{ options: ['_', '%', '*', '.'], correct: '_' }],
        ['Three underscores require at least three characters before the trailing %. A quick length-ish trick.', 'Teen underscores se pehle trailing % hone par kam se kam teen characters chahiye. Ek length-ish trick.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Roll-call prep: students whose names start with \'S\'. Show the names.',
          'Roll-call prep: jinke naam \'S\' se shuru hote hain. Naam dikhao.',
        ],
        sol: "SELECT name FROM students WHERE name LIKE 'S%';",
        hints: [
          ['Prefix search uses trailing %.', 'Prefix search me % aakhir me aata hai.'],
          ["SELECT name FROM students WHERE name LIKE 'S%';", "SELECT name FROM students WHERE name LIKE 'S%';"],
          ['Case matters — data uses capital S.', 'Case matter karta hai — data me capital S hai.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'The Sharma family reunion: students whose family name ends with \'Sharma\'. Show names.',
          'Sharma parivar ka reunion: jinka surname \'Sharma\' hai. Naam dikhao.',
        ],
        sol: "SELECT name FROM students WHERE name LIKE '%Sharma';",
        hints: [
          ['Suffix search uses leading %.', 'Suffix search me % shuru me aata hai.'],
          ["SELECT name FROM students WHERE name LIKE '%Sharma';", "SELECT name FROM students WHERE name LIKE '%Sharma';"],
          ['Several Sharmas are enrolled.', 'Kai Sharma enrolled hain.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'Every name containing "an" — the office is testing fuzzy search. Show the names.',
          'Har naam jisme "an" ho — office fuzzy search test kar rahi hai. Naam dikhao.',
        ],
        sol: "SELECT name FROM students WHERE name LIKE '%an%';",
        hints: [
          ['Surround the fragment with % on both sides.', 'Fragment ke dono taraf % lagao.'],
          ["SELECT name FROM students WHERE name LIKE '%an%';", "SELECT name FROM students WHERE name LIKE '%an%';"],
          ['Ananya, Rohan, Ishaan-style names all qualify.', 'Ananya, Rohan, Ishaan jaise naam sab qualify karte hain.'],
        ],
      }),
      task({
        d: 'hard',
        desc: [
          'IT needs every student email on the classic domain: emails ending with \'@example.com\' — but only students who HAVE an email (NULLs must not appear).',
          'IT ko classic domain par har student email chahiye: \'@example.com\' par khatam hone wale — par sirf un students ke jo email RAKHTE hain (NULL nahi aane chahiye).',
        ],
        sol: "SELECT email FROM students WHERE email LIKE '%@example.com' AND email IS NOT NULL;",
        hints: [
          ['Suffix pattern plus a NULL guard.', 'Suffix pattern aur NULL guard.'],
          ["SELECT email FROM students WHERE email LIKE '%@example.com' AND email IS NOT NULL;", "SELECT email FROM students WHERE email LIKE '%@example.com' AND email IS NOT NULL;"],
          ['LIKE never matches NULL anyway — the guard is belt-and-braces professional style.', 'LIKE NULL se kabhi match nahi karta — guard professional extra-safety hai.'],
        ],
      }),
      task({
        d: 'very_hard',
        desc: [
          'Advanced pattern work: students whose second letter is \'o\' (e.g. Rohan, Mohit) AND whose name does NOT end with \'a\'. Show the names.',
          'Advanced pattern kaam: jinka doosra letter \'o\' ho (jaise Rohan, Mohit) AUR naam \'a\' par khatam NA ho. Naam dikhao.',
        ],
        sol: "SELECT name FROM students WHERE name LIKE '_o%' AND name NOT LIKE '%a';",
        hints: [
          ['_o% pins the second letter; NOT LIKE excludes the suffix.', '_o% doosra letter fix karta hai; NOT LIKE suffix hata deta hai.'],
          ["SELECT name FROM students WHERE name LIKE '_o%' AND name NOT LIKE '%a';", "SELECT name FROM students WHERE name LIKE '_o%' AND name NOT LIKE '%a';"],
          ['Names like Rohan, Mohit, Gaurav survive; Rohana-style endings drop.', 'Rohan, Mohit, Gaurav jaise naam bachte hain; Rohana jaise endings hat jaate hain.'],
        ],
      }),
    ],
  }),
];
