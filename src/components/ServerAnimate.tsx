import * as React from "react";

interface ServerAnimateProps {
  children?: React.ReactNode; // Optional when using selfContained mode
  type: "rotate" | "slide-down" | "slide-up";
  state?: "open" | "closed";

  // Self-contained state management options
  selfContained?: {
    method: "details" | "checkbox";
    trigger?: React.ReactNode;
    defaultOpen?: boolean;
    id?: string;
    content?: React.ReactNode; // Separate content from trigger for self-contained mode
  };

  duration?: number;
  easing?: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  [key: string]: any; // For other HTML attributes
}

/**
 * Server-compatible animation component that works without JavaScript
 * Uses CSS-only animations triggered by data attributes
 * Perfect for accordions, dropdowns, and other state-based animations
 *
 * @example
 * // External state management (requires parent state)
 * <ServerAnimate type="rotate" state={isOpen ? 'open' : 'closed'}>
 *   <ChevronIcon />
 * </ServerAnimate>
 *
 * // Self-contained with details/summary (recommended)
 * <ServerAnimate
 *   type="slide-down"
 *   selfContained={{
 *     method: 'details',
 *     trigger: <span>Click to expand</span>,
 *     content: <div>Content that slides down</div>
 *   }}
 * >
 *   Fallback content if not using selfContained
 * </ServerAnimate>
 *
 * // Self-contained with checkbox
 * <ServerAnimate
 *   type="rotate"
 *   selfContained={{
 *     method: 'checkbox',
 *     trigger: <ChevronIcon />,
 *     content: <div>Content container</div>,
 *     id: 'my-accordion'
 *   }}
 * >
 *   Fallback content
 * </ServerAnimate>
 */
export const ServerAnimate: React.FC<ServerAnimateProps> = ({
  children,
  type,
  state = "closed",
  selfContained,
  duration = 300,
  easing = "cubic-bezier(0.87, 0, 0.13, 1)",
  className = "",
  as: Component = "div",
  ...props
}) => {
  const baseClasses = "server-animate";
  const typeClass = `server-animate-${type}`;
  const combinedClassName = `${baseClasses} ${typeClass} ${className}`.trim();

  const style = {
    "--animation-duration": `${duration}ms`,
    "--animation-easing": easing,
    ...props.style,
  };

  // If self-contained mode is enabled, render the appropriate wrapper
  if (selfContained) {
    const { method, trigger, content, defaultOpen = false, id } = selfContained;

    if (method === "details") {
      return React.createElement(
        "details",
        {
          className: "server-animate-details",
          style: style,
          open: defaultOpen,
          id: id,
          ...props,
        },
        [
          React.createElement(
            "summary",
            {
              key: "summary",
              className: "server-animate-trigger",
            },
            [
              React.createElement(
                "div",
                {
                  key: "trigger-content",
                  className: `${combinedClassName} details-trigger-animation`,
                  "data-state": "closed",
                  style: style,
                },
                trigger || children
              ),
              React.createElement("div", {
                key: "chevron",
                className: "server-animate-chevron",
              }),
            ]
          ),
          React.createElement(
            "div",
            {
              key: "content",
              className: `server-animate-content ${typeClass}-content`,
              style: style,
            },
            content || children
          ),
        ]
      );
    }

    if (method === "checkbox") {
      const accordionId =
        id || `server-accordion-${Math.random().toString(36).substr(2, 9)}`;

      return React.createElement(
        "div",
        {
          className: "server-animate-checkbox-wrapper",
          style: style,
          ...props,
        },
        [
          React.createElement("input", {
            key: "input",
            type: "checkbox",
            id: accordionId,
            className: "server-animate-checkbox",
            defaultChecked: defaultOpen,
          }),
          React.createElement(
            "label",
            {
              key: "label",
              htmlFor: accordionId,
              className: "server-animate-trigger",
            },
            [
              React.createElement(
                "div",
                {
                  key: "trigger-content",
                  className: `${combinedClassName} checkbox-trigger-animation`,
                  "data-state": "closed",
                  style: style,
                },
                trigger || children
              ),
              React.createElement("div", {
                key: "chevron",
                className: "server-animate-chevron",
              }),
            ]
          ),
          React.createElement(
            "div",
            {
              key: "content",
              className: `server-animate-content ${typeClass}-content`,
              style: style,
            },
            content || children
          ),
        ]
      );
    }
  }

  // Default behavior - requires external state management
  return React.createElement(
    Component,
    {
      ...props,
      className: combinedClassName,
      "data-state": state,
      style,
    },
    children
  );
};

export default ServerAnimate;
