import { VNodeChild, VNode } from 'vue';
import { SelectGroupOption } from "naive-ui"

interface BaseOption {
    clearable?: boolean
}

export interface SelectOption extends BaseOption {
    filterable?: boolean;
    multiple?: boolean;
    virtualScroll?: boolean;
    tagMode?: boolean;
    renderLabel?: (option: SelectOption | SelectGroupOption, selected: boolean) => VNodeChild;
    renderOption?: (info: { node: VNode, option: SelectOption | SelectGroupOption, selected: boolean }) => VNodeChild;
    renderTag?: (option: any, onClose: () => void) => VNodeChild;
}

export interface InputOption extends BaseOption {
    minLength?: number;
    maxLength?: number;
    showCharacterCount?: boolean;
    prefix?: string;
    suffix?: string;
}

export interface TextareaOption extends InputOption {
    rows?: number;
    autosize?: boolean | { minRows?: number, maxRows?: number }
}

export interface InputNumberOption extends BaseOption {
    prefix?: string;
    suffix?: string;
    min?: number;
    max?: number;
    step?: number;
    showIncrementButtons?: boolean;
}

export interface SliderOption {
    min?: number;
    max?: number;
    step?: number;
    range?: boolean | 'mark';
    showTooltip?: boolean;
    formatTooltip?: (value: number) => string | number;
    marks?: { [markValue: number]: string }
    reverse?: boolean;
}

export interface TimePickerOption extends BaseOption {
    bottomActions?: Array<'now' | 'confirm'> | null
    format?: string;
    displayedHours?: Array<number> | number;
    displayedMinutes?: Array<number> | number;
    displayedSeconds?: Array<number> | number;
    disableHour?: (hour: number) => boolean;
    disableMinute?: (minute: number, hour: number) => boolean;
    disableSecond?: (second: number, minute: number, hour: number) => boolean;
    use12HoursFormat?: boolean;
}

export interface DatePickerOption extends BaseOption {
    format?: string;
    dateDisabled?: (current: number) => boolean;
    timeDisabled?: (current: number) => { isHourDisabled?: () => boolean, isMinuteDisabled?: () => boolean, isSecondDisabled?: () => boolean };
    separator?: string;

}

export interface CheckboxOption {
    hasThirdState?: boolean;
    defaultChecked?: boolean
}

export interface CheckboxGroupOption {
    minChecked?: number;
    maxChecked?: number;
}

export interface SwitchOption {
    checkedValue?: string | number | boolean
    defaultValue?: boolean
    checkedText?: string
    uncheckedText?: string
}

export type FieldOption = SelectOption | InputOption | TextareaOption | InputNumberOption | SliderOption | TimePickerOption | DatePickerOption | CheckboxOption | CheckboxGroupOption | SwitchOption;