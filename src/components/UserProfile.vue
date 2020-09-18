<template>
  <!-- User profile info -->
  <div class="d-flex flex-column align-center justify-space-between mb-8">
    <!-- User avatar -->
    <v-avatar class="mb-4" size="80">
      <img :src="$props.photoURL" :alt="$props.displayName">
    </v-avatar>
    <!-- full name of user -->
    <span class="headline font-weight-bold">{{ $props.displayName }}</span>
    <!-- user email -->
    <span class="subtitle-1" style="color: grey;">{{ $props.email }}</span>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  props: {
    photoURL: {
      type: String,
      default: null
    },
    displayName: {
      type: String,
      default: null
    },
    email: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
