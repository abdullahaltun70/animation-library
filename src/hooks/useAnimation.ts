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
  const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialRenderRef = useRef(true);

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
    
    // **FIX 1: Don't reset transform - preserve current rotation state**
    // node.style.transform = ""; // REMOVED - this was causing jumps
    
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
      let degreesStart = DEFAULTS.degreesStart;
      let degreesEnd = DEFAULTS.degrees;

      if (typeof configDegrees === "number") {
        degreesEnd = configDegrees;
      } else if (configDegrees) {
        degreesStart = configDegrees.start ?? DEFAULTS.degreesStart;
        degreesEnd = configDegrees.end ?? configDegrees.start ?? DEFAULTS.degrees;
      }

      // **FIX 2: Use current computed rotation as start point for smooth transitions**
      const currentTransform = window.getComputedStyle(node).transform;
      let currentRotation = degreesStart;

      if (currentTransform !== "none" && currentTransform.includes("rotate")) {
        const match = currentTransform.match(/rotate$(-?\d+\.?\d*)deg$/);
        if (match) {
          currentRotation = parseFloat(match[1]);
        }
      }

      // **FIX 3: For initial render, don't animate unless explicitly requested**
      if (isInitialRenderRef.current && !config.animateOnMount) {
        // Set the target rotation immediately without animation
        node.style.transform = `rotate(${degreesEnd}deg)`;
        isInitialRenderRef.current = false;
        return;
      }

      // Set CSS custom properties for keyframe animations
      node.style.setProperty("--degrees-start", `${currentRotation}deg`);
      node.style.setProperty("--degrees-end", `${degreesEnd}deg`);

      // Determine animation direction
      let animationClass = "animate-rotate-positive";
      if (degreesEnd < currentRotation) {
        animationClass = "animate-rotate-negative";
      }

      // Apply CSS custom properties for animation timing
      node.style.setProperty("--animation-duration", `${duration}s`);
      node.style.setProperty("--animation-delay", `${delay}s`);
      node.style.setProperty("--animation-easing", easing);

      // Force reflow before applying animation class
      void node.offsetWidth;

      animationTimerRef.current = window.setTimeout(() => {
        const currentNode = elementRef.current;
        if (currentNode) {
          // Reset animation to ensure clean start
          currentNode.style.animation = "none";
          void currentNode.offsetWidth;
          currentNode.style.animation = "";

          // Add the animation class
          currentNode.classList.add(animationClass);

          if (onAnimationComplete) {
            currentNode.addEventListener("animationend", handleAnimationEndEvent);
          }
        }
      }, 10);

    } else {
      // Logic for class-based animations (fade, slide, scale, bounce)
      let animationClass = `animate-${type}`;

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
        // **FIX 4: Skip initial animation for non-rotate types unless explicitly requested**
        if (isInitialRenderRef.current && !config.animateOnMount) {
          isInitialRenderRef.current = false;
          return;
        }

        // Initial reflow after properties are set and old classes are removed
        void node.offsetWidth;

        animationTimerRef.current = window.setTimeout(() => {
          const currentNode = elementRef.current;
          if (currentNode) {
            // Reset animation for clean start
            currentNode.style.animation = "none";
            void currentNode.offsetWidth;
            currentNode.style.animation = "";

            // Add the class to trigger the animation
            currentNode.classList.add(animationClass);

            if (onAnimationComplete) {
              currentNode.addEventListener("animationend", handleAnimationEndEvent);
            }
          }
        }, 10);
      }
    }

    // Mark that initial render is complete
    isInitialRenderRef.current = false;

    return () => {
      // Cleanup listeners when effect re-runs or component unmounts
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
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
    configDegrees,
    scale,
    opacity.start,
    opacity.end,
    axis,
    key,
    onAnimationComplete,
    handleAnimationEndEvent,
    config.animateOnMount, // Add this to dependencies
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
function validateTime(value: number | undefined, defaultValue: number): number {
  const numValue = typeof value === "number" ? value : NaN;
  if (!isNaN(numValue) && numValue >= 0) {
    return numValue;
  }
  return defaultValue;
}

function validateOpacity(value: number | undefined, defaultValue: number): number {
  const numValue = typeof value === "number" ? value : NaN;
  if (!isNaN(numValue) && numValue >= 0 && numValue <= 1) {
    return numValue;
  }
  return defaultValue;
}