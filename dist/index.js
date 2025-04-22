"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Animate: () => Animate,
  useAnimation: () => useAnimation
});
module.exports = __toCommonJS(index_exports);

// src/hooks/useAnimation.ts
var import_react = require("react");
var DEFAULTS = {
  duration: 0.5,
  delay: 0,
  easing: "ease-out",
  opacityStart: 0,
  opacityEnd: 1,
  distance: 50,
  degrees: 360,
  scale: 0.8
};
function useAnimation(config) {
  const {
    type,
    duration = DEFAULTS.duration,
    delay = DEFAULTS.delay,
    easing = DEFAULTS.easing,
    distance,
    degrees,
    scale,
    opacity = {}
  } = config;
  const { start: opacityStart = DEFAULTS.opacityStart, end: opacityEnd = DEFAULTS.opacityEnd } = opacity;
  const [key, setKey] = (0, import_react.useState)(0);
  const elementRef = (0, import_react.useRef)(null);
  const getAnimationClass = (0, import_react.useCallback)(() => {
    switch (type) {
      case "fade":
        return "animate-fade";
      // Matches _animations.scss
      case "slide": {
        const effectiveDistance = distance ?? DEFAULTS.distance;
        return effectiveDistance >= 0 ? "animate-slide-x-positive" : "animate-slide-x-negative";
      }
      case "scale":
        return "animate-scale";
      case "rotate": {
        const effectiveDegrees = degrees ?? DEFAULTS.degrees;
        return effectiveDegrees >= 0 ? "animate-rotate-positive" : "animate-rotate-negative";
      }
      case "bounce": {
        const effectiveDistance = distance ?? DEFAULTS.distance;
        return effectiveDistance >= 0 ? "animate-bounce-positive" : "animate-bounce-negative";
      }
      default:
        const _exhaustiveCheck = type;
        console.warn(`Unknown animation type: ${type}`);
        return "";
    }
  }, [type, distance, degrees]);
  (0, import_react.useEffect)(() => {
    const element = elementRef.current;
    if (!element) return;
    const animationClass = getAnimationClass();
    if (!animationClass) return;
    const classesToRemove = Array.from(element.classList).filter((cls) => cls.startsWith("animate-"));
    if (classesToRemove.length > 0) {
      element.classList.remove(...classesToRemove);
    }
    element.classList.add(animationClass);
    element.style.setProperty("--animation-duration", `${validateTime(duration, DEFAULTS.duration)}s`);
    element.style.setProperty("--animation-delay", `${validateTime(delay, DEFAULTS.delay)}s`);
    element.style.setProperty("--animation-easing", easing);
    if (type === "fade") {
      element.style.setProperty("--opacity-start", validateOpacity(opacityStart).toString());
      element.style.setProperty("--opacity-end", validateOpacity(opacityEnd).toString());
    }
    if (type === "slide" || type === "bounce") {
      const distanceValue = distance !== void 0 ? distance : DEFAULTS.distance;
      element.style.setProperty("--distance", `${Math.abs(distanceValue)}px`);
    }
    if (type === "rotate") {
      const degreesValue = degrees !== void 0 ? degrees : DEFAULTS.degrees;
      element.style.setProperty("--degrees", `${Math.abs(degreesValue)}deg`);
    }
    if (type === "scale") {
      const scaleValue = scale !== void 0 ? scale : DEFAULTS.scale;
      element.style.setProperty("--scale", scaleValue.toString());
    }
    return () => {
      if (elementRef.current) {
        elementRef.current.classList.remove(animationClass);
      }
    };
  }, [key, type, duration, delay, easing, distance, degrees, scale, opacityStart, opacityEnd, getAnimationClass]);
  const replay = (0, import_react.useCallback)(() => {
    setKey((prevKey) => prevKey + 1);
  }, []);
  return { ref: elementRef, key, replay };
}
function validateTime(value, defaultValue) {
  return typeof value === "number" && value >= 0 ? value : defaultValue;
}
function validateOpacity(value) {
  const numValue = typeof value === "number" ? value : NaN;
  if (isNaN(numValue)) {
    return 0;
  }
  return Math.max(0, Math.min(1, numValue));
}

// src/components/Animate.tsx
var import_react2 = __toESM(require("react"));
var Animate = (0, import_react2.forwardRef)(
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
      opacity
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
      if (e.target === ref.current) {
        onAnimationComplete?.();
      }
      props.onAnimationEnd?.(e);
    };
    const combinedClassName = `animated ${className}`.trim();
    return import_react2.default.createElement(
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
        "data-animation-duration": duration ?? 0.5,
        "data-animation-delay": delay ?? 0
      },
      children
    );
  }
);
Animate.displayName = "Animate";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Animate,
  useAnimation
});
//# sourceMappingURL=index.js.map