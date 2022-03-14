import { SetPropertyFromPath } from './../utils/formUtils';

import { MapFormInitialState, MapOutputState, MapFormRules, MapStepsAsFields, MapComponentStore, MapDependenciesAsObject, GetPropertyFromPath, ComputePropSize, ComputeTwGridBreakpoint, GenerateUUID } from "@/utils"
import { ref, reactive, computed, watch, provide, inject, nextTick } from "vue"
import { asyncComputed, reactiveComputed } from "@vueuse/core"
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
                _dependencies: computed(() => MapDependenciesAsObject(field.dependencies 
                    ? field.dependencies
                    .map((item: string | [string, string] | { source: string, target: string }) => typeof item === 'string' ? ({ source: item, target: item }) : Array.isArray(item) ? ({ source: item[0], target: item[1] }) : item)
                    .map(({ source, target }: { source: string, target: string }) => {
                        return { 
                            key: target,
                            ...(source === '$root' && { value: formState }),
                            ...(source?.toString()?.includes?.('$parent') && { value: GetPropertyFromPath([...options.parentKey], formState, source) }), 
                            ...(!['$root'].includes(source) &&  !source?.toString()?.includes?.('$parent') && { value: GetPropertyFromPath(source, formState) })
                        }
                    })
                    :  [])),
                _evalOptions: ref(false),
                _evalEnable: ref(false),
                size: useBreakpointStyle(field.size ?? formOptions?.fieldSize ?? defaultStyles.fieldSize, breakpointsConfig, 'col'),
                ...(options.parentType && { _parentType: options.parentType }),
                ...(options.parentId && { _parentId: options.parentId }),
                ...(['array', 'object'.includes(field.type)] && { gridSize: useBreakpointStyle(field?.gridSize ?? formOptions?.gridSize ?? defaultStyles.gridSize, breakpointsConfig, 'grid') }),
                ...(field.type === 'array' && { 
                    _itemsRefs: reactive([]),
                    items: ref([])
                }),
                ...(options.parentRef && { _parentRef: options.parentRef }),
                ...(options.parentKey && { _parentKey: options.parentKey }),
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
                _watcherOptions: watch(() => field._options.value, (fieldOptions: any[]) => { 
                    if(!fieldOptions.map((option: any) => option.value).includes(GetPropertyFromPath([...options?.parentKey, field.key], formState))) SetPropertyFromPath(formState, [...options?.parentKey, field.key], null)
                 })
            }),
        }))
        // RECURSIVELY DO THIS PROCESS FOR CHILDREN
        .map((field: any) => {
            let finalField = {
                ...field,
                ...(field.type === 'array' && {
                    _setItemRef: (index: number, uuid: string) => field._itemsRefs.push({ index, uuid }),
                    _removeItemRef: (_uuid: number) => field._itemsRefs.splice(field._itemsRefs.findIndex((item: any) => item._uuid === _uuid), 1),
                }),
                ...((field.fields && field.type != 'array') &&  { fields: InitializeFormFields(field.fields, { parentType: field.type, parentId: field._uuid, parentKey: [...options.parentKey ?? [], field.key] }) }),
            }

            return finalField
        })
        .map((field: any) => {
            return {
                ...field,
                ...(field.type === 'array' && {
                    _watcherItems: watch(field._itemsRefs, (items: any[]) => {
                        const mappedItems = items.map((item, index) => InitializeFormFields(field.fields, { parentType: field.type, parentId: field._uuid, parentKey: [...options.parentKey ?? [], field.key, index], parentRef: item }), { deep: true })
                        field.items.value = [ ...mappedItems ]
                    }),
                }, { deep: true, immediate: true }),
            }
        })

    const MapItemsInputRefs = (fields: any[], state: { [key: string]: any }, parentKey: string[] = []) => fields.forEach((field) => {
        const value = state?.[field.key]
        if(field.fields && field.type != 'array') {
            MapItemsInputRefs(field.fields, value, [...parentKey, field.key])
        } else if(field.fields && field.type === 'array') {
            value?.forEach((item: any, index: number) => {
                field?._setItemRef?.(index, GenerateUUID())
                nextTick(() =>  MapItemsInputRefs(field.items?.[index] ?? [], item, [...parentKey, field.key, index]))
            })
        }
    })


    const formState = reactive(MapFormInitialState(inputFields, formInputData))
    const formContent = reactive(InitializeFormFields(inputFields))

    MapItemsInputRefs(formContent, formInputData)


    const FilterAppliedRules = (fields: any[], parentKey: string[] = []): any => {
        return fields
        .filter((field: any) => {
            if(field.condition && !field._enable) return field.conditionEffect === 'disable' ? true : false
            if(isMultiStep.value && field._stepIndex !== currentStepIndex.value && !parentKey.reverse()[0]) return false
            return true
        })
        .map((field: any) => ({
            ...field,
            ...(field.fields && field.type != 'array' && { fields: FilterAppliedRules(field.fields, [...parentKey, field.key]) }),
            ...(field.fields && field.type === 'array' && { fields: field._itemsRefs?.map((_, index: number) => FilterAppliedRules(field.items?.[index] ?? [], [...parentKey, field.key, index])) }),
        }))
    }
    const formRules = computed(() => {
        const fields = FilterAppliedRules(formContent)
        return MapFormRules(fields)
    })

    const $v = useVuelidate(formRules, formState);

    const CloseForm = () => formOptions._resolve ? formOptions._resolve({ isCompleted: false, formData: MapOutputState(formState, formContent) }) : emit('onCancel', MapOutputState(formState, formContent))
    const SubmitForm = async () => {
        const _emitForm = () => formOptions._resolve ? formOptions._resolve({ isCompleted: true, formData: MapOutputState(formState, formContent)}) : emit('onSubmit',  MapOutputState(formState, formContent))

        const isValid = await $v.value.$validate()
        await $v.value.$touch()
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

    const mappedSyncState = computed(() => MapOutputState(formState, formContent))

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
        }),
        mappedSyncState
    }
}
