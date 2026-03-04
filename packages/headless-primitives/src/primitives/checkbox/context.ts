import React from 'react';

export type CheckboxState = boolean | 'indeterminate';

export interface CheckboxContextValue {
  checked: CheckboxState;
  disabled?: boolean;
  onCheckedChange: (checked: CheckboxState) => void;
}

export const CheckboxContext = React.createContext<CheckboxContextValue | null>(null);

export function useCheckboxContext(): CheckboxContextValue {
  const ctx = React.useContext(CheckboxContext);
  if (!ctx) {
    throw new Error('Checkbox components must be used within Checkbox.Root');
  }
  return ctx;
}
