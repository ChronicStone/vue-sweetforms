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
import config from './tsconfig.json'

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "~/": `${path.resolve(__dirname, "src")}/`,
        },
      },
      plugins: [
        typescript({
          check: false,
          tsconfig: path.resolve(__dirname, 'tsconfig.json'),
          tsconfigOverride: {
            compilerOptions: {
              sourceMap: false,
              declaration: true,
              declarationMap: true
            },
            exclude: ['**/__tests__']
          }
        }),
      ]
    },
    plugins: [
        Vue(),
        VueJsx(),
        WindiCSS(),
        Inspect(),
        Components({
            dts: true,
            resolvers: [IconsResolver({ componentPrefix: "" })],
        }),
        PurgeIcons(),
        Icons({
            autoInstall: true,
        }),
    ],
    optimizeDeps: {
        // include: [
        //     'vue',
        //     'pinia',
        //     'vue-router',
        //     '@chronicstone/vue-sweetforms',
        //     'crypto-js',
        //     'jwt-decode'
        // ]
    },
});
