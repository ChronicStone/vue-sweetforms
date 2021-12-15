import { fetchGet, GenerateLoremIpsumText } from "@/utils"
import { sameAs, helpers, email, minLength } from "@vuelidate/validators"

export default [
  {
    label: 'Field types example',
    value: {
      title: "Demo of field types",
      gridSize: "8",
      fieldSize: "8 md:4",
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
          options: () => Array.from({ length: 49}, (_, i) => ({ label: `Option ${i + 1}`, value: i + 1 })),
        },
        {
          type: "radio",
          key: "radio",
          label: "Radio",
          options: () => Array.from({ length: 12}, (_, i) => ({ label: `Option ${i + 1}`, value: i + 1 })),
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
          options: () => Array.from({ length: 12}, (_, i) => ({ label: `Option ${i + 1}`, value: i + 1 })),
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
            { type: "select", key: "type", label: "Module type", required: true, options: ['Composite', 'External', 'Async'].map(item => ({ label: item, value: item.toLowerCase()})) },
            { type: "slider", key: "Score overall scale", label: "Description", required: true, fieldParams: { gap: 0.5}, size: "8 lg:9" },
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
  }
]