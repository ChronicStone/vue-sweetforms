import { useBreakpoints } from "./useBreakpoints";
import { computed, inject, reactive, Ref, ref, watch } from "vue";
import { defaultStyles } from "~/constants/defaultStyles";
import { BreakpointsInjectKey } from "~/constants/injectionKeys";
import { FormSchema, FormStep } from "~/types/form";
import { useBreakpointStyle } from "./useBreakpointStyle";
import { SteppedFormSchema } from "~/types/form";
import { FieldInstance, FormInstanceSteps } from "~/types/instance";
import { CheckboxGroupField, Field, FieldTypes, RadioField, SelectField } from "~/types/fields";
import { mapComponentStore } from "~/utils/form/mapComponentStore";
import { SimpleFormSchema } from "./../types/form";
import { mapStepsAsFields } from "~/utils/form/mapStepsAsFields";
import { generateUUID } from "./../utils/other/generateUUID";
import { mapDependenciesAsObject } from "~/utils/form/mapDependenciesAsObject";
import { getPropertyFromPath } from "~/utils/form/getPropertyFromPath";
import { ObjectField, ArrayField } from "./../types/fields";
import { asyncComputed } from "@vueuse/core";
import { setPropertyFromPath } from "~/utils/form/setPropertyFromPath";
import { SelectOption } from "naive-ui";

type ComponentEmit = (event: string, data?: any) => void;
type FormData = { [key: string]: any };

interface FieldsControllerMapOptions {
    parentType: FieldTypes;
    parentId: string;
    parentKey: string[];
    parentRef: Ref<{ number: number; uuid: string }>;
}

export function useFormController(formSchema: FormSchema, formData: FormData, emit: ComponentEmit) {
    const [sourceFields, customComponentsStore] = mapComponentStore(
        (formSchema as SimpleFormSchema)?.fields ?? mapStepsAsFields((formSchema as SteppedFormSchema).steps),
    );

    const breakpointsDef = inject(BreakpointsInjectKey, {});
    const breakpointsConfig = useBreakpoints(breakpointsDef);

    // GLOBAL FORM LAYOUT STYLES
    const formStyle = reactive({
        fullScreen: useBreakpointStyle(formSchema?.fullScreen ?? defaultStyles.fullScreen, breakpointsConfig, "boolean"),
        maxHeight: useBreakpointStyle(formSchema?.maxHeight ?? defaultStyles.maxHeight, breakpointsConfig, "maxHeight"),
        maxWidth: useBreakpointStyle(formSchema?.maxWidth ?? defaultStyles.maxWidth, breakpointsConfig, "maxWidth"),
        gridSize: useBreakpointStyle(formSchema?.gridSize ?? defaultStyles.gridSize, breakpointsConfig, "grid"),
        fieldSize: useBreakpointStyle(formSchema?.fieldSize ?? defaultStyles.fieldSize, breakpointsConfig, "col"),
    });

    // MULTI-STEPS FORM CONTROLS
    const currentStepIndex = ref<number>(0);
    const formSteps = ref<FormInstanceSteps[]>(
        !(formSchema as SteppedFormSchema)?.steps
            ? []
            : (formSchema as SteppedFormSchema)?.steps.map(({ fields, ...step }: FormStep, stepIndex: number) => ({
                  ...step,
                  _status: stepIndex === 0 ? "InProgress" : "Pending",
                  _index: stepIndex,
              })),
    );
    const isMultiStep = computed<boolean>(() => formSteps.value.length > 1);

    const MapFieldsController = (fields: Field[], options?: FieldsControllerMapOptions): FieldInstance[] =>
        fields.map((field) => {
            const { fields: childFields, ...fieldConfig } = field;
            // FIELD COMPUTED STYLES
            const _size = useBreakpointStyle(field.size ?? formSchema?.fieldSize ?? defaultStyles.fieldSize, breakpointsConfig, "col");
            const _gridSize = [FieldTypes.ARRAY, FieldTypes.OBJECT].includes(field.type)
                ? useBreakpointStyle((field as ObjectField | ArrayField)?.gridSize ?? formSchema?.gridSize ?? defaultStyles.gridSize, breakpointsConfig, "grid")
                : null;

            // ASYNC COMPUTED EVAL STATE
            const _evalOptions = ref<boolean>(false);
            const _evalEnabled = ref<boolean>(false);

            // FIELD DEPENDENCIES MAP
            const _dependencies = computed(() =>
                mapDependenciesAsObject(
                    field.dependencies
                        ? field.dependencies
                              .map((item: string | [string, string] | { source: string; target: string }) =>
                                  typeof item === "string" ? { source: item, target: item } : Array.isArray(item) ? { source: item[0], target: item[1] } : item,
                              )
                              .map(({ source, target }: { source: string; target: string }) => {
                                  return {
                                      key: target,
                                      ...(source === "$root" && { value: formState }),
                                      ...(source?.toString()?.includes?.("$parent") && {
                                          value: getPropertyFromPath([...(options?.parentKey ?? [])], formState, source),
                                      }),
                                      ...(!["$root"].includes(source) &&
                                          !source?.toString()?.includes?.("$parent") && { value: getPropertyFromPath(source, formState) }),
                                  };
                              })
                        : [],
                ),
            );

            // COMPUTED PROPERTIES FIELD CONTROL
            const _required = computed(() => (typeof field.required === "function" ? field.required(_dependencies.value) : !!field.required));
            const _enable = field.condition
                ? asyncComputed(async () => await field?.condition?.(_dependencies.value), false, _evalEnabled)
                : ref<boolean>(true);
            const _options = (field as SelectField | RadioField | CheckboxGroupField)?.options
                ? asyncComputed(
                      async () =>
                          typeof (field as SelectField | RadioField | CheckboxGroupField).options === "function"
                              ? await (field as SelectField | RadioField | CheckboxGroupField)?.options?.(_dependencies.value)
                              : [],
                      [],
                      _evalOptions,
                  )
                : ref([]);

            // FIELD WATCHERS
            const _watcherOptions = watch(
                () => _options.value,
                (fieldOptions: SelectOption[]) => {
                    try {
                        const optionsValues = fieldOptions?.map?.((option: any) => option.value) ?? [];
                        const currentValue = getPropertyFromPath([...(options?.parentKey ?? []), field.key], formState);
                        if (Array.isArray(currentValue))
                            setPropertyFromPath(
                                formState,
                                [...(options?.parentKey ?? []), field.key],
                                currentValue.filter((item: any) => optionsValues.includes(item)),
                            );
                        else if (!optionsValues.includes(currentValue)) setPropertyFromPath(formState, [...(options?.parentKey ?? []), field.key], null);
                    } catch (err) {
                        console.error(err);
                    }
                },
            );

            // ARRAY FIELD ITEMS REFS
            const _itemsRefs = ref<any[]>([]);
            const _items = ref<any[]>([]);

            return {
                ...fieldConfig,
                _uuid: generateUUID(),
                _dependencies,
                _options,
                _required,
                _enable,
                _evalEnabled,
                _evalOptions,
                _watcherOptions,
                _size,
                _itemsRefs,
                _items,
                ...(_gridSize && { _gridSize }),
                ...(options?.parentRef && { _parentRef: options.parentRef }),
                ...(options?.parentType && { _parentType: options.parentType }),
                ...(options?.parentId && { _parentId: options.parentId }),
                ...(options?.parentKey && { _parentKey: options.parentKey }),
            };
        });

    const formState = ref<{ [key: string]: any }>({});
    const formContent = ref<FieldInstance[]>(MapFieldsController(sourceFields));

    return {};
}
