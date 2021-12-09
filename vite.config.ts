import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"
import WindiCSS from 'vite-plugin-windicss'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    WindiCSS(),
    Components({
      resolvers: IconsResolver(),
    }),
    Icons(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    }
  }
})
