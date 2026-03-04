import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useDialogContext } from './context';

export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
}

export const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  function DialogTitle({ asChild, children, ...props }, ref) {
    const { titleId } = useDialogContext();

    const titleProps = {
      ref,
      id: titleId,
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return (
          <h2 {...titleProps} id={titleId}>
            {children}
          </h2>
        );
      }
      const mergedProps = mergeProps(
        { ...titleProps, id: titleId } as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return (
      <h2 {...titleProps} id={titleId}>
        {children}
      </h2>
    );
  }
);
