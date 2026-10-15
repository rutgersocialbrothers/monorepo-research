import { fileURLToPath } from 'node:url';

import typescriptParser from '@typescript-eslint/parser';
import * as astroParser from 'astro-eslint-parser';
import type { Linter } from 'eslint';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';

const cwd = fileURLToPath(new URL('.', import.meta.url));
const config: Array<Linter.Config> = [
  { ignores: ['**/node_modules/**', '**/dist/**', '**/.astro/**', '**/.cache/**'] },
  {
    files: ['src/**/*.astro', 'src/**/*.ts'],
    languageOptions: { parser: typescriptParser },
    plugins: { 'better-tailwindcss': betterTailwindcss },
    settings: {
      'better-tailwindcss': { cwd, entryPoint: 'src/styles/global.css', detectComponentClasses: true },
    },
    rules: {
      'better-tailwindcss/no-unknown-classes': 'error',
      'better-tailwindcss/no-concatenated-classes': 'error',
    },
  },
  {
    files: ['src/**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: { parser: typescriptParser },
    },
  },
];

export default config.map((entry) => ({ basePath: cwd, ...entry }));
