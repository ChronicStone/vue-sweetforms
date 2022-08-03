import { inject } from "vue";
import { FormInjectKey } from "~/constants/injectionKeys";
import { FormApi } from "~/types/instance";

export const useSweetform = () => {
    const formApi = inject<FormApi>(FormInjectKey);
    return formApi;
};
