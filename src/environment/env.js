const firebaseConfig = require(process.env.FIREBASE_CONFIG_PATH)

/**
 * Provides env variables for different environments such as production or development.
 *
 * If NODE_ENV = production then production env variables will be injected.
 * If NODE_ENV is anything other than that, then development env variables will be injected.
 *
 * In order to use this, create a '.env' file in the './src' folder.
 * And in that file, provide the required environment variables such as domain, function endpoints and firebase config.
 */
if (process.env.NODE_ENV === 'production') {
  module.exports = {
    baseUrl: process.env.BASE_URL,
    authEndpoint: process.env.FIREBASE_AUTH_ENDPOINT,
    adminClaimsEndpoint: process.env.FIREBASE_ADMIN_CLAIMS_ENDPOINT,
    firebaseConfig
  }
} else {
  module.exports = {
    baseUrl: process.env.BASE_URL_DEV,
    authEndpoint: process.env.FIREBASE_AUTH_ENDPOINT_DEV,
    adminClaimsEndpoint: process.env.FIREBASE_ADMIN_CLAIMS_ENDPOINT_DEV,
    firebaseConfig
  }
}
