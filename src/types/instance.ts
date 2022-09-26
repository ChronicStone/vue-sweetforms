import { ComputedRef, Ref, WatchStopHandle } from "vue";
import { FormField } from "./fields";
import { ExpandRecursively, ExtractFieldsFromSteps, FormInfoReturnType, FormSchema, FormStep, Narrowable, SimpleFormSchema, SteppedFormSchema } from "./form";
import { SelectOption } from "naive-ui";

export interface FormInstance {
    _id: string;
    _resolve?: (data: { isCompleted: boolean; formData: { [key: string]: any } }) => void;
    formSchema: FormSchema<any, any>
    formData: { [key: string]: any };
}

export interface FormApi {
    formInstances: ComputedRef<FormInstance[]>;
    createForm<TFormSchema extends FormSchema<StepKey, FieldKey>, StepKey extends Narrowable, FieldKey extends Narrowable>(schema: TFormSchema): Promise<{ 
        isCompleted: boolean, 
        formData: TFormSchema extends SimpleFormSchema<FieldKey> ? ExpandRecursively<FormInfoReturnType<TFormSchema["fields"][number]>>  : TFormSchema extends SteppedFormSchema<StepKey, FieldKey> ? ExpandRecursively<ExtractFieldsFromSteps<StepKey, FieldKey, TFormSchema["steps"][number]>>  : never
    }>
}

export interface FormInstanceSteps extends Omit<FormStep<any, any>, "fields"> {
    _status: "InProgress" | "Pending" | "Completed" | "Invalid";
    _index: number;
}

export type FieldInstance = Omit<FormField<any>, "fields"> & {
    _uuid: string;
    _dependencies: ComputedRef<{ [key: string]: any }>;
    _evalOptions: Ref<boolean>;
    _evalEnabled: Ref<boolean>;
    _size: ComputedRef<number>;
    _gridSize?: ComputedRef<string>;
    _fieldSize?: ComputedRef<string>;
    _required: ComputedRef<boolean>;
    _stepRoot?: string;
    _enable: Ref<boolean | undefined>;
    _options: Ref<SelectOption[]>;
    _watcherOptions?: WatchStopHandle;
    _setItemRef?: (index: number, uuid: string) => void;
    _removeItemRef?: (uuid: string) => void;
    _itemsRefs?: Ref<{ number: number; uuid: string }[]>;
    _items?: Ref<any[]>;
    _watcherItems?: WatchStopHandle;
    _fields?: FieldInstance[];
};


export type FormRefInstance  = {
    $clear: () => void;
    $reset: () => void;
    $validate: () => Promise<{ $valid: boolean; $errors: any[]; $data: { [key: string]: any } }>;
    formData: { [key: string]: any };
}