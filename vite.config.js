import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        projects: resolve(__dirname, 'projects.html'),
        resume: resolve(__dirname, 'resume.html'),
        techStack: resolve(__dirname, 'tech-stack.html'),
        opsMonitor: resolve(__dirname, 'react-ops-monitor.html')
      }
    }
  }
})