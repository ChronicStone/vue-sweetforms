---
description: ''
sidebar: 'docs'
prev: '/docs/usage/fields'
next: '/docs/usage/validation/'  
---

# Cross-field dependencies

Sweetforms has a built-in way to handle cross-field dependencies super easily. Once a field dependency is setup, you can use to various aspects of the form behaviour such as hiding / disabling fields, filter options of a select / radio / checkbox-group field, or use it in field validation.

## Setup dependencies

On each field that you create, you can create a dependency with an other field. To do this, you just have to pass an array of strings representing the path of the key you're targeting on the formData object.
Let's see a few examples :

#### Simple example

Here's the most basic dependency you can define : A field has one of its siblings as a dependency.

```js

const OpenForm = async () => {
    const { isCompleted, formData } = await createForm({
        title: "Simple flat dependency",
        fields: [
            {
                key: "displayName",
                label: "Check to display other field",
                type: "checkbox",
            },
            {
                key: "fieldWithCondition",
                label: "Displayed if checkbox is checked",
                type: "text",
                required: true,
                dependencies: ['displayName'],
                condition: (dependencies) => dependencies.displayName
            },
        ]
    })
}
```

Let's break down what happens in this example. On the second field, we have on the dependencies attribute a string 'displayName'. 

This string is the key of the field we want to make a link with.
Once the link is established, we can access this value on the condition function. It's as simple as this.

<iframe style="width: 100%;min-height: 520px;" src="https://stackblitz.com/edit/vue-k8dapn?ctl=1&embed=1&file=src/components/SimpleDependency.vue&hideExplorer=1&theme=dark&view=preview"></iframe>

Something interesting to notice is that even though the fieldWithCondition field is required here, the validators only applies if the field is enabled, depending on the defined condition.

#### Dependencies with nested objects

When it comes to nested object, the way you define it in the dependencies attribute is by writing the relative path of the field you're targeting. Let's take a look at an example :

```js
const OpenForm = async () => {
    const { isCompleted, formData } = await createForm({
        title: "Nested object dependency",
        fields: [
            {
                key: "myObject",
                label: "Select at least 3 items to display other field",
                type: "object",
                fields: [
                    { key: "objectSubField", label: "Sub field", type: "checkbox-group", options: () => Array.from({ length: 10}, (_, index) => ({ label: `Item ${index + 1}`, value: index + 1})) },
                ]
            },
            {
                key: "fieldWithCondition",
                label: "Displayed if 3 checkboxes are checked",
                type: "text",
                required: true,
                dependencies: ['myObject.objectSubField'],
                condition: ({'myObject.objectSubField': ObjectSubField }) => ObjectSubField.length > 2
            },
        ]
    })
}
```

It basically works the same, but instead of writing the key of the field, we write the relative path of the field.


<iframe style="width: 100%;min-height: 650px;" src="https://stackblitz.com/edit/vue-ylnn7n?ctl=1&embed=1&file=src/components/SimpleDependency.vue&hideExplorer=1&view=preview"></iframe>


## Usage of dependencies 

As explained earlier, dependencies can be used to affect multiple aspects of the form behaviour :

#### Hide / disable field

The condition attribute, as shown above, can be used to hide or disable a field. It is a function that takes the dependencies object as an argument, and each time a a dependency of the field changes, the condition function output is re-computed.


#### Filter field options

The options of a select / radio / checkbox-group field can be defined in several ways (See [Field data source](/docs/usage/data-sources/)). One of them is defining a function that returns an array of options. If options is a function, then the dependencies object is inject as an argument of this function.

This allows you to change the available options of a field depending of the value of another field. 

Something interesting to notice is that if you select an option, and then change the field on which it is dependent and the option is not there anymore, the field value is automatically cleared. For the following example, try checking "Animals", and then select "dogs" on the select field, and finally uncheck "Animals". You'll see the select field clearing itself.

```js
const OpenForm = async () => {
    const { isCompleted, formData } = await createForm({
        title: "Nested object dependency",
        fields: [
            {
                key: "conditionCheckboxes",
                label: "Check to",
                type: "checkbox-group",
                options: [
                    { label: "Objects", value: "object" },
                    { label: "Animals", value: "animal" },
                ]
            },
            {
                key: "fieldWithCondition",
                label: "Options available in select are filtered by checkboxes above",
                type: "select",
                required: true,
                dependencies: ['conditionCheckboxes'],
                condition: ({ conditionCheckboxes }) => [
                    { label: "Dog", value: { name: "dog", type: "animal"}}
                    { label: "Cat", value: { name: "dog", type: "animal"}}
                    { label: "Pencil", value: { name: "pencil", type: "object"}}
                    { label: "Computer", value: { name: "computed", type: "object"}}
                    { label: "Squirrel", value: { name: "squirrel", type: "animal"}}
                    { label: "Bottle", value: { name: "bottle", type: "object"}}
                ].filter(option => conditionCheckboxes.includes(option.type))
            },
        ]
    })
}
```

Here's the working example : 


<iframe style="width: 100%;min-height: 650px;" src="https://stackblitz.com/edit/vue-gfsr43?ctl=1&embed=1&file=src/components/SimpleDependency.vue&hideExplorer=1&theme=dark&view=preview"></iframe>

#### Use in field validation

Similarly to the field options, there are several ways to declare validations, but you need to declare it as a function if you want to access the dependencies object.

Also, note that Sweetforms uses [Vuelidate](https://vuelidate-next.netlify.com/) to validate forms. More information about this [here](/docs/usage/validation/).

Lets take a look at a very common example : Password & password confirmation.

```js
const OpenForm = async () => {
    import { helpers, sameAs } from "@vuelidate/validators"
    const { isCompleted, formData } = await createForm({
        title: "Password & password confirmation",
        fields: [
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
                validators: (dependencies) => ({
                    sameAsPassword: helpers.withMessage('The password and the confirmation does not match', sameAs(dependencies.password)) 
                })
            }
        ]
    })
}
```

Here's the output of our example :

<iframe src="https://codesandbox.io/embed/distracted-snowflake-6domx?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="distracted-snowflake-6domx"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>


