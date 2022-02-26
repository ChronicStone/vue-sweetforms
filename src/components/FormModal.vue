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
        <NScrollbar style="max-height: 55vh;width: 100%;" class="h-10/12 max-h-55vh px-6 text-left">
            <div class="w-full h-full pb-4 grid gap-4" :style="`height:fit-content !important;${formStyle.gridSize}`">
                <slot name="fields" />
            </div>
        </NScrollbar>

        <!-- Form buttons -->
        <template #footer>
            <div class="h-1/12 flex w-full justify-center items-center gap-4 pt-6">
                <slot name="actions" />
            </div>
        </template>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NScrollbar } from "naive-ui"
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


onClickOutside(formRef, (event: any) => {
    if(event?.target?.id === 'sweetforms__overlay' && props.allowClickOutside) emit('closeForm')
})
</script>
