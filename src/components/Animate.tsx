'use client';

// src/components/Animate.tsx
import React, { forwardRef, HTMLAttributes, JSX, ReactNode } from 'react';
import { useAnimation } from '@/hooks/useAnimation';


// Animation types supported by the component
type AnimationType = 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce';

// Animation configuration interface
export interface AnimationConfig {
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
}

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
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  className?: string;
  onAnimationComplete?: () => void;
}

/**
 * A wrapper component to easily apply animations using the useAnimation hook.
 * Supports forwarding refs and can render as any HTML element or component.
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
  ({ 
    children, 
    as: Component = 'div', 
    className = '',
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
    ...props 
  }, forwardedRef) => {
    // Create animation config object from props
    const animationConfig: AnimationConfig = {
      type,
      duration,
      delay,
      easing,
      distance,
      degrees,
      scale,
      opacity
    };

    // Use the animation hook
    const { ref, key } = useAnimation<HTMLDivElement>(animationConfig);
    
    // Combine the refs
    const setRefs = (element: HTMLDivElement | null) => {
      // Set the local ref from useAnimation
      if (typeof ref === 'object' && ref !== null) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
      }
      
      // Set the forwarded ref
      if (forwardedRef) {
        if (typeof forwardedRef === 'function') {
          forwardedRef(element);
        } else {
          (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = element;
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
        'data-animation-type': type,
        'data-animation-duration': duration ?? 0.5,
        'data-animation-delay': delay ?? 0,
      },
      children
    );
  }
);

Animate.displayName = 'Animate';

export default Animate;
