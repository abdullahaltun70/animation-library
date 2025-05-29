import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    client: "src/client.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: false, // Remove sourcemaps to reduce package size
  clean: true,
  outDir: "dist",
  minify: true, // Enable minification for smaller bundles
  treeshake: true,
  target: "es2020", // Modern target for better optimization
  platform: "browser",
  external: ["react", "react-dom"],
  esbuildOptions(options) {
    // Fix the named/default export warning
    options.mainFields = ["module", "main"];
  },
  // Fix export warnings
  bundle: true,
  legacyOutput: false,
  onSuccess: async () => {
    const fs = await import("fs");
    const path = await import("path");

    // Add a small delay to ensure DTS build is complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Compile SCSS to CSS
    try {
      const sass = await import("sass");
      console.log("🎨 Compiling SCSS to CSS...");

      // Generate regular CSS (no source map for smaller package)
      const result = sass.compile("styles/main.scss", {
        style: "expanded",
        quietDeps: true, // Suppress dependency warnings
      });

      fs.writeFileSync("dist/styles.css", result.css);
      console.log("✅ Generated dist/styles.css");

      // Generate minified version
      const minifiedResult = sass.compile("styles/main.scss", {
        style: "compressed",
        quietDeps: true,
      });
      fs.writeFileSync("dist/styles.min.css", minifiedResult.css);
      console.log("✅ Generated dist/styles.min.css");
    } catch (error) {
      console.warn("⚠️ Could not compile SCSS:", error.message);
    }

    // Add "use client" only to client entry files
    const clientFiles = ["dist/client.js", "dist/client.mjs"];

    // Add "use client" to client JavaScript files
    for (const file of clientFiles) {
      try {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, "utf8");
          // Remove any existing "use client" and add it at the very beginning
          const cleanContent = content.replace(/['"]use client['"];?\s*/g, "");
          const newContent = `"use client";\n${cleanContent}`;
          fs.writeFileSync(file, newContent);
          console.log(`✅ Added "use client" to ${file}`);
        }
      } catch (error) {
        console.warn(`⚠️ Could not modify ${file}:`, error.message);
      }
    }
  },
});
