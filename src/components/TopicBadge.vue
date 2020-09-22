<template>
  <!-- Topic Card component -->
  <span class="d-flex flex-column justify-space-between align-center" style="cursor: pointer;" @click="navigateToTopic()">
    <!-- Topic thumbnail -->
    <v-avatar size="10%" width="40px" style="border-radius: 0;" class="ma-2 pa-0">
      <v-img :src="$props.topicThumbnailLink" :alt="getTopicName + ' Thumbnail'" />
    </v-avatar>
    <!-- Title of the topic -->
    <span class="topic-name text-center my-2">
      {{ getTopicName }}
    </span>
  </span>
</template>

<script>

export default {
  name: 'TopicBadge',
  props: {
    topicName: {
      type: String,
      default: null
    },
    topicThumbnailLink: {
      type: String,
      default: null
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
    }
  }
}
</script>

<style lang="scss" scoped>
.topic-name{
  line-height: 16px;
  width: 80px;
  font-weight: 500;
}
</style>
