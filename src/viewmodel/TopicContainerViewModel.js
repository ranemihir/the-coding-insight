import topicModel from './../model/TopicModel'
import userModel from './../model/UserModel'
import postModel from './../model/PostModel'

class TopicContainerViewModel {
  /**
   * Returns topic data for the provided topic name.
   *
   * @param {string} topicName
   *
   * @returns {Promise<object>} topic - return stopic data.
   */
  static async getTopicFromTopicName (topicName) {
    try {
      return await topicModel.getTopicFromTopicName(topicName)
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
    }
  }

  /**
   * Checks if provided topic is followed by user.
   * Returns true if topic is followed by user; false otherwise.
   *
   * @param {string} userId
   * @param {string} topicName - name of the topic provided.
   *
   * @returns {Promise<boolean>} checkIfTopicIsFollowedByUser - returns true if topic is followed by user; false otherwise.
   */
  static async checkIfTopicIsFollowedByUser (userId, topicName) {
    try {
      return await userModel.checkIfTopicIsFollowedByUser(userId, topicName)
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
    }
  }

  /**
   * Returns all blogposts of the given topic name.
   *
   * @param {string} topicName
   *
   * @returns {Array<object>} posts - returns all blogposts of topic.
   */
  static async getAllPostsOnTopic (topicName) {
    try {
      return await postModel.getAllPostsOnTopic(topicName)
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
    }
  }

  /**
   * Performs follow operation on user and topic.
   *
   * @param {string} userId
   * @param {string} topicName - name of the topic provided.
   *
   * @returns {Promise<object>} topic - topic data.
   */
  static async followTopic (userId, topicName) {
    try {
      return await userModel.followTopic(userId, topicName)
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
    }
  }

  /**
   * Performs unfollow operation on user and topic.
   *
   * @param {string} userId
   * @param {string} topicName - name of the topic provided.
   *
   * @returns {Promise<object>} topic - topic data.
   */
  static async unfollowTopic (userId, topicName) {
    try {
      return await userModel.unfollowTopic(userId, topicName)
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
    }
  }
}

export default TopicContainerViewModel
