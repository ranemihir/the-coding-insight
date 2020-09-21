<template>
  <div class="mb-6 px-2">
    <v-list-item class="pl-1">
      <!-- Topic thumbnail -->
      <v-list-item-avatar size="14%" style="border-radius: 0;" left>
        <v-img :src="topicThumbnailLink" :alt="getTopicName + ' Thumbnail'" />
      </v-list-item-avatar>
      <span class="mr-4">
        <!-- Topic name -->
        <v-list-item-title class="font-weight-bold mb-1 topic-name">
          <h1 class="font-weight-bold headline">{{ getTopicName }}</h1>
        </v-list-item-title>
        <!-- Topic followers count -->
        <v-list-item-subtitle class="font-weight-light followers-count">
          <span id="follow-count">{{ topicFollowersCount }}</span>
          <client-only>
            <span
              id="follow-count-increment"
              style="display: none;"
            >{{ topicFollowersCount + 1 }}</span>
            <span
              id="follow-count-decrement"
              style="display: none;"
            >{{ topicFollowersCount - 1 }}</span>
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
      class="font-weight-regular topic-description mt-3"
      style="font-size: 18px;"
    >
      {{ topicDescription }}
    </h3>
  </div>
</template>

<script>
import ClientOnly from 'vue-client-only'

export default {
  name: 'TopicHeader',
  components: {
    ClientOnly
  },
  props: {
    topicName: {
      type: String,
      default: null
    },
    topicDescription: {
      type: String,
      default: null
    },
    topicThumbnailLink: {
      type: String,
      default: null
    },
    topicFollowersCount: {
      type: Number,
      default: 0
    },
    hasUserFollowedTopic: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    /**
     * Returns formatted topic name.
     */
    getTopicName () {
      return this.$props.topicName.match(/[A-Z][a-z 0-9]+/g).join(' ')
    }
  },
  mounted () {
    const followBtn = document.getElementById('follow-btn')
    const unfollowBtn = document.getElementById('unfollow-btn')

    if (!this.$props.hasUserFollowedTopic) {
      followBtn.style = 'display: initial;'
      unfollowBtn.style = 'display: none;'
    } else {
      followBtn.style = 'display: none;'
      unfollowBtn.style = 'display: initial;'
    }
  },
  methods: {
    /**
     * navigate to '/<<provided_topicName>>' route.
     */
    navigateToTopic () {
      return this.$router.push('/' + this.$props.topicName)
    },
    /**
     * Makes currentlt signed in user follow the topic.
     */
    async followTopic () {
      try {
        if (
          this.$cookies.get('__session') &&
          this.$cookies.get('__session').uid != null
        ) {
          const followTopic = await this.$topicContainerViewModel.followTopic(
            this.$cookies.get('__session').uid,
            this.$props.topicName
          )

          if (!followTopic) {
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

          if (!this.$props.hasUserFollowedTopic) {
            followCount.style = 'display: none;'
            followCountIncrement.style = 'display: initial;'
            followCountDecrement.style = 'display: none;'
          } else {
            followCount.style = 'display: initial;'
            followCountIncrement.style = 'display: none;'
            followCountDecrement.style = 'display: none;'
          }
        } else {
          this.$router.push('/signUp')
        }
      } catch (error) {
        // eslint-disable-next-line
        console.error(error);
      }
    },
    /**
     * Makes currentlt signed in user unfollow the topic.
     */
    async unfollowTopic () {
      try {
        if (
          this.$cookies.get('__session') &&
          this.$cookies.get('__session').uid != null
        ) {
          const unfollowTopic = await this.$topicContainerViewModel.unfollowTopic(
            this.$cookies.get('__session').uid,
            this.$props.topicName
          )

          if (!unfollowTopic) {
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

          if (this.$props.hasUserFollowedTopic) {
            followCount.style = 'display: none;'
            followCountIncrement.style = 'display: none;'
            followCountDecrement.style = 'display: initial;'
          } else {
            followCount.style = 'display: initial;'
            followCountIncrement.style = 'display: none;'
            followCountDecrement.style = 'display: none;'
          }
        } else {
          this.$router.push('/signUp')
        }
      } catch (error) {
        // eslint-disable-next-line
        console.error(error);
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
