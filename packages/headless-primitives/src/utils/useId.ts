import { useId } from 'react';

/**
 * Returns the provided id if present, otherwise a stable auto-generated id.
 * Per headless-primitive-props.mdc: Auto-generate with React.useId() if missing.
 * Used for ARIA linking (aria-labelledby, aria-describedby, etc.).
 */
export function useSlotId(id?: string | null): string {
  const generatedId = useId();
  return id ?? generatedId;
}
