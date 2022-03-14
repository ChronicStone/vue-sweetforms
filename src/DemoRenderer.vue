<template>
  <div>
    <NCard title="Standalone form component" class="mb-4" :segmented="{ content: true }">
      <Form
        ref="inlineDemoForm"
        class="h-full"
        :formOptions="SimpleSchema"
        :formData="formData"
        @onSubmit="LogData"
      >
        <template #title="{ title }"> hahaha {{ title }} dqzdqz </template>
        <template #actions="{ toggleSubmit }">
          <NButton class="w-full" type="primary" @click="toggleSubmit">Sign in</NButton>
        </template>
      </Form>
    </NCard>
    <div
      v-for="(DemoGroup, groupIndex) of demonstrations"
      :key="groupIndex"
      class="grid grid-cols-1 gap-4"
    >
      <NCard
        :segmented="{ content: true }"
        hoverable
        :title="label"
        v-for="({ label, value, inputData, expanded }, demoIndex) in DemoGroup"
        :key="demoIndex"
      >
        <div class="flex flex-col gap-4">
          <div class="flex justify-center w-full items-center gap-8">
            <NButton @click="OpenForm(value, inputData)" type="primary"
              >OPEN FORM</NButton
            >
            <n-switch v-model:value="demonstrations[groupIndex][demoIndex].expanded">
              <template #unchecked>SHOW FORM DEFINITION</template>
              <template #checked>HDE FORM DEFINITION</template>
            </n-switch>
          </div>
          <!-- <NCollapseTransition :show="expanded">
            <highlightjs language="js" :code="'const form = ' + JSONstringifyWithFuncs(value)" class="overflow-x-auto rounded overflow-y-hidden" />
          </NCollapseTransition> -->
        </div>
      </NCard>

      <NCard>
        <TestComp v-model="testVal" />
        {{ testVal }}
      </NCard>
    </div>
  </div>
</template>

<script setup lang="tsx">
import TestComp from "./TestComp.vue";
import { reactive, ref } from "vue";
import { NCard, NButton, useThemeVars, NSwitch, NTag } from "naive-ui";
import { useSweetform, Form } from "./index";
import * as AllDemos from "@/demos/";
import { contentItem } from "./slotRender";
const { createForm, formInstances }: any = useSweetform();
const OpenForm = async (formContent: any, inputData: any) => {
  const data = await createForm(formContent, inputData);
  console.log(JSON.stringify(data, null, 4));
};

const demonstrations = reactive(
  Object.values(AllDemos).map((DemoGroup: any) =>
    DemoGroup.map((demo: any) => ({ ...demo, expanded: false }))
  )
);
const testVal = ref("");

const inlineDemoForm = ref(null);

const MapOptionsFromString = (value: string) => ({ label: value, value });

const ScoringModule = {
  type: "array",
  format: "tabs",
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
      format: "tabs",
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
          dependencies: ["mainModule", ["$parent:2", "module"]],
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
          dependencies: ["mainModule", "$parent"],

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
      gridSize: "9",
      collapsed: true,
      fields: [
        {
          key: "targetFieldKey",
          type: "text",
          label: "Target field key",
          required: true,
          size: "9 md:3",
        },
        {
          key: "inputFieldKey",
          type: "text",
          label: "Input field key",
          required: true,
          size: "9 md:3",
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
          size: "9 md:3",
        },
      ],
    },
  ],
};

const SimpleSchema = ref({
  title: "My form as component",
  fields: [
    {
      key: "mainModule",
      label: "Main module",
      required: true,
      size: "8",
      headerTemplate: (data) =>
        data?.key ? `<div class="uppercase">${data?.key}</div>` : "<i>NEW MODULE</i>",
      ...ScoringModule,
    },
  ],
});

