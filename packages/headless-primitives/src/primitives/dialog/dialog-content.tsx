import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useFocusTrap } from '../../utils/useFocusTrap';
import { useOutsideClick } from '../../utils/useOutsideClick';
import { useEscapeKey } from '../../utils/useEscapeKey';
import { useDialogContext } from './context';

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  forceMount?: boolean;
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  onInteractOutside?: (event: Event) => void;
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent(
    {
      asChild,
      forceMount,
      onOpenAutoFocus,
      onCloseAutoFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      onInteractOutside,
      children,
      onKeyDown,
      ...props
    },
    ref
  ) {
    const { open, onOpenChange, modal, triggerRef, contentId, titleId, descriptionId } =
      useDialogContext();

    const contentRef = React.useRef<HTMLDivElement>(null);
    const composedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );

    const { deactivate } = useFocusTrap(contentRef, {
      enabled: open && modal,
      restoreFocus: true,
      returnFocusRef: triggerRef,
      onDeactivate: () => onOpenChange(false),
    });

    const handleClose = React.useCallback(() => {
      deactivate();
    }, [deactivate]);

    useOutsideClick(contentRef, {
      enabled: open && modal,
      onOutsideClick: (e) => {
        onPointerDownOutside?.(e);
        onInteractOutside?.(e);
        handleClose();
      },
      triggerRef,
    });

    useEscapeKey({
      enabled: open,
      onEscape: (e) => {
        onEscapeKeyDown?.(e);
        handleClose();
      },
    });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
    };

    const shouldRender = open || forceMount;
    if (!shouldRender) return null;

    const contentProps = {
      ref: composedRef,
      id: contentId,
      role: 'dialog' as const,
      'aria-modal': modal,
      'aria-labelledby': titleId,
      'aria-describedby': descriptionId,
      'data-state': open ? 'open' : 'closed',
      ...(forceMount && !open && { 'aria-hidden': true, hidden: true }),
      onKeyDown: handleKeyDown,
      ...props,
    };

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
