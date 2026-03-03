import React from 'react';
import { mergeProps } from '../../utils/slot';
import { FormContext, type FormContextValue } from './context';

export interface FormRootProps extends React.FormHTMLAttributes<HTMLFormElement> {
  asChild?: boolean;
  onClearServerErrors?: () => void;
}

export const FormRoot = React.forwardRef<HTMLFormElement, FormRootProps>(
  function FormRoot(
    { asChild, onClearServerErrors, onSubmit, onReset, children, ...props },
    ref
  ) {
    const formRef = React.useRef<HTMLFormElement>(null);
    const composedRef = React.useCallback(
      (node: HTMLFormElement | null) => {
        (formRef as React.MutableRefObject<HTMLFormElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLFormElement | null>).current = node;
      },
      [ref]
    );

    const controlRefs = React.useRef<
      Map<string, HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    >(new Map());

    const registerControl = React.useCallback(
      (name: string, controlRef: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null) => {
        if (controlRef) {
          controlRefs.current.set(name, controlRef);
        } else {
          controlRefs.current.delete(name);
        }
      },
      []
    );

    const unregisterControl = React.useCallback((name: string) => {
      controlRefs.current.delete(name);
    }, []);

    const getControlRef = React.useCallback(
      (name: string): HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null => {
        return controlRefs.current.get(name) ?? null;
      },
      []
    );

    const handleSubmit = React.useCallback(
      (e: React.FormEvent<HTMLFormElement>) => {
        onClearServerErrors?.();

        const form = formRef.current;
        if (!form) {
          onSubmit?.(e as Parameters<NonNullable<typeof onSubmit>>[0]);
          return;
        }

        const isValid = form.reportValidity();
        if (!isValid) {
          const firstInvalid = form.querySelector<HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement>(
            ':invalid'
          );
          firstInvalid?.focus();
          e.preventDefault();
        }
        onSubmit?.(e as Parameters<NonNullable<typeof onSubmit>>[0]);
      },
      [onSubmit]
    );

    const handleReset = React.useCallback(
      (e: React.FormEvent<HTMLFormElement>) => {
        onClearServerErrors?.();
        onReset?.(e as Parameters<NonNullable<typeof onReset>>[0]);
      },
      [onClearServerErrors, onReset]
    );

    const contextValue: FormContextValue = React.useMemo(
      () => ({
        formRef,
        onClearServerErrors,
        registerControl,
        unregisterControl,
        getControlRef,
      }),
      [onClearServerErrors, registerControl, unregisterControl, getControlRef]
    );

    const formProps = {
      ref: composedRef,
      onSubmit: handleSubmit,
      onReset: handleReset,
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return (
          <FormContext.Provider value={contextValue}>
            <form ref={composedRef} onSubmit={handleSubmit} onReset={handleReset} {...props}>
              {children}
            </form>
          </FormContext.Provider>
        );
      }
      const mergedProps = mergeProps(
        formProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return (
        <FormContext.Provider value={contextValue}>
          {React.cloneElement(child, mergedProps)}
        </FormContext.Provider>
      );
    }

    return (
      <FormContext.Provider value={contextValue}>
        <form ref={composedRef} onSubmit={handleSubmit} onReset={handleReset} {...props}>
          {children}
        </form>
      </FormContext.Provider>
    );
  }
);
