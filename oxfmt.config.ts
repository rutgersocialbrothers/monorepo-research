import { withTwoDigits } from '@2digits/oxfmt-config';

export default withTwoDigits({
  // Local issue-tracker prose is maintained independently of source formatting.
  ignorePatterns: [
    '.scratch/**',
    'AGENTS.md',
    'docs/agents/**',
    // Pinned third-party skills retain upstream bytes, including example formatting.
    '.agents/skills/tailwind-design-system/**',
    '.agents/skills/fixing-accessibility/**',
    '.agents/skills/make-interfaces-feel-better/**',
    '**/.turbo/**',
    '**/.astro/**',
    '**/*.tsbuildinfo',
  ],
});
