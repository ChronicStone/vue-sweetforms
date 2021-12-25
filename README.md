<h1 align="center">
  <a><img src="https://github.com/ChronicStone/sweetforms/blob/main/logo_sweetforms.svg" alt="Vue SweetForms" width="200"></a>
</h1>

<h4 align="center">A Vue 3 package based on  <a href="https://github.com/TuSimple/naive-ui" target="_blank">Naive UI</a> that provides highly customizable promised-based popup forms, with features like form advanced validation, optional http request handling, multiple-steps, and many more !</h4>

<p align="center">
  <a href="https://badge.fury.io/js/@chronicstone%2Fvue-sweetforms"><img src="https://badge.fury.io/js/@chronicstone%2Fvue-sweetforms.svg" alt="npm version" height="18"></a>
</p>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#documentation-and-live-examples">Documentation & Live Examples</a> •
  <a href="#improvements-roadmap">Improvements roadmap</a> •
  <a href="#credits">Credits</a>
</p>

## Key Features

- 📝 Schema-based form definition

- 🔀 Supports function-based and component-based usage

- 📐 Auto grid-based templating, with breakpoint-based responsiveness control (Tailwind-like API)

- ✏️ Any type of field supported A lot of field types supported (`text` | `textarea` | `password` | `number` | `slider` | `switch` | `select` | `radio` | `checkbox` | `checkboxGroup` | `date` | `time` | `datetime` | `datetimerange` | `daterange` | `month` | `year` | `file` | `array` | `object` | `customComponent`)

- 📁 Supports deeply nested data structures (objects & arrays)

- 🔗 Advanced cross-fields dependency system (conditional rendering, validation, field options, ...)

- ✔️ Advanced validation based on [Vuelidate](https://vuelidate-next.netlify.app/)

- 🌙 Dark/Light mode

- 🎨 Highly customizable design

- ⚙️ Supports multiple steps forms

- ➕ And many more !


## Documentation and live examples

- DOCUMENTATION : https://sweetforms.netlify.app/
- LIVE EXAMPLES : https://sweetforms-demo.netlify.app/


## How To Use

#### 1. Install the package
```bash
npm i -s @chronicstone/vue-sweetforms
```

#### 2. Import styles in main.js
```js
import "vue-sweetforms/dist/style.css"
```


#### 3. Wrap your app with the FormProvider component
```vue
// App.vue

<script setup>
  import { FormProvider } from "vue-sweetforms"
</script>

<template>
  <FormProvider>
    <!-- Your app content here -->
    <router-view/>
  </FormProvider
</template>
```

#### 4. Use the form API anywhere in your app :
```vue
<script setup>
  import { useSweetform } from "vue-sweetforms"
  import axios from "axios"
  
  const GetDogBreeds =  async () => await axios.get('https://dog.ceo/api/breeds/list/all').then(response => Object.keys(response.data.message).map(item => ({ label: item, value: item }))).catch(_ => [])
  
  const GetSubbreedByBreed = async ({ dogBreed }) => !dogBreed ? [] : await axios.get(`https://dog.ceo/api/breed/${dogBreed}/list`).then(response => response.data.message.map(item => ({ label: item, value: item }))).catch(err => [])
  
  const { createForm } = useSweetform()
  
  
  const OpenForm = async () => {
    const { isCompleted, formData } = await createForm({
      title: "Demonstration",
      gridSize: 6,
      fields: [
        { key: "firstName", type: "text", label: "First name", placeholder: "John", size: 2 },
        { key: "lastName", type: "text", label: "Last name", placeholder: "Doe", size: 2 },
        { key: "email", type: "text", label: "Email address", placeholder: "john.doe@gmail.com", size: 2 },
        { key: "dogBreed", type: "select", label: "Dog breed", placeholder: "Select a breed", options: GetDogBreeds, size: 3 },
        { key: "dogSubBreed", type: "select", label: "Dog sub-breed", placeholder: "Select a sub-breed", dependencies: ['dogBreed'], options: GetSubbreedByBreed, size: 3 }     
      ]
    })
  }
</script>

<template>
  <button @click="OpenForm">OPEN FORM</button>
</template>
```
## Improvements roadmap

- [ ] Improve / complete documentation
- [ ] Migrate documentation to [VitePress](https://vitepress.vuejs.org/) or  [IlesJs](https://github.com/ElMassimo/iles)
- [ ] Integrate documentation examples to docs app (w/ Vitepress or IlesJs)
- [ ] Make Sweetform work as standalone component (If user don't want to use the function-based API)
- [ ] Make optimizations to improve performance
- [ ] Add full WAI-ARIA support
- [ ] Improve styles customization API

Any PR is gladly welcomed and will be greatly appreciated.

## Credits

This packages uses [Naive UI](https://github.com/TuSimple/naive-ui) component library internally to render most field types. Particular thanks to [@TuSimple](https://github.com/TuSimple) who was of a big help in how to immplement the underlying concepts behin


MIT

---

> GitHub [@ChronicStone](https://github.com/ChronicStone) &nbsp;&middot;&nbsp;
