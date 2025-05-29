"use client";

import React, { forwardRef, HTMLAttributes, ReactNode } from "react";
import { useAnimationSequence } from "../hooks/useAnimationSequence";
import { AnimationSequence, AnimationState } from "../types/modern";

export interface SequenceAnimateRef {
  start: () => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
  cancel: () => void;
  goToStep: (step: number) => void;
  currentStep: number;
  totalSteps: number;
  state: AnimationState;
}

interface SequenceAnimateProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  sequence: AnimationSequence;
  as?: keyof React.JSX.IntrinsicElements | React.ComponentType<any>;
  className?: string;
  autoStart?: boolean;
  onStepChange?: (step: number) => void;
}

/**
 * Component for orchestrating complex animation sequences
 *
 * @example
 * ```tsx
 * const fadeInSequence: AnimationSequence = {
 *   name: 'staggered-fade',
 *   steps: [
 *     {
 *       animations: [{ type: 'fade', duration: 0.3 }],
 *       parallel: false
 *     },
 *     {
 *       animations: [
 *         { type: 'slide', axis: 'x', duration: 0.4 },
 *         { type: 'scale', duration: 0.4 }
 *       ],
 *       parallel: true,
 *       delay: 0.2
 *     }
 *   ]
 * };
 *
 * <SequenceAnimate sequence={fadeInSequence} autoStart>
 *   <div>Complex animated content</div>
 * </SequenceAnimate>
 * ```
 */
export const SequenceAnimate = forwardRef<
  SequenceAnimateRef,
  SequenceAnimateProps
>(
  (
    {
      children,
      sequence,
      as: Component = "div",
      className = "",
      autoStart = false,
      onStepChange,
      ...props
    },
    forwardedRef
  ) => {
    const {
      ref: sequenceRef,
      currentStep,
      totalSteps,
      state,
      start,
      pause,
      resume,
      restart,
      cancel,
      goToStep,
    } = useAnimationSequence(sequence);

    // Use the sequence ref directly
    const elementRef = sequenceRef;

    // Auto-start if configured
    React.useEffect(() => {
      if (autoStart && state === "idle") {
        start();
      }
    }, [autoStart, state, start]);

    // Notify parent of step changes
    React.useEffect(() => {
      onStepChange?.(currentStep);
    }, [currentStep, onStepChange]);

    // Expose control methods
    React.useImperativeHandle(
      forwardedRef,
      () => ({
        start,
        pause,
        resume,
        restart,
        cancel,
        goToStep,
        currentStep,
        totalSteps,
        state,
      }),
      [
        start,
        pause,
        resume,
        restart,
        cancel,
        goToStep,
        currentStep,
        totalSteps,
        state,
      ]
    );

    return React.createElement(
      Component as any,
      {
        ref: elementRef,
        className: `sequence-animate ${className}`.trim(),
        "data-sequence-state": state,
        "data-current-step": currentStep,
        "data-total-steps": totalSteps,
        ...props,
      },
      children
    );
  }
);

SequenceAnimate.displayName = "SequenceAnimate";
