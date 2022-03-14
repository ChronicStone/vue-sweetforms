import { FormField } from "@/types/form.types";
import { required, helpers, minLength } from "@vuelidate/validators"
import { GenerateUUID } from "./baseUtils";
import { markRaw, toRaw } from 'vue';

interface InternalFormField extends FormField {
    _stepIndex?: number
    _dependencies?: { [key: string]: any }
}

export const MapArrayToObject = (array: any[], mapFromIndex = false) => {
    let obj: any = {}
    if(!mapFromIndex) for(const { key, value } of array) obj[key] = value
    else for(const index in array) obj[index] = array[index]
    return obj
}

export const MapFormInitialState = (fields: any[], inputFormData: any = {}, parentKey = "") => {
    const state: any = {}
    fields.forEach((field: any) => {
        if(field.type === 'info') return
        const GetFieldState = () => {
            if(!['array', 'object'].includes(field.type)) return inputFormData?.[field.key] ? inputFormData?.[field.key] : field?.default ? field?.default : field.type === 'checkbox' ? false : field.type === 'number' ? 0 : null
            else if(field.type === 'array') return inputFormData[field.key] ?? field?.default ?? []
            else return MapFormInitialState(field.fields ?? [], inputFormData[field.key] ?? {}, field.key)
        }
        if(field._stepRoot) {
            if(!state[field._stepRoot]) state[field._stepRoot] = {}
            state[field._stepRoot][field.key] = GetFieldState()
        } else state[field.key] = GetFieldState()
    })
    return state
}


export const MapFormRules = (fields: any[], parentKey: string[] = []) => {
    let rules: any = {}    
    fields.forEach((field: any) => {
        rules[field.key] = { 
            ...(typeof rules[field.key] === 'object' && { ...rules[field.key] }),
            ...(field.type === 'object' && { ...rules[field.key], ...MapFormRules(field.fields ?? [], [...parentKey, field.key]) }),
            ...(field.type === 'array' && { 
                ...rules[field.key], 
                ...MapArrayToObject(field.fields.map((_, index: number) => ({ ...MapFormRules(field.fields?.[index] ?? [], [...parentKey, field.key, index]) })), true)
            }),
            ...(typeof field?.validators === 'function' && { ...field.validators(field._dependencies, field), }),
            ...(typeof field.validators === 'object' && { ...field.validators, }),
            ...(field.required && { required: helpers.withMessage(`The field ${typeof field.label != 'string' ? field.key : field.label} can't be empty`, required) })
        }
    })
    return rules   
}

export const MapStepsAsFields = (steps: any[]) => steps.map((step, _stepIndex) =>  step.fields.map((field: any) => ({ ...field, _stepIndex, ...(step.root && {_stepRoot: step.root })}))).flat()

export const MapComponentStore = (fields: any[]) => {
    let componentStore: any = {}
    const mappedFields: any = fields
    .map((field: any) => {
        const customComponentRef = field.component ? GenerateUUID() : null
        if(customComponentRef) componentStore[customComponentRef] = toRaw(field.component)
        return { ...field, ...(field.component && { component: customComponentRef }) }
    })
    .map(field => {
        const [subfields, subComponents] = field.fields ? MapComponentStore(field.fields) : [null, null]
        if(subComponents) componentStore = { ...componentStore, ...subComponents }
        return {
            ...field,
            ...(field.fields && { fields: subfields })
        }
    })

    return [mappedFields, componentStore]
}

export const MapDependenciesAsObject = (arrayDependencies: any) => {
    let dependencies: any = {};
    for (const { key, value } of arrayDependencies) dependencies[key] = value;
    return dependencies;
}

const GetOffset = (key: any) => {
    try {
        if(!key) return 0
        const offset = key.split(':').pop()
        return offset && !isNaN(+offset )  ? +offset : 0
    } catch(err) {
        return 0
    }
}

export const SetPropertyFromPath = (object: { [key: string]: any }, path: string | string[], value: any) => {
    var properties = (Array.isArray(path) ? path : path.split('.'))
    properties.reduce((o,p,i) => o[p] = properties.length === ++i ? value : o[p] || {}, object)
}
export const GetPropertyFromPath = (path: string | (string | number)[], obj: any, key?: string) => {
    const offset = GetOffset(key)
    var properties = (Array.isArray(path) ? path : path.split('.')).map((pathKey, index, array) => index < array.length - offset ? pathKey : null).filter(pathKey => pathKey != null);
    return properties.reduce((prev, curr) => prev && prev[curr], obj);
}

export const FilterFieldActiveRules = (fields: InternalFormField[], activeStep: number) => fields.filter(field => field._stepIndex === activeStep)

export const MapOutputState = (inputState: any, fields: any = [], parentKey = "") => {
    let state: any = {}
    try {
        fields.forEach((field: any) => {
            const GetTransformedField = (value: any, field: any) => field.transform ? field.transform(value, field._dependencies) : value
            const GetFieldState = () => {
                if(!['array', 'object'].includes(field.type)) return GetTransformedField(field._stepRoot ? inputState[field._stepRoot][field.key] : inputState[field.key], field) ?? null
                else if(field.type === 'array') return ((field._stepRoot ? inputState[field._stepRoot][field.key] : inputState[field.key]) ?? []).map((item: any, index: number) => {
                    const { _collapsed, _uuid, ...itemData } = item
                    let output = MapOutputState(item, field?.items?.[index] ?? [], field.key)
                    if(field.extraProperties) {
                        for(const key in itemData) if(!field?.items?.[index].some((field: { [key: string]: any }) => field.key === key)) output[key] = itemData[key]
                    }
                    return output
                })
                else return MapOutputState((field._stepRoot ? inputState[field._stepRoot][field.key] : inputState[field.key]) ?? {}, field.fields ?? [], field.key)
            }
            if(!field?._enable || field.type === 'info') return
            else if(field._stepRoot) {
                if(!state[field._stepRoot]) state[field._stepRoot] = {}
                state[field._stepRoot][field.key] = GetFieldState()
            } else state[field.key] = GetFieldState()
        })
        return JSON.parse(JSON.stringify(state))
    } catch(err) {
        console.error(err)
        return JSON.parse(JSON.stringify(state))
    }
}