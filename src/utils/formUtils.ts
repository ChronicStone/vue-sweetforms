import { FormField } from "@/types/form.types";

interface InternalFormField extends FormField {
    _stepIndex?: number
}

export const MapArrayToObject = (array: any[]) => {
    let obj: any = {}
    for(const { key, value } of array) obj[key] = value
    return obj
}

export const MapFormInitialState = (fields: any[], inputFormData: any) => {
    let state: any = {}
    fields.forEach((field: any) => {
        if(!['array', 'object'].includes(field.type)) state[field.key] = inputFormData[field.key] ?? null
        if(field.type === 'object') state[field.key] = MapFormInitialState(field.children, inputFormData[field.key] ?? {})
    })
    return state
}

export const MapFormRules = (fields: any[]) => {
    let rules: any = {}    
    fields.forEach((field: any) => {
        if(!['array', 'object'].includes(field.type)) rules[field.key] = field.validators ? { ...field.validators } : {}
        if(field.type === 'object') rules[field.key] = MapFormRules(field.children)
    })
    return rules   
}
