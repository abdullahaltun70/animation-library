import React from "react";
import {
  ServerAnimate,
  SelfContainedDetails,
  SelfContainedToggle,
} from "../dist";

/**
 * Self-Contained Animation Demo
 *
 * This example demonstrates how to use self-contained animations
 * that work without external state management - perfect for
 * Next.js server components!
 */

const ChevronIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export function SelfContainedDemo() {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Self-Contained Animation Demo</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4">
          1. ServerAnimate with Details Method
        </h2>
        <p className="text-gray-600 mb-4">
          Uses native HTML details/summary elements for accessibility
        </p>

        <ServerAnimate
          type="slide-down"
          selfContained={{
            method: "details",
            trigger: (
              <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg cursor-pointer">
                <span>Click to expand FAQ</span>
                <ChevronIcon />
              </div>
            ),
            content: (
              <div className="p-4 bg-gray-50 border-l-4 border-blue-400">
                <p>
                  This content slides down smoothly when the summary is clicked.
                </p>
                <p>
                  It uses native HTML details/summary elements, making it fully
                  accessible.
                </p>
                <p>The chevron rotates using pure CSS animations!</p>
              </div>
            ),
            defaultOpen: false,
          }}
        />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">
          2. ServerAnimate with Checkbox Method
        </h2>
        <p className="text-gray-600 mb-4">
          Uses hidden checkbox for maximum styling flexibility
        </p>

        <ServerAnimate
          type="rotate"
          selfContained={{
            method: "checkbox",
            trigger: (
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg cursor-pointer">
                <span>Toggle with Checkbox State</span>
                <ChevronIcon />
              </div>
            ),
            content: (
              <div className="p-4 bg-gray-50 border-l-4 border-green-400">
                <p>This accordion uses a hidden checkbox to manage state.</p>
                <p>
                  Perfect for complex styling scenarios where you need more
                  control.
                </p>
                <p>The rotation animation is applied to the trigger element.</p>
              </div>
            ),
            id: "checkbox-accordion-demo",
            defaultOpen: false,
          }}
        />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">
          3. SelfContainedDetails Component
        </h2>
        <p className="text-gray-600 mb-4">
          General-purpose details/summary component with built-in animations
        </p>

        <SelfContainedDetails
          animationType="slide-down"
          className="border border-purple-200 rounded-lg overflow-hidden"
          trigger={
            <div className="flex items-center gap-2 p-4 bg-purple-50 rounded-lg">
              <span>General-Purpose Details Component</span>
              <ChevronIcon />
            </div>
          }
        >
          <div className="p-4 bg-purple-25">
            <h4 className="font-semibold mb-2">Built-in Animation Features:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Smooth slide-down animation</li>
              <li>Native accessibility support</li>
              <li>No JavaScript state management required</li>
              <li>Works for any collapsible content</li>
            </ul>
          </div>
        </SelfContainedDetails>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">
          4. SelfContainedToggle Component
        </h2>
        <p className="text-gray-600 mb-4">
          General-purpose checkbox-based toggle for advanced styling scenarios
        </p>

        <SelfContainedToggle
          animationType="slide-down"
          variant="checkbox"
          className="border border-orange-200 rounded-lg overflow-hidden"
          trigger={
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <span>General-Purpose Toggle Component</span>
              <ChevronIcon />
            </div>
          }
        >
          <div className="p-4 bg-orange-25">
            <h4 className="font-semibold mb-2">Toggle Method Benefits:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Maximum styling flexibility</li>
              <li>Custom animations via CSS</li>
              <li>Works with complex layouts</li>
              <li>Checkbox-based state management</li>
            </ul>
          </div>
        </SelfContainedToggle>
      </section>

      <section className="mt-8 p-6 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">
          🚀 Server Component Ready!
        </h3>
        <p className="text-gray-700">
          All these components work perfectly in Next.js server components
          because they don't rely on client-side state management. They use
          native HTML elements and CSS animations for a completely
          self-contained experience.
        </p>
      </section>
    </div>
  );
}

export default SelfContainedDemo;
