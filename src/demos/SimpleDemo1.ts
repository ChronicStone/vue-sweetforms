import { fetchGet, GenerateLoremIpsumText } from "@/utils"
<<<<<<< Updated upstream
=======
import { sameAs, helpers, email, minLength } from "@vuelidate/validators"

>>>>>>> Stashed changes
export default [
  {
    label: "VERY BASIC NO-STEPS DEMO",
    value: {
      title: "Simple demonstration sweetforms",
      gridSize: "1 md:8",
      fieldSize: "1",
      fields: [
        {
          key: "field1",
          label: "First field",
          type: "text",
          size: "1 md:4",
        }, 
        {
          key: "fieldSelect",
          label: "First field",
          type: "select",
          options: ['Cypri', 'Test', 'Null'].map(x => ({label: 'Valeur' + x, value: x}))
        }, 
        {
          key: "field2",
          label: "Second field",
          type: "select",
          dependencies: ['field1', 'fieldSelect'],
          options: async (dependencies) => {
            console.log('OPTIONS RELOADED', dependencies.fieldSelect)
            await new Promise(resolve => setTimeout(resolve, 2500))
            return ['Cyprien THAO', 'Benoit THAO', 'Philippe MACY'].map(val => ({ label: val, value: val })).filter(({ value }) => !dependencies.field1 ? true : value.toLowerCase().includes(dependencies.field1.toLowerCase()))
          },
          // condition: (formData: any) => !!formData.field1
        },
        {
          key: "testField1",
          label: "Test field",
          type: "number",
        },
        {
          key: "testField",
          label: "Test field",
          type: "text",
        },
        {
          key: "field3",
          label: "Field textarera",
          type: "textarea",
          dependencies: ['field2'],
          condition: ({ field2 }: any) => !!field2,
        },
        {
          key: "field3",
          label: "Field textarera",
          type: "textarea",
          condition: ({ field2 }: any) => !!field2,
        },
        {
          key: "bottomSelect",
          label: "Bottom select",
          type: "select",
          options: Array.from({ length: 128 }, (_, i) => ({ label: `Option ${i}`, value: i })),
        }
      ],
      onCancel: () => console.log('FORM CANCELLED'),
      onSubmit: (formData: any) => console.log({ formData }),
    }
  },
  {
    label: "Radio / date / time inputs",
    value: {
      title: "TEST WITH MORE INPUTS",
      gridSize: 12,
      fields: [
        {
          key: "dateTest",
          label: "Date field",
          type: "date",
          size: 6,
        },
        {
          key: "timeTest",
          label: "Time field",
          type: "time",
          size: 6,
        },
        {
          key: "dateTimeRange",
          label: "DateTime range",
          type: "datetimerange",
          size: 12,
        },
        {
          key: "dateTimeRange",
          label: "DateTime range",
          type: "datetimerange",
          size: 12,
        },
        {
          key: "dateTimeRange",
          label: "DateTime range",
          type: "datetimerange",
          size: 12,
        },
        {
          key: "dateTimeRange",
          label: "DateTime range",
          type: "datetimerange",
          size: 12,
        },
        {
          key: "radio",
          label: "TEST RADIO GRP",
          type: "radio",
          size: 12,
          options: ['Cyprien THAO', 'Benoit THAO', 'Philippe MACY', 'Cyprien THAO', 'Benoit THAO', 'Philippe MACY', 'Cyprien THAO', 'Benoit THAO', 'Philippe MACY'].map(val => ({ label: val, value: val })), 
          fieldParams: {
            gridSize: 6
          }
        }
      ]
    }
  },
  {
    label: "Dependency with select source async",
    value: {
      title: "Demonstration",
      gridSize: 6,
      steps: [
        {
          title: "Step 1",
          fields: [
            { key: "firstName", type: "text", label: "First name", placeholder: "John", size: 2, description: Array.from({ length: 10 }, () => GenerateLoremIpsumText()).join(' ') },
            { key: "lastName", type: "text", label: "Last name", placeholder: "Doe", size: 2 },
            { key: "email", type: "text", label: "Email address", placeholder: "john.doe@gmail.com", size: 2 },
            { key: "dogBreed", type: "select", label: "Dog breed", placeholder: "Select a breed", options: async () => await fetchGet('https://dog.ceo/api/breeds/list/all').then(response => Object.keys(response.message).map(item => ({ label: item, value: item }))).catch(_ => []), size: 3 },
            { key: "dogSubBreed", type: "select", label: "Dog sub-breed", placeholder: "Select a sub-breed", dependencies: ['dogBreed'], options: async ({ dogBreed }) => !dogBreed ? [] : await fetchGet(`https://dog.ceo/api/breed/${dogBreed}/list`).then(response => response.message.map(item => ({ label: item, value: item }))).catch(err => []), size: 3 }     
          ]
        },
        {
          title: "Step 2",
          fields: [
            { key: "testStep2", type: "text", label: "Dog name", placeholder: "John", size: 6 },
            { key: "testObj", type: "object", label: "Test object", size: 6, gridSize: 3, fields: [
                { key: "testObj1", type: "text",  label: "Test object 1", },
                { key: "testObj2", type: "object", label: "Test object 2", gridSize: 6, fields: [
                    { label: "Test object 2.1", key: "testObj2Child", type: "text", size: 3  }
                  ]
                },
              ]
            }
          ]
        }
      ]
    }
  },
  {
    label: "Array fields demo",
    gridSize: 12,
    value: {
      title: "Array field demo",
      fields: [
        {
          key: "arrayField",
          label: "Array field",
          type: "array",
<<<<<<< Updated upstream
          size: 12,
          gridSize: 6,
          headerTemplate: (item: any, index: number) => `<div class="font-bold">${index} - ${item.arrayField2}</div>`,
          fields: [
            { key: "arrayField1", type: "number", label: "Array field 1", size: 3 },
            { key: "arrayField2", type: "text", label: "Array field 2", size: 3 },
            { key: "arrayField3", type: "slider", label: "Array field 3", size: 6 },
            { key: "testObj2", type: "object", label: "Test object 2", size: 6, gridSize: 6, fields: [
                { label: "Test object 2.1", key: "testObj2Child", type: "text", size: 3  },
                { label: "Test object 2.1", key: "testObj2Child2", type: "text", size: 3  }
              ]
            },
          ]
=======
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
>>>>>>> Stashed changes
        }
      ],
    }
<<<<<<< Updated upstream
=======
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
            { type: "select", key: "type", label: "Module type", required: true, options: ['Composite', 'External', 'Async'].map(item => ({ label: item, value: item.toLowerCase()})) },
            { type: "slider", key: "Score overall scale", label: "Description", required: true, fieldParams: { gap: 0.5}, size: "8 lg:9", required: true },
          ],
        }
      ]
    }
          
>>>>>>> Stashed changes
  }
]