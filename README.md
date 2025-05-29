# React Animation Library

[![npm version](https://img.shields.io/npm/v/@abdullah-altun/react-animation-library.svg)](https://www.npmjs.com/package/@abdullah-altun/react-animation-library)
[![bundle size](https://img.shields.io/badge/bundle%20size-22KB-brightgreen.svg)](https://bundlephobia.com/package/@abdullah-altun/react-animation-library)
[![license](https://img.shields.io/npm/l/@abdullah-altun/react-animation-library.svg)](https://github.com/abdullahaltun70/@abdullah-altun/react-animation-library/blob/main/LICENSE)

A modern, **performance-first** React animation library that combines the power of CSS-based animations with React's component model. Built for modern applications with **accessibility**, **reusability**, and **composability** at its core.

## ✨ Key Features

- **🚀 Performance Optimized**: 22KB bundle size, tree-shakeable, CSS-powered animations
- **♿ WCAG 2.1 Compliant**: Respects `prefers-reduced-motion` and accessibility guidelines
- **🎯 Modern API**: CSS custom properties, data attributes, and TypeScript-first design
- **🔧 Composable**: Mix and match components, hooks, and configurations
- **📱 Framework Agnostic**: Works with Next.js, Remix, Vite, and any React setup
- **🎨 Interactive**: Built-in micro-animations for hover, focus, and click states
- **🎮 Self-Contained**: Server component compatible toggles without JavaScript state
- **🔄 State-Based**: Automatic animations for Radix UI and similar libraries
- **📦 Complete**: 13 animation components + hooks + TypeScript definitions

## 📦 Installation

```bash
npm install @abdullah-altun/react-animation-library
# or
yarn add @abdullah-altun/react-animation-library
# or
pnpm add @abdullah-altun/react-animation-library
```

## 🚀 Quick Start

### 1. Import Styles

**Option A: Compiled CSS (Recommended)**

```css
/* In your global CSS file */
@import "@abdullah-altun/react-animation-library/styles.css";
```

**Option B: SCSS (For customization)**

```scss
// In your main SCSS file
@use "@abdullah-altun/react-animation-library/styles" as animations;
```

### 2. Basic Usage

```tsx
import { Animate } from "@abdullah-altun/react-animation-library";

function App() {
  return (
    <Animate type="fade" duration={0.6} delay={0.2}>
      <div>Hello, animated world! 👋</div>
    </Animate>
  );
}
```

### 3. Modern API with State Management

```tsx
import { ModernAnimate } from "@abdullah-altun/react-animation-library";

function ModernApp() {
  return (
    <ModernAnimate
      config={{
        type: ["fade", "slide"],
        axis: "y",
        distance: 30,
        duration: 0.6,
        trigger: "visible", // Triggers when element enters viewport
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div>Slides up and fades in when visible!</div>
    </ModernAnimate>
  );
}
```

## 📋 Available Components & Hooks

### Animation Components

```tsx
import {
  // Core animation components
  Animate, // Basic declarative animations
  ModernAnimate, // Advanced with state management
  SequenceAnimate, // Chain multiple animations
  StaggeredAnimate, // Staggered child animations
  InteractiveAnimate, // Hover, focus, click animations

  // Server-compatible components
  ServerAnimate, // CSS-only animations for server components
  SelfContainedToggle, // General-purpose checkbox-based toggle
  SelfContainedDetails, // General-purpose details/summary toggle

  // State-based animation components (perfect for Radix UI)
  RadixAnimate, // Optimized for Radix UI components
  StateBasedAnimate, // General-purpose state-based animations

  // Legacy components (still supported)
  AnimateWrapper, // Wrapper version of Animate
} from "@abdullah-altun/react-animation-library";
```

### Animation Hooks

```tsx
import {
  useAnimation, // Basic animation control
  useModernAnimation, // Advanced animation with state
  useAnimationSequence, // Chain animations programmatically
  useStaggeredAnimation, // Control staggered animations
} from "@abdullah-altun/react-animation-library";
```

### TypeScript Types

```tsx
import type {
  AnimationConfig, // Basic animation configuration
  ModernAnimationConfig, // Advanced configuration
  AnimationSequence, // Sequence configuration
  AnimationState, // Animation state data
  AnimationTrigger, // Trigger types
  AnimationStateData, // State change data
} from "@abdullah-altun/react-animation-library";
```

### Client Components (for Next.js App Router)

```tsx
// Use this import in client components that need interactive features
import {
  Animate,
  ModernAnimate,
} from "@abdullah-altun/react-animation-library/client";
```

## 📚 Complete API Reference

### Core Components

#### `<Animate>`

Basic animation component with simple, declarative props.

```tsx
<Animate
  type="fade" | "slide" | "scale" | "rotate" | "bounce"
  duration={0.5}
  delay={0}
  easing="ease-out"
  distance={20} // For slide animations
  degrees={90}  // For rotate animations
  axis="x" | "y" // For slide animations
>
  <YourContent />
</Animate>
```

#### `<ModernAnimate>`

Advanced animation with CSS-based state management and modern triggers.

```tsx
interface ModernAnimationConfig {
  type: AnimationType | AnimationType[];
  duration?: number | number[];
  delay?: number | number[];
  easing?: string | string[];
  trigger?:
    | "mount"
    | "visible"
    | "hover"
    | "focus"
    | "click"
    | "scroll"
    | "manual";

  // Type-specific properties
  distance?: number;
  degrees?: number | { start?: number; end: number };
  scale?: number | { start?: number; end: number };
  opacity?: { start?: number; end?: number };
  axis?: "x" | "y";

  // Performance & Accessibility
  respectReducedMotion?: boolean;
  reduceMotionFallback?: Partial<ModernAnimationConfig>;
  willChange?: string;
  transform3d?: boolean;

  // Callbacks
  onStart?: () => void;
  onComplete?: () => void;
}

<ModernAnimate
  ref={animationRef}
  config={animationConfig}
  onStateChange={(state) => console.log(state)}
>
  <YourContent />
</ModernAnimate>;
```

#### `<SequenceAnimate>`

Orchestrate complex animation sequences with precise timing control.

```tsx
const sequence: AnimationSequence = {
  name: "hero-entrance",
  steps: [
    {
      animations: [
        { type: "fade", duration: 0.3 },
        { type: "slide", axis: "y", distance: 40, duration: 0.3 },
      ],
      parallel: true, // Run animations simultaneously
    },
    {
      animations: [
        { type: "scale", scale: { start: 1, end: 1.05 }, duration: 0.2 },
      ],
      delay: 0.1,
    },
  ],
  onComplete: () => console.log("Sequence complete!"),
};

<SequenceAnimate sequence={sequence}>
  <div>Complex sequenced animation</div>
</SequenceAnimate>;
```

#### `<StaggeredAnimate>`

Create staggered animations across multiple child elements.

```tsx
<StaggeredAnimate
  animation={{
    type: "fade",
    duration: 0.4,
    easing: "ease-out",
  }}
  stagger={{
    delay: 0.1,
    direction: "forward" | "reverse" | "center-out",
  }}
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</StaggeredAnimate>
```

#### `<InteractiveAnimate>`

Micro-animations for interactive elements with pure CSS performance.

```tsx
<InteractiveAnimate
  hoverConfig={{
    type: "scale",
    scale: { start: 1, end: 1.05 },
    duration: 0.2,
  }}
  clickConfig={{
    type: "scale",
    scale: { start: 1, end: 0.95 },
    duration: 0.1,
  }}
  focusConfig={{
    type: "glow",
    duration: 0.3,
  }}
>
  <button>Interactive Button</button>
</InteractiveAnimate>
```

### Hooks API

#### `useAnimation`

Basic animation hook for simple use cases.

```tsx
const { elementRef, trigger, isAnimating } = useAnimation({
  type: "fade",
  duration: 0.5,
});

return <div ref={elementRef}>Content</div>;
```

#### `useModernAnimation`

Advanced hook with full state management and modern features.

```tsx
const { elementRef, state, trigger, pause, resume, restart, cancel } =
  useModernAnimation({
    type: "slide",
    axis: "y",
    distance: 30,
    trigger: "visible",
  });
```

#### `useAnimationSequence`

Hook for orchestrating complex animation sequences.

```tsx
const { trigger, pause, resume, restart, currentStep, isComplete } =
  useAnimationSequence(sequenceConfig);
```

#### `useStaggeredAnimation`

Hook for managing staggered animations across multiple elements.

```tsx
const { addElement, trigger, reset } = useStaggeredAnimation({
  animation: { type: "fade", duration: 0.3 },
  stagger: { delay: 0.1 },
});

// Use with dynamic elements
const itemRefs = useCallback(
  (element: HTMLElement | null) => {
    if (element) addElement(element);
  },
  [addElement]
);
```

### Self-Contained Components (Server Compatible)

Perfect for **React Server Components** and **Next.js App Router**! These components work without JavaScript state management, using native HTML elements for state.

### SelfContainedToggle - Universal Toggle Component

Works for any toggle scenario: accordions, dropdowns, menus, modals, sidebars, etc.

```tsx
import { SelfContainedToggle } from "@abdullah-altun/react-animation-library";

// FAQ Accordion
<SelfContainedToggle
  animationType="slide-down"
  variant="checkbox"
  trigger={<button>What is React Server Components?</button>}
>
  <div className="answer">
    Server Components let you render components on the server...
  </div>
</SelfContainedToggle>

// Dropdown Menu
<SelfContainedToggle
  animationType="fade"
  variant="checkbox"
  trigger={<button>Products ▼</button>}
>
  <nav className="dropdown">
    <a href="/web">Web Development</a>
    <a href="/mobile">Mobile Apps</a>
  </nav>
</SelfContainedToggle>

// Modal Dialog
<SelfContainedToggle
  animationType="scale"
  variant="checkbox"
  trigger={<button>Open Settings</button>}
>
  <div className="modal-overlay">
    <div className="modal-content">Settings form...</div>
  </div>
</SelfContainedToggle>
```

### SelfContainedDetails - Native Details/Summary

Uses native HTML `<details>` and `<summary>` elements for maximum accessibility.

```tsx
import { SelfContainedDetails } from "@abdullah-altun/react-animation-library";

// Help Section
<SelfContainedDetails
  animationType="slide-down"
  trigger={<summary>How to get started?</summary>}
>
  <div className="help-content">
    <p>Follow these steps to get started...</p>
    <ol>
      <li>Install the package</li>
      <li>Import components</li>
      <li>Add animations</li>
    </ol>
  </div>
</SelfContainedDetails>

// Collapsible Section
<SelfContainedDetails
  animationType="fade"
  defaultOpen={true}
  trigger={<summary>Advanced Options</summary>}
>
  <div className="advanced-options">
    Advanced configuration options...
  </div>
</SelfContainedDetails>
```

### Key Benefits

- ✅ **No JavaScript Required**: Pure CSS animations
- ✅ **Server Component Compatible**: Works in Next.js App Router
- ✅ **Accessible**: Built-in keyboard navigation and screen reader support
- ✅ **Performance**: Zero JavaScript bundle impact
- ✅ **Flexible**: Use for any toggle/collapsible UI pattern

## 🔄 State-Based Animations (Radix UI Integration)

Perfect for reducing boilerplate when working with component libraries like Radix UI. These components automatically detect parent component states and apply animations without requiring manual state management.

### RadixAnimate - Automatic Chevron Rotation

```tsx
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { RadixAnimate } from "@abdullah-altun/react-animation-library";

function Accordion({ title, body, value }) {
  return (
    <AccordionPrimitive.Item value={value}>
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger>
          <span>{title}</span>
          {/* 🎯 Automatically rotates when accordion opens - no useState needed! */}
          <RadixAnimate animationType="rotate" degrees={180}>
            <ChevronDownIcon />
          </RadixAnimate>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      {/* Content animates automatically too */}
      <RadixAnimate animationType="accordion-content">
        <AccordionPrimitive.Content>
          <div>{body}</div>
        </AccordionPrimitive.Content>
      </RadixAnimate>
    </AccordionPrimitive.Item>
  );
}
```

### StateBasedAnimate - General Purpose

```tsx
import { StateBasedAnimate } from "@abdullah-altun/react-animation-library";

// Works with any component that uses data-state attributes
<StateBasedAnimate animationType="slide-down" distance={100}>
  <div>Content that slides down automatically</div>
</StateBasedAnimate>;
```

### Supported State Attributes

Automatically triggers animations when these attributes are detected:

- `data-state="open"` (Radix UI default)
- `data-state="expanded"`
- `data-state="checked"`
- `aria-expanded="true"`
- `data-expanded="true"`

**Benefits:**

- ✅ **Zero State Management**: No `useState` required in your components
- ✅ **Server Compatible**: Works perfectly with React Server Components
- ✅ **Radix Optimized**: Built specifically for Radix UI patterns
- ✅ **Auto-Detection**: Automatically responds to parent component states
- ✅ **Customizable**: Control timing, easing, distances, and more

📖 **[View complete State-Based Animation documentation](STATE_BASED_ANIMATIONS.md)**

## 🎯 Animation Types

### Available Animation Types

- **`fade`**: Opacity transitions (0 to 1 or custom range)
- **`slide`**: Translate along X or Y axis with distance control
- **`scale`**: Transform scale with custom start/end values
- **`rotate`**: Rotation with degree control
- **`bounce`**: Spring-based bounce effects

### Self-Contained Animation Types

- **`slide-down`**: Content slides down when opened
- **`slide-up`**: Content slides up when opened
- **`slide-left`**: Content slides from right to left
- **`slide-right`**: Content slides from left to right
- **`fade`**: Content fades in/out
- **`scale`**: Content scales up/down

## 📊 Bundle Size & Performance

| Asset                  | Size (Minified) | Size (Gzipped) |
| ---------------------- | --------------- | -------------- |
| Main JS Bundle         | 22KB            | ~7KB           |
| CSS Bundle             | 20KB            | ~4KB           |
| TypeScript Definitions | 16KB            | -              |
| **Total Package**      | **188KB**       | **~11KB**      |

### Performance Optimizations

- ✅ **CSS-powered animations**: Hardware accelerated, 60fps
- ✅ **Tree-shakeable**: Only import what you use
- ✅ **Zero runtime overhead**: Self-contained components use pure CSS
- ✅ **Accessibility first**: Respects `prefers-reduced-motion`
- ✅ **Modern browsers**: Optimized for ES2020+ targets

## 🧑‍💻 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [Abdullah Altun](https://github.com/abdullahaltun70)

## 📚 More Examples

Check out our [examples directory](./examples/) for more comprehensive usage examples:

- **[Basic Usage](./examples/basic-usage.tsx)**: Simple animation examples
- **[Modern Showcase](./examples/modern-showcase.tsx)**: Advanced animation patterns
- **[Server Components](./examples/server-component-demo.tsx)**: Next.js server component examples
- **[Self-Contained Demo](./examples/self-contained-demo.tsx)**: Complete self-contained component showcase

---

**Made with ❤️ for the React community**
