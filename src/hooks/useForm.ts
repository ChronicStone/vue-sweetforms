import { SetPropertyFromPath } from './../utils/formUtils';

import { MapFormInitialState, MapOutputState, MapFormRules, MapStepsAsFields, MapComponentStore, MapDependenciesAsObject, GetPropertyFromPath, ComputePropSize, ComputeTwGridBreakpoint, GenerateUUID } from "@/utils"
import { ref, reactive, computed, watch, provide, inject, nextTick, ComputedRef } from "vue"
import { asyncComputed } from "@vueuse/core"
import { useBreakpointStyle, useBreakpoints } from "@/hooks"
import { BreakpointsInjectKey } from "@/constants/injectionKeys"
import { defaultStyles } from '@/constants'
import useVuelidate from '@vuelidate/core'
import { useConfigOverrides } from './useConfigOverrides';


export const useForm = (formOptions: any, formInputData: any, emit: any, formOverrides: ReturnType<typeof useConfigOverrides>) => {
    const [inputFields, customComponentsStore] = MapComponentStore(formOptions.fields ?? MapStepsAsFields(formOptions.steps))

    const breakpointsDef = inject(BreakpointsInjectKey, {})
    const breakpointsConfig = useBreakpoints(breakpointsDef)

    const formStyle = reactive({
        fullScreen: useBreakpointStyle(formOptions?.fullScreen ?? defaultStyles.fullScreen, breakpointsConfig, 'boolean'),
        maxHeight: useBreakpointStyle(formOptions?.maxHeight ?? defaultStyles.maxHeight, breakpointsConfig),
        maxWidth: useBreakpointStyle(formOptions?.maxWidth ?? defaultStyles.maxWidth, breakpointsConfig, 'maxWidth'),
        gridSize: useBreakpointStyle(formOptions?.gridSize ?? defaultStyles.gridSize, breakpointsConfig, 'grid'),
        fieldSize: useBreakpointStyle(formOptions?.fieldSize ?? defaultStyles.fieldSize, breakpointsConfig, 'col'),
        stepperLayout: useBreakpointStyle(formOptions?.stepperLayout ?? defaultStyles.stepperLayout, breakpointsConfig),
    })

    // let customComponentsStore: any = markRaw({})

    const formSteps = reactive(!formOptions.steps ? [] : formOptions.steps.map(({ fields, ...step }: any, stepIndex: number) => ({ ...step, _status: stepIndex === 0 ? "InProgress" : "Pending", _index: stepIndex })))
    const currentStepIndex = ref(0)
    const isMultiStep = computed(() => formSteps.length > 1)

    const InitializeFormFields: (fields: any[], options?: any) => any[] = (fields: any[], options: { parentKey?: string[]; parentType?: string; parentId?: string; parentRef?: any } = {}) => fields
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
                            ...(source === '$root' && { value: formState.value }),
                            ...(source?.toString()?.includes?.('$parent') && { value: GetPropertyFromPath([...options?.parentKey ?? []], formState.value, source) }), 
                            ...(!['$root'].includes(source) &&  !source?.toString()?.includes?.('$parent') && { value: GetPropertyFromPath(source, formState.value) })
                        }
                    })
                    :  [])),
                _evalOptions: ref(false),
                _evalEnable: ref(false),
                _fieldRef: ref(null),
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
            _setFieldRef: (value: any) => field._fieldRef.value = value,
            _required: computed(() => typeof field.required === 'function' ? field.required(field._dependencies.value) : !!field.required),
            _enable: field.condition ? asyncComputed(async () => await field.condition(field._dependencies.value), false, field._evalEnable) : true,
            _options: field.options && typeof field.options === 'function' ? asyncComputed(async () => await field.options(field._dependencies.value), [], field._evalEnable) : ref(field?.options ?? []),
        }))
        // WATCHERS SETUP
        .map((field: any) => ({
            ...field,
            ...(field.watch && {
                _fieldWatcher: watch(() => GetPropertyFromPath([...(options?.parentKey ?? []), field.key], formState.value), (value: any) => field.watch(value, { 
                    setValue: (key: string, value: any) => SetPropertyFromPath(formState.value, key.split('.'), value),
                    getValue: (key: string) => GetPropertyFromPath(key, formState.value)
                }))
            }),
            ...(field.options && typeof field.options === 'function' && {
                _watcherOptions: watch(() => field._options.value, (fieldOptions: any[]) => { 
                    try {
                        const optionValues = fieldOptions?.map?.((option: any) => option.value) ?? []
                        const currentValue = GetPropertyFromPath([...(options?.parentKey ?? []), field.key], formState.value)
                        if(Array.isArray(currentValue)) SetPropertyFromPath(formState.value, [...options?.parentKey ?? [], field.key], currentValue.filter((item: any) => optionValues.includes(item)))
                        else if(!optionValues.includes(currentValue)) SetPropertyFromPath(formState.value, [...options?.parentKey ?? [], field.key], null)
                    } catch(err) {
                        console.error(err)
                    }
                 })
            }),
        }))
        // RECURSIVELY DO THIS PROCESS FOR CHILDREN
        .map((field: any) => {
            let finalField = {
                ...field,
                ...(field.type === 'array' && {
                    _setItemRef: (index: number, uuid: string) =>  field._itemsRefs.push({ index, uuid }),
                    _removeItemRef: (_uuid: number) => field._itemsRefs.splice(field._itemsRefs.findIndex((item: any) => item._uuid === _uuid), 1),
                }),
                ...((field.fields && field.type != 'array') &&  { fields: InitializeFormFields(field.fields, { parentType: field.type, parentId: field._uuid, parentKey: [...options.parentKey ?? [], field.key] }) }),
            }

            return finalField
        })
        .map((field: any) => {
            if(field.type === 'array') {
                const fieldValue = GetPropertyFromPath([...(options?.parentKey ?? []), field.key], formState.value)
                if(fieldValue?.length) {
                    for(const [index, item] of fieldValue.entries()) field._itemsRefs.push({ index, uuid: GenerateUUID() })
                    nextTick(() => field.items.value = field._itemsRefs.map((item: any, index: number) => InitializeFormFields(field.fields, { parentType: field.type, parentId: field._uuid, parentKey: [...options.parentKey ?? [], field.key, index], parentRef: item })))
                }
            }
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


    const formState = ref(MapFormInitialState(inputFields, formInputData))
    const formContent = reactive(InitializeFormFields(inputFields))

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
            ...(field.fields && field.type === 'array' && { fields: field._itemsRefs?.map((_: any, index: number) => FilterAppliedRules(field.items?.[index] ?? [], [...parentKey, field.key, index])) }),
        }))
    }
    const formRules = computed(() => {
        const fields = FilterAppliedRules(formContent)
        return MapFormRules(fields, [], formState.value, formOverrides)
    })

    const $v = useVuelidate(formRules, formState.value);

    const CloseForm = () => formOptions._resolve ? formOptions._resolve({ isCompleted: false, formData: MapOutputState(formState.value, formContent) }) : emit('onCancel', MapOutputState(formState.value, formContent))
    const SubmitForm = async () => {
        const _emitForm = () => formOptions._resolve ? formOptions._resolve({ isCompleted: true, formData: MapOutputState(formState.value, formContent)}) : emit('onSubmit',  MapOutputState(formState.value, formContent))

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

    const mappedSyncState = computed(() => MapOutputState(formState.value, formContent))

    const ClearState = () => formState.value = MapFormInitialState(inputFields, {})
    const ResetState = () => formState.value = MapFormInitialState(inputFields, formInputData)

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
        mappedSyncState,
        ClearState,
        ResetState
    }
}
