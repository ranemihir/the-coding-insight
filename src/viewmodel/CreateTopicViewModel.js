import topicModel from './../model/TopicModel'

class CreateTopicViewModel {
  /**
   * Creates topic and returns it, if the operations is successful.
   *
   * @param {object} topicInput - minimum required data for creating a topic.
   * @param {object} topicInput.name - name for topic which is also used as a unique id.
   * @param {object} topicInput.description - topic description.
   * @param {object} topicInput.thumbnailLink - url for the thumbnail of the topic.
   *
   * @returns {Promise<object>} topic - returns created topic data.
   */
  static async createTopic (
    topicName,
    topicDescription,
    topicThumbnailLink
  ) {
    try {
      return await topicModel.createTopic(
        {
          name: topicName,
          description: topicDescription,
          thumbnailLink: topicThumbnailLink
        }
      )
    } catch (error) {
    // eslint-disable-next-line
    console.error(error)
    }
  }
}

export default CreateTopicViewModel
