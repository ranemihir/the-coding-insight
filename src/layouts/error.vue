<template>
  <!-- Error page -->
  <div class="container">
    <h1 v-if="error.statusCode === 404">
      Page Not Found
    </h1>
    <h1 v-else-if="error.message !== null">
      {{ error.message }}
    </h1>
    <nuxt-link to="/">
      Home
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  layout: 'default'
}
</script>
