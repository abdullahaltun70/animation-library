import React, { forwardRef, HTMLAttributes, ReactNode, Children } from "react";
import {
  useStaggeredAnimation,
  StaggerConfig,
} from "../hooks/useStaggeredAnimation";

export interface StaggeredAnimateRef {
  trigger: () => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
  cancel: () => void;
  elementCount: number;
}

interface StaggeredAnimateProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  config: StaggerConfig;
  as?: keyof React.JSX.IntrinsicElements | React.ComponentType<any>;
  className?: string;
  autoStart?: boolean;
  itemClassName?: string;
}

/**
 * Component for creating staggered animations across child elements
 *
 * @example
 * ```tsx
 * <StaggeredAnimate
 *   config={{
 *     animations: [{ type: 'fade', duration: 0.3 }],
 *     delay: 0.1,
 *     direction: 'forward'
 *   }}
 *   autoStart
 * >
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </StaggeredAnimate>
 * ```
 */
export const StaggeredAnimate = forwardRef<
  StaggeredAnimateRef,
  StaggeredAnimateProps
>(
  (
    {
      children,
      config,
      as: Component = "div",
      className = "",
      itemClassName = "",
      autoStart = false,
      ...props
    },
    forwardedRef
  ) => {
    const childrenArray = Children.toArray(children);
    const { refs, trigger, pause, resume, restart, cancel } =
      useStaggeredAnimation(config, childrenArray.length);

    // Auto-start if configured
    React.useEffect(() => {
      if (autoStart && refs.length > 0) {
        trigger();
      }
    }, [autoStart, refs.length, trigger]);

    // Expose control methods
    React.useImperativeHandle(
      forwardedRef,
      () => ({
        trigger,
        pause,
        resume,
        restart,
        cancel,
        elementCount: refs.length,
      }),
      [trigger, pause, resume, restart, cancel, refs.length]
    );

    // Clone children with refs
    const enhancedChildren = childrenArray.map((child, index) => {
      if (!React.isValidElement(child)) return child;

      const ref = refs[index];
      if (!ref) return child;

      return React.cloneElement(child as React.ReactElement<any>, {
        ref,
        className: `${
          (child.props as any).className || ""
        } staggered-item ${itemClassName}`.trim(),
        "data-stagger-index": index,
        "data-stagger-total": childrenArray.length,
      });
    });

    return React.createElement(
      Component as any,
      {
        className: `staggered-animate ${className}`.trim(),
        "data-stagger-direction": config.direction || "forward",
        "data-stagger-count": childrenArray.length,
        ...props,
      },
      enhancedChildren
    );
  }
);

StaggeredAnimate.displayName = "StaggeredAnimate";
