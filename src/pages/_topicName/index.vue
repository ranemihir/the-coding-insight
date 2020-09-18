<template>
  <!-- Topic container -->
  <div class="ma-0 pa-0">
    <topic-header
      :topic-name="getTopicFromTopicName.name"
      :topic-description="getTopicFromTopicName.description"
      :topic-thumbnail-link="getTopicFromTopicName.thumbnailLink"
      :topic-followers-count="getTopicFromTopicName.followersCount"
      :has-user-followed-topic="checkIfTopicIsFollowedByUser"
    />
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
import PostCard from '~/components/PostCard'
import TopicHeader from '~/components/TopicHeader'

export default {
  name: 'TopicContainer',
  layout: 'default',
  watchQuery: true,
  components: {
    PostCard,
    TopicHeader
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
