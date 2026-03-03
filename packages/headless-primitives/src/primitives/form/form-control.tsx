import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useFormContext } from './context';
import { useFormFieldContext } from './context';

type FormControlElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export interface FormControlProps extends React.InputHTMLAttributes<HTMLInputElement> {
  asChild?: boolean;
}

export const FormControl = React.forwardRef<HTMLInputElement, FormControlProps>(
  function FormControl(
    {
      asChild,
      id: idProp,
      name: nameProp,
      onInvalid: onInvalidProp,
      onBlur: onBlurProp,
      onInput: onInputProp,
      children,
      ...props
    },
    ref
  ) {
    const form = useFormContext();
    const field = useFormFieldContext();

    const controlRef = React.useRef<FormControlElement | null>(null);

    const composedRef = React.useCallback(
      (node: FormControlElement | null) => {
        (controlRef as React.MutableRefObject<FormControlElement | null>).current = node;
        form.registerControl(field.name, node);
        if (typeof ref === 'function') ref(node as HTMLInputElement);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node as HTMLInputElement;
      },
      [ref, form, field.name]
    );

    React.useEffect(() => {
      return () => {
        form.unregisterControl(field.name);
      };
    }, [form, field.name]);

    const syncValidity = React.useCallback(() => {
      const control = controlRef.current;
      if (control && 'validity' in control) {
        field.setInvalid(!control.validity.valid);
      }
    }, [field]);

    const handleInvalid = React.useCallback(
      (e: React.FormEvent<FormControlElement>) => {
        field.setInvalid(true);
        onInvalidProp?.(e as React.FormEvent<HTMLInputElement>);
      },
      [field, onInvalidProp]
    );

    const handleBlur = React.useCallback(
      (e: React.FocusEvent<FormControlElement>) => {
        syncValidity();
        onBlurProp?.(e as React.FocusEvent<HTMLInputElement>);
      },
      [syncValidity, onBlurProp]
    );

    const handleInput = React.useCallback(
      (e: React.FormEvent<FormControlElement>) => {
        syncValidity();
        onInputProp?.(e as Parameters<NonNullable<typeof onInputProp>>[0]);
      },
      [syncValidity, onInputProp]
    );

    const {
      ref: _ref,
      id: _id,
      name: _name,
      'aria-describedby': _ariaDesc,
      'aria-errormessage': _ariaErrMsg,
      'aria-invalid': _ariaInv,
      ...restProps
    } = props as React.InputHTMLAttributes<HTMLInputElement> & Record<string, unknown>;

    const controlProps = {
      ref: composedRef,
      id: field.controlId,
      name: field.name,
      ...(field.hasMessage && { 'aria-describedby': field.messageId }),
      ...(field.invalid && field.hasMessage && { 'aria-errormessage': field.messageId }),
      'aria-invalid': field.invalid,
      'data-invalid': field.invalid ? '' : undefined,
      'data-valid': !field.invalid ? '' : undefined,
      onInvalid: handleInvalid,
      onBlur: handleBlur,
      onInput: handleInput,
      ...restProps,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return <input {...controlProps} />;
      }
      const mergedProps = mergeProps(
        controlProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return <input {...controlProps} />;
  }
);
