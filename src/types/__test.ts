
interface Dependencies {
    [key: string]: any;
  }
  
  export type _FieldOptions = string[]
  
  
  export interface TextField {
    type: "text";
    minLength?: number;
    maxLength?: number;
    pair?: string;
    clearable?: boolean;
  }
  
  export interface TextAreaField extends Omit<TextField, "type" | "pair"> {
    type: "textarea";
    autosize?: boolean | { minRows?: number; maxRows?: number };
  }
  
  export interface PasswordField extends Omit<TextField, "type" | "pair"> {
    type: "password";
  }
  
  export interface SelectField {
    type: "select";
    multiple?: boolean;
    clearable?: boolean;
    filterable?: boolean;
    createTags?: boolean;
    virtualScroll?: boolean;
  }
  
  export interface NumberField {
    type: "number";
    clearable?: boolean;
    min?: number;
    max?: number;
    step?: number;
  }
  
  export interface SliderField {
    type: "slider";
    min?: number;
    max?: number;
    step?: number;
    range?: boolean;
    enableTooltip?: boolean;
    alwaysShowTooltip?: boolean;
    tooltipPlacement?:
        | "top-start"
        | "top"
        | "top-end"
        | "right-start"
        | "right"
        | "right-end"
        | "bottom-start"
        | "bottom"
        | "bottom-end"
        | "left-start"
        | "left"
        | "left-end";
    reverse?: boolean;
    marks?: { [markValue: number]: string };
  }
  
  export interface SwitchField {
    type: "switch";
    checkedStyle?: string;
    uncheckedStyle?: string;
    checkedValue?: string | boolean | number;
    uncheckedValue?: string | boolean | number;
    rounded?: boolean;
  }
  
  export interface RadioField {
    type: "radio";
    options: { label: string; value: any }[] | ((dependencies?: Dependencies) => { label: string; value: any }[]);
  }
  
  export interface CheckboxField {
    type: "checkbox";
    checkedValue?: string | boolean | number;
    uncheckedValue?: string | boolean | number;
  }
  
  export interface CheckboxGroupField {
    type: "checkbox-group";
    options: { label: string; value: any }[] | ((dependencies?: Dependencies) => { label: string; value: any }[]);
    minChecked?: number;
    maxChecked?: number;
  }
  
  export interface TimeField {
    type: "time";
    clearable?: boolean;
    bottomActions?: Array<"now" | "confirm"> | null;
    displayedHours?: number | number[];
    displayedMinutes?: number | number[];
    displayedSeconds?: number | number[];
    disableHour?: (hour: number) => boolean;
    disableMinute?: (minute: number, hour: number | null) => boolean;
    disableSecond?: (second: number, minute: number | null, hour: number | null) => boolean;
  }
  
  export interface DateField {
    type: "date" | "datetime" | "daterange" | "datetimerange" | "month" | "year";
    clearable?: boolean;
    dateDisabled?: (current: number) => boolean;
    timeDisabled?: (current: number) => boolean;
  }
  
  export interface ObjectField {
    type: "object";
    extraProperties?: boolean;
    // fields: FormField[];
    gridSize?: number | string;
  }
  
  export interface ArrayField {
    type: "array";
    format?: "table" | "list" | "tabs";
    extraProperties?: boolean;
    gridSize?: number | string;
    // fields: FormField[];
  }
  
  export interface InfoField {
    type: "info";
    content: ((dependencies: { [key: string]: any }) => string);
  }
  
  export type FormField<N> = {
    label: string;
    key: N;
    placeholder?: string;
    dependencies?: (string | [string, string])[];
    required?: boolean | ((dependencies?: { [key: string]: any }) => boolean);
    condition?: (dependencies?: Dependencies) => boolean;
    conditionEffect?: "disable" | "hide";
    size?: number | string;
    default?: any;
    preformat?: (value: any) => any;
    transform?: (value: any) => any;
    fields?: FormField<N>[];
  } & (TextField | TextAreaField | PasswordField | SelectField | NumberField | SliderField | SwitchField | RadioField | CheckboxField | CheckboxGroupField | TimeField | DateField | ObjectField | ArrayField | InfoField);
  
  (async () => {
  const { isCompleted, formData } = await createForm({
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
      size: 8,
    },
    {
      key: 'address',
      label: 'Address',
      type: 'object',
      size: 8,
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
          type: 'text',
          required: true,
        },
      ],
    },
    {
      key: 'skills',
      label: 'Dev skills',
      type: 'select',
      multiple: true
    },
    {
      key: 'hasProExperiences',
      label: 'Has prior professional experiences',
      type: 'checkbox',
      size: 8,
    },
    {
      key: 'professionalExperiences',
      label: 'Professional experiences',
      condition: ({ hasProExperiences }) => !!hasProExperiences,
      type: 'array',
      size: 8,
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
          size: 8,
        },
        {
          key: 'description',
          label: 'Job description',
       type: 'textarea',
          size: 8,
        },
      ],
    },
  ],
  });
  })
  
  type FormInfo<N> = {
  key: N
  label: string
  type: N
  required?: boolean
  size?: number
  fieldParams?: {
    multiple: boolean,
    writable: boolean,
  },
  condition?: (...args: any) => any
  fields?: FormInfo<N>[]
  }
  
  type ResolveFormType<K extends FormField<any>> =  
  K["type"] extends "checkbox"
    ? boolean
    : K["type"] extends "object"
      ? K["fields"] extends infer U extends FormField<any>[]
        ? FormInfoReturnType<U[number]>
        : never
      : K extends SelectField
        ? K["multiple"] extends true
          ? string[]
          : string
        : K["type"] extends "array"
          ? K["fields"] extends infer U extends FormField<any>[]
            ? FormInfoReturnType<U[number]>[]
            : never
          : K["type"] extends "daterange"
            ? [string, string]
            : string
  
  type FormInfoReturnType<T extends FormField<any>> = UnionToIntersection<{
  [K in T as K["condition"] extends (...args: any) => any ? never : K["key"]]: 
    ResolveFormType<K>
  } | {
  [K in T as K["condition"] extends (...args: any) => any ? K["key"] : never]?: 
    ResolveFormType<K>
  }>
  
  type UnionToIntersection<U> = 
  (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never
  
  type ExpandRecursively<T> = T extends object
  ? T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never
  : T;
  
    // [K in T[number]["root"]]: ExpandRecursively<FormInfoReturnType<T[number]["fields"][number]>>
  
  
  type Narrowable = string | number | boolean | symbol | object | undefined | void | null | {};
  
  
  
  async function createForm<T extends FormField<N>, N extends Narrowable>(arg: {
  fields: T[]
  }): Promise<{ isCompleted: any, formData: ExpandRecursively<FormInfoReturnType<T>> } > {
  return {} as any
  }


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
    closeOnClickOutside?: boolean | string;
    showCloseButton?: boolean;
}

