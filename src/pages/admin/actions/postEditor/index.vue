<template>
  <div class="ma-0 pa-0">
    <!-- blogpost title editor -->
    <textarea
      id="post-title-input"
      v-model="postTitle"
      placeholder="Post Title"
      class="display-2 mb-1"
      rows="1"
    />
    <!-- Editor.js is used as blogpost editor -->
    <client-only>
      <div id="editorjs" />
    </client-only>
    <!-- upload button -->
    <v-btn
      fab
      color="primary"
      large
      class="publish-btn elevation-4"
      @click="openUploadDialog = true"
    >
      <v-icon color="white">
        {{ mdiPublish }}
      </v-icon>
    </v-btn>
    <!-- Blogpost upload form -->
    <v-dialog
      v-model="openUploadDialog"
      :width="200"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card dark>
        <v-toolbar>
          <!-- Close button -->
          <v-btn icon @click="openUploadDialog = false">
            <v-icon>{{ mdiClose }}</v-icon>
          </v-btn>
          <v-toolbar-title class="font-weight-bold">
            Publish Post
          </v-toolbar-title>
          <v-spacer />
          <!-- publish post button -->
          <v-toolbar-items>
            <v-btn text :disabled="!valid" color="primary" @click="createPost()">
              Publish
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div class="px-6 pb-2 pt-6">
          <!-- blogpost upload form asking for topic and caption -->
          <v-form ref="publishPostForm" v-model="valid">
            <v-select
              v-model="postTopicName"
              :items="topics"
              label="Select a topic"
              hint="Select a suitable topic for your post."
              :rules="postTopicRules"
              required
            />
            <v-textarea
              v-model="postCaption"
              label="Enter a caption for your post..."
              hint="This caption will be displayed along with title on other pages."
              :counter="100"
              rows="10"
              :rules="postCaptionRules"
              required
            />
          </v-form>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ClientOnly from 'vue-client-only'
import { v4 as uuidv4 } from 'uuid'
import { mdiPublish, mdiClose } from '@mdi/js'
import axios from 'axios'
import getFirebase from '~/plugins/firebase'

export default {
  name: 'PostEditor',
  middleware: async ({ app, error }) => {
    try {
      if (app.$cookies.get('__session') != null) {
        /**
         * Sends current user uid to backend for verification.
         */
        const response = await axios.post(app.$env.adminClaimsEndpoint, {
          uid: app.$cookies.get('__session').uid
        })

        /**
         * If the verfication is successful, a custom token will be sent from backend containing admin claims.
         * If verification falied, throw error.
         */
        if (response && response.data && response.data.custom_token) {
          const firebase = await getFirebase()
          /**
           * Custom token is used a to sign in and get the id token which contains the admin claims.
           */
          await firebase
            .auth()
            .signInWithCustomToken(response.data.custom_token)
          const idToken = await firebase.auth().currentUser.getIdTokenResult()

          /**
           * if the id token does not containnthe admin claims, then throw error.
           */
          if (!idToken.claims.admin) {
            error({ statusCode: 404, message: '404 Not Found' })
          }
        } else {
          error({ statusCode: 404, message: '404 Not Found' })
        }
      } else {
        error({ statusCode: 404, message: '404 Not Found' })
      }
    } catch (errorObj) {
      // eslint-disable-next-line
      console.error(errorObj);
      /**
       * Once an error is thrown, user will be redirected to error page.
       */
      error({ statusCode: 404, message: '404 Not Found' })
    }
  },
  layout: 'default',
  components: {
    ClientOnly
  },
  async asyncData ({ app, error }) {
    try {
      const getAllTopics = await app.$postEditorViewModel.getAllTopics()
      const topics = []

      if (getAllTopics && getAllTopics != null) {
        await Promise.all(
          getAllTopics.map(async (topic) => {
            const _topic = await {
              text: topic.name.match(/[A-Z][a-z]+|[0-9]+/g).join(' '),
              value: topic.name
            }

            await topics.push(_topic)
          })
        )

        return { topics }
      } else {
        throw new Error('Some error occurred while fetching all topics')
      }
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
      error({ statusCode: 404, message: 'Topic not found' })
    }
  },
  data () {
    return {
      mdiPublish,
      mdiClose,
      editor: null,
      /**
       * blogpost related data.
       */
      postTitle: '',
      postTopicName: '',
      postCaption: '',
      published: false,
      openUploadDialog: false,
      allTopics: [],
      /**
       * fPublish post form validation rules.
       */
      valid: false,
      postCaptionRules: [
        (v) => {
          if (v === '') {
            return 'Post caption is required.'
          } else if (new RegExp('^[A-Z][A-Za-z]*').test(v) === false) {
            return 'Post caption must start with a captial letter.'
          } else {
            return true
          }
        }
      ],
      postTopicRules: [
        (v) => {
          if (v === '') {
            return 'A suitable topic for post is required.'
          } else {
            return true
          }
        }
      ]
    }
  },
  async mounted () {
    /**
     * Changes to light mode for vuetify.
     */
    this.$vuetify.theme.dark = false

    /**
     * Uses autosize on blog title input.
     */
    const autosize = require('autosize')
    autosize(document.getElementById('post-title-input'))

    /**
     * Creates editor.js instance.
     */
    this.editor = await this.createEditorInstance()
  },
  methods: {
    /**
     * Creates post using viewmodel method.
     */
    async createPost () {
      try {
        const postDescription = JSON.stringify(await this.editor.save())

        const createPost = await this.$postEditorViewModel.createPost(
          this.$data.postTopicName,
          this.$data.postTitle,
          this.$data.postCaption,
          postDescription
        )

        if (createPost && createPost !== null) {
          return this.$router.push('/')
        } else {
          throw new Error('Some error occurred while creating post')
        }
      } catch (err) {
        // eslint-disable-next-line
        console.error(err);
      }
    },
    /**
     * Create Editor.js instance.
     */
    async createEditorInstance () {
      const componentObj = this

      if (process.client) {
        const {
          EditorJS,
          ImageTool,
          List,
          Gist,
          Code,
          InlineCode,
          Embed,
          Marker,
          Header,
          Math
        } = await import('~/plugins/editor')

        /**
         * Creates and returns new Editor.js instance with required tools and config.
         */
        return new EditorJS({
          holder: 'editorjs',
          autofocus: false,
          placeholder: "Don't hold back, speak your heart out...",
          tools: {
            inlineCode: InlineCode,
            embed: Embed,
            marker: Marker,
            header: {
              class: Header,
              config: {
                levels: [2],
                defaultLevel: 2
              }
            },
            image: {
              class: ImageTool,
              inlineToolbar: false,
              config: {
                uploader: {
                  async uploadByFile (file) {
                    try {
                      const result = await componentObj.$uploadImageToFirebase(
                        file,
                        '/posts/' + uuidv4()
                      )

                      return result
                    } catch (error) {
                      // eslint-disable-next-line
                      console.error(error);
                    }
                  }
                }
              }
            },
            list: List,
            code: Code,
            gist: Gist,
            math: Math
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.publish-btn {
  position: fixed;
  z-index: 10;
  bottom: 20px;
  right: 20px;
}

#post-title-input {
  border: none;
  border-color: transparent;
  outline: 0 !important;
  font-weight: 600;
  overflow: hidden;
  resize: none;
  width: 100%;
}

@media only screen and (min-width: 1050px) {
  #editorjs {
    margin-left: -17%;
  }
}
</style>
