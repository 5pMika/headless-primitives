import React from 'react';
import { mergeProps } from '../../utils/slot';
import {
  TabsContext,
  type TabsContextValue,
  type TabsOrientation,
  type TabsActivationMode,
  type TabsDir,
} from './context';

export interface TabsRootProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: TabsOrientation;
  dir?: TabsDir;
  activationMode?: TabsActivationMode;
  asChild?: boolean;
}

export const TabsRoot = React.forwardRef<HTMLDivElement, TabsRootProps>(
  function TabsRoot(
    {
      value: valueProp,
      defaultValue,
      onValueChange,
      orientation = 'horizontal',
      dir,
      activationMode = 'automatic',
      asChild,
      children,
      ...props
    },
    ref
  ) {
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : internalValue;

    const [focusedIndex, setFocusedIndex] = React.useState(0);
    const triggerRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
    const triggerValues = React.useRef<string[]>([]);
    const triggerDisabledRef = React.useRef<Map<number, boolean>>(new Map());
    const contentIds = React.useRef<Map<string, string>>(new Map());
    const [, setContentIdsVersion] = React.useState(0);

    const registerContentId = React.useCallback((val: string, id: string) => {
      contentIds.current.set(val, id);
      setContentIdsVersion((v) => v + 1);
    }, []);

    const getContentId = React.useCallback((val: string) => {
      return contentIds.current.get(val);
    }, []);

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (!isControlled) setInternalValue(newValue);
        onValueChange?.(newValue);
      },
      [isControlled, onValueChange]
    );

    const registerTrigger = React.useCallback(
      (ref: HTMLButtonElement | null, triggerValue: string, disabled: boolean) => {
        const index = triggerRefs.current.length;
        triggerRefs.current.push(ref);
        triggerValues.current.push(triggerValue);
        triggerDisabledRef.current.set(index, disabled);
        return index;
      },
      []
    );

    const unregisterTrigger = React.useCallback((index: number) => {
      triggerRefs.current[index] = null;
      triggerValues.current[index] = '';
      triggerDisabledRef.current.delete(index);
    }, []);

    const isTriggerDisabled = React.useCallback((index: number) => {
      return triggerDisabledRef.current.get(index) ?? false;
    }, []);

    const contextValue: TabsContextValue = React.useMemo(
      () => ({
        value,
        onValueChange: handleValueChange,
        orientation,
        dir,
        activationMode,
        focusedIndex,
        setFocusedIndex,
        registerTrigger,
        unregisterTrigger,
        isTriggerDisabled,
        triggerRefs,
        triggerValues,
        registerContentId,
        getContentId,
      }),
      [
        value,
        handleValueChange,
        orientation,
        dir,
        activationMode,
        focusedIndex,
        registerTrigger,
        unregisterTrigger,
        isTriggerDisabled,
        registerContentId,
        getContentId,
      ]
    );

    const rootProps = {
      ref,
      'data-orientation': orientation,
      dir,
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return (
          <TabsContext.Provider value={contextValue}>
            <div ref={ref} data-orientation={orientation} dir={dir} {...props}>
              {children}
            </div>
          </TabsContext.Provider>
        );
      }
      const mergedProps = mergeProps(
        rootProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return (
        <TabsContext.Provider value={contextValue}>
          {React.cloneElement(child, mergedProps)}
        </TabsContext.Provider>
      );
    }

    return (
      <TabsContext.Provider value={contextValue}>
        <div ref={ref} data-orientation={orientation} dir={dir} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
