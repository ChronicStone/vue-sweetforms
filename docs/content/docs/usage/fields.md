---
description: ''
sidebar: 'docs'
prev: '/usage'
next: '/usage/steps/'  
---

# Form fields

Sweetforms provides you a lot of field types out of the box. Each field has its own set of customization options that'll be presented below.

## General field definition

All the fields share a common set of options. These options will allow you to control various aspects of the field and its behaviour in the form.

- **key**:
    - Type: `STRING`
    - Required: YES,
    - Default :
    - Description: The key of the field on the formData object.

- **label**:
    - Type: `STRING`
    - Required: YES,
    - Default :
    - Description: The label of the field displayed on the form.

- **type**:
    - Type: `text` | `textarea` | `password` | `number` | `slider` | `switch` | `select` | `radio` | `checkbox` | `checkbox-group` | `checkboxGroup` | `date` | `time` | `datetime` | `datetimerange` | `daterange` | `month` | `year` | `file` | `array` | `object`
    - Required: YES,
    - Default :
    - Description: The label of the field displayed on the form.

- **required**:
    - Type: `BOOLEAN`
    - Required: NO,
    - Default : `false`
    - Description: If the field is required (applies required validator on the field)

- **options**:
    - Type: `ARRAY` | `FUNCTION`
    - Required: NO,
    - Default : []
    - Description: The label of the field displayed on the form.
    - Field types: `select`, `radio`, `checkbox-group`

- **size**:
    - Type: `STRING` | `NUMBER`	
    - Required: `NO`,
    - Default : `8 md:4 xl:2`
    - Description: The size of the field. It uses a tailwind-like breakpoint system that allows you to define the size of the field on the form grid.

- **gridSize**:
    - Type: `STRING` | `NUMBER`
    - Required: `NO`,
    - Default : `8`
    - Description: For object & array types, defines the size of the field subgrid. It also uses a tailwind-like breakpoint system that allows you to define the number of columns depending on the screen size.
    - Field types: `object` | `array`

- **fields**: 
    - Type: `ARRAY`
    - Required: `NO`,
    - Default : []
    - Description: For object & array types, defines the inner fields of the object or array.
    - Field types: `object` | `array`

- **Dependencies**:
    - Type: `ARRAY`
    - Required: `NO`,
    - Default : []
    - Description: The dependencies of the field, defined by an array. It allows you to link a field to other field, and change the behaviour of a field depending on its dependencies (Disable / hide, use in validation, or in data-source, ...). The dependencies are defined by an array of strings, which represent the path of the target field on the formData object.

