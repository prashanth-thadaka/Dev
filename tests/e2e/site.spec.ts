import { test, expect, type APIRequestContext } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { publicPaths, articles, projects } from '../../lib/catalog';

const origin = 'http://127.0.0.1:3100';
const headers = { origin };
const adminEmail = 'administrator@example.test';
const adminPassword = process.env.VEEHOSTER_TEST_ADMIN_PASSWORD!;
test.beforeAll(() => {
  const db = new DatabaseSync(path.join(process.env.VEEHOSTER_TEST_DIR!, 'test.sqlite'));
  const exists = db.prepare('SELECT id FROM users WHERE email=?').get(adminEmail);
  db.close();
  if (exists) return;
  execFileSync(process.execPath, ['scripts/create-admin.mjs'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      DATABASE_PATH: path.join(process.env.VEEHOSTER_TEST_DIR!, 'test.sqlite'),
      ADMIN_EMAIL: adminEmail,
      ADMIN_PASSWORD: adminPassword,
    },
    stdio: 'pipe',
  });
});
async function register(request: APIRequestContext, name = 'Alex Sharma') {
  const email = `customer-${randomUUID()}@example.test`;
  const password = 'Test-only-' + randomUUID();
  const response = await request.post('/api/auth/register', {
    headers,
    data: { name, email, password, terms: true, role: 'admin' },
  });
  expect(response.status()).toBe(200);
  expect((await response.json()).user.role).toBe('customer');
  return { email, password };
}
async function order(request: APIRequestContext) {
  await request.get('/api/cart');
  await request.post('/api/cart', { headers, data: { sku: 'hosting-launch' } });
  const idempotencyKey = randomUUID();
  const payload = {
    name: 'Alex Sharma',
    phone: '9000000000',
    address: '12 Demo Street',
    city: 'Hyderabad',
    state: 'Telangana',
    postcode: '500001',
    terms: true,
    idempotencyKey,
  };
  const response = await request.post('/api/checkout', { headers, data: payload });
  expect(response.status()).toBe(200);
  return { ...(await response.json()), payload };
}

for (const route of [
  ...publicPaths,
  ...articles.map((a) => `/blog/${a.slug}`),
  ...projects.map((p) => `/portfolio/${p.slug}`),
]) {
  test(`public route and SEO: ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page).toHaveTitle(/Veehoster/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://veehoster.com${route === '/' ? '' : route}`,
    );
    expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
    expect(errors).toEqual([]);
  });
}
test('unknown routes return a real 404', async ({ page }) => {
  expect((await page.goto('/does-not-exist'))?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Let’s find your next step.' })).toBeVisible();
});
test('sitemap includes public pages and excludes private routes', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml).toContain('https://veehoster.com/hosting');
  expect(xml).not.toContain('/account');
  expect(xml).not.toContain('/checkout');
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Disallow: /admin');
});

test('mobile menu, FAQ and page layouts work without overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    '/',
    '/hosting',
    '/domains',
    '/web-design',
    '/quote',
    '/register',
    '/contact',
  ]) {
    await page.goto(route);
    const size = await page.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(size.scroll, route).toBeLessThanOrEqual(size.width);
  }
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Domains', exact: true })
    .click();
  await expect(page).toHaveURL(/\/domains$/);
  await page.locator('.faq-list summary').first().click();
  await expect(page.locator('.faq-list details').first()).toHaveAttribute('open', '');
});

test('domain search navigates from homepage, adds a real cart item and removes it', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByLabel('Search for your domain name').fill('mynewstudio');
  await page.getByRole('button', { name: 'Find my domain' }).click();
  await expect(page).toHaveURL(/domains\?q=mynewstudio/);
  await expect(page.getByText('mynewstudio.com', { exact: true })).toBeVisible();
  await page.locator('.domain-result').first().getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByRole('status')).toContainText('Added to your cart');
  await page.goto('/cart');
  await expect(page.getByRole('heading', { name: 'mynewstudio.com' })).toBeVisible();
  await page.getByRole('button', { name: 'Remove mynewstudio.com from cart' }).click();
  await expect(
    page.getByRole('heading', { name: 'A little empty. Full of possibility.' }),
  ).toBeVisible();
});

