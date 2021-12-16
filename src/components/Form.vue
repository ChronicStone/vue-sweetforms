<template>
    <n-card 
        :style="{ maxWidth: formStyle.maxWidth, width: '100%' }"
        ref="formRef" 
        class="transition-all opacity-100 fixed w-9/10 md:w-3/4 lg:w-1/2 rounded-lg h-auto" 
        id="sweetforms__form"
        :content-style="{ height: 'fit-content', maxHeight: formStyle.maxHeight, width: '100%', padding: '10px' }"
    >
        <!-- FORM TITLE -->
        <template #header>
            <FormStepper class="mt-2" v-if="(formOptions?.showSteps ?? true) && isMultiStep" :steps="formSteps" :current-step="currentStepIndex" />
            <div class="text-center uppercase text-xl">{{ isMultiStep ? `${currentStepIndex + 1} - ${formSteps[currentStepIndex].title}` : formOptions.title }}</div>
            <div v-if="formOptions?.showCloseButton ?? true" @click="CloseForm" class="absolute top-2 right-2 h-5 w-5 rounded-full cursor-pointer grid place-items-center hover:(bg-gray-500 bg-opacity-20 text-red-500)">
                <i-mdi-close class="h-4 w-4"/>
            </div>

        </template>
        <!-- Form body -->
        <div class="h-10/12 max-h-55vh grid gap-4 px-6 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded-full text-left" :class="formStyle.gridSize" :style="`height:fit-content !important;`">
            <FormInput 
                v-for="(field, fieldIndex) of formContent.filter((field: any) => (field._enable || field.conditionEffect === 'disable') && (isMultiStep ? currentStepIndex === field._stepIndex : true))" :key="fieldIndex"
                :gridSize="formStyle.gridSize"
                :field="field"
                :validator="$v[field.key]"
                v-model="formState[field.key]"
                :disabled="!field._enable && field.conditionEffect === 'disable'"
            />
        </div>

        <!-- Form buttons -->
        <template #footer>
            <div class="h-1/12 flex w-full justify-center items-center gap-4 pt-6">
                <NButton @click="CloseForm" v-if="formOptions?.showCancelButton ?? true" type="error">CANCEL</NButton>
                <NButton @click="PreviousStep" v-if="(formOptions?.showPreviousButton ?? true) && isMultiStep" :disabled="currentStepIndex === 0" type="primary">{{formOptions?.previousButtonText ?? 'PREVIOUS'}}</NButton>
                <NButton @click="SubmitForm" type="primary">{{isMultiStep ? `${currentStepIndex === formSteps.length - 1 ? (formOptions?.submitButtonText ?? 'SUBMIT') : (formOptions?.nextButtonText ?? 'NEXT')}` : (formOptions?.submitButtonText ?? 'SUBMIT')}}</NButton>
            </div>
        </template>
    </n-card>
</template>

<script setup lang="ts">
import FormInput from "./FormInput.vue";
import FormStepper from "./FormSteps.vue";
import { NCard, NButton } from "naive-ui"
import { onClickOutside } from "@vueuse/core"
import { ref, computed, reactive, provide, defineComponent } from "vue"
import { useForm } from "../hooks"
import { ComputePropSize } from "@/utils"

const emit = defineEmits(['closeForm', 'submitForm', 'cancelForm'])
const props = defineProps({
    formOptions: {
        type: Object,
        default: () => ({})
    },
    formData: {
        type: Object,
        default: () => ({})
    }
})

const formRef = ref(null)
const { isMultiStep, currentStepIndex, formState, formSteps, formContent, formRules, SubmitForm, CloseForm, formStyle, PreviousStep, $v } = useForm(props.formOptions, props.formData, emit)

onClickOutside(formRef, ({ target }: any) => {
    if(target?.id === 'sweetforms__overlay' && (props?.formOptions?.allowClickOutside ?? true)) CloseForm()
})

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