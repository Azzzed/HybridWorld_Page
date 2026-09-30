import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Permite que el host asigne el puerto (PORT) cuando el 5173 está ocupado
    port: Number(process.env.PORT) || 5173,
  },
})
