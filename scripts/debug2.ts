const initSqlJs = require('sql.js');
const fs = require('fs');
const SQL = await initSqlJs({ wasmBinary: fs.readFileSync('node_modules/sql.js/dist/sql-wasm.wasm') });
const load = (p) => JSON.parse(fs.readFileSync(p, 'utf8').match(/export const \w+ = (".*");\n/s)[1]);
const db = new SQL.Database();
db.exec('PRAGMA foreign_keys = ON;');
db.exec(load('src/content/datasets/advanced.ts'));
const stmts = ["DROP VIEW IF EXISTS vips", "CREATE VIEW vips AS SELECT id FROM customers WHERE customer_type = 'vip'", "SELECT COUNT(*) AS c FROM vips"];
for (const st of stmts) {
  try { const r = db.exec(st); console.log('OK:', st.slice(0, 40), '→ results:', r.length); }
  catch (e: any) { console.log('ERR:', st.slice(0, 40), '→', e.message); }
}
