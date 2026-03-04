import React from 'react';

export interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modal: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentId: string;
  titleId: string;
  descriptionId: string;
}

export const DialogContext = React.createContext<DialogContextValue | null>(null);

export function useDialogContext(): DialogContextValue {
  const ctx = React.useContext(DialogContext);
  if (!ctx) {
    throw new Error('Dialog components must be used within Dialog.Root');
  }
  return ctx;
}
