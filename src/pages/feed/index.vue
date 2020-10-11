<template>
  <div class="mb-12 pb-12">
    <h1 class="font-weight-bold header">
      Topics
    </h1>
    <v-divider />
    <div class="topics-grid-container">
      <span v-for="topic in getAllTopics" :key="topic.name" class="ma-2 pa-2">
        <topic-badge
          :topic-name="topic.name"
          :topic-thumbnail-link="topic.thumbnailLink"
          class="topic-badge px-6 py-4"
        />
      </span>
    </div>
    <h1 class="font-weight-bold header">
      Trending Articles
    </h1>
    <v-divider />
    <div class="posts-grid-container">
      <div v-for="post in trendingPosts" :key="post.id" class="ma-0 pa-0">
        <post-card
          :post-topic-name="post.topic.name"
          :post-id="post.id"
          :post-title="post.title"
          :post-caption="post.caption"
        />
      </div>
    </div>
    <h1 class="font-weight-bold header mt-10">
      Recommended Articles
    </h1>
    <v-divider />
    <div class="posts-grid-container">
      <div v-for="post in recommendedPosts" :key="post.id" class="ma-0 pa-0">
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
import TopicBadge from '~/components/TopicBadge'

export default {
  layout: 'default',
  components: {
    PostCard,
    TopicBadge
  },
  middleware: 'auth',
  async asyncData ({ app, params, error }) {
    /**
     * Fetches all blogposts from viewmodel
     */
    const getAllPosts = await app.$feedViewModel.getAllPosts()

    /**
     * Fetches all topics from viewmodel
     */
    const getAllTopics = await app.$feedViewModel.getAllTopics()

    return {
      trendingPosts: getAllPosts.slice(0, 3),
      recommendedPosts: getAllPosts.slice(3),
      getAllTopics
    }
  }
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
    display: none;
}

.topic-badge{
  border-radius: 12px;
  background-color: #212121;
  min-height: 140px;
}

.topics-grid-container {
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
    overflow-y: hidden;
    align-items: center;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .header{
    font-size: 20px;
    margin: 16px 0;
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
  .header{
    font-size: 20px;
    margin: 16px 0;
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
  .header{
    font-size: 32px;
    margin: 16px 0;
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
  .header{
    font-size: 32px;
    margin: 16px 0;
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
  .header{
    font-size: 32px;
    margin: 16px 0;
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
