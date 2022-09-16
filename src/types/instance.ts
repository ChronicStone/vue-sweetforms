import { ComputedRef, Ref, WatchStopHandle } from "vue";
import { FormField } from "./fields";
import { FormSchema, FormStep } from "./form";
import { SelectOption } from "naive-ui";

export interface FormInstance {
    _id: string;
    _resolve: (data: { isCompleted: boolean; formData: { [key: string]: any } }) => void;
    formSchema: FormSchema
    formData: { [key: string]: any };
}

export interface FormApi {
    formInstances: ComputedRef<FormInstance[]>;
    createForm(formSchema: FormSchema, formData?: { [key: string]: any }): Promise<{ isCompleted: boolean, formData: { [key:string]: any }}>;
}

export interface FormInstanceSteps extends Omit<FormStep, "fields"> {
    _status: "InProgress" | "Pending" | "Completed";
    _index: number;
}

export type FieldInstance = Omit<FormField, "fields"> & {
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
    fields?: FieldInstance[];
};
