export const setPropertyFromPath = (object: { [key: string]: any }, path: string | string[], value: any) => {
    const properties = Array.isArray(path) ? path : path.split(".");
    properties.reduce((o, p, i) => (o[p] = properties.length === ++i ? value : o[p] || {}), object);
};
