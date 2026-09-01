// Full sweep: all 60 module theory pages — render + overflow + console-error check.
// Runs in agent-browser via eval (page context) after hash navigation.
const results = [];
(async () => {
  const { execSync } = require('child_process');
  for (let m = 1; m <= 60; m++) {
    execSync(`agent-browser open "http://localhost:3000/#/module/${m}"`, { stdio: 'pipe' });
    await new Promise((r) => setTimeout(r, 2200));
    const check = execSync(`agent-browser eval "(() => { const col = document.querySelector('.max-w-3xl'); if (!col) return 'NO-COLUMN'; const h2 = col.querySelectorAll('h2').length; const paras = col.querySelectorAll('p').length; const callouts = Array.from(col.querySelectorAll('div')).filter(d => d.className.toString().includes('bg-neutral-100')).length; const diagrams = col.querySelectorAll('svg').length; const readBtn = !!col.querySelector('button'); const over = Array.from(col.querySelectorAll('p, h2, h3, section, div, code, pre')).filter(el => !el.className.toString().includes('truncate') && el.scrollWidth > el.clientWidth + 4 && getComputedStyle(el).overflowX !== 'auto' && getComputedStyle(el).overflowX !== 'scroll' && getComputedStyle(el).overflowX !== 'hidden'); return h2 + 'h2|' + paras + 'p|' + callouts + 'co|' + diagrams + 'svg|' + (readBtn ? 'btn' : 'nobtn') + '|' + (over.length === 0 ? 'CLEAN' : 'OVER' + over.length); })()"`, { encoding: 'utf8' });
    const val = check.trim().replace(/^"|"$/g, '');
    const ok = !val.includes('NO-COLUMN') && !val.includes('OVER') && val.includes('btn');
    results.push(`${ok ? 'OK' : 'FAIL'} M${m}: ${val}`);
  }
  console.log(results.join('\n'));
  console.log(`\nTOTAL: ${results.filter((r) => r.startsWith('OK')).length}/60 OK`);
})();
