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

export { Animate, type AnimationConfig, useAnimation };
