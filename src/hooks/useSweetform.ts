import { inject } from "vue"
import { FormInjectKey } from "@/constants/injectionKeys"
import { FormApi } from "../types/form"

export const useSweetform = (): FormApi => {
    const formApi = inject(FormInjectKey)
    if (!formApi) throw new Error("useSweetform must be used within a Sweetform provider")
    return formApi
}