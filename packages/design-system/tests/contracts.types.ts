import type { ButtonProps, ButtonSize, ButtonType, ButtonVariant } from '@tupak/design-system/button-contract';
import type { ComponentContract, ContractProps, PropDefinition } from '@tupak/design-system/contracts';
import { colorModes, themes, type ColorMode, type Theme } from '@tupak/design-system/themes';

type Assert<Condition extends true> = Condition;
type Assignable<Value, Target> = [Value] extends [Target] ? true : false;
type Rejected<Value, Target> = Assignable<Value, Target> extends true ? false : true;

type PrimitiveContract = Omit<ComponentContract, 'props'> & {
  props: {
    label: { type: 'string'; required: true; description: 'Visible label' };
    count: { type: 'number'; default: 0 };
    active: { type: 'boolean'; default: false };
    step: { type: 'enum'; values: readonly [1, 2] };
  };
};
type PrimitiveProps = ContractProps<PrimitiveContract>;

export const defaultButtonProps = {} satisfies ButtonProps;
export const primitiveDefaultProps = { label: 'Visible label' } satisfies PrimitiveProps;
// @ts-expect-error The label is required even when all other props have defaults or are optional.
export const missingRequiredProps = {} satisfies PrimitiveProps;

// Included by Astro check: these exercise the public package boundary.
export type ContractTypeChecks = [
  Assert<Assignable<'tupak', Theme>>,
  Assert<Rejected<'unknown-theme', Theme>>,
  Assert<Rejected<string, Theme>>,
  Assert<Assignable<(typeof themes)[number]['id'], Theme>>,
  Assert<Assignable<'light' | 'dark', ColorMode>>,
  Assert<Assignable<(typeof colorModes)[number], ColorMode>>,
  Assert<Rejected<'system', ColorMode>>,
  Assert<Assignable<'primary', ButtonVariant>>,
  Assert<Rejected<'unknown', ButtonVariant>>,
  Assert<Rejected<string, ButtonVariant>>,
  Assert<Rejected<'xl', ButtonSize>>,
  Assert<Rejected<'link', ButtonType>>,
  Assert<Rejected<{ disabled: 'false' }, ButtonProps>>,
  Assert<Assignable<{ label: string }, PrimitiveProps>>,
  Assert<Rejected<{ label: number }, PrimitiveProps>>,
  Assert<Rejected<{ label: string; count: string }, PrimitiveProps>>,
  Assert<Rejected<{ label: string; active: number }, PrimitiveProps>>,
  Assert<Rejected<{ label: string; step: 3 }, PrimitiveProps>>,
  Assert<Rejected<{ type: 'boolean'; default: string }, PropDefinition>>,
];
