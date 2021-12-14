import { FormField } from "@/types/form.types";
import { required, helpers } from "@vuelidate/validators"

interface InternalFormField extends FormField {
    _stepIndex?: number
}

export const MapArrayToObject = (array: any[]) => {
    let obj: any = {}
    for(const { key, value } of array) obj[key] = value
    return obj
}

export const MapFormInitialState = (fields: any[], inputFormData: any = {}) => {
    let state: any = {}
    fields.forEach((field: any) => {
        if(!['array', 'object'].includes(field.type)) state[field.key] = inputFormData[field.key] ?? field.type === 'array' ? [] : field.type === 'object' ? {} : field.type === 'boolean' ? false : null
        else state[field.key] = MapFormInitialState(field.fields ?? [], inputFormData[field.key] ?? {})
    })
    return state
}

export const MapFormRules = (fields: any[]) => {
    console.log({ fields })
    let rules: any = {}    
    fields.forEach((field: any) => {
<<<<<<< Updated upstream
        if(!['array', 'object'].includes(field.type)) rules[field.key] = field.validators ? { ...field.validators } : { required }
        else if(field.type === 'object') rules[field.key] = MapFormRules(field.fields ?? [])
        else if(field.type === 'array') rules[field.key] = { $each: { ...MapFormRules(field.fields ?? []), $trackBy: '_id' } }
=======
        rules[field.key] = { 
            ...(typeof rules[field.key] === 'object' && { ...rules[field.key] }),
            ...(field.type === 'object' && { ...rules[field.key], ...MapFormRules(field.fields ?? []) }),
            ...(field.type === 'array' && { ...rules[field.key], $each: helpers.forEach({ ...MapFormRules(field.fields ?? []), $trackBy: '_id' }) }),
            ...(typeof field?.validators === 'function' && { ...field.validators(field._dependencies, field), }),
            ...(typeof field.validators === 'object' && { ...field.validators, }),
            ...(field.required && { required: helpers.withMessage(`The field ${field.label} can't be empty`, required) })
        }
>>>>>>> Stashed changes
    })
    console.log({ rules })

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