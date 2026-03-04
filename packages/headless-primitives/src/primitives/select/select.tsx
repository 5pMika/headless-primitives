import { SelectRoot } from './select-root';
import { SelectTrigger } from './select-trigger';
import { SelectPortal } from './select-portal';
import { SelectContent } from './select-content';
import { SelectItem } from './select-item';

export type { SelectRootProps } from './select-root';
export type { SelectTriggerProps } from './select-trigger';
export type { SelectPortalProps } from './select-portal';
export type { SelectContentProps } from './select-content';
export type { SelectItemProps } from './select-item';

export { SelectRoot, SelectTrigger, SelectPortal, SelectContent, SelectItem };

export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Portal: SelectPortal,
  Content: SelectContent,
  Item: SelectItem,
};
