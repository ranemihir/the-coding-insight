/**
 * If no user is signed in, redirect to '/signUp' route.
 *
 * @param {object} param
 * @param {object} param.app - nuxt app object.
 * @param {object} param.redirect - used to redirect to any route.
 * @param {object} param.error - error object to redirect to error page with custom provided message.
 */
export default function ({ app, redirect, error }) {
  try {
    const currentUser = app.$cookies.get('__session')

    if (!currentUser || currentUser == null) {
      redirect('/signUp')
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
