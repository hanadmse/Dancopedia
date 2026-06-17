import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const loadDancesPath = path.join(repoRoot, 'src/web/assets/js/load_dances.js');
const chatboxPath = path.join(repoRoot, 'src/web/assets/js/chatbox.js');
const chatboxScript = readFileSync(chatboxPath, 'utf8');
const chatboxFixtureScript = chatboxScript.replace(
  'const script = document.currentScript || document.querySelector(\'script[src*="/assets/js/chatbox.js"], script[src*="assets/js/chatbox.js"]\');',
  'const script = { src: "http://unit.test/assets/js/chatbox.js" };'
);
const chatboxHtml = readFileSync(path.join(repoRoot, 'src/web/partials/chatbox.html'), 'utf8');
const searchScriptPath = path.join(repoRoot, 'src/web/assets/js/search.js');
const mapScriptPath = path.join(repoRoot, 'src/web/assets/js/map.js');

async function installLoadDancesFixture(page, extraMarkup = '') {
  await page.setContent(`
    <base href="http://unit.test/">
    <div id="danceContainer"${extraMarkup}></div>
  `);
  await page.addScriptTag({ path: loadDancesPath });
}

test.describe('load_dances.js rendering logic', () => {
  test('renders escaped dance cards from mocked API data', async ({ page }) => {
    await page.route('**/api/fetch_dances.php', route => route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify([{
        dance_id: '42',
        dance_name: '<script>bad</script>',
        description: 'History & culture <b>bold</b>',
        region: 'Rio "Centro"',
        category: "Traditional's",
        media_url: 'assets/images/samba.jpg',
        alttext: 'Samba <image>',
      }]),
    }));

    await installLoadDancesFixture(page);
    await page.evaluate(() => window.loadDances());

    await expect(page.locator('.dance')).toHaveCount(1);
    await expect(page.locator('.danceName')).toHaveText('<script>bad</script>');
    await expect(page.locator('.danceDescription')).toHaveText('History & culture <b>bold</b>');
    await expect(page.locator('script', { hasText: 'bad' })).toHaveCount(0);
    await expect(page.locator('.dance img')).toHaveAttribute('src', /assets\/images\/samba\.jpg$/);
    await expect(page.locator('.dance img')).toHaveAttribute('alt', 'Samba <image>');
  });

  test('renders placeholders and empty/error states', async ({ page }) => {
    await page.route('**/api/fetch_dances.php', route => route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify([{ dance_id: 7, dance_name: 'No Image Dance' }]),
    }));

    await installLoadDancesFixture(page);
    await page.evaluate(() => window.loadDances());
    await expect(page.locator('.dance-no-img')).toHaveCount(1);

    await page.unroute('**/api/fetch_dances.php');
    await page.route('**/api/fetch_dances.php', route => route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify([]),
    }));
    await page.evaluate(() => window.loadDances());
    await expect(page.locator('#danceContainer')).toContainText('No dances found.');

    await page.unroute('**/api/fetch_dances.php');
    await page.route('**/api/fetch_dances.php', route => route.abort());
    await page.evaluate(() => window.loadDances());
    await expect(page.locator('#danceContainer')).toContainText('Error loading data.');
  });

  test('adds admin controls only for admin single-dance rendering', async ({ page }) => {
    await installLoadDancesFixture(page);
    const dance = {
      dance_id: 5,
      dance_name: 'Frevo',
      description: 'Fast dance',
      region: 'Pernambuco',
      category: 'Festival',
      media_url: '',
      alttext: '',
    };

    const anonymousHtml = await page.evaluate(danceData => window.createDancePage(danceData), dance);
    expect(anonymousHtml).not.toContain('dance-update-btn');
    expect(anonymousHtml).not.toContain('dance-delete-btn');

    const adminHtml = await page.evaluate(danceData => {
      window.isAdmin = true;
      return window.createDancePage(danceData);
    }, dance);
    expect(adminHtml).toContain('dance-update-btn');
    expect(adminHtml).toContain('dance-delete-btn');
  });
});

