import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const appRoot = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: repoRoot,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(repoRoot, 'src')
    }
  },
  css: {
    postcss: path.resolve(appRoot, 'postcss.config.cjs')
  },
  build: {
    outDir: path.resolve(repoRoot, 'apps/web/dist'),
    emptyOutDir: true
  },
  test: {
    environment: 'jsdom'
  }
})
