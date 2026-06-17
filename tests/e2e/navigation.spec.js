import { test, expect } from '@playwright/test';

test.describe('Dance Categories page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('categories/');
  });

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Dance Categories/i);
  });

  test('shows four category cards', async ({ page }) => {
    const cards = page.locator('.cat-card');
    await expect(cards).toHaveCount(4);
  });

  test('shows Traditional category', async ({ page }) => {
    await expect(page.locator('.cat-card >> text=Traditional')).toBeVisible();
  });

  test('shows Festival category', async ({ page }) => {
    await expect(page.locator('.cat-card >> text=Festival')).toBeVisible();
  });

  test('shows Partner category', async ({ page }) => {
    await expect(page.locator('.cat-card >> text=Partner')).toBeVisible();
  });

  test('shows Pop category', async ({ page }) => {
    await expect(page.locator('.cat-card >> text=Pop')).toBeVisible();
  });

  test('navigates to Traditional category page', async ({ page }) => {
    await page.click('a[href*="categories/traditional"]');
    await expect(page).toHaveURL(/traditional/i);
  });
});

test.describe('Regions page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('regions/');
  });

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Region/i);
  });

  test('shows four region cards', async ({ page }) => {
    await expect(page.locator('.cat-card')).toHaveCount(4);
  });

  test('shows Rio de Janeiro region', async ({ page }) => {
    await expect(page.locator('.cat-card >> text=Rio de Janeiro')).toBeVisible();
  });
});

test.describe('Search page', () => {
  test('loads with correct title', async ({ page }) => {
    await page.goto('search');
    await expect(page).toHaveTitle(/Search/i);
  });

  test('shows search input', async ({ page }) => {
    await page.goto('search');
    await expect(page.locator('#searchInput')).toBeVisible();
  });
});

test.describe('Timeline page', () => {
  test('loads with correct title', async ({ page }) => {
    await page.goto('pages/timeline');
    await expect(page).toHaveTitle(/Timeline/i);
  });
});

test.describe('Instruments page', () => {
  test('loads with correct title', async ({ page }) => {
    await page.goto('pages/instruments');
    await expect(page).toHaveTitle(/Instruments/i);
  });
});

test.describe('Feedback wall page', () => {
  test('is publicly accessible without login', async ({ page }) => {
    await page.goto('community/feedback-wall');
    await expect(page).toHaveTitle(/Feedback/i);
  });
});
