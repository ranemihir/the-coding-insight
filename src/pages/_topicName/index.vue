<template>
  <!-- Topic container -->
  <div class="ma-0 pa-0">
    <div class="mb-6 px-2">
      <v-list-item class="pl-1">
        <!-- Topic thumbnail -->
        <v-list-item-avatar size="14%" left>
          <v-img :src="getTopicFromTopicName.thumbnailLink" :alt="getTopicName + 'Thumbnail'" />
        </v-list-item-avatar>
        <span class="mr-4">
          <!-- Topic name -->
          <v-list-item-title class="font-weight-bold mb-1 topic-name">
            <h1 class="font-weight-bold headline">{{ getTopicName }}</h1>
          </v-list-item-title>
          <!-- Topic followers count -->
          <v-list-item-subtitle class="font-weight-light followers-count">
            <span id="follow-count">{{ getTopicFromTopicName.followersCount }}</span>
            <client-only>
              <span
                id="follow-count-increment"
                style="display: none;"
              >{{ getTopicFromTopicName.followersCount + 1 }}</span>
              <span
                id="follow-count-decrement"
                style="display: none;"
              >{{ getTopicFromTopicName.followersCount - 1 }}</span>
              <span>Following</span>
            </client-only>
          </v-list-item-subtitle>
        </span>
        <v-list-item-action class="d-flex justify-center">
          <v-btn id="follow-btn" small outlined @click="followTopic()">
            Follow
          </v-btn>
          <v-btn
            id="unfollow-btn"
            small
            color="primary"
            class="elevation-0"
            @click="unfollowTopic()"
          >
            Following
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <!-- Topic decription -->
      <h3
        class="font-weight-regular topic-description"
        style="font-size: 18px;"
      >
        {{ getTopicFromTopicName.description }}
      </h3>
    </div>
    <v-divider />
    <!-- All posts of topic -->
    <div class="posts-grid-container">
      <div v-for="post in getAllPostsOnTopic" :key="post.id" class="ma-0 pa-0">
        <post-card
          :post-topic-name="post.topic.name"
          :post-id="post.id"
          :post-title="post.title"
          :post-caption="post.caption"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ClientOnly from 'vue-client-only'
import PostCard from '~/components/PostCard'

