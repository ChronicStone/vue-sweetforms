import { FieldTypes } from "@/types/fields"

export const MapFieldProps = (fieldType: FieldTypes, fieldProps: any = {}) => {
    switch(fieldType) {
        case 'text':
        case 'textarea':
        case 'password':
            return {
                'show-count': fieldProps.showCount ?? false,
                rows: fieldProps?.rows ?? 3,
                autosize: fieldProps?.autosize ?? false,
                ...(fieldProps.minLength && { minlength: fieldProps.minLength }),
                ...(fieldProps.maxLength && { maxlength: fieldProps.maxLength }),
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
                ...(fieldProps.renderTag && { 'render-tag': fieldProps.renderTag }),
                'max-tag-count': fieldProps.maxSelectedCount ?? 'responsive',
                tag: fieldProps.writable ?? false,
            }
        case 'tree-select':
            return {
                cascade: fieldProps?.cascade ?? true,
                clearable: fieldProps?.clearable ?? true,
                multiple: fieldProps?.multiple ?? false,
                'check-strategy': fieldProps?.checkStrategy ?? 'all',
                ...(fieldProps.childrenField && { 'children-field': fieldProps.childrenField }),
                ...(fieldProps.valueField && { 'value-field': fieldProps.valueField }),
                ...(fieldProps.labelField && { 'label-field': fieldProps.labelField }),
                ...(fieldProps.disabledField && { 'disabled-field': fieldProps.valueField }),
                'max-tag-count': fieldProps?.maxSelectedCount ?? 'responsive',
                'clear-filter-after-select': fieldProps?.clearFilterAfterSelect ?? true,
                'allow-checking-not-loaded': fieldProps?.allowCheckingNotLoaded ?? false,
                filterable: fieldProps?.filterable ?? true,
                placement: fieldProps?.placement ?? 'bottom-start',
                remote: fieldProps?.remote ?? false,
                separator: fieldProps?.separator ?? '/',
                'show-path': fieldProps?.showPath ?? true,
                'virtual-scroll': fieldProps?.virtualScroll ?? false,
                ...(fieldProps.renderLabel && { 'render-label': fieldProps.renderLabel }),
                ...(fieldProps.filter && { filter: fieldProps.filter }),
                ...(fieldProps.filterMenuProps && { 'filter-menu-props': fieldProps.filterMenuProps }),
            }
        case 'cascader':
            return {
                cascade: fieldProps?.cascade ?? true,
                clearable: fieldProps?.clearable ?? true,
                multiple: fieldProps?.multiple ?? false,
                checkable: fieldProps?.checkable ?? false,
                'check-strategy': fieldProps?.checkStrategy ?? 'all',
                'max-tag-count': fieldProps?.maxSelectedCount ?? 'responsive',
                'clear-filter-after-select': fieldProps?.clearFilterAfterSelect ?? true,
                'allow-checking-not-loaded': fieldProps?.allowCheckingNotLoaded ?? false,
                'consistent-menu-width': fieldProps?.consistentMenuWidth ?? true,
                'default-expanded-keys': fieldProps?.defaultExpandedKeys ?? [],
                filterable: fieldProps?.filterable ?? true,
                placement: fieldProps?.placement ?? 'bottom-start',
                remote: fieldProps?.remote ?? false,
                separator: fieldProps?.separator ?? '/',
                'show-path': fieldProps?.showPath ?? true,
                'virtual-scroll': fieldProps?.virtualScroll ?? false,
                ...(fieldProps.renderLabel && { 'render-label': fieldProps.renderLabel }),
                ...(fieldProps.renderPrefix && { 'render-prefix': fieldProps.renderPrefix }),
                ...(fieldProps.renderSuffix && { 'render-suffix': fieldProps.renderSuffix }),
                ...(fieldProps.renderSwitcherIcon && { 'render-switcher-icon': fieldProps.renderSwitcherIcon }),
                ...(fieldProps.renderTag && { 'render-tag': fieldProps.renderTag }),
                ...(fieldProps.filter && { filter: fieldProps.filter }),
                ...(fieldProps.filterMenuProps && { 'filter-menu-props': fieldProps.filterMenuProps }),
                ...(fieldProps.childrenField && { 'children-field': fieldProps.childrenField }),
                ...(fieldProps.keyField && { 'key-field': fieldProps.valueField }),
                ...(fieldProps.labelField && { 'label-field': fieldProps.labelField }),
                ...(fieldProps.disabledField && { 'disabled-field': fieldProps.valueField }),
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
        case 'rating':
            return {
                'allow-half': fieldProps.allowHalf ?? false,
                'count': fieldProps.iconCount ?? 5,
                'size': fieldProps.iconSize ?? 'medium',
                'color': fieldProps.iconColor ?? '#f7ba2a',
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
                ...(fieldProps.uncheckedValue && { 'unchecked-value': fieldProps.uncheckedValue }),
                ...(fieldProps.checkedValue && { 'checked-value': fieldProps.checkedValue }),
            }
        case 'checkbox-group':
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
                ...(fieldProps.hourStep && { 'hours': fieldProps.hourStep }),
                ...(fieldProps.minuteStep && { 'minutes': fieldProps.minuteStep }),
                ...(fieldProps.secondStep && { 'seconds': fieldProps.secondStep }),
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
        case 'tag': 
            return {

            }
        case 'object':
        case 'array':
        default: 
            return {
                ...(fieldProps.max && { max: fieldProps.max }),
                ...(fieldProps.closable && { 'closable': fieldProps.closable }),
                ...(fieldProps.tagStyle && { 'tag-style': fieldProps.tagStyle }),
                ...(fieldProps.type && { 'type': fieldProps.type }),
                ...(fieldProps.renderTag && { 'render-tag': fieldProps.renderTag }),
                ...(fieldProps.color && { 'color': fieldProps.color }),
                ...(fieldProps.formatTag && { 'format-tag': fieldProps.formatTag }),
                ...(fieldProps.round && { 'round': fieldProps.round }),
            }
    }
}

export const ParseErrMsg = ($v: any, field: any) => {
    if(field.type != 'array') return $v.$errors.filter((err: any) => err.$validator != '$each')[0]?.$message
    else {
        if($v.$errors[0]?.$validator === '$each') return `The field ${field.label} has items with invalid properties`
        else return $v.$errors[0]?.$message
    }
}