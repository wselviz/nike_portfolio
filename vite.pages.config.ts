import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  root: fileURLToPath(new URL("./public-site", import.meta.url)),
  base: "/nike_portfolio/",
  publicDir: fileURLToPath(new URL("./public", import.meta.url)),
  plugins: [react()],
  define: {
    "import.meta.env.VITE_PUBLIC_PORTFOLIO": JSON.stringify("true"),
  },
  build: {
    outDir: fileURLToPath(new URL("./pages-dist", import.meta.url)),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1400,
  },
});