const formData = {
  mainModule: [
    {
      key: "general",
      type: "composite",
      isTotalScore: true,
      scale: 100,
      dependencies: [
        {
          module: "listening",
          key: "overallBridge",
          coef: "0.5/3",
        },
        {
          module: "reading",
          key: "overallBridge",
          coef: "0.5/3",
        },
        {
          module: "grammar",
          key: "overallBridge",
          coef: "0.5/3",
        },
        {
          module: "speaking",
          key: "overallBridge",
          coef: "0.25",
        },
        {
          module: "writing",
          key: "overallBridge",
          coef: "0.25",
        },
      ],
      transformers: [
        {
          targetFieldKey: "overallCefr",
          inputFieldKey: "overall",
          transformerModule: "CefrGeneral",
        },
        {
          targetFieldKey: "descriptor",
          inputFieldKey: "",
          transformerModule: "CefrCompositeDescriptor",
          descriptorModules: [
            {
              module: "listening",
              key: "overallCefr",
              skill: "listening",
              label: "Oral comprehension",
            },
            {
              module: "reading",
              key: "overallCefr",
              skill: "reading",
              label: "Written comprehension",
            },
            {
              module: "speaking",
              key: "overallCefr",
              skill: "speaking",
              label: "Speaking proficiency",
            },
            {
              module: "writing",
              key: "overallCefr",
              skill: "writing",
              label: "Writing proficiency",
            },
          ],
        },
        {
          targetFieldKey: "equivalences",
          inputFieldKey: "overall",
          transformerModule: "CefrEquivalences",
          equivalenceModules: [
            "alte",
            "toefl_ibt",
            "ielts",
            "toefl_itp",
            "toeic_l&r",
            "gse",
          ],
          equivalenceScoreType: "number",
        },
      ],
    },
    {
      key: "listening",
      type: "external",
      isTotalScore: false,
      scale: 100,
      externalConfig: {
        externalKey: "Oral comprehension",
        externalScale: "32",
        subfields: [],
      },
      transformers: [
        {
          targetFieldKey: "overallCefr",
          inputFieldKey: "overall",
          transformerModule: "CefrGeneral",
        },
        {
          targetFieldKey: "overallBridge",
          inputFieldKey: "overallCefr",
          transformerModule: "CefrBridge",
        },
      ],
    },
    {
      key: "reading",
      type: "external",
      isTotalScore: false,
      scale: 100,
      externalConfig: {
        externalKey: "Written comprehension",
        externalScale: "36",
        subfields: [],
      },
      transformers: [
        {
          targetFieldKey: "overallCefr",
          inputFieldKey: "overall",
          transformerModule: "CefrGeneral",
        },
        {
          targetFieldKey: "overallBridge",
          inputFieldKey: "overallCefr",
          transformerModule: "CefrBridge",
        },
      ],
    },
    {
      key: "grammar",
      type: "external",
      isTotalScore: false,
      scale: 100,
      externalConfig: {
        externalKey: "Grammar",
        externalScale: "32",
        subfields: [
          {
            sourceKey: "aspectsToWorkOn",
            targetKey: "workOn",
          },
        ],
      },
      transformers: [
        {
          targetFieldKey: "overallCefr",
          inputFieldKey: "overall",
          transformerModule: "CefrGeneral",
        },
        {
          targetFieldKey: "overallBridge",
          inputFieldKey: "overallCefr",
          transformerModule: "CefrBridge",
        },
      ],
    },
    {
      key: "speaking",
      type: "module",
      isTotalScore: false,
      scale: 100,
      processor: "speaking",
      transformers: [
        {
          targetFieldKey: "overallCefr",
          inputFieldKey: "overall",
          transformerModule: "CefrSpeaking",
        },
        {
          targetFieldKey: "overallBridge",
          inputFieldKey: "overallCefr",
          transformerModule: "CefrBridge",
        },
      ],
    },
    {
      key: "writing",
      type: "module",
      isTotalScore: false,
      scale: 100,
      processor: "writing",
      transformers: [
        {
          targetFieldKey: "overallCefr",
          inputFieldKey: "overall",
          transformerModule: "CefrWriting",
        },
        {
          targetFieldKey: "overallBridge",
          inputFieldKey: "overallCefr",
          transformerModule: "CefrBridge",
        },
      ],
    },
    {
      key: "conversation",
      type: "composite",
      isTotalScore: false,
      scale: 100,
      dependencies: [
        {
          module: "listening",
          key: "overallBridge",
          coef: "1/2",
        },
        {
          module: "speaking",
          key: "overallBridge",
          coef: "1/2",
        },
      ],
      transformers: [
        {
          targetFieldKey: "overallCefr",
          inputFieldKey: "overall",
          transformerModule: "CefrGeneral",
        },
      ],
    },
    {
      key: "expression",
      type: "composite",
      isTotalScore: false,
      scale: 100,
      dependencies: [
        {
          module: "speaking",
          key: "overallBridge",
          coef: "1/2",
        },
        {
          module: "writing",
          key: "overallBridge",
          coef: "1/2",
        },
      ],
      transformers: [
        {
          targetFieldKey: "overallCefr",
          inputFieldKey: "overall",
          transformerModule: "CefrGeneral",
        },
      ],
    },
  ],
};

const LogData = (data: any) => {
  console.log(JSON.stringify(data, null, 4));
};

function JSONstringifyWithFuncs(obj) {
  Object.prototype.toJSON = function () {
    var sobj = {},
      i;
    for (i in this)
      if (this.hasOwnProperty(i))
        sobj[i] = typeof this[i] == "function" ? unescape(this[i].toString()) : this[i];

    return sobj;
  };
  Array.prototype.toJSON = function () {
    var sarr = [],
      i;
    for (i = 0; i < this.length; i++)
      sarr.push(typeof this[i] == "function" ? unescape(this[i].toString()) : this[i]);

    return sarr;
  };

  var str = JSON.stringify(obj, null, 4);

  delete Object.prototype.toJSON;
  delete Array.prototype.toJSON;

  return str;
}
const themeVars: any = useThemeVars();
</script>

<style></style>
