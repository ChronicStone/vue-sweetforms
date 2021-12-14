import DefaultLayout from '~/layouts/Default.vue'

export default function (Vue, { router, head }) {
  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout)

  router.beforeEach((to, _, next) => {
    head.meta.push({
      key: 'og:url',
      name: 'og:url',
      content: process.env.GRIDSOME_BASE_PATH + to.path
    })
    next()
  })
}
