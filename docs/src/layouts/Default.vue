<template>
  <div class="font-sans antialiased text-ui-typo bg-ui-background scrollbar scrollbar-thin">
    <div class="flex flex-col justify-start min-h-screen">
      <header
        ref="header"
        class="fixed top-0 z-10 w-full border-b bg-ui-background border-ui-border"
        @resize="setHeaderHeight"
      >
        <LayoutHeader />
      </header>

      <main
        class="container relative flex flex-wrap justify-start flex-1 w-full bg-ui-background mt-12" 
      >
        <aside
          v-if="hasSidebar"
          class="fixed inset-x-0 bottom-0 z-10 w-full px-4 transition-all -translate-x-full border-r sidebar bg-ui-background border-ui-border duration-300"
          :class="{ 'ml-full': !sidebarOpen}"
          :style="sidebarStyle"
        >
          <div class="w-full pb-16 bg-ui-background">
            <Sidebar @navigate="sidebarOpen = false" />
          </div>
        </aside>

        <div
          class="w-full pb-24"
          :class="{ 'pl-0 lg:pl-12 lg:w-3/4': hasSidebar }"
        >
          <slot />
        </div>
      </main>
    </div>

    <div v-if="hasSidebar" class="fixed bottom-0 right-0 z-50 p-8 lg:hidden">
      <button
        class="p-3 text-white rounded-full shadow-lg bg-ui-primary hover:text-white"
        @click="sidebarOpen = !sidebarOpen"
      >
        <XIcon v-if="sidebarOpen" />
        <MenuIcon v-else />
      </button>
    </div>
  </div>
</template>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<script>
import Sidebar from '@/components/Sidebar'
import LayoutHeader from '@/components/LayoutHeader'
import { MenuIcon, XIcon } from 'vue-feather-icons'

export default {
  components: {
    Sidebar,
    LayoutHeader,
    MenuIcon,
    XIcon
  },

  data() {
    return {
      headerHeight: 0,
      sidebarOpen: false
    }
  },

  computed: {
    sidebarStyle() {
      return {
        top: this.headerHeight + 'px',
        height: `calc(100vh - ${this.headerHeight}px)`,
        left: this.sidebarOpen ? '0' : '-100%'
      }
    },

    hasSidebar() {
      return this.$page && this.headerHeight > 0
    }
  },

  watch: {
    sidebarOpen: function (isOpen) {
      document.body.classList.toggle('overflow-hidden', isOpen)
    }
  },

  mounted() {
    this.setHeaderHeight()
  },

  methods: {
    setHeaderHeight() {
      this.$nextTick(() => {
        this.headerHeight = this.$refs.header.offsetHeight
      })
    }
  },

  metaInfo() {
    return {
      meta: [
        {
          key: 'og:type',
          name: 'og:type',
          content: 'website'
        },
        {
          key: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          key: 'og:image',
          name: 'og:image',
          content: process.env.SITE_URL + '/logo.jpg'
        },
        {
          key: 'twitter:image',
          name: 'twitter:image',
          content: process.env.SITE_URL + '/logo.jpg'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
:root {
  --color-ui-background: theme('colors.white');
  --color-ui-typo: theme('colors.gray.700');
  --color-ui-sidebar: theme('colors.gray.200');
  --color-ui-border: theme('colors.gray.300');
  --color-ui-primary: #9375ff;
}

html[lights-out] {
  --color-ui-background: #1d1e27;
  --color-ui-typo: theme('colors.gray.100');
  --color-ui-sidebar: #282936;
  --color-ui-border: #282936;
  --color-ui-primary: #ac96f9;

  pre[class*='language-'],
  code[class*='language-'] {
    @apply bg-ui-border;
  }
}

* {
  @apply transition-colors duration-150;
}

h1,
h2,
h3,
h4 {
  @apply leading-snug font-black mb-4 text-ui-typo;

  &:hover {
    a::before {
      @apply opacity-100;
    }
  }

  a {
    &::before {
      content: '#';
      margin-left: -1em;
      padding-right: 1em;
      @apply text-ui-primary absolute opacity-0 float-left;
    }
  }
}

h1 {
  @apply text-4xl;
}

h2 {
  @apply text-2xl;
}

h3 {
  @apply text-xl;
}

h4 {
  @apply text-lg;
}

a:not(.active):not(.text-ui-primary):not(.text-white) {
  @apply text-ui-typo;
}

p,
ol,
ul,
pre,
strong,
blockquote {
  @apply mb-4 text-base text-ui-typo;
}

.content {
  a {
    @apply text-ui-primary underline;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply -mt-12 pt-20;
  }

  h2 + h3,
  h2 + h2,
  h3 + h3 {
    @apply border-none -mt-20;
  }

  h2,
  h3 {
    @apply border-b border-ui-border pb-1 mb-3;
  }

  ul {
    @apply list-disc;

    ul {
      list-style: circle;
    }
  }

  ol {
    @apply list-decimal;
  }

  ol,
  ul {
    @apply pl-5 py-1;

    li {
      @apply mb-2;

      p {
        @apply mb-0;
      }

      &:last-child {
        @apply mb-0;
      }
    }
  }
}

blockquote {
  @apply border-l-4 border-ui-border py-2 pl-4;

  p:last-child {
    @apply mb-0;
  }
}

code {
  @apply px-1 py-half text-ui-typo text-sm bg-ui-sidebar font-mono border-b border-r border-ui-border rounded-md;
}

pre[class*='language-'] {
  @apply max-w-full overflow-x-auto rounded;

  & + p {
    @apply mt-4;
  }

  & > code[class*='language-'] {
    @apply border-none leading-relaxed;
  }
}

header {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
}

table {
  @apply text-left mb-6;

  td,
  th {
    @apply py-3 px-4;
    &:first-child {
      @apply pl-0;
    }
    &:last-child {
      @apply pr-0;
    }
  }

  tr {
    @apply border-b border-ui-border;
    &:last-child {
      @apply border-b-0;
    }
  }
}

.sidebar {
  &.open {
    @apply translate-x-0;
  }

  @screen lg {
    @apply w-1/4 px-0 bg-transparent top-0 bottom-auto inset-x-auto sticky z-0 translate-x-0;
  }
}
</style>
