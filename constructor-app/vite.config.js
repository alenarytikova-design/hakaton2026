import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // ОБЯЗАТЕЛЬНО для работы React
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(), // Этот плагин должен быть ПЕРВЫМ
    tailwindcss()
  ],
});