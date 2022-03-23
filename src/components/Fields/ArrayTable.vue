<template>
  <div class="flex flex-col gap-4">
    <n-data-table :columns="tableColumns" :data="fieldValue" />
    <NButton @click="InitArrayFieldItem" dashed type="primary" class="w-full">
      <template #icon><i-mdi-plus /></template>
      Create item
    </NButton>
  </div>
</template>

<script setup lang="tsx">
import { ArrayFieldEmits, ArrayFieldProps, useArrayField } from "@/hooks/useArrayField";
import { NCard, NButton, NDataTable, NEmpty, TabsInst, useDialog } from "naive-ui";
import { nextTick, ref } from "vue";
import FormInput from "../FormInput.vue";
import Trash from "~icons/mdi/trash";
import ArrowUp from "~icons/mdi/arrow-up";
import ArrowDown from "~icons/mdi/arrow-down"

const emit = defineEmits(ArrayFieldEmits);
const props = defineProps(ArrayFieldProps);

const {
  fieldValue,
  activeTabIndex,
  arrayTabsRef,
  InitArrayFieldItem,
  RemoveArrayFieldItem,
  MapArrayItems,
} = useArrayField(props, emit);

const tableColumns = ref([
  ...props.field?.fields.map((item) => ({
    title: item.label,
    key: item.key,
    render: (row, index) => {
      const rowItems = props.field?.items?.[index] ?? [];
      const currentField = rowItems.find((rowItem) => rowItem.key === item.key);
      if (!currentField) return <span></span>;
      else
        return (
          <FormInput
            gridSize={props.field?.gridSize ?? props.gridSize}
            field={currentField}
            validator={props.validator[index]?.[currentField.key] ?? {}}
            v-model={row[item.key]}
            modelValue={row[item.key]}
            onUpdate:modelValue={(value) => fieldValue.value[index][item.key] = value}
            indent={props.indent + 1}
            disabled={!props.field?._enable && props.field?.conditionEffect === "disable"}
          />
        );
    },
  })),
  {
    title: "Actions",
    key: "actions",
    colSpan: () => 100,
    fixed: 'right',
    render: (row, index) => <div class="flex items-center gap-1">
      <NButton onClick={() => HandleAction(index, 'moveRight')} disabled={ index + 1 >= fieldValue.value?.length } secondary circle size="small">{{ icon: () => <ArrowDown class="cursor-pointer hover:gray-500" />}}</NButton>
      <NButton onClick={() => HandleAction(index, 'moveLeft')} disabled={index - 1 < 0 } secondary circle size="small">{{ icon: () => <ArrowUp class="cursor-pointer hover:gray-500" />}}</NButton>
      <NButton onClick={() => HandleAction(index, 'delete')} secondary circle type="error" size="small">{{ icon: () => <Trash class="cursor-pointer hover:gray-500" />}}</NButton>
    </div>
  },
]);

const HandleAction = (index: number, action: "delete" | "moveLeft" | "moveRight") => {
  switch (action) {
    case "delete":
      RemoveArrayFieldItem(index);
      break;
    case "moveLeft":
      [fieldValue.value[index], fieldValue.value[index - 1]] = [
        fieldValue.value?.[index - 1],
        fieldValue.value?.[index],
      ];
      nextTick(() => {
        activeTabIndex.value = index - 1;
      });
      break;
    case "moveRight":
      [fieldValue.value[index], fieldValue.value[index + 1]] = [
        fieldValue.value?.[index + 1],
        fieldValue.value?.[index],
      ];
      nextTick(() => {
        activeTabIndex.value = index + 1;
      });
      break;
  }
}
</script>
