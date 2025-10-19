import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";
import { readFileSync } from "fs";
import { resolve } from "path";

// Read version from package.json for cache versioning
const packageJson = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf-8"),
);
const appVersion = packageJson.version || "0.0.0";

const manifestForPlugIn: Partial<VitePWAOptions> = {
  registerType: "autoUpdate",
  includeAssets: ["favicon.ico", "yoga_icon.png"],
  workbox: {
    // Clean up outdated caches automatically
    cleanupOutdatedCaches: true,

    // Cache versioning using package.json version - updates force cache invalidation
    cacheId: `youtube-chunker-v${appVersion}`,

    // Runtime caching strategies
    runtimeCaching: [
      {
        // Cache YouTube API and video data with network-first strategy
        urlPattern: /^https:\/\/www\.youtube\.com\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "youtube-api-cache",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        // Cache images with cache-first strategy
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "image-cache",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
        },
      },
      {
        // Network-first for HTML to ensure updates are detected quickly
        urlPattern: /\.html$/,
        handler: "NetworkFirst",
        options: {
          cacheName: "html-cache",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24, // 1 day
          },
        },
      },
    ],

    // Skip waiting and claim clients immediately for faster updates
    skipWaiting: true,
    clientsClaim: true,
  },

  // Development options
  devOptions: {
    enabled: false, // Disable SW in dev mode for easier debugging
  },

  manifest: {
    name: "Youtube chunker",
    short_name: "youtube-chunker",
    description: "Youtube video chunked",
    icons: [
      {
        src: "favicon.ico",
        sizes: "64x64 32x32 24x24 16x16",
        type: "image/x-icon",
      },
      {
        src: "android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#171717",
    background_color: "#f0e7db",
    start_url: "?fullscreen=true",
    display: "standalone",
  },
};

// https://vite.dev/config/
export default defineConfig({
  base: "/youtube-chunk/",
  plugins: [react(), VitePWA(manifestForPlugIn)],
  define: {
    // Inject app version into the app for display/logging
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Material-UI core components
          "mui-core": ["@mui/material", "@emotion/react", "@emotion/styled"],
          // Material-UI icons separate chunk
          "mui-icons": ["@mui/icons-material"],
          // YouTube player library
          "react-youtube": ["react-youtube"],
          // Redux state management
          redux: [
            "@reduxjs/toolkit",
            "react-redux",
            "redux-persist",
            "redux-logger",
          ],
        },
      },
    },
  },
});
