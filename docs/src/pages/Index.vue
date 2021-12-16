<template>
  <Layout>
    <div class="pt-8 md:pt-16">
      <div class="flex flex-col items-center">
        <div class="flex flex-col items-center mb-2 text-ui-primary">
          <Logo :width="80" />
          <h2 class="text-3xl font-black tracking-tighter border-none mt-2 capitalize">SweetForms</h2>
        </div>
        <h1 class="text-4xl text-center lg:text-5xl">
          Build complex forms in seconds
        </h1>
        <p class="text-xl font-medium text-center">
          Promise & schema-based, features rich form generator for vue
          <br />
          <!-- <strong class="text-ui-primary">Got a minute?</strong> -->
        </p>
<!-- 
        <div class="py-4">
          <code class="block px-2 py-1 select-all bg-ui-border text-ui-typo"
            >gridsome create your-project https://github.com/mrcrmn/docc</code
          >
        </div> -->

        <div class="flex justify-center mt-8">
          <g-link
            to="/docs/#introduction"
            class="flex items-center px-6 py-4 ml-auto text-2xl font-bold leading-none text-white transition-all duration-200 ease-out transform border rounded-md shadow-lg bg-ui-primary border-ui-primary hover:shadow-xl hover:-translate-y-1"
          >
            Get started
            <ArrowRightCircleIcon class="ml-4" size="1x" />
          </g-link>
        </div>
      </div>

      <div
        class="max-w-screen-sm pt-8 mx-auto mt-8 border-t md:mt-16 md:pt-16 border-top border-ui-border"
      ></div>

      <div class="flex flex-wrap justify-center -mx-4">
        <div
          class="flex flex-col items-center w-full px-4 mb-8 text-center md:w-1/3"
        >
          <LoaderIcon size="3x" class="mb-6 text-ui-primary" />
          <h3 class="font-bold tracking-wide uppercase text-ui-primary">
            Promise & schema based
          </h3>
          <p class="text-lg text-center">
            Sweetforms brings functionnal approach to forms. Forget about managing components, state, validation ...
          </p>
        </div>

        <div
          class="flex flex-col items-center w-full px-4 mb-8 text-center md:w-1/3"
        >
          <BoxIcon size="3x" class="mb-6 text-ui-primary" />
          <h3 class="font-bold tracking-wide uppercase text-ui-primary">
            COMPLEX DATA STRUCTURES
          </h3>
          <p class="text-lg text-center">
            First-class support deeply nested object & arrays. Represent complex entities in a breeze
          </p>
        </div>

        <div
          class="flex flex-col items-center w-full px-4 mb-8 text-center md:w-1/3"
        >
          <MoonIcon size="3x" class="mb-6 text-ui-primary" />
          <h3 class="font-bold tracking-wide uppercase text-ui-primary">
            SUPER CUSTOMIZABLE
          </h3>
          <p class="text-lg text-center">
            Dark / light themes out of the box. All the styles are completely overridables, to create your own themes
          </p>
        </div>

        <div
          class="flex flex-col items-center w-full px-4 mb-8 text-center md:w-1/3"
        >
          <MoonIcon size="3x" class="mb-6 text-ui-primary" />
          <h3 class="font-bold tracking-wide uppercase text-ui-primary">
            SUPER CUSTOMIZABLE
          </h3>
          <p class="text-lg text-center">
            Dark / light themes out of the box. All the styles are completely overridables, to create your own themes
          </p>
        </div>

        <div
          class="flex flex-col items-center w-full px-4 mb-8 text-center md:w-1/3"
        >
          <LinkIcon size="3x" class="mb-6 text-ui-primary" />
          <h3 class="font-bold tracking-wide uppercase text-ui-primary">
            FIELD DEPENDENCIES
          </h3>
          <p class="text-lg text-center">
            Set dependencies between fields and control their behavior based on any other field of the form.
          </p>
        </div>

        <div
          class="flex flex-col items-center w-full px-4 mb-8 text-center md:w-1/3"
        >
          <LinkIcon size="3x" class="mb-6 text-ui-primary" />
          <h3 class="font-bold tracking-wide uppercase text-ui-primary">
            ADVANCED VALIDATION
          </h3>
          <p class="text-lg text-center">
            Validate any data structure with <a href="https://vuelidate-next.netlify.app/" class="border-b border-dashed border-ui-primary text-ui-primary" target="_blank">Vuelidate</a>. Even supports validation of deeply nested data
          </p>
        </div>

        <div
          class="flex flex-col items-center w-full px-4 mb-8 text-center md:w-1/3"
        >
          <LinkIcon size="3x" class="mb-6 text-ui-primary" />
          <h3 class="font-bold tracking-wide uppercase text-ui-primary">
            MULTI STEPS
          </h3>
          <p class="text-lg text-center">
            First-class multiple steps form support
          </p>
        </div>

        <div
          class="flex flex-col items-center w-full px-4 mb-8 text-center md:w-1/3"
        >
          <LinkIcon size="3x" class="mb-6 text-ui-primary" />
          <h3 class="font-bold tracking-wide uppercase text-ui-primary">
            GRID-BASED TEMPLATING
          </h3>
          <p class="text-lg text-center">
            Highly permissive grid-based templating system allowing you to easily organize complex forms.
          </p>
        </div>

        <div
          class="flex flex-col items-center w-full px-4 mb-8 text-center md:w-1/3"
        >
          <LinkIcon size="3x" class="mb-6 text-ui-primary" />
          <h3 class="font-bold tracking-wide uppercase text-ui-primary">
            RESPONSIVE BREAKPOINTS API
          </h3>
          <p class="text-lg text-center">
            Use a tailwindcss-like breakpoints API to easily make your forms perfectly responsive.
          </p>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Logo from '@/components/Logo'
import {
  ArrowRightCircleIcon,
  ZapIcon,
  MoonIcon,
  SearchIcon,
  LinkIcon,
  GridIcon,
  BoxIcon,
  KeyIcon,
  LoaderIcon
} from 'vue-feather-icons'

export default {
  components: {
    Logo,
    ArrowRightCircleIcon,
    ZapIcon,
    MoonIcon,
    SearchIcon,
    LinkIcon,
    GridIcon,
    BoxIcon,
    KeyIcon,
    LoaderIcon
  },

  metaInfo() {
    const title = 'Build awesome forms in seconds'
    const description =
      'Sweetforms is a functionnal-oriented promise-based form generator for Vue, built on top of Naive UI and Vuelidate'

    return {
      title: title,
      meta: [
        {
          name: 'description',
          content: description
        },
        {
          key: 'og:title',
          name: 'og:title',
          content: title
        },
        {
          key: 'twitter:title',
          name: 'twitter:title',
          content: title
        },
        {
          key: 'og:description',
          name: 'og:description',
          content: description
        },
        {
          key: 'twitter:description',
          name: 'twitter:description',
          content: description
        }
      ]
    }
  }
}
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>
