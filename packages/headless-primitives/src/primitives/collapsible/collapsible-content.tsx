import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useCollapsibleContext } from './context';

export interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  forceMount?: boolean;
}

export const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
  function CollapsibleContent({ asChild, forceMount, children, ...props }, ref) {
    const { open, disabled, contentId } = useCollapsibleContext();

    const shouldRender = open || forceMount;
    if (!shouldRender) return null;

    const contentProps = {
      ref,
      id: contentId,
      'data-state': open ? 'open' : 'closed',
      ...(disabled && { 'data-disabled': '' }),
      ...(forceMount && !open && { 'aria-hidden': true, hidden: true }),
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return <div {...contentProps}>{children}</div>;
      }
      const mergedProps = mergeProps(
        contentProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return <div {...contentProps}>{children}</div>;
  }
);
