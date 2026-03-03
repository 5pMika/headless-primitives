import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useAccordionItemContext } from './context';
import { useAccordionContext } from './context';

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  forceMount?: boolean;
}

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent({ asChild, forceMount = false, children, ...props }, ref) {
    const item = useAccordionItemContext();
    const accordion = useAccordionContext();

    const shouldRender = item.open || forceMount;

    const contentProps = {
      ref,
      id: item.contentId,
      'aria-labelledby': item.triggerId,
      role: 'region' as const,
      'data-state': item.open ? 'open' : 'closed',
      ...(item.disabled && { 'data-disabled': '' }),
      'data-orientation': accordion.orientation,
      ...(!item.open && { 'aria-hidden': true }),
      ...(item.open && { 'aria-hidden': false }),
      ...(forceMount && !item.open && { hidden: true }),
      ...props,
    };

    if (!shouldRender) {
      return null;
    }

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
