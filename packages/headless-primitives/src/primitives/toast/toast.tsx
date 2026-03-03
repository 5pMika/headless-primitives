import { ToastProvider } from './toast-provider';
import { ToastViewport } from './toast-viewport';
import { ToastRoot } from './toast-root';
import { ToastTitle } from './toast-title';
import { ToastDescription } from './toast-description';
import { ToastAction } from './toast-action';
import { ToastClose } from './toast-close';

export type { ToastProviderProps } from './toast-provider';
export type { ToastViewportProps } from './toast-viewport';
export type { ToastRootProps, ToastType } from './toast-root';
export type { ToastTitleProps } from './toast-title';
export type { ToastDescriptionProps } from './toast-description';
export type { ToastActionProps } from './toast-action';
export type { ToastCloseProps } from './toast-close';

export { ToastProvider, ToastViewport, ToastRoot, ToastTitle, ToastDescription, ToastAction, ToastClose };

export const Toast = {
  Provider: ToastProvider,
  Viewport: ToastViewport,
  Root: ToastRoot,
  Title: ToastTitle,
  Description: ToastDescription,
  Action: ToastAction,
  Close: ToastClose,
};
