<template>
    <div class="flex flex-col gap-4">
        <slot name="header" />
        <form class="max-h-10/12 h-full grid gap-4 px-6 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded-full text-left" :style="`${formStyle.gridSize}`">
            <slot name="fields" />
        </form>


        <div class="h-1/12 flex w-full justify-center items-center gap-4 pt-6">
            <slot name="actions" />
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        formStyle: {
            type: Object,
            default: () => ({})
        }
    });
</script>