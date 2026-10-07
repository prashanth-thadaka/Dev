import { defineConfig } from '@playwright/test';
import { existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
const dataDir =
  process.env.VEEHOSTER_TEST_DIR || mkdtempSync(path.join(tmpdir(), 'veehoster-e2e-'));
process.env.VEEHOSTER_TEST_DIR = dataDir;
process.env.VEEHOSTER_TEST_ADMIN_PASSWORD ||= 'Test-only-' + randomUUID();
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  expect: { timeout: 10000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:3100',
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: {
      executablePath:
        process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ||
        (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
      args: ['--no-sandbox'],
    },
  },
  webServer: {
    command: 'npm run start -- --port 3100',
    url: 'http://127.0.0.1:3100/api/health',
    reuseExistingServer: false,
    timeout: 60000,
    env: {
      DATABASE_PATH: path.join(dataDir, 'test.sqlite'),
      APP_URL: 'http://127.0.0.1:3100',
      PAYMENT_MODE: 'demo',
      NEXT_TELEMETRY_DISABLED: '1',
    },
  },
});
