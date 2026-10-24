import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [tailwindcss()],
  server: { host: '127.0.0.1' },
  build: {
    sourcemap: false,
    minify: 'esbuild',
    cssMinify: 'esbuild',
    target: 'es2022',
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            manualChunks: {
              react: ['react', 'react-dom'],
              motion: ['gsap', 'gsap/ScrollTrigger', 'lenis'],
            },
          },
        },
  },
}));
