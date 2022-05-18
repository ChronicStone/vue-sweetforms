<template>
  <div class="flex flex-col gap-2 fieldInput" :style="field.size">
    <div
      class="flex gap-2 items-center justify-left"
      v-if="
        (!field?.label && field.type === 'info') ||
        field.type === 'checkbox' ||
        (field.type === 'object' && field?.fieldParams?.frameless)
          ? false
          : true
      "
    >
      <span
        class="m-0 flex gap-2 justify-start items-center group cursor-pointer"
        style="cursor: pointer !important"
        @click="
          ['object', 'array', 'custom-component'].includes(field.type)
            ? (collapsed = !collapsed)
            : null
        "
      >
        <CollapseButton
          v-model="collapsed"
          v-if="
            ['object', 'array', 'custom-component'].includes(field.type) &&
            (field?.collapsible ?? ['object', 'array'].includes(field.type)
              ? true
              : false)
          "
        />
        <label
          class="flex items-center transition-all ease-in-out duration-150"
          :class="{
            'cursor-pointer': ['object', 'array'].includes(field.type),
            'text-red-500': validator?.$errors?.length,
          }"
          :for="field.key"
        >
          <LabelContent />
          <span class="text-red-500 ml-1.5">{{ field._required ? "*" : "" }}</span>
        </label>
      </span>

      <DescriptionPopup
        v-if="field.description"
        :description="field.description"
        :fieldLabel="field.label"
      />
    </div>

    <NInput
      :class="{ fieldError: validator?.$errors?.length }"
      @blur="validator.$touch"
      v-if="['text', 'textarea', 'password'].includes(field.type)"
      :type="field.type"
      v-model:value="fieldValue"
      v-bind="MapFieldProps(field.type, field.fieldParams)"
      :placeholder="field.placeholder"
      :disabled="disabled"
      :status="validator?.$errors?.length ? 'error' : 'success'"
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
      :disabled="disabled"
      :status="validator?.$errors?.length ? 'error' : 'success'"
    />
    <NInputNumber
      @blur="validator.$touch"
      v-if="field.type === 'number'"
      v-model:value="fieldValue"
      v-bind="MapFieldProps(field.type, field.fieldParams)"
      :placeholder="field.placeholder"
      :disabled="disabled"
      :status="validator?.$errors?.length ? 'error' : 'success'"
    />
    <NDatePicker
      @blur="validator.$touch"
      v-if="
        [
          'date',
          'datetime',
          'daterange',
          'datetimerange',
          'month',
          'year',
          'day',
        ].includes(field.type)
      "
      v-model:value="fieldValue"
      :placeholder="field.placeholder"
      :type="field.type"
      v-bind="MapFieldProps(field.type, field.fieldParams)"
      update-value-on-close
      :disabled="disabled"
      :status="validator?.$errors?.length ? 'error' : 'success'"
    />
    <NTimePicker
      @blur="validator.$touch"
      v-if="field.type === 'time'"
      v-model:value="fieldValue"
      :placeholder="field.placeholder"
      v-bind="MapFieldProps(field.type, field.fieldParams)"
      :disabled="disabled"
      :status="validator?.$errors?.length ? 'error' : 'success'"
    />
    <div
      class="flex flex-col gap-1 justify-center items-center h-full"
      v-if="['slider'].includes(field.type)"
    >
      <NSlider
        @blur="validator.$touch"
        v-model:value="fieldValue"
        v-bind="MapFieldProps(field.type, field.fieldParams)"
        :disabled="disabled"
      />
    </div>

    <div class="flex items-center gap-2" v-if="field.type === 'checkbox'">
      <NCheckbox
        v-model:checked="fieldValue"
        @blur="validator.$touch"
        v-bind="MapFieldProps(field.type, field.fieldParams)"
        :disabled="disabled"
      >
        <div class="flex items-center gap-2">
          <LabelContent />
          <span class="text-red-500 ml-1.5">{{ field.required ? "*" : "" }}</span>
        </div>
      </NCheckbox>
      <DescriptionPopup
        v-if="field.description"
        :description="field.description"
        :fieldLabel="field.label"
      />
    </div>

    <NCheckboxGroup
      v-if="field.type === 'checkbox-group'"
      v-model:value="fieldValue"
      v-bind="MapFieldProps(field.type, field.fieldParams)"
      :disabled="disabled"
    >
      <div class="grid gap-4" :style="field.gridSize ?? gridSize">
        <NCheckbox
          class="col-span-1"
          v-for="(option, index) in field._options ?? field.options"
          :key="index"
          :value="option?.value ?? option"
          :label="option?.label ?? option"
          @blur="validator.$touch"
          :disabled="disabled"
        />
      </div>
    </NCheckboxGroup>

    <NRadioGroup
      @blur="validator.$touch"
      v-if="field.type === 'radio'"
      v-model:value="fieldValue"
      :name="field.key"
      :disabled="disabled"
    >
      <div class="gap-4 flex flex-wrap justify-start">
        <NRadio
          @blur="validator.$touch"
          v-for="({ label, value }, optionId) in field._options ?? field.options"
          :style="
            optionId === (field?._options?.length ?? field?.options?.length) - 1
              ? 'margin-right: auto;'
              : ''
          "
          :key="optionId"
          :value="value"
          v-bind="MapFieldProps(field.type, field.fieldParams)"
        >
          {{ label }}
        </NRadio>
      </div>
    </NRadioGroup>

    <!-- <Editor
            v-if="field.type === 'editor'"
            v-model="fieldValue"
        /> -->

    <NCollapseTransition v-if="field.type === 'object'" :show="!collapsed">
      <component :is="field?.fieldParams?.frameless ? 'div' : NCard">
        <div class="grid gap-4" :style="field.gridSize ?? gridSize">
          <FormInput
            v-for="(childField, childFieldKey) in field.fields.filter((field: any) => (field._enable || field.conditionEffect === 'disable')) ?? []"
            :key="childFieldKey"
            :gridSize="field?.gridSize ?? gridSize"
            :field="childField"
            :validator="validator[childField.key]"
            v-model="fieldValue[childField.key]"
            :indent="indent + 1"
            :disabled="!field._enable && field.conditionEffect === 'disable'"
          />
        </div>
      </component>
    </NCollapseTransition>

    <NCollapseTransition v-if="field.type === 'array'" :show="!collapsed">
      <component
        :is="
          (field?.format ?? 'tabs') === 'tabs'
            ? ArrayTabs
            : field?.format === 'table'
            ? ArrayTable
            : ArrayList
        "
        v-model="fieldValue"
        :field="field"
        :validator="validator"
        :indent="indent"
        :gridSize="gridSize"
      />
    </NCollapseTransition>

    <NCollapseTransition v-if="field.type === 'custom-component'" :show="!collapsed">
      <component
        ref="inputRef"
        :is="componentStore[field.component]"
        v-model="fieldValue"
        v-bind="{
          ...field.fieldParams,
          dependencies: field._dependencies,
          options: field._options,
          field: Omit(field, [
            '_dependencies',
            '_enable',
            '_options',
            '_options_map',
            '_fieldRef',
          ]),
        }"
      />
    </NCollapseTransition>

    <div v-if="field.type === 'info'">
      <InfoContent />
    </div>

    <div
      v-if="
        validator?.$errors?.length &&
        (!['array', 'object'].includes(field.type) || collapsed)
      "
      class="flex items-center gap-2 transition-all ease-in-out duration-300 transform"
      :class="
        validator?.$errors?.length &&
        (!['array', 'object'].includes(field.type) || collapsed)
          ? 'scale-y-100'
          : 'scale-y-0'
      "
    >
      <!-- <i-mdi-information class="text-red-500"/> -->
      <span class="text-red-500">{{ ParseErrMsg(validator, field) }}</span>
    </div>
  </div>
