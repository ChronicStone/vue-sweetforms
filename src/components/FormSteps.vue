<template>
    <div class="w-full flex justify-center">
        <div class="relative flex items-center justify-between w-full ">
            <div class="absolute w-full transform top-1/2 -translate-y-1/2 h-1 bg-gray-500 rounded-full" />
            <div class="absolute w-full transform top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-500" :style="`width: ${progressWidth}%`" />
            <div 
                v-for="({ _status }, index) in steps" :key="index"
                class="h-8 w-8 rounded-full grid place-items-center  z-60 transition-all duration-500 relative"
                :class="{
                    'progress__pending': _status === 'Pending',
                    'progress__inProgress': _status === 'InProgress',
                    'progress__completed': _status === 'Completed',
                    'progress__invalid': _status === 'Invalid',
                }"
            >
                <span class="-mt-[2px]" v-if="['Pending', 'InProgress'].includes(_status)">{{index + 1}}</span>
                <i-mdi-check v-if="_status === 'Completed'"/>
                <i-mdi-close v-if="_status === 'Invalid'"/>
                <!-- <div class="absolute bg-modal left-full top-1/2 transform -translate-x-1/2">
                    dqzdzqzqd
                </div>   -->
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { useThemeVars } from "naive-ui"
import { computed } from "vue"
const props = defineProps({
    steps: {
        type: Array,
        required: true,
    },
    currentStep: {
        type: Number,
        default: 0
    }
})

const { errorColor, primaryColor, modalColor } = useThemeVars().value
const progressWidth = computed(() => ((props.currentStep) / (props.steps.length - 1)) * 100 )
</script>

<style scoped>
.bg-primary {
    background-color: v-bind(primaryColor);
}

bg-modal {
    background-color: v-bind(modalColor);
}


.progress__pending {
    border: 3px solid;
    @apply border-gray-500 text-gray-500;
    background-color: v-bind(modalColor);
}
.progress__inProgress {
    border: 3px solid v-bind(primaryColor);
    background-color: v-bind(modalColor);
    color: v-bind(primaryColor);
}

.progress__completed {
    border: 3px solid v-bind(primaryColor);
    background-color: v-bind(primaryColor);
}

.progress__invalid {
    border: 3px solid v-bind(errorColor);
    background-color: v-bind(errorColor);
}
</style>