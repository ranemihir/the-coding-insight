import getFirebase from '~/plugins/firebase'

/**
 * Uploads files to firebase storage (ref - images) and returns its download url.
 * This method is used as anuploader for Editor.js image tool as custom backend file uploader.
 *
 * @param {object} file - file to be uploaded.
 * @param {string} fileName - Name to be given to the file being uploaded.
 *
 * @returns {object} response - according the documentation of the Editor.js image tool.
 * @returns {number} response.success - 1 if upload is successful; 0 otherwise.
 * @returns {string} response.url - url from which image can be downloaded.
 */
export default async function (file, fileName) {
  try {
    if (file && file !== null && fileName && fileName !== null && fileName !== '') {
      const firebase = await getFirebase()

      /**
       * Takes 'images/' as storage ref.
       */
      const storageRef = await firebase.storage().ref('images/')

      /**
       * Uploads file with file name to the image ref.
       */
      const snapshot = await storageRef.child(fileName).put(file)

      /**
       * Gets the url of the ref where file is stored.
       */
      const downloadUrl = await snapshot.ref.getDownloadURL()

      if (downloadUrl) {
        return {
          success: 1,
          file: {
            url: downloadUrl
          }
        }
      } else {
        throw new Error('An error occurred while uploading image file.')
      }
    } else {
      throw new Error('Invalid input provided.')
    }
  } catch (error) {
    // eslint-disable-next-line
    console.error(error)
    return {
      success: 0,
      file: {
        url: undefined
      }
    }
  }
}
