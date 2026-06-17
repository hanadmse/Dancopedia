import { test, expect } from '@playwright/test';
import { loginAsAdmin, loginAsUser, logout } from './helpers.js';

test.describe('Authentication and access control', () => {
  test('valid user login shows user dashboard and authenticated nav', async ({ page }) => {
    await loginAsUser(page);

    await expect(page.locator('h1')).toContainText('Welcome, testuser');
    await expect(page.locator('.sn-user')).toContainText('testuser');

    await logout(page);
    await expect(page.locator('body')).toBeVisible();
  });

  test('valid admin login shows admin dashboard and admin nav links', async ({ page }) => {
    await loginAsAdmin(page);

    await expect(page.locator('h1')).toContainText('Admin Panel');
    await expect(page.locator('.admin-hero-sub')).toContainText('admin');
    await expect(page.locator('.sn-links a[href$="admin"]')).toBeVisible();
    await expect(page.locator('.sn-links a[href$="admin/feedback"]')).toHaveText('Feedback');
    await expect(page.locator('.sn-links a', { hasText: 'Read Feedback' })).toHaveCount(0);
  });

  test('protected user pages redirect anonymous visitors to login', async ({ page }) => {
    await page.goto('user/contribute');
    await expect(page).toHaveURL(/auth\/login/);

    await page.goto('community/feedback');
    await expect(page.locator('#feedbackForm')).toHaveCount(0);

    await page.goto('user/home');
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('admin pages reject anonymous and normal user sessions', async ({ page }) => {
    await page.goto('admin/');
    await expect(page).toHaveURL(/auth\/login/);

    await loginAsUser(page);
    await page.goto('admin/');
    await expect(page).toHaveURL(/user\/home/);

    const response = await page.request.post('api/approve_dance.php', {
      data: { danceIds: [1] },
      headers: { 'X-CSRF-Token': 'invalid' },
    });
    expect(response.status()).toBe(403);
  });
});
