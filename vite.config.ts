import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// A unique id for this build. Prefer the git commit SHA (stable & meaningful on
// Vercel); fall back to build time for local builds.
const BUILD_VERSION =
  process.env.VERCEL_GIT_COMMIT_SHA || new Date().toISOString()

// Emits a static `version.json` next to the built assets. The running app polls
// this file to detect when a newer front-end has been deployed.
function emitVersionFile(): Plugin {
  return {
    name: 'emit-version-file',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({ version: BUILD_VERSION }),
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), emitVersionFile()],
  define: {
    __BUILD_TIME__: JSON.stringify(BUILD_VERSION),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@models': path.resolve(__dirname, './src/models'),
      '@router': path.resolve(__dirname, './src/router'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@theme': path.resolve(__dirname, './src/theme'),
    },
  },
  build: {
    commonjsOptions: {
      include: [/html5-qrcode/, /node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  optimizeDeps: {
    include: ['html5-qrcode'],
  },
})
