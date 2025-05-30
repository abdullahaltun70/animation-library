import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    client: "src/client.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: false,
  minify: false,
  external: ["react", "react-dom"],
  async onSuccess() {
    const { execSync } = await import("child_process");
    console.log("Building SCSS...");
    execSync("sass styles/main.scss dist/styles.css --style=compressed", {
      stdio: "inherit",
    });
    execSync("cp dist/styles.css dist/styles.min.css", { stdio: "inherit" });
    console.log("SCSS build complete!");
  },
});
