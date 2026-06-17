import { test, expect } from '@playwright/test';

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('auth/login');
  });

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Login/i);
  });

  test('shows username and password fields', async ({ page }) => {
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('shows sign in button', async ({ page }) => {
    await expect(page.locator('button[name="submit"]')).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.fill('#username', 'nonexistentuser');
    await page.fill('#password', 'wrongpassword');
    await page.click('button[name="submit"]');
    await expect(page.locator('.error-msg')).toContainText('Incorrect username or password');
  });

  test('has link to registration page', async ({ page }) => {
    await page.click('a[href*="auth/register"]');
    await expect(page).toHaveURL(/auth\/register/);
  });

  test('has link back to home', async ({ page }) => {
    await page.getByRole('link', { name: /back to home/i }).click();
    await expect(page).toHaveURL(/\/$|index\.html/);
  });
});

test.describe('Register page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('auth/register');
  });

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Create Account/i);
  });

  test('shows all registration fields', async ({ page }) => {
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#cpassword')).toBeVisible();
  });

  test('shows error when passwords do not match', async ({ page }) => {
    await page.fill('#name', `pw-mismatch-${Date.now()}`);
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password123');
    await page.fill('#cpassword', 'differentpassword');
    await page.click('button[name="submit"]');
    await expect(page.locator('.error-msg')).toContainText('Passwords do not match');
  });

  test('has link to login page', async ({ page }) => {
    await page.click('a[href*="auth/login"]');
    await expect(page).toHaveURL(/auth\/login/);
  });
});
