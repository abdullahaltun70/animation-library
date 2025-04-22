# Animation Library - Abdullah Altun

[![npm version](https://img.shields.io/npm/v/animation-library-test-abdullah-altun.svg)](https://www.npmjs.com/package/animation-library-test-abdullah-altun)
[![license](https://img.shields.io/npm/l/animation-library-test-abdullah-altun.svg)](https://github.com/abdullahaltun70/animation-library-test-abdullah-altun/blob/main/LICENSE) <!-- Update URL if needed -->

A lightweight, performant, and customizable animation library for React applications, powered by SCSS and CSS Custom Properties. Easily add entrance animations to your components.

## Features

- **React Component & Hook:** Use the simple `<Animate>` component or the flexible `useAnimation` hook.
- **SCSS Powered:** Leverages SCSS for defining animations and variables. CSS Custom Properties allow runtime adjustments via React props.
- **Dynamic & Directional:** Animations like `slide`, `rotate`, and `bounce` respect direction based on prop values (`distance`, `degrees`).
- **Customizable:** Override default timings, easings, distances, etc., via SCSS variables or component props.
- **Performant:** Uses hardware-accelerated CSS properties (`transform`, `opacity`).
- **Accessible:** Automatically respects `prefers-reduced-motion`.
- **TypeScript:** Fully typed for a better developer experience.
- **Tree-Shakable:** Modular SCSS allows importing only needed styles (though global import is easiest).

## Installation

```bash
npm install animation-library-test-abdullah-altun
# or
yarn add animation-library-test-abdullah-altun
```

## Usage

1. Import Global Styles:
   Import the library's main stylesheet into your global CSS/SCSS file (e.g., globals.scss, index.css, or directly in your root layout/app file).

```scss
// In styles/globals.scss or similar
@import "animation-library-test-abdullah-altun/styles/main.scss";
```

2. Use the <Animate> Component (Client Components Only):
   Wrap the element you want to animate with the <Animate> component. Make sure the component where you use <Animate> is marked as a Client Component ('use client';) if using frameworks like Next.js App Router.

```tsx
"use client"; // Necessary if this component isn't already client-side

import { Animate } from "animation-library-test-abdullah-altun";
// Ensure styles are imported globally as shown in Step 1

function MyComponent() {
  return (
    <div>
      <Animate type="fade" duration={0.8}>
        <h2>Fade In Title</h2>
      </Animate>

      <Animate type="slide" distance={-100} delay={0.2}>
        <p>Slides in from the left.</p>
      </Animate>

      <Animate type="bounce" distance={25} easing="ease-in-out">
        <button>Bounce Me Up</button>
      </Animate>

      <Animate type="scale" scale={0.5} duration={0.4}>
        <span>Scale In</span>
      </Animate>

      <Animate type="rotate" degrees={-90} delay={0.5}>
        <div>Rotate Counter-Clockwise</div>
      </Animate>
    </div>
  );
}
```

**Important**: The `<Animate>` component clones its direct child to apply the necessary `ref` and `key`. Ensure the direct child is a single React element that can accept a ref (like standard HTML elements `div`, `p`, `button`, or components using `React.forwardRef`).

3. (_Advanced_) Use the useAnimation Hook (Client Components Only):

_For more control, use the hook directly._

```tsx
"use client";

import {
  useAnimation,
  AnimationConfig,
} from "animation-library-test-abdullah-altun";
// Ensure styles are imported globally as shown in Step 1

function MyAdvancedComponent() {
  const config: AnimationConfig = {
    type: "slide",
    distance: 150,
    duration: 0.7,
    easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)", // Example custom easing
  };

  const { ref, key, replay } = useAnimation<HTMLDivElement>(config);

  return (
    <div>
      <div
        ref={ref}
        key={key}
        style={{ padding: "20px", background: "lightcoral" }}
      >
        Animated with Hook!
      </div>
      <button onClick={replay} style={{ marginTop: "10px" }}>
        Replay Slide
      </button>
    </div>
  );
}
```

## Available Animations & Control

The library applies animations based on the `type` prop. Directionality and other parameters are controlled via specific props:

- `fade`: Controlled by `opacity: { start, end }`.
- `slide`: Direction controlled by the sign of distance (positive = right/down - currently defaults to X-axis, negative = left/up). Magnitude controlled by `distance` (in pixels).
- `scale`: Starting scale controlled by `scale`.
  rotate: Direction controlled by the sign of `degrees` (positive = clockwise, negative = counter-clockwise). Magnitude controlled by `degrees`.
- `bounce`: Direction controlled by the sign of `distance` (positive = up, negative = down). Height controlled by `distance` (in pixels).

## Component API (_`<Animate>`_)

| Prop                | Type                                                    | Default    | Description                                                                                        |
| ------------------- | ------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------- |
| type                | 'fade' \| 'slide' \| 'scale' \| 'rotate' \| 'bounce'    | Required   | The type of animation to apply.                                                                    |
| children            | React.ReactElement                                      | Required   | A single React element child to be animated. Must accept a ref.                                    |
| as                  | keyof JSX.IntrinsicElements \| React.ComponentType<any> | 'div'      | The HTML tag or React component to render as the wrapper element.                                  |
| duration            | number                                                  | 0.5        | Animation duration in seconds.                                                                     |
| delay               | number                                                  | 0          | Delay before the animation starts in seconds.                                                      |
| easing              | string                                                  | 'ease-out' | CSS animation timing function (e.g., 'linear', 'ease-in', 'cubic-bezier(...)').                    |
| distance            | number                                                  | 50         | Magnitude (px) and direction (sign) for slide and bounce animations.                               |
| degrees             | number                                                  | 360        | Magnitude (deg) and direction (sign) for rotate animations.                                        |
| scale               | number                                                  | 0.8        | Starting scale factor for scale animations (e.g., 0.5 means start at 50%).                         |
| opacity             | { start?: number, end?: number }                        | {}         | Starting and ending opacity (0 to 1) for fade animations. Defaults to { start: 0, end: 1 }.        |
| className           | string                                                  | ''         | Additional CSS classes to apply to the wrapper element.                                            |
| onAnimationComplete | () => void                                              | undefined  | Callback function triggered when the animation finishes.                                           |
| ...props            | HTMLAttributes<HTMLDivElement>                          | -          | Any other standard HTML attributes (like style, id, onClick, etc.) applied to the wrapper element. |

## Customization via SCSS

You can override the default animation parameters by defining SCSS variables before importing the library's `main.scss`.

```scss
// src/styles/globals.scss

// --- Custom Variables (Define BEFORE importing) ---
$animation-duration: 0.8s; // Default duration for all animations
$animation-delay: 0.1s; // Default delay
$animation-easing: cubic-bezier(0.25, 0.1, 0.25, 1); // Default easing

// Example: Customize specific defaults
$default-slide-distance: 100px;
$default-bounce-height: 40px;
$default-fade-opacity-start: 0.1;

// --- Import the Library ---
@import "animation-library-test-abdullah-altun/styles/main.scss";

// --- Your Other Global Styles ---
```

`Key Variables:`

- $animation-duration: Default duration (e.g., 0.5s).
- $animation-delay: Default delay (e.g., 0s).
- $animation-easing: Default timing function (e.g., ease-out).
- $default-opacity-start: Default start opacity for fade (e.g., 0).
- $default-opacity-end: Default end opacity for fade (e.g., 1).
- $default-scale-start: Default start scale factor (e.g., 0.8).
- $default-slide-distance: Default distance for slide (magnitude, e.g., - 50px).
- $default-rotate-degrees: Default degrees for rotate (magnitude, e.g., - 360deg).
- $default-bounce-height: Default height for bounce (magnitude, e.g., 30px).

### Accessibility

The library includes styles that respect the prefers-reduced-motion media query, significantly reducing or disabling animations for users who have enabled this preference in their system settings.

### Browser Support

This library relies on standard CSS Animations and Custom Properties, supported by all modern browsers:

- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15+
- Opera 36+

### Contributing

Contributions are welcome! Please feel free to submit issues or Pull Requests.

1. Fork the repository.
2. Create your feature branch (git checkout -b feature/your-feature).
3. Commit your changes (git commit -m 'Add some feature').
4. Push to the branch (git push origin feature/your-feature).
5. Open a Pull Request.

### License

This project is licensed under the MIT License - see the LICENSE file for details. <!-- Ensure you have a LICENSE file -->

### Author

Abdullah Altun
