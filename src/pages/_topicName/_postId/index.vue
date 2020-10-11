<template>
  <div class="ma-0 pa-0">
    <div class="mb-4">
      <!-- Blog post title -->
      <h1 class="font-weight-bold blog-title-font">
        {{ getPostFromId.title }}
      </h1>
      <!-- Blog post date -->
      <div class="subtitle-1 font-weight-regular pt-3">
        {{ getDate }}
      </div>
    </div>
    <!-- Topic of the post -->
    <topic-card
      class="pl-0 mb-10"
      :topic-name="getTopicFromTopicName.name"
      :topic-thumbnail-link="getTopicFromTopicName.thumbnailLink"
      :topic-followers-count="getTopicFromTopicName.followersCount"
      :has-user-followed-topic="checkIfTopicIsFollowedByUser"
    />
    <!-- eslint-disable-next-line -->
    <div style="font-size: 20px; margin-bottom: 200px;" class="font-weight-regular" v-html="getPostDescription" />
    <!-- BlogPost Action Panel -->
    <v-card
      class="blog-post-bottom-action-bar d-flex flex-row justify-space-around align-center pa-4"
    >
      <!-- Like Button -->
      <div class="ma-0 pa-0 d-flex flex-row justify-space-between align-center">
        <v-btn id="like-btn" color="info" icon dark @click="likePost()">
          <v-icon>{{ mdiHeart }}</v-icon>
        </v-btn>
        <v-btn id="dislike-btn" color="accent" icon @click="dislikePost()">
          <v-icon>{{ mdiHeart }}</v-icon>
        </v-btn>
        <span id="like-count" class="ml-2 body-1">{{ getPostFromId.likesCount }}</span>
        <client-only>
          <span id="like-count-increment" class="ml-2 body-1">{{ getPostFromId.likesCount + 1 }}</span>
          <span id="like-count-decrement" class="ml-2 body-1">{{ getPostFromId.likesCount - 1 }}</span>
        </client-only>
      </div>

      <!-- Save Button -->
      <div class="ma-0 pa-0 d-flex flex-row justify-space-between align-center">
        <v-btn id="save-btn" color="info" icon @click="savePost()">
          <v-icon>{{ mdiBookmark }}</v-icon>
        </v-btn>
        <v-btn id="unsave-btn" color="primary" icon @click="unsavePost()">
          <v-icon>{{ mdiBookmark }}</v-icon>
        </v-btn>
        <span id="saved-count" class="ml-2 body-1">{{ getPostFromId.savedCount }}</span>
        <client-only>
          <span id="saved-count-increment" class="ml-2 body-1">{{ getPostFromId.savedCount + 1 }}</span>
          <span id="saved-count-decrement" class="ml-2 body-1">{{ getPostFromId.savedCount - 1 }}</span>
        </client-only>
      </div>

      <!-- Share Button -->
      <v-btn icon color="#CDCDCD" @click="copyLinkToClipboard()">
        <v-icon>{{ mdiShareVariant }}</v-icon>
      </v-btn>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="2000" width="100%">
      Link Copied To Clipboard!
      <template v-slot:action="{ attrs }">
        <v-btn
          color="primary"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import copy from 'copy-to-clipboard'
import ClientOnly from 'vue-client-only'
import {
  mdiHeart,
  mdiBookmark,
  mdiShareVariant
} from '@mdi/js'
import TopicCard from '~/components/TopicCard'

