'use client';

// Modules 53-56: Transactions · ACID Properties · Triggers · Query Optimization

import { defineModule, section, step, example, mistake, mcq, outputQ, buildQ, blanksQ, task } from './builder';
import type { Module } from '@/types/content';

export const modules: Module[] = [
  defineModule({
    n: 53,
    title: ['Transactions', 'Transactions'],
    time: '25 min',
    concepts: ['transaction', 'begin', 'commit', 'rollback', 'atomicity', 'all or nothing'],
    diagram: 'transaction',
    objectives: [
      ['Group statements into all-or-nothing transactions', 'Statements ko all-or-nothing transactions me group karna'],
      ['Undo mistakes with ROLLBACK', 'ROLLBACK se galtiyon ko wapas lena'],
      ['Know when updates must be atomic', 'Jaanna kab updates atomic hone chahiye'],
    ],
    theory: [
      section(
        ['All or nothing', 'Sab ya kuch nahi'],
        [
          [
            'Move 5000 rupees: UPDATE account SET balance = balance − 5000 WHERE id = 1; then UPDATE account SET balance = balance + 5000 WHERE id = 2. If the power dies between the two statements, money vanishes — half a transfer. A transaction wraps both statements so they succeed TOGETHER or leave the database UNTOUCHED: BEGIN; …; COMMIT; — or ROLLBACK to abandon.',
            '5000 rupaye transfer: UPDATE account SET balance = balance − 5000 WHERE id = 1; phir UPDATE account SET balance = balance + 5000 WHERE id = 2. Beech me bijli chale jaye to paisa gayab — aadha transfer. Transaction dono statements ko aise wrap karta hai ki wo SAATH safal hon ya database KO HAATH BHI NA LAGE: BEGIN; …; COMMIT; — ya ROLLBACK se chhod do.',
          ],
          [
            'That is atomicity in practice — the first letter of ACID (next module formalises all four). Multi-step business rules — order + payment + stock decrement, or a multi-row update — are only correct inside a transaction. Autocommit (SQLite\'s default) wraps each single statement; you graduate to explicit BEGIN the moment two statements must agree.',
            'Wahi atomicity ka practical roop — ACID ka pehla akshar (agla module chaaron ko formal karta hai). Multi-step business rules — order + payment + stock kam hona, ya multi-row update — transaction ke andar hi sahi hote hain. Autocommit (SQLite ka default) har akela statement wrap karta hai; do statements ke agree karne ki zaroorat hi hai to aap explicit BEGIN tak graduate ho jaate hain.',
          ],
        ],
        [],
        'transaction'
      ),
      section(
        ['The recovery superpower', 'Recovery ka superpower'],
        [
          [
            'ROLLBACK is also your safety net while experimenting: BEGIN; make risky UPDATEs; inspect; and if anything looks wrong — ROLLBACK — the database is exactly as before. That fearless-but-safe workflow is how professionals explore production-like data. Sandbox mode in this platform gives you the same freedom with the Reset button.',
            'ROLLBACK aapka safety net bhi hai jab aap experiment karte hain: BEGIN; risky UPDATEs karo; jaancho; aur kuch galat lage — ROLLBACK — database bilkul pehle jaisi. Yeh nirbhay-par-safe workflow professionals isi tarah production jaise data par explore karte hain. Is platform ka Sandbox mode aapko Reset button ke saath wahi azaadi deta hai.',
          ],
          [
            'Rules of thumb: transactions as SHORT as possible (long ones hold locks in multi-user engines); never leave one open dangling (COMMIT or ROLLBACK before the session ends); and group by BUSINESS meaning — "the transfer", "the order" — not arbitrary statement counts.',
            'Rules of thumb: transactions jitne HO sake utne chhote (lambi wale multi-user engines me locks pakde rehte hain); kabhi khula nahi chhodо (session khatam hone se pehle COMMIT ya ROLLBACK); aur BUSINESS matlab se group karo — "transfer", "order" — statement ginti se nahi.',
          ],
        ],
        [
          ['BEGIN … COMMIT: all or nothing', 'BEGIN … COMMIT: sab ya kuch nahi'],
          ['ROLLBACK: revert to the savepoint-free state', 'ROLLBACK: pehle ki state par wapas'],
          ['Short, business-meaningful transactions', 'Chhote, business-matlab wale transactions'],
        ]
      ),
    ],
    tutorial: {
      title: ['A safe transfer', 'Safe transfer'],
      steps: [
        step(null, [
          'We will stage a payment correction inside a transaction, verify it, and then deliberately roll it back.',
          'Hum ek payment correction transaction me stage karenge, verify karenge, aur phir jaan-boojh kar rollback karenge.',
        ]),
        step('SELECT id, amount FROM payments WHERE id = 1;', [
          'The "before" state — a payment we are about to adjust.',
          '"Pehle" ki state — ek payment jo hum theek karne wale hain.',
        ], { table: 'payments' }),
        step('BEGIN;\nUPDATE payments SET amount = amount + 1 WHERE id = 1;\nSELECT id, amount FROM payments WHERE id = 1;', [
          'Inside the transaction: the change is visible to us but not yet permanent.',
          'Transaction ke andar: change humein dikhta hai par abhi permanent nahi hai.',
        ], { table: 'payments' }),
        step('ROLLBACK;\nSELECT id, amount FROM payments WHERE id = 1;', [
          'Rollback: the database is exactly as it was — the experiment never happened.',
          'Rollback: database bilkul pehle jaisi — experiment hua hi nahi.',
        ], { table: 'payments' }),
        step('BEGIN;\nUPDATE payments SET amount = amount WHERE id = 1;\nCOMMIT;\nSELECT id, amount FROM payments WHERE id = 1;', [
          'The full cycle: begin, change (a no-op here), commit — permanent and consistent.',
          'Poora chakkar: begin, change (yahan no-op), commit — permanent aur consistent.',
        ], { run: true, table: 'payments' }),
      ],
    },
    syntax: {
      template: 'BEGIN;\nUPDATE …;\nUPDATE …;\n[inspect …]\nCOMMIT;   -- or ROLLBACK;',
      parts: [
        { part: 'BEGIN', description: ['Opens the transaction', 'Transaction kholta hai'] },
        { part: 'COMMIT', description: ['Makes all changes permanent', 'Saare changes permanent karta hai'] },
        { part: 'ROLLBACK', description: ['Discards all changes', 'Saare changes phenk deta hai'] },
      ],
    },
    examples: [
      example('very_easy', 'BEGIN;\nUPDATE payments SET amount = amount WHERE id = 1;\nCOMMIT;', [
        'The minimal honest transaction: open, change, close.',
        'Sabse chhota imandaar transaction: kholo, badlo, band karo.',
      ]),
      example('easy', 'BEGIN;\nUPDATE payments SET amount = amount + 100 WHERE id = 2;\nSELECT amount FROM payments WHERE id = 2;\nROLLBACK;', [
        'Stage a change, inspect, and discard — the fearless exploration pattern.',
        'Change stage karo, jaancho, aur phenk do — nirbhay exploration pattern.',
      ]),
      example('medium', 'BEGIN;\nUPDATE orders SET status = \'processing\' WHERE id = 1;\nUPDATE shipping SET shipping_status = \'packed\' WHERE order_id = 1;\nCOMMIT;', [
        'Two tables, one business fact ("order 1 moved forward") — atomic together.',
        'Do tables, ek business fact ("order 1 aage badha") — saath atomic. (Advanced dataset for shipping.)',
      ]),
      example('hard', 'BEGIN;\nDELETE FROM order_items WHERE order_id = 500;\nDELETE FROM payments WHERE order_id = 500;\nDELETE FROM orders WHERE id = 500;\nROLLBACK;', [
        'The multi-table delete you WOULD wrap in a transaction — demonstrated with rollback so nothing is truly lost.',
        'Wo multi-table delete jo aap transaction me WRAP karte — rollback ke saath dikhaya taaki kuch asli me na jaye.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Forgetting COMMIT and wondering why data "did not save"', 'COMMIT bhoolna aur data "save kyun nahi hua" sochna'],
        ['Until COMMIT, everything lives in the transaction. Close every BEGIN — engine restarts roll back open transactions by design.', 'COMMIT tak sab transaction me rehta hai. Har BEGIN band karo — engine restart khule transactions ko design ke hisaab se rollback karta hai.']
      ),
      mistake(
        ['Long transactions holding locks', 'Lambi transactions locks pakde rakhna'],
        ['While SQLite serialises writers anyway, server engines (Postgres, MySQL) block others on held locks. Keep transactions to the business step, nothing more.', 'SQLite waise bhi writers ko serialise karta hai, par server engines (Postgres, MySQL) pakde locks par doosron ko rok dete hain. Transaction ko business step tak simit rakho, usse zyada nahi.']
      ),
      mistake(
        ['Believing ROLLBACK undoes a COMMIT', 'Yeh maanna ki ROLLBACK, COMMIT ko wapas le leta hai'],
        ['COMMIT is the point of no return. Rollback works only on un-committed work. That is the entire deal.', 'COMMIT wapas-i-ke-na-da point hai. Rollback sirf un-committed kaam par chalta hai. Sauda yahi hai.']
      ),
    ],
    summary: [
      ['Transactions make multi-statement changes atomic', 'Transactions multi-statement changes atomic banate hain'],
      ['BEGIN … COMMIT persists; ROLLBACK restores', 'BEGIN … COMMIT bachata hai; ROLLBACK wapas laata hai'],
      ['COMMIT is the point of no return', 'COMMIT wapas-i-ke-na-da point hai'],
      ['Short, business-scoped transactions are the habit', 'Chhote, business-scoped transactions hi aadat hai'],
    ],
    quiz: [
      mcq(
        ['What happens to an open transaction when the application crashes before COMMIT?', 'COMMIT se pehle application crash ho to khula transaction kya hota hai?'],
        [
          ['The changes are saved anyway', 'Changes phir bhi save ho jaate hain'],
          ['The transaction is rolled back — the database is unchanged', 'Transaction rollback ho jaata hai — database unchanged'],
          ['The database is corrupted', 'Database corrupt ho jaati hai'],
          ['Only the first statement is kept', 'Sirf pehla statement rakha jaata hai'],
        ],
        1,
        ['Uncommitted work is discarded on crash — atomicity\'s whole point: never half-done.', 'Uncommitted kaam crash par phenk diya jaata hai — atomicity ka poora point: kabhi aadha-adhura nahi.']
      ),
      outputQ(
        'BEGIN;\nUPDATE payments SET amount = 999999 WHERE id = 3;\nROLLBACK;\nSELECT amount FROM payments WHERE id = 3;',
        ['What does the final SELECT show?', 'Aakhri SELECT kya dikhata hai?'],
        [
          { label: 'A', result: { columns: ['amount'], rows: [[999999]] } },
          { label: 'B', result: { columns: ['amount'], rows: [[224132.1]] } },
          { label: 'C', result: { columns: ['amount'], rows: [[0]] } },
          { label: 'D', result: { error: 'Error: cannot rollback - no transaction is active' } },
        ],
        1,
        ['The update was staged then rolled back — the original amount (224132.1) survives.', 'Update stage hua phir rollback hua — original amount (224132.1) bacha rehta hai.']
      ),
      buildQ(
        ['Build: a staged-and-discarded update', 'Banao: staged-aur-phenka gaya update'],
        ['BEGIN', 'UPDATE', 'payments', 'SET', 'amount = amount', 'WHERE', 'id = 1', 'ROLLBACK', ';'],
        ['BEGIN', ';', 'UPDATE', 'payments', 'SET', 'amount', '=', 'amount', 'WHERE', 'id', '=', '1', ';', 'ROLLBACK', ';'],
        ['BEGIN, update, ROLLBACK — nothing changes.', 'BEGIN, update, ROLLBACK — kuch nahi badalta.']
      ),
      blanksQ(
        '___; UPDATE t SET x = 1; ___;',
        [
          { options: ['BEGIN', 'START', 'OPEN'], correct: 'BEGIN' },
          { options: ['COMMIT', 'SAVE', 'END'], correct: 'COMMIT' },
        ],
        ['BEGIN opens; COMMIT (or ROLLBACK) closes.', 'BEGIN kholta hai; COMMIT (ya ROLLBACK) band karta hai.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The safe no-op: BEGIN; a self-assignment update on payments (id 1, amount = amount); COMMIT; — proving the cycle end to end.',
          'Safe no-op: BEGIN; payments par self-assignment update (id 1, amount = amount); COMMIT; — poora chakkar saabit karte hue.',
        ],
        sol: 'BEGIN;\nUPDATE payments SET amount = amount WHERE id = 1;\nCOMMIT;\nSELECT id, amount FROM payments WHERE id = 1;',
        hints: [
          ['Open, change, close — then verify.', 'Open, change, close — then verify.'],
          ['Kholo, badlo, band karo — phir verify.', 'Kholo, badlo, band karo — phir verify.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: 'SELECT id, amount FROM payments WHERE id = 1',
      }),
      task({
        d: 'easy',
        desc: [
          'The fearless experiment: BEGIN; UPDATE payments SET amount = amount * 2 WHERE id = 5; view it; ROLLBACK; then SELECT id, amount — back to the original value.',
          'Nirbhay experiment: BEGIN; UPDATE payments SET amount = amount * 2 WHERE id = 5; dekho; ROLLBACK; phir SELECT id, amount — original value par wapas.',
        ],
        sol: 'BEGIN;\nUPDATE payments SET amount = amount * 2 WHERE id = 5;\nSELECT id, amount FROM payments WHERE id = 5;\nROLLBACK;\nSELECT id, amount FROM payments WHERE id = 5;',
        hints: [
          ['The doubled value lives only until ROLLBACK.', 'The doubled value lives only until ROLLBACK.'],
          ['Doubled value ROLLBACK tak hi jeeti hai.', 'Doubled value ROLLBACK tak hi jeeti hai.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: 'SELECT id, amount FROM payments WHERE id = 5',
      }),
      task({
        d: 'medium',
        desc: [
          'The atomic pair: inside one transaction, UPDATE order 1\'s status to \'processing\' (orders table) and pack its shipment (UPDATE shipping SET shipping_status = \'packed\' WHERE order_id = 1) — then COMMIT. Verify order 1\'s status.',
          'Atomic jodi: ek transaction ke andar order 1 ka status \'processing\' (orders table) aur uski shipment pack karo (UPDATE shipping SET shipping_status = \'packed\' WHERE order_id = 1) — phir COMMIT. Order 1 ka status verify karo.',
        ],
        sol: "BEGIN;\nUPDATE orders SET status = 'processing' WHERE id = 1;\nUPDATE shipping SET shipping_status = 'packed' WHERE order_id = 1;\nCOMMIT;\nSELECT status FROM orders WHERE id = 1;",
        hints: [
          ['Both updates, one BEGIN…COMMIT shell.', 'Dono updates, ek BEGIN…COMMIT shell.'],
          ['Open, change, change, close — then verify.', 'Kholo, badlo, badlo, band karo — phir verify.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: "SELECT status FROM orders WHERE id = 1",
      }),
      task({
        d: 'hard',
        desc: [
          'The aborted cleanup: BEGIN; delete order 500 with its items and payment (three DELETEs); ROLLBACK; — then prove order 500 still exists (SELECT id FROM orders WHERE id = 500).',
          'Aborted cleanup: BEGIN; order 500 uske items aur payment ke saath delete karo (teen DELETEs); ROLLBACK; — phir saabit karo ki order 500 ab bhi zinda hai (SELECT id FROM orders WHERE id = 500).',
        ],
        sol: 'BEGIN;\nDELETE FROM order_items WHERE order_id = 500;\nDELETE FROM payments WHERE order_id = 500;\nDELETE FROM orders WHERE id = 500;\nROLLBACK;\nSELECT id FROM orders WHERE id = 500;',
        hints: [
          ['The staged deletes vanish on ROLLBACK.', 'The staged deletes vanish on ROLLBACK.'],
          ['Stage hue deletes ROLLBACK par gayab.', 'Stage hue deletes ROLLBACK par gayab.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: 'SELECT id FROM orders WHERE id = 500',
      }),
      task({
        d: 'very_hard',
        desc: [
          'The business rule engine: in ONE transaction, set all \'pending\' orders to \'processing\' (orders table), and insert one audit row into a new audit_log table you create first: CREATE TABLE IF NOT EXISTS audit_log (id INTEGER PRIMARY KEY, note TEXT, at DATETIME DEFAULT CURRENT_TIMESTAMP); INSERT INTO audit_log (note) VALUES (\'batch: pending to processing\'); — then COMMIT. Verify the count of processing orders.',
          'Business rule engine: EK transaction me saare \'pending\' orders \'processing\' karo (orders table), aur pehle banao naye audit_log table me ek audit row dalo: CREATE TABLE IF NOT EXISTS audit_log (id INTEGER PRIMARY KEY, note TEXT, at DATETIME DEFAULT CURRENT_TIMESTAMP); INSERT INTO audit_log (note) VALUES (\'batch: pending to processing\'); — phir COMMIT. Processing orders ki ginti verify karo.',
        ],
        sol: "CREATE TABLE IF NOT EXISTS audit_log (id INTEGER PRIMARY KEY, note TEXT, at DATETIME DEFAULT CURRENT_TIMESTAMP);\nBEGIN;\nUPDATE orders SET status = 'processing' WHERE status = 'pending';\nINSERT INTO audit_log (note) VALUES ('batch: pending to processing');\nCOMMIT;\nSELECT COUNT(*) AS processing_orders FROM orders WHERE status = 'processing';",
        hints: [
          ['Table creation OUTSIDE the transaction; the business pair INSIDE it.', 'Table creation OUTSIDE the transaction; the business pair INSIDE it.'],
          ['Table banana transaction se BAHAR; business jodi ANDAR.', 'Table banana transaction se BAHAR; business jodi ANDAR.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: "SELECT COUNT(*) AS processing_orders FROM orders WHERE status = 'processing'",
      }),
    ],
  }),

  defineModule({
    n: 54,
    title: ['ACID Properties', 'ACID Properties'],
    time: '25 min',
    concepts: ['acid', 'atomicity', 'consistency', 'isolation', 'durability', 'concurrency', 'theory'],
    diagram: 'acid',
    objectives: [
      ['Explain all four ACID guarantees', 'Chaaron ACID guarantees samajhna'],
      ['Connect each property to a real failure it prevents', 'Har property ko us failure se jodna jo wo rokta hai'],
      ['Discuss SQLite\'s specific ACID behaviour', 'SQLite ke khaas ACID behaviour par baat karna'],
    ],
    theory: [
      section(
        ['The contract of a reliable database', 'Bharosemand database ka contract'],
        [
          [
            'ACID is the four-word contract every serious database signs: Atomicity (all or nothing — crash mid-transfer leaves no half-state), Consistency (rules always hold — constraints, foreign keys, checks never get violated, whatever happens), Isolation (concurrent users feel alone — one transaction cannot see another\'s half-done work), Durability (COMMIT survives anything — power loss, crash, restart; committed data is fact).',
            'ACID har serious database ke chaar-shabd ka contract hai: Atomicity (sab ya kuch nahi — crash aadhe transfer par koi aadha-state nahi chhodta), Consistency (rules hamesva lagu — constraints, foreign keys, checks kabhi toot nahi sakte, kuch bhi ho), Isolation (saath chal rahe users akela mehsus karte hain — ek transaction doosre ka aadha kaam nahi dekh sakta), Durability (COMMIT sab jhel leta hai — power loss, crash, restart; committed data fact hai).',
          ],
          [
            'These are not academic letters — each maps to a disaster you have personally met: double-charged cards (atomicity), broken references (consistency), one clerk overwriting another\'s edit (isolation), "where did my save go" (durability). Databases are trustworthy precisely because they answer all four.',
            'Ye academic akshar nahi hain — har ek us aafat se juda hai jo aap khud dekh chuke hain: do baar kaat gaya card (atomicity), toote references (consistency), ek clerk ka doosre ke edit ko dhak dena (isolation), "mera save kahan gaya" (durability). Databases bharosemand isi liye hain ki wo chaaron ka jawab rakhte hain.',
          ],
        ],
        [],
        'acid'
      ),
      section(
        ['How SQLite delivers each', 'SQLite har ek kaise deta hai'],
        [
          [
            'Atomicity + Durability: SQLite writes changes to a journal (rollback or WAL) BEFORE touching the main file — crash mid-write and the journal undoes or completes the change on next open. Isolation: SQLite locks the whole database per writer — serialised, simple, and honest; writers queue, readers (in WAL mode) never block. Consistency: your constraints (PRIMARY KEY, FOREIGN KEY, CHECK, UNIQUE) are enforced at statement and commit time.',
            'Atomicity + Durability: SQLite changes ko journal (rollback ya WAL) me PEHLE likhta hai — file ko chhune se pehle — beech me crash ho to journal agli baar kholte hi change ko wapas le leta hai ya poora kar deta hai. Isolation: SQLite har writer ke liye poori database lock karta hai — serialised, simple, imandaar; writers line me lagte hain, readers (WAL mode me) kabhi nahi rukte. Consistency: aapke constraints (PRIMARY KEY, FOREIGN KEY, CHECK, UNIQUE) statement aur commit time par enforce hote hain.',
          ],
          [
            'Server engines add nuance (MVCC, isolation levels like READ COMMITTED / SERIALIZABLE, savepoints) — the vocabulary changes, the contract does not. Learn it here once; recognise it everywhere forever.',
            'Server engines nuance jodte hain (MVCC, isolation levels jaise READ COMMITTED / SERIALIZABLE, savepoints) — shabdon badalte hain, contract nahi. Yahan ek baar seekhо; har jagah hamesha ke liye pehchanо.',
          ],
        ],
        [
          ['A — all or nothing', 'A — sab ya kuch nahi'],
          ['C — rules never broken', 'C — rules kabhi nahi tootte'],
          ['I — concurrent work feels sequential', 'I — saath kaam karta hua bhi sequential lagta hai'],
          ['D — committed means permanent', 'D — committed matlab permanent'],
        ]
      ),
    ],
    tutorial: {
      title: ['Feeling each letter', 'Har akshar ko mehsoos karna'],
      steps: [
        step(null, [
          'Four mini-demonstrations, one per letter — theory you can run.',
          'Chaar mini-demonstrations, har akshar ki ek — theory jo aap chala sakte ho.',
        ]),
        step('BEGIN;\nUPDATE payments SET amount = amount * 10 WHERE id = 7;\nROLLBACK;\nSELECT amount FROM payments WHERE id = 7;', [
          'A — Atomicity: the 10× change never escaped the rollback.',
          'A — Atomicity: 10× wala change rollback se bahar hi nahi nikla.',
        ], { table: 'payments' }),
        step('PRAGMA foreign_keys = ON;\nINSERT INTO orders (id, customer_id, order_date, status) VALUES (999, 9999, \'2023-06-01\', \'pending\');', [
          'C — Consistency: customer 9999 does not exist — the foreign key rejects the insert.',
          'C — Consistency: customer 9999 exist nahi karta — foreign key insert reject karta hai.',
        ], { table: 'orders' }),
        step('BEGIN;\nUPDATE orders SET status = \'processing\' WHERE id = 2;\nSELECT status FROM orders WHERE id = 2;\nROLLBACK;', [
          'I — Isolation (single-user flavour): until COMMIT, no other reader sees this — your session sees its own work only.',
          'I — Isolation (single-user flavour): COMMIT tak koi doosra reader ise nahi dekhta — aapka session sirf apna kaam dekhta hai.',
        ], { table: 'orders' }),
        step('BEGIN;\nUPDATE orders SET status = status WHERE id = 3;\nCOMMIT;\nSELECT status FROM orders WHERE id = 3;', [
          'D — Durability: COMMIT returns only when the journal guarantees survival. After this, the fact is permanent.',
          'D — Durability: COMMIT tabhi wapas aata hai jab journal survival guarantee kare. Iske baad fact permanent hai.',
        ], { run: true, table: 'orders' }),
      ],
    },
    syntax: {
      template: '-- ACID is behaviour, not syntax — demonstrated through:\nBEGIN; …; COMMIT | ROLLBACK;\nPRAGMA foreign_keys = ON;   -- C enforcement\n-- journals (WAL/rollback)  -- A + D engine internals',
      parts: [
        { part: 'A', description: ['BEGIN…ROLLBACK leaves zero trace', 'BEGIN…ROLLBACK ka zero nishaan'] },
        { part: 'C', description: ['Constraints reject bad writes', 'Constraints galat writes reject karte hain'] },
        { part: 'I', description: ['Uncommitted work invisible to others', 'Uncommitted kaam doosron ko invisible'] },
        { part: 'D', description: ['COMMIT survives crashes via journal', 'COMMIT journal se crash bacha leta hai'] },
      ],
    },
    examples: [
      example('very_easy', 'BEGIN;\nUPDATE customers SET name = name WHERE id = 1;\nCOMMIT;', [
        'A durable no-op — the commit cycle, complete.',
        'Durable no-op — commit ka chakkar, poora.',
      ]),
      example('easy', "INSERT INTO orders (id, customer_id, order_date, status) VALUES (9999, 4242, '2023-01-01', 'pending');", [
        'Consistency in action: customer 4242 missing — insert rejected (foreign key).',
        'Consistency kaam par: customer 4242 missing — insert reject (foreign key).',
      ]),
      example('medium', 'BEGIN;\nUPDATE products SET price = -5 WHERE id = 1;\nCOMMIT;', [
        'CHECK-style consistency: negative price must be rejected by a well-designed schema.',
        'CHECK-style consistency: negative price achhe design wale schema me reject hona chahiye.',
      ]),
      example('hard', 'BEGIN;\nUPDATE order_items SET quantity = 99 WHERE order_id = 500 AND product_id = 75;\nSELECT quantity FROM order_items WHERE order_id = 500;\nROLLBACK;\nSELECT quantity FROM order_items WHERE order_id = 500;', [
        'Atomic isolation demo: staged change visible inside, gone after rollback.',
        'Atomic isolation demo: staged change andar dikhta, rollback ke baad gayab.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Confusing consistency with correctness of your query', 'Consistency ko aapki query ki correctness se confusion'],
        ['Consistency is the DATABASE keeping its own rules (constraints, types, referential integrity) — your query can still be logically wrong while perfectly consistent.', 'Consistency DATABASE apne rules rakhna hai (constraints, types, referential integrity) — aapki query consistent rehte hue bhi logically galat ho sakti hai.']
      ),
      mistake(
        ['Believing durability means "saved to disk immediately"', 'Durability ka matlab "turant disk par save" maan lena'],
        ['Durability means the COMMIT guarantees recovery — via journal/fsync mechanics — not that you physically watched bytes hit platters.', 'Durability ka matlab COMMIT recovery guarantee karta hai — journal/fsync mechanics se — ye nahi ki aapne bytes ko disk par jaate dekha.']
      ),
      mistake(
        ['Assuming isolation means parallel speedup', 'Isolation ka matlab parallel speedup maan lena'],
        ['Isolation is about CORRECTNESS under concurrency, not speed. SQLite serialises writers; server engines use MVCC — both deliver isolation, differently priced.', 'Isolation concurrency ke neeche CORRECTNESS hai, speed nahi. SQLite writers serialise karta hai; server engines MVCC — dono isolation dete hain, alag daam par.']
      ),
    ],
    summary: [
      ['ACID: Atomicity, Consistency, Isolation, Durability', 'ACID: Atomicity, Consistency, Isolation, Durability'],
      ['Each letter prevents a specific real-world disaster', 'Har akshar ek khaas asli-duniya aafat rokta hai'],
      ['SQLite: journaling for A+D, whole-db locking for I, constraints for C', 'SQLite: A+D ke liye journaling, I ke liye whole-db locking, C ke liye constraints'],
      ['The contract transfers to every engine you will meet', 'Yeh contract har engine tak transfer hota hai jo aapse milega'],
    ],
    quiz: [
      mcq(
        ['A crash happens between two UPDATEs inside a transaction. What does the database show after restart?', 'Transaction ke andar do UPDATEs ke beech crash ho. Restart ke baad database kya dikhata hai?'],
        [
          ['Both updates applied', 'Dono updates applied'],
          ['Only the first update', 'Sirf pehla update'],
          ['Neither update — the transaction was never committed', 'Koi update nahi — transaction kabhi commit hua hi nahi'],
          ['The database refuses to open', 'Database khulna mana kar deta hai'],
        ],
        2,
        ['Atomicity: uncommitted multi-statement work vanishes completely on crash.', 'Atomicity: uncommitted multi-statement kaam crash par poora gayab ho jaata hai.']
      ),
      outputQ(
        'BEGIN;\nUPDATE payments SET amount = amount + 50 WHERE id = 10;\nROLLBACK;\nSELECT amount FROM payments WHERE id = 10;',
        ['What amount shows after the rollback?', 'Rollback ke baad kaunsa amount dikhta hai?'],
        [
          { label: 'A', result: { columns: ['amount'], rows: [[9393.7]] } },
          { label: 'B', result: { columns: ['amount'], rows: [[65050]] } },
          { label: 'C', result: { columns: ['amount'], rows: [[50]] } },
          { label: 'D', result: { error: 'Error: cannot start a transaction within a transaction' } },
        ],
        0,
        ['The +50 was staged and rolled back — the original amount (9393.7) stands.', '+50 stage hua aur rollback hua — original amount (9393.7) khada hai.']
      ),
      buildQ(
        ['Build: the atomicity demo (update then rollback)', 'Banao: atomicity demo (update phir rollback)'],
        ['BEGIN', 'UPDATE', 'customers', 'SET', 'name = name', 'WHERE', 'id = 1', 'ROLLBACK'],
        ['BEGIN', ';', 'UPDATE', 'customers', 'SET', 'name', '=', 'name', 'WHERE', 'id', '=', '1', ';', 'ROLLBACK', ';'],
        ['Begin, stage, roll back — atomicity felt.', 'Begin, stage, roll back — atomicity mehsoos.']
      ),
      blanksQ(
        '___ means all-or-nothing; ___ means committed data survives crashes.',
        [
          { options: ['Atomicity', 'Isolation', 'Consistency'], correct: 'Atomicity' },
          { options: ['Durability', 'Atomicity', 'Isolation'], correct: 'Durability' },
        ],
        ['A for all-or-nothing; D for committed-forever.', 'A matlab sab-ya-kuch-nahi; D matlab committed-hamesha.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'Atomicity demo: BEGIN; double payment 8\'s amount; ROLLBACK; verify the original survives (id, amount).',
          'Atomicity demo: BEGIN; payment 8 ka amount double karo; ROLLBACK; original bacha verify karo (id, amount).',
        ],
        sol: 'BEGIN;\nUPDATE payments SET amount = amount * 2 WHERE id = 8;\nROLLBACK;\nSELECT id, amount FROM payments WHERE id = 8;',
        hints: [
          ['Stage, discard, verify.', 'Stage, discard, verify.'],
          ['Stage karo, phenko, verify karo.', 'Stage karo, phenko, verify karo.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: 'SELECT id, amount FROM payments WHERE id = 8',
      }),
      task({
        d: 'easy',
        desc: [
          'Consistency demo: attempt INSERT INTO orders (id, customer_id, order_date, status) VALUES (9999, 4242, \'2023-01-01\', \'pending\') — expect a foreign-key rejection (customer 4242 does not exist); then show order 9999 does not exist.',
          'Consistency demo: INSERT INTO orders (id, customer_id, order_date, status) VALUES (9999, 4242, \'2023-01-01\', \'pending\') try karo — foreign-key rejection expect karo (customer 4242 nahi hai); phir dikhao ki order 9999 bhi nahi bana.',
        ],
        sol: "INSERT INTO orders (id, customer_id, order_date, status) VALUES (9999, 4242, '2023-01-01', 'pending');\nSELECT COUNT(*) AS n FROM orders WHERE id = 9999;",
        hints: [
          ['The constraint guards referential integrity — rejected inserts leave no trace.', 'The constraint guards referential integrity — rejected inserts leave no trace.'],
          ['Constraint referential integrity bachata hai — reject hua insert ka nishaan nahi chhodta.', 'Constraint referential integrity bachata hai — reject hua insert ka nishaan nahi chhodta.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: 'SELECT COUNT(*) AS n FROM orders WHERE id = 9999',
      }),
      task({
        d: 'medium',
        desc: [
          'Isolation flavour: BEGIN; UPDATE order 4 status to \'processing\'; SELECT it (you see it); ROLLBACK; SELECT again (the old status is back).',
          'Isolation flavour: BEGIN; order 4 ka status \'processing\' karo; SELECT karo (aapko dikhta hai); ROLLBACK; phir SELECT (purana status wapas).',
        ],
        sol: "BEGIN;\nUPDATE orders SET status = 'processing' WHERE id = 4;\nSELECT status FROM orders WHERE id = 4;\nROLLBACK;\nSELECT status FROM orders WHERE id = 4;",
        hints: [
          ['Inside the transaction you see your own staged change.', 'Inside the transaction you see your own staged change.'],
          ['Transaction ke andar aap apna hi staged change dekhte ho.', 'Transaction ke andar aap apna hi staged change dekhte ho.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: 'SELECT status FROM orders WHERE id = 4',
      }),
      task({
        d: 'hard',
        desc: [
          'Durability commitment: BEGIN; a real (but harmless) update — set customer 1\'s name to its own value; COMMIT; verify by selecting the row (id, name).',
          'Durability commitment: BEGIN; ek asli (par bekaar) update — customer 1 ka naam usi value par set karo; COMMIT; row select karke verify karo (id, name).',
        ],
        sol: "BEGIN;\nUPDATE customers SET name = name WHERE id = 1;\nCOMMIT;\nSELECT id, name FROM customers WHERE id = 1;",
        hints: [
          ['COMMIT is the point of no return — verify it landed.', 'COMMIT is the point of no return — verify it landed.'],
          ['COMMIT wapas-i-ke-na-da point hai — landing verify karo.', 'COMMIT wapas-i-ke-na-da point hai — landing verify karo.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: 'SELECT id, name FROM customers WHERE id = 1',
      }),
      task({
        d: 'very_hard',
        desc: [
          'The ACID gauntlet, one script: (1) demonstrate Consistency — attempt an order insert with customer 4242 (rejected); (2) demonstrate Atomicity — BEGIN, triple payment 9\'s amount, ROLLBACK; (3) demonstrate Durability — BEGIN, self-assign customer 2\'s name, COMMIT; finish with a verification SELECT of customer 2 (id, name).',
          'ACID ka poora imtihaan, ek script: (1) Consistency — customer 4242 ke saath order insert try karo (reject); (2) Atomicity — BEGIN, payment 9 ka amount triple, ROLLBACK; (3) Durability — BEGIN, customer 2 ka naam self-assign, COMMIT; aakhir me customer 2 ki verification SELECT (id, name).',
        ],
        sol: "INSERT INTO orders (id, customer_id, order_date, status) VALUES (9999, 4242, '2023-01-01', 'pending');\nBEGIN;\nUPDATE payments SET amount = amount * 3 WHERE id = 9;\nROLLBACK;\nBEGIN;\nUPDATE customers SET name = name WHERE id = 2;\nCOMMIT;\nSELECT id, name FROM customers WHERE id = 2;",
        hints: [
          ['Three letters, three statements — in order, one submission.', 'Three letters, three statements — in order, one submission.'],
          ['Teen akshar, teen statements — order me, ek submission.', 'Teen akshar, teen statements — order me, ek submission.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: 'SELECT id, name FROM customers WHERE id = 2',
      }),
    ],
  }),

  defineModule({
    n: 55,
    title: ['Triggers', 'Triggers'],
    time: '30 min',
    concepts: ['trigger', 'create trigger', 'before', 'after', 'insert', 'update', 'delete', 'audit log'],
    diagram: 'trigger-flow',
    objectives: [
      ['Automate reactions to data changes with triggers', 'Triggers se data changes par automated reaction'],
      ['Choose BEFORE vs AFTER timing deliberately', 'BEFORE vs AFTER timing jaan-boojh kar chunna'],
      ['Build an audit log — the canonical trigger use', 'Audit log banana — trigger ka canonical use'],
    ],
    theory: [
      section(
        ['Code that fires itself', 'Aisa code jo khud chal pada'],
        [
          [
            'A trigger is stored logic attached to a table event: CREATE TRIGGER name AFTER INSERT ON payments BEGIN … END. Whenever a row is inserted into payments, the body runs automatically — no application code needed, no one can forget to call it. Triggers enforce rules and record history at the database layer, where they cannot be bypassed.',
            'Trigger table event se judi saved logic hai: CREATE TRIGGER name AFTER INSERT ON payments BEGIN … END. Jab bhi payments me row aati hai, body khud chal jaati hai — na application code chahiye, na koi use call karna bhool sakta hai. Triggers database layer par rules enforce karte hain aur history likhte hain — jahan koi unko bypass nahi kar sakta.',
          ],
          [
            'Timing is the first design choice: BEFORE validates and can modify/REJECT the change (a trigger that blocks negative prices); AFTER reacts to a completed change (writing an audit row). Events: INSERT, UPDATE (with OF column list), DELETE. Inside the body you read NEW.col (the incoming row) and OLD.col (the outgoing row for UPDATE/DELETE).',
            'Timing pehla design faisla hai: BEFORE validate karta hai aur change ko badal/saabit REJECT kar sakta hai (negative price rokne wala trigger); AFTER complete hue change par react karta hai (audit row likhta hua). Events: INSERT, UPDATE (OF column list ke saath), DELETE. Body ke andar aap NEW.col padhte ho (aane wali row) aur OLD.col (jaane wali row — UPDATE/DELETE ke liye).',
          ],
        ],
        [],
        'trigger-flow'
      ),
      section(
        ['The audit log — triggers\' finest hour', 'Audit log — triggers ka sabse achha pal'],
        [
          [
            'Who changed what, when? A trigger on UPDATE writes OLD values (before) and NEW values (after) into an audit table with a timestamp. The history builds itself, immune to application bugs, because the database does the bookkeeping. Compliance teams live on exactly this pattern — and you will build one in the tasks.',
            'Kisne kya badla, kab? UPDATE par trigger OLD values (pehle) aur NEW values (baad) timestamp ke saath audit table me likhta hai. History khud banti hai, application bugs se immune, kyunki hisaab database khud rakhta hai. Compliance teams isi pattern par jeeti hain — aur aap tasks me ek banaoge.',
          ],
          [
            'Two cautions from production scars: keep trigger bodies small (they run on EVERY matching statement — slow bodies slow every write), and remember cascades (a trigger firing another trigger — powerful, occasionally surprising). Test triggers with both valid and invalid rows.',
            'Production ke nishaan se do savdhanis: trigger bodies chhoti rakho (wo HAR matching statement par chalti hain — bhaari body har write ko bhaari karti hai), aur cascades yaad rakho (ek trigger doosra trigger chala deta hai — powerful, kabhi-kabhi surprise). Triggers ko valid aur invalid dono rows se test karo.',
          ],
        ],
        [
          ['AFTER INSERT/UPDATE/DELETE … BEGIN … END', 'AFTER INSERT/UPDATE/DELETE … BEGIN … END'],
          ['NEW = incoming row; OLD = outgoing row', 'NEW = aane wali row; OLD = jaane wali row'],
          ['BEFORE can reject; AFTER records', 'BEFORE reject kar sakta hai; AFTER record karta hai'],
        ]
      ),
    ],
    tutorial: {
      title: ['The self-writing history', 'Khud likhti hui history'],
      steps: [
        step(null, [
          'We build an audit table, attach a trigger, fire one update, and watch the history appear.',
          'Hum audit table banate hain, trigger jodte hain, ek update chalate hain, aur history ko aate dekhte hain.',
        ]),
        step('CREATE TABLE IF NOT EXISTS payment_audit (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  payment_id INTEGER, old_amount DECIMAL(10,2), new_amount DECIMAL(10,2),\n  changed_at DATETIME DEFAULT CURRENT_TIMESTAMP\n);', [
          'The book where history will write itself.',
          'Wo kitaab jisme history khud likhegi.',
        ], { table: 'payments' }),
        step('CREATE TRIGGER trg_payment_audit\nAFTER UPDATE OF amount ON payments\nBEGIN\n  INSERT INTO payment_audit (payment_id, old_amount, new_amount)\n  VALUES (OLD.id, OLD.amount, NEW.amount);\nEND;', [
          'The trigger: after any amount change, record old and new.',
          'Trigger: kisi bhi amount change ke baad, purana aur naya record karo.',
        ], { table: 'payments' }),
        step('UPDATE payments SET amount = amount + 10 WHERE id = 1;\nSELECT payment_id, old_amount, new_amount FROM payment_audit;', [
          'One update, one audit row — OLD and NEW captured automatically.',
          'Ek update, ek audit row — OLD aur NEW khud pakde gaye.',
        ], { table: 'payments' }),
        step('DROP TRIGGER IF EXISTS trg_payment_audit;\nDROP TABLE IF EXISTS payment_audit;', [
          'Cleaning up triggers and their tables together — the end of every demo script.',
          'Triggers aur unki tables ko saath saaf karna — har demo script ka ant.',
        ], { run: true, table: 'payments' }),
      ],
    },
    syntax: {
      template: 'CREATE TRIGGER name\n[BEFORE | AFTER] [INSERT | UPDATE [OF col] | DELETE] ON table\nBEGIN\n  …;  -- NEW.col / OLD.col available\nEND;\nDROP TRIGGER IF EXISTS name;',
      parts: [
        { part: 'BEFORE', description: ['Runs first — can reject/modify (RAISE)', 'Pehle chalta hai — reject/modify kar sakta hai'] },
        { part: 'AFTER', description: ['Runs once the change is done', 'Change hone ke baad chalta hai'] },
        { part: 'NEW / OLD', description: ['Incoming / outgoing row values', 'Aane wali / jaane wali row values'] },
        { part: 'DROP TRIGGER', description: ['Removes the automation', 'Automation hata deta hai'] },
      ],
    },
    examples: [
      example('very_easy', 'CREATE TRIGGER trg_log_insert\nAFTER INSERT ON payments\nBEGIN\n  INSERT INTO payment_log (payment_id) VALUES (NEW.id);\nEND;', [
        'Every new payment leaves a trace. (Create payment_log first.)',
        'Har nayi payment ek nishaan chhodti hai. (Pehle payment_log banao.)',
      ]),
      example('easy', 'CREATE TRIGGER trg_block_negative\nBEFORE UPDATE OF amount ON payments\nWHEN NEW.amount < 0\nBEGIN\n  SELECT RAISE(ABORT, \'amount cannot be negative\');\nEND;', [
        'A guard trigger: negative amounts are refused at the door.',
        'Guard trigger: negative amounts darwaze par hi mana.',
      ]),
      example('medium', 'CREATE TRIGGER trg_audit_delete\nAFTER DELETE ON customers\nBEGIN\n  INSERT INTO deleted_customers (id, name) VALUES (OLD.id, OLD.name);\nEND;', [
        'Nothing vanishes silently — deletes are archived.',
        'Kuch chup-chaap gayab nahi hota — deletes archive hote hain.',
      ]),
      example('hard', 'CREATE TRIGGER trg_stock_after_sale\nAFTER INSERT ON order_items\nBEGIN\n  UPDATE products SET stock_quantity = stock_quantity - NEW.quantity\n  WHERE id = NEW.product_id;\nEND;', [
        'Business automation: every sale decrements stock — instantly, everywhere.',
        'Business automation: har bikri stock ghatati hai — turant, har jagah.',
      ]),
    ],
    mistakes: [
      mistake(
        ['Expecting NEW on DELETE or OLD on INSERT', 'DELETE par NEW ya INSERT par OLD expect karna'],
        ['DELETE has only OLD (no incoming row); INSERT has only NEW. UPDATE has both. Referencing the missing one errors at runtime.', 'DELETE me sirf OLD hai (aane wali row nahi); INSERT me sirf NEW. UPDATE me dono. Missing wale ka reference runtime par error deta hai.']
      ),
      mistake(
        ['Heavy trigger bodies slowing every write', 'Bhaari trigger body se har write slow hona'],
        ['Triggers fire on every matching statement. Keep bodies tiny: one insert, one update — never scans or aggregates.', 'Triggers har matching statement par chalte hain. Bodies tiny rakho: ek insert, ek update — scan ya aggregate kabhi nahi.']
      ),
      mistake(
        ['Forgetting DROP TRIGGER IF EXISTS in replayed scripts', 'Replay hone wali scripts me DROP TRIGGER IF EXISTS bhoolna'],
        ['CREATE TRIGGER fails if the name exists. Scripts begin with DROP TRIGGER IF EXISTS … — exactly like views.', 'Naam maujood ho to CREATE TRIGGER fail hota hai. Scripts DROP TRIGGER IF EXISTS … se shuru hoti hain — bilkul views ki tarah.']
      ),
    ],
    summary: [
      ['Triggers attach logic to INSERT/UPDATE/DELETE events', 'Triggers logic ko INSERT/UPDATE/DELETE events se jodte hain'],
      ['BEFORE guards; AFTER records; NEW/OLD carry the rows', 'BEFORE raksha karta hai; AFTER record; NEW/OLD rows laate hain'],
      ['Audit logs are the canonical production use', 'Audit logs canonical production use hain'],
      ['Keep bodies small; scripts drop-then-create', 'Bodies chhoti rakho; scripts drop-then-create'],
    ],
    quiz: [
      mcq(
        ['Inside a trigger on UPDATE, how do you read the row\'s value BEFORE the change?', 'UPDATE ke trigger ke andar, change se PEHLE wali value kaise padhte ho?'],
        [
          ['NEW.col', 'NEW.col'],
          ['OLD.col', 'OLD.col'],
          ['BEFORE.col', 'BEFORE.col'],
          ['CURRENT.col', 'CURRENT.col'],
        ],
        1,
        ['UPDATE exposes both rows: OLD (before) and NEW (after).', 'UPDATE dono rows dikhata hai: OLD (pehle) aur NEW (baad).']
      ),
      outputQ(
        'CREATE TABLE IF NOT EXISTS gone (qty INTEGER);\nCREATE TRIGGER t AFTER DELETE ON order_items BEGIN INSERT INTO gone (qty) VALUES (OLD.quantity); END;\nDELETE FROM order_items WHERE id = 1;\nSELECT COUNT(*) FROM gone;',
        ['(Assuming table "gone" exists and one delete fires the trigger.) How many audit rows?', '(Table "gone" maujood hai aur ek delete trigger chalata hai — maan kar.) Kitni audit rows?'],
        [
          { label: 'A', result: { columns: ['COUNT(*)'], rows: [[1]] } },
          { label: 'B', result: { columns: ['COUNT(*)'], rows: [[0]] } },
          { label: 'C', result: { error: 'Error: no such column: OLD.name' } },
          { label: 'D', result: { columns: ['COUNT(*)'], rows: [[100]] } },
        ],
        0,
        ['One delete fired the trigger once → one audit row capturing OLD.quantity.', 'Ek delete ne trigger ek baar chalaya → ek audit row jisme OLD.quantity.']
      ),
      buildQ(
        ['Build: an after-insert logging trigger', 'Banao: after-insert logging trigger'],
        ['CREATE', 'TRIGGER', 'trg', 'AFTER', 'INSERT', 'ON', 'payments', 'BEGIN', 'INSERT', 'INTO', 'log', 'VALUES', '(', 'NEW.id', ')', 'END'],
        ['CREATE', 'TRIGGER', 'trg', 'AFTER', 'INSERT', 'ON', 'payments', 'BEGIN', 'INSERT', 'INTO', 'log', 'VALUES', '(', 'NEW.id', ')', 'END'],
        ['CREATE TRIGGER … AFTER INSERT ON t BEGIN … END.', 'CREATE TRIGGER … AFTER INSERT ON t BEGIN … END.']
      ),
      blanksQ(
        'CREATE TRIGGER t ___ INSERT ON payments BEGIN INSERT INTO log VALUES (___.id); END;',
        [
          { options: ['AFTER', 'BEFORE', 'WITH'], correct: 'AFTER' },
          { options: ['NEW', 'OLD', 'ROW'], correct: 'NEW' },
        ],
        ['INSERT events carry NEW.', 'INSERT events NEW le jaate hain.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The presence trigger: create table log_t (id INTEGER PRIMARY KEY, payment_id INTEGER); create trigger trg_log AFTER INSERT ON payments inserting NEW.id into log_t; then INSERT one payment (id 501, order 1, today, 123.45, \'upi\'); verify via SELECT payment_id FROM log_t.',
          'Presence trigger: table log_t (id INTEGER PRIMARY KEY, payment_id INTEGER) banao; trigger trg_log banao AFTER INSERT ON payments jo NEW.id ko log_t me dale; phir ek payment INSERT karo (id 501, order 1, today, 123.45, \'upi\'); SELECT payment_id FROM log_t se verify karo.',
        ],
        sol: "CREATE TABLE IF NOT EXISTS log_t (id INTEGER PRIMARY KEY, payment_id INTEGER);\nDROP TRIGGER IF EXISTS trg_log;\nCREATE TRIGGER trg_log AFTER INSERT ON payments\nBEGIN\n  INSERT INTO log_t (payment_id) VALUES (NEW.id);\nEND;\nINSERT INTO payments (id, order_id, payment_date, amount, payment_method) VALUES (501, 1, '2023-12-01 12:00:00', 123.45, 'upi');\nSELECT payment_id FROM log_t;",
        hints: [
          ['Table, trigger, insert, verify — four statements, one submission.', 'Table, trigger, insert, verify — four statements, one submission.'],
          ['Table, trigger, insert, verify — chaar statements, ek submission.', 'Table, trigger, insert, verify — chaar statements, ek submission.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: 'SELECT payment_id FROM log_t',
      }),
      task({
        d: 'easy',
        desc: [
          'The guard: BEFORE UPDATE OF amount ON payments, WHEN NEW.amount < 0, RAISE(ABORT, \'amount cannot be negative\'); then attempt UPDATE payments SET amount = -1 WHERE id = 2 (it fails — that is success); verify amount unchanged (id, amount).',
          'Guard: BEFORE UPDATE OF amount ON payments, WHEN NEW.amount < 0, RAISE(ABORT, \'amount cannot be negative\'); phir UPDATE payments SET amount = -1 WHERE id = 2 try karo (fail hoga — wahi safalta hai); amount unchanged verify karo (id, amount).',
        ],
        sol: "DROP TRIGGER IF EXISTS trg_no_negative;\nCREATE TRIGGER trg_no_negative\nBEFORE UPDATE OF amount ON payments\nWHEN NEW.amount < 0\nBEGIN\n  SELECT RAISE(ABORT, 'amount cannot be negative');\nEND;\nUPDATE payments SET amount = -1 WHERE id = 2;\nSELECT id, amount FROM payments WHERE id = 2;",
        hints: [
          ['The failing statement mid-script is the demonstration.', 'The failing statement mid-script is the demonstration.'],
          ['Beech ka failing statement hi demonstration hai.', 'Beech ka failing statement hi demonstration hai.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: 'SELECT id, amount FROM payments WHERE id = 2',
      }),
      task({
        d: 'medium',
        desc: [
          'The audit trail: create table pay_audit (id INTEGER PRIMARY KEY AUTOINCREMENT, payment_id INTEGER, old_amount DECIMAL(10,2), new_amount DECIMAL(10,2)); trigger trg_audit AFTER UPDATE OF amount ON payments inserting OLD and NEW amounts; UPDATE payment 3 amount to amount + 5; verify the audit row (payment_id, old_amount, new_amount).',
          'Audit trail: table pay_audit (id INTEGER PRIMARY KEY AUTOINCREMENT, payment_id INTEGER, old_amount DECIMAL(10,2), new_amount DECIMAL(10,2)) banao; trigger trg_audit AFTER UPDATE OF amount ON payments jo OLD aur NEW amounts dale; payment 3 ka amount amount + 5 karo; audit row verify karo (payment_id, old_amount, new_amount).',
        ],
        sol: "CREATE TABLE IF NOT EXISTS pay_audit (id INTEGER PRIMARY KEY AUTOINCREMENT, payment_id INTEGER, old_amount DECIMAL(10,2), new_amount DECIMAL(10,2));\nDROP TRIGGER IF EXISTS trg_audit;\nCREATE TRIGGER trg_audit AFTER UPDATE OF amount ON payments\nBEGIN\n  INSERT INTO pay_audit (payment_id, old_amount, new_amount) VALUES (OLD.id, OLD.amount, NEW.amount);\nEND;\nUPDATE payments SET amount = amount + 5 WHERE id = 3;\nSELECT payment_id, old_amount, new_amount FROM pay_audit WHERE payment_id = 3;",
        hints: [
          ['OLD.amount before, NEW.amount after — one row of history per update.', 'OLD.amount before, NEW.amount after — one row of history per update.'],
          ['OLD.amount pehle, NEW.amount baad — har update ki ek history row.', 'OLD.amount pehle, NEW.amount baad — har update ki ek history row.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: 'SELECT payment_id, old_amount, new_amount FROM pay_audit WHERE payment_id = 3',
      }),
      task({
        d: 'hard',
        desc: [
          'The deletion archive: create table gone_customers (id INTEGER PRIMARY KEY, name TEXT); trigger trg_gone AFTER DELETE ON customers archiving OLD.id and OLD.name; DELETE customer 100… careful — orders reference them. Delete customer 100\'s orders\' payments… simpler: pick a customer with no orders via NOT EXISTS, delete them, and verify the archive row (id, name).',
          'Deletion archive: table gone_customers (id INTEGER PRIMARY KEY, name TEXT) banao; trigger trg_gone AFTER DELETE ON customers jo OLD.id aur OLD.name archive kare; customer 100 delete… dhyan — orders unhe reference karte hain. Uski orders ke payments delete karna… simple karo: NOT EXISTS se koi aisa customer lo jiske orders nahi, use delete karo, aur archive row verify karo (id, name).',
        ],
        sol: "CREATE TABLE IF NOT EXISTS gone_customers (id INTEGER PRIMARY KEY, name TEXT);\nDROP TRIGGER IF EXISTS trg_gone;\nCREATE TRIGGER trg_gone AFTER DELETE ON customers\nBEGIN\n  INSERT INTO gone_customers (id, name) VALUES (OLD.id, OLD.name);\nEND;\nDELETE FROM customers WHERE id = (SELECT id FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id) LIMIT 1);\nSELECT id, name FROM gone_customers;",
        hints: [
          ['DELETE exposes OLD — the archived values.', 'DELETE exposes OLD — the archived values.'],
          ['DELETE OLD dikhata hai — archived values.', 'DELETE OLD dikhata hai — archived values.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: 'SELECT id, name FROM gone_customers',
      }),
      task({
        d: 'very_hard',
        desc: [
          'The stock automation: trigger trg_stock AFTER INSERT ON order_items decrementing products.stock_quantity by NEW.quantity for NEW.product_id; then INSERT one order_item (order 1, product 1, quantity 2, price from products, subtotal = price × 2); verify product 1\'s new stock (id, stock_quantity).',
          'Stock automation: trigger trg_stock AFTER INSERT ON order_items jo NEW.quantity itna products.stock_quantity ghata de NEW.product_id ke liye; phir ek order_item INSERT karo (order 1, product 1, quantity 2, price products se, subtotal = price × 2); product 1 ka naya stock verify karo (id, stock_quantity).',
        ],
        sol: "DROP TRIGGER IF EXISTS trg_stock;\nCREATE TRIGGER trg_stock AFTER INSERT ON order_items\nBEGIN\n  UPDATE products SET stock_quantity = stock_quantity - NEW.quantity WHERE id = NEW.product_id;\nEND;\nINSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)\nSELECT 1, id, 2, price, price * 2 FROM products WHERE id = 1;\nSELECT id, stock_quantity FROM products WHERE id = 1;",
        hints: [
          ['The body is one UPDATE using NEW.product_id and NEW.quantity.', 'The body is one UPDATE using NEW.product_id and NEW.quantity.'],
          ['Body ek UPDATE hai jo NEW.product_id aur NEW.quantity use karta hai.', 'Body ek UPDATE hai jo NEW.product_id aur NEW.quantity use karta hai.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: 'SELECT id, stock_quantity FROM products WHERE id = 1',
      }),
    ],
  }),

  defineModule({
    n: 56,
    title: ['Query Optimization', 'Query Optimization'],
    time: '30 min',
    concepts: ['optimization', 'explain query plan', 'full scan', 'index scan', 'sargable', 'covering index', 'early filters'],
    diagram: 'index-tree',
    objectives: [
      ['Read EXPLAIN QUERY PLAN like a professional', 'EXPLAIN QUERY PLAN ko professional ki tarah padhna'],
      ['Write sargable (index-friendly) WHERE clauses', 'Sargable (index-friendly) WHERE clauses likhna'],
      ['Apply the big optimisation levers in order', 'Bade optimisation levers order me lagana'],
    ],
    theory: [
      section(
        ['The optimizer\'s window into your query', 'Optimizer ki aapki query me jhaanki'],
        [
          [
            'EXPLAIN QUERY PLAN prints the engine\'s strategy: SCAN t (reading every row) vs SEARCH t USING INDEX idx (…): the single most informative line in performance work. Composite detail lines show the index columns used; "USING COVERING INDEX" means the query never touches the table at all — the fastest family of plans.',
            'EXPLAIN QUERY PLAN engine ki strategy print karta hai: SCAN t (har row padhte hue) vs SEARCH t USING INDEX idx (…): performance kaam ki sabse informative line. Composite detail lines index ke kaunse columns use hue dikhati hain; "USING COVERING INDEX" ka matlab query table ko chhooti bhi nahi — plans ki sabse fast family.',
          ],
          [
            'Your job is not to out-think the optimizer — it is to give it something to work with: indexes on filter/join columns, sargable predicates, and small early reductions. The optimizer chooses among paths; your schema and query shape decide which paths exist.',
            'Aapka kaam optimizer se ladna nahi hai — use kaam karne layak dena: filter/join columns par indexes, sargable predicates, aur chhoti jaldi reductions. Optimizer paths me se chunta hai; aapka schema aur query shape decide karta hai kaunse paths exist karte hain.',
          ],
        ],
        [],
        'index-tree'
      ),
      section(
        ['The levers that actually matter', 'Wo levers jo sach me matter karte hain'],
        [
          [
            'Lever 1 — sargability: WHERE col LIKE \'Del%\' uses an index; LIKE \'%Del%\' cannot (leading wildcard kills the tree walk); WHERE substr(d, 1, 7) = \'2023-06\' cannot, but WHERE d >= \'2023-06-01\' AND d < \'2023-07-01\' can. Wrap a column in a function and you blind the index. Range-friendly date math is the classic fix.',
            'Lever 1 — sargability: WHERE col LIKE \'Del%\' index use karta hai; LIKE \'%Del%\' nahi kar sakta (leading wildcard tree walk maar deta hai); WHERE substr(d, 1, 7) = \'2023-06\' nahi, par WHERE d >= \'2023-06-01\' AND d < \'2023-07-01\' kar sakta hai. Column ko function me wrap karo to index andha ho jaata hai. Range-friendly date maths classic fix hai.',
          ],
          [
            'Lever 2 — early reduction: put the strongest selective filters FIRST in the execution logic — subqueries/CTEs that shrink millions to thousands before the expensive join. Lever 3 — covering indexes: an index containing every column a query needs answers it from the tree alone. Lever 4 — measure twice: optimise only what EXPLAIN flags, never folklore.',
            'Lever 2 — early reduction: sabse selective filters execution logic me PEHLE rakho — subqueries/CTEs jo mehnge join se pehle karodon ko hazaron me sikod dein. Lever 3 — covering indexes: ek index jisme query ki har column ho, use tree akela answer kar deta hai. Lever 4 — do baar naapo: sirf wahi optimise karo jo EXPLAIN flags kare, kabhi folklore nahi.',
          ],
        ],
        [
          ['SCAN vs SEARCH USING INDEX — learn to see it', 'SCAN vs SEARCH USING INDEX — ise dekhna seekho'],
          ['Sargable: no functions or leading wildcards on indexed columns', 'Sargable: indexed columns par functions ya leading wildcards nahi'],
          ['Reduce early, index what you join, measure everything', 'Jaldi sikodo, jise join karo usе index karo, sab naapo'],
        ]
      ),
    ],
    tutorial: {
      title: ['Making a query fast', 'Query ko fast banana'],
      steps: [
        step(null, [
          'We take a slow-shaped query, read its plan, apply the levers, and watch SCAN become SEARCH.',
          'Hum slow-shape wali query lete hain, plan padhte hain, levers lagate hain, aur SCAN ke SEARCH bante dekhte hain.',
        ]),
        step("EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 42;", [
          'Baseline: the shipped index already gives SEARCH — good habits shipped with the data.',
          'Baseline: shipped index pehle hi SEARCH deta hai — data ke saath achhi aadatein bhi aayi hain.',
        ], { table: 'orders' }),
        step("EXPLAIN QUERY PLAN SELECT * FROM orders WHERE substr(order_date, 1, 7) = '2023-06';", [
          'The non-sargable shape: a function over the column forces a SCAN even though idx_orders_date exists.',
          'Non-sargable shape: column par function SCAN par majboor karta hai jabki idx_orders_date maujood hai.',
        ], { table: 'orders' }),
        step("EXPLAIN QUERY PLAN SELECT * FROM orders\nWHERE order_date >= '2023-06-01' AND order_date < '2023-07-01';", [
          'The sargable rewrite: plain ranges walk the date index — SEARCH again.',
          'Sargable rewrite: plain ranges date index par chalte hain — phir se SEARCH.',
        ], { table: 'orders' }),
        step("CREATE INDEX idx_products_name ON products(name);\nEXPLAIN QUERY PLAN SELECT id, name FROM products WHERE name LIKE 'Titan%';", [
          'A leading-prefix LIKE plus a covering index — the fastest shape of all.',
          'Leading-prefix LIKE plus covering index — sabse fast shape.',
        ], { run: true, table: 'products' }),
      ],
    },
    syntax: {
      template: "EXPLAIN QUERY PLAN SELECT …;\n-- Bad:  WHERE substr(d,1,7) = '2023-06'\n-- Good: WHERE d >= '2023-06-01' AND d < '2023-07-01'\n-- Bad:  WHERE name LIKE '%an%'\n-- Good: WHERE name LIKE 'Dan%'",
      parts: [
        { part: 'EXPLAIN QUERY PLAN', description: ['Show the chosen strategy', 'Chuni hui strategy dikhata hai'] },
        { part: 'sargable WHERE', description: ['No functions or leading % on indexed columns', 'Indexed columns par functions ya leading % nahi'] },
        { part: 'covering index', description: ['Index holds all needed columns', 'Index saari zaroori columns rakhta hai'] },
      ],
    },
    examples: [
      example('very_easy', 'EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 7;', [
        'Reading a healthy plan: SEARCH USING INDEX.',
        'Sehatmand plan padhna: SEARCH USING INDEX.',
      ]),
      example('medium', "EXPLAIN QUERY PLAN SELECT * FROM orders WHERE order_date LIKE '2023-06%';", [
        'A sneaky non-sargable: LIKE without leading % still blocks the index on DATETIME — prefer range comparisons.',
        'Ek chhupa non-sargable: leading % ke bina bhi LIKE, DATETIME par index rok deta hai — range comparison behtar.',
      ]),
      example('hard', "CREATE INDEX idx_products_category_price ON products(category_id, price);\nEXPLAIN QUERY PLAN SELECT price FROM products WHERE category_id = 2;", [
        'A covering index in action: price lives inside the tree — the table is never opened.',
        'Covering index kaam par: price tree ke andar hai — table khulti hi nahi.',
      ]),
    ],
    mistakes: [
      mistake(
        ["Leading wildcards: WHERE name LIKE '%an%'", "Leading wildcards: WHERE name LIKE '%an%'"],
        ['The tree walks left-to-right; a leading % has no starting point. Store a reversed column, or use full-text search (FTS) for contains-style lookups.', 'Tree left-to-right chalti hai; leading % ka koi shuru point nahi. Reversed column rakho, ya contains-style lookups ke liye full-text search (FTS) use karo.']
      ),
      mistake(
        ['Functions over indexed columns in WHERE', 'WHERE me indexed columns par functions'],
        ["WHERE YEAR(d) = 2023 / substr(d,1,4) = '2023' forces scans. Rewrite as ranges: d >= '2023-01-01' AND d < '2024-01-01'.", "WHERE YEAR(d) = 2023 / substr(d,1,4) = '2023' scan karwata hai. Range likho: d >= '2023-01-01' AND d < '2024-01-01'."]
      ),
      mistake(
        ['Optimising without measuring', 'Bina naape optimisation'],
        ['EXPLAIN first, change second. Most "slow queries" are slow for one visible reason (a scan where an index belongs), not five mysterious ones.', 'Pehle EXPLAIN, phir change. Zyada tar "slow queries" ek hi wajah se slow hote hain (jahan index hona chahiye wahan scan), paanch bhedi wajahon se nahi.']
      ),
    ],
    summary: [
      ['EXPLAIN QUERY PLAN shows SCAN vs SEARCH — read it always', 'EXPLAIN QUERY PLAN SCAN vs SEARCH dikhata hai — hamesha padho'],
      ['Sargable predicates keep indexes usable', 'Sargable predicates indexes usable rakhte hain'],
      ['Covering indexes answer without touching tables', 'Covering indexes table ko chhue bina jawab dete hain'],
      ['Reduce early; measure everything; ignore folklore', 'Jaldi sikodo; sab naapo; lore ko ignore karo'],
    ],
    quiz: [
      mcq(
        ["Which WHERE clause can use an index on order_date?", "order_date par index hone par kaunsi WHERE clause use ho sakti hai?"],
        [
          ["WHERE substr(order_date, 1, 7) = '2023-06'", "WHERE substr(order_date, 1, 7) = '2023-06'"],
          ["WHERE order_date >= '2023-06-01' AND order_date < '2023-07-01'", "WHERE order_date >= '2023-06-01' AND order_date < '2023-07-01'"],
          ["WHERE UPPER(order_date) = '2023-06'", "WHERE UPPER(order_date) = '2023-06'"],
          ["WHERE order_date LIKE '%06%'", "WHERE order_date LIKE '%06%'"],
        ],
        1,
        ['Plain range comparisons walk the index; functions and leading wildcards blind it.', 'Plain range comparison index par chalti hain; functions aur leading wildcards ise andha karte hain.']
      ),
      outputQ(
        'EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 5;',
        ['What does the plan show (index present)?', 'Plan kya dikhata hai (index maujood)?'],
        [
          { label: 'A', result: { columns: ['id', 'parent', 'notused', 'detail'], rows: [[3, 0, 0, 'SEARCH orders USING INDEX idx_orders_customer (customer_id=?)']] } },
          { label: 'B', result: { columns: ['id', 'parent', 'notused', 'detail'], rows: [[2, 0, 0, 'SCAN orders']] } },
          { label: 'C', result: { columns: ['id', 'parent', 'notused', 'detail'], rows: [[4, 0, 0, 'SEARCH orders USING COVERING INDEX']] } },
          { label: 'D', result: { error: 'Error: no such table: orders' } },
        ],
        0,
        ['The customer_id index turns a full scan into a directed search.', 'customer_id index full scan ko directed search bana deta hai.']
      ),
      buildQ(
        ['Build: the sargable month range', 'Banao: sargable month range'],
        ['WHERE', 'order_date', '>=', "'2023-06-01'", 'AND', 'order_date', '<', "'2023-07-01'"],
        ['WHERE', 'order_date', '>=', "'2023-06-01'", 'AND', 'order_date', '<', "'2023-07-01'"],
        ['Ranges instead of functions.', 'Functions ki jagah range.'],
      ),
      blanksQ(
        "SELECT * FROM t WHERE d ___ '2023-06-01' AND d ___ '2023-07-01';",
        [
          { options: ['>=', '=', 'LIKE'], correct: '>=' },
          { options: ['<', '>', '<='], correct: '<' },
        ],
        ['Half-open ranges are the sargable month idiom.', 'Half-open range hi sargable month ka idiom hai.'],
      ),
    ],
    tasks: [
      task({
        d: 'very_easy',
        desc: [
          'The healthy check: EXPLAIN QUERY PLAN for orders WHERE customer_id = 7 — confirm SEARCH via the shipped index. Submit the EXPLAIN statement.',
          'Sehatmand check: orders WHERE customer_id = 7 ke liye EXPLAIN QUERY PLAN — shipped index se SEARCH confirm karo. EXPLAIN statement submit karo.',
        ],
        sol: 'EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 7;',
        hints: [
          ['One statement, one plan.', 'One statement, one plan.'],
          ['Ek statement, ek plan.', 'Ek statement, ek plan.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
      }),
      task({
        d: 'easy',
        desc: [
          'The bad shape exposed: EXPLAIN QUERY PLAN for orders WHERE substr(order_date, 1, 7) = \'2023-06\' — see the SCAN. Submit the EXPLAIN.',
          'Bura shape expose karna: orders WHERE substr(order_date, 1, 7) = \'2023-06\' ka EXPLAIN QUERY PLAN — SCAN dekho. EXPLAIN submit karo.',
        ],
        sol: "EXPLAIN QUERY PLAN SELECT * FROM orders WHERE substr(order_date, 1, 7) = '2023-06';",
        hints: [
          ['The function over the column is the villain.', 'The function over the column is the villain.'],
          ['Column par function hi villain hai.', 'Column par function hi villain hai.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
      }),
      task({
        d: 'medium',
        desc: [
          'The sargable rewrite: EXPLAIN QUERY PLAN for orders WHERE order_date >= \'2023-06-01\' AND order_date < \'2023-07-01\' — SEARCH restored. Submit the EXPLAIN.',
          'Sargable rewrite: orders WHERE order_date >= \'2023-06-01\' AND order_date < \'2023-07-01\' ka EXPLAIN QUERY PLAN — SEARCH wapas. EXPLAIN submit karo.',
        ],
        sol: "EXPLAIN QUERY PLAN SELECT * FROM orders WHERE order_date >= '2023-06-01' AND order_date < '2023-07-01';",
        hints: [
          ['Half-open range: include June 1, exclude July 1.', 'Half-open range: include June 1, exclude July 1.'],
          ['Half-open range: June 1 shaamil, July 1 bahar.', 'Half-open range: June 1 shaamil, July 1 bahar.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
      }),
      task({
        d: 'hard',
        desc: [
          'The covering play: CREATE INDEX idx_products_cat_price ON products(category_id, price); then EXPLAIN QUERY PLAN SELECT price FROM products WHERE category_id = 2; — a COVERING index plan. Submit both.',
          'Covering play: CREATE INDEX idx_products_cat_price ON products(category_id, price); phir EXPLAIN QUERY PLAN SELECT price FROM products WHERE category_id = 2; — COVERING index plan. Dono submit karo.',
        ],
        sol: 'DROP INDEX IF EXISTS idx_products_cat_price;\nCREATE INDEX idx_products_cat_price ON products(category_id, price);\nEXPLAIN QUERY PLAN SELECT price FROM products WHERE category_id = 2;',
        hints: [
          ['Both needed columns live in the tree.', 'Both needed columns live in the tree.'],
          ['Dono zaroori columns tree me hain.', 'Dono zaroori columns tree me hain.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: "SELECT name FROM sqlite_master WHERE type='index' AND name='idx_products_cat_price'",
      }),
      task({
        d: 'very_hard',
        desc: [
          'The optimisation report: in one submission — (1) EXPLAIN the sargable month range on orders; (2) CREATE INDEX idx_ship_status ON shipping(shipping_status); (3) EXPLAIN SELECT * FROM shipping WHERE shipping_status = \'delivered\' — the index converting a scan to a search. Submit all three statements.',
          'Optimisation report: ek submission me — (1) orders par sargable month range ka EXPLAIN; (2) CREATE INDEX idx_ship_status ON shipping(shipping_status); (3) EXPLAIN SELECT * FROM shipping WHERE shipping_status = \'delivered\' — index scan ko search me badalta hua. Teeno statements submit karo.',
        ],
        sol: "EXPLAIN QUERY PLAN SELECT * FROM orders WHERE order_date >= '2023-06-01' AND order_date < '2023-07-01';\nCREATE INDEX idx_ship_status ON shipping(shipping_status);\nEXPLAIN QUERY PLAN SELECT * FROM shipping WHERE shipping_status = 'delivered';",
        hints: [
          ['Three statements, two plans, one new index.', 'Three statements, two plans, one new index.'],
          ['Teen statements, do plans, ek naya index.', 'Teen statements, do plans, ek naya index.'],
          ['Wrap the pattern: the inner query carries the aggregate over the joined tables.', 'Pattern likho: andar wali query joined tables par aggregate laati hai.'],
        ],
        verifyQuery: "SELECT name FROM sqlite_master WHERE type='index' AND name='idx_ship_status'",
      }),
    ],
  }),
];
