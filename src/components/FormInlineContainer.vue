<template>
    <div class="flex flex-col gap-4">
        <slot name="header" />
        <form 
            class="h-full grid gap-4 overflow-y-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded-full text-left" 
            :style="`${formStyle.gridSize}`"
            :class="{ 
                'max-h-10/12': $slots.header && $slots.footer,
                'max-h-11/12': ($slots.header && !$slots.footer) || ($slots.footer && !$slots.header),
                'max-h-full': $slots.header && $slots.footer
            }"
        >
            <slot name="fields" />
        </form>


        <div 
        class="h-1/12 flex w-full justify-center items-center gap-4 pt-6" v-if="$slots.actions">
            <slot name="actions" />
        </div>

        <div v-if="$slots.customActions">
            <slot name="customActions" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    formStyle: {
        type: Object,
        default: () => ({})
    }
});

</script>