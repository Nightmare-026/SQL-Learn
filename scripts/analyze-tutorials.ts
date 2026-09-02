// Analyze tutorial steps across all 60 modules: which have real animations (code steps)?
import { loadModule } from '../src/lib/content/registry';

async function main() {
  let withCode = 0, withoutCode = 0, totalSteps = 0, codeSteps = 0, runSteps = 0, tableSteps = 0;
  const noCode: number[] = [];
  const noCodeButHasText: number[] = [];
  for (let n = 1; n <= 60; n++) {
    const m = await loadModule(n);
    const steps = m.tutorial.steps;
    totalSteps += steps.length;
    const hasCode = steps.some((s) => s.code);
    if (hasCode) withCode++;
    else {
      withoutCode++;
      noCode.push(n);
      noCodeButHasText.push(n); // all have explanation text
    }
    for (const s of steps) {
      if (s.code) codeSteps++;
      if (s.run) runSteps++;
      if (s.table) tableSteps++;
    }
  }
  console.log(JSON.stringify({ modules: 60, withCode, withoutCode, noCodeModules: noCode, totalSteps, codeSteps, explanationOnlySteps: totalSteps - codeSteps, runSteps, tableSteps }, null, 2));
}
main().catch((e) => { console.error(e); process.exit(1); });
