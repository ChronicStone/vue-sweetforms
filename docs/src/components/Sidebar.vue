<template>
  <div v-if="showSidebar" ref="sidebar" class="px-4 pt-8 lg:pt-12">
    <div
      v-for="(section, index) in sidebar.sections"
      :key="section.title"
      class="pb-4 mb-4 border-ui-border"
      :class="{ 'border-b': index < sidebar.sections.length - 1 }"
    >
      <h3 class="pt-0 mt-0 mb-1 text-sm tracking-tight uppercase">
        {{ section.title }}
      </h3>

      <ul class="max-w-full mb-0">
        <li
          v-for="page in findPages(section.items)"
          :id="page.path"
          :key="page.path"
          @mousedown="$emit('navigate')"
        >
          <g-link
            :to="`${page.path}`"
            class="flex items-center py-1 font-semibold transition transform"
            :class="{
              'translate-x-4 text-ui-primary': isCurrentPage(page),
              'hover:translate-x-1': !isCurrentPage(page)
            }"
          >
            <span
              class="absolute w-2 h-2 -ml-4 transition origin-center transform scale-0 rounded-full opacity-0 bg-ui-primary"
              :class="{
                'opacity-100 scale-100': isCurrentPage(page)
              }"
            ></span>
            <span :class="{ 'hover:text-ui-primary': !isCurrentPage(page) }">{{
              page.title
            }}</span>
          </g-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<static-query>
query Sidebar {
  metadata {
    settings {
      sidebar {
        name
        sections {
          title
          items
        }
      }
    }
  }
}
</static-query>

<script>
export default {
  emits: ['navigate'],

  data() {
    return {
      expanded: []
    }
  },

  computed: {
    pages() {
      return this.$page.allMarkdownPage.edges.map(edge => edge.node)
    },

    sidebar() {
      return this.$static.metadata.settings.sidebar.find(
        sidebar => sidebar.name === this.$page.markdownPage.sidebar
      )
    },

    showSidebar() {
      return this.$page.markdownPage.sidebar && this.sidebar
    },

    currentPage() {
      return this.$page.markdownPage
    }
  },

  methods: {
    isCurrentPage({ path }) {
      return this.currentPage.path === path
    },

    findPages(links) {
      return links.map(link => this.pages.find(page => page.path === link))
    }
  }
}
</script>
