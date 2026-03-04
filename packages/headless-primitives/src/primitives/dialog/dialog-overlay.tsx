import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useDialogContext } from './context';

export interface DialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  forceMount?: boolean;
}

export const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  function DialogOverlay({ asChild, forceMount, children, ...props }, ref) {
    const { open } = useDialogContext();

    const shouldRender = open || forceMount;
    if (!shouldRender) return null;

    const overlayProps = {
      ref,
      'data-state': open ? 'open' : 'closed',
      'aria-hidden': !open,
      ...(forceMount && !open && { hidden: true }),
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return <div {...overlayProps}>{children}</div>;
      }
      const mergedProps = mergeProps(
        overlayProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return <div {...overlayProps}>{children}</div>;
  }
);
