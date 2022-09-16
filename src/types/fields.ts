import { SelectGroupOption, SelectOption } from "naive-ui";
import { SelectBaseOption } from "naive-ui/es/select/src/interface";
import { VNode, VNodeChild } from "vue";

export enum FieldTypes {
    TEXT = "text",
    NUMBER = "number",
    SELECT = "select",
    SWITCH = "switch",
    CHECKBOX = "checkbox",
    CHECKBOX_GROUP = "checkbox-group",
    RADIO = "radio",
    SLIDER = "slider",
    TEXTAREA = "textarea",
    PASSWORD = "password",
    DATE = "date",
    DATE_TIME = "datetime",
    DATE_RANGE = "daterange",
    DATE_TIME_RANGE = "datetimerange",
    MONTH = "month",
    YEAR = "year",
    TIME = "time",
    CUSTOM_COMPONENT = "custom-component",
    OBJECT = "object",
    ARRAY = "array",
    INFO = "info",
}

export type TFieldTypes = "text" | "number" | "select" | "switch" | "checkbox" | "checkbox-group" | "radio" | "slider" | "textarea" | "password" | "date" | "datetime" | "daterange" | "datetimerange" | "month" | "year" | "time" | "custom-component" | "object" | "array" | "info";


interface Dependencies {
    [key: string]: any;
}

export type _FieldOptions = SelectOption[] | ((dependencies?: Dependencies) => SelectOption[])


export interface TextField {
    type: "text";
    minLength?: number;
    maxLength?: number;
    pair?: string;
    clearable?: boolean;
}

export interface TextAreaField extends Omit<TextField, "type" | "pair"> {
    type: "textarea";
    autosize?: boolean | { minRows?: number; maxRows?: number };
}

export interface PasswordField extends Omit<TextField, "type" | "pair"> {
    type: "password";
}

export interface SelectField {
    type: "select";
    options: SelectOption[] | ((dependencies?: Dependencies) => SelectOption[]);
    multiple?: boolean;
    clearable?: boolean;
    filterable?: boolean;
    renderLabel?: (option: SelectOption | SelectGroupOption, selected: boolean) => VNodeChild;
    renderOption?: (info: { node: VNode; option: SelectOption | SelectGroupOption; selected: boolean }) => VNodeChild;
    renderTag?: (props: { option: SelectBaseOption; handleClose: () => void }) => VNodeChild;
    createTags?: boolean;
    virtualScroll?: boolean;
}

export interface NumberField {
    type: "number";
    clearable?: boolean;
    min?: number;
    max?: number;
    step?: number;
}

export interface SliderField {
    type: "slider";
    min?: number;
    max?: number;
    step?: number;
    range?: boolean;
    enableTooltip?: boolean;
    alwaysShowTooltip?: boolean;
    tooltipPlacement?:
        | "top-start"
        | "top"
        | "top-end"
        | "right-start"
        | "right"
        | "right-end"
        | "bottom-start"
        | "bottom"
        | "bottom-end"
        | "left-start"
        | "left"
        | "left-end";
    reverse?: boolean;
    marks?: { [markValue: number]: string };
}

export interface SwitchField {
    type: "switch";
    checkedStyle?: string;
    uncheckedStyle?: string;
    checkedValue?: string | boolean | number;
    uncheckedValue?: string | boolean | number;
    rounded?: boolean;
}

export interface RadioField {
    type: "radio";
    options: { label: string; value: any }[] | ((dependencies?: Dependencies) => { label: string; value: any }[]);
}

export interface CheckboxField {
    type: "checkbox";
    checkedValue?: string | boolean | number;
    uncheckedValue?: string | boolean | number;
}

export interface CheckboxGroupField {
    type: "checkbox-group";
    options: { label: string; value: any }[] | ((dependencies?: Dependencies) => { label: string; value: any }[]);
    minChecked?: number;
    maxChecked?: number;
}

export interface TimeField {
    type: "time";
    clearable?: boolean;
    bottomActions?: Array<"now" | "confirm"> | null;
    displayedHours?: number | number[];
    displayedMinutes?: number | number[];
    displayedSeconds?: number | number[];
    disableHour?: (hour: number) => boolean;
    disableMinute?: (minute: number, hour: number | null) => boolean;
    disableSecond?: (second: number, minute: number | null, hour: number | null) => boolean;
}

export interface DateField {
    type: "date" | "datetime" | "daterange" | "datetimerange" | "month" | "year";
    clearable?: boolean;
    dateDisabled?: (current: number) => boolean;
    timeDisabled?: (current: number) => boolean;
}

export interface ObjectField {
    type: "object";
    extraProperties?: boolean;
    // fields: FormField[];
    gridSize?: number | string;
}

export interface ArrayField {
    type: "array";
    format?: "table" | "list" | "tabs";
    extraProperties?: boolean;
    gridSize?: number | string;
    // fields: FormField[];
}

export interface InfoField {
    type: "info";
    content: ((dependencies: { [key: string]: any }) => VNodeChild | string);
}

export type FormField = {
    label: string | ((value: any) => VNodeChild);
    key: string;
    placeholder?: string;
    dependencies?: (string | [string, string])[];
    required?: boolean | ((dependencies?: { [key: string]: any }) => boolean);
    condition?: (dependencies?: Dependencies) => boolean;
    conditionEffect?: "disable" | "hide";
    size?: number | string;
    default?: any;
    preformat?: (value: any) => any;
    transform?: (value: any) => any;
    fields?: FormField[];
} & (TextField | TextAreaField | PasswordField | SelectField | NumberField | SliderField | SwitchField | RadioField | CheckboxField | CheckboxGroupField | TimeField | DateField | ObjectField | ArrayField | InfoField);