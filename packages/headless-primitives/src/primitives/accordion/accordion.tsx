import { AccordionRoot } from './accordion-root';
import { AccordionItem } from './accordion-item';
import { AccordionHeader } from './accordion-header';
import { AccordionTrigger } from './accordion-trigger';
import { AccordionContent } from './accordion-content';

export type { AccordionRootProps } from './accordion-root';
export type { AccordionItemProps } from './accordion-item';
export type { AccordionHeaderProps } from './accordion-header';
export type { AccordionTriggerProps } from './accordion-trigger';
export type { AccordionContentProps } from './accordion-content';

export { AccordionRoot, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent };

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
};
