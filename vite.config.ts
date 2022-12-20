import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"
import WindiCSS from 'vite-plugin-windicss'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import PurgeIcons from 'vite-plugin-purge-icons'
import typescript from 'rollup-plugin-typescript2';
import dts from "vite-plugin-dts";
// import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    WindiCSS(),
    Components({
      dts: true,
      resolvers: [IconsResolver()],
    }),
    PurgeIcons(),
    Icons({ autoInstall: true }),
    vueJsx(),
    // dts({ insertTypesEntry: true }),
    // {
    //   ...typescript({
    //     check: true,
    //     tsconfig: './tsconfig.json',
    //     tsconfigOverride: {
    //         noEmits: true,
    //     },
    //   }),
    //   enforce: 'pre',
    // },
        // only for type checking
        // {
        //     ...rollupTs({
        //         check: true,
        //         tsconfig: './tsconfig.json',
        //         tsconfigOverride: {
        //             noEmits: true,
        //         },
        //     }),
        //     // run before build
        //     enforce: 'pre',
        // },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 7354,
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'VueSweetforms',
      fileName: (format) => `vue-sweetforms.${format}.js`
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },

    },
  },
})
