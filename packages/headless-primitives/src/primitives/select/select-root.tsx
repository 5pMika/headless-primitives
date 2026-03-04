import React from 'react';
import { SelectContext, type SelectContextValue } from './context';

export interface SelectRootProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  children: React.ReactNode;
}

export const SelectRoot = React.forwardRef<HTMLDivElement, SelectRootProps>(
  function SelectRoot(
    {
      value: valueProp,
      defaultValue,
      onValueChange,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      required,
      disabled,
      name,
      children,
    },
    ref
  ) {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isValueControlled = valueProp !== undefined;
    const isOpenControlled = openProp !== undefined;
    const value = isValueControlled ? valueProp : internalValue;
    const open = isOpenControlled ? openProp : internalOpen;

    const triggerRef = React.useRef<HTMLElement | null>(null);
    const contentRef = React.useRef<HTMLElement | null>(null);
    const [focusedIndex, setFocusedIndex] = React.useState(0);
    const itemRefs = React.useRef<(HTMLElement | null)[]>([]);
    const itemValues = React.useRef<string[]>([]);
    const itemDisabledMap = React.useRef<Map<number, boolean>>(new Map());

    const handleValueChange = React.useCallback(
      (v: string) => {
        if (!isValueControlled) setInternalValue(v);
        onValueChange?.(v);
      },
      [isValueControlled, onValueChange]
    );

    const handleOpenChange = React.useCallback(
      (next: boolean) => {
        if (!isOpenControlled) setInternalOpen(next);
        onOpenChange?.(next);
        if (!next) requestAnimationFrame(() => triggerRef.current?.focus());
        else setFocusedIndex(0);
      },
      [isOpenControlled, onOpenChange]
    );

    const registerItem = React.useCallback(
      (ref: HTMLElement | null, itemValue: string, disabled: boolean) => {
        const index = itemRefs.current.length;
        itemRefs.current.push(ref);
        itemValues.current.push(itemValue);
        itemDisabledMap.current.set(index, disabled);
        return index;
      },
      []
    );

    const unregisterItem = React.useCallback((index: number) => {
      itemRefs.current[index] = null;
      itemValues.current[index] = '';
      itemDisabledMap.current.delete(index);
    }, []);

    const isItemDisabled = React.useCallback((index: number) => {
      return itemDisabledMap.current.get(index) ?? false;
    }, []);

    const contextValue: SelectContextValue = React.useMemo(
      () => ({
        open,
        onOpenChange: handleOpenChange,
        value,
        onValueChange: handleValueChange,
        triggerRef,
        contentRef,
        focusedIndex,
        setFocusedIndex,
        registerItem,
        unregisterItem,
        isItemDisabled,
        itemRefs,
        itemValues,
      }),
      [
        open,
        handleOpenChange,
        value,
        handleValueChange,
        focusedIndex,
        registerItem,
        unregisterItem,
        isItemDisabled,
      ]
    );

    return (
      <SelectContext.Provider value={contextValue}>
        <div ref={ref} data-select-root>
          {name && (
            <input
              type="hidden"
              name={name}
              value={value ?? ''}
              required={required}
              disabled={disabled}
              tabIndex={-1}
              aria-hidden
              readOnly
            />
          )}
          {children}
        </div>
      </SelectContext.Provider>
    );
  }
);
