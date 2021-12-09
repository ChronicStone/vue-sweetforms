<template>
    <div class="flex flex-col gap-2" :style="`grid-column: span ${field.size ?? '1'} / span ${ gridSize ?? '12'};`">
        <span class="m-0 capitalize">{{field.label}}</span>

        <NInput 
            @on-update:value="validator.$touch" 
            v-if="['text', 'textarea', 'password'].includes(field.type)" 
            :type="field.type" 
            v-model:value="fieldValue"
            v-bind="field.fieldParams"
        />
        <NSelect 
            v-if="field.type === 'select'" 
            v-model:value="fieldValue" 
            :placeholder="field.placeholder"
            :options="field._options ?? field.options"
            v-bind="field.fieldParams" 
            :loading="field._evalOptions"
            filterable
        />
        <NInputNumber 
            v-if="field.type === 'number'" 
            v-model:value="fieldValue" 
            v-bind="field.fieldParams"
            :placeholder="field.placeholder"
        />
        <NDatePicker
            v-if="['date', 'datetime', 'daterange', 'datetimerange', 'month', 'year', 'day'].includes(field.type)"
            v-model:value="fieldValue" 
            :placeholder="field.placeholder"
            :type="field.type"
            v-bind="field.fieldParams"
            update-value-on-close
        />
        <NTimePicker
            v-if="field.type === 'time'"
            v-model:value="fieldValue" 
            :placeholder="field.placeholder"
            v-bind="field.fieldParams"

        />
        <NSlider 
            v-if="['slider'].includes(field.type)"
            v-model:value="fieldValue"
            v-bind="field.fieldParams"
        />
        <NRadioGroup
            v-if="field.type === 'radio'" 
            v-model:value="fieldValue"
            :name="field.key"
        >
            <div class="gap-4 flex flex-wrap justify-between">
                <NRadio 
                    v-for="({ label, value}, optionId) in field._options ?? field.options" 
                    :style="`grid-column: span 1 / span ${ field?.fieldParams?.gridSize ?? '2'};`"
                    :key="optionId"
                    :value="value"
                >
                    {{ label }}
                </NRadio>
            </div>
        </NRadioGroup>
        <NAlert v-if="validator.$errors.length" type="error"> {{ validator.$errors[0].$message }}</NAlert>
    </div>
</template>

<script setup lang="ts">
    import { defineEmits } from "vue"
    import { useVModel } from "@vueuse/core"
    import { NInput, NSelect, NInputNumber, NAlert, NDatePicker, NTimePicker, NSlider, NRadioGroup, NRadio } from "naive-ui"

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
    })

    const emit = defineEmits(['update:value'])
    const fieldValue = useVModel(props, 'value', emit)
</script>

<style>
.n-input__textarea-el::-webkit-scrollbar {
  width: 5px;
  cursor:pointer !important;
}

.n-input__textarea-el::-webkit-scrollbar-thumb {
  @apply bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer hover:bg-gray-300;
    cursor: pointer !important;
}

.n-input__textarea-el::-webkit-scrollbar-track {
  background: transparent;
  padding: 5px;
}
</style>