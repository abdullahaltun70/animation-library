# State-Based Animation Components

This document explains how to use the new state-based animation components that automatically respond to parent component states (like Radix UI's `data-state` attributes) without requiring manual state management.

## Overview

The state-based animation system provides two main components:

- **`RadixAnimate`** - Optimized specifically for Radix UI components
- **`StateBasedAnimate`** - General-purpose component for any library that uses state attributes

Both components automatically detect parent component states and apply CSS animations accordingly, making them perfect for server components and reducing boilerplate code.

## RadixAnimate Component

### Import

```tsx
import { RadixAnimate } from "@abdullah-altun/react-animation-library";
import "@abdullah-altun/react-animation-library/styles";
```

### Basic Usage - Rotating Chevron

This is exactly what you wanted! No more manual state management for rotating chevrons:

```tsx
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { RadixAnimate } from "@abdullah-altun/react-animation-library";

function Accordion({ title, body, value }) {
  return (
    <AccordionPrimitive.Item value={value}>
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger className="accordion-trigger">
          <Text as="span" size="md" weight="600">
            {title}
          </Text>
          {/* 🎯 This automatically rotates when accordion opens! */}
          <RadixAnimate animationType="rotate" degrees={180} duration={300}>
            <ChevronDownIcon />
          </RadixAnimate>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      {/* Content with automatic slide animation */}
      <RadixAnimate animationType="accordion-content" duration={300}>
        <AccordionPrimitive.Content>
          <div>{body}</div>
        </AccordionPrimitive.Content>
      </RadixAnimate>
    </AccordionPrimitive.Item>
  );
}
```

### Animation Types

#### 1. `rotate` - Perfect for chevrons, arrows, and toggles

```tsx
<RadixAnimate animationType="rotate" degrees={180}>
  <ChevronDownIcon />
</RadixAnimate>

<RadixAnimate animationType="rotate" degrees={90}>
  <ArrowIcon />
</RadixAnimate>
```

#### 2. `accordion-content` - Optimized for Radix Accordion content

```tsx
<RadixAnimate animationType="accordion-content" duration={300}>
  <AccordionPrimitive.Content>
    <div>Your content here</div>
  </AccordionPrimitive.Content>
</RadixAnimate>
```

#### 3. `fade` - Smooth opacity transitions

```tsx
<RadixAnimate animationType="fade" duration={200}>
  <div>This content fades in/out</div>
</RadixAnimate>
```

#### 4. `scale` - Scale animations for modals, dropdowns

```tsx
<RadixAnimate animationType="scale" scale={1.05}>
  <DropdownContent>Menu items</DropdownContent>
</RadixAnimate>
```

### Props

```typescript
interface RadixAnimateProps {
  children: React.ReactNode;
  animationType: "rotate" | "accordion-content" | "fade" | "scale";
  duration?: number; // Default: 300ms
  easing?: string; // Default: 'cubic-bezier(0.87, 0, 0.13, 1)'
  degrees?: number; // Default: 180 (for rotate)
  scale?: number; // Default: 1 (for scale)
  className?: string; // Additional CSS classes
}
```

## StateBasedAnimate Component

### Import

```tsx
import { StateBasedAnimate } from "@abdullah-altun/react-animation-library";
```

### Usage

More flexible component that can work with any state system:

```tsx
<StateBasedAnimate
  animationType="slide-down"
  distance={100}
  triggerState="open"
>
  <div>Content that slides down</div>
</StateBasedAnimate>
```

### Animation Types

#### 1. `rotate`

```tsx
<StateBasedAnimate animationType="rotate" degrees={45}>
  <PlusIcon />
</StateBasedAnimate>
```

#### 2. `slide-down` / `slide-up`

```tsx
<StateBasedAnimate animationType="slide-down" distance={200}>
  <div>Slides down from above</div>
</StateBasedAnimate>
```

#### 3. `fade`

```tsx
<StateBasedAnimate animationType="fade" duration={150}>
  <div>Fades in/out</div>
</StateBasedAnimate>
```

#### 4. `scale`

```tsx
<StateBasedAnimate animationType="scale" scale={1.1}>
  <div>Scales up/down</div>
</StateBasedAnimate>
```

### Props

```typescript
interface StateBasedAnimateProps {
  children: React.ReactNode;
  animationType: "rotate" | "slide-down" | "slide-up" | "fade" | "scale";
  duration?: number; // Default: 300ms
  easing?: string; // Default: 'cubic-bezier(0.87, 0, 0.13, 1)'
  degrees?: number; // Default: 180 (for rotate)
  distance?: number; // Default: 200px (for slide)
  scale?: number; // Default: 1.1 (for scale)
  className?: string; // Additional CSS classes
  stateSelector?: string; // Custom selector to watch for state
  triggerState?: string; // Default: 'open'
}
```

## Supported State Attributes

The animations automatically trigger when these attributes are detected on parent elements:

- `data-state="open"` (Radix UI default)
- `data-state="expanded"`
- `data-state="checked"`
- `data-expanded="true"`
- `data-open="true"`
- `aria-expanded="true"`

## Real-World Examples

### 1. FAQ Accordion

```tsx
function FAQItem({ question, answer, value }) {
  return (
    <AccordionPrimitive.Item value={value}>
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger>
          <span>{question}</span>
          <RadixAnimate animationType="rotate">
            <ChevronDownIcon />
          </RadixAnimate>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <RadixAnimate animationType="accordion-content">
        <AccordionPrimitive.Content>
          <div>{answer}</div>
        </AccordionPrimitive.Content>
      </RadixAnimate>
    </AccordionPrimitive.Item>
  );
}
```

### 2. Navigation Dropdown

```tsx
function NavDropdown({ title, items }) {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger>
        <span>{title}</span>
        <RadixAnimate animationType="rotate" degrees={180}>
          <ChevronDownIcon />
        </RadixAnimate>
      </DropdownMenuPrimitive.Trigger>

      <RadixAnimate animationType="scale" duration={150}>
        <DropdownMenuPrimitive.Content>
          {items.map((item) => (
            <DropdownMenuPrimitive.Item key={item.id}>
              {item.label}
            </DropdownMenuPrimitive.Item>
          ))}
        </DropdownMenuPrimitive.Content>
      </RadixAnimate>
    </DropdownMenuPrimitive.Root>
  );
}
```

### 3. Collapsible Section

```tsx
function CollapsibleSection({ title, children }) {
  return (
    <CollapsiblePrimitive.Root>
      <CollapsiblePrimitive.Trigger>
        <span>{title}</span>
        <StateBasedAnimate animationType="rotate" degrees={90}>
          <ArrowRightIcon />
        </StateBasedAnimate>
      </CollapsiblePrimitive.Trigger>

      <StateBasedAnimate animationType="fade" duration={200}>
        <CollapsiblePrimitive.Content>{children}</CollapsiblePrimitive.Content>
      </StateBasedAnimate>
    </CollapsiblePrimitive.Root>
  );
}
```

## Benefits

✅ **No useState required** - Works in server components  
✅ **No manual state management** - Automatically detects parent states  
✅ **Radix UI optimized** - Built specifically for Radix patterns  
✅ **Accessible** - Respects `prefers-reduced-motion`  
✅ **Performant** - Pure CSS animations  
✅ **TypeScript support** - Fully typed props  
✅ **Customizable** - Control duration, easing, distances, etc.

## Migration from Manual Approach

### Before (Manual SCSS)

```scss
.trigger {
  .chevron {
    transition: transform 300ms cubic-bezier(0.87, 0, 0.13, 1);
  }

  &[data-state="open"] > .chevron {
    transform: rotate(180deg);
  }
}
```

### After (With RadixAnimate)

```tsx
<RadixAnimate animationType="rotate" degrees={180} duration={300}>
  <ChevronDownIcon />
</RadixAnimate>
```

The animation library handles all the CSS and state detection automatically!

## CSS Custom Properties

You can also customize animations globally using CSS custom properties:

```css
:root {
  --animation-duration: 250ms;
  --animation-easing: ease-out;
  --rotation-degrees: 90deg;
  --slide-distance: 150px;
  --scale-factor: 1.05;
}
```
