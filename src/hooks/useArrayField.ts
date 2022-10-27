import { GenerateUUID, MapFormInitialState } from "@/utils";
import { TabsInst, useDialog } from "naive-ui";
import { computed, ExtractPropTypes, nextTick, PropType, ref, watch } from "vue";
export const ArrayFieldEmits = ['update:modelValue'];
export const ArrayFieldProps = {
    modelValue: {
        type: [String, Number, Date, Array, Object, Boolean] as PropType<any>,
        required: false,
    },
    validator: {
        type: Object,
        required: false,
        default: () => ({}),
    },
    field: {
        type: Object,
        required: true,
    },
    indent: {
        type: Number,
        default: 1,
    },
    gridSize: {
        type: String,
    },
}

interface PropsInterface {
    modelValue: any;
    validator: { [key: string]: any },
    field: { [key: string]: any },
    indent: number;
    gridSize: string
}


export const useArrayField = (props: any, emit: Function) => {
    const dialog = useDialog();
    const fieldValue = computed({
        get() {
            return props.modelValue;
        },
        set(value: any) {
            emit("update:modelValue", value);
        },
    })



    const activeTabIndex = ref(0);
    const arrayTabsRef = ref<TabsInst | null>(null);
    watch(
        () => activeTabIndex.value,
        () => nextTick(() => arrayTabsRef.value?.syncBarPosition())
    );

    const InitArrayFieldItem = () => {
        const _uuid = GenerateUUID();
        props.field._setItemRef(fieldValue?.value?.length, _uuid);
        if (!Array.isArray(fieldValue.value))
            fieldValue.value = [{ _uuid, ...MapFormInitialState(props.field.fields) }];
        else fieldValue?.value?.push({ _uuid, ...MapFormInitialState(props.field.fields) });
        nextTick(() => (activeTabIndex.value = fieldValue.value?.length - 1));
    };

    const RemoveArrayFieldItem = (index: number) => {
        dialog.error({
            title: "Confirm",
            content: "Are you sure you want to delete this answer?",
            positiveText: "Yes",
            negativeText: "No",
            onPositiveClick: () => {
                props.field._removeItemRef(fieldValue.value[index]._uuid);
                nextTick(
                    () => {
                        fieldValue.value.splice(index, 1);
                        activeTabIndex.value =
                        index - 1 <= 0
                            ? 0
                            : index - 1 > fieldValue.value.length - 1
                                ? fieldValue.value.length - 1
                                : index - 1
                    }
                );
            },
        });
    };

    const MoveItemLeft = (index: number) => {
        [fieldValue.value[index], fieldValue.value[index - 1]] = [
            fieldValue.value?.[index - 1],
            fieldValue.value?.[index],
        ]
    }

    const MoveItemRight = (index: number) => {
        [fieldValue.value[index], fieldValue.value[index + 1]] = [
            fieldValue.value?.[index + 1],
            fieldValue.value?.[index],
        ]
    }

    const MapArrayItems = (fields: any[]) =>
        fields.filter(
            (itemField) =>
                (itemField._enable?.value ?? itemField._enable) === true ||
                itemField.conditionEffect === "disable"
        );


    return { fieldValue, activeTabIndex, arrayTabsRef, InitArrayFieldItem, RemoveArrayFieldItem, MapArrayItems, MoveItemLeft, MoveItemRight };
}

