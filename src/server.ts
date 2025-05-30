/**
 * Server-side entry point without "use client" directive
 * Use this import when you need the components to run on the server-side
 * Only exports server-compatible components and utilities
 */

// Export server-compatible components
export { default as ServerAnimate } from "./components/ServerAnimate";
export { default as StateBasedAnimate } from "./components/StateBasedAnimate";

// Export types (these are safe for server-side)
export type { AnimationConfig } from "./types/index";
export type {
  ModernAnimationConfig,
  AnimationSequence,
  AnimationState,
  AnimationTrigger,
  AnimationStateData,
} from "./types/modern";

// Re-export server-compatible components as named exports
export { default as RadixAnimate } from "./components/RadixAnimate";

// Default export for convenience (server-safe)
export { default } from "./components/ServerAnimate";
