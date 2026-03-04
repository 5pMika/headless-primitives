import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useAvatarContext } from './context';

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
  delayMs?: number;
}

export const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  function AvatarFallback({ asChild, delayMs = 0, children, ...props }, ref) {
    const { imageStatus } = useAvatarContext();
    const [canShow, setCanShow] = React.useState(delayMs === 0);

    React.useEffect(() => {
      if (delayMs > 0 && (imageStatus === 'loading' || imageStatus === 'error')) {
        const t = setTimeout(() => setCanShow(true), delayMs);
        return () => clearTimeout(t);
      }
      if (delayMs === 0) setCanShow(true);
    }, [delayMs, imageStatus]);

    const showFallback =
      imageStatus === 'error' || imageStatus === 'idle' || (imageStatus !== 'loaded' && canShow);

    if (!showFallback) return null;

    const fallbackProps = {
      ref,
      ...props,
    };

    if (asChild && children) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return <span {...fallbackProps}>{children}</span>;
      }
      const mergedProps = mergeProps(
        fallbackProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return <span {...fallbackProps}>{children}</span>;
  }
);
