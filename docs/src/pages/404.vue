<template>
  <Layout>
    <div class="pt-8 md:pt-16">
      <h1 class="text-4xl font-bold text-center text-ui-primary">
        Oh no! There is nothing here.
      </h1>
    </div>
    <div class="flex items-center justify-center mb-10">
      <g-link to="/" class="text-xl font-bold border-b border-ui-primary"
        >Go back</g-link
      >.
    </div>
  </Layout>
</template>

<script>
export default {
  metaInfo: {
    title: '404 - Nothing here'
  }
}
</script>
