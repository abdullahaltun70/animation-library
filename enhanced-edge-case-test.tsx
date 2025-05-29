import React from "react";
import { ModernAnimate } from "./src/components/ModernAnimate";
import { ModernAnimationConfig } from "./src/types/modern";

// Test edge cases and robustness
console.log("🔬 Enhanced Edge Case Testing");

// Test 1: Empty arrays - should use fallback values
const emptyArrayConfig: ModernAnimationConfig = {
  type: "fade",
  duration: [], // Should fallback to 0.5
  delay: [], // Should fallback to 0
  easing: [], // Should fallback to "ease-out"
};

// Test 2: Undefined/null handling
const undefinedConfig: ModernAnimationConfig = {
  type: "slide",
  duration: undefined,
  delay: undefined,
  easing: undefined,
  distance: undefined,
  axis: undefined,
};

// Test 3: Mixed valid/invalid values
const mixedConfig: ModernAnimationConfig = {
  type: ["fade", "slide"],
  duration: [0.6], // Single element for multiple types
  delay: [0, 0.1, 0.2], // More elements than types
  easing: ["ease-in", "ease-out"],
  distance: 100,
  axis: "y",
};

// Test 4: Edge case with single type in array
const singleInArrayConfig: ModernAnimationConfig = {
  type: ["rotate"], // Single type in array
  degrees: { start: 0, end: 180 },
  duration: [0.8],
  delay: [0.1],
};

// Test 5: Complex nesting with potential issues
const complexEdgeCaseConfig: ModernAnimationConfig = {
  type: ["slide", "fade", "scale"],
  duration: [0.3, 0.6], // Fewer durations than types
  delay: [0], // Single delay for all
  easing: ["cubic-bezier(0.4, 0, 0.2, 1)"], // Single easing for all
  distance: 50,
  scale: { start: 0.9, end: 1.1 },
  axis: "x",
  respectReducedMotion: true,
  onStart: () => console.log("Complex animation started"),
  onComplete: () => console.log("Complex animation completed"),
};

function EnhancedEdgeCaseTest() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🔬 Enhanced Edge Case Testing</h1>
      <p>Testing robustness and edge case handling...</p>

      <section style={{ marginBottom: "30px" }}>
        <h2>Test 1: Empty Arrays</h2>
        <ModernAnimate config={emptyArrayConfig}>
          <div
            style={{
              padding: "15px",
              background: "#f8f9fa",
              border: "1px solid #dee2e6",
            }}
          >
            Empty arrays test - should use fallback values
          </div>
        </ModernAnimate>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2>Test 2: Undefined Values</h2>
        <ModernAnimate config={undefinedConfig}>
          <div
            style={{
              padding: "15px",
              background: "#e3f2fd",
              border: "1px solid #90caf9",
            }}
          >
            Undefined values test - should handle gracefully
          </div>
        </ModernAnimate>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2>Test 3: Mixed Array Lengths</h2>
        <ModernAnimate config={mixedConfig}>
          <div
            style={{
              padding: "15px",
              background: "#f3e5f5",
              border: "1px solid #ce93d8",
            }}
          >
            Mixed array lengths test - should handle mismatched arrays
          </div>
        </ModernAnimate>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2>Test 4: Single Type in Array</h2>
        <ModernAnimate config={singleInArrayConfig}>
          <div
            style={{
              padding: "15px",
              background: "#e8f5e8",
              border: "1px solid #a5d6a7",
            }}
          >
            Single type in array test - should work normally
          </div>
        </ModernAnimate>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2>Test 5: Complex Edge Case</h2>
        <ModernAnimate config={complexEdgeCaseConfig}>
          <div
            style={{
              padding: "15px",
              background: "#fff3e0",
              border: "1px solid #ffcc02",
            }}
          >
            Complex edge case - multiple types with uneven property arrays
          </div>
        </ModernAnimate>
      </section>

      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          background: "#e7f3ff",
          border: "1px solid #2196f3",
        }}
      >
        <h3>✅ Expected Behavior</h3>
        <ul>
          <li>Empty arrays should use sensible fallback values</li>
          <li>Undefined values should be handled gracefully</li>
          <li>Mixed array lengths should not cause crashes</li>
          <li>All animations should complete successfully</li>
          <li>No console errors should appear</li>
        </ul>
      </div>
    </div>
  );
}

export default EnhancedEdgeCaseTest;
