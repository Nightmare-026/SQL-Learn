const initSqlJs = require('sql.js');
const fs = require('fs');
const SQL = await initSqlJs({ wasmBinary: fs.readFileSync('node_modules/sql.js/dist/sql-wasm.wasm') });
const load = (p) => JSON.parse(fs.readFileSync(p, 'utf8').match(/export const \w+ = (".*");\n/s)[1]);
const db = new SQL.Database();
db.exec(load('src/content/datasets/advanced.ts'));
try { db.exec("DROP VIEW IF EXISTS vips"); console.log('drop: OK'); } catch (e) { console.log('drop ERR:', e.message); }
try { db.exec("CREATE VIEW vips AS SELECT id FROM customers WHERE customer_type = 'vip'"); console.log('create: OK'); } catch (e) { console.log('create ERR:', e.message); }
// now try with semicolon inside exec
const db2 = new SQL.Database();
db2.exec(load('src/content/datasets/advanced.ts'));
try { db2.exec("DROP VIEW IF EXISTS vips; CREATE VIEW vips AS SELECT id FROM customers WHERE customer_type = 'vip';"); console.log('combined: OK'); } catch (e) { console.log('combined ERR:', e.message); }
