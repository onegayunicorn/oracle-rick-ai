import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  server: {
    host: "0.0.0.0",
    port: 5173,
  },

  preview: {
    port: 4173,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@layout": path.resolve(__dirname, "./src/components/layout"),
      "@viewport": path.resolve(__dirname, "./src/components/viewport"),
      "@panels": path.resolve(__dirname, "./src/components/panels"),
      "@state": path.resolve(__dirname, "./src/state"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
    },
  },

  build: {
    sourcemap: true,
    target: "esnext",
  },
});
