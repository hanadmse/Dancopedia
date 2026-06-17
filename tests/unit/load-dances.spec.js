import { expect, test } from '@playwright/test';
import path from 'node:path';

const scriptPath = path.resolve(import.meta.dirname, '../../src/web/assets/js/load_dances.js');

async function openUnitPage(page) {
  await page.route('http://unit.test/', route => route.fulfill({
    contentType: 'text/html',
    body: '<!doctype html><html><body><main id="danceContainer"></main></body></html>',
  }));
  await page.goto('http://unit.test/');
  await page.addScriptTag({ path: scriptPath });
}

test.describe('load_dances.js unit behavior', () => {
  test('posts filters and safely renders dance cards', async ({ page }) => {
    await openUnitPage(page);

    let requestBody;
    await page.route('**/api/fetch_dances.php', async route => {
      requestBody = route.request().postDataJSON();
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify([
          {
            dance_id: 42,
            dance_name: '<img src=x onerror=alert(1)>Samba & Co',
            media_url: 'assets/images/samba_img.jpg',
            alttext: '"Samba" <dance>',
            description: '<script>alert(1)</script> Afro-Brazilian rhythm',
            region: 'Rio <RJ>',
            category: 'Traditional & Popular',
          },
        ]),
      });
    });

    await page.evaluate(() => window.loadDances('Rio de Janeiro', 'Traditional'));

    await expect(page.locator('.dance')).toHaveCount(1);
    expect(requestBody).toEqual({ region: 'Rio de Janeiro', category: 'Traditional' });
    await expect(page.locator('.danceName')).toHaveText('<img src=x onerror=alert(1)>Samba & Co');
    await expect(page.locator('.danceDescription')).toHaveText('<script>alert(1)</script> Afro-Brazilian rhythm');
    await expect(page.locator('.danceRegion')).toContainText('Rio <RJ>');
    await expect(page.locator('img[src="x"]')).toHaveCount(0);
    await expect(page.locator('.dance img')).toHaveAttribute('alt', '"Samba" <dance>');
  });

  test('renders compact scrolling cards without descriptions', async ({ page }) => {
    await openUnitPage(page);
    await page.locator('#danceContainer').evaluate(element => element.classList.add('scrolling'));

    await page.route('**/api/fetch_dances.php', route => route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify([
        {
          dance_id: 7,
          dance_name: 'Frevo',
          media_url: '',
          alttext: '',
          description: 'Should not render in compact mode',
          region: 'Pernambuco',
          category: 'Festival',
        },
      ]),
    }));

    await page.evaluate(() => window.loadDances('Pernambuco', null));

    await expect(page.locator('.dance-wrapper .dance')).toHaveCount(1);
    await expect(page.locator('.danceName')).toHaveText('Frevo');
    await expect(page.locator('.danceDescription')).toHaveCount(0);
    await expect(page.locator('.dance-no-img')).toHaveCount(1);
  });

  test('shows empty and fetch error states', async ({ page }) => {
    await openUnitPage(page);

    await page.route('**/api/fetch_dances.php', route => route.fulfill({
      contentType: 'application/json',
      body: '[]',
    }));
    await page.evaluate(() => window.loadDances());
    await expect(page.locator('#danceContainer')).toContainText('No dances found.');

    await page.unroute('**/api/fetch_dances.php');
    await page.route('**/api/fetch_dances.php', route => route.abort());
    await page.evaluate(() => window.loadDances());
    await expect(page.locator('#danceContainer')).toContainText('Error loading data.');
  });

  test('renders a single dance page with admin actions when enabled', async ({ page }) => {
    await openUnitPage(page);
    await page.evaluate(() => { window.isAdmin = true; });

    await page.route('**/api/fetch_dances.php', route => route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify([
        {
          dance_id: 99,
          dance_name: 'Maracatu',
          media_url: '/uploads/maracatu.jpg',
          alttext: 'Maracatu dancer',
          description: 'A traditional performance from Pernambuco.',
          region: 'Pernambuco',
          category: 'Traditional',
        },
      ]),
    }));

    await page.evaluate(() => window.loadSingleDance(99));

    await expect(page.locator('.dance-page[data-dance-id="99"]')).toBeVisible();
    await expect(page.locator('.dp-content-title')).toHaveText('Maracatu');
    await expect(page.locator('.dance-update-btn')).toHaveAttribute('data-dance-id', '99');
    await expect(page.locator('.dance-delete-btn')).toHaveAttribute('data-dance-id', '99');
  });

  test('clicking a rendered card navigates to its detail page', async ({ page }) => {
    await openUnitPage(page);

    await page.route('**/dances/bossa-nova', route => route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><title>Dance detail</title>',
    }));
    await page.route('**/api/fetch_dances.php', route => route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify([
        {
          dance_id: 5,
          dance_name: 'Bossa Nova',
          slug: 'bossa-nova',
          media_url: '',
          alttext: '',
          description: '',
          region: 'Rio de Janeiro',
          category: 'Partner',
        },
      ]),
    }));

    await page.evaluate(() => {
      window.API_BASE = '/dancopedia/src/web/';
      window.loadDances();
    });
    await page.locator('.dance').click();
    await page.waitForURL('**/dances/bossa-nova');

    expect(page.url()).toContain('dances/bossa-nova');
  });

  test('loadSingleDanceBySlug sends slug filter and renders the dance', async ({ page }) => {
    await openUnitPage(page);

    let requestBody;
    await page.route('**/api/fetch_dances.php', async route => {
      requestBody = route.request().postDataJSON();
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify([{
          dance_id: 7,
          dance_name: 'Frevo',
          slug: 'frevo',
          media_url: '',
          alttext: '',
          description: 'A high-energy carnival dance.',
          region: 'Pernambuco',
          category: 'Festival',
        }]),
      });
    });

    await page.evaluate(() => window.loadSingleDanceBySlug('frevo'));

    expect(requestBody).toEqual({ slug: 'frevo' });
    await expect(page.locator('.dp-content-title')).toHaveText('Frevo');
    await expect(page.locator('.dp-meta-region')).toContainText('Pernambuco');
  });

  test('toSlug generates URL-safe slugs from dance names', async ({ page }) => {
    await openUnitPage(page);
    const results = await page.evaluate(() => ({
      basic:    window.toSlug('Bossa Nova'),
      accented: window.toSlug('Forró'),
      spaces:   window.toSlug('  Samba  '),
      multi:    window.toSlug('Maracatu--Dance'),
    }));
    expect(results.basic).toBe('bossa-nova');
    expect(results.accented).toBe('forro');
    expect(results.spaces).toBe('samba');
    expect(results.multi).toBe('maracatu-dance');
  });

  test('resolveImgUrl prepends API_BASE to relative URLs only', async ({ page }) => {
    await openUnitPage(page);
    const results = await page.evaluate(() => {
      window.API_BASE = '/dancopedia/src/web/';
      return {
        absolute:     window.resolveImgUrl('https://example.com/img.jpg'),
        rootRelative: window.resolveImgUrl('/uploads/img.jpg'),
        relative:     window.resolveImgUrl('assets/img.jpg'),
        empty:        window.resolveImgUrl(''),
        nullish:      window.resolveImgUrl(null),
      };
    });
    expect(results.absolute).toBe('https://example.com/img.jpg');
    expect(results.rootRelative).toBe('/uploads/img.jpg');
    expect(results.relative).toBe('/dancopedia/src/web/assets/img.jpg');
    expect(results.empty).toBe('');
    expect(results.nullish).toBe('');
  });
});
