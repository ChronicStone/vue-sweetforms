const ClearCodeString = (str) => {
  const ClearQuotes = (str) => str.substring(1, str.length - 1)
  const detectArrowFunctionInString = (str) => str.match(/\(.*\)/g);
  const detectFunctionInString = (str) => str.match(/function/g);
  const matches = str.match(/"([^"]*)"/g, '$1').map(val => ({ old: val, new: (detectArrowFunctionInString(val)) ? ClearQuotes(val) : val }));
  let newStr = str;
  for(const match of matches) {
      newStr = newStr.replace(match.old, match.new);
  }
  return newStr;
}

function JSONstringifyWithFuncs(obj) {
Object.prototype.toJSON = function() {
  var sobj = {}, i;
  for (i in this) 
    if (this.hasOwnProperty(i))
      sobj[i] = typeof this[i] == 'function' ?
        unescape(this[i].toString()) : this[i];

  return sobj;
};
Array.prototype.toJSON = function() {
    var sarr = [], i;
    for (i = 0 ; i < this.length; i++) 
        sarr.push(typeof this[i] == 'function' ? unescape(this[i].toString()) : this[i]);

    return sarr;
};

var str = JSON.stringify(obj, null, 4);

delete Object.prototype.toJSON;
delete Array.prototype.toJSON;

return ClearCodeString(str);
}

export const BundleCodeExample = (obj, vuelidate) => {
const preparedString = JSONstringifyWithFuncs(obj)
return `
<script setup>
  import { useSweetform } from '@chronicstone/vue-sweetforms';
  const { createForm } = useSweetform()
  ${vuelidate ? `import { ${vuelidate.join(', ')} } from "@vuelidate/validators"` : ''}

  const GetDataFromForm = async () => {
    const { isCompleted, formData } = await createForm(${preparedString})
    // Do whatever you want with the data
  }
</script>`
}

export const usageInstructions = [
  { label: "1. Install the package :",  value: "npm i -s @chronicstone/vue-sweetforms" },
  { label: "2. Install vuelidate validators if you need validation :",  value: "npm i -s @vuelidate/validators" },
  { label: "3. Import the styles :",  value: "import 'vue-sweetforms/dist/style.css'" },
  { 
    label: "4. Wrap your app with the FormProvider component :",  
    value: `// App.vue
  
<script setup>
  import { FormProvider } from "vue-sweetforms"
</script>

<template>
  <FormProvider>
    <!-- Your app content here -->
    <router-view/>
  </FormProvider
</template>
` 
  },
  { 
    label: "5. Use the form API anywhere in your app :",  
    value: `<script setup>
    import { useSweetform } from "vue-sweetforms"
    import axios from "axios"
    
      
    const { createForm } = useSweetform()
    
    
    const OpenForm = async () => {
      const { isCompleted, formData } = await createForm({
        title: "Demonstration",
        onSubmit: (formData) => alert(JSON.stringify(formData)),
        onCancel: () => alert('CANCELLED'),
        gridSize: "8",
        fieldSize: "8 md:4"
        fields: [
          { key: "firstName", type: "text", label: "First name", placeholder: "John", required: true },
          { key: "lastName", type: "text", label: "Last name", placeholder: "Doe", required: true },
          { key: "email", type: "text", label: "Email address", placeholder: "john.doe@gmail.com", size: 8, required: true },
        ]
      })
    }
</script>

<template>
  <button @click="OpenForm">OPEN FORM</button>
</template>` 
  }
]