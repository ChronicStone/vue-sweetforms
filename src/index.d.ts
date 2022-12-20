import { FormRefInstance } from './types/instance';
import { FormField } from './types/fields';
import { FormSchema } from './types/form';
import { useSweetform } from './hooks/useSweetform';
import { SweetformPluginConfig } from './types/plugin';
import FormProvider from './components/FormProvider.vue';
import Form from './components/Form.vue';
import { SweetformPlugin } from './index';

declare module "@chronicstone/vue-sweetforms" {
    export { useSweetform, FormProvider, Form, SweetformPlugin };
    export type { FormSchema, FormField, FormRefInstance,  SweetformPluginConfig }
    export default SweetformPlugin;
}