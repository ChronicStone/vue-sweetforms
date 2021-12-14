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