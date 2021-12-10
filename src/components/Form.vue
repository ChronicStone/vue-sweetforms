<template>
    <n-card 
        ref="formRef" 
        class="transition-all opacity-100 fixed w-9/10 md:w-3/4 lg:w-1/2 h-max-[85vh] rounded-lg h-auto z-max" 
        style="height: fit-content;max-height:85vh;width:80vw !important;"
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
                v-for="(field, fieldIndex) of formContent.filter((field: any) => field._enable)" :key="fieldIndex"
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
import { onClickOutside } from "@vueuse/core"
import { ref } from "vue"
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
const { isMultiStep, formState, formContent, SubmitForm, $v } = useForm(props.formOptions, props.formData, emit)


const CancelForm = () => emit('closeForm')

onClickOutside(formRef, ({ target }: any) => {
    if(target?.id === 'sweetforms__overlay') emit('closeForm')
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