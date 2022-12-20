<template>
  <component
    :is="
      !popup
        ? FormInlineContainer
        : formStyle.fullScreen
        ? FormModalFullscreen
        : FormModal
    "
    :formStyle="formStyle"
    :allowClickOutside="formOptions?.allowOutsideClick ?? true"
    @closeForm="CloseForm"
  >
    <template
      #header
      v-if="
        formOptions?.title ||
        $slots.title ||
        (isMultiStep && ((formOptions as SteppedFormSchema)?.showStepper ?? true))
      "
    >
      <FormStepper
        class="mt-2"
        v-if="((formOptions as SteppedFormSchema)?.showStepper ?? true) && isMultiStep"
        :steps="formSteps"
        :current-step="currentStepIndex"
      />
      <slot
        v-if="$slots.title"
        name="title"
        v-bind="{
          ...(isMultiStep && {
            stepIndex: currentStepIndex,
            stepTitle: formSteps[currentStepIndex].title,
          }),
          ...(!isMultiStep && { title: formOptions?.title }),
        }"
      />
      <div
        v-else
        class="text-center uppercase text-xl"
        v-if="
          (!isMultiStep && formOptions.title) ||
          (isMultiStep && formSteps[currentStepIndex].title)
        "
      >
        {{ isMultiStep ? `${formSteps[currentStepIndex].title}` : formOptions.title }}
      </div>

      <div
        v-if="!popup ? false : formOptions?.showCloseButton ?? true"
        @click="CloseForm"
        class="absolute top-2 right-2 h-5 w-5 rounded-full cursor-pointer grid place-items-center hover:(bg-gray-500 bg-opacity-20 text-red-500)"
      >
        <i-mdi-close class="h-4 w-4" />
      </div>
    </template>

    <template #fields>
      <FormInput
        v-for="(field, fieldIndex) of formContent.filter((field: any) => (field._enable || field.conditionEffect === 'disable') && (isMultiStep ? currentStepIndex === field._stepIndex : true))"
        :key="fieldIndex"
        :gridSize="formStyle.gridSize"
        :field="field"
        :validator="$v[field.key]"
        :disabled="!field._enable && field.conditionEffect === 'disable'"
        :modelValue="
          field._stepRoot ? formState[field._stepRoot][field.key] : formState[field.key]
        "
        @update:modelValue="HandleRootValUpdate(field, $event)"
      />
    </template>

    {{ !$slots }}

    <template #customActions v-if="$slots.actions">
      <slot
        name="actions"
        v-bind="{
          ...(isMultiStep && {
            togglePreviousStep: PreviousStep,
            currentStepIndex: currentStepIndex,
            formSteps: formSteps,
          }),
          toggleSubmit: SubmitForm,
        }"
      />
    </template>
    <template #actions v-if="!$slots.actions">
      <NButton
        secondary
        @click="CloseForm"
        v-if="formOptions?.showCancelButton ?? true"
        type="error"
        >
        {{ formOptions?.cancelButtonText ?? "CANCEL" }}
        </NButton
      >
      <NButton
        secondary
        @click="PreviousStep"
        v-if="((formOptions as SteppedFormSchema)?.showPreviousButton ?? true) && isMultiStep"
        :disabled="currentStepIndex === 0"
        type="primary"
        >{{ (formOptions as SteppedFormSchema)?.previousButtonText ?? "PREVIOUS" }}</NButton
      >
      <NButton secondary @click="SubmitForm" type="primary">{{
        isMultiStep
          ? `${
              currentStepIndex === formSteps.length - 1
                ? formOptions?.submitButtonText ?? "SUBMIT"
                : (formOptions as SteppedFormSchema)?.nextButtonText ?? "NEXT"
            }`
          : formOptions?.submitButtonText ?? "SUBMIT"
      }}</NButton>
    </template>
  </component>
</template>

<script lang="ts">
export default {
  name: "Form",
};
</script>

<script setup lang="ts">
import { defineExpose, PropType } from "vue";
import FormInput from "./FormInput.vue";
import FormStepper from "./FormSteps.vue";
import FormModal from "./FormModal.vue";
import FormModalFullscreen from "./FormModalFullscreen.vue";
import FormInlineContainer from "./FormInlineContainer.vue";
import { NButton } from "naive-ui";
import { useForm } from "../hooks";
import type { FormSchema, SimpleFormSchema, SteppedFormSchema } from "@/types/form";

const emit = defineEmits([
  "closeForm",
  "submitForm",
  "cancelForm",
  "onSubmit",
  "onCancel",
]);

const props = withDefaults(
  defineProps<{ formOptions: FormSchema; formData?: { [key: string]: any }; popup: boolean }>(),
  {
    formData: () => ({}),
    popup: false,
  }
)

const {
  isMultiStep,
  currentStepIndex,
  formState,
  formRules,
  formSteps,
  formContent,
  SubmitForm,
  CloseForm,
  formStyle,
  PreviousStep,
  $v,
  mappedSyncState,
  ClearState,
  ResetState,
} = useForm(props.formOptions, props.formData, emit);
const HandleRootValUpdate = (field: any, value: any) => {
  if (field._stepRoot) formState.value[field._stepRoot][field.key] = value;
  else formState.value[field.key] = value;
};

defineExpose({
  $clear: ClearState,
  $reset: ResetState,
  formData: mappedSyncState,
  $validate: async () => {
    const isValid = await $v.value.$validate();
    await $v.value.$touch();
    return { $valid: isValid, $errors: $v.$errors, $data: formState.value };
  },
  formSteps,
  ...(isMultiStep.value && { PreviousStep, currentStepIndex, formSteps }),
});
</script>
