import { inject } from "vue"

export const useSweetform = () => {
    const formApi = inject('sweetform', null)
    return formApi
}