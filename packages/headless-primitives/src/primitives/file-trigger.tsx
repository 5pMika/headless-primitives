import React from 'react';
import { mergeProps } from '../utils/slot';
import { useSlotId } from '../utils/useId';

const visuallyHiddenStyle: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

export interface FileTriggerProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange'
> {
  asChild?: boolean;
  accept?: string;
  multiple?: boolean;
  capture?: string;
  name?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const FileTrigger = React.forwardRef<HTMLButtonElement, FileTriggerProps>(
  function FileTrigger(
    {
      asChild,
      disabled,
      id,
      accept,
      multiple,
      capture,
      name,
      onChange,
      children,
      onClick,
      ...props
    },
    ref
  ) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const inputId = useSlotId(id);
    const isDisabled = Boolean(disabled);

    const handleTriggerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) return;
      inputRef.current?.click();
      onClick?.(e);
    };

    const triggerProps = {
      type: 'button' as const,
      disabled: isDisabled,
      'aria-disabled': isDisabled,
      ...(isDisabled && { 'data-disabled': '' }),
      onClick: handleTriggerClick,
      ref,
      ...props,
    };

    const inputElement = (
      <input
        ref={inputRef}
        type="file"
        id={inputId}
        accept={accept}
        multiple={multiple}
        capture={capture as 'user' | 'environment' | undefined}
        name={name}
        onChange={onChange}
        disabled={isDisabled}
        aria-hidden
        tabIndex={-1}
        style={visuallyHiddenStyle}
      />
    );

    if (!asChild) {
      return (
        <>
          {inputElement}
          <button {...triggerProps}>{children}</button>
        </>
      );
    }

    const child = React.Children.only(children);
    if (!React.isValidElement(child)) {
      return (
        <>
          {inputElement}
          <button {...triggerProps}>{children}</button>
        </>
      );
    }

    const mergedProps = mergeProps(
      triggerProps as Record<string, unknown>,
      (child.props || {}) as Record<string, unknown>
    );

    return (
      <>
        {inputElement}
        {React.cloneElement(child, mergedProps)}
      </>
    );
  }
);
