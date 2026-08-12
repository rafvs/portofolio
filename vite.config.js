import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Let Vite treat the Lanyard's 3D model as a static asset (import -> URL).
  assetsInclude: ['**/*.glb'],
})
