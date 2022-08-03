<template>
    <div class="top-0 left-0 w-screen h-screen p-8" :style="modalStyles">
        <div class="h-1/12">
            <slot name="header" />
        </div>

        <form
            class="max-h-10/12 h-full grid gap-4 px-6 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded-full text-left"
            :style="`${formStyle.gridSize}`"
        >
            <slot name="fields" />
        </form>

        <div class="h-1/12 flex w-full justify-center items-center gap-4 pt-6">
            <slot name="actions" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted, onUnmounted } from "vue";
    import { useThemeVars } from "naive-ui";
    // eslint-disable-next-line no-undef
    const props = defineProps({
        formStyle: {
            type: Object,
            default: () => ({}),
        },
    });

    const themeVars = useThemeVars();

    const modalStyles = computed(() => ({
        backgroundColor: themeVars.value.modalColor,
        color: themeVars.value.textColorBase,
    }));

    const outerStyles = computed(() => ({
        backgroundColor: themeVars.value.bodyColor,
    }));

    onMounted(() => document?.querySelector("body")?.classList.add("overflow-y-hidden"));
    onUnmounted(() => document?.querySelector("body")?.classList.remove("overflow-y-hidden"));
</script>

<style scoped>
    ::-webkit-scrollbar {
        width: 9px;
    }

    ::-webkit-scrollbar-thumb {
        @apply bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer hover:bg-gray-300;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
        padding: 5px;
    }
</style>
