type GridSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

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
    type: 'text' | 'textarea' | 'password' | 'number' | 'email' | 'select' | 'radio' | 'checkbox' | 'date' | 'time' | 'datetime' | 'datetimerange' | 'daterange' | 'month' | 'year' | 'file' | 'array' | 'object',
    placeholder?: string,
    size?: GridSize,
    options?: SelectOption[] | any[]
    dependencies?: string[]
    condition?: () => boolean,
    conditionEffect?: 'disable' | 'hide'
    validators?: Array<(validatorParams: ValidatorParams) => boolean>
    fieldParams?: {
        clearable?: boolean,
        multiple?: boolean,
        fileType?: string[] | string
        fileMaxSize?: number,
    },
    children?: FormField[]
}

interface FormStep {
    title: string,
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


