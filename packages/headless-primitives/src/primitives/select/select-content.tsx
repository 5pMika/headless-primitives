import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useFocusTrap } from '../../utils/useFocusTrap';
import { useOutsideClick } from '../../utils/useOutsideClick';
import { useEscapeKey } from '../../utils/useEscapeKey';
import { useSelectContext } from './context';

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  forceMount?: boolean;
  loop?: boolean;
  position?: 'item-aligned' | 'popper';
}

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  function SelectContent(
    { asChild, forceMount, loop = false, position = 'popper', children, onKeyDown, ...props },
    ref
  ) {
    const {
      open,
      onOpenChange,
      triggerRef,
      contentRef,
      focusedIndex,
      setFocusedIndex,
      isItemDisabled,
      itemRefs,
    } = useSelectContext();

    const contentRefLocal = React.useRef<HTMLDivElement>(null);
    const composedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        (contentRefLocal as React.MutableRefObject<HTMLDivElement | null>).current = node;
        (contentRef as React.MutableRefObject<HTMLElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref, contentRef]
    );

    const { deactivate } = useFocusTrap(contentRefLocal, {
      enabled: open,
      restoreFocus: true,
      returnFocusRef: triggerRef,
      onDeactivate: () => onOpenChange(false),
    });

    const handleClose = React.useCallback(() => deactivate(), [deactivate]);

    useOutsideClick(contentRefLocal, {
      enabled: open,
      onOutsideClick: handleClose,
      triggerRef,
    });

    useEscapeKey({
      enabled: open,
      onEscape: handleClose,
    });

    const getNextIndex = (delta: number) => {
      const items = itemRefs.current;
      const count = items.length;
      let next = focusedIndex + delta;
      for (let i = 0; i < count; i++) {
        const idx = ((next % count) + count) % count;
        if (items[idx] && !isItemDisabled(idx)) return idx;
        next += delta;
      }
      return loop ? (((focusedIndex + delta) % count) + count) % count : focusedIndex;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const items = itemRefs.current;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          const nextDown = getNextIndex(1);
          setFocusedIndex(nextDown);
          items[nextDown]?.focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          const nextUp = getNextIndex(-1);
          setFocusedIndex(nextUp);
          items[nextUp]?.focus();
          break;
        case 'Home':
          e.preventDefault();
          for (let i = 0; i < items.length; i++) {
            if (items[i] && !isItemDisabled(i)) {
              setFocusedIndex(i);
              items[i]?.focus();
              break;
            }
          }
          break;
        case 'End':
          e.preventDefault();
          for (let i = items.length - 1; i >= 0; i--) {
            if (items[i] && !isItemDisabled(i)) {
              setFocusedIndex(i);
              items[i]?.focus();
              break;
            }
          }
          break;
        case 'Tab':
          handleClose();
          break;
      }
      onKeyDown?.(e);
    };

    const shouldRender = open || forceMount;
    if (!shouldRender) return null;

    const contentProps = {
      ref: composedRef,
      role: 'listbox' as const,
      'data-state': open ? 'open' : 'closed',
      'data-position': position,
      ...(forceMount && !open && { 'aria-hidden': true, hidden: true }),
      onKeyDown: handleKeyDown,
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return <div {...contentProps}>{children}</div>;
      }
      const mergedProps = mergeProps(
        contentProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return <div {...contentProps}>{children}</div>;
  }
);
