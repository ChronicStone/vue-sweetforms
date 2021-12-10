import { fetchGet, GenerateLoremIpsumText } from "@/utils"
export default [
  {
    label: "VERY BASIC NO-STEPS DEMO",
    value: {
      title: "Simple demonstration sweetforms",
      gridSize:  6,
      fields: [
        {
          key: "field1",
          label: "First field",
          type: "text",
          size: 3
        }, 
        {
          key: "fieldSelect",
          label: "First field",
          type: "select",
          size: 3,
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
          size: 3
          // condition: (formData: any) => !!formData.field1
        },
        {
          key: "testField1",
          label: "Test field",
          type: "number",
          size: 2
        },
        {
          key: "testField",
          label: "Test field",
          type: "text",
          size: 4
        },
        {
          key: "field3",
          label: "Field textarera",
          type: "textarea",
          dependencies: ['field2'],
          condition: ({ field2 }: any) => !!field2,
          size: 6
        },
        {
          key: "field3",
          label: "Field textarera",
          type: "textarea",
          condition: ({ field2 }: any) => !!field2,
          size: 6
        },
        {
          key: "bottomSelect",
          label: "Bottom select",
          type: "select",
          options: Array.from({ length: 128 }, (_, i) => ({ label: `Option ${i}`, value: i })),
          size: 6
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
      onSubmit: (formData) => alert(JSON.stringify(formData)),
      onCancel: () => alert('CANCELLED'),
      gridSize: 6,
      fields: [
        { key: "firstName", type: "text", label: "First name", placeholder: "John", size: 2, description: Array.from({ length: 10 }, () => GenerateLoremIpsumText()).join(' ') },
        { key: "lastName", type: "text", label: "Last name", placeholder: "Doe", size: 2 },
        { key: "email", type: "text", label: "Email address", placeholder: "john.doe@gmail.com", size: 2 },
        { key: "dogBreed", type: "select", label: "Dog breed", placeholder: "Select a breed", options: async () => await fetchGet('https://dog.ceo/api/breeds/list/all').then(response => Object.keys(response.message).map(item => ({ label: item, value: item }))).catch(_ => []), size: 3 },
        { key: "dogSubBreed", type: "select", label: "Dog sub-breed", placeholder: "Select a sub-breed", dependencies: ['dogBreed'], options: async ({ dogBreed }) => !dogBreed ? [] : await fetchGet(`https://dog.ceo/api/breed/${dogBreed}/list`).then(response => response.message.map(item => ({ label: item, value: item }))).catch(err => []), size: 3 }     
      ]
    }
  }
]