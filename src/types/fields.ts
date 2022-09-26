import { Component } from "vue";
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

export type _FieldOptions = SelectOption[] | ((dependencies?: Dependencies) => SelectOption[]) | ((dependencies?: Dependencies) => Promise<SelectOption[]>);


export interface TextField {
    type: "text",
    clearable?: boolean;
    fieldParams?: { 
        minLength?: number;
        maxLength?: number;
        showCharacterCount?: boolean;
        prefix?: string;
        suffix?: string;
    }
}

export interface TextAreaField {
    type: "textarea";
    clearable?: boolean;
    fieldParams?: TextField["fieldParams"] & {
        autosize?: boolean | { minRows?: number; maxRows?: number };
        showCount?: boolean;
    }
}

export interface PasswordField extends Omit<TextField, "type" | "pair"> {
    type: "password";
    clearable?: boolean;
    fieldParams?: {}
}

export interface SelectField {
    type: "select";
    clearable?: boolean;
    options: _FieldOptions
    fieldParams?: {
        multiple?: boolean;
        filterable?: boolean;
        renderLabel?: (option: SelectOption | SelectGroupOption, selected: boolean) => VNodeChild;
        renderOption?: (info: { node: VNode; option: SelectOption | SelectGroupOption; selected: boolean }) => VNodeChild;
        renderTag?: (props: { option: SelectBaseOption; handleClose: () => void }) => VNodeChild;
        createTags?: boolean;
        virtualScroll?: boolean;
    }
}

export interface NumberField {
    type: "number";
    clearable?: boolean;
    fieldParams?: {
        min?: number;
        max?: number;
        step?: number;
    }
}

export interface SliderField {
    type: "slider";
    fieldParams?: {
        min?: number;
        max?: number;
        step?: number;
        range?: boolean;
        reverse?: boolean;
        enableTooltip?: boolean;
        formatTooltip?: (value: number) => string | number; 
        // alwaysShowTooltip?: boolean;
        // tooltipPlacement?:
        //     | "top-start"
        //     | "top"
        //     | "top-end"
        //     | "right-start"
        //     | "right"
        //     | "right-end"
        //     | "bottom-start"
        //     | "bottom"
        //     | "bottom-end"
        //     | "left-start"
        //     | "left"
        //     | "left-end";
        marks?: { [markValue: number]: string };
    }
}

export interface SwitchField {
    type: "switch";
    fieldParams?: {
        checkedStyle?: string;
        uncheckedStyle?: string;
        checkedValue?: string | boolean | number;
        uncheckedValue?: string | boolean | number;
    }
}

export interface RadioField {
    type: "radio";
    options: _FieldOptions
}

export interface CheckboxField {
    type: "checkbox";
    fieldParams?: {
        checkedValue?: string | boolean | number;
        uncheckedValue?: string | boolean | number;
    }
}

export interface CheckboxGroupField {
    type: "checkbox-group";
    options: _FieldOptions
    fieldParams?: {
        minChecked?: number;
        maxChecked?: number;
    }
}

export interface TimeField {
    type: "time";
    clearable?: boolean;
    fieldParams?: {
        bottomActions?: Array<"now" | "confirm"> | null;
        displayedHours?: number | number[];
        displayedMinutes?: number | number[];
        displayedSeconds?: number | number[];
        disableHour?: (hour: number) => boolean;
        disableMinute?: (minute: number, hour: number | null) => boolean;
        disableSecond?: (second: number, minute: number | null, hour: number | null) => boolean;
    }
}

export interface DateField {
    type: "date" | "datetime" | "daterange" | "datetimerange" | "month" | "year";
    clearable?: boolean;
    fieldParams?: {
        dateDisabled?: (current: number) => boolean;
        timeDisabled?: (current: number) => boolean;
        separator?: string;
    }
}

export interface ObjectField<N> {
    type: "object";
    extraProperties?: boolean;
    gridSize?: number | string;
    fields: FormField<N>[];
}

export interface ArrayField<N> {
    type: "array";
    format?: "table" | "list" | "tabs";
    extraProperties?: boolean;
    gridSize?: number | string;
    fields: FormField<N>[];
}

export interface InfoField {
    type: "info";
    content: ((dependencies: { [key: string]: any }) => VNodeChild | string);
}

export interface CustomComponent {
    type: "custom-component";
    component: Component;
}

export type FormField<N = any> = {
    label?: string | ((dependencies: { [key: string]: any }) => VNodeChild | string);
    key: N;
    placeholder?: string;
    dependencies?: (string | [string, string])[];
    required?: boolean | ((dependencies?: { [key: string]: any }) => boolean);
    size?: number | string;
    gridSize?: number | string;
    default?: any;
    fields?: FormField<N>[];
    conditionEffect?: "disable" | "hide";
    labelPosition?: "left" | "top";
    condition?: (dependencies?: Dependencies) => boolean;
    preformat?: (value: any) => any;
    transform?: (value: any) => any;
    validators?: (dependencies?: { [key: string]: any }) => { [key: string]: any } | { [key: string]: any }
  } & (TextField | TextAreaField | PasswordField | SelectField | NumberField | SliderField | SwitchField | RadioField | CheckboxField | CheckboxGroupField | TimeField | DateField | ObjectField<N> | ArrayField<N> | InfoField | CustomComponent);

  