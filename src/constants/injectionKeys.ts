import { InjectionKey } from 'vue';

const testFunction = async (test: string, other: number): Promise<[string, number]> => [test, other];

export const DescriptionPopupInjectKey: InjectionKey<any> = Symbol('SweetformsDescriptionPopup');
export const FormInjectKey: InjectionKey<{
    createForm: (formName: string) => void;
    other: typeof testFunction;
}> = Symbol('SweetformsForm');
export const ModalOverlayInjectKey: InjectionKey<any> = Symbol('SweetformsModalOverlay');
export const BreakpointsInjectKey: InjectionKey<any> = Symbol('SweetformsBreakpoints')