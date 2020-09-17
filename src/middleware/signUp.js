/**
 * If a user is signed in, redirect the user to '/' route.
 *
 * @param {object} param
 * @param {object} param.app - nuxt app object.
 * @param {object} param.redirect - used to redirect to any route.
 * @param {object} param.error - error object to redirect to error page with custom provided message.
 */
export default async function ({ app, redirect, error }) {
  try {
    const currentUser = await app.$cookies.get('__session')

    if (currentUser && currentUser != null) {
      redirect('/')
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
