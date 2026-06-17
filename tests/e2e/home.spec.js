import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads with correct title', async ({ page }) => {
    await page.goto('index.html');
    await expect(page).toHaveTitle(/Dancopedia Brazil/i);
  });

  test('shows hero heading', async ({ page }) => {
    await page.goto('index.html');
    await expect(page.locator('.hero-inner h1')).toContainText('Dancopedia');
  });

  test('has links to Categories and Regions', async ({ page }) => {
    await page.goto('index.html');
    await expect(page.locator('a[href$="categories"]').first()).toBeVisible();
    await expect(page.locator('a[href$="regions"]').first()).toBeVisible();
  });

  test('navigates to Categories page', async ({ page }) => {
    await page.goto('index.html');
    await page.click('a[href$="categories"]');
    await expect(page).toHaveURL(/categories/);
    await expect(page).toHaveTitle(/Dance Categories/i);
  });

  test('navigates to Regions page', async ({ page }) => {
    await page.goto('index.html');
    await page.click('a[href*="regions"]');
    await expect(page).toHaveURL(/regions/);
  });
});
