<template>
  <input
    class="text-red w-full p-4"
    style="color: red !important"
    type="text"
    v-model="fieldValue"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);
const fieldValue = computed({
  get() {
    return props.modelValue;
  },
  set(value: any) {
    emit("update:modelValue", value);
  },
});

defineExpose({
  fieldValue,
  test: () => console.log("HAHAHAHA"),
});
</script>
