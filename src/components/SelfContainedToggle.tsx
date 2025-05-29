import * as React from "react";

interface SelfContainedToggleProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  duration?: number;
  easing?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  id?: string;
  animationType?:
    | "slide-down"
    | "slide-up"
    | "slide-left"
    | "slide-right"
    | "fade"
    | "scale"
    | "rotate";
  variant?: "checkbox" | "details";
}

/**
 * A completely self-contained toggle component that works without JavaScript state management.
 * Perfect for any toggle scenario: accordions, dropdowns, menus, modals, sidebars, etc.
 * Uses native HTML elements (checkbox or details) for state management.
 *
 * @example
 * // Dropdown menu
 * <SelfContainedToggle
 *   variant="checkbox"
 *   animationType="slide-down"
 *   trigger={<button>Menu ▼</button>}
 * >
 *   <nav>Menu items here</nav>
 * </SelfContainedToggle>
 *
 * // Sidebar toggle
 * <SelfContainedToggle
 *   variant="checkbox"
 *   animationType="slide-right"
 *   trigger={<button>☰</button>}
 * >
 *   <aside>Sidebar content</aside>
 * </SelfContainedToggle>
 *
 * // Modal dialog
 * <SelfContainedToggle
 *   variant="checkbox"
 *   animationType="fade"
 *   trigger={<button>Open Modal</button>}
 * >
 *   <div className="modal">Modal content</div>
 * </SelfContainedToggle>
 *
 * // Button with rotating icon
 * <SelfContainedToggle
 *   variant="checkbox"
 *   animationType="rotate"
 *   trigger={<button>Toggle <span>▼</span></button>}
 * >
 *   <div>Content to show/hide</div>
 * </SelfContainedToggle>
 */
export const SelfContainedToggle: React.FC<SelfContainedToggleProps> = ({
  trigger,
  children,
  defaultOpen = false,
  duration = 300,
  easing = "cubic-bezier(0.87, 0, 0.13, 1)",
  className = "",
  triggerClassName = "",
  contentClassName = "",
  id,
  animationType = "slide-down",
  variant = "checkbox",
}) => {
  const toggleId =
    id || `self-contained-toggle-${Math.random().toString(36).substr(2, 9)}`;
  const baseClasses = `self-contained-toggle self-contained-toggle--${variant} self-contained-toggle--${animationType}`;
  const combinedClassName = `${baseClasses} ${className}`.trim();

  const style = {
    "--toggle-duration": `${duration}ms`,
    "--toggle-easing": easing,
  } as React.CSSProperties;

  if (variant === "details") {
    return React.createElement(
      "details",
      {
        className: combinedClassName,
        style: style,
        open: defaultOpen,
        id: toggleId,
      },
      [
        React.createElement(
          "summary",
          {
            key: "summary",
            className: `toggle-trigger ${triggerClassName}`.trim(),
          },
          trigger
        ),
        React.createElement(
          "div",
          {
            key: "content",
            className: `toggle-content ${contentClassName}`.trim(),
          },
          React.createElement(
            "div",
            {
              className: "toggle-content-inner",
            },
            children
          )
        ),
      ]
    );
  }

  // Checkbox variant (default)
  return React.createElement(
    "div",
    {
      className: combinedClassName,
      style: style,
    },
    [
      React.createElement("input", {
        key: "input",
        type: "checkbox",
        id: toggleId,
        className: "toggle-checkbox",
        defaultChecked: defaultOpen,
      }),
      React.createElement(
        "label",
        {
          key: "label",
          htmlFor: toggleId,
          className: `toggle-trigger ${triggerClassName}`.trim(),
        },
        trigger
      ),
      React.createElement(
        "div",
        {
          key: "content",
          className: `toggle-content ${contentClassName}`.trim(),
        },
        React.createElement(
          "div",
          {
            className: "toggle-content-inner",
          },
          children
        )
      ),
    ]
  );
};

export default SelfContainedToggle;
