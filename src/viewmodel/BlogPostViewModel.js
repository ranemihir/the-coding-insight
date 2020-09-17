import userModel from './../model/UserModel'
import postModel from './../model/PostModel'
import topicModel from './../model/TopicModel'

class BlogPostViewModel {
  /**
   * Takes id of the post as input and returns a promise which resolves to the post data.
   *
   * @param {string} postId - Id of post to be retrieved.
   *
   * @returns {Promise<object>} post - post data.
   */
  static async getPostFromId (postId) {
    try {
      return await postModel.getPostFromId(postId)
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
    }
  }

  /**
   * Takes id of the topic as input and returns a promise which resolves to the topic data.
   *
   * @param {string} topicName - (unique) name of topic to be retrieved.
   *
   * @returns {Promise<object>} topic - topic data.
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
   * Checks if post with provided id is liked by user with provided id.
   * Returns true if post is liked by user; false otherwise.
   *
   * @param {string} userId
   * @param {string} postId - blogpost id.
   *
   * @returns {Promise<boolea>} checkIfPostIsLikedByUser - true if post is liked by user; false otherwise.
   */
  static async checkIfPostIsLikedByUser (userId, postId) {
    try {
      return await userModel.checkIfPostIsLikedByUser(userId, postId)
    } catch (error) {
    // eslint-disable-next-line
    console.error(error)
    }
  }

  /**
   * Checks if post saved by user or not.
   * Returns true if post is saved by user; false otherwise.
   *
   * @param {string} userId
   * @param {string} postId - blogpost id.
   *
   * @returns {Promise<boolean>} checkIfPostIsSavedbyUser - returns true if post is saved by user; false otherwise.
   */
  static async checkIfPostIsSavedByUser (userId, postId) {
    try {
      return await userModel.checkIfPostIsSavedbyUser(userId, postId)
    } catch (error) {
    // eslint-disable-next-line
    console.error(error)
    }
  }

  /**
   * Performs like operation on user and post.
   *
   * @param {string} userId
   * @param {string} postId - blogpost id.
   *
   * @returns {Promise<object>} post - returns post data.
   */
  static async likePost (userId, postId) {
    try {
      return await userModel.likePost(userId, postId)
    } catch (error) {
    // eslint-disable-next-line
    console.error(error)
    }
  }

  /**
   * Performs dislike operation on user and post.
   *
   * @param {string} userId
   * @param {string} postId - blogpost id.
   *
   * @returns {Promise<object>} post - returns post data.
   */
  static async dislikePost (userId, postId) {
    try {
      return await userModel.dislikePost(userId, postId)
    } catch (error) {
    // eslint-disable-next-line
    console.error(error)
    }
  }

  /**
   * Performs save operation on user and post.
   *
   * @param {string} userId
   * @param {string} postId - blogpost id.
   *
   * @returns {Promise<object>} post - returns post data.
   */
  static async savePost (userId, postId) {
    try {
      return await userModel.savePost(userId, postId)
    } catch (error) {
    // eslint-disable-next-line
    console.error(error)
    }
  }

  /**
   * Performs unsave operation on user and post.
   *
   * @param {string} userId
   * @param {string} postId - blogpost id.
   *
   * @returns {Promise<object>} post - returns post data.
   */
  static async unsavePost (userId, postId) {
    try {
      return await userModel.unsavePost(userId, postId)
    } catch (error) {
    // eslint-disable-next-line
    console.error(error)
    }
  }
}

export default BlogPostViewModel
