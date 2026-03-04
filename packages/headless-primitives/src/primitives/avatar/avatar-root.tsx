import React from 'react';
import { mergeProps } from '../../utils/slot';
import { AvatarContext, type AvatarContextValue, type AvatarImageStatus } from './context';

export interface AvatarRootProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

export const AvatarRoot = React.forwardRef<HTMLSpanElement, AvatarRootProps>(
  function AvatarRoot({ asChild, children, ...props }, ref) {
    const [imageStatus, setImageStatus] = React.useState<AvatarImageStatus>('idle');

    const contextValue: AvatarContextValue = React.useMemo(
      () => ({ imageStatus, setImageStatus }),
      [imageStatus]
    );

    const rootProps = {
      ref,
      role: 'img' as const,
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return (
          <AvatarContext.Provider value={contextValue}>
            <span ref={ref} role="img" {...props}>
              {children}
            </span>
          </AvatarContext.Provider>
        );
      }
      const mergedProps = mergeProps(
        rootProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return (
        <AvatarContext.Provider value={contextValue}>
          {React.cloneElement(child, mergedProps)}
        </AvatarContext.Provider>
      );
    }

    return (
      <AvatarContext.Provider value={contextValue}>
        <span ref={ref} role="img" {...props}>
          {children}
        </span>
      </AvatarContext.Provider>
    );
  }
);
