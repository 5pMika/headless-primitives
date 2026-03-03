import React from 'react';
import { createPortal } from 'react-dom';
import { mergeProps } from '../../utils/slot';
import { useToastContext } from './context';
import { ToastRootContext } from './context';

export type ToastType = 'foreground' | 'background';

export interface ToastRootProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  type?: ToastType;
  duration?: number;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPause?: () => void;
  onResume?: () => void;
  onSwipeStart?: (event: React.PointerEvent) => void;
  onSwipeMove?: (event: React.PointerEvent) => void;
  onSwipeEnd?: (event: React.PointerEvent) => void;
  onSwipeCancel?: (event: React.PointerEvent) => void;
  forceMount?: boolean;
}

export const ToastRoot = React.forwardRef<HTMLDivElement, ToastRootProps>(
  function ToastRoot(
    {
      asChild = false,
      type = 'foreground',
      duration: durationProp,
      defaultOpen = true,
      open: openProp,
      onOpenChange,
      onEscapeKeyDown,
      onPause,
      onResume,
      onSwipeStart,
      onSwipeMove,
      onSwipeEnd,
      onSwipeCancel,
      forceMount = false,
      children,
      onKeyDown,
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onFocus,
      onBlur,
      style,
      ...props
    },
    ref
  ) {
    const { viewportRef, duration: contextDuration, swipeDirection, swipeThreshold } =
      useToastContext();

    const duration = durationProp ?? contextDuration;

    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isControlled = openProp !== undefined;
    const open = isControlled ? openProp : internalOpen;

    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const isPausedRef = React.useRef(false);

    const [swipeState, setSwipeState] = React.useState<
      'start' | 'move' | 'cancel' | 'end' | null
    >(null);
    const [swipeDirectionState, setSwipeDirectionState] = React.useState<
      'up' | 'down' | 'left' | 'right' | null
    >(null);
    const pointerStartRef = React.useRef<{ x: number; y: number } | null>(null);
    const [swipeMove, setSwipeMove] = React.useState<{ x: number; y: number } | null>(null);
    const [swipeEnd, setSwipeEnd] = React.useState<{ x: number; y: number } | null>(null);

    const handleOpenChange = React.useCallback(
      (next: boolean) => {
        if (!isControlled) setInternalOpen(next);
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange]
    );

    const close = React.useCallback(() => {
      handleOpenChange(false);
    }, [handleOpenChange]);

    const rootContextValue = React.useMemo(
      () => ({ onClose: close }),
      [close]
    );

    const startTimer = React.useCallback(() => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (!open || isPausedRef.current || duration <= 0) return;
      timerRef.current = setTimeout(() => {
        handleOpenChange(false);
        timerRef.current = null;
      }, duration);
    }, [open, duration, handleOpenChange]);

    const clearTimer = React.useCallback(() => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }, []);

    const handlePause = React.useCallback(() => {
      isPausedRef.current = true;
      clearTimer();
      onPause?.();
    }, [clearTimer, onPause]);

    const handleResume = React.useCallback(() => {
      isPausedRef.current = false;
      startTimer();
      onResume?.();
    }, [startTimer, onResume]);

    React.useEffect(() => {
      if (open) {
        startTimer();
      } else {
        clearTimer();
      }
      return clearTimer;
    }, [open, startTimer, clearTimer]);

    React.useEffect(() => {
      const handleWindowBlur = () => handlePause();
      const handleWindowFocus = () => handleResume();
      window.addEventListener('blur', handleWindowBlur);
      window.addEventListener('focus', handleWindowFocus);
      return () => {
        window.removeEventListener('blur', handleWindowBlur);
        window.removeEventListener('focus', handleWindowFocus);
      };
    }, [handlePause, handleResume]);

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape') {
          onEscapeKeyDown?.(e.nativeEvent);
          handleOpenChange(false);
        }
        onKeyDown?.(e);
      },
      [onEscapeKeyDown, handleOpenChange, onKeyDown]
    );

    const handlePointerEnter = React.useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        handlePause();
        onPointerEnter?.(e);
      },
      [handlePause, onPointerEnter]
    );

    const handlePointerLeave = React.useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        handleResume();
        onPointerLeave?.(e);
      },
      [handleResume, onPointerLeave]
    );

    const handleFocus = React.useCallback(
      (e: React.FocusEvent<HTMLDivElement>) => {
        handlePause();
        onFocus?.(e);
      },
      [handlePause, onFocus]
    );

    const handleBlur = React.useCallback(
      (e: React.FocusEvent<HTMLDivElement>) => {
        handleResume();
        onBlur?.(e);
      },
      [handleResume, onBlur]
    );

    React.useEffect(() => {
      if (!open) {
        setSwipeState(null);
        setSwipeDirectionState(null);
        setSwipeMove(null);
        setSwipeEnd(null);
        pointerStartRef.current = null;
      }
    }, [open]);

    const handlePointerDown = React.useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        pointerStartRef.current = { x: e.clientX, y: e.clientY };
        setSwipeState('start');
        setSwipeDirectionState(null);
        setSwipeMove(null);
        setSwipeEnd(null);
        onSwipeStart?.(e);
        onPointerDown?.(e);
      },
      [onSwipeStart, onPointerDown]
    );

    const handlePointerMove = React.useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!pointerStartRef.current || swipeState === 'cancel' || swipeState === 'end') return;
        const deltaX = e.clientX - pointerStartRef.current.x;
        const deltaY = e.clientY - pointerStartRef.current.y;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        const dir: 'up' | 'down' | 'left' | 'right' =
          absX > absY ? (deltaX > 0 ? 'right' : 'left') : deltaY > 0 ? 'down' : 'up';
        if (swipeState === 'start') {
          setSwipeState('move');
          setSwipeDirectionState(dir);
        }
        setSwipeMove({ x: deltaX, y: deltaY });
        onSwipeMove?.(e);
        onPointerMove?.(e);
      },
      [swipeState, onSwipeMove, onPointerMove]
    );

    const handlePointerUp = React.useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!pointerStartRef.current) {
          onPointerUp?.(e);
          return;
        }
        const deltaX = e.clientX - pointerStartRef.current.x;
        const deltaY = e.clientY - pointerStartRef.current.y;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        const pastThreshold =
          (swipeDirection === 'left' || swipeDirection === 'right' ? absX : absY) >= swipeThreshold;
        const directionMatches =
          (swipeDirection === 'left' && deltaX < 0) ||
          (swipeDirection === 'right' && deltaX > 0) ||
          (swipeDirection === 'up' && deltaY < 0) ||
          (swipeDirection === 'down' && deltaY > 0);
        setSwipeEnd({ x: deltaX, y: deltaY });
        setSwipeMove(null);
        setSwipeState('end');
        onSwipeEnd?.(e);
        if (pastThreshold && directionMatches) {
          handleOpenChange(false);
        }
        pointerStartRef.current = null;
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
        onPointerUp?.(e);
      },
      [swipeDirection, swipeThreshold, handleOpenChange, onSwipeEnd, onPointerUp]
    );

    const handlePointerCancel = React.useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
        setSwipeState('cancel');
        setSwipeMove(null);
        setSwipeEnd(null);
        pointerStartRef.current = null;
        onSwipeCancel?.(e);
        onPointerCancel?.(e);
      },
      [onSwipeCancel, onPointerCancel]
    );

    const ariaLive = type === 'foreground' ? 'assertive' : 'polite';

    const swipeStyle: React.CSSProperties = {
      ...(swipeMove && {
        '--radix-toast-swipe-move-x': `${swipeMove.x}px`,
        '--radix-toast-swipe-move-y': `${swipeMove.y}px`,
      }),
      ...(swipeEnd && {
        '--radix-toast-swipe-end-x': `${swipeEnd.x}px`,
        '--radix-toast-swipe-end-y': `${swipeEnd.y}px`,
      }),
      ...style,
    } as React.CSSProperties;

    const rootProps = {
      ref,
      role: 'status' as const,
      'aria-live': ariaLive as 'assertive' | 'polite',
      'aria-atomic': true as const,
      'data-state': open ? 'open' : 'closed',
      ...(swipeState && { 'data-swipe': swipeState }),
      ...(swipeDirectionState && { 'data-swipe-direction': swipeDirectionState }),
      ...(forceMount && !open && { 'aria-hidden': true, hidden: true }),
      style: swipeStyle,
      onKeyDown: handleKeyDown,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
      onFocus: handleFocus,
      onBlur: handleBlur,
      ...props,
    };

    const content = (
      <ToastRootContext.Provider value={rootContextValue}>
        {asChild ? (
          (() => {
            const child = React.Children.only(children);
            if (!React.isValidElement(child)) {
              return <div {...rootProps}>{children}</div>;
            }
            const mergedProps = mergeProps(
              rootProps as Record<string, unknown>,
              (child.props || {}) as Record<string, unknown>
            );
            return React.cloneElement(child, mergedProps);
          })()
        ) : (
          <div {...rootProps}>{children}</div>
        )}
      </ToastRootContext.Provider>
    );

    const shouldRender = open || forceMount;
    const container = viewportRef.current;

    if (!shouldRender) return null;

    if (container) {
      return createPortal(content, container);
    }

    return content;
  }
);
