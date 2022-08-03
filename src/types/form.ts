import { Field } from "./fields";
import { VNodeChild } from "vue";

interface BaseFormSchema {
    title?: string | (() => VNodeChild);
    gridSize?: number | string;
    fieldSize?: number | string;
    fullScreen?: boolean | string;
    maxWidth?: number | string;
    maxHeight?: number | string;
    showCancelButton?: boolean | string;
    cancelButtonText?: string;
    submitButtonText?: string;
    closeOnClickOutside?: boolean | string;
    showCloseButton?: boolean;
}

export interface FormStep {
    title?: string;
    root?: string;
    fields: Field[];
}

export interface SimpleFormSchema extends BaseFormSchema {
    fields: Field[];
}

export interface SteppedFormSchema extends BaseFormSchema {
    showPreviousButton?: boolean;
    previousButtonText?: string;
    nextButtonText?: string;
    steps: FormStep[];
    showStepper?: boolean;
}

export type FormSchema = SimpleFormSchema | SteppedFormSchema;
