import React from 'react';
import { mergeProps } from '../utils/slot';
import { useSlotId } from '../utils/useId';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { asChild, disabled, id, type = 'button', children, ...props },
  ref
) {
  const resolvedId = useSlotId(id);
  const isDisabled = Boolean(disabled);

  const buttonProps = {
    type,
    id: resolvedId,
    disabled: isDisabled,
    'aria-disabled': isDisabled,
    ...props,
    ...(isDisabled && { 'data-disabled': '' }),
    ref,
  };

  if (!asChild) {
    return <button {...buttonProps}>{children}</button>;
  }

  const child = React.Children.only(children);
  if (!React.isValidElement(child)) {
    return <button {...buttonProps}>{children}</button>;
  }

  const mergedProps = mergeProps(
    buttonProps as Record<string, unknown>,
    (child.props || {}) as Record<string, unknown>
  );

  return React.cloneElement(child, mergedProps);
});
