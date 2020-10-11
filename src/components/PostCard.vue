<template>
  <!-- Post card component -->
  <v-card class="post-card" @click="goToBlogPost()">
    <!-- Topic of the blogpost -->
    <v-card-subtitle class="pb-0" style="letter-spacing: 1px;">
      {{ getTopicName }}
    </v-card-subtitle>
    <!-- Title of the post -->
    <v-responsive class="px-4 pt-2 pb-0 title" style="line-height: 28px">
      {{ postTitle }}
    </v-responsive>
    <!-- Caption for the post -->
    <v-card-text class="pt-3">
      {{ postCaption }}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'PostCard',
  components: {},
  props: {
    postId: {
      type: String,
      default: null
    },
    postTopicName: {
      type: String,
      default: null
    },
    postTitle: {
      type: String,
      default: null
    },
    postCaption: {
      type: String,
      default: null
    }
  },
  computed: {
    /**
     * Formating topic name.
     */
    getTopicName () {
      return this.$props.postTopicName
        .match(/[A-Z][a-z]+|[0-9]+/g)
        .join(' ')
        .toUpperCase()
    }
  },
  methods: {
    /**
     * Redirect to blogpost url.
     * Format: '/<<topicName>>/<<postTitle>>--<<postId>>'
     */
    goToBlogPost () {
      return this.$router.push(
        '/' +
          this.$props.postTopicName +
          '/' +
          this.$props.postTitle.split(' ').join('_') +
          '--' +
          this.$props.postId
      )
    }
  }
}
</script>

<style lang="scss" scoped>
/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .post-card {
    cursor: pointer;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .post-card {
    cursor: pointer;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .post-card {
    cursor: pointer;
    height: 100%;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .post-card {
    cursor: pointer;
    height: 100%;
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  .post-card {
    cursor: pointer;
    height: 100%;
  }
}

</style>
