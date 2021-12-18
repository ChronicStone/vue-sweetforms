---
description: ''
sidebar: 'docs'
next: '/docs/usage/fields/'  
---

# Form basics

## UseSweetform hook

With Sweetforms, a form is defined by an object passed as argument to the createForm method. You can get access to the createForm method by using the useSweetform hook :

```js

<script setup>
import { useSweetform } from '@chronicstone/vue-sweetforms';
const { createForm } = useSweetform();
</script>
```
Remember that you can only use createForm if the FormProvider component has been instanciated at the root of your application. [More informations about the FormProvider](/docs/installation#formprovider).

Here are the list of methods available in the form object attributes you can use to define your form object :

## createForm method

The createForm method is an async function that returns a Promise. It can takes two arguments : 

```typescript
interface FormData {
    [key: string]: any
}

interface FormResult {
    isCompleted: boolean;
    formData: FormData;
}

declare function createForm(
    formOptions: FormOptions, 
    formInputData: FormData
): Promise<FormResult>;


```

The first argument is the definition of the form, and the second one is the input data to inject to the form when initializing it.

## Form definition

- **title**:
    - type: `STRING`,
    - required: `YES`,
    - default:
    - description: `The title of the form, displayed at the top of the popup.`

- **fields**:
    - type: `ARRAY`,
    - required: `NO`,
    - default: `[]`,
    - description: An array of field that needs to be rendered on your form.

- **steps**:
    - type: `ARRAY`,
    - required: `NO`,
    - default: `[]`,
    - description: An array of steps that needs to be rendered on your form. [See how to use](#steps)

- **gridSize**:
    - type: `NUMBER` | `STRING`,
    - required: `NO`,
    - default: `1 md:2 lg:4 xl:8`,
    - description: The default number of columns that the grid will have. Can be overridden at field level. Uses a breakpoints system to handle the different screen sizes. See [Breakpoints documentation](/docs/usage/breakpoints) for more information.

- **fieldSize**:
    - type: `NUMBER` | `STRING`,
    - required: `NO`,
    - default: `1 md:1 lg:2 xl:4`,
    - description: The default number of columns that the field will take. Can be overridden at field level. Uses a breakpoints system to handle the different screen sizes. See [Breakpoints documentation](/docs/usage/breakpoints) for more information.*

- **maxWidth**:
    - type: `NUMBER` | `OBJECT`,
    - required: `NO`,
    - default: `100%`,
    - description: The max width of the form. WIP, string-based breakpoint system coming soon

- **maxHeight**:
    - type: `NUMBER` | `OBJECT`,
    - required: `NO`,
    - default: `100%`,
    - description: The max height of the form. WIP, string-based breakpoint system coming soon

- **allowClickOutside**:
    - type: `BOOLEAN`,
    - required: `NO`,
    - default: `true`,
    - description: If true, the form will be closed when clicking outside of it.

- **showCloseButton**:
    - type: `BOOLEAN`,
    - required: `NO`,
    - default: `true`,
    - description: If true, a close button will be displayed on the top right corner of the form.

- **showCancelButton**:
    - type: `BOOLEAN`,
    - required: `NO`,
    - default: `true`,
    - description: If true, a cancel button will be displayed next to the submit button

- **showPreviousButton**:
    - type: `BOOLEAN`,
    - required: `NO`,
    - default: `true`,
    - description: On multi-steps forms, if true, a 'previous' button will be displayed next to the next / submit button to navigate between steps back and forth

- **cancelButtonText**:
    - type: `STRING`,
    - required: `NO`,
    - default: `CANCEL`,
    - description: The text that will be displayed on the cancel button.

- **submitButtonText**:
    - type: `OBJECT`,
    - required: `NO`,
    - default: `SUBMIT`
    - description: The text that will be displayed on the submit button.

- **nextButtonText**:
    - type: `STRING`,
    - required: `NO`,
    - default: `NEXT`
    - description: For multi-steps forms, the text that will be displayed on the next button.

- **previousButtonText**:
    - type: `STRING`,
    - required: `NO`,
    - default: `PREVIOUS`
    - description: For multi-steps forms, the text that will be displayed on the previous button.

- **showSteps**:
    - type: `BOOLEAN`,
    - required: `NO`,
    - default: `true`,
    - description: If true, the form will display steps progress bar at the top of the form.