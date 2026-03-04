import React from 'react';
import { createPortal } from 'react-dom';
import { usePopoverContext } from './context';

export interface PopoverPortalProps {
  forceMount?: boolean;
  container?: HTMLElement | null;
  children: React.ReactNode;
}

export const PopoverPortal = React.forwardRef<HTMLDivElement, PopoverPortalProps>(
  function PopoverPortal({ forceMount, container, children }, ref) {
    const { open } = usePopoverContext();

    const shouldRender = open || forceMount;
    const target = container ?? (typeof document !== 'undefined' ? document.body : null);

    if (!shouldRender || !target) return null;

    return createPortal(
      <div ref={ref} data-popover-portal>
        {children}
      </div>,
      target
    );
  }
);
