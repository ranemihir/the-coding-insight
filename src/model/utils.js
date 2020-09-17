import getFirebase from '~/plugins/firebase'

/**
 * Return db and FieldValue from firestore
 */
export default async function getUtils () {
  const firebase = await getFirebase()
  const db = firebase.firestore()
  const FieldValue = firebase.firestore.FieldValue

  return {
    db,
    FieldValue
  }
}
