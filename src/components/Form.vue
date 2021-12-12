<template>
    <n-card 
        ref="formRef" 
        class="transition-all opacity-100 fixed w-9/10 md:w-3/4 lg:w-1/2 rounded-lg h-auto z-max" 
        id="sweetforms__form"
        :content-style="{ height: 'fit-content', maxHeight: formStyle.maxHeight, width: '100%', maxWidth: formStyle.maxWidth, padding: '10px' }"
    >
    <!--         content-style="overflow-y: auto;"
 -->
    <!-- FORM TITLE -->
        <template #header>
            <div class="text-center uppercase text-xl">{{ formOptions.title }}</div>
            {{ formStyle }}
        </template>
        <!-- Form body -->
        <div class="h-10/12 max-h-55vh grid gap-4 px-6 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded-full text-left" :class="formStyle.gridSize" :style="`height:fit-content !important;`">
            <FormInput 
                v-for="(field, fieldIndex) of formContent.filter((field: any) => field._enable && (isMultiStep ? currentStepIndex === field._stepIndex : true))" :key="fieldIndex"
                :gridSize="formStyle.gridSize"
                :field="field"
                :validator="$v[field.key]"
                v-model="formState[field.key]"
            />
        </div>

        <!-- Form buttons -->
        <template #footer>
            <div class="h-1/12 flex w-full justify-center items-center gap-4 pt-6">
                <NButton @click="CloseForm" type="error">CANCEL</NButton>
                <NButton @click="SubmitForm" type="primary">SUBMIT</NButton>
            </div>
        </template>
  </n-card>
</template>

<script setup lang="ts">
import FormInput from "./FormInput.vue";
import { NCard, NButton } from "naive-ui"
import { onClickOutside, useBreakpoints, breakpointsTailwind } from "@vueuse/core"
import { ref, computed, reactive, provide } from "vue"
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
const { isMultiStep, currentStepIndex, formState, formRules, formContent, SubmitForm, CloseForm, formStyle, $v } = useForm(props.formOptions, props.formData, emit)

provide('__sweetformsFormStyles', formStyle)

onClickOutside(formRef, ({ target }: any) => {
    if(target?.id === 'sweetforms__overlay') CloseForm()
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