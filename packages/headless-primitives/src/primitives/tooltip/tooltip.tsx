import { TooltipProvider } from './tooltip-provider';
import { TooltipRoot } from './tooltip-root';
import { TooltipTrigger } from './tooltip-trigger';
import { TooltipContent } from './tooltip-content';

export type { TooltipProviderProps } from './tooltip-provider';
export type { TooltipRootProps } from './tooltip-root';
export type { TooltipTriggerProps } from './tooltip-trigger';
export type { TooltipContentProps } from './tooltip-content';

export { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent };

export const Tooltip = {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
};
