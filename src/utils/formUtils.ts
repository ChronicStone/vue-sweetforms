import { FormField } from "@/types/form.types";
import { required, helpers, minLength } from "@vuelidate/validators"
import { GenerateUUID } from "./baseUtils";
import { markRaw, toRaw } from 'vue';

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
        if(!['array', 'object'].includes(field.type)) state[field.key] = inputFormData[field.key] ?? field?.default ?? field.type === 'checkbox' ? false : field.type === 'number' ? 0 : null
        else if(field.type === 'array') state[field.key] = inputFormData[field.key] ?? field?.default ?? []
        else state[field.key] = MapFormInitialState(field.fields ?? [], inputFormData[field.key] ?? {}, field.key)
    })
    return state
}

export const MapFormRules = (fields: any[]) => {
    let rules: any = {}    
    fields.forEach((field: any) => {
        rules[field.key] = { 
            ...(typeof rules[field.key] === 'object' && { ...rules[field.key] }),
            ...(field.type === 'object' && { ...rules[field.key], ...MapFormRules(field.fields ?? []) }),
            ...(field.type === 'array' && { ...rules[field.key], $each: helpers.forEach({ ...MapFormRules(field.fields ?? []), $trackBy: '_id' }) }),
            ...(typeof field?.validators === 'function' && { ...field.validators(field._dependencies, field), }),
            ...(typeof field.validators === 'object' && { ...field.validators, }),
            ...(field.required && { required: helpers.withMessage(`The field ${field.label} can't be empty`, required) })
        }
    })

    return rules   
}

export const MapStepsAsFields = (steps: any[]) => steps.map((step, _stepIndex) =>  step.fields.map((field: any) => ({ ...field, _stepIndex}))).flat()

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