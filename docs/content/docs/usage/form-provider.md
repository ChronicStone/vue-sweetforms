---
description: ''
sidebar: 'docs'
next: '/usage'
---

# Form provider

The FormProvider component must be instanciated at the root of your application, which means you must wrap your Vue app with it like this :

```javascript
<script setup>
import { FormProvider } from "@chronicstone/vue-sweetforms"
</script>

<template>
    <FormProvider>
        <!-- YOUR APP CONTENT (ex: the Router view) -->
        <router-view/>
    </FormProvider>
</template>
```

It can also be used to override some default behaviours of Sweeforms, like defining your own set of breakpoints, enabling / disabling dark mode, and overriding default styles.

## Component props

- **darkMode**:
    - Type: `BOOLEAN`
    - Required: NO,
    - Default : `false`
    - Description: Enable / disable dark mode

- **breakpoints**:
    - Type: `OBJECT`
    - Required: NO,
    - Default : `false`
    - Description: Enable / disable dark mode
