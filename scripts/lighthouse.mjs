import { chromium } from '@playwright/test';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('artifacts/lighthouse', { recursive: true });
const chrome = await launch({
  chromePath:
    process.env.CHROME_PATH ||
    (process.platform === 'win32'
      ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
      : chromium.executablePath()),
  chromeFlags: ['--headless=new', '--no-first-run', '--no-default-browser-check'],
});
const summary = [];
try {
  for (const mode of ['mobile', 'desktop']) {
    for (const route of ['/', '/features', '/about', '/services', '/projects']) {
      const name = route === '/' ? 'home' : route.slice(1);
      const result = await lighthouse(`http://127.0.0.1:4187${route}`, {
        port: chrome.port,
        output: ['json', 'html'],
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        ...(mode === 'desktop'
          ? {
              formFactor: 'desktop',
              screenEmulation: {
                mobile: false,
                width: 1350,
                height: 940,
                deviceScaleFactor: 1,
                disabled: false,
              },
              throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
            }
          : {}),
      });
      await writeFile(`artifacts/lighthouse/${name}-${mode}.json`, result.report[0]);
      await writeFile(`artifacts/lighthouse/${name}-${mode}.html`, result.report[1]);
      const scores = Object.fromEntries(
        Object.entries(result.lhr.categories).map(([key, value]) => [
          key,
          Math.round(value.score * 100),
        ]),
      );
      const failed = Object.values(result.lhr.audits)
        .filter((a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== 'informative')
        .map((a) => ({ id: a.id, title: a.title, score: a.score, displayValue: a.displayValue }));
      summary.push({
        route,
        mode,
        scores,
        metrics: {
          lcp: result.lhr.audits['largest-contentful-paint'].numericValue,
          cls: result.lhr.audits['cumulative-layout-shift'].numericValue,
          tbt: result.lhr.audits['total-blocking-time'].numericValue,
        },
        failed,
      });
      console.log(JSON.stringify(summary.at(-1)));
    }
  }
} finally {
  await chrome.kill();
  await writeFile('artifacts/lighthouse-summary.json', JSON.stringify(summary, null, 2));
}
if (
  summary.some(
    (run) =>
      run.scores.performance < 90 ||
      run.scores.accessibility < 100 ||
      run.scores['best-practices'] < 95 ||
      run.scores.seo < 100,
  )
)
  process.exitCode = 1;
