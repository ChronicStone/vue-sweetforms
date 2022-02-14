<template>
    <div class="h-5 w-5 cursor-pointer grid place-items-center" @click="showDescription = true"><i-mdi-information class="h-3.5 w-3.5"/></div>
    <NModal to="#sweetforms__modalContainer" v-model:show="showDescription">
        <NCard closable :on-close="CloseModal" style="width: 600px;z-index: 30000;" title="Modal" :bordered="false" size="huge">
            <template #header>
                <PopupLabel/>
            </template>
            <NScrollbar style="max-height: 80vh;" class="pr-6">
                <PopupContent/>
            </NScrollbar>
        </NCard>
    </NModal>
</template>

<script setup lang="tsx">
import { ref, defineProps, inject, watch, VNodeChild } from 'vue';
import { NModal, NCard , NScrollbar } from "naive-ui"
import { ModalOverlayInjectKey  } from "@/constants/injectionKeys";
import { render } from "../utils"

const props =  defineProps({
    fieldLabel: String,
    description:  [String, Object, Function]
})

const showDescription = ref(false)
const CloseModal = () =>  showDescription.value = false

const PreRenderStringContent = (content: string | VNodeChild) => typeof content === 'string' ? () => (<div v-html={content}></div>) : content

const PopupLabel = () => render(props.description?.title ?? props.fieldLabel)
const PopupContent = () => render(PreRenderStringContent(props.description?.content ?? props.description))

const modalOverlay: { show: () => void, hide: () => void } | undefined = inject(ModalOverlayInjectKey)
watch(() => showDescription.value, (value) => {
    if(value) modalOverlay?.show()
    else modalOverlay?.hide()
})
</script>