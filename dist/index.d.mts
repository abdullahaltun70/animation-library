import React$1, { HTMLAttributes, ReactNode, JSX } from 'react';

type AnimationType = "fade" | "slide" | "scale" | "rotate" | "bounce";
type SlideAxis = "x" | "y";
interface AnimationConfig {
    type: AnimationType;
    duration?: number;
    delay?: number;
    easing?: string;
    distance?: number;
    degrees?: number | {
        start?: number;
        end: number;
    };
    scale?: number;
    opacity?: {
        start?: number;
        end?: number;
    };
    axis?: SlideAxis;
    animateOnMount?: boolean;
}

interface UseAnimationReturn<T extends HTMLElement> {
    ref: React.RefObject<T | null>;
    key: number;
    replay: () => void;
}
/**
 * Custom hook to apply CSS animations based on configuration.
 * Returns a ref to attach to the target element, a key for re-renders, and a replay function.
 */
declare function useAnimation<T extends HTMLElement>(config: AnimationConfig, onAnimationComplete?: (event: Event) => void): UseAnimationReturn<T>;

type AnimationState = 'idle' | 'animating' | 'paused' | 'completed' | 'error';
type AnimationTrigger = 'mount' | 'visible' | 'hover' | 'focus' | 'click' | 'scroll' | 'manual';
type AnimationDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
type AnimationFillMode = 'none' | 'forwards' | 'backwards' | 'both';
type AnimationPlayState = 'running' | 'paused';
interface AnimationSequenceStep {
    animations: AnimationConfig[];
    delay?: number;
    parallel?: boolean;
}
interface AnimationSequence {
    name: string;
    steps: AnimationSequenceStep[];
    repeat?: number | 'infinite';
    onComplete?: () => void;
    onStepComplete?: (stepIndex: number) => void;
}
interface ModernAnimationConfig {
    type: AnimationType | AnimationType[];
    duration?: number | number[];
    delay?: number | number[];
    easing?: string | string[];
    trigger?: AnimationTrigger;
    state?: AnimationState;
    direction?: AnimationDirection;
    fillMode?: AnimationFillMode;
    playState?: AnimationPlayState;
    iterationCount?: number | 'infinite';
    distance?: number;
    degrees?: number | {
        start?: number;
        end: number;
    };
    scale?: number | {
        start?: number;
        end: number;
    };
    opacity?: {
        start?: number;
        end?: number;
    };
    axis?: SlideAxis;
    mediaQueries?: Record<string, Partial<ModernAnimationConfig>>;
    condition?: () => boolean;
    willChange?: string;
    transform3d?: boolean;
    onStart?: () => void;
    onComplete?: () => void;
    onIteration?: () => void;
    onCancel?: () => void;
    respectReducedMotion?: boolean;
    reduceMotionFallback?: Partial<ModernAnimationConfig>;
}
interface AnimationStateData {
    'data-animation-state'?: AnimationState;
    'data-animation-trigger'?: AnimationTrigger;
    'data-animation-direction'?: 'in' | 'out';
    'data-hover'?: boolean;
    'data-focus'?: boolean;
    'data-active'?: boolean;
    'data-visible'?: boolean;
    'data-loading'?: boolean;
    'data-error'?: boolean;
    'data-success'?: boolean;
}

