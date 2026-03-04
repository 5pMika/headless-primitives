import React from 'react';
import { createPortal } from 'react-dom';
import { useSelectContext } from './context';

export interface SelectPortalProps {
  forceMount?: boolean;
  container?: HTMLElement | null;
  children: React.ReactNode;
}

export const SelectPortal = React.forwardRef<HTMLDivElement, SelectPortalProps>(
  function SelectPortal({ forceMount, container, children }, ref) {
    const { open } = useSelectContext();

    const shouldRender = open || forceMount;
    const target = container ?? (typeof document !== 'undefined' ? document.body : null);

    if (!shouldRender || !target) return null;

    return createPortal(
      <div ref={ref} data-select-portal>
        {children}
      </div>,
      target
    );
  }
);
