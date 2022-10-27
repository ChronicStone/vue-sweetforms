import { FieldOption } from "./fieldOption.types"
import { Ref, ComputedRef } from "vue"
import { FormField } from "./fields";

export type UnknownObject = { [key: string]: any };
export type FieldTypes = 'tag' | 'text' | 'textarea' | 'password' | 'number' | 'slider' | 'switch' | 'select' | 'cascader' | 'tree-select' | 'radio' | 'checkbox' | 'checkbox-group' | 'date' | 'time' | 'datetime' | 'datetimerange' | 'daterange' | 'month' | 'year' | 'file' | 'array' | 'object'

export type FieldValidationOptions = { [key: string]: any }

export interface SelectOption {
    label: string
    value: any
    icon: string

}

export interface ValidatorParams {
    field: FormField,
    value: any,
    formValues: object,
}



export type InternalFormField = FormField & {
    _dependencies: UnknownObject
    _evalOptions: Ref<boolean>
    _evalEnable: Ref<boolean>
    size: string | any
    gridSize: string | any
    _enable: boolean | ComputedRef<boolean>
    _options?: ComputedRef<SelectOption[]>
    _watcherOptions?: any
}

interface FormStep {
    title: string,
    gridSize?: string
    fields: FormField[],
}

interface ThemeConfig {
    general: object,
    FormModal: object,
    Input: object,
    Select: object,
}

export type SimpleForm = FormStep & {
    themeConfig?: ThemeConfig
    gridSize?: number
    onSubmit: () => any
    onCancel?: () => any
    
}

export interface SteppedForm {
    themeConfig?: ThemeConfig,
    gridSize: number,
    steps: FormStep[],
    onSubmit: () => any
    onCancel?: () => any
}

export type FormInstance = {
    formOptions: (SimpleForm | SteppedForm) & { _id: string, _resolve: (data: { isCompleted: boolean; formData: { [key: string]: any }}) => void },
    formData: { [key: string]: any }
}



