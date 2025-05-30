# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-05-30

### Added

- **Core Animation Components**: `Animate`, `ModernAnimate`, `InteractiveAnimate`
- **Advanced Components**: `SequenceAnimate`, `StaggeredAnimate`, `StateBasedAnimate`, `RadixAnimate`
- **Animation Types**: fade, slide, scale, rotate, bounce with full directional control
- **Multiple Animation Support**: Arrays of animation types for complex effects
- **State-Based Animations**: CSS-only animations that respond to parent component states
- **Interactive Micro-Animations**: Hover, focus, and click animations
- **Accessibility**: Automatic `prefers-reduced-motion` support
- **TypeScript**: Full type definitions and IntelliSense support
- **SCSS Integration**: Configurable variables and modular architecture
- **Server-Side Rendering**: Compatible with Next.js App Router and other SSR frameworks

### Technical Details

- Built with modern CSS Custom Properties and hardware-accelerated transforms
- Modular SCSS architecture with `@use` and `@forward`
- Zero runtime dependencies (peer dependencies: React 18+)
- Comprehensive TypeScript definitions
- Optimized bundle size (~270KB total, ~22KB compressed CSS)

### Browser Support

- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15+
- Opera 36+
