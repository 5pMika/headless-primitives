import React from 'react';
import { mergeProps } from '../../utils/slot';
import {
  AccordionContext,
  type AccordionContextValue,
  type AccordionType,
  type AccordionOrientation,
  type AccordionDir,
} from './context';

export interface AccordionRootProps extends React.HTMLAttributes<HTMLDivElement> {
  type: AccordionType;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
  disabled?: boolean;
  dir?: AccordionDir;
  orientation?: AccordionOrientation;
  asChild?: boolean;
}

export const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionRootProps>(
  function AccordionRoot(
    {
      type,
      value: valueProp,
      defaultValue,
      onValueChange,
      collapsible = false,
      disabled = false,
      dir = 'ltr',
      orientation = 'vertical',
      asChild,
      children,
      ...props
    },
    ref
  ) {
    const [internalValue, setInternalValue] = React.useState<string | string[]>(() => {
      if (defaultValue !== undefined) return defaultValue;
      return type === 'multiple' ? [] : '';
    });

    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : internalValue;

    const handleValueChange = React.useCallback(
      (newValue: string | string[]) => {
        if (!isControlled) setInternalValue(newValue);
        onValueChange?.(newValue);
      },
      [isControlled, onValueChange]
    );

    const [focusedIndex, setFocusedIndex] = React.useState(0);
    const triggerRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
    const triggerDisabledRef = React.useRef<Map<number, boolean>>(new Map());

    const registerTrigger = React.useCallback(
      (ref: HTMLButtonElement | null, disabled: boolean) => {
        const index = triggerRefs.current.length;
        triggerRefs.current.push(ref);
        triggerDisabledRef.current.set(index, disabled);
        return index;
      },
      []
    );

    const unregisterTrigger = React.useCallback((index: number) => {
      triggerRefs.current[index] = null;
      triggerDisabledRef.current.delete(index);
    }, []);

    const updateTriggerDisabled = React.useCallback((index: number, disabled: boolean) => {
      triggerDisabledRef.current.set(index, disabled);
    }, []);

    const isTriggerDisabled = React.useCallback((index: number) => {
      return triggerDisabledRef.current.get(index) ?? false;
    }, []);

    const contextValue: AccordionContextValue = React.useMemo(
      () => ({
        type,
        value,
        onValueChange: handleValueChange,
        collapsible,
        orientation,
        dir,
        disabled,
        focusedIndex,
        setFocusedIndex,
        registerTrigger,
        unregisterTrigger,
        updateTriggerDisabled,
        isTriggerDisabled,
        triggerRefs,
      }),
      [
        type,
        value,
        handleValueChange,
        collapsible,
        orientation,
        dir,
        disabled,
        focusedIndex,
        registerTrigger,
        unregisterTrigger,
        updateTriggerDisabled,
        isTriggerDisabled,
      ]
    );

    const rootProps = {
      ref,
      'data-orientation': orientation,
      dir,
      ...(type === 'multiple' && { 'aria-multiselectable': true as const }),
      ...props,
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return (
          <AccordionContext.Provider value={contextValue}>
            <div
              ref={ref}
              data-orientation={orientation}
              dir={dir}
              {...(type === 'multiple' && { 'aria-multiselectable': true })}
              {...props}
            >
              {children}
            </div>
          </AccordionContext.Provider>
        );
      }
      const mergedProps = mergeProps(
        rootProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return (
        <AccordionContext.Provider value={contextValue}>
          {React.cloneElement(child, mergedProps)}
        </AccordionContext.Provider>
      );
    }

    return (
      <AccordionContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-orientation={orientation}
          dir={dir}
          {...(type === 'multiple' && { 'aria-multiselectable': true })}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
