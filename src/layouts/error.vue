<template>
  <!-- Error page -->
  <div class="container">
    <h1 v-if="error.statusCode === 404">
      Page Not Found
    </h1>
    <h1 v-else-if="error.message !== null">
      {{ error.message }}
    </h1>
    <v-btn style="margin-top: 4px" @click="navigateToHome()">
      Home
    </v-btn>
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
  layout: 'default',
  methods: {
    /**
     * Navigates to '/' route.
     */
    navigateToHome () {
      return this.$router.push('/')
    }
  }
}
</script>
