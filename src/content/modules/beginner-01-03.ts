'use client';

// Modules 01-03: What is Database & SQL · Database vs Spreadsheet · SQL Syntax Basics

import { defineModule, section, step, example, mistake, mcq, outputQ, buildQ, blanksQ, task } from './builder';
import type { Module } from '@/types/content';

export const modules: Module[] = [
  defineModule({
    n: 1,
    title: ['What is Database & SQL?', 'Database aur SQL kya hai?'],
    time: '20 min',
    concepts: ['database', 'sql', 'rdbms', 'table', 'row', 'column', 'record', 'query'],
    diagram: 'tables',
    objectives: [
      ['Explain what a database is and why spreadsheets fall short', 'Database kya hai aur spreadsheets kahan fail hote hain, yeh samajhna'],
      ['Identify tables, rows and columns in a real database', 'Real database me tables, rows aur columns pehchanna'],
      ['Run your very first SQL query', 'Apni pehli SQL query run karna'],
    ],
    theory: [
      section(
        ['Why databases exist', 'Databases kyun zaroori hain'],
        [
          [
            'Imagine a school with 50 students, 10 teachers, 15 courses and 200 enrollments. Now the office asks: "Which students from Delhi scored above 90 in Algebra?" If this data lives in paper files or one giant spreadsheet, answering takes minutes of scrolling and careful manual filtering — and every new question means repeating that effort.',
            'Ek school me 50 students, 10 teachers, 15 courses aur 200 enrollments hain. Ab office poochta hai: "Delhi ke kaunse students ne Algebra me 90 se zyada score kiya?" Agar yeh data paper files ya ek bade spreadsheet me hai, to jawab dene me minutes lagenge — har naye sawal par wahi mehnat dobara karni padegi.',
          ],
          [
            'A database stores data in structured tables so questions become queries — reusable instructions that the computer executes in milliseconds. The same question becomes a few lines of SQL, runs instantly, and never makes copying mistakes.',
            'Database data ko structured tables me rakhta hai, jisse sawal queries ban jaate hain — reusable instructions jo computer milliseconds me chala deta hai. Wahi sawal ab SQL ki kuch lines ban jata hai, turant chalta hai, aur kabhi copying mistake nahi karta.',
          ],
        ],
        [
          ['Data lives in tables (like sheets, but strictly structured)', 'Data tables me rehta hai (sheets jaisa, par strictly structured)'],
          ['Questions become queries, reusable and instant', 'Sawal queries ban jaate hain — reusable aur instant'],
          ['One database can serve many different questions', 'Ek database kai alag-alag sawalon ke jawab de sakta hai'],
        ]
      ),
      section(
        ['Tables, rows and columns', 'Tables, rows aur columns'],
        [
          [
            'A relational database organizes data into tables. Each table describes one kind of thing: our school database has a students table, a teachers table, a courses table and so on. Every table has columns — the properties we track (name, city, age) — and rows — one actual record per item (one student, one teacher).',
            'Relational database data ko tables me organize karta hai. Har table ek tarah ki cheez describe karta hai: hamare school database me students table, teachers table, courses table hain. Har table me columns hote hain — jo properties hum track karte hain (name, city, age) — aur rows — har item ka ek record (ek student, ek teacher).',
          ],
          [
            'The cross of a row and a column is a cell holding exactly one value, like a student\'s city being "Delhi". A table with 50 rows and 7 columns is 350 facts you can search, filter and combine. Related tables reference each other through keys, which is why this model is called relational.',
            'Row aur column ka intersection ek cell hota hai jisme exactly ek value hoti hai, jaise kisi student ka city "Delhi". 50 rows aur 7 columns wali table 350 facts hai jo aap search, filter aur combine kar sakte ho. Related tables aapas me keys se judi hoti hain — isi liye is model ko relational kehte hain.',
          ],
        ],
        [],
        'tables'
      ),
      section(
        ['What SQL is', 'SQL kya hai'],
        [
          [
            'SQL — Structured Query Language — is the standard language for asking databases questions. It has been the industry standard since the 1980s and works across MySQL, PostgreSQL, Oracle, SQL Server and SQLite with only small dialect differences. One skill, every employer.',
            'SQL — Structured Query Language — databases se sawal poochhne ki standard language hai. 1980s se industry standard hai aur MySQL, PostgreSQL, Oracle, SQL Server aur SQLite sab par chalta hai, sirf chote differences ke saath. Ek skill, har employer.',
          ],
          [
            'You write short, English-like statements: SELECT name FROM students reads almost like a sentence. Despite being beginner-friendly, SQL scales to analytics on millions of rows — the same language you learn today is used in real data-science and backend work.',
            'Aap chote, English-jaise statements likhte ho: SELECT name FROM students lagbhag sentence jaisa padha jaata hai. Beginner-friendly hone ke bawajood SQL millions of rows par analytics tak scale karta hai — jo language aaj seekh rahe ho, wahi real data-science aur backend kaam me use hota hai.',
          ],
        ],
        [
          ['SQL = the language; database = the structured store it talks to', 'SQL = language; database = structured store jisse baat hoti hai'],
          ['Nearly identical across all major database engines', 'Saare bade database engines par lagbhag same'],
          ['Declarative: you describe WHAT you want, not HOW to find it', 'Declarative: aap batate ho KYA chahiye, KAISE nahi'],
        ]
      ),
      section(
        ['An analogy: the library', 'Analogy: library'],
        [
          [
            'Think of a database as a well-organised library. Tables are the shelves, each holding one genre. Rows are individual books, columns are the labelled properties (title, author, year), and SQL is the librarian who instantly fetches exactly the books you describe — "all thrillers from 2020, sorted by rating".',
            'Database ko ek achhi tarike se organize ki hui library samjho. Tables shelves hain, har ek ek genre rakhti hai. Rows alag-alag books hain, columns labelled properties hain (title, author, year), aur SQL librarian hai jo aapki description ke hisab se books turant la deta hai — "2020 ke saare thrillers, rating ke hisab se".',
          ],
          [
            'This course runs a real SQLite database inside your browser. Every query you write executes against real tables with real rows — exactly like at work, with zero setup.',
            'Yeh course aapke browser ke andar real SQLite database chalata hai. Aapki har query real tables aur real rows par chalti hai — bilkul office jaisa, zero setup ke saath.',
          ],
        ]
      ),
    ],
    tutorial: {
      title: ['Your first query', 'Aapki pehli query'],
      steps: [
        step(null, [
          'Every database exploration starts by looking at a whole table. We will type our first query and watch it return every student in the school.',
          'Har database exploration poori table dekhne se shuru hoti hai. Hum apni pehli query likhenge aur dekhenge ki wo school ke har student ko wapas laati hai.',
        ]),
        step('SELECT * FROM students;', [
          'SELECT * asks for every column, and FROM students names the table. The semicolon ends the statement.',
          'SELECT * har column maangta hai, aur FROM students table ka naam batata hai. Semicolon statement khatam karta hai.',
        ], { table: 'students' }),
        step('SELECT * FROM students;', [
          'Press Run: the engine scans all 50 rows and returns the complete students table as a result grid.',
          'Run dabao: engine 50 rows scan karega aur poori students table result grid me wapas layega.',
        ], { run: true, table: 'students' }),
        step(null, [
          'You just ran real SQL on a real database. Every idea in this course will be built the same way: type a query, run it, read the result.',
          'Aapne abhi real database par real SQL chalaya. Is course ka har idea isi tarah banega: query likho, run karo, result padho.',
        ]),
      ],
    },
    syntax: {
      template: 'SELECT * FROM table_name;',
      parts: [
        { part: 'SELECT', description: ['The verb: "give me data"', 'Verb: "mujhe data do"'] },
        { part: '*', description: ['Every column of the table', 'Table ka har column'] },
        { part: 'FROM table_name', description: ['Which table to read', 'Kis table se padhna hai'] },
        { part: ';', description: ['Ends the statement (optional in SQLite, standard practice)', 'Statement ka end (SQLite me optional hai, par standard practice)'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT * FROM students;', [
        'Returns every row and every column of the students table. Best first look at any table.',
        'Students table ki har row aur har column wapas laata hai. Kisi bhi table ka pehla nazar isi se best hai.',
      ]),
      example('easy', 'SELECT * FROM teachers;', [
        'The same pattern works on any table — here we inspect the teachers.',
        'Yahi pattern har table par chalta hai — yahan hum teachers dekhte hain.',
      ]),
      example('medium', 'SELECT * FROM enrollments;', [
        'Enrollment records connect students to courses. Notice the score column contains NULL for courses still in progress.',
        'Enrollment records students ko courses se jodte hain. Dhyan do — score column me jo courses abhi chal rahe hain unke liye NULL hai.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Writing table names in the wrong case, like FROM Students', 'Table ka naam galat case me likhna, jaise FROM Students'],
        ['SQLite is case-insensitive for table names, so it still works — but MySQL and PostgreSQL are not. Build the habit of exact names now: FROM students.', 'SQLite table names me case-insensitive hai, to chal jayega — par MySQL aur PostgreSQL nahi hain. Abhi se exact names ki aadat banao: FROM students.']
      ),
      mistake(
        ['Thinking SQL is only for programmers', 'Yeh sochna ki SQL sirf programmers ke liye hai'],
        ['SQL is used daily by analysts, marketers, product managers and finance teams. It is the most accessible high-value skill in data work.', 'SQL roz analysts, marketers, product managers aur finance teams use karte hain. Data kaam me sabse accessible high-value skill yahi hai.']
      ),
      mistake(
        ['Confusing the database with the language', 'Database aur language ko confuse karna'],
        ['SQLite/MySQL/PostgreSQL are databases (the store). SQL is the language you use to talk to them.', 'SQLite/MySQL/PostgreSQL databases hain (store). SQL wo language hai jisse aap unse baat karte ho.']
      ),
    ],
    summary: [
      ['A database stores structured data in tables: rows are records, columns are properties', 'Database structured data tables me rakhta hai: rows records hain, columns properties'],
      ['SQL is the standard language for querying every major database engine', 'SQL har bade database engine ko query karne ki standard language hai'],
      ['SELECT * FROM table shows a whole table', 'SELECT * FROM table poori table dikhata hai'],
      ['This platform runs a real SQLite engine in your browser', 'Yeh platform aapke browser me real SQLite engine chalata hai'],
    ],
    quiz: [
      mcq(
        ['In a database table, what does a row represent?', 'Database table me row kya represent karti hai?'],
        [
          ['One property of every record', 'Har record ki ek property'],
          ['One complete record, like a single student', 'Ek poora record, jaise ek student'],
          ['The table name', 'Table ka naam'],
          ['A link between two tables', 'Do tables ke beech ka link'],
        ],
        1,
        ['A row is one record — all the properties of a single item. Columns are the properties.', 'Row ek record hai — ek item ki saari properties. Columns wo properties hain.']
      ),
      outputQ(
        'SELECT COUNT(*) FROM students;',
        ['How many rows does the students table contain?', 'Students table me kitni rows hain?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[50]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[10]] } },
          { label: 'C', result: { columns: ['COUNT(*)'], rows: [[200]] } },
          { label: 'D', result: { error: 'Error: syntax error' } },
        ],
        0,
        ['The school database has 50 students — 10 is the number of teachers, 200 the number of enrollments.', 'School database me 50 students hain — 10 teachers hain, 200 enrollments.']
      ),
      buildQ(
        ['Build a query that shows the entire courses table', 'Aisi query banao jo poori courses table dikhaye'],
        ['FROM', 'courses', 'SELECT', '*'],
        ['SELECT', '*', 'FROM', 'courses'],
        ['SELECT first, then what (*) you want, then FROM which table.', 'Pehle SELECT, phir kya (*) chahiye, phir FROM kis table.']
      ),
      blanksQ(
        'SELECT * ___ students;',
        [{ options: ['FROM', 'TABLE', 'IN', 'OF'], correct: 'FROM' }],
        ['FROM names the source table after SELECT lists the columns.', 'FROM source table ka naam batata hai, SELECT columns list karta hai.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The principal wants a quick overview of the school. Show the complete students table — every row, every column.',
          'Principal ko school ka quick overview chahiye. Poori students table dikhao — har row, har column.',
        ],
        sol: 'SELECT * FROM students;',
        hints: [
          ['SELECT * returns every column; FROM names the table.', 'SELECT * har column laata hai; FROM table ka naam batata hai.'],
          ['SELECT * FROM table_name;', 'SELECT * FROM table_name;'],
          ['Almost the full answer — just name the right table: SELECT * FROM ___;', 'Almost poora jawab — bas sahi table ka naam do: SELECT * FROM ___;'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'The HR department is reviewing staff. Show every column of the teachers table.',
          'HR department staff review kar raha hai. Teachers table ka har column dikhao.',
        ],
        sol: 'SELECT * FROM teachers;',
        hints: [
          ['Same pattern as before, but the table holds staff records.', 'Pichle jaisa hi pattern, par is table me staff records hain.'],
          ['SELECT * FROM ___;', 'SELECT * FROM ___;'],
          ['Replace the blank with the staff table\'s name — check the Schema panel.', 'Blank ko staff table ke naam se replace karo — Schema panel dekho.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'The academic office wants to review all course definitions. Show the complete courses table.',
          'Academic office saare course definitions dekhna chahta hai. Poori courses table dikhao.',
        ],
        sol: 'SELECT * FROM courses;',
        hints: [
          ['One statement, one table, all columns.', 'Ek statement, ek table, saare columns.'],
          ['SELECT * FROM courses;', 'SELECT * FROM courses;'],
          ['You already know the pattern — the table is courses.', 'Pattern aapko pata hai — table courses hai.'],
        ],
      }),
      task({
        d: 'hard',
        desc: [
          'The enrollment office needs to audit course registrations. Show every column of the enrollments table.',
          'Enrollment office course registrations audit karna chahta hai. Enrollments table ka har column dikhao.',
        ],
        sol: 'SELECT * FROM enrollments;',
        hints: [
          ['Registrations live in the table linking students and courses.', 'Registrations us table me hain jo students aur courses ko jodta hai.'],
          ['SELECT * FROM enrollments;', 'SELECT * FROM enrollments;'],
          ['Notice some score cells show NULL — courses still in progress. That is expected.', 'Dhyan do — kuch score cells NULL hain — courses abhi chal rahe hain. Yeh normal hai.'],
        ],
      }),
      task({
        d: 'very_hard',
        desc: [
          'The school board wants to see how departments are organised and funded. Show the full departments table — every row and column.',
          'School board dekhna chahta hai ki departments kaise organized aur funded hain. Poori departments table dikhao — har row aur column.',
        ],
        sol: 'SELECT * FROM departments;',
        hints: [
          ['Same one-line pattern; this table has 5 rows with budgets and a head teacher reference.', 'Wahi one-line pattern; is table me 5 rows hain budgets aur head teacher reference ke saath.'],
          ['SELECT * FROM departments;', 'SELECT * FROM departments;'],
          ['head_teacher_id is a foreign key pointing at teachers.id — you will use these links soon.', 'head_teacher_id foreign key hai jo teachers.id ki taraf point karta hai — jaldi hi in links ko use karoge.'],
        ],
      }),
    ],
  }),

  defineModule({
    n: 2,
    title: ['Database vs Spreadsheet', 'Database vs Spreadsheet'],
    time: '15 min',
    concepts: ['database', 'spreadsheet', 'excel', 'scale', 'concurrency', 'integrity', 'data types'],
    diagram: 'tables',
    objectives: [
      ['Recognise the limits of spreadsheets for structured data', 'Structured data ke liye spreadsheets ki pehchanna'],
      ['Explain the concrete advantages of databases', 'Database ke concrete faayde batana'],
      ['Query the same data both ways and feel the difference', 'Same data dono tarike se query karke difference mehsoos karna'],
    ],
    theory: [
      section(
        ['Where spreadsheets shine', 'Spreadsheets kahan chamakte hain'],
        [
          [
            'Spreadsheets like Excel or Google Sheets are superb for small, flexible, human-shaped data: a household budget, a one-time class list, quick charts. You see everything at once, drag values around, and compute totals with a click. For a handful of rows, they are perfect.',
            'Excel ya Google Sheets jaise spreadsheets chote, flexible, insaan-shaped data ke liye badhiya hain: ghar ka budget, ek baar ki class list, quick charts. Sab kuch ek saath dikhta hai, values drag kar sakte ho, totals ek click me. Chhand rows ke liye perfect hain.',
          ],
          [
            'The trouble starts with growth. Add 200 enrollments, 5 related tables, monthly reports and two people editing at once — and spreadsheets begin to break in ways that are quiet and expensive.',
            'Problem growth ke saath shuru hoti hai. 200 enrollments, 5 related tables, monthly reports aur do log ek saath edit karein — spreadsheets aise tootne lagte hain jo chup aur mehnge hote hain.',
          ],
        ]
      ),
      section(
        ['Why databases win at scale', 'Scale par database kyun jeette hain'],
        [
          [
            'First, structure is enforced. A column declared INTEGER rejects "hello". Our students table guarantees every age is a number between 15 and 25 — bad data simply cannot enter. Second, tables relate: enrollments reference students and courses by id, so updating a name updates it everywhere, once. Third, queries scale: filtering 50 rows or 50 million rows is the same three-line query.',
            'Pehla, structure enforce hota hai. INTEGER declare kiya column "hello" reject karega. Hamari students table guarantee karti hai ki har age 15 se 25 ke beech number hogi — galat data andar hi nahi ja sakta. Doosra, tables judi hoti hain: enrollments students aur courses ko id se refer karte hain, to naam update karo to har jagah ek baar me update hota hai. Teesra, queries scale karti hain: 50 rows ya 50 million rows filter karna — same three-line query.',
          ],
          [
            'Databases also handle many simultaneous readers and writers safely, keep a query history of your logic, and back up as a single file. That is why every serious application — banking, e-commerce, analytics — sits on a database, with spreadsheets used only for final reporting.',
            'Databases saath hi kai readers aur writers ko safely handle karte hain, aapke logic ki query history rakhte hain, aur ek file ki tarah backup hote hain. Isi liye har serious application — banking, e-commerce, analytics — database par baithi hai, spreadsheets sirf final reporting ke liye.',
          ],
        ],
        [
          ['Enforced types and rules stop bad data at the door', 'Enforced types aur rules galat data ko darwaze par hi rok dete hain'],
          ['Related tables eliminate duplicated, drifting copies', 'Related tables duplicate, badalte hue copies khatam karte hain'],
          ['One query language works at any size', 'Ek query language kisi bhi size par chalti hai'],
        ]
      ),
      section(
        ['The comparison in practice', 'Comparison practically'],
        [
          [
            'Take a real question: which cities have more than two students? In a spreadsheet you would select the column, insert a pivot table, drag city into rows, count into values, then filter the result — five manual steps, repeated whenever data changes. In SQL it is one saved query: SELECT city, COUNT(*) FROM students GROUP BY city HAVING COUNT(*) > 2. Run it any time, share it, automate it.',
            'Ek real sawal: kin cities me do se zyada students hain? Spreadsheet me aap column select karte, pivot table insert karte, city ko rows me drag karte, count values me, phir result filter karte — paanch manual steps, har data change par dobara. SQL me yeh ek saved query hai: SELECT city, COUNT(*) FROM students GROUP BY city HAVING COUNT(*) > 2. Kabhi bhi run karo, share karo, automate karo.',
          ],
        ],
        [],
        'tables'
      ),
    ],
    tutorial: {
      title: ['One query, whole answer', 'Ek query, poora jawab'],
      steps: [
        step(null, [
          'Here is the spreadsheet workflow — five clicks — replaced by a single query the moment data is structured.',
          'Spreadsheet workflow — paanch clicks — structured data ke saath ek single query me badal jaata hai.',
        ]),
        step('SELECT city, COUNT(*) FROM students GROUP BY city;', [
          'Grouping city-wise and counting rows per city replaces the pivot table.',
          'City ke hisab se group karke har city ki rows ganna pivot table ka kaam karta hai.',
        ], { table: 'students' }),
        step('SELECT city, COUNT(*) FROM students GROUP BY city HAVING COUNT(*) > 2;', [
          'Adding HAVING filters the groups themselves — the spreadsheet "filter" step, inside the query.',
          'HAVING jodne se groups hi filter ho jaate hain — spreadsheet ka "filter" step, query ke andar.',
        ], { run: true, table: 'students' }),
        step(null, [
          'Every future report request becomes a saved query instead of a manual procedure. That is the database advantage.',
          'Har future report request manual procedure ki jagah saved query ban jaati hai. Yahi database ka faayda hai.',
        ]),
      ],
    },
    syntax: {
      template: 'SELECT column, COUNT(*) FROM table GROUP BY column HAVING COUNT(*) > n;',
      parts: [
        { part: 'SELECT column, COUNT(*)', description: ['Show the group label and the count per group', 'Group label aur har group ka count dikhao'] },
        { part: 'FROM table', description: ['The source table', 'Source table'] },
        { part: 'GROUP BY column', description: ['Collapse rows into one row per value', 'Rows ko har value ke liye ek row me collapse karo'] },
        { part: 'HAVING COUNT(*) > n', description: ['Keep only groups passing the test', 'Sirf test pass karne wale groups rakho'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT COUNT(*) FROM students;', [
        'One cell, one fact: how many students exist. Try getting that wrong in a 50-row spreadsheet.',
        'Ek cell, ek fact: kitne students hain. 50-row spreadsheet me isse galat karna asaan hai, yahan nahi.',
      ]),
      example('medium', 'SELECT city, COUNT(*) FROM students GROUP BY city;', [
        'A grouped count — the pivot table replacement.',
        'Grouped count — pivot table ka replacement.',
      ]),
      example('hard', 'SELECT city, COUNT(*) AS students FROM students GROUP BY city HAVING COUNT(*) > 5 ORDER BY students DESC;', [
        'Grouping, filtering groups, sorting — a full mini-report in one reusable statement.',
        'Grouping, group filtering, sorting — ek reusable statement me poora mini-report.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Using a database for a 20-row one-off list', '20-row ke ek-baar ke list ke liye database use karna'],
        ['Choose the right tool: spreadsheets are fine for small, personal, one-time data. Databases earn their keep with size, relations, or reuse.', 'Sahi tool choose karo: chote, personal, one-time data ke liye spreadsheet theek hai. Size, relations ya reuse hone par database apni value dikhata hai.']
      ),
      mistake(
        ['Duplicating the same customer name across many spreadsheet tabs', 'Same customer name kai spreadsheet tabs me duplicate karna'],
        ['In a database, store the name once in customers and reference it by id elsewhere. One change updates everywhere.', 'Database me naam ek baar customers me rakho aur id se reference karo. Ek change har jagah update karta hai.']
      ),
      mistake(
        ['Believing databases are only for large companies', 'Yeh sochna ki database sirf badi companies ke liye hain'],
        ['This course itself runs a full relational database inside your browser. Scale starts at one table.', 'Yeh course khud aapke browser me poora relational database chalata hai. Scale ek table se shuru hoti hai.']
      ),
    ],
    summary: [
      ['Spreadsheets: great for small, flexible, one-time data', 'Spreadsheets: chote, flexible, one-time data ke liye badhiya'],
      ['Databases: enforced structure, related tables, reusable queries, safe concurrency', 'Databases: enforced structure, related tables, reusable queries, safe concurrency'],
      ['GROUP BY replaces pivot tables with saved queries', 'GROUP BY pivot tables ki jagah saved queries deta hai'],
      ['Every real application stores its data in a database', 'Har real application apna data database me rakhti hai'],
    ],
    quiz: [
      mcq(
        ['Which problem appears first when a spreadsheet grows large and shared?', 'Spreadsheet bada aur shared hone par sabse pehle kaunsa problem aata hai?'],
        [
          ['The file becomes too colourful', 'File bahut colourful ho jaati hai'],
          ['Data rules are not enforced, so inconsistent entries creep in', 'Data rules enforce nahi hote, isliye inconsistent entries aa jaate hain'],
          ['Charts stop working', 'Charts kaam karna band kar dete hain'],
          ['Rows cannot exceed 100', 'Rows 100 se zyada nahi ho sakti'],
        ],
        1,
        ['No types, no constraints, no relations — duplicated and invalid values silently accumulate.', 'Na types, na constraints, na relations — duplicate aur invalid values chup-chaap jama ho jaate hain.']
      ),
      outputQ(
        'SELECT COUNT(*) FROM students WHERE city = \'Delhi\';',
        ['How many students are from Delhi?', 'Delhi se kitne students hain?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[7]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[50]] } },
          { label: 'C', result: { columns: ['COUNT(*)'], rows: [[8]] } },
          { label: 'D', result: { error: 'Error: no such column: city' } },
        ],
        0,
        ['Delhi has 7 students in this database — the query filters first, then counts.', 'Is database me Delhi ke 7 students hain — query pehle filter karti hai, phir count.']
      ),
      buildQ(
        ['Build a query counting all enrollments', 'Saari enrollments count karne ki query banao'],
        ['FROM', 'enrollments', 'COUNT(*)', 'SELECT'],
        ['SELECT', 'COUNT(*)', 'FROM', 'enrollments'],
        ['SELECT what (the count), FROM where (enrollments).', 'SELECT kya (count), FROM kahan (enrollments).']
      ),
      blanksQ(
        'SELECT city, ___(*) FROM students GROUP ___ city;',
        [
          { options: ['COUNT', 'SUM', 'AVG', 'TOTAL'], correct: 'COUNT' },
          { options: ['BY', 'ON', 'WITH', 'AS'], correct: 'BY' },
        ],
        ['COUNT counts rows per group; GROUP BY forms the groups.', 'COUNT har group ki rows ginta hai; GROUP BY groups banata hai.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The office wants the total number of enrolled records this term. Count all rows in the enrollments table.',
          'Office is term ke total enrolled records jaanna chahti hai. Enrollments table ki saari rows count karo.',
        ],
        sol: 'SELECT COUNT(*) FROM enrollments;',
        hints: [
          ['COUNT(*) counts rows rather than reading them all.', 'COUNT(*) rows ko ginta hai, padhta nahi.'],
          ['SELECT COUNT(*) FROM enrollments;', 'SELECT COUNT(*) FROM enrollments;'],
          ['The answer is 200 rows.', 'Jawab 200 rows hai.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'Attendance planning: how many students does the school have in total? Show a single count.',
          'Attendance planning: school me kul kitne students hain? Ek single count dikhao.',
        ],
        sol: 'SELECT COUNT(*) FROM students;',
        hints: [
          ['Same counting pattern, students table.', 'Wahi counting pattern, students table.'],
          ['SELECT COUNT(*) FROM students;', 'SELECT COUNT(*) FROM students;'],
          ['Expect exactly 50.', 'Exactly 50 expect karo.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'Staffing report: list each city with the number of students living there. Show city and the count.',
          'Staffing report: har city usme rehne wale students ki sankhya ke saath dikhao. City aur count dikhao.',
        ],
        sol: 'SELECT city, COUNT(*) FROM students GROUP BY city;',
        hints: [
          ['One row per city needs GROUP BY.', 'Har city ke liye ek row chahiye — GROUP BY lagao.'],
          ['SELECT city, COUNT(*) FROM students GROUP BY city;', 'SELECT city, COUNT(*) FROM students GROUP BY city;'],
          ['Column names are not checked — the values and their shape are.', 'Column names check nahi honge — values aur unka shape check hota hai.'],
        ],
      }),
      task({
        d: 'hard',
        desc: [
          'The transport department serves only big cities. Show each city that has MORE than 5 students, with its count.',
          'Transport department sirf badi cities ko serve karta hai. Wo har city dikhao jisme 5 se ZYADA students hain, count ke saath.',
        ],
        sol: 'SELECT city, COUNT(*) FROM students GROUP BY city HAVING COUNT(*) > 5;',
        hints: [
          ['Filtering groups (not rows) is HAVING\'s job.', 'Groups filter karna (rows nahi) HAVING ka kaam hai.'],
          ['SELECT city, COUNT(*) FROM students GROUP BY city HAVING COUNT(*) > 5;', 'SELECT city, COUNT(*) FROM students GROUP BY city HAVING COUNT(*) > 5;'],
          ['Row order is not checked — GROUP BY output order may vary.', 'Row order check nahi hota — GROUP BY ka output order alag ho sakta hai.'],
        ],
      }),
      task({
        d: 'very_hard',
        desc: [
          'The principal wants a clean overview: cities with more than 5 students, most students first. Show city, the count, and name the count column "students".',
          'Principal clean overview chahta hai: 5 se zyada students wali cities, sabse zyada students pehle. City, count dikhao aur count column ka naam "students" rakho.',
        ],
        sol: 'SELECT city, COUNT(*) AS students FROM students GROUP BY city HAVING COUNT(*) > 5 ORDER BY students DESC;',
        hints: [
          ['Combine: alias (AS), grouping, HAVING and sorting (ORDER BY … DESC).', 'Combine karo: alias (AS), grouping, HAVING aur sorting (ORDER BY … DESC).'],
          ['SELECT city, COUNT(*) AS students FROM students GROUP BY city HAVING COUNT(*) > 5 ORDER BY students DESC;', 'SELECT city, COUNT(*) AS students FROM students GROUP BY city HAVING COUNT(*) > 5 ORDER BY students DESC;'],
          ['ORDER BY works on the alias too. Row order IS checked here because the task asks for a specific sort.', 'ORDER BY alias par bhi chalta hai. Yahan row order check HOGA kyunki task specific sort maangta hai.'],
        ],
        rules: { ignoreRowOrder: false },
      }),
    ],
  }),

  defineModule({
    n: 3,
    title: ['SQL Syntax Basics', 'SQL Syntax Basics'],
    time: '20 min',
    concepts: ['syntax', 'statement', 'clause', 'case sensitivity', 'semicolon', 'formatting', 'keywords'],
    diagram: 'select-flow',
    objectives: [
      ['Read a SQL statement as clauses rather than a wall of text', 'SQL statement ko wall of text ki jagah clauses ki tarah padhna'],
      ['Apply the formatting conventions professionals use', 'Professionals jo formatting conventions use karte hain unhe lagana'],
      ['Predict when case matters and when it does not', 'Kab case matter karta hai aur kab nahi, yeh predict karna'],
    ],
    theory: [
      section(
        ['Statements and clauses', 'Statements aur clauses'],
        [
          [
            'A SQL statement is one complete instruction ending in a semicolon. Inside it, clauses are the labelled building blocks: SELECT says which columns, FROM says which table, WHERE filters rows, ORDER BY sorts them. Each keyword starts a clause, and clauses have a fixed order — the database rejects a FROM before a SELECT.',
            'SQL statement ek poora instruction hota hai jo semicolon par khatam hota hai. Iske andar clauses labelled building blocks hain: SELECT kaunse columns, FROM kaunsi table, WHERE rows filter karta hai, ORDER BY sort karta hai. Har keyword ek clause shuru karta hai, aur clauses ka fixed order hai — database FROM ko SELECT se pehle hone par reject karta hai.',
          ],
          [
            'Reading SQL becomes easy once you scan for keywords: each one begins a new "phrase" of the sentence. In this module we keep to the two clauses you already know, SELECT and FROM, and focus on writing them cleanly.',
            'Keywords ke liye scan karte hi SQL padhna asaan ho jaata hai: har keyword sentence ka naya "phrase" shuru karta hai. Is module me hum wahi do clauses rakhte hain — SELECT aur FROM — aur unhe saaf-alsaaf likhne par focus karte hain.',
          ],
        ],
        [],
        'select-flow'
      ),
      section(
        ['Case, spaces and semicolons', 'Case, spaces aur semicolons'],
        [
          [
            'Keywords are case-insensitive: select, SELECT and SeLeCt all work. The strong convention is UPPERCASE keywords, lowercase table and column names — it makes queries dramatically easier to scan. Values inside quotes, however, ARE case-sensitive: \'Delhi\' and \'delhi\' are different strings.',
            'Keywords case-insensitive hain: select, SELECT aur SeLeCt sab chalte hain. Strong convention hai — keywords UPPERCASE, table aur column names lowercase — isse queries scan karna kaafi asaan ho jaata hai. Par quotes ke andar values case-SENSITIVE hain: \'Delhi\' aur \'delhi\' alag strings hain.',
          ],
          [
            'Whitespace is free. Newlines and indentation do not change meaning — they change readability. Professionals break long queries into lines, one clause per line, indented. The semicolon is technically optional in SQLite but always written in professional code, because MySQL and PostgreSQL require it.',
            'Whitespace free hai. Newlines aur indentation meaning nahi badalte — readability badalte hain. Professionals lambi queries ko lines me todte hain, ek clause per line, indented. Semicolon SQLite me technically optional hai, par professional code me hamesha likha jaata hai, kyunki MySQL aur PostgreSQL me zaroori hai.',
          ],
        ],
        [
          ['Keywords: case-free, convention UPPERCASE', 'Keywords: case-free, convention UPPERCASE'],
          ['String values in quotes: case matters', 'Quotes me string values: case matter karta hai'],
          ['One clause per line keeps queries readable', 'Ek clause per line queries readable rakhta hai'],
          ['End statements with ; always', 'Statements hamesha ; par khatam karo'],
        ]
      ),
      section(
        ['Formatting like a professional', 'Professional ki tarah formatting'],
        [
          [
            'Compare "select name, city from students where city = \'Delhi\' order by name;" with the same query formatted:\nSELECT name, city\nFROM students\nWHERE city = \'Delhi\'\nORDER BY name;\nThe second reads at a glance: each line answers one question — what, from where, filtered how, sorted how. You will thank yourself in month three when queries reach ten lines.',
            '"select name, city from students where city = \'Delhi\' order by name;" ko same query ke formatted version se compare karo:\nSELECT name, city\nFROM students\nWHERE city = \'Delhi\'\nORDER BY name;\nDoosra ek nazar me padha jaata hai: har line ek sawal ka jawab hai — kya, kahan se, kaise filter, kaise sort. Mahine teen me jab queries das lines tak pahunchengi to aap khud ko thanks kahoge.',
          ],
        ]
      ),
    ],
    tutorial: {
      title: ['Formatting a statement', 'Statement format karna'],
      steps: [
        step(null, [
          'We will write one query two ways and watch the engine treat them identically — readability is for humans.',
          'Hum ek query do tarike se likhenge aur dekhenge ki engine dono ko same treat karti hai — readability insaan ke liye hai.',
        ]),
        step("SELECT name, city FROM students WHERE city = 'Delhi';", [
          'Everything on one line works — the engine only cares about keyword order.',
          'Sab kuch ek line me chalta hai — engine sirf keyword order dekhti hai.',
        ], { table: 'students', highlightWhere: "city = 'Delhi'" }),
        step("SELECT name, city\nFROM students\nWHERE city = 'Delhi';", [
          'Newlines and indentation change nothing for the machine — everything for the reader.',
          'Newlines aur indentation machine ke liye kuch nahi badalte — reader ke liye sab.',
        ], { run: true, table: 'students', highlightWhere: "city = 'Delhi'" }),
        step(null, [
          'Adopt the multi-line habit now: clause per line, keywords in caps, semicolon at the end.',
          'Abhi se multi-line ki aadat banao: clause per line, keywords caps me, end me semicolon.',
        ]),
      ],
    },
    syntax: {
      template: 'SELECT column_list\nFROM table_name\nWHERE condition\nORDER BY column;\n',
      parts: [
        { part: 'SELECT column_list', description: ['Clause 1 — the columns you want', 'Clause 1 — jo columns chahiye'] },
        { part: 'FROM table_name', description: ['Clause 2 — the source table', 'Clause 2 — source table'] },
        { part: 'WHERE condition', description: ['Clause 3 (soon) — row filter', 'Clause 3 (jaldi) — row filter'] },
        { part: 'ORDER BY column', description: ['Clause 4 (soon) — output sort', 'Clause 4 (jaldi) — output sort'] },
        { part: ';', description: ['Statement terminator', 'Statement ka end'] },
      ],
    },
    examples: [
      example('very_easy', 'SELECT name, city FROM students;', [
        'Two columns, comma-separated, in the order you list them.',
        'Do columns, comma-separated, jis order me likhe wahi order.',
      ]),
      example('easy', "select name, city from students where city = 'Delhi';", [
        'Lowercase everywhere still executes — keywords are case-insensitive. The string \'Delhi\' is not.',
        'Poora lowercase bhi chalta hai — keywords case-insensitive hain. String \'Delhi\' nahi hai.',
      ]),
      example('medium', 'SELECT name,\n       age\nFROM students;', [
        'Indentation inside the column list is a common professional touch for long column sets.',
        'Column list ke andar indentation lambi column lists ke liye common professional style hai.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Putting FROM before SELECT', 'FROM ko SELECT se pehle likhna'],
        ['Clauses have a fixed order. The engine reads SELECT first — always keep FROM after it.', 'Clauses ka fixed order hai. Engine pehle SELECT padhti hai — FROM hamesha baad me.']
      ),
      mistake(
        ['Writing WHERE data filters as \'delhi\' and getting zero rows', 'WHERE me \'delhi\' likh kar zero rows milna'],
        ['String comparisons are case-sensitive in SQLite: \'Delhi\' !== \'delhi\'. Keywords are not case-sensitive — values are.', 'SQLite me string comparison case-sensitive hai: \'Delhi\' !== \'delhi\'. Keywords case-insensitive hain — values nahi.']
      ),
      mistake(
        ['Missing commas between columns', 'Columns ke beech comma bhoolna'],
        ['SELECT name city FROM students is legal but means "select name, renamed city"! Commas separate; their absence silently renames.', 'SELECT name city FROM students legal hai par iska matlab "name ko city naam se rename"! Comma separate karta hai; comma na hone par chup-chaap rename ho jaata hai.']
      ),
    ],
    summary: [
      ['Statements end with ; and are built from clauses in a fixed order', 'Statements ; par khatam hote hain aur fixed order me clauses se bante hain'],
      ['Keywords are case-insensitive; string values are not', 'Keywords case-insensitive hain; string values nahi'],
      ['One clause per line is the professional formatting standard', 'Ek clause per line professional formatting standard hai'],
      ['Missing commas can silently rename a column — SQL is literal', 'Comma missing hone par column chup-chaap rename ho sakta hai — SQL literal hai'],
    ],
    quiz: [
      mcq(
        ['Which pair of queries returns identical results?', 'Kaunsi query pair same result deti hai?'],
        [
          ["SELECT name FROM students; and select name from students;", 'SELECT name FROM students; aur select name from students;'],
          ["SELECT NAME FROM students; and SELECT name FROM students WHERE name = 'rahul';", "SELECT NAME FROM students; aur SELECT name FROM students WHERE name = 'rahul';"],
          ["SELECT * FROM students WHERE city = 'delhi'; and SELECT * FROM students WHERE city = 'Delhi';", "SELECT * FROM students WHERE city = 'delhi'; aur SELECT * FROM students WHERE city = 'Delhi';"],
          ['None — every casing changes the result', 'Koi nahi — har casing result badal deti hai'],
        ],
        0,
        ['Keywords ignore case; quoted string values do not. Only the first pair differs solely in keyword case.', 'Keywords case ignore karte hain; quoted string values nahi. Sirf pehla pair sirf keyword case me alag hai.']
      ),
      outputQ(
        "SELECT name FROM students WHERE city = 'delhi';",
        ['What does this query return?', 'Yeh query kya return karti hai?'],
        [
          { label: 'A', result: { columns: ['name'], rows: [['Ritu Sharma'], ['Ananya Chopra'], ['Amit Chopra']] } },
          { label: 'B', result: { columns: ['name'], rows: [] } },
          { label: 'C', result: { error: "Error: near 'delhi': syntax error" } },
          { label: 'D', result: { columns: ['name'], rows: [['Ritu Sharma']] } },
        ],
        1,
        ['The data stores \'Delhi\' with a capital D — the lowercase comparison matches nothing, so zero rows come back (not an error).', 'Data me \'Delhi\' capital D ke saath hai — lowercase comparison kuch match nahi karta, to zero rows milti hain (error nahi).']
      ),
      buildQ(
        ['Build a correctly ordered statement selecting city from teachers', 'Teachers se city select karne ki sahi order wali statement banao'],
        ['FROM', 'teachers', 'SELECT', 'city', ';'],
        ['SELECT', 'city', 'FROM', 'teachers', ';'],
        ['SELECT before FROM, semicolon at the end.', 'SELECT pehle FROM baad, end me semicolon.']
      ),
      blanksQ(
        'SELECT name, city ___ students ___;',
        [
          { options: ['FROM', 'SELECT', 'WHERE', 'JOIN'], correct: 'FROM' },
          { options: [';', '.', '*', 'END'], correct: ';' },
        ],
        ['FROM introduces the table; the semicolon closes the statement.', 'FROM table laya hai; semicolon statement band karta hai.']
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Write the shortest useful statement: show the name column of teachers, ending with a semicolon.',
          'Sabse chota useful statement likho: teachers ka name column dikhao, semicolon ke saath.',
        ],
        sol: 'SELECT name FROM teachers;',
        hints: [
          ['Two clauses: column list and table.', 'Do clauses: column list aur table.'],
          ['SELECT name FROM teachers;', 'SELECT name FROM teachers;'],
          ['The semicolon is optional in SQLite but required here for practice.', 'Semicolon SQLite me optional hai par practice ke liye yahan zaroori hai.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'Prove case-insensitivity of keywords yourself: write the same teachers-name query using all lowercase keywords (string values would still be case-sensitive).',
          'Keywords ki case-insensitivity khud prove karo: same teachers-name query ko sab lowercase keywords se likho (string values ab bhi case-sensitive rehti hain).',
        ],
        sol: 'select name from teachers;',
        hints: [
          ['Keywords can be lowercase; the engine does not care.', 'Keywords lowercase ho sakte hain; engine ko farak nahi padta.'],
          ['select name from teachers;', 'select name from teachers;'],
          ['Output validation ignores column-name casing too — your values must match.', 'Output validation column-name casing ignore karti hai — values match honi chahiye.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'Format like a pro: show students\' name and city, each clause on its own line (SELECT on the first, FROM on the second), ending with a semicolon.',
          'Pro ki tarah format karo: students ka name aur city dikhao, har clause apni line par (SELECT pehli line, FROM doosri), semicolon ke saath khatam.',
        ],
        sol: 'SELECT name, city\nFROM students;',
        hints: [
          ['Newlines do not change execution — only readability.', 'Newlines execution nahi badalte — sirf readability.'],
          ['SELECT name, city\\nFROM students;', 'SELECT name, city\\nFROM students;'],
          ['Press Enter between clauses; the console keeps your formatting.', 'Clauses ke beech Enter dabao; console aapka formatting rakhta hai.'],
        ],
      }),
      task({
        d: 'hard',
        desc: [
          'The registry needs teacher ids and names, one clause per line, semicolon included. Show both columns.',
          'Registry ko teacher ids aur names chahiye, ek clause per line, semicolon ke saath. Dono columns dikhao.',
        ],
        sol: 'SELECT id, name\nFROM teachers;',
        hints: [
          ['Column order defines output column order — id first.', 'Column order output ka column order decide karta hai — id pehle.'],
          ['SELECT id, name\\nFROM teachers;', 'SELECT id, name\\nFROM teachers;'],
          ['Commas separate columns; forgetting one changes the meaning entirely.', 'Comma columns ko separate karta hai; bhoolne par matlab hi badal jaata hai.'],
        ],
      }),
      task({
        d: 'very_hard',
        desc: [
          'Full professional style, still only two clauses: show course id, name and credits — one column list line, one FROM line, indented continuation, ending in ;. (Any consistent multi-line layout passes.)',
          'Poora professional style, abhi bhi do clauses: course ka id, name aur credits dikhao — ek column list line, ek FROM line, indented continuation, ; par khatam. (Koi bhi consistent multi-line layout chalega.)',
        ],
        sol: 'SELECT id,\n       name,\n       credits\nFROM courses;',
        hints: [
          ['Long column lists wrap with indentation under SELECT.', 'Lambi column lists SELECT ke neeche indentation ke saath aati hain.'],
          ['SELECT id,\\n       name,\\n       credits\\nFROM courses;', 'SELECT id,\\n       name,\\n       credits\\nFROM courses;'],
          ['The result grid is identical to the one-line version — that is the whole point of formatting.', 'Result grid one-line version jaisi hi hai — yahi formatting ka poora point hai.'],
        ],
      }),
    ],
  }),
];
