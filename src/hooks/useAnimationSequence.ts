import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimationConfig,
  AnimationSequence,
  AnimationState,
} from "../types/modern"; // ModernAnimationConfig might be unused if sequence uses AnimationConfig

export interface UseAnimationSequenceReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  currentStep: number;
  totalSteps: number;
  state: AnimationState;
  start: () => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
  cancel: () => void;
  goToStep: (step: number) => void;
}

/**
 * Hook for managing complex animation sequences
 */
export function useAnimationSequence<T extends HTMLElement>(
  sequence: AnimationSequence
): UseAnimationSequenceReturn<T> {
  const elementRef = useRef<T>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<AnimationState>("idle");
  const [isRunning, setIsRunning] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Clear all timeouts
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current = [];
  }, []);

  // Execute a single step
  const executeStep = useCallback(
    async (stepIndex: number) => {
      if (stepIndex >= sequence.steps.length) {
        setState("completed");
        setIsRunning(false);
        sequence.onComplete?.();
        return;
      }

      const step = sequence.steps[stepIndex];
      setCurrentStep(stepIndex);

      if (step.parallel) {
        // Run all animations in this step in parallel
        const promises = step.animations.map((animConfig: AnimationConfig) => {
          // Ensure animConfig is typed as AnimationConfig
          return new Promise<void>((resolve) => {
            const element = elementRef.current;
            if (!element) {
              resolve();
              return;
            }

            // 1. Clean up previous animation classes
            Array.from(element.classList).forEach((className) => {
              if (className.startsWith("animate-")) {
                element.classList.remove(className);
              }
            });

            // 2. Set CSS Custom Properties & Animation Class
            element.style.setProperty(
              "--animation-duration",
              `${animConfig.duration || 0.5}s`
            );
            element.style.setProperty(
              "--animation-delay",
              `${animConfig.delay || 0}s`
            );
            element.style.setProperty(
              "--animation-easing",
              animConfig.easing || "ease-out"
            );

            let animationClassName = `animate-${animConfig.type}`;

            if (animConfig.type === "fade") {
              element.style.setProperty(
                "--opacity-start",
                `${animConfig.opacity?.start ?? 0}`
              );
              element.style.setProperty(
                "--opacity-end",
                `${animConfig.opacity?.end ?? 1}`
              );
            } else if (animConfig.type === "slide") {
              const distance = animConfig.distance || 50;
              const axis = animConfig.axis || "y";
              element.style.setProperty("--distance", `${distance}px`);
              element.style.setProperty(
                "--opacity-start",
                `${animConfig.opacity?.start ?? 0}`
              );
              element.style.setProperty(
                "--opacity-end",
                `${animConfig.opacity?.end ?? 1}`
              );
              animationClassName = `animate-slide-${axis}-${
                distance > 0 ? "positive" : "negative"
              }`;
            } else if (animConfig.type === "scale") {
              element.style.setProperty(
                "--scale-start",
                `${
                  typeof animConfig.scale === "object" &&
                  animConfig.scale !== null &&
                  typeof (animConfig.scale as any).start === "number"
                    ? (animConfig.scale as { start: number }).start
                    : 1
                }`
              );
              element.style.setProperty(
                "--scale-end",
                `${
                  (typeof animConfig.scale === "object" &&
                  animConfig.scale !== null &&
                  "end" in animConfig.scale
                    ? (animConfig.scale as { end: number }).end
                    : animConfig.scale) ?? 0.8
                }`
              );
              element.style.setProperty(
                "--opacity-start",
                `${animConfig.opacity?.start ?? 0}`
              );
              element.style.setProperty(
                "--opacity-end",
                `${animConfig.opacity?.end ?? 1}`
              );
            } else if (animConfig.type === "rotate") {
              const startDeg =
                (typeof animConfig.degrees === "object"
                  ? animConfig.degrees.start
                  : 0) ?? 0;
              const endDeg =
                (typeof animConfig.degrees === "object"
                  ? animConfig.degrees.end
                  : animConfig.degrees) ?? 360;
              element.style.setProperty(
                "--rotation-degrees-start",
                `${startDeg}deg`
              );
              element.style.setProperty(
                "--rotation-degrees-end",
                `${endDeg}deg`
              );
            } else if (animConfig.type === "bounce") {
              element.style.setProperty(
                "--distance",
                `${animConfig.distance || 50}px`
              );
            }

            element.classList.add(animationClassName);

            // 3. Event Handling for Completion
            let fallbackTimeoutId: NodeJS.Timeout;
            const handleAnimationEnd = () => {
              element.removeEventListener("animationend", handleAnimationEnd);
              element.removeEventListener("transitionend", handleAnimationEnd);
              clearTimeout(fallbackTimeoutId);
              // Optionally clean up class if needed, or let next animation override
              // element.classList.remove(animationClassName);
              resolve();
            };

            element.addEventListener("animationend", handleAnimationEnd);
            element.addEventListener("transitionend", handleAnimationEnd);

            const totalDuration =
              (animConfig.duration || 0.5) * 1000 +
              (animConfig.delay || 0) * 1000 +
              100; // Add buffer
            fallbackTimeoutId = setTimeout(handleAnimationEnd, totalDuration);
            timeoutsRef.current.push(fallbackTimeoutId);
          });
        });

        await Promise.all(promises);
      } else {
        // Run animations sequentially
        for (const animConfig of step.animations as AnimationConfig[]) {
          // Ensure animConfig is typed as AnimationConfig
          await new Promise<void>((resolve) => {
            const element = elementRef.current;
            if (!element) {
              resolve();
              return;
            }

            // 1. Clean up previous animation classes
            Array.from(element.classList).forEach((className) => {
              if (className.startsWith("animate-")) {
                element.classList.remove(className);
              }
            });

            // 2. Set CSS Custom Properties & Animation Class
            element.style.setProperty(
              "--animation-duration",
              `${animConfig.duration || 0.5}s`
            );
            element.style.setProperty(
              "--animation-delay",
              `${animConfig.delay || 0}s`
            );
            element.style.setProperty(
              "--animation-easing",
              animConfig.easing || "ease-out"
            );

            let animationClassName = `animate-${animConfig.type}`;

            if (animConfig.type === "fade") {
              element.style.setProperty(
                "--opacity-start",
                `${animConfig.opacity?.start ?? 0}`
              );
              element.style.setProperty(
                "--opacity-end",
                `${animConfig.opacity?.end ?? 1}`
              );
            } else if (animConfig.type === "slide") {
              const distance = animConfig.distance || 50;
              const axis = animConfig.axis || "y";
              element.style.setProperty("--distance", `${distance}px`);
              element.style.setProperty(
                "--opacity-start",
                `${animConfig.opacity?.start ?? 0}`
              );
              element.style.setProperty(
                "--opacity-end",
                `${animConfig.opacity?.end ?? 1}`
              );
              animationClassName = `animate-slide-${axis}-${
                distance > 0 ? "positive" : "negative"
              }`;
            } else if (animConfig.type === "scale") {
              element.style.setProperty(
                "--scale-start",
                `${
                  typeof animConfig.scale === "object" &&
                  animConfig.scale !== null &&
                  "start" in animConfig.scale &&
                  typeof (animConfig.scale as any).start === "number"
                    ? (animConfig.scale as { start: number }).start
                    : 1
                }`
              );
              element.style.setProperty(
                "--scale-end",
                `${
                  typeof animConfig.scale === "object" &&
                  animConfig.scale !== null &&
                  "end" in animConfig.scale &&
                  typeof (animConfig.scale as any).end === "number"
                    ? (animConfig.scale as { end: number }).end
                    : typeof animConfig.scale === "number"
                    ? animConfig.scale
                    : 0.8
                }`
              );
              element.style.setProperty(
                "--opacity-start",
                `${animConfig.opacity?.start ?? 0}`
              );
              element.style.setProperty(
                "--opacity-end",
                `${animConfig.opacity?.end ?? 1}`
              );
            } else if (animConfig.type === "rotate") {
              const startDeg =
                (typeof animConfig.degrees === "object"
                  ? animConfig.degrees.start
                  : 0) ?? 0;
              const endDeg =
                (typeof animConfig.degrees === "object"
                  ? animConfig.degrees.end
                  : animConfig.degrees) ?? 360;
              element.style.setProperty(
                "--rotation-degrees-start",
                `${startDeg}deg`
              );
              element.style.setProperty(
                "--rotation-degrees-end",
                `${endDeg}deg`
              );
            } else if (animConfig.type === "bounce") {
              element.style.setProperty(
                "--distance",
                `${animConfig.distance || 50}px`
              );
            }

            element.classList.add(animationClassName);

            // 3. Event Handling for Completion
            let fallbackTimeoutId: NodeJS.Timeout;
            const handleAnimationEnd = () => {
              element.removeEventListener("animationend", handleAnimationEnd);
              element.removeEventListener("transitionend", handleAnimationEnd);
              clearTimeout(fallbackTimeoutId);
              // Optionally clean up class if needed
              // element.classList.remove(animationClassName);
              resolve();
            };

            element.addEventListener("animationend", handleAnimationEnd);
            element.addEventListener("transitionend", handleAnimationEnd);

            const totalDuration =
              (animConfig.duration || 0.5) * 1000 +
              (animConfig.delay || 0) * 1000 +
              100; // Add buffer
            fallbackTimeoutId = setTimeout(handleAnimationEnd, totalDuration);
            timeoutsRef.current.push(fallbackTimeoutId);
          });
        }
      }

      sequence.onStepComplete?.(stepIndex);

      // Move to next step
      if (step.delay) {
        const timeout = setTimeout(() => {
          executeStep(stepIndex + 1);
        }, step.delay * 1000);
        timeoutsRef.current.push(timeout);
      } else {
        executeStep(stepIndex + 1);
      }
    },
    [sequence, clearAllTimeouts] // Added clearAllTimeouts
  );

  const start = useCallback(() => {
    if (isRunning) return;

    setState("animating");
    setIsRunning(true);
    setCurrentStep(0);
    executeStep(0);
  }, [isRunning, executeStep]);

  const pause = useCallback(() => {
    if (!isRunning) return;

    setState("paused");
    setIsRunning(false);
    clearAllTimeouts();
  }, [isRunning, clearAllTimeouts]);

  const resume = useCallback(() => {
    if (isRunning || state !== "paused") return;

    setState("animating");
    setIsRunning(true);
    executeStep(currentStep);
  }, [isRunning, state, currentStep, executeStep]);

  const restart = useCallback(() => {
    // Clean up classes on the element before restarting
    const element = elementRef.current;
    if (element) {
      Array.from(element.classList).forEach((className) => {
        if (className.startsWith("animate-")) {
          element.classList.remove(className);
        }
      });
    }
    clearAllTimeouts();
    setState("idle");
    setIsRunning(false);
    setCurrentStep(0); // Reset step to 0 before starting

    // Use a microtask or a small timeout to ensure state changes propagate
    // and then start the animation.
    Promise.resolve().then(() => {
      start(); // This calls the 'start' defined above
    });
  }, [clearAllTimeouts, start]); // Removed 'elementRef' as it's a ref

  const cancel = useCallback(() => {
    const element = elementRef.current;
    if (element) {
      Array.from(element.classList).forEach((className) => {
        if (className.startsWith("animate-")) {
          element.classList.remove(className);
        }
      });
      // Reset styles that might have been applied
      element.style.setProperty("--animation-duration", null);
      element.style.setProperty("--animation-delay", null);
      element.style.setProperty("--animation-easing", null);
      // Potentially reset other specific properties if necessary
    }
    clearAllTimeouts();
    setState("idle");
    setIsRunning(false);
    setCurrentStep(0);
  }, [clearAllTimeouts]); // Removed 'elementRef'

  const goToStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex < 0 || stepIndex >= sequence.steps.length) return;

      const element = elementRef.current;
      if (element) {
        Array.from(element.classList).forEach((className) => {
          if (className.startsWith("animate-")) {
            element.classList.remove(className);
          }
        });
      }

      clearAllTimeouts(); // Clear any pending timeouts from previous steps/sequences
      setCurrentStep(stepIndex); // Set the current step index

      if (isRunning) {
        // If the sequence was already running, execute the new step
        setState("animating"); // Ensure state is animating
        executeStep(stepIndex);
      } else {
        // If sequence was paused or idle, just set the step, don't auto-execute unless desired
        // To auto-execute when going to a step while paused/idle, you might call:
        // setState("animating"); setIsRunning(true); executeStep(stepIndex);
        // For now, it just sets the step. User can call start() or resume().
      }
    },
    [sequence.steps.length, clearAllTimeouts, isRunning, executeStep] // Removed 'elementRef'
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  return {
    ref: elementRef,
    currentStep,
    totalSteps: sequence.steps.length,
    state,
    start,
    pause,
    resume,
    restart,
    cancel,
    goToStep,
  };
}
