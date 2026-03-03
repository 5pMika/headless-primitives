import React from 'react';
import { mergeProps } from '../../utils/slot';

export interface ToastDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  asChild?: boolean;
}

export const ToastDescription = React.forwardRef<HTMLParagraphElement, ToastDescriptionProps>(
  function ToastDescription({ asChild = false, children, ...props }, ref) {
    const descriptionProps = { ref, ...props };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return <p {...descriptionProps}>{children}</p>;
      }
      const mergedProps = mergeProps(
        descriptionProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return <p {...descriptionProps}>{children}</p>;
  }
);
