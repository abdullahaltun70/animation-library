# SCSS Animation Library

A lightweight, customizable animation library that provides ready-to-use CSS animations for your web projects.

[![npm version](https://img.shields.io/npm/v/animation-library-test-abdullah-altun.svg)](https://www.npmjs.com/package/animation-library-test-abdullah-altun)
[![license](https://img.shields.io/npm/l/animation-library-test-abdullah-altun.svg)](https://github.com/yourusername/animation-library/blob/master/LICENSE)

## Features

- Collection of smooth, performant animations
- Fully customizable via SCSS variables
- Modular architecture - import only what you need
- Compatible with any modern frontend framework
- Written in SCSS for maximum flexibility

## Installation

```bash
npm install animation-library-test-abdullah-altun
```

or

```bash
yarn add animation-library-test-abdullah-altun
```

## Usage

### Basic Usage

Import the entire library in your main SCSS file:

```scss
// In your main.scss or globals.scss
@import 'animation-library-test-abdullah-altun/styles/globals';

// Optional: Configure which animation types to use
$use-fade: true;
$use-slide: true;
$use-bounce: true;
```

Then apply the animation classes in your HTML/JSX:

```html
<div class="fade-in">This content will fade in</div>
<div class="slide-in-left">This content will slide in from left</div>
<div class="bounce-in">This content will bounce in</div>
```

### Selective Imports

For optimal bundle size, import only the animations you need:

```scss
// Import base requirements
@import 'animation-library-test-abdullah-altun/styles/_variables';
@import 'animation-library-test-abdullah-altun/styles/keyframes/_all';
@import 'animation-library-test-abdullah-altun/styles/mixins/_all';

// Import only specific animation modules
@import 'animation-library-test-abdullah-altun/styles/animations/_fade';
@import 'animation-library-test-abdullah-altun/styles/animations/_slide';
```

### Using with Next.js

In your Next.js project:

```tsx
// app/layout.tsx or pages/_app.tsx
import './globals.scss'; // Where you've imported the animation library
```

```scss
// app/globals.scss or styles/globals.scss
@import 'animation-library-test-abdullah-altun/styles/globals';

// Optional configuration
$use-fade: true;
$use-slide: true;
$animation-duration: 0.5s;
```

## Available Animations

The library includes several animation categories:

### Fade Animations
- `fade-in`
- `fade-out`
- `fade-in-up`
- `fade-in-down`
- `fade-in-left`
- `fade-in-right`

### Slide Animations
- `slide-in-up`
- `slide-in-down`
- `slide-in-left`
- `slide-in-right`
- `slide-out-up`
- `slide-out-down`
- `slide-out-left`
- `slide-out-right`

### Bounce Animations
- `bounce-in`
- `bounce-out`
- `bounce-in-up`
- `bounce-in-down`
- `bounce-in-left`
- `bounce-in-right`

## Customization

You can customize the animations by setting css variables:

```scss
// Animation durations
$animation-duration: 0.5s;
$animation-delay: 0s;

// Animation timing functions
$animation-timing: ease-out;

// Distances (for slide/translate animations)
$animation-distance-small: 10px;
$animation-distance-medium: 30px;
$animation-distance-large: 60px;

// Enable/disable specific animation types
$use-fade: true;
$use-slide: true;
$use-bounce: true;

// Now import the library
@import 'animation-library-test-abdullah-altun/styles/globals';
```

## Using with JavaScript Frameworks

### React/Next.js

```jsx
import 'animation-library-test-abdullah-altun/styles/globals';

function MyComponent() {
  return (
    <div className="fade-in">
      This will animate on mount
    </div>
  );
}
```

### Vue.js

```vue
<template>
  <div class="slide-in-up">
    This will slide in from bottom
  </div>
</template>

<style lang="scss">
@import 'animation-library-test-abdullah-altun/styles/globals';
</style>
```

## Using with SCSS

If you prefer to use with animation:

```scss

.my-element {
  animation: slideInFromLeft 1s ease-in 0s forwards;
}

.another-element {
  animation: scaleIn 0.8s 0s forwards;
}
```

Or if you prefer to use the animations through mixins:

```scss
@import 'animation-library-test-abdullah-altun/styles/mixins/_all';

.my-element {
  @include fade-in(0.8s, ease-in-out, 0.2s);
}

.another-element {
  @include slide-in-left(0.5s);
}
```

## Browser Support

This library uses standard CSS animations and transformations, supported by all modern browsers:

- Chrome 43+
- Firefox 16+
- Safari 9+
- Edge 12+
- Opera 30+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Abdullah Altun

## Acknowledgments

- Inspired by Animate.css and other animation libraries


---

Build with ❤️ for the web animation community 