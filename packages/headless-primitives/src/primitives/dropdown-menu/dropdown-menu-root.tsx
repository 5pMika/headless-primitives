import React from 'react';
import {
  DropdownMenuContext,
  type DropdownMenuContextValue,
  type DropdownMenuDir,
} from './context';

export interface DropdownMenuRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  dir?: DropdownMenuDir;
  children: React.ReactNode;
}

export const DropdownMenuRoot = React.forwardRef<HTMLDivElement, DropdownMenuRootProps>(
  function DropdownMenuRoot(
    {
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      modal = true,
      dir,
      children,
    },
    ref
  ) {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isControlled = openProp !== undefined;
    const open = isControlled ? openProp : internalOpen;

    const triggerRef = React.useRef<HTMLElement | null>(null);
    const contentRef = React.useRef<HTMLElement | null>(null);
    const [focusedIndex, setFocusedIndex] = React.useState(0);
    const itemRefs = React.useRef<(HTMLElement | null)[]>([]);
    const itemDisabledMap = React.useRef<Map<number, boolean>>(new Map());
    const itemTextMap = React.useRef<Map<number, string>>(new Map());

    const handleOpenChange = React.useCallback(
      (next: boolean) => {
        if (!isControlled) setInternalOpen(next);
        onOpenChange?.(next);
        if (!next) {
          requestAnimationFrame(() => {
            triggerRef.current?.focus();
          });
        } else {
          setFocusedIndex(0);
        }
      },
      [isControlled, onOpenChange]
    );

    const registerItem = React.useCallback(
      (ref: HTMLElement | null, disabled: boolean, textValue?: string) => {
        const index = itemRefs.current.length;
        itemRefs.current.push(ref);
        itemDisabledMap.current.set(index, disabled);
        if (textValue) itemTextMap.current.set(index, textValue.toLowerCase());
        return index;
      },
      []
    );

    const unregisterItem = React.useCallback((index: number) => {
      itemRefs.current[index] = null;
      itemDisabledMap.current.delete(index);
      itemTextMap.current.delete(index);
    }, []);

    const isItemDisabled = React.useCallback((index: number) => {
      return itemDisabledMap.current.get(index) ?? false;
    }, []);

    const contextValue: DropdownMenuContextValue = React.useMemo(
      () => ({
        open,
        onOpenChange: handleOpenChange,
        modal,
        dir,
        triggerRef,
        contentRef,
        focusedIndex,
        setFocusedIndex,
        registerItem,
        unregisterItem,
        isItemDisabled,
        itemRefs,
        itemTextMap,
      }),
      [
        open,
        handleOpenChange,
        modal,
        dir,
        focusedIndex,
        registerItem,
        unregisterItem,
        isItemDisabled,
        itemTextMap,
      ]
    );

    return (
      <DropdownMenuContext.Provider value={contextValue}>
        <div ref={ref} data-dropdown-menu-root dir={dir}>
          {children}
        </div>
      </DropdownMenuContext.Provider>
    );
  }
);
