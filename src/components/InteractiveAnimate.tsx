import React, { forwardRef, HTMLAttributes, ReactNode } from "react";
import { ModernAnimationConfig } from "../types/modern";

interface InteractiveAnimateProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverConfig?: ModernAnimationConfig;
  focusConfig?: ModernAnimationConfig;
  clickConfig?: ModernAnimationConfig;
  as?: keyof React.JSX.IntrinsicElements | React.ComponentType<any>;
  className?: string;
  disabled?: boolean;
}

/**
 * Component for micro-interactions with hover, focus, and click animations
 * Uses pure CSS for optimal performance
 *
 * @example
 * ```tsx
 * <InteractiveAnimate
 *   hoverConfig={{ type: 'scale', scale: { start: 1, end: 1.05 }, duration: 0.2 }}
 *   clickConfig={{ type: 'scale', scale: { start: 1, end: 0.95 }, duration: 0.1 }}
 *   className="button"
 * >
 *   <button>Interactive Button</button>
 * </InteractiveAnimate>
 * ```
 */
export const InteractiveAnimate = forwardRef<
  HTMLElement,
  InteractiveAnimateProps
>(
  (
    {
      children,
      hoverConfig,
      focusConfig,
      clickConfig,
      as: Component = "div",
      className = "",
      disabled = false,
      style,
      ...props
    },
    ref
  ) => {
    // Generate CSS custom properties from configs
    const cssProps = React.useMemo(() => {
      const props: Record<string, string> = {};

      if (hoverConfig) {
        props["--hover-duration"] = `${hoverConfig.duration || 0.2}s`;
        const hoverEasing = Array.isArray(hoverConfig.easing)
          ? hoverConfig.easing[0]
          : hoverConfig.easing;
        props["--hover-easing"] = hoverEasing || "ease-out";
        if (typeof hoverConfig.scale === "number") {
          props["--hover-scale"] = `${hoverConfig.scale}`;
        } else if (hoverConfig.scale?.end) {
          props["--hover-scale"] = `${hoverConfig.scale.end}`;
        }
        if (hoverConfig.distance) {
          props["--hover-distance"] = `${hoverConfig.distance}px`;
        }
      }

      if (focusConfig) {
        props["--focus-duration"] = `${focusConfig.duration || 0.2}s`;
        const focusEasing = Array.isArray(focusConfig.easing)
          ? focusConfig.easing[0]
          : focusConfig.easing;
        props["--focus-easing"] = focusEasing || "ease-out";
        if (typeof focusConfig.scale === "number") {
          props["--focus-scale"] = `${focusConfig.scale}`;
        } else if (focusConfig.scale?.end) {
          props["--focus-scale"] = `${focusConfig.scale.end}`;
        }
      }

      if (clickConfig) {
        props["--click-duration"] = `${clickConfig.duration || 0.1}s`;
        const clickEasing = Array.isArray(clickConfig.easing)
          ? clickConfig.easing[0]
          : clickConfig.easing;
        props["--click-easing"] = clickEasing || "ease-out";
        if (typeof clickConfig.scale === "number") {
          props["--click-scale"] = `${clickConfig.scale}`;
        } else if (clickConfig.scale?.end) {
          props["--click-scale"] = `${clickConfig.scale.end}`;
        }
      }

      return props;
    }, [hoverConfig, focusConfig, clickConfig]);

    // Build class names based on configured interactions
    const interactiveClasses = React.useMemo(() => {
      const classes = ["interactive-animate"];

      if (hoverConfig) {
        const hoverType = Array.isArray(hoverConfig.type)
          ? hoverConfig.type[0]
          : hoverConfig.type;
        classes.push(`interactive-hover-${hoverType}`);
      }

      if (focusConfig) {
        const focusType = Array.isArray(focusConfig.type)
          ? focusConfig.type[0]
          : focusConfig.type;
        classes.push(`interactive-focus-${focusType}`);
      }

      if (clickConfig) {
        const clickType = Array.isArray(clickConfig.type)
          ? clickConfig.type[0]
          : clickConfig.type;
        classes.push(`interactive-click-${clickType}`);
      }

      return classes.join(" ");
    }, [hoverConfig, focusConfig, clickConfig]);

    const combinedStyle = {
      ...cssProps,
      ...style,
    };

    return React.createElement(
      Component as any,
      {
        ref,
        className: `${interactiveClasses} ${className}`.trim(),
        style: combinedStyle,
        "data-interactive": !disabled,
        "data-has-hover": !!hoverConfig,
        "data-has-focus": !!focusConfig,
        "data-has-click": !!clickConfig,
        ...props,
      },
      children
    );
  }
);

InteractiveAnimate.displayName = "InteractiveAnimate";
