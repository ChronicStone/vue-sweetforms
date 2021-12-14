---
description: ''
sidebar: 'docs'
prev: '/docs/'
next: '/docs/writing-content/'  
---

# Installation

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


4. Wrap your app with the FormProvider component :

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

5. Use sweetforms API anywhere in your app :

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