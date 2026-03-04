import React from 'react';
import { mergeProps } from '../../utils/slot';
import { useAvatarContext, type AvatarImageStatus } from './context';

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  asChild?: boolean;
  onLoadingStatusChange?: (status: AvatarImageStatus) => void;
}

export const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  function AvatarImage(
    { asChild, onLoadingStatusChange, src, onLoad, onError, children, ...props },
    ref
  ) {
    const { setImageStatus } = useAvatarContext();

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setImageStatus('loaded');
      onLoadingStatusChange?.('loaded');
      onLoad?.(e);
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setImageStatus('error');
      onLoadingStatusChange?.('error');
      onError?.(e);
    };

    React.useEffect(() => {
      if (src) {
        setImageStatus('loading');
        onLoadingStatusChange?.('loading');
      }
    }, [src, setImageStatus, onLoadingStatusChange]);

    const imageProps = {
      ref,
      src,
      onLoad: handleLoad,
      onError: handleError,
      ...props,
    };

    if (asChild && children) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        return <img {...imageProps} />;
      }
      const mergedProps = mergeProps(
        imageProps as Record<string, unknown>,
        (child.props || {}) as Record<string, unknown>
      );
      return React.cloneElement(child, mergedProps);
    }

    return <img {...imageProps} />;
  }
);
