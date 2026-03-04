import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useToastRootContext } from './context';

export interface ToastActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  altText: string;
}

function hasVisibleText(children: React.ReactNode): boolean {
  if (children == null) return false;
  if (typeof children === 'string') return children.trim().length > 0;
  if (typeof children === 'number') return true;
  if (Array.isArray(children)) return children.some(hasVisibleText);
  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode };
    return props?.children != null && hasVisibleText(props.children);
  }
  return false;
}

export const ToastAction = React.forwardRef<HTMLButtonElement, ToastActionProps>(
  function ToastAction({ asChild = false, altText, children, onClick, ...props }, ref) {
    const { onClose } = useToastRootContext();

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClose();
        onClick?.(e);
      },
      [onClose, onClick]
    );

    const isIconOnly = !hasVisibleText(children);
    const actionProps = {
      ref,
      type: 'button' as const,
      ...(isIconOnly ? { 'aria-label': altText } : { 'aria-description': altText }),
      onClick: handleClick,
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return <button {...actionProps}>{children}</button>;
      }
      const mergedProps = mergeProps(
        actionProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return <button {...actionProps}>{children}</button>;
  }
);
