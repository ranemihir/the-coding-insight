import axios from 'axios'
import getFirebase from '~/plugins/firebase'

/**
 * Checks if the given user is admin using OAuth 2 tokens.
 *
 * @param {object} param
 * @param {object} param.app - nuxt app object.
 * @param {object} param.error - error object to redirect to error page with custom provided message.
 */
export default async function ({ app, error }) {
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
        await firebase.auth().signInWithCustomToken(response.data.custom_token)
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
    console.error(errorObj)
    /**
     * Once an error is thrown, user will be redirected to error page.
     */
    error({ statusCode: 404, message: '404 Not Found' })
  }
}
