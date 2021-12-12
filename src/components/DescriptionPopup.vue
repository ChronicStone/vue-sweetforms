<template>
    <div class="h-5 w-5 cursor-pointer grid place-items-center" @click="showDescription = true"><i-mdi-information class="h-3.5 w-3.5"/></div>
    <NModal to="#sweetforms__modalContainer" v-model:show="showDescription">
        <NCard closable :on-close="CloseModal" style="width: 600px;z-index: 30000;" title="Modal" :bordered="false" size="huge">
            <template #header>
                {{description?.title ?? fieldLabel}}
            </template>
            <NScrollbar style="max-height: 80vh;" class="pr-6">
                <div v-html="description?.content ?? description" />
            </NScrollbar>
        </NCard>
    </NModal>
</template>

<script setup lang="ts">
import { ref, defineProps, inject, watch } from 'vue';
import { NModal, NCard , NScrollbar } from "naive-ui"
import { ModalOverlayInjectKey  } from "@/constants/injectionKeys";

const showDescription = ref(false)
const props =  defineProps({
    fieldLabel: String,
    description:  [String, Object]
})

const CloseModal = () =>  showDescription.value = false

const modalOverlay: { show: () => void, hide: () => void } | undefined = inject(ModalOverlayInjectKey)
watch(() => showDescription.value, (value) => {
    if(value) modalOverlay?.show()
    else modalOverlay?.hide()
})
</script>