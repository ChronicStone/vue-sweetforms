<template>
    <div class="flex flex-col gap-2" :style="`grid-column: span ${field.size ?? '1'} / span ${ gridSize ?? '12'};`">
        <div class="flex gap-2 items-center justify-between">
            <span class="m-0 capitalize flex gap-2 justify-start items-center">
                <div class="grid h-5 w-5 place-items-center  bg-opacity-10 rounded-full hover:(bg-gray-500 bg-opacity-20)" @click="collapsed = !collapsed" v-if="['object', 'array'].includes(field.type)">
                    <i-mdi-chevron-right class="transition duration-150 ease-in-out transform cursor-pointer" :class="collapsed ? '' : 'rotate-90'"/>
                </div>
                <span>
                    {{field.label}} <span class="text-red-500">{{field.required ? '*' : ''}}</span>
                </span>
            </span>
            <NTooltip v-if="field.description" :style="{ maxWidth: '300px', maxHeight: '400px', backgroundOpacity: '1', overflowX: 'auto', ...(field?.fieldParams?.descriptionStyles) }">
                <template #trigger>
                    <div class="h-5 w-5 cursor-pointer grid place-items-center"><i-mdi-information class="h-3.5 w-3.5"/></div>
                </template>
                <div v-html="field.description" />
            </NTooltip>
        </div>

        <NInput 
            @blur="validator.$touch" 
            v-if="['text', 'textarea', 'password'].includes(field.type)" 
            :type="field.type" 
            v-model:value="fieldValue"
            v-bind="field.fieldParams"
        />
        <NSelect 
            @blur="validator.$touch" 
            v-if="field.type === 'select'" 
            v-model:value="fieldValue" 
            :placeholder="field.placeholder"
            :options="field._options ?? field.options"
            v-bind="field.fieldParams" 
            :loading="field._evalOptions"
            filterable
        />
        <NInputNumber 
            @blur="validator.$touch" 
            v-if="field.type === 'number'" 
            v-model:value="fieldValue" 
            v-bind="field.fieldParams"
            :placeholder="field.placeholder"
        />
        <NDatePicker
            @blur="validator.$touch" 
            v-if="['date', 'datetime', 'daterange', 'datetimerange', 'month', 'year', 'day'].includes(field.type)"
            v-model:value="fieldValue" 
            :placeholder="field.placeholder"
            :type="field.type"
            v-bind="field.fieldParams"
            update-value-on-close
        />
        <NTimePicker
            @blur="validator.$touch" 
            v-if="field.type === 'time'"
            v-model:value="fieldValue" 
            :placeholder="field.placeholder"
            v-bind="field.fieldParams"

        />
        <NSlider 
            @blur="validator.$touch" 
            v-if="['slider'].includes(field.type)"
            v-model:value="fieldValue"
            v-bind="field.fieldParams"
        />
        <NRadioGroup
            @blur="validator.$touch" 
            v-if="field.type === 'radio'" 
            v-model:value="fieldValue"
            :name="field.key"
        >
            <div class="gap-4 flex flex-wrap justify-between">
                <NRadio 
                    @blur="validator.$touch" 
                    v-for="({ label, value}, optionId) in field._options ?? field.options" 
                    :style="`grid-column: span 1 / span ${ field?.fieldParams?.gridSize ?? '2'};`"
                    :key="optionId"
                    :value="value"
                >
                    {{ label }}
                </NRadio>
            </div>
        </NRadioGroup>
        
        
        <NCollapseTransition :show="!collapsed">
            <NCard v-if="field.type === 'object'">
                <div class="grid gap-4" :style="`grid-template-columns: repeat(${field.gridSize ?? '2'},minmax(0,1fr));`">
                    <FormInput 
                        v-for="(childField, childFieldKey) in field.fields ?? []"
                        :key="childFieldKey"
                        :gridSize="field.gridSize"
                        :field="childField"
                        :validator="validator[childField.key]"
                        v-model="fieldValue[childField.key]"
                        :indent="indent + 1"            
                    />
                </div>
            </NCard>
        </NCollapseTransition>
        <NAlert type="error" :show-icon="false" v-if="validator.$errors.length && field.type != 'object'" class="w-full">
            <div class="flex items-center gap-2">
                <i-mdi-information class="text-red-500"/>
                <span class="text-red-500">{{ validator.$errors[0].$message }}</span>
            </div>
        </NAlert>
    </div>
</template>

<script lang="ts">
    export default {
        name: 'FormInput',
    }
</script>

<script setup lang="ts">
    import { computed, ref } from "vue"
    import { NCard, NCollapseTransition, NInput, NSelect, NInputNumber, NAlert, NDatePicker, NTimePicker, NSlider, NRadioGroup, NRadio, NTooltip, useThemeVars } from "naive-ui"
    import { TransformHexToHexOpacity } from "../utils"
    const props = defineProps({
        gridSize: { 
            type: Number, 
            default: 2 
        },
        field: {
            type: Object,
            required: true
        },
        validator: {
            type: Object,
            required: true
        },
        modelValue: {
            type: [String, Number, Date, Array, Object],
        },
        indent: {
            type: Number,
            default: 1
        }
    })

    const collapsed = ref(props.field.collapsed ?? false)
    const themeVars = useThemeVars()
    const emit = defineEmits(['update:modelValue'])
    const fieldValue = computed({
        get() { return props.modelValue },
        set(value: any) { emit('update:modelValue', value) }
    })
</script>

<style>

:is(.n-input__textarea-el, .n-tooltip) {
    overscroll-behavior-y: contain;
}

:is(.n-input__textarea-el, .n-tooltip)::-webkit-scrollbar {
  width: 5px;
  cursor:pointer !important;
}

:is(.n-input__textarea-el, .n-tooltip)::-webkit-scrollbar-thumb {
  @apply bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer hover:bg-gray-300;
    cursor: pointer !important;
}

:is(.n-input__textarea-el, .n-tooltip)::-webkit-scrollbar-track {
  background: transparent;
  padding: 5px;
}
</style>