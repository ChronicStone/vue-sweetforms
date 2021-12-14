<template>
  <img :width="getWidth" :height="getHeight" src="../assets/logo.png" alt="Sweetfirls logo" />
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 40
    }
  },

  computed: {
    getWidth() {
      return this.width
    },

    getHeight() {
      return Math.ceil((this.getWidth / 48) * 48)
    }
  }
}
</script>
