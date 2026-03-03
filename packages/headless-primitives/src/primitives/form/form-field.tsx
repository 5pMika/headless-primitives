import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useSlotId } from '../../utils/useId';
import { FormContext, FormFieldContext, type FormFieldContextValue } from './context';

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  serverInvalid?: boolean;
  asChild?: boolean;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  function FormField({ name, serverInvalid = false, asChild, children, ...props }, ref) {
    const form = React.useContext(FormContext);
    if (!form) {
      throw new Error('Form.Field must be used within Form.Root');
    }

    const controlId = useSlotId();
    const labelId = useSlotId();
    const messageId = useSlotId();

    const [controlInvalid, setControlInvalid] = React.useState(false);
    const invalid = serverInvalid || controlInvalid;

    const setInvalid = React.useCallback((value: boolean) => {
      setControlInvalid(value);
    }, []);

    const fieldContextValue: FormFieldContextValue = React.useMemo(
      () => ({
        name,
        controlId,
        labelId,
        messageId,
        invalid,
        serverInvalid,
        setInvalid,
      }),
      [name, controlId, labelId, messageId, invalid, serverInvalid, setInvalid]
    );

    const fieldProps = {
      ref,
      'data-invalid': invalid ? '' : undefined,
      'data-valid': !invalid ? '' : undefined,
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return (
          <FormFieldContext.Provider value={fieldContextValue}>
            <div
              ref={ref}
              data-invalid={invalid ? '' : undefined}
              data-valid={!invalid ? '' : undefined}
              {...props}
            >
              {children}
            </div>
          </FormFieldContext.Provider>
        );
      }
      const mergedProps = mergeProps(
        fieldProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return (
        <FormFieldContext.Provider value={fieldContextValue}>
          {React.cloneElement(child, mergedProps)}
        </FormFieldContext.Provider>
      );
    }

    return (
      <FormFieldContext.Provider value={fieldContextValue}>
        <div
          ref={ref}
          data-invalid={invalid ? '' : undefined}
          data-valid={!invalid ? '' : undefined}
          {...props}
        >
          {children}
        </div>
      </FormFieldContext.Provider>
    );
  }
);
