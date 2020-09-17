import userModel from './../model/UserModel'

class UserProfileViewModel {
  /**
   * Returns saved posts data by user with provided id.
   *
   * @param {string} userId
   *
   * @returns {Array<object>} topics - returns saved posts data.
   */
  static async getAllSavedPostsByUser (userId) {
    try {
      return await userModel.getAllSavedPostsByUser(userId)
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
    }
  }

  /**
   * Returns data of all followed topics by user with provided id.
   *
   * @param {string} userId
   *
   * @returns {Array<object>} topics - returns all followed topics data by user.
   */
  static async getAllFollowedTopicsByUser (userId) {
    try {
      return await userModel.getAllFollowedTopicsByUser(userId)
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
    }
  }
}

export default UserProfileViewModel