test('customer registers, purchases, sees receipt and creates support ticket', async ({ page }) => {
  await page.goto('/hosting');
  await page.getByRole('button', { name: 'Choose this plan' }).nth(1).click();
  await expect(page.getByRole('status')).toContainText('Added to your cart');
  await page.goto('/cart');
  await expect(page.getByRole('heading', { name: 'Grow', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Continue to checkout' }).click();
  await page.getByRole('link', { name: 'Create account', exact: true }).click();
  await page.getByLabel('Your name', { exact: true }).fill('Alex Sharma');
  await page.getByLabel('Email address', { exact: true }).fill(`alex-${randomUUID()}@example.test`);
  await page.getByLabel('Password', { exact: true }).fill('Test-only-' + randomUUID());
  await page.locator('input[name="terms"]').check();
  await page.getByRole('button', { name: 'Create my account' }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await page.getByLabel('Phone number').fill('9000000000');
  await page.getByLabel('Billing address').fill('12 Demo Street');
  await page.getByLabel('City', { exact: true }).fill('Hyderabad');
  await page.getByLabel('State', { exact: true }).fill('Telangana');
  await page.getByLabel('PIN code').fill('500001');
  await page.locator('input[name="terms"]').check();
  await page.getByRole('button', { name: /Continue ·/ }).click();
  await expect(page.getByRole('heading', { name: 'A safe space to test checkout.' })).toBeVisible();
  await page.getByRole('button', { name: 'Simulate successful payment' }).click();
  await expect(page.getByRole('heading', { name: 'Your demo order is confirmed.' })).toBeVisible();
  await page.getByRole('link', { name: 'View my orders' }).click();
  await expect(page.getByText('paid demo', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'View', exact: true }).first().click();
  await expect(page.getByRole('dialog')).toContainText('Grow');
  await page.getByRole('button', { name: 'Close order details' }).click();
  await page.goto('/account/services');
  await expect(page.getByRole('heading', { name: 'Grow', exact: true })).toBeVisible();
  await page.goto('/account/support');
  await page.getByRole('button', { name: 'New ticket' }).click();
  await page.getByLabel('Subject', { exact: true }).fill('Please help plan my migration');
  await page
    .getByLabel('How can we help?')
    .fill('I would like to discuss moving a small WordPress website.');
  await page.getByRole('button', { name: 'Create support ticket' }).click();
  await expect(page.locator('.ticket-conversation')).toContainText('I would like to discuss');
  await page.goto('/account');
  const a11y = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(a11y.violations).toEqual([]);
  await page.screenshot({ path: 'test-results/customer-dashboard.png', fullPage: true });
});

test('quote builder uses selected package and saves exact server-calculated quote', async ({
  page,
}) => {
  await page.goto('/quote?package=website-growth');
  await expect(page.locator('.quote-options button.selected')).toContainText('Growth website');
  await page.getByLabel('SEO launch setup').check();
  await expect(page.locator('.quote-total')).toContainText('₹47,197.64');
  await page.getByLabel('Your name', { exact: true }).fill('Quotation Customer');
  await page.getByLabel('Email address', { exact: true }).fill('quotation@example.test');
  await page
    .getByLabel('A little about your project')
    .fill('I need a new website for a design studio with a case study archive.');
  await page.locator('input[name="consent"]').check();
  await page.getByRole('button', { name: 'Request this quotation' }).click();
  await expect(page.getByText('Your next chapter is on its way.')).toBeVisible();
});

test('authentication, owner isolation, CSRF and immutable totals are enforced', async ({
  request,
  playwright,
}) => {
  expect((await request.get('/api/account')).status()).toBe(401);
  expect((await request.post('/api/auth/register', { data: {} })).status()).toBe(403);
  await register(request);
  expect((await request.get('/api/admin')).status()).toBe(403);
  const badOrigin = await request.post('/api/cart', {
    headers: { origin: 'https://attacker.example' },
    data: { sku: 'hosting-launch' },
  });
  expect(badOrigin.status()).toBe(403);
  await request.get('/api/cart');
  await request.post('/api/cart', { headers, data: { sku: 'hosting-launch', price: 1, total: 1 } });
  const cart = await (await request.get('/api/cart')).json();
  expect(cart.subtotal).toBe(14900);
  expect(cart.tax).toBe(2682);
  expect(cart.total).toBe(17582);
  const placed = await order(request);
  const again = await request.post('/api/checkout', { headers, data: placed.payload });
  expect((await again.json()).orderId).toBe(placed.orderId);
  const other = await playwright.request.newContext({ baseURL: origin });
  await register(other, 'Another Customer');
  expect((await other.get(`/api/orders/${placed.orderId}`)).status()).toBe(404);
  expect(
    (
      await other.post('/api/payments/demo', {
        headers,
        data: { orderId: placed.orderId, outcome: 'success' },
      })
    ).status(),
  ).toBe(404);
  await request.post('/api/payments/demo', {
    headers,
    data: { orderId: placed.orderId, outcome: 'success' },
  });
  const replay = await request.post('/api/payments/demo', {
    headers,
    data: { orderId: placed.orderId, outcome: 'failure' },
  });
  expect((await replay.json()).status).toBe('paid_demo');
  expect((await (await request.get('/api/cart')).json()).items).toHaveLength(0);
  const payu = await request.post('/api/payments/payu/start', {
    headers,
    data: { orderId: placed.orderId },
  });
  expect(payu.status()).toBe(409);
  const cookies = (await request.storageState()).cookies;
  expect(cookies.find((c) => c.name === 'vh_session')?.httpOnly).toBe(true);
  await request.post('/api/auth/logout', { headers });
  expect((await request.get('/api/account')).status()).toBe(401);
  await other.dispose();
});

test('failure and cancellation never mark an order paid', async ({ request }) => {
  await register(request);
  const placed = await order(request);
  for (const [outcome, status] of [
    ['failure', 'failed'],
    ['cancel', 'cancelled'],
  ]) {
    const r = await request.post('/api/payments/demo', {
      headers,
      data: { orderId: placed.orderId, outcome },
    });
    expect((await r.json()).status).toBe(status);
    const saved = await (await request.get(`/api/orders/${placed.orderId}`)).json();
    expect(saved.order.status).toBe(status);
    expect(saved.order.paid_at).toBeNull();
  }
  expect((await (await request.get('/api/cart')).json()).items.length).toBe(1);
});

test('admin can review quotations and reply to a support ticket', async ({ page, request }) => {
  const user = await register(request, 'Support Customer');
  await request.post('/api/inquiries', {
    headers,
    data: {
      kind: 'quote',
      name: 'Admin Quotation',
      email: 'admin-quote@example.test',
      message: 'Please quote a new website for our company.',
      packageId: 'website-growth',
      extras: ['seo'],
      consent: true,
    },
  });
  const ticket = await request.post('/api/tickets', {
    headers,
    data: {
      subject: 'A question for the support team',
      message: 'Please explain the migration assessment process for my website.',
    },
  });
  expect(ticket.status()).toBe(200);
  await page.goto('/login');
  await page.getByLabel('Email address', { exact: true }).fill(adminEmail);
  await page.getByLabel('Password', { exact: true }).fill(adminPassword);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page
    .getByRole('navigation', { name: 'Administrator navigation' })
    .getByRole('link', { name: 'Support tickets' })
    .click();
  await page.getByRole('button', { name: /A question for the support team/ }).click();
  await page
    .getByLabel('Your reply')
    .fill('We can review your files, database and DNS before agreeing a transfer plan.');
  await page.getByLabel('Ticket status').selectOption('in_progress');
  await page.getByRole('button', { name: 'Send reply' }).click();
  await expect(page.locator('.ticket-conversation')).toContainText('We can review your files');
  const updated = await (await request.get('/api/account')).json();
  expect(updated.tickets[0].status).toBe('in_progress');
  await page.goto('/admin/quotes');
  await expect(page.getByText('Admin Quotation', { exact: true })).toBeVisible();
  await page.getByText('Admin Quotation', { exact: true }).click();
  await page
    .locator('details[open] .inquiry-detail')
    .getByLabel('Request status')
    .selectOption('quoted');
  await expect(
    page.locator('.inquiry-list .status-badge').filter({ hasText: 'quoted' }),
  ).toBeVisible();
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Business overview.' })).toBeVisible();
  await page.screenshot({ path: 'test-results/admin-dashboard.png', fullPage: true });
  expect(user.email).toContain('@example.test');
});

for (const route of ['/', '/register', '/domains', '/quote', '/hosting', '/contact']) {
  test(`accessible public interface: ${route}`, async ({ page }) => {
    await page.goto(route);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  });
}
