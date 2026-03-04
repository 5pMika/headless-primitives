import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useAccordionContext, useAccordionItemContext, toggleValue } from './context';

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ asChild, children, onKeyDown, onClick, ...props }, ref) {
    const accordion = useAccordionContext();
    const item = useAccordionItemContext();

    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const [triggerIndex, setTriggerIndex] = React.useState<number | null>(null);

    const composedRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        if (node) {
          setTriggerIndex(accordion.registerTrigger(node, item.disabled));
        }
      },
      [ref, accordion, item.disabled]
    );

    React.useEffect(() => {
      return () => {
        if (triggerIndex !== null) accordion.unregisterTrigger(triggerIndex);
      };
    }, [accordion, triggerIndex]);

    React.useEffect(() => {
      if (triggerIndex !== null) {
        accordion.updateTriggerDisabled(triggerIndex, item.disabled);
      }
    }, [accordion, triggerIndex, item.disabled]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (item.disabled) return;
      const newValue = toggleValue(
        item.value,
        accordion.value,
        accordion.type,
        accordion.collapsible
      );
      accordion.onValueChange(newValue);
      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (item.disabled) return;

      const { orientation, triggerRefs, isTriggerDisabled } = accordion;
      const triggers = triggerRefs.current;
      const currentIndex = triggerIndex ?? 0;
      const count = triggers.length;

      const getNextIndex = (delta: number) => {
        let next = currentIndex + delta;
        while (next >= 0 && next < count) {
          if (triggers[next] && !isTriggerDisabled(next)) return next;
          next += delta;
        }
        for (let i = delta > 0 ? count - 1 : 0; delta > 0 ? i >= 0 : i < count; i += delta > 0 ? -1 : 1) {
          if (triggers[i] && !isTriggerDisabled(i)) return i;
        }
        return currentIndex;
      };

      const getFirstEnabledIndex = () => {
        for (let i = 0; i < count; i++) {
          if (triggers[i] && !isTriggerDisabled(i)) return i;
        }
        return currentIndex;
      };

      const getLastEnabledIndex = () => {
        for (let i = count - 1; i >= 0; i--) {
          if (triggers[i] && !isTriggerDisabled(i)) return i;
        }
        return currentIndex;
      };

      switch (e.key) {
        case 'ArrowDown':
          if (orientation === 'vertical') {
            e.preventDefault();
            const nextDown = getNextIndex(1);
            accordion.setFocusedIndex(nextDown);
            triggers[nextDown]?.focus();
          }
          break;
        case 'ArrowUp':
          if (orientation === 'vertical') {
            e.preventDefault();
            const nextUp = getNextIndex(-1);
            accordion.setFocusedIndex(nextUp);
            triggers[nextUp]?.focus();
          }
          break;
        case 'ArrowRight':
          if (orientation === 'horizontal') {
            e.preventDefault();
            const nextRight = getNextIndex(1);
            accordion.setFocusedIndex(nextRight);
            triggers[nextRight]?.focus();
          }
          break;
        case 'ArrowLeft':
          if (orientation === 'horizontal') {
            e.preventDefault();
            const nextLeft = getNextIndex(-1);
            accordion.setFocusedIndex(nextLeft);
            triggers[nextLeft]?.focus();
          }
          break;
        case 'Home':
          e.preventDefault();
          const firstIdx = getFirstEnabledIndex();
          accordion.setFocusedIndex(firstIdx);
          triggers[firstIdx]?.focus();
          break;
        case 'End': {
          e.preventDefault();
          const lastIdx = getLastEnabledIndex();
          accordion.setFocusedIndex(lastIdx);
          triggers[lastIdx]?.focus();
          break;
        }
      }
      onKeyDown?.(e);
    };

    const handleFocus = () => {
      if (triggerIndex !== null) {
        accordion.setFocusedIndex(triggerIndex);
      }
    };

    const isFocused =
      accordion.focusedIndex === triggerIndex && !item.disabled;
    const tabIndex = isFocused ? 0 : -1;

    const triggerProps = {
      ref: composedRef,
      type: 'button' as const,
      'aria-expanded': item.open,
      'aria-controls': item.contentId,
      'data-state': item.open ? 'open' : 'closed',
      ...(isFocused && { 'data-focus': '' as const }),
      ...(item.disabled && { 'data-disabled': '', disabled: true }),
      'data-orientation': accordion.orientation,
      'data-accordion-trigger': '',
      tabIndex: item.disabled ? -1 : tabIndex,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      onFocus: handleFocus,
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return (
          <button {...triggerProps} id={item.triggerId}>
            {children}
          </button>
        );
      }
      const mergedProps = mergeProps(
        { ...triggerProps, id: item.triggerId } as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return (
      <button {...triggerProps} id={item.triggerId}>
        {children}
      </button>
    );
  }
);
