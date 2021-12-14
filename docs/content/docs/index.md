---
description: ''
sidebar: 'docs'
next: '/docs/installation/'
---

# Introduction

Sweetforms is a schema-based form generator built on top of [Naive UI](https://github.com/TuSimple/naive-ui). It takes away all the inconvenience of setting up components, validation, form behaviour like cross-fields dependencies, async data sources for select, checkbox group, radio fields, while supporting a wide range of features.

## Promise-based API

Instead of importing a component, declare it on your page / component template, setting up its state and everything, you just have to wrap your app with the Form Provider component, and then use sweetforms as a function anywhere in your app.

## Wide range of fields supported

Sweetforms offers you a wide range of fields, that you can combine to create complex data structures. Here's an exhaustive list of supported field types :
- text
- textarea
- password
- number
- select
- radio
- checkbox
- checkbox group
- slider
- date
- time
- date range
- date-time range
- month 
- year
- object
- array

## Deep nesting support

As array and objects have first-class support for object and array fields, you can create deeply nested data structures in a breeze.

## Multi-steps forms

Thanks to the schema-based API that Sweetforms provides, it's super easy to create multiple-steps forms !

## Cross-field dependencies

With sweetforms, it's super easy to create relations between fields, even in deeply nested data structures. Once a dependency is initiated on a field, you can use the dependency to :
- Control whether a field should be displayed or not
- Use it as a parameter for a data-source, in select / checkbox-group / radio, to filter the list of available options 
- Validate a field based on its dependencies

## Async data-sources

Use async functions as data-source for select / radio / checkbox-group fields. If the field has a dependency, the list of options for the field will be re-computed each time a dependency is updated.

## Advanced form validation

Sweetforms uses [Vuelidate](https://vuelidate-next.netlify.app/) as its form validation engine. It has a first-class integration, that lets you validate any data structure, including deeply nested array of objects for example. Field dependencies are also available in the context of validation, which makes cross-field validation super easy !

## Grid-based templating & responsiveness

Sweetforms use a grid-based templating system that allows you to design highly customizable forms easily. It also uses a tailwindcss-like API to let you control the size of the grid and fields with 4 different breakpoints (sm, md, lg & xl). You can even customize the breakpoint sizes to make them match your requirements.

## Dark / light themes & customization

Sweetforms comes with build-in light / dark themes out of the box. But you can make it match your own design requirements by using [Naive UI](https://naive-ui.com)'s excellent theme customization system to overwrite the base themes.
