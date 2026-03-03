import React from 'react';

/**
 * Native ValidityState keys from MDN Constraint Validation API.
 * Used by Form.Message match prop for built-in validation.
 */
export type ValidityMatcher =
  | 'badInput'
  | 'patternMismatch'
  | 'rangeOverflow'
  | 'rangeUnderflow'
  | 'stepMismatch'
  | 'tooLong'
  | 'tooShort'
  | 'typeMismatch'
  | 'valid'
  | 'valueMissing';

/**
 * Custom validation matcher for Form.Message.
 * Receives field value and FormData; returns whether message should show.
 */
export type CustomMatcher = (
  value: string,
  formData: FormData
) => boolean | Promise<boolean>;

export interface FormContextValue {
  formRef: React.RefObject<HTMLFormElement | null>;
  onClearServerErrors: (() => void) | undefined;
  registerControl: (name: string, ref: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null) => void;
  unregisterControl: (name: string) => void;
  getControlRef: (name: string) => HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
}

export interface FormFieldContextValue {
  name: string;
  controlId: string;
  labelId: string;
  messageId: string;
  invalid: boolean;
  serverInvalid: boolean;
  setInvalid: (invalid: boolean) => void;
  hasMessage: boolean;
  registerMessage: () => void;
  unregisterMessage: () => void;
}

export const FormContext = React.createContext<FormContextValue | null>(null);
export const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

export function useFormContext(): FormContextValue {
  const ctx = React.useContext(FormContext);
  if (!ctx) {
    throw new Error('Form components must be used within Form.Root');
  }
  return ctx;
}

export function useFormFieldContext(): FormFieldContextValue {
  const ctx = React.useContext(FormFieldContext);
  if (!ctx) {
    throw new Error('Form.Label, Form.Control, Form.Message, and Form.ValidityState must be used within Form.Field');
  }
  return ctx;
}
