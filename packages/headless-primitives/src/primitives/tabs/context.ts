import React from 'react';

export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsActivationMode = 'automatic' | 'manual';
export type TabsDir = 'ltr' | 'rtl';

export interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  orientation: TabsOrientation;
  dir?: TabsDir;
  activationMode: TabsActivationMode;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  registerTrigger: (ref: HTMLButtonElement | null, value: string, disabled: boolean) => number;
  unregisterTrigger: (index: number) => void;
  isTriggerDisabled: (index: number) => boolean;
  triggerRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  triggerValues: React.MutableRefObject<string[]>;
  registerContentId: (value: string, id: string) => void;
  getContentId: (value: string) => string | undefined;
}

export const TabsContext = React.createContext<TabsContextValue | null>(null);

export function useTabsContext(): TabsContextValue {
  const ctx = React.useContext(TabsContext);
  if (!ctx) {
    throw new Error('Tabs components must be used within Tabs.Root');
  }
  return ctx;
}
