import { DropdownMenuRoot } from './dropdown-menu-root';
import { DropdownMenuTrigger } from './dropdown-menu-trigger';
import { DropdownMenuPortal } from './dropdown-menu-portal';
import { DropdownMenuContent } from './dropdown-menu-content';
import { DropdownMenuItem } from './dropdown-menu-item';
import { DropdownMenuGroup } from './dropdown-menu-group';
import { DropdownMenuLabel } from './dropdown-menu-label';
import { DropdownMenuSeparator } from './dropdown-menu-separator';

export type { DropdownMenuRootProps } from './dropdown-menu-root';
export type { DropdownMenuTriggerProps } from './dropdown-menu-trigger';
export type { DropdownMenuPortalProps } from './dropdown-menu-portal';
export type {
  DropdownMenuContentProps,
  DropdownMenuSide,
  DropdownMenuAlign,
} from './dropdown-menu-content';
export type { DropdownMenuItemProps } from './dropdown-menu-item';
export type { DropdownMenuGroupProps } from './dropdown-menu-group';
export type { DropdownMenuLabelProps } from './dropdown-menu-label';
export type { DropdownMenuSeparatorProps } from './dropdown-menu-separator';

export {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};

export const DropdownMenu = {
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Portal: DropdownMenuPortal,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Group: DropdownMenuGroup,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
};
