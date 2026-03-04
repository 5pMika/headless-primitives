import React from 'react';
import { mergeProps } from '../../utils/slot';

export interface DropdownMenuGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const DropdownMenuGroup = React.forwardRef<HTMLDivElement, DropdownMenuGroupProps>(
  function DropdownMenuGroup({ asChild, children, ...props }, ref) {
    const groupProps = {
      ref,
      role: 'group' as const,
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return <div {...groupProps}>{children}</div>;
      }
      const mergedProps = mergeProps(
        groupProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return <div {...groupProps}>{children}</div>;
  }
);
