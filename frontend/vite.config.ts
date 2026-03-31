import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  root: ".",
  publicDir: "public",
  plugins: [react(), tailwindcss()],
  server: {
    port: 3001,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@root-shared": path.resolve(__dirname, "../shared/"),
      "@public/*": path.resolve(__dirname, "public/"),
    },
  },
});
