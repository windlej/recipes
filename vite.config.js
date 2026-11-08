import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `base: './'` keeps every asset path relative, so the same build works at
// username.github.io/recipes/ and at a custom domain without extra config.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
