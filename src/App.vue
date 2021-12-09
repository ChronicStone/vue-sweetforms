<template>
  <div class="h-full dark:bg-[#101014] min-h-screen">
    <NConfigProvider :theme="isDark && darkTheme">
      <FormProvider>
        <div class="bg-gray-200 dark:(bg-[#18181C] text-white) flex items-center justify-between w-full h-16 p-4">
          <div class="text-lg font-medium">
            SweetForms Sandbox
          </div>

          <div>
            <n-switch v-model:value="isDark">
              <template #checked>
                <i-mdi-white-balance-sunny/>
              </template>
              <template #unchecked>
                <i-mdi-moon-waning-crescent/>
              </template>
            </n-switch>
          </div>
        </div>

        <div class="p-6">
          <DemoRenderer />
        </div>
        
      </FormProvider>
    </NConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from "./useTheme"
import { NConfigProvider, darkTheme, NInput, NCard, NButton, NSwitch  } from "naive-ui"
import { FormProvider, useSweetform, SweetformTypes } from './index';
import DemoRenderer from "./DemoRenderer.vue"

const { isDark, toggle, themeName } = useTheme()

</script>

<style>
body {
  @apply v-bind(themeName);
}


</style>