import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useAccordionItemContext } from './context';
import { useAccordionContext } from './context';

export interface AccordionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  /** Heading level for APG accordion pattern (default: 3). */
  level?: number;
}

export const AccordionHeader = React.forwardRef<HTMLDivElement, AccordionHeaderProps>(
  function AccordionHeader({ asChild, level = 3, children, ...props }, ref) {
    const item = useAccordionItemContext();
    const accordion = useAccordionContext();

    const headerProps = {
      ref,
      role: 'heading' as const,
      'aria-level': level,
      'data-state': item.open ? 'open' : 'closed',
      ...(item.disabled && { 'data-disabled': '' }),
      'data-orientation': accordion.orientation,
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return (
          <div
            ref={ref}
            role="heading"
            aria-level={level}
            data-state={item.open ? 'open' : 'closed'}
            {...props}
          >
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
