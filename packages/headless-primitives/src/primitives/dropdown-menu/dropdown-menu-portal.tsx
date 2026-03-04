import React from 'react';
import { createPortal } from 'react-dom';
import { useDropdownMenuContext } from './context';

export interface DropdownMenuPortalProps {
  forceMount?: boolean;
  container?: HTMLElement | null;
  children: React.ReactNode;
}

export const DropdownMenuPortal = React.forwardRef<HTMLDivElement, DropdownMenuPortalProps>(
  function DropdownMenuPortal({ forceMount, container, children }, ref) {
    const { open } = useDropdownMenuContext();

    const shouldRender = open || forceMount;
    const target = container ?? (typeof document !== 'undefined' ? document.body : null);

    if (!shouldRender || !target) return null;

    return createPortal(
      <div ref={ref} data-dropdown-menu-portal>
        {children}
      </div>,
      target
    );
  }
);
