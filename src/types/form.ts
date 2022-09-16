import { FormField } from "./fields";
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
    fields: FormField[];
}

export type SimpleFormSchema = BaseFormSchema & {
    fields: FormField[];
}

export type SteppedFormSchema = BaseFormSchema & {
    showPreviousButton?: boolean;
    previousButtonText?: string;
    nextButtonText?: string;
    steps: FormStep[];
    showStepper?: boolean;
}

export type FormSchema = SimpleFormSchema | SteppedFormSchema;


type Narrow<T> =
    | (T extends infer U ? U : never)
    | Extract<T, number | string | boolean | bigint | symbol | null | undefined | []>
    | ([T] extends [[]] ? [] : { [K in keyof T]: Narrow<T[K]> });

type InputTypeMap = {
    text: string;
    textarea: string;
    daterange: [number, number];
    checkbox: boolean;
};

interface FormInit {
    // fullScreen: string;
    // title: string;
    // gridSize: number;
    // fieldSize: string;
    fields: FormField[];
}

type AddUndefinedIfDependent<T, F extends FormField> = "dependencies" extends keyof F ? T | undefined : T;

type DataFrom<F extends FormField[]> = {
    [K in F[number]["key"]]:
        Extract<F[number], { key: K }> extends infer Field extends FormField
            ? Field["type"] extends keyof InputTypeMap
                ? AddUndefinedIfDependent<InputTypeMap[Field["type"]], Field>
                : Field["type"] extends "object"
                    ? "fields" extends keyof Field
                        ? Field["fields"] extends FormField[]
                            ? AddUndefinedIfDependent<DataFrom<Field["fields"]>, Field>
                            : "never3"
                        : "never4"
                    : Field["type"] extends "array"
                        ? "fields" extends keyof Field
                            ? Field["fields"] extends FormField[]
                                ? AddUndefinedIfDependent<DataFrom<Field["fields"]>[], Field>
                                : "never1"
                            : "never2"
                        : Field["type"] extends "select"
                            ? "options" extends keyof Field
                                ? Field["options"] extends { value: any }[]
                                    ? "fieldParams" extends keyof Field
                                        ? Field["fieldParams"] extends { multiple: true }
                                            ? AddUndefinedIfDependent<Field["options"][number]["value"][], Field>
                                            : AddUndefinedIfDependent<Field["options"][number]["value"], Field>
                                        : never
                                    : never
                                : never
                            : "never6"
            : "never5";
} extends infer O ? { [K in keyof O]: O[K] } : never;

declare function createForm<I extends SimpleFormSchema>(
    init: Narrow<I>
): Promise<{ // using discriminated union so that when isCompleted is false, formData is undefined
    isCompleted: boolean;
    formData: DataFrom<I["fields"]>;
}>;


const { isCompleted, formData } = await createForm({
    fullScreen: 'true md:false',
  title: 'ADVANCED FORM SCHEMA EXAMPLE',
  gridSize: 8,
  fieldSize: '8 md:4',
  fields: [
    {
      key: 'firstName',
      label: 'First name',
      type: 'text',
      required: true,
    },
    {
      key: 'lastName',
      label: 'Last name',
      type: 'text',
      required: true,
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
    //   size: 8,
    },
    {
      key: 'address',
      label: 'Address',
      type: 'object',
    //   size: 8,
      fields: [
        {
          key: 'street',
          label: 'Street',
          type: 'text',
          required: true,
        },
        {
          key: 'zipCode',
          label: 'ZIP Code',
          type: 'text',
          required: true,
        },
        {
          key: 'city',
          label: 'City',
          type: 'text',
          required: true,
        },
        {
          key: 'country',
          label: 'Country',
          type: 'daterange',
          required: true,
        },
        // {
        //   key: "other",
        //   label: "Other",
        //   type: "object",
        //   fields: [
        //     { key: "a", label: "A", type: "text" },
        //     { key: "b", label: "B", type: "text" },
        //   ],
        // }
      ],
    },
    {
      key: 'skills',
      label: 'Dev skills',
      type: 'select',
      fieldParams: {
        multiple: true,
        writable: true,
      },
      options: [
        'Vue',
        'Angular',
        'React',
        'ExpressJs',
        'NestJs',
        'Fastify',
        'Typescript',
        'C#',
        'Swift',
        'Go',
        'Rust',
      ].map((value) => ({ label: value, value })),
    },
    {
      key: 'hasProExperiences',
      label: 'Has prior professional experiences',
      type: 'checkbox',
    //   size: 8,
    },
    {
      key: 'professionalExperiences',
      label: 'Professional experiences',
      type: 'array',
    //   size: 8,
      dependencies: ['hasProExperiences'],
      condition: ({ hasProExperiences }) => !!hasProExperiences,
    //   headerTemplate: (_, index) => `JOB ${index + 1}`,
      fields: [
        {
          key: 'company',
          label: 'Company',
          type: 'text',
          required: true,
        },
        {
          key: 'job',
          label: 'Job title',
          type: 'text',
          required: true,
        },
        {
          key: 'period',
          label: 'Job period',
          type: 'daterange',
          required: true,
        //   size: 8,
        },
        {
          key: 'description',
          label: 'Job description',
          type: 'textarea',
        //   size: 8,
        },
      ],
    },
  ],
});