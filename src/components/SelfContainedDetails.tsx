import * as React from "react";

interface SelfContainedDetailsProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  duration?: number;
  easing?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  id?: string;
  animationType?: "slide-down" | "slide-up" | "fade" | "scale";
}

export const SelfContainedDetails: React.FC<SelfContainedDetailsProps> = ({
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
}) => {
  const baseClasses = `self-contained-details self-contained-details--${animationType}`;
  const combinedClassName = `${baseClasses} ${className}`.trim();

  const style = {
    "--details-duration": `${duration}ms`,
    "--details-easing": easing,
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
          className: `details-trigger ${triggerClassName}`.trim(),
        },
        trigger
      ),
      React.createElement(
        "div",
        {
          key: "content",
          className: `details-content ${contentClassName}`.trim(),
        },
        React.createElement(
          "div",
          {
            className: "details-content-inner",
          },
          children
        )
      ),
    ]
  );
};

export default SelfContainedDetails;
