import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useFocusTrap } from '../../utils/useFocusTrap';
import { useOutsideClick } from '../../utils/useOutsideClick';
import { useEscapeKey } from '../../utils/useEscapeKey';
import { useDropdownMenuContext } from './context';

export type DropdownMenuSide = 'top' | 'right' | 'bottom' | 'left';
export type DropdownMenuAlign = 'start' | 'center' | 'end';

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  forceMount?: boolean;
  loop?: boolean;
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  onFocusOutside?: (event: Event) => void;
  onInteractOutside?: (event: Event) => void;
  side?: DropdownMenuSide;
  sideOffset?: number;
  align?: DropdownMenuAlign;
  alignOffset?: number;
}

export const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  function DropdownMenuContent(
    {
      asChild,
      forceMount,
      loop = false,
      onCloseAutoFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      side = 'bottom',
      sideOffset = 0,
      align = 'center',
      alignOffset = 0,
      children,
      onKeyDown,
      ...props
    },
    ref
  ) {
    const {
      open,
      onOpenChange,
      modal,
      triggerRef,
      contentRef,
      focusedIndex,
      setFocusedIndex,
      isItemDisabled,
      itemRefs,
      itemTextMap,
    } = useDropdownMenuContext();

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
      enabled: open && modal,
      restoreFocus: true,
      returnFocusRef: triggerRef,
      onDeactivate: () => onOpenChange(false),
    });

    const handleClose = React.useCallback(() => {
      deactivate();
    }, [deactivate]);

    useOutsideClick(contentRefLocal, {
      enabled: open,
      onOutsideClick: (e) => {
        onPointerDownOutside?.(e);
        onInteractOutside?.(e);
        handleClose();
      },
      triggerRef,
    });

    useEscapeKey({
      enabled: open,
      onEscape: (e) => {
        onEscapeKeyDown?.(e);
        handleClose();
      },
    });

    const getNextIndex = React.useCallback(
      (delta: number) => {
        const items = itemRefs.current;
        const count = items.length;
        if (count === 0) return 0;
        let next = focusedIndex + delta;
        for (let i = 0; i < count; i++) {
          const idx = ((next % count) + count) % count;
          if (items[idx] && !isItemDisabled(idx)) return idx;
          next += delta;
        }
        return loop ? (((focusedIndex + delta) % count) + count) % count : focusedIndex;
      },
      [focusedIndex, isItemDisabled, itemRefs, loop]
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const items = itemRefs.current;
        const count = items.length;

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
            for (let i = 0; i < count; i++) {
              if (items[i] && !isItemDisabled(i)) {
                setFocusedIndex(i);
                items[i]?.focus();
                break;
              }
            }
            break;
          case 'End':
            e.preventDefault();
            for (let i = count - 1; i >= 0; i--) {
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
          default:
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
              const key = e.key.toLowerCase();
              const textMap = itemTextMap.current;
              for (let i = focusedIndex + 1; i < count; i++) {
                const itemText = textMap.get(i);
                if (itemText?.startsWith(key) && items[i] && !isItemDisabled(i)) {
                  e.preventDefault();
                  setFocusedIndex(i);
                  items[i]?.focus();
                  break;
                }
              }
              for (let i = 0; i < focusedIndex; i++) {
                const itemText = textMap.get(i);
                if (itemText?.startsWith(key) && items[i] && !isItemDisabled(i)) {
                  e.preventDefault();
                  setFocusedIndex(i);
                  items[i]?.focus();
                  break;
                }
              }
            }
        }
        onKeyDown?.(e);
      },
      [
        getNextIndex,
        setFocusedIndex,
        isItemDisabled,
        itemRefs,
        itemTextMap,
        focusedIndex,
        handleClose,
        onKeyDown,
      ]
    );

    const shouldRender = open || forceMount;
    if (!shouldRender) return null;

    const contentProps = {
      ref: composedRef,
      role: 'menu' as const,
      'aria-orientation': 'vertical' as const,
      'data-state': open ? 'open' : 'closed',
      'data-side': side,
      'data-align': align,
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