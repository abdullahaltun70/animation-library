// Export all hooks
export { useAnimation } from "./hooks/useAnimation";
export { useModernAnimation } from "./hooks/useModernAnimation";
export { useAnimationSequence } from "./hooks/useAnimationSequence";
export { useStaggeredAnimation } from "./hooks/useStaggeredAnimation";

// Export types
export type { AnimationConfig } from "./types/index";
export type {
  ModernAnimationConfig,
  AnimationSequence,
  AnimationState,
  AnimationTrigger,
  AnimationStateData,
} from "./types/modern";

// Export all client components
export { Animate } from "./components/Animate";
export { ModernAnimate } from "./components/ModernAnimate";
export { SequenceAnimate } from "./components/SequenceAnimate";
export { StaggeredAnimate } from "./components/StaggeredAnimate";
export { InteractiveAnimate } from "./components/InteractiveAnimate";

// Export state-based animation components (perfect for Radix UI)
export { default as StateBasedAnimate } from "./components/StateBasedAnimate";
export { default as RadixAnimate } from "./components/RadixAnimate";

// Default export for convenience
export { Animate as default } from "./components/Animate";
