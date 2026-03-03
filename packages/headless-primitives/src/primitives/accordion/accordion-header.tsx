import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useAccordionItemContext } from './context';
import { useAccordionContext } from './context';

export interface AccordionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const AccordionHeader = React.forwardRef<HTMLDivElement, AccordionHeaderProps>(
  function AccordionHeader({ asChild, children, ...props }, ref) {
    const item = useAccordionItemContext();
    const accordion = useAccordionContext();

    const headerProps = {
      ref,
      'data-state': item.open ? 'open' : 'closed',
      ...(item.disabled && { 'data-disabled': '' }),
      'data-orientation': accordion.orientation,
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return (
          <div ref={ref} data-state={item.open ? 'open' : 'closed'} {...props}>
            {children}
          </div>
        );
      }
      const mergedProps = mergeProps(
        headerProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return <div {...headerProps}>{children}</div>;
  }
);
