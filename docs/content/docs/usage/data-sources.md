---
description: ''
sidebar: 'docs'
prev: '/docs/usage/validation'
next: '/docs/usage/breakpoints/'  
---

# Data sources

For fields like select, radio, checkbox-group, etc, you need to define a set of selectable data. Sweetforms provides you several ways of doing so.

## Options as static array

The most common way of defining the selectable options is to pass the array of available options statically.

### Array of strings

The simplest way to define options is to pass an array of strings to the options attribute. The string of each option will be used as the value and label at the same time.


### Array of objects

In case the actual value of your selected element is not a string (A number, a boolean, an object, an array, ...), you can pass an array of objects with two properties : 
- label : the label of the option
- value : the value of the option

## Options as function

The other possibility is to define the options as a function. This function can be async, so you can have remote data-source for your select options if needed. 

Additionally, if you have dependencies defined on the field, the dependencies object will be passed as an argument of this function, and the function will re-run each time one of the dependencies changes, even if the function is asynchroneous.

Let's see a full example of this : (Select australian, most of the breeds don't have sub-breeds)

```js
const OpenForm = async () => {
    const { isCompleted, formData } = await createForm({
        title: "Nested object dependency",
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
        ]
    })
}
```

Both of these select fields use an async function to get the options. When the "breed" field changes, the options of "subBreed" are re-computed accordingly to the value of "breed".

