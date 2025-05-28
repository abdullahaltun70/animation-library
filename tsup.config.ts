import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    client: "src/client.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  minify: false,
  treeshake: true,
  target: "es2018",
  platform: "browser",
  external: ["react", "react-dom"],
  onSuccess: async () => {
    const fs = await import("fs");
    const path = await import("path");

    // Add a small delay to ensure DTS build is complete
    await new Promise((resolve) => setTimeout(resolve, 100));

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
