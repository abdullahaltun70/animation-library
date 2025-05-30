import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/client.ts",
  },
  format: ["esm"], // ESM only for modern client-side usage
  dts: true,
  clean: true,
  sourcemap: false,
  minify: true, // Enable minification for smaller bundle
  treeshake: true, // Enable tree-shaking
  splitting: false, // Disable code splitting for simpler single bundle
  target: "es2020", // Modern target for smaller bundle
  external: ["react", "react-dom"],
  bundle: true, // Bundle everything into a single file
  outExtension({ format }) {
    return {
      js: `.js`,
      dts: `.d.ts`,
    };
  },
  esbuildOptions(options) {
    // Optimize for client-side bundle with maximum compression
    options.conditions = ["import", "module", "browser"];
    options.platform = "browser";
    options.treeShaking = true;
    options.minifyIdentifiers = true;
    options.minifySyntax = true;
    options.minifyWhitespace = true;
  },
  async onSuccess() {
    const { execSync } = await import("child_process");
    const fs = await import("fs");

    console.log("Building SCSS...");
    execSync(
      "sass styles/main.scss dist/styles.css --style=compressed --no-source-map",
      {
        stdio: "inherit",
      }
    );
    console.log("SCSS build complete!");

    // Add "use client" directive to the built JS file
    const jsFile = "dist/index.js";
    if (fs.existsSync(jsFile)) {
      const content = fs.readFileSync(jsFile, "utf8");
      fs.writeFileSync(jsFile, `"use client";\n${content}`);
      console.log("Added 'use client' directive to built file");
    }
  },
});
