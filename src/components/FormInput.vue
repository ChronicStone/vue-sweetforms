<template>
    <div class="flex flex-col gap-2" :class="field.size">
        <div class="flex gap-2 items-center justify-between">
            <span class="m-0 capitalize flex gap-2 justify-start items-center">
                <CollapseButton v-model="collapsed" v-if="['object', 'array'].includes(field.type)"/>
                <span>
                    {{field.label}}<span class="text-red-500 ml-1.5">{{field.required ? '*' : ''}}</span>
                </span>
            </span>

            <DescriptionPopup v-if="field.description" :description="field.description" :fieldLabel="field.label" />
        </div>

        <NInput 
            @blur="validator.$touch" 
            v-if="['text', 'textarea', 'password'].includes(field.type)" 
            :type="field.type" 
            v-model:value="fieldValue"
            v-bind="MapFieldProps(field.type, field.fieldParams)"
            :placeholder="field.placeholder"
        />
        <NSelect 
            @blur="validator.$touch" 
            v-if="field.type === 'select'" 
            v-model:value="fieldValue" 
            :placeholder="field.placeholder"
            :options="field._options ?? field.options"
            v-bind="MapFieldProps(field.type, field.fieldParams)" 
            :loading="field._evalOptions"
            filterable
        />
        <NInputNumber 
            @blur="validator.$touch" 
            v-if="field.type === 'number'" 
            v-model:value="fieldValue" 
            v-bind="MapFieldProps(field.type, field.fieldParams)"
            :placeholder="field.placeholder"
        />
        <NDatePicker
            @blur="validator.$touch" 
            v-if="['date', 'datetime', 'daterange', 'datetimerange', 'month', 'year', 'day'].includes(field.type)"
            v-model:value="fieldValue" 
            :placeholder="field.placeholder"
            :type="field.type"
            v-bind="MapFieldProps(field.type, field.fieldParams)"
            update-value-on-close
        />
        <NTimePicker
            @blur="validator.$touch" 
            v-if="field.type === 'time'"
            v-model:value="fieldValue" 
            :placeholder="field.placeholder"
            v-bind="MapFieldProps(field.type, field.fieldParams)"

        />
        <div class="flex flex-col gap-1 justify-center items-center h-full" v-if="['slider'].includes(field.type)">
            <NSlider 
                @blur="validator.$touch" 
                v-model:value="fieldValue"
                v-bind="MapFieldProps(field.type, field.fieldParams)"
            />
        </div>
        <NRadioGroup
            @blur="validator.$touch" 
            v-if="field.type === 'radio'" 
            v-model:value="fieldValue"
            :name="field.key"
        >
            <div class="gap-4 flex flex-wrap justify-start justify-between">
                <NRadio 
                    @blur="validator.$touch" 
                    v-for="({ label, value}, optionId) in field._options ?? field.options" 
                    :style="optionId === (field?._options?.length ?? field?.options?.length) - 1 ? 'margin-right: auto;' : ''"
                    :key="optionId"
                    :value="value"
                    v-bind="MapFieldProps(field.type, field.fieldParams)"
                >
                    {{ label }}
                </NRadio>
            </div>
        </NRadioGroup>
        
        
        <NCollapseTransition v-if="field.type === 'object'" :show="!collapsed">
            <NCard>
                <div class="grid gap-4" :style="`grid-template-columns: repeat(${field.gridSize ?? '2'},minmax(0,1fr));`">
                    <FormInput 
                        v-for="(childField, childFieldKey) in field.fields.filter((field: any) => field._enable) ?? []"
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

        <NCollapseTransition v-if="field.type === 'array'" :show="!collapsed">
            <NCard>
                <NDynamicInput
                    v-model:value="fieldValue"
                    :on-create="InitArrayFieldItem"
                    #="{ value, index }"
                >
                    <div class="flex flex-col gap-4 w-full">
                        <div class="flex items-center gap-2">
                            <CollapseButton v-model="value.collapsed" v-if="['object', 'array'].includes(field.type)"/>
                            <span v-if="field.headerTemplate" v-html="field.headerTemplate(value, index)" />
                            <span v-else>ITEM {{ index + 1 }}</span>
                        </div>

                        <NCollapseTransition :show="!value.collapsed">
                            <NCard style="width: 100%;">
                                <div class="grid gap-4" :style="`grid-template-columns: repeat(${field.gridSize ?? '2'},minmax(0,1fr));`">
                                    <FormInput 
                                        v-for="(childField, childFieldKey) in field.fields.filter((field: any) => field._enable) ?? []"
                                        :key="childFieldKey"
                                        :gridSize="field.gridSize"
                                        :field="childField"
                                        :validator="validator[childField.key]"
                                        v-model="value[childField.key]"
                                        :indent="indent + 1"            
                                    />
                                </div>
                            </NCard>
                        </NCollapseTransition>
                    </div>
                </NDynamicInput>
            </NCard>
        </NCollapseTransition>
        <NAlert type="error" :show-icon="false" v-if="validator?.$errors?.length" class="w-full">
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
    import { computed, ref, inject } from "vue"
    import { NCard, NCollapseTransition, NInput, NSelect, NInputNumber, NAlert, NDatePicker, NTimePicker, NSlider, NRadioGroup, NRadio, NTooltip, NDynamicInput, useThemeVars } from "naive-ui"
    import DescriptionPopup from "./DescriptionPopup.vue"
    import CollapseButton from "./CollapseButton.vue"
    import { MapFormInitialState, MapFieldProps } from "../utils"
    const props = defineProps({
        gridSize: { 
            type: String, 
            default: 2 
        },
        field: {
            type: Object,
            required: true
        },
        validator: {
            type: Object,
            required: false,
            default: () => ({})
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
    const emit = defineEmits(['update:modelValue'])
    const fieldValue = computed({
        get() { return props.modelValue },
        set(value: any) { emit('update:modelValue', value) }
    })
    const InitArrayFieldItem = () => ({ _id: fieldValue?.value?.length ?? 0, _collapsed: false, ...MapFormInitialState(props.field.fields) })
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