export default {
  name: 'BlogPost',
  layout: 'default',
  watchQuery: true,
  components: {
    TopicCard,
    ClientOnly
  },
  async asyncData ({ app, params, error }) {
    try {
      const topicName = params.topicName
      const postId = params.postId.split('--')[1]

      const getPostFromId = await app.$blogPostViewModel.getPostFromId(postId)
      const getTopicFromTopicName = await app.$blogPostViewModel.getTopicFromTopicName(
        topicName
      )

      let checkIfTopicIsFollowedByUser = false
      let checkIfPostIsLikedByUser = false
      let checkIfPostIsSavedByUser = false

      const currentUser = await app.$cookies.get('__session')

      if (currentUser && currentUser != null) {
        checkIfTopicIsFollowedByUser = await app.$blogPostViewModel.checkIfTopicIsFollowedByUser(
          currentUser.uid,
          topicName
        )
        checkIfPostIsLikedByUser = await app.$blogPostViewModel.checkIfPostIsLikedByUser(
          currentUser.uid,
          postId
        )
        checkIfPostIsSavedByUser = await app.$blogPostViewModel.checkIfPostIsSavedByUser(
          currentUser.uid,
          postId
        )
      }

      if (
        getPostFromId &&
        getPostFromId != null &&
        getTopicFromTopicName &&
        getTopicFromTopicName != null
      ) {
        return {
          getPostFromId,
          getTopicFromTopicName,
          checkIfTopicIsFollowedByUser,
          checkIfPostIsLikedByUser,
          checkIfPostIsSavedByUser
        }
      } else {
        throw new Error('Some error occurred')
      }
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
      error({ statusCode: 404, message: '404 Not Found' })
    }
  },
  data () {
    return {
      snackbar: false,
      mdiHeart,
      mdiBookmark,
      mdiShareVariant
    }
  },
  computed: {
    /**
     * Formats date.
     */
    getDate () {
      const dateObj = new Date(this.getPostFromId.creationTime)
      const month = dateObj.toLocaleString('default', { month: 'long' })
      const date = dateObj.getDate()
      const year = dateObj.getFullYear()
      return `${month} ${date}, ${year}`
    },
    /**
     * Creates and returns blogpost from Editor.js blocks.
     */
    getPostDescription () {
      return this.$createBlogPost(
        JSON.parse(this.getPostFromId.description).blocks
      )
    }
  },
  mounted () {
    const likeBtn = document.getElementById('like-btn')
    const dislikeBtn = document.getElementById('dislike-btn')
    const saveBtn = document.getElementById('save-btn')
    const unsaveBtn = document.getElementById('unsave-btn')

    if (!this.checkIfPostIsLikedByUser) {
      likeBtn.style = 'display: initial;'
    } else {
      dislikeBtn.style = 'display: initial;'
    }

    if (!this.checkIfPostIsSavedByUser) {
      saveBtn.style = 'display: initial;'
    } else {
      unsaveBtn.style = 'display: initial;'
    }
  },
  methods: {
    /**
     * Formats topic name.
     */
    getTopicName () {
      return this.getTopicFromTopicName.name
        .match(/[A-Z][a-z]+|[0-9]+/g)
        .join(' ')
    },
    /**
     * Copies the link to clipboard.
     */
    copyLinkToClipboard () {
      copy(this.$env.baseUrl + this.$route.fullPath)
      this.snackbar = true
    },
    /**
     * Current user likes the blogpost.
     */
    async likePost () {
      try {
        if (
          this.$cookies.get('__session') &&
          this.$cookies.get('__session').uid != null
        ) {
          const likePost = await this.$blogPostViewModel.likePost(
            this.$cookies.get('__session').uid,
            this.$route.params.postId.split('--')[1]
          )

          if (!likePost) {
            throw new Error('Some error occurred while liking post')
          }

          const likeBtn = document.getElementById('like-btn')
          const dislikeBtn = document.getElementById('dislike-btn')

          likeBtn.style = 'display: none;'
          dislikeBtn.style = 'display: initial;'

          const likeCount = document.getElementById('like-count')
          const likeCountIncrement = document.getElementById(
            'like-count-increment'
          )
          const likeCountDecrement = document.getElementById(
            'like-count-decrement'
          )

          if (!this.checkIfPostIsLikedByUser) {
            likeCount.style = 'display: none;'
            likeCountIncrement.style = 'display: initial;'
            likeCountDecrement.style = 'display: none;'
          } else {
            likeCount.style = 'display: initial;'
            likeCountIncrement.style = 'display: none;'
            likeCountDecrement.style = 'display: none;'
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
     * Current user dislikes the blogpost.
     */
    async dislikePost () {
      try {
        if (
          this.$cookies.get('__session') &&
          this.$cookies.get('__session').uid != null
        ) {
          const dislikePost = await this.$blogPostViewModel.dislikePost(
            this.$cookies.get('__session').uid,
            this.$route.params.postId.split('--')[1]
          )

          if (!dislikePost) {
            throw new Error('Some error occurred while disliking post')
          }

          const likeBtn = document.getElementById('like-btn')
          const dislikeBtn = document.getElementById('dislike-btn')

          likeBtn.style = 'display: initial;'
          dislikeBtn.style = 'display: none;'

          const likeCount = document.getElementById('like-count')
          const likeCountIncrement = document.getElementById(
            'like-count-increment'
          )
          const likeCountDecrement = document.getElementById(
            'like-count-decrement'
          )

          if (this.checkIfPostIsLikedByUser) {
            likeCount.style = 'display: none;'
            likeCountIncrement.style = 'display: none;'
            likeCountDecrement.style = 'display: initial;'
          } else {
            likeCount.style = 'display: initial;'
            likeCountIncrement.style = 'display: none;'
            likeCountDecrement.style = 'display: none;'
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
     * Saves blogpost for current user.
     */
    async savePost () {
      try {
        if (
          this.$cookies.get('__session') &&
          this.$cookies.get('__session').uid != null
        ) {
          const savePost = await this.$blogPostViewModel.savePost(
            this.$cookies.get('__session').uid,
            this.$route.params.postId.split('--')[1]
          )

          if (!savePost) {
            throw new Error('Some error occurred while saving post')
          }

          const saveBtn = document.getElementById('save-btn')
          const unsaveBtn = document.getElementById('unsave-btn')

          saveBtn.style = 'display: none;'
          unsaveBtn.style = 'display: initial;'

          const savedCount = document.getElementById('saved-count')
          const savedCountIncrement = document.getElementById(
            'saved-count-increment'
          )
          const savedCountDecrement = document.getElementById(
            'saved-count-decrement'
          )

          if (!this.checkIfPostIsSavedByUser) {
            savedCount.style = 'display: none;'
            savedCountIncrement.style = 'display: initial;'
            savedCountDecrement.style = 'display: none;'
          } else {
            savedCount.style = 'display: initial;'
            savedCountIncrement.style = 'display: none;'
            savedCountDecrement.style = 'display: none;'
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
     * Unsaves blogpost for current user.
     */
    async unsavePost () {
      try {
        if (
          this.$cookies.get('__session') &&
          this.$cookies.get('__session').uid != null
        ) {
          const unsavePost = await this.$blogPostViewModel.unsavePost(
            this.$cookies.get('__session').uid,
            this.$route.params.postId.split('--')[1]
          )

          if (!unsavePost) {
            throw new Error('Some error occurred while unsaving post')
          }

          const saveBtn = document.getElementById('save-btn')
          const unsaveBtn = document.getElementById('unsave-btn')

          saveBtn.style = 'display: initial;'
          unsaveBtn.style = 'display: none;'

          const savedCount = document.getElementById('saved-count')
          const savedCountIncrement = document.getElementById(
            'saved-count-increment'
          )
          const savedCountDecrement = document.getElementById(
            'saved-count-decrement'
          )

          if (this.checkIfPostIsSavedByUser) {
            savedCount.style = 'display: none;'
            savedCountIncrement.style = 'display: none;'
            savedCountDecrement.style = 'display: initial;'
          } else {
            savedCount.style = 'display: initial;'
            savedCountIncrement.style = 'display: none;'
            savedCountDecrement.style = 'display: none;'
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
      title: `${this.getPostFromId.title} - ${this.getTopicName()}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.getPostFromId.caption
        },
        {
          property: 'og:title',
          content: this.getPostFromId.title
        },
        {
          property: 'og:description',
          content: this.getPostFromId.caption
        },
        {
          property: 'og:site_name',
          content: this.$env.baseUrl
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.link-snackbar{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 8px;
}

#like-btn,
#dislike-btn,
#save-btn,
#unsave-btn {
  display: none;
}

#like-count-increment,
#saved-count-increment,
#like-count-decrement,
#saved-count-decrement {
  display: none;
}

.blog-post-bottom-action-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .blog-title-font {
    font-size: 40px;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .blog-title-font {
    font-size: 40px;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .blog-title-font {
    font-size: 48px;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .blog-title-font {
    font-size: 48px;
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  .blog-title-font {
    font-size: 48px;
  }
}

</style>
