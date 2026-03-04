import React from 'react';
import { mergeProps } from '../../utils/slot';
import { usePopoverContext } from './context';

export interface PopoverAnchorProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const PopoverAnchor = React.forwardRef<HTMLDivElement, PopoverAnchorProps>(
  function PopoverAnchor({ asChild, children, ...props }, ref) {
    const { anchorRef } = usePopoverContext();

    const composedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        (anchorRef as React.MutableRefObject<HTMLElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref, anchorRef]
    );

    const anchorProps = {
      ref: composedRef,
      'data-popover-anchor': '',
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return <div {...anchorProps}>{children}</div>;
      }
      const mergedProps = mergeProps(
        anchorProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return <div {...anchorProps}>{children}</div>;
  }
);
