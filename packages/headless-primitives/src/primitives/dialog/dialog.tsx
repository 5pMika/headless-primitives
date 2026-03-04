import { DialogRoot } from './dialog-root';
import { DialogTrigger } from './dialog-trigger';
import { DialogPortal } from './dialog-portal';
import { DialogOverlay } from './dialog-overlay';
import { DialogContent } from './dialog-content';
import { DialogTitle } from './dialog-title';
import { DialogDescription } from './dialog-description';
import { DialogClose } from './dialog-close';

export type { DialogRootProps } from './dialog-root';
export type { DialogTriggerProps } from './dialog-trigger';
export type { DialogPortalProps } from './dialog-portal';
export type { DialogOverlayProps } from './dialog-overlay';
export type { DialogContentProps } from './dialog-content';
export type { DialogTitleProps } from './dialog-title';
export type { DialogDescriptionProps } from './dialog-description';
export type { DialogCloseProps } from './dialog-close';

export {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
};

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};
