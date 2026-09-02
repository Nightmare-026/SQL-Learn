/** Audit fill_blanks: template ___ count vs blanks array length. */
import { MODULE_BODIES } from '../src/content/modules/registry';
let bad = 0;
for (const m of MODULE_BODIES) {
  for (const q of m.quiz) {
    if (q.type !== 'fill_blanks') continue;
    const holes = (q.template.match(/___/g) ?? []).length;
    if (holes !== q.blanks.length) {
      console.log(`✗ M${m.number}: template has ${holes} blanks, array has ${q.blanks.length} → "${q.template.slice(0, 70)}"`);
      bad++;
    }
  }
}
console.log(bad === 0 ? 'ALL BLANKS OK' : `${bad} mismatches`);
