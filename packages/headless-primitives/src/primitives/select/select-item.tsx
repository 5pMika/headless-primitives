import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useSelectContext } from './context';

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  value: string;
  disabled?: boolean;
}

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  function SelectItem(
    { asChild, value, disabled, children, onClick, onKeyDown, ...props },
    ref
  ) {
    const {
      value: selectedValue,
      onValueChange,
      onOpenChange,
      focusedIndex,
      setFocusedIndex,
      registerItem,
      unregisterItem,
    } = useSelectContext();

    const itemRef = React.useRef<HTMLDivElement>(null);
    const [itemIndex, setItemIndex] = React.useState<number | null>(null);

    const composedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        (itemRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (node) setItemIndex(registerItem(node, value, disabled ?? false));
      },
      [ref, registerItem, value, disabled]
    );

    React.useEffect(() => {
      return () => {
        if (itemIndex !== null) unregisterItem(itemIndex);
      };
    }, [itemIndex, unregisterItem]);

    const isSelected = selectedValue === value;
    const isFocused = focusedIndex === itemIndex && !disabled;
    const tabIndex = isFocused ? 0 : -1;

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      onValueChange(value);
      onOpenChange(false);
      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onValueChange(value);
        onOpenChange(false);
      }
      onKeyDown?.(e);
    };

    const handleFocus = () => {
      if (itemIndex !== null) setFocusedIndex(itemIndex);
    };

    const itemProps = {
      ref: composedRef,
      role: 'option' as const,
      'aria-selected': isSelected,
      tabIndex: disabled ? -1 : tabIndex,
      'data-highlighted': isFocused ? '' : undefined,
      'data-disabled': disabled ? '' : undefined,
      ...(disabled && { 'aria-disabled': true }),
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      onFocus: handleFocus,
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return <div {...itemProps}>{children}</div>;
      }
      const mergedProps = mergeProps(
        itemProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return <div {...itemProps}>{children}</div>;
  }
);
