import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useSlotId } from '../../utils/useId';
import {
  FormContext,
  FormFieldContext,
  type ValidityMatcher,
  type CustomMatcher,
} from './context';

export interface FormMessageProps extends React.HTMLAttributes<HTMLSpanElement> {
  match?: ValidityMatcher | CustomMatcher;
  forceMatch?: boolean;
  name?: string;
  asChild?: boolean;
}

function isCustomMatcher(
  match: ValidityMatcher | CustomMatcher
): match is CustomMatcher {
  return typeof match === 'function';
}

export const FormMessage = React.forwardRef<HTMLSpanElement, FormMessageProps>(
  function FormMessage(
    { match, forceMatch = false, name: nameProp, asChild, children, ...props },
    ref
  ) {
    const form = React.useContext(FormContext);
    const field = React.useContext(FormFieldContext);
    const fallbackMessageId = useSlotId();

    const name = nameProp ?? field?.name;
    const messageId = field ? field.messageId : fallbackMessageId;

    if (!form) {
      throw new Error('Form.Message must be used within Form.Root');
    }
    if (!field && nameProp === undefined) {
      throw new Error('Form.Message must be used within Form.Field or have a name prop when outside');
    }

    React.useEffect(() => {
      if (field) {
        field.registerMessage();
        return () => field.unregisterMessage();
      }
    }, [field]);

    const [controlInvalid, setControlInvalid] = React.useState(false);
    const fieldInvalid = field?.invalid ?? controlInvalid;
    const serverInvalid = field?.serverInvalid ?? false;

    const [shouldShow, setShouldShow] = React.useState(() =>
      forceMatch || (!match && (fieldInvalid || serverInvalid))
    );

    React.useEffect(() => {
      if (typeof window === 'undefined') return;
      if (!name) return;

      const control = form.getControlRef(name);
      if (!control) return;

      const updateVisibility = () => {
        if (control && 'validity' in control) {
          setControlInvalid(!control.validity.valid);
        }
        if (forceMatch) {
          setShouldShow(true);
          return;
        }
        if (!match) {
          const invalid = field
            ? field.invalid || serverInvalid
            : (control && 'validity' in control ? !control.validity.valid : false) || serverInvalid;
          setShouldShow(invalid);
          return;
        }
        if (isCustomMatcher(match)) {
          const formEl = form.formRef.current;
          if (!formEl) return;
          const formData = new FormData(formEl);
          const value = (control as HTMLInputElement).value ?? '';
          const result = match(value, formData);
          if (typeof result === 'boolean') {
            setShouldShow(result);
          } else {
            result.then(setShouldShow);
          }
          return;
        }
        const validity = control.validity;
        if (validity && match in validity) {
          const matched = (validity as unknown as Record<string, boolean>)[match];
          setShouldShow(Boolean(matched));
        }
      };

      updateVisibility();

      control.addEventListener('invalid', updateVisibility);
      control.addEventListener('blur', updateVisibility);
      control.addEventListener('input', updateVisibility);

      return () => {
        control.removeEventListener('invalid', updateVisibility);
        control.removeEventListener('blur', updateVisibility);
        control.removeEventListener('input', updateVisibility);
      };
    }, [form, name, match, forceMatch, fieldInvalid, serverInvalid]);

    React.useEffect(() => {
      if (forceMatch) setShouldShow(true);
      else if (!match) setShouldShow(fieldInvalid || serverInvalid);
    }, [forceMatch, match, fieldInvalid, serverInvalid]);

    const invalid = fieldInvalid || serverInvalid;
    const messageProps = {
      ref,
      id: messageId,
      role: 'alert' as const,
      'aria-live': 'polite' as const,
      'data-invalid': invalid ? '' : undefined,
      'data-valid': !invalid ? '' : undefined,
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return (
          <span
            ref={ref}
            id={messageId}
            role="alert"
            aria-live="polite"
            {...(shouldShow ? {} : { 'aria-hidden': true, hidden: true })}
            {...props}
          >
            {shouldShow ? children : null}
          </span>
        );
      }
      const mergedProps = mergeProps(
        {
          ...messageProps,
          ...(shouldShow ? {} : { 'aria-hidden': true, hidden: true }),
        } as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return (
      <span
        ref={ref}
        id={messageId}
        role="alert"
        aria-live="polite"
        data-invalid={invalid ? '' : undefined}
        data-valid={!invalid ? '' : undefined}
        {...(shouldShow ? {} : { 'aria-hidden': true, hidden: true })}
        {...props}
      >
        {shouldShow ? children : null}
      </span>
    );
  }
);
