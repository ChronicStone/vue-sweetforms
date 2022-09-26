import { ExpandRecursively, ExtractFieldsFromSteps, FormApi, FormInfoReturnType, FormSchema, Narrowable, SimpleFormSchema, SteppedFormSchema } from '../types/form';
import { InjectionKey } from 'vue';

const testFunction = async (test: string, other: number): Promise<[string, number]> => [test, other];

export const DescriptionPopupInjectKey: InjectionKey<any> = Symbol('SweetformsDescriptionPopup');
export const FormInjectKey: InjectionKey<FormApi> = Symbol('SweetformsForm');
export const ModalOverlayInjectKey: InjectionKey<any> = Symbol('SweetformsModalOverlay');
export const BreakpointsInjectKey: InjectionKey<any> = Symbol('SweetformsBreakpoints')