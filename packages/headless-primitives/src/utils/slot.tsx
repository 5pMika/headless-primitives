import React from 'react';

type RefCallback<T> = (instance: T | null) => void;
type RefObject<T> = React.RefObject<T>;
type Ref<T> = RefCallback<T> | RefObject<T> | null | undefined;

function composeRefs<T>(...refs: Ref<T>[]): RefCallback<T> {
  return (instance: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(instance);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = instance;
      }
    }
  };
}

/**
 * Merges props onto a child element when asChild is true.
 * Used for polymorphic rendering: when asChild=true, the single child
 * receives the parent's props via cloneElement instead of rendering a wrapper.
 *
 * Per headless-primitive-props.mdc: asChild default=false.
 * When true: React.cloneElement on single child.
 */
export function mergeProps(
  parentProps: Record<string, unknown>,
  childProps: Record<string, unknown>
): Record<string, unknown> {
  const merged = { ...parentProps };

  for (const key of Object.keys(childProps)) {
    const parentVal = merged[key];
    const childVal = childProps[key];

    if (key === 'className' && typeof parentVal === 'string' && typeof childVal === 'string') {
      merged[key] = [parentVal, childVal].filter(Boolean).join(' ');
    } else if (
      key === 'style' &&
      parentVal &&
      childVal &&
      typeof parentVal === 'object' &&
      typeof childVal === 'object'
    ) {
      merged[key] = { ...(parentVal as object), ...(childVal as object) };
    } else if (
      key.startsWith('on') &&
      typeof parentVal === 'function' &&
      typeof childVal === 'function'
    ) {
      merged[key] = (...args: unknown[]) => {
        (childVal as (...a: unknown[]) => void)(...args);
        (parentVal as (...a: unknown[]) => void)(...args);
      };
    } else if (key === 'ref' && (parentVal || childVal)) {
      merged[key] = composeRefs(parentVal as Ref<HTMLElement>, childVal as Ref<HTMLElement>);
    } else if (childVal !== undefined) {
      merged[key] = childVal;
    }
  }

  return merged;
}

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

/**
 * Slot component for polymorphic rendering.
 * When asChild=true, merges props onto the single child via cloneElement.
 * When asChild=false (default), renders a div with the given props.
 */
export const Slot = React.forwardRef<HTMLDivElement, SlotProps>(function Slot(
  { asChild, children, ...props },
  ref
) {
  if (!asChild) {
    return (
      <div ref={ref} {...props}>
        {children}
      </div>
    );
  }

  const child = React.Children.only(children);
  if (!React.isValidElement(child)) {
    return (
      <div ref={ref} {...props}>
        {children}
      </div>
    );
  }

  const mergedProps = mergeProps(
    { ...props, ref } as Record<string, unknown>,
    (child.props || {}) as Record<string, unknown>
  );

  return React.cloneElement(child, mergedProps);
});
