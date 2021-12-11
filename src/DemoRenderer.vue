<template>
  <div>
    <NCard hoverable v-for="(DemoGroup, key, index) of AllDemos" :key="index" :title="key">
      <div class="flex flex-wrap gap-4">
        <NButton @click="OpenForm(value)" v-for="({label, value}, childKey, childIndex) of DemoGroup" :key="childIndex" type="primary">{{label}}</NButton>
      </div>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { NCard, NButton, useThemeVars } from "naive-ui"
import { FormProvider, useSweetform, SweetformTypes } from './index';
import * as AllDemos from "@/demos/"
const { createForm, formInstances }: any = useSweetform()
const OpenForm = async (formContent: any) => {
  const data = await createForm(formContent)
  console.log({ data })
}
const themeVars: any = useThemeVars()
</script>

<style>

</style>