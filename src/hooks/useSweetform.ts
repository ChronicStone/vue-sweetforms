import { inject } from "vue"
import { FormInjectKey } from "@/constants/injectionKeys"
import { FormApi } from "../types/form"

export const useSweetform = (): FormApi => {
    const formApi = inject(FormInjectKey)
    return formApi as FormApi
}