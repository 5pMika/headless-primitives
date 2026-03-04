import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useDialogContext } from './context';

export interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  asChild?: boolean;
}

export const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  function DialogDescription({ asChild, children, ...props }, ref) {
    const { descriptionId } = useDialogContext();

    const descriptionProps = {
      ref,
      id: descriptionId,
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return (
          <p {...descriptionProps} id={descriptionId}>
            {children}
          </p>
        );
      }
      const mergedProps = mergeProps(
        { ...descriptionProps, id: descriptionId } as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return (
      <p {...descriptionProps} id={descriptionId}>
        {children}
      </p>
    );
  }
);
