// src/hooks/useAnimation.ts
'use client'; 

import { useEffect, useRef, useState, useCallback } from 'react';

// Define the types needed for the hook
export type AnimationType = 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce';

export interface AnimationConfig {
  type: AnimationType;
  duration?: number;
  delay?: number;
  easing?: string;
  distance?: number; // Used for slide, bounce
  degrees?: number; // Used for rotate
  scale?: number; // Used for scale
  opacity?: { // Used for fade
    start?: number;
    end?: number;
  };
}

interface UseAnimationReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  key: number; // Key to force re-render/re-animation
  replay: () => void;
}

const DEFAULTS = {
  duration: 0.5,
  delay: 0,
  easing: 'ease-out',
  opacityStart: 0,
  opacityEnd: 1,
  distance: 50,
  degrees: 360,
  scale: 0.8,
};

/**
 * Custom hook to apply CSS animations based on configuration.
 * Returns a ref to attach to the target element and a replay function.
 */
export function useAnimation<T extends HTMLElement>(
  config: AnimationConfig
): UseAnimationReturn<T> {
  const {
    type,
    duration = DEFAULTS.duration,
    delay = DEFAULTS.delay,
    easing = DEFAULTS.easing,
    distance,
    degrees,
    scale,
    opacity = {},
  } = config;

  const { start: opacityStart = DEFAULTS.opacityStart, end: opacityEnd = DEFAULTS.opacityEnd } = opacity;

  const [key, setKey] = useState(0);
  const elementRef = useRef<T>(null);

  // Memoize the function to get the correct animation class WITH direction
  const getAnimationClass = useCallback((): string => {
    switch (type) {
      case 'fade':
        return 'animate-fade'; // Matches _animations.scss
      case 'slide': {
        // Determine direction based on distance sign. Default to positive if undefined/zero.
        const effectiveDistance = distance ?? DEFAULTS.distance;
        // NOTE: Assuming X-axis slide for now based on original library structure.
        // Could add an 'axis' prop if Y-axis slides are needed.
        return effectiveDistance >= 0 ? 'animate-slide-x-positive' : 'animate-slide-x-negative';
      }
      case 'scale':
        return 'animate-scale';
      case 'rotate': {
        const effectiveDegrees = degrees ?? DEFAULTS.degrees;
        return effectiveDegrees >= 0 ? 'animate-rotate-positive' : 'animate-rotate-negative';
      }
      case 'bounce': {
        // Using distance sign for bounce direction (positive=up, negative=down)
        const effectiveDistance = distance ?? DEFAULTS.distance;
        return effectiveDistance >= 0 ? 'animate-bounce-positive' : 'animate-bounce-negative';
      }
      default:
         // Help TypeScript ensure all cases are handled
         const _exhaustiveCheck: never = type;
         console.warn(`Unknown animation type: ${type}`);
         return '';
    }
  }, [type, distance, degrees]);


  // Effect to apply styles and classes
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const animationClass = getAnimationClass();
    if (!animationClass) return;

     // --- Clean up previous classes ---
     const classesToRemove = Array.from(element.classList).filter(cls => cls.startsWith('animate-'));
     if (classesToRemove.length > 0) {
        element.classList.remove(...classesToRemove);
     }

     // --- Apply new class ---
     // Force reflow before adding class might be needed in some edge cases for replay,
     // but key-based re-render often suffices.
     // void element.offsetWidth; // Example reflow trigger (use cautiously)
     element.classList.add(animationClass);


    // --- Set CSS Custom Properties ---
    // Ensure values are valid numbers before setting
    element.style.setProperty('--animation-duration', `${validateTime(duration, DEFAULTS.duration)}s`);
    element.style.setProperty('--animation-delay', `${validateTime(delay, DEFAULTS.delay)}s`);
    element.style.setProperty('--animation-easing', easing);

    // Type-specific properties - use ABSOLUTE values for magnitude variables
    if (type === 'fade') {
      element.style.setProperty('--opacity-start', validateOpacity(opacityStart).toString());
      element.style.setProperty('--opacity-end', validateOpacity(opacityEnd).toString());
    }

    if (type === 'slide' || type === 'bounce') {
        const distanceValue = distance !== undefined ? distance : DEFAULTS.distance;
        // **FIX**: Use absolute value for the CSS variable magnitude
        element.style.setProperty('--distance', `${Math.abs(distanceValue)}px`);
    }

    if (type === 'rotate') {
        const degreesValue = degrees !== undefined ? degrees : DEFAULTS.degrees;
        // **FIX**: Use absolute value for the CSS variable magnitude
        element.style.setProperty('--degrees', `${Math.abs(degreesValue)}deg`);
    }

    if (type === 'scale') {
        const scaleValue = scale !== undefined ? scale : DEFAULTS.scale;
        element.style.setProperty('--scale', scaleValue.toString());
    }

    // Cleanup function
    return () => {
      if (elementRef.current) {
        elementRef.current.classList.remove(animationClass);
        // Maybe clear custom properties if needed, though often overkill
        // elementRef.current.style.removeProperty('--animation-duration');
        // ... etc
      }
    };
  }, [key, type, duration, delay, easing, distance, degrees, scale, opacityStart, opacityEnd, getAnimationClass]);

  const replay = useCallback(() => {
    setKey((prevKey) => prevKey + 1);
  }, []);

  return { ref: elementRef, key, replay };
}

// Helper validation functions
function validateTime(value: number | undefined, defaultValue: number): number {
  return typeof value === 'number' && value >= 0 ? value : defaultValue;
}

function validateOpacity(value: number): number {
    // Ensure opacity is between 0 and 1
    const numValue = typeof value === 'number' ? value : NaN;
    if (isNaN(numValue)) {
        // Decide a default if value is invalid - depends if it's start or end
        // Returning 0 here, but could be context-dependent (like DEFAULTS.opacityStart/End)
        return 0;
    }
    return Math.max(0, Math.min(1, numValue));
}