import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/will-selviz-nike-universe/",
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
  },
});
