import Model from './Model'

/**
 * Topic Model Class
 */
class TopicModel extends Model {
  /**
   * Returns all topics data.
   *
   * @returns {Array<Promise>} topics - all topics and their data.
   */
  static async getAllTopics () {
    try {
      const db = await this.db()

      const topicsRef = await db.collection('topics').get()
      const topics = []
      await Promise.all(topicsRef.docs.map(async (doc) => {
        if (doc.exists) {
          const topic = await {
            name: doc.id,
            description: doc.data().description,
            thumbnailLink: doc.data().thumbnailLink,
            creationTime: doc.data().creationTime.toDate(),
            followersCount: await this.getFollowersCountOnTopic(doc.id)
          }

          topics.push(topic)
        }
      })).catch((error) => {
        // eslint-disable-next-line
        console.error(error)
      })

      return topics
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
    }
  }

  /**
   * Returns topic data for the provided topic name.
   *
   * @param {string} topicName
   *
   * @returns {Promise<object>} topic - return stopic data.
   */
  static async getTopicFromTopicName (topicName) {
    try {
      const db = await this.db()

      const doc = await db.collection('topics').doc(topicName).get()

      if (doc.exists) {
        return {
          name: doc.id,
          description: doc.data().description,
          thumbnailLink: doc.data().thumbnailLink,
          creationTime: doc.data().creationTime.toDate(),
          followersCount: await this.getFollowersCountOnTopic(doc.id)
        }
      } else {
        throw new Error(`Topic does not exist with name : ${topicName}`, 'INVALID_TOPIC_NAME')
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
    }
  }

  /**
   * Checks if topic exists or not.
   * Returns true if topic exists; false otherwise.
   *
   * @param {string} topicName
   *
   * @returns {Promise<boolean>} checkIfTopicExists - returns true if topic exists; false otherwise.
   */
  static async checkIfTopicExists (topicName) {
    try {
      const db = await this.db()

      const doc = await db.collection('topics').doc(topicName).get()

      if (doc.exists) {
        return true
      } else {
        return false
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
    }
  }

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
  static async createTopic (topicInput) {
    try {
      const db = await this.db()
      const FieldValue = await this.FieldValue()

      await db.collection('topics').doc(topicInput.name).set({
        description: topicInput.description,
        thumbnailLink: topicInput.thumbnailLink,
        creationTime: FieldValue.serverTimestamp()
      })

      return {
        name: topicInput.name,
        description: topicInput.description,
        thumbnailLink: topicInput.thumbnailLink,
        creationTime: new Date().toISOString(),
        followersCount: await this.getFollowersCountOnTopic(topicInput.name)
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
    }
  }

  /**
   * Returns the topic associated with the post for the provided id.
   *
   * @param {string} postId
   *
   * @returns {Promise<object>} topic - returns topic data.
   */
  static async getTopicOfPost (postId) {
    try {
      const db = await this.db()

      const postDoc = await db.collection('posts').doc(postId).get()

      if (postDoc.exists) {
        const topic = await this.getTopicFromTopicName(postDoc.data().topicName)
        return topic
      } else {
        throw new Error(`Post does not exist with id : ${postId}`, 'INVALID_POST_ID')
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
    }
  }

  /**
   * Returns followers count on topic with provided topic name.
   *
   * @param {string} topicName
   *
   * @returns {Promise<number>} followersCount - returns followers count on topic.
   */
  static async getFollowersCountOnTopic (topicName) {
    try {
      const db = await this.db()

      const usersRef = await db.collection('users').where('followedTopics', 'array-contains', topicName).get()
      const followersCount = await usersRef.docs.length

      return followersCount
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
    }
  }
}

export default TopicModel
