import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimationState,
  AnimationTrigger,
  AnimationStateData,
  ModernAnimationConfig,
} from "../types/modern";

export interface UseModernAnimationReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  state: AnimationState;
  trigger: (triggerType?: AnimationTrigger) => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
  cancel: () => void;
  dataAttributes: AnimationStateData;
}

/**
 * Modern animation hook with full configuration support
 */
export function useModernAnimation<T extends HTMLElement>(
  config: ModernAnimationConfig
): UseModernAnimationReturn<T> {
  const elementRef = useRef<T | null>(null);
  const [state, setState] = useState<AnimationState>("idle");
  const [currentTrigger, setCurrentTrigger] = useState<AnimationTrigger>(
    config.trigger || "mount"
  );

  // Check for reduced motion preference
  const prefersReducedMotion = useCallback(() => {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  // Main animation trigger function
  const trigger = useCallback(
    (triggerType: AnimationTrigger = currentTrigger) => {
      const element = elementRef.current;
      if (!element || state === "animating") return;

      // Check for reduced motion
      if (config.respectReducedMotion !== false && prefersReducedMotion()) {
        setState("completed");
        config.onComplete?.();
        return;
      }

      console.log('[Animation Hook] Setting state to "animating"'); // New Log

      setState("animating");
      setCurrentTrigger(triggerType);

      // Set CSS properties with enhanced array safety
      if (config.duration !== undefined) {
        const duration = Array.isArray(config.duration)
          ? config.duration.length > 0
            ? config.duration[0]
            : 0.5
          : config.duration;
        element.style.setProperty("--animation-duration", `${duration}s`);
        console.log(
          "[Animation Hook] Set --animation-duration:",
          `${duration}s`
        ); // New Log
      }
      if (config.delay !== undefined) {
        const delay = Array.isArray(config.delay)
          ? config.delay.length > 0
            ? config.delay[0]
            : 0
          : config.delay;
        element.style.setProperty("--animation-delay", `${delay}s`);
        
      }
      if (config.easing) {
        const easing = Array.isArray(config.easing)
          ? config.easing.length > 0
            ? config.easing[0]
            : "ease-out"
          : config.easing;
        element.style.setProperty("--animation-easing", easing);
      }

      // Set type-specific properties
      if (config.distance !== undefined) {
        element.style.setProperty(
          "--animation-distance",
          `${config.distance}px`
        );
      }
      if (config.axis) {
        element.style.setProperty("--animation-axis", config.axis);
      }
      if (config.degrees !== undefined) {
        const degrees =
          typeof config.degrees === "number"
            ? config.degrees
            : config.degrees.end;
        element.style.setProperty("--animation-degrees", `${degrees}deg`);
      }
      if (config.scale !== undefined) {
        const scale =
          typeof config.scale === "number" ? config.scale : config.scale.end;
        element.style.setProperty("--animation-scale", `${scale}`);
      }

      // Add animation classes - handle both single type and array of types
      const types = Array.isArray(config.type) ? config.type : [config.type];
      types.forEach((type) => {
        element.classList.add(`animate-${type}`);
      });

      // Set data attributes
      element.dataset.animationState = "animating";
      element.dataset.animationTrigger = triggerType;

      config.onStart?.();

      // Listen for animation end
      const handleAnimationEnd = () => {
        setState("completed");
        element.dataset.animationState = "completed";
        config.onComplete?.();
        element.removeEventListener("animationend", handleAnimationEnd);
        element.removeEventListener("transitionend", handleAnimationEnd);
      };

      element.addEventListener("animationend", handleAnimationEnd);
      element.addEventListener("transitionend", handleAnimationEnd);
    },
    [config, state, currentTrigger, prefersReducedMotion]
  );

  // Control functions
  const pause = useCallback(() => {
    const element = elementRef.current;
    if (!element || state !== "animating") return;

    setState("paused");
    element.dataset.animationState = "paused";
    element.style.animationPlayState = "paused";
  }, [state]);

  const resume = useCallback(() => {
    const element = elementRef.current;
    if (!element || state !== "paused") return;

    setState("animating");
    element.dataset.animationState = "animating";
    element.style.animationPlayState = "running";
  }, [state]);

  const restart = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    // Remove animation classes with enhanced safety - handle both single type and array of types
    const types = Array.isArray(config.type) ? config.type : [config.type];
    types.forEach((type) => {
      element.classList.remove(`animate-${type}`);
    });

    // Clear any lingering animation properties
    element.style.animationPlayState = "";
    setState("idle");
    element.dataset.animationState = "idle";

    // Trigger reflow
    element.offsetHeight;

    // Restart animation with a slight delay to ensure proper reset
    setTimeout(() => trigger(), 10);
  }, [config, trigger]);

  const cancel = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    setState("idle");
    element.dataset.animationState = "idle";

    // Clear animation state more thoroughly
    element.style.animationPlayState = "";
    element.style.animation = "";

    // Remove animation classes with enhanced safety - handle both single type and array of types
    const types = Array.isArray(config.type) ? config.type : [config.type];
    types.forEach((type) => {
      element.classList.remove(`animate-${type}`);
    });
  }, [config]);

  // Auto-trigger on mount if configured
  useEffect(() => {
    if (config.trigger === "mount" || !config.trigger) {
      trigger("mount");
    }
  }, [config.trigger, trigger]);

  // Generate data attributes
  const dataAttributes: AnimationStateData = {
    "data-animation-state": state,
    "data-animation-trigger": currentTrigger,
  };

  return {
    ref: elementRef,
    state,
    trigger,
    pause,
    resume,
    restart,
    cancel,
    dataAttributes,
  };
}
