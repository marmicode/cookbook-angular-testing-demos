import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config.mjs';
import { playwright } from '@vitest/browser-playwright';
import { preview } from '@vitest/browser-preview';

const emulatedTestPatterns = ['src/**/!(*.browser).spec.ts'];
const browserTestPatterns = ['src/**/*.browser.spec.ts'];

const isStackblitz = !!process.versions['webcontainer'];

export default defineConfig({
  ...viteConfig,
  test: {
    watch: false,
    include: [],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/demo',
      provider: 'v8' as const,
    },
    setupFiles: ['src/test-setup.ts'],
    testTimeout: 3_000,
    projects: [
      {
        extends: true,
        test: {
          name: 'emulated',
          environment: 'jsdom',
          include: emulatedTestPatterns,
          setupFiles: ['@testing-library/jest-dom/vitest'],
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          include: browserTestPatterns,
          browser: {
            enabled: true,
            provider: isStackblitz ? preview() : playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
