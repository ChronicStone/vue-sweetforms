<template>
    <div>
        <div 
            v-for="(step, index) in steps" :key="step.id"
            class=" h-16 w-16 rounded-full bg-primary grid place-items-center"
        >
    
        </div>
    </div>
</template>

<script setup lang="ts">
interface FormStep {
    id: number,
    title: string
    status: 'Pending' | 'InProgress' | 'Error' | 'Completed'
}
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
</script>

<style>

</style>