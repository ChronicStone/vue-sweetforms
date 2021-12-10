import { MapFormInitialState, MapFormRules, MapStepsAsFields, MapDependenciesAsObject, ResolveFromString } from "@/utils"
import { ref, reactive, computed, watch } from "vue"
import { asyncComputed } from "@vueuse/core"
import useVuelidate from '@vuelidate/core'


export const useForm = (formOptions: any, formInputData: any, emit: any) => {
    const inputFields = formOptions.fields ?? MapStepsAsFields(formOptions.steps)
    
    const formSteps = reactive(!formOptions.steps ? [] : formOptions.steps.map(({ fields, ...step }: any, stepIndex: number) => ({ ...step, _status: stepIndex === 0 ? "InProgress" : "Pending", _index: stepIndex })))
    const currentStepIndex = ref(0)
    const isMultiStep = computed(() => formSteps.length > 1)

    const formState = reactive(MapFormInitialState(inputFields, formInputData))
    const formContent = reactive(
        inputFields
        // BASE FIELD + ASYNC-COMPUTED EVALUATORS + DEPENDENCIES SETUP
        .map((field: any) => ({
            ...field,
            _dependencies: computed(() => MapDependenciesAsObject(field.dependencies ? field.dependencies.map((key: string) => ({ key, value: ResolveFromString(key, formState) })) :  [])),
            _evalOptions: ref(false),
            _evalEnable: ref(false)
        }))
        // ASYNC COMPUTED SETUP
        .map((field: any, index: number) => ({
            ...field,
            _enable: field.condition ? asyncComputed(async () => await field.condition(field._dependencies.value), false, field._evalEnable) : true,
            ...(field.options && typeof field.options === 'function' && {  
                _options: asyncComputed(async () => await field.options(field._dependencies.value), [], field._evalOptions),
            })
            
        }))
        // WATCHERS SETUP
        .map((field: any, index: number) => ({
            ...field,
            ...(field.options && typeof field.options === 'function' && {
                _watcherOptions: watch(() => field._options.value, (options: any[]) => { if(!options.map((option: any) => option.value).includes(formState[field.key])) formState[field.key] = null })
            })
        }))
    )

    const formRules = computed(() => MapFormRules(formContent.filter((field: any) => {
        if(field.condition && !field._enable.value) return false
        if(isMultiStep.value && field._stepIndex !== currentStepIndex.value) return false
        return true
    })))

    const $v = useVuelidate(formRules, formState);


    const SubmitForm = async (callback: () => any) => {
        const _emitForm = () => emit('submitForm', { formState: Object.assign({}, formState), onSubmit: formOptions.onSubmit })
        const isValid = await $v.value.$validate()
        console.log({ isValid })
        if(!isValid) {
            if(!isMultiStep.value) return
            else formSteps[currentStepIndex.value]._status = "Invalid"
            return
        }

        if(!isMultiStep.value) return _emitForm()
        else {
            if(currentStepIndex.value === formSteps.length - 1) return _emitForm()
            else {
                formSteps[currentStepIndex.value]._status = "Completed"
                formSteps[currentStepIndex.value + 1]._status = "InProgress"
                currentStepIndex.value++
                return
            }
        }
    }

    return { 
        isMultiStep,
        formState, 
        formRules, 
        formContent, 
        SubmitForm,
        $v,
        ...(formOptions.steps && { 
            currentStepIndex, 
            formSteps 
        }) 
    }
}

export const useSteppedForm = (formOptions) => {

}