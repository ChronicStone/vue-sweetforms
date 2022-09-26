import { FormRefInstance } from './types/instance';
import { FormField } from './types/fields';
import { FormSchema } from './types/form';
import { useSweetform } from './hooks/useSweetform';
import FormProvider from './components/FormProvider.vue';
import Form from './components/Form.vue';

declare module "@chronicstone/vue-sweetforms" {
    export { useSweetform, FormProvider, Form };
    export type { FormSchema, FormField, FormRefInstance }
}