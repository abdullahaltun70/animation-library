/**
 * Test file to verify state-based animation components work correctly
 */

import React from "react";
import {
  RadixAnimate,
  StateBasedAnimate,
} from "@abdullah-altun/react-animation-library";

// Mock Radix components for testing
const MockAccordionItem = ({ children, ...props }: any) => (
  <div {...props}>{children}</div>
);
const MockAccordionTrigger = ({ children, ...props }: any) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <button
      {...props}
      data-state={isOpen ? "open" : "closed"}
      onClick={() => setIsOpen(!isOpen)}
    >
      {children}
    </button>
  );
};
const MockAccordionContent = ({ children, ...props }: any) => (
  <div {...props}>{children}</div>
);

// Test component that mimics your exact use case
function TestAccordion() {
  return (
    <MockAccordionItem>
      <MockAccordionTrigger
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem",
        }}
      >
        <span>Test Accordion Title</span>
        {/* This should automatically rotate when clicked */}
        <RadixAnimate animationType="rotate" degrees={180} duration={300}>
          <span>▼</span>
        </RadixAnimate>
      </MockAccordionTrigger>

      {/* Content should slide with proper height animation */}
      <RadixAnimate animationType="accordion-content" duration={300}>
        <MockAccordionContent
          style={{ padding: "1rem", background: "#f0f0f0" }}
        >
          <div>
            This content should animate smoothly when the accordion
            opens/closes. The chevron above should rotate 180 degrees
            automatically!
          </div>
        </MockAccordionContent>
      </RadixAnimate>
    </MockAccordionItem>
  );
}

// Test StateBasedAnimate component
function TestStateBasedAnimate() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      data-state={isOpen ? "open" : "closed"}
      style={{ border: "1px solid #ccc", margin: "1rem" }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          padding: "1rem",
        }}
      >
        <span>Toggle Content</span>
        <StateBasedAnimate animationType="rotate" degrees={45}>
          <span>+</span>
        </StateBasedAnimate>
      </button>

      <StateBasedAnimate animationType="fade" duration={200}>
        <div style={{ padding: "1rem", background: "#f9f9f9" }}>
          This content should fade in/out when toggled!
        </div>
      </StateBasedAnimate>
    </div>
  );
}

// Main test component
export default function StateBasedAnimationTest() {
  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h1>State-Based Animation Test</h1>

      <h2>RadixAnimate Test</h2>
      <p>Click the accordion below. The chevron should rotate automatically:</p>
      <TestAccordion />

      <h2>StateBasedAnimate Test</h2>
      <p>
        Click the toggle below. The + should rotate and content should fade:
      </p>
      <TestStateBasedAnimate />

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#e6f3ff",
          borderRadius: "6px",
        }}
      >
        <h3>✅ Success Criteria</h3>
        <ul>
          <li>
            Chevron rotates when accordion is clicked (no useState needed in
            your component)
          </li>
          <li>Content animates smoothly with proper height handling</li>
          <li>+ icon rotates when toggle is clicked</li>
          <li>Content fades in/out appropriately</li>
          <li>All animations respect the specified duration and easing</li>
        </ul>
      </div>
    </div>
  );
}
