<template>
    <div class="top-0 left-0 w-screen h-screen p-8">
        <div class="h-1/12">
            <slot name="header"/>
        </div>

        <div class="h-10/12 overflox-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded-full">
            <slot />
        </div>


        <div>
            <slot name="footer" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useThemeVars } from "naive-ui"
    const props = defineProps({ formStyle: [Object] })

    const themeVars = useThemeVars()
</script>