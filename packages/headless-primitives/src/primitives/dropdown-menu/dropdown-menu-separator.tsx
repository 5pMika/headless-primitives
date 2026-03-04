import React from 'react';
import { mergeProps } from '../../utils/slot';

export interface DropdownMenuSeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  asChild?: boolean;
}

export const DropdownMenuSeparator = React.forwardRef<HTMLHRElement, DropdownMenuSeparatorProps>(
  function DropdownMenuSeparator({ asChild, children, ...props }, ref) {
    const separatorProps = {
      ref,
      role: 'separator' as const,
      'aria-orientation': 'horizontal' as const,
      ...props,
    };

    if (asChild && children) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return <hr {...separatorProps} />;
      }
      const mergedProps = mergeProps(
        separatorProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return <hr {...separatorProps} />;
  }
);
