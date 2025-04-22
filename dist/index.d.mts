import React$1, { HTMLAttributes, ReactNode, JSX } from 'react';

type AnimationType$1 = 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce';
interface AnimationConfig {
    type: AnimationType$1;
    duration?: number;
    delay?: number;
    easing?: string;
    distance?: number;
    degrees?: number;
    scale?: number;
    opacity?: {
        start?: number;
        end?: number;
    };
}
interface UseAnimationReturn<T extends HTMLElement> {
    ref: React.RefObject<T | null>;
    key: number;
    replay: () => void;
}
/**
 * Custom hook to apply CSS animations based on configuration.
 * Returns a ref to attach to the target element and a replay function.
 */
declare function useAnimation<T extends HTMLElement>(config: AnimationConfig): UseAnimationReturn<T>;

type AnimationType = 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce';
interface AnimateProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    type: AnimationType;
    duration?: number;
    delay?: number;
    easing?: string;
    distance?: number;
    degrees?: number;
    scale?: number;
    opacity?: {
        start?: number;
        end?: number;
    };
    as?: keyof JSX.IntrinsicElements | React$1.ComponentType<any>;
    className?: string;
    onAnimationComplete?: () => void;
}
/**
 * A wrapper component to easily apply animations using the useAnimation hook.
 * Supports forwarding refs and can render as any HTML element or component.
 *
 * @example
 * <Animate
 *   type="fade"
 *   duration={0.5}
 *   className="my-custom-class"
 * >
 *   <p>Content to animate</p>
 * </Animate>
 */
declare const Animate: React$1.ForwardRefExoticComponent<AnimateProps & React$1.RefAttributes<HTMLDivElement>>;

export { Animate, type AnimationConfig, useAnimation };
