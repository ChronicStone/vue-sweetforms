import { inject } from "vue"
import { FormInjectKey } from "@/constants/injectionKeys"

export const useSweetform = () => {
    const formApi = inject(FormInjectKey, {})
    return formApi
}