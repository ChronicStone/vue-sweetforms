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

interface Dependencies {
    [key: string]: any;
}

export interface BaseField {
    label: string | ((value: any) => VNodeChild);
    key: string;
    type: FieldTypes;
    placeholder?: string;
    dependencies?: (string | [string, string])[];
    required: boolean | ((dependencies?: { [key: string]: any }) => boolean);
    condition?: (dependencies?: Dependencies) => boolean;
    conditionEffect?: "disable" | "hide";
    size?: number | string;
    default?: any;
    preformat?: (value: any) => any;
    transform?: (value: any) => any;
}

export interface TextField extends BaseField {
    type: FieldTypes.TEXT;
    minLength?: number;
    maxLength?: number;
    pair?: string;
    clearable?: boolean;
}

export interface TextAreaField extends Omit<TextField, "type" | "pair"> {
    type: FieldTypes.TEXTAREA;
    autosize?: boolean | { minRows?: number; maxRows?: number };
}

export interface PasswordField extends Omit<TextField, "type" | "pair"> {
    type: FieldTypes.PASSWORD;
}

export interface SelectField extends BaseField {
    type: FieldTypes.SELECT;
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

export interface NumberField extends BaseField {
    type: FieldTypes.NUMBER;
    clearable?: boolean;
    min?: number;
    max?: number;
    step?: number;
}

export interface SliderField extends BaseField {
    type: FieldTypes.SLIDER;
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

export interface SwitchField extends BaseField {
    type: FieldTypes.SWITCH;
    checkedStyle?: string;
    uncheckedStyle?: string;
    checkedValue?: string | boolean | number;
    uncheckedValue?: string | boolean | number;
    rounded?: boolean;
}

export interface RadioField extends BaseField {
    type: FieldTypes.RADIO;
    options: { label: string; value: any }[] | ((dependencies?: Dependencies) => { label: string; value: any }[]);
}

export interface CheckboxField extends BaseField {
    type: FieldTypes.CHECKBOX;
    checkedValue?: string | boolean | number;
    uncheckedValue?: string | boolean | number;
}

export interface CheckboxGroupField extends BaseField {
    type: FieldTypes.CHECKBOX_GROUP;
    options: { label: string; value: any }[] | ((dependencies?: Dependencies) => { label: string; value: any }[]);
    minChecked?: number;
    maxChecked?: number;
}

export interface TimeField extends BaseField {
    type: FieldTypes.TIME;
    clearable?: boolean;
    bottomActions?: Array<"now" | "confirm"> | null;
    displayedHours?: number | number[];
    displayedMinutes?: number | number[];
    displayedSeconds?: number | number[];
    disableHour?: (hour: number) => boolean;
    disableMinute?: (minute: number, hour: number | null) => boolean;
    disableSecond?: (second: number, minute: number | null, hour: number | null) => boolean;
}

export interface DateField extends BaseField {
    type: FieldTypes.DATE | FieldTypes.DATE_TIME | FieldTypes.DATE_RANGE | FieldTypes.DATE_TIME_RANGE | FieldTypes.MONTH | FieldTypes.YEAR;
    clearable?: boolean;
    dateDisabled?: (current: number) => boolean;
    timeDisabled?: (current: number) => boolean;
}

export interface ObjectField extends BaseField {
    type: FieldTypes.OBJECT;
    extraProperties?: boolean;
    fields: Field[];
    gridSize?: number | string;
}

export interface ArrayField extends BaseField {
    type: FieldTypes.ARRAY;
    format?: "table" | "list" | "tabs";
    extraProperties?: boolean;
    gridSize?: number | string;
    fields: Field[];
}

export type Field =
    | TextField
    | TextAreaField
    | PasswordField
    | SelectField
    | NumberField
    | SliderField
    | SwitchField
    | RadioField
    | CheckboxField
    | CheckboxGroupField
    | TimeField
    | DateField
    | ObjectField
    | ArrayField;
