import { withTwoDigits } from '@2digits/oxlint-config';

export default withTwoDigits({
  ignorePatterns: ['**/.turbo/**', '**/.astro/**', '**/*.tsbuildinfo'],
  overrides: [
    {
      files: ['packages/design-system/**/*.astro'],
      env: { astro: true },
      // Astro frontmatter and processed <script> blocks run in module scope.
      // Oxlint's embedded-script extraction otherwise treats them as global scripts.
      rules: { 'no-implicit-globals': 'off' },
    },
    {
      files: ['packages/design-system/tests/**/*.spec.ts'],
      // Playwright parameterizes isolated tests with registration loops; it has no Vitest test.each API.
      rules: { 'vitest/prefer-each': 'off' },
    },
  ],
});
