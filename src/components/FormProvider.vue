<template>
  <NConfigProvider :theme="darkMode ? darkTheme : null" :theme-overrides="darkMode ? DarkThemeOverrides : LightThemeOverrides">
    <NDialogProvider>
      <slot />
      <div id="sweetforms__overlay" style="z-index: 1000;" v-if="formInstances.length" class="fixed left-0 top-0 bg-black bg-opacity-50 grid place-items-center w-full h-screen">
        <transition-group
          name="card"
        >
          <Form popup v-for="(formInstance, key) in formInstances"  @closeForm="CloseForm(key)" @submitForm="SubmitForm($event, key)" v-bind="formInstance" :key="key" />
        </transition-group>
      </div>
    <div v-show="showModalOverlay" ref="modalOverlay" @click="showModalOverlay = false" id="sweetforms__modalContainer" style="z-index: 2000" class="absolute top-0 left-0 h-screen w-full" />
    </NDialogProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
  import { FormInjectKey, ModalOverlayInjectKey, BreakpointsInjectKey } from "../constants/injectionKeys"
  import { ref, computed, provide, inject, defineProps } from "vue"
  import { useBreakpoints, breakpointsTailwind } from "@vueuse/core"
  import { NConfigProvider, NDialogProvider, darkTheme } from "naive-ui"
  import { LightThemeOverrides, DarkThemeOverrides } from "@/config"
  import { FormInstance } from "@/types/form.types"
  import { GenerateUUID } from "@/utils/"
  import Form from "./Form.vue"

  const props = defineProps({
    darkMode: {
      type: Boolean,
      default: false
    },
    breakpoints: {
      type: Object,
      default: () => breakpointsTailwind
    }
  })
  const formInstances = ref<FormInstance[]>([])

  const CloseForm = (index: number) => formInstances.value.splice(index, 1)
  const SubmitForm = ({ formState, onSubmit }, key) => {
      CloseForm(key)
      onSubmit(Object.assign({}, formState))
  }

  // Form instance manipulation
  provide(FormInjectKey, {
    createForm: (formInstance: FormInstance, formInputData: any) => {
      const _id = GenerateUUID()
      return new Promise(resolve => {
        const _resolver = ({ isCompleted, formData }: { isCompleted: boolean, formData: any}) => {
          CloseForm(formInstances.value.findIndex(({ _id }) => _id === _id))
          resolve({ isCompleted, formData })
        }
        formInstances.value.push({ formOptions: { _id, ...formInstance, _resolve: _resolver, }, formData: formInputData })
      })
    },
    formInstances: computed(() => formInstances.value)
  })


  // Modal overlay
  const showModalOverlay = ref(false)
  const modalOverlayRef = ref<HTMLElement | null>(null)
  provide(ModalOverlayInjectKey, {
    modalOverlayRef,
    show: () => showModalOverlay.value = true,
    hide: () => showModalOverlay.value = false,
    toggle: () => showModalOverlay.value = !showModalOverlay.value,
  })

  // Breakpoints handler
  const breakpoints = useBreakpoints(props.breakpoints)
  provide(BreakpointsInjectKey, props.breakpoints)
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