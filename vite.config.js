import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/heteredox-economics/" : "./",
  plugins: [tailwindcss()],
  server: {
    port: 3000,
    open: false
  },
  build: {
    outDir: "dist",
    emptyOutDir: true
  }
});