- **Validators**: 
    - Type: `OBJECT` | `FUNCTION`
    - Required: `NO`,
    - Default : {}
    - Description: The validators of the field. Must be a function returning an object if you want to use dependencies in the field validation. See [Validators](/docs/usage/validation) or [Vuelidate](https://vuelidate-next.netlify.app/) for more information.

- **fieldParams**: 
    - Type: `OBJECT`
    - Required: `NO`,
    - Default :
    - Description: The fieldParams object defines options that change the behaviour of the field. Each field has its own set of props that you can pass to fieldParams. These props are defined below for each field type.

- **description**:
    - Type: `STRING` | { title: `STRING`, content: `STRING` }
    - Required: `NO`,
    - Default :
    - Description: The description of the field. When defined, adds a clickable icon that will open a popup with the description. Both title & content supports HTML.

- **defaultValue**: 
    - Type: `STRING` | `NUMBER` | `BOOLEAN` | `ARRAY` | `OBJECT` | `NULL`
    - Required: `NO`,
    - Default :
    - Description: The default value of the field.

## Available fields

### Text 

The text field is the most basic field available. It's a simple text input field.

**Field params**

- **showCharacterCount**:
    - Type: `BOOLEAN`
    - Required: NO,
    - Default : `false`
    - Description: Display the count of characters in the field (displayed on the input).

- **minLength**:
    - Type: `NUMBER`
    - Required: NO,
    - Default :
    - Description: The minimum length of the field.

- **maxField**:
    - Type: `NUMBER`
    - Required: NO,
    - Default :
    - Description: The maximum length of the field.

- **prefix**:
    - Type: `STRING`
    - Required: NO,
    - Default :
    - Description: The prefix of the field(displayed on the input).

- **suffix**:
    - Type: `STRING`
    - Required: NO,
    - Default :
    - Description: The suffix of the field (displayed on the input).

### Textarea 

The textarea field is a basic textarea input field.


**Field params**

- **showCharacterCount**:
    - Type: `BOOLEAN`
    - Required: NO,
    - Default : `false`
    - Description: Display the count of characters in the field (displayed on the input).

- **minLength**:
    - Type: `NUMBER`
    - Required: NO,
    - Default :
    - Description: The minimum length of the field.

- **maxField**:
    - Type: `NUMBER`
    - Required: NO,
    - Default :
    - Description: The maximum length of the field.

- **prefix**:
    - Type: `STRING`
    - Required: NO,
    - Default :
    - Description: The prefix of the field(displayed on the input).

- **suffix**:
    - Type: `STRING`
    - Required: NO,
    - Default :
    - Description: The suffix of the field (displayed on the input).

### Password 

A basic password input field.

**Field params**:

- showPasswordButton:
    - Type: `BOOLEAN`
    - Required: NO,
    - Default : `true`
    - Description: Display a button that will show / hide the password.

###  Number 

A number input controllable through keyboard arrows.

**Field params**:

- **showIncrementButtons**:
    - Type: `BOOLEAN`
    - Required: NO,
    - Default : `true`
    - Description: Display the increment buttons on the field.

- **min**:
    - Type: `NUMBER`
    - Required: NO,
    - Default :
    - Description: The minimum value of the field.

- **max**:
    - Type: `NUMBER`
    - Required: NO,
    - Default :
    - Description: The maximum value of the field.

- **step**:
    - Type: `NUMBER`
    - Required: NO,
    - Default : 1
    - Description: The increment step of the field.

- **prefix**:
    - Type: `STRING`
    - Required: NO,
    - Default :
    - Description: The prefix of the field(displayed on the input).

- **suffix**:
    - Type: `STRING`
    - Required: NO,
    - Default :
    - Description: The suffix of the field (displayed on the input).

### Select 

A highly customizable select input field.

**Field params**:

- **filterable**:
    - Type: `BOOLEAN`
    - Required: NO,
    - Default : `true`
    - Description: Allow the user to filter the options of the field.

- **multiple**:
    - Type: `BOOLEAN`
    - Required: NO,
    - Default : `false`
    - Description: Allow the user to select multiple values.

- **clearable**:
    - Type: `BOOLEAN`
    - Required: NO,
    - Default : `true`
    - Description: Allow the user to clear the field value.

- **virtualScroll**:
    - Type: `BOOLEAN`
    - Required: NO,
    - Default : `false`
    - Description: Enable virtual list for the field options. (Use when you have a very large amount of options to render)

- **renderLabel**:
    - Type: `FUNCTION`
    - Required: NO,
    - Default : `null`
    - Description: A render function to render a customized field selected value (For non-multiple select)

- **renderOption**:
    - Type: `FUNCTION`
    - Required: NO,
    - Default : `null`
    - Description: A render function to customize how options are rendered

- **renderTag**:
    - Type: `FUNCTION`
    - Required: NO,
    - Default : `null`
    - Description: A render function to customize selected values (For multi-selection)


### Radio 

A basic radio input field.

**Field params**:

No field params available.

### Checkbox 

A boolean checkbox input field. Can have a third "null" state

**Field params**:

- hasThirdState:
    - Type: `BOOLEAN`
    - Required: NO,
    - Default : `false`
    - Description: Allow the user to select a "null" state.


### Checkbox-group 

A group of checkbox allowing you to select array of values

**Field params**:

- minChecked:
    - Type: `NUMBER`
    - Required: NO,
    - Default :
    - Description: The minimum number of checkboxes that must be checked.

- maxChecked: 
    - Type: `NUMBER`
    - Required: NO,
    - Default :
    - Description: The maximum number of checkboxes that can be checked.

### Slider 

A simple slider input

**Field params**:

- **min**:
    - Type: `NUMBER`
    - Required: NO,
    - Default :
    - Description: The minimum value of the slider.

- **max**:
    - Type: `NUMBER`
    - Required: NO,
    - Default :
    - Description: The maximum value of the slider.

- **step**:
    - Type: `NUMBER`
    - Required: NO,
    - Default : 1
    - Description: The increment step of the slider.

- **range**:
    - Type: `BOOLEAN`
    - Required: NO,
    - Default : `false`
    - Description: Allow the user to select a range of values instead of a single value.

- **reverse**:
    - Type: `BOOLEAN`
    - Required: NO,
    - Default : `false`
    - Description: Reverse the slider values order (highest to lowest).

- **showTooltip**:
    - Type: `BOOLEAN`
    - Required: NO,
    - Default : `true`
    - Description: Display the value of the slider on the tooltip.

- **formatTooltip**:
    - Type: `FUNCTION`
    - Required: NO,
    - Default : 
    - Description: A render function to customize the tooltip format.

- **marks**:
    - Type: `OBJECT`
    - Required: NO,
    - Default : `null`
    - Description: Allows you to put marks on the slider bar. See [here](https://codesandbox.io/s/i25gr) for more informations

### Time 

- **actions**:
    - Type: `ARRAY`
    - Required: NO,
    - Default : `['clear', 'confirm']`
    - Description: An array of actions to display on the bottom of the timepicker.

- **use12HoursFormat**:
    - Type: `BOOLEAN`
    - Required: NO,
    - Default : `false`
    - Description: Use 12 hours format instead of 24 hours format.

- **format**
    - Type: `STRING` | `null`
    - Required: NO,
    - Default : `'HH:mm:ss'`
    - Description: The format of the time. Set to null to get a ms timestamp. See [date-fns](https://date-fns.org/v2.6.0/docs/format) for more informations.

- **displayedHours**:
    - Type: `NUMBER` | `ARRAY`
    - Required: NO,
    - Default : 
    - Description: The array of hours that are displayed on the timepicker. If a number, it'll be converted into an array of numbers using that increment.

- **displayedMinutes**:
    - Type: `NUMBER` | `ARRAY`
    - Required: NO,
    - Default : 
    - Description: The array of minutes that are displayed on the timepicker. If a number, it'll be converted into an array of numbers using that increment.

- **displayedSeconds**:
    - Type: `NUMBER` | `ARRAY`
    - Required: NO,
    - Default : 
    - Description: The array of seconds that are displayed on the timepicker. If a number, it'll be converted into an array of numbers using that increment.

- **disableHour**:
    - Type: `(hour: number) => boolean`
    - Required: NO,
    - Default :
    - Description: Callback function for disabling hours.

- **disableMinute**:
    - Type: `(minute: number, hour: number) => boolean`
    - Required: NO,
    - Default :
    - Description: Callback function for disabling minutes.

- **disableSecond**:
    - Type: `(second: number, minute: number, hour: number) => boolean`
    - Required: NO,
    - Default :
    - Description: Callback function for disabling seconds.


### Date, Date-time, Date-range, Date-time range, Month, Year

All these fields have access to the same field params.

**Field params**:

- **format**
    - Type: `STRING` | `null`
    - Required: NO,
    - Default : `'dd/MM/yyyy'`
    - Description: The format of the time. Set to null to get a ms timestamp. See [date-fns](https://date-fns.org/v2.6.0/docs/format) for more informations.

- **dateDisabled**:
    - Type: `(date: number) => boolean`
    - Required: NO,
    - Default :
    - Description: Callback function for disabling dates. (Takes a timestamp as argument)

- **timeDisabled**:
    - Type: `(datetime: number) => { isHourDisabled?: () => boolean, isMinuteDisabled?: () => boolean, isSecondDisabled?: () => boolean }`
    - Required: NO,
    - Default :
    - Description: Callback function for disabling hours/minutes/seconds. (Takes a timestamp as argument)

### Object

The object field allows you to have nested objects in your form. It fully supports deep nesting & validation, & field dependency

### Array

The array field allow you to have arrays of objects inside your form. It fully supports deep nesting & validation. It supports field dependency with a few limitations, refer to the [validation](/docs/usage/validation) section for more informations.

### Image

Allows you to handle images uploading inside your forms. Includes preview, & other features. Coming soon ...

### File dropzone (coming soon)

A dropzone component allowing you to upload files. Coming soon ...

### Custom component

This new field type will allow you to define your own components as field types and use them in your form. Coming soon.