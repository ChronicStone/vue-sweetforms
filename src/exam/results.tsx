import { IsItemType, LabelSize, TextSize, TextWeight } from "./_shared";
import { GetModuleFields, MapOptionsFromString, RenderHeaderTemplate } from "./_utils"

const ResultsModules = (target: 'main' | 'specific') => ({
    type: 'array',
    size: '8',
    headerTemplate: (data: { moduleKey?: string }) => data?.moduleKey ? `<div class="uppercase">${data?.moduleKey}</div>` : "<i>NEW MODULE</i>",
    fields: [
        { 
            key: 'moduleKey', 
            type: 'select', 
            label: 'Module', 
            required: true,
            dependencies: target === 'main' ? [["scoring.mainModule", "scoringModules"]] : [["scoring.specificModule.modules", "scoringModules"]],
            options: ({ scoringModules }) => (scoringModules ?? [])?.map(item => item.key).map(MapOptionsFromString),
        },
        {
            key: 'group',
            type: 'text',
            label: 'Group',
            required: false,
        },
        {
            key: 'inlineContent',
            label: 'Inline content',
            type: 'array',
            size: '8',
            collapsed: true, 
            headerTemplate: (data) => RenderHeaderTemplate(data?.contentType != 'grid' ? (data?.fieldKey ? `${data?.fieldKey} - ${data?.contentType}` : '') : 'GRID'),
            fields: [
                { key: 'contentType', label:'Content type', type: 'select', options: ['text', 'progress', 'grid'].map(MapOptionsFromString), required: true, size: 8 },
                { key: 'label', label:'Label', type: 'text', required: true, ...IsItemType('text') },
                { 
                    key: 'fieldKey', 
                    label:'Field key', 
                    type: 'select', 
                    required: true,
                    dependencies: ['$parent' ,["$parent:2", "resultModule"], [target === 'main' ? "scoring.mainModule" : "scoring.specificModule.modules", "scoringModules"]],
                    options: ({ resultModule, scoringModules }) => {
                        const module = scoringModules?.find(item => item.key === resultModule?.moduleKey);
                        return GetModuleFields(module)
                    },
                    condition: ({ $parent }) => $parent?.contentType != 'grid',
                },
                // PROGRESS TYPE FIELDS
                { key: 'progressType', label:'Progressbar type', type: 'select', options: ['cefr', 'number'].map(MapOptionsFromString), default: 'cefr', required: true, ...IsItemType('progress') },
                // TEXT TYPE FIELDS
                { key: 'template', label:'Template', type: 'text', required: false, size: '8', ...IsItemType('text') },
                { key: 'labelSize', label:'Label size', type: 'select', options: TextSize, default: "sm", required: true, ...IsItemType('text') },
                { key: 'labelWeight', label:'Label weight', type: 'select', options: TextWeight, default: 'regular', required: true, ...IsItemType('text') },
                { key: 'contentSize', label:'Content size', type: 'select', options: TextSize, default: "sm", required: true, ...IsItemType('text') },
                { key: 'contentWeight', label:'Content weight', type: 'select', options: TextWeight, default: 'regular', required: true, ...IsItemType('text') },
                { key: 'display', label: "Display direction", type: 'select', options: ['row', 'column'].map(MapOptionsFromString), default: 'row', required: true, ...IsItemType('text') },
                { key: 'align', label: "Align", type: 'select', options: ['left', 'center', 'right'].map(MapOptionsFromString), default: 'left', required: true, ...IsItemType('text') },
                // GRID TYPE FIELDS
                { key: 'columns', label:'Number of columns', type: 'slider', default: 1, fieldParams: { min: 1, max: 12 }, size: 8, required: true, ...IsItemType('grid') },
                {
                    key: 'content',
                    label: 'Grid content',
                    type: 'array',
                    size: '8',
                    collapsed: true,
                    fields: [
                        { key: 'rowSize', label:'Item size', type: 'slider', default: 1, fieldParams: { min: 1, max: 12 }, size: 8, required: true },
                        { key: 'label', label:'Label', type: 'text', required: true },
                        { 
                            key: 'fieldKey', 
                            label:'Field key', 
                            type: 'select', 
                            required: true,
                            dependencies: [["$parent:4", "resultModule"], [target === 'main' ? "scoring.mainModule" : "scoring.specificModule.modules", "scoringModules"]],
                            options: ({ resultModule, scoringModules }) => {
                                const module = scoringModules?.find(item => item.key === resultModule?.moduleKey);
                                return GetModuleFields(module)
                            },
                        },
                        { key: 'template', label:'Template', type: 'text', required: false, size: '8' },
                        { key: 'labelSize', label:'Label size', type: 'select', options: TextSize, default: "sm", required: true },
                        { key: 'labelWeight', label:'Label weight', type: 'select', options: TextWeight, default: 'regular', required: true },
                        { key: 'contentSize', label:'Content size', type: 'select', options: TextSize, default: "sm", required: true },
                        { key: 'contentWeight', label:'Content weight', type: 'select', options: TextWeight, default: 'regular', required: true },
                    ],
                    dependencies: ['$parent'],
                    condition: ({ $parent }) => $parent?.contentType === 'grid',
                }
            ]
        },
        {
            key: 'popupContent',
            label: 'Popup content',
            type: 'array',
            size: '8',
            collapsed: true,
            headerTemplate: (item) => RenderHeaderTemplate(item?.fieldKey),
            fields: [
                { key: 'label', label:'Label', type: 'text', required: true },
                { 
                    key: 'fieldKey', 
                    label:'Field key', 
                    type: 'select', 
                    required: true,
                    dependencies: [["$parent:2", "resultModule"], [target === 'main' ? "scoring.mainModule" : "scoring.specificModule.modules", "scoringModules"]],
                    options: ({ resultModule, scoringModules }) => {
                        const module = scoringModules?.find(item => item.key === resultModule?.moduleKey);
                        return GetModuleFields(module)
                    },
                },
                { key: 'template', label:'Template', type: 'text', required: false, size: '8' },
            ]
        }
    ]
})

export const ResultConfig = {
    key: "results",
    label: () => <span class="text-lg font-normal">RESULTS CONFIG</span>,
    type: 'object',
    size: '8',
    collapsed: true,
    fields: [
        { key: "enableResultsApp", type: "checkbox", label: "Enable results app", required: true },
        { 
            key: 'mainModule',
            label: () => <span class="uppercase text-md">Main section - results modules</span>,
            collapsed: true,
            ...ResultsModules('main')
        },
        {
            key: 'specificModule',
            label: () => <span class="uppercase text-md">Specific section - results modules</span>,
            collapsed: true,
            ...ResultsModules('specific')
        }
    ]
}