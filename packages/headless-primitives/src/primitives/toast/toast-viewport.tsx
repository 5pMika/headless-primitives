import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useToastContext } from './context';

export interface ToastViewportProps extends React.HTMLAttributes<HTMLOListElement> {
  asChild?: boolean;
  hotkey?: string[];
  label?: string;
}

function formatHotkeyLabel(template: string, hotkey: string[]): string {
  const hotkeyStr = hotkey.join('+');
  return template.replace(/\{hotkey\}/g, hotkeyStr);
}

export const ToastViewport = React.forwardRef<HTMLOListElement, ToastViewportProps>(
  function ToastViewport(
    {
      asChild = false,
      hotkey = ['F8'],
      label,
      children,
      ...props
    },
    ref
  ) {
    const { viewportRef, setViewportRef } = useToastContext();
    const resolvedLabel =
      label ?? formatHotkeyLabel('Notifications ({hotkey})', hotkey);

    const composedRef = React.useCallback(
      (node: HTMLElement | null) => {
        setViewportRef(node);
        if (typeof ref === 'function') ref(node as HTMLOListElement);
        else if (ref) (ref as React.MutableRefObject<HTMLOListElement | null>).current = node as HTMLOListElement;
      },
      [ref, setViewportRef]
    );

    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        const matches =
          hotkey.length === 1 &&
          (e.key === hotkey[0] || e.code === hotkey[0]);
        if (matches && viewportRef.current) {
          e.preventDefault();
          viewportRef.current.focus();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hotkey, viewportRef]);

    const viewportProps = {
      ref: composedRef,
      role: 'region' as const,
      'aria-label': resolvedLabel,
      tabIndex: -1,
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return (
          <ol ref={composedRef} role="region" aria-label={resolvedLabel} tabIndex={-1} {...props}>
            {children}
          </ol>
        );
      }
      const mergedProps = mergeProps(
        viewportProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return (
      <ol ref={composedRef} role="region" aria-label={resolvedLabel} tabIndex={-1} {...props}>
        {children}
      </ol>
    );
  }
);
