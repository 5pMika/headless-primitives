import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useTabsContext } from './context';

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  value: string;
  disabled?: boolean;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  function TabsTrigger(
    { asChild, value, disabled = false, children, onClick, onKeyDown, ...props },
    ref
  ) {
    const {
      value: selectedValue,
      onValueChange,
      orientation,
      activationMode,
      setFocusedIndex,
      registerTrigger,
      unregisterTrigger,
      isTriggerDisabled,
      triggerRefs,
      triggerValues,
      getContentId,
    } = useTabsContext();

    const contentId = getContentId(value);

    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const [triggerIndex, setTriggerIndex] = React.useState<number | null>(null);

    const composedRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        if (node) {
          setTriggerIndex(registerTrigger(node, value, disabled));
        }
      },
      [ref, registerTrigger, value, disabled]
    );

    React.useEffect(() => {
      return () => {
        if (triggerIndex !== null) unregisterTrigger(triggerIndex);
      };
    }, [triggerIndex, unregisterTrigger]);

    const isSelected = selectedValue === value;
    const tabIndex = isSelected ? 0 : -1;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onValueChange(value);
      onClick?.(e);
    };

    const getNextIndex = (delta: number) => {
      const triggers = triggerRefs.current;
      const count = triggers.length;
      let next = (triggerIndex ?? 0) + delta;
      for (let i = 0; i < count; i++) {
        const idx = ((next % count) + count) % count;
        if (triggers[idx] && !isTriggerDisabled(idx)) return idx;
        next += delta;
      }
      return triggerIndex ?? 0;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const triggers = triggerRefs.current;
      const values = triggerValues.current;

      switch (e.key) {
        case 'ArrowDown':
          if (orientation === 'vertical') {
            e.preventDefault();
            const nextDown = getNextIndex(1);
            setFocusedIndex(nextDown);
            triggers[nextDown]?.focus();
            if (activationMode === 'automatic') onValueChange(values[nextDown] ?? '');
          }
          break;
        case 'ArrowUp':
          if (orientation === 'vertical') {
            e.preventDefault();
            const nextUp = getNextIndex(-1);
            setFocusedIndex(nextUp);
            triggers[nextUp]?.focus();
            if (activationMode === 'automatic') onValueChange(values[nextUp] ?? '');
          }
          break;
        case 'ArrowRight':
          if (orientation === 'horizontal') {
            e.preventDefault();
            const nextRight = getNextIndex(1);
            setFocusedIndex(nextRight);
            triggers[nextRight]?.focus();
            if (activationMode === 'automatic') onValueChange(values[nextRight] ?? '');
          }
          break;
        case 'ArrowLeft':
          if (orientation === 'horizontal') {
            e.preventDefault();
            const nextLeft = getNextIndex(-1);
            setFocusedIndex(nextLeft);
            triggers[nextLeft]?.focus();
            if (activationMode === 'automatic') onValueChange(values[nextLeft] ?? '');
          }
          break;
        case 'Home':
          e.preventDefault();
          for (let i = 0; i < triggers.length; i++) {
            if (triggers[i] && !isTriggerDisabled(i)) {
              setFocusedIndex(i);
              triggers[i]?.focus();
              if (activationMode === 'automatic') onValueChange(values[i] ?? '');
              break;
            }
          }
          break;
        case 'End':
          e.preventDefault();
          for (let i = triggers.length - 1; i >= 0; i--) {
            if (triggers[i] && !isTriggerDisabled(i)) {
              setFocusedIndex(i);
              triggers[i]?.focus();
              if (activationMode === 'automatic') onValueChange(values[i] ?? '');
              break;
            }
          }
          break;
      }
      onKeyDown?.(e);
    };

    const handleFocus = () => {
      if (triggerIndex !== null) setFocusedIndex(triggerIndex);
    };

    const triggerProps = {
      ref: composedRef,
      type: 'button' as const,
      role: 'tab' as const,
      'aria-selected': isSelected,
      ...(contentId && { 'aria-controls': contentId }),
      'aria-disabled': disabled,
      'data-state': isSelected ? 'active' : 'inactive',
      'data-orientation': orientation,
      ...(disabled && { 'data-disabled': '' }),
      tabIndex: disabled ? -1 : tabIndex,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      onFocus: handleFocus,
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return <button {...triggerProps}>{children}</button>;
      }
      const mergedProps = mergeProps(
        triggerProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return <button {...triggerProps}>{children}</button>;
  }
);
