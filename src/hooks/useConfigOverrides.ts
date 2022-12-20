import { FormSchema } from '../types/form';
import { PluginConfigInjectionKey } from "@/constants/injectionKeys";
import { NestedPaths, TypeFromPath } from "@/types/utils";
import { GetPropertyFromPath } from "@/utils";
import { ComputedRef, inject, computed } from "vue";
import { SweetformPluginConfig } from "@/types/plugin";


const defaultConfig = {
    textOverrides: {
        requiredMessage: (label: string) => `The field ${label} can't be empty`,
        nextBtnMessage: 'NEXT',
        prevBtnMessage: 'PREVIOUS',
        submitBtnMessage: 'SUBMIT',
        cancelBtnMessage: 'CANCEL'
    },
    uiConfig: {
        showStepper: true,
        showCloseButton: true,
        showCancelButton: true,
        showPrevButton: true,
        allowOutsideClick: true
    }
}

export function useConfigOverrides(formSchema: FormSchema): { config: ComputedRef<SweetformPluginConfig>, getProp: <T extends NestedPaths<SweetformPluginConfig> & string>(key: T) => TypeFromPath<SweetformPluginConfig, T> } {
    const injectedConfig = inject(PluginConfigInjectionKey, defaultConfig)

    const config = computed(() => ({
        textOverrides: {
            requiredMessage: formSchema?.requiredMessage ?? injectedConfig?.textOverrides?.requiredMessage ?? defaultConfig.textOverrides.requiredMessage,
            nextBtnMessage: formSchema?.nextButtonText ?? injectedConfig?.textOverrides?.nextBtnMessage ?? defaultConfig.textOverrides.nextBtnMessage,
            prevBtnMessage: formSchema?.prevButtonText ?? injectedConfig?.textOverrides?.prevBtnMessage ?? defaultConfig.textOverrides.prevBtnMessage,
            submitBtnMessage: formSchema?.submitButtonText ?? injectedConfig?.textOverrides?.submitBtnMessage ?? defaultConfig.textOverrides.submitBtnMessage,
            cancelBtnMessage: formSchema?.cancelButtonText ??  injectedConfig?.textOverrides?.cancelBtnMessage ?? defaultConfig.textOverrides.cancelBtnMessage
        },
        uiConfig: {
            showStepper: formSchema?.showStepper ?? injectedConfig?.uiConfig?.showStepper ?? defaultConfig.uiConfig.showStepper,
            showCloseButton: formSchema?.showCloseButton ?? injectedConfig?.uiConfig?.showCloseButton ?? defaultConfig.uiConfig.showCloseButton,
            showCancelButton: formSchema?.showCancelButton ?? injectedConfig?.uiConfig?.showCancelButton ?? defaultConfig.uiConfig.showCancelButton,
            showPrevButton: formSchema?.showPrevButton ?? injectedConfig?.uiConfig?.showPrevButton ?? defaultConfig.uiConfig.showPrevButton,
            allowOutsideClick: formSchema?.allowOutsideClick ?? injectedConfig?.uiConfig?.allowOutsideClick ?? defaultConfig.uiConfig.allowOutsideClick,
        }
    }));

    function getProp<T extends NestedPaths<SweetformPluginConfig> & string>(key: T): TypeFromPath<SweetformPluginConfig, T> {
        return GetPropertyFromPath(key as string, config.value)
    }

    return {
        config: config as ComputedRef<SweetformPluginConfig>,
        getProp
    }
}

