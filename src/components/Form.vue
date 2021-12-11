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
        </template>
        <!-- Form body -->
        <div class="h-10/12 max-h-55vh grid gap-4 px-6 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded-full text-left" :style="`height:fit-content !important;grid-template-columns: repeat(${formOptions.gridSize ?? '2'},minmax(0,1fr));`">
            <FormInput 
                v-for="(field, fieldIndex) of formContent.filter((field: any) => field._enable && (isMultiStep ? currentStepIndex === field._stepIndex : true))" :key="fieldIndex"
                :gridSize="formOptions.gridSize"
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
import { ref, computed, reactive } from "vue"
import { useForm } from "../hooks"

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
const { isMultiStep, currentStepIndex, formState, formRules, formContent, SubmitForm, CloseForm, $v } = useForm(props.formOptions, props.formData, emit)


const breakpoints = useBreakpoints(breakpointsTailwind)

const defaultFormStyles = {
    maxHeight: {
        sm: '100vh',
        md: '90vh',
        lg: '90vh',
        xl: '90vh'
    },
    maxWidth: {
        sm: '95vw',
        md: '85vw',
        lg: '75vw',
        xl: '65vw'
    }
}

interface breakpointsObject {
    sm?: string
    md?: string
    lg?: string
    xl?: string
}

const computeViewportSize = (params: breakpointsObject, defaultParams: breakpointsObject) => {
    if(breakpoints.xl.value) return params['xl'] ?? defaultParams['xl']
    else if(breakpoints.lg.value) return params['lg'] ?? defaultParams['lg']
    else if(breakpoints.md.value) return params['md'] ?? defaultParams['md']
    else return params['sm'] ?? defaultParams['sm']
}

const formStyle = reactive({
    maxHeight: computed(() => {
        if(!props?.formOptions?.maxHeight) return computeViewportSize({}, defaultFormStyles.maxHeight, breakpoints)
        else if (typeof props.formOptions.maxHeight === 'string') return props.formOptions.maxHeight
        else if (typeof props.formOptions.maxHeight === 'number') return `${props.formOptions.maxHeight}vh`
        else if (typeof props.formOptions.maxHeight === 'object') return computeViewportSize(props.formOptions.maxHeight, defaultFormStyles.maxHeight, breakpoints)
    }),
    maxWidth: computed(() => {
        if(!props?.formOptions?.maxWidth) return computeViewportSize({}, defaultFormStyles.maxWidth)
        else if (typeof props.formOptions.maxWidth === 'string') return props.formOptions.maxWidth
        else if (typeof props.formOptions.maxWidth === 'number') return `${props.formOptions.maxWidth}vh`
        else if (typeof props.formOptions.maxWidth === 'object') return computeViewportSize(props.formOptions.maxWidth, defaultFormStyles.maxWidth)
    })
})

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