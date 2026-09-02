'use client';

// Modules 04-06: Data Types Overview · SELECT Fundamentals · SELECT Multiple Columns

import { defineModule, section, step, example, mistake, mcq, outputQ, buildQ, blanksQ, task } from './builder';
import type { Module } from '@/types/content';

export const modules: Module[] = [
  defineModule({
    n: 4,
    title: ['Data Types Overview', 'Data Types Overview'],
    time: '20 min',
    concepts: ['data types', 'integer', 'text', 'real', 'date', 'decimal', 'null', 'boolean'],
    diagram: 'data-types',
    objectives: [
      ['Name the core SQLite data types and what they store', 'Core SQLite data types ke naam aur wo kya store karte hain'],
      ['Understand why types matter for correctness and speed', 'Types correctness aur speed me kyun matter karte hain'],
      ['Meet NULL — the marker for missing information', 'NULL se milna — missing information ka marker'],
    ],
    theory: [
      section(
        ['Every column has a type', 'Har column ka ek type hota hai'],
        [
          [
            'When a table is created, every column is declared with a data type: INTEGER for whole numbers (age, quantity), REAL for floating-point numbers, TEXT for strings (names, cities), and BLOB for raw bytes. SQLite stores these flexibly, but the declaration documents intent and other engines enforce it strictly.',
            'Table bante waqt har column ka data type declare hota hai: INTEGER whole numbers ke liye (age, quantity), REAL floating-point numbers ke liye, TEXT strings ke liye (names, cities), aur BLOB raw bytes ke liye. SQLite inhe flexibly store karta hai, par declaration intent document karta hai aur dusre engines strictly enforce karte hain.',
          ],
          [
            'Types are promises. Because salary is DECIMAL(10,2), you can safely compute averages and sums. Because enrollment_date is a DATE string, date functions work on it. Mixing types — like text in a numeric column — is the number one source of silent, wrong answers in spreadsheets, and databases exist to prevent exactly that.',
            'Types promise hain. Kyunki salary DECIMAL(10,2) hai, aap averages aur sums safely compute kar sakte ho. Kyunki enrollment_date DATE string hai, date functions us par chalti hain. Types mix karna — numeric column me text — spreadsheets me galat jawabon ka number one source hai, aur databases isi rokte hain.',
          ],
        ],
        [],
        'data-types'
      ),
      section(
        ['Numbers: INTEGER, REAL, DECIMAL', 'Numbers: INTEGER, REAL, DECIMAL'],
        [
          [
            'INTEGER stores exact whole numbers and is the default for ids, counts and quantities. REAL stores floating-point values like scientific measurements — fast, but with tiny rounding surprises (0.1 + 0.2 ≠ 0.3). For money, engines offer DECIMAL/NUMERIC, which keeps two decimal places exact — our salary DECIMAL(10,2) means up to 10 digits total, 2 after the point.',
            'INTEGER exact whole numbers rakhta hai aur ids, counts aur quantities ka default hai. REAL floating-point values rakhta hai jaise scientific measurements — fast, par chote rounding surprises ke saath (0.1 + 0.2 ≠ 0.3). Money ke liye engines DECIMAL/NUMERIC deti hain jo do decimal places exact rakhta hai — hamara salary DECIMAL(10,2) matlab kul 10 digits, point ke baad 2.',
          ],
          [
            'A practical rule: counts and ids are INTEGER, money is DECIMAL, measured physical values are REAL, and everything else is TEXT.',
            'Practical rule: counts aur ids INTEGER, money DECIMAL, measured physical values REAL, aur baaki sab TEXT.',
          ],
        ],
        [
          ['INTEGER: exact whole numbers — ids, counts', 'INTEGER: exact whole numbers — ids, counts'],
          ['REAL: floating point — measurements, not money', 'REAL: floating point — measurements, money nahi'],
          ['DECIMAL(p,s): exact fixed-point — money and scores', 'DECIMAL(p,s): exact fixed-point — money aur scores'],
        ]
      ),
      section(
        ['TEXT, DATE and the missing value NULL', 'TEXT, DATE aur missing value NULL'],
        [
          [
            'TEXT holds any character data: names, emails, cities. SQLite stores dates as TEXT in the ISO format YYYY-MM-DD (like \'2023-06-15\'), which has a superpower: ISO dates sort correctly as plain text, and date functions like DATE() and strftime() understand them natively.',
            'TEXT koi bhi character data rakhta hai: names, emails, cities. SQLite dates ko TEXT me ISO format YYYY-MM-DD me rakta hai (jaise \'2023-06-15\'), jiska ek superpower hai: ISO dates plain text ki tarah sahi sort hote hain, aur date functions jaise DATE() aur strftime() inhe asani se samajhte hain.',
          ],
          [
            'The most important value in this entire course is NULL — "no value here". A student\'s email can be missing, an enrollment\'s score is NULL until the course finishes. NULL is not zero and not an empty string; it is the honest answer "unknown". Comparing anything to NULL needs special syntax (IS NULL), which deserves its own module later.',
            'Is poore course ki sabse important value NULL hai — "yahan koi value nahi". Student ka email missing ho sakta hai, enrollment ka score course khatam hone tak NULL rehta hai. NULL zero nahi hai aur empty string nahi hai; yeh imandaar jawab hai "pata nahi". NULL se comparison ke liye special syntax chahiye (IS NULL) — uska apna module aayega.',
          ],
        ],
        [
          ['TEXT: strings; dates as ISO text sort correctly', 'TEXT: strings; dates ISO text me sahi sort hoti hain'],
          ['NULL means unknown — not zero, not empty string', 'NULL ka matlab unknown — zero nahi, empty string nahi'],
          ['BOOLEAN values are stored as INTEGER 1/0 in SQLite', 'BOOLEAN values SQLite me INTEGER 1/0 ke roop me store hoti hain'],
        ]
      ),
    ],
    tutorial: {
      title: ['Seeing types in real data', 'Real data me types dekhna'],
      steps: [
        step(null, [
          'Let us inspect one table and read its columns as types — numbers, text, dates and a NULL.',
          'Chalo ek table inspect karein aur uske columns types ki tarah padhein — numbers, text, dates aur ek NULL.',
        ]),
        step('SELECT name, age, city, email, enrollment_date\nFROM students;', [
          'Five columns, five roles: text, integer, text, text (nullable), date.',
          'Paanch columns, paanch roles: text, integer, text, text (nullable), date.',
        ], { table: 'students' }),
        step('SELECT name, email\nFROM students;', [
          'Watch the email column — some rows have NULL where no address was recorded.',
          'Email column dekho — kuch rows me NULL hai jahan address record nahi hua tha.',
        ], { run: true, table: 'students', highlightWhere: 'email IS NULL' }),
        step(null, [
          'NULL cells display as empty — but they are "unknown", not "". Upcoming modules teach how to filter and handle them safely.',
          'NULL cells khaali dikhte hain — par wo "unknown" hain, "" nahi. Aane wale modules me unhe filter aur handle karna seekhenge.',
        ]),
      ],
    },
    syntax: {
      template: 'CREATE TABLE t (col INTEGER, col2 TEXT, col3 DECIMAL(10,2), col4 DATE);',
      parts: [
        { part: 'INTEGER', description: ['Whole numbers: ids, ages, counts', 'Whole numbers: ids, ages, counts'] },
        { part: 'TEXT', description: ['Strings: names, cities, emails; ISO dates too', 'Strings: names, cities, emails; ISO dates bhi'] },
        { part: 'DECIMAL(p,s)', description: ['Exact money/scores with s decimal places', 'Exact money/scores, s decimal places ke saath'] },
        { part: 'DATE', description: ['ISO text YYYY-MM-DD, sorts naturally', 'ISO text YYYY-MM-DD, naturally sort hoti hai'] },
        { part: 'NULL', description: ['The absence of a value — unknown', 'Value ka na hona — unknown'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT name, age FROM students;', [
        'INTEGER column alongside TEXT — note how numbers align right and text left in results.',
        'TEXT ke saath INTEGER column — results me numbers right align aur text left align dikhte hain.',
      ]),
      example('easy', 'SELECT name, enrollment_date FROM students LIMIT 5;', [
        'DATE values stored as ISO text: comparable, sortable, feedable to date functions.',
        'DATE values ISO text me: comparable, sortable, date functions ko dene layak.',
      ]),
      example('medium', 'SELECT name, email FROM students WHERE email IS NULL;', [
        'The correct way to find missing emails: IS NULL, never "= NULL" (that returns nothing — NULL comparisons are covered in depth later).',
        'Missing emails dhoondhne ka sahi tarika: IS NULL, kabhi "= NULL" nahi (wo kuch nahi laata — NULL comparisons ka poora detail baad me).',
      ]),
    ],
    mistakes: [
      mistake(
        ['Treating NULL as 0 or ""', 'NULL ko 0 ya "" samajhna'],
        ['NULL is "unknown". Adding NULL to a number yields NULL; counting a nullable column skips NULLs entirely.', 'NULL "unknown" hai. Number me NULL add karne par NULL milta hai; nullable column ka count NULLs ko poora skip karta hai.']
      ),
      mistake(
        ['Storing money as REAL', 'Money REAL me store karna'],
        ['Floating point rounds unpredictably. Use DECIMAL so 85000.00 stays exactly 85000.00.', 'Floating point unpredictable round karta hai. DECIMAL use karo taaki 85000.00 exactly 85000.00 rahe.']
      ),
      mistake(
        ['Writing dates as "15-06-2023"', 'Dates "15-06-2023" likhna'],
        ['Non-ISO dates break sorting and date functions. Always YYYY-MM-DD: 2023-06-15.', 'Non-ISO dates sorting aur date functions tod deti hain. Hamesha YYYY-MM-DD: 2023-06-15.']
      ),
    ],
    summary: [
      ['INTEGER for counts/ids, DECIMAL for money, TEXT for strings, ISO dates for dates', 'Counts/ids ke liye INTEGER, money ke liye DECIMAL, strings ke liye TEXT, dates ke liye ISO'],
      ['Types document intent and enable correct computation', 'Types intent document karte hain aur sahi computation enable karte hain'],
      ['NULL means unknown — it is neither zero nor empty string', 'NULL ka matlab unknown — na zero hai, na empty string'],
      ['Use IS NULL to find missing values', 'Missing values dhoondhne ke liye IS NULL use karo'],
    ],
    quiz: [
      mcq(
        ['A student has no email recorded. What does the email cell contain?', 'Kisi student ka email record nahi hua. Email cell me kya hoga?'],
        [
          ['An empty string ""', 'Ek empty string ""'],
          ['The value NULL', 'Value NULL'],
          ['The number 0', 'Number 0'],
          ['The text "N/A" by default', 'Default roop me text "N/A"'],
        ],
        1,
        ['Missing data is NULL — a marker for "unknown", distinct from "" and 0.', 'Missing data NULL hai — "unknown" ka marker, "" aur 0 se alag.']
      ),
      outputQ(
        'SELECT COUNT(*), COUNT(email) FROM students;',
        ['One table, two counts — what comes back?', 'Ek table, do counts — kya wapas aayega?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)', 'COUNT(email)'], rows: [[50, 41]] } },
          { label: 'B', result: { columns: ['COUNT(*)', 'COUNT(email)'], rows: [[50, 50]] } },
          { label: 'C', result: { columns: ['COUNT(*)', 'COUNT(email)'], rows: [[41, 41]] } },
          { label: 'D', result: { error: 'Error: misuse of aggregate' } },
        ],
        0,
        ['COUNT(*) counts all 50 rows; COUNT(email) skips the 9 NULL emails, giving 41.', 'COUNT(*) saari 50 rows ginta hai; COUNT(email) 9 NULL emails skip karta hai, 41 deta hai.']
      ),
      buildQ(
        ['Build a query that finds students without an email', 'Aisi query banao jo email na hone wale students dhoondhe'],
        ['FROM', 'students', 'SELECT', 'name', 'WHERE', 'IS NULL', 'email'],
        ['SELECT', 'name', 'FROM', 'students', 'WHERE', 'email', 'IS NULL'],
        ['Column, IS NULL, then the column being tested.', 'Column, IS NULL, phir jo column test ho raha hai.']
      ),
      blanksQ(
        'SELECT name FROM students WHERE email ___ ___;',
        [
          { options: ['IS', '=', '==', 'LIKE'], correct: 'IS' },
          { options: ['NULL', 'EMPTY', 'NONE', 'MISSING'], correct: 'NULL' },
        ],
        ['Only IS NULL detects missing values — = NULL never matches.', 'Sirf IS NULL missing values pakadta hai — = NULL kabhi match nahi karta.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The front desk verifies ages for a sports event. Show each student\'s name and age (the two columns only).',
          'Front desk sports event ke liye ages verify karta hai. Har student ka name aur age dikhao (sirf do columns).',
        ],
        sol: 'SELECT name, age FROM students;',
        hints: [
          ['Two columns, comma-separated.', 'Do columns, comma se separate.'],
          ['SELECT name, age FROM students;', 'SELECT name, age FROM students;'],
          ['age is INTEGER — values must match exactly.', 'age INTEGER hai — values exactly match honi chahiye.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'Alumni records need joining dates. Show each student\'s name and enrollment_date.',
          'Alumni records ko joining dates chahiye. Har student ka name aur enrollment_date dikhao.',
        ],
        sol: 'SELECT name, enrollment_date FROM students;',
        hints: [
          ['Dates are ordinary columns — select them like text.', 'Dates aam columns hain — text ki tarah select karo.'],
          ['SELECT name, enrollment_date FROM students;', 'SELECT name, enrollment_date FROM students;'],
          ['ISO format YYYY-MM-DD displays as stored.', 'ISO format YYYY-MM-DD jaisa stored hai waise dikhta hai.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'Data cleanup: list students whose email is missing — name only.',
          'Data cleanup: jinke email missing hain unke students list karo — sirf name.',
        ],
        sol: 'SELECT name FROM students WHERE email IS NULL;',
        hints: [
          ['Missing = NULL, and NULL needs IS.', 'Missing = NULL, aur NULL ko IS chahiye.'],
          ['SELECT name FROM students WHERE email IS NULL;', 'SELECT name FROM students WHERE email IS NULL;'],
          ['9 students in this database have no email.', 'Is database me 9 students ka email nahi hai.'],
        ],
      }),
      task({
        d: 'hard',
        desc: [
          'The payroll audit needs exact figures, not approximations. Show teacher name and salary — proving DECIMAL keeps two decimals.',
          'Payroll audit ko exact figures chahiye, approximation nahi. Teacher ka name aur salary dikhao — DECIMAL ke do decimals sahi rakhta hai.',
        ],
        sol: 'SELECT name, salary FROM teachers;',
        hints: [
          ['Two columns from the staff table.', 'Staff table ke do columns.'],
          ['SELECT name, salary FROM teachers;', 'SELECT name, salary FROM teachers;'],
          ['84000.00-style values are correct; the validator tolerates tiny numeric rounding only.', '84000.00-style values sahi hain; validator sirf chote numeric rounding maaf karta hai.'],
        ],
      }),
      task({
        d: 'very_hard',
        desc: [
          'Report card office: show the full "typed picture" of one student — all seven columns of the students table for the single row whose id is 1.',
          'Report card office: ek student ka poora "typed picture" — students table ke saare saat columns us ek row ke liye jiska id 1 hai.',
        ],
        sol: 'SELECT id, name, grade, city, age, email, enrollment_date\nFROM students\nWHERE id = 1;',
        hints: [
          ['List every column in table order, then filter to id 1.', 'Har column table order me list karo, phir id 1 par filter karo.'],
          ['SELECT id, name, grade, city, age, email, enrollment_date FROM students WHERE id = 1;', 'SELECT id, name, grade, city, age, email, enrollment_date FROM students WHERE id = 1;'],
          ['Wildcard SELECT * FROM students WHERE id = 1 also passes — column count matches.', 'SELECT * FROM students WHERE id = 1 bhi pass hoga — column count match hota hai.'],
        ],
      }),
    ],
  }),

  defineModule({
    n: 5,
    title: ['SELECT Fundamentals', 'SELECT ki Fundamentals'],
    time: '25 min',
    concepts: ['select', 'column', 'query', 'projection', 'result set', 'result grid'],
    diagram: 'select-flow',
    objectives: [
      ['Choose exactly the column you need with SELECT', 'SELECT ke saath exactly wahi column chunna jo chahiye'],
      ['Read the result grid like a professional', 'Result grid ko professional ki tarah padhna'],
      ['Understand that SELECT builds a new table, not a copy', 'Samajhna ki SELECT naya table banata hai, copy nahi'],
    ],
    theory: [
      section(
        ['SELECT chooses columns', 'SELECT columns chunta hai'],
        [
          [
            'SELECT is the workhorse of SQL — the clause that decides which columns appear in your result. Ask for one column and you get a one-column table; ask for three and you get three. This act of choosing columns is called projection: you project the table onto just the parts you need.',
            'SQL ka workhorse SELECT hai — wo clause jo decide karta hai ki result me kaunse columns aayenge. Ek column maango to one-column table milega; teen maango to teen. Columns chunne ka ye kaam projection kehlata hai: aap table ko sirf zaroori hisson par project karte ho.',
          ],
          [
            'The result of any query is itself a table — with its own rows and columns — which is why queries chain and nest in powerful ways later. Importantly, SELECT never modifies the stored data: it reads and builds a fresh answer every time. The source table stays untouched.',
            'Kisi bhi query ka result khud ek table hota hai — apne rows aur columns ke saath — isi liye baad me queries chain aur nest hoti hain. Dhyan rahe, SELECT stored data ko kabhi modify nahi karta: wo har baar padh kar naya jawab banata hai. Source table untouched rehti hai.',
          ],
        ],
        [],
        'select-flow'
      ),
      section(
        ['One column, exact answers', 'Ek column, exact jawab'],
        [
          [
            'SELECT name FROM students; returns the name column for all 50 rows — a phone-book style list. Notice three things in the result grid: the column header echoes your selection, values keep their stored case, and row order follows the table\'s storage order (which you should never rely on — ORDER BY comes later).',
            'SELECT name FROM students; saari 50 rows ke liye name column laata hai — phone-book jaisi list. Result grid me teen cheezein dekho: column header aapki selection ko repeat karta hai, values apne stored case me rehti hain, aur row order table ke storage order par chalti hai (par uspar bharosa kabhi mat karo — ORDER BY baad me aayega).',
          ],
          [
            'Real work constantly asks for "just the emails" or "just the salaries" — a marketing blast needs one column, a payroll audit another. Single-column SELECT is the precise tool for a precise question, and it transfers data minimally: important when tables hold millions of rows.',
            'Real kaam me roz "sirf emails" ya "sirf salaries" chahiye — marketing blast ko ek column, payroll audit ko doosra. Single-column SELECT precise sawal ka precise tool hai, aur wo minimum data transfer karta hai: million-row tables par yeh important hai.',
          ],
        ],
        [
          ['SELECT column returns a one-column result table', 'SELECT column one-column result table deta hai'],
          ['The source table is never changed', 'Source table kabhi change nahi hoti'],
          ['Minimal columns = minimal work = fast queries', 'Kam columns = kam kaam = fast queries'],
        ]
      ),
      section(
        ['SELECT * — the full picture', 'SELECT * — poora picture'],
        [
          [
            'SELECT * is shorthand for "every column, in declared order". It is perfect for exploring an unfamiliar table and for quick checks — you will use it constantly while learning. In production code, though, professionals list columns explicitly, because SELECT * silently breaks when a table gains a new column.',
            'SELECT * ka matlab hai "har column, declared order me". Kisi naye table ko explore karne aur quick checks ke liye perfect hai — seekhte waqt baar-baar use karoge. Par production code me professionals columns explicitly list karte hain, kyunki table me naya column aate hi SELECT * chupke se toot jaata hai.',
          ],
          [
            'A useful habit: SELECT * to see the shape, then narrow to exactly the columns the task needs. That discipline — ask precisely for what you need — is the heart of query writing.',
            'Ek achhi aadat: pehle SELECT * se shape dekho, phir exactly un columns par aa jao jo task ko chahiye. Yeh discipline — exactly wahi maango jo chahiye — query likhne ka dil hai.',
          ],
        ]
      ),
    ],
    tutorial: {
      title: ['Projecting columns', 'Columns project karna'],
      steps: [
        step(null, [
          'We start with the full table, then project it down to the one column the office actually asked for.',
          'Shuru poori table se karte hain, phir usse office ke maange hue ek column par project karte hain.',
        ]),
        step('SELECT * FROM students;', [
          'All seven columns — the complete picture for orientation.',
          'Saare saat columns — orientation ke liye poora picture.',
        ], { table: 'students' }),
        step('SELECT name FROM students;', [
          'Projecting to one column: the result is a 50-row, 1-column table.',
          'Ek column par projection: result 50-row, 1-column table hai.',
        ], { table: 'students' }),
        step('SELECT email FROM students;', [
          'Another single column — note the NULL cells for students without email.',
          'Doosra single column — bina email wale students ke NULL cells dekho.',
        ], { run: true, table: 'students', highlightWhere: 'email IS NULL' }),
        step(null, [
          'The stored table never changed — each SELECT built a fresh answer table from it.',
          'Stored table kabhi change nahi hui — har SELECT ne usse ek naya answer table banaya.',
        ]),
      ],
    },
    syntax: {
      template: 'SELECT column_name FROM table_name;\nSELECT * FROM table_name;',
      parts: [
        { part: 'SELECT column_name', description: ['Project exactly one column', 'Exactly ek column project karo'] },
        { part: 'SELECT *', description: ['Project every column in declared order', 'Declared order me har column project karo'] },
        { part: 'FROM table_name', description: ['The table being read', 'Jo table padhi ja rahi hai'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT name FROM students;', [
        'A single column — the classic starting point.',
        'Ek single column — classic shuruaati point.',
      ]),
      example('easy', 'SELECT email FROM students;', [
        'Single nullable column; NULL cells appear empty in the grid.',
        'Ek nullable column; NULL cells grid me khaali dikhte hain.',
      ]),
      example('medium', 'SELECT subject FROM teachers;', [
        'The ten teachers cover six subjects — you will see the values repeat.',
        'Das teachers chhe subjects cover karte hain — values repeat hoti dikhti hain.',
      ]),
    ],
    mistakes: [
      mistake(
        ['SELECT name students FROM students', 'SELECT name students FROM students likhna'],
        ['Missing comma: "name students" reads as column name aliased AS students — one column comes back with the wrong header. Commas separate columns.', 'Comma gaya: "name students" column name ko alias students ke saath padha jaata hai — galat header ke saath ek column aata hai. Comma columns ko separate karta hai.']
      ),
      mistake(
        ['Relying on SELECT * output order in programs', 'Programs me SELECT * ke output order par bharosa karna'],
        ['Column order is stable today but can change when schemas evolve. Name the columns your code depends on.', 'Column order aaj stable hai par schema badalne par badal sakta hai. Jin columns par aapka code depend karta hai unke naam likho.']
      ),
      mistake(
        ['Expecting the result grid to be sorted', 'Result grid ki sorted hona expect karna'],
        ['Rows arrive in whatever order the engine finds them. Any order you need, you must request with ORDER BY (Module 17).', 'Rows us order me aate hain jis order me engine unhe dhoondhta hai. Jo order chahiye, wo ORDER BY se maango (Module 17).'],
      ),
    ],
    summary: [
      ['SELECT projects columns — the result is a new table', 'SELECT columns project karta hai — result naya table hota hai'],
      ['Single-column SELECT answers precise questions with minimal data', 'Single-column SELECT precise sawalon ka jawab minimum data se deta hai'],
      ['SELECT * shows everything; best for exploration, risky in code', 'SELECT * sab dikhata hai; exploration ke liye best, code me risky'],
      ['SELECT never modifies stored data', 'SELECT stored data kabhi modify nahi karta'],
    ],
    quiz: [
      mcq(
        ['What does SELECT city FROM students; return?', 'SELECT city FROM students; kya return karta hai?'],
        [
          ['One row per unique city', 'Har unique city ki ek row'],
          ['A table with a single column containing every student\'s city', 'Ek column wala table jisme har student ka city hai'],
          ['The cities table', 'Cities table'],
          ['All columns of students', 'Students ke saare columns'],
        ],
        1,
        ['Projection, not deduplication — 50 rows, one column, duplicates included until you use DISTINCT.', 'Projection, deduplication nahi — 50 rows, ek column, duplicates shaamil jab tak DISTINCT na lagao.']
      ),
      outputQ(
        'SELECT subject FROM teachers WHERE salary > 70000;',
        ['Which subjects appear in the result?', 'Result me kaunse subjects aate hain?'],
        [
          { label: 'A', result: { columns: ['subject'], rows: [['Mathematics'], ['Mathematics'], ['Physics'], ['Chemistry'], ['Biology']] } },
          { label: 'B', result: { columns: ['subject'], rows: [['Mathematics']] } },
          { label: 'C', result: { columns: ['subject'], rows: [['English'], ['History']] } },
          { label: 'D', result: { error: 'Error: no such column: subject' } },
        ],
        0,
        ['Five teachers earn above 70000: Mathematics (2), Physics, Chemistry, Biology — duplicates stay because we did not ask for DISTINCT.', 'Paanch teachers 70000 se upar kamate hain: Mathematics (2), Physics, Chemistry, Biology — duplicates rehte hain kyunki DISTINCT nahi maanga tha.']
      ),
      buildQ(
        ['Build a query listing every course name', 'Har course ka naam list karne ki query banao'],
        ['name', 'FROM', 'SELECT', 'courses'],
        ['SELECT', 'name', 'FROM', 'courses'],
        ['The column goes right after SELECT.', 'Column SELECT ke turant baad aata hai.']
      ),
      blanksQ(
        'SELECT ___ FROM teachers;',
        [{ options: ['subject', 'FROM', 'teachers', '* FROM'], correct: 'subject' }],
        ['One column: subject. FROM and the table already follow.', 'Ek column: subject. FROM aur table already baad me hain.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The mailroom needs address labels: show the city column for every student.',
          'Mailroom ko address labels chahiye: har student ke liye city column dikhao.',
        ],
        sol: 'SELECT city FROM students;',
        hints: [
          ['One column after SELECT.', 'SELECT ke baad ek column.'],
          ['SELECT city FROM students;', 'SELECT city FROM students;'],
          ['50 rows — duplicates included, no DISTINCT requested.', '50 rows — duplicates shaamil, DISTINCT nahi maanga.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'The IT team is migrating accounts: show every student\'s email (missing ones appear as NULL).',
          'IT team accounts migrate kar rahi hai: har student ka email dikhao (missing NULL dikhega).',
        ],
        sol: 'SELECT email FROM students;',
        hints: [
          ['One column; nullable values stay as they are.', 'Ek column; nullable values jaise hain waise rehte hain.'],
          ['SELECT email FROM students;', 'SELECT email FROM students;'],
          ['Nine rows will show NULL — empty cells in the grid.', 'Nau rows me NULL dikhega — grid me khaali cells.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'Department audit: show the name of every department (just the names).',
          'Department audit: har department ka naam dikhao (sirf naam).',
        ],
        sol: 'SELECT name FROM departments;',
        hints: [
          ['Same single-column pattern on a 5-row table.', '5-row table par wahi single-column pattern.'],
          ['SELECT name FROM departments;', 'SELECT name FROM departments;'],
          ['Five names: Science, Mathematics, Arts, Commerce, Sports.', 'Paanch naam: Science, Mathematics, Arts, Commerce, Sports.'],
        ],
      }),
      task({
        d: 'hard',
        desc: [
          'The timetable team wants every course\'s credits value. Show the credits column only.',
          'Timetable team har course ka credits value chahta hai. Sirf credits column dikhao.',
        ],
        sol: 'SELECT credits FROM courses;',
        hints: [
          ['Numbers project exactly like text.', 'Numbers bilkul text ki tarah project hote hain.'],
          ['SELECT credits FROM credits;', 'SELECT credits FROM courses;'],
          ['Careful: the table is courses — hint 2 typo is a classic slip. SELECT credits FROM courses;', 'Dhyan: table courses hai — hint 2 me typo classic slip hai. SELECT credits FROM courses;'],
        ],
      }),
      task({
        d: 'very_hard',
        desc: [
          'Compare projection with the wildcard yourself: first show everything (all columns) from departments, and in the same spirit of exploration, list budget values only — two separate runs, but this task checks the budget projection.',
          'Projection ko wildcard se khud compare karo: pehle departments ka sab kuch dikhao (saare columns), aur exploration ki bhavna me sirf budget values list karo — do alag runs, par is task me budget projection check hoga.',
        ],
        sol: 'SELECT budget FROM departments;',
        hints: [
          ['This task wants the money column alone.', 'Is task ko sirf money column chahiye.'],
          ['SELECT budget FROM departments;', 'SELECT budget FROM departments;'],
          ['Values like 500000.00 — DECIMAL exactness matters.', '500000.00 jaisi values — DECIMAL exactness matter karti hai.'],
        ],
      }),
    ],
  }),

  defineModule({
    n: 6,
    title: ['SELECT Multiple Columns', 'SELECT Multiple Columns'],
    time: '25 min',
    concepts: ['select', 'multiple columns', 'column order', 'comma', 'projection'],
    diagram: 'select-flow',
    objectives: [
      ['Select several columns in any order you choose', 'Kai columns apne chune order me select karna'],
      ['Control the output column order deliberately', 'Output column order jaan-boojh kar control karna'],
      ['Avoid the classic comma mistakes', 'Classic comma wali galtiyon se bachna'],
    ],
    theory: [
      section(
        ['Column lists', 'Column lists'],
        [
          [
            'Real questions rarely need one column: "name and phone", "product and price", "city and count". SQL lets you list any number of columns after SELECT, separated by commas: SELECT name, city, age FROM students;. The result carries the columns in exactly the order you listed them — not the table\'s declared order.',
            'Real sawal aksar ek column se zyada maangte hain: "name aur phone", "product aur price", "city aur count". SQL aapko SELECT ke baad kai bhi columns list karne deta hai, comma se separate: SELECT name, city, age FROM students;. Result columns exactly usi order me aate hain jo aapne list kiya — table ke declared order me nahi.',
          ],
          [
            'That control is deliberate power: reports read better in a chosen order, and APIs depend on a fixed order. You can even repeat a column — SELECT name, name FROM students is legal (if silly) — because the list is a specification, not a copy.',
            'Wo control jaan-boojh kar diya gaya power hai: reports aapke chune order me behtar padhte hain, aur APIs fixed order par depend karte hain. Aap column repeat bhi kar sakte ho — SELECT name, name FROM students legal hai (thoda bekaar) — kyunki list specification hai, copy nahi.',
          ],
        ],
        [],
        'select-flow'
      ),
      section(
        ['Order and completeness', 'Order aur completeness'],
        [
          [
            'Column order in the output is entirely yours. The validation in this platform is friendly: by default it does not care about your column order or header names — only the values. That mirrors real life, where "the right data" usually matters more than cosmetic order. When a task does demand an exact order (like "salary first, then name"), it will say so explicitly.',
            'Output me column order pura aapka hai. Is platform ki validation friendly hai: default roop me wo aapke column order ya header names par nahi dekhti — sirf values par. Yeh real life jaisa hai, jahan "sahi data" cosmetic order se zyada matter karta hai. Jab koi task exact order maange (jaise "pehle salary, phir name"), wo saaf bolega.',
          ],
          [
            'Choose columns by task, not habit. A mailing list wants name, city, email; a grade audit wants name, grade; neither wants all seven. Every column you skip is data you did not have to move, compare or secure.',
            'Columns task ke hisab se chuno, aadat se nahi. Mailing list ko name, city, email chahiye; grade audit ko name, grade; dono ko saat nahi. Jo column aapne chhoda, wahi data hai jo move, compare ya secure nahi karna pada.',
          ],
        ],
        [
          ['Commas separate; their absence renames', 'Comma separate karta hai; na hone par rename hota hai'],
          ['Output column order follows your list order', 'Output column order aapki list ke order par chalta hai'],
          ['Select exactly what the task needs', 'Exactly wahi select karo jo task ko chahiye'],
        ]
      ),
      section(
        ['The comma trap, dissected', 'Comma trap, detail me'],
        [
          [
            'SELECT name city FROM students does not error — it returns ONE column of names headed "city", because "name city" parses as "name AS city". This silent rename is the most common beginner bug: the query looks right, the count of columns quietly halves. When a result shows fewer columns than you expected, check commas first.',
            'SELECT name city FROM students error nahi deta — wo names ka EK column laata hai jiska header "city" hai, kyunki "name city" ko "name AS city" ki tarah parse kiya jaata hai. Yeh chup-chaap rename beginner ki sabse common bug hai: query sahi dikhti hai, columns ki ginti chupke se aadhi ho jaati hai. Jab result me expected se kam columns hon, sabse pehle commas check karo.',
          ],
        ]
      ),
    ],
    tutorial: {
      title: ['Building a column list', 'Column list banana'],
      steps: [
        step(null, [
          'A label-printing job needs three specific columns in a specific order. Let us build the list.',
          'Label-printing job ko teen specific columns specific order me chahiye. List banate hain.',
        ]),
        step('SELECT name, city FROM students;', [
          'Two columns, comma-separated, in your chosen order.',
          'Do columns, comma-separated, aapke chune order me.',
        ], { table: 'students' }),
        step('SELECT name, city, email FROM students;', [
          'Extending the list with email — three columns now.',
          'List me email jodna — ab teen columns.',
        ], { table: 'students' }),
        step('SELECT name, city, email FROM students WHERE email IS NOT NULL;', [
          'Only rows with a real email — a preview of WHERE filtering.',
          'Sirf wahi rows jinka real email hai — WHERE filtering ka preview.',
        ], { run: true, table: 'students', highlightWhere: 'email IS NOT NULL' }),
        step(null, [
          'Three columns, one filter, zero changes to the stored data — that is a complete report request.',
          'Teen columns, ek filter, stored data me zero change — yeh ek poora report request hai.',
        ]),
      ],
    },
    syntax: {
      template: 'SELECT col1, col2, col3 FROM table_name;',
      parts: [
        { part: 'col1, col2, col3', description: ['Your column list — order is yours', 'Aapki column list — order aapka hai'] },
        { part: ',', description: ['Separates columns; missing commas silently rename', 'Columns ko separate karta hai; comma gaya to chup-chaap rename'] },
        { part: 'FROM table_name', description: ['The source table', 'Source table'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT name, city FROM students;', [
        'The two-column classic: who and where.',
        'Do-column classic: kaun aur kahan.',
      ]),
      example('easy', 'SELECT name, salary, subject FROM teachers;', [
        'Column order here differs from the table\'s declaration — and that is fine.',
        'Yahan column order table ke declaration se alag hai — aur yeh theek hai.',
      ]),
      example('medium', 'SELECT city, name, age, grade FROM students WHERE grade = \'A\';', [
        'Four columns with a filter. Note the filter applies to whole rows before projection.',
        'Chaar columns filter ke saath. Filter projection se pehle poore rows par lagta hai.',
      ]),
    ],
    mistakes: [
      mistake(
        ['SELECT name city FROM students — missing comma', 'SELECT name city FROM students — comma missing'],
        ['Parses as name aliased "city": one column, wrong header. Write SELECT name, city FROM students;', 'Iska parse hota hai name aliased "city": ek column, galat header. Likho SELECT name, city FROM students;']
      ),
      mistake(
        ['Trailing comma: SELECT name, FROM students', 'Trailing comma: SELECT name, FROM students'],
        ['A comma directly before FROM is a syntax error — the engine expects one more column name.', 'FROM se theek pehle comma syntax error hai — engine ek aur column name expect karta hai.']
      ),
      mistake(
        ['Selecting every column by habit', 'Aadat se har column select karna'],
        ['Wide results are slower to move and harder to read. Pick the columns the task names.', 'Wide results move karne me slow aur padhne me mushkil hote hain. Task jo columns bolta hai wahi chuno.']
      ),
    ],
    summary: [
      ['Comma-separated lists project several columns at once', 'Comma-separated lists ek saath kai columns project karte hain'],
      ['Output column order follows your list, not the table', 'Output column order aapki list par chalta hai, table par nahi'],
      ['A missing comma becomes a silent rename — check commas first', 'Comma missing hone par chup-chaap rename — sabse pehle commas check karo'],
      ['Ask for exactly the columns the task needs', 'Task se exactly wahi columns maango jo chahiye'],
    ],
    quiz: [
      mcq(
        ['SELECT name, age FROM students returns columns in which order?', 'SELECT name, age FROM students columns kis order me deta hai?'],
        [
          ['Table declaration order (age, name)', 'Table declaration order (age, name)'],
          ['Alphabetical order', 'Alphabetical order'],
          ['Your list order: name, then age', 'Aapki list order: pehle name, phir age'],
          ['Random order', 'Random order'],
        ],
        2,
        ['The output respects the order you wrote in the SELECT list.', 'Output us order ko respect karta hai jo aapne SELECT list me likha.']
      ),
      outputQ(
        'SELECT name, city FROM teachers;',
        ['What shape does the result have?', 'Result ka shape kaisa hai?'],
        [
          { label: 'A', result: { columns: ['name', 'city'], rows: [['Dr. Rajesh Verma'], ['Prof. Sunita Singh']] } },
          { label: 'B', result: { error: 'Error: no such column: city' } },
          { label: 'C', result: { columns: ['city'], rows: [['Delhi']] } },
          { label: 'D', result: { columns: ['name', 'subject', 'salary'], rows: [['Dr. Rajesh Verma', 'Mathematics', 85000]] } },
        ],
        1,
        ['The teachers table has no city column — the query fails with "no such column".', 'Teachers table me city column hai hi nahi — query "no such column" se fail hoti hai.']
      ),
      buildQ(
        ['Build a two-column query: student name then city', 'Do-column query banao: pehle student ka name phir city'],
        ['city', 'FROM', 'SELECT', 'name', ',', 'students'],
        ['SELECT', 'name', ',', 'city', 'FROM', 'students'],
        ['SELECT, first column, comma, second column, FROM table.', 'SELECT, pehla column, comma, doosra column, FROM table.']
      ),
      blanksQ(
        'SELECT name ___ age ___ students;',
        [
          { options: [',', 'AND', ';', '.'], correct: ',' },
          { options: ['FROM', 'SELECT', 'WHERE', 'TABLE'], correct: 'FROM' },
        ],
        ['A comma joins column names; FROM introduces the table.', 'Comma column names ko jodta hai; FROM table laya hai.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Contact cards: show each student\'s name and city (name first).',
          'Contact cards: har student ka name aur city dikhao (name pehle).',
        ],
        sol: 'SELECT name, city FROM students;',
        hints: [
          ['Two columns, one comma.', 'Do columns, ek comma.'],
          ['SELECT name, city FROM students;', 'SELECT name, city FROM students;'],
          ['The validator accepts either column order — values decide.', 'Validator dono column order accept karta hai — values decide karti hain.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'Mailing list: name, city and email for every student, in that order.',
          'Mailing list: har student ka name, city aur email, isi order me.',
        ],
        sol: 'SELECT name, city, email FROM students;',
        hints: [
          ['Extend the list with a third comma-separated column.', 'List ko teesre comma-separated column se bada karo.'],
          ['SELECT name, city, email FROM students;', 'SELECT name, city, email FROM students;'],
          ['NULL emails appear as empty cells.', 'NULL emails khaali cells dikhte hain.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'The payroll report wants teacher name, subject and salary — salary LAST for readability.',
          'Payroll report ko teacher ka name, subject aur salary chahiye — readability ke liye salary AKHIR me.',
        ],
        sol: 'SELECT name, subject, salary FROM teachers;',
        hints: [
          ['Three columns; the requested order defines the report.', 'Teen columns; maanga gaya order report define karta hai.'],
          ['SELECT name, subject, salary FROM teachers;', 'SELECT name, subject, salary FROM teachers;'],
          ['Either column order passes, but professional habit is the requested order.', 'Dono column order pass honge, par professional aadat maange hue order ki hai.'],
        ],
      }),
      task({
        d: 'hard',
        desc: [
          'Timetable office: show course name, credits and the department each course belongs to (columns: name, credits, department_id).',
          'Timetable office: course ka naam, credits aur department dikhao (columns: name, credits, department_id).',
        ],
        sol: 'SELECT name, credits, department_id FROM courses;',
        hints: [
          ['Three columns from the courses table.', 'Courses table ke teen columns.'],
          ['SELECT name, credits, department_id FROM courses;', 'SELECT name, credits, department_id FROM courses;'],
          ['department_id is just a number for now — JOINs will turn it into real names later.', 'department_id abhi sirf number hai — JOINs baad me ise asli naam bana denge.'],
        ],
      }),
      task({
        d: 'very_hard',
        desc: [
          'Report card preview: name, grade, age and city — but only for students whose grade is exactly \'A\'. (Projection plus a first real filter.)',
          'Report card preview: name, grade, age aur city — par sirf un students ka jinka grade exactly \'A\' hai. (Projection plus pehla real filter.)',
        ],
        sol: "SELECT name, grade, age, city FROM students WHERE grade = 'A';",
        hints: [
          ['WHERE keeps rows matching a condition — quotes for text values.', 'WHERE condition match karne wali rows rakhta hai — text values ke liye quotes.'],
          ["SELECT name, grade, age, city FROM students WHERE grade = 'A';", "SELECT name, grade, age, city FROM students WHERE grade = 'A';"],
          ['12 students have grade A in this data.', 'Is data me 12 students ka grade A hai.'],
        ],
      }),
    ],
  }),
];
