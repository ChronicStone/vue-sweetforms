<script setup lang="ts">
import { ref, computed, provide } from "vue";
import { NDialogProvider } from "naive-ui";
import { FormInstance } from "@/types/form/instance";
import {
  ExpandRecursively,
  ExtractFieldsFromSteps,
  FormInfoReturnType,
  FormSchema,
  Narrowable,
  SimpleFormSchema,
  SteppedFormSchema,
} from "@/types/form/form";
import FormRenderer from "../Renderer/FormRenderer.vue";
import { generateUUID } from "@/utils/generateUUID";
import { GenericObject } from "@/types/utils";
import {
  BREAKPOINTS_INJECTION_KEY,
  FORM_INJECTION_KEY,
  MODAL_OVERLAY_INJECTION_KEY,
} from "@/config/injectionKeys";

const props = defineProps<{ darkMode: boolean; breakpoints: any }>();
const formInstances = ref<FormInstance[]>([]);

function closeForm(index: number) {
  formInstances.value.splice(index, 1);
}

function submitForm(
  params: {
    formState: GenericObject;
    onSubmit(formState: GenericObject): void;
  },
  key: number
) {
  closeForm(key);
  params.onSubmit(Object.assign({}, params.formState));
}

// Form instance manipulation
provide(FORM_INJECTION_KEY, {
  createForm: <
    TFormSchema extends FormSchema<StepKey, FieldKey>,
    StepKey extends Narrowable,
    FieldKey extends Narrowable
  >(
    formSchema: TFormSchema,
    formInputData?: { [key: string]: any }
  ): Promise<{
    isCompleted: boolean;
    formData: TFormSchema extends SimpleFormSchema<FieldKey>
      ? ExpandRecursively<FormInfoReturnType<TFormSchema["fields"][number]>>
      : TFormSchema extends SteppedFormSchema<StepKey, FieldKey>
      ? ExpandRecursively<
          ExtractFieldsFromSteps<
            StepKey,
            FieldKey,
            TFormSchema["steps"][number]
          >
        >
      : never;
  }> => {
    const _id = generateUUID();
    return new Promise((resolve) => {
      formInstances.value.push({
        _id,
        formSchema,
        formData: formInputData ?? {},
        _resolve: ({ isCompleted, formData }) => {
          closeForm(formInstances.value.findIndex(({ _id }) => _id === _id));
          resolve({
            isCompleted,
            formData:
              formData as unknown as TFormSchema extends SimpleFormSchema<FieldKey>
                ? ExpandRecursively<
                    FormInfoReturnType<TFormSchema["fields"][number]>
                  >
                : TFormSchema extends SteppedFormSchema<StepKey, FieldKey>
                ? ExpandRecursively<
                    ExtractFieldsFromSteps<
                      StepKey,
                      FieldKey,
                      TFormSchema["steps"][number]
                    >
                  >
                : never,
          });
        },
      });
    });
  },
  formInstances: computed(() => formInstances.value),
});

// Modal overlay
const showModalOverlay = ref(false);
const modalOverlayRef = ref<HTMLElement | null>(null);
provide(MODAL_OVERLAY_INJECTION_KEY, {
  modalOverlayRef,
  show: () => (showModalOverlay.value = true),
  hide: () => (showModalOverlay.value = false),
  toggle: () => (showModalOverlay.value = !showModalOverlay.value),
});

provide(BREAKPOINTS_INJECTION_KEY, props.breakpoints);
</script>

<template>
  <NDialogProvider>
    <slot />
    <div
      v-if="formInstances.length"
      id="sweetforms__overlay"
      style="z-index: 1000"
      class="fixed left-0 top-0 bg-black bg-opacity-50 grid place-items-center w-full h-screen"
    >
      <transition-group name="card">
        <FormRenderer
          v-for="(formInstance, key) in formInstances"
          :key="key"
          :form-schema="formInstance.formSchema"
          :form-data="formInstance.formData"
          :_resolve="formInstance._resolve"
          popup
          @close-form="closeForm(key)"
          @submit-form="submitForm($event, key)"
        />
      </transition-group>
    </div>
    <div
      v-show="showModalOverlay"
      id="sweetforms__modalContainer"
      ref="modalOverlay"
      style="z-index: 2000"
      class="absolute top-0 left-0 h-screen w-full"
      @click="showModalOverlay = false"
    />
  </NDialogProvider>
</template>

<style>
.pop-enter-active,
.pop-leave-active {
  transition: transform 0.4s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.4s linear;
}

.pop-enter,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.3) translateY(-50%);
}
</style>
