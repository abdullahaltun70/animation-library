# React Animation Library

[![npm version](https://img.shields.io/npm/v/@abdullah-altun/react-animation-library.svg)](https://www.npmjs.com/package/@abdullah-altun/react-animation-library)
[![license](https://img.shields.io/npm/l/@abdullah-altun/react-animation-library.svg)](https://github.com/abdullahaltun70/react-animation-library/blob/main/LICENSE)

A comprehensive, high-performance animation library for React applications. Built with modern CSS, TypeScript, and accessibility in mind. From simple entrance animations to complex sequences and state-based interactions.

## 🚀 Features

- **🎯 Multiple Animation Systems:** Traditional hooks, modern CSS-based, sequences, staggered, and state-based
- **⚡ High Performance:** CSS-based animations with hardware acceleration and zero-dependency approach
- **🎨 Rich Animation Types:** Fade, slide, scale, rotate, bounce with multi-animation support
- **🔧 Advanced Controls:** Dynamic timing, easing, triggers, and orchestration
- **♿ Accessibility First:** Respects `prefers-reduced-motion` with fallbacks
- **🎭 State Integration:** Perfect for Radix UI, Headless UI, and other component libraries
- **🖱️ Interactive Animations:** Built-in hover, focus, and click micro-interactions
- **📱 Framework Agnostic:** Works with Next.js, Vite, CRA, and any React setup
- **🔄 Server Compatible:** SSR-friendly components with CSS-only animations
- **📦 TypeScript:** Fully typed with comprehensive IntelliSense support

## Table of Contents

- [Quick Start](#quick-start)
- [Core Components](#core-components)
  - [Animate](#animate)
  - [ModernAnimate](#modernanimate)
  - [StateBasedAnimate](#statebasedanimate)
  - [RadixAnimate](#radixanimate)
  - [ServerAnimate](#serveranimate)
  - [SequenceAnimate](#sequenceanimate)
  - [StaggeredAnimate](#staggeredanimate)
  - [InteractiveAnimate](#interactiveanimate)
- [Hooks](#hooks)
  - [useAnimation](#useanimation)
  - [useModernAnimation](#usemodernanimation)
  - [useAnimationSequence](#useanimationsequence)
  - [useStaggeredAnimation](#usestaggeredanimation)
- [Animation Types](#animation-types)
- [Advanced Features](#advanced-features)
- [TypeScript Support](#typescript-support)
- [Framework Integration](#framework-integration)
- [Performance & Accessibility](#performance--accessibility)
- [API Reference](#api-reference)

## Quick Start

### Installation

```bash
npm install @abdullah-altun/react-animation-library
# or
yarn add @abdullah-altun/react-animation-library
# or
pnpm add @abdullah-altun/react-animation-library
```

### Import Styles

Add the CSS to your application. The method depends on your framework:

#### Next.js (App Router)

```css
/* app/globals.css */
@import "@abdullah-altun/react-animation-library/dist/styles.css";
```

#### Next.js (Pages Router)

```css
/* pages/_app.js or styles/globals.css */
@import "@abdullah-altun/react-animation-library/dist/styles.css";
```

#### Vite/CRA

```css
/* src/index.css or src/App.css */
@import "@abdullah-altun/react-animation-library/dist/styles.css";
```

### Basic Usage

```tsx
import { Animate } from "@abdullah-altun/react-animation-library";

function MyComponent() {
  return (
    <div>
      <Animate type="fade" duration={0.8}>
        <h1>Fade In Title</h1>
      </Animate>

      <Animate type="slide" axis="y" distance={30}>
        <p>Slide up from bottom</p>
      </Animate>

      <Animate type="scale" scale={0.8} delay={0.2}>
        <button>Scale in button</button>
      </Animate>
    </div>
  );
}
```

## Core Components

### Animate

The foundational animation component for simple, declarative animations.

```tsx
import { Animate } from "@abdullah-altun/react-animation-library";

// Basic fade animation
<Animate type="fade" duration={0.6}>
  <div>Content that fades in</div>
</Animate>

// Slide with custom distance and axis
<Animate
  type="slide"
  axis="y"
  distance={50}
  easing="cubic-bezier(0.4, 0, 0.2, 1)"
>
  <div>Slides up from bottom</div>
</Animate>

// Scale with custom start scale
<Animate type="scale" scale={0.5} duration={0.8}>
  <div>Scales from 50% to 100%</div>
</Animate>

// Rotation with specific degrees
<Animate type="rotate" degrees={{ start: 0, end: 180 }}>
  <div>Rotates 180 degrees</div>
</Animate>
```

**Props:**

- `type`: `"fade" | "slide" | "scale" | "rotate" | "bounce"`
- `duration`: Animation duration in seconds (default: 0.5)
- `delay`: Delay before animation starts (default: 0)
- `easing`: CSS easing function (default: "ease-out")
- `distance`: Distance for slide/bounce animations (default: 50px)
- `degrees`: Rotation degrees (number or {start, end} object)
- `scale`: Scale factor for scale animations (default: 0.8)
- `opacity`: Opacity settings {start, end} (default: {start: 0, end: 1})
- `axis`: Axis for slide animations ("x" | "y", default: "x")
- `as`: HTML element or component to render as (default: "div")
- `onAnimationComplete`: Callback when animation finishes

### ModernAnimate

Advanced animation component with multiple animation types, triggers, and CSS custom properties.

```tsx
import { ModernAnimate } from "@abdullah-altun/react-animation-library";

// Single animation with visibility trigger
<ModernAnimate
  config={{
    type: 'fade',
    duration: 0.6,
    trigger: 'visible',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }}
>
  <div>Fades in when visible</div>
</ModernAnimate>

// Multiple animations combined
<ModernAnimate
  config={{
    type: ['fade', 'scale', 'slide'],
    duration: [0.5, 0.8, 0.6],
    delay: [0, 0.1, 0.2],
    axis: 'y',
    distance: 30,
    scale: { start: 0.8, end: 1 }
  }}
>
  <div>Complex multi-animation</div>
</ModernAnimate>

// Trigger-based animation
<ModernAnimate
  config={{
    type: 'bounce',
    trigger: 'hover',
    duration: 0.3,
    iterationCount: 2
  }}
>
  <button>Bounces on hover</button>
</ModernAnimate>
```

**Key Features:**

- **Multiple Animation Types**: Combine animations like `['fade', 'scale', 'slide']`
- **Triggers**: `'mount' | 'visible' | 'hover' | 'focus' | 'click' | 'scroll' | 'manual'`
- **Advanced Timing**: Array support for duration, delay, easing per animation
- **Accessibility**: Built-in `prefers-reduced-motion` support
- **Performance**: Uses CSS custom properties for dynamic control

### StateBasedAnimate

Perfect for component libraries like Radix UI. Automatically animates based on parent state changes.

```tsx
import StateBasedAnimate from "@abdullah-altun/react-animation-library";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

// Rotating chevron based on accordion state
<AccordionPrimitive.Trigger>
  <span>Accordion Title</span>
  <StateBasedAnimate animationType="rotate" degrees={180}>
    <ChevronDownIcon />
  </StateBasedAnimate>
</AccordionPrimitive.Trigger>

// Sliding content based on collapsible state
<StateBasedAnimate animationType="slide-down" distance={200}>
  <AccordionPrimitive.Content>
    <div>Content that slides down when opened</div>
  </AccordionPrimitive.Content>
</StateBasedAnimate>

// Custom trigger state
<StateBasedAnimate
  animationType="fade"
  triggerState="active"
  stateSelector="[data-state]"
>
  <div>Fades based on active state</div>
</StateBasedAnimate>
```

**Animation Types:**

- `"rotate"`: Rotates element (perfect for chevrons, arrows)
- `"slide-down"`: Slides content down (accordion content)
- `"slide-up"`: Slides content up
- `"fade"`: Fades in/out based on state
- `"scale"`: Scales element based on state

### RadixAnimate

Optimized specifically for Radix UI components with pre-configured animations.

```tsx
import RadixAnimate from "@abdullah-altun/react-animation-library";

// Accordion chevron rotation
<AccordionPrimitive.Trigger>
  <span>Title</span>
  <RadixAnimate animationType="rotate" degrees={180}>
    <ChevronDownIcon />
  </RadixAnimate>
</AccordionPrimitive.Trigger>

// Accordion content with height handling
<RadixAnimate animationType="accordion-content">
  <AccordionPrimitive.Content>
    <div className="p-4">
      Content with automatic height transitions
    </div>
  </AccordionPrimitive.Content>
</RadixAnimate>
```

**Pre-configured Animations:**

- `"rotate"`: Optimized chevron rotation
- `"accordion-content"`: Height-aware content transitions
- `"fade"`: State-based fade transitions
- `"scale"`: Smooth scaling effects

### ServerAnimate

Server-side rendering compatible animations using CSS-only techniques.

```tsx
import { ServerAnimate } from "@abdullah-altun/react-animation-library";

// External state management
<ServerAnimate type="rotate" state={isOpen ? 'open' : 'closed'}>
  <ChevronIcon />
</ServerAnimate>

// Self-contained with details/summary
<ServerAnimate
  type="slide-down"
  selfContained={{
    method: 'details',
    trigger: <span>Click to expand</span>,
    content: <div>Content that slides down</div>,
    defaultOpen: false
  }}
/>

// Self-contained with checkbox
<ServerAnimate
  type="slide-up"
  selfContained={{
    method: 'checkbox',
    trigger: <label>Toggle Content</label>,
    content: <div>Hidden content</div>,
    id: 'unique-toggle'
  }}
/>
```

**Features:**

- **No JavaScript Required**: Pure CSS animations
- **Self-Contained**: Built-in state management with `<details>` or checkbox
- **External State**: Works with any state management
- **SSR Safe**: Perfect for server-side rendering

### SequenceAnimate

Orchestrate complex multi-step animation sequences.

```tsx
import { SequenceAnimate } from "@abdullah-altun/react-animation-library";

const complexSequence = {
  name: "entrance-sequence",
  steps: [
    {
      animations: [{ type: "fade", duration: 0.3 }],
      parallel: false,
    },
    {
      animations: [
        { type: "slide", axis: "y", distance: 30, duration: 0.4 },
        { type: "scale", scale: 0.9, duration: 0.4 },
      ],
      parallel: true,
      delay: 0.2,
    },
    {
      animations: [{ type: "bounce", duration: 0.6 }],
      delay: 0.1,
    },
  ],
  repeat: 1,
  onComplete: () => console.log("Sequence complete"),
  onStepComplete: (step) => console.log(`Step ${step} complete`),
};

<SequenceAnimate sequence={complexSequence} autoStart>
  <div>Element with complex entrance sequence</div>
</SequenceAnimate>;
```

### StaggeredAnimate

Create staggered animations across multiple child elements.

```tsx
import { StaggeredAnimate } from "@abdullah-altun/react-animation-library";

<StaggeredAnimate
  itemAnimation={{ type: 'fade', duration: 0.3 }}
  staggerDelay={0.1}
  staggerDirection="forward"
  autoStart
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</StaggeredAnimate>

// Advanced staggered animation
<StaggeredAnimate
  itemAnimation={{
    type: ['fade', 'slide'],
    axis: 'y',
    duration: 0.4,
    distance: 20
  }}
  staggerDelay={0.15}
  staggerDirection="center-out"
  maxConcurrent={3}
>
  {items.map((item, index) => (
    <div key={index}>{item.content}</div>
  ))}
</StaggeredAnimate>
```

**Stagger Directions:**

- `"forward"`: Animates from first to last element
- `"reverse"`: Animates from last to first element
- `"center-out"`: Animates from center elements outward

### InteractiveAnimate

Micro-interactions for hover, focus, and click states using pure CSS.

```tsx
import { InteractiveAnimate } from "@abdullah-altun/react-animation-library";

<InteractiveAnimate
  hoverConfig={{
    type: 'scale',
    scale: { start: 1, end: 1.05 },
    duration: 0.2
  }}
  clickConfig={{
    type: 'scale',
    scale: { start: 1, end: 0.95 },
    duration: 0.1
  }}
  className="interactive-button"
>
  <button>Interactive Button</button>
</InteractiveAnimate>

// Complex hover effects
<InteractiveAnimate
  hoverConfig={{
    type: ['scale', 'rotate'],
    scale: { start: 1, end: 1.1 },
    degrees: 5,
    duration: 0.3
  }}
  focusConfig={{
    type: 'scale',
    scale: { start: 1, end: 1.02 }
  }}
>
  <div className="card">Hover and focus me</div>
</InteractiveAnimate>
```

## Hooks

### useAnimation

Low-level hook for custom animation implementation.

```tsx
import { useAnimation } from "@abdullah-altun/react-animation-library";

function CustomComponent() {
  const { ref, replay, key } = useAnimation(
    {
      type: "fade",
      duration: 0.6,
      easing: "ease-out",
    },
    (event) => {
      console.log("Animation completed");
    }
  );

  return (
    <div>
      <div ref={ref} key={key}>
        Animated content
      </div>
      <button onClick={replay}>Replay Animation</button>
    </div>
  );
}
```

### useModernAnimation

Advanced hook with state management and multiple triggers.

```tsx
import { useModernAnimation } from "@abdullah-altun/react-animation-library";

function AdvancedComponent() {
  const { ref, trigger, pause, resume, restart, cancel, state } =
    useModernAnimation({
      type: ["fade", "scale"],
      duration: [0.4, 0.6],
      trigger: "manual",
      onComplete: () => console.log("Done!"),
    });

  return (
    <div>
      <div ref={ref}>Content</div>
      <button onClick={() => trigger()}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={resume}>Resume</button>
      <p>State: {state}</p>
    </div>
  );
}
```

### useAnimationSequence

Hook for managing complex animation sequences.

```tsx
import { useAnimationSequence } from "@abdullah-altun/react-animation-library";

function SequenceComponent() {
  const sequence = {
    name: "complex-entrance",
    steps: [
      { animations: [{ type: "fade", duration: 0.3 }] },
      { animations: [{ type: "slide", duration: 0.4 }], delay: 0.2 },
    ],
  };

  const {
    ref,
    currentStep,
    totalSteps,
    state,
    start,
    pause,
    restart,
    goToStep,
  } = useAnimationSequence(sequence);

  return (
    <div>
      <div ref={ref}>Sequenced content</div>
      <div>
        Step {currentStep + 1} of {totalSteps} - Status: {state}
      </div>
      <button onClick={start}>Start</button>
      <button onClick={() => goToStep(1)}>Go to Step 2</button>
    </div>
  );
}
```

### useStaggeredAnimation

Hook for staggered animations across multiple elements.

```tsx
import { useStaggeredAnimation } from "@abdullah-altun/react-animation-library";

function StaggeredComponent() {
  const { refs, trigger, pause, restart } = useStaggeredAnimation(
    {
      animations: [{ type: "fade", duration: 0.3 }],
      delay: 0.1,
      direction: "forward",
    },
    5
  ); // 5 elements

  return (
    <div>
      {refs.map((ref, index) => (
        <div key={index} ref={ref}>
          Item {index + 1}
        </div>
      ))}
      <button onClick={trigger}>Trigger Stagger</button>
    </div>
  );
}
```

## Animation Types

### Basic Types

- **`fade`**: Opacity transitions from 0 to 1
- **`slide`**: Translate movement along x or y axis
- **`scale`**: Size transformations from smaller to normal
- **`rotate`**: Rotation transformations
- **`bounce`**: Spring-like bounce effects

### Multi-Animation Support

Combine multiple animation types for complex effects:

```tsx
// Fade + Scale + Slide simultaneously
<ModernAnimate
  config={{
    type: ["fade", "scale", "slide"],
    axis: "y",
    distance: 20,
    scale: { start: 0.9, end: 1 },
    duration: [0.4, 0.6, 0.5],
  }}
>
  <div>Multi-animation element</div>
</ModernAnimate>
```

## Advanced Features

### Responsive Animations

```tsx
<ModernAnimate
  config={{
    type: "slide",
    distance: 50,
    mediaQueries: {
      "(max-width: 768px)": {
        distance: 20,
        duration: 0.3,
      },
      "(prefers-reduced-motion: reduce)": {
        type: "fade",
        duration: 0.1,
      },
    },
  }}
>
  <div>Responsive animation</div>
</ModernAnimate>
```

### Conditional Animations

```tsx
<ModernAnimate
  config={{
    type: "bounce",
    condition: () => window.innerWidth > 1024,
    reduceMotionFallback: { type: "fade", duration: 0.2 },
  }}
>
  <div>Conditional bounce animation</div>
</ModernAnimate>
```

### Performance Optimizations

```tsx
<ModernAnimate
  config={{
    type: "scale",
    willChange: "transform",
    transform3d: true, // Forces hardware acceleration
    respectReducedMotion: true,
  }}
>
  <div>Performance optimized animation</div>
</ModernAnimate>
```

## Framework Integration

### Next.js Integration

```tsx
// app/layout.tsx
import "@abdullah-altun/react-animation-library/dist/styles.css";

// pages/_app.tsx (Pages Router)
import "@abdullah-altun/react-animation-library/dist/styles.css";

// Component usage

import { Animate } from "@abdullah-altun/react-animation-library";

export default function Page() {
  return (
    <Animate type="fade">
      <h1>Animated Title</h1>
    </Animate>
  );
}
```

### Radix UI Integration

```tsx
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import StateBasedAnimate from "@abdullah-altun/react-animation-library";

<AccordionPrimitive.Root>
  <AccordionPrimitive.Item>
    <AccordionPrimitive.Trigger>
      <span>Trigger</span>
      <StateBasedAnimate animationType="rotate" degrees={180}>
        <ChevronDownIcon />
      </StateBasedAnimate>
    </AccordionPrimitive.Trigger>

    <StateBasedAnimate animationType="slide-down">
      <AccordionPrimitive.Content>
        <div>Animated content</div>
      </AccordionPrimitive.Content>
    </StateBasedAnimate>
  </AccordionPrimitive.Item>
</AccordionPrimitive.Root>;
```

## Performance & Accessibility

### Reduced Motion Support

The library automatically respects the `prefers-reduced-motion` media query:

```css
/* Automatic behavior */
@media (prefers-reduced-motion: reduce) {
  .animation-fade {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Custom Reduced Motion Handling

```tsx
<ModernAnimate
  config={{
    type: "bounce",
    respectReducedMotion: true,
    reduceMotionFallback: {
      type: "fade",
      duration: 0.1,
    },
  }}
>
  <div>Accessible animation</div>
</ModernAnimate>
```

### Performance Best Practices

1. **Use CSS-based animations** for better performance
2. **Prefer `transform` properties** over layout-affecting properties
3. **Use `will-change`** for elements that will animate
4. **Enable hardware acceleration** with `transform3d: true`
5. **Minimize reflows** by avoiding width/height animations

## TypeScript Support

### Core Types

```typescript
import type {
  AnimationConfig,
  ModernAnimationConfig,
  AnimationSequence,
  AnimationState,
  AnimationTrigger,
} from "@abdullah-altun/react-animation-library";

// Basic animation configuration
const config: AnimationConfig = {
  type: "fade",
  duration: 0.6,
  easing: "ease-out",
};

// Modern animation configuration
const modernConfig: ModernAnimationConfig = {
  type: ["fade", "scale"],
  duration: [0.4, 0.6],
  trigger: "visible",
  iterationCount: 2,
};

// Animation sequence
const sequence: AnimationSequence = {
  name: "complex-entrance",
  steps: [{ animations: [{ type: "fade", duration: 0.3 }] }],
};
```

### Component Ref Types

```typescript
import type {
  ModernAnimateRef,
  SequenceAnimateRef,
} from "@abdullah-altun/react-animation-library";

const modernRef = useRef<ModernAnimateRef>(null);
const sequenceRef = useRef<SequenceAnimateRef>(null);

// Access methods
modernRef.current?.trigger();
sequenceRef.current?.goToStep(2);
```

## API Reference

### Animation Configuration

```typescript
interface AnimationConfig {
  type: "fade" | "slide" | "scale" | "rotate" | "bounce";
  duration?: number;
  delay?: number;
  easing?: string;
  distance?: number;
  degrees?: number | { start?: number; end: number };
  scale?: number;
  opacity?: { start?: number; end?: number };
  axis?: "x" | "y";
  animateOnMount?: boolean;
}

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
  state?: "idle" | "animating" | "paused" | "completed" | "error";
  direction?: "normal" | "reverse" | "alternate" | "alternate-reverse";
  fillMode?: "none" | "forwards" | "backwards" | "both";
  iterationCount?: number | "infinite";
  respectReducedMotion?: boolean;
  reduceMotionFallback?: Partial<ModernAnimationConfig>;
  onStart?: () => void;
  onComplete?: () => void;
  onIteration?: () => void;
  onCancel?: () => void;
}
```

### Component Props

All components support standard HTML div props plus their specific animation props. See individual component sections for detailed prop interfaces.

### Hook Returns

```typescript
// useAnimation
interface UseAnimationReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  key: number;
  replay: () => void;
}

// useModernAnimation
interface UseModernAnimationReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  trigger: (triggerType?: AnimationTrigger) => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
  cancel: () => void;
  state: AnimationState;
}
```

---

## License

MIT © [Abdullah Altun](https://github.com/abdullahaltun70)

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) and feel free to submit issues and pull requests.

## Support

- 📖 [Documentation](https://github.com/abdullahaltun70/react-animation-library)
- 🐛 [Issues](https://github.com/abdullahaltun70/react-animation-library/issues)
- 💬 [Discussions](https://github.com/abdullahaltun70/react-animation-library/discussions)
