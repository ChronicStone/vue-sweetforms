import { FieldOption, FieldTypes } from "../types"

export const MapFieldProps = (fieldType: FieldTypes, fieldProps: any = {}) => {
    switch(fieldType) {
        case 'text':
        case 'textarea':
        case 'password':
            return {
                'show-count': fieldProps.showCharacterCount ?? false,
                rows: fieldProps?.rows ?? 3,
                autosize: fieldProps?.autosize ?? false,
                ...(fieldProps.minLength && { minLength: fieldProps.minLength }),
                ...(fieldProps.maxLength && { maxLength: fieldProps.maxLength }),
                ...(fieldProps.prefix && { prefix: fieldProps.prefix }),
                ...(fieldProps.suffix && { suffix: fieldProps.suffix }),
                ...(fieldType === 'password' && { 'show-password-on': 'click' }),
            }
        case 'select':
            return {
                filterable: fieldProps.filterable ?? true,
                clearable: fieldProps.clearable ?? true,
                multiple: fieldProps.multiple ?? false,
                'virtual-scroll': fieldProps.virtualScroll ?? false,
                ...(fieldProps.renderLabel && { 'render-label': fieldProps.renderLabel }),
                ...(fieldProps.renderOption && { 'render-option': fieldProps.renderOption }),
                ...(fieldProps.renderTag && { 'render-tag': fieldProps.renderTag })
            }
        case 'number':
            return {
                'show-button': fieldProps.showIncrementButtons ?? true,
                ...(fieldProps.min && { min: fieldProps.min }),
                ...(fieldProps.max && { max: fieldProps.max }),
                ...(fieldProps.step && { step: fieldProps.step }),
                ...(fieldProps.prefix && { prefix: fieldProps.prefix }),
                ...(fieldProps.suffix && { suffix: fieldProps.suffix }),
            }
        case 'slider':
            return {
                min: fieldProps.min ?? 0,
                max: fieldProps.max ?? 100,
                step: fieldProps.step ?? 1,
                range: fieldProps.range ?? false,
                reverse: fieldProps.reverse ?? false,
                tooltip: fieldProps.showTooltip ?? true,
                'format-tooltip': fieldProps.formatTooltip ?? function(value: number) { return value },
                ...(fieldProps.marks && { marks: fieldProps.marks }),
            }
        case 'switch':
            return {
                'checked-value': fieldProps.checkedValue ?? true,
                'default-value': fieldProps.defaultValue ?? false,
                ...(fieldProps.checkedStyle && { 'checked-style': fieldProps.checkedStyle }),
                ...(fieldProps.uncheckedStyle && { 'unchecked-style': fieldProps.uncheckedStyle }),
            }
        case 'radio':
            return {}
        case 'checkbox':
            return {
                'default-checked': fieldProps.defaultChecked ?? false,
                indeterminate: fieldProps.hasThirdState ?? false,
            }
        case 'checkboxGroup':
            return {
                ...(fieldProps.minChecked && { min: fieldProps.minChecked }),
                ...(fieldProps.maxChecked && { max: fieldProps.maxChecked }),
            }   
        case 'time':
            return {
                actions: fieldProps.bottomActions ?? ['clear', 'confirm'],
                use12HoursFormat: fieldProps.use12HoursFormat ?? false,
                ...(fieldProps.format && { format: fieldProps.format }),
                ...(fieldProps.displayedHours && { hours: fieldProps.displayedHours }),
                ...(fieldProps.displayedMinutes && { minutes: fieldProps.displayedMinutes }),
                ...(fieldProps.displayedSeconds && { seconds: fieldProps.displayedSeconds }),
                ...(fieldProps.disableHour && { 'is-hour-disabled': fieldProps.disableHour }),
                ...(fieldProps.disableMinute && { 'is-minute-disabled': fieldProps.disableMinute }),
                ...(fieldProps.disableSecond && { 'is-second-disabled': fieldProps.disableSecond }),
            }
        case 'date':
        case 'datetime':
        case 'daterange':
        case 'datetimerange':
        case 'month':
        case 'year':
            return {
                ...(fieldProps.separator && { 'separator': fieldProps.separator }),
                ...(fieldProps.format && { format: fieldProps.format }),
                ...(fieldProps.dateDisabled && { 'is-date-disabled': fieldProps.dateDisabled }),
                ...(fieldProps.timeDisabled && { 'is-time-disabled': fieldProps.timeDisabled }),

            }   
        case 'object':
        case 'array':
        default: 
            return {}
    }
}