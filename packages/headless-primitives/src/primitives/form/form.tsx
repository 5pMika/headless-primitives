import { FormRoot } from './form-root';
import { FormField } from './form-field';
import { FormLabel } from './form-label';
import { FormControl } from './form-control';
import { FormMessage } from './form-message';
import { FormValidityState } from './form-validity-state';
import { FormSubmit } from './form-submit';

export type { FormRootProps } from './form-root';
export type { FormFieldProps } from './form-field';
export type { FormLabelProps } from './form-label';
export type { FormControlProps } from './form-control';
export type { FormMessageProps } from './form-message';
export type { FormValidityStateProps } from './form-validity-state';
export type { FormSubmitProps } from './form-submit';
export type { ValidityMatcher, CustomMatcher } from './context';

export { FormRoot, FormField, FormLabel, FormControl, FormMessage, FormValidityState, FormSubmit };

export const Form = {
  Root: FormRoot,
  Field: FormField,
  Label: FormLabel,
  Control: FormControl,
  Message: FormMessage,
  ValidityState: FormValidityState,
  Submit: FormSubmit,
};
