<template>
    <n-card 
        :style="`${formStyle.maxWidth} width: 100%;`"
        ref="formRef" 
        class="transition-all opacity-100 fixed w-9/10 md:w-3/4 lg:w-1/2 rounded-lg h-auto" 
        id="sweetforms__form"
        :content-style="{ height: 'fit-content', maxHeight: formStyle.maxHeight, width: '100%', padding: '10px' }"
    >
    <!--         content-style="overflow-y: auto;"
 -->
    <!-- FORM TITLE -->
        <template #header>
            <slot name="header" />
        </template>
        <!-- Form body -->
        <form class="h-10/12 max-h-55vh grid gap-4 px-6 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded-full text-left" :style="`height:fit-content !important;${formStyle.gridSize}`">
            <slot name="fields" />
        </form>

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
    },
    formStyle: {
        type: Object,
        default: () => ({})
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