# React Animation Library

[![npm version](https://img.shields.io/npm/v/@abdullah-altun/react-animation-library.svg)](https://www.npmjs.com/package/@abdullah-altun/react-animation-library)
[![bundle size](https://img.shields.io/badge/bundle%20size-13KB-brightgreen.svg)](https://bundlephobia.com/package/@abdullah-altun/react-animation-library)
[![license](https://img.shields.io/npm/l/@abdullah-altun/react-animation-library.svg)](https://github.com/abdullahaltun70/@abdullah-altun/react-animation-library/blob/main/LICENSE)

A modern, **performance-first** React animation library that combines the power of CSS-based animations with React's component model. Built for modern applications with **accessibility**, **reusability**, and **composability** at its core.

## ✨ Key Features

- **🚀 Performance Optimized**: 13KB bundle size, tree-shakeable, CSS-powered animations
- **♿ WCAG 2.1 Compliant**: Respects `prefers-reduced-motion` and accessibility guidelines
- **🎯 Modern API**: CSS custom properties, data attributes, and TypeScript-first design
- **🔧 Composable**: Mix and match components, hooks, and configurations
- **📱 Framework Agnostic**: Works with Next.js, Remix, Vite, and any React setup
- **🎨 Interactive**: Built-in micro-animations for hover, focus, and click states

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

## 🎯 Performance Characteristics

### Bundle Size Analysis

- **Main bundle**: 13KB (minified)
- **CSS bundle**: 15KB (minified)
- **Tree-shakeable**: Import only what you use
- **Zero runtime dependencies**: Pure CSS animations

```bash
# Analyze bundle size
npm run build:analyze
```

### Performance Optimizations

1. **CSS-Powered Animations**: Uses CSS transitions and keyframes for optimal performance
2. **Hardware Acceleration**: Automatically applies `transform3d` for GPU acceleration
3. **Intersection Observer**: Efficient viewport detection for scroll-triggered animations
4. **Reduced Bundle Impact**: Tree-shakeable exports and optional features
5. **Memory Management**: Automatic cleanup of event listeners and observers

### Performance Best Practices

```tsx
// ✅ Good: Use transform-based animations
<ModernAnimate config={{ type: 'slide', axis: 'x' }}>

// ❌ Avoid: Layout-triggering properties
<ModernAnimate config={{ type: 'custom' }} style={{left: '100px'}}>

// ✅ Good: Batch animations with sequences
<SequenceAnimate sequence={batchedAnimations}>

// ✅ Good: Use will-change for complex animations
<ModernAnimate
  config={{
    type: 'complex-transform',
    willChange: 'transform, opacity'
  }}
>
```

## ♿ Accessibility & WCAG 2.1 Compliance

### Automatic Reduced Motion Support

The library automatically respects `prefers-reduced-motion` settings:

```tsx
// Automatically respects user preferences
<ModernAnimate
  config={{
    type: "slide",
    duration: 0.6,
    respectReducedMotion: true, // Default: true
    reduceMotionFallback: {
      type: "fade",
      duration: 0.1, // Faster, subtle animation
    },
  }}
>
  <Content />
</ModernAnimate>
```

### Accessibility Features

1. **WCAG 2.3.3 Compliance**: Animations from interactions have duration ≤ 5 seconds or user controls
2. **Focus Management**: Maintains focus visibility during animations
3. **Screen Reader Friendly**: Uses semantic HTML and ARIA attributes
4. **Keyboard Navigation**: All interactive animations support keyboard triggers
5. **Vestibular Disorder Support**: Provides reduced motion alternatives

### Accessibility Configuration

```scss
// Custom reduced motion handling
@use "@abdullah-altun/react-animation-library/styles" with (
  $reduced-motion-duration: 0.1s,
  $respect-reduced-motion: true
);
```

## 🔧 Reusability Patterns

### Creating Reusable Animation Configs

```tsx
// animation-configs.ts
export const slideInConfig: ModernAnimationConfig = {
  type: "slide",
  axis: "y",
  distance: 30,
  duration: 0.6,
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  trigger: "visible",
};

export const buttonHoverConfig: ModernAnimationConfig = {
  type: "scale",
  scale: { start: 1, end: 1.05 },
  duration: 0.2,
  easing: "ease-out",
};

// Usage across components
<ModernAnimate config={slideInConfig}>
  <Card />
</ModernAnimate>;
```

### Custom Animation Components

```tsx
// components/AnimatedCard.tsx
interface AnimatedCardProps {
  children: React.ReactNode;
  variant?: "slide" | "fade" | "scale";
  delay?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  variant = "slide",
  delay = 0,
}) => {
  const configs = {
    slide: { type: "slide", axis: "y", distance: 20 },
    fade: { type: "fade" },
    scale: { type: "scale", scale: { start: 0.9, end: 1 } },
  };

  return (
    <ModernAnimate
      config={{
        ...configs[variant],
        duration: 0.6,
        delay,
        trigger: "visible",
      }}
    >
      <div className="card">{children}</div>
    </ModernAnimate>
  );
};
```

### Animation Theme System

```tsx
// theme/animations.ts
export const animationTheme = {
  durations: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.6
  },
  easings: {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
  },
  distances: {
    small: 10,
    medium: 20,
    large: 40
  }
};

// Usage with theme
<ModernAnimate
  config={{
    type: 'slide',
    duration: animationTheme.durations.normal,
    easing: animationTheme.easings.smooth,
    distance: animationTheme.distances.medium
  }}
>
```

## 🎨 Composability Examples

### Combining Multiple Animations

```tsx
// Fade + Slide combination
<ModernAnimate
  config={{
    type: ["fade", "slide"],
    axis: "y",
    distance: 30,
    duration: [0.6, 0.4], // Different durations for each
    delay: [0, 0.1], // Staggered delays
  }}
>
  <Content />
</ModernAnimate>
```

### Nested Animations

```tsx
<ModernAnimate config={{ type: "fade", duration: 0.6 }}>
  <div>
    <StaggeredAnimate
      animation={{ type: "slide", axis: "x", distance: 20 }}
      stagger={{ delay: 0.1 }}
    >
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </StaggeredAnimate>
  </div>
</ModernAnimate>
```

### Responsive Animations

```tsx
const responsiveConfig: ModernAnimationConfig = {
  type: "slide",
  axis: "y",
  distance: 30,
  duration: 0.6,
  mediaQueries: {
    "(max-width: 768px)": {
      distance: 15,
      duration: 0.4,
    },
    "(prefers-reduced-motion: reduce)": {
      type: "fade",
      duration: 0.1,
    },
  },
};
```

### Animation Composition with Hooks

```tsx
function ComplexAnimatedComponent() {
  const slideAnimation = useModernAnimation({
    type: "slide",
    axis: "y",
    trigger: "visible",
  });

  const scaleAnimation = useModernAnimation({
    type: "scale",
    trigger: "hover",
  });

  const handleClick = () => {
    slideAnimation.restart();
    scaleAnimation.trigger();
  };

  return (
    <div ref={slideAnimation.elementRef} onClick={handleClick}>
      <div ref={scaleAnimation.elementRef}>Composable animations</div>
    </div>
  );
}
```

## 🏗️ Framework Integration

### Next.js Integration

```tsx
// pages/_app.tsx or app/layout.tsx
import "@abdullah-altun/react-animation-library/styles.css";

// components/AnimatedLayout.tsx
import { ModernAnimate } from "@abdullah-altun/react-animation-library";

export default function AnimatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModernAnimate
      config={{
        type: "fade",
        duration: 0.3,
        trigger: "mount",
      }}
    >
      {children}
    </ModernAnimate>
  );
}
```

### Remix Integration

```tsx
// app/root.tsx
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from "@abdullah-altun/react-animation-library/styles.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

// routes/index.tsx
import { ModernAnimate } from "@abdullah-altun/react-animation-library";

export default function Index() {
  return (
    <ModernAnimate config={{ type: "slide", trigger: "visible" }}>
      <main>Welcome to Remix!</main>
    </ModernAnimate>
  );
}
```

### Vite Integration

```tsx
// main.tsx
import "@abdullah-altun/react-animation-library/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@abdullah-altun/react-animation-library/styles" as animations;`,
      },
    },
  },
});
```

## 🎮 Real-World Usage Examples

### E-commerce Product Cards

```tsx
function ProductCard({ product }: { product: Product }) {
  return (
    <InteractiveAnimate
      hoverConfig={{
        type: "scale",
        scale: { start: 1, end: 1.02 },
        duration: 0.3,
      }}
      className="product-card"
    >
      <ModernAnimate
        config={{
          type: "fade",
          duration: 0.6,
          trigger: "visible",
        }}
      >
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p>${product.price}</p>
      </ModernAnimate>
    </InteractiveAnimate>
  );
}
```

### Navigation Menu

```tsx
function NavigationMenu({ isOpen }: { isOpen: boolean }) {
  return (
    <ModernAnimate
      config={{
        type: ["fade", "slide"],
        axis: "x",
        distance: 20,
        duration: 0.3,
        trigger: "mount",
      }}
    >
      <nav className={`menu ${isOpen ? "open" : "closed"}`}>
        <StaggeredAnimate
          animation={{
            type: "slide",
            axis: "x",
            distance: 15,
            duration: 0.2,
          }}
          stagger={{ delay: 0.05 }}
        >
          <a href="/home">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </StaggeredAnimate>
      </nav>
    </ModernAnimate>
  );
}
```

### Loading States

```tsx
function LoadingSpinner() {
  return (
    <ModernAnimate
      config={{
        type: "rotate",
        degrees: { start: 0, end: 360 },
        duration: 1,
        iterationCount: "infinite",
        easing: "linear",
      }}
    >
      <div className="spinner" />
    </ModernAnimate>
  );
}

function SkeletonLoader() {
  return (
    <StaggeredAnimate
      animation={{
        type: "fade",
        duration: 1,
        iterationCount: "infinite",
        direction: "alternate",
      }}
      stagger={{ delay: 0.2 }}
    >
      <div className="skeleton-line" />
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
    </StaggeredAnimate>
  );
}
```

## 🔧 Advanced Configuration

### Custom SCSS Integration

```scss
// styles/animations.scss
@use "@abdullah-altun/react-animation-library/styles" with (
  $animation-duration-base: 0.3s,
  $animation-easing-default: cubic-bezier(0.4, 0, 0.2, 1),
  $reduced-motion-duration: 0.1s
);

// Add custom animations
.my-custom-animation {
  @include animations.slide-in("right", 30px, 0.5s);

  &[data-animation-state="completed"] {
    transform: translateX(10px); // Custom end state
  }
}
```

### Runtime Configuration

```tsx
// Global animation config
import { setGlobalAnimationConfig } from "@abdullah-altun/react-animation-library";

setGlobalAnimationConfig({
  respectReducedMotion: true,
  defaultDuration: 0.4,
  defaultEasing: "cubic-bezier(0.4, 0, 0.2, 1)",
});
```

### Performance Monitoring

```tsx
function PerformanceAwareAnimation() {
  const config = useMemo(
    () => ({
      type: "slide" as const,
      duration: 0.6,
      onStart: () => console.time("animation"),
      onComplete: () => console.timeEnd("animation"),
    }),
    []
  );

  return (
    <ModernAnimate config={config}>
      <ExpensiveComponent />
    </ModernAnimate>
  );
}
```

## 🐛 Troubleshooting

### Common Issues

**Animations not triggering:**

```tsx
// ✅ Ensure proper trigger configuration
<ModernAnimate
  config={{
    type: 'fade',
    trigger: 'visible', // or 'mount' for immediate
    duration: 0.6
  }}
>
```

**Performance issues:**

```tsx
// ✅ Use transform-based animations
<ModernAnimate config={{ type: 'slide' }}> // Uses transform
// ❌ Avoid layout-triggering properties
<div style={{ left: '100px' }}> // Triggers layout
```

**TypeScript errors:**

```bash
# Ensure peer dependencies are installed
npm install react@>=19.0.0 react-dom@>=19.0.0 sass@>=1.0.0
```

### Debug Mode

```tsx
// Enable debug mode for development
<ModernAnimate
  config={{
    type: 'fade',
    duration: 0.6,
    onStart: () => console.log('Animation started'),
    onComplete: () => console.log('Animation completed')
  }}
>
```

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## 📊 Bundle Analysis

```bash
# Analyze bundle size and tree-shaking
npm run build:analyze

# Check package size
npm run size
```

---

**Built with ❤️ for modern React applications**

1.  **Install the library:**

    ```bash
    npm install @abdullah-altun/react-animation-library
    # or
    yarn add @abdullah-altun/react-animation-library
    ```

2.  **Import Styles (Recommended: Compiled CSS):**
    In your project's global CSS file (e.g., `src/app/globals.css` for Next.js):

    ```css
    /* src/app/globals.css */
    @import "@abdullah-altun/react-animation-library/dist/styles.css";
    ```

    Ensure this global CSS file is imported in your root layout/app component.

3.  **Use in your Client Component:**
    Wrap the element you want to animate with the `<Animate>` component.

    ```tsx
    "use client"; // Necessary if this component isn't already client-side

    import { Animate } from "@abdullah-altun/react-animation-library";
    // Ensure styles are imported globally as shown in Step 2

    function MyAnimatedPage() {
      return (
        <div>
          <Animate type="fade" duration={0.8}>
            <h2>Fade In Title</h2>
          </Animate>

          <Animate type="slide" distance={-100} axis="x" delay={0.2}>
            <p>Slides in from the left.</p>
          </Animate>
        </div>
      );
    }
    ```

## Usage Details

### 1. Importing Styles

**Method 1: Importing Compiled CSS (Recommended & Most Compatible)**

This is the best approach for all projects, especially if you're using plain CSS for global styles (e.g., `globals.css` in Next.js) or have an older Sass setup.

1.  In your project's global CSS file (e.g., `src/app/globals.css` for Next.js App Router):

    ```css
    /* src/app/globals.css */
    @import "@abdullah-altun/react-animation-library/dist/styles.css";

    /* Your other global styles */
    ```

2.  Ensure this global CSS file is imported in your root layout or app component (e.g., `src/app/layout.tsx` or `src/pages/_app.tsx` in Next.js).

    ```tsx
    // src/app/layout.tsx (Next.js App Router)
    import "./globals.css"; // Or your global CSS file name

    export default function RootLayout({ children }) {
      /* ... */
    }
    ```

    _With this method, animation behavior is controlled by props on the React components, which set CSS Custom Properties. SCSS variable customization is not applicable here._

**Method 2: For Modern SCSS Users (Using `@use`)**

If your project uses a modern Sass compiler that supports the `@use` rule (Dart Sass 1.23+), you can integrate the library's SCSS source for more direct SCSS variable configuration. This method will _not_ produce `@import` deprecation warnings.

1.  Ensure you have a compatible `sass` version installed in your project:
    ```bash
    npm install sass
    # or
    yarn add sass
    ```
2.  In your main global SCSS file (e.g., `src/app/globals.scss`):

    ```scss
    /* src/app/globals.scss */

    // Configure SCSS variables using the `with` keyword:
    @use "@abdullah-altun/react-animation-library/styles" with (
      $animation-duration: 0.7s,
      // SCSS fallback for animation duration
      $default-slide-distance: 80px,
      // SCSS fallback for slide distance
      // ... other configurable variables from the library's _variables.scss
    );

    // If no SCSS variable configuration is needed, simply:
    // @use "@abdullah-altun/react-animation-library/styles";

    /* Your other global styles */
    ```

3.  Ensure this global SCSS file is imported in your root layout or app component.
    _Note: Attempting to use the older `@import "@abdullah-altun/react-animation-library/styles/main.scss";` on the library's SCSS source may not work as expected with modern Sass compilers, as the library now uses `@forward` and `@use` internally. The pre-compiled CSS or the `@use` rule are the supported methods for integrating styles._

### 2. Using the `<Animate>` Component

The `<Animate>` component is the easiest way to apply animations. Remember to use it within a Client Component (e.g., marked with `"use client";` in Next.js App Router).

The `<Animate>` component wraps its children in an element (default `div`, configurable with `as` prop) and applies an `animated` CSS class to this wrapper, along with specific animation classes (e.g., `animate-fade`, `animate-slide-x-positive`).

```tsx
"use client";

import { Animate } from "@abdullah-altun/react-animation-library";

function MyComponent() {
  return (
    <div>
      <Animate type="fade" duration={0.8}>
        <h2>Fade In Title</h2>
      </Animate>

      <Animate type="slide" distance={-100} axis="x" delay={0.2}>
        <p>Slides in from the left (distance is negative).</p>
      </Animate>

      <Animate type="slide" distance={75} axis="y" delay={0.4}>
        <p>Slides down from above (distance is positive, axis y).</p>
      </Animate>

      <Animate type="bounce" distance={25} easing="ease-in-out">
        <button>Bounce Me Up (distance positive)</button>
      </Animate>

      <Animate type="scale" scale={0.5} duration={0.4}>
        <span>Scale In (starts at 50% size)</span>
      </Animate>

      <Animate type="rotate" degrees={-90} delay={0.5}>
        <div>Rotate -90 degrees (Counter-Clockwise)</div>
      </Animate>

      <Animate type="rotate" degrees={{ start: 45, end: 225 }} duration={1}>
        <div>Rotate from 45 to 225 degrees</div>
      </Animate>
    </div>
  );
}
```

**Important**: The `<Animate>` component's `children` prop must be a single React element that can accept a `ref` (like standard HTML elements `div`, `p`, `button`, or components using `React.forwardRef`). The animation styles are applied to a wrapper element generated by `<Animate>`.

### 3. (_Advanced_) Using the `useAnimation` Hook

For more direct control, or if you want to apply animations to an element without an extra wrapper from `<Animate>`, use the `useAnimation` hook.

```tsx
"use client";

import {
  useAnimation,
  AnimationConfig,
} from "@abdullah-altun/react-animation-library";
// Ensure styles are imported globally

function MyAdvancedComponent() {
  const slideConfig: AnimationConfig = {
    type: "slide",
    distance: 150,
    axis: "x",
    duration: 0.7,
    easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  };

  const {
    ref: slideRef,
    key: slideKey,
    replay: replaySlide,
  } = useAnimation<HTMLDivElement>(slideConfig);

  return (
    <div>
      <div
        ref={slideRef}
        key={slideKey}
        style={{
          padding: "20px",
          background: "lightcoral",
          marginBottom: "10px",
        }}
      >
        Animated with Hook (Slide)!
      </div>
      <button onClick={replaySlide}>Replay Slide</button>
    </div>
  );
}
```

## Available Animations & Control

Animations are primarily controlled by the `type` prop and other specific props that define magnitude and direction. CSS Custom Properties are set by the JavaScript to control the keyframe animations defined in SCSS.

- **`fade`**:

  - Controls opacity from a start to an end value.
  - Props: `opacity: { start?: number, end?: number }` (defaults to `{ start: 0, end: 1 }`).

- **`slide`**:

  - Slides an element along the X or Y axis.
  - Props:
    - `distance: number`: Magnitude of movement in pixels.
    - `axis: "x" | "y"`: Axis of movement (defaults to `"x"`).
    - Direction:
      - For `axis: "x"`: Positive `distance` = slides in from right, Negative `distance` = slides in from left.
      - For `axis: "y"`: Positive `distance` = slides in from bottom, Negative `distance` = slides in from top.

- **`scale`**:

  - Scales an element from a starting size to its normal size (1).
  - Props: `scale: number` (e.g., `0.5` starts at 50% size, defaults to `0.8`).

- **`rotate`**:

  - Rotates an element.
  - Props: `degrees: number | { start?: number, end: number }`.
    - If `number` (e.g., `90`): Rotates from `0deg` to `90deg`. Positive = clockwise, Negative = counter-clockwise.
    - If `object` (e.g., `{ start: -45, end: 45 }`): Rotates from `start` to `end` degrees.

- **`bounce`**:
  - Creates a bouncing effect.
  - Props: `distance: number`. Positive `distance` = main bounce upwards, Negative `distance` = main bounce downwards.

## Component API (`<Animate>`)

| Prop                  | Type                                                      | Default      | Description                                                                                                                            |
| --------------------- | --------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                | `'fade' \| 'slide' \| 'scale' \| 'rotate' \| 'bounce'`    | **Required** | The type of animation to apply.                                                                                                        |
| `children`            | `ReactNode`                                               | **Required** | A single React element child to be animated. Must be able to accept a `ref`.                                                           |
| `as`                  | `keyof JSX.IntrinsicElements \| React.ComponentType<any>` | `'div'`      | The HTML tag or React component to render as the wrapper element.                                                                      |
| `duration`            | `number`                                                  | `0.5`        | Animation duration in seconds.                                                                                                         |
| `delay`               | `number`                                                  | `0`          | Delay before the animation starts in seconds.                                                                                          |
| `easing`              | `string`                                                  | `'ease-out'` | CSS animation timing function (e.g., `'linear'`, `'ease-in'`, `'cubic-bezier(...)'`).                                                  |
| `distance`            | `number`                                                  | `50`         | Magnitude (px) for slide and bounce. Sign influences direction.                                                                        |
| `degrees`             | `number \| { start?: number, end: number }`               | `360`        | Degrees for rotate. Number is end rotation (from 0 or `degreesStart`). Object for `start`/`end`. Sign/difference influences direction. |
| `scale`               | `number`                                                  | `0.8`        | Starting scale factor for scale animations (e.g., `0.5` means start at 50%).                                                           |
| `opacity`             | `{ start?: number, end?: number }`                        | (internal)   | Start/end opacity (0-1). Default: `{ start: 0, end: 1 }`.                                                                              |
| `axis`                | `'x' \| 'y'`                                              | `'x'`        | Axis for slide animations.                                                                                                             |
| `className`           | `string`                                                  | `''`         | Additional CSS classes for the wrapper. The component adds an `animated` class.                                                        |
| `onAnimationComplete` | `() => void`                                              | `undefined`  | Callback when animation finishes. For event object, use `onAnimationEnd`.                                                              |
| `...props`            | `HTMLAttributes<HTMLDivElement>`                          | -            | Other HTML attributes (e.g., `style`, `id`, `onClick`, `onAnimationEnd`) for the wrapper.                                              |

## Hook API (`useAnimation`)

```typescript
function useAnimation<T extends HTMLElement>(
  config: AnimationConfig,
  onAnimationComplete?: (event: Event) => void
): {
  ref: React.RefObject<T | null>;
  key: number;
  replay: () => void;
};

// AnimationConfig type:
// {
//   type: AnimationType;
//   duration?: number;
//   delay?: number;
//   easing?: string;
//   distance?: number;
//   degrees?: number | { start?: number; end: number };
//   scale?: number;
//   opacity?: { start?: number; end?: number };
//   axis?: SlideAxis;
// }
```

## Customization via SCSS (for SCSS Users)

If you are using Method 2 for importing styles (via `@use "@abdullah-altun/react-animation-library/styles"`), you can configure the default SCSS fallback variables. These fallbacks are used by the keyframes if the CSS Custom Properties (set by the React component/hook) are somehow not applied.

```scss
// src/app/globals.scss

// Configure SCSS variables using the `with` keyword:
@use "@abdullah-altun/react-animation-library/styles" with (
  $animation-duration: 0.8s,
  // Default fallback duration
  $animation-delay: 0.1s,
  // Default fallback delay
  $animation-easing: ease-in-out,
  // Default fallback easing
  $default-slide-distance: 100px,
  // Fallback for --distance in slide
  // ... see styles/_variables.scss in the library for all configurable variables
);
```

**Note:** Runtime animation parameters (duration, delay, distance, etc.) set via props on the `<Animate>` component or `useAnimation` hook will always take precedence by setting CSS Custom Properties. The SCSS variables primarily act as compile-time defaults for the keyframes themselves.

### Accessibility

The library includes styles that respect the `prefers-reduced-motion` media query, significantly reducing or disabling animations for users who have enabled this preference in their system settings. This is handled by the `@include acc.respect-motion-preferences;` mixin (from `styles/_accessibility.scss`) within the library's styles.

### Browser Support

This library relies on standard CSS Animations and Custom Properties, supported by all modern browsers:

- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15+
- Opera 36+

## Maintenance Guide (For Future Developers)

This guide helps new developers understand, maintain, and extend the library.

### 1. Project Structure

```
animation-library/
├── dist/                   # Build output (JS, MJS, DTS, compiled CSS)
├── src/
│   ├── components/
│   │   ├── Animate.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useAnimation.ts
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   └── index.ts            # Main library export
├── styles/                 # SCSS source files (using @use, @forward)
│   ├── _accessibility.scss
│   ├── _animations.scss
│   ├── _keyframes.scss
│   ├── _variables.scss
│   └── main.scss           # Main SCSS entry point for SCSS users
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── README.md
```

### 2. Build Process

- The library is built using `tsup` (configured in `tsup.config.ts`) for TypeScript/JavaScript and `sass` CLI for SCSS.
- Command: `npm run build` (or `yarn build`).
  - This transpiles TypeScript from `src/` to JavaScript (CJS and ESM) and generates type definitions (`.d.ts`) into `dist/`.
  - It also compiles `styles/main.scss` to `dist/styles.css`.
- The `prepublishOnly` script ensures a clean build before publishing.

### 3. How Animations Work

- **`useAnimation` Hook:** Sets CSS Custom Properties (e.g., `--animation-duration`) and applies CSS classes (e.g., `animate-fade`) to the target element.
- **`<Animate>` Component:** A wrapper around `useAnimation` for declarative use.
- **SCSS (`styles/`):**
  - Uses Sass Modules (`@use`, `@forward`).
  - `_variables.scss`: Defines configurable SCSS variables with `!default`.
  - `_keyframes.scss`: Defines `@keyframes` using CSS Custom Properties with SCSS variable fallbacks (e.g., `var(--distance, #{$default-slide-distance})`).
  - `_animations.scss`: Defines animation utility classes that apply keyframes and base properties.
  - `main.scss`: The entry point for SCSS consumers, using `@forward` and `@use`.
- **Compiled CSS (`dist/styles.css`):** The output of `styles/main.scss`, usable by any project.

### 4. Adding a New Animation

1.  **Type (`src/types/index.ts`):** Add to `AnimationType`.
2.  **Hook (`src/hooks/useAnimation.ts`):** Handle new type for class generation and any specific CSS Custom Properties.
3.  **Keyframes (`styles/_keyframes.scss`):** Define new `@keyframes`.
4.  **Animation Class (`styles/_animations.scss`):** Add new `.animate-...` class.
5.  **Variables (`styles/_variables.scss`):** Add any new SCSS fallback variables if needed.
6.  **Documentation:** Update README API sections.
7.  Rebuild (`npm run build`).

### 5. Updating Dependencies

- Regularly update using `npm update` or `yarn upgrade`.
- Test thoroughly after updates.

### 6. Common Pitfalls & Debugging

- **Styles Not Applying:** Ensure `dist/styles.css` (or SCSS via `@use`) is correctly imported globally.
- **Client Component Requirement:** `<Animate>` and `useAnimation` must be used in React Client Components.
- **Inspect CSS Custom Properties:** Use browser dev tools to check if CSS Custom Properties are correctly set on the animated element.

## Live Demo

<!-- Consider adding a link to a CodeSandbox or StackBlitz demo -->

[Link to Live Demo - Placeholder]

## Contributing

Contributions are welcome! Please feel free to submit issues or Pull Requests.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/your-feature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/your-feature`).
5.  Open a Pull Request.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## Author

Abdullah Altun
