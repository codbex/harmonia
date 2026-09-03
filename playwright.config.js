import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.E2E_PORT) || 8787;

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: '**/*.spec.js',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'on-first-retry',
    // Components skip transitions under prefers-reduced-motion. Real
    // transitions are part of what this suite exists to cover, so pin it.
    reducedMotion: 'no-preference',
    colorScheme: 'light',
  },
  webServer: {
    command: 'node scripts/e2e-server.cjs',
    url: `http://127.0.0.1:${PORT}/dist/harmonia.js`,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ...(process.env.CI
      ? [
          { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
          { name: 'webkit', use: { ...devices['Desktop Safari'] } },
        ]
      : []),
  ],
});
