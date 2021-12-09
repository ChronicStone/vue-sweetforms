import { inject } from "vue"
import { ref, reactive, computed } from "vue"
import { asyncComputed } from "@vueuse/core"
import useVuelidate from '@vuelidate/core'
import { MapArrayToObject, MapFormInitialState, MapFormRules } from "@/utils"

export function useSweetform() {
    const formApi = inject('sweetform', null)
    return formApi
}

export const useSimpleForm = (formOptions) => {

}

export const useSteppedForm = (formOptions) => {

}