<template>
    <n-card 
        ref="formRef" 
        class="transition-all opacity-100 fixed w-9/10 md:w-3/4 lg:w-1/2 h-max-[85vh] rounded-lg h-auto z-max" 
        style="height: fit-content;max-height:85vh;"
        id="sweetforms__form"
        content-style="height:fit-content;padding: 10px;"
    >
    <!--         content-style="overflow-y: auto;"
 -->
    <!-- FORM TITLE -->
        <template #header>
            <slot name="title" />
            <slot name="steps" v-if="$slots.steps"/>
        </template>
        <!-- Form body -->
        <div class="h-10/12 max-h-55vh grid gap-4 px-6 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded-full" :style="`height:fit-content !important;grid-template-columns: repeat(${formOptions.gridSize ?? '2'},minmax(0,1fr));`">
            <slot name="fields" />
        </div>

        <!-- Form buttons -->
        <template #footer>
            <div class="h-1/12 flex w-full justify-center items-center gap-4 pt-6">
                <slot name="actions" />
            </div>
        </template>
  </n-card>
</template>

<script setup lang="ts">
import { NCard} from "naive-ui"
import { ref } from "vue"
import { onClickOutside } from "@vueuse/core"
const emit = defineEmits(['closeForm'])
const props = defineProps({
    allowClickOutside: {
        type: Boolean,
        default: true
    }
})

const formRef = ref(null)


onClickOutside(formRef, (event: PointerEvent) => {
    if(event?.target?.id === 'sweetforms__overlay' && props.allowClickOutside) emit('closeForm')
})
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