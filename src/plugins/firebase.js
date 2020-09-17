const env = require('~/environment/env')

export default async function getFirebase () {
  try {
    const firebase = await import('firebase/app')
    await import('firebase/firestore')
    await import('firebase/auth')
    await import('firebase/storage')

    /**
     * Initializes firebase app.
     */
    if (!firebase.apps.length) {
      firebase.initializeApp(env.firebaseConfig)
    }

    return firebase
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
}
