<template>
  <div class="ma-0 pa-0">
    <h1 class="text-center main-title mb-8">
      Take a deeper insight into the world of programming.
    </h1>

    <h3 class="text-center mt-2 text-body-1">
      Select the technologies that interest you. We'll help you find great articles to read.
    </h3>
    <div class="mb-8 topics-grid-container">
      <span v-for="topic in getAllTopics" :key="topic.name" class="ma-2 pa-2">
        <topic-badge
          :topic-name="topic.name"
          :topic-thumbnail-link="topic.thumbnailLink"
        />
      </span>
    </div>

    <div class="d-flex flex-column align-center mb-12">
      <v-btn
        color="primary"
        class="text-h6"
        width="200"
        x-large
        @click="navigateToSignUp()"
      >
        Join Us
      </v-btn>
    </div>
  </div>
</template>

<script>
import TopicBadge from '~/components/TopicBadge'

export default {
  layout: 'default',
  middleware: 'home',
  components: {
    TopicBadge
  },
  async asyncData ({ app, params, error }) {
    try {
      const getAllTopics = await app.$homeViewModel.getAllTopics()

      return {
        getAllTopics
      }
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
      error({ statusCode: 404, message: '404 Not Found' })
    }
  },
  methods: {
    /**
     * Navigates to '/signUp' route.
     */
    navigateToSignUp () {
      return this.$router.push('/signUp')
    }
  },
  head () {
    return {
      title: 'Home'
    }
  }
}
</script>

<style lang="scss" scoped>
/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .topics-grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    gap: 16px;
    padding-top: 16px;
    justify-items: stretch;
    align-items: stretch;
    justify-content: stretch;
    align-content: stretch;
  }

  .main-title{
    font-size: 28px;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .topics-grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    gap: 16px;
    padding-top: 16px;
    justify-items: stretch;
    align-items: end;
    justify-content: stretch;
    align-content: stretch;
  }

  .main-title{
    font-size: 48px;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .topics-grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: auto;
    gap: 16px;
    padding-top: 16px;
    justify-items: stretch;
    align-items: end;
    justify-content: stretch;
    align-content: stretch;
  }

  .main-title{
    font-size: 48px;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .topics-grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: auto;
    gap: 16px;
    padding-top: 16px;
    justify-items: stretch;
    align-items: end;
    justify-content: stretch;
    align-content: stretch;
  }

  .main-title{
    font-size: 48px;
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  .topics-grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: auto;
    gap: 16px;
    padding-top: 16px;
    justify-items: stretch;
    align-items: end;
    justify-content: stretch;
    align-content: stretch;
  }

  .main-title{
    font-size: 48px;
  }
}
</style>
