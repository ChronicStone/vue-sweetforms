import { IsItemType, TextSize, TextWeight } from "./_shared";
import { GetModuleFields, MapOptionsFromString, RenderHeaderTemplate } from "./_utils";

export const CertificateContentModule = () => ({
    type: 'array',
    size: '8',
    collapsed: true,
    headerTemplate: (item) => RenderHeaderTemplate(item?.moduleSource ? `${item.moduleSource} - ${item?.moduleKey ?? '??'}` : ''),
    fields: [
        { key: 'moduleSource', type: 'select', label: 'Module source', options: ['mainModule', 'specificModule'].map(MapOptionsFromString),  required: true },
        { 
            key: 'moduleKey', 
            type: 'select', 
            label: 'Module key', 
            required: true,
            dependencies: ['scoring', '$parent'],
            options: ({ scoring, $parent }) => {
                if(!$parent?.moduleSource) return []
                const scoringModules = $parent.moduleSource === 'mainModule' ? scoring.mainModule : (scoring.specificModule?.modules ?? []);
                return scoringModules.map(item => item.key).map(MapOptionsFromString)
            }
        },
        {
            key: 'content',
            label: 'Content',
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
                    dependencies: ['$parent' ,["$parent:2", "displayModule"], "scoring"],
                    options: ({ displayModule, scoring }) => {
                        const scoringModules = displayModule?.moduleSource === 'mainModule' ? scoring.mainModule : (scoring.specificModule?.modules ?? []);
                        const module = scoringModules?.find(item => item.key === displayModule?.moduleKey);
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
                    dependencies: ['$parent'],
                    condition: ({ $parent }) => $parent?.contentType === 'grid',
                    fields: [
                        { key: 'rowSize', label:'Item size', type: 'slider', default: 1, fieldParams: { min: 1, max: 12 }, size: 8, required: true },
                        { key: 'label', label:'Label', type: 'text', required: true },
                        { 
                            key: 'fieldKey', 
                            label:'Field key', 
                            type: 'select', 
                            required: true,
                            dependencies: [["$parent:4", "displayModule"], ["scoring"]],
                            options: ({ displayModule, scoring }) => {
                                const scoringModules = displayModule?.moduleSource === 'mainModule' ? scoring.mainModule : (scoring.specificModule?.modules ?? []);
                                const module = scoringModules?.find(item => item.key === displayModule?.moduleKey);
                                return GetModuleFields(module)
                            },
                        },
                        { key: 'template', label:'Template', type: 'text', required: false, size: '8' },
                        { key: 'labelSize', label:'Label size', type: 'select', options: TextSize, default: "sm", required: true },
                        { key: 'labelWeight', label:'Label weight', type: 'select', options: TextWeight, default: 'regular', required: true },
                        { key: 'contentSize', label:'Content size', type: 'select', options: TextSize, default: "sm", required: true },
                        { key: 'contentWeight', label:'Content weight', type: 'select', options: TextWeight, default: 'regular', required: true },
                        { key: 'display', label: "Display direction", options: ['row', 'column'].map(MapOptionsFromString), default: 'row', required: true },
                        { key: 'align', label: "Align", options: ['left', 'center', 'right'].map(MapOptionsFromString), default: 'left', required: true },
                    ]
                }
            ]
        },
    ]

})

export const CertificateConfig = {
    key: "certificates",
    label: () => <span class="text-lg font-normal">CERTIFICATES CONFIG</span>,
    type: 'object',
    size: '8',
    collapsed: true,
    fields: [
        {
            key: 'scoreReport',
            label: 'Score report',
            type: 'object',
            collapsed: true,
            size: '8',
            fields: [
                { key: 'generate', type: 'checkbox', label: 'Generate score report', size: '8' },
                { 
                    key: 'pages', 
                    label: 'Document pages', 
                    type: 'array', 
                    collapsed: true, 
                    size: '8', 
                    headerTemplate: (_, index: number) => RenderHeaderTemplate(`Page ${index + 1}`),
                    fields: [
                        { key: 'title', label: 'Title', type: 'text' },
                        { key: 'position', label: 'Position', type: 'number' },
                        { key: 'showCandidateInformation', type: 'checkbox', label: 'Show candidate information' },
                        {
                            key: 'modules',
                            label: 'Displayed modules',
                            ...CertificateContentModule()
                        }
                    ]
                }
            ]
        },
        {
            key: 'officialCertificate',
            label: 'Official certificate',
            type: 'object',
            collapsed: true,
            size: '8',
            fields: [
                { key: 'generate', type: 'checkbox', label: 'Generate official certificate', size: '8' },
                {
                    key: 'documentContent',
                    label: 'Document content',
                    type: 'object',
                    collapsed: true,
                    size: '8',
                    fields: [
                        { key: 'leftContainer', label: 'Left container', ...CertificateContentModule() },
                        { key: 'rightContainer', label: 'Right container', ...CertificateContentModule() }
                    ]
                }
            ]
        },
        {
            key: 'evidenceReport',
            label: 'Evidence report',
            type: 'object',
            collapsed: true,
            size: '8',
            fields: [
                { key: 'generate', type: 'checkbox', label: 'Generate evidence report', size: '8' },
                { key: 'documentContent', label: 'Document content', ...CertificateContentModule() }
            ]
        }
    ]
}