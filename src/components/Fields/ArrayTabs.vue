<template>
  <NCard content-style="padding: 0;">
    <div class="w-full p-4" v-if="!fieldValue?.length">
      <NButton @click="InitArrayFieldItem" dashed type="primary" class="w-full">
        <template #icon><i-mdi-plus /></template>
        Create item
      </NButton>
    </div>
    <NTabs
      ref="arrayTabsRef"
      type="line"
      size="large"
      :tabs-padding="20"
      v-if="fieldValue?.length"
      display-directive="show"
      closable
      addable
      :value="activeTabIndex"
      :on-add="InitArrayFieldItem"
      :on-close="RemoveArrayFieldItem"
      :on-update:value="(index: number) => (activeTabIndex = index)"
    >
      <template #suffix>
        <NButton @click="InitArrayFieldItem" secondary type="primary" class="mr-2">
          <template #icon><i-mdi-plus></i-mdi-plus></template>
        </NButton>
      </template>
      <NTabPane :name="index" v-for="(item, index) in fieldValue">
        <template #tab>
          <div class="flex gap-4 justify-between items-center">
            <div :class="{ 'text-red-500': validator?.[index]?.$errors?.length }">
              <span
                v-if="field.headerTemplate"
                v-html="field.headerTemplate(fieldValue[index], index)"
              />
              <span v-else>ITEM {{ index + 1 }}</span>
            </div>
            <div class="flex items-center gap-0 text-xs text-black dark:text-white">
              <n-dropdown
                trigger="hover"
                :options="dropdownOptions(index, fieldValue?.length)"
                @select="HandleAction(index, $event)"
              >
                <n-button quaternary size="small" circle>
                  <template #icon>
                    <i-mdi-chevron-down />
                  </template>
                </n-button>
              </n-dropdown>
            </div>
          </div>
        </template>
      </NTabPane>
    </NTabs>

    <div class="overflow-x-hidden pb-5 px-5" v-if="fieldValue?.length">
      <transition name="slide-fade" mode="out-in">
        <component
          :is="'div'"
          class="grid gap-4"
          :style="field.gridSize ?? gridSize"
          :key="activeTabIndex"
          v-if="field?.items?.[activeTabIndex]?.length"
        >
          <FormInput
            v-for="(childField, childFieldKey) in MapArrayItems(
              field.items[activeTabIndex] ?? []
            )"
            :key="childFieldKey"
            :gridSize="field?.gridSize ?? gridSize"
            :field="childField"
            :validator="validator[activeTabIndex]?.[childField.key] ?? {}"
            v-model="fieldValue[activeTabIndex][childField.key]"
            :indent="indent + 1"
            :disabled="!field._enable && field?.conditionEffect === 'disable'"
          />
        </component>
        <NEmpty v-else />
      </transition>
    </div>
  </NCard>
</template>

<script setup lang="tsx">
import FormInput from "@/components/FormInput.vue";
import { ArrayFieldEmits, ArrayFieldProps, useArrayField } from "@/hooks/useArrayField";
import { NCard, NTabs, NTabPane, NButton, NEmpty, NIcon, NDropdown, DropdownOption } from "naive-ui";
import { h, reactive, nextTick } from "vue";
import TrashIcon from "~icons/mdi/trash";
import ArrowRight from "~icons/mdi/arrow-right";
import ArrowLeft from "~icons/mdi/arrow-left";
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

const renderIcon = (icon: any) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
};

function buildControls(index: number, itemsLength: number): DropdownOption[] {
  return []
}

const dropdownOptions = (index: number, itemsLength: number) => [
  {
    key: "delete",
    label: "Delete item",
    icon: renderIcon(TrashIcon),
    onClick
  },
  {
    key: "moveLeft",
    label: "Move item left",
    icon: renderIcon(ArrowLeft),
    disabled: index - 1 < 0,
  },
  {
    key: "moveRight",
    label: "Move item right",
    icon: renderIcon(ArrowRight),
    disabled: index + 1 >= itemsLength,
  },
];

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
};
</script>

<style>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.35s, transform 0.4s;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-30%);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(30%);
}
</style>
