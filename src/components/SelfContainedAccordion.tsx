import * as React from "react";

interface SelfContainedAccordionProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  duration?: number;
  easing?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  id?: string;
}

/**
 * A truly self-contained accordion component that works without any external state management.
 * Uses native HTML <details> and <summary> elements for accessibility and server compatibility.
 * Perfect for Next.js server components as it requires no JavaScript to function.
 *
 * @example
 * <SelfContainedAccordion trigger={<span>Click to expand</span>}>
 *   <div>This content will slide down smoothly</div>
 * </SelfContainedAccordion>
 */
export const SelfContainedAccordion: React.FC<SelfContainedAccordionProps> = ({
  trigger,
  children,
  defaultOpen = false,
  duration = 300,
  easing = "cubic-bezier(0.87, 0, 0.13, 1)",
  className = "",
  triggerClassName = "",
  contentClassName = "",
  id,
}) => {
  const baseClasses = "self-contained-accordion";
  const combinedClassName = `${baseClasses} ${className}`.trim();

  const style = {
    "--accordion-duration": `${duration}ms`,
    "--accordion-easing": easing,
  } as React.CSSProperties;

  return React.createElement(
    "details",
    {
      className: combinedClassName,
      style: style,
      open: defaultOpen,
      id: id,
    },
    [
      React.createElement(
        "summary",
        {
          key: "summary",
          className: `accordion-trigger ${triggerClassName}`.trim(),
        },
        [
          trigger,
          React.createElement(
            "span",
            {
              key: "chevron",
              className: "accordion-chevron",
              "aria-hidden": "true",
            },
            React.createElement(
              "svg",
              {
                width: "16",
                height: "16",
                viewBox: "0 0 16 16",
                fill: "currentColor",
              },
              React.createElement("path", {
                d: "M4.5 6l3.5 3.5L11.5 6z",
              })
            )
          ),
        ]
      ),
      React.createElement(
        "div",
        {
          key: "content",
          className: `accordion-content ${contentClassName}`.trim(),
        },
        React.createElement(
          "div",
          {
            className: "accordion-content-inner",
          },
          children
        )
      ),
    ]
  );
};

export default SelfContainedAccordion;
