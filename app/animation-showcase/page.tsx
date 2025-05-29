// Modern Animation Showcase Page (Server Component)

import { arrayConfig, complexConfig, edgeCaseConfig, singleConfig } from "../../runtime-verification";
import { ModernAnimate } from "../../src/components/ModernAnimate";



export default function AnimationShowcase() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)",
        fontFamily: "Inter, sans-serif",
        color: "#22223b",
        padding: "0 0 48px 0",
      }}
    >
      <header
        style={{
          padding: "48px 0 24px 0",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2.8rem",
            fontWeight: 800,
            letterSpacing: "-1px",
            marginBottom: 8,
            color: "#3b5bdb",
          }}
        >
          ✨ Modern Animation Library Showcase
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            color: "#495057",
            margin: 0,
          }}
        >
          Explore smooth, accessible, and customizable animations in
          React/Next.js
        </p>
      </header>
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 32,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <ShowcaseCard
          title="Array Animation"
          description="Multiple types, durations, and easings."
          config={arrayConfig}
        />
        <ShowcaseCard
          title="Single Animation"
          description="Simple rotate animation with custom easing."
          config={singleConfig}
        />
        <ShowcaseCard
          title="Edge Case"
          description="Handles empty arrays and undefined values gracefully."
          config={edgeCaseConfig}
        />
        <ShowcaseCard
          title="Complex Animation"
          description="Combines multiple types and respects reduced motion."
          config={complexConfig}
        />
      </section>
      <footer
        style={{
          marginTop: 48,
          textAlign: "center",
          color: "#868e96",
        }}
      >
        <small>
          © {new Date().getFullYear()} Animation Library Demo. Built with
          Next.js & React.
        </small>
      </footer>
    </main>
  );
}

function ShowcaseCard({ title, description, config }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px 0 rgba(60, 60, 100, 0.08)",
        padding: 32,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: 340,
      }}
    >
      <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 8 }}>
        {title}
      </h2>
      <p style={{ color: "#5c677d", marginBottom: 24 }}>{description}</p>
      <div
        style={{
          minHeight: 120,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Animation Demo */}
        <ModernAnimate {...config}>
          <div
            style={{
              width: 80,
              height: 80,
              background: "linear-gradient(135deg, #a5d8ff 0%, #d0bfff 100%)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: 24,
              color: "#22223b",
              boxShadow: "0 2px 8px 0 rgba(60, 60, 100, 0.10)",
            }}
          >
            Demo
          </div>
        </ModernAnimate>
      </div>
      <details style={{ marginTop: 24, width: "100%" }}>
        <summary
          style={{ cursor: "pointer", color: "#3b5bdb", fontWeight: 500 }}
        >
          View Config
        </summary>
        <pre
          style={{
            background: "#f1f3f5",
            borderRadius: 8,
            padding: 12,
            fontSize: 13,
            marginTop: 8,
            overflowX: "auto",
          }}
        >
          {JSON.stringify(config, null, 2)}
        </pre>
      </details>
    </div>
  );
}