interface UseModernAnimationReturn<T extends HTMLElement> {
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
declare function useModernAnimation<T extends HTMLElement>(config: ModernAnimationConfig): UseModernAnimationReturn<T>;

interface UseAnimationSequenceReturn<T extends HTMLElement> {
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
declare function useAnimationSequence<T extends HTMLElement>(sequence: AnimationSequence): UseAnimationSequenceReturn<T>;

interface UseStaggeredAnimationReturn<T extends HTMLElement> {
    refs: React.RefObject<T | null>[];
    trigger: () => void;
    pause: () => void;
    resume: () => void;
    restart: () => void;
    cancel: () => void;
}
interface StaggerConfig {
    animations: ModernAnimationConfig[];
    delay: number;
    direction?: "forward" | "reverse" | "center-out";
    maxConcurrent?: number;
}
/**
 * Hook for creating staggered animations across multiple elements
 */
declare function useStaggeredAnimation<T extends HTMLElement>(config: StaggerConfig, elementCount?: number): UseStaggeredAnimationReturn<T>;

interface AnimateProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    type: AnimationType;
    duration?: number;
    delay?: number;
    easing?: string;
    distance?: number;
    degrees?: number | {
        start?: number;
        end: number;
    };
    scale?: number;
    opacity?: {
        start?: number;
        end?: number;
    };
    axis?: SlideAxis;
    as?: keyof JSX.IntrinsicElements | React$1.ComponentType<any>;
    className?: string;
    onAnimationComplete?: () => void;
}
/**
 * A wrapper component to easily apply animations using the useAnimation hook.
 * Supports forwarding refs and can render as any HTML element or component.
 * The component adds an "animated" class to its root element.
 *
 * @property {ReactNode} children - The content to animate. Must be a single React element that can accept a ref.
 * @property {AnimationType} type - The type of animation to apply (e.g., "fade", "slide").
 * @property {number} [duration=0.5] - Duration of the animation in seconds.
 * @property {number} [delay=0] - Delay before the animation starts in seconds.
 * @property {string} [easing="ease-out"] - Easing function for the animation.
 * @property {number} [distance=50] - Distance for slide or bounce animations.
 * @property {number | { start?: number; end: number }} [degrees=360] - Degrees for rotate animations.
 * @property {number} [scale=0.8] - Scale factor for scale animations.
 * @property {{ start?: number; end?: number }} [opacity] - Opacity settings for animations (e.g., `{ start: 0, end: 1 }`).
 * @property {SlideAxis} [axis="x"] - Axis for slide animations ('x' or 'y').
 * @property {keyof JSX.IntrinsicElements | React.ComponentType<any>} [as="div"] - The HTML element or component to render as.
 * @property {string} [className] - Additional CSS classes to apply.
 * @property {() => void} [onAnimationComplete] - Callback function when the animation completes.
 *
 * @example
 * <Animate
 *   type="fade"
 *   duration={0.5}
 *   className="my-custom-class"
 * >
 *   {children}
 * </Animate>
 */
declare const Animate: React$1.ForwardRefExoticComponent<AnimateProps & React$1.RefAttributes<HTMLDivElement>>;

interface ModernAnimateRef {
    trigger: (triggerType?: AnimationTrigger) => void;
    pause: () => void;
    resume: () => void;
    restart: () => void;
    cancel: () => void;
    state: AnimationState;
}
interface ModernAnimateProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    config: ModernAnimationConfig;
    as?: keyof React$1.JSX.IntrinsicElements | React$1.ComponentType<any>;
    className?: string;
    onStateChange?: (state: string) => void;
}
/**
 * Modern animation component with CSS-based state management and advanced controls
 *
 * Features:
 * - CSS custom properties for dynamic control
 * - Data attributes for state-based styling
 * - Intersection Observer support for scroll triggers
 * - Reduced motion respect
 * - Performance optimizations
 *
 * @example
 * ```tsx
 * // Single animation type
 * <ModernAnimate
 *   config={{
 *     type: 'fade',
 *     duration: 0.6,
 *     trigger: 'visible',
 *     easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
 *   }}
 * >
 *   <div>Content to animate</div>
 * </ModernAnimate>
 *
 * // Multiple animation types with additional properties
 * <ModernAnimate
 *   config={{
 *     type: ['fade', 'slide'],
 *     axis: 'y',
 *     distance: 30,
 *     duration: [0.5, 0.8],
 *     trigger: 'visible'
 *   }}
 * >
 *   <div>Slides up and fades in</div>
 * </ModernAnimate>
 * ```
 *
 * @example CSS state management
 * ```css
 * .my-element[data-animation-state="animating"] {
 *   pointer-events: none;
 * }
 *
 * .my-element[data-hover="true"] {
 *   --animation-duration: 0.2s;
 * }
 * ```
 */
declare const ModernAnimate: React$1.ForwardRefExoticComponent<ModernAnimateProps & React$1.RefAttributes<ModernAnimateRef>>;

interface SequenceAnimateRef {
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
    as?: keyof React$1.JSX.IntrinsicElements | React$1.ComponentType<any>;
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
declare const SequenceAnimate: React$1.ForwardRefExoticComponent<SequenceAnimateProps & React$1.RefAttributes<SequenceAnimateRef>>;

interface StaggeredAnimateRef {
    trigger: () => void;
    pause: () => void;
    resume: () => void;
    restart: () => void;
    cancel: () => void;
    elementCount: number;
}
interface StaggeredAnimateProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    itemAnimation: ModernAnimationConfig;
    staggerDelay: number;
    staggerDirection?: "forward" | "reverse" | "center-out";
    maxConcurrent?: number;
    as?: keyof React$1.JSX.IntrinsicElements | React$1.ComponentType<any>;
    className?: string;
    autoStart?: boolean;
    itemClassName?: string;
}
/**
 * Component for creating staggered animations across child elements
 *
 * @example
 * ```tsx
 * <StaggeredAnimate
 *   itemAnimation={{ type: 'fade', duration: 0.3 }}
 *   staggerDelay={0.1}
 *   staggerDirection='forward'
 *   autoStart
 * >
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </StaggeredAnimate>
 * ```
 */
declare const StaggeredAnimate: React$1.ForwardRefExoticComponent<StaggeredAnimateProps & React$1.RefAttributes<StaggeredAnimateRef>>;

interface InteractiveAnimateProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    hoverConfig?: ModernAnimationConfig;
    focusConfig?: ModernAnimationConfig;
    clickConfig?: ModernAnimationConfig;
    as?: keyof React$1.JSX.IntrinsicElements | React$1.ComponentType<any>;
    className?: string;
    disabled?: boolean;
}
/**
 * Component for micro-interactions with hover, focus, and click animations
 * Uses pure CSS for optimal performance
 *
 * @example
 * ```tsx
 * <InteractiveAnimate
 *   hoverConfig={{ type: 'scale', scale: { start: 1, end: 1.05 }, duration: 0.2 }}
 *   clickConfig={{ type: 'scale', scale: { start: 1, end: 0.95 }, duration: 0.1 }}
 *   className="button"
 * >
 *   <button>Interactive Button</button>
 * </InteractiveAnimate>
 * ```
 */
declare const InteractiveAnimate: React$1.ForwardRefExoticComponent<InteractiveAnimateProps & React$1.RefAttributes<HTMLElement>>;

export { Animate, Animate as AnimateWrapper, type AnimationConfig, type AnimationSequence, type AnimationState, type AnimationStateData, type AnimationTrigger, InteractiveAnimate, ModernAnimate, type ModernAnimationConfig, SequenceAnimate, StaggeredAnimate, Animate as default, useAnimation, useAnimationSequence, useModernAnimation, useStaggeredAnimation };
