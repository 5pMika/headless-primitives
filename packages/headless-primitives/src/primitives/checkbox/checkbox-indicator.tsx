import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useCheckboxContext } from './context';

export interface CheckboxIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
  forceMount?: boolean;
}

export const CheckboxIndicator = React.forwardRef<HTMLSpanElement, CheckboxIndicatorProps>(
  function CheckboxIndicator({ asChild, forceMount, children, ...props }, ref) {
    const { checked, disabled } = useCheckboxContext();

    const isVisible = checked === true || checked === 'indeterminate' || forceMount;
    if (!isVisible) return null;

    const dataState =
      checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked';

    const indicatorProps = {
      ref,
      'data-state': dataState,
      ...(disabled && { 'data-disabled': '' }),
      ...props,
    };

    if (asChild && children) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return <span {...indicatorProps}>{children}</span>;
      }
      const mergedProps = mergeProps(
        indicatorProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return <span {...indicatorProps}>{children}</span>;
  }
);
