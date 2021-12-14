import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

import 'highlight.js/styles/stackoverflow-light.css'
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import hljsVuePlugin from "@highlightjs/vue-plugin";
hljs.registerLanguage('javascript', javascript);
import '@chronicstone/vue-sweetforms/dist/style.css'

app
.use(hljsVuePlugin)
.mount('#app')
