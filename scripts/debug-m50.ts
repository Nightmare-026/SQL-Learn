const initSqlJs = require('sql.js');
const fs = require('fs');
const SQL = await initSqlJs({ wasmBinary: fs.readFileSync('node_modules/sql.js/dist/sql-wasm.wasm') });
const { MODULE_BODIES } = await import('../src/content/modules/registry');
const load = (p) => JSON.parse(fs.readFileSync(p, 'utf8').match(/export const \w+ = (".*");\n/s)[1]);
const m = MODULE_BODIES.find((x: any) => x.number === 50);
console.log('dataset:', m.dataset);
const db = new SQL.Database();
db.exec(load(`src/content/datasets/${m.dataset}.ts`));
for (const t of m.tasks) {
  console.log(`--- ${t.id}: ${t.solution.slice(0, 60).replace(/\n/g, '|')}`);
  try {
    db.exec(t.solution);
    console.log('    direct exec: OK');
  } catch (e: any) {
    console.log('    direct exec ERR:', e.message);
  }
}
