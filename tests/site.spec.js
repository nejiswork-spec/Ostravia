import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/features', '/about', '/services', '/projects'];
for (const width of [1280, 375]) {
  for (const route of routes) {
    test(`${route} is accessible and responsive at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      const response = await page.goto(route);
      expect(response.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(await page.locator('h1').evaluate((el) => getComputedStyle(el).fontFamily)).toContain(
        'Manrope',
      );
      expect(await page.evaluate(() => document.fonts.check('400 24px Manrope'))).toBe(true);
      if (route === '/') {
        await expect(page.locator('.hero h1 .line')).toHaveCount(2);
        expect(
          await page
            .locator('.hero h1 .line')
            .evaluateAll((lines) => lines.every((el) => el.scrollWidth <= el.clientWidth + 1)),
        ).toBe(true);
      }
      const heroLayout = await page.locator('.hero-content,.intro-copy').evaluate((el) => {
        const box = el.getBoundingClientRect();
        return {
          alignment: getComputedStyle(el).textAlign,
          center: box.left + box.width / 2,
          viewport: innerWidth,
        };
      });
      expect(heroLayout.alignment).toBe('center');
      expect(Math.abs(heroLayout.center - heroLayout.viewport / 2)).toBeLessThan(2);
      const backgrounds = await page
        .locator(
          '.hero,.intro-image,.update-image,.care-photo,.method-image,.offering-photo,.feature-detail-image,.portfolio-image,.project',
        )
        .evaluateAll((elements) =>
          elements
            .map((el) => ({ selector: el.className, image: getComputedStyle(el).backgroundImage }))
            .filter((item) => item.image === 'none'),
        );
      expect(backgrounds).toEqual([]);
      expect(await page.locator('main').count()).toBe(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      const headingIsUncovered = await page.locator('h1').evaluate((el) => {
        const box = el.getBoundingClientRect();
        const top = document.elementFromPoint(
          Math.min(innerWidth - 10, box.left + 30),
          box.top + Math.min(20, box.height / 2),
        );
        return el.contains(top);
      });
      expect(headingIsUncovered).toBe(true);
      expect(
        await page
          .locator('.hero,.page-intro')
          .evaluate((el) => Math.round(el.getBoundingClientRect().height)),
      ).toBe(900);
      const axe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'])
        .analyze();
      expect(
        axe.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
      expect(errors).toEqual([]);
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 40));
        }
        window.scrollTo(0, 0);
      });
      await page.screenshot({
        path: `artifacts/${route === '/' ? 'home' : route.slice(1)}-${width}.png`,
        fullPage: true,
      });
    });
  }
}
test('contact dialogs open, trap focus, validate, and close with Escape', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Reach us', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const scan = await new AxeBuilder({ page })
    .include('.contact-dialog')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(scan.violations).toEqual([]);
  await dialog.getByRole('button', { name: 'Compose enquiry' }).click();
  await expect(dialog).toBeVisible();
  expect(await dialog.locator('input[name=name]').evaluate((el) => el.validity.valueMissing)).toBe(
    true,
  );
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Reach us', exact: true })).toBeFocused();
  await expect(
    page.locator('header').getByRole('button', { name: 'Let’s talk', exact: true }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Reach us', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
});
test('FAQ opens one answer at a time and supports keyboard use', async ({ page }) => {
  await page.goto('/services');
  const questions = page.locator('.faq-item button');
  await questions.nth(0).click();
  await expect(questions.nth(0)).toHaveAttribute('aria-expanded', 'true');
  await questions.nth(1).focus();
  await page.keyboard.press('Enter');
  await expect(questions.nth(1)).toHaveAttribute('aria-expanded', 'true');
  await expect(questions.nth(0)).toHaveAttribute('aria-expanded', 'false');
  await questions.nth(1).click();
  await expect(questions.nth(1)).toHaveAttribute('aria-expanded', 'false');
});
test('mobile menu opens and closes without overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Toggle navigation' });
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await page.getByRole('navigation').getByRole('link', { name: 'Services', exact: true }).click();
  await expect(page).toHaveURL(/\/services$/);
});
test('project filters and stories work', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.locator('.portfolio-card')).toHaveCount(4);
  await page.getByRole('button', { name: 'Gardens', exact: true }).click();
  await expect(page.locator('.portfolio-card')).toHaveCount(2);
  await page.getByRole('button', { name: 'Explore concept', exact: true }).first().click();
  await expect(page.locator('.project-story')).toBeVisible();
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('.portfolio-card')).toHaveCount(4);
});
test('all six testimonials have images and wrap in both directions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const next = page.getByRole('button', { name: 'Next testimonial' }),
    previous = page.getByRole('button', { name: 'Previous testimonial' });
  const names = new Set();
  for (let i = 0; i < 6; i++) {
    names.add(await page.locator('.testimonial-slide b').textContent());
    const img = page.locator('.testimonial-avatar img');
    await expect(img).toBeVisible();
    await expect.poll(() => img.evaluate((el) => el.complete && el.naturalWidth > 0)).toBe(true);
    await next.click();
  }
  expect(names.size).toBe(6);
  await expect(page.locator('.testimonial-slide b')).toHaveText('Michael Turner');
  await previous.click();
  await expect(page.locator('.testimonial-slide b')).toHaveText('James Okafor');
  await expect(page.getByRole('button', { name: /Pause testimonials/ })).toHaveCount(0);
});
test('detail popup closes and opens the contact dialog', async ({ page }) => {
  await page.goto('/');
  await page.locator('.updates').getByRole('button', { name: 'Learn More' }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.locator('.updates').getByRole('button', { name: 'Learn More' }).first().click();
  await page.getByRole('button', { name: 'Talk to our team' }).click();
  await expect(page.getByRole('heading', { name: 'Tell us about your space.' })).toBeVisible();
});
test('release serves security headers, 404s, and blocks private files', async ({ request }) => {
  const response = await request.get('/');
  expect(response.headers()['content-security-policy']).toContain("script-src 'self'");
  expect(response.headers()['x-content-type-options']).toBe('nosniff');
  expect(response.headers()['x-frame-options']).toBe('DENY');
  for (const path of ['/missing-page', '/.env', '/src/main.jsx', '/images/profile-prompts.json'])
    expect((await request.get(path)).status()).toBe(404);
});
