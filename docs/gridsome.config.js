module.exports = {
  siteName: 'Sweetforms',
  icon: {
    favicon: './src/assets/favicon.png',
    touchicon: './src/assets/favicon.png'
  },
  siteUrl: process.env.SITE_URL ? process.env.SITE_URL : 'https://example.com',
  settings: {
    web: process.env.URL_WEB || false,
    twitter: process.env.URL_TWITTER || false,
    github: process.env.URL_GITHUB || false,
    nav: {
      links: [{ path: '/docs/', title: 'Docs' }, { path: 'https://sweetforms-demo.netlify.app/', title: 'Examples' }]
    },
    sidebar: [
      {
        name: 'docs',
        sections: [
          {
            title: 'Getting Started',
            items: [
              '/docs/',
              '/docs/installation/',
              // '/docs/writing-content/',
              // '/docs/deploying/'
            ]
          },
          {
            title: "Features & usage",
            items: [
              '/docs/usage/',
              '/docs/usage/fields/',
              '/docs/usage/steps/',
              '/docs/usage/initial-state/',
              '/docs/usage/dependencies/',
              '/docs/usage/validation/',
              '/docs/usage/data-sources/',
              '/docs/usage/breakpoints/',
              '/docs/usage/theming/',
            ]
          },
        ]
      }
    ]
  },
  plugins: [
    // {
    //   use: '@gridsome/source-filesystem',
    //   options: {
    //     baseDir: './content',
    //     path: '**/*.md',
    //     typeName: 'MarkdownPage',
    //     remark: {
    //       plugins: ['@gridsome/remark-prismjs']
    //     }
    //   }
    // },

    {
      use: 'gridsome-plugin-tailwindcss'
    },

    {
      use: '@gridsome/plugin-sitemap'
    },
    {
      use: '@gridsome/remark-prismjs'
    },
    {
      use: '@gridsome/vue-remark',
      options: {
        typeName: 'MarkdownPage', // Required
        baseDir: './content/docs', // Where .md files are located
        pathPrefix: '/docs', // Add route prefix. Optional
        template: './src/templates/MarkdownPage.vue',
        plugins: ['@gridsome/remark-prismjs']
      }
    },
  ],
  transformers: {
    remark: {
      plugins: [
        '@gridsome/remark-prismjs'
      ]
    }
  }
}
