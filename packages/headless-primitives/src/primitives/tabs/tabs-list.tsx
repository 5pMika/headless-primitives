import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useTabsContext } from './context';

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  loop?: boolean;
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  function TabsList({ asChild, loop = true, children, ...props }, ref) {
    const { orientation } = useTabsContext();

    const listProps = {
      ref,
      role: 'tablist' as const,
      'aria-orientation': orientation,
      'data-orientation': orientation,
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return (
          <div ref={ref} role="tablist" aria-orientation={orientation} {...props}>
            {children}
          </div>
        );
      }
      const mergedProps = mergeProps(
        listProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return (
      <div ref={ref} role="tablist" aria-orientation={orientation} {...props}>
        {children}
      </div>
    );
  }
);