test.describe('search page client logic', () => {
  async function installSearchFixture(page) {
    await page.setContent(`
      <base href="http://unit.test/">
      <input id="searchInput">
      <button type="button" onclick="searchDance()">Search</button>
      <p id="resultsHeading" style="display:none">Results</p>
      <div id="danceContainer"></div>
    `);
    await page.addScriptTag({ path: searchScriptPath });
  }

  test('encodes search requests and escapes rendered results', async ({ page }) => {
    let requestedUrl = '';
    await page.route('**/api/dance_search.php?**', route => {
      requestedUrl = route.request().url();
      return route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify([{
          dance_id: 11,
          dance_name: '<img src=x onerror=alert(1)>',
          description: 'Safe & sound',
          region: 'Bahia',
          category: 'Pop',
          media_url: '',
          alttext: '',
        }]),
      });
    });

    await installSearchFixture(page);
    const query = 'Samba & Frevo/Forro';
    await page.locator('#searchInput').fill(query);
    await page.evaluate(() => window.searchDance());

    await expect(page.locator('.danceName')).toHaveText('<img src=x onerror=alert(1)>');
    expect(new URL(requestedUrl).searchParams.get('search')).toBe(query);
    await expect(page.locator('.danceName img')).toHaveCount(0);
  });

  test('shows an error state when the search API fails', async ({ page }) => {
    await page.route('**/api/dance_search.php?**', route => route.abort());
    await installSearchFixture(page);

    await page.locator('#searchInput').fill('Samba');
    await page.evaluate(() => window.searchDance());

    await expect(page.locator('.results-status')).toHaveText('Error loading results. Please try again.');
  });
});

test.describe('chatbox.js client logic', () => {
  const chatEndpoint = '**/api/chat.php';

  async function installChatboxFixture(page, url = null) {
    await page.route('**/assets/css/Chatbox.css', route => route.fulfill({
      contentType: 'text/css',
      body: '.cb-fab{}',
    }));
    const fixtureHtml = `
        <base href="http://unit.test/">
        ${chatboxHtml}
      `;

    if (url) {
      await page.route(url, route => route.fulfill({
        contentType: 'text/html',
        body: fixtureHtml,
      }));
      await page.goto(url);
    } else {
      await page.setContent(fixtureHtml);
    }

    await page.addScriptTag({ content: chatboxFixtureScript });
    await page.evaluate(() => document.getElementById('cbHide')?.remove());
  }

  test('toggles the panel open and closed', async ({ page }) => {
    await installChatboxFixture(page, 'http://unit.test/first-page.html');

    await page.evaluate(() => document.getElementById('cbToggle').click());
    await expect(page.locator('#cbPanel')).toHaveClass(/cb-open/);
    await expect(page.locator('#cbPanel')).toHaveAttribute('aria-hidden', 'false');

    await page.evaluate(() => document.getElementById('cbClose').click());
    await expect(page.locator('#cbPanel')).not.toHaveClass(/cb-open/);
    await expect(page.locator('#cbPanel')).toHaveAttribute('aria-hidden', 'true');
  });

  test('ignores blank messages and does not call fetch', async ({ page }) => {
    let fetchCalls = 0;
    await page.route(chatEndpoint, route => {
      fetchCalls += 1;
      return route.fulfill({ contentType: 'application/json', body: '{}' });
    });
    await installChatboxFixture(page, 'http://unit.test/second-page.html');

    await page.evaluate(() => {
      document.getElementById('cbToggle').click();
      document.getElementById('cbInput').value = '   ';
      document.getElementById('cbSend').click();
    });

    expect(fetchCalls).toBe(0);
    await expect(page.locator('.cb-msg--user')).toHaveCount(0);
  });

  test('sends a valid message and renders the mocked AI response', async ({ page }) => {
    await page.route(chatEndpoint, async route => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
        return;
      }

      await route.fulfill({
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ response: 'Samba is a Brazilian dance.' }),
      });
    });
    await installChatboxFixture(page, 'http://unit.test/chat-first.html');

    await page.evaluate(() => {
      document.getElementById('cbToggle').click();
      document.getElementById('cbInput').value = 'Tell me about Samba';
      document.getElementById('cbSend').click();
    });

    await expect(page.locator('.cb-msg--user .cb-bubble')).toHaveText('Tell me about Samba');
    await expect(page.locator('.cb-msg--ai .cb-bubble').last()).toHaveText('Samba is a Brazilian dance.');
    await expect(page.locator('#cbTyping')).toHaveCount(0);
    await expect(page.locator('#cbSend')).toBeEnabled();
  });

  test('restores an open conversation when the chatbox is mounted again in the same tab', async ({ page }) => {
    await page.route(chatEndpoint, route => route.fulfill({
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ response: 'Samba is a Brazilian dance.' }),
    }));
    await installChatboxFixture(page, 'http://unit.test/chat-first.html');

    await page.evaluate(() => {
      document.getElementById('cbToggle').click();
      document.getElementById('cbInput').value = 'Tell me about Samba';
      document.getElementById('cbSend').click();
    });
    await expect(page.locator('.cb-msg--ai .cb-bubble').last()).toHaveText('Samba is a Brazilian dance.');
    await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('dancopedia.chatbox.state')).isOpen)).toBe(true);

    await installChatboxFixture(page, 'http://unit.test/chat-second.html');

    await expect(page.locator('#cbPanel')).toHaveClass(/cb-open/);
    await expect(page.locator('#cbPanel')).toHaveAttribute('aria-hidden', 'false');
    await expect(page.locator('.cb-msg--user .cb-bubble')).toHaveText('Tell me about Samba');
    await expect(page.locator('.cb-msg--ai .cb-bubble').last()).toHaveText('Samba is a Brazilian dance.');
  });

  test('clears the saved conversation when the chatbox is closed', async ({ page }) => {
    await page.route(chatEndpoint, route => route.fulfill({
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ response: 'Frevo is in the catalog.' }),
    }));
    await installChatboxFixture(page);

    await page.evaluate(() => {
      document.getElementById('cbToggle').click();
      document.getElementById('cbInput').value = 'Tell me about Frevo';
      document.getElementById('cbSend').click();
    });
    await expect(page.locator('.cb-msg--ai .cb-bubble').last()).toHaveText('Frevo is in the catalog.');

    await page.evaluate(() => document.getElementById('cbClose').click());
    await installChatboxFixture(page);

    await expect(page.locator('#cbPanel')).not.toHaveClass(/cb-open/);
    await expect(page.locator('.cb-msg--user')).toHaveCount(0);
    await expect(page.locator('.cb-msg--ai .cb-bubble')).toHaveCount(1);
    await expect(page.locator('.cb-msg--ai .cb-bubble')).toContainText('Hi! Ask me anything about Brazilian dances');
  });

  test('recovers from chatbot fetch failures', async ({ page }) => {
    await page.route(chatEndpoint, route => route.abort());
    await installChatboxFixture(page);

    await page.evaluate(() => {
      document.getElementById('cbToggle').click();
      document.getElementById('cbInput').value = 'Tell me about Frevo';
      document.getElementById('cbSend').click();
    });

    await expect(page.locator('.cb-msg--ai .cb-bubble').last()).toHaveText('Connection error — please try again.');
    await expect(page.locator('#cbTyping')).toHaveCount(0);
    await expect(page.locator('#cbSend')).toBeEnabled();
  });
});

