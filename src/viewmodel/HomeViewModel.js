import topicModel from './../model/TopicModel'

class HomeViewModel {
  static async getAllTopics () {
    try {
      return await topicModel.getAllTopics()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }
}

export default HomeViewModel
