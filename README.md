# Animation Library - Abdullah Altun

[![npm version](https://img.shields.io/npm/v/animation-library-test-abdullah-altun.svg)](https://www.npmjs.com/package/animation-library-test-abdullah-altun)
[![license](https://img.shields.io/npm/l/animation-library-test-abdullah-altun.svg)](https://github.com/abdullahaltun70/animation-library-test-abdullah-altun/blob/main/LICENSE) <!-- Update URL if needed -->

A lightweight, performant, and customizable animation library for React applications, powered by SCSS and CSS Custom Properties. Easily add entrance animations to your components.

## Features

- **React Component & Hook:** Use the simple `<Animate>` component or the flexible `useAnimation` hook.
- **Modern SCSS Powered:** Leverages Sass modules (`@use`, `@forward`) for defining animations. CSS Custom Properties allow runtime adjustments via React props.
- **Dynamic & Directional:** Animations like `slide`, `rotate`, and `bounce` respect direction based on prop values (`distance`, `degrees`, `axis`).
- **Customizable:** Override default timings, easings, distances, etc., via component props (primary control) or SCSS variable configuration (for SCSS users).
- **Performant:** Uses hardware-accelerated CSS properties (`transform`, `opacity`).
- **Accessible:** Automatically respects `prefers-reduced-motion`.
- **TypeScript:** Fully typed for a better developer experience.
- **Pre-compiled CSS:** Ships with a compiled CSS file for easy integration into any project.

## Quick Start

1.  **Install the library:**

    ```bash
    npm install animation-library-test-abdullah-altun
    # or
    yarn add animation-library-test-abdullah-altun
    ```

2.  **Import Styles (Recommended: Compiled CSS):**
    In your project's global CSS file (e.g., `src/app/globals.css` for Next.js):

    ```css
    /* src/app/globals.css */
    @import "animation-library-test-abdullah-altun/dist/styles.css";
    ```

    Ensure this global CSS file is imported in your root layout/app component.

3.  **Use in your Client Component:**
    Wrap the element you want to animate with the `<Animate>` component.

    ```tsx
    "use client"; // Necessary if this component isn't already client-side

    import { Animate } from "animation-library-test-abdullah-altun";
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
    @import "animation-library-test-abdullah-altun/dist/styles.css";

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
    @use "animation-library-test-abdullah-altun/styles" with (
      $animation-duration: 0.7s,
      // SCSS fallback for animation duration
      $default-slide-distance: 80px,
      // SCSS fallback for slide distance
      // ... other configurable variables from the library's _variables.scss
    );

    // If no SCSS variable configuration is needed, simply:
    // @use "animation-library-test-abdullah-altun/styles";

    /* Your other global styles */
    ```

3.  Ensure this global SCSS file is imported in your root layout or app component.
    _Note: Attempting to use the older `@import "animation-library-test-abdullah-altun/styles/main.scss";` on the library's SCSS source may not work as expected with modern Sass compilers, as the library now uses `@forward` and `@use` internally. The pre-compiled CSS or the `@use` rule are the supported methods for integrating styles._

### 2. Using the `<Animate>` Component

The `<Animate>` component is the easiest way to apply animations. Remember to use it within a Client Component (e.g., marked with `"use client";` in Next.js App Router).

The `<Animate>` component wraps its children in an element (default `div`, configurable with `as` prop) and applies an `animated` CSS class to this wrapper, along with specific animation classes (e.g., `animate-fade`, `animate-slide-x-positive`).

```tsx
"use client";

import { Animate } from "animation-library-test-abdullah-altun";

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
} from "animation-library-test-abdullah-altun";
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

If you are using Method 2 for importing styles (via `@use "animation-library-test-abdullah-altun/styles"`), you can configure the default SCSS fallback variables. These fallbacks are used by the keyframes if the CSS Custom Properties (set by the React component/hook) are somehow not applied.

```scss
// src/app/globals.scss

// Configure SCSS variables using the `with` keyword:
@use "animation-library-test-abdullah-altun/styles" with (
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