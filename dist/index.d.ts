import * as React$1 from 'react';
import React__default, { HTMLAttributes, ReactNode, JSX } from 'react';

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

interface ServerAnimateProps {
    children?: React$1.ReactNode;
    type: "rotate" | "slide-down" | "slide-up";
    state?: "open" | "closed";
    selfContained?: {
        method: "details" | "checkbox";
        trigger?: React$1.ReactNode;
        defaultOpen?: boolean;
        id?: string;
        content?: React$1.ReactNode;
    };
    duration?: number;
    easing?: string;
    className?: string;
    as?: keyof React$1.JSX.IntrinsicElements;
    [key: string]: any;
}
/**
 * Server-compatible animation component that works without JavaScript
 * Uses CSS-only animations triggered by data attributes
 * Perfect for accordions, dropdowns, and other state-based animations
 *
 * @example
 * // External state management (requires parent state)
 * <ServerAnimate type="rotate" state={isOpen ? 'open' : 'closed'}>
 *   <ChevronIcon />
 * </ServerAnimate>
 *
 * // Self-contained with details/summary (recommended)
 * <ServerAnimate
 *   type="slide-down"
 *   selfContained={{
 *     method: 'details',
 *     trigger: <span>Click to expand</span>,
 *     content: <div>Content that slides down</div>
 *   }}
 * >
 *   Fallback content if not using selfContained
 * </ServerAnimate>
 *
 * // Self-contained with checkbox
 * <ServerAnimate
 *   type="rotate"
 *   selfContained={{
 *     method: 'checkbox',
 *     trigger: <ChevronIcon />,
 *     content: <div>Content container</div>,
 *     id: 'my-accordion'
 *   }}
 * >
 *   Fallback content
 * </ServerAnimate>
 */
declare const ServerAnimate: React$1.FC<ServerAnimateProps>;

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
    as?: keyof JSX.IntrinsicElements | React__default.ComponentType<any>;
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
declare const Animate: React__default.ForwardRefExoticComponent<AnimateProps & React__default.RefAttributes<HTMLDivElement>>;

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
    as?: keyof React__default.JSX.IntrinsicElements | React__default.ComponentType<any>;
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
declare const ModernAnimate: React__default.ForwardRefExoticComponent<ModernAnimateProps & React__default.RefAttributes<ModernAnimateRef>>;

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
    as?: keyof React__default.JSX.IntrinsicElements | React__default.ComponentType<any>;
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
declare const SequenceAnimate: React__default.ForwardRefExoticComponent<SequenceAnimateProps & React__default.RefAttributes<SequenceAnimateRef>>;

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
    as?: keyof React__default.JSX.IntrinsicElements | React__default.ComponentType<any>;
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
declare const StaggeredAnimate: React__default.ForwardRefExoticComponent<StaggeredAnimateProps & React__default.RefAttributes<StaggeredAnimateRef>>;

interface InteractiveAnimateProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    hoverConfig?: ModernAnimationConfig;
    focusConfig?: ModernAnimationConfig;
    clickConfig?: ModernAnimationConfig;
    as?: keyof React__default.JSX.IntrinsicElements | React__default.ComponentType<any>;
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
declare const InteractiveAnimate: React__default.ForwardRefExoticComponent<InteractiveAnimateProps & React__default.RefAttributes<HTMLElement>>;

interface SelfContainedToggleProps {
    trigger: React$1.ReactNode;
    children: React$1.ReactNode;
    defaultOpen?: boolean;
    duration?: number;
    easing?: string;
    className?: string;
    triggerClassName?: string;
    contentClassName?: string;
    id?: string;
    animationType?: "slide-down" | "slide-up" | "slide-left" | "slide-right" | "fade" | "scale" | "rotate";
    variant?: "checkbox" | "details";
}
/**
 * A completely self-contained toggle component that works without JavaScript state management.
 * Perfect for any toggle scenario: accordions, dropdowns, menus, modals, sidebars, etc.
 * Uses native HTML elements (checkbox or details) for state management.
 *
 * @example
 * // Dropdown menu
 * <SelfContainedToggle
 *   variant="checkbox"
 *   animationType="slide-down"
 *   trigger={<button>Menu ▼</button>}
 * >
 *   <nav>Menu items here</nav>
 * </SelfContainedToggle>
 *
 * // Sidebar toggle
 * <SelfContainedToggle
 *   variant="checkbox"
 *   animationType="slide-right"
 *   trigger={<button>☰</button>}
 * >
 *   <aside>Sidebar content</aside>
 * </SelfContainedToggle>
 *
 * // Modal dialog
 * <SelfContainedToggle
 *   variant="checkbox"
 *   animationType="fade"
 *   trigger={<button>Open Modal</button>}
 * >
 *   <div className="modal">Modal content</div>
 * </SelfContainedToggle>
 *
 * // Button with rotating icon
 * <SelfContainedToggle
 *   variant="checkbox"
 *   animationType="rotate"
 *   trigger={<button>Toggle <span>▼</span></button>}
 * >
 *   <div>Content to show/hide</div>
 * </SelfContainedToggle>
 */
