<template>
    <div class="grid h-5 w-5 place-items-center  bg-opacity-10 rounded-full group-hover:(bg-gray-500 bg-opacity-20)" @click="collapsed = !collapsed">
        <i-mdi-chevron-right class="transition duration-150 ease-in-out transform cursor-pointer" :class="collapsed ? '' : 'rotate-90'"/>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    const emit = defineEmits(['update:modelValue'])
    const props = defineProps({ modelValue: Boolean })
    const collapsed = computed({
        get() { return props.modelValue },
        set(value: any) { emit('update:modelValue', value) }
    })
</script>