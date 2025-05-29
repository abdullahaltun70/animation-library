import React from "react";
import { SelfContainedToggle, SelfContainedDetails } from "./dist";

// Test the new general-purpose components
function TestComponents() {
  return (
    <div>
      <h2>Testing General-Purpose Toggle Components</h2>

      {/* Test SelfContainedToggle for dropdown menu */}
      <SelfContainedToggle
        trigger={<button>Dropdown Menu ▼</button>}
        animationType="slide-down"
      >
        <nav>
          <a href="#item1">Item 1</a>
          <a href="#item2">Item 2</a>
          <a href="#item3">Item 3</a>
        </nav>
      </SelfContainedToggle>

      {/* Test SelfContainedToggle for modal */}
      <SelfContainedToggle
        trigger={<button>Show Modal</button>}
        animationType="fade"
        variant="checkbox"
      >
        <div className="modal">
          <h3>Modal Content</h3>
          <p>This is a modal dialog</p>
        </div>
      </SelfContainedToggle>

      {/* Test SelfContainedDetails for FAQ */}
      <SelfContainedDetails trigger="What is React?" animationType="slide-down">
        <p>React is a JavaScript library for building user interfaces.</p>
      </SelfContainedDetails>

      {/* Test SelfContainedDetails for expandable card */}
      <SelfContainedDetails
        trigger={<div>View Details ▼</div>}
        animationType="scale"
        defaultOpen={false}
      >
        <div>
          <p>Additional details here...</p>
          <button>Action Button</button>
        </div>
      </SelfContainedDetails>
    </div>
  );
}

export default TestComponents;
