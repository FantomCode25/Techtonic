import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { LucideAArrowDown } from 'lucide-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['Lucide-react']
  }
})
