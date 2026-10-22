import source from '../styles/tokens.css?raw';
import { themes } from '../tokens/themes';

// Read labels from the authored CSS, so this documentation has no second token-value source.
const blocks = [...source.replaceAll(/\/\*[\s\S]*?\*\//gu, '').matchAll(/([^{}]+)\{([^{}]*)\}/gu)];

export function colorReferences(name: string, mode: 'light' | 'dark'): Record<string, string> {
  return Object.fromEntries(
    themes.map(({ id }) => {
      let value = '';
      for (const [, selector = '', declarations = ''] of blocks) {
        const shared = selector.includes(':root') && selector.includes("[data-theme='tupak']");
        if (!shared && !selector.includes(`[data-theme='${id}']`)) {
          continue;
        }
        for (const declaration of declarations.split(';')) {
          const colon = declaration.indexOf(':');
          if (declaration.slice(0, colon).trim() === name) {
            value = declaration.slice(colon + 1).trim();
          }
        }
      }
      const modes = /^light-dark\((var\([^)]+\)|#[\da-f]+),\s*(var\([^)]+\)|#[\da-f]+)\)$/iu.exec(value);
      const selected = modes ? (modes[mode === 'light' ? 1 : 2] ?? '') : value;
      const reference = /^var\(--(?:palette-)?([\w-]+)\)$/u.exec(selected)?.[1];
      return [id, reference ?? (selected.startsWith('color-mix(') ? 'color mix' : 'authored color')];
    }),
  );
}
