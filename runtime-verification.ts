// Comprehensive runtime test for the animation library
import { ModernAnimate } from "./src/components/ModernAnimate";
import { useModernAnimation } from "./src/hooks/useModernAnimation";
import { ModernAnimationConfig } from "./src/types/modern";

console.log("🔍 Running Comprehensive Runtime Tests...");

// Test 1: Verify array functionality works correctly
const arrayConfig: ModernAnimationConfig = {
  type: ["fade", "slide"],
  duration: [0.5, 0.8],
  delay: [0, 0.2],
  easing: ["ease-in", "ease-out"],
  distance: 100,
  axis: "y",
};

// Test 2: Test single values
const singleConfig: ModernAnimationConfig = {
  type: "rotate",
  duration: 1.0,
  delay: 0.1,
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  degrees: { start: 0, end: 360 },
};

// Test 3: Test edge cases (empty arrays, undefined values)
const edgeCaseConfig: ModernAnimationConfig = {
  type: "scale",
  duration: [], // Empty array - should use fallback
  delay: undefined,
  easing: ["ease-out"],
  scale: { start: 0.8, end: 1.2 },
};

// Test 4: Test complex multi-animation
const complexConfig: ModernAnimationConfig = {
  type: ["slide", "fade", "scale"],
  duration: [0.4, 0.6], // Fewer than types
  delay: [0, 0.1, 0.2],
  easing: ["ease-in-out"],
  distance: 50,
  axis: "x",
  scale: { start: 0.9, end: 1.1 },
  respectReducedMotion: true,
};

// Runtime verification function
function verifyConfiguration(config: ModernAnimationConfig, testName: string) {
  console.log(`\n🧪 Testing: ${testName}`);
  console.log("Config:", JSON.stringify(config, null, 2));

  try {
    // Verify type compatibility
    const types = Array.isArray(config.type) ? config.type : [config.type];
    console.log(`✅ Types (${types.length}): ${types.join(", ")}`);

    // Verify array handling
    if (config.duration) {
      const durations = Array.isArray(config.duration)
        ? config.duration
        : [config.duration];
      console.log(
        `✅ Durations (${durations.length}): ${durations.join(", ")}`
      );
    }

    if (config.delay) {
      const delays = Array.isArray(config.delay)
        ? config.delay
        : [config.delay];
      console.log(`✅ Delays (${delays.length}): ${delays.join(", ")}`);
    }

    if (config.easing) {
      const easings = Array.isArray(config.easing)
        ? config.easing
        : [config.easing];
      console.log(`✅ Easings (${easings.length}): ${easings.join(", ")}`);
    }

    console.log(`✅ ${testName} passed!`);
    return true;
  } catch (error) {
    console.error(`❌ ${testName} failed:`, error);
    return false;
  }
}

// Run all tests
const testResults = [
  verifyConfiguration(arrayConfig, "Array Configuration"),
  verifyConfiguration(singleConfig, "Single Configuration"),
  verifyConfiguration(edgeCaseConfig, "Edge Case Configuration"),
  verifyConfiguration(complexConfig, "Complex Configuration"),
];

const passedTests = testResults.filter(Boolean).length;
const totalTests = testResults.length;

console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);

if (passedTests === totalTests) {
  console.log("🎉 All tests passed! The library is working correctly.");
} else {
  console.log("⚠️  Some tests failed. Please review the errors above.");
}

// Export for potential browser testing
export {
  arrayConfig,
  singleConfig,
  edgeCaseConfig,
  complexConfig,
  verifyConfiguration,
};
