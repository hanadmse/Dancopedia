import { test, expect } from '@playwright/test';

test.describe('Public archive journeys', () => {
  test('home loads API-backed dance cards and opens a detail page', async ({ page }) => {
    await page.goto('index.html');

    const sambaCard = page.locator('.dance', { hasText: 'Samba' }).first();
    await expect(sambaCard).toBeVisible();
    await sambaCard.dispatchEvent('click');

    await expect(page).toHaveURL(/dances\//);
    await expect(page.locator('.dp-content-title')).toContainText('Samba');
    await expect(page.locator('.danceDescription')).toContainText(/Afro-Brazilian|Carnival/i);
  });

  test('category and region pages render filtered dances', async ({ page }) => {
    await page.goto('categories/traditional');
    await expect(page.locator('.cat-heading')).toContainText('Traditional Dances');
    await expect(page.locator('.dance', { hasText: 'Samba' })).toBeVisible();
    await expect(page.locator('.dance', { hasText: 'Frevo' })).toHaveCount(0);

    await page.goto('regions/pernambuco');
    await expect(page.locator('.cat-heading')).toContainText('Pernambuco');
    await expect(page.locator('.dance', { hasText: 'Frevo' })).toBeVisible();
  });

  test('search supports matching, empty query, and no-result states', async ({ page }) => {
    await page.goto('search?q=Samba');
    await expect(page.locator('.danceName', { hasText: 'Samba' })).toBeVisible();
    await expect(page.locator('.danceRegion')).toContainText('Rio de Janeiro');

    await page.goto('search');
    await page.locator('#searchInput').fill('not-a-real-dance-name');
    await page.locator('.search-bar button').click();
    await expect(page.locator('.results-status')).toContainText('No dances found');

    await page.locator('#searchInput').fill('');
    await page.locator('.search-bar button').click();
    await expect(page.locator('.results-status')).toContainText('Please enter a search term');
  });

  test('map pins open a panel and link to a dance detail page', async ({ page }) => {
    await page.goto('map');

    const firstPin = page.locator('.pin').first();
    await expect(firstPin).toBeVisible();
    await firstPin.click();

    await expect(page.locator('#panelCard')).toBeVisible();
    const detailButton = page.getByRole('button', { name: 'View dance page' });
    if (await detailButton.count()) {
      await detailButton.click();
    } else {
      await page.locator('.dance-list li').first().click();
    }

    await expect(page).toHaveURL(/dances\//);
    await expect(page.locator('.dance-page')).toBeVisible();
  });

  test('mobile drawer exposes core navigation and search', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('index.html');

    await page.locator('.sn-toggle').click();
    await expect(page.locator('#snCheck')).toBeChecked();
    await expect(page.locator('.sn-drawer a[href$="map"]')).toBeVisible();

    await page.locator('.sn-drawer-search input[name="q"]').fill('Frevo');
    await page.locator('.sn-drawer-search button').click();
    await expect(page).toHaveURL(/search\?q=Frevo/);
    await expect(page.locator('.danceName', { hasText: 'Frevo' })).toBeVisible();
  });
});
