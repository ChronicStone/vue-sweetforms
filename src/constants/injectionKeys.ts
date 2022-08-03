import { InjectionKey } from "vue";
import { FormApi } from "~/types/instance";

export const DescriptionPopupInjectKey: InjectionKey<any> = Symbol("SweetformsDescriptionPopup");
export const FormInjectKey: InjectionKey<FormApi> = Symbol("SweetformsForm");
export const ModalOverlayInjectKey: InjectionKey<any> = Symbol("SweetformsModalOverlay");
export const BreakpointsInjectKey: InjectionKey<any> = Symbol("SweetformsBreakpoints");
