import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useDropdownMenuContext } from './context';

export interface DropdownMenuItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  asChild?: boolean;
  disabled?: boolean;
  onSelect?: (event: Event) => void;
  textValue?: string;
}

export const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  function DropdownMenuItem(
    { asChild, disabled, onSelect, textValue, children, onClick, onKeyDown, ...props },
    ref
  ) {
    const {
      onOpenChange,
      focusedIndex,
      setFocusedIndex,
      registerItem,
      unregisterItem,
    } = useDropdownMenuContext();

    const itemRef = React.useRef<HTMLDivElement>(null);
    const [itemIndex, setItemIndex] = React.useState<number | null>(null);

    const composedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        (itemRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (node) {
          setItemIndex(registerItem(node, disabled ?? false, textValue));
        }
      },
      [ref, registerItem, disabled, textValue]
    );

    React.useEffect(() => {
      return () => {
        if (itemIndex !== null) unregisterItem(itemIndex);
      };
    }, [itemIndex, unregisterItem]);

    const isFocused = focusedIndex === itemIndex && !disabled;
    const tabIndex = isFocused ? 0 : -1;

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      onSelect?.(e.nativeEvent);
      onOpenChange(false);
      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect?.(e.nativeEvent);
        onOpenChange(false);
      }
      onKeyDown?.(e);
    };

    const handleFocus = () => {
      if (itemIndex !== null) setFocusedIndex(itemIndex);
    };

    const itemProps = {
      ref: composedRef,
      role: 'menuitem' as const,
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
