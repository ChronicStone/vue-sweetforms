---
description: ''
sidebar: 'docs'
prev: '/docs/'
next: '/docs/writing-content/'  
---

# Install & use

## Package installation

1. Install the package :

```bash
npm i -g @chronicstone/vue-sweetforms
```


2. If you need validation in your forms, install [Vuelidate](https://vuelidate-next.netlify.app/) validators :

```bash
npm i -g @vuelidate/validators
```


3. Import the styles in your app entry point :

```javascript
// main.js
import 'vue-sweetforms/dist/style.css'
```

## Instanciate the FormProvider


The FormProvider component needs to be instanciated at the root of your application. Without it, you won't be able to use the createForm method provided by the useSweetform hook.

```javascript
<script setup>
import { FormProvider } from "@chronicstone/vue-sweetforms"
</script>

<template>
    <FormProvider>
        <!-- YOUR APP CONTENT -->
        <router-view/>
    </FormProvider>
</template>
```

## Start using sweetforms

Once everything is setup, you can use the useSweetform hook to get access to the createForm method, and generate forms at will. 

Sweetforms is promise-based, so you'll just need to await the output (or use the then / catch syntax) of the createForm method to get the completed status, and the form data. Use it just like a regular function, and sweetforms will take care of mounting / unmounting the UI and all the logic behind for you.

```javascript
<script setup>
    import { useSweetform } from "vue-sweetforms"
    import axios from "axios"
    
      
    const { createForm } = useSweetform()
    
    
    const OpenForm = async () => {
      const { isCompleted, formData } = await createForm({
        title: "Demonstration",
        gridSize: "8",
        fieldSize: "8 md:4"
        fields: [
          { key: "firstName", type: "text", label: "First name", placeholder: "John", required: true },
          { key: "lastName", type: "text", label: "Last name", placeholder: "Doe", required: true },
          { key: "email", type: "text", label: "Email address", placeholder: "john.doe@gmail.com", size: 8, required: true },
        ]
      })
    }
</script>

<template>
  <button @click="OpenForm">OPEN FORM</button>
</template>
```