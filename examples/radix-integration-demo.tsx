/**
 * Radix UI Integration Examples
 *
 * This file shows how to use the state-based animation components
 * with Radix UI components to automatically handle animations
 * without manual state management.
 */

import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import {
  RadixAnimate,
  StateBasedAnimate,
} from "@abdullah-altun/react-animation-library";

// Mock components for the example
const ChevronDownIcon = () => <span>▼</span>;
const Text = ({ children, ...props }: any) => (
  <span {...props}>{children}</span>
);

/**
 * Accordion Example - Exactly what you wanted!
 * The chevron automatically rotates when the accordion opens/closes
 */
export function RadixAccordion({
  title,
  body,
  value,
}: {
  title: string;
  body: string;
  value: string;
}) {
  return (
    <AccordionPrimitive.Item value={value} className="accordion-item">
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger className="accordion-trigger">
          <Text as="span" size="md" weight="600">
            {title}
          </Text>
          {/* 🎯 This is what you wanted - automatic chevron rotation! */}
          <RadixAnimate animationType="rotate" degrees={180} duration={300}>
            <ChevronDownIcon />
          </RadixAnimate>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      {/* Content with automatic slide animation */}
      <RadixAnimate animationType="accordion-content" duration={300}>
        <AccordionPrimitive.Content className="accordion-content">
          <div className="accordion-body">
            <Text as="div" size="md" weight="400">
              {body}
            </Text>
          </div>
        </AccordionPrimitive.Content>
      </RadixAnimate>
    </AccordionPrimitive.Item>
  );
}

/**
 * Complete Accordion Root - shows how to use multiple items
 */
export function AccordionDemo() {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      className="accordion-root"
    >
      <RadixAccordion
        value="item-1"
        title="What is React Server Components?"
        body="React Server Components allow you to render components on the server, reducing bundle size and improving performance."
      />
      <RadixAccordion
        value="item-2"
        title="How does this animation work?"
        body="The animation automatically detects the data-state attribute from Radix UI and applies CSS animations accordingly."
      />
      <RadixAccordion
        value="item-3"
        title="Do I need useState?"
        body="No! The animations are completely CSS-based and work with server components."
      />
    </AccordionPrimitive.Root>
  );
}

/**
 * Collapsible Example with different animation
 */
export function CollapsibleExample() {
  return (
    <CollapsiblePrimitive.Root className="collapsible">
      <CollapsiblePrimitive.Trigger className="collapsible-trigger">
        <Text>Show Details</Text>
        {/* Rotate arrow on expand */}
        <StateBasedAnimate animationType="rotate" degrees={90}>
          <span>→</span>
        </StateBasedAnimate>
      </CollapsiblePrimitive.Trigger>

      {/* Fade in content */}
      <StateBasedAnimate animationType="fade" duration={200}>
        <CollapsiblePrimitive.Content className="collapsible-content">
          <div>This content fades in when the collapsible is expanded!</div>
        </CollapsiblePrimitive.Content>
      </StateBasedAnimate>
    </CollapsiblePrimitive.Root>
  );
}

/**
 * Dropdown Menu with scale animation
 */
export function DropdownExample() {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger className="dropdown-trigger">
        <Text>Open Menu</Text>
        <StateBasedAnimate animationType="rotate" degrees={180}>
          <ChevronDownIcon />
        </StateBasedAnimate>
      </DropdownMenuPrimitive.Trigger>

      {/* Menu content with scale animation */}
      <StateBasedAnimate animationType="scale" duration={150}>
        <DropdownMenuPrimitive.Content className="dropdown-content">
          <DropdownMenuPrimitive.Item>Item 1</DropdownMenuPrimitive.Item>
          <DropdownMenuPrimitive.Item>Item 2</DropdownMenuPrimitive.Item>
          <DropdownMenuPrimitive.Item>Item 3</DropdownMenuPrimitive.Item>
        </DropdownMenuPrimitive.Content>
      </StateBasedAnimate>
    </DropdownMenuPrimitive.Root>
  );
}

/**
 * Custom component that uses data-state
 */
export function CustomToggle() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div data-state={isOpen ? "open" : "closed"} className="custom-toggle">
      <button onClick={() => setIsOpen(!isOpen)} className="toggle-button">
        <span>Toggle Content</span>
        {/* This will automatically animate based on the data-state */}
        <StateBasedAnimate animationType="rotate" degrees={45}>
          <span>+</span>
        </StateBasedAnimate>
      </button>

      <StateBasedAnimate animationType="slide-down" distance={100}>
        <div className="toggle-content">
          <p>This content slides down when toggled!</p>
        </div>
      </StateBasedAnimate>
    </div>
  );
}

export default AccordionDemo;
