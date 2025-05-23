"use client";

import { AnimationConfig, SlideAxis } from "@/types/index";
import { useCallback, useEffect, useRef, useState } from "react";

export interface UseAnimationReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  key: number; // Key to force re-render and replay animation
  replay: () => void; // Function to manually replay the animation
}

const DEFAULTS = {
  duration: 0.5,
  delay: 0,
  easing: "ease-out",
  opacityStart: 0,
  opacityEnd: 1,
  distance: 50,
  degrees: 360, // Default end rotation for one-shot keyframe animation
  degreesStart: 0, // Default start rotation for one-shot keyframe animation
  scale: 0.8,
  axis: "x" as SlideAxis,
};

/**
 * Custom hook to apply CSS animations based on configuration.
 * Returns a ref to attach to the target element, a key for re-renders, and a replay function.
 */
export function useAnimation<T extends HTMLElement>(
  config: AnimationConfig,
  onAnimationComplete?: (event: Event) => void
): UseAnimationReturn<T> {
  const {
    type,
    duration: configDuration,
    delay: configDelay,
    easing: configEasing,
    distance: configDistance,
    degrees: configDegrees,
    scale: configScale,
    opacity: configOpacity,
    axis: configAxis,
  } = config;

  const duration = validateTime(configDuration, DEFAULTS.duration);
  const delay = validateTime(configDelay, DEFAULTS.delay);
  const easing = configEasing || DEFAULTS.easing;
  const distance = configDistance ?? DEFAULTS.distance;
  const scale = configScale ?? DEFAULTS.scale;
  const axis = configAxis || DEFAULTS.axis;
  const opacity = {
    start: validateOpacity(configOpacity?.start, DEFAULTS.opacityStart),
    end: validateOpacity(configOpacity?.end, DEFAULTS.opacityEnd),
  };

  const [key, setKey] = useState(0);
  const elementRef = useRef<T>(null);
  const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null); // Ref for the animation timer

  const handleAnimationEndEvent = useCallback(
    (event: Event) => {
      if (event.target === elementRef.current && onAnimationComplete) {
        onAnimationComplete(event);
        // Remove listener after execution
        if (event.type === "animationend") {
          elementRef.current?.removeEventListener(
            "animationend",
            handleAnimationEndEvent
          );
        } else if (event.type === "transitionend") {
          elementRef.current?.removeEventListener(
            "transitionend",
            handleAnimationEndEvent
          );
        }
      }
    },
    [onAnimationComplete]
  );

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    // Clear any previous animation/transition related styles and classes
    node.style.transition = "";
    node.style.transform = ""; // Reset transform if switching types
    const classesToRemove = Array.from(node.classList).filter((cls) =>
      cls.startsWith("animate-")
    );
    classesToRemove.forEach((cls) => node.classList.remove(cls));

    // Remove previous listeners to avoid multiple calls
    node.removeEventListener("animationend", handleAnimationEndEvent);
    node.removeEventListener("transitionend", handleAnimationEndEvent);

    // Clear any pending animation timer from previous effect run
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
    }

    if (type === "rotate") {
      let endDeg = DEFAULTS.degreesStart; // Default to start, effectively no rotation
      if (typeof configDegrees === "number") {
        endDeg = configDegrees;
      } else if (configDegrees && typeof configDegrees.end === "number") {
        endDeg = configDegrees.end;
      }
      // configDegrees.start is ignored for dynamic transitions, which animate from current value.

      node.style.transition = `transform ${duration}s ${easing} ${delay}s`;
      node.style.transform = `rotate(${endDeg}deg)`;

      if (onAnimationComplete) {
        node.addEventListener("transitionend", handleAnimationEndEvent);
      }
    } else {
      // Logic for class-based animations (fade, slide, scale, bounce)
      let animationClass = `animate-${type}`; // Base class like animate-fade, animate-scale

      if (type === "slide") {
        const directionSuffix = distance >= 0 ? "positive" : "negative";
        animationClass = `animate-${type}-${axis}-${directionSuffix}`;
      } else if (type === "bounce") {
        const directionSuffix = distance >= 0 ? "positive" : "negative";
        animationClass = `animate-${type}-${directionSuffix}`;
      }

      // Apply CSS custom properties for keyframe-based animations
      node.style.setProperty("--animation-duration", `${duration}s`);
      node.style.setProperty("--animation-delay", `${delay}s`);
      node.style.setProperty("--animation-easing", easing);

      if (type === "fade") {
        node.style.setProperty("--opacity-start", `${opacity.start}`);
        node.style.setProperty("--opacity-end", `${opacity.end}`);
      }
      if (type === "slide") {
        node.style.setProperty("--distance", `${Math.abs(distance)}px`);
        node.style.setProperty("--opacity-start", `${opacity.start}`);
        node.style.setProperty("--opacity-end", `${opacity.end}`);
      }
      if (type === "scale") {
        node.style.setProperty("--scale", `${scale}`);
        node.style.setProperty("--opacity-start", `${opacity.start}`);
        node.style.setProperty("--opacity-end", `${opacity.end}`);
      }
      if (type === "bounce") {
        node.style.setProperty("--distance", `${distance}px`);
        node.style.setProperty("--opacity-start", `${opacity.start}`);
        node.style.setProperty("--opacity-end", `${opacity.end}`);
      }

      if (animationClass) {
        // Initial reflow after properties are set and old classes are removed (done at the top of useEffect)
        void node.offsetWidth;

        animationTimerRef.current = window.setTimeout(() => {
          const currentNode = elementRef.current;
          if (currentNode) {
            // More forceful animation reset
            currentNode.style.animation = "none"; // 1. Temporarily disable animations

            void currentNode.offsetWidth; // 2. Force reflow

            currentNode.style.animation = ""; // 3. Clear the inline style so class animation can apply

            // Add the class to trigger the animation
            currentNode.classList.add(animationClass); // 4. Add class

            if (onAnimationComplete) {
              currentNode.addEventListener(
                "animationend",
                handleAnimationEndEvent
              );
            }
          }
        }, 20); // Increased delay slightly to 20ms
      }
    }

    return () => {
      // Cleanup listeners when effect re-runs or component unmounts
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current); // Clear the timer on cleanup
      }
      if (node) {
        // node is from the useEffect closure
        node.removeEventListener("animationend", handleAnimationEndEvent);
        node.removeEventListener("transitionend", handleAnimationEndEvent);
      }
    };
  }, [
    type,
    duration,
    delay,
    easing,
    distance,
    configDegrees,
    scale,
    opacity.start,
    opacity.end,
    axis,
    key,
    onAnimationComplete,
    handleAnimationEndEvent,
  ]);

  const replay = useCallback(() => {
    const node = elementRef.current;
    if (node) {
      // **FIX 5: Improved replay logic**
      // Temporarily disable animations
      node.style.animation = "none";

      // Remove all animation classes
      const classesToRemove = Array.from(node.classList).filter((cls) =>
        cls.startsWith("animate-")
      );
      classesToRemove.forEach((cls) => node.classList.remove(cls));

      // Force reflow to reset animation state
      void node.offsetHeight;

      // Re-enable animations
      node.style.animation = "";
    }

    // Increment key to fully re-trigger effects
    setKey((prevKey) => prevKey + 1);
  }, []);

  return { ref: elementRef, key, replay };
}

// Helper validation functions
/**
 * Validates if a value is a non-negative number, otherwise returns a default.
 * @param value The value to validate.
 * @param defaultValue The default value to return if validation fails.
 * @returns A valid non-negative number.
 */
function validateTime(value: number | undefined, defaultValue: number): number {
  // Ensure value is a number before checking if it's non-negative
  const numValue = typeof value === "number" ? value : NaN;
  if (!isNaN(numValue) && numValue >= 0) {
    return numValue;
  }
  return defaultValue;
}

/**
 * Validates if a value is a number between 0 and 1 (inclusive) for opacity.
 * @param value The value to validate.
 * @param defaultValue The default value to use if value is not a number.
 * @returns A valid opacity value (0-1).
 */
function validateOpacity(
  value: number | undefined,
  defaultValue: number
): number {
  const numValue = typeof value === "number" ? value : defaultValue;
  // Ensure opacity is between 0 and 1 after defaulting
  return Math.max(0, Math.min(1, numValue));
}
