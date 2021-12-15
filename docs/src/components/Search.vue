<template>
  <div class="relative" @keydown.down="increment" @keydown.up="decrement" @keydown.enter="go">
    <label class="relative block">
      <span class="sr-only">Search Documentation</span>
      <div class="absolute inset-y-0 left-0 flex items-center justify-center px-3 py-2 opacity-50">
        <SearchIcon size="1.25x" class="text-ui-typo" />
      </div>
      <input
        ref="input"
        type="search"
        :value="query"
        class="block w-full py-2 pl-10 pr-4 border-2 rounded-md bg-ui-sidebar border-ui-sidebar focus:bg-ui-background"
        placeholder="Search Documentation..."
        @focus="focused = true"
        @blur="focused = false"
        @input="
  focusIndex = -1
          query = $event.target.value
        "
        @change="query = $event.target.value"
      />
    </label>
    <div
      v-if="showResult"
      class="fixed inset-x-0 z-50 overflow-y-auto border-2 border-t-0 rounded-lg rounded-t-none shadow-lg results bg-ui-background bottom:0 sm:bottom-auto sm:absolute border-ui-sidebar"
      style="max-height: calc(100vh - 120px)"
    >
      <ul class="px-4 py-2 m-0">
        <li v-if="results.length === 0" class="px-2">
          No results for
          <span class="font-bold">{{ query }}</span>.
        </li>

        <li
          v-for="(result, index) in results"
          v-else
          :key="result.path + result.anchor"
          class="border-ui-sidebar"
          :class="{
            'border-b': index + 1 !== results.length
          }"
          @mouseenter="focusIndex = index"
          @mousedown="go"
        >
          <g-link
            :to="result.path + result.anchor"
            class="block p-2 -mx-2 text-base font-bold"
            :class="{
              'bg-ui-sidebar text-ui-primary': focusIndex === index
            }"
          >
            <span v-if="result.value === result.title">{{ result.value }}</span>

            <span v-else class="flex items-center">
              {{ result.title }}
              <ChevronRightIcon size="1x" class="mx-1" />
              <span class="font-normal opacity-75">{{ result.value }}</span>
            </span>
          </g-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<static-query>
query Search {
   allMarkdownPage{
    edges {
      node {
        id
        path
        title
        headings {
          depth
          value
          anchor
        }
      }
    }
  }
}
</static-query>

<script>
import Fuse from 'fuse.js/dist/fuse.basic.esm'
import { ChevronRightIcon, SearchIcon } from 'vue-feather-icons'

export default {
  components: {
    ChevronRightIcon,
    SearchIcon
  },

  data() {
    return {
      query: '',
      focusIndex: -1,
      focused: false
    }
  },

  computed: {
    results() {
      const fuse = new Fuse(this.headings, {
        keys: ['value'],
        threshold: 0.3
      })

      return fuse
        .search(this.query)
        .slice(0, 15)
        .map(result => result.item)
    },

    headings() {
      const allPages = this.$static.allMarkdownPage.edges.map(edge => edge.node)

      // Return the array of all headings of all pages.
      return allPages
        .map(page =>
          page.headings.map(heading => {
            return {
              ...heading,
              path: page.path,
              title: page.title
            }
          })
        )
        .flat()
    },

    showResult() {
      // Show results, if the input is focused and the query is not empty.
      return this.focused && this.query.length > 0
    }
  },

  methods: {
    increment() {
      if (this.focusIndex < this.results.length - 1) {
        this.focusIndex++
      }
    },

    decrement() {
      if (this.focusIndex >= 0) {
        this.focusIndex--
      }
    },

    go() {
      // Do nothing if we don't have results.
      if (this.results.length === 0) {
        return
      }

      // If we don't have focus on a result, just navigate to the first one.
      const result =
        this.focusIndex === -1 ? this.results[0] : this.results[this.focusIndex]

      this.$router.push(result.path + result.anchor)

      // Unfocus the input and reset the query.
      this.$refs.input.blur()
      this.query = ''
    }
  }
}
</script>
