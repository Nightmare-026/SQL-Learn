// Dump tutorial structure of sample modules to understand step shapes
import { loadModule } from '../src/lib/content/registry';

async function main() {
  for (const n of [1, 2, 3, 5, 9, 21, 33, 51]) {
    const m = await loadModule(n);
    console.log(`\n=== M${n}: ${m.tutorial.title.en} (${m.tutorial.steps.length} steps) ===`);
    for (const [i, s] of m.tutorial.steps.entries()) {
      console.log(`  step ${i + 1}: code=${s.code ? JSON.stringify(s.code).slice(0, 60) : 'null'} run=${!!s.run} table=${JSON.stringify(s.table)}`);
      console.log(`     expl: ${s.explanation.en.slice(0, 90)}`);
    }
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
