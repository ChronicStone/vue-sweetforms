export const decapitalize = (val: string) => val.charAt(0).toLowerCase() + val.slice(1);
export const capitalize = (val: string) => val.charAt(0).toUpperCase() + val.slice(1);
export const formatKey = (val: string) =>
    val.charAt(0).toUpperCase() +
    val
        .split(/(?=[A-Z])/)
        .join(" ")
        .toLowerCase()
        .slice(1)
        .split("_")
        .join(" ");