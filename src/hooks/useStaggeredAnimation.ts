import { useCallback, useEffect, useRef, useState } from "react";
import { ModernAnimationConfig } from "../types/modern";

export interface UseStaggeredAnimationReturn<T extends HTMLElement> {
  refs: React.RefObject<T | null>[];
  trigger: () => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
  cancel: () => void;
  addElement: () => React.RefObject<T | null>;
  removeElement: (index: number) => void;
}

export interface StaggerConfig {
  animations: ModernAnimationConfig[];
  delay: number; // Delay between each element's animation
  direction?: "forward" | "reverse" | "center-out";
  maxConcurrent?: number; // Maximum number of elements animating at once
}

/**
 * Hook for creating staggered animations across multiple elements
 */
export function useStaggeredAnimation<T extends HTMLElement>(
  config: StaggerConfig,
  elementCount: number = 0
): UseStaggeredAnimationReturn<T> {
  const [refs, setRefs] = useState<React.RefObject<T | null>[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const activeAnimationsRef = useRef<Set<number>>(new Set());

  // Initialize refs
  useEffect(() => {
    if (elementCount > 0) {
      const newRefs = Array.from({ length: elementCount }, () =>
        useRef<T>(null)
      );
      setRefs(newRefs);
    }
  }, [elementCount]);

  // Clear all timeouts
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current = [];
  }, []);

  // Calculate stagger order based on direction
  const getStaggerOrder = useCallback(
    (totalElements: number): number[] => {
      const indices = Array.from({ length: totalElements }, (_, i) => i);

      switch (config.direction) {
        case "reverse":
          return indices.reverse();
        case "center-out":
          const center = Math.floor(totalElements / 2);
          const result: number[] = [];
          let left = center;
          let right = center + 1;

          result.push(center);

          while (left > 0 || right < totalElements) {
            if (left > 0) result.push(--left);
            if (right < totalElements) result.push(right++);
          }

          return result;
        default:
          return indices;
      }
    },
    [config.direction]
  );

  // Animate a single element
  const animateElement = useCallback(
    (
      elementRef: React.RefObject<T | null>,
      animConfig: ModernAnimationConfig,
      elementIndex: number
    ) => {
      const element = elementRef.current;
      if (!element) return Promise.resolve();

      return new Promise<void>((resolve) => {
        activeAnimationsRef.current.add(elementIndex);

        // Apply animation class
        const animationType = Array.isArray(animConfig.type)
          ? animConfig.type[0]
          : animConfig.type;
        element.classList.add(`animate-${animationType}`);

        // Set custom properties
        if (animConfig.duration !== undefined) {
          element.style.setProperty(
            "--animation-duration",
            `${animConfig.duration}s`
          );
        }
        if (animConfig.delay !== undefined) {
          element.style.setProperty(
            "--animation-delay",
            `${animConfig.delay}s`
          );
        }
        if (animConfig.easing) {
          const easingValue = Array.isArray(animConfig.easing)
            ? animConfig.easing[0]
            : animConfig.easing;
          element.style.setProperty("--animation-easing", easingValue);
        }

        // Listen for animation end
        const handleAnimationEnd = () => {
          activeAnimationsRef.current.delete(elementIndex);
          element.removeEventListener("animationend", handleAnimationEnd);
          element.removeEventListener("transitionend", handleAnimationEnd);
          resolve();
        };

        element.addEventListener("animationend", handleAnimationEnd);
        element.addEventListener("transitionend", handleAnimationEnd);

        // Fallback timeout
        const animDuration =
          typeof animConfig.duration === "number" ? animConfig.duration : 0.5;
        const animDelay =
          typeof animConfig.delay === "number" ? animConfig.delay : 0;
        const fallbackTimeout = setTimeout(() => {
          handleAnimationEnd();
        }, (animDuration + animDelay) * 1000 + 100);

        timeoutsRef.current.push(fallbackTimeout);
      });
    },
    []
  );

  // Main trigger function
  const trigger = useCallback(() => {
    if (isAnimating || refs.length === 0) return;

    setIsAnimating(true);
    clearAllTimeouts();
    activeAnimationsRef.current.clear();

    const staggerOrder = getStaggerOrder(refs.length);
    let animationIndex = 0;

    const triggerNext = () => {
      if (animationIndex >= staggerOrder.length) {
        setIsAnimating(false);
        return;
      }

      const elementIndex = staggerOrder[animationIndex];
      const elementRef = refs[elementIndex];

      // Check if we've hit the concurrent limit
      if (
        config.maxConcurrent &&
        activeAnimationsRef.current.size >= config.maxConcurrent
      ) {
        // Wait for an animation to complete before starting the next
        setTimeout(triggerNext, 50);
        return;
      }

      // Animate each configured animation for this element
      config.animations.forEach((animConfig, configIndex) => {
        const baseDelay =
          typeof animConfig.delay === "number" ? animConfig.delay : 0;
        const staggerDelay = configIndex * config.delay;
        const delayedAnimConfig = {
          ...animConfig,
          delay: baseDelay + staggerDelay,
        };

        animateElement(elementRef, delayedAnimConfig, elementIndex);
      });

      animationIndex++;

      // Schedule next element
      if (animationIndex < staggerOrder.length) {
        const timeout = setTimeout(triggerNext, config.delay * 1000);
        timeoutsRef.current.push(timeout);
      }
    };

    triggerNext();
  }, [
    isAnimating,
    refs,
    config,
    getStaggerOrder,
    animateElement,
    clearAllTimeouts,
  ]);

  const pause = useCallback(() => {
    refs.forEach((ref) => {
      if (ref.current) {
        ref.current.style.animationPlayState = "paused";
      }
    });
  }, [refs]);

  const resume = useCallback(() => {
    refs.forEach((ref) => {
      if (ref.current) {
        ref.current.style.animationPlayState = "running";
      }
    });
  }, [refs]);

  const restart = useCallback(() => {
    clearAllTimeouts();
    activeAnimationsRef.current.clear();
    setIsAnimating(false);

    // Remove animation classes from all elements
    refs.forEach((ref) => {
      if (ref.current) {
        config.animations.forEach((animConfig) => {
          const animationType = Array.isArray(animConfig.type)
            ? animConfig.type[0]
            : animConfig.type;
          ref.current?.classList.remove(`animate-${animationType}`);
        });
      }
    });

    // Trigger reflow and restart
    setTimeout(() => {
      trigger();
    }, 10);
  }, [clearAllTimeouts, refs, config.animations, trigger]);

  const cancel = useCallback(() => {
    clearAllTimeouts();
    activeAnimationsRef.current.clear();
    setIsAnimating(false);

    // Remove animation classes and reset states
    refs.forEach((ref) => {
      if (ref.current) {
        ref.current.style.animationPlayState = "paused";
        config.animations.forEach((animConfig) => {
          const animationType = Array.isArray(animConfig.type)
            ? animConfig.type[0]
            : animConfig.type;
          ref.current?.classList.remove(`animate-${animationType}`);
        });
      }
    });
  }, [clearAllTimeouts, refs, config.animations]);

  const addElement = useCallback((): React.RefObject<T | null> => {
    const newRef = useRef<T>(null);
    setRefs((prev) => [...prev, newRef]);
    return newRef;
  }, []);

  const removeElement = useCallback(
    (index: number) => {
      if (index < 0 || index >= refs.length) return;

      setRefs((prev) => prev.filter((_, i) => i !== index));
    },
    [refs.length]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  return {
    refs,
    trigger,
    pause,
    resume,
    restart,
    cancel,
    addElement,
    removeElement,
  };
}
