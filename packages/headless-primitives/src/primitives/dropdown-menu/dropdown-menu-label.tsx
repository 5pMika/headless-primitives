import React from 'react';
import { mergeProps } from '../../utils/slot';

export interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const DropdownMenuLabel = React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  function DropdownMenuLabel({ asChild, children, ...props }, ref) {
    const labelProps = {
      ref,
      role: 'presentation' as const,
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return <div {...labelProps}>{children}</div>;
      }
      const mergedProps = mergeProps(
        labelProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return <div {...labelProps}>{children}</div>;
  }
);
