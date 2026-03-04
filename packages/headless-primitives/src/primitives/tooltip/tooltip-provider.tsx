import React from 'react';
import { TooltipProviderContext } from './context';

export interface TooltipProviderProps {
  delayDuration?: number;
  skipDelayDuration?: number;
  children: React.ReactNode;
}

export function TooltipProvider({
  delayDuration = 700,
  skipDelayDuration = 300,
  children,
}: TooltipProviderProps) {
  const value = React.useMemo(
    () => ({ delayDuration, skipDelayDuration }),
    [delayDuration, skipDelayDuration]
  );
  return (
    <TooltipProviderContext.Provider value={value}>
      {children}
    </TooltipProviderContext.Provider>
  );
}
