import { PopoverRoot } from './popover-root';
import { PopoverTrigger } from './popover-trigger';
import { PopoverAnchor } from './popover-anchor';
import { PopoverPortal } from './popover-portal';
import { PopoverContent } from './popover-content';
import { PopoverClose } from './popover-close';

export type { PopoverRootProps } from './popover-root';
export type { PopoverTriggerProps } from './popover-trigger';
export type { PopoverAnchorProps } from './popover-anchor';
export type { PopoverPortalProps } from './popover-portal';
export type { PopoverContentProps, PopoverSide, PopoverAlign } from './popover-content';
export type { PopoverCloseProps } from './popover-close';

export {
  PopoverRoot,
  PopoverTrigger,
  PopoverAnchor,
  PopoverPortal,
  PopoverContent,
  PopoverClose,
};

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Anchor: PopoverAnchor,
  Portal: PopoverPortal,
  Content: PopoverContent,
  Close: PopoverClose,
};
