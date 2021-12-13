<template>
  <div class="h-full dark:bg-[#101014] min-h-screen">
    <FormProvider :darkMode="isDark">
      <NConfigProvider :hljs="hljs" :theme-overrides="isDark ? DarkThemeOverrides : LightThemeOverrides"  :theme="isDark ? darkTheme : null">
        <NNotificationProvider>

          <div class="bg-gray-200 dark:(bg-[#18181C] text-white) flex items-center justify-between w-full h-16 p-4">
            <div class="text-lg font-medium">
              SweetForms Sandbox
            </div>

            <div class="w-auto flex items-center gap-4">
              <n-switch v-model:value="isDark">
                <template #checked>
                  <i-mdi-white-balance-sunny/>
                </template>
                <template #unchecked>
                  <i-mdi-moon-waning-crescent/>
                </template>
              </n-switch>
              <i-mdi-github class="h-5 w-5 hover:text-gray-300 cursor-pointer" @click="OpenGit"/>

            </div>
          </div>

          <div class="p-6">
            <DemoRenderer />
          </div>
        </NNotificationProvider>
      </NConfigProvider>
    </FormProvider>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from "./useTheme"
import { NConfigProvider, NNotificationProvider, darkTheme, NSwitch } from "naive-ui"
import { FormProvider } from '@chronicstone/vue-sweetforms';
import DemoRenderer from "./components/DemoRenderer.vue"
import { DarkThemeOverrides, LightThemeOverrides } from "./config"
const { isDark, toggle, themeName } = useTheme()
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'

hljs.registerLanguage('javascript', javascript)

const OpenGit = () => window.open('https://github.com/ChronicStone/VueSweetforms', '_blank')
</script>

<style>
body {
  @apply v-bind(themeName);
}


</style>