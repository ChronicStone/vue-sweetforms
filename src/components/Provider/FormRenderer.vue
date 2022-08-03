<template>
    <component
        :is="!popup ? FormInlineContainer : formStyle.fullScreen ? FormModalFullscreen : FormModal"
        :form-style="formStyle"
        :allow-click-outside="formOptions?.closeOnClickOutside ?? true"
        @closeForm="CloseForm"
    >
        <template v-if="formOptions?.title || $slots.title || (isMultiStep && ((formOptions as SteppedFormSchema)?.showStepper ?? true))" #header>
            <FormStepper
                v-if="((formOptions as SteppedFormSchema)?.showStepper ?? true) && isMultiStep"
                class="mt-2"
                :steps="formSteps"
                :current-step="currentStepIndex"
            />
            <slot
                v-if="$slots.title"
                name="title"
                v-bind="{
                    ...(isMultiStep && { stepIndex: currentStepIndex, stepTitle: formSteps[currentStepIndex].title }),
                    ...(!isMultiStep && { title: formOptions?.title }),
                }"
            />
            <div v-else class="text-center uppercase text-xl">
                {{ isMultiStep ? `${currentStepIndex + 1} - ${formSteps[currentStepIndex].title}` : formOptions.title }}
            </div>

            <div
                v-if="!popup ? false : formOptions?.showCloseButton ?? true"
                class="absolute top-2 right-2 h-5 w-5 rounded-full cursor-pointer grid place-items-center hover:(bg-gray-500 bg-opacity-20 text-red-500)"
                @click="CloseForm"
            >
                <i-mdi-close class="h-4 w-4" />
            </div>
        </template>

        <template #fields>
            <FormInput
                v-for="(field, fieldIndex) of formContent.filter((field: any) => (field._enable || field.conditionEffect === 'disable') && (isMultiStep ? currentStepIndex === field._stepIndex : true))"
                :key="fieldIndex"
                :grid-size="formStyle.gridSize"
                :field="field"
                :validator="$v[field.key]"
                :disabled="!field._enable && field.conditionEffect === 'disable'"
                :model-value="field._stepRoot ? formState[field._stepRoot][field.key] : formState[field.key]"
                @update:modelValue="HandleRootValUpdate(field, $event)"
            />
        </template>

        {{ !$slots }}

        <template v-if="$slots.actions" #customActions>
            <slot
                name="actions"
                v-bind="{
                    ...(isMultiStep && { togglePreviousStep: PreviousStep, currentStepIndex: currentStepIndex, formSteps: formSteps }),
                    toggleSubmit: SubmitForm,
                }"
            />
        </template>
        <template v-if="!$slots.actions" #actions>
            <NButton v-if="formOptions?.showCancelButton ?? true" type="error" @click="CloseForm">CANCEL</NButton>
            <NButton
                v-if="formOptions instanceof SteppedFormSchema && ((formOptions as SteppedFormSchema)?.showPreviousButton ?? true) && isMultiStep"
                :disabled="currentStepIndex === 0"
                type="primary"
                @click="PreviousStep"
                >{{ (formOptions as SteppedFormSchema)?.previousButtonText ?? "PREVIOUS" }}</NButton
            >
            <NButton type="primary" @click="SubmitForm">{{
                isMultiStep
                    ? `${currentStepIndex === formSteps.length - 1 ? formOptions?.submitButtonText ?? "SUBMIT" : (formOptions as SteppedFormSchema)?.nextButtonText ?? "NEXT"}`
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
    import { useFormController } from "~/composables/useFormController";
    import { FormSchema, SteppedFormSchema } from "~/types/form";

    // eslint-disable-next-line no-undef
    const emit = defineEmits(["closeForm", "submitForm", "cancelForm", "onSubmit", "onCancel"]);
    // eslint-disable-next-line no-undef
    const props = defineProps({
        formOptions: {
            type: Object as PropType<FormSchema>,
            required: true,
        },
        formData: {
            type: Object as PropType<{ [key: string]: any }>,
            default: () => ({}),
        },
        popup: {
            type: Boolean as PropType<boolean>,
            default: false,
        },
    });

<<<<<<< Updated upstream:src/components/Form.vue
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
  $validate: $v.validate,
  formSteps,
  ...(isMultiStep.value && { PreviousStep, currentStepIndex, formSteps }),
});
=======
    const { isMultiStep, currentStepIndex, formState, formSteps, formContent, SubmitForm, CloseForm, formStyle, PreviousStep, $v, mappedSyncState } =
        useFormController(props.formOptions, props.formData, emit);

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
>>>>>>> Stashed changes:src/components/Provider/FormRenderer.vue
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
