'use client';

// Modules 10-12: Mini Project 1 (Student Directory) · Comparison Operators · Logical Operators

import { defineModule, section, step, example, mistake, mcq, outputQ, buildQ, blanksQ, task } from './builder';
import type { Module } from '@/types/content';

export const modules: Module[] = [
  defineModule({
    n: 10,
    title: ['🎯 Mini Project 1: Student Directory', '🎯 Mini Project 1: Student Directory'],
    time: '20 min',
    concepts: ['project', 'combine', 'select', 'where', 'aliases', 'distinct', 'filter', 'directory'],
    diagram: 'select-flow',
    objectives: [
      ['Combine everything from Modules 1-9 in one realistic project', 'Modules 1-9 ki saari cheezein ek real project me jodna'],
      ['Translate five different office requests into precise queries', 'Paanch alag office requests ko precise queries me badalna'],
      ['Build confidence before entering the filter-operator modules', 'Filter-operator modules me jaane se pehle confidence banana'],
    ],
    theory: [
      section(
        ['The project: a student directory', 'Project: student directory'],
        [
          [
            'The school office is building a printed student directory and has sent five data requests. Every request uses only what you already know — SELECT, column lists, aliases, DISTINCT, WHERE with = and comparison signs, and careful reading. What is new is combining them under realistic, slightly messy requirements.',
            'School office ek print hone wali student directory bana rahi hai aur paanch data requests bheji hain. Har request sirf wahi use karti hai jo aap already jaante ho — SELECT, column lists, aliases, DISTINCT, = aur comparison signs wala WHERE, aur dhyan se padhna. Naya hai sirf unhe real, thode messy requirements ke neeche jodna.',
          ],
          [
            'Approach each task like at work: read the request twice, decide the exact columns, decide the filter, then write one clean statement. Correctness here is judged the professional way — by matching results, not matching your exact text.',
            'Har task ko office ki tarah treat karo: request do baar padho, exact columns decide karo, filter decide karo, phir ek saaf statement likho. Yahan correctness professional tareeke se judge hoti hai — results match karke, aapka exact text match karke nahi.',
          ],
        ],
        [
          ['Read the request: what columns, what filter?', 'Request padho: kaunse columns, kaunsa filter?'],
          ['Write one statement per request', 'Har request ke liye ek statement'],
          ['Validate by result matching — multiple correct answers exist', 'Result matching se validate karo — kai sahi jawab possible hain'],
        ],
        'select-flow'
      ),
      section(
        ['A worked example of the method', 'Method ka ek worked example'],
        [
          [
            'Request: "The transport office wants the names of grade-A students who are old enough to sign their own permission slips (18+)." Columns: just name (only names were asked). Filter: grade = \'A\' AND age >= 18. Query: SELECT name FROM students WHERE grade = \'A\' AND age >= 18;. Notice how the office language ("old enough to sign") translated into a precise numeric condition — that translation step IS the job.',
            'Request: "Transport office un grade-A students ke naam chahti hai jo apne permission slips khud sign kar sakte hain (18+)." Columns: sirf naam (sirf naam maange gaye). Filter: grade = \'A\' AND age >= 18. Query: SELECT name FROM students WHERE grade = \'A\' AND age >= 18;. dekho office ki bhasha ("sign kar sakte hain") kaise precise numeric condition me badli — yahi translation step hi asli kaam hai.',
          ],
          [
            'The five tasks below come from five different departments. Some check headers (they say so), some check only values, and the last combines three ideas in one query. Take them one at a time, and use hints the way a colleague would nudge you — only when stuck.',
            'Neeche ke paanch tasks paanch alag departments se aaye hain. Kuch headers check karte hain (wo khud bolte hain), kuch sirf values, aur aakhri teen ideas ko ek query me jodta hai. Ek-ek karke lo, aur hints ko colleague ki nudge ki tarah use karo — sirf phasne par.',
          ],
        ]
      ),
    ],
    tutorial: {
      title: ['Thinking in requests', 'Requests ki bhasha me sochna'],
      steps: [
        step(null, [
          'Project workflow: restate the request, pick columns, pick the filter, write, run, compare.',
          'Project workflow: request dohrao, columns chuno, filter chuno, likho, run karo, compare karo.',
        ]),
        step('SELECT * FROM students;', [
          'Start every project with orientation — see the shape of the data once.',
          'Har project shuru karo orientation se — data ka shape ek baar dekho.',
        ], { table: 'students' }),
        step("SELECT name AS student, city AS hometown FROM students WHERE grade = 'B';", [
          'A directory page: aliased headers plus a grade filter.',
          'Directory ka ek page: aliased headers aur grade filter.',
        ], { table: 'students', highlightWhere: "grade = 'B'" }),
        step('SELECT DISTINCT city AS hometown FROM students;', [
          'The directory index page — unique hometowns only.',
          'Directory ka index page — sirf unique hometowns.',
        ], { run: true, table: 'students' }),
        step(null, [
          'Five different requests, five small queries — no single "hard" one, just careful composition.',
          'Paanch alag requests, paanch choti queries — koi ek "hard" nahi, bas saaf-alsaaf jodna.',
        ]),
      ],
    },
    syntax: {
      template: '-- Every task in this project uses:\nSELECT columns [AS alias]\nFROM table\n[WHERE condition];',
      parts: [
        { part: 'SELECT columns', description: ['Exactly the columns the request names', 'Exactly wahi columns jo request batati hai'] },
        { part: 'AS alias', description: ['When the request gives a header name', 'Jab request header ka naam deti hai'] },
        { part: 'WHERE condition', description: ['The office language translated to a condition', 'Office ki bhasha condition me translate hui'] },
      ],
    },
    examples: [
      example('easy', 'SELECT name, city FROM students WHERE age >= 20;', [
        'Seniors for the alumni newsletter: projection plus a numeric filter.',
        'Alumni newsletter ke liye seniors: projection plus numeric filter.',
      ]),
      example('medium', 'SELECT DISTINCT grade FROM students WHERE age >= 18;', [
        'Unique grades among adults — DISTINCT and WHERE compose freely.',
        'Bade students ke beech unique grades — DISTINCT aur WHERE aasani se jude hain.',
      ]),
      example('hard', "SELECT name AS student, city AS hometown, age AS years FROM students WHERE city = 'Mumbai' AND age > 18;", [
        'A full directory page: three aliased columns, two combined filters.',
        'Poora directory page: teen aliased columns, do jude hue filters.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Selecting every column because the request mentions several fields', 'Request me kai fields ka zikr hai isliye har column select karna'],
        ['Give exactly the columns the request lists. Extra columns fail real validation and slow real systems.', 'Exactly wahi columns do jo request me likhe hain. Extra columns real validation me fail hote hain aur real systems me slow karte hain.']
      ),
      mistake(
        ['Softening the filter ("about 18" → age > 16)', 'Filter ko naram karna ("about 18" → age > 16)'],
        ['Translate office language exactly: "18 or older" is age >= 18. When ambiguous, re-read — the tasks here are precise.', 'Office ki bhasha exactly translate karo: "18 ya usse bada" matlab age >= 18. Doubt ho to dobara padho — yahan tasks precise hain.']
      ),
      mistake(
        ['Skipping the alias when the request names a header', 'Request header ka naam deti hai tab alias chhod dena'],
        ['If a task says "with the header X", the AS X matters and validation checks it.', 'Agar task bolta hai "header X ke saath", to AS X matter karta hai aur validation use check karti hai.']
      ),
    ],
    summary: [
      ['Projects are compositions of known parts', 'Projects known parts ke jodne ka naam hain'],
      ['Translate business language into precise conditions', 'Business bhasha ko precise conditions me badlo'],
      ['Result-matching means several query styles can be correct', 'Result-matching ka matlab kai query styles sahi ho sakti hain'],
      ['You are ready for operator deep-dives', 'Aap operator deep-dives ke liye ready hain'],
    ],
    quiz: [
      mcq(
        ['The alumni office wants "anyone 20 or older". Which condition is the faithful translation?', 'Alumni office "20 ya usse bada" chahti hai. Kaunsi condition imandaar translation hai?'],
        [
          ['age > 20', 'age > 20'],
          ['age >= 20', 'age >= 20'],
          ['age = 20', 'age = 20'],
          ['age < 20', 'age < 20'],
        ],
        1,
        ['"Or older" includes 20 itself, so the condition must be >=.', '"Ya usse bada" me 20 bhi shaamil hai, isliye condition >= honi chahiye.']
      ),
      outputQ(
        "SELECT COUNT(*) FROM students WHERE city = 'Delhi' AND age >= 18;",
        ['Delhi adults for the voters-education drive — how many?', 'Voters-education drive ke liye Delhi ke bade — kitne?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[6]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[7]] } },
          { label: 'C', result: { columns: ['COUNT(*)'], rows: [[50]] } },
          { label: 'D', result: { error: 'Error: misuse of AND' } },
        ],
        0,
        ['All 7 Delhi students are 18+ except one 17-year-old, so 6 remain.', 'Saare 7 Delhi students 18+ hain ek 17-saal ke ko chhod kar, to 6 bachte hain.']
      ),
      buildQ(
        ['Build the directory index: unique hometowns of students', 'Directory index banao: students ke unique hometowns'],
        ['DISTINCT', 'city', 'FROM', 'students', 'SELECT'],
        ['SELECT', 'DISTINCT', 'city', 'FROM', 'students'],
        ['Deduplicate the projected column.', 'Projected column dedupe karo.']
      ),
      blanksQ(
        'SELECT name ___ student FROM students WHERE grade ___ \'A\';',
        [
          { options: ['AS', 'IS', 'ALIAS', 'NAME'], correct: 'AS' },
          { options: ['=', 'LIKE', 'IN', 'IS'], correct: '=' },
        ],
        ['AS renames for the directory; = filters grade.', 'AS directory ke liye rename karta hai; = grade filter karta hai.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'REQUEST 1 — Front office: "Print labels with each student\'s name and hometown." Give exactly name and city, headers checked: student and hometown.',
          'REQUEST 1 — Front office: "Har student ke naam aur hometown ke labels print karo." Exactly name aur city do, headers check honge: student aur hometown.',
        ],
        sol: 'SELECT name AS student, city AS hometown FROM students;',
        hints: [
          ['Two columns, two aliases — no filter needed.', 'Do columns, do aliases — filter ki zaroorat nahi.'],
          ['SELECT name AS student, city AS hometown FROM students;', 'SELECT name AS student, city AS hometown FROM students;'],
          ['Headers must read student and hometown.', 'Headers student aur hometown hone chahiye.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'easy',
        desc: [
          'REQUEST 2 — Discipline office: "We follow grade-F students. Names only."',
          'REQUEST 2 — Discipline office: "Hum grade-F students par nazar rakhte hain. Sirf naam."',
        ],
        sol: "SELECT name FROM students WHERE grade = 'F';",
        hints: [
          ['One column, one equality filter on text.', 'Ek column, text par ek equality filter.'],
          ["SELECT name FROM students WHERE grade = 'F';", "SELECT name FROM students WHERE grade = 'F';"],
          ['Nine names will appear.', 'Nau naam dikhenge.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'REQUEST 3 — Index page: "Which hometowns appear in the directory? Each once, with the header hometown."',
          'REQUEST 3 — Index page: "Directory me kaunse hometowns hain? Har ek ek baar, header hometown ke saath."',
        ],
        sol: 'SELECT DISTINCT city AS hometown FROM students;',
        hints: [
          ['Unique values with a renamed header.', 'Renamed header ke saath unique values.'],
          ['SELECT DISTINCT city AS hometown FROM students;', 'SELECT DISTINCT city AS hometown FROM students;'],
          ['Ten rows, header hometown.', 'Das rows, header hometown.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'hard',
        desc: [
          'REQUEST 4 — Scholarships: "Grade-A students aged 18 or older. Show name, grade and age — nothing else."',
          'REQUEST 4 — Scholarships: "Grade-A students jo 18 ya bade hain. Name, grade aur age dikhao — bas yahi."',
        ],
        sol: "SELECT name, grade, age FROM students WHERE grade = 'A' AND age >= 18;",
        hints: [
          ['Two conditions, both required (AND).', 'Do conditions, dono chahiye (AND).'],
          ["SELECT name, grade, age FROM students WHERE grade = 'A' AND age >= 18;", "SELECT name, grade, age FROM students WHERE grade = 'A' AND age >= 18;"],
          ['12 grade-A students exist; a few are under 18.', '12 grade-A students hain; kuch 18 se kam hain.'],
        ],
      }),
      task({
        d: 'very_hard',
        desc: [
          'REQUEST 5 — Executive card: "Directory cover data: count of students, unique hometowns and unique grades — one row, three numbers, headers total_students, hometowns, grades."',
          'REQUEST 5 — Executive card: "Directory cover data: students ki ginti, unique hometowns aur unique grades — ek row, teen numbers, headers total_students, hometowns, grades."',
        ],
        sol: 'SELECT COUNT(*) AS total_students, COUNT(DISTINCT city) AS hometowns, COUNT(DISTINCT grade) AS grades FROM students;',
        hints: [
          ['Three aggregate expressions in one row.', 'Ek row me teen aggregate expressions.'],
          ['SELECT COUNT(*) AS total_students, COUNT(DISTINCT city) AS hometowns, COUNT(DISTINCT grade) AS grades FROM students;', 'SELECT COUNT(*) AS total_students, COUNT(DISTINCT city) AS hometowns, COUNT(DISTINCT grade) AS grades FROM students;'],
          ['Expected numbers: 50, 10 and 5.', 'Expected numbers: 50, 10 aur 5.'],
        ],
        rules: { checkColumnNames: true },
      }),
    ],
  }),

  defineModule({
    n: 11,
    title: ['Comparison Operators', 'Comparison Operators'],
    time: '25 min',
    concepts: ['operators', 'equals', 'not equal', 'less than', 'greater than', 'text comparison', 'dates'],
    diagram: 'filter',
    objectives: [
      ['Use all six comparison operators fluently', 'Chhe comparison operators fluently use karna'],
      ['Compare text and dates, not just numbers', 'Sirf numbers nahi — text aur dates bhi compare karna'],
      ['Know the two spellings of not-equal and when NULL ruins comparisons', 'Not-equal ke do spellings aur NULL kab comparison bigaadta hai'],
    ],
    theory: [
      section(
        ['The six comparisons', 'Chhe comparisons'],
        [
          [
            'Every WHERE condition you will ever write builds on six operators: = (equal), <> or != (not equal), < (less), > (greater), <= (less or equal), >= (greater or equal). Each compares two values and yields TRUE, FALSE — or NULL if either side is unknown. Numbers compare mathematically; text compares alphabetically; dates compare chronologically because ISO format is designed to sort as text.',
            'Aapki har WHERE condition in chhe operators par banti hai: = (barabar), <> ya != (not equal), < (kam), > (zyada), <= (kam ya barabar), >= (zyada ya barabar). Har ek do values compare karke TRUE, FALSE deta hai — ya NULL agar koi side unknown ho. Numbers mathematically compare hote hain; text alphabetically; dates chronologically kyunki ISO format text ki tarah sort hone ke liye design kiya gaya hai.',
          ],
          [
            'One subtlety powers real bugs: \'amit\' < \'priya\' is TRUE because \'a\' sorts before \'p\' — string comparison is character-by-character, case-sensitively in SQLite. And dates: \'2023-06-15\' < \'2023-07-01\' works perfectly because year-first, month-second, day-third means text order equals time order.',
            'Ek subtlety real bugs ki jad hai: \'amit\' < \'priya\' TRUE hai kyunki \'a\' \'p\' se pehle aata hai — string comparison character-by-character hota hai, SQLite me case-sensitively. Aur dates: \'2023-06-15\' < \'2023-07-01\' perfectly chalta hai kyunki year-pehle, month-doosra, day-teesra ka matlab text order = time order.',
          ],
        ],
        [],
        'filter'
      ),
      section(
        ['Equal, and the two not-equals', 'Barabar, aur do not-equal'],
        [
          [
            '= is the precision tool: exact grade, exact city, exact id. Its mirror image is "not equal", written <> in standard SQL and != as a widely accepted alternative — identical behaviour in SQLite, so pick one and stay consistent. Notice that <> excludes NULL rows entirely: a student with no email is neither "equal to x" nor "not equal to x" — they are simply unknown (Module 16 fixes this with IS NULL).',
            '= precision tool hai: exact grade, exact city, exact id. Iska mirror "not equal" hai — standard SQL me <> aur widely accepted alternative != — SQLite me dono ka behaviour same, to ek chuno aur wahi raho. Dhyan do <> NULL rows ko poora hata deta hai: bina email wala student na "equal to x" hai na "not equal to x" — wo bas unknown hai (Module 16 isse IS NULL se theek karta hai).',
          ],
          [
            'Comparisons chain naturally with AND/OR when ranges are awkward — but the next module covers those; BETWEEN (Module 13) gives range filtering its own elegant syntax.',
            'Comparisons AND/OR se naturally judte hain jab range awkward ho — par wo agla module hai; BETWEEN (Module 13) range filtering ko apni alag saaf syntax deta hai.',
          ],
        ],
        [
          ['= exact match; <> / != exclusion', '= exact match; <> / != exclusion'],
          ['Text compares alphabetically, case-sensitively', 'Text alphabetically compare hota hai, case-sensitively'],
          ['ISO dates compare correctly as text', 'ISO dates text ki tarah sahi compare hoti hain'],
          ['NULL comparisons yield unknown — row dropped', 'NULL comparisons unknown dete hain — row hat jaati hai'],
        ]
      ),
    ],
    tutorial: {
      title: ['Six operators, one table', 'Chhe operators, ek table'],
      steps: [
        step(null, [
          'We will push the students table through all six comparisons and watch which rows survive each.',
          'Hum students table ko chheono comparisons se guzareinge aur dekhenge kaunsi rows har ek me bachti hain.',
        ]),
        step('SELECT name, age FROM students WHERE age = 18;', [
          'Equality: exactly 18-year-olds.',
          'Equality: exactly 18 saal wale.',
        ], { table: 'students', highlightWhere: 'age = 18' }),
        step('SELECT name, age FROM students WHERE age <> 18;', [
          'Exclusion: everyone except 18-year-olds.',
          'Exclusion: 18 saal walo ke alawa sab.',
        ], { table: 'students', highlightWhere: 'age <> 18' }),
        step('SELECT name, age FROM students WHERE age >= 20;', [
          'Threshold: 20 and older.',
          'Threshold: 20 aur usse bade.',
        ], { table: 'students', highlightWhere: 'age >= 20' }),
        step("SELECT name, enrollment_date FROM students WHERE enrollment_date >= '2023-06-20';", [
          'Dates compare as text — later enrolments only.',
          'Dates text ki tarah compare hote hain — sirf baad ke enrolments.',
        ], { run: true, table: 'students', highlightWhere: "enrollment_date >= '2023-06-20'" }),
      ],
    },
    syntax: {
      template: 'WHERE col = v   | col <> v   | col != v\nWHERE col < v   | col > v\nWHERE col <= v  | col >= v',
      parts: [
        { part: '= / <>', description: ['Exact match / exclusion', 'Exact match / exclusion'] },
        { part: '< / >', description: ['Strictly below / above', 'Strictly neeche / upar'] },
        { part: '<= / >=', description: ['Inclusive thresholds', 'Inclusive thresholds'] },
        { part: '!=', description: ['Same as <> (SQLite, MySQL, Postgres)', '<> jaisa hi (SQLite, MySQL, Postgres)'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT name FROM students WHERE age = 17;', [
        'Exact match on a number.',
        'Number par exact match.',
      ]),
      example('easy', "SELECT name FROM teachers WHERE subject <> 'Mathematics';", [
        'Exclusion on text — every non-Mathematics teacher.',
        'Text par exclusion — Mathematics ke alawa har teacher.',
      ]),
      example('medium', 'SELECT name, salary FROM teachers WHERE salary <= 52000;', [
        'Inclusive lower band: 52000 itself appears.',
        'Inclusive lower band: 52000 khud bhi aata hai.',
      ]),
      example('hard', "SELECT name, enrollment_date FROM students WHERE enrollment_date < '2023-06-18';", [
        'Date comparison: students who enrolled before June 18th.',
        'Date comparison: 18 June se pehle enrolle hue students.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Using <> to find missing values and seeing them vanish', '<> se missing values dhoondhna aur unka gayab hona'],
        ['Rows with NULL are never returned by <> — unknown is not "not equal". Use IS NULL for missing data.', 'NULL wali rows <> kabhi nahi laata — unknown "not equal" nahi hota. Missing data ke liye IS NULL use karo.']
      ),
      mistake(
        ["Comparing '10' style text dates or day-first dates", "'10' jaisi text dates ya day-first dates compare karna"],
        ['Only ISO YYYY-MM-DD compares correctly. \'15-06-2023\' sorts wrong and breaks every comparison.', 'Sirf ISO YYYY-MM-DD sahi compare hota hai. \'15-06-2023\' galat sort hota hai aur har comparison tod deta hai.']
      ),
      mistake(
        ['Assuming text comparison ignores case', 'Text comparison case ignore karta hai maan lena'],
        ['In SQLite, \'delhi\' = \'Delhi\' is FALSE. Store consistent case; compare with exact case, or use COLLATE NOCASE when needed.', 'SQLite me \'delhi\' = \'Delhi\' FALSE hai. Consistent case rakho; exact case se compare karo, ya zaroorat par COLLATE NOCASE use karo.']
      ),
    ],
    summary: [
      ['Six operators: =, <>, !=, <, >, <=, >=', 'Chhe operators: =, <>, !=, <, >, <=, >='],
      ['Text compares alphabetically; ISO dates compare correctly', 'Text alphabetically compare hota hai; ISO dates sahi'],
      ['<> and != are interchangeable in SQLite', 'SQLite me <> aur != interchangeable hain'],
      ['NULL never satisfies any comparison', 'NULL kisi comparison ko satisfy nahi karta'],
    ],
    quiz: [
      mcq(
        ["Which students does WHERE enrollment_date >= '2023-06-20' include?", "WHERE enrollment_date >= '2023-06-20' kaunse students include karta hai?"],
        [
          ['Only students enrolled in June', 'Sirf June me enrolle hue students'],
          ['Students enrolled on June 20th and any later date', '20 June ya uske baad enrolle hue students'],
          ['Students enrolled strictly after June 20th', 'Sirf 20 June ke baad wale students'],
          ['No one — dates cannot be compared', 'Koi nahi — dates compare nahi ho sakte'],
        ],
        1,
        ['>= includes the boundary date itself; ISO format makes date comparison valid.', '>= boundary date ko bhi include karta hai; ISO format date comparison valid banata hai.']
      ),
      outputQ(
        'SELECT COUNT(*) FROM teachers WHERE salary >= 60000 AND salary <= 78000;',
        ['How many teachers earn between 60000 and 78000 inclusive?', '60000 aur 78000 ke beech (shaamil) kitne teachers kamate hain?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[5]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[4]] } },
          { label: 'C', result: { columns: ['COUNT(*)'], rows: [[6]] } },
          { label: 'D', result: { error: 'Error: near "AND": syntax error' } },
        ],
        0,
        ['Salaries in the band: 60000, 65000, 72000, 74000, 78000 — five teachers.', 'Band me salaries: 60000, 65000, 72000, 74000, 78000 — paanch teachers.']
      ),
      buildQ(
        ['Build: teachers who are not History teachers (names only)', 'Banao: History ke alawa ke teachers (sirf naam)'],
        ['FROM', 'teachers', 'SELECT', 'name', 'WHERE', '<>', "'History'", 'subject'],
        ['SELECT', 'name', 'FROM', 'teachers', 'WHERE', 'subject', '<>', "'History'"],
        ['Column, operator, quoted value after WHERE.', 'Column, operator, quoted value — WHERE ke baad.']
      ),
      blanksQ(
        "SELECT name FROM teachers WHERE salary ___ 50000 AND salary ___ 90000;",
        [
          { options: ['>', '>=', '<', '='], correct: '>' },
          { options: ['<', '>', '<=', '!='], correct: '<' },
        ],
        ['Strictly above 50000 and strictly below 90000.', '50000 se strictly upar aur 90000 se strictly neeche.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Attendance audit: students who are exactly 17. Show name and age.',
          'Attendance audit: exactly 17 saal ke students. Name aur age dikhao.',
        ],
        sol: 'SELECT name, age FROM students WHERE age = 17;',
        hints: [
          ['Single equality on a number.', 'Number par single equality.'],
          ['SELECT name, age FROM students WHERE age = 17;', 'SELECT name, age FROM students WHERE age = 17;'],
          ['Ages 17 are a small group here.', '17 saal wale yahan chhota group hain.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'The arts faculty excludes sports staff for this survey: teacher names for everyone whose subject is not Sports.',
          'Arts faculty is survey me sports staff ko chhod deti hai: sabke teacher naam jinka subject Sports nahi hai.',
        ],
        sol: "SELECT name FROM teachers WHERE subject <> 'Sports';",
        hints: [
          ['Exclusion on text — <> with quotes. Hmm, teachers table has no Sports subject, so careful: use any not-equal you like on subject, e.g. \'Mathematics\' would also be "not X" — but the task asks specifically NOT Sports (any operator spelling works).', 'Text par exclusion — <> quotes ke saath. Hmm, teachers table me Sports subject hai hi nahi, to dhyan: subject par koi bhi not-equal chalega, par task SPECIFICALLY NOT Sports maangta hai.'],
          ["SELECT name FROM teachers WHERE subject <> 'Sports';", "SELECT name FROM teachers WHERE subject <> 'Sports';"],
          ['Since no teacher has subject Sports, all 10 names return — and that is the correct answer.', 'Kisi teacher ka subject Sports nahi hai, isliye saare 10 naam aate hain — aur wahi sahi jawab hai.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'Budget review: departments with a budget of at least 300000. Show name and budget.',
          'Budget review: kam se kam 300000 budget wale departments. Name aur budget dikhao.',
        ],
        sol: 'SELECT name, budget FROM departments WHERE budget >= 300000;',
        hints: [
          ['Inclusive threshold — 300000 counts.', 'Inclusive threshold — 300000 bhi ginta hai.'],
          ['SELECT name, budget FROM departments WHERE budget >= 300000;', 'SELECT name, budget FROM departments WHERE budget >= 300000;'],
          ['Three departments qualify.', 'Teen departments qualify karte hain.'],
        ],
      }),
      task({
        d: 'hard',
        desc: [
          'Early birds: students who enrolled before 2023-06-18. Show name and enrollment_date.',
          'Early birds: 2023-06-18 se pehle enrolle hue students. Name aur enrollment_date dikhao.',
        ],
        sol: "SELECT name, enrollment_date FROM students WHERE enrollment_date < '2023-06-18';",
        hints: [
          ['Dates compare as ISO text.', 'Dates ISO text ki tarah compare hote hain.'],
          ["SELECT name, enrollment_date FROM students WHERE enrollment_date < '2023-06-18';", "SELECT name, enrollment_date FROM students WHERE enrollment_date < '2023-06-18';"],
          ['Strictly before — the 18th itself does not appear.', 'Strictly pehle — 18 tarikh khud nahi aayegi.'],
        ],
      }),
      task({
        d: 'very_hard',
        desc: [
          'Salary bands for the pay review: teacher name, subject and salary for anyone earning strictly more than 50000 but at most 78000. Row order free.',
          'Pay review ke salary bands: 50000 se strictly zyada par 78000 tak kamane wale har teacher ka naam, subject aur salary. Row order free.',
        ],
        sol: 'SELECT name, subject, salary FROM teachers WHERE salary > 50000 AND salary <= 78000;',
        hints: [
          ['Two comparisons joined with AND: > 50000 and <= 78000.', 'AND se jude do comparisons: > 50000 aur <= 78000.'],
          ['SELECT name, subject, salary FROM teachers WHERE salary > 50000 AND salary <= 78000;', 'SELECT name, subject, salary FROM teachers WHERE salary > 50000 AND salary <= 78000;'],
          ['Salaries 52000–78000 appear: five teachers.', '52000–78000 wali salaries: paanch teachers.'],
        ],
      }),
    ],
  }),

  defineModule({
    n: 12,
    title: ['Logical Operators', 'Logical Operators'],
    time: '25 min',
    concepts: ['and', 'or', 'not', 'logical operators', 'precedence', 'parentheses', 'boolean logic'],
    diagram: 'filter',
    objectives: [
      ['Combine conditions with AND, OR and NOT', 'AND, OR aur NOT se conditions jodna'],
      ['Predict how precedence changes meaning', 'Precedence meaning kaise badalta hai predict karna'],
      ['Use parentheses to make logic unambiguous', 'Parentheses se logic saaf-saaf banana'],
    ],
    theory: [
      section(
        ['AND, OR, NOT', 'AND, OR, NOT'],
        [
          [
            'Real filters rarely have one condition: "grade A AND age >= 18", "city Delhi OR city Mumbai", "NOT grade F". AND keeps rows where every condition is true; OR keeps rows where any is; NOT flips true to false. These three build every logical filter you will ever write — the same logic used in every programming language.',
            'Real filters me aksar ek se zyada condition hoti hai: "grade A AUR age >= 18", "city Delhi YA city Mumbai", "grade F NAHI". AND wahi rows rakhta hai jahan har condition true ho; OR wahi jahan koi ek true ho; NOT true ko false kar deta hai. Yeh teeno har logical filter ki neev hain — har programming language me wahi logic.',
          ],
          [
            'Where AND is strict (narrows the result), OR is generous (widens it). Mixing them naively is where bugs are born — because SQL, like algebra, evaluates AND before OR.',
            'AND strict hota hai (result ko tight karta hai), OR generous (result ko chauda). Dono ko bewakoofi se mix karna bugs ki janni hai — kyunki SQL, algebra ki tarah, AND ko OR se pehle solve karta hai.',
          ],
        ],
        [],
        'filter'
      ),
      section(
        ['Precedence: the invisible bug', 'Precedence: invisible bug'],
        [
          [
            'Consider: WHERE city = \'Delhi\' OR city = \'Mumbai\' AND grade = \'A\'. SQL reads this as Delhi-students OR (Mumbai-students-with-grade-A) — every Delhi student of any grade slips through! What you probably meant was (Delhi OR Mumbai) AND grade A. Parentheses force your meaning; without them, AND binds tighter than OR.',
            'Dekho: WHERE city = \'Delhi\' OR city = \'Mumbai\' AND grade = \'A\'. SQL ise padhta hai Delhi-students OR (Mumbai-wale-grade-A-students) — kisi bhi grade wala har Delhi student nikal jaata hai! Aapka matlab shayad tha (Delhi YA Mumbai) AUR grade A. Parentheses aapka matlab force karte hain; bina unke, AND, OR se tight judta hai.',
          ],
          [
            'The professional rule: whenever AND and OR appear together, add parentheses — even when the default happens to be right. Future readers (including you) will thank the clarity, and the engine thanks the certainty. NOT also binds tightly and benefits from brackets around its operand.',
            'Professional rule: jab bhi AND aur OR saath aayein, parentheses laga do — jab default sahi bhi ho. Future readers (aap khud shaamil) clarity ke liye thanks kahenge, aur engine certainty ke liye. NOT bhi tight judta hai — iske operand ke around brackets ka fayda hota hai.',
          ],
        ],
        [
          ['AND narrows; OR widens; NOT flips', 'AND tight karta hai; OR chauda; NOT ulta'],
          ['AND binds before OR — always', 'AND, OR se pehle judta hai — hamesha'],
          ['Parentheses whenever AND and OR mix', 'AND aur OR mix hon to parentheses hamesha'],
        ]
      ),
      section(
        ['An analogy: party entry rules', 'Analogy: party entry rules'],
        [
          [
            'AND is the club requiring ID AND a ticket — both, no exceptions. OR is the family event: kids OR seniors enter free — either one suffices. NOT is the bouncer\'s list: NOT on the blacklist means you enter. Combine them without brackets and you get the party where "VIPs or ticket-holders with a plus-one" quietly becomes "all VIPs, plus ticket-holders-who-brought-someone" — a very different guest list.',
            'AND wo club hai jahan ID AUR ticket dono chahiye — dono, koi exception nahi. OR family event hai: bachche YA seniors free entry — koi ek bhi kaafi. NOT bouncer ki list hai: blacklist par NAHI matlab entry. Bina bracket ke combine karo to aisa party banega jahan "VIP ya plus-one wale ticket-holders" chupke se ban jaayenge "saare VIP, plus wo ticket-holders jo kisi ko laye" — bilkul alag guest list.',
          ],
        ]
      ),
    ],
    tutorial: {
      title: ['AND vs OR, visually', 'AND vs OR, visually'],
      steps: [
        step(null, [
          'One table, two filters, opposite personalities — then the precedence trap, fixed with brackets.',
          'Ek table, do filters, ulte swabhav — phir precedence trap, brackets se theek.',
        ]),
        step("SELECT name, city, grade FROM students WHERE city = 'Delhi' AND grade = 'A';", [
          'AND: only Delhi students who are also grade A.',
          'AND: sirf wo Delhi students jo grade A bhi hain.',
        ], { table: 'students', highlightWhere: "city = 'Delhi' AND grade = 'A'" }),
        step("SELECT name, city, grade FROM students WHERE city = 'Delhi' OR city = 'Mumbai';", [
          'OR: anyone from either megacity, any grade.',
          'OR: kisi bhi megacity se koi bhi, koi bhi grade.',
        ], { table: 'students', highlightWhere: "city = 'Delhi' OR city = 'Mumbai'" }),
        step("SELECT name, city, grade FROM students WHERE (city = 'Delhi' OR city = 'Mumbai') AND grade = 'A';", [
          'Brackets make the intended logic explicit: big-city students with grade A.',
          'Brackets se matlab wala logic saaf: bade sheher ke grade-A students.',
        ], { table: 'students', highlightWhere: "(city = 'Delhi' OR city = 'Mumbai') AND grade = 'A'" }),
        step("SELECT name FROM students WHERE NOT grade = 'F';", [
          'NOT flips the test — everyone except grade F.',
          'NOT test ulta kar deta hai — grade F ke alawa sab.',
        ], { run: true, table: 'students', highlightWhere: "NOT grade = 'F'" }),
      ],
    },
    syntax: {
      template: 'WHERE cond1 AND cond2\nWHERE cond1 OR cond2\nWHERE NOT cond\nWHERE (cond1 OR cond2) AND cond3',
      parts: [
        { part: 'AND', description: ['All conditions must hold', 'Saari conditions honi chahiye'] },
        { part: 'OR', description: ['At least one condition holds', 'Kam se kam ek condition ho'] },
        { part: 'NOT', description: ['Flips the condition', 'Condition ulta kar deta hai'] },
        { part: '( )', description: ['Force grouping — use when mixing AND/OR', 'Grouping force karo — AND/OR mix karte waqt'] },
      ],
    },
    examples: [
      example('very_easy', "SELECT name FROM students WHERE city = 'Delhi' AND grade = 'A';", [
        'Both conditions must hold — a precise slice.',
        'Dono conditions honi chahiye — ek precise slice.',
      ]),
      example('easy', "SELECT name, city FROM students WHERE city = 'Pune' OR city = 'Jaipur';", [
        'Either city qualifies — the generous OR.',
        'Koi bhi city chalegi — generous OR.',
      ]),
      example('medium', "SELECT name, grade FROM students WHERE (city = 'Delhi' OR city = 'Mumbai') AND age >= 19;", [
        'Bracketed OR inside an AND — the everyday professional pattern.',
        'AND ke andar bracketed OR — rozmarra professional pattern.',
      ]),
      example('hard', "SELECT name, age FROM students WHERE NOT (age BETWEEN 17 AND 19);", [
        'NOT around a grouped condition — everyone outside the core age band.',
        'Grouped condition ke around NOT — core age band ke bahar ke sab.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Mixing AND/OR without parentheses', 'Bina parentheses ke AND/OR mix karna'],
        ['a OR b AND c silently means a OR (b AND c). Write (a OR b) AND c when that is the intent.', 'a OR b AND c chup-chaap a OR (b AND c) hota hai. Jab matlab wohi ho to (a OR b) AND c likho.']
      ),
      mistake(
        ['Chained ORs repeating the column — a common sign you want IN', 'Column repeat karte hue OR ki chain — IN chahiye hone ki nishani'],
        ["city = 'A' OR city = 'B' OR city = 'C' works but city IN ('A','B','C') is cleaner (Module 14).", "city = 'A' OR city = 'B' OR city = 'C' chalta hai par city IN ('A','B','C') saaf hai (Module 14)."]
      ),
      mistake(
        ['NOT = instead of <>', 'NOT = ki jagah <> ka confusion'],
        ['NOT grade = \'F\' and grade <> \'F\' are equivalent — both fine. Just never write NOT = as a single token.', 'NOT grade = \'F\' aur grade <> \'F\' barabar hain — dono theek. Bas NOT = ko ek token ki tarah mat likho.']
      ),
    ],
    summary: [
      ['AND requires all; OR requires any; NOT inverts', 'AND sab maangta hai; OR koi ek; NOT ulta'],
      ['AND evaluates before OR — parenthesise when mixed', 'AND pehle aata hai OR se — mix karo to bracket lagao'],
      ['Chained ORs on one column signal IN', 'Ek column par OR ki chain IN ki nishani hai'],
      ['Logic errors return wrong data silently — test boundaries', 'Logic errors chup-chaap galat data deti hain — boundaries test karo'],
    ],
    quiz: [
      mcq(
        ["How does SQL read: city = 'Delhi' OR city = 'Mumbai' AND grade = 'A'?", "SQL kaise padhta hai: city = 'Delhi' OR city = 'Mumbai' AND grade = 'A'?"],
        [
          ["(Delhi OR Mumbai) AND grade A", "(Delhi YA Mumbai) AUR grade A"],
          ["Delhi students of any grade, plus Mumbai students with grade A", "Delhi ke kisi bhi grade wale, plus grade-A Mumbai students"],
          ['A syntax error', 'Syntax error'],
          ['Random interpretation per engine', 'Har engine me random interpretation'],
        ],
        1,
        ['AND binds tighter: the OR\'s right side becomes (Mumbai AND grade A). Brackets fix the intent.', 'AND tight judta hai: OR ka right side ban jaata hai (Mumbai AND grade A). Brackets matlab theek karte hain.']
      ),
      outputQ(
        "SELECT COUNT(*) FROM students WHERE (city = 'Delhi' OR city = 'Mumbai') AND grade = 'A';",
        ['How many grade-A students live in Delhi or Mumbai?', 'Delhi ya Mumbai me kitne grade-A students rehte hain?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[2]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[12]] } },
          { label: 'C', result: { columns: ['COUNT(*)'], rows: [[15]] } },
          { label: 'D', result: { error: 'Error: near "OR": syntax error' } },
        ],
        0,
        ['Delhi has 7 and Mumbai 8 students; of those 15, exactly 2 also carry grade A.', 'Delhi me 7 aur Mumbai me 8 students hain; un 15 me se exactly 2 ka grade A bhi hai.']
      ),
      buildQ(
        ['Build: grade-A students from Delhi (both conditions)', 'Banao: Delhi ke grade-A students (dono conditions)'],
        ["WHERE", 'AND', 'grade', "'A'", 'SELECT', 'name', 'FROM', 'students', 'city', '=', "'Delhi'"],
        ['SELECT', 'name', 'FROM', 'students', 'WHERE', 'city', '=', "'Delhi'", 'AND', 'grade', '=', "'A'"],
        ['City condition, AND, grade condition.', 'City condition, AND, grade condition.']
      ),
      blanksQ(
        "SELECT name FROM students ___ city = 'Delhi' ___ city = 'Mumbai';",
        [
          { options: ['WHERE', 'AND', 'OR', 'NOT'], correct: 'WHERE' },
          { options: ['OR', 'AND', 'NOT', 'XOR'], correct: 'OR' },
        ],
        ['Either city qualifies → OR.', 'Koi bhi city chalegi → OR.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Both required: students from Delhi with grade B. Show name, city, grade.',
          'Dono chahiye: Delhi ke grade-B students. Name, city, grade dikhao.',
        ],
        sol: "SELECT name, city, grade FROM students WHERE city = 'Delhi' AND grade = 'B';",
        hints: [
          ['AND joins two required conditions.', 'AND do zaroori conditions jodta hai.'],
          ["SELECT name, city, grade FROM students WHERE city = 'Delhi' AND grade = 'B';", "SELECT name, city, grade FROM students WHERE city = 'Delhi' AND grade = 'B';"],
          ['A small group — one or two students.', 'Chhota group — ek ya do students.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'The travel desk covers two cities: students from Pune OR Jaipur. Show name and city.',
          'Travel desk do cities cover karti hai: Pune YA Jaipur ke students. Name aur city dikhao.',
        ],
        sol: "SELECT name, city FROM students WHERE city = 'Pune' OR city = 'Jaipur';",
        hints: [
          ['OR — either city qualifies.', 'OR — koi bhi city chalegi.'],
          ["SELECT name, city FROM students WHERE city = 'Pune' OR city = 'Jaipur';", "SELECT name, city FROM students WHERE city = 'Pune' OR city = 'Jaipur';"],
          ['Row order is not checked.', 'Row order check nahi hota.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'The merit list for the inter-city quiz: grade-A students from Delhi OR Mumbai. Show name, city and grade — brackets recommended.',
          'Inter-city quiz ki merit list: Delhi YA Mumbai ke grade-A students. Name, city aur grade dikhao — brackets recommend kiye jaate hain.',
        ],
        sol: "SELECT name, city, grade FROM students WHERE (city = 'Delhi' OR city = 'Mumbai') AND grade = 'A';",
        hints: [
          ['Group the OR, then AND the grade.', 'OR ko group karo, phir grade ke saath AND.'],
          ["SELECT name, city, grade FROM students WHERE (city = 'Delhi' OR city = 'Mumbai') AND grade = 'A';", "SELECT name, city, grade FROM students WHERE (city = 'Delhi' OR city = 'Mumbai') AND grade = 'A';"],
          ['Three students qualify.', 'Teen students qualify karte hain.'],
        ],
      }),
      task({
        d: 'hard',
        desc: [
          'Exclusion logic: students who are NOT from Delhi and NOT minors — i.e. city <> \'Delhi\' AND age >= 18 — but write it with one NOT-style form OR the <> form; show name, city, age.',
          'Exclusion logic: wo students jo Delhi se NAHI hain AUR minors bhi nahi — yaani city <> \'Delhi\' AND age >= 18 — par isse ek NOT-style form YA <> form me likho; name, city, age dikhao.',
        ],
        sol: "SELECT name, city, age FROM students WHERE NOT city = 'Delhi' AND age >= 18;",
        hints: [
          ['NOT flips a single comparison; AND still applies.', 'NOT ek comparison ulta karta hai; AND phir bhi lagta hai.'],
          ["SELECT name, city, age FROM students WHERE NOT city = 'Delhi' AND age >= 18;", "SELECT name, city, age FROM students WHERE NOT city = 'Delhi' AND age >= 18;"],
          ["Equivalent: city <> 'Delhi' AND age >= 18 — both pass.", "Equivalent: city <> 'Delhi' AND age >= 18 — dono pass honge."],
        ],
      }),
      task({
        d: 'very_hard',
        desc: [
          'The scholarship committee wants seniors from the four metro cities (Delhi, Mumbai, Bangalore, Hyderabad — as two ORs is painful, so think IN or bracketed ORs) who are 19 or older and NOT grade F. Show name, city, age, grade. (One statement — you may use IN, which the next module teaches.)',
          'Scholarship committee chaar metro cities (Delhi, Mumbai, Bangalore, Hyderabad — do ORs painful hain, to IN ya bracketed ORs socho) ke 19 ya bade students chahti hai jo grade F NAHI hon. Name, city, age, grade dikhao. (Ek statement — IN use kar sakte ho, agla module sikhata hai.)',
        ],
        sol: "SELECT name, city, age, grade FROM students WHERE city IN ('Delhi', 'Mumbai', 'Bangalore', 'Hyderabad') AND age >= 19 AND grade <> 'F';",
        hints: [
          ['Three ideas: city set, age threshold, grade exclusion.', 'Teen ideas: city set, age threshold, grade exclusion.'],
          ["SELECT name, city, age, grade FROM students WHERE city IN ('Delhi','Mumbai','Bangalore','Hyderabad') AND age >= 19 AND grade <> 'F';", "SELECT name, city, age, grade FROM students WHERE city IN ('Delhi','Mumbai','Bangalore','Hyderabad') AND age >= 19 AND grade <> 'F';"],
          ['Bracketed ORs instead of IN also pass validation.', 'IN ki jagah bracketed ORs bhi validation pass karte hain.'],
        ],
      }),
    ],
  }),
];
