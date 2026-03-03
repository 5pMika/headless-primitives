import React from 'react';
import { mergeProps } from '../../utils/slot';

export interface FormSubmitProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const FormSubmit = React.forwardRef<HTMLButtonElement, FormSubmitProps>(
  function FormSubmit({ asChild, disabled, type, children, ...props }, ref) {
    const isDisabled = Boolean(disabled);

    const buttonProps = {
      type: 'submit' as const,
      disabled: isDisabled,
      'aria-disabled': isDisabled,
      ...(isDisabled && { 'data-disabled': '' }),
      ref,
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return <button {...buttonProps}>{children}</button>;
      }
      const childProps = (child.props || {}) as Record<string, unknown>;
      const { type: _omitType, ...childPropsWithoutType } = childProps;
      const mergedProps = mergeProps(
        buttonProps as Record<string, unknown>,
        childPropsWithoutType
      );
      return React.cloneElement(child, mergedProps as React.ComponentPropsWithoutRef<'button'>);
    }

    return <button {...buttonProps}>{children}</button>;
  }
);
