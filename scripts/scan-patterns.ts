// Verify tutorial step patterns: [narr, code+, narr]? Any mid-tutorial narrative steps?
import { loadModule } from '../src/lib/content/registry';

async function main() {
  const patterns: Record<string, number[]> = {};
  for (let n = 1; n <= 60; n++) {
    const m = await loadModule(n);
    const pat = m.tutorial.steps.map((s) => (s.code ? 'C' : 'n')).join('');
    (patterns[pat] ??= []).push(n);
  }
  for (const [pat, mods] of Object.entries(patterns)) {
    console.log(`${pat}  x${mods.length}  ${mods.length <= 8 ? 'M' + mods.join(',M') : ''}`);
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
