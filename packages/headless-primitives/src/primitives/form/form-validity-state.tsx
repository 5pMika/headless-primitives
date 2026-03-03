import React from 'react';
import { FormContext, FormFieldContext } from './context';

export interface FormValidityStateProps {
  children: (validity: ValidityState | undefined) => React.ReactNode;
  name?: string;
}

export function FormValidityState({ children, name: nameProp }: FormValidityStateProps) {
  const form = React.useContext(FormContext);
  const field = React.useContext(FormFieldContext);

  const name = nameProp ?? field?.name;

  if (!form) {
    throw new Error('Form.ValidityState must be used within Form.Root');
  }
  if (!field && nameProp === undefined) {
    throw new Error('Form.ValidityState must be used within Form.Field or have a name prop when outside');
  }

  const [validity, setValidity] = React.useState<ValidityState | undefined>(undefined);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!name) return;

    const control = form.getControlRef(name);
    if (!control || !('validity' in control)) return;

    const updateValidity = () => {
      setValidity(control.validity);
    };

    updateValidity();

    control.addEventListener('invalid', updateValidity);
    control.addEventListener('blur', updateValidity);
    control.addEventListener('input', updateValidity);

    return () => {
      control.removeEventListener('invalid', updateValidity);
      control.removeEventListener('blur', updateValidity);
      control.removeEventListener('input', updateValidity);
    };
  }, [form, name]);

  return <>{children(validity)}</>;
}
