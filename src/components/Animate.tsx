"use client";

// src/components/Animate.tsx
import React, { forwardRef, HTMLAttributes, JSX, ReactNode } from "react";
import { useAnimation } from "@/hooks/useAnimation";
import { AnimationConfig, AnimationType, SlideAxis } from "@/types/index";

// Props for the Animate component
interface AnimateProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  type: AnimationType;
  duration?: number;
  delay?: number;
  easing?: string;
  distance?: number;
  degrees?: number;
  scale?: number;
  opacity?: {
    start?: number;
    end?: number;
  };
  axis?: SlideAxis; // Add this for slide animation
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  className?: string;
  onAnimationComplete?: () => void;
}

/**
 * A wrapper component to easily apply animations using the useAnimation hook.
 * Supports forwarding refs and can render as any HTML element or component.
 *
 * @property {ReactNode} children - The content to animate.
 * @property {AnimationType} type - The type of animation to apply (e.g., "fade", "slide").
 * @property {number} [duration] - Duration of the animation in seconds.
 * @property {number} [delay] - Delay before the animation starts in seconds.
 * @property {string} [easing] - Easing function for the animation.
 * @property {number} [distance] - Distance for slide or bounce animations.
 * @property {number} [degrees] - Degrees for rotate animations.
 * @property {number} [scale] - Scale factor for scale animations.
 * @property {object} [opacity] - Opacity settings for fade animations (e.g., `{ start: 0, end: 1 }`).
 * @property {SlideAxis} [axis] - Axis for slide animations ('x' or 'y', defaults to 'x').
 * @property {keyof JSX.IntrinsicElements | React.ComponentType<any>} [as] - The HTML element or component to render as.
 * @property {string} [className] - Additional CSS classes to apply.
 * @property {function} [onAnimationComplete] - Callback function when the animation completes.
 *
 * @example
 * <Animate
 *   type="fade"
 *   duration={0.5}
 *   className="my-custom-class"
 * >
 *   <p>Content to animate</p>
 * </Animate>
 */
export const Animate = forwardRef<HTMLDivElement, AnimateProps>(
  (
    {
      children,
      as: Component = "div",
      className = "",
      onAnimationComplete,
      // Animation config props
      type,
      duration,
      delay,
      easing,
      distance,
      degrees,
      scale,
      opacity,
      axis, // Destructured axis for slide animation
      ...props
    },
    forwardedRef
  ) => {
    // Create animation config object from props
    const animationConfig: AnimationConfig = {
      type,
      duration,
      delay,
      easing,
      distance,
      degrees,
      scale,
      opacity,
      axis, // Pass axis to config
    };

    // Use the animation hook
    const { ref, key } = useAnimation<HTMLDivElement>(animationConfig);

    // Combine the refs
    const setRefs = (element: HTMLDivElement | null) => {
      // Set the local ref from useAnimation
      if (typeof ref === "object" && ref !== null) {
        (ref as React.RefObject<HTMLDivElement | null>).current = element;
      }

      // Set the forwarded ref
      if (forwardedRef) {
        if (typeof forwardedRef === "function") {
          forwardedRef(element);
        } else {
          (forwardedRef as React.RefObject<HTMLDivElement | null>).current =
            element;
        }
      }
    };

    // Handle animation end event
    const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
      // Only trigger if it's the main animation ending, not child animations
      if (e.target === ref.current) {
        onAnimationComplete?.();
      }

      // Call the original onAnimationEnd if provided in props
      props.onAnimationEnd?.(e);
    };

    // Create combined className
    const combinedClassName = `animated ${className}`.trim();

    // Use createElement to properly handle the dynamic component type
    return React.createElement(
      Component,
      {
        ...props,
        ref: setRefs,
        className: combinedClassName,
        key, // Key helps force re-animation
        onAnimationEnd: handleAnimationEnd,
        // Add data attributes for potential debugging/testing
        "data-animation-type": type,
        "data-animation-duration": duration ?? 0.5,
        "data-animation-delay": delay ?? 0,
      },
      children
    );
  }
);

Animate.displayName = "Animate";

export default Animate;
