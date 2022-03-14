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
          :validator="validator[index]?.[childField.key] ?? {}"
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
import { ArrayFieldEmits, ArrayFieldProps, useArrayField } from "@/hooks/useArrayField";
import { GenerateUUID, MapFormInitialState } from "@/utils";
import { NCard, NButton, NTooltip, NEmpty, TabsInst, useDialog } from "naive-ui";
import { computed, nextTick, onMounted, PropType, ref, watch } from "vue";
import FormInput from "../FormInput.vue";

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
</script>
