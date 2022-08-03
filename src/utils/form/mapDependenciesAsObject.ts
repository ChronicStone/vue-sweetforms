export const mapDependenciesAsObject = (arrayDependencies: { key: string; value?: any }[]) => {
    const dependencies: any = {};
    for (const { key, value } of arrayDependencies) dependencies[key] = value;
    return dependencies;
};
