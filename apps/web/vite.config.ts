import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

export default defineConfig({
  root: repoRoot,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(repoRoot, 'src')
    }
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss({ config: path.resolve(repoRoot, 'tailwind.config.js') }),
        autoprefixer()
      ]
    }
  },
  build: {
    outDir: path.resolve(repoRoot, 'apps/web/dist'),
    emptyOutDir: true
  },
  test: {
    environment: 'jsdom'
  }
})
