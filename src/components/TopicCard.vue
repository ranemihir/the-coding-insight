<template>
  <!-- Topic Card component -->
  <v-list-item>
    <!-- Topic thumbnail -->
    <v-list-item-avatar size="8%" style="border-radius: 0;" left @click="navigateToTopic()">
      <v-img :src="$props.topicThumbnailLink" :alt="getTopicName + ' Thumbnail'" />
    </v-list-item-avatar>
    <!-- Topic Data -->
    <v-list-item-content>
      <!-- Title of the topic -->
      <v-list-item-title class="mb-0 pb-0 title" style="cursor: pointer;" @click="navigateToTopic()">
        {{ getTopicName }}
      </v-list-item-title>
      <!-- Topic followers count -->
      <v-list-item-subtitle class="font-weight-light body-2">
        <span id="follow-count">{{ $props.topicFollowersCount }}</span>
        <client-only>
          <span
            id="follow-count-increment"
            style="display: none;"
          >{{ $props.topicFollowersCount + 1 }}</span>
          <span
            id="follow-count-decrement"
            style="display: none;"
          >{{ $props.topicFollowersCount - 1 }}</span>
        </client-only>
        <span>Following</span>
      </v-list-item-subtitle>
    </v-list-item-content>
    <!-- Topic Follow/Unfollow button -->
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
</template>

<script>
import ClientOnly from 'vue-client-only'

export default {
  name: 'TopicCard',
  components: {
    ClientOnly
  },
  props: {
    topicName: {
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
#follow-btn{
  display: none;
}

#unfollow-btn {
  display: initial;
}
</style>
