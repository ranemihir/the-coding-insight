<template>
  <!-- User profile page -->
  <div class="main-wrapper ma-0 pa-0">
    <!-- User profile info -->
    <div class="d-flex flex-column align-center justify-space-between mb-8">
      <!-- User avatar -->
      <v-avatar class="mb-4" size="80">
        <img :src="currentUser.photoURL" :alt="currentUser.displayName">
      </v-avatar>
      <!-- full name of user -->
      <span class="headline font-weight-bold">{{ currentUser.displayName }}</span>
      <!-- user email -->
      <span class="subtitle-1" style="color: grey;">{{ currentUser.email }}</span>
    </div>
    <!-- Tabs for showing saved posts by user and followed topics -->
    <v-tabs v-model="tab" background-color="#121212">
      <v-tab>Saved Posts</v-tab>
      <v-tab>Followed Topics</v-tab>
    </v-tabs>
    <v-divider />
    <v-tabs-items v-model="tab" class="pt-1" style="backgroundColor: #121212">
      <!-- saved posts container -->
      <v-tab-item class="px-3">
        <div class="posts-grid-container">
          <div v-for="post in getAllSavedPostsByUser" :key="post.id" class="ma-0 pa-0">
            <post-card
              :post-id="post.id"
              :post-topic-name="post.topic.name"
              :post-title="post.title"
              :post-caption="post.caption"
            />
          </div>
        </div>
      </v-tab-item>
      <!-- followed topics container -->
      <v-tab-item>
        <div v-for="topic in getAllFollowedTopicsByUser" :key="topic.name" class="ma-0 pa-0">
          <topic-card
            :topic-name="topic.name"
            :topic-thumbnail-link="topic.thumbnailLink"
            :topic-followers-count="topic.followersCount"
            :has-user-followed-topic="true"
          />
        </div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import PostCard from '~/components/PostCard'
import TopicCard from '~/components/TopicCard'

export default {
  name: 'Profile',
  layout: 'default',
  middleware: 'auth',
  components: {
    PostCard,
    TopicCard
  },
  async asyncData ({ app, params, error }) {
    try {
      /**
       * Checks if user is currently signed in or not.
       */
      const currentUser = await app.$cookies.get('__session')

      /**
       * If user is signed in get user's followed topics and saved posts data.
       */
      if (currentUser && currentUser != null) {
        const getAllFollowedTopicsByUser = await app.$userProfileViewModel.getAllFollowedTopicsByUser(
          currentUser.uid
        )

        const getAllSavedPostsByUser = await app.$userProfileViewModel.getAllSavedPostsByUser(
          currentUser.uid
        )

        /**
         * return followed topics and saved posts by user if exist.
         */
        if (
          getAllFollowedTopicsByUser &&
          getAllSavedPostsByUser &&
          getAllFollowedTopicsByUser != null &&
          getAllSavedPostsByUser != null
        ) {
          return {
            getAllFollowedTopicsByUser,
            getAllSavedPostsByUser,
            currentUser
          }
        } else {
          throw new Error('some error occurred while getting user data')
        }
      } else {
        throw new Error('No user signed in')
      }
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
      error({ statusCode: 404, message: '404 Not Found' })
    }
  },
  data () {
    return {
      tab: null
    }
  },
  head () {
    return {
      title: this.currentUser.displayName
    }
  }
}
</script>

<style lang="scss" scoped>

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .posts-grid-container {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto;
    gap: 16px;
    padding-top: 16px;
    justify-items: stretch;
    align-items: stretch;
    justify-content: stretch;
    align-content: stretch;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .posts-grid-container {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto;
    gap: 16px;
    padding-top: 16px;
    justify-items: stretch;
    align-items: stretch;
    justify-content: stretch;
    align-content: stretch;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .posts-grid-container {
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
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .posts-grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
    gap: 16px;
    padding-top: 16px;
    justify-items: stretch;
    align-items: stretch;
    justify-content: stretch;
    align-content: stretch;
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  .posts-grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
    gap: 16px;
    padding-top: 16px;
    justify-items: stretch;
    align-items: stretch;
    justify-content: stretch;
    align-content: stretch;
  }
}
</style>
