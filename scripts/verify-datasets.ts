/**
 * Verify generated seed SQL: executes cleanly, correct record counts.
 * Run: bun scripts/verify-datasets.ts
 */
import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';

async function main() {
  const SQL = await initSqlJs({
    locateFile: (f) => path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', f),
    wasmBinary: fs.readFileSync(path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm')),
  } as any);

  const seeds: [string, string, Record<string, number>][] = [
    ['school', fs.readFileSync(path.join(__dirname, '..', 'src/content/datasets/school.ts'), 'utf8'), {
      students: 50, teachers: 10, departments: 5, courses: 15, enrollments: 200,
    }],
    ['ecommerce', fs.readFileSync(path.join(__dirname, '..', 'src/content/datasets/ecommerce.ts'), 'utf8'), {
      customers: 100, categories: 20, products: 200, orders: 500, order_items: 0, payments: 500,
    }],
    ['advanced', fs.readFileSync(path.join(__dirname, '..', 'src/content/datasets/advanced.ts'), 'utf8'), {
      reviews: 500, shipping: 400, inventory_log: 1000, customer_segments: 150,
    }],
  ];

  let failures = 0;
  const dbs: Record<string, any> = {};
  for (const [name, raw, expectedCounts] of seeds) {
    const m = raw.match(/export const \w+ = (".*");\n/s)!;
    const sql = JSON.parse(m[1]);
    const db = new SQL.Database();
    try {
      db.exec('PRAGMA foreign_keys = ON;');
      db.exec(sql);
      console.log(`✓ ${name}: executes cleanly`);
      dbs[name] = db;
    } catch (e) {
      console.error(`✗ ${name}: FAILED — ${e}`);
      failures++;
      continue;
    }
    const counts: Record<string, number> = {};
    for (const t of Object.keys(expectedCounts)) {
      const r = db.exec(`SELECT COUNT(*) FROM ${t}`);
      counts[t] = Number(r[0].values[0][0]);
      if (expectedCounts[t] > 0 && counts[t] !== expectedCounts[t]) {
        console.error(`  ✗ ${name}.${t}: expected ${expectedCounts[t]}, got ${counts[t]}`);
        failures++;
      }
    }
    console.log(`  counts: ${JSON.stringify(counts)}`);
  }

  // Sanity queries the curriculum relies on
  const s = dbs.school;
  const q = (db: any, sql: string) => {
    try { const r = db.exec(sql); return r[0] ? r[0].values.length : 0; } catch { return -1; }
  };
  const checks: [any, string, string, number][] = [
    [s, 'students in Delhi (>= 6)', "SELECT id FROM students WHERE city='Delhi'", 6],
    [s, 'students in Bangalore (>= 4)', "SELECT id FROM students WHERE city='Bangalore'", 4],
    [s, 'NULL emails exist', 'SELECT id FROM students WHERE email IS NULL', 1],
    [s, 'NULL scores exist', 'SELECT id FROM enrollments WHERE score IS NULL', 1],
    [dbs.ecommerce, 'order months coverage', 'SELECT DISTINCT substr(order_date,1,7) m FROM orders ORDER BY m', 12],
    [dbs.ecommerce, 'product price range sane', 'SELECT id FROM products WHERE price < 100 OR price > 50000', 0],
    [dbs.ecommerce, 'order_items >= 1000', 'SELECT id FROM order_items LIMIT 1001', 1001],
    [dbs.advanced, 'inventory latest row exists', 'SELECT id FROM inventory_log ORDER BY timestamp DESC LIMIT 1', 1],
    [dbs.advanced, 'ratings in range', 'SELECT id FROM reviews WHERE rating NOT BETWEEN 1 AND 5', 0],
  ];
  for (const [db, label, sql, want] of checks) {
    const got = q(db, sql);
    const ok = got >= want && got !== -1;
    if (!ok) {
      console.error(`  ✗ ${label}: expected >= ${want}, got ${got}`);
      failures++;
    } else {
      console.log(`  ✓ ${label}: ${got}`);
    }
  }

  console.log(failures === 0 ? '\nALL DATASET CHECKS PASSED' : `\n${failures} FAILURES`);
  process.exit(failures === 0 ? 0 : 1);
}

main();
