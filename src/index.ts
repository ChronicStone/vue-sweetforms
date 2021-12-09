import { createPinia } from "pinia"
import { App } from "vue"

import FormProvider from "./FormProvider.vue"
import 'virtual:windi.css'
import { FormInstance } from "./types/form.types"


// export default {
//     install: (app: App) => {
//         const piniaInstance = createPinia()
//         app.use(piniaInstance)
//     }
// }

export { FormProvider, useSweetform } from "./components/form/"

export * as SweetformTypes from "./types/form.types"

