import React from 'react';

export type AccordionType = 'single' | 'multiple';
export type AccordionOrientation = 'vertical' | 'horizontal';
export type AccordionDir = 'ltr' | 'rtl';

export interface AccordionContextValue {
  type: AccordionType;
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
  collapsible: boolean;
  orientation: AccordionOrientation;
  dir: AccordionDir;
  disabled: boolean;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  registerTrigger: (ref: HTMLButtonElement | null) => number;
  unregisterTrigger: (index: number) => void;
  triggerRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
}

export interface AccordionItemContextValue {
  value: string;
  disabled: boolean;
  open: boolean;
  triggerId: string;
  contentId: string;
}

export const AccordionContext = React.createContext<AccordionContextValue | null>(null);
export const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

export function useAccordionContext(): AccordionContextValue {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) {
    throw new Error('Accordion components must be used within Accordion.Root');
  }
  return ctx;
}

export function useAccordionItemContext(): AccordionItemContextValue {
  const ctx = React.useContext(AccordionItemContext);
  if (!ctx) {
    throw new Error('Accordion.Header, Trigger, and Content must be used within Accordion.Item');
  }
  return ctx;
}

export function isItemInValue(
  itemValue: string,
  value: string | string[],
  type: AccordionType
): boolean {
  if (type === 'single') {
    return value === itemValue;
  }
  return Array.isArray(value) && value.includes(itemValue);
}

export function toggleValue(
  itemValue: string,
  currentValue: string | string[],
  type: AccordionType,
  collapsible: boolean
): string | string[] {
  if (type === 'single') {
    const isOpen = currentValue === itemValue;
    if (isOpen && collapsible) return '';
    if (isOpen) return currentValue;
    return itemValue;
  }
  const arr = Array.isArray(currentValue) ? [...currentValue] : [];
  const idx = arr.indexOf(itemValue);
  if (idx >= 0) {
    arr.splice(idx, 1);
    return arr;
  }
  return [...arr, itemValue];
}
