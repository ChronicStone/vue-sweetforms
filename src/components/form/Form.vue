<template>
    <n-card 
        ref="formRef" 
        class="transition-all opacity-100 fixed w-9/10 md:w-3/4 lg:w-1/2 h-max-[85vh] rounded-lg h-auto z-max" 
        style="height: fit-content;max-height:85vh;"
        id="sweetforms__form"
        content-style="height:fit-content;padding: 10px;"
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
                v-for="(field, fieldIndex) of formContent.filter(field => field._enable)" :key="fieldIndex"
                :gridSize="formOptions.gridSize"
                :field="field"
                :validator="$v[field.key]"
                v-model="formState[field.key]"
            />
        </div>

        <!-- Form buttons -->
        <template #footer>
            <div class="h-1/12 flex w-full justify-center items-center gap-4 pt-6">
                <NButton @click="CancelForm" type="error">CANCEL</NButton>
                <NButton @click="SubmitForm" type="primary">SUBMIT</NButton>
            </div>
        </template>
  </n-card>
</template>

<script setup lang="ts">
import FormInput from "./FormInput.vue";
import { NCard, NButton, NSteps, NStep } from "naive-ui"
import { ref, reactive, computed, watch } from "vue"
import { onClickOutside, asyncComputed } from "@vueuse/core"
import useVuelidate from '@vuelidate/core'
import { required } from "@vuelidate/validators"
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

const InitializeFormState = () => {
    let state = {}
    props.formOptions.fields.forEach(field => state[field.key] = props.formData[field.key] ?? null)
    return state
}

const MapArrayToObject = (array: any[]) => {
    let obj = {}
    for(const { key, value } of array) obj[key] = value
    return obj
}

const formRef = ref(null)
const formState: any = reactive(InitializeFormState())
const formContent: any = reactive(
    props.formOptions.fields
    .map((field: any) => ({
        ...field,
        _enable: field.condition ? computed(() => field.condition(Object.assign({}, formState))) : true,
        ...(field.options && typeof field.options === 'function' && { 
            _evalOptions: ref(false),
        })
    }))
    .map((field: any, index: number) => ({
        ...field,
        ...(field.options && typeof field.options === 'function' && {  
            _options: asyncComputed(
                async () => await field.options(MapArrayToObject(
                    field.dependencies ? field.dependencies.map(key => ({ key, value: formState[key]})) : []
                )), 
                [],  
                field._evalOptions
            )
        })
    }))
)

formContent.forEach((field: any, index: number) => {
    // COMPUTED OPTIONS WATCHER
    if(field._options) {
        watch(() => formContent[index]._options, (options) => {
            if(!options.map((option: any) => option.value).includes(formState[field.key])) {
                console.log('PURGE FIELD VALUE')
                formState[field.key] = null
            }
        })
    }
})

const formRules = computed(() => {
    let rules = {}
    for(const field of formContent) rules[field.key] = field.validators ? { ...field.validators } : { required }
    return rules    
})

const $v = useVuelidate(formRules, formState);

const CancelForm = () => emit('closeForm')
const SubmitForm = async () => {
    const isValid = await $v.value.$validate()
    if(!isValid) return
    emit('submitForm', { formState: Object.assign({}, formState), onSubmit: props.formOptions.onSubmit })
}

onClickOutside(formRef, (event: PointerEvent) => {
    if(event?.target?.id === 'sweetforms__overlay') emit('closeForm')
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