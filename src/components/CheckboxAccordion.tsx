import * as React from "react";

interface CheckboxAccordionProps {
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
 * A self-contained accordion using checkbox input for state management.
 * Alternative to details-based accordion with more styling flexibility.
 * Works without JavaScript but may be less accessible than details/summary.
 *
 * @example
 * <CheckboxAccordion
 *   id="my-accordion"
 *   trigger={<span>Toggle Content</span>}
 * >
 *   <div>Hidden content that slides down</div>
 * </CheckboxAccordion>
 */
export const CheckboxAccordion: React.FC<CheckboxAccordionProps> = ({
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
  const accordionId =
    id || `checkbox-accordion-${Math.random().toString(36).substr(2, 9)}`;
  const baseClasses = "checkbox-accordion";
  const combinedClassName = `${baseClasses} ${className}`.trim();

  const style = {
    "--accordion-duration": `${duration}ms`,
    "--accordion-easing": easing,
  } as React.CSSProperties;

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
        id: accordionId,
        className: "accordion-checkbox",
        defaultChecked: defaultOpen,
      }),
      React.createElement(
        "label",
        {
          key: "label",
          htmlFor: accordionId,
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

export default CheckboxAccordion;
