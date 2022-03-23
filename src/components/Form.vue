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
    :allowClickOutside="formOptions?.allowClickOutside ?? true"
    @closeForm="CloseForm"
  >
    <template
      #header
      v-if="
        formOptions?.title ||
        $slots.title ||
        (isMultiStep && (formOptions?.showSteps ?? true))
      "
    >
      <FormStepper
        class="mt-2"
        v-if="(formOptions?.showSteps ?? true) && isMultiStep"
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
        >CANCEL</NButton
      >
      <NButton
        secondary
        @click="PreviousStep"
        v-if="(formOptions?.showPreviousButton ?? true) && isMultiStep"
        :disabled="currentStepIndex === 0"
        type="primary"
        >{{ formOptions?.previousButtonText ?? "PREVIOUS" }}</NButton
      >
      <NButton secondary @click="SubmitForm" type="primary">{{
        isMultiStep
          ? `${
              currentStepIndex === formSteps.length - 1
                ? formOptions?.submitButtonText ?? "SUBMIT"
                : formOptions?.nextButtonText ?? "NEXT"
            }`
          : formOptions?.submitButtonText ?? "SUBMIT"
      }}</NButton>
    </template>
  </component>
</template>

<script setup lang="ts">
import { defineExpose } from "vue";
import FormInput from "./FormInput.vue";
import FormStepper from "./FormSteps.vue";
import FormModal from "./FormModal.vue";
import FormModalFullscreen from "./FormModalFullscreen.vue";
import FormInlineContainer from "./FormInlineContainer.vue";
import { NButton } from "naive-ui";
import { useForm } from "../hooks";

const emit = defineEmits([
  "closeForm",
  "submitForm",
  "cancelForm",
  "onSubmit",
  "onCancel",
]);
const props = defineProps({
  formOptions: {
    type: Object,
    default: () => ({}),
  },
  formData: {
    type: Object,
    default: () => ({}),
  },
  popup: {
    type: Boolean,
    default: false,
  },
});

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
} = useForm(props.formOptions, props.formData, emit);
const HandleRootValUpdate = (field: any, value: any) => {
  if (field._stepRoot) formState[field._stepRoot][field.key] = value;
  else formState[field.key] = value;
};

defineExpose({
  formData: mappedSyncState,
  $validate: $v.validate,
  formSteps,
  ...(isMultiStep.value && { PreviousStep, currentStepIndex, formSteps }),
});
</script>

<style scoped>
::-webkit-scrollbar {
  width: 9px;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer hover:bg-gray-300;
}

::-webkit-scrollbar-track {
  background: transparent;
  padding: 5px;
}
</style>
