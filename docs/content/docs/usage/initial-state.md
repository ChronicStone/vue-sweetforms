---
description: ''
sidebar: 'docs'
prev: '/usage/steps/'
next: '/usage/dependencies/'  
---

# Initial state

You often need to edit some entities in addition to simply create them. That's possible in Sweetforms. 

What you have to do is pass a second argument to the createForm method, which is the initial state of the form.

```js
const const userData {
    firstName: "John",
    lastName: "Doe",
    address: {
        street: "1 Main St",
        city: "New York",
        state: "NY",
        zip: "10001"
    }
}
const OpenForm = async () => {
    const { isCompleted, formData } = await createForm({
        title: "Initial state",
        fields: [
            { key: "firstName", label: "First name", type: "text" }, 
            { key: "lastName", label: "Last name", type: "text" }, 
            { 
                key: "address", 
                label: "Address", 
                type: "object",
                fields: [
                    { key: "street", label: "Street", type: "text", }, 
                    { key: "city", label: "City", type: "text" }, 
                    { key: "state", label: "State", type: "text" }, 
                    { key: "zip", label: "Zip", type: "text" }
                ]
            }
        ]
    }, userData)
}
```

<iframe width="100%" height="650px" src="https://stackblitz.com/edit/vue-t3uzjx?embed=1&file=src/components/SimpleDependency.vue&hideExplorer=1&theme=dark&view=preview" />