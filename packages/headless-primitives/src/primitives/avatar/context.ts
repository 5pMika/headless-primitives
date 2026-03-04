import React from 'react';

export type AvatarImageStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface AvatarContextValue {
  imageStatus: AvatarImageStatus;
  setImageStatus: (status: AvatarImageStatus) => void;
}

export const AvatarContext = React.createContext<AvatarContextValue | null>(null);

export function useAvatarContext(): AvatarContextValue {
  const ctx = React.useContext(AvatarContext);
  if (!ctx) {
    throw new Error('Avatar components must be used within Avatar.Root');
  }
  return ctx;
}
