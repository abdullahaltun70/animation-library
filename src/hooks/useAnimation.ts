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
  axis: "x" as SlideAxis, // Changed from ax to axis
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
        // Bounce keyframes might use --distance or a specific bounce height var
        node.style.setProperty("--bounce-height", `${distance}px`); // Assuming keyframes use --bounce-height
        node.style.setProperty("--opacity-start", `${opacity.start}`);
        node.style.setProperty("--opacity-end", `${opacity.end}`);
      }
      // Note: The old logic for keyframe-based 'rotate' (animate-rotate-positive/negative) is removed
      // as 'rotate' type now exclusively uses transitions.

      if (animationClass) {
        // Force reflow to ensure the browser processes style changes and
        // class removal (done at the start of useEffect) before re-adding the class.
        // This is crucial for replaying keyframe animations on the same DOM node.
        void node.offsetWidth;

        node.classList.add(animationClass);
        if (onAnimationComplete) {
          node.addEventListener("animationend", handleAnimationEndEvent);
        }
      }
    }

    return () => {
      // Cleanup listeners when effect re-runs or component unmounts
      if (node) {
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
    configDegrees, // Use configDegrees for rotate
    scale,
    opacity.start, // Use destructured and validated opacity values
    opacity.end,
    axis,
    key,
    onAnimationComplete,
    handleAnimationEndEvent, // Added handleAnimationEndEvent
  ]);

  const replay = useCallback(() => {
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
