export const ADMIN = {
  username: process.env.TEST_ADMIN_USERNAME,
  password: process.env.TEST_ADMIN_PASSWORD,
};
export const USER = {
  username: process.env.TEST_USER_USERNAME,
  password: process.env.TEST_USER_PASSWORD,
};

export async function login(page, username, password) {
  await page.goto('auth/login');
  await page.fill('#username', username);
  await page.fill('#password', password);
  await page.click('button[name="submit"]');
}

export async function loginAsUser(page) {
  await login(page, USER.username, USER.password);
  await page.waitForURL(/user\/home/);
}

export async function loginAsAdmin(page) {
  await login(page, ADMIN.username, ADMIN.password);
  await page.waitForURL(/\/admin\/?$/);
}

export async function logout(page) {
  await page.goto('auth/logout');
  await page.waitForURL(url => url.toString().endsWith('/'));
}

export function uniqueName(prefix) {
  return `${prefix} ${Date.now()} ${Math.floor(Math.random() * 100000)}`;
}
