<template>
  <Layout>
    <div class="flex flex-wrap items-start justify-start">
      <div
        class="sticky order-2 w-full md:w-1/3 sm:pl-4 md:pl-6 lg:pl-8"
        style="top: 4rem; position: sticky !important;"
      >
        <OnThisPage id="MarkdownContent" />
      </div>

      <div class="order-1 w-full md:w-2/3">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <!-- <div class="content" v-html="$page.markdownPage.content" /> -->
        <VueRemarkContent class="content" />
        <div class="pt-8 mt-8 border-t lg:mt-12 lg:pt-12 border-ui-border">
          <NextPrevLinks />
        </div>
      </div>
    </div>
  </Layout>
</template>

<page-query>
query ($id: ID!) {
  markdownPage(id: $id) {
    id
    title
    description
    path
    content
    sidebar
    next
    prev
    headings {
      depth
      value
      anchor
    }
  }
  allMarkdownPage{
    edges {
      node {
        path
        title
      }
    }
  }
}
</page-query>

<script>
import OnThisPage from '@/components/OnThisPage.vue'
import NextPrevLinks from '@/components/NextPrevLinks.vue'

export default {
  components: {
    OnThisPage,
    NextPrevLinks,
  },
  metaInfo() {
    const title = this.$page.markdownPage.title
    const description =
      this.$page.markdownPage.description || this.$page.markdownPage.excerpt

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
  @import 'prism-themes/themes/prism-material-oceanic.css';
</style>
