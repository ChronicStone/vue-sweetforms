---
description: ''
sidebar: 'docs'
prev: '/usage/fields/'
next: '/usage/dependencies/'  
---

# Form steps

Sweetforms comes with a very simple yet powerful way to handle steps. On your form schema, just define a steps attribute and add your steps to it.

## Steps definition

- **title**:
    - type: `STRING`,
    - required: `YES`,
    - default:
    - description: `The title of the step, displayed at the top of the popup.`

- **gridSize**:
    - type: `NUMBER` | `STRING`,
    - required: `NO`,
    - default: `1 md:2 lg:4 xl:8`,
    - description: The default number of columns that the grid will have on the step. Can be overridden at field level. Uses a breakpoints system to handle the different screen sizes. See [Breakpoints documentation](/docs/usage/breakpoints) for more information.

- **fieldSize**:
    - type: `NUMBER` | `STRING`,
    - required: `NO`,
    - default: `1 md:1 lg:2 xl:4`,
    - description: The default number of columns that the field will take on the step. Can be overridden at field level. Uses a breakpoints system to handle the different screen sizes. See [Breakpoints documentation](/docs/usage/breakpoints) for more information.

- **fields**:
    - type: `ARRAY`,
    - required: `YES`,
    - default: `[]`,
    - description: An array of field that needs to be rendered on your step.


## Basic example


```js
<script setup>
    import { useSweetform } from "@chronicstone/vue-sweetforms";
    const { createForm } = useSweetform()
    const GetCountries = async () => axios.get('https://countriesnow.space/api/v0.1/countries/iso').then(response => response.data.data.map(item => ({ label: item.name, value: item.iso })));

    const OpenForm = async () => {
      const { isCompleted, formData } = await createForm({
        steps: [
          {
            title: 'User information',
            fields: [
              { key: 'firstName', label: 'First name', type: 'text', required: true },
              { key: 'lastName', label: 'Last name', type: 'text', required: true },
            ],
          },
          {
            title: 'Shipping address',
            fields: [
              { key: 'address', label: 'Address', type: 'text' },
              { key: 'city', label: 'City', type: 'text' },
              { key: 'zipCode', label: 'ZIP code', type: 'text' },
              { key: 'country', label: 'Country', type: 'select', options: GetCountries, required: true},
            ],
          },
        ],
      });
    };
</script>
```

<iframe style="width: 100%;min-height: 700px;" src="https://stackblitz.com/edit/vue-nbiwhg?embed=1&file=src/components/MultiStepsDemo.vue&hideExplorer=1&theme=dark&view=preview"></iframe>