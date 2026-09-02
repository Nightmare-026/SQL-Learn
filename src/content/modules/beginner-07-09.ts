'use client';

// Modules 07-09: Column Aliases (AS) · DISTINCT · WHERE Introduction

import { defineModule, section, step, example, mistake, mcq, outputQ, buildQ, blanksQ, task } from './builder';
import type { Module } from '@/types/content';

export const modules: Module[] = [
  defineModule({
    n: 7,
    title: ['Column Aliases (AS)', 'Column Aliases (AS)'],
    time: '20 min',
    concepts: ['alias', 'as', 'rename', 'column header', 'expression', 'derived column'],
    diagram: 'select-flow',
    objectives: [
      ['Rename result columns with AS', 'AS ke saath result columns rename karna'],
      ['Write aliases without the AS keyword', 'AS keyword ke bina aliases likhna'],
      ['Name computed columns so reports read themselves', 'Computed columns ko naam dena taaki reports khud padhi jaayein'],
    ],
    theory: [
      section(
        ['Why headers matter', 'Headers kyun matter karte hain'],
        [
          [
            'Raw column names are often cryptic: COUNT(*), AVG(score), department_id. Hand a report headed "department_id" to a manager and they will ask what it means. Aliases let you rename any output column on the fly: SELECT name AS student, salary AS monthly_pay FROM teachers;. The stored table is untouched — only the answer\'s header changes.',
            'Raw column names aksar ajeeb hote hain: COUNT(*), AVG(score), department_id. Manager ko "department_id" header wali report do to wo poochenge ki iska matlab kya hai. Aliases se aap kisi bhi output column ko turant rename kar sakte ho: SELECT name AS student, salary AS monthly_pay FROM teachers;. Stored table ko haath nahi lagta — sirf jawab ka header badalta hai.',
          ],
          [
            'Aliases become essential the moment you compute: COUNT(*) AS courses, ROUND(AVG(score), 1) AS average_grade. Without a name, the engine invents a header like "COUNT(*)" — which works, but reads terribly in reports, exports and code that consumes your results.',
            'Aliases compute karte hi zaroori ho jaate hain: COUNT(*) AS courses, ROUND(AVG(score), 1) AS average_grade. Naam na ho to engine "COUNT(*)" jaisa header bana deta hai — chalta hai, par reports, exports aur code me padhne me bilkul kharab.',
          ],
        ],
        [],
        'select-flow'
      ),
      section(
        ['The AS keyword (and its absence)', 'AS keyword (aur uska na hona)'],
        [
          [
            'AS is optional in most engines, including SQLite: SELECT name student FROM teachers renames just as well — but beware, that is exactly the missing-comma trap from the previous module! Professional style keeps AS precisely because it makes renames explicit and prevents accidental ones. Read "name AS student" as "name, appearing as student".',
            'AS zyada tar engines me optional hai, SQLite shaamil: SELECT name student FROM teachers bhi waisa hi rename karta hai — par dhyan rahe, yahi pichle module ka missing-comma trap hai! Professional style AS isliye rakhta hai ki renames explicit ho jayein aur galti se na ho. "name AS student" ko padho "name, jo student ke roop me dikhega".',
          ],
          [
            'Alias rules: keep them short and meaningful; use lowercase_with_underscores or "quoted words" when you need spaces — SELECT salary AS "Monthly Pay" FROM teachers; — and remember an alias only exists in the result, so most engines cannot use it inside WHERE for the same query (ORDER BY can use it, which we exploit later).',
            'Alias rules: chhote aur meaningful rakho; spaces chahiye to "quoted words" — SELECT salary AS "Monthly Pay" FROM teachers; — aur yaad rakho alias sirf result me hota hai, isliye zyada tar engines ussi query ke andar WHERE me use nahi kar sakte (ORDER BY kar sakta hai, uska fayda baad me lenge).',
          ],
        ],
        [
          ['AS renames output headers only — never stored data', 'AS sirf output headers rename karta hai — stored data kabhi nahi'],
          ['Aliases matter most for computed columns', 'Aliases computed columns ke liye sabse zaroori hain'],
          ['Keep AS explicit to avoid the missing-comma trap', 'Missing-comma trap se bachne ke liye AS explicit rakho'],
        ]
      ),
    ],
    tutorial: {
      title: ['Renaming for a report', 'Report ke liye rename karna'],
      steps: [
        step(null, [
          'HR wants a "Staff" listing with friendly headers. We rename two columns in one statement.',
          'HR ko friendly headers wali "Staff" listing chahiye. Hum ek statement me do columns rename karte hain.',
        ]),
        step('SELECT name, salary FROM teachers;', [
          'Before: plain column headers from the table.',
          'Pehle: table ke aam column headers.',
        ], { table: 'teachers' }),
        step('SELECT name AS teacher, salary AS monthly_pay FROM teachers;', [
          'After: the same data, headed for a human reader.',
          'Baad: wahi data, insaan padhne wale ke liye headed.',
        ], { table: 'teachers' }),
        step('SELECT name AS teacher, salary / 12 AS pay_per_month FROM teachers LIMIT 5;', [
          'Aliases shine on computed columns — a division becomes a named fact.',
          'Computed columns par aliases chamakte hain — division ek naam wala fact ban jaata hai.',
        ], { run: true, table: 'teachers' }),
        step(null, [
          'Stored salaries never changed. The engine computed fresh values and labelled them clearly.',
          'Stored salaries kabhi change nahi hui. Engine ne naye values banaye aur unhe saaf label kiya.',
        ]),
      ],
    },
    syntax: {
      template: 'SELECT column AS alias, expression AS alias2 FROM table_name;',
      parts: [
        { part: 'AS alias', description: ['Renames the output header', 'Output header rename karta hai'] },
        { part: 'expression', description: ['Computation like salary / 12 or COUNT(*)', 'Computation jaise salary / 12 ya COUNT(*)'] },
        { part: '"Quoted alias"', description: ['Needed when the alias contains spaces', 'Alias me spaces hon to chahiye'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT name AS teacher FROM teachers;', [
        'A simple rename — same values, friendlier header.',
        'Simple rename — same values, friendly header.',
      ]),
      example('easy', 'SELECT name teacher, subject dept FROM teachers;', [
        'AS omitted — works, but only do this deliberately, never by comma accident.',
        'AS chhoda — chalta hai, par yeh jaan-boojh kar karo, comma ki galti se kabhi nahi.',
      ]),
      example('medium', 'SELECT name AS student, age AS years_old FROM students WHERE age > 19;', [
        'Renames plus a filter. Validation by default ignores header names — aliases are for humans here.',
        'Rename plus filter. Default validation header names ignore karti hai — aliases yahan insaan ke liye hain.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Trying to filter on an alias in WHERE: WHERE monthly_pay > 5000', 'Alias par WHERE me filter karna: WHERE monthly_pay > 5000'],
        ['Aliases are final-step labels. SQLite cannot use them in WHERE for the same query — repeat the expression (salary / 12) or wrap the query in a subquery (later).', 'Aliases final-step labels hain. SQLite unhe ussi query ke WHERE me use nahi kar sakta — expression dobara likho (salary / 12) ya query ko subquery me wrap karo (baad me).']
      ),
      mistake(
        ['Unquoted multi-word aliases: AS monthly pay', 'Bina quote ke multi-word aliases: AS monthly pay'],
        ['Two words parse as an alias plus a column — error. Quote it: AS "monthly pay".', 'Do words ka parse hota hai alias plus column — error. Quote karo: AS "monthly pay".']
      ),
      mistake(
        ['Believing AS changes the table', 'Yeh sochna ki AS table badal deta hai'],
        ['AS affects only this query\'s result. The table and its real column names stay exactly as declared.', 'AS sirf is query ke result par asar dalta hai. Table aur uske asli column names waise hi rehte hain.']
      ),
    ],
    summary: [
      ['AS renames the output header without touching stored data', 'AS stored data ko haath lagaye bina output header rename karta hai'],
      ['Always name computed columns: COUNT(*) AS total, salary/12 AS monthly', 'Computed columns ko hamesha naam do: COUNT(*) AS total, salary/12 AS monthly'],
      ['AS is optional but keeps renames explicit', 'AS optional hai par renames explicit rakhta hai'],
      ['Aliases live in the result — not available in WHERE', 'Aliases result me jeete hain — WHERE me available nahi'],
    ],
    quiz: [
      mcq(
        ['What does SELECT salary AS pay FROM teachers; change?', 'SELECT salary AS pay FROM teachers; kya badalta hai?'],
        [
          ['The teachers table\'s column name', 'Teachers table ke column ka naam'],
          ['Only the header of this query\'s result', 'Sirf is query ke result ka header'],
          ['All salaries to a new format', 'Saari salaries naye format me'],
          ['Nothing — AS is ignored', 'Kuch nahi — AS ignore hota hai'],
        ],
        1,
        ['Aliases are presentation-only. The table remains untouched.', 'Aliases sirf presentation ke liye hain. Table untouched rehti hai.']
      ),
      outputQ(
        'SELECT subject AS dept, COUNT(*) AS teachers FROM teachers GROUP BY subject;',
        ['Which headers does the result carry?', 'Result me kaunse headers aate hain?'],
        [
          { label: 'A', result: { columns: ['dept', 'teachers'], rows: [['Biology', 2], ['Chemistry', 2], ['English', 1], ['History', 1], ['Mathematics', 2], ['Physics', 2]] } },
          { label: 'B', result: { columns: ['subject', 'COUNT(*)'], rows: [['Biology', 2]] } },
          { label: 'C', result: { error: 'Error: misuse of alias' } },
          { label: 'D', result: { columns: ['dept', 'teachers'], rows: [['Mathematics', 2]] } },
        ],
        0,
        ['GROUP BY subject yields one row per subject with the aliased headers dept and teachers.', 'GROUP BY subject se har subject ki ek row milti hai, dept aur teachers headers ke saath.']
      ),
      buildQ(
        ['Build: teacher names renamed as "staff"', 'Banao: teacher names ko "staff" rename karke'],
        ['FROM', 'teachers', 'AS', 'SELECT', 'name', 'staff'],
        ['SELECT', 'name', 'AS', 'staff', 'FROM', 'teachers'],
        ['Column, AS, new name, then the table.', 'Column, AS, naya naam, phir table.']
      ),
      blanksQ(
        'SELECT COUNT(*) ___ total FROM students;',
        [{ options: ['AS', 'IS', 'NAME', 'TO'], correct: 'AS' }],
        ['AS introduces the alias right after the expression.', 'AS expression ke turant baad alias laata hai.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The sports board calls students "athletes". Show student names with the header athlete.',
          'Sports board students ko "athlete" kehta hai. Student names athlete header ke saath dikhao.',
        ],
        sol: 'SELECT name AS athlete FROM students;',
        hints: [
          ['One rename on one column.', 'Ek column par ek rename.'],
          ['SELECT name AS athlete FROM students;', 'SELECT name AS athlete FROM students;'],
          ['This task checks the header name — aliasing is the point here.', 'Is task me header name check hota hai — yahin aliasing ka point hai.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'easy',
        desc: [
          'Payroll exports need clearer headers. Show teacher name and salary renamed to monthly_salary.',
          'Payroll export ko clear headers chahiye. Teacher name aur salary ko monthly_salary rename karke dikhao.',
        ],
        sol: 'SELECT name, salary AS monthly_salary FROM teachers;',
        hints: [
          ['Rename only the second column.', 'Sirf doosre column ko rename karo.'],
          ['SELECT name, salary AS monthly_salary FROM teachers;', 'SELECT name, salary AS monthly_salary FROM teachers;'],
          ['Header names are checked for this task.', 'Is task me header names check hote hain.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'medium',
        desc: [
          'Monthly budgeting: show each teacher\'s name and their salary divided by 12, named pay_per_month.',
          'Monthly budgeting: har teacher ka naam aur salary ÷ 12 dikhao, naam pay_per_month.',
        ],
        sol: 'SELECT name, salary / 12 AS pay_per_month FROM teachers;',
        hints: [
          ['Compute salary / 12 and name it.', 'salary / 12 compute karo aur naam do.'],
          ['SELECT name, salary / 12 AS pay_per_month FROM teachers;', 'SELECT name, salary / 12 AS pay_per_month FROM teachers;'],
          ['Numeric tolerance allows 7083.33 for 85000/12.', 'Numeric tolerance 85000/12 ke liye 7083.33 maaf karta hai.'],
        ],
      }),
      task({
        d: 'hard',
        desc: [
          'The annual review wants yearly costs per department: department name and its budget divided by 12, headed monthly_budget (both headers checked).',
          'Annual review ko har department ka kharcha chahiye: department ka naam aur budget ÷ 12, header monthly_budget (dono headers check honge).',
        ],
        sol: 'SELECT name, budget / 12 AS monthly_budget FROM departments;',
        hints: [
          ['Same pattern on the departments table.', 'Departments table par wahi pattern.'],
          ['SELECT name, budget / 12 AS monthly_budget FROM departments;', 'SELECT name, budget / 12 AS monthly_budget FROM departments;'],
          ['Headers "name" and "monthly_budget" must match.', 'Headers "name" aur "monthly_budget" match hone chahiye.'],
        ],
        rules: { checkColumnNames: true },
      }),
      task({
        d: 'very_hard',
        desc: [
          'Executive summary card: teacher name as "staff", subject as "field" and experience_years as "years" — three aliases, one statement (headers checked).',
          'Executive summary card: teacher name "staff", subject "field" aur experience_years "years" — teen aliases, ek statement (headers check honge).',
        ],
        sol: 'SELECT name AS staff, subject AS field, experience_years AS years FROM teachers;',
        hints: [
          ['Three renames comma-separated.', 'Teen renames comma-separated.'],
          ['SELECT name AS staff, subject AS field, experience_years AS years FROM teachers;', 'SELECT name AS staff, subject AS field, experience_years AS years FROM teachers;'],
          ['Column order is free, header names are not (for this task).', 'Column order free hai, header names nahi (is task ke liye).'],
        ],
        rules: { checkColumnNames: true },
      }),
    ],
  }),

  defineModule({
    n: 8,
    title: ['DISTINCT', 'DISTINCT'],
    time: '20 min',
    concepts: ['distinct', 'unique', 'duplicates', 'deduplicate', 'count distinct'],
    diagram: 'distinct',
    objectives: [
      ['Remove duplicate rows from a result with DISTINCT', 'DISTINCT ke saath result se duplicate rows hatana'],
      ['Apply DISTINCT across multiple columns correctly', 'Kai columns par DISTINCT sahi lagana'],
      ['Count unique values with COUNT(DISTINCT …)', 'COUNT(DISTINCT …) se unique values ganna'],
    ],
    theory: [
      section(
        ['Duplicates are normal', 'Duplicates normal hain'],
        [
          [
            'A students table stores one row per student — but the moment you project just the city column, repeats appear: seven students from Delhi means \'Delhi\' seven times. The table is correct; the projection is just a many-to-one view. DISTINCT collapses the result to unique rows: SELECT DISTINCT city FROM students; returns each city once.',
            'Students table ek student ki ek row rakhti hai — par jab aap sirf city column project karte ho, repeat hone lagte hain: Delhi ke saat students matlab \'Delhi\' saat baar. Table sahi hai; projection bas many-to-one view hai. DISTINCT result ko unique rows par collapse karta hai: SELECT DISTINCT city FROM students; har city ek baar deta hai.',
          ],
          [
            'Real questions constantly need this: "which cities do our students come from?", "which payment methods were used?", "which products appear in orders?" Each is a uniqueness question, and DISTINCT is the one-word answer.',
            'Real sawal aksar yeh maangte hain: "hamare students kin cities se aate hain?", "kaunse payment methods use hue?", "orders me kaunse products aate hain?" Har ek uniqueness ka sawal hai, aur DISTINCT ek-shabdki jawab hai.',
          ],
        ],
        [],
        'distinct'
      ),
      section(
        ['How uniqueness is decided', 'Uniqueness kaise decide hoti hai'],
        [
          [
            'DISTINCT compares the entire selected row, not one column. SELECT DISTINCT city, grade FROM students keeps every unique (city, grade) pair — Delhi-A and Delhi-B stay separate, but two identical Delhi-A rows collapse into one. NULLs count as equal to each other: one NULL in the output represents all missing values.',
            'DISTINCT poore selected row ko compare karta hai, ek column ko nahi. SELECT DISTINCT city, grade FROM students har unique (city, grade) pair rakhta hai — Delhi-A aur Delhi-B alag rehte hain, par do same Delhi-A rows ek ho jaati hain. NULLs aapas me equal count hote hain: output me ek NULL saari missing values represent karta hai.',
          ],
          [
            'To count unique values, place DISTINCT inside the aggregate: COUNT(DISTINCT city) counts cities once each — 10 for our students — while plain COUNT(city) counts every non-NULL row. That one word changes a per-row count into a per-value count, and interviewers love asking the difference.',
            'Unique values ginne ke liye DISTINCT ko aggregate ke andar rakho: COUNT(DISTINCT city) har city ko ek baar ginta hai — hamare students ke liye 10 — jabki plain COUNT(city) har non-NULL row ginta hai. Yeh ek shabd per-row count ko per-value count me badal deta hai, aur interviewers iska difference poochte bahut pasand karte hain.',
          ],
        ],
        [
          ['DISTINCT works on the whole selected row', 'DISTINCT poore selected row par kaam karta hai'],
          ['Multi-column DISTINCT keeps unique combinations', 'Multi-column DISTINCT unique combinations rakhta hai'],
          ['COUNT(DISTINCT col) counts unique values', 'COUNT(DISTINCT col) unique values ginta hai'],
        ]
      ),
    ],
    tutorial: {
      title: ['From repeats to uniqueness', 'Repeats se uniqueness tak'],
      steps: [
        step(null, [
          'The front office asks a simple question: which cities do our students live in? First try without DISTINCT.',
          'Front office ek simple sawal poochti hai: hamare students kin cities me rehte hain? Pehle DISTINCT ke bina try karo.',
        ]),
        step('SELECT city FROM students;', [
          '50 rows with many repeats — the raw truth, but noisy.',
          '50 rows, kai repeats — raw sach, par shor wala.',
        ], { table: 'students' }),
        step('SELECT DISTINCT city FROM students;', [
          'One word removes every duplicate — 10 unique cities.',
          'Ek shabd saare duplicates hata deta hai — 10 unique cities.',
        ], { table: 'students' }),
        step('SELECT DISTINCT city, grade FROM students;', [
          'Two columns: uniqueness now means unique pairs, not unique cities.',
          'Do columns: ab uniqueness ka matlab unique pairs, unique cities nahi.',
        ], { table: 'students' }),
        step('SELECT COUNT(DISTINCT city) AS unique_cities FROM students;', [
          'Counting inside the projection: the final answer as a single number.',
          'Projection ke andar counting: single number me final jawab.',
        ], { run: true, table: 'students' }),
      ],
    },
    syntax: {
      template: 'SELECT DISTINCT column_list FROM table_name;\nSELECT COUNT(DISTINCT column) FROM table_name;',
      parts: [
        { part: 'DISTINCT', description: ['Collapse exact duplicate result rows', 'Bilkul same result rows ko collapse karo'] },
        { part: 'DISTINCT col1, col2', description: ['Unique combinations of both columns', 'Dono columns ke unique combinations'] },
        { part: 'COUNT(DISTINCT col)', description: ['Count unique values of one column', 'Ek column ki unique values gino'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT DISTINCT city FROM students;', [
        'Ten unique cities from fifty rows.',
        'Pachaas rows se das unique cities.',
      ]),
      example('easy', 'SELECT DISTINCT subject FROM teachers;', [
        'The set of subjects taught — no repeats.',
        'Padhaaye jaane wale subjects ka set — koi repeat nahi.',
      ]),
      example('medium', 'SELECT DISTINCT city, grade FROM students ORDER BY city;', [
        'Unique pairs: Delhi-A, Delhi-B are different rows. DISTINCT judged the whole row.',
        'Unique pairs: Delhi-A, Delhi-B alag rows hain. DISTINCT ne poora row dekha.',
      ]),
      example('hard', 'SELECT COUNT(DISTINCT city) AS cities, COUNT(city) AS entries FROM students;', [
        'Both counts side by side: 10 unique values from 50 non-NULL entries.',
        'Dono counts saath-saath: 50 non-NULL entries me se 10 unique values.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Expecting DISTINCT on one column to dedupe other columns', 'Ek column par DISTINCT se dusre columns ke duplicate hatane ki ummeed'],
        ['SELECT DISTINCT city, name does NOT give one row per city — it gives unique (city, name) pairs. Dedup on a column set means projecting only those columns.', 'SELECT DISTINCT city, name ek city ki ek row NAHI deta — ye unique (city, name) pairs deta hai. Column set par dedup ka matlab sirf wahi columns project karna.']
      ),
      mistake(
        ['Writing DISTINCT after the column list', 'Column list ke baad DISTINCT likhna'],
        ['DISTINCT goes immediately after SELECT, before any column: SELECT DISTINCT city …', 'DISTINCT SELECT ke turant baad aata hai, kisi bhi column se pehle: SELECT DISTINCT city …'],
      ),
      mistake(
        ['COUNT(DISTINCT a, b) confusion', 'COUNT(DISTINCT a, b) ka confusion'],
        ['SQLite supports multiple columns in COUNT(DISTINCT …) via parenthesised pairs, but the portable habit is one column per DISTINCT count.', 'SQLite COUNT(DISTINCT …) me multiple columns support karta hai, par portable aadat hai — ek DISTINCT count me ek column.']
      ),
    ],
    summary: [
      ['DISTINCT removes exact duplicate rows from a result', 'DISTINCT result se bilkul same rows hata deta hai'],
      ['Uniqueness applies to the whole selected column list', 'Uniqueness poore selected column list par lagti hai'],
      ['COUNT(DISTINCT col) turns row counts into value counts', 'COUNT(DISTINCT col) row count ko value count bana deta hai'],
      ['DISTINCT sits directly after SELECT', 'DISTINCT SELECT ke turant baad aata hai'],
    ],
    quiz: [
      mcq(
        ['SELECT DISTINCT grade, city FROM students removes which rows?', 'SELECT DISTINCT grade, city FROM students kaunsi rows hata deta hai?'],
        [
          ['All rows with duplicate grades', 'Jo grade duplicate hai wo saari rows'],
          ['All rows with duplicate cities', 'Jo city duplicate hai wo saari rows'],
          ['Only rows where the (grade, city) pair repeats exactly', 'Sirf wahi rows jahan (grade, city) pair exactly repeat hota hai'],
          ['Nothing — DISTINCT needs one column', 'Kuch nahi — DISTINCT ko ek column chahiye'],
        ],
        2,
        ['DISTINCT judges the complete selected row: the pair (grade, city) must repeat for a row to be dropped.', 'DISTINCT poora selected row dekhta hai: row hatne ke liye (grade, city) pair repeat hona chahiye.']
      ),
      outputQ(
        'SELECT DISTINCT grade FROM students;',
        ['How many rows come back, and what are they?', 'Kitni rows aati hain, aur kya hain wo?'],
        [
          { label: 'A', result: { columns: ['grade'], rows: [['A'], ['B'], ['C'], ['D'], ['F']] } },
          { label: 'B', result: { columns: ['grade'], rows: [['A'], ['A'], ['B']] } },
          { label: 'C', result: { columns: ['grade'], rows: [[12], [6], [9], [14], [9]] } },
          { label: 'D', result: { error: 'Error: near "DISTINCT": syntax error' } },
        ],
        0,
        ['Grades in the data are A, B, C, D and F — five unique values, one row each.', 'Data me grades A, B, C, D aur F hain — paanch unique values, har ek ki ek row.']
      ),
      buildQ(
        ['Build a query listing the unique subjects taught', 'Unique subjects list karne ki query banao'],
        ['DISTINCT', 'subject', 'FROM', 'teachers', 'SELECT'],
        ['SELECT', 'DISTINCT', 'subject', 'FROM', 'teachers'],
        ['DISTINCT comes right after SELECT.', 'DISTINCT SELECT ke turant baad aata hai.']
      ),
      blanksQ(
        'SELECT ___ city FROM students;',
        [{ options: ['DISTINCT', 'UNIQUE', 'DIFFERENT', 'NODUP'], correct: 'DISTINCT' }],
        ['DISTINCT is the deduplication keyword.', 'DISTINCT hi deduplication keyword hai.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Which cities are represented in the school? List each city exactly once.',
          'School me kaunsi cities shamil hain? Har city exactly ek baar list karo.',
        ],
        sol: 'SELECT DISTINCT city FROM students;',
        hints: [
          ['One keyword after SELECT does it.', 'SELECT ke baad ek keyword kaafi hai.'],
          ['SELECT DISTINCT city FROM students;', 'SELECT DISTINCT city FROM students;'],
          ['Ten unique cities should appear.', 'Das unique cities dikhne chahiye.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'Staff planning: list each subject taught at the school exactly once.',
          'Staff planning: school me padhaya jaane wala har subject exactly ek baar list karo.',
        ],
        sol: 'SELECT DISTINCT subject FROM teachers;',
        hints: [
          ['Same dedup pattern on the teachers table.', 'Teachers table par wahi dedup pattern.'],
          ['SELECT DISTINCT subject FROM teachers;', 'SELECT DISTINCT subject FROM teachers;'],
          ['Six subjects appear once each.', 'Chhe subjects ek-ek baar dikhte hain.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'How many different cities do students come from? Show a single number named unique_cities.',
          'Students kitni alag-alag cities se aate hain? Ek single number dikhao, naam unique_cities.',
        ],
        sol: 'SELECT COUNT(DISTINCT city) AS unique_cities FROM students;',
        hints: [
          ['Put DISTINCT inside the COUNT.', 'COUNT ke andar DISTINCT rakho.'],
          ['SELECT COUNT(DISTINCT city) AS unique_cities FROM students;', 'SELECT COUNT(DISTINCT city) AS unique_cities FROM students;'],
          ['The answer is 10.', 'Jawab 10 hai.'],
        ],
      }),
      task({
        d: 'hard',
        desc: [
          'The guidance office studies city-grade patterns: show every unique (city, grade) combination students have.',
          'Guidance office city-grade patterns padhti hai: students ke har unique (city, grade) combination dikhao.',
        ],
        sol: 'SELECT DISTINCT city, grade FROM students;',
        hints: [
          ['Two columns: uniqueness applies to the pair.', 'Do columns: uniqueness pair par lagti hai.'],
          ['SELECT DISTINCT city, grade FROM students;', 'SELECT DISTINCT city, grade FROM students;'],
          ['Row order is not checked here.', 'Yahan row order check nahi hota.'],
        ],
      }),
      task({
        d: 'very_hard',
        desc: [
          'Diversity audit in one row: how many unique cities and how many unique grades exist? Two aliased numbers, one query (headers checked).',
          'Ek row me diversity audit: kitne unique cities aur kitne unique grades hain? Do aliased numbers, ek query (headers check honge).',
        ],
        sol: 'SELECT COUNT(DISTINCT city) AS unique_cities, COUNT(DISTINCT grade) AS unique_grades FROM students;',
        hints: [
          ['Two COUNT(DISTINCT …) expressions side by side.', 'Do COUNT(DISTINCT …) expressions saath-saath.'],
          ['SELECT COUNT(DISTINCT city) AS unique_cities, COUNT(DISTINCT grade) AS unique_grades FROM students;', 'SELECT COUNT(DISTINCT city) AS unique_cities, COUNT(DISTINCT grade) AS unique_grades FROM students;'],
          ['Expected: 10 and 5.', 'Expected: 10 aur 5.'],
        ],
        rules: { checkColumnNames: true },
      }),
    ],
  }),

  defineModule({
    n: 9,
    title: ['WHERE Introduction', 'WHERE ka Introduction'],
    time: '25 min',
    concepts: ['where', 'filter', 'condition', 'boolean', 'predicate', 'row selection'],
    diagram: 'filter',
    objectives: [
      ['Filter rows with WHERE and a true/false condition', 'WHERE aur true/false condition se rows filter karna'],
      ['Combine text and number filters correctly', 'Text aur number filters sahi combine karna'],
      ['Understand that WHERE works before projection', 'Samajhna ki WHERE projection se pehle kaam karta hai'],
    ],
    theory: [
      section(
        ['From "everything" to "exactly these"', '"Sab kuch" se "bilkul yeh" tak'],
        [
          [
            'SELECT gives you every row; real questions want a slice: students from Delhi, teachers earning above 70000, courses worth 4 credits. WHERE keeps only the rows for which a condition is TRUE — a predicate the engine evaluates row by row. SELECT name FROM students WHERE city = \'Delhi\' says: for each student, if their city equals \'Delhi\', keep the name.',
            'SELECT saari rows deta hai; real sawal slice maangte hain: Delhi ke students, 70000 se zyada kamane wale teachers, 4 credits wale courses. WHERE sirf wahi rows rakhta hai jinki condition TRUE hai — ek predicate jo engine row-by-row check karta hai. SELECT name FROM students WHERE city = \'Delhi\' ka matlab: har student ke liye, agar uska city \'Delhi\' hai, naam rakho.',
          ],
          [
            'This is the single most-used clause in SQL. Reports, dashboards, searches, permissions — all reduce to "show me rows where something holds". Master WHERE and every later topic (GROUP BY, JOIN, subqueries) simply stacks on top of it.',
            'Yeh SQL ka sabse zyada use hone wala clause hai. Reports, dashboards, searches, permissions — sab "mujhe wahi rows dikhao jahan kuch sach ho" par aate hain. WHERE master kar lo, to baad ka har topic (GROUP BY, JOIN, subqueries) bas iske upar chadh jaata hai.',
          ],
        ],
        [],
        'filter'
      ),
      section(
        ['Writing conditions', 'Conditions likhna'],
        [
          [
            'A condition compares a column to a value using =, <> (not equal), <, >, <=, >=. Text values need single quotes: city = \'Delhi\'; numbers do not: age >= 18. The engine evaluates the condition for every row, then discards rows that are FALSE — and also rows that are NULL (unknown is not true, covered fully in Module 16).',
            'Condition column ko value se compare karta hai — =, <> (not equal), <, >, <=, >= use karke. Text values ko single quotes chahiye: city = \'Delhi\'; numbers ko nahi: age >= 18. Engine har row ke liye condition check karta hai, phir FALSE wali rows hata deta hai — aur NULL wali bhi (unknown true nahi hota, poora Module 16 me).',
          ],
          [
            'Important sequencing: WHERE runs before SELECT\'s projection. The engine filters complete rows first, then projects your chosen columns. That is why you can filter on a column you do not even display: WHERE age > 20 while selecting only name.',
            'Important sequencing: WHERE SELECT ke projection se pehle chalta hai. Engine pehle poori rows filter karta hai, phir aapke chune columns project karta hai. Isi liye aap us column par filter kar sakte ho jo aap dikhate hi nahi: sirf name select karte hue WHERE age > 20.',
          ],
        ],
        [
          ['Text in single quotes; numbers bare', 'Text single quotes me; numbers bina quotes'],
          ['WHERE evaluates per row; keeps TRUE only', 'WHERE har row par check hota hai; sirf TRUE rakhta hai'],
          ['Filtering happens before column projection', 'Filtering column projection se pehle hoti hai'],
        ]
      ),
      section(
        ['An analogy: the door bouncer', 'Analogy: darwaze ka bouncer'],
        [
          [
            'WHERE is the bouncer at the result\'s door. Every row lines up; each one hands over its values; the bouncer checks the condition — "city is Delhi?" — and only satisfying rows walk through to your SELECT columns. The bouncer never changes anyone; they just decide who enters.',
            'WHERE result ke darwaze ka bouncer hai. Har row line me lagti hai; har ek apni values dikhati hai; bouncer condition check karta hai — "city Delhi hai?" — aur sirf pas karne wali rows aapke SELECT columns tak aati hain. Bouncer kisi ko badalta nahi; bas decide karta hai kaun andar aaye.',
          ],
        ]
      ),
    ],
    tutorial: {
      title: ['Filtering to Delhi', 'Delhi par filter karna'],
      steps: [
        step(null, [
          'The Delhi coordinator needs exactly her students. We add a WHERE clause and watch rows disappear one condition at a time.',
          'Delhi coordinator ko exactly apne students chahiye. Hum WHERE clause jodte hain aur rows ko condition ke hisab se ghat-te dekhte hain.',
        ]),
        step('SELECT name, city FROM students;', [
          'Unfiltered: all 50 rows pass through.',
          'Bina filter: saari 50 rows pass ho jaati hain.',
        ], { table: 'students' }),
        step("SELECT name, city FROM students WHERE city = 'Delhi';", [
          'The condition tests each row; only Delhi rows survive (7).',
          'Condition har row test karti hai; sirf Delhi wali bachti hain (7).',
        ], { table: 'students', highlightWhere: "city = 'Delhi'" }),
        step("SELECT name, city, age FROM students WHERE city = 'Delhi' AND age >= 18;", [
          'A second condition narrows further (a preview of AND from Module 12).',
          'Doosri condition aur tight karti hai (Module 12 ke AND ka preview).',
        ], { run: true, table: 'students', highlightWhere: "city = 'Delhi' AND age >= 18" }),
        step(null, [
          'The filter read the whole row — including columns we never displayed.',
          'Filter ne poori row padhi — un columns ko bhi jo humne dikhaya hi nahi.',
        ]),
      ],
    },
    syntax: {
      template: 'SELECT column_list\nFROM table_name\nWHERE condition;',
      parts: [
        { part: 'WHERE', description: ['Starts the filter clause', 'Filter clause shuru karta hai'] },
        { part: 'condition', description: ['Evaluates TRUE/FALSE per row', 'Har row par TRUE/FALSE hota hai'] },
        { part: '= \'text\'', description: ['Quoted comparison for strings', 'Strings ke liye quoted comparison'] },
        { part: '>= number', description: ['Unquoted comparison for numbers', 'Numbers ke liye bina quote comparison'] },
      ],
    },
    examples: [
      example('very_easy', "SELECT name FROM students WHERE city = 'Delhi';", [
        'A single equality filter — text needs quotes.',
        'Ek equality filter — text ko quotes chahiye.',
      ]),
      example('easy', 'SELECT name, salary FROM teachers WHERE salary > 70000;', [
        'A numeric threshold — no quotes on numbers.',
        'Numeric threshold — numbers par koi quote nahi.',
      ]),
      example('medium', 'SELECT name FROM teachers WHERE subject = \'Mathematics\';', [
        'Filtering text categories: two teachers teach Mathematics.',
        'Text categories filter karna: do teachers Mathematics padhate hain.',
      ]),
      example('hard', 'SELECT name, city, age FROM students WHERE age < 18;', [
        'Under-18 minors for a consent-required trip. Rows are filtered on age while all three columns display.',
        'Consent-required trip ke liye 18 se kam wale. Rows age par filter hote hain jabki teenon columns dikhte hain.',
      ]),
    ],
    mistakes: [
      mistake(
        ["Using double quotes for strings: WHERE city = \"Delhi\"", "Strings ke liye double quotes: WHERE city = \"Delhi\""],
        ['In SQL, double quotes mean identifiers (column names). Use single quotes for values: \'Delhi\'.', 'SQL me double quotes identifiers (column names) ke liye hote hain. Values ke liye single quotes: \'Delhi\'.']
      ),
      mistake(
        ['Comparing NULL with = and getting zero rows', '= se NULL compare karke zero rows milna'],
        ['NULL is unknown; = NULL is never true. Use IS NULL / IS NOT NULL (Module 16).', 'NULL unknown hai; = NULL kabhi true nahi hota. IS NULL / IS NOT NULL use karo (Module 16).']
      ),
      mistake(
        ['WHERE before FROM', 'FROM se pehle WHERE likhna'],
        ['Clause order is fixed: SELECT → FROM → WHERE. The engine will reject WHERE first.', 'Clause order fixed hai: SELECT → FROM → WHERE. Engine WHERE ko pehle manega hi nahi.']
      ),
    ],
    summary: [
      ['WHERE keeps only rows where the condition is TRUE', 'WHERE sirf wahi rows rakhta hai jahan condition TRUE ho'],
      ['String values take single quotes; numbers take none', 'String values single quotes me; numbers bina quotes'],
      ['Filtering happens on full rows before projection', 'Filtering projection se pehle poori rows par hoti hai'],
      ['NULL rows never match = — they need IS NULL', 'NULL rows = se kabhi match nahi hote — unhe IS NULL chahiye'],
    ],
    quiz: [
      mcq(
        ['What does WHERE do in a SELECT query?', 'SELECT query me WHERE kya karta hai?'],
        [
          ['Sorts the result rows', 'Result rows sort karta hai'],
          ['Keeps only rows where the condition is TRUE', 'Sirf wahi rows rakhta hai jahan condition TRUE hai'],
          ['Removes duplicate rows', 'Duplicate rows hata deta hai'],
          ['Renames columns', 'Columns rename karta hai'],
        ],
        1,
        ['WHERE is the row filter; ORDER BY sorts, DISTINCT dedupes, AS renames.', 'WHERE row filter hai; ORDER BY sort karta hai, DISTINCT dedupe karta hai, AS rename.']
      ),
      outputQ(
        "SELECT COUNT(*) FROM students WHERE city = 'Delhi';",
        ['How many rows does the count report?', 'Count kitni rows batata hai?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[7]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[50]] } },
          { label: 'C', result: { columns: ['COUNT(*)'], rows: [[0]] } },
          { label: 'D', result: { error: "Error: no such column: Delhi" } },
        ],
        0,
        ['Seven students live in Delhi in this dataset.', 'Is dataset me saat students Delhi me rehte hain.']
      ),
      buildQ(
        ['Build: names of teachers who teach Physics', 'Banao: Physics padhane wale teachers ke naam'],
        ["WHERE", 'subject', "'Physics'", 'SELECT', 'name', 'FROM', 'teachers', '='],
        ['SELECT', 'name', 'FROM', 'teachers', 'WHERE', 'subject', '=', "'Physics'"],
        ['FROM, then WHERE, with a quoted value after =.', 'FROM, phir WHERE, = ke baad quoted value.']
      ),
      blanksQ(
        "SELECT name FROM students ___ city ___ 'Delhi';",
        [
          { options: ['WHERE', 'WHICH', 'IF', 'HAVING'], correct: 'WHERE' },
          { options: ['=', 'IS', 'LIKE', '=='], correct: '=' },
        ],
        ['WHERE introduces the condition; = compares values.', 'WHERE condition laya hai; = values compare karta hai.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The Delhi coordinator needs her list. Show the names of students from Delhi.',
          'Delhi coordinator ko apni list chahiye. Delhi ke students ke naam dikhao.',
        ],
        sol: "SELECT name FROM students WHERE city = 'Delhi';",
        hints: [
          ['Filter text with = and single quotes.', 'Text ko = aur single quotes se filter karo.'],
          ["SELECT name FROM students WHERE city = 'Delhi';", "SELECT name FROM students WHERE city = 'Delhi';"],
          ['Seven names should appear.', 'Saat naam dikhne chahiye.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'The senior-staff review needs well-paid teachers: show name and salary for teachers earning more than 70000.',
          'Senior-staff review ko achhi salary wale teachers chahiye: 70000 se zyada kamane wale teachers ka naam aur salary dikhao.',
        ],
        sol: 'SELECT name, salary FROM teachers WHERE salary > 70000;',
        hints: [
          ['Numbers take no quotes.', 'Numbers par quotes nahi lagte.'],
          ['SELECT name, salary FROM teachers WHERE salary > 70000;', 'SELECT name, salary FROM teachers WHERE salary > 70000;'],
          ['Five teachers cross the threshold.', 'Paanch teachers threshold cross karte hain.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'Minors need parental consent for the robotics trip: show name and age of students younger than 18.',
          'Robotics trip ke liye minors ko parental consent chahiye: 18 se kam umar ke students ka naam aur age dikhao.',
        ],
        sol: 'SELECT name, age FROM students WHERE age < 18;',
        hints: [
          ['Strictly less than 18.', 'Strictly 18 se kam.'],
          ['SELECT name, age FROM students WHERE age < 18;', 'SELECT name, age FROM students WHERE age < 18;'],
          ['Ages 16 and 17 appear in the result.', 'Result me 16 aur 17 saal dikhte hain.'],
        ],
      }),
      task({
        d: 'hard',
        desc: [
          'The science fair accepts grade-A seniors only: show name, grade and age for students with grade \'A\' who are at least 19 years old.',
          'Science fair sirf grade-A seniors leta hai: grade \'A\' aur kam se kam 19 saal wale students ka naam, grade aur age dikhao.',
        ],
        sol: "SELECT name, grade, age FROM students WHERE grade = 'A' AND age >= 19;",
        hints: [
          ['Two conditions joined by AND both must hold.', 'AND se jude dono conditions honi chahiye.'],
          ["SELECT name, grade, age FROM students WHERE grade = 'A' AND age >= 19;", "SELECT name, grade, age FROM students WHERE grade = 'A' AND age >= 19;"],
          ['Row order is free; the pair of conditions decides membership.', 'Row order free hai; conditions ka jodi membership decide karti hai.'],
        ],
      }),
      task({
        d: 'very_hard',
        desc: [
          'Admissions wants a "watch list": name, city, age and grade for students who are NOT from Delhi, NOT minors (age ≥ 18) — sorted later, plain list now. Columns: name, city, age, grade.',
          'Admissions ko "watch list" chahiye: un students ka naam, city, age aur grade jo Delhi se NAHI hain aur minors bhi nahi (age ≥ 18) — sorting baad me, abhi simple list. Columns: name, city, age, grade.',
        ],
        sol: "SELECT name, city, age, grade FROM students WHERE city <> 'Delhi' AND age >= 18;",
        hints: [
          ['Not-equal is <> (or !=). Combine with AND.', 'Not-equal <> (ya !=) hai. AND se jodo.'],
          ["SELECT name, city, age, grade FROM students WHERE city <> 'Delhi' AND age >= 18;", "SELECT name, city, age, grade FROM students WHERE city <> 'Delhi' AND age >= 18;"],
          ['Both conditions tested on the whole row before projection.', 'Dono conditions projection se pehle poori row par test hoti hain.'],
        ],
      }),
    ],
  }),
];
