import { defineConfig, devices } from 'playwright/test';

export default defineConfig({
  testDir: './tests',
  outputDir: './.cache/playwright',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4322',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Astro 7 otherwise auto-backgrounds when invoked by an agent. This native flag
    // Keeps ownership with Playwright and avoids the designer's dev-server lock.
    command: 'astro dev --host 127.0.0.1 --port 4322 --ignore-lock',
    url: 'http://127.0.0.1:4322',
    reuseExistingServer: false,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
    timeout: 60_000,
  },
});
