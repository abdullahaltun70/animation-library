import React from "react";
import { ModernAnimate } from "./src/components/ModernAnimate";
import { ModernAnimationConfig } from "./src/types/modern";

// Test 1: Array of animation types
const arrayTypeConfig: ModernAnimationConfig = {
  type: ["fade", "slide"],
  duration: [0.5, 0.8],
  delay: [0, 0.2],
  easing: ["ease-in", "ease-out"],
  distance: 100,
  axis: "x",
};

// Test 2: Single animation type with additional properties
const singleTypeConfig: ModernAnimationConfig = {
  type: "rotate",
  duration: 1.0,
  degrees: { start: 0, end: 360 },
  trigger: "hover",
};

// Test 3: Scale animation with array values
const scaleConfig: ModernAnimationConfig = {
  type: ["scale", "fade"],
  scale: { start: 0.8, end: 1.2 },
  duration: [0.6, 0.4],
  trigger: "click",
};

// Test 4: Complex configuration
const complexConfig: ModernAnimationConfig = {
  type: ["slide", "fade", "rotate"],
  duration: [0.5, 0.7, 0.9],
  delay: [0, 0.1, 0.2],
  easing: ["ease-in", "ease-out", "ease-in-out"],
  distance: 200,
  axis: "y",
  degrees: 180,
  scale: 1.1,
  respectReducedMotion: true,
  onStart: () => console.log("Animation started"),
  onComplete: () => console.log("Animation completed"),
};

function TestComponent() {
  return (
    <div>
      <h1>Animation Library Test Cases</h1>

      <section>
        <h2>Test 1: Array Types with Array Properties</h2>
        <ModernAnimate config={arrayTypeConfig}>
          <div style={{ padding: "20px", background: "#f0f0f0" }}>
            Array animation: fade + slide
          </div>
        </ModernAnimate>
      </section>

      <section>
        <h2>Test 2: Single Type with Object Properties</h2>
        <ModernAnimate config={singleTypeConfig}>
          <div style={{ padding: "20px", background: "#e0e0e0" }}>
            Single rotation animation
          </div>
        </ModernAnimate>
      </section>

      <section>
        <h2>Test 3: Scale with Multiple Types</h2>
        <ModernAnimate config={scaleConfig}>
          <div style={{ padding: "20px", background: "#d0d0d0" }}>
            Scale + Fade animation
          </div>
        </ModernAnimate>
      </section>

      <section>
        <h2>Test 4: Complex Multi-Animation</h2>
        <ModernAnimate config={complexConfig}>
          <div style={{ padding: "20px", background: "#c0c0c0" }}>
            Complex: slide + fade + rotate
          </div>
        </ModernAnimate>
      </section>
    </div>
  );
}

export default TestComponent;