</template>

<script lang="tsx">
export default {
  name: "FormInput",
};
</script>

<script setup lang="tsx">
import { computed, ref, inject, toRaw, onMounted, nextTick, watch } from "vue";
import {
  NCard,
  NCollapseTransition,
  NInput,
  NSelect,
  NInputNumber,
  NDatePicker,
  NTimePicker,
  NSlider,
  NRadioGroup,
  NRadio,
  NCheckbox,
  NCheckboxGroup,
  useDialog,
} from "naive-ui";
import DescriptionPopup from "./DescriptionPopup.vue";
import CollapseButton from "./CollapseButton.vue";
import {
  MapFormInitialState,
  MapFieldProps,
  ParseErrMsg,
  GenerateUUID,
  render,
  Omit,
} from "@/utils";

import ArrayTable from "./Fields/ArrayTable.vue";
import ArrayList from "./Fields/ArrayList.vue";
import ArrayTabs from "./Fields/ArrayTabs.vue";
import { capitalize } from "@/utils/format";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  gridSize: {
    type: String,
  },
  field: {
    type: Object,
    required: true,
  },
  validator: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  modelValue: {
    type: [String, Number, Date, Array, Object, Boolean],
    required: false,
  },
  indent: {
    type: Number,
    default: 1,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const dialog = useDialog();
const componentStore: any = toRaw(inject("componentStore", {}));

const collapsed = ref(props.field.collapsed ?? false);
const fieldValue = computed({
  get() {
    return props.modelValue;
  },
  set(value: any) {
    emit("update:modelValue", value);
  },
});

if (props.field.type === "custom-component") {
  const inputRef = ref(null);
  onMounted(() => console.log({ value: inputRef.value }));
  // watch(
  //   () => inputRef.value,
  //   (value) => console.log({ value }),
  //   { immediate: true, deep: true }
  // );
}

const InfoContent = () => render(props.field.content ?? "", props.field._dependencies);
const LabelContent = () =>
  render(
    typeof props?.field?.label === "string"
      ? capitalize(props?.field?.label)
      : props.field.label,
    props.field._dependencies
  );
</script>

<style lang="scss">
:is(.n-input__textarea-el, .n-tooltip) {
  overscroll-behavior-y: contain;
}

:is(.n-input__textarea-el, .n-tooltip, .editor__content)::-webkit-scrollbar {
  width: 5px;
  cursor: pointer !important;
}

:is(.n-input__textarea-el, .n-tooltip, .editor__content)::-webkit-scrollbar-thumb {
  @apply bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer hover:bg-gray-300;
  cursor: pointer !important;
}

:is(.n-input__textarea-el, .n-tooltip, .editor__content)::-webkit-scrollbar-track {
  background: transparent;
  padding: 5px;
}
</style>
