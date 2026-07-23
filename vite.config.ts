import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/nike_portfolio/",
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
  },
});
