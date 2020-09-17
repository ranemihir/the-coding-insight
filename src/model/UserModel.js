import topicModel from './TopicModel'
import postModel from './PostModel'
import Model from './Model'

/**
 * User Model Class
 */
class UserModel extends Model {
  /**
   * Checks if user with provided id exists or not.
   * Returns true if user exists; false otherwise.
   *
   * @param {string} userId
   *
   * @returns {Promise<boolean>} checkIfUserExists - true if user exists; false otherwise.
   */
  static async checkIfUserExists (userId) {
    try {
      const db = await this.db()
      const userRef = await db.collection('users').doc(userId).get()

      if (userRef.exists) {
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
   * Checks if post with provided id is liked by user with provided id.
   * Returns true if post is liked by user; false otherwise.
   *
   * @param {string} userId
   * @param {string} postId - blogpost id.
   *
   * @returns {Promise<boolean>} checkIfPostIsLikedByUser - true if post is liked by user; false otherwise.
   */
  static async checkIfPostIsLikedByUser (userId, postId) {
    try {
      const db = await this.db()

      const userRef = await db.collection('users').doc(userId).get()

      if (userRef.exists) {
        const postRef = await db.collection('posts').doc(postId).get()

        if (postRef.exists) {
          if (postRef.data().likes.includes(userId)) {
            return true
          } else {
            return false
          }
        } else {
          throw new Error(`Post does not exist with id : ${postId}`, 'INVALID_POST_ID')
        }
      } else {
        throw new Error(`User does not exist with id : ${userId}`, 'INVALID_USER_ID')
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
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
      const db = await this.db()
      const FieldValue = await this.FieldValue()

      const userRef = await db.collection('users').doc(userId).get()

      if (userRef.exists) {
        const checkIfPostExists = await postModel.checkIfPostExists(postId)

        if (checkIfPostExists) {
          const checkIfPostIsLikedByUser = await this.checkIfPostIsLikedByUser(userId, postId)

          if (!checkIfPostIsLikedByUser) {
            await db.collection('posts').doc(postId).update({
              likes: FieldValue.arrayUnion(userId)
            })

            return postModel.getPostFromId(postId)
          } else {
            throw new Error(`User with id : ${userId} has already liked post with id : ${postId}`, 'INVALID_OPERTION')
          }
        } else {
          throw new Error(`Post does not exist with id : ${postId}`, 'INVALID_POST_ID')
        }
      } else {
        throw new Error(`User does not exist with id : ${userId}`, 'INVALID_USER_ID')
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
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
      const db = await this.db()
      const FieldValue = await this.FieldValue()

      const userRef = await db.collection('users').doc(userId).get()

      if (userRef.exists) {
        const checkIfPostExists = await postModel.checkIfPostExists(postId)

        if (checkIfPostExists) {
          const checkIfPostIsLikedByUser = await this.checkIfPostIsLikedByUser(userId, postId)

          if (checkIfPostIsLikedByUser) {
            await db.collection('posts').doc(postId).update({
              likes: FieldValue.arrayRemove(userId)
            })

            return postModel.getPostFromId(postId)
          } else {
            throw new Error(`User with id : ${userId} has already liked post with id : ${postId}`, 'INVALID_OPERTION')
          }
        } else {
          throw new Error(`Post does not exist with id : ${postId}`, 'INVALID_POST_ID')
        }
      } else {
        throw new Error(`User does not exist with id : ${userId}`, 'INVALID_USER_ID')
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
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
  static async checkIfPostIsSavedbyUser (userId, postId) {
    try {
      const db = await this.db()

      const doc = await db.collection('users').doc(userId).get()

      if (doc.exists) {
        if (await doc.data().savedPosts.includes(postId)) {
          return true
        } else {
          return false
        }
      } else {
        const checkIfUserExists = await this.checkIfUserExists(userId)

        if (checkIfUserExists) {
          const checkIfPostExists = await postModel.checkIfPostExists(postId)

          if (!checkIfPostExists) {
            throw new Error(`Post does not exist with id : ${postId}`, 'INVALID_POST_ID')
          }
        } else {
          throw new Error(`User does not exist with id : ${userId}`, 'INVALID_USER_ID')
        }

        return false
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
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
      const db = await this.db()
      const FieldValue = await this.FieldValue()

      const checkIfUserExists = await this.checkIfUserExists(userId)

      if (checkIfUserExists) {
        const checkIfPostExists = await postModel.getPostFromId(postId)

        if (checkIfPostExists) {
          const checkIfPostIsSavedbyUser = await this.checkIfPostIsSavedbyUser(userId, postId)

          if (!checkIfPostIsSavedbyUser) {
            await db.collection('users').doc(userId).update({
              savedPosts: FieldValue.arrayUnion(postId)
            })

            return await postModel.getPostFromId(postId)
          } else {
            throw new Error(`Post with id : ${postId} is already saved by user with id : ${userId}`, 'INVALID_OPERATION')
          }
        } else {
          throw new Error(`Post does not exist with id : ${postId}`, 'INVALID_POST_ID')
        }
      } else {
        throw new Error(`User does not exist with id : ${userId}`, 'INVALID_USER_ID')
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
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
      const db = await this.db()
      const FieldValue = await this.FieldValue()

      const checkIfUserExists = await this.checkIfUserExists(userId)

      if (checkIfUserExists) {
        const checkIfPostExists = await postModel.getPostFromId(postId)

        if (checkIfPostExists) {
          const checkIfPostIsSavedbyUser = await this.checkIfPostIsSavedbyUser(userId, postId)

          if (checkIfPostIsSavedbyUser) {
            await db.collection('users').doc(userId).update({
              savedPosts: FieldValue.arrayRemove(postId)
            })

            return await postModel.getPostFromId(postId)
          } else {
            throw new Error(`Post with id : ${postId} is not saved by user with id : ${userId}`, 'INVALID_OPERATION')
          }
        } else {
          throw new Error(`Post does not exist with id : ${postId}`, 'INVALID_POST_ID')
        }
      } else {
        throw new Error(`User does not exist with id : ${userId}`, 'INVALID_USER_ID')
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
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
      const db = await this.db()

      const userRef = await db.collection('users').doc(userId).get()

      if (userRef.exists) {
        if (await userRef.data().followedTopics.includes(topicName)) {
          return true
        } else {
          return false
        }
      } else {
        const checkIfUserExists = await this.checkIfUserExists(userId)

        if (checkIfUserExists) {
          const checkIfTopicExists = await topicModel.checkIfTopicExists(topicName)

          if (!checkIfTopicExists) {
            throw new Error(`Topic does not exist with name : ${topicName}`, 'INVALID_TOPIC_NAME')
          }
        } else {
          throw new Error(`User does not exist with id : ${userId}`, 'INVALID_USER_ID')
        }

        return false
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
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
      const db = await this.db()
      const FieldValue = await this.FieldValue()

      const checkIfUserExists = await this.checkIfUserExists(userId)

      if (checkIfUserExists) {
        const checkIfTopicExists = await topicModel.checkIfTopicExists(topicName)

        if (checkIfTopicExists) {
          const checkIfTopicIsFollowedByUser = await this.checkIfTopicIsFollowedByUser(userId, topicName)

          if (!checkIfTopicIsFollowedByUser) {
            await db.collection('users').doc(userId).update({
              followedTopics: FieldValue.arrayUnion(topicName)
            })

            return await topicModel.getTopicFromTopicName(topicName)
          } else {
            throw new Error(`User with id : ${userId} is already following topic with name : ${topicName}`, 'INVALID_OPERATION')
          }
        } else {
          throw new Error(`Topic does not exist with name : ${topicName}`, 'INVALID_TOPIC_NAME')
        }
      } else {
        throw new Error(`User does not exist with id : ${userId}`, 'INVALID_USER_ID')
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
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
      const db = await this.db()
      const FieldValue = await this.FieldValue()

      const checkIfUserExists = await this.checkIfUserExists(userId)

      if (checkIfUserExists) {
        const checkIfTopicExists = await topicModel.checkIfTopicExists(topicName)

        if (checkIfTopicExists) {
          const checkIfTopicIsFollowedByUser = await this.checkIfTopicIsFollowedByUser(userId, topicName)

          if (checkIfTopicIsFollowedByUser) {
            await db.collection('users').doc(userId).update({
              followedTopics: FieldValue.arrayRemove(topicName)
            })

            return await topicModel.getTopicFromTopicName(topicName)
          } else {
            throw new Error(`User with id : ${userId} is not following topic with name : ${topicName}`, 'INVALID_OPERATION')
          }
        } else {
          throw new Error(`Topic does not exist with name : ${topicName}`, 'INVALID_TOPIC_NAME')
        }
      } else {
        throw new Error(`User does not exist with id : ${userId}`, 'INVALID_USER_ID')
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
    }
  }

  /**
   * Returns saved posts data by user with provided id.
   *
   * @param {string} userId
   *
   * @returns {Array<object>} topics - returns saved posts data.
   */
  static async getAllSavedPostsByUser (userId) {
    try {
      const db = await this.db()

      const userRef = await db.collection('users').doc(userId).get()
      const allPosts = []

      if (userRef.exists) {
        await Promise.all(userRef.data().savedPosts.map(async (postId) => {
          if (postId !== null) {
            const post = await postModel.getPostFromId(postId)
            allPosts.push(post)
          } else {
            throw new Error('Some error occurred by fetching saved posts by user', 'QUERY_FAILED')
          }

          return undefined
        })).catch((error) => {
          // eslint-disable-next-line
          console.error(error)
          throw new Error('An unknown error occurred', 'QUERY_FAILED')
        })
      } else {
        throw new Error(`User does not exist with id : ${userId}`, 'INVALID_USER_ID')
      }

      return allPosts
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
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
      const db = await this.db()

      const userRef = await db.collection('users').doc(userId).get()
      const allTopics = []

      if (userRef.exists) {
        await Promise.all(userRef.data().followedTopics.map(async (topicName) => {
          if (topicName) {
            const topic = await topicModel.getTopicFromTopicName(topicName)
            allTopics.push(topic)
          } else {
            throw new Error('Some error occurred by fetching followed topics of user', 'QUERY_FAILED')
          }

          return undefined
        })).catch((error) => {
          // eslint-disable-next-line
          console.error(error)
          return null
        })

        return allTopics
      } else {
        throw new Error(`User does not exist with id : ${userId}`, 'INVALID_USER_ID')
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return false
    }
  }
}

export default UserModel
