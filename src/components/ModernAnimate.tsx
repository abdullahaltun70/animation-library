"use client";

import React, { forwardRef, HTMLAttributes, ReactNode } from "react";
import { useModernAnimation } from "../hooks/useModernAnimation";
import {
  AnimationStateData,
  AnimationState,
  AnimationTrigger,
  ModernAnimationConfig,
} from "../types/modern";

export interface ModernAnimateRef {
  trigger: (triggerType?: AnimationTrigger) => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
  cancel: () => void;
  state: AnimationState;
}

interface ModernAnimateProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  config: ModernAnimationConfig;
  as?: keyof React.JSX.IntrinsicElements | React.ComponentType<any>;
  className?: string;
  onStateChange?: (state: string) => void;
}

/**
 * Modern animation component with CSS-based state management and advanced controls
 *
 * Features:
 * - CSS custom properties for dynamic control
 * - Data attributes for state-based styling
 * - Intersection Observer support for scroll triggers
 * - Reduced motion respect
 * - Performance optimizations
 *
 * @example
 * ```tsx
 * // Single animation type
 * <ModernAnimate
 *   config={{
 *     type: 'fade',
 *     duration: 0.6,
 *     trigger: 'visible',
 *     easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
 *   }}
 * >
 *   <div>Content to animate</div>
 * </ModernAnimate>
 *
 * // Multiple animation types with additional properties
 * <ModernAnimate
 *   config={{
 *     type: ['fade', 'slide'],
 *     axis: 'y',
 *     distance: 30,
 *     duration: [0.5, 0.8],
 *     trigger: 'visible'
 *   }}
 * >
 *   <div>Slides up and fades in</div>
 * </ModernAnimate>
 * ```
 *
 * @example CSS state management
 * ```css
 * .my-element[data-animation-state="animating"] {
 *   pointer-events: none;
 * }
 *
 * .my-element[data-hover="true"] {
 *   --animation-duration: 0.2s;
 * }
 * ```
 */
export const ModernAnimate = forwardRef<ModernAnimateRef, ModernAnimateProps>(
  (
    {
      children,
      config,
      as: Component = "div",
      className = "",
      onStateChange,
      // Separate config from other props that might be HTML attributes
      ...htmlProps // these are the actual HTML attributes
    },
    forwardedRef
  ) => {
    const {
      ref: animationRef,
      state,
      trigger,
      pause,
      resume,
      restart,
      cancel,
      dataAttributes,
    } = useModernAnimation(config); // config is used here

    // Use the animation ref directly instead of combining refs
    const elementRef = animationRef;

    // Notify parent of state changes
    React.useEffect(() => {
      onStateChange?.(state);
    }, [state, onStateChange]);

    // Add animation control methods to the component
    React.useImperativeHandle(
      forwardedRef,
      () => ({
        trigger,
        pause,
        resume,
        restart,
        cancel,
        state,
      }),
      [trigger, pause, resume, restart, cancel, state]
    );

    // Do not spread the entire config prop here; only htmlProps
    return React.createElement(
      Component as any,
      {
        ref: elementRef,
        className: `modern-animate ${className}`.trim(),
        ...dataAttributes, // these are fine, they are data-* attributes
        ...htmlProps, // spread only the remaining valid HTML attributes
      },
      children
    );
  }
);

ModernAnimate.displayName = "ModernAnimate";
