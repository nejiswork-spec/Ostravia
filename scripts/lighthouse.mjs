import { chromium } from '@playwright/test';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { mkdir, writeFile } from 'node:fs/promises';

const baseUrl = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4187';
const outputDirectory = process.env.LIGHTHOUSE_OUTPUT_DIR || 'artifacts/lighthouse';
const routes = process.env.LIGHTHOUSE_ROUTES?.split(',') || [
  '/',
  '/features',
  '/about',
  '/services',
  '/projects',
];
const modes = process.env.LIGHTHOUSE_MODES?.split(',') || ['mobile', 'desktop'];
await mkdir(outputDirectory, { recursive: true });
const chrome = await launch({
  chromePath:
    process.env.CHROME_PATH ||
    (process.platform === 'win32'
      ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
      : chromium.executablePath()),
  chromeFlags: ['--headless=new', '--no-first-run', '--no-default-browser-check'],
});
const summary = [];
async function measure(url, options) {
  let result;
  for (let attempt = 1; attempt <= 3; attempt++) {
    result = await lighthouse(url, options);
    if (!result.lhr.runtimeError) return result;
    console.warn(`Lighthouse recording failed (${attempt}/3): ${result.lhr.runtimeError.code}`);
  }
  return result;
}
try {
  for (const mode of modes) {
    for (const route of routes) {
      const name = route === '/' ? 'home' : route.slice(1);
      const result = await measure(new URL(route, baseUrl).href, {
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
      await writeFile(`${outputDirectory}/${name}-${mode}.json`, result.report[0]);
      await writeFile(`${outputDirectory}/${name}-${mode}.html`, result.report[1]);
      if (result.lhr.runtimeError)
        throw new Error(`${route} ${mode}: ${result.lhr.runtimeError.message}`);
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
  await writeFile(`${outputDirectory}-summary.json`, JSON.stringify(summary, null, 2));
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
