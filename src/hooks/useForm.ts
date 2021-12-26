
import { MapFormInitialState, MapOutputState, MapFormRules, MapStepsAsFields, MapComponentStore, MapDependenciesAsObject, ResolveFromString, ComputePropSize, ComputeTwGridBreakpoint, GenerateUUID } from "@/utils"
import { ref, reactive, computed, watch, provide, inject } from "vue"
import { asyncComputed } from "@vueuse/core"
import { useBreakpointStyle, useBreakpoints } from "@/hooks"
import { BreakpointsInjectKey } from "@/constants/injectionKeys"
import { defaultStyles } from '@/constants'
import useVuelidate from '@vuelidate/core'


export const useForm = (formOptions: any, formInputData: any, emit: any) => {
    const [inputFields, customComponentsStore] = MapComponentStore(formOptions.fields ?? MapStepsAsFields(formOptions.steps))

    const breakpointsDef = inject(BreakpointsInjectKey, {})
    const breakpointsConfig = useBreakpoints(breakpointsDef)

    const formStyle = reactive({
        fullScreen: useBreakpointStyle(formOptions?.fullScreen ?? defaultStyles.fullScreen, breakpointsConfig, 'boolean'),
        maxHeight: useBreakpointStyle(formOptions?.maxHeight ?? defaultStyles.maxHeight, breakpointsConfig),
        maxWidth: useBreakpointStyle(formOptions?.maxWidth ?? defaultStyles.maxWidth, breakpointsConfig, 'maxWidth'),
        gridSize: useBreakpointStyle(formOptions?.gridSize ?? defaultStyles.gridSize, breakpointsConfig, 'grid'),
        fieldSize: useBreakpointStyle(formOptions?.fieldSize ?? defaultStyles.fieldSize, breakpointsConfig, 'col'),
    })

    // let customComponentsStore: any = markRaw({})

    const formSteps = reactive(!formOptions.steps ? [] : formOptions.steps.map(({ fields, ...step }: any, stepIndex: number) => ({ ...step, _status: stepIndex === 0 ? "InProgress" : "Pending", _index: stepIndex })))
    const currentStepIndex = ref(0)
    const isMultiStep = computed(() => formSteps.length > 1)

    const InitializeFormFields: (fields: any[], options?: any) => any[] = (fields: any[], options = {}) => fields
        // BASE FIELD + ASYNC-COMPUTED EVALUATORS + DEPENDENCIES SETUP
        .map((field: any) => {
            return {
                ...field,
                _uuid: GenerateUUID(),
                _dependencies: computed(() => MapDependenciesAsObject(field.dependencies ? field.dependencies.map((key: string) => ({ key, value: key === '$root' ? formState : ResolveFromString(key, formState) })) :  [])),
                _evalOptions: ref(false),
                _evalEnable: ref(false),
                size: useBreakpointStyle(field.size ?? formOptions?.fieldSize ?? defaultStyles.fieldSize, breakpointsConfig, 'col'),
                ...(options.parentType && { _parentType: options.parentType }),
                ...(options.parentId && { _parentId: options.parentId }),
                ...(['array', 'object'.includes(field.type)] && { gridSize: useBreakpointStyle(field?.gridSize ?? formOptions?.gridSize ?? defaultStyles.gridSize, breakpointsConfig, 'grid') }),
                ...(field.type === 'array' && { _itemsRefs: reactive([]) }),
            }
        })
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

    const FilterAppliedRules: (fields: any[], parentKey: string | null) => any[] = (fields: any[], parentKey: string | null = null) => {
        return fields
        .filter((field: any) => {
            if(field.condition && !field._enable) return field.conditionEffect === 'disable' ? true : false
            if(isMultiStep.value && field._stepIndex !== currentStepIndex.value && !parentKey) return false
            return true
        })
        .map((field: any) => ({
            ...field,
            ...(field.fields && { fields: FilterAppliedRules(field.fields, field.key) }),
        }))
    }
    const formRules = computed(() => {
        const fields = FilterAppliedRules(formContent, null)
        console.log({ fields })
        return MapFormRules(fields)
    })

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

    provide('componentStore', customComponentsStore)

    return { 
        isMultiStep,
        formState, 
        formRules, 
        formSteps,
        formContent,
        PreviousStep: () => currentStepIndex.value > 0 && (formSteps[currentStepIndex.value]._status = 'Pending', currentStepIndex.value--), 
        SubmitForm,
        CloseForm,
        formStyle,
        customComponentsStore,
        $v,
        ...(formOptions.steps && { 
            currentStepIndex, 
            formSteps 
        }) 
    }
}
