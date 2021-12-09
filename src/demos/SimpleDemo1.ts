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
          key: "field2",
          label: "Second field",
          type: "select",
          dependencies: ['field1'],
          options: async (dependencies) => {
            console.log('OPTIONS RELOADED', dependencies)
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
  }
]