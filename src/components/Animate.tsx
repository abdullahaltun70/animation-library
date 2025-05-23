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
  degrees?:
    | number
    | {
        // Updated to match AnimationConfig
        start?: number;
        end: number;
      };
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
 * The component adds an "animated" class to its root element.
 *
 * @property {ReactNode} children - The content to animate. Must be a single React element that can accept a ref.
 * @property {AnimationType} type - The type of animation to apply (e.g., "fade", "slide").
 * @property {number} [duration=0.5] - Duration of the animation in seconds.
 * @property {number} [delay=0] - Delay before the animation starts in seconds.
 * @property {string} [easing="ease-out"] - Easing function for the animation.
 * @property {number} [distance=50] - Distance for slide or bounce animations.
 * @property {number | { start?: number; end: number }} [degrees=360] - Degrees for rotate animations.
 * @property {number} [scale=0.8] - Scale factor for scale animations.
 * @property {{ start?: number; end?: number }} [opacity] - Opacity settings for animations (e.g., `{ start: 0, end: 1 }`).
 * @property {SlideAxis} [axis="x"] - Axis for slide animations ('x' or 'y').
 * @property {keyof JSX.IntrinsicElements | React.ComponentType<any>} [as="div"] - The HTML element or component to render as.
 * @property {string} [className] - Additional CSS classes to apply.
 * @property {() => void} [onAnimationComplete] - Callback function when the animation completes.
 *
 * @example
 * <Animate
 *   type="fade"
 *   duration={0.5}
 *   className="my-custom-class"
 * >
 *   {children}
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
      axis,
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
      axis,
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
