'use client';

// Modules 16-18: NULL Handling · ORDER BY Basics · ORDER BY Multiple Columns

import { defineModule, section, step, example, mistake, mcq, outputQ, buildQ, blanksQ, task } from '../builder';
import type { Module } from '@/types/content';

export const modules: Module[] = [
  defineModule({
    n: 16,
    title: ['NULL Handling', 'NULL Handling'],
    time: '25 min',
    concepts: ['null', 'is null', 'is not null', 'unknown', 'coalesce', 'ifnull', 'missing data'],
    diagram: 'null-concept',
    objectives: [
      ['Explain what NULL is and is not', 'NULL kya hai aur kya nahi hai, samjhana'],
      ['Find and exclude missing values with IS NULL / IS NOT NULL', 'IS NULL / IS NOT NULL se missing values dhoondhna aur hatana'],
      ['Predict NULL behaviour in comparisons and aggregates', 'Comparisons aur aggregates me NULL ka behaviour predict karna'],
    ],
    theory: [
      section(
        ['NULL means unknown', 'NULL ka matlab unknown'],
        [
          [
            'NULL is not zero, not an empty string, not "no". It is the database\'s honest statement: this value is absent or unknown. A student\'s missing email, an unfinished course\'s score, an unassigned department head — each is NULL. Twenty-nine of our enrollments carry NULL scores because those courses are still being graded.',
            'NULL zero nahi hai, empty string nahi, "no" nahi. Yeh database ka imandaar bayan hai: yeh value gayab ya unknown hai. Student ka missing email, adhoore course ka score, unassigned department head — har ek NULL hai. Hamare enrollments me 40 NULL scores hain kyunki wo courses abhi grade ho rahe hain.',
          ],
          [
            'Treating NULL as zero is the most expensive data mistake in industry: averaging salaries and quietly counting missing ones as 0 drags the average down; SUM over all-NULL gives NULL, not 0. The defence is knowing exactly where NULL poisons logic — comparisons — and where it is politely skipped — aggregates.',
            'NULL ko zero samajhna industry ki sabse mehngi data galti hai: salaries ka average lete hue missing ko chupchap 0 ganna average giraa deta hai; sab-NULL par SUM 0 nahi, NULL deta hai.Bachaav yeh jaanna hai ki NULL kahan logic zeher karta hai — comparisons — aur kahan politely skip hota hai — aggregates.',
          ],
        ],
        [],
        'null-concept'
      ),
      section(
        ['Three-valued logic', 'Teen-valued logic'],
        [
          [
            'Every comparison has three outcomes: TRUE, FALSE, or UNKNOWN. NULL = NULL is not TRUE — two unknowns are not thereby equal. That is why WHERE email = NULL returns nothing, ever, in any engine. The only correct tests are IS NULL and IS NOT NULL, which check the state of the cell rather than comparing values.',
            'Har comparison ke teen outcome hote hain: TRUE, FALSE, ya UNKNOWN. NULL = NULL TRUE nahi hai — do unknowns isliye barabar nahi ho jaate. Isi liye WHERE email = NULL kabhi kuch nahi laata, kisi bhi engine me. Sahi tests sirf IS NULL aur IS NOT NULL hain — jo value compare karne ki jagah cell ki halat check karte hain.',
          ],
          [
            'NULL interacts with AND/OR in surprising ways: FALSE AND NULL is FALSE (already doomed), but TRUE AND NULL is UNKNOWN (row dropped); TRUE OR NULL is TRUE (already saved). You do not need to memorise the full table — just internalise "unknown propagates, and WHERE keeps only TRUE".',
            'NULL AND/OR ke saath surprising tarike se pesh aata hai: FALSE AND NULL FALSE hai (pehle hi doom), par TRUE AND NULL UNKNOWN hai (row gayab); TRUE OR NULL TRUE hai (bach gaya). Poora table rattne ki zaroorat nahi — bas yeh basa lo "unknown failta hai, aur WHERE sirf TRUE rakhta hai".',
          ],
        ],
        [
          ['IS NULL / IS NOT NULL are the only NULL tests', 'IS NULL / IS NOT NULL hi NULL ke tests hain'],
          ['WHERE keeps only TRUE — UNKNOWN rows drop', 'WHERE sirf TRUE rakhta hai — UNKNOWN rows gayab'],
          ['Aggregates skip NULLs: COUNT(col), AVG, SUM ignore them', 'Aggregates NULL skip karte hain: COUNT(col), AVG, SUM unhe ignore karte hain'],
        ]
      ),
      section(
        ['Replacing NULL on display', 'Display par NULL replace karna'],
        [
          [
            'Reports often want a friendly value instead of empty space. IFNULL(email, \'not provided\') and its standard twin COALESCE(email, backup_email, \'none\') substitute a fallback — COALESCE returns the first non-NULL argument, making it perfect for "prefer A, else B, else default" chains. The underlying data stays NULL; only the display changes.',
            'Reports aksar khaali jagah ki jagah friendly value chahti hain. IFNULL(email, \'not provided\') aur iska standard juaab COALESCE(email, backup_email, \'none\') fallback deta dete hain — COALESCE pehla non-NULL argument lauta deta hai, jisse "pehle A, warna B, warna default" chains perfect bante hain. Neeche ka data NULL hi rehta hai; sirf display badalta hai.',
          ],
        ]
      ),
    ],
    tutorial: {
      title: ['The rows that vanish', 'Gayab hone wali rows'],
      steps: [
        step(null, [
          'We watch = NULL fail, IS NULL succeed, and aggregates quietly skip the unknowns.',
          'Hum dekhenge = NULL fail hota hai, IS NULL chalta hai, aur aggregates chupchap unknowns skip karte hain.',
        ]),
        step('SELECT name FROM students WHERE email = NULL;', [
          'Zero rows — equality with NULL is always UNKNOWN. This is the classic bug.',
          'Zero rows — NULL ke saath equality hamesha UNKNOWN hoti hai. Yahi classic bug hai.',
        ], { table: 'students', highlightWhere: 'email = NULL' }),
        step('SELECT name FROM students WHERE email IS NULL;', [
          'The correct test — 9 students with missing email appear.',
          'Sahi test — email missing wale 9 students dikhte hain.',
        ], { table: 'students', highlightWhere: 'email IS NULL' }),
        step('SELECT COUNT(*) AS all_rows, COUNT(email) AS with_email FROM students;', [
          'COUNT(*) counts 50 rows; COUNT(email) counts only 41 known emails.',
          'COUNT(*) 50 rows ginta hai; COUNT(email) sirf 41 pata emails ginta hai.',
        ], { run: true, table: 'students' }),
        step("SELECT name, IFNULL(email, 'not provided') AS contact FROM students LIMIT 8;", [
          'Display-time rescue: NULL becomes readable text for the report.',
          'Display-time rescue: NULL report ke liye padhne-layak text ban jaata hai.',
        ], { run: true, table: 'students' }),
      ],
    },
    syntax: {
      template: "WHERE col IS NULL\nWHERE col IS NOT NULL\nIFNULL(col, fallback)\nCOALESCE(a, b, c)",
      parts: [
        { part: 'IS NULL', description: ['Test for missing values', 'Missing values ka test'] },
        { part: 'IS NOT NULL', description: ['Test for present values', 'Maujood values ka test'] },
        { part: 'IFNULL / COALESCE', description: ['Substitute a fallback for display', 'Display ke liye fallback dena'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT name FROM students WHERE email IS NULL;', [
        'Everyone the = NULL bug hides.',
        'Sab wo log jinko = NULL ka bug chhupa deta hai.',
      ]),
      example('easy', 'SELECT name, email FROM students WHERE email IS NOT NULL;', [
        'Complete contact records only.',
        'Sirf complete contact records.',
      ]),
      example('medium', 'SELECT COUNT(*) AS total, COUNT(score) AS graded FROM enrollments;', [
        '200 enrollments, only 160 graded — the 40 gap is NULL scores.',
        '200 enrollments, sirf 160 graded — 40 ka gap NULL scores hain.',
      ]),
      example('hard', "SELECT name, IFNULL(email, 'missing') AS contact FROM students WHERE email IS NULL;", [
        'Combining the NULL filter with a display fallback.',
        'NULL filter aur display fallback ko jodna.',
      ]),
    ],
    mistakes: [
      mistake(
        ['WHERE col = NULL (and wondering why zero rows)', 'WHERE col = NULL (aur zero rows dekh ke hairan hona)'],
        ['Equality with NULL is UNKNOWN, never TRUE. Use IS NULL — this is the single most common SQL bug in the world.', 'NULL ke saath equality UNKNOWN hoti hai, TRUE kabhi nahi. IS NULL use karo — duniya ki sabse common SQL bug yahi hai.']
      ),
      mistake(
        ['Treating NULL as 0 in mental math', 'Mental math me NULL ko 0 samajhna'],
        ['AVG(score) skips NULLs entirely — it does not average them as zero. Know which of your columns are nullable before trusting any aggregate.', 'AVG(score) NULLs poora skip karta hai — wo unhe zero maan kar average nahi leta. Aggregate par bharosa karne se pehle jaan lo kaunse columns nullable hain.']
      ),
      mistake(
        ['Using IFNULL in WHERE to filter NULLs', 'NULL filter karne ke liye WHERE me IFNULL use karna'],
        ['IFNULL is a display helper. Filtering stays with IS NULL / IS NOT NULL — cheaper and clearer.', 'IFNULL display helper hai. Filtering IS NULL / IS NOT NULL ke paas rehti hai — sasti aur saaf.']
      ),
    ],
    summary: [
      ['NULL = unknown; not zero, not empty string', 'NULL = unknown; zero nahi, empty string nahi'],
      ['Only IS NULL / IS NOT NULL test it correctly', 'Sirf IS NULL / IS NOT NULL ise sahi test karte hain'],
      ['WHERE keeps TRUE only — UNKNOWN rows drop', 'WHERE sirf TRUE rakhta hai — UNKNOWN rows gayab'],
      ['COUNT(col) and AVG skip NULLs; IFNULL/COALESCE patch display', 'COUNT(col) aur AVG NULL skip karte hain; IFNULL/COALESCE display theek karte hain'],
    ],
    quiz: [
      mcq(
        ['Why does WHERE email = NULL return zero rows?', 'WHERE email = NULL zero rows kyun deta hai?'],
        [
          ['No student lacks an email', 'Kisi student ka email missing nahi hai'],
          ['NULL = NULL evaluates to UNKNOWN, and WHERE keeps only TRUE', 'NULL = NULL UNKNOWN hota hai, aur WHERE sirf TRUE rakhta hai'],
          ['It is a syntax error', 'Yeh syntax error hai'],
          ['Emails are stored encrypted', 'Emails encrypted store hote hain'],
        ],
        1,
        ['Comparisons involving NULL yield UNKNOWN — which is not TRUE, so the row is filtered out. IS NULL is the correct test.', 'NULL wali comparisons UNKNOWN deti hain — jo TRUE nahi hai, to row filter ho jaati hai. IS NULL sahi test hai.']
      ),
      outputQ(
        'SELECT COUNT(*), COUNT(score) FROM enrollments;',
        ['What are the two numbers?', 'Dono numbers kya hain?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)', 'COUNT(score)'], rows: [[200, 160]] } },
          { label: 'B', result: { columns: ['COUNT(*)', 'COUNT(score)'], rows: [[200, 200]] } },
          { label: 'C', result: { columns: ['COUNT(*)', 'COUNT(score)'], rows: [[160, 160]] } },
          { label: 'D', result: { error: 'Error: misuse of aggregate' } },
        ],
        0,
        ['All 200 enrollment rows exist; 40 scores are NULL (courses in progress), so COUNT(score) sees 160.', 'Saari 200 enrollment rows hain; 40 scores NULL hain (courses chal rahe hain), to COUNT(score) 160 dekhta hai.']
      ),
      buildQ(
        ['Build: enrollments that have not been graded yet', 'Banao: jo enrollments abhi grade nahi hui'],
        ['FROM', 'enrollments', 'SELECT', '*', 'WHERE', 'IS NULL', 'score'],
        ['SELECT', '*', 'FROM', 'enrollments', 'WHERE', 'score', 'IS NULL'],
        ['The column being tested sits before IS NULL.', 'Jo column test ho raha hai wo IS NULL se pehle aata hai.']
      ),
      blanksQ(
        "SELECT name FROM students WHERE email ___ ___ ___;",
        [
          { options: ['IS', '=', 'LIKE', 'NOT'], correct: 'IS' },
          { options: ['NOT', 'NULL', 'EMPTY', 'NONE'], correct: 'NOT' },
          { options: ['NULL', 'EMPTY', 'NONE', 'VOID'], correct: 'NULL' },
        ],
        ['IS NOT NULL selects rows where a value exists.', 'IS NOT NULL wahi rows chunta hai jahan value maujood hai.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Data quality: students with no email on file. Show their names.',
          'Data quality: jinke email file par nahi hai wo students. Unke naam dikhao.',
        ],
        sol: 'SELECT name FROM students WHERE email IS NULL;',
        hints: [
          ['IS NULL — the only correct test.', 'IS NULL — hi sahi test.'],
          ['SELECT name FROM students WHERE email IS NULL;', 'SELECT name FROM students WHERE email IS NULL;'],
          ['Nine students appear.', 'Nau students dikhte hain.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'The newsletter goes out today: students who DO have an email. Show name and email.',
          'Newsletter aaj jaari hogi: jo students email RAKHTE hain. Name aur email dikhao.',
        ],
        sol: 'SELECT name, email FROM students WHERE email IS NOT NULL;',
        hints: [
          ['IS NOT NULL keeps present values.', 'IS NOT NULL maujood values rakhta hai.'],
          ['SELECT name, email FROM students WHERE email IS NOT NULL;', 'SELECT name, email FROM students WHERE email IS NOT NULL;'],
          ['41 rows appear.', '41 rows dikhti hain.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'Course completion audit: how many enrollments are still ungraded? A single count, aliased as ungraded.',
          'Course completion audit: kitni enrollments abhi ungraded hain? Ek count, aliased ungraded.',
        ],
        sol: 'SELECT COUNT(*) AS ungraded FROM enrollments WHERE score IS NULL;',
        hints: [
          ['Count rows passing the NULL test.', 'NULL test pass karne wali rows gino.'],
          ['SELECT COUNT(*) AS ungraded FROM enrollments WHERE score IS NULL;', 'SELECT COUNT(*) AS ungraded FROM enrollments WHERE score IS NULL;'],
          ['The answer is 40.', 'Jawab 40 hai.'],
        ],
      }),
      task({
        d: 'hard',
        desc: [
          'Progress report: enrollments that ARE graded — show course_id, score and grade for rows where score is present.',
          'Progress report: jo enrollments GRADED hain — unke course_id, score aur grade dikhao jahan score maujood hai.',
        ],
        sol: 'SELECT course_id, score, grade FROM enrollments WHERE score IS NOT NULL;',
        hints: [
          ['Projection of three columns plus the NOT NULL filter.', 'Teen columns ka projection aur NOT NULL filter.'],
          ['SELECT course_id, score, grade FROM enrollments WHERE score IS NOT NULL;', 'SELECT course_id, score, grade FROM enrollments WHERE score IS NOT NULL;'],
          ['160 rows appear.', '160 rows dikhti hain.'],
        ],
      }),
      task({
        d: 'very_hard',
        desc: [
          'Contact card cleanup: for every student show name and a contact column where NULL emails become \'not provided\' (real emails show as themselves). Headers checked: name and contact.',
          'Contact card cleanup: har student ka naam aur contact column dikhao jahan NULL emails \'not provided\' ban jaayein (asli emails waise hi). Headers check honge: name aur contact.',
        ],
        sol: "SELECT name, IFNULL(email, 'not provided') AS contact FROM students;",
        hints: [
          ['IFNULL substitutes a fallback for NULL.', 'IFNULL NULL ke liye fallback deta hai.'],
          ["SELECT name, IFNULL(email, 'not provided') AS contact FROM students;", "SELECT name, IFNULL(email, 'not provided') AS contact FROM students;"],
          ['COALESCE(email, \'not provided\') works identically.', 'COALESCE(email, \'not provided\') bhi waise hi chalta hai.'],
        ],
        rules: { checkColumnNames: true },
      }),
    ],
  }),

  defineModule({
    n: 17,
    title: ['ORDER BY Basics', 'ORDER BY Basics'],
    time: '25 min',
    concepts: ['order by', 'sort', 'asc', 'desc', 'ascending', 'descending', 'text sort', 'number sort'],
    diagram: 'sort',
    objectives: [
      ['Sort results by any column with ORDER BY', 'ORDER BY se kisi bhi column par sort karna'],
      ['Control direction with ASC and DESC', 'ASC aur DESC se direction control karna'],
      ['Understand where NULLs land in a sort', 'Sort me NULL kahan girta hai samajhna'],
    ],
    theory: [
      section(
        ['Rows arrive unsorted — always', 'Rows hamesha unsrted aate hain'],
        [
          [
            'Without ORDER BY, the engine returns rows in whatever order it computes them fastest — storage order, index order, plan order. That order can change between runs and engines. If a report, a leaderboard or an API consumer expects a sequence, you must state it: ORDER BY column. This is not cosmetic; it is a correctness guarantee.',
            'ORDER BY ke bina engine rows jis order me sabse tez compute kare usi me lauta deta hai — storage order, index order, plan order. Wo order run aur engine ke beech badal sakta hai. Agar report, leaderboard ya API consumer sequence expect karta hai, to aapko bolna hi padega: ORDER BY column. Yeh cosmetic nahi hai; correctness ki guarantee hai.',
          ],
          [
            'ORDER BY sorts text alphabetically, numbers numerically, dates chronologically — each in its natural order. Direction is yours: ASC (ascending, the default) sorts A→Z, 0→9, oldest→newest; DESC reverses everything. Sorting happens on the full result rows, before LIMIT takes its slice (that composition lands in Module 19).',
            'ORDER BY text ko alphabetically, numbers ko numerically, dates ko chronologically sort karta hai — apne natural order me. Direction aapki hai: ASC (chadhta hua, default) A→Z, 0→9, purana→naya; DESC sab ulta. Sorting poori result rows par hoti hai, LIMIT ke slice lene se pehle (wo jodna Module 19 me).',
          ],
        ],
        [],
        'sort'
      ),
      section(
        ['NULLs and ties', 'NULL aur ties'],
        [
          [
            'Where do NULLs sort? In SQLite, NULLs are considered smaller than everything: ASC puts them first, DESC puts them last. Other engines differ (MySQL same; SQL Server opposite for ASC), so critical reports state it explicitly via CASE — an advanced nicety for later.',
            'NULL kahan sort hote hain? SQLite me NULL sab se chhota mana jaata hai: ASC me pehle, DESC me aakhir me. Dusre engines alag hain (MySQL same; SQL Server ASC ke liye ulta), isliye critical reports ise CASE se saaf likhte hain — advanced baat, baad ke liye.',
          ],
          [
            'Ties share a position: sorting students by age puts all 18-year-olds together in an arbitrary internal order. When the tie order matters, add a second sort column — exactly what the next module formalises with multi-column sorts.',
            'Ties ek hi position baant lete hain: students ko age se sort karne par saare 18-saal ek saath kisi bhi andaruni order me aate hain. Jab tie order matter kare, doosra sort column jodo — yahi agla module multi-column sort me formalise karta hai.',
          ],
        ],
        [
          ['No ORDER BY = no guaranteed order', 'ORDER BY nahi = order ki guarantee nahi'],
          ['ASC default; DESC reverses', 'ASC default; DESC ulta'],
          ['SQLite: NULLs sort first ascending, last descending', 'SQLite: NULLs chadhte hue pehle, utarte hue aakhir'],
          ['Ties keep arbitrary order unless you add a tiebreak column', 'Tiebreak column na ho to ties ka order arbitrary rehta hai'],
        ]
      ),
    ],
    tutorial: {
      title: ['Taking control of order', 'Order ka control lena'],
      steps: [
        step(null, [
          'The merit list must be exact: highest scores first. We apply ORDER BY, then reverse it, then see where NULLs land.',
          'Merit list exact honi chahiye: sabse unche scores pehle. Hum ORDER BY lagate hain, phir ulta, phir dekhte hain NULL kahan girta hai.',
        ]),
        step('SELECT name, age FROM students ORDER BY name;', [
          'Alphabetical by name — ASC is the default direction.',
          'Naam se alphabetical — ASC default direction hai.',
        ], { table: 'students' }),
        step('SELECT name, age FROM students ORDER BY age DESC;', [
          'Highest ages first — perfect for "top N" style requests.',
          'Sabse badi umar pehle — "top N" requests ke liye perfect.',
        ], { table: 'students' }),
        step('SELECT name, score FROM students\nJOIN enrollments ON enrollments.student_id = students.id\nORDER BY score;', [
          'Hmm — preview of a join; simpler: sort enrollments by score ascending and watch NULLs float to the front.',
          'Hmm — join ka preview; simple rakhte hain: enrollments ko score se chadha kar sort karo aur dekho NULL aage kaise aate hain.',
        ], { table: 'enrollments' }),
        step('SELECT id, score FROM enrollments ORDER BY score;', [
          'NULLs first in ascending SQLite order — they count as smallest.',
          'SQLite ke chadhte order me NULL pehle — wo sabse chhote gine jaate hain.',
        ], { run: true, table: 'enrollments', highlightWhere: 'score IS NULL' }),
      ],
    },
    syntax: {
      template: 'SELECT columns\nFROM table\n[WHERE condition]\nORDER BY column [ASC | DESC];',
      parts: [
        { part: 'ORDER BY', description: ['Starts the sort clause', 'Sort clause shuru karta hai'] },
        { part: 'ASC', description: ['Ascending: A→Z, 0→9 (default)', 'Chadhta: A→Z, 0→9 (default)'] },
        { part: 'DESC', description: ['Descending: Z→A, 9→0', 'Utarta: Z→A, 9→0'] },
        { part: 'position', description: ['Last clause before LIMIT', 'LIMIT se pehle aakhri clause'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT name FROM students ORDER BY name;', [
        'The printed-directory order — alphabetical names.',
        'Print-directory order — naam alphabetical.',
      ]),
      example('easy', 'SELECT name, salary FROM teachers ORDER BY salary DESC;', [
        'Highest-paid teachers first — a payroll leaderboard.',
        'Sabse zyada salary wale teachers pehle — payroll leaderboard.',
      ]),
      example('medium', 'SELECT name, age FROM students ORDER BY age;', [
        'Youngest first; ties (all the 18s) cluster together.',
        'Sabse chhote pehle; ties (saare 18 wale) ek saath judte hain.',
      ]),
      example('hard', 'SELECT name, enrollment_date FROM students ORDER BY enrollment_date DESC;', [
        'Newest enrolments first — an activity feed.',
        'Naye enrolments pehle — activity feed.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Assuming rows come back in insertion order', 'Rows insertion order me aayengi maan lena'],
        ['Engines return rows in plan order, which can change. ORDER BY is the only sequence guarantee in SQL.', 'Engines plan order me rows laate hain, jo badal sakta hai. ORDER BY hi SQL me sequence ki akeli guarantee hai.']
      ),
      mistake(
        ['Writing ORDER BY before WHERE', 'WHERE se pehle ORDER BY likhna'],
        ['Clause order is SELECT → FROM → WHERE → ORDER BY. Sorting comes last (before LIMIT).', 'Clause order hai SELECT → FROM → WHERE → ORDER BY. Sorting aakhri aati hai (LIMIT se pehle).']
      ),
      mistake(
        ['Expecting NULLs last in ascending sorts', 'Chadhte sort me NULL aakhir hona expect karna'],
        ['SQLite puts NULLs FIRST in ASC (smallest). In DESC they drop to the end. Plan around it — often with IS NOT NULL filters or COALESCE.', 'SQLite ASC me NULL PEHLE rakhta hai (sabse chhota). DESC me end par girta hai. Uske hisaab se plan karo — aksar IS NOT NULL filter ya COALESCE ke saath.']
      ),
    ],
    summary: [
      ['ORDER BY is the only guarantee of row sequence', 'ORDER BY hi row sequence ki akeli guarantee hai'],
      ['ASC default; DESC for leaderboards and "latest first"', 'ASC default; DESC leaderboards aur "latest first" ke liye'],
      ['Text, numbers and dates sort in their natural orders', 'Text, numbers aur dates apne natural order me sort hote hain'],
      ['SQLite ASC places NULLs first', 'SQLite ASC me NULL pehle aate hain'],
    ],
    quiz: [
      mcq(
        ['A query has WHERE and ORDER BY. Which runs last on the result?', 'Ek query me WHERE aur ORDER BY hai. Result par kaunsa aakhri chalta hai?'],
        [
          ['WHERE', 'WHERE'],
          ['ORDER BY', 'ORDER BY'],
          ['They run together', 'Dono saath chalte hain'],
          ['Depends on the engine mood', 'Engine ke mood par depend karta hai'],
        ],
        1,
        ['Filter first, then sort what survived: SELECT → FROM → WHERE → ORDER BY.', 'Pehle filter, phir jo bacha usko sort karo: SELECT → FROM → WHERE → ORDER BY.']
      ),
      outputQ(
        'SELECT name, age FROM students ORDER BY age DESC, name LIMIT 3;',
        ['What are the first three rows?', 'Pehli teen rows kya hain?'],
        [
          { label: 'A', result: { columns: ['name', 'age'], rows: [['Malvika Singh', 21], ['Mohit Singh', 21], ['Divya Mehta', 20]] } },
          { label: 'B', result: { columns: ['name', 'age'], rows: [['Abhinav Bansal', 18], ['Amit Chopra', 18], ['Kajal Sharma', 18]] } },
          { label: 'C', result: { columns: ['name', 'age'], rows: [['Malvika Singh', 21]] } },
          { label: 'D', result: { error: 'Error: near "LIMIT": syntax error' } },
        ],
        0,
        ['Ages run 21, 21, 20… descending, with alphabetical names as tiebreak — Malvika and Mohit (21), then a 20-year-old.', 'Umar 21, 21, 20… utarti hai, naam alphabetical tiebreak — Malvika aur Mohit (21), phir koi 20 saal ka.']
      ),
      buildQ(
        ['Build: teachers listed from lowest to highest salary', 'Banao: teachers sabse kam se sabse zyada salary tak'],
        ['FROM', 'teachers', 'ORDER', 'SELECT', 'name', 'salary', 'BY', 'ASC'],
        ['SELECT', 'name', 'salary', 'FROM', 'teachers', 'ORDER', 'BY', 'salary', 'ASC'],
        ['ORDER BY salary, default direction ascending.', 'ORDER BY salary, default direction chadhta hua.']
      ),
      blanksQ(
        'SELECT name FROM students ORDER BY name ___;',
        [{ options: ['DESC', 'DOWN', 'REVERSE', 'BACK'], correct: 'DESC' }],
        ['DESC gives Z→A — reverse alphabetical.', 'DESC Z→A deta hai — ulta alphabetical.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Printed roll-call: student names in alphabetical order. Show the names, sorted.',
          'Printed roll-call: student naam alphabetical order me. Naam dikhao, sorted.',
        ],
        sol: 'SELECT name FROM students ORDER BY name;',
        hints: [
          ['ORDER BY the displayed column.', 'Displayed column se ORDER BY.'],
          ['SELECT name FROM students ORDER BY name;', 'SELECT name FROM students ORDER BY name;'],
          ['Ascending is the default — no keyword needed.', 'Chadhta default hai — keyword ki zaroorat nahi.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'easy',
        desc: [
          'Payroll leaderboard: teachers from highest to lowest salary. Show name and salary.',
          'Payroll leaderboard: teachers sabse zyada se sabse kam salary tak. Name aur salary dikhao.',
        ],
        sol: 'SELECT name, salary FROM teachers ORDER BY salary DESC;',
        hints: [
          ['DESC flips the direction.', 'DESC direction ulta karta hai.'],
          ['SELECT name, salary FROM teachers ORDER BY salary DESC;', 'SELECT name, salary FROM teachers ORDER BY salary DESC;'],
          ['Row order is checked because the task demands a specific order.', 'Row order check hota hai kyunki task specific order maangta hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'medium',
        desc: [
          'The alumni team wants the newest students first: name and enrollment_date, sorted by enrolment date descending.',
          'Alumni team naye students pehle chahti hai: name aur enrollment_date, enrolment date se utarte hue sorted.',
        ],
        sol: 'SELECT name, enrollment_date FROM students ORDER BY enrollment_date DESC;',
        hints: [
          ['Sort the date column descending.', 'Date column ko DESC se sort karo.'],
          ['SELECT name, enrollment_date FROM students ORDER BY enrollment_date DESC;', 'SELECT name, enrollment_date FROM students ORDER BY enrollment_date DESC;'],
          ['July 2023 dates appear at the top.', 'July 2023 ki dates upar dikhti hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'Budget planning, biggest departments first: name and budget of departments, sorted by budget descending.',
          'Budget planning, sabse bade departments pehle: departments ka naam aur budget, budget se utarte hue sorted.',
        ],
        sol: 'SELECT name, budget FROM departments ORDER BY budget DESC;',
        hints: [
          ['Same DESC pattern on a money column.', 'Money column par wahi DESC pattern.'],
          ['SELECT name, budget FROM departments ORDER BY budget DESC;', 'SELECT name, budget FROM departments ORDER BY budget DESC;'],
          ['Science (500000) leads; Sports (180000) closes.', 'Science (500000) sabse aage; Sports (180000) aakhir me.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'Complete experience ranking with NO ties ambiguity: teachers by experience descending, and within equal experience, by name ascending. Show name, experience_years. (Two-level sort.)',
          'Complete experience ranking, ties bina confusion ke: teachers experience se utarte hue, aur same experience me naam se chadhte hue. Name, experience_years dikhao. (Do-level sort.)',
        ],
        sol: 'SELECT name, experience_years FROM teachers ORDER BY experience_years DESC, name ASC;',
        hints: [
          ['Comma-separated sort columns, each with its own direction.', 'Comma-separated sort columns, har ek apni direction ke saath.'],
          ['SELECT name, experience_years FROM teachers ORDER BY experience_years DESC, name ASC;', 'SELECT name, experience_years FROM teachers ORDER BY experience_years DESC, name ASC;'],
          ['ASC keyword optional but explicit here — good habit.', 'ASC keyword optional hai par yahan explicit — achhi aadat.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),

  defineModule({
    n: 18,
    title: ['ORDER BY Multiple Columns', 'ORDER BY Multiple Columns'],
    time: '25 min',
    concepts: ['order by', 'multi-column sort', 'sort priority', 'tiebreak', 'mixed direction'],
    diagram: 'sort',
    objectives: [
      ['Sort by several columns with clear priority', 'Kai columns se clear priority ke saath sort karna'],
      ['Mix ASC and DESC across sort levels', 'Sort levels par ASC aur DESC mix karna'],
      ['Design tiebreakers that make order deterministic', 'Aise tiebreakers banana jisse order deterministic ho'],
    ],
    theory: [
      section(
        ['Primary, secondary, tertiary', 'Primary, secondary, tertiary'],
        [
          [
            'ORDER BY city, name sorts by city first; rows of the same city then sort by name. The first column is the primary sort, the second breaks ties of the first, a third breaks remaining ties, and so on. Think of a phone book: surname first, first name second — exactly a two-level sort.',
            'ORDER BY city, name pehle city se sort karta hai; same city ki rows phir naam se sort hoti hain. Pehla column primary sort hai, doosra pehle ke ties todta hai, teesra bache hue ties — aur aise hi. Phone book socho: pehle surname, phir first name — bilkul do-level sort.',
          ],
          [
            'Each level can have its own direction: ORDER BY city ASC, age DESC sorts cities A→Z but within each city puts older students first. Mixing directions per column is fully supported and extremely common — "departments alphabetical, budgets biggest-first inside" is one clause.',
            'Har level ki apni direction ho sakti hai: ORDER BY city ASC, age DESC cities ko A→Z sort karta hai par har city ke andar bade students pehle rakhta hai. Columns par directions mix karna poora support hai aur bahut common hai — "departments alphabetical, andar budgets sabse bade pehle" ek hi clause hai.',
          ],
        ],
        [],
        'sort'
      ),
      section(
        ['The deterministic habit', 'Deterministic aadat'],
        [
          [
            'A sort is deterministic when no two rows can tie on every sort column. Adding a unique column (id) as the final tiebreak guarantees a total order — the same input always produces the same sequence. Reports shared across teams, exports that get diffed, and pagination (next module) all quietly require this.',
            'Sort tab deterministic hota hai jab do rows har sort column par tie na kar sakein. Unique column (id) ko aakhri tiebreak ke roop me jodna total order guarantee karta hai — same input hamesha same sequence deta hai. Teams ke beech share ki jaane wali reports, diff hone wale exports, aur pagination (agla module) — sab chup-chaap yehi maangte hain.',
          ],
          [
            'A useful debugging trick when a result "looks almost right": print it sorted by the tie columns and inspect the boundary rows — the wrong member of a tie group is usually the bug.',
            'Jab result "lagbhag sahi" dikhe, ek debugging trick: tie columns se print karke boundary rows dekho — tie group ka galat member hi aksar bug hota hai.',
          ],
        ],
        [
          ['First column = primary sort; later columns break ties', 'Pehla column = primary sort; baad wale ties todte hain'],
          ['Each column takes its own ASC/DESC', 'Har column apna ASC/DESC leta hai'],
          ['End with a unique column for deterministic order', 'Deterministic order ke liye aakhir me unique column'],
        ]
      ),
    ],
    tutorial: {
      title: ['City then name', 'City phir naam'],
      steps: [
        step(null, [
          'A grouped roll-call: cities alphabetical, and inside each city, names alphabetical. Then we flip age inside cities.',
          'Grouped roll-call: cities alphabetical, aur har city ke andar naam alphabetical. Phir cities ke andar age ulta karte hain.',
        ]),
        step('SELECT name, city, age FROM students ORDER BY city, name;', [
          'City primary, name tiebreak — the classic directory layout.',
          'City primary, naam tiebreak — classic directory layout.',
        ], { table: 'students' }),
        step('SELECT name, city, age FROM students ORDER BY city, age DESC, name;', [
          'Inside each city, oldest students lead; names still break exact-age ties.',
          'Har city me sabse bade students pehle; same age par naam tiebreak.',
        ], { table: 'students' }),
        step('SELECT name, city, age FROM students ORDER BY city, age DESC, name, id;', [
          'Adding id as the final tiebreak makes the order fully deterministic.',
          'Aakhri tiebreak ke roop me id jodna order poora deterministic bana deta hai.',
        ], { run: true, table: 'students' }),
        step(null, [
          'Four sort levels is already serious sorting power — and it reads like a sentence.',
          'Chaar sort levels hi kaafi serious sorting power hai — aur ye sentence ki tarah padha jaata hai.',
        ]),
      ],
    },
    syntax: {
      template: 'ORDER BY col1 [ASC|DESC], col2 [ASC|DESC], col3 [ASC|DESC]',
      parts: [
        { part: 'col1', description: ['Primary sort', 'Primary sort'] },
        { part: 'col2', description: ['Tiebreaker for col1 ties', 'col1 ke ties ka tiebreak'] },
        { part: 'per-column direction', description: ['Each column can mix ASC/DESC', 'Har column ASC/DESC mix kar sakti hai'] },
        { part: 'id as last', description: ['Total-order guarantee', 'Total-order guarantee'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT name, city FROM students ORDER BY city, name;', [
        'Directory layout: cities A→Z, names inside.',
        'Directory layout: cities A→Z, andar naam.',
      ]),
      example('easy', 'SELECT name, grade, age FROM students ORDER BY grade, age DESC;', [
        'Grades ascending, ages descending within each grade.',
        'Grades chadhte, har grade me umar utarti.',
      ]),
      example('medium', 'SELECT name, subject, salary FROM teachers ORDER BY subject, salary DESC;', [
        'Faculty grouping with pay ranking inside — an HR favourite.',
        'Faculty grouping, andar pay ranking — HR ka favourite.',
      ]),
      example('hard', 'SELECT name, city, grade, age FROM students ORDER BY city, grade, age DESC, name;', [
        'Four levels: city, then grade, then age, then name — fully specified.',
        'Chaar levels: city, phir grade, phir age, phir naam — poora specify.',
      ]),
    ],
    mistakes: [
      mistake(
        ['One direction for all: ORDER BY city, age DESC thinking DESC covers both', 'Sabke liye ek direction: ORDER BY city, age DESC samajh kar ki DESC dono ko cover kare'],
        ['DESC applies only to the column before it. Separate cities ASC, ages DESC with commas: city ASC, age DESC.', 'DESC sirf apne pehle wale column par lagta hai. Alag directions comma se: city ASC, age DESC.']
      ),
      mistake(
        ['Sorting by a column you did not select — then being surprised', 'Us column se sort karna jo select nahi kiya — aur hairan hona'],
        ['You CAN sort by non-selected columns (legal and useful). But when surprised by row groups, remember the hidden sort key exists.', 'Non-selected columns se sort KAR SAKTE ho (legal aur useful). Par row groups dekh ke hairan mat hona — chhupa sort key exist karta hai.']
      ),
      mistake(
        ['Forgetting a tiebreak on leaderboards', 'Leaderboards par tiebreak bhool jaana'],
        ['Two students both scoring 100 share rank 1 in a score-only sort. Add name or id to make the winner list stable and fair.', 'Score-only sort me dono 100 wale students rank 1 share karte hain. Winner list stable aur fair banane ke liye naam ya id jodo.']
      ),
    ],
    summary: [
      ['Multi-column sorts: primary first, then tiebreakers', 'Multi-column sorts: pehle primary, phir tiebreakers'],
      ['Each column carries its own direction', 'Har column apni direction rakhti hai'],
      ['A final unique column makes order deterministic', 'Aakhri unique column order deterministic banata hai'],
      ['You may sort by columns not in the SELECT list', 'SELECT list se bahar ke columns se bhi sort kar sakte ho'],
    ],
    quiz: [
      mcq(
        ['ORDER BY grade ASC, age DESC — what rules rows with the SAME grade?', 'ORDER BY grade ASC, age DESC — SAME grade wali rows ka kaun niyam chalta hai?'],
        [
          ['Their order is random', 'Unka order random hai'],
          ['Age decides: oldest first', 'Umar decide karti hai: sabse bada pehle'],
          ['Name decides alphabetically', 'Naam alphabetically decide karta hai'],
          ['They are dropped', 'Wo drop ho jaati hain'],
        ],
        1,
        ['Within equal grades, the second sort column takes over: age DESC puts older first.', 'Equal grades me doosra sort column kaam leta hai: age DESC bade ko pehle rakhta hai.']
      ),
      outputQ(
        'SELECT city, name FROM students WHERE city = \'Delhi\' ORDER BY name;',
        ['What order do the Delhi names come in?', 'Delhi ke naam kis order me aate hain?'],
        [
          { label: 'A', result: { columns: ['city', 'name'], rows: [['Delhi', 'Amit Chopra'], ['Delhi', 'Ananya Chopra'], ['Delhi', 'Ananya Nair'], ['Delhi', 'Malvika Singh'], ['Delhi', 'Ritu Sharma'], ['Delhi', 'Varun Bansal'], ['Delhi', 'Sneha Bansal']] } },
          { label: 'B', result: { columns: ['city', 'name'], rows: [['Delhi', 'Ritu Sharma'], ['Delhi', 'Sneha Bansal']] } },
          { label: 'C', result: { error: "Error: no such column: name" } },
          { label: 'D', result: { columns: ['city'], rows: [['Delhi']] } },
        ],
        0,
        ['ORDER BY name sorts the 7 Delhi students alphabetically (option A shows the intended alphabetical arrangement).', 'ORDER BY name 7 Delhi students ko alphabetically sort karta hai (option A wahi alphabetical arrangement dikhata hai).']
      ),
      buildQ(
        ['Build: teachers grouped by subject (A-Z), pay descending inside', 'Banao: teachers subject se grouped (A-Z), andar pay utarti hui'],
        ['FROM', 'teachers', 'ORDER', 'SELECT', 'name', 'subject', 'salary', 'BY', 'DESC', 'subject', ','],
        ['SELECT', 'name', 'subject', 'salary', 'FROM', 'teachers', 'ORDER', 'BY', 'subject', ',', 'salary', 'DESC'],
        ['Primary sort subject, comma, then salary DESC.', 'Primary sort subject, comma, phir salary DESC.']
      ),
      blanksQ(
        'SELECT name, grade, age FROM students ORDER BY grade ___, age ___;',
        [
          { options: ['ASC', 'DESC', 'BY', 'ON'], correct: 'ASC' },
          { options: ['DESC', 'ASC', 'BY', 'WITH'], correct: 'DESC' },
        ],
        ['Grades up, ages down — the mixed-direction classic.', 'Grades upar, umar neeche — mixed-direction classic.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'City roll-call: students sorted by city, then by name within each city. Show name and city.',
          'City roll-call: students city se sorted, phir har city me naam se. Name aur city dikhao.',
        ],
        sol: 'SELECT name, city FROM students ORDER BY city, name;',
        hints: [
          ['Two sort columns, comma-separated.', 'Do sort columns, comma-separated.'],
          ['SELECT name, city FROM students ORDER BY city, name;', 'SELECT name, city FROM students ORDER BY city, name;'],
          ['Both directions default ASC.', 'Dono directions default ASC hain.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'easy',
        desc: [
          'Grade sheets: students sorted by grade ascending, then age descending within a grade. Show name, grade, age.',
          'Grade sheets: students grade se chadhte, phir grade ke andar age se utarti. Name, grade, age dikhao.',
        ],
        sol: 'SELECT name, grade, age FROM students ORDER BY grade, age DESC;',
        hints: [
          ['Mixed directions across two levels.', 'Do levels par mixed directions.'],
          ['SELECT name, grade, age FROM students ORDER BY grade, age DESC;', 'SELECT name, grade, age FROM students ORDER BY grade, age DESC;'],
          ['DESC binds only to age.', 'DESC sirf age par lagta hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'medium',
        desc: [
          'Faculty directory: teachers grouped by subject (A→Z), highest salary first within each subject. Show name, subject, salary.',
          'Faculty directory: teachers subject se grouped (A→Z), har subject me sabse unchi salary pehle. Name, subject, salary dikhao.',
        ],
        sol: 'SELECT name, subject, salary FROM teachers ORDER BY subject, salary DESC;',
        hints: [
          ['Grouping sort plus ranking sort.', 'Grouping sort aur ranking sort.'],
          ['SELECT name, subject, salary FROM teachers ORDER BY subject, salary DESC;', 'SELECT name, subject, salary FROM teachers ORDER BY subject, salary DESC;'],
          ['Biology: Anita Bose (74000) before Kavita Rao (65000).', 'Biology: Anita Bose (74000) Kavita Rao (65000) se pehle.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'hard',
        desc: [
          'Fully deterministic experience ranking: teachers by experience descending, name ascending for ties, and id ascending as the final guarantee. Show name, experience_years.',
          'Poora deterministic experience ranking: teachers experience se utarte, ties par naam chadhta, aur aakhri guarantee id chadhta. Name, experience_years dikhao.',
        ],
        sol: 'SELECT name, experience_years FROM teachers ORDER BY experience_years DESC, name ASC, id ASC;',
        hints: [
          ['Three levels ending in a unique column.', 'Teen levels, unique column par khatam.'],
          ['SELECT name, experience_years FROM teachers ORDER BY experience_years DESC, name ASC, id ASC;', 'SELECT name, experience_years FROM teachers ORDER BY experience_years DESC, name ASC, id ASC;'],
          ['No two rows can now tie — order is guaranteed stable.', 'Ab do rows tie nahi kar sakti — order stable guaranteed.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
      task({
        d: 'very_hard',
        desc: [
          'The master directory page: students sorted by city A→Z, grade A→F within city, age descending within grade, and name as the final tiebreak. Show name, city, grade, age. (Four sort levels — read carefully.)',
          'Master directory page: students city A→Z, city me grade A→F, grade me age utarti, aur aakhri tiebreak naam. Name, city, grade, age dikhao. (Chaar sort levels — dhyan se padho.)',
        ],
        sol: 'SELECT name, city, grade, age FROM students ORDER BY city ASC, grade ASC, age DESC, name ASC;',
        hints: [
          ['Four comma-separated levels, each with a direction.', 'Chaar comma-separated levels, har ek direction ke saath.'],
          ['SELECT name, city, grade, age FROM students ORDER BY city ASC, grade ASC, age DESC, name ASC;', 'SELECT name, city, grade, age FROM students ORDER BY city ASC, grade ASC, age DESC, name ASC;'],
          ['Read the sort back as a sentence to verify before running.', 'Run karne se pehle sort ko sentence ki tarah dohra kar verify karo.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),
];
