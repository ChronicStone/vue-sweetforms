import { FormField } from "@/types/form.types";
import { required, helpers, minLength } from "@vuelidate/validators"

interface InternalFormField extends FormField {
    _stepIndex?: number
}

export const MapArrayToObject = (array: any[]) => {
    let obj: any = {}
    for(const { key, value } of array) obj[key] = value
    return obj
}

export const MapFormInitialState = (fields: any[], inputFormData: any = {}, parentKey = "") => {
    const state: any = {}
    fields.forEach((field: any) => {
        if(!['array', 'object'].includes(field.type)) state[field.key] = inputFormData[field.key] ?? null
        else if(field.type === 'array') state[field.key] = inputFormData[field.key] ?? []
        else state[field.key] = MapFormInitialState(field.fields ?? [], inputFormData[field.key] ?? {}, field.key)
    })
    return state
}

export const MapFormRules = (fields: any[]) => {
    let rules: any = {}    
    fields.forEach((field: any) => {
        if(!['array', 'object'].includes(field.type)) rules[field.key] = field.validators && typeof field.validators === 'function' ? { ...field.validators(field._dependencies), ...(field.required && { required } ) } : typeof field.validators === 'object' ? { ...field.validators, ...(field.required && { required  }) } : { ...(field.required && { required  }) } 
        else if(field.type === 'object') rules[field.key] = MapFormRules(field.fields ?? [])
        else if(field.type === 'array') rules[field.key] = { $each: helpers.forEach({ ...MapFormRules(field.fields ?? []), $trackBy: '_id' }), }
    })

    return rules   
}

export const MapStepsAsFields = (steps: any[]) => steps.map((step, _stepIndex) =>  step.fields.map((field: any) => ({ ...field, _stepIndex}))).flat()

export const MapDependenciesAsObject = (arrayDependencies: any) => {
    let dependencies: any = {};
    for (const { key, value } of arrayDependencies) dependencies[key] = value;
    return dependencies;
}

export const ResolveFromString = (path: string, obj: any, separator = '.') => {
    var properties: string[] = Array.isArray(path) ? path : path.split(separator);
    return properties.reduce((prev, curr) => prev && prev[curr], obj);
}

export const FilterFieldActiveRules = (fields: InternalFormField[], activeStep: number) => fields.filter(field => field._stepIndex === activeStep)

export const MapOutputState = (inputState: any, fields: any = [], parentKey = "") => {
    let state: any = {}
    try {
        fields.forEach((field: any) => {
            if(!field?._enable) return
            if(!['array', 'object'].includes(field.type)) state[field.key] = inputState[field.key] ?? null
            else if(field.type === 'array') state[field.key] = (inputState[field.key] ?? []).map((item: any) => MapOutputState(item, field.fields ?? [], field.key))
            else state[field.key] = MapOutputState(inputState[field.key] ?? {}, field.fields ?? [], field.key)
        })
        return JSON.parse(JSON.stringify(state))
    } catch(err) {
        console.error(err)
        return JSON.parse(JSON.stringify(state))
    }
}