export default {
  name: 'TopicContainer',
  layout: 'default',
  watchQuery: true,
  components: {
    PostCard,
    ClientOnly
  },
  async asyncData ({ app, params, error }) {
    try {
      const topicName = await params.topicName

      /**
       * Fetches topic from viewmodel
       */
      const getTopicFromTopicName = await app.$topicContainerViewModel.getTopicFromTopicName(
        topicName
      )

      /**
       * Fetches all blogposts on topic from viewmodel
       */
      const getAllPostsOnTopic = await app.$topicContainerViewModel.getAllPostsOnTopic(
        topicName
      )

      /**
       * Checks if current user is following the topic; if current user exists
       */
      let checkIfTopicIsFollowedByUser = false

      const currentUser = await app.$cookies.get('__session')

      if (currentUser && currentUser != null) {
        checkIfTopicIsFollowedByUser = await app.$topicContainerViewModel.checkIfTopicIsFollowedByUser(
          currentUser.uid,
          topicName
        )
      }

      if (
        getTopicFromTopicName &&
        getAllPostsOnTopic &&
        getTopicFromTopicName != null
      ) {
        return {
          getTopicFromTopicName,
          getAllPostsOnTopic,
          checkIfTopicIsFollowedByUser
        }
      } else {
        throw new Error('fetching topic container data failed.')
      }
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
      error({ statusCode: 404, message: '404 Not Found' })
    }
  },
  computed: {
    /**
     * Returns formatted topic name.
     */
    getTopicName () {
      return this.getTopicFromTopicName.name
        .match(/[A-Z][a-z]+|[0-9]+/g)
        .join(' ')
    }
  },
  async mounted () {
    /**
     * Displays follow or unfollow button depending on the user.
     */
    const followed = await this.checkIfTopicIsFollowedByUser
    const followBtn = document.getElementById('follow-btn')
    const unfollowBtn = document.getElementById('unfollow-btn')

    if (!followed) {
      followBtn.style = 'display: initial;'
    } else {
      unfollowBtn.style = 'display: initial;'
    }
  },
  methods: {
    /**
     * Makes currently signed in user follow the topic.
     */
    async followTopic () {
      try {
        if (
          this.$cookies.get('__session') &&
          this.$cookies.get('__session').uid != null
        ) {
          const followTopic = await this.$topicContainerViewModel.followTopic(
            this.$cookies.get('__session').uid,
            this.$route.params.topicName
          )

          if (!followTopic || followTopic === null) {
            throw new Error('Some error occurred while following topic')
          }

          const followBtn = document.getElementById('follow-btn')
          const unfollowBtn = document.getElementById('unfollow-btn')

          followBtn.style = 'display: none;'
          unfollowBtn.style = 'display: initial;'

          const followCount = document.getElementById('follow-count')
          const followCountIncrement = document.getElementById(
            'follow-count-increment'
          )
          const followCountDecrement = document.getElementById(
            'follow-count-decrement'
          )

          if (!this.checkIfTopicIsFollowedByUser) {
            followCount.style = 'display: none;'
            followCountIncrement.style = 'display: initial;'
            followCountDecrement.style = 'display: none;'
          } else {
            followCount.style = 'display: initial;'
            followCountIncrement.style = 'display: none;'
            followCountDecrement.style = 'display: none;'
          }
        } else {
          return this.$router.push('/signUp')
        }
      } catch (error) {
        // eslint-disable-next-line
        console.error(error);
      }
    },
    /**
     * Makes currently signed in user unfollow the topic.
     */
    async unfollowTopic () {
      try {
        if (
          this.$cookies.get('__session') &&
          this.$cookies.get('__session').uid != null
        ) {
          const unfollowTopic = await this.$topicContainerViewModel.unfollowTopic(
            this.$cookies.get('__session').uid,
            this.$route.params.topicName
          )

          if (!unfollowTopic || unfollowTopic === null) {
            throw new Error('Some error occurred while unfollowing topic')
          }

          const followBtn = document.getElementById('follow-btn')
          const unfollowBtn = document.getElementById('unfollow-btn')

          followBtn.style = 'display: initial;'
          unfollowBtn.style = 'display: none;'

          const followCount = document.getElementById('follow-count')
          const followCountIncrement = document.getElementById(
            'follow-count-increment'
          )
          const followCountDecrement = document.getElementById(
            'follow-count-decrement'
          )

          if (this.checkIfTopicIsFollowedByUser) {
            followCount.style = 'display: none;'
            followCountIncrement.style = 'display: none;'
            followCountDecrement.style = 'display: initial;'
          } else {
            followCount.style = 'display: initial;'
            followCountIncrement.style = 'display: none;'
            followCountDecrement.style = 'display: none;'
          }
        } else {
          return this.$router.push('/signUp')
        }
      } catch (error) {
        // eslint-disable-next-line
        console.error(error);
      }
    }
  },
  head () {
    return {
      title: this.getTopicFromTopicName.name
        .match(/[A-Z][a-z]+|[0-9]+/g)
        .join(' '),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.getTopicFromTopicName.description
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
#follow-btn,
#unfollow-btn {
  display: none;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .topic-name {
    font-size: 20px;
  }

  .followers-count {
    font-size: 12px;
  }

  .topic-description {
    font-size: 16px;
    margin-top: 12px;
    margin-bottom: 12px;
  }

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
  .topic-name {
    font-size: 24px;
  }

  .followers-count {
    font-size: 12px;
  }

  .topic-description {
    font-size: 16px;
    margin-top: 12px;
    margin-bottom: 12px;
  }

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
  .topic-name {
    font-size: 34px;
  }

  .followers-count {
    font-size: 16px;
  }

  .topic-description {
    font-size: 20px;
    margin-top: 16px;
    margin-bottom: 16px;
  }

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
  .topic-name {
    font-size: 34px;
  }

  .followers-count {
    font-size: 16px;
  }

  .topic-description {
    font-size: 20px;
    margin-top: 16px;
    margin-bottom: 16px;
  }

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
  .topic-name {
    font-size: 34px;
  }

  .followers-count {
    font-size: 16px;
  }

  .topic-description {
    font-size: 20px;
    margin-top: 16px;
    margin-bottom: 16px;
  }

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
