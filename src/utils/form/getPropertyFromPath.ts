const getOffset = (key: string | undefined) => {
    try {
        if (!key) return 0;
        const offset = key.split(":").pop();
        return offset && !isNaN(+offset) ? +offset : 0;
    } catch (err) {
        return 0;
    }
};

export const getPropertyFromPath = (path: string | (string | number)[], obj: any, key?: string) => {
    const offset = getOffset(key);
    const properties = (Array.isArray(path) ? path : path.split("."))
        .map((pathKey, index, array) => (index < array.length - offset ? pathKey : null))
        .filter((pathKey) => pathKey != null);
    return properties.reduce((prev, curr) => prev && prev[curr as string], obj);
};
