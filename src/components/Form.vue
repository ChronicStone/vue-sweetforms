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
    :allowClickOutside="getProp('uiConfig.allowOutsideClick')"
    @closeForm="CloseForm"
  >
    <template
      #header
      v-if="
        formOptions?.title ||
        $slots.title ||
        (isMultiStep && getProp('uiConfig.showStepper'))
      "
    >
      <FormStepper
        class="mt-2"
        v-if="getProp('uiConfig.showStepper') && isMultiStep"
        :steps="formSteps"
        :current-step-index="currentStepIndex"
        :layout="formStyle.stepperLayout"
      />
      <slot
        name="title"
        v-bind="{
          ...(isMultiStep && {
            stepIndex: currentStepIndex,
            stepTitle: formSteps[currentStepIndex].title,
          }),
          ...(!isMultiStep && { title: formOptions?.title }),
        }"
      >
        <div
          class="text-center uppercase text-xl"
          v-if="
            (!isMultiStep && formOptions.title)"
        >
          {{ formOptions.title }}
        </div>
      </slot>
      

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
        v-if="getProp('uiConfig.showCancelButton')"
        type="error"
      >
        {{ getProp('textOverrides.cancelBtnMessage') }}
      </NButton>
      <NButton
        secondary
        @click="PreviousStep"
        v-if="getProp('uiConfig.showPrevButton') && isMultiStep"
        :disabled="currentStepIndex === 0"
        type="primary"
      >
        {{ getProp('textOverrides.prevBtnMessage') }}
      </NButton>
      <NButton secondary @click="SubmitForm" type="primary">{{
        isMultiStep
          ? `${
              currentStepIndex === formSteps.length - 1
                ? formOptions?.submitButtonText ?? getProp('textOverrides.submitBtnMessage')
                : getProp('textOverrides.nextBtnMessage')
            }`
          : getProp('textOverrides.submitBtnMessage')
        }}
      </NButton>
    </template>
  </component>
</template>

<script lang="ts">
export default {
  name: "Form",
};
</script>

<script setup lang="ts">
import { defineExpose, onMounted, PropType } from "vue";
import FormInput from "./FormInput.vue";
import FormStepper from "./FormSteps.vue";
import FormModal from "./FormModal.vue";
import FormModalFullscreen from "./FormModalFullscreen.vue";
import FormInlineContainer from "./FormInlineContainer.vue";
import { NButton } from "naive-ui";
import { useForm } from "../hooks";
import type { FormSchema, SimpleFormSchema, SteppedFormSchema } from "@/types/form";
import { useConfigOverrides } from "@/hooks/useConfigOverrides";

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

const { config, getProp } = useConfigOverrides(props.formOptions);

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
} = useForm(props.formOptions, props.formData, emit, { config, getProp });
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
