import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useSlotId } from '../../utils/useId';
import { useTabsContext } from './context';

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  value: string;
  forceMount?: boolean;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  function TabsContent({ asChild, value, forceMount, children, ...props }, ref) {
    const { value: selectedValue, orientation, registerContentId } = useTabsContext();
    const id = useSlotId(undefined);

    React.useEffect(() => {
      registerContentId(value, id);
    }, [value, id, registerContentId]);

    const isActive = selectedValue === value;
    const shouldRender = isActive || forceMount;

    if (!shouldRender) return null;

    const contentProps = {
      ref,
      role: 'tabpanel' as const,
      'aria-labelledby': undefined as string | undefined,
      id,
      'data-state': isActive ? 'active' : 'inactive',
      'data-orientation': orientation,
      ...(forceMount && !isActive && { 'aria-hidden': true, hidden: true }),
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return (
          <div {...contentProps}>
            {children}
          </div>
        );
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
