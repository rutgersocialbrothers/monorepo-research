import slugify from '@sindresorhus/slugify';
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

import type { ComponentContract, PropDefinition } from './contracts/schema';

export interface Specimen {
  id: string;
  caption: string;
  label?: string;
  overlay: boolean;
  props: Record<string, unknown>;
}

export interface SpecimenGroup {
  title: string;
  specimens: Array<Specimen>;
}

export interface ContractRow {
  name: string;
  values: string;
  defaultValue: string;
}

export interface ContractEntry {
  name: string;
  slug: string;
  file: string;
  contract: ComponentContract;
  json: string;
  rows: Array<ContractRow>;
}

export interface ComponentEntry extends ContractEntry {
  componentFile: string;
  Component: AstroComponentFactory;
  Examples?: AstroComponentFactory;
  content?: string;
  usage: string;
  groups: Array<SpecimenGroup>;
}

interface AstroModule {
  default: AstroComponentFactory;
}

const contractModules = import.meta.glob<Record<string, unknown>>('./components/**/*.contract.ts', { eager: true });
const componentModules: Partial<Record<string, AstroModule>> = import.meta.glob<AstroModule>(
  './components/**/*.astro',
  { eager: true },
);

function familyIdentity(path: string): { directory: string; stem: string } {
  const directory = path.slice(0, path.lastIndexOf('/'));
  const stem = directory.split('/').at(-1);

  if (!stem || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(stem) || path !== `${directory}/${stem}.contract.ts`) {
    throw new Error(`Contract ${path} must live in its lower-case family folder as <family>.contract.ts.`);
  }

  return { directory, stem };
}

function isContract(value: unknown): value is ComponentContract {
  return typeof value === 'object' && !!value && 'name' in value && 'props' in value && 'states' in value;
}

function describeValues(definition: PropDefinition): string {
  if (definition.type === 'enum') {
    return definition.values.map(String).join(' · ');
  }

  return definition.type === 'boolean' ? 'true / false' : definition.type;
}

function contractRows(contract: ComponentContract): Array<ContractRow> {
  return Object.entries(contract.props).map(([name, definition]) => ({
    name,
    values: describeValues(definition),
    defaultValue: definition.default === '' ? '""' : String(definition.default),
  }));
}

function specimenGroups(contract: ComponentContract, slug: string): Array<SpecimenGroup> {
  const preview = contract.preview ?? {};
  const base = { ...preview.props };
  const excluded = new Set(preview.exclude);
  const overlay = new Set(preview.overlay);
  const entries = Object.entries(contract.props).filter(([name]) => !excluded.has(name));

  function specimen(caption: string, props: Record<string, unknown>, isOverlay = false): Specimen {
    const id = `ds-${slug}-${slugify(caption)}`;

    return {
      id,
      caption,
      label: preview.label,
      overlay: isOverlay,
      props: preview.label ? { ...props, id } : props,
    };
  }

  const enumGroups = entries.flatMap(([name, definition]) =>
    definition.type === 'enum'
      ? [
          {
            title: name,
            specimens: definition.values.map((value) =>
              specimen(`${name}=${String(value)}`, { ...base, [name]: value }),
            ),
          },
        ]
      : [],
  );

  const booleans = entries.filter(([, definition]) => definition.type === 'boolean');

  if (booleans.length === 0) {
    return enumGroups.length > 0 ? enumGroups : [{ title: 'default', specimens: [specimen('default', base)] }];
  }

  const stateGroup = {
    title: 'states',
    specimens: [
      specimen('default', base),
      ...booleans.map(([name]) => specimen(name, { ...base, [name]: true }, overlay.has(name))),
    ],
  };

  return [...enumGroups, stateGroup];
}

function usageSnippet(contract: ComponentContract): string {
  const preview = contract.preview ?? {};
  const attributes = Object.entries(preview.props ?? {}).map(([name, value]) =>
    typeof value === 'string' ? `${name}="${value}"` : `${name}={${JSON.stringify(value)}}`,
  );
  const open = [contract.name, ...attributes].join(' ');

  return preview.content ? `<${open}>\n  ${preview.content}\n</${contract.name}>` : `<${open} />`;
}

const families = Object.entries(contractModules)
  .map(([path, module]) => {
    const { directory, stem } = familyIdentity(path);
    const definitions = Object.values(module).filter(isContract);
    const contract = definitions.at(0);

    if (definitions.length !== 1 || contract === undefined) {
      throw new Error(`Family ${directory} must export exactly one component contract.`);
    }

    const rendererPath = `${directory}/${stem}.astro`;
    const renderer = componentModules[rendererPath];

    if (slugify(contract.name) !== stem) {
      throw new Error(`Contract ${path} names ${contract.name}, but its family is ${stem}.`);
    }

    if (!renderer) {
      throw new Error(`Family ${directory} is missing its canonical renderer ${rendererPath}.`);
    }

    return {
      name: contract.name,
      slug: stem,
      file: path.replace(/^\.\//, 'src/'),
      contract,
      json: JSON.stringify(contract, undefined, 2),
      rows: contractRows(contract),
      componentFile: rendererPath.replace(/^\.\//, 'src/'),
      Component: renderer.default,
      Examples: componentModules[`${directory}/${stem}.example.astro`]?.default,
    };
  })
  .toSorted((a, b) => a.name.localeCompare(b.name));

const slugs = new Set<string>();

for (const family of families) {
  if (slugs.has(family.slug)) {
    throw new Error(`Duplicate component family ${family.slug}.`);
  }

  slugs.add(family.slug);
}

export const contracts: Array<ContractEntry> = families.map(({ name, slug, file, contract, json, rows }) => ({
  name,
  slug,
  file,
  contract,
  json,
  rows,
}));

export const componentEntries: Array<ComponentEntry> = families.map((entry) => ({
  ...entry,
  content: entry.contract.preview?.content,
  usage: usageSnippet(entry.contract),
  groups: specimenGroups(entry.contract, entry.slug),
}));
