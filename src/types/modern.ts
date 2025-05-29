// Modern animation system types

import { AnimationConfig, AnimationType, SlideAxis } from './index';

export type AnimationState = 'idle' | 'animating' | 'paused' | 'completed' | 'error';

export type AnimationTrigger = 
  | 'mount' 
  | 'visible' 
  | 'hover' 
  | 'focus' 
  | 'click' 
  | 'scroll'
  | 'manual';

export type AnimationDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';

export type AnimationFillMode = 'none' | 'forwards' | 'backwards' | 'both';

export type AnimationPlayState = 'running' | 'paused';

export interface AnimationSequenceStep {
  animations: AnimationConfig[];
  delay?: number;
  parallel?: boolean; // Run animations in this step in parallel
}

export interface AnimationSequence {
  name: string;
  steps: AnimationSequenceStep[];
  repeat?: number | 'infinite';
  onComplete?: () => void;
  onStepComplete?: (stepIndex: number) => void;
}

export interface ModernAnimationConfig {
  // Basic animation properties
  type: AnimationType | AnimationType[];
  duration?: number | number[];
  delay?: number | number[];
  easing?: string | string[];
  
  // Triggers and states
  trigger?: AnimationTrigger;
  state?: AnimationState;
  
  // Advanced properties
  direction?: AnimationDirection;
  fillMode?: AnimationFillMode;
  playState?: AnimationPlayState;
  iterationCount?: number | 'infinite';
  
  // Type-specific properties
  distance?: number;
  degrees?: number | { start?: number; end: number };
  scale?: number | { start?: number; end: number };
  opacity?: { start?: number; end?: number };
  axis?: SlideAxis;
  
  // Responsive and conditional
  mediaQueries?: Record<string, Partial<ModernAnimationConfig>>;
  condition?: () => boolean;
  
  // Performance
  willChange?: string;
  transform3d?: boolean;
  
  // Callbacks
  onStart?: () => void;
  onComplete?: () => void;
  onIteration?: () => void;
  onCancel?: () => void;
  
  // Accessibility
  respectReducedMotion?: boolean;
  reduceMotionFallback?: Partial<ModernAnimationConfig>;
}

export interface AnimationOrchestrator {
  sequence?: AnimationSequence;
  parallel?: ModernAnimationConfig[];
  stagger?: {
    animations: ModernAnimationConfig[];
    delay: number;
    direction?: 'forward' | 'reverse' | 'center-out';
  };
}

// CSS custom properties for state management
export interface AnimationStateData {
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

// Re-export existing types
export * from './index';
