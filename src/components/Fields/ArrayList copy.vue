<template>
  <div class="flex flex-col gap-4">
    <NCard v-for="(item, index) in fieldValue" :key="index">
      <template #header>
        <div
          :class="{ 'text-red-500': Object.values(validator.$errors?.find?.((err: any) => err.$validator === '$each')?.$response?.$errors?.[index] ?? {})?.some((item: any[]) => !!(item?.length)) }"
        >
          <span
            v-if="field.headerTemplate"
            v-html="field.headerTemplate(fieldValue[index], index)"
          />
          <span v-else>ITEM {{ index + 1 }}</span>
        </div>
      </template>
      <template #header-extra>
        <i-mdi-arrow-down class="cursor-pointer" />
        <i-mdi-arrow-up class="cursor-pointer" />
        <NTooltip>
          <template #trigger>
            <i-mdi-trash
              class="text-black dark:text-white hover:text-red-400 cursor-pointer"
              @click.prevent="RemoveArrayFieldItem(index)"
            />
          </template>
          Delete item
        </NTooltip>
      </template>

      <div
        class="grid gap-4"
        :style="field.gridSize ?? gridSize"
        v-if="field?.items?.[index]"
      >
        <FormInput
          v-for="(childField, childFieldKey) in MapArrayItems(
            field?.items?.[index] ?? []
          )"
          :key="childFieldKey"
          :gridSize="field?.gridSize ?? gridSize"
          :field="childField"
          :validator="{$errors: validator.$errors?.find?.((err: any) => err.$validator === '$each')?.$response?.$errors[index][childField.key] ?? null }"
          v-model="fieldValue[index][childField.key]"
          :indent="indent + 1"
          :disabled="!field._enable && field?.conditionEffect === 'disable'"
        />
      </div>
      <NEmpty v-else />
    </NCard>

    <NButton @click="InitArrayFieldItem" dashed type="primary" class="w-full">
      <template #icon><i-mdi-plus /></template>
      Create item
    </NButton>
  </div>
</template>

<script setup lang="ts">
import { GenerateUUID, MapFormInitialState } from "@/utils";
import { NCard, NButton, NTooltip, NEmpty, TabsInst, useDialog } from "naive-ui";
import { computed, nextTick, onMounted, PropType, ref, watch } from "vue";
import FormInput from "../FormInput.vue";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: [String, Number, Date, Array, Object, Boolean] as PropType<any>,
    required: false,
  },
  validator: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  field: {
    type: Object,
    required: true,
  },
  indent: {
    type: Number,
    default: 1,
  },
  gridSize: {
    type: String,
  },
});

const dialog = useDialog();
const fieldValue = computed({
  get() {
    return props.modelValue;
  },
  set(value: any) {
    emit("update:modelValue", value);
  },
});

const activeTabIndex = ref(0);
const arrayTabsRef = ref<TabsInst | null>(null);
watch(
  () => activeTabIndex.value,
  () => nextTick(() => arrayTabsRef.value?.syncBarPosition())
);

const InitArrayFieldItem = () => {
  const _uuid = GenerateUUID();
  props.field._setItemRef(fieldValue?.value?.length, _uuid);
  if (!Array.isArray(fieldValue.value))
    fieldValue.value = [{ _uuid, ...MapFormInitialState(props.field.fields) }];
  else fieldValue?.value?.push({ _uuid, ...MapFormInitialState(props.field.fields) });
  nextTick(() => (activeTabIndex.value = fieldValue.value?.length - 1));
};

const RemoveArrayFieldItem = (index: number) => {
  dialog.error({
    title: "Confirm",
    content: "Are you sure you want to delete this answer?",
    positiveText: "Yes",
    negativeText: "No",
    onPositiveClick: () => {
      props.field._removeItemRef(fieldValue.value[index]._uuid);
      fieldValue.value.splice(index, 1);
      nextTick(
        () =>
          (activeTabIndex.value =
            index - 1 <= 0
              ? 0
              : index - 1 > fieldValue.value.length - 1
              ? fieldValue.value.length - 1
              : index - 1)
      );
    },
  });
};

const MapArrayItems = (fields: any[]) =>
  fields.filter(
    (itemField) =>
      (itemField._enable?.value ?? itemField._enable) === true ||
      itemField.conditionEffect === "disable"
  );
</script>
