import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const devBackendTarget =
  process.env.VITE_DEV_PROXY_TARGET ||
  process.env.BACKEND_URL ||
  "http://localhost:8080";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Dev only. Production reverse proxy is handled by nginx.conf.
      "/api": {
        target: devBackendTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/img": {
        target: devBackendTarget,
        changeOrigin: true,
      },
    },
  },
});
