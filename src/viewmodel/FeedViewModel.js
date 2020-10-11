import postModel from './../model/PostModel'
import topicModel from './../model/TopicModel'

class FeedViewModel {
  /**
   * Returns all blogposts.
   *
   * @returns {Array<object>} posts - returns all blogposts.
   */
  static async getAllPosts () {
    try {
      return await postModel.getAllPosts()
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
    }
  }

  /**
   * Returns all topics.
   *
   * @returns {Array<object>} topics - returns all topics.
   */
  static async getAllTopics () {
    try {
      return await topicModel.getAllTopics()
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
    }
  }
}

export default FeedViewModel
