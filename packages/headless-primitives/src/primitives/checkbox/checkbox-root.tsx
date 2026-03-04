import React from 'react';
import { mergeProps } from '../../utils/slot';
import { CheckboxContext, type CheckboxContextValue, type CheckboxState } from './context';

export interface CheckboxRootProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'defaultChecked' | 'checked'> {
  checked?: CheckboxState;
  defaultChecked?: CheckboxState;
  onCheckedChange?: (checked: CheckboxState) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  asChild?: boolean;
}

export const CheckboxRoot = React.forwardRef<HTMLButtonElement, CheckboxRootProps>(
  function CheckboxRoot(
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
      ...props
    },
    ref
  ) {
    const [internalChecked, setInternalChecked] = React.useState<CheckboxState>(defaultChecked);
    const isControlled = checkedProp !== undefined;
    const checked = isControlled ? checkedProp : internalChecked;

    const buttonRef = React.useRef<HTMLButtonElement>(null);

    const handleCheckedChange = React.useCallback(
      (next: CheckboxState) => {
        if (!isControlled) setInternalChecked(next);
        onCheckedChange?.(next);
      },
      [isControlled, onCheckedChange]
    );

    React.useEffect(() => {
      const input = buttonRef.current?.querySelector('input[type="checkbox"]');
      if (input && typeof input === 'object' && 'indeterminate' in input) {
        (input as HTMLInputElement & { indeterminate: boolean }).indeterminate =
          checked === 'indeterminate';
      }
    }, [checked]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const next: CheckboxState =
        checked === 'indeterminate' ? true : checked ? false : true;
      handleCheckedChange(next);
      (props as React.ButtonHTMLAttributes<HTMLButtonElement>).onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (e.key === ' ') {
        e.preventDefault();
        const next: CheckboxState =
          checked === 'indeterminate' ? true : checked ? false : true;
        handleCheckedChange(next);
      }
      (props as React.ButtonHTMLAttributes<HTMLButtonElement>).onKeyDown?.(e);
    };

    const contextValue: CheckboxContextValue = React.useMemo(
      () => ({
        checked,
        disabled,
        onCheckedChange: handleCheckedChange,
      }),
      [checked, disabled, handleCheckedChange]
    );

    const dataState =
      checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked';

    const rootProps = {
      ref: (node: HTMLButtonElement | null) => {
        (buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      },
      type: 'button' as const,
      role: 'checkbox',
      'aria-checked': checked === 'indeterminate' ? ('mixed' as const) : checked,
      'aria-required': required,
      'data-state': dataState,
      ...(disabled && { 'data-disabled': '', 'aria-disabled': true }),
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      disabled,
      ...props,
    };

    const inputEl = name ? (
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked === true}
        disabled={disabled}
        required={required}
        tabIndex={-1}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', margin: 0 }}
        aria-hidden
        onChange={() => {}}
      />
    ) : null;

    return (
      <CheckboxContext.Provider value={contextValue}>
        {asChild && children ? (
          (() => {
            const child = React.Children.only(children);
            if (!React.isValidElement(child)) {
              return (
                <button {...rootProps}>
                  {inputEl}
                  {children}
                </button>
              );
            }
            const mergedProps = mergeProps(
              rootProps as Record<string, unknown>,
              (child.props || {}) as Record<string, unknown>
            );
      return React.cloneElement(child as React.ReactElement<{ children?: React.ReactNode }>, {
        ...mergedProps,
        children: [inputEl, ...React.Children.toArray((child.props as { children?: React.ReactNode }).children)],
      } as { children?: React.ReactNode });
          })()
        ) : (
          <button {...rootProps}>
            {inputEl}
            {children}
          </button>
        )}
      </CheckboxContext.Provider>
    );
  }
);
