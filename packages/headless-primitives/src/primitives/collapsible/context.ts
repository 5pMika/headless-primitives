import React from 'react';

export interface CollapsibleContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled: boolean;
  contentId: string;
  triggerId: string;
}

export const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null);

export function useCollapsibleContext(): CollapsibleContextValue {
  const ctx = React.useContext(CollapsibleContext);
  if (!ctx) {
    throw new Error('Collapsible components must be used within Collapsible.Root');
  }
  return ctx;
}
