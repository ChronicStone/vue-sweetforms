---
description: ''
sidebar: 'docs'
prev: '/docs/usage/data-sources/'  
next: '/docs/usage/theming'
---

# Breakpoints & responsive

The templating system of sweetforms is based on the native CSS grid. In addition of that, an API similar to tailwindcss breakpoints have been implemented, making super easy to make your forms responsive.

This system is currently implemented on the grid and field, but will be extended soon to any size controllable option, like the form maxWidth / maxHeight, ...

## Grid size

To define the number of columns in the grid, you have the gridSize field. You can use it exactly like tailwindcss implementation of breakpoints. 

For example, if I want a grid size of 1 columns on mobile, 2 columns on tablet, 3 on laptop and 4 on desktop, here's how the gridSize should look like:
```js
gridSize: "1 md:2 xl:3 lg:4",
```
This example translates to this :
- By default, the grid has 1 column,
- If screen size >= tablet devide (md), then the grid has 2 columns,
- If screen size >= laptop devide (lg), then the grid has 3 columns,
- If screen size >= desktop devide (xl), then the grid has 4 columns.



You can also skip breakpoints, just like in tailwindcss. Here's an example :
```js	
gridSize: "1 lg:4"
```
This will behave the following way :
- By default, the grid has 1 column,
- If screen size >= tablet (md), no breakpoint defined, so keep the last defined breakpoint, so it'll have 1 column,
- If screen size >= laptop (lg), then the grid has 4 columns.
- If screen size >= desktop (xl), no  breakpoint defined, then the grid has still 4 columns, which is the last defined breakpoint.

Here's a full-featured example : (Open it on StackBlitz to resize the window and see the breakpoints effect)

## fieldSize

Similarly to gridSize, you can define the default number of columns for each field. It works with the exact same breakpoints system. Currently you can only define default fieldSize at the root of the form, but soon you'll be able to do it for sub-objects and arrays soon.

## size

The "size" attribute is defined on the field directly. It allows you to override the default fieldSize defined at the root of the form. It also benefits from the breakpoints system.

## Full-featured example

Let's see an example using all the features together and see how it behaves :

```js
const OpenForm = async () => {
    const { isCompleted, formData } = await createForm({
        title: 'Password & password confirmation',
        gridSize: '8 lg:9 xl:8',
        fieldSize: '8 md:4 lg:3 xl:2',
        fields: [
          { key: 'email', label: 'Email', type: 'text', size: '8 lg:9 xl:8', },
          { key: 'firstName', label: 'Last name', type: 'text' },
          { key: 'firstName', label: 'Last name', type: 'text' },
          { key: 'password', label: 'Password', type: 'password' },
          { key: 'passwordConfirmation', label: 'Password confirmation', type: 'password' },
          {
            key: 'objectResponsive',
            label: 'Object with size override on parent',
            type: 'object',
            size: '8 lg:9 xl:8',
            gridSize: '4',
            fields: [
              { type: 'number', key: 'innerObject1', label: 'Inner object 1', size: 2, },
              { type: 'number', key: 'innerObject2', label: 'Inner object 2', size: 2, },
              { type: 'number', key: 'innerObject3', label: 'Inner object 3', size: 2, },
              { type: 'number', key: 'innerObject4', label: 'Inner object 4', size: 2, },
            ],
          },
        ]
    })
}
```

Let's break down what should happen with the following example :

1. The main grid should have always 8 columns, except on for the LG breakpoint (laptop) where it should have 9 columns.

2. By default, on the SM breakpoint (mobile), each field should fill all 8 / 8 columns. On the MD breakpoint (tablet), each field should fill 4 / 8 columns. On the LG breakpoint (laptop), each field should fill 3 / 9 columns. On the XL breakpoint (desktop), each field should fill 2 / 8 columns.

3. The field "email" (1st one) should always fill all the columns (8/8 on sm, md & xl, and 9/9 on lg)

4. The last field, of type object, have a custom size for its internal grid (by default it inherits the one of its parent). Always two columns no matter the screen size, and each field have a size set to 1 column.

Here's the final result : (Open on stackblitz to play with the screen size and see the breakpoints effect)

<iframe style="width: 100%;min-height: 650px;" src="https://stackblitz.com/edit/vue-sksxuk?embed=1&file=src/components/SimpleDependency.vue&hideExplorer=1&view=preview"></iframe>
