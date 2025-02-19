import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/my-p2p-app/", // Đúng với tên repo trên GitHub
  build: {
    outDir: "dist",
  },
})
