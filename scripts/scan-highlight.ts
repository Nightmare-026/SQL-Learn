// Collect all highlightWhere expressions used in tutorials
import { loadModule } from '../src/lib/content/registry';

async function main() {
  const exprs = new Set<string>();
  const tables = new Set<string>();
  for (let n = 1; n <= 60; n++) {
    const m = await loadModule(n);
    for (const s of m.tutorial.steps) {
      if (s.table) {
        tables.add(s.table.name);
        if (s.table.highlightWhere) exprs.add(s.table.highlightWhere);
      }
    }
  }
  console.log('TABLES:', [...tables].sort().join(', '));
  console.log('EXPRESSIONS (' + exprs.size + '):');
  for (const e of [...exprs].sort()) console.log('  ' + e);
}
main().catch((e) => { console.error(e); process.exit(1); });
