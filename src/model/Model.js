import getUtils from './utils'

/**
 * Primary model class to be extended by other model classes
 */
class Model {
  /**
   * get db object of firebase.firestore().
   */
  static async db () {
    const { db } = await getUtils()
    return db
  }

  /**
   * get FielValue property of firestore.
   */
  static async FieldValue () {
    const { FieldValue } = await getUtils()
    return FieldValue
  }
}

export default Model
