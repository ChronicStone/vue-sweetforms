import { fetchGet, GenerateLoremIpsumText } from "@/utils"
import { sameAs, helpers, email, minLength, maxLength } from "@vuelidate/validators"
import { NTag } from "naive-ui"
import TestComp from "../TestComp.vue"
import component from '../env';
export default [
  {
    label: "Test array",
    value: {
      title: "My form as component",
  fields: [
    {
      key: "testArray",
      type: 'array',
      size: 8,
      gridSize: "8",
      fieldSize: "8 md:4",
      fields: [
        { key: 'test', type: 'text' },
        { key: 'test2', type: 'text', dependencies: ['$parent', 'testArray'], condition: (dependencies) => {
          console.log(dependencies)
          return dependencies.$parent.test === 'test'
        } },
      ]
    }
  ]
    }
  },
  {
    label: 'Field types example',
    value: {
      title: "Demo of field types",
      gridSize: "8",
      fieldSize: "8 md:4",
      fullScreen: true,
      fields: [
        {
          key: "text",
          label: "Text",
          type: "text",
          required: true,
          placeholder: "Your placeholder"
        },
        {
          key: "textarea",
          label: "Textarea",
          type: "textarea",
          required: true
        },
        {
          key: "number",
          label: "Number",
          type: "number",
          required: true
        },
        {
          key: "password",
          label: "Password",
          type: "password",
        },
        {
          key: "slider",
          label: "Slider",
          type: "slider",
          required: true,
          fieldParams: {
            min: 175, max: 252, step: 1
          }
        },
        {
          type: "select",
          key: "select",
          label: "Select",
          options: () => Array.from({ length: 49 }, (_, i) => ({ label: `Option ${i + 1}`, value: i + 1 })),
        },
        {
          type: "radio",
          key: "radio",
          label: "Radio",
          options: () => Array.from({ length: 12 }, (_, i) => ({ label: `Option ${i + 1}`, value: i + 1 })),
          size: 8
        },
        {
          type: "checkbox",
          key: "checkbox",
          label: "Checkbox",
          size: 8,
        },
        {
          type: "checkbox-group",
          key: "checkbox-group",
          label: "Checkbox group",
          gridSize: "3",
          size: "8",
          options: () => Array.from({ length: 12 }, (_, i) => ({ label: `Option ${i + 1}`, value: i + 1 })),
        },
        {
          type: "date",
          key: "date",
          label: "Date",
        },
        {
          key: "time",
          label: "Time",
          type: "time",
        },
        {
          key: "datetime",
          label: "Date time",
          type: "datetime",
        },
        {
          key: "datetimeRange",
          label: "Date time range",
          type: "datetimerange",
        },
        {
          key: "object",
          label: "Object",
          type: "object",
          required: true,
          gridSize: "8",
          size: "8",
          fields: [
            {
              key: "string",
              label: "String",
              type: "text",
              size: "8 md:4",
              required: true
            },
            {
              key: "number",
              label: "Number",
              type: "text",
              size: "8 md:4",
              required: true
            },
            {
              key: "slider",
              label: "Slider",
              type: "slider",
              size: "8",
              required: true
            }
          ]
        },
        {
          key: "array",
          label: "Array",
          type: "array",
          size: "8",
          fields: [
            {
              key: "string",
              label: "String",
              type: "text",
              size: "8 md:4",
              required: true
            },
            {
              key: "number",
              label: "Number",
              type: "text",
              size: "8 md:4",
              required: true
            },
            {
              key: "slider",
              label: "Slider",
              type: "slider",
              size: "8",
              required: true
            }
          ]
        }
      ]
    }

  },
  {
    label: "Multi-steps form example",
    value: {
      gridSize: 8,
      fieldSize: 8,
      fullScreen: "true md:false",
      steps: [
        {
          title: "Step 1",
          fields: [
            {
              key: "text",
              label: "Text",
              type: "textarea",
              required: true
            }
          ]
        },
        {
          title: "Step 2",
          fields: [
            {
              key: "tedzqqdzxt",
              label: "Text",
              type: "textarea",
              required: true
            }
          ]
        },
        {
          title: "Step 3",
          fields: [
            {
              key: "texdqzt",
              label: "Text",
              type: "textarea",
              required: true
            }
          ]
        },
        {
          title: "Step 4",
          fields: [
            {
              key: "text2",
              label: "Text",
              type: "textarea",
              required: true
            }
          ]
        }
      ]
    }
  },
  {
    label: "Fields with description",
    value: {
      title: "Click icon to open description",
      gridSize: 8,
      fieldSize: "8 md:4",
      fields: [
        {
          key: "descr1",
          label: "Text",
          type: "text",
          required: true,
          description: "This is a simple description"
        },
        {
          key: "descr2",
          label: "Description with title",
          type: "textarea",
          required: true,
          description: {
            title: "Description title",
            content: "This is a description with a title"
          }
        },
        {
          key: "descr2",
          label: "Description with html",
          type: "textarea",
          required: true,
          description: {
            title: "Description title",
            content: "This is a <b style='color: red;'>description</b> with a HTML content rendered"
          }
        },
        {
          key: "descr2",
          label: () => <div>Description with <NTag>custom content</NTag></div>,
          type: "textarea",
          required: true,
          description: {
            // title: "Description title",
            content: () => <div>This is a <b style={{ color: 'red' }}>description</b> with a HTML content rendered<TestComp /></div>
          }
        },
      ]
    }
  },
  {
    label: "Field dependencies",
    value: {
      title: "Field dependencies + async options fetch",
      gridSize: "8",
      fieldSize: "8",
      fields: [
        {
          key: "dogBreed",
          type: "select",
          label: "Dog breed",
          placeholder: "Select a breed",
          options: async () => await fetchGet('https://dog.ceo/api/breeds/list/all').then(response => Object.keys(response.message).map(item => ({ label: item, value: item }))).catch(_ => [])
        },
        {
          key: "dogSubBreed",
          type: "select",
          label: "Dog sub-breed",
          placeholder: "Select a sub-breed",
          description: "This field depends on dogBreed. When DogBreen changes, the async function will be re-executed to get the updated options.",
          dependencies: ['dogBreed'],
          options: async ({ dogBreed }) => !dogBreed ? [] : await fetchGet(`https://dog.ceo/api/breed/${dogBreed}/list`).then(response => response.message.map(item => ({ label: item, value: item }))).catch(err => [])
        },
        {
          label: "Dependencies works also with objects",
          type: "object",
          key: "objectDemo",
          fields: [
            {
              label: "Test repro err",
              type: "select",
              options: [{ label: 'dog', value: 'dog' }, { label: 'cat', value: 'cat' }],
              key: "testReproErr",
              condition: ({ dogBreed }) => dogBreed === 'african',
              dependencies: ['dogBreed'],
            },
            {
              key: "objectFieldd",
              label: "Set me to a value",
              type: "select",
              options: () => [{ label: 'dog', value: 'dog' }, { label: 'cat', value: 'cat' }],
            }
          ]
        },
        {
          label: "Test object",
          key: "objectTest",
          type: "object",
          fields: [
            { label: "Field 1", key: "field1", type: "text" },
            { label: "Field 2", key: "field2", type: "text" },
            {
              type: "array",
              key: "arrayOfObj",
              label: "Array of obj",
              fields: [
                {
                  dependencies: ['objectDemo.testReproErr'],
                  key: "objField",
                  label: "Set me to 'dog'",
                  type: "select",
                  options: () => [{ label: 'dog', value: 'dog' }, { label: 'cat', value: 'cat' }],
                  condition: (dependencies: any) => {
                    console.log({ dependencies })
                    return dependencies['objectDemo.testReproErr'] === 'dog'
                  }
                }
              ]
            }
          ]
        }
        // {
        //   type: "text",
        //   key: "text",
        //   label: "Text",
        //   // dependencies: ['object.objectField'],
        //   condition: ({ 'object.objectField': objectField }) => objectField === 'dog'
        // }
      ]
    }
  },
  {
    label: "Simple array",
    value: {
      title: "Simple array",
      gridSize: 8,
      fieldSize: 8,
      fields: [
        {
          key: "array",
          label: "Array",
          required: true,
          validators: () => ({
            minLength: minLength(4),
            // sameAs: helpers.withMessage('Not the same', sameAs('MyValue'))
          }),
          fields: [
            {
              type: "text",
              key: "innerField",
              label: "Inner field",
              required: true
            }
          ],
        }
      ],
    }
  },
  {
    label: "Simple cross-field validation (Password & Password Confirm)",
    description: "This example shows how to validate a field based on another field. 'password' is set as a depencency of 'passwordConfirm'. Then, the field passwordConfirm have a 'validators' function that returns an object of Vuelidate validators. The parameter of this 'validators' function is the object containing the dependencies of the field",
    value: {
      title: "Password & password confirmation",
      gridSize: 8,
      fieldSize: "8 md:4",
      fields: [
        {
          key: "email",
          label: "Email address",
          type: "password",
          required: true,
          validators: { email },
          size: 8
        },
        {
          key: "password",
          label: "Password",
          type: "password",
          required: true
        },
        {
          key: "passwordConfirmation",
          label: "Password confirmation",
          type: "password",
          dependencies: ['password'],
          required: true,
          validators: (dependencies: any) => ({
            sameAsPassword: helpers.withMessage('The password and the confirmation does not match', sameAs(dependencies.password))
          })
        }
      ]
    }
  },
  {
    label: "Complex nested form example",
    value: {
      title: "Exam configuration",
      gridSize: 8,
      fieldSize: "8",
      fields: [
        {
          type: "array",
          label: "Main section",
          key: "mainModules",
          headerTemplate: (value, index) => `${index + 1}. ${value?.key ?? 'ENTER A MODULE KEY'}`,
          gridSize: "8",
          fieldSize: "8 md:4",
          fields: [
            { type: "text", key: "key", label: "Module key", required: true, },
            { type: "select", key: "type", label: "Module type", required: true, options: ['Composite', 'External', 'Async'].map(item => ({ label: item, value: item.toLowerCase() })) },
            { type: "slider", key: "Score overall scale", label: "Description", required: true, fieldParams: { gap: 0.5 }, size: "8 lg:9" },
          ],
        }
      ]
    }
  },
  {
    label: "Simple cross-field validation (Password & Password Confirm)",
    description: "This example shows how to validate a field based on another field. 'password' is set as a depencency of 'passwordConfirm'. Then, the field passwordConfirm have a 'validators' function that returns an object of Vuelidate validators. The parameter of this 'validators' function is the object containing the dependencies of the field",
    value: {
      title: "Password & password confirmation",
      gridSize: 8,
      fieldSize: "8 md:4",
      fields: [
        {
          key: "email",
          label: "Email address",
          type: "password",
          required: true,
          validators: { email },
          size: 8
        },
        {
          key: "password",
          label: "Password",
          type: "password",
          required: true
        },
        {
          key: "passwordConfirmation",
          label: "Password confirmation",
          type: "password",
          dependencies: ['password'],
          required: true,
          validators: (dependencies: any) => ({
            sameAsPassword: helpers.withMessage('The password and the confirmation does not match', sameAs(dependencies.password))
          })
        }
      ]
    }
  },
  {
    label: "Simple deps",
    value: {
      title: 'basic dependency',
      fields: [
        {
          key: 'displayName',
          label: 'Check to display other field',
          type: 'checkbox',
          required: true,
        },
        {
          key: 'name',
          label: 'Displayed if checkbox is checked',
          type: 'text',
          required: true,
          dependencies: ['displayName'],
          condition: (dependencies) => dependencies.displayName,
        },
      ]
    }
  },
  {
    label: "Test custom component",
    value: {
      title: "Test custom component",
      fields: [
        ...Array.from({ length: 100 }, (v, i) => ({
          type: "custom-component",
          key: "testCustomComp" + i,
          component: TestComp,
          label: "Test custom" + i,
          required: true
        }))
      ]
    }
  },
  {
    label: "Array limit",
    value: {
      title: "Array limit",
      gridSize: 8,
      fieldSize: 8,
      fields: [
        { type: "slider", key: "maxItemsInArray", label: "Max items in array", required: true, fieldParams: { gap: 1, min: 1, max: 10 }, size: "8" },
        {
          type: "array",
          label: "Array",
          key: "array",
          fields: [
            { type: "text", key: "innerField", label: "Inner field", required: true },
          ],
          required: true,
          dependencies: ['maxItemsInArray'],
          validators: (dependencies: any) => ({
            maxItemsInArray: helpers.withMessage('The array can not have more than ' + dependencies.maxItemsInArray + ' items', maxLength(dependencies.maxItemsInArray))
          })
        }
      ]
    }
  },
  {
    label: "Checkbox limit",
    value: {
      title: "Array limit",
      gridSize: 8,
      fieldSize: 8,
      fields: [
        { type: "slider", key: "maxItemsInArray", label: "Max items in array", required: true, fieldParams: { gap: 1, min: 1, max: 10 }, size: "8" },
        {
          type: "checkbox-group",
          label: "Array",
          key: "array",
          options: Array.from({ length: 32 }, (v, i) => ({ label: "Option " + i, value: i })),
          required: true,
          dependencies: ['maxItemsInArray'],
          validators: (dependencies: any) => ({
            maxItemsInArray: helpers.withMessage('The array can not have more than ' + (dependencies?.maxItemsInArray ?? 0) + ' items', maxLength(dependencies?.maxItemsInArray ?? 0))
          })
        }
      ]
    }
  },
  {
    label: "Input data",
    inputData: {
      firstName: "John",
      lastName: "Doe",
      address: {
        street: "1 Main St",
        city: "New York",
        state: "NY",
        // zip: "10001"
      }
    },
    value: {
      title: "Input data",
      fields: [
        { key: "firstName", label: "First name", type: "text" },
        { key: "lastName", label: "Last name", type: "text" },
        {
          key: "address",
          label: "Address",
          type: "object",
          fields: [
            { key: "street", label: "Street", type: "text", },
            { key: "city", label: "City", type: "text" },
            { key: "state", label: "State", type: "text" },
            { key: "zip", label: "Zip", type: "text", default: "Hahaha" }
          ]
        }
      ]
    }
  },
  {
    label: "Create form test",
    value: {
      gridSize: '1',
      fieldSize: '1',
      steps: [
        {
          title: 'General config',
          root: 'general',
          fields: [
            { type: 'text', key: 'examLogo', label: 'Exam logo', required: false, placeholder: 'Select a timezone' },
            {
              type: 'object',
              key: 'locales',
              label: 'Candidate app language',
              required: false,
              gridSize: '2',
              fieldSize: '2 md:1',
              fields: [
                { type: 'select', key: 'default', label: 'Default language', required: false, options: [] },
                { type: 'select', key: 'options', label: 'Authorized languages', required: false, options: [] }
              ]
            },
            {
              type: 'object',
              key: 'accessibilityWindow',
              label: 'Time restriction',
              required: false,
              // gridSize: '2',
              // fieldSize: '2 md:1',
              fieldParams: {
                frameless: true
              },
              fields: [
                { type: 'checkbox', key: 'enable', label: 'Enable time restriction', required: false },
                {
                  type: 'select',
                  key: 'timezone',
                  label: 'Time zone',
                  required: true,
                  options: [],
                  dependencies: ['general.accessibilityWindow.enable'],
                  condition: ({ 'general.accessibilityWindow.enable': enable }: { 'general.accessibilityWindow.enable': boolean }) => !!enable
                },
                {
                  type: 'datetime',
                  key: 'startDateTime',
                  label: 'Start date',
                  required: true,
                  fieldParams: { format: null },
                  dependencies: ['general.accessibilityWindow.enable'],
                  condition: ({ 'general.accessibilityWindow.enable': enable }: { 'general.accessibilityWindow.enable': boolean }) => {
                    console.log({ enable })
                    return enable
                  }
                },
                {
                  type: 'datetime',
                  key: 'endDateTime',
                  label: 'End date',
                  required: true,
                  fieldParams: { format: null },
                  dependencies: ['general.accessibilityWindow.enable'],
                  condition: ({ 'general.accessibilityWindow.enable': enable }: { 'general.accessibilityWindow.enable': boolean }) => !!enable
                }
              ]
            }
          ]
        },
        {
          title: 'Emails config',
          fields: []
        }
      ]
    }
  },
  {
    label: "Create form test 2",
    value: {
      title: 'CREATE EXAM',
      maxWidth: '500px',
      gridSize: 1,
      fieldSize: 1,
      fullScreen: false,
      fields: [
        { key: 'test_name', label: 'Exam name', type: 'text', required: true },
        { key: 'short_label', label: 'Exam short label', type: 'text', required: true, validators: { maxLength: helpers.withMessage('The short label must not exceed 35 characters', maxLength(35)) } },
        {
          key: 'pages',
          label: 'START PAGES',
          type: 'object',
          size: '8',
          collapsed: true,
          fields: ['welcome', 'instructions'].map(page => ({
              key: page,
              label: `${page.charAt(0).toUpperCase() + page.slice(1)} page`,
              type: 'object',
              fields: [
                  { key: 'title', type: 'text', label: 'Title', size: '8', required: true },
                  { key: 'description', type: 'text', label: 'Subtitle', size: '8', required: false },
                  { key: 'content', type: 'textarea', size: '8', label: 'Content', required: true },
                  {
                      type: 'info',
                      dependencies: [`pages.${page}`],
                      content: (dependencies) => (
                          <div>
                              <div class="flex flex-col gap-2">
                                  <div class="text-center text-xl font-bold text-primary">{dependencies[`pages.${page}`]?.title}</div>
                                  <div class="text-center text-lg font-bold">{dependencies[`pages.${page}`]?.description}</div>
                                  <div v-html={dependencies[`pages.${page}`]?.content}></div>
                              </div>
                          </div>
                      )
                  }
              ]
          }))
        }
      ]
    }
  },
  {
    label: "Input data arr test",
    inputData: {
      test: [
        { firstName: 'cyp', lastName: 'thao', dzqdzq: 'test'},
        { firstName: 'cdqzqdzyp', lastName: 'thao', dzqdzq: 'test'},
        { firstName: 'ddd', lastName: 'thao', dzqdzq: 'test'},
        { firstName: 'caaaaaayp', lastName: 'thao', dzqdzq: 'test'}
      ]
    },
    value: {
      title: "test arr input",
      gridSize: '8',
      fieldSize: '8',
      fields: [
        { key: 'test', type: 'array', label: 'test', extraProperties: true, fields: [
          { key: "firstName", label: "First name", type: "text" },
        ]}
      ]
    }
  }
]