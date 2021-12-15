
import { MapFormInitialState, MapOutputState, MapFormRules, MapStepsAsFields, MapDependenciesAsObject, ResolveFromString, ComputePropSize, ComputeTwGridBreakpoint, GenerateUUID } from "@/utils"
import { ref, reactive, computed, watch } from "vue"
import { asyncComputed, useBreakpoints, breakpointsTailwind } from "@vueuse/core"
import useVuelidate from '@vuelidate/core'


export const useForm = (formOptions: any, formInputData: any, emit: any) => {
    const inputFields = formOptions.fields ?? MapStepsAsFields(formOptions.steps)

    const __breakpoints = useBreakpoints(breakpointsTailwind)
    const breakpoints = reactive({ 
        sm: __breakpoints.smaller('sm'),
        md: __breakpoints.between('sm', 'md'), 
        lg: __breakpoints.between('md', 'lg'), 
        xl: __breakpoints.greater('lg')
    })
    const formStyle = reactive({
        _breakpoints: breakpoints,
        maxHeight: computed(() => ComputePropSize(formOptions?.maxHeight ?? {}, 'maxHeight', breakpoints)),
        maxWidth: computed(() => ComputePropSize(formOptions?.maxWidth ?? {}, 'maxWidth', breakpoints)),
        gridSize: computed(() => ComputeTwGridBreakpoint(formOptions?.gridSize, 'grid')),
        fieldSize: computed(() => ComputeTwGridBreakpoint(formOptions?.fieldSize, 'col'))
    })

    const formSteps = reactive(!formOptions.steps ? [] : formOptions.steps.map(({ fields, ...step }: any, stepIndex: number) => ({ ...step, _status: stepIndex === 0 ? "InProgress" : "Pending", _index: stepIndex })))
    const currentStepIndex = ref(0)
    const isMultiStep = computed(() => formSteps.length > 1)

    const InitializeFormFields: (fields: any[], options?: any) => any[] = (fields: any[], options = {}) => fields
        // BASE FIELD + ASYNC-COMPUTED EVALUATORS + DEPENDENCIES SETUP
        .map((field: any) => ({
            ...field,
            _uuid: GenerateUUID(),
            _dependencies: computed(() => MapDependenciesAsObject(field.dependencies ? field.dependencies.map((key: string) => ({ key, value: ResolveFromString(key, formState) })) :  [])),
            _evalOptions: ref(false),
            _evalEnable: ref(false),
            size: computed(() => ComputeTwGridBreakpoint(field.size ?? formOptions.fieldSize, 'col')),
            ...(options.parentType && { _parentType: options.parentType }),
            ...(options.parentId && { _parentId: options.parentId }),
            ...(['array', 'object'.includes(field.type)] && { gridSize: computed(() => ComputeTwGridBreakpoint(field?.gridSize ?? formOptions.gridSize, 'grid')) }),
            ...(field.type === 'array' && { _itemsRefs: reactive([]) })
        }))
        // ASYNC COMPUTED SETUP
        .map((field: any) => ({
            ...field,
            _enable: field.condition ? asyncComputed(async () => await field.condition(field._dependencies.value), false, field._evalEnable) : true,
            ...(field.options && typeof field.options === 'function' && {  
                _options: asyncComputed(async () => await field.options(field._dependencies.value), [], field._evalOptions),
            })
        }))
        // WATCHERS SETUP
        .map((field: any) => ({
            ...field,
            ...(field.options && typeof field.options === 'function' && {
                _watcherOptions: watch(() => field._options.value, (options: any[]) => { if(!options.map((option: any) => option.value).includes(formState[field.key])) formState[field.key] = null })
            })
        }))
        // RECURSIVELY DO THIS PROCESS FOR CHILDREN
        .map((field: any) => ({
            ...field,
            ...(field.type === 'array' && {
                _setItemRef: (index: number, uuid: string) => field._itemsRefs.push({ index, uuid }),
                _removeItemRef: (_uuid: number) => field._itemsRefs.splice(field._itemsRefs.findIndex((item: any) => item._uuid === _uuid), 1),
            }),
            ...(field.fields &&  { fields: InitializeFormFields(field.fields, { parentType: field.type, parentId: field._uuid}) }),
        }))



    const formState = reactive(MapFormInitialState(inputFields, formInputData))
    const formContent = reactive(InitializeFormFields(inputFields))
    const formRules = computed(() => MapFormRules(formContent.filter((field: any) => {
        if(field.condition && !field._enable) return (field?.conditionEffect && field.conditionEffect != 'hide') ?? false
        if(isMultiStep.value && field._stepIndex !== currentStepIndex.value) return false
        return true
    })))

    const $v = useVuelidate(formRules, formState);

    const CloseForm = () => formOptions._resolve({ isCompleted: false, formData: MapOutputState(formState, formContent) })
    const SubmitForm = async () => {
        const _emitForm = () => formOptions._resolve({ isCompleted: true, formData: MapOutputState(formState, formContent)})
        const isValid = await $v.value.$validate()
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
        formSteps,
        formContent,
        PreviousStep: () => currentStepIndex.value > 0 && (formSteps[currentStepIndex.value]._status = 'Pending', currentStepIndex.value--), 
        SubmitForm,
        CloseForm,
        breakpoints,
        formStyle,
        $v,
        ...(formOptions.steps && { 
            currentStepIndex, 
            formSteps 
        }) 
    }
}
