import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths so the built files work when deployed under any subpath
  // (e.g. https://example.com/notes/) rather than only at a domain root.
  base: './',
  plugins: [react()],
})
