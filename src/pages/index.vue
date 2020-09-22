<template>
  <div class="ma-0 pa-0">
    <div class="main d-flex flex-column justify-center content-padding">
      <h1 class="main-title mb-4">
        Take A Deeper Insight Into The World of Programming.
      </h1>
      <h3 class="mb-8 font-weight-regular sub-header">
        "Programming isn't about what you know; it's about what you can figure out."
      </h3>
      <v-btn
        color="primary"
        class="font-weight-bold mb-12"
        width="120"
        large
        @click="navigateToSignUp()"
      >
        Join Us
      </v-btn>
    </div>

    <div class="second-slide content-padding d-flex flex-column justify-center ">
      <h3 class="text-center mt-12 mb-8 font-weight-bold text-h5">
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
    </div>
  </div>
</template>

<script>
import TopicBadge from '~/components/TopicBadge'

export default {
  layout: 'home',
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
.main{
  height: 90vh;
  background-color: #000000;
  background-size: cover;
  background-repeat: no-repeat;
}

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

  .main{
    background-image: url('/Background-Mobile.svg');
  }

  .second-slide{
    height: 120vh;
  }

  .main-title{
    font-size: 28px;
  }

  .sub-header{
    font-size: 16px;
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

  .main{
    background-image: url('/Background-Mobile.svg');
  }

  .second-slide{
    height: 120vh;
  }

  .main-title{
    font-size: 48px;
  }

  .sub-header{
    font-size: 18px;
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

  .main{
    background-image: url('/Background-Desktop.svg');
  }

  .second-slide{
    height: 120vh;
  }

  .main-title{
    font-size: 48px;
  }

  .sub-header{
    font-size: 20px;
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

  .main{
    background-image: url('/Background-Desktop.svg');
  }

  .second-slide{
    height: 100vh;
  }

  .main-title{
    font-size: 48px;
  }

  .sub-header{
    font-size: 20px;
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

  .main{
    background-image: url('/Background-Desktop.svg');
  }

  .second-slide{
    height: 100vh;
  }

  .main-title{
    font-size: 48px;
  }

  .sub-header{
    font-size: 20px;
  }
}
</style>
