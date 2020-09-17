<template>
  <div class="ma-0 pa-0">
    <!-- Sign In With Google button -->
    <v-btn class="d-flex flex-row justify-space-between" @click="signInWithGoogle()">
      <span>Sign in with Google</span>
    </v-btn>
  </div>
</template>

<script>
import axios from 'axios'
import getFirebase from '~/plugins/firebase'

export default {
  name: 'SignUp',
  layout: 'default',
  middleware: 'signUp',
  methods: {
    /**
     * Signs in user with Google using OAuth 2.0.
     */
    async signInWithGoogle () {
      try {
        const firebase = await getFirebase()

        const provider = await new firebase.auth.GoogleAuthProvider()
        /**
         * Pop up for Google sign in.
         */
        const result = await firebase.auth().signInWithPopup(provider)

        /**
         * User will be provided an id token after successful Google sign in.
         */
        if (result.user && process.client) {
          const idToken = await result.user.getIdToken()
          /**
           * id token is sent to backend for verfication.
           */
          const response = await axios.post(this.$env.authEndpoint, { id_token: idToken })

          /**
           * Once verified the backend sends a custom token which can be used to sign in securely.
           */
          if (response && response.data && response.data.custom_token) {
            const data = await firebase.auth().signInWithCustomToken(response.data.custom_token)
            await this.$cookies.set('__session', data.user)
            await window.location.reload(true)
            await this.$router.push('/')
          } else {
            throw new Error('Invalid id token.')
          }
        } else {
          throw new Error('Google sign in error.')
        }
      } catch (error) {
        // eslint-disable-next-line
        console.error(error)
      }
    }
  },
  head () {
    return {
      title: 'Sign Up'
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
