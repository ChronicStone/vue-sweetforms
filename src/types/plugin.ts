export type SweetformPluginConfig = {
    textOverrides: {
        requiredMessage?: string | ((label: string) => string)
        nextBtnMessage?: string
        prevBtnMessage?: string
        submitBtnMessage?: string
        cancelBtnMessage?: string
    },
    uiConfig: {
        showStepper?: boolean
        showCloseButton?: boolean
        showCancelButton?: boolean
        showPrevButton?: boolean
        allowOutsideClick?: boolean
    }
}