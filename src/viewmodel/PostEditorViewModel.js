import topicModel from './../model/TopicModel'
import postModel from './../model/PostModel'

class PostEditorViewModel {
  /**
   * Returns all topics data.
   *
   * @returns {Array<Promise>} topics - all topics and their data.
   */
  static async getAllTopics () {
    try {
      return await topicModel.getAllTopics()
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
    }
  }

  /**
   * Creates and returns created blogpost based on provided data.
   *
   * @param {object} postInput - minimum data required for creating a blogpost.
   * @param {string} postInput.title - title of the blogpost.
   * @param {string} postInput.caption - caption of the blogpost.
   * @param {string} postInput.topicName - name of the topic associated with blogpost.
   * @param {string} postInput.description - blogpost description body.
   *
   * @returns {Promise<object>} post - returns blogpost data.
   */
  static async createPost (
    postTopicName,
    postTitle,
    postCaption,
    postDescription
  ) {
    try {
      return await postModel.createPost(
        {
          topicName: postTopicName,
          title: postTitle,
          caption: postCaption,
          description: postDescription
        }
      )
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
    }
  }
}

export default PostEditorViewModel
