import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/2048-game/', // 🔁 Change to your actual GitHub repo name
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    cors: false,
  },
})