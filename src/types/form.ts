import { FormField, SelectField } from "./fields";

interface BaseFormSchema {
    title?: string;
    gridSize?: number | string;
    fieldSize?: number | string;
    fullScreen?: boolean | string;
    maxWidth?: number | string;
    maxHeight?: number | string;
    showCancelButton?: boolean | string;
    cancelButtonText?: string;
    submitButtonText?: string;
    showCloseButton?: boolean;
    allowOutsideClick?: boolean;
    showPrevButton?: boolean;
    prevButtonText?: string;
    nextButtonText?: string;
    showStepper?: boolean;
    requiredMessage?: string | ((label: string) => string);
}

export interface FormStep<StepKey, FieldKey> {
    title?: string;
    root?: StepKey;
    fields: FormField<FieldKey>[];
}

export type SimpleFormSchema<FieldKey> = {
    fields: FormField<FieldKey>[];
}

export type SteppedFormSchema<StepKey = any, FieldKey = any> = {
    steps: FormStep<StepKey, FieldKey>[];
    showStepper?: boolean;
}


type ResolveFormType<K extends FormField<any>> =  
K["type"] extends "checkbox"
  ? boolean
  : K["type"] extends "object"
    ? K["fields"] extends infer U extends FormField<any>[]
      ? FormInfoReturnType<U[number]>
      : never
    : K extends SelectField
      ? K["fieldParams"] extends { multiple: true }
        ? string[]
        : string
      : K["type"] extends "array"
        ? K["fields"] extends infer U extends FormField<any>[]
          ? FormInfoReturnType<U[number]>[]
          : never
        : K["type"] extends "daterange"
          ? [string, string]
          : string

export type FormInfoReturnType<T extends FormField<any>> = UnionToIntersection<{
[K in T as K["condition"] extends (...args: any) => any ? never : K["key"]]: 
  ResolveFormType<K>
} | {
[K in T as K["condition"] extends (...args: any) => any ? K["key"] : never]?: 
  ResolveFormType<K>
}>

type UnionToIntersection<U> = 
(U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never

export type ExpandRecursively<T> = T extends object
? T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never
: T;


export type Narrowable = string | number | boolean | symbol | object | undefined | void | null | {};


export type FormSchema<StepKey = any, FieldKey = any> = BaseFormSchema & (SimpleFormSchema<FieldKey> | SteppedFormSchema<StepKey, FieldKey>);

export type ExtractFieldsFromSteps<StepKey, FieldKey, TStep extends FormStep<StepKey, FieldKey>> = TStep["root"] extends string 
            ? { [key in TStep["root"]]: ExpandRecursively<FormInfoReturnType<TStep["fields"][number]>> } 
            :  ExpandRecursively<FormInfoReturnType<TStep["fields"][number]>>


 export type FormApi = {
  createForm<TFormSchema extends FormSchema<StepKey, FieldKey>, StepKey extends Narrowable, FieldKey extends Narrowable>(schema: TFormSchema, formData?: { [key: string]: any}): Promise<{ 
    isCompleted: boolean, 
    formData: TFormSchema extends SimpleFormSchema<FieldKey> ? ExpandRecursively<FormInfoReturnType<TFormSchema["fields"][number]>>  : TFormSchema extends SteppedFormSchema<StepKey, FieldKey> ? ExpandRecursively<ExtractFieldsFromSteps<StepKey, FieldKey, TFormSchema["steps"][number]>>  : never
  }>;
}