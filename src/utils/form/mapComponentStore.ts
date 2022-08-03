import { toRaw } from "vue";
import { Field } from "~/types/fields";
import { generateUUID } from "~/utils/other/generateUUID";

export const mapComponentStore = (fields: Field[]) => {
    let componentStore: any = {};
    const mappedFields: Field[] = fields
        .map((field: any) => {
            const customComponentRef = field.component ? generateUUID() : null;
            if (customComponentRef) componentStore[customComponentRef] = toRaw(field.component);
            return { ...field, ...(field.component && { component: customComponentRef }) };
        })
        .map((field) => {
            const [subfields, subComponents] = field.fields ? mapComponentStore(field.fields) : [null, null];
            if (subComponents) componentStore = { ...componentStore, ...subComponents };
            return {
                ...field,
                ...(field.fields && { fields: subfields }),
            };
        });

    return [mappedFields, componentStore];
};
