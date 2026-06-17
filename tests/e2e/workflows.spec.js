import { test, expect } from '@playwright/test';
import { loginAsAdmin, loginAsUser, logout, uniqueName } from './helpers.js';

const testImageFile = {
  name: 'test-dance.jpg',
  mimeType: 'image/jpeg',
  buffer: Buffer.from(
    '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAAR'
    + 'CAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAA'
    + 'AAAAAAAD/2gAMAwEAAhEDEQA/ACQAA//Z',
    'base64'
  ),
};

async function submitDance(page, danceName) {
  await page.goto('user/contribute');
  await page.locator('#danceName').fill(danceName);
  await page.locator('#danceCategory').selectOption('2');
  await page.locator('#danceRegion').selectOption('Pernambuco');
  await page.locator('#danceDescription').fill('Automated e2e dance submission for moderation coverage.');
  await page.locator('#danceImage').setInputFiles(testImageFile);
  await page.locator('#mapContainer').click({ position: { x: 260, y: 260 } });
  await page.getByRole('button', { name: 'Submit for review' }).click();
  await expect(page.locator('#feedback')).toContainText('Dance submitted');
}

async function approvePendingDance(page, danceName) {
  await page.goto('admin/');
  const row = page.locator('.pending-table tbody tr', { hasText: danceName });
  await expect(row).toBeVisible();
  await row.locator('.dance-checkbox').check();

  page.once('dialog', async dialog => {
    expect(dialog.message()).toMatch(/approved successfully/i);
    await dialog.accept();
  });
  await page.locator('#approve-button').click();
  await expect(row).toHaveCount(0);
}

test.describe('User and admin workflows', () => {
  test('user feedback is submitted and visible to admin', async ({ page }) => {
    const feedbackText = uniqueName('Feedback');

    await loginAsUser(page);
    await page.goto('community/feedback');
    await page.locator('#fname').fill('Test');
    await page.locator('#lname').fill('User');
    await page.locator('#continent').selectOption('north_america');
    await page.locator('#feedback').fill(feedbackText);
    await page.getByRole('button', { name: 'Submit feedback' }).click();
    await expect(page.locator('#toastSuccess')).toHaveClass(/fb-toast--visible/);

    await logout(page);
    await loginAsAdmin(page);
    await page.goto('admin/feedback');
    await expect(page.locator('#feedback-table-container')).toContainText(feedbackText);
    await expect(page.locator('#feedback-table-container')).toContainText('testuser');
  });

  test('create dance requires a map pin before submission', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('user/contribute');
    await page.locator('#danceName').fill(uniqueName('Missing Pin Dance'));
    await page.locator('#danceCategory').selectOption('1');
    await page.locator('#danceRegion').selectOption('Bahia');
    await page.locator('#danceDescription').fill('Description for pin validation test.');
    await page.locator('#danceImage').setInputFiles(testImageFile);

    await page.getByRole('button', { name: 'Submit for review' }).click();
    await expect(page.locator('#feedback')).toContainText('Please click the map to place a pin first');
    await expect(page.locator('#feedback')).toHaveClass(/err/);
  });

  test('submitted dance can be approved, edited, found publicly, and deleted by admin', async ({ page }) => {
    const danceName = uniqueName('E2E Frevo');
    const updatedName = `${danceName} Updated`;

    await loginAsUser(page);
    await submitDance(page, danceName);

    await logout(page);
    await loginAsAdmin(page);
    await approvePendingDance(page, danceName);

    await page.goto(`search?q=${encodeURIComponent(danceName)}`);
    await expect(page.locator('.danceName', { hasText: danceName })).toBeVisible();
    await page.locator('.dance', { hasText: danceName }).first().click();
    await expect(page.locator('.dance-update-btn')).toBeVisible();
    await expect(page.locator('.dance-delete-btn')).toBeVisible();

    await page.locator('.dance-update-btn').click();
    await page.locator('#updateDanceName').fill(updatedName);
    await page.locator('#updateDanceRegion').selectOption('4');
    await page.locator('#updateDanceCategory').selectOption('1');
    await page.locator('#updateDanceDescription').fill('Updated by the admin e2e workflow.');

    page.once('dialog', async dialog => {
      expect(dialog.message()).toMatch(/updated successfully/i);
      await dialog.accept();
    });
    await page.locator('.dance-update-btn').click();
    await expect(page.locator('.dp-content-title')).toContainText(updatedName);

    await page.reload();
    await expect(page.locator('.dp-content-title')).toContainText(updatedName);
    await expect(page.locator('.dp-meta-region')).toContainText('Bahia');
    await expect(page.locator('.dp-meta-category')).toContainText('Traditional');

    let dialogCount = 0;
    page.on('dialog', async dialog => {
      dialogCount += 1;
      if (dialogCount === 1) {
        expect(dialog.message()).toMatch(/delete this dance/i);
      } else {
        expect(dialog.message()).toMatch(/deleted successfully/i);
      }
      await dialog.accept();
    });

    await page.locator('.dance-delete-btn').click();
    await expect(page).toHaveURL(/\/$/);

    await page.goto(`search?q=${encodeURIComponent(updatedName)}`);
    await expect(page.locator('.results-status')).toContainText('No dances found');
  });

  test('admin can approve submitted feedback', async ({ page }) => {
    const feedbackText = uniqueName('Feedback');

    await loginAsUser(page);
    await page.goto('community/feedback');
    await page.locator('#fname').fill('Test');
    await page.locator('#lname').fill('User');
    await page.locator('#continent').selectOption('north_america');
    await page.locator('#feedback').fill(feedbackText);
    await page.getByRole('button', { name: 'Submit feedback' }).click();
    await expect(page.locator('#toastSuccess')).toHaveClass(/fb-toast--visible/);

    await logout(page);
    await loginAsAdmin(page);
    await page.goto('admin/feedback');
    const feedbackRow = page.locator('#feedback-table-container tr', { hasText: feedbackText });
    await expect(feedbackRow).toBeVisible();
    const approvalDone = page.waitForResponse(r => r.url().includes('approve_feedback.php'));
    await feedbackRow.locator('.btn-approve').click();
    await approvalDone;
    await expect(feedbackRow.locator('.btn-approve')).toHaveCount(0);
  });

  test('approved feedback appears on the public feedback wall', async ({ page }) => {
    const feedbackText = uniqueName('WallFeedback');

    await loginAsUser(page);
    await page.goto('community/feedback');
    await page.locator('#fname').fill('Wall');
    await page.locator('#lname').fill('Tester');
    await page.locator('#continent').selectOption('europe');
    await page.locator('#feedback').fill(feedbackText);
    await page.getByRole('button', { name: 'Submit feedback' }).click();
    await expect(page.locator('#toastSuccess')).toHaveClass(/fb-toast--visible/);

    await logout(page);
    await loginAsAdmin(page);
    await page.goto('admin/feedback');
    const feedbackRow = page.locator('#feedback-table-container tr', { hasText: feedbackText });
    await expect(feedbackRow).toBeVisible();
    const wallApprovalDone = page.waitForResponse(r => r.url().includes('approve_feedback.php'));
    await feedbackRow.locator('.btn-approve').click();
    await wallApprovalDone;

    await logout(page);
    await page.goto('community/feedback');
    await expect(page.locator('#feedback-grid .fb-card', { hasText: feedbackText })).toBeVisible();
  });
});
