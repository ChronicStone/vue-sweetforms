<template>
  <NConfigProvider
    :theme="darkMode ? darkTheme : null"
    :theme-overrides="
      themeOverrides
        ? themeOverrides
        : darkMode
        ? DarkThemeOverrides
        : LightThemeOverrides
    "
  >
    <NDialogProvider>
      <slot />
      <div
        id="sweetforms__overlay"
        style="z-index: 1000"
        v-if="formInstances.length"
        class="fixed left-0 top-0 bg-black !bg-opacity-50 grid place-items-center w-full h-screen"
      >
        <transition-group name="scale" appear>
          <Form
            popup
            v-for="(formInstance, index) in formInstances"
            @closeForm="CloseForm(index)"
            @submitForm="SubmitForm($event, index)"
            v-bind="formInstance"
            :key="formInstance.formOptions._id?.toString()"
            :zIndex="index + 1"
          />
        </transition-group>
      </div>
      <div
        v-show="showModalOverlay"
        ref="modalOverlay"
        @click="showModalOverlay = false"
        id="sweetforms__modalContainer"
        style="z-index: 2000"
        class="absolute top-0 left-0 h-screen w-full"
      />
    </NDialogProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import {
  FormInjectKey,
  ModalOverlayInjectKey,
  BreakpointsInjectKey,
} from "../constants/injectionKeys";
import { ref, computed, provide, inject, defineProps } from "vue";
import { useBreakpoints, breakpointsTailwind } from "@vueuse/core";
import { NConfigProvider, NDialogProvider, darkTheme } from "naive-ui";
import { LightThemeOverrides, DarkThemeOverrides } from "@/config";
import { FormInstance } from "@/types/form.types";
import { GenerateUUID } from "@/utils/";
import Form from "./Form.vue";
import {
  ExpandRecursively,
  ExtractFieldsFromSteps,
  FormInfoReturnType,
  FormSchema,
  Narrowable,
  SimpleFormSchema,
  SteppedFormSchema,
} from "@/types/form";

const props = defineProps({
  darkMode: {
    type: Boolean,
    default: false,
  },
  breakpoints: {
    type: Object,
    default: () => breakpointsTailwind,
  },
  themeOverrides: {
    type: Object,
    default: () => null,
  },
});
const formInstances = ref<FormInstance[]>([]);

const CloseForm = (uuid: string) =>
  formInstances.value.splice(
    formInstances.value.findIndex((form) => form.formOptions._id === uuid),
    1
  );
const SubmitForm = ({ formState, onSubmit }, key) => {
  CloseForm(key);
  onSubmit(Object.assign({}, formState));
};

// Form instance manipulation
provide(FormInjectKey, {
  createForm: <
    TFormSchema extends FormSchema<StepKey, FieldKey>,
    StepKey extends Narrowable,
    FieldKey extends Narrowable
  >(
    formSchema: TFormSchema,
    formInputData: { [key: string]: any } = {}
  ): Promise<{
    isCompleted: boolean;
    formData: TFormSchema extends SimpleFormSchema<FieldKey>
      ? ExpandRecursively<FormInfoReturnType<TFormSchema["fields"][number]>>
      : TFormSchema extends SteppedFormSchema<StepKey, FieldKey>
      ? ExpandRecursively<
          ExtractFieldsFromSteps<StepKey, FieldKey, TFormSchema["steps"][number]>
        >
      : never;
  }> => {
    const _id = GenerateUUID();
    return new Promise((resolve) => {
      const _resolver = ({
        isCompleted,
        formData,
      }: {
        isCompleted: boolean;
        formData: any;
      }) => {
        CloseForm(_id);
        resolve({ isCompleted, formData });
      };
      formInstances.value.push({
        formOptions: ({ _id, ...formSchema, _resolve: _resolver } as unknown) as any,
        formData: formInputData,
      });
    });
  },
  formInstances: computed(() => formInstances.value),
});

// Modal overlay
const showModalOverlay = ref(false);
const modalOverlayRef = ref<HTMLElement | null>(null);
provide(ModalOverlayInjectKey, {
  modalOverlayRef,
  show: () => (showModalOverlay.value = true),
  hide: () => (showModalOverlay.value = false),
  toggle: () => (showModalOverlay.value = !showModalOverlay.value),
});

// Breakpoints handler
const breakpoints = useBreakpoints(props.breakpoints);
provide(BreakpointsInjectKey, props.breakpoints);
</script>

<style>
.scale-move,
.scale-enter-active,
.scale-leave-active {
  transition: all ease-in-out 0.15s;
}

.scale-leave-active {
  position: absolute;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
