<template>
  <div class="content-padding text-center d-flex flex-column justify-center main">
    <div class="mb-8">
      <h1 class="text-h3 mb-8 font-weight-bold">
        Join The Coding Insight.
      </h1>
      <h4 class="text-h5 mb-2">
        Sign in to be able to <b>Like</b> and <b>Save</b> articles to read later. Also, get exclusive member-only content.
      </h4>
    </div>
    <!-- Sign In With Google button -->
    <div class="ma-0 pa-0 d-flex flex-column justify-center align-center">
      <img src="/google-signin-btn.png" alt="Google Sign In Button" class="signin-btn" @click="signInWithGoogle()">
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import getFirebase from '~/plugins/firebase'

export default {
  name: 'SignUp',
  layout: 'home',
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
.main {
  height: 90vh;
  background-size: cover;
  background-repeat: no-repeat;
}

.signin-btn {
  cursor: pointer;
  width: 200px;
  height: 48px;
  border-radius: 4px;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .main{
    background-image: url('/Background-Mobile.svg');
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .main{
    background-image: url('/Background-Mobile.svg');
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .main{
    background-image: url('/Background-Desktop.svg');
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .main{
    background-image: url('/Background-Desktop.svg');
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  .main{
    background-image: url('/Background-Desktop.svg');
  }
}

</style>
