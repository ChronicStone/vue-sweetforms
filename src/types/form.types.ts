import { FieldOption } from "./fieldOption.types"
import { Ref, ComputedRef } from "vue"

export type UnknownObject = { [key: string]: any };
export type FieldTypes = 'text' | 'textarea' | 'password' | 'number' | 'slider' | 'switch' | 'select' | 'radio' | 'checkbox' | 'checkboxGroup' | 'date' | 'time' | 'datetime' | 'datetimerange' | 'daterange' | 'month' | 'year' | 'file' | 'array' | 'object'

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

export interface FormField {
    key: string,
    label: string,
    type: FieldTypes
    placeholder?: string,
    size?: string,
    options?: SelectOption[] | any[]
    dependencies?: string[]
    condition?: () => boolean,
    conditionEffect?: 'disable' | 'hide'
    validators?: Array<(validatorParams: ValidatorParams) => boolean>
    fieldParams?: FieldOption
    gridSize?: string
    children?: FormField[]
}

export interface InternalFormField extends FormField {
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

export interface SimpleForm extends FormStep {
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

export type FormInstance = SimpleForm | SteppedForm


