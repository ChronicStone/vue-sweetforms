export const FormatKey = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

export const MapOptionsFromString = (value: string) => ({ label: FormatKey(value), value });

export const RenderHeaderTemplate = (value: string | number, itemName = 'item') => value ?  `<div class="uppercase">${FormatKey(value?.toString())}</div>` : `<i class="uppercase">NEW ${itemName}</i>`  

export const GetModuleFields = (module: any) => {
    if (!module) return []

    const speakingProcessorFields: string[] = []
    const writingProcessorFields = ['task', 'lexical', 'grammar', 'cohesion']

    const externalScoreKeys =
        module?.externalConfig?.subfields
            ?.map?.(({ targetKey }: { targetKey: string }) => targetKey)
            ?.filter((key: string) => !!key) ?? [];
    const transformersKeys =
        module?.transformers
            ?.map?.(
                ({ targetFieldKey }: { targetFieldKey: string }) => targetFieldKey
            )
            ?.filter((key: string) => !!key) ?? [];
    return [
        'overall',
        ...externalScoreKeys, 
        ...transformersKeys,
        ...(module?.processor === 'speaking' ? speakingProcessorFields : []),
        ...(module?.processor === 'writing' ? writingProcessorFields : [])
    ].filter(Boolean).map(MapOptionsFromString)
}