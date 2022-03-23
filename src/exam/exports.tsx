
import { RenderHeaderTemplate, MapOptionsFromString, GetModuleFields } from './_utils';

export const ExportConfig = {
    key: 'exports',
    type: 'array',
    label: () => <span class="text-lg font-normal">EXPORTS CONFIG</span>,
    collapsed: true,
    size: 8,
    headerTemplate: (item) => RenderHeaderTemplate(item?.moduleRoot ? `${item.moduleRoot} - ${item?.moduleKey ?? '??'}` : ''),
    fields: [
        { key: 'moduleRoot', type: 'select', label: 'Module root', options: ['mainModule', 'specificModule'].map(MapOptionsFromString),  required: true },
        { 
            key: 'moduleKey', 
            type: 'select', 
            label: 'Module key', 
            required: true,
            dependencies: ['scoring', '$parent'],
            options: ({ scoring, $parent }) => {
                if(!$parent?.moduleRoot) return []
                const scoringModules = $parent.moduleRoot === 'mainModule' ? scoring.mainModule : (scoring.specificModule?.modules ?? []);
                return scoringModules.map(item => item.key).map(MapOptionsFromString)
            }
        },
        {
            key: 'properties',
            type: 'array',
            label: 'Exported properties',
            collapsed: false,
            size: 8,
            headerTemplate: (item) => RenderHeaderTemplate(item?.fieldKey),
            fields: [
                { key: 'label', label:'Label', type: 'text', required: true },
                { 
                    key: 'fieldKey', 
                    label:'Field key', 
                    type: 'select', 
                    required: true,
                    dependencies: [["$parent:2", "exportModule"], 'scoring'],
                    options: ({ exportModule, scoring }) => {
                        const scoringModules = exportModule.moduleRoot === 'mainModule' ? scoring.mainModule : (scoring.specificModule?.modules ?? []);
                        const module = scoringModules?.find(item => item.key === exportModule?.moduleKey);
                        return GetModuleFields(module)
                    },
                },
                { key: 'template', label:'Template', type: 'text', required: false, size: '8' }
            ]
        }
    ]
}