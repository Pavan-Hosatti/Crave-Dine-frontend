import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,       // ✅ Always run on port 3000
    open: true,       // ✅ Automatically open in browser
    // Add this headers configuration for Cross-Origin-Opener-Policy
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  define: {
    'process.env': {} // ✅ Prevents Vite crash on missing env vars
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
