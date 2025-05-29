import React from "react";

export interface RadixAnimateProps {
  /** The child element to animate */
  children: React.ReactNode;
  /** Type of animation to apply */
  animationType: "rotate" | "accordion-content" | "fade" | "scale";
  /** Animation duration in milliseconds */
  duration?: number;
  /** Animation easing function */
  easing?: string;
  /** Rotation degrees (for rotate animation) */
  degrees?: number;
  /** Scale factor (for scale animation) */
  scale?: number;
  /** Custom CSS class */
  className?: string;
}

/**
 * RadixAnimate - Optimized for Radix UI components
 *
 * This component is specifically designed to work with Radix UI's data-state attributes
 * and provides optimized animations for common Radix patterns.
 *
 * @example
 * // Rotate chevron in Accordion trigger
 * <AccordionPrimitive.Trigger>
 *   <span>Title</span>
 *   <RadixAnimate animationType="rotate" degrees={180}>
 *     <ChevronDownIcon />
 *   </RadixAnimate>
 * </AccordionPrimitive.Trigger>
 *
 * @example
 * // Animate Accordion content with proper height handling
 * <RadixAnimate animationType="accordion-content">
 *   <AccordionPrimitive.Content>
 *     <div>Content here</div>
 *   </AccordionPrimitive.Content>
 * </RadixAnimate>
 */
const RadixAnimate: React.FC<RadixAnimateProps> = ({
  children,
  animationType,
  duration = 300,
  easing = "cubic-bezier(0.87, 0, 0.13, 1)",
  degrees = 180,
  scale = 1,
  className = "",
}) => {
  // Create animation class based on type
  const animationClass = `state-animate-${animationType}`;

  // Generate CSS custom properties for animation parameters
  const customProperties: React.CSSProperties = {
    "--animation-duration": `${duration}ms`,
    "--animation-easing": easing,
    "--rotation-degrees": `${degrees}deg`,
    "--scale-factor": scale,
  } as React.CSSProperties;

  return React.createElement(
    "div",
    {
      className: `state-animate ${animationClass} ${className}`,
      style: customProperties,
    },
    children
  );
};

export default RadixAnimate;
