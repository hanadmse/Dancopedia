import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const breadcrumbScript = readFileSync(
  path.join(repoRoot, 'src/web/assets/js/breadcrumb.js'),
  'utf8'
);

async function installBreadcrumb(page, containerHtml = '<div id="breadcrumb-container"></div>') {
  await page.setContent(containerHtml);
  await page.addScriptTag({ content: breadcrumbScript });
}

test.describe('breadcrumb.js rendering logic', () => {
  test('renders links on non-last items and a current span on the last item', async ({ page }) => {
    await installBreadcrumb(page);
    await page.evaluate(() => {
      window.DancopediaBreadcrumbs.render([
        { label: 'Home', href: '/' },
        { label: 'Categories', href: '/categories' },
        { label: 'Samba' },
      ]);
    });

    await expect(page.locator('.bc-item a[href="/"]')).toHaveText('Home');
    await expect(page.locator('.bc-item a[href="/categories"]')).toHaveText('Categories');
    await expect(page.locator('.bc-item--current span')).toHaveText('Samba');
    await expect(page.locator('.bc-item--current a')).toHaveCount(0);
  });

  test('places a separator after each non-last item', async ({ page }) => {
    await installBreadcrumb(page);
    await page.evaluate(() => {
      window.DancopediaBreadcrumbs.render([
        { label: 'Home', href: '/' },
        { label: 'Regions', href: '/regions' },
        { label: 'Pernambuco' },
      ]);
    });

    // 3 items → 2 non-last items → 2 separators
    await expect(page.locator('.bc-sep')).toHaveCount(2);
    await expect(page.locator('.bc-sep').first()).toHaveAttribute('aria-hidden', 'true');
  });

  test('does nothing when the target container is absent', async ({ page }) => {
    await page.setContent('<div></div>');
    await page.addScriptTag({ content: breadcrumbScript });
    await page.evaluate(() =>
      window.DancopediaBreadcrumbs.render([{ label: 'Home', href: '/' }])
    );
    await expect(page.locator('.bc-list')).toHaveCount(0);
  });

  test('does nothing for empty or null items arrays', async ({ page }) => {
    await installBreadcrumb(page);
    await page.evaluate(() => {
      window.DancopediaBreadcrumbs.render([]);
      window.DancopediaBreadcrumbs.render(null);
    });
    await expect(page.locator('.bc-list')).toHaveCount(0);
  });

  test('supports a custom container selector via options', async ({ page }) => {
    await installBreadcrumb(page, '<div id="custom-crumbs"></div>');
    await page.evaluate(() => {
      window.DancopediaBreadcrumbs.render(
        [{ label: 'Home', href: '/' }, { label: 'Dances' }],
        { container: '#custom-crumbs' }
      );
    });
    await expect(page.locator('#custom-crumbs .bc-list')).toBeVisible();
  });

  test('a single-item breadcrumb shows only the current span with no link or separator', async ({ page }) => {
    await installBreadcrumb(page);
    await page.evaluate(() => {
      window.DancopediaBreadcrumbs.render([{ label: 'Samba' }]);
    });
    await expect(page.locator('.bc-item--current span')).toHaveText('Samba');
    await expect(page.locator('.bc-item a')).toHaveCount(0);
    await expect(page.locator('.bc-sep')).toHaveCount(0);
  });
});
