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
import { ExamConfig } from "./exam";
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

const SimpleSchema = ref(ExamConfig);

const formData = {
  general: {
    manualReview: false,
    allowCoBranding: false,
    examLogo: "",
    locales: {
      options: [],
    },
    accessibilityWindow: {
      usesAccessibilityWindow: false,
    },
  },
  scoring: {
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
    specificModule: {
      active: false,
    },
  },
  results: {
    enableResultsApp: true,
    mainModule: [
      {
        moduleKey: "general",
        group: "",
        inlineContent: [
          {
            contentTarget: "inline",
            contentType: "text",
            label: "GENERAL CEFR LEVEL",
            fieldKey: "overallCefr",
            template: "",
            labelSize: "xl",
            labelWeight: "regular",
            contentSize: "xl",
            contentWeight: "regular",
            display: "row",
            align: "left",
          },
          {
            contentTarget: "inline",
            contentType: "progress",
            fieldKey: "overallCefr",
            progressType: "cefr",
          },
        ],
        popupContent: [
          {
            contentTarget: "popup",
            label: "CEFR DESCRIPTOR",
            fieldKey: "descriptor",
            template: "{{{ score | mapList }}}",
          },
          {
            contentTarget: "popup",
            label: "Estimated correspondance based on the CEFR levels",
            fieldKey: "equivalences",
            template: "",
          },
        ],
      },
      {
        moduleKey: "listening",
        group: "",
        inlineContent: [
          {
            contentTarget: "inline",
            contentType: "text",
            label: "ORAL COMPREHENSION CEFR LEVEL",
            fieldKey: "overallCefr",
            template: "",
            labelSize: "xl",
            labelWeight: "regular",
            contentSize: "xl",
            contentWeight: "regular",
            display: "row",
            align: "left",
          },
          {
            contentTarget: "inline",
            contentType: "progress",
            fieldKey: "overallCefr",
            progressType: "cefr",
          },
        ],
        popupContent: [],
      },
      {
        moduleKey: "reading",
        group: "",
        inlineContent: [
          {
            contentTarget: "inline",
            contentType: "text",
            label: "WRITTEN COMPREHENSION CEFR LEVEL",
            fieldKey: "overallCefr",
            template: "",
            labelSize: "xl",
            labelWeight: "regular",
            contentSize: "xl",
            contentWeight: "regular",
            display: "row",
            align: "left",
          },
          {
            contentTarget: "inline",
            contentType: "progress",
            fieldKey: "overallCefr",
            progressType: "cefr",
          },
        ],
        popupContent: [],
      },
      {
        moduleKey: "grammar",
        group: "",
        inlineContent: [
          {
            contentTarget: "inline",
            contentType: "text",
            label: "GRAMMAR CEFR LEVEL",
            fieldKey: "overallCefr",
            template: "",
            labelSize: "xl",
            labelWeight: "regular",
            contentSize: "xl",
            contentWeight: "regular",
            display: "row",
            align: "left",
          },
          {
            contentTarget: "inline",
            contentType: "progress",
            fieldKey: "overallCefr",
            progressType: "cefr",
          },
        ],
        popupContent: [
          {
            contentTarget: "popup",
            label: "WORK ON",
            fieldKey: "workOn",
            template: "",
          },
        ],
      },
      {
        moduleKey: "speaking",
        group: "",
        inlineContent: [
          {
            contentTarget: "inline",
            contentType: "text",
            label: "SPEAKING CEFR LEVEL",
            fieldKey: "overallCefr",
            template: "",
            labelSize: "xl",
            labelWeight: "regular",
            contentSize: "xl",
            contentWeight: "regular",
            display: "row",
            align: "left",
          },
          {
            contentTarget: "inline",
            contentType: "progress",
            fieldKey: "overallCefr",
            progressType: "cefr",
          },
        ],
        popupContent: [],
      },
      {
        moduleKey: "writing",
        group: "",
        inlineContent: [
          {
            contentTarget: "inline",
            contentType: "text",
            label: "WRITING CEFR LEVEL",
            fieldKey: "overallCefr",
            template: "",
            labelSize: "xl",
            labelWeight: "regular",
            contentSize: "xl",
            contentWeight: "regular",
            display: "row",
            align: "left",
          },
          {
            contentTarget: "inline",
            contentType: "progress",
            fieldKey: "overallCefr",
            progressType: "cefr",
          },
          {
            contentTarget: "inline",
            contentType: "grid",
            columns: 4,
            content: [
              {
                rowSize: 1,
                label: "Task:",
                fieldKey: "task",
                template: "{{ score }} / 100",
                labelSize: "lg",
                labelWeight: "bold",
                contentSize: "lg",
                contentWeight: "regular",
              },
              {
                rowSize: 1,
                label: "Cohesion:",
                fieldKey: "cohesion",
                template: "{{ score }} / 100",
                labelSize: "lg",
                labelWeight: "bold",
                contentSize: "lg",
                contentWeight: "regular",
              },
              {
                rowSize: 1,
                label: "Grammar:",
                fieldKey: "grammar",
                template: "{{ score }} / 100",
                labelSize: "lg",
                labelWeight: "bold",
                contentSize: "lg",
                contentWeight: "regular",
              },
              {
                rowSize: 1,
                label: "Lexical:",
                fieldKey: "lexical",
                template: "{{ score }} / 100",
                labelSize: "lg",
                labelWeight: "bold",
                contentSize: "lg",
                contentWeight: "regular",
              },
            ],
            align: "center",
          },
        ],
        popupContent: [],
      },
      {
        moduleKey: "conversation",
        group: "inPracticeSkills",
        inlineContent: [
          {
            contentTarget: "inline",
            contentType: "text",
            label: "CONVERSATION (LISTENING & SPEAKING) CEFR LEVEL",
            fieldKey: "overallCefr",
            template: "",
            labelSize: "xl",
            labelWeight: "regular",
            contentSize: "xl",
            contentWeight: "regular",
            display: "row",
            align: "left",
          },
          {
            contentTarget: "inline",
            contentType: "progress",
            fieldKey: "overallCefr",
            progressType: "cefr",
          },
        ],
        popupContent: [],
      },
      {
        moduleKey: "expression",
        group: "inPracticeSkills",
        inlineContent: [
          {
            contentTarget: "inline",
            contentType: "text",
            label: "EXPRESSION (SPEAKING & WRITING) CEFR LEVEL",
            fieldKey: "overallCefr",
            template: "",
            labelSize: "xl",
            labelWeight: "regular",
            contentSize: "xl",
            contentWeight: "regular",
            display: "row",
            align: "left",
          },
          {
            contentTarget: "inline",
            contentType: "progress",
            fieldKey: "overallCefr",
            progressType: "cefr",
          },
        ],
        popupContent: [],
      },
    ],
    specificModule: [],
  },
  exports: [
    {
      moduleRoot: "mainModule",
      moduleKey: "general",
      properties: [
        {
          label: "GENERAL CEFR LEVEL",
          fieldKey: "overallCefr",
          template: "",
        },
        {
          label: "GENERAL SCORE",
          fieldKey: "overall",
          template: "{{score}} / {{overallScale}}",
        },
        {
          label: "Estimated correspondance based on the CEFR levels",
          fieldKey: "equivalences",
          template: "",
        },
      ],
    },
    {
      moduleRoot: "mainModule",
      moduleKey: "listening",
      properties: [
        {
          label: "ORAL COMPREHENSION CEFR LEVEL",
          fieldKey: "overallCefr",
          template: "",
        },
      ],
    },
    {
      moduleRoot: "mainModule",
      moduleKey: "reading",
      properties: [
        {
          label: "WRITTEN COMPREHENSION CEFR LEVEL",
          fieldKey: "overallCefr",
          template: "",
        },
      ],
    },
    {
      moduleRoot: "mainModule",
      moduleKey: "grammar",
      properties: [
        {
          label: "GRAMMAR CEFR LEVEL",
          fieldKey: "overallCefr",
          template: "",
        },
      ],
    },
    {
      moduleRoot: "mainModule",
      moduleKey: "speaking",
      properties: [
        {
          label: "SPEAKING CEFR LEVEL",
          fieldKey: "overallCefr",
          template: "",
        },
      ],
    },
    {
      moduleRoot: "mainModule",
      moduleKey: "writing",
      properties: [
        {
          label: "WRITING CEFR LEVEL",
          fieldKey: "overallCefr",
          template: "",
        },
      ],
    },
  ],
  emails: {
    examConvocation: {
      active: true,
    },
    examDone: {
      active: true,
    },
    examSecurityCompromised: {
      active: true,
    },
  },
  certificates: {
    scoreReport: {
      generate: true,
      documentConfig: {
        documentTitle: "OFFICIAL TEST REPORT",
        showCandidatePhoto: true,
        showQrCode: true,
      },
      pages: [
        {
          title: "",
          position: 1,
          showCandidateInformation: true,
          modules: [
            {
              moduleSource: "mainModule",
              moduleKey: "general",
              content: [
                {
                  contentType: "text",
                  label: "GENERAL CEFR LEVEL",
                  fieldKey: "overallCefr",
                  labelSize: "xl",
                  labelWeight: "bold",
                  contentSize: "xl",
                  contentWeight: "bold",
                  display: "row",
                  align: "left",
                },
                {
                  contentType: "progress",
                  fieldKey: "overallCefr",
                  progressType: "cefr",
                },
                {
                  contentType: "text",
                  label: "Estimated correspondance based on the CEFR levels",
                  fieldKey: "equivalences",
                  labelSize: "sm",
                  labelWeight: "bold",
                  contentSize: "sm",
                  contentWeight: "regular",
                  display: "column",
                  align: "center",
                },
                {
                  contentType: "text",
                  label: "GENERAL CEFR DESCRIPTOR",
                  fieldKey: "descriptor",
                  template: "{{{ score | mapList }}}",
                  labelSize: "sm",
                  labelWeight: "bold",
                  contentSize: "sm",
                  contentWeight: "regular",
                  display: "column",
                  align: "center",
                },
              ],
            },
            {
              moduleSource: "mainModule",
              moduleKey: "listening",
              content: [
                {
                  contentType: "text",
                  label: "ORAL COMPREHENSION CEFR LEVEL",
                  fieldKey: "overallCefr",
                  labelSize: "xl",
                  labelWeight: "bold",
                  contentSize: "xl",
                  contentWeight: "bold",
                  display: "row",
                  align: "left",
                },
                {
                  contentType: "progress",
                  fieldKey: "overallCefr",
                  progressType: "cefr",
                },
              ],
            },
            {
              moduleSource: "mainModule",
              moduleKey: "reading",
              content: [
                {
                  contentType: "text",
                  label: "WRITTEN COMPREHENSION CEFR LEVEL",
                  fieldKey: "overallCefr",
                  labelSize: "xl",
                  labelWeight: "bold",
                  contentSize: "xl",
                  contentWeight: "bold",
                  display: "row",
                  align: "left",
                },
                {
                  contentType: "progress",
                  fieldKey: "overallCefr",
                  progressType: "cefr",
                },
              ],
            },
            {
              moduleSource: "mainModule",
              moduleKey: "speaking",
              content: [
                {
                  contentType: "text",
                  label: "SPEAKING PROFICIENCY CEFR LEVEL",
                  fieldKey: "overallCefr",
                  labelSize: "xl",
                  labelWeight: "bold",
                  contentSize: "xl",
                  contentWeight: "bold",
                  display: "row",
                  align: "left",
                },
                {
                  contentType: "progress",
                  fieldKey: "overallCefr",
                  progressType: "cefr",
                },
              ],
            },
            {
              moduleSource: "mainModule",
              moduleKey: "writing",
              content: [
                {
                  contentType: "text",
                  label: "WRITING PROFICIENCY CEFR LEVEL",
                  fieldKey: "overallCefr",
                  labelSize: "xl",
                  labelWeight: "bold",
                  contentSize: "xl",
                  contentWeight: "bold",
                  display: "row",
                  align: "left",
                },
                {
                  contentType: "progress",
                  fieldKey: "overallCefr",
                  progressType: "cefr",
                },
              ],
            },
          ],
        },
        {
          title: "SUBSCORES BY SKILLS",
          position: 2,
          showCandidateInformation: true,
          modules: [
            {
              moduleSource: "mainModule",
              moduleKey: "grammar",
              content: [
                {
                  contentType: "text",
                  label: "POINTS TO WORK ON",
                  fieldKey: "workOn",
                  template: "{{{score | formatContent : '<br>' : ' - ' }}}",
                  labelSize: "xl",
                  labelWeight: "bold",
                  contentSize: "sm",
                  contentWeight: "bold",
                  display: "column",
                  align: "center",
                },
              ],
            },
            {
              moduleSource: "mainModule",
              moduleKey: "grammar",
              content: [
                {
                  contentType: "text",
                  label: "GRAMMAR CEFR LEVEL",
                  fieldKey: "overallCefr",
                  labelSize: "xl",
                  labelWeight: "bold",
                  contentSize: "xl",
                  contentWeight: "bold",
                  display: "row",
                  align: "left",
                },
                {
                  contentType: "progress",
                  fieldKey: "overallCefr",
                  progressType: "cefr",
                },
              ],
            },
            {
              moduleSource: "mainModule",
              moduleKey: "conversation",
              content: [
                {
                  contentType: "text",
                  label: "IN-PRACTICE SKILLS",
                  fieldKey: "",
                  template: "",
                  labelSize: "xl",
                  labelWeight: "bold",
                  contentSize: "xl",
                  contentWeight: "bold",
                  display: "column",
                  align: "center",
                },
                {
                  contentType: "text",
                  label: "CONVERSATION (LISTENING & SPEAKING) CEFR LEVEL",
                  fieldKey: "overallCefr",
                  template: "",
                  labelSize: "xl",
                  labelWeight: "bold",
                  contentSize: "xl",
                  contentWeight: "bold",
                  display: "row",
                  align: "left",
                },
                {
                  contentType: "progress",
                  fieldKey: "overallCefr",
                  progressType: "cefr",
                },
              ],
            },
            {
              moduleSource: "mainModule",
              moduleKey: "expression",
              content: [
                {
                  contentType: "text",
                  label: "EXPRESSION (SPEAKING & WRITING) CEFR LEVEL",
                  fieldKey: "overallCefr",
                  template: "",
                  labelSize: "xl",
                  labelWeight: "bold",
                  contentSize: "xl",
                  contentWeight: "bold",
                  display: "row",
                  align: "left",
                },
                {
                  contentType: "progress",
                  fieldKey: "overallCefr",
                  progressType: "cefr",
                },
              ],
            },
          ],
        },
      ],
    },
    officialCertificate: {
      generate: true,
      documentContent: {
        leftContainer: [],
        rightContainer: [
          {
            moduleSource: "mainModule",
            moduleKey: "general",
            content: [
              {
                contentType: "text",
                label: "GENERAL CEFR LEVEL",
                fieldKey: "overallCefr",
                labelSize: "lg",
                labelWeight: "bold",
                contentSize: "lg",
                contentWeight: "bold",
                display: "row",
                align: "left",
              },
              {
                contentType: "progress",
                fieldKey: "overallCefr",
                progressType: "cefr",
              },
            ],
          },
          {
            moduleSource: "mainModule",
            moduleKey: "listening",
            content: [
              {
                contentType: "text",
                label: "ORAL COMPREHENSION CEFR LEVEL",
                fieldKey: "overallCefr",
                labelSize: "lg",
                labelWeight: "bold",
                contentSize: "lg",
                contentWeight: "bold",
                display: "row",
                align: "left",
              },
              {
                contentType: "progress",
                fieldKey: "overallCefr",
                progressType: "cefr",
              },
            ],
          },
          {
            moduleSource: "mainModule",
            moduleKey: "reading",
            content: [
              {
                contentType: "text",
                label: "WRITTEN COMPREHENSION CEFR LEVEL",
                fieldKey: "overallCefr",
                labelSize: "lg",
                labelWeight: "bold",
                contentSize: "lg",
                contentWeight: "bold",
                display: "row",
                align: "left",
              },
              {
                contentType: "progress",
                fieldKey: "overallCefr",
                progressType: "cefr",
              },
            ],
          },
          {
            moduleSource: "mainModule",
            moduleKey: "speaking",
            content: [
              {
                contentType: "text",
                label: "SPEAKING PROFICIENCY CEFR LEVEL",
                fieldKey: "overallCefr",
                labelSize: "lg",
                labelWeight: "bold",
                contentSize: "lg",
                contentWeight: "bold",
                display: "row",
                align: "left",
              },
              {
                contentType: "progress",
                fieldKey: "overallCefr",
                progressType: "cefr",
              },
            ],
          },
          {
            moduleSource: "mainModule",
            moduleKey: "writing",
            content: [
              {
                contentType: "text",
                label: "WRITING PROFICIENCY CEFR LEVEL",
                fieldKey: "overallCefr",
                labelSize: "lg",
                labelWeight: "bold",
                contentSize: "lg",
                contentWeight: "bold",
                display: "row",
                align: "left",
              },
              {
                contentType: "progress",
                fieldKey: "overallCefr",
                progressType: "cefr",
              },
            ],
          },
        ],
      },
    },
    evidenceReport: {
      generate: false,
    },
  },
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
