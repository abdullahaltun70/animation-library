import React from "react";
import { ModernAnimate } from "./src/components/ModernAnimate";

export function TestModernAnimations() {
  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <h1>Test Modern Animations</h1>

      <div>
        <h2>Single Animation (should work)</h2>
        <ModernAnimate
          config={{
            type: "scale",
            duration: 1,
            scale: { start: 0.5, end: 1.2 },
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Single
          </div>
        </ModernAnimate>
      </div>

      <div>
        <h2>Array Animation (scale + bounce)</h2>
        <ModernAnimate
          config={{
            type: ["scale", "bounce"],
            duration: 1,
            scale: { start: 0.5, end: 1.2 },
            distance: 20,
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Array
          </div>
        </ModernAnimate>
      </div>

      <div>
        <h2>Complex Array Animation (slide + scale + rotate)</h2>
        <ModernAnimate
          config={{
            type: ["slide", "scale", "rotate"],
            duration: 1.5,
            distance: 50,
            scale: { start: 0.3, end: 1.1 },
            degrees: { start: 0, end: 180 },
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              background: "linear-gradient(135deg, #00b894 0%, #55a3ff 100%)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Complex
          </div>
        </ModernAnimate>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => window.location.reload()}>
          Restart Animations
        </button>
      </div>
    </div>
  );
}
