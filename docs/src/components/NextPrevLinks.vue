<template>
  <div>
    <div class="flex flex-col items-center justify-between sm:flex-row">
      <g-link
        v-if="prev"
        :to="prev.path"
        class="flex items-center px-4 py-2 mb-4 mr-auto font-bold transition-colors border rounded-md sm:mb-0 text-ui-primary border-ui-border hover:bg-ui-primary hover:text-white"
      >
        <ArrowLeftIcon class="mr-2" size="1x" />
        {{ prev.title }}
      </g-link>

      <g-link
        v-if="next"
        :to="next.path"
        class="flex items-center px-4 py-2 ml-auto font-bold transition-colors border rounded-md text-ui-primary border-ui-border hover:bg-ui-primary hover:text-white"
      >
        {{ next.title }}
        <ArrowRightIcon class="ml-2" size="1x" />
      </g-link>
    </div>
  </div>
</template>

<script>
import { ArrowLeftIcon, ArrowRightIcon } from 'vue-feather-icons'

export default {
  components: {
    ArrowLeftIcon,
    ArrowRightIcon
  },

  computed: {
    page() {
      return this.$page.markdownPage
    },

    pages() {
      return this.$page.allMarkdownPage.edges.map(edge => edge.node)
    },

    next() {
      return this.pages && !this.page.next
        ? false
        : this.pages.find(page => page.path === this.page.next)
    },

    prev() {
      return this.pages && !this.page.prev
        ? false
        : this.pages.find(page => page.path === this.page.prev)
    }
  }
}
</script>
