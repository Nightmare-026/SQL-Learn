const initSqlJs = require('sql.js');
const fs = require('fs');
const SQL = await initSqlJs({ wasmBinary: fs.readFileSync('node_modules/sql.js/dist/sql-wasm.wasm') });
const load = (p) => JSON.parse(fs.readFileSync(p, 'utf8').match(/export const \w+ = (".*");\n/s)[1]);
const db = new SQL.Database();
db.exec(load('src/content/datasets/advanced.ts'));

const stmts = ["DROP VIEW IF EXISTS vips", "CREATE VIEW vips AS SELECT id FROM customers WHERE customer_type = 'vip'", "SELECT COUNT(*) AS c FROM vips"];
for (const st of stmts) {
  try {
    const r = db.exec(st);
    console.log(`exec OK (${r.length} results):`, st.slice(0, 45));
    if (r.length === 0) {
      const stmt = db.prepare(st);
      const cols = stmt.getColumnNames();
      console.log('  prepare cols:', JSON.stringify(cols));
      if (cols.length) {
        const rows = [];
        while (stmt.step()) rows.push(stmt.getAsArray());
        console.log('  stepped rows:', rows.length);
      }
      stmt.free();
    }
  } catch (e) {
    console.log('exec ERR:', st.slice(0, 45), '→', e.message);
  }
}
