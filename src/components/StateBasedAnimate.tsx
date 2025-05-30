import React from "react";

export interface StateBasedAnimateProps {
  /** The child element to animate */
  children: React.ReactNode;
  /** Type of animation to apply */
  animationType: "rotate" | "slide-down" | "slide-up" | "fade" | "scale";
  /** Animation duration in milliseconds */
  duration?: number;
  /** Animation easing function */
  easing?: string;
  /** Rotation degrees (for rotate animation) */
  degrees?: number;
  /** Distance for slide animations */
  distance?: number;
  /** Scale factor (for scale animation) */
  scale?: number;
  /** Custom CSS class */
  className?: string;
  /** Target selector to watch for state changes (defaults to closest parent with data-state) */
  stateSelector?: string;
  /** State value that triggers the animation (defaults to 'open') */
  triggerState?: string;
}

/**
 * StateBasedAnimate - Automatically animates based on parent component state
 *
 * Perfect for Radix UI components and other libraries that use data-state attributes.
 * Watches for changes in parent component's data-state and applies animations accordingly.
 *
 * @example
 * // Rotate a chevron when accordion opens
 * <AccordionPrimitive.Trigger>
 *   <Text>Accordion Title</Text>
 *   <StateBasedAnimate animationType="rotate" degrees={180}>
 *     <ChevronDownIcon />
 *   </StateBasedAnimate>
 * </AccordionPrimitive.Trigger>
 *
 * @example
 * // Slide content down when collapsible opens
 * <StateBasedAnimate animationType="slide-down" distance={200}>
 *   <AccordionPrimitive.Content>
 *     <div>Content here</div>
 *   </AccordionPrimitive.Content>
 * </StateBasedAnimate>
 */
const StateBasedAnimate: React.FC<StateBasedAnimateProps> = ({
  children,
  animationType,
  duration = 300,
  easing = "cubic-bezier(0.87, 0, 0.13, 1)",
  degrees = 180,
  distance = 200,
  scale = 1.1,
  className = "",
  stateSelector,
  triggerState = "open",
}) => {
  const elementRef = React.useRef<HTMLSpanElement>(null);
  const [isActive, setIsActive] = React.useState(false);

  // Monitor parent state changes
  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const checkParentState = () => {
      // Look for data-state attribute on ancestors
      let parent = element.parentElement;
      while (parent) {
        const state = parent.getAttribute("data-state");
        if (state === triggerState) {
          setIsActive(true);
          return;
        }
        parent = parent.parentElement;
      }
      setIsActive(false);
    };

    // Initial check
    checkParentState();

    // Use MutationObserver to watch for state changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-state"
        ) {
          checkParentState();
        }
      });
    });

    // Observe the document body for data-state changes
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-state"],
      subtree: true,
    });

    return () => observer.disconnect();
  }, [triggerState]);

  // Generate unique ID for this instance
  const instanceId = React.useId();

  // Create animation class based on type
  const animationClass = `state-animate-${animationType}`;

  // Generate CSS custom properties for animation parameters
  const customProperties: React.CSSProperties = {
    "--animation-duration": `${duration}ms`,
    "--animation-easing": easing,
    "--rotation-degrees": `${degrees}deg`,
    "--slide-distance": `${distance}px`,
    "--scale-factor": scale,
  } as React.CSSProperties;

  // Apply active state class
  const activeClass = isActive ? "state-animate-active" : "";

  return React.createElement(
    "span",
    {
      ref: elementRef,
      className:
        `state-animate ${animationClass} ${activeClass} ${className}`.trim(),
      style: customProperties,
      "data-state-selector": stateSelector,
      "data-trigger-state": triggerState,
      "data-instance-id": instanceId,
      "data-is-active": isActive,
    },
    children
  );
};

export default StateBasedAnimate;
