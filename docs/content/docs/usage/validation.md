---
title: "Handling validation"
description: ''
sidebar: 'docs'
---

# Form validation

Sweetforms currantly has first-class integration of [Vuelidate](https://vuelidate-next.netlify.com/) to validate forms. You can find the list of built-in validators and how to declare your own directly in their documentation.

We might move to our own validation library in the future, but for now vuelidate can already handle most of your use cases, with almost no caveats.

## Validation setup

For bundle size reasons, Sweetforms does not include Vuelidate's validators. You need to install them additionaly :

```bash
npm install -s @vuelidate/validators
```

Once installed, you'll  benefit from all the validators available in Vuelidate. You can also define your own validators, as shown in [below](#custom-validator).


## Required field

The required field is the only validation that works slightly differently from the others. You simply have to give an attribute 'required' to the field when defining it. Doing this will mark the field with a red asterisk (<span style="color:red">*</span>) in the form.

```js
const OpenForm = async () => {
    const { isCompleted, formData } = await createForm({
        title: "Required field",
        fields: [
            {
                key: "requiredField",
                label: "Required field",
                type: "text",
                required: true
            }
        ]
    })
}
```

## Declare and use validators

At the exception of the required field, all the other validators must be defined through the "validators" field attribute. You have two possibilities when it comes to defining validators :

### Without cross-field dependencies

If you don't want to use cross-field dependencies, you can simply define validators as an object :

```js
const OpenForm = async () => {
    import { email } from "@vuelidate/validators"
    const { isCompleted, formData } = await createForm({
        title: "Validation without cross-field dependencies",
        fields: [{
            key: "email",
            label: "Email",
            type: "email",
            validators: {
                email
            }
        }]
    })
}
```


### With cross-field dependencies

If you want to use field dependencies on a field's validators, you must define validators as a function returning an object. The argument of that function is the dependencies object :

```js
import { sameAs } from "@vuelidate/validators"
const OpenForm = async () => {
    const { isCompleted, formData } = await createForm({
        title: "Validation with cross-field dependencies",
        fields: [{
            key: "password",
            label: "Password",
            type: "password",
        }, {
            key: "confirmPassword",
            label: "Confirm password",
            type: "password",
            dependencies: ['password']
            validators: ({ password }) => ({
                passwordConfirmed: sameAs(password)
            })
        }]
    })
}
```


## Validate complex data structures

Sweetforms supports deeply nested data structures. You can validate them as well, although array validation have a few edge cases that are not yet possible to handle.

### Object validation

Object validation works the same way as regular fields. You can define validators on the object itself, or on the fields of the object ;

```js
const OpenForm = async () => {
    import { minLength } from "@vuelidate/validators"
    const { isCompleted, formData } = await createForm({
        const { isCompleted, formData } = await createForm({
        title: "Nested objects validation",
        gridSize: 1,
        fieldSize: 1,
        fields: [
            {
                type: "object",
                key: "minmax",
                label: "Min & Max length string",
                fields: [
                    { key: "min", type: "slider", label: "Min selected checkbox in object" }, 
                    { key: "max", type: "slider", label: "Max selected checkbox in object" }
                ]
            }, 
            {
                key: "object",
                label: "Object",
                type: "object",
                required: true,
                fields: [{
                    gridSize: "2 md:4 lg:6",
                    key: "field2",
                    label: "Field 2",
                    type: "checkbox-group",
                    options: Array.from({ length: 12 }, (_, i) => ({ label: "Item " + i, value: i })),
                    required: true,
                    dependencies: ['minmax.min', 'minmax.max'],
                    validators: ({ 'minmax.min': min, 'minmax.max': max}) => ({
                        minLength: minLength(min ?? 0),
                        ...(max && { maxLength: maxLength(max ?? 0) })
                    })
                }
            ]
        }]
      }, { minmax: { min: 5, max: 10 }})
}
```

On this example, we could just add "minmmax" as a dependency instead of adding both min & max properties of minmax, but the goal was to demonstrate that nested dependencies works as well.

<iframe src="https://codesandbox.io/embed/agitated-snyder-8g2bl?fontsize=14&hidenavigation=1&theme=dark" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" title="Sweetforms - Nested object validation with dependencies" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" ></iframe>


### Array validation

Array validation is works the same way as regular fields for most cases. You can define validators on the array itself, or on the fields of the array, exactly like for objects. The only difficulty you might have is on the case you need dependencies between fields of a a same item in the array.

Currently it's not possible to inject the validated item object in the dependencies of the field. Let's take an example : 

```js
const OpenForm = () => {
    const { isCompleted, formData } = createForm({
        title: "Array validation",
        fields: [
            {
                type: "array",
                key: "array",
                label: "Array",
                fields: [
                    { key: "field1", type: "text", label: "Field 1" },
                    { key: "field2", type: "text", label: "Field 2" }
                ]
            }
        ]
    })
}
```

On this example, we have an array of objects with two fields. Let's say we want to validate the field2 field of each object depending on field1. 

This is not possible yet using dependencies. As a workaround, you can use Vuelidate's sibling accessor to check on an arary's object sibling :

```js
const OpenForm = () => {
    const { isCompleted, formData } = createForm({
        title: "Array validation",
        fields: [
            {
                type: "array",
                key: "array",
                label: "Array",
                fields: [
                    { key: "field1", type: "text", label: "Field 1" },
                    { 
                        key: "field2", 
                        type: "text", 
                        label: "Field 2",
                        validators: {
                            isSameAsSibling: (value, siblings) => siblings.field1.contains(value)
                        }
                    }
                ]
            }
        ]
    })
}
```

