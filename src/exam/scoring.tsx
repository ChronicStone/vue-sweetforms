
import { GetModuleFields, MapOptionsFromString, MapOptionsString, RenderHeaderTemplate } from './_utils';

const ScoringModule = {
    type: "array",
    format: "tabs",
    headerTemplate: (data: { key?: string }) => data?.key ? `<div class="uppercase">${data?.key}</div>` : "<i>NEW MODULE</i>",
    size: '8',
    fields: [
      { key: "key", type: "text", label: "Module key", required: true },
      {
        key: "type",
        type: "select",
        label: "Module type",
        required: true,
        options: ["composite", "external", "module"].map(MapOptionsFromString),
      },
      {
        key: "processor",
        type: "select",
        label: "Module processor",
        required: true,
        options: ['speaking', 'writing'].map(MapOptionsFromString),
        dependencies: ['$parent'],
        condition: ({ $parent }) => $parent?.type === "module",
      },
      {
        key: "scale",
        type: "number",
        label: "Total score scale",
        required: true,
        default: 100,
      },
      {
        key: "dependencies",
        type: "array",
        label: "Dependencies",
        required: true,
        format: "table",
        gridSize: 9,
        dependencies: [["$parent", "module"]],
        condition: ({ module }) => module?.type === "composite",
        headerTemplate: (data: any) =>
          `<div>${data?.module ?? "???" + " " + data?.key ?? "???"}</div>`,
        fields: [
          {
            key: "module",
            type: "select",
            label: "Module key",
            required: true,
            size: "9 md:3",
            dependencies: [["$parent:3", "mainModule"], ["$parent:2", "module"]],
            options: ({ mainModule, module }) => {
              return mainModule
                .filter(
                  (item: any) => item?.key != module?.key && item?.type != "composite"
                )
                .map(({ key }: { key: string }) => MapOptionsFromString(key));
            },
          },
          {
            key: "key",
            type: "select",
            label: "Field key",
            required: true,
            size: "9 md:3",
            dependencies: [["$parent:3", "mainModule"], "$parent"],
  
            options: ({ mainModule, $parent }) => {
              if (!$parent?.module) return [];
              const module = mainModule?.find?.(({ key }: any) => key === $parent?.module);
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
              return [...externalScoreKeys, ...transformersKeys].map(MapOptionsFromString);
            },
          },
          {
            key: "coef",
            type: "text",
            label: "Coefficient",
            required: true,
            default: "1",
            size: "9 md:3",
          },
        ],
        size: 8,
        collapsed: true,
      },
      {
        key: "externalConfig",
        type: "object",
        label: "External module config",
        required: true,
        dependencies: ["$parent"],
        size: "8",
        collapsed: true,
        condition: ({ $parent }) => $parent.type === "external",
        fields: [
          { key: "externalKey", type: "text", label: "External key", required: true },
          {
            key: "externalScale",
            type: "number",
            label: "Source score scale",
            required: true,
            default: 100,
          },
          {
            key: "subfields",
            type: "array",
            label: "Extra fields to retrive",
            size: "8",
            collapsed: true,
            fields: [
              { key: "sourceKey", type: "text", label: "Source key", required: true },
              { key: "targetKey", type: "text", label: "Target key", required: true },
            ],
          },
        ],
      },
      {
        key: "transformers",
        type: "array",
        format: "tabs",
        label: "Transformers",
        size: "8",
        collapsed: true,
        headerTemplate: (item) => RenderHeaderTemplate(item?.targetFieldKey ?? ''),
        fields: [
          {
            key: "targetFieldKey",
            type: "text",
            label: "Target field key",
            required: true,
          },
          {
            key: "inputFieldKey",
            type: "text",
            label: "Input field key",
            required: true,
            dependencies: ['$parent'],
            condition: ({ $parent }) => $parent?.transformerModule != "CefrCompositeDescriptor",
          },
          {
            key: "transformerModule",
            type: "select",
            label: "Transformer module",
            required: true,
            options: [
              "CefrGeneral",
              "CefrSpeaking",
              "CefrWriting",
              "CefrBridge",
              "CefrDescriptor",
              "CefrCompositeDescriptor",
              "CefrEquivalences",
              "FormatWorkOn",
              "CefrGeneralSpecificModule",
              "CefrEquivalencesSpecificModule",
            ].map(MapOptionsFromString),
          },
          {
            key: 'equivalenceModules',
            label: 'Equivalence modules',
            type: 'select',
            fieldParams: { multiple: true },
            options: ['alte', 'casas', 'gse', 'ielts', 'nrs', 'toefl_ibt', 'toefl_itp', 'toeic_l&r'].map(MapOptionsFromString),
            dependencies: ['$parent'],
            condition: ({ $parent }) => ['CefrEquivalences', 'CefrEquivalencesSpecificModule'].includes( $parent?.transformerModule),
          },
          {
            key: 'equivalenceScoreType',
            label: 'Equivalence score type',
            type: 'select',
            options: ['number', 'cefr'].map(MapOptionsFromString),
            dependencies: ['$parent'],
            condition: ({ $parent }) => ['CefrEquivalences', 'CefrEquivalencesSpecificModule'].includes( $parent?.transformerModule),
          },
          {
            key: 'descriptorLocale',
            label: 'Descriptor locale',
            type: 'select',
            options: [{ label: 'English', value: 'en' }],
            default: 'en',
            dependencies: ['$parent'],
            condition: ({ $parent }) => ['CefrDescriptor', 'CefrCompositeDescriptor'].includes( $parent?.transformerModule),
            required: true
          },
          {
            key: 'descriptorSkill',
            label: 'Descriptor skill',
            type: 'select',
            options: ['general', 'listening', 'reading', 'speaking', 'writing'].map(MapOptionsFromString),
            dependencies: ['$parent'],
            condition: ({ $parent }) => ['CefrDescriptor'].includes( $parent?.transformerModule),
          },
          {
            key: 'referenceModule',
            label: 'Reference module',
            type: 'select',
            dependencies: [['scoring.mainModule', 'mainModules'], '$parent'],
            options: ({ mainModules }) => (mainModules ?? []).map(item => item?.key).map(MapOptionsFromString),
            condition: ({ $parent }) => ['CefrGeneralSpecificModule'].includes( $parent?.transformerModule),
          },
          {
            key: 'referenceField',
            label: 'Reference field',
            type: 'select',
            dependencies: [['scoring.mainModule', 'mainModules'], '$parent'],
            options: ({ mainModules, $parent }) => {
              const module = mainModules?.find?.(({ key }: any) => key === $parent?.referenceModule);
              return GetModuleFields(module);
            },
            condition: ({ $parent }) => ['CefrGeneralSpecificModule'].includes( $parent?.transformerModule),
          },
          {
            key: 'descriptorModules',
            label: 'Descriptor modules',
            type: 'array',
            size: '8',
            headerTemplate: (item) => RenderHeaderTemplate(item?.label ?? ''),
            fields: [
              {
                label: 'Label',
                key: 'label',
                type: 'text',
                required: true
              },
              {
                key: 'skill',
                label: 'Skill',
                type: 'select',
                options: ['listening', 'reading', 'speaking', 'writing'].map(MapOptionsFromString),
                required: true
              },
              { 
                key: 'module', 
                label: 'Module key',
                type: 'select', 
                dependencies: [['$parent:5', 'mainModules'], ['$parent:4', 'currentModule']],
                options: ({ mainModules, currentModule }) => {
                  const modules = mainModules?.filter?.(({ key, type }) => key != currentModule?.key && type != 'composite');
                  return modules?.map(({ key }) => MapOptionsFromString(key));
                },
                required: true
              },
              {
                key: 'key',
                label: 'Field key',
                type: 'select',
                dependencies: [['$parent:5', 'mainModules'], '$parent'],
                options: ({ mainModules, $parent }) => {
                  const module = mainModules?.find?.(({ key }: any) => key === $parent?.module);
                  return GetModuleFields(module);
                },
                required: true
              },
            ],
            dependencies: ['$parent'],
            condition: ({ $parent }) => ['CefrCompositeDescriptor'].includes($parent?.transformerModule),

          }
        ],
      },
    ],
}

export const ScoringConfig = {
    key: 'scoring',
    label: () => <span class="text-lg font-normal">SCORING CONFIG</span>,
    type: 'object',
    size: '8',
    collapsed: true,
    fields: [
        {
            key: 'mainModule',
            label: () => <span class="uppercase text-md">Main section - scoring modules</span>,
            collapsed: true,
            ...ScoringModule
        },
    ]
}