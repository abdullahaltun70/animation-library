"use client";
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

var DEFAULTS = {
  duration: 0.5,
  delay: 0,
  easing: "ease-out",
  opacityStart: 0,
  opacityEnd: 1,
  distance: 50,
  // Default end rotation for one-shot keyframe animation
  degreesStart: 0,
  // Default start rotation for one-shot keyframe animation
  scale: 0.8,
  axis: "x"
};
function useAnimation(config, onAnimationComplete) {
  const {
    type,
    duration: configDuration,
    delay: configDelay,
    easing: configEasing,
    distance: configDistance,
    degrees: configDegrees,
    scale: configScale,
    opacity: configOpacity,
    axis: configAxis
  } = config;
  const duration = validateTime(configDuration, DEFAULTS.duration);
  const delay = validateTime(configDelay, DEFAULTS.delay);
  const easing = configEasing || DEFAULTS.easing;
  const distance = configDistance != null ? configDistance : DEFAULTS.distance;
  const scale = configScale != null ? configScale : DEFAULTS.scale;
  const axis = configAxis || DEFAULTS.axis;
  const opacity = {
    start: validateOpacity(configOpacity == null ? void 0 : configOpacity.start, DEFAULTS.opacityStart),
    end: validateOpacity(configOpacity == null ? void 0 : configOpacity.end, DEFAULTS.opacityEnd)
  };
  const [key, setKey] = React.useState(0);
  const elementRef = React.useRef(null);
  const animationTimerRef = React.useRef(null);
  const handleAnimationEndEvent = React.useCallback(
    (event) => {
      var _a, _b;
      if (event.target === elementRef.current && onAnimationComplete) {
        onAnimationComplete(event);
        if (event.type === "animationend") {
          (_a = elementRef.current) == null ? void 0 : _a.removeEventListener(
            "animationend",
            handleAnimationEndEvent
          );
        } else if (event.type === "transitionend") {
          (_b = elementRef.current) == null ? void 0 : _b.removeEventListener(
            "transitionend",
            handleAnimationEndEvent
          );
        }
      }
    },
    [onAnimationComplete]
  );
  React.useEffect(() => {
    const node = elementRef.current;
    if (!node) return;
    node.style.transition = "";
    node.style.transform = "";
    const classesToRemove = Array.from(node.classList).filter(
      (cls) => cls.startsWith("animate-")
    );
    classesToRemove.forEach((cls) => node.classList.remove(cls));
    node.removeEventListener("animationend", handleAnimationEndEvent);
    node.removeEventListener("transitionend", handleAnimationEndEvent);
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
    }
    if (type === "rotate") {
      let endDeg = DEFAULTS.degreesStart;
      if (typeof configDegrees === "number") {
        endDeg = configDegrees;
      } else if (configDegrees && typeof configDegrees.end === "number") {
        endDeg = configDegrees.end;
      }
      node.style.transition = `transform ${duration}s ${easing} ${delay}s`;
      node.style.transform = `rotate(${endDeg}deg)`;
      if (onAnimationComplete) {
        node.addEventListener("transitionend", handleAnimationEndEvent);
      }
    } else {
      let animationClass = `animate-${type}`;
      if (type === "slide") {
        const directionSuffix = distance >= 0 ? "positive" : "negative";
        animationClass = `animate-${type}-${axis}-${directionSuffix}`;
      } else if (type === "bounce") {
        const directionSuffix = distance >= 0 ? "positive" : "negative";
        animationClass = `animate-${type}-${directionSuffix}`;
      }
      node.style.setProperty("--animation-duration", `${duration}s`);
      node.style.setProperty("--animation-delay", `${delay}s`);
      node.style.setProperty("--animation-easing", easing);
      if (type === "fade") {
        node.style.setProperty("--opacity-start", `${opacity.start}`);
        node.style.setProperty("--opacity-end", `${opacity.end}`);
      }
      if (type === "slide") {
        node.style.setProperty("--distance", `${Math.abs(distance)}px`);
        node.style.setProperty("--opacity-start", `${opacity.start}`);
        node.style.setProperty("--opacity-end", `${opacity.end}`);
      }
      if (type === "scale") {
        node.style.setProperty("--scale", `${scale}`);
        node.style.setProperty("--opacity-start", `${opacity.start}`);
        node.style.setProperty("--opacity-end", `${opacity.end}`);
      }
      if (type === "bounce") {
        node.style.setProperty("--distance", `${distance}px`);
        node.style.setProperty("--opacity-start", `${opacity.start}`);
        node.style.setProperty("--opacity-end", `${opacity.end}`);
      }
      if (animationClass) {
        void node.offsetWidth;
        animationTimerRef.current = Number(window.setTimeout(() => {
          const currentNode = elementRef.current;
          if (currentNode) {
            currentNode.style.animation = "none";
            void currentNode.offsetWidth;
            currentNode.style.animation = "";
            currentNode.classList.add(animationClass);
            if (onAnimationComplete) {
              currentNode.addEventListener(
                "animationend",
                handleAnimationEndEvent
              );
            }
          }
        }, 20));
      }
    }
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
      if (node) {
        node.removeEventListener("animationend", handleAnimationEndEvent);
        node.removeEventListener("transitionend", handleAnimationEndEvent);
      }
    };
  }, [
    type,
    duration,
    delay,
    easing,
    distance,
    configDegrees,
    scale,
    opacity.start,
    opacity.end,
    axis,
    key,
    onAnimationComplete,
    handleAnimationEndEvent
  ]);
  const replay = React.useCallback(() => {
    const node = elementRef.current;
    if (node) {
      node.style.animation = "none";
      const classesToRemove = Array.from(node.classList).filter(
        (cls) => cls.startsWith("animate-")
      );
      classesToRemove.forEach((cls) => node.classList.remove(cls));
      void node.offsetHeight;
      node.style.animation = "";
    }
    setKey((prevKey) => prevKey + 1);
  }, []);
  return { ref: elementRef, key, replay };
}
function validateTime(value, defaultValue) {
  const numValue = typeof value === "number" ? value : NaN;
  if (!isNaN(numValue) && numValue >= 0) {
    return numValue;
  }
  return defaultValue;
}
function validateOpacity(value, defaultValue) {
  const numValue = typeof value === "number" ? value : defaultValue;
  return Math.max(0, Math.min(1, numValue));
}
var Animate = React.forwardRef(
  ({
    children,
    as: Component = "div",
    className = "",
    onAnimationComplete,
    // Animation config props
    type,
    duration,
    delay,
    easing,
    distance,
    degrees,
    scale,
    opacity,
    axis,
    ...props
  }, forwardedRef) => {
    const animationConfig = {
      type,
      duration,
      delay,
      easing,
      distance,
      degrees,
      scale,
      opacity,
      axis
    };
    const { ref, key } = useAnimation(animationConfig);
    const setRefs = (element) => {
      if (typeof ref === "object" && ref !== null) {
        ref.current = element;
      }
      if (forwardedRef) {
        if (typeof forwardedRef === "function") {
          forwardedRef(element);
        } else {
          forwardedRef.current = element;
        }
      }
    };
    const handleAnimationEnd = (e) => {
      var _a;
      if (e.target === ref.current) {
        onAnimationComplete == null ? void 0 : onAnimationComplete();
      }
      (_a = props.onAnimationEnd) == null ? void 0 : _a.call(props, e);
    };
    const combinedClassName = `animated ${className}`.trim();
    return React__default.default.createElement(
      Component,
      {
        ...props,
        ref: setRefs,
        className: combinedClassName,
        key,
        // Key helps force re-animation
        onAnimationEnd: handleAnimationEnd,
        // Add data attributes for potential debugging/testing
        "data-animation-type": type,
        "data-animation-duration": duration != null ? duration : 0.5,
        "data-animation-delay": delay != null ? delay : 0
      },
      children
    );
  }
);
Animate.displayName = "Animate";

exports.Animate = Animate;
exports.AnimateWrapper = Animate;
exports.default = Animate;
exports.useAnimation = useAnimation;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map