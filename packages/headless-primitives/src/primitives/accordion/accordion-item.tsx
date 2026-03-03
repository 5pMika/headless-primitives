import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useSlotId } from '../../utils/useId';
import {
  useAccordionContext,
  AccordionItemContext,
  isItemInValue,
  type AccordionItemContextValue,
} from './context';

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
  asChild?: boolean;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  function AccordionItem({ value, disabled = false, asChild, children, ...props }, ref) {
    const accordion = useAccordionContext();
    const triggerId = useSlotId();
    const contentId = useSlotId();

    const open = isItemInValue(value, accordion.value, accordion.type);
    const isDisabled = disabled || accordion.disabled;

    const itemContextValue: AccordionItemContextValue = React.useMemo(
      () => ({
        value,
        disabled: isDisabled,
        open,
        triggerId,
        contentId,
      }),
      [value, isDisabled, open, triggerId, contentId]
    );

    const itemProps = {
      ref,
      'data-state': open ? 'open' : 'closed',
      'data-orientation': accordion.orientation,
      ...(isDisabled && { 'data-disabled': '' }),
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return (
          <AccordionItemContext.Provider value={itemContextValue}>
            <div ref={ref} data-state={open ? 'open' : 'closed'} {...props}>
              {children}
            </div>
          </AccordionItemContext.Provider>
        );
      }
      const mergedProps = mergeProps(
        itemProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return (
        <AccordionItemContext.Provider value={itemContextValue}>
          {React.cloneElement(child, mergedProps)}
        </AccordionItemContext.Provider>
      );
    }

    return (
      <AccordionItemContext.Provider value={itemContextValue}>
        <div
          ref={ref}
          data-state={open ? 'open' : 'closed'}
          data-orientation={accordion.orientation}
          {...(isDisabled && { 'data-disabled': '' })}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);
