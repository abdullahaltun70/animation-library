"use client";

import React, { forwardRef, HTMLAttributes, ReactNode, Children } from "react";
import {
  useStaggeredAnimation,
  StaggerConfig,
} from "../hooks/useStaggeredAnimation";
import { ModernAnimationConfig } from "../types/modern";

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
  itemAnimation: ModernAnimationConfig;
  staggerDelay: number;
  staggerDirection?: "forward" | "reverse" | "center-out";
  maxConcurrent?: number;
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
 *   itemAnimation={{ type: 'fade', duration: 0.3 }}
 *   staggerDelay={0.1}
 *   staggerDirection='forward'
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
      itemAnimation,
      staggerDelay,
      staggerDirection,
      maxConcurrent,
      as: Component = "div",
      className = "",
      itemClassName = "",
      autoStart = false,
      ...props
    },
    forwardedRef
  ) => {
    const childrenArray = Children.toArray(children);

    const staggerHookConfig: StaggerConfig = {
      animations: [itemAnimation], // Wrap the single itemAnimation into an array as expected by the hook
      delay: staggerDelay,
      direction: staggerDirection,
      maxConcurrent: maxConcurrent,
    };

    const { refs, trigger, pause, resume, restart, cancel } =
      useStaggeredAnimation(staggerHookConfig, childrenArray.length);

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
        "data-stagger-direction": staggerDirection || "forward",
        "data-stagger-count": childrenArray.length,
        ...props,
      },
      enhancedChildren
    );
  }
);

StaggeredAnimate.displayName = "StaggeredAnimate";
