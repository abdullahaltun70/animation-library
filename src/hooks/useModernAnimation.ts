import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimationState,
  AnimationTrigger,
  AnimationStateData,
  ModernAnimationConfig,
} from "../types/modern";

// Helper function to create combined animations
function createCombinedAnimation(types: string[], combinedName: string) {
  // Create keyframes for the combination
  let fromTransforms: string[] = [];
  let toTransforms: string[] = [];
  let fromOpacity = "1";
  let toOpacity = "1";

  types.forEach((type) => {
    switch (type) {
      case "scale":
        fromTransforms.push("scale(var(--animation-scale, 0.8))");
        toTransforms.push("scale(1)");
        break;
      case "bounce":
        // Bounce effect - use a more subtle approach for combinations
        fromTransforms.push("translateY(var(--animation-distance, 20px))");
        toTransforms.push("translateY(0)");
        break;
      case "fade":
        fromOpacity = "var(--opacity-start, 0)";
        toOpacity = "var(--opacity-end, 1)";
        break;
      case "rotate":
        fromTransforms.push("rotate(0deg)");
        toTransforms.push("rotate(var(--animation-degrees, 180deg))");
        break;
      case "slide":
        // Handle slide based on axis
        fromTransforms.push("translateX(var(--animation-distance, 50px))");
        toTransforms.push("translateX(0)");
        break;
      case "slide-x":
        fromTransforms.push("translateX(var(--animation-distance, 50px))");
        toTransforms.push("translateX(0)");
        break;
      case "slide-y":
        fromTransforms.push("translateY(var(--animation-distance, 50px))");
        toTransforms.push("translateY(0)");
        break;
    }
  });

  const fromTransform =
    fromTransforms.length > 0 ? fromTransforms.join(" ") : "none";
  const toTransform = toTransforms.length > 0 ? toTransforms.join(" ") : "none";

  const keyframes = `
    @keyframes ${combinedName} {
      from {
        transform: ${fromTransform};
        opacity: ${fromOpacity};
      }
      to {
        transform: ${toTransform};
        opacity: ${toOpacity};
      }
    }
    
    .animate-combined-${combinedName} {
      animation-name: ${combinedName};
      animation-duration: var(--animation-duration, 0.5s);
      animation-delay: var(--animation-delay, 0s);
      animation-timing-function: var(--animation-easing, ease-out);
      animation-fill-mode: forwards;
      will-change: transform, opacity;
    }
  `;

  // Create and inject the style element
  const styleElement = document.createElement("style");
  styleElement.setAttribute("data-animation", combinedName);
  styleElement.textContent = keyframes;
  document.head.appendChild(styleElement);
}

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

      setState("animating");
      setCurrentTrigger(triggerType);

      // Set CSS properties with enhanced array safety and proper multi-animation support
      if (config.duration !== undefined) {
        const duration = Array.isArray(config.duration)
          ? config.duration.length > 0
            ? config.duration.reduce((a, b) => Math.max(a, b), 0) // Use longest duration for combined animations
            : 0.5
          : config.duration;
        element.style.setProperty("--animation-duration", `${duration}s`);
      }
      if (config.delay !== undefined) {
        const delay = Array.isArray(config.delay)
          ? config.delay.length > 0
            ? config.delay[0] // Use first delay for start
            : 0
          : config.delay;
        element.style.setProperty("--animation-delay", `${delay}s`);
      }
      if (config.easing) {
        const easing = Array.isArray(config.easing)
          ? config.easing.length > 0
            ? config.easing[0] // Use first easing function
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

      // Handle animation types - support both single and multiple animations
      const types = Array.isArray(config.type) ? config.type : [config.type];

      if (types.length === 1) {
        // Single animation - use existing approach
        element.classList.add(`animate-${types[0]}`);
      } else {
        // Multiple animations - create combined animation
        const combinedAnimationName = types.join("-");
        element.classList.add(`animate-combined-${combinedAnimationName}`);

        // If the combined class doesn't exist, create it dynamically
        if (
          !document.querySelector(
            `style[data-animation="${combinedAnimationName}"]`
          )
        ) {
          createCombinedAnimation(types, combinedAnimationName);
        }
      }

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

    if (types.length === 1) {
      element.classList.remove(`animate-${types[0]}`);
    } else {
      const combinedAnimationName = types.join("-");
      element.classList.remove(`animate-combined-${combinedAnimationName}`);
    }

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

    if (types.length === 1) {
      element.classList.remove(`animate-${types[0]}`);
    } else {
      const combinedAnimationName = types.join("-");
      element.classList.remove(`animate-combined-${combinedAnimationName}`);
    }
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
