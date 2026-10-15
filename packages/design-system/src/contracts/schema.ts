interface PropMetadata {
  required?: boolean;
  description?: string;
}

export type PropDefinition = PropMetadata &
  (
    | { type: 'enum'; values: ReadonlyArray<string | number>; default?: string | number }
    | { type: 'string'; default?: string }
    | { type: 'boolean'; default?: boolean }
    | { type: 'number'; default?: number }
  );

export interface ContractPreview {
  /**
   * Default slot content for generated specimens.
   */
  content?: string;
  /**
   * Visible form-control label, associated with the specimen id.
   */
  label?: string;
  /**
   * Required data and composition props supplied to every specimen.
   */
  props?: Readonly<Record<string, unknown>>;
  /**
   * Props omitted from the generated option matrix.
   */
  exclude?: ReadonlyArray<string>;
  /**
   * Boolean states opening a popup that needs additional space.
   */
  overlay?: ReadonlyArray<string>;
}

/**
 * Capabilities shared by renderers; native attributes and events stay renderer-owned.
 */
export interface ComponentContract {
  name: string;
  version: number;
  description: string;
  element: string;
  props: Readonly<Record<string, PropDefinition>>;
  slots?: Readonly<Record<string, { required: boolean; description: string }>>;
  parts?: Readonly<Record<string, string>>;
  states: ReadonlyArray<string>;
  accessibility: ReadonlyArray<string>;
  targets: ReadonlyArray<string>;
  preview?: ContractPreview;
}

type PropValue<Definition extends PropDefinition> = Definition extends {
  type: 'enum';
  values: infer Values extends ReadonlyArray<string | number>;
}
  ? Values[number]
  : Definition extends { type: 'boolean' }
    ? boolean
    : Definition extends { type: 'number' }
      ? number
      : string;

/**
 * Literal enum unions and primitive values, with explicitly required props enforced.
 */
export type ContractProps<Contract extends ComponentContract> = {
  [Name in keyof Contract['props'] as Contract['props'][Name] extends { required: true } ? Name : never]: PropValue<
    Contract['props'][Name]
  >;
} & {
  [Name in keyof Contract['props'] as Contract['props'][Name] extends { required: true } ? never : Name]?: PropValue<
    Contract['props'][Name]
  >;
};