test.describe('map page display logic', () => {
  async function installMapFixture(page) {
    await page.setContent(`
      <base href="http://unit.test/">
      <div id="mapContainer"></div>
      <div id="panelIdle" style="display:block"></div>
      <div id="panelCard" style="display:none"></div>
    `);
    await page.addScriptTag({ content: 'window.DancopediaBreadcrumbs = { render: () => {}, basePath: "/" };' });
    await page.addScriptTag({ path: mapScriptPath });
  }

  test('clusters nearby dances and leaves distant dances separate', async ({ page }) => {
    await page.route('**/api/fetch_map_dances.php', route => route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify([
        { dance_id: 1, dance_name: 'Samba', region: 'Rio', x: 100, y: 100 },
        { dance_id: 2, dance_name: 'Bossa', region: 'Rio', x: 110, y: 108 },
        { dance_id: 3, dance_name: 'Frevo', region: 'Pernambuco', x: 300, y: 300 },
      ]),
    }));
    await installMapFixture(page);
    await page.evaluate(() => window.loadMapDances());

    await expect(page.locator('.pin')).toHaveCount(2);
    await expect(page.locator('.pin', { hasText: '2' })).toHaveCount(1);
  });

  test('renders single and multi-dance cards and closes them', async ({ page }) => {
    await installMapFixture(page);

    await page.evaluate(() => window.openCard([{
      dance_id: 1,
      dance_name: 'Frevo',
      region: 'Pernambuco',
      description: 'Festival dance',
      media_url: 'frevo.jpg',
      alttext: 'Frevo dancer',
    }]));
    await expect(page.locator('#panelIdle')).toHaveCSS('display', 'none');
    await expect(page.locator('#panelCard')).toHaveCSS('display', 'block');
    await expect(page.locator('.card-title')).toHaveText('Frevo');
    await expect(page.getByRole('button', { name: 'View dance page' })).toBeVisible();

    await page.evaluate(() => window.openCard([
      { dance_id: 1, dance_name: 'Samba', region: 'Rio' },
      { dance_id: 2, dance_name: 'Bossa', region: 'Rio' },
    ]));
    await expect(page.locator('.dance-list li')).toHaveCount(2);
    await expect(page.locator('.card-count')).toHaveText('2 dances in this location');

    await page.evaluate(() => window.closeCard());
    await expect(page.locator('#panelIdle')).toHaveCSS('display', 'block');
    await expect(page.locator('#panelCard')).toHaveCSS('display', 'none');
  });
});
