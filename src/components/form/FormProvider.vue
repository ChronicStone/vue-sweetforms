<template>
  <NConfigProvider :theme="darkMode && darkTheme" :theme-overrides="darkMode ? DarkThemeOverrides : LightThemeOverrides">
    <slot />
    <div id="sweetforms__overlay" style="z-index: 60;" v-if="formInstances.length" class="fixed left-0 top-0 bg-black bg-opacity-50 grid place-items-center w-full h-screen">
      <transition-group
        name="card"
      >
        <Form v-for="(formInstance, key) in formInstances"  @closeForm="CloseForm(key)" @submitForm="SubmitForm($event, key)" :formOptions="formInstance" :key="key" />
      </transition-group>
    </div>
  </NConfigProvider>
</template>

<script setup lang="ts">
  import { ref, computed, provide, inject, defineProps } from "vue"
  import { NConfigProvider, darkTheme } from "naive-ui"
  import { LightThemeOverrides, DarkThemeOverrides } from "@/config"
  import { FormInstance } from "@/types/form.types"
  import Form from "./Form.vue"
  const props = defineProps({
    darkMode: {
      type: Boolean,
      default: false
    },
  })

  const formInstances = ref<FormInstance[]>([])

  provide('sweetform', {
    createForm: (formInstance: FormInstance) => formInstances.value.push(formInstance),
    formInstances: computed(() => formInstances.value)
  })

  const CloseForm = (index: number) => formInstances.value.splice(index, 1)
  const SubmitForm = ({ formState, onSubmit }, key) => {
      CloseForm(key)
      onSubmit(Object.assign({}, formState))
  }
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .4s linear;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
  transition: transform 0.4s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.4s linear;
}

.pop-enter,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.3) translateY(-50%);
}

.card-enter, .card-leave-to
/* .card-leave-active for <2.1.8 */ {
  opacity: 0;
  transform: scale(0);
}
.card-enter-to {
  opacity: 1;
  transform: scale(1);
}

.card-leave-active {
  /*position: absolute;*/
}

.card-move {
  opacity: 1;
  transition: all 0.5s;
}
</style>