// src/hooks/useAnimation.ts
import { useCallback, useEffect, useRef, useState } from "react";
var DEFAULTS = {
  duration: 0.5,
  delay: 0,
  easing: "ease-out",
  opacityStart: 0,
  opacityEnd: 1,
  distance: 50,
  degrees: 360,
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
  const distance = configDistance ?? DEFAULTS.distance;
  const scale = configScale ?? DEFAULTS.scale;
  const axis = configAxis || DEFAULTS.axis;
  const opacity = {
    start: validateOpacity(configOpacity?.start, DEFAULTS.opacityStart),
    end: validateOpacity(configOpacity?.end, DEFAULTS.opacityEnd)
  };
  const [key, setKey] = useState(0);
  const elementRef = useRef(null);
  const animationTimerRef = useRef(null);
  const handleAnimationEndEvent = useCallback(
    (event) => {
      if (event.target === elementRef.current && onAnimationComplete) {
        onAnimationComplete(event);
        if (event.type === "animationend") {
          elementRef.current?.removeEventListener(
            "animationend",
            handleAnimationEndEvent
          );
        } else if (event.type === "transitionend") {
          elementRef.current?.removeEventListener(
            "transitionend",
            handleAnimationEndEvent
          );
        }
      }
    },
    [onAnimationComplete]
  );
  useEffect(() => {
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
        animationTimerRef.current = Number(
          window.setTimeout(() => {
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
          }, 20)
        );
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
  const replay = useCallback(() => {
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

// src/hooks/useModernAnimation.ts
import { useCallback as useCallback2, useEffect as useEffect2, useRef as useRef2, useState as useState2 } from "react";
function createCombinedAnimation(types, combinedName) {
  let fromTransforms = [];
  let toTransforms = [];
  let fromOpacity = "1";
  let toOpacity = "1";
  types.forEach((type) => {
    switch (type) {
      case "scale":
        fromTransforms.push("scale(var(--animation-scale, 0.8))");
        toTransforms.push("scale(1)");
        break;
      case "bounce":
        fromTransforms.push("translateY(var(--animation-distance, 20px))");
        toTransforms.push("translateY(0)");
        break;
      case "fade":
        fromOpacity = "var(--opacity-start, 0)";
        toOpacity = "var(--opacity-end, 1)";
        break;
      case "rotate":
        fromTransforms.push("rotate(0deg)");
        toTransforms.push("rotate(var(--animation-degrees, 180deg))");
        break;
      case "slide":
        fromTransforms.push("translateX(var(--animation-distance, 50px))");
        toTransforms.push("translateX(0)");
        break;
      case "slide-x":
        fromTransforms.push("translateX(var(--animation-distance, 50px))");
        toTransforms.push("translateX(0)");
        break;
      case "slide-y":
        fromTransforms.push("translateY(var(--animation-distance, 50px))");
        toTransforms.push("translateY(0)");
        break;
    }
  });
  const fromTransform = fromTransforms.length > 0 ? fromTransforms.join(" ") : "none";
  const toTransform = toTransforms.length > 0 ? toTransforms.join(" ") : "none";
  const keyframes = `
    @keyframes ${combinedName} {
      from {
        transform: ${fromTransform};
        opacity: ${fromOpacity};
      }
      to {
        transform: ${toTransform};
        opacity: ${toOpacity};
      }
    }
    
    .animate-combined-${combinedName} {
      animation-name: ${combinedName};
      animation-duration: var(--animation-duration, 0.5s);
      animation-delay: var(--animation-delay, 0s);
      animation-timing-function: var(--animation-easing, ease-out);
      animation-fill-mode: forwards;
      will-change: transform, opacity;
    }
  `;
  const styleElement = document.createElement("style");
  styleElement.setAttribute("data-animation", combinedName);
  styleElement.textContent = keyframes;
  document.head.appendChild(styleElement);
}
function useModernAnimation(config) {
  const elementRef = useRef2(null);
  const [state, setState] = useState2("idle");
  const [currentTrigger, setCurrentTrigger] = useState2(
    config.trigger || "mount"
  );
  const prefersReducedMotion = useCallback2(() => {
    return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const trigger = useCallback2(
    (triggerType = currentTrigger) => {
      const element = elementRef.current;
      if (!element || state === "animating") return;
      if (config.respectReducedMotion !== false && prefersReducedMotion()) {
        setState("completed");
        config.onComplete?.();
        return;
      }
      console.log('[Animation Hook] Setting state to "animating"');
      setState("animating");
      setCurrentTrigger(triggerType);
      if (config.duration !== void 0) {
        const duration = Array.isArray(config.duration) ? config.duration.length > 0 ? config.duration.reduce((a, b) => Math.max(a, b), 0) : 0.5 : config.duration;
        element.style.setProperty("--animation-duration", `${duration}s`);
        console.log(
          "[Animation Hook] Set --animation-duration:",
          `${duration}s`
        );
      }
      if (config.delay !== void 0) {
        const delay = Array.isArray(config.delay) ? config.delay.length > 0 ? config.delay[0] : 0 : config.delay;
        element.style.setProperty("--animation-delay", `${delay}s`);
      }
      if (config.easing) {
        const easing = Array.isArray(config.easing) ? config.easing.length > 0 ? config.easing[0] : "ease-out" : config.easing;
        element.style.setProperty("--animation-easing", easing);
      }
      if (config.distance !== void 0) {
        element.style.setProperty(
          "--animation-distance",
          `${config.distance}px`
        );
      }
      if (config.axis) {
        element.style.setProperty("--animation-axis", config.axis);
      }
      if (config.degrees !== void 0) {
        const degrees = typeof config.degrees === "number" ? config.degrees : config.degrees.end;
        element.style.setProperty("--animation-degrees", `${degrees}deg`);
      }
      if (config.scale !== void 0) {
        const scale = typeof config.scale === "number" ? config.scale : config.scale.end;
        element.style.setProperty("--animation-scale", `${scale}`);
      }
      const types = Array.isArray(config.type) ? config.type : [config.type];
      if (types.length === 1) {
        element.classList.add(`animate-${types[0]}`);
      } else {
        const combinedAnimationName = types.join("-");
        element.classList.add(`animate-combined-${combinedAnimationName}`);
        if (!document.querySelector(
          `style[data-animation="${combinedAnimationName}"]`
        )) {
          createCombinedAnimation(types, combinedAnimationName);
        }
      }
      element.dataset.animationState = "animating";
      element.dataset.animationTrigger = triggerType;
      config.onStart?.();
      const handleAnimationEnd = () => {
        setState("completed");
        element.dataset.animationState = "completed";
        config.onComplete?.();
        element.removeEventListener("animationend", handleAnimationEnd);
        element.removeEventListener("transitionend", handleAnimationEnd);
      };
      element.addEventListener("animationend", handleAnimationEnd);
      element.addEventListener("transitionend", handleAnimationEnd);
    },
    [config, state, currentTrigger, prefersReducedMotion]
  );
  const pause = useCallback2(() => {
    const element = elementRef.current;
    if (!element || state !== "animating") return;
    setState("paused");
    element.dataset.animationState = "paused";
    element.style.animationPlayState = "paused";
  }, [state]);
  const resume = useCallback2(() => {
    const element = elementRef.current;
    if (!element || state !== "paused") return;
    setState("animating");
    element.dataset.animationState = "animating";
    element.style.animationPlayState = "running";
  }, [state]);
  const restart = useCallback2(() => {
    const element = elementRef.current;
    if (!element) return;
    const types = Array.isArray(config.type) ? config.type : [config.type];
    if (types.length === 1) {
      element.classList.remove(`animate-${types[0]}`);
    } else {
      const combinedAnimationName = types.join("-");
      element.classList.remove(`animate-combined-${combinedAnimationName}`);
    }
    element.style.animationPlayState = "";
    setState("idle");
    element.dataset.animationState = "idle";
    element.offsetHeight;
    setTimeout(() => trigger(), 10);
  }, [config, trigger]);
  const cancel = useCallback2(() => {
    const element = elementRef.current;
    if (!element) return;
    setState("idle");
    element.dataset.animationState = "idle";
    element.style.animationPlayState = "";
    element.style.animation = "";
    const types = Array.isArray(config.type) ? config.type : [config.type];
    if (types.length === 1) {
      element.classList.remove(`animate-${types[0]}`);
    } else {
      const combinedAnimationName = types.join("-");
      element.classList.remove(`animate-combined-${combinedAnimationName}`);
    }
  }, [config]);
  useEffect2(() => {
    if (config.trigger === "mount" || !config.trigger) {
      trigger("mount");
    }
  }, [config.trigger, trigger]);
  const dataAttributes = {
    "data-animation-state": state,
    "data-animation-trigger": currentTrigger
  };
  return {
    ref: elementRef,
    state,
    trigger,
    pause,
    resume,
    restart,
    cancel,
    dataAttributes
  };
}

// src/hooks/useAnimationSequence.ts
import { useCallback as useCallback3, useEffect as useEffect3, useRef as useRef3, useState as useState3 } from "react";
function useAnimationSequence(sequence) {
  const elementRef = useRef3(null);
  const [currentStep, setCurrentStep] = useState3(0);
  const [state, setState] = useState3("idle");
  const [isRunning, setIsRunning] = useState3(false);
  const timeoutsRef = useRef3([]);
  const clearAllTimeouts = useCallback3(() => {
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current = [];
  }, []);
  const executeStep = useCallback3(
    async (stepIndex) => {
      if (stepIndex >= sequence.steps.length) {
        setState("completed");
        setIsRunning(false);
        sequence.onComplete?.();
        return;
      }
      const step = sequence.steps[stepIndex];
      setCurrentStep(stepIndex);
      if (step.parallel) {
        const promises = step.animations.map((animConfig) => {
          return new Promise((resolve) => {
            const element = elementRef.current;
            if (!element) {
              resolve();
              return;
            }
            Array.from(element.classList).forEach((className) => {
              if (className.startsWith("animate-")) {
                element.classList.remove(className);
              }
            });
            element.style.setProperty(
              "--animation-duration",
              `${animConfig.duration || 0.5}s`
            );
            element.style.setProperty(
              "--animation-delay",
              `${animConfig.delay || 0}s`
            );
            element.style.setProperty(
              "--animation-easing",
              animConfig.easing || "ease-out"
            );
            let animationClassName = `animate-${animConfig.type}`;
            if (animConfig.type === "fade") {
              element.style.setProperty(
                "--opacity-start",
                `${animConfig.opacity?.start ?? 0}`
              );
              element.style.setProperty(
                "--opacity-end",
                `${animConfig.opacity?.end ?? 1}`
              );
            } else if (animConfig.type === "slide") {
              const distance = animConfig.distance || 50;
              const axis = animConfig.axis || "y";
              element.style.setProperty("--distance", `${distance}px`);
              element.style.setProperty(
                "--opacity-start",
                `${animConfig.opacity?.start ?? 0}`
              );
              element.style.setProperty(
                "--opacity-end",
                `${animConfig.opacity?.end ?? 1}`
              );
              animationClassName = `animate-slide-${axis}-${distance > 0 ? "positive" : "negative"}`;
            } else if (animConfig.type === "scale") {
              element.style.setProperty(
                "--scale-start",
                `${typeof animConfig.scale === "object" && animConfig.scale !== null && typeof animConfig.scale.start === "number" ? animConfig.scale.start : 1}`
              );
              element.style.setProperty(
                "--scale-end",
                `${(typeof animConfig.scale === "object" && animConfig.scale !== null && "end" in animConfig.scale ? animConfig.scale.end : animConfig.scale) ?? 0.8}`
              );
              element.style.setProperty(
                "--opacity-start",
                `${animConfig.opacity?.start ?? 0}`
              );
              element.style.setProperty(
                "--opacity-end",
                `${animConfig.opacity?.end ?? 1}`
              );
            } else if (animConfig.type === "rotate") {
              const startDeg = (typeof animConfig.degrees === "object" ? animConfig.degrees.start : 0) ?? 0;
              const endDeg = (typeof animConfig.degrees === "object" ? animConfig.degrees.end : animConfig.degrees) ?? 360;
              element.style.setProperty(
                "--rotation-degrees-start",
                `${startDeg}deg`
              );
              element.style.setProperty(
                "--rotation-degrees-end",
                `${endDeg}deg`
              );
            } else if (animConfig.type === "bounce") {
              element.style.setProperty(
                "--distance",
                `${animConfig.distance || 50}px`
              );
            }
            element.classList.add(animationClassName);
            let fallbackTimeoutId;
            const handleAnimationEnd = () => {
              element.removeEventListener("animationend", handleAnimationEnd);
              element.removeEventListener("transitionend", handleAnimationEnd);
              clearTimeout(fallbackTimeoutId);
              resolve();
            };
            element.addEventListener("animationend", handleAnimationEnd);
            element.addEventListener("transitionend", handleAnimationEnd);
            const totalDuration = (animConfig.duration || 0.5) * 1e3 + (animConfig.delay || 0) * 1e3 + 100;
            fallbackTimeoutId = setTimeout(handleAnimationEnd, totalDuration);
            timeoutsRef.current.push(fallbackTimeoutId);
          });
        });
        await Promise.all(promises);
      } else {
        for (const animConfig of step.animations) {
          await new Promise((resolve) => {
            const element = elementRef.current;
            if (!element) {
              resolve();
              return;
            }
            Array.from(element.classList).forEach((className) => {
              if (className.startsWith("animate-")) {
                element.classList.remove(className);
              }
            });
            element.style.setProperty(
              "--animation-duration",
              `${animConfig.duration || 0.5}s`
            );
            element.style.setProperty(
              "--animation-delay",
              `${animConfig.delay || 0}s`
            );
            element.style.setProperty(
              "--animation-easing",
              animConfig.easing || "ease-out"
            );
            let animationClassName = `animate-${animConfig.type}`;
            if (animConfig.type === "fade") {
              element.style.setProperty(
                "--opacity-start",
                `${animConfig.opacity?.start ?? 0}`
              );
              element.style.setProperty(
                "--opacity-end",
                `${animConfig.opacity?.end ?? 1}`
              );
            } else if (animConfig.type === "slide") {
              const distance = animConfig.distance || 50;
              const axis = animConfig.axis || "y";
              element.style.setProperty("--distance", `${distance}px`);
              element.style.setProperty(
                "--opacity-start",
                `${animConfig.opacity?.start ?? 0}`
              );
              element.style.setProperty(
                "--opacity-end",
                `${animConfig.opacity?.end ?? 1}`
              );
              animationClassName = `animate-slide-${axis}-${distance > 0 ? "positive" : "negative"}`;
            } else if (animConfig.type === "scale") {
              element.style.setProperty(
                "--scale-start",
                `${typeof animConfig.scale === "object" && animConfig.scale !== null && "start" in animConfig.scale && typeof animConfig.scale.start === "number" ? animConfig.scale.start : 1}`
              );
              element.style.setProperty(
                "--scale-end",
                `${typeof animConfig.scale === "object" && animConfig.scale !== null && "end" in animConfig.scale && typeof animConfig.scale.end === "number" ? animConfig.scale.end : typeof animConfig.scale === "number" ? animConfig.scale : 0.8}`
              );
              element.style.setProperty(
                "--opacity-start",
                `${animConfig.opacity?.start ?? 0}`
              );
              element.style.setProperty(
                "--opacity-end",
                `${animConfig.opacity?.end ?? 1}`
              );
            } else if (animConfig.type === "rotate") {
              const startDeg = (typeof animConfig.degrees === "object" ? animConfig.degrees.start : 0) ?? 0;
              const endDeg = (typeof animConfig.degrees === "object" ? animConfig.degrees.end : animConfig.degrees) ?? 360;
              element.style.setProperty(
                "--rotation-degrees-start",
                `${startDeg}deg`
              );
              element.style.setProperty(
                "--rotation-degrees-end",
                `${endDeg}deg`
              );
            } else if (animConfig.type === "bounce") {
              element.style.setProperty(
                "--distance",
                `${animConfig.distance || 50}px`
              );
            }
            element.classList.add(animationClassName);
            let fallbackTimeoutId;
            const handleAnimationEnd = () => {
              element.removeEventListener("animationend", handleAnimationEnd);
              element.removeEventListener("transitionend", handleAnimationEnd);
              clearTimeout(fallbackTimeoutId);
              resolve();
            };
            element.addEventListener("animationend", handleAnimationEnd);
            element.addEventListener("transitionend", handleAnimationEnd);
            const totalDuration = (animConfig.duration || 0.5) * 1e3 + (animConfig.delay || 0) * 1e3 + 100;
            fallbackTimeoutId = setTimeout(handleAnimationEnd, totalDuration);
            timeoutsRef.current.push(fallbackTimeoutId);
          });
        }
      }
      sequence.onStepComplete?.(stepIndex);
      if (step.delay) {
        const timeout = setTimeout(() => {
          executeStep(stepIndex + 1);
        }, step.delay * 1e3);
        timeoutsRef.current.push(timeout);
      } else {
        executeStep(stepIndex + 1);
      }
    },
    [sequence, clearAllTimeouts]
    // Added clearAllTimeouts
  );
  const start = useCallback3(() => {
    if (isRunning) return;
    setState("animating");
    setIsRunning(true);
    setCurrentStep(0);
    executeStep(0);
  }, [isRunning, executeStep]);
  const pause = useCallback3(() => {
    if (!isRunning) return;
    setState("paused");
    setIsRunning(false);
    clearAllTimeouts();
  }, [isRunning, clearAllTimeouts]);
  const resume = useCallback3(() => {
    if (isRunning || state !== "paused") return;
    setState("animating");
    setIsRunning(true);
    executeStep(currentStep);
  }, [isRunning, state, currentStep, executeStep]);
  const restart = useCallback3(() => {
    const element = elementRef.current;
    if (element) {
      Array.from(element.classList).forEach((className) => {
        if (className.startsWith("animate-")) {
          element.classList.remove(className);
        }
      });
    }
    clearAllTimeouts();
    setState("idle");
    setIsRunning(false);
    setCurrentStep(0);
    Promise.resolve().then(() => {
      start();
    });
  }, [clearAllTimeouts, start]);
  const cancel = useCallback3(() => {
    const element = elementRef.current;
    if (element) {
      Array.from(element.classList).forEach((className) => {
        if (className.startsWith("animate-")) {
          element.classList.remove(className);
        }
      });
      element.style.setProperty("--animation-duration", null);
      element.style.setProperty("--animation-delay", null);
      element.style.setProperty("--animation-easing", null);
    }
    clearAllTimeouts();
    setState("idle");
    setIsRunning(false);
    setCurrentStep(0);
  }, [clearAllTimeouts]);
  const goToStep = useCallback3(
    (stepIndex) => {
      if (stepIndex < 0 || stepIndex >= sequence.steps.length) return;
      const element = elementRef.current;
      if (element) {
        Array.from(element.classList).forEach((className) => {
          if (className.startsWith("animate-")) {
            element.classList.remove(className);
          }
        });
      }
      clearAllTimeouts();
      setCurrentStep(stepIndex);
      if (isRunning) {
        setState("animating");
        executeStep(stepIndex);
      } else {
      }
    },
    [sequence.steps.length, clearAllTimeouts, isRunning, executeStep]
    // Removed 'elementRef'
  );
  useEffect3(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);
  return {
    ref: elementRef,
    currentStep,
    totalSteps: sequence.steps.length,
    state,
    start,
    pause,
    resume,
    restart,
    cancel,
    goToStep
  };
}

// src/hooks/useStaggeredAnimation.ts
import { useCallback as useCallback4, useEffect as useEffect4, useRef as useRef4, useState as useState4, createRef } from "react";
function useStaggeredAnimation(config, elementCount = 0) {
  const [refs, setRefs] = useState4([]);
  const [isAnimating, setIsAnimating] = useState4(false);
  const timeoutsRef = useRef4([]);
  const activeAnimationsRef = useRef4(/* @__PURE__ */ new Set());
  useEffect4(() => {
    setRefs((oldRefs) => {
      if (oldRefs.length === elementCount) {
        return oldRefs;
      }
      const newRefsArray = Array.from(
        { length: elementCount },
        (_, i) => oldRefs[i] || createRef()
      );
      return newRefsArray;
    });
  }, [elementCount]);
  const clearAllTimeouts = useCallback4(() => {
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current = [];
  }, []);
  const getStaggerOrder = useCallback4(
    (totalElements) => {
      const indices = Array.from({ length: totalElements }, (_, i) => i);
      switch (config.direction) {
        case "reverse":
          return indices.reverse();
        case "center-out":
          const center = Math.floor(totalElements / 2);
          const result = [];
          let left = center;
          let right = center + 1;
          result.push(center);
          while (left > 0 || right < totalElements) {
            if (left > 0) result.push(--left);
            if (right < totalElements) result.push(right++);
          }
          return result;
        default:
          return indices;
      }
    },
    [config.direction]
  );
  const animateElement = useCallback4(
    (elementRef, animConfig, elementIndex) => {
      const element = elementRef.current;
      if (!element) return Promise.resolve();
      return new Promise((resolve) => {
        activeAnimationsRef.current.add(elementIndex);
        const animationType = Array.isArray(animConfig.type) ? animConfig.type[0] : animConfig.type;
        element.classList.add(`animate-${animationType}`);
        if (animConfig.duration !== void 0) {
          element.style.setProperty(
            "--animation-duration",
            `${animConfig.duration}s`
          );
        }
        if (animConfig.delay !== void 0) {
          element.style.setProperty(
            "--animation-delay",
            `${animConfig.delay}s`
          );
        }
        if (animConfig.easing) {
          const easingValue = Array.isArray(animConfig.easing) ? animConfig.easing[0] : animConfig.easing;
          element.style.setProperty("--animation-easing", easingValue);
        }
        const handleAnimationEnd = () => {
          activeAnimationsRef.current.delete(elementIndex);
          element.removeEventListener("animationend", handleAnimationEnd);
          element.removeEventListener("transitionend", handleAnimationEnd);
          resolve();
        };
        element.addEventListener("animationend", handleAnimationEnd);
        element.addEventListener("transitionend", handleAnimationEnd);
        const animDuration = typeof animConfig.duration === "number" ? animConfig.duration : 0.5;
        const animDelay = typeof animConfig.delay === "number" ? animConfig.delay : 0;
        const fallbackTimeout = setTimeout(() => {
          handleAnimationEnd();
        }, (animDuration + animDelay) * 1e3 + 100);
        timeoutsRef.current.push(fallbackTimeout);
      });
    },
    []
  );
  const trigger = useCallback4(() => {
    if (isAnimating || refs.length === 0) return;
    setIsAnimating(true);
    clearAllTimeouts();
    activeAnimationsRef.current.clear();
    const staggerOrder = getStaggerOrder(refs.length);
    let animationIndex = 0;
    const triggerNext = () => {
      if (animationIndex >= staggerOrder.length) {
        setIsAnimating(false);
        return;
      }
      const elementIndex = staggerOrder[animationIndex];
      const elementRef = refs[elementIndex];
      if (config.maxConcurrent && activeAnimationsRef.current.size >= config.maxConcurrent) {
        setTimeout(triggerNext, 50);
        return;
      }
      config.animations.forEach((animConfig, configIndex) => {
        const baseDelay = typeof animConfig.delay === "number" ? animConfig.delay : 0;
        const staggerDelay = configIndex * config.delay;
        const delayedAnimConfig = {
          ...animConfig,
          delay: baseDelay + staggerDelay
        };
        animateElement(elementRef, delayedAnimConfig, elementIndex);
      });
      animationIndex++;
      if (animationIndex < staggerOrder.length) {
        const timeout = setTimeout(triggerNext, config.delay * 1e3);
        timeoutsRef.current.push(timeout);
      }
    };
    triggerNext();
  }, [
    isAnimating,
    refs,
    config,
    getStaggerOrder,
    animateElement,
    clearAllTimeouts
  ]);
  const pause = useCallback4(() => {
    refs.forEach((ref) => {
      if (ref.current) {
        ref.current.style.animationPlayState = "paused";
      }
    });
  }, [refs]);
  const resume = useCallback4(() => {
    refs.forEach((ref) => {
      if (ref.current) {
        ref.current.style.animationPlayState = "running";
      }
    });
  }, [refs]);
  const restart = useCallback4(() => {
    clearAllTimeouts();
    activeAnimationsRef.current.clear();
    setIsAnimating(false);
    refs.forEach((ref) => {
      if (ref.current) {
        config.animations.forEach((animConfig) => {
          const animationType = Array.isArray(animConfig.type) ? animConfig.type[0] : animConfig.type;
          ref.current?.classList.remove(`animate-${animationType}`);
        });
      }
    });
    setTimeout(() => {
      trigger();
    }, 10);
  }, [clearAllTimeouts, refs, config.animations, trigger]);
  const cancel = useCallback4(() => {
    clearAllTimeouts();
    activeAnimationsRef.current.clear();
    setIsAnimating(false);
    refs.forEach((ref) => {
      if (ref.current) {
        ref.current.style.animationPlayState = "paused";
        config.animations.forEach((animConfig) => {
          const animationType = Array.isArray(animConfig.type) ? animConfig.type[0] : animConfig.type;
          ref.current?.classList.remove(`animate-${animationType}`);
        });
      }
    });
  }, [clearAllTimeouts, refs, config.animations]);
  const addElement = useCallback4(() => {
    const newRef = createRef();
    setRefs((prev) => [...prev, newRef]);
    return newRef;
  }, []);
  const removeElement = useCallback4(
    (index) => {
      if (index < 0) return;
      setRefs((prev) => {
        if (index >= prev.length) return prev;
        return prev.filter((_, i) => i !== index);
      });
    },
    []
    // Empty dependency array
  );
  useEffect4(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);
  return {
    refs,
    trigger,
    pause,
    resume,
    restart,
    cancel
    // addElement, // Commented out
    // removeElement, // Commented out
  };
}

// src/components/ServerAnimate.tsx
import * as React from "react";
var ServerAnimate = ({
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
    ...props.style
  };
  if (selfContained) {
    const { method, trigger, content, defaultOpen = false, id } = selfContained;
    if (method === "details") {
      return React.createElement(
        "details",
        {
          className: "server-animate-details",
          style,
          open: defaultOpen,
          id,
          ...props
        },
        [
          React.createElement(
            "summary",
            {
              key: "summary",
              className: "server-animate-trigger"
            },
            [
              React.createElement(
                "div",
                {
                  key: "trigger-content",
                  className: `${combinedClassName} details-trigger-animation`,
                  "data-state": "closed",
                  style
                },
                trigger || children
              ),
              React.createElement("div", {
                key: "chevron",
                className: "server-animate-chevron"
              })
            ]
          ),
          React.createElement(
            "div",
            {
              key: "content",
              className: `server-animate-content ${typeClass}-content`,
              style
            },
            content || children
          )
        ]
      );
    }
    if (method === "checkbox") {
      const accordionId = id || `server-accordion-${Math.random().toString(36).substr(2, 9)}`;
      return React.createElement(
        "div",
        {
          className: "server-animate-checkbox-wrapper",
          style,
          ...props
        },
        [
          React.createElement("input", {
            key: "input",
            type: "checkbox",
            id: accordionId,
            className: "server-animate-checkbox",
            defaultChecked: defaultOpen
          }),
          React.createElement(
            "label",
            {
              key: "label",
              htmlFor: accordionId,
              className: "server-animate-trigger"
            },
            [
              React.createElement(
                "div",
                {
                  key: "trigger-content",
                  className: `${combinedClassName} checkbox-trigger-animation`,
                  "data-state": "closed",
                  style
                },
                trigger || children
              ),
              React.createElement("div", {
                key: "chevron",
                className: "server-animate-chevron"
              })
            ]
          ),
          React.createElement(
            "div",
            {
              key: "content",
              className: `server-animate-content ${typeClass}-content`,
              style
            },
            content || children
          )
        ]
      );
    }
  }
  return React.createElement(
    Component,
    {
      ...props,
      className: combinedClassName,
      "data-state": state,
      style
    },
    children
  );
};

// src/components/Animate.tsx
import React2, { forwardRef } from "react";
var Animate = forwardRef(
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
      if (e.target === ref.current) {
        onAnimationComplete?.();
      }
      props.onAnimationEnd?.(e);
    };
    const combinedClassName = `animated ${className}`.trim();
    return React2.createElement(
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

// src/components/ModernAnimate.tsx
import React3, { forwardRef as forwardRef2 } from "react";
var ModernAnimate = forwardRef2(
  ({
    children,
    config,
    as: Component = "div",
    className = "",
    onStateChange,
    // Separate config from other props that might be HTML attributes
    ...htmlProps
    // these are the actual HTML attributes
  }, forwardedRef) => {
    const {
      ref: animationRef,
      state,
      trigger,
      pause,
      resume,
      restart,
      cancel,
      dataAttributes
    } = useModernAnimation(config);
    const elementRef = animationRef;
    React3.useEffect(() => {
      onStateChange?.(state);
    }, [state, onStateChange]);
    React3.useImperativeHandle(
      forwardedRef,
      () => ({
        trigger,
        pause,
        resume,
        restart,
        cancel,
        state
      }),
      [trigger, pause, resume, restart, cancel, state]
    );
    return React3.createElement(
      Component,
      {
        ref: elementRef,
        className: `modern-animate ${className}`.trim(),
        ...dataAttributes,
        // these are fine, they are data-* attributes
        ...htmlProps
        // spread only the remaining valid HTML attributes
      },
      children
    );
  }
);
ModernAnimate.displayName = "ModernAnimate";

// src/components/SequenceAnimate.tsx
import React4, { forwardRef as forwardRef3 } from "react";
var SequenceAnimate = forwardRef3(
  ({
    children,
    sequence,
    as: Component = "div",
    className = "",
    autoStart = false,
    onStepChange,
    ...props
  }, forwardedRef) => {
    const {
      ref: sequenceRef,
      currentStep,
      totalSteps,
      state,
      start,
      pause,
      resume,
      restart,
      cancel,
      goToStep
    } = useAnimationSequence(sequence);
    const elementRef = sequenceRef;
    React4.useEffect(() => {
      if (autoStart && state === "idle") {
        start();
      }
    }, [autoStart, state, start]);
    React4.useEffect(() => {
      onStepChange?.(currentStep);
    }, [currentStep, onStepChange]);
    React4.useImperativeHandle(
      forwardedRef,
      () => ({
        start,
        pause,
        resume,
        restart,
        cancel,
        goToStep,
        currentStep,
        totalSteps,
        state
      }),
      [
        start,
        pause,
        resume,
        restart,
        cancel,
        goToStep,
        currentStep,
        totalSteps,
        state
      ]
    );
    return React4.createElement(
      Component,
      {
        ref: elementRef,
        className: `sequence-animate ${className}`.trim(),
        "data-sequence-state": state,
        "data-current-step": currentStep,
        "data-total-steps": totalSteps,
        ...props
      },
      children
    );
  }
);
SequenceAnimate.displayName = "SequenceAnimate";

// src/components/StaggeredAnimate.tsx
import React5, { forwardRef as forwardRef4, Children } from "react";
var StaggeredAnimate = forwardRef4(
  ({
    children,
    itemAnimation,
    staggerDelay,
    staggerDirection,
    maxConcurrent,
    as: Component = "div",
    className = "",
    itemClassName = "",
    autoStart = false,
    ...props
  }, forwardedRef) => {
    const childrenArray = Children.toArray(children);
    const staggerHookConfig = {
      animations: [itemAnimation],
      // Wrap the single itemAnimation into an array as expected by the hook
      delay: staggerDelay,
      direction: staggerDirection,
      maxConcurrent
    };
    const { refs, trigger, pause, resume, restart, cancel } = useStaggeredAnimation(staggerHookConfig, childrenArray.length);
    React5.useEffect(() => {
      if (autoStart && refs.length > 0) {
        trigger();
      }
    }, [autoStart, refs.length, trigger]);
    React5.useImperativeHandle(
      forwardedRef,
      () => ({
        trigger,
        pause,
        resume,
        restart,
        cancel,
        elementCount: refs.length
      }),
      [trigger, pause, resume, restart, cancel, refs.length]
    );
    const enhancedChildren = childrenArray.map((child, index) => {
      if (!React5.isValidElement(child)) return child;
      const ref = refs[index];
      if (!ref) return child;
      return React5.cloneElement(child, {
        ref,
        className: `${child.props.className || ""} staggered-item ${itemClassName}`.trim(),
        "data-stagger-index": index,
        "data-stagger-total": childrenArray.length
      });
    });
    return React5.createElement(
      Component,
      {
        className: `staggered-animate ${className}`.trim(),
        "data-stagger-direction": staggerDirection || "forward",
        "data-stagger-count": childrenArray.length,
        ...props
      },
      enhancedChildren
    );
  }
);
StaggeredAnimate.displayName = "StaggeredAnimate";

// src/components/InteractiveAnimate.tsx
import React6, { forwardRef as forwardRef5 } from "react";
var InteractiveAnimate = forwardRef5(
  ({
    children,
    hoverConfig,
    focusConfig,
    clickConfig,
    as: Component = "div",
    className = "",
    disabled = false,
    style,
    ...props
  }, ref) => {
    const cssProps = React6.useMemo(() => {
      const props2 = {};
      if (hoverConfig) {
        props2["--hover-duration"] = `${hoverConfig.duration || 0.2}s`;
        const hoverEasing = Array.isArray(hoverConfig.easing) ? hoverConfig.easing[0] : hoverConfig.easing;
        props2["--hover-easing"] = hoverEasing || "ease-out";
        if (typeof hoverConfig.scale === "number") {
          props2["--hover-scale"] = `${hoverConfig.scale}`;
        } else if (hoverConfig.scale?.end) {
          props2["--hover-scale"] = `${hoverConfig.scale.end}`;
        }
        if (hoverConfig.distance) {
          props2["--hover-distance"] = `${hoverConfig.distance}px`;
        }
      }
      if (focusConfig) {
        props2["--focus-duration"] = `${focusConfig.duration || 0.2}s`;
        const focusEasing = Array.isArray(focusConfig.easing) ? focusConfig.easing[0] : focusConfig.easing;
        props2["--focus-easing"] = focusEasing || "ease-out";
        if (typeof focusConfig.scale === "number") {
          props2["--focus-scale"] = `${focusConfig.scale}`;
        } else if (focusConfig.scale?.end) {
          props2["--focus-scale"] = `${focusConfig.scale.end}`;
        }
      }
      if (clickConfig) {
        props2["--click-duration"] = `${clickConfig.duration || 0.1}s`;
        const clickEasing = Array.isArray(clickConfig.easing) ? clickConfig.easing[0] : clickConfig.easing;
        props2["--click-easing"] = clickEasing || "ease-out";
        if (typeof clickConfig.scale === "number") {
          props2["--click-scale"] = `${clickConfig.scale}`;
        } else if (clickConfig.scale?.end) {
          props2["--click-scale"] = `${clickConfig.scale.end}`;
        }
      }
      return props2;
    }, [hoverConfig, focusConfig, clickConfig]);
    const interactiveClasses = React6.useMemo(() => {
      const classes = ["interactive-animate"];
      if (hoverConfig) {
        const hoverType = Array.isArray(hoverConfig.type) ? hoverConfig.type[0] : hoverConfig.type;
        classes.push(`interactive-hover-${hoverType}`);
      }
      if (focusConfig) {
        const focusType = Array.isArray(focusConfig.type) ? focusConfig.type[0] : focusConfig.type;
        classes.push(`interactive-focus-${focusType}`);
      }
      if (clickConfig) {
        const clickType = Array.isArray(clickConfig.type) ? clickConfig.type[0] : clickConfig.type;
        classes.push(`interactive-click-${clickType}`);
      }
      return classes.join(" ");
    }, [hoverConfig, focusConfig, clickConfig]);
    const combinedStyle = {
      ...cssProps,
      ...style
    };
    return React6.createElement(
      Component,
      {
        ref,
        className: `${interactiveClasses} ${className}`.trim(),
        style: combinedStyle,
        "data-interactive": !disabled,
        "data-has-hover": !!hoverConfig,
        "data-has-focus": !!focusConfig,
        "data-has-click": !!clickConfig,
        ...props
      },
      children
    );
  }
);
InteractiveAnimate.displayName = "InteractiveAnimate";

// src/components/StateBasedAnimate.tsx
import React7 from "react";
var StateBasedAnimate = ({
  children,
  animationType,
  duration = 300,
  easing = "cubic-bezier(0.87, 0, 0.13, 1)",
  degrees = 180,
  distance = 200,
  scale = 1.1,
  className = "",
  stateSelector,
  triggerState = "open"
}) => {
  const elementRef = React7.useRef(null);
  const [isActive, setIsActive] = React7.useState(false);
  React7.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const checkParentState = () => {
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
    checkParentState();
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "data-state") {
          checkParentState();
        }
      });
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-state"],
      subtree: true
    });
    return () => observer.disconnect();
  }, [triggerState]);
  const instanceId = React7.useId();
  const animationClass = `state-animate-${animationType}`;
  const customProperties = {
    "--animation-duration": `${duration}ms`,
    "--animation-easing": easing,
    "--rotation-degrees": `${degrees}deg`,
    "--slide-distance": `${distance}px`,
    "--scale-factor": scale
  };
  const activeClass = isActive ? "state-animate-active" : "";
  return React7.createElement(
    "span",
    {
      ref: elementRef,
      className: `state-animate ${animationClass} ${activeClass} ${className}`.trim(),
      style: customProperties,
      "data-state-selector": stateSelector,
      "data-trigger-state": triggerState,
      "data-instance-id": instanceId,
      "data-is-active": isActive
    },
    children
  );
};
var StateBasedAnimate_default = StateBasedAnimate;

// src/components/RadixAnimate.tsx
import React8 from "react";
var RadixAnimate = ({
  children,
  animationType,
  duration = 300,
  easing = "cubic-bezier(0.87, 0, 0.13, 1)",
  degrees = 180,
  scale = 1,
  className = ""
}) => {
  const animationClass = `state-animate-${animationType}`;
  const customProperties = {
    "--animation-duration": `${duration}ms`,
    "--animation-easing": easing,
    "--rotation-degrees": `${degrees}deg`,
    "--scale-factor": scale
  };
  return React8.createElement(
    "div",
    {
      className: `state-animate ${animationClass} ${className}`,
      style: customProperties
    },
    children
  );
};
var RadixAnimate_default = RadixAnimate;

export {
  useAnimation,
  useModernAnimation,
  useAnimationSequence,
  useStaggeredAnimation,
  ServerAnimate,
  Animate,
  ModernAnimate,
  SequenceAnimate,
  StaggeredAnimate,
  InteractiveAnimate,
  StateBasedAnimate_default,
  RadixAnimate_default
};
