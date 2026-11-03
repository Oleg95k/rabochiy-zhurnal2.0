import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  // The Pages project site lives under /rabochiy-zhurnal/; Vercel and local
  // development continue to serve from the domain root.
  base: process.env.GITHUB_PAGES === 'true' ? '/rabochiy-zhurnal/' : '/',
  plugins: [react()],
})