declare const SelfContainedToggle: React$1.FC<SelfContainedToggleProps>;

interface SelfContainedDetailsProps {
    trigger: React$1.ReactNode;
    children: React$1.ReactNode;
    defaultOpen?: boolean;
    duration?: number;
    easing?: string;
    className?: string;
    triggerClassName?: string;
    contentClassName?: string;
    id?: string;
    animationType?: "slide-down" | "slide-up" | "fade" | "scale";
}
declare const SelfContainedDetails: React$1.FC<SelfContainedDetailsProps>;

interface StateBasedAnimateProps {
    /** The child element to animate */
    children: React__default.ReactNode;
    /** Type of animation to apply */
    animationType: 'rotate' | 'slide-down' | 'slide-up' | 'fade' | 'scale';
    /** Animation duration in milliseconds */
    duration?: number;
    /** Animation easing function */
    easing?: string;
    /** Rotation degrees (for rotate animation) */
    degrees?: number;
    /** Distance for slide animations */
    distance?: number;
    /** Scale factor (for scale animation) */
    scale?: number;
    /** Custom CSS class */
    className?: string;
    /** Target selector to watch for state changes (defaults to closest parent with data-state) */
    stateSelector?: string;
    /** State value that triggers the animation (defaults to 'open') */
    triggerState?: string;
}
/**
 * StateBasedAnimate - Automatically animates based on parent component state
 *
 * Perfect for Radix UI components and other libraries that use data-state attributes.
 * Watches for changes in parent component's data-state and applies animations accordingly.
 *
 * @example
 * // Rotate a chevron when accordion opens
 * <AccordionPrimitive.Trigger>
 *   <Text>Accordion Title</Text>
 *   <StateBasedAnimate animationType="rotate" degrees={180}>
 *     <ChevronDownIcon />
 *   </StateBasedAnimate>
 * </AccordionPrimitive.Trigger>
 *
 * @example
 * // Slide content down when collapsible opens
 * <StateBasedAnimate animationType="slide-down" distance={200}>
 *   <AccordionPrimitive.Content>
 *     <div>Content here</div>
 *   </AccordionPrimitive.Content>
 * </StateBasedAnimate>
 */
declare const StateBasedAnimate: React__default.FC<StateBasedAnimateProps>;

interface RadixAnimateProps {
    /** The child element to animate */
    children: React__default.ReactNode;
    /** Type of animation to apply */
    animationType: 'rotate' | 'accordion-content' | 'fade' | 'scale';
    /** Animation duration in milliseconds */
    duration?: number;
    /** Animation easing function */
    easing?: string;
    /** Rotation degrees (for rotate animation) */
    degrees?: number;
    /** Scale factor (for scale animation) */
    scale?: number;
    /** Custom CSS class */
    className?: string;
}
/**
 * RadixAnimate - Optimized for Radix UI components
 *
 * This component is specifically designed to work with Radix UI's data-state attributes
 * and provides optimized animations for common Radix patterns.
 *
 * @example
 * // Rotate chevron in Accordion trigger
 * <AccordionPrimitive.Trigger>
 *   <span>Title</span>
 *   <RadixAnimate animationType="rotate" degrees={180}>
 *     <ChevronDownIcon />
 *   </RadixAnimate>
 * </AccordionPrimitive.Trigger>
 *
 * @example
 * // Animate Accordion content with proper height handling
 * <RadixAnimate animationType="accordion-content">
 *   <AccordionPrimitive.Content>
 *     <div>Content here</div>
 *   </AccordionPrimitive.Content>
 * </RadixAnimate>
 */
declare const RadixAnimate: React__default.FC<RadixAnimateProps>;

export { Animate, Animate as AnimateWrapper, type AnimationConfig, type AnimationSequence, type AnimationState, type AnimationStateData, type AnimationTrigger, InteractiveAnimate, ModernAnimate, type ModernAnimationConfig, RadixAnimate, SelfContainedDetails, SelfContainedToggle, SequenceAnimate, ServerAnimate, StaggeredAnimate, StateBasedAnimate, Animate as default, useAnimation, useAnimationSequence, useModernAnimation, useStaggeredAnimation };
