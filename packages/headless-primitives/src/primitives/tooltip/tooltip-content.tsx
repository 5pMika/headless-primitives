import React from 'react';
import { createPortal } from 'react-dom';
import { mergeProps } from '../../utils/slot';
import { useEscapeKey } from '../../utils/useEscapeKey';
import { useTooltipContext } from './context';

export interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  forceMount?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
}

export const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  function TooltipContent(
    { asChild, forceMount, onEscapeKeyDown, onPointerDownOutside, children, ...props },
    ref
  ) {
    const { open, onOpenChange, contentId } = useTooltipContext();

    useEscapeKey({
      enabled: open,
      onEscape: (e) => {
        onEscapeKeyDown?.(e);
        onOpenChange(false);
      },
    });

    const shouldRender = open || forceMount;
    if (!shouldRender) return null;

    const contentProps = {
      ref,
      id: contentId,
      role: 'tooltip' as const,
      'data-state': open ? 'open' : 'closed',
      ...(forceMount && !open && { 'aria-hidden': true, hidden: true }),
      ...props,
    };

    const content = asChild && children ? (
      (() => {
        const child = React.Children.only(children);
        if (!React.isValidElement(child)) {
          return <div {...contentProps}>{children}</div>;
        }
        const mergedProps = mergeProps(
          contentProps as Record<string, unknown>,
          (child.props || {}) as Record<string, unknown>
        );
        return React.cloneElement(child, mergedProps);
      })()
    ) : (
      <div {...contentProps}>{children}</div>
    );

    return typeof document !== 'undefined'
      ? createPortal(content, document.body)
      : content;
  }
);
