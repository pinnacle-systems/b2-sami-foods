import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath } from "url"
import { dirname, resolve } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const apiTarget = env.VITE_API_PROXY_TARGET ?? "http://localhost:6000"

  return {
    plugins: [react({ include: /\.(js|jsx|ts|tsx)$/ })],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    define: {
      "process.env.REACT_APP_SERVER_URL": JSON.stringify(
        env.REACT_APP_SERVER_URL ?? "/api/"
      ),
    },
    esbuild: {
      loader: "jsx",
      include: /src\/.*\.[jt]sx?$/,
      exclude: [],
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
    build: {
      outDir: "dist",
      rollupOptions: {
        output: {
          manualChunks: {
            // Core React runtime — very rarely changes, stays cached
            "vendor-react": ["react", "react-dom", "react-router-dom"],
            // Redux + RTK Query
            "vendor-redux": ["@reduxjs/toolkit", "react-redux"],
            // All Radix / shadcn UI primitives
            "vendor-ui": [
              "@radix-ui/react-dialog",
              "@radix-ui/react-dropdown-menu",
              "@radix-ui/react-label",
              "@radix-ui/react-select",
              "@radix-ui/react-slot",
              "@radix-ui/react-toast",
            ],
          },
        },
      },
    },
    server: {
      host: "0.0.0.0",
      proxy: {
        "/socket.io": {
          target: apiTarget,
          changeOrigin: true,
          ws: true,
        },
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
