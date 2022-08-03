import { StyleModifierTransformKey } from "~/types/utils";

export const computeStyleModifier = (value: string, type: StyleModifierTransformKey) => {
    if (type === "grid") return `grid-template-columns: repeat(${value}, minmax(0, 1fr));`;
    if (type === "col") return `grid-column: span ${value} / span ${value};`;
    if (type === "maxWidth") return `max-width: ${value};`;
    if (type === "maxHeight") return `max-height: ${value};`;
    if (type === "boolean") return value === "true";
};
