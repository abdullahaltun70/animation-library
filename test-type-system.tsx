// Test file to verify the type system works correctly
import React from "react";
import { ModernAnimate } from "./src/components/ModernAnimate";

// Test 1: Single animation type (should work)
const SingleTypeTest = () => (
  <ModernAnimate
    config={{
      type: "fade",
      duration: 0.5,
      trigger: "visible",
    }}
  >
    <div>Single type animation</div>
  </ModernAnimate>
);

// Test 2: Multiple animation types (should work now)
const MultipleTypesTest = () => (
  <ModernAnimate
    config={{
      type: ["fade", "slide"],
      axis: "y",
      distance: 30,
      duration: 0.6,
      trigger: "visible",
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    }}
  >
    <div>Multiple types animation</div>
  </ModernAnimate>
);

// Test 3: All supported properties (should work)
const FullConfigTest = () => (
  <ModernAnimate
    config={{
      type: ["fade", "scale", "rotate"],
      duration: [0.5, 0.3, 0.4],
      delay: [0, 0.1, 0.2],
      easing: ["ease-out", "ease-in", "ease"],
      axis: "y",
      distance: 50,
      degrees: { start: 0, end: 180 },
      scale: { start: 0.8, end: 1.2 },
      opacity: { start: 0, end: 1 },
      trigger: "hover",
      direction: "alternate",
      fillMode: "both",
      iterationCount: 2,
      respectReducedMotion: true,
      onStart: () => console.log("Animation started"),
      onComplete: () => console.log("Animation completed"),
    }}
  >
    <div>Full configuration animation</div>
  </ModernAnimate>
);

export { SingleTypeTest, MultipleTypesTest, FullConfigTest };
