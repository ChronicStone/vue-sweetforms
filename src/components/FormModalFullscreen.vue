<template>
    <div class="top-0 left-0 w-screen h-screen p-8" :style="modalStyles">
        <div class="h-1/12">
            <slot name="header"/>
        </div>

        <!-- <NScrollbar style="max-height: 55vh;width: 100%;" class="h-10/12 max-h-55vh px-6 text-left">
            <div class="w-full h-full pb-4 grid gap-4" :style="`height:fit-content !important;${formStyle.gridSize}`">
                <slot name="fields" />
            </div>
        </NScrollbar> -->

        <NScrollbar style="max-height: 77.5vh;"  class=" h-full px-6 ">
            <div class="w-full !h-full pb-4 grid gap-4" :style="`${formStyle.gridSize}`">
                <slot name="fields" />
            </div>

        </NScrollbar>


        <div class="h-1/12 flex w-full justify-center items-center gap-4 pt-6">
            <slot name="actions" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted, onUnmounted } from "vue"
    import { useThemeVars, NScrollbar, NSkeleton } from "naive-ui"
    const props = defineProps({
        formStyle: {
            type: Object,
            default: () => ({})
        }
    })

    const themeVars = useThemeVars()

    const modalStyles = computed(() => ({
        backgroundColor: themeVars.value.modalColor,
        color: themeVars.value.textColorBase
    }))

    const outerStyles = computed(() => ({ 
        backgroundColor: themeVars.value.bodyColor,
    }))

    onMounted(() => document.querySelector('body')?.classList.add('overflow-y-hidden'))
    onUnmounted(() => document.querySelector('body')?.classList.remove('overflow-y-hidden'))
</script>