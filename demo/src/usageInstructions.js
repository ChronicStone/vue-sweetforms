export const usageInstructions = {
    'one': "npm i -s @chronicstone/vue-sweetforms",
    'two': `import "vue-sweetforms/dist/style.css"`,
    'three': `// App.vue
  
      <script setup>
        import { FormProvider } from "vue-sweetforms"
      </script>
  
      <template>
        <FormProvider>
          <!-- Your app content here -->
          <router-view/>
        </FormProvider
      </template>
      `,
      'four': `<script setup>
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