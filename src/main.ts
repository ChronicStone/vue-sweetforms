import { createApp } from 'vue'
import SweetformPlugin from './index'
import App from './App.vue'
const app = createApp(App)

app
.use(SweetformPlugin, {
    textOverrides: {
        requiredMessage: (label: string) => `Le champ ${label} ne peut pas être vide`,
    }
})
.mount('#app')
