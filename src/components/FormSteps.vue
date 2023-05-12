<template>
    <!-- <div  class="w-full flex justify-center">
        <div class="relative flex items-center justify-between w-full ">
            <div class="absolute w-full transform top-1/2 -translate-y-1/2 h-1 bg-gray-500 rounded-full" />
            <div class="absolute w-full transform top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-500" :style="`width: ${progressPercent}%`" />
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
            </div>

        </div>
    </div> -->

    <div v-if="layout === 'full'" class="flex justify-center">
        <NSteps :current="currentStepIndex + 1" :status="currentStatus">
            <NStep v-for="({ _status, title }, index) in steps" :key="index" :title="title" />
        </NSteps>
    </div>

    <div v-if="layout === 'compact'" class="flex items-center gap-4 h-auto w-auto">
        <NProgress style="transform: scale(0.8)" :height="4" :color="progressColor" type="circle" :percentage="progressPercent">
            {{ currentStepIndex + 1 }} of {{ steps.length }}
        </NProgress>

        <div class="w-full flex justify-end text-right">
            <h1 class="text-center uppercase text-xl">{{ currentStep.title }}</h1>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue";
    import { useThemeVars, NProgress, NStep, NSteps } from "naive-ui";

    const props = withDefaults(
        defineProps<{
            steps: Array<{ title: string; _status: string; }>;
            currentStepIndex: number;
            layout: string;
        }>(),
        {
            currentStepIndex: 0,
        },
    );

    const themeVars = useThemeVars();
    const progressPercent = computed(() => ((props.currentStepIndex + 1) / props.steps.length) * 100);
    const currentStep = computed(() => props.steps[props.currentStepIndex]);

    const progressColor = computed(() => {
        const currentStep = props.steps[props.currentStepIndex];
        if (currentStep._status === "Pending") return themeVars.value.primaryColor
        if (currentStep._status === "InProgress") return themeVars.value.primaryColor
        if (currentStep._status === "Completed") return themeVars.value.primaryColor
        if (currentStep._status === "Invalid") return themeVars.value.errorColor
    });

    const currentStatus = computed<'process' | 'finish' | 'error' | 'wait'>(() => {
        const currentStep = props.steps[props.currentStepIndex];
        if (currentStep._status === "Pending") return 'wait'
        if (currentStep._status === "InProgress") return 'process'
        if (currentStep._status === "Completed") return 'finish'
        if (currentStep._status === "Invalid") return 'error'
        return 'wait'
    });
</script>

<style scoped>
    .bg-primary {
        background-color: v-bind("themeVars.primaryColor");
    }

    bg-modal {
        background-color: v-bind("themeVars.modalColor");
    }

    .progress__pending {
        border: 3px solid;
        @apply border-gray-500 text-gray-500;
        background-color: v-bind("themeVars.modalColor");
    }
    .progress__inProgress {
        border: 3px solid v-bind("themeVars.primaryColor");
        background-color: v-bind("themeVars.modalColor");
        color: v-bind("themeVars.primaryColor");
    }

    .progress__completed {
        border: 3px solid v-bind("themeVars.primaryColor");
        background-color: v-bind("themeVars.primaryColor");
    }

    .progress__invalid {
        border: 3px solid v-bind("themeVars.errorColor");
        background-color: v-bind("themeVars.errorColor");
    }
</style>
