import React from 'react';
import { createPortal } from 'react-dom';
import { useDialogContext } from './context';

export interface DialogPortalProps {
  forceMount?: boolean;
  container?: HTMLElement | null;
  children: React.ReactNode;
}

export const DialogPortal = React.forwardRef<HTMLDivElement, DialogPortalProps>(
  function DialogPortal({ forceMount, container, children }, ref) {
    const { open } = useDialogContext();

    const shouldRender = open || forceMount;
    const target = container ?? (typeof document !== 'undefined' ? document.body : null);

    if (!shouldRender || !target) return null;

    return createPortal(
      <div ref={ref} data-dialog-portal>
        {children}
      </div>,
      target
    );
  }
);
