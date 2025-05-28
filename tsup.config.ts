import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  minify: false, // Keep unminified for better debugging and "use client" preservation
  treeshake: true,
  target: "es2018", // Better browser compatibility
  platform: "browser", // Optimize for browser/client-side usage
  external: ["react", "react-dom"], // Keep React as external dependencies
  banner: {
    js: '"use client";',
  },
  onSuccess: async () => {
    const fs = await import("fs");
    const path = await import("path");

    // Add a small delay to ensure DTS build is complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Read and modify ONLY the JavaScript runtime files to ensure "use client" is at the very top
    // TypeScript declaration files (.d.ts, .d.mts) should NOT have "use client"
    const runtimeFiles = [
      "dist/index.js",
      "dist/index.mjs",
    ];

    const typeFiles = [
      "dist/index.d.ts", 
      "dist/index.d.mts",
    ];

    // Add "use client" to runtime JavaScript files
    for (const file of runtimeFiles) {
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

    // Clean TypeScript declaration files (remove any "use client" if present)
    for (const file of typeFiles) {
      try {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, "utf8");
          // Remove any "use client" directives from type files
          const cleanContent = content.replace(/['"]use client['"];?\s*/g, "");
          if (cleanContent !== content) {
            fs.writeFileSync(file, cleanContent);
            console.log(`✅ Cleaned "use client" from ${file}`);
          }
        }
      } catch (error) {
        console.warn(`⚠️ Could not clean ${file}:`, error.message);
      }
    }
  },
});
