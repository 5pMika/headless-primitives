import React from 'react';
import { mergeProps } from '../utils/slot';

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  asChild?: boolean;
  children?: React.ReactNode;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    disabled = false,
    required,
    name,
    value = 'on',
    asChild,
    children,
    onClick,
    onKeyDown,
    ...props
  },
  ref
) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : internalChecked;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const next = !checked;
    if (!isControlled) setInternalChecked(next);
    onCheckedChange?.(next);
    onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const next = !checked;
      if (!isControlled) setInternalChecked(next);
      onCheckedChange?.(next);
    }
    onKeyDown?.(e);
  };

  const switchProps = {
    ref,
    type: 'button' as const,
    role: 'switch' as const,
    'aria-checked': checked,
    'aria-required': required,
    'data-state': checked ? 'checked' : 'unchecked',
    ...(disabled && { 'data-disabled': '', 'aria-disabled': true }),
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    disabled,
    ...(name && { name, value }),
    ...props,
  };

  if (asChild && children) {
    const child = React.Children.only(children);
    if (!React.isValidElement(child)) {
      return <button {...switchProps}>{children}</button>;
    }
    const mergedProps = mergeProps(
      switchProps as Record<string, unknown>,
      (child.props || {}) as Record<string, unknown>
    );
    return React.cloneElement(child, mergedProps);
  }

  return <button {...switchProps}>{children}</button>;
});
