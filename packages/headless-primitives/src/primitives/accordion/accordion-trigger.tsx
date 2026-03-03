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
          setTriggerIndex(accordion.registerTrigger(node));
        }
      },
      [ref, accordion]
    );

    React.useEffect(() => {
      return () => {
        if (triggerIndex !== null) accordion.unregisterTrigger(triggerIndex);
      };
    }, [accordion, triggerIndex]);

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

      const { orientation, triggerRefs } = accordion;
      const triggers = triggerRefs.current;
      const currentIndex = triggerIndex ?? 0;
      const count = triggers.length;

      const getNextIndex = (delta: number) => {
        let next = currentIndex + delta;
        while (next >= 0 && next < count) {
          if (triggers[next]) return next;
          next += delta;
        }
        return delta > 0 ? count - 1 : 0;
      };

      switch (e.key) {
        case 'ArrowDown':
          if (orientation === 'vertical') {
            e.preventDefault();
            accordion.setFocusedIndex(getNextIndex(1));
            triggers[getNextIndex(1)]?.focus();
          }
          break;
        case 'ArrowUp':
          if (orientation === 'vertical') {
            e.preventDefault();
            accordion.setFocusedIndex(getNextIndex(-1));
            triggers[getNextIndex(-1)]?.focus();
          }
          break;
        case 'ArrowRight':
          if (orientation === 'horizontal') {
            e.preventDefault();
            accordion.setFocusedIndex(getNextIndex(1));
            triggers[getNextIndex(1)]?.focus();
          }
          break;
        case 'ArrowLeft':
          if (orientation === 'horizontal') {
            e.preventDefault();
            accordion.setFocusedIndex(getNextIndex(-1));
            triggers[getNextIndex(-1)]?.focus();
          }
          break;
        case 'Home':
          e.preventDefault();
          accordion.setFocusedIndex(0);
          triggers[0]?.focus();
          break;
        case 'End': {
          e.preventDefault();
          const lastIdx = count - 1;
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

    const tabIndex = accordion.focusedIndex === triggerIndex && !item.disabled ? 0 : -1;

    const triggerProps = {
      ref: composedRef,
      type: 'button' as const,
      'aria-expanded': item.open,
      'aria-controls': item.contentId,
      'data-state': item.open ? 'open' : 'closed',
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
