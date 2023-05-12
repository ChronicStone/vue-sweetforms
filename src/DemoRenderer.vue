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
import { onMounted, reactive, ref } from "vue";
import { NCard, NButton, useThemeVars, NSwitch, NTag } from "naive-ui";
import { useSweetform, Form } from "./index";
import * as AllDemos from "@/demos/";
import { contentItem } from "./slotRender";
import { ExamConfig } from "./exam";
const formApi = useSweetform();
const OpenForm = async (formContent: any, inputData: any) => {
  const data = await formApi.createForm(formContent, inputData);
  console.log(JSON.stringify(data, null, 4));
};

onMounted(() => {
  console.log(formApi)
});

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
      },
    ],
    specificModule: {
      active: false,
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