export interface FormStep<T, S> {
    title?: string;
    root: S;
    fields: FormField<T>[];
}

export type SimpleFormSchema<T> = BaseFormSchema & {
    fields: FormField<T>[];
}

export type SteppedFormSchema<T, S> = BaseFormSchema & {
    showPreviousButton?: boolean;
    previousButtonText?: string;
    nextButtonText?: string;
    steps: FormStep<T, S>[];
    showStepper?: boolean;
}

export type FormSchema<T, S> = SimpleFormSchema<T> | SteppedFormSchema<T, S>;

type ExctactFormStepsFields<T extends FormStep<any, any>[]> = {
    [K in T[number]["root"]]: ExpandRecursively<FormInfoReturnType<T[number]["fields"][number]>>
  }

  async function createForm2<T extends FormSchema<N, S>, N extends Narrowable, S extends Narrowable>(schema: FormSchema<N, S>): Promise<{ 
    isCompleted: any, 
    formData: T extends SimpleFormSchema<N> ? ExpandRecursively<FormInfoReturnType<T["fields"][number]>> :  T extends SteppedFormSchema<N, S> ? ExpandRecursively<ExctactFormStepsFields<T["steps"]>> : never
  }> {
    return {} as any
    }

    const { formData } = await createForm2({
        steps: [
            {
                root: "Step1",
                fields: [
                    { type: "text", key: "Hello", label: "Hello" },
                    { type: "text", key: "World", label: "World" },
                    { type: "object", key: "nested", label: "Nested", fields: [
                        { type: "text", key: "Hello", label: "Hello" },
                        { type: "text", key: "World", label: "World" },
                    ]}
                ]
            }
        ]
    })

    const { formData: otherFormData } = await createForm2({
        fields: [
            { type: "text", key: "hello", label: "Hello" },
            { type: "text", key: "world", label: "World" },
            { type: "select", key: "skills", label: "Dev skills", options: [] },
            { type: "object", key: "nested", label: "Nested", fields: [
                { type: "text", key: "Hello", label: "Hello" },
                { type: "text", key: "World", label: "World" },
            ]}
        ]
    })