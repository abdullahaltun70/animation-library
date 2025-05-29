import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimationSequence,
  ModernAnimationConfig,
  AnimationState,
} from "../types/modern";
import { useModernAnimation } from "./useModernAnimation";

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
        const promises = step.animations.map(async (animConfig) => {
          return new Promise<void>((resolve) => {
            const element = elementRef.current;
            if (!element) {
              resolve();
              return;
            }

            // Apply animation
            const timeout = setTimeout(() => {
              resolve();
            }, (animConfig.duration || 0.5) * 1000 + (animConfig.delay || 0) * 1000);

            timeoutsRef.current.push(timeout);
          });
        });

        await Promise.all(promises);
      } else {
        // Run animations sequentially
        for (const animConfig of step.animations) {
          await new Promise<void>((resolve) => {
            const element = elementRef.current;
            if (!element) {
              resolve();
              return;
            }

            const timeout = setTimeout(() => {
              resolve();
            }, (animConfig.duration || 0.5) * 1000 + (animConfig.delay || 0) * 1000);

            timeoutsRef.current.push(timeout);
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
    [sequence]
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
    clearAllTimeouts();
    setState("idle");
    setIsRunning(false);
    setCurrentStep(0);

    setTimeout(() => {
      start();
    }, 10);
  }, [clearAllTimeouts, start]);

  const cancel = useCallback(() => {
    clearAllTimeouts();
    setState("idle");
    setIsRunning(false);
    setCurrentStep(0);
  }, [clearAllTimeouts]);

  const goToStep = useCallback(
    (step: number) => {
      if (step < 0 || step >= sequence.steps.length) return;

      clearAllTimeouts();
      setCurrentStep(step);

      if (isRunning) {
        executeStep(step);
      }
    },
    [sequence.steps.length, clearAllTimeouts, isRunning, executeStep]
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
