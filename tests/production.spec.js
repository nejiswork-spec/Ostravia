import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/features', '/about', '/services', '/projects'];

test('essential content, navigation, and FAQ work without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(
      page.getByRole('navigation').getByRole('link', { name: 'Services', exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'hello@ostravia.com', exact: true })).toBeVisible();
  }
  await page.goto('/services');
  await page.locator('.faq-item summary').first().click();
  await expect(page.locator('.faq-item').first()).toHaveAttribute('open', '');
  await expect(page.locator('.faq-item').first().locator('p')).toBeVisible();
  await context.close();
});

for (const viewport of [
  { width: 320, height: 568 },
  { width: 768, height: 1024 },
  { width: 844, height: 390 },
]) {
  test(`all pages reflow at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      expect(
        await page.locator('h1').evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
        route,
      ).toBe(true);
      const overlap = await page.locator('h1').evaluate((el) => {
        const header = document.querySelector('header').getBoundingClientRect();
        return el.getBoundingClientRect().top < header.bottom;
      });
      expect(overlap, `${route}: heading overlaps header`).toBe(false);
    }
  });
}

test('skip link and mobile menu return keyboard focus correctly', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  const toggle = page.getByRole('button', { name: 'Toggle navigation' });
  await toggle.click();
  await page.getByRole('navigation').getByRole('link', { name: 'About', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
});

test('hero text remains readable when text sizes are doubled', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const route of routes) {
    await page.goto(route);
    await page.evaluate(() => {
      const elements = [
        ...document.querySelectorAll('h1,h1 span,.hero-intro,.intro-bottom p,.hero-actions a'),
      ];
      const sizes = elements.map((el) => parseFloat(getComputedStyle(el).fontSize) * 2);
      elements.forEach((el, index) => (el.style.fontSize = `${sizes[index]}px`));
    });
    expect(
      await page.locator('h1').evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
      route,
    ).toBe(true);
    expect(
      await page
        .locator('.hero,.page-intro')
        .evaluate((el) => el.scrollHeight <= el.clientHeight + 1),
      route,
    ).toBe(true);
  }
});

test('contact dialog contains keyboard focus and remains usable on a small screen', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/services');
  await page.getByRole('button', { name: 'Reach us', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement.closest('dialog'))).toBe(true);
  }
  await expect(
    page.getByRole('dialog').getByRole('button', { name: 'Compose enquiry', exact: true }),
  ).toBeVisible();
  const scan = await new AxeBuilder({ page })
    .include('.contact-dialog')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(scan.violations).toEqual([]);
});

test('optional animation and font failures do not block content or enquiry controls', async ({
  page,
}) => {
  await page.route(/\/assets\/motion-.*\.js|\.woff2$/, (route) => route.abort());
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.mouse.move(150, 200);
  await expect(page.locator('h1')).toBeVisible();
  await page.getByRole('button', { name: 'Reach us', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(errors).toEqual([]);
});

test('testimonial rotation can be disabled without a pause button', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  const rotation = page.getByRole('checkbox', { name: 'Auto-rotate stories', exact: true });
  await rotation.scrollIntoViewIfNeeded();
  await rotation.uncheck();
  const name = await page.locator('.testimonial-slide b').textContent();
  await page.locator('h1').click();
  await page.clock.fastForward(15000);
  await expect(page.locator('.testimonial-slide b')).toHaveText(name);
  await expect(rotation).not.toBeChecked();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('checkbox', { name: /^Auto-rotate stories/ })).toBeDisabled();
});

test('all local links, images, and public social previews resolve', async ({ page, request }) => {
  const checked = new Set();
  for (const route of routes) {
    await page.goto(route);
    const links = await page
      .locator('a[href^="/"]')
      .evaluateAll((elements) => elements.map((el) => el.getAttribute('href')));
    for (const href of links) {
      if (checked.has(href)) continue;
      checked.add(href);
      expect((await request.get(href)).status(), href).toBe(200);
    }
    const anchors = await page
      .locator('a[href^="#"]')
      .evaluateAll((elements) => elements.map((el) => el.hash.slice(1)));
    for (const id of anchors) await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
    const html = await (await request.get(route)).text();
    const image = new URL(html.match(/property="og:image" content="([^"]+)"/)[1]);
    const response = await request.get(image.pathname);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/jpeg');
    await page.evaluate(async () => {
      for (const image of document.images) {
        image.loading = 'eager';
        try {
          await image.decode();
        } catch {
          /* Assert failures below. */
        }
      }
    });
    expect(
      await page
        .locator('img')
        .evaluateAll((images) =>
          images
            .filter((image) => !image.complete || !image.naturalWidth)
            .map((image) => image.src),
        ),
    ).toEqual([]);
  }
});
