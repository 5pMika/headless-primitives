import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useFormFieldContext } from './context';

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  asChild?: boolean;
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  function FormLabel({ asChild, children, ...props }, ref) {
    const field = useFormFieldContext();

    const labelProps = {
      ref,
      id: field.labelId,
      htmlFor: field.controlId,
      'data-invalid': field.invalid ? '' : undefined,
      'data-valid': !field.invalid ? '' : undefined,
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return (
          <label ref={ref} id={field.labelId} htmlFor={field.controlId} {...props}>
            {children}
          </label>
        );
      }
      const mergedProps = mergeProps(
        labelProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return <label {...labelProps}>{children}</label>;
  }
);
