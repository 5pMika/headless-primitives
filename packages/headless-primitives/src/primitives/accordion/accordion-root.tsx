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

    const registerTrigger = React.useCallback((ref: HTMLButtonElement | null) => {
      const index = triggerRefs.current.length;
      triggerRefs.current.push(ref);
      return index;
    }, []);

    const unregisterTrigger = React.useCallback((index: number) => {
      triggerRefs.current[index] = null;
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
          <AccordionContext.Provider value={contextValue}>
            <div ref={ref} data-orientation={orientation} dir={dir} {...props}>
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
        <div ref={ref} data-orientation={orientation} dir={dir} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
