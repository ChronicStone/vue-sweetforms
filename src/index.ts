import 'virtual:windi.css'
import { App } from "vue"
import { PluginConfigInjectionKey } from './constants/injectionKeys'
import { FormProvider, Form } from "./components"
import { SweetformPluginConfig } from "./types/plugin"


export { FormProvider, Form }
export * as SweetformTypes from "./types/form.types"
export { useSweetform } from "./hooks"
export type { FormSchema } from "./types/form"
export type { FormField } from "./types/fields"

export const SweetformPlugin = {
    install: (app: App, config: SweetformPluginConfig) => {
        app.provide(PluginConfigInjectionKey, config)
        app.component('SForm', Form)
        app.component('SFormProvider', FormProvider)
    }
}

export default SweetformPlugin