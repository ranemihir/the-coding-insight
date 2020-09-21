<template>
  <div class="ma-0 pa-0">
    <!-- Topic creation form -->
    <v-form ref="createTopicForm" v-model="valid">
      <!-- Topic name input -->
      <v-text-field
        v-model="topicName"
        label="Topic Name"
        :counter="20"
        :rules="topicNameRules"
        required
      />
      <!-- Topic description input -->
      <v-textarea
        v-model="topicDescription"
        placeholder="Topic Description"
        rows="6"
        hint="Describe the topic in brief."
        :rules="topicDescriptionRules"
        required
      />
      <!-- Topic thumbnail input -->
      <client-only>
        <v-file-input
          v-model="topicThumbnail"
          class="mb-2"
          accept="image/*"
          placeholder="Topic Thumbnail"
          hint="This will be displayed as the topic logo."
          :rules="topicThumbnailRules"
          :counter="1"
          :show-size="1000"
          required
        />
      </client-only>
      <!-- Submit and Clear buttons -->
      <div class="ma-0 pa-0 d-flex flex-row justify-end align-center">
        <v-btn class="mt-8 mr-2" text @click="clearAllFields()">
          Clear
        </v-btn>
        <v-btn class="mt-8" color="primary" :disabled="!valid" @click="createTopic()">
          Create
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import ClientOnly from 'vue-client-only'

export default {
  name: 'CreateTopic',
  middleware: 'admin',
  layout: 'default',
  components: {
    ClientOnly
  },
  data () {
    return {
      valid: false,
      topicName: '',
      topicDescription: '',
      topicThumbnail: null,
      /**
       * Create topic form validation rules.
       */
      topicNameRules: [
        (v) => {
          if (v === '') {
            return 'Topic Name is required.'
          } else if (v.length >= 20) {
            return 'Topic Name must be less than 20 characters.'
          } else {
            return true
          }
        }
      ],
      topicDescriptionRules: [
        (v) => {
          if (v === '') {
            return 'Topic Description is required.'
          } else if (new RegExp('^[A-Z][A-Za-z]*').test(v) === false) {
            return 'Topic Description must start with a captial letter.'
          } else {
            return true
          }
        }
      ],
      topicThumbnailRules: [
        (v) => {
          if (!v) {
            return 'Topic Thumbnail is required.'
          } else if (v.size >= 1000000) {
            return 'Topic Thumbail must be smaller than 1 MB in size'
          } else {
            return true
          }
        }
      ]
    }
  },
  methods: {
    /**
     * Creates topic if provided data is valid; returns error otherwise.
     */
    async createTopic () {
      try {
        /**
         * Removes spaces between topic name words.
         */
        const topicName = this.topicName
          .split(' ')
          .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
          .join('')

        /**
         * Uploads topic thumbnail to firebase using image uplaoder
         */
        const result = await this.$uploadImageToFirebase(
          this.topicThumbnail,
          '/topics/' + topicName
        )

        /**
         * If uploadation of thumbnail is successful, gets the url and creates topic using it.
         */
        if (result.success === 1) {
          const topicThumbnailLink = await result.file.url

          const createTopic = await this.$createTopicViewModel.createTopic(
            topicName,
            this.topicDescription,
            topicThumbnailLink
          )

          /**
           * Redirect to '/' route adter topic is successfully created.
           */
          if (createTopic && createTopic != null) {
            return this.$router.push('/')
          } else {
            throw new Error('Topic creation failed.')
          }
        } else {
          throw new Error('Image upload to firebase error.')
        }
      } catch (err) {
        // eslint-disable-next-line
        console.error(err);
      }
    },
    /**
     * Clears all form fields.
     */
    clearAllFields () {
      this.topicName = ''
      this.topicDescription = ''
      this.topicThumbnail = null
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
