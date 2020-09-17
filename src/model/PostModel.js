import topicModel from './TopicModel'
import Model from './Model'

/**
 * Blogpost Model Class
 */
class PostModel extends Model {
  /**
   * Returns all uploaded blogposts.
   *
   * @returns {Array<object>} posts - all blogposts.
   */
  static async getAllPosts () {
    try {
      const db = await this.db()

      const allPosts = await db.collection('posts').orderBy('creationTime', 'desc').get()
      const posts = []

      await Promise.all(allPosts.docs.map(async (doc) => {
        if (doc.exists) {
          const post = await {
            id: doc.id,
            title: doc.data().title,
            caption: doc.data().caption,
            description: doc.data().description,
            creationTime: doc.data().creationTime.toDate(),
            topic: await topicModel.getTopicFromTopicName(doc.data().topicName),
            likesCount: await this.getLikesCountOnPost(doc.id),
            savedCount: await this.getSavedCountOnPost(doc.id)
          }

          posts.push(post)
        }
      })).catch((error) => {
        // eslint-disable-next-line
        console.error(error)
      })

      return posts
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
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
      const db = await this.db()

      const postsRef = await db.collection('posts')
        .where('topicName', '==', topicName)
        .orderBy('creationTime', 'desc')
        .get()

      const posts = []

      if (!postsRef.empty) {
        await Promise.all(postsRef.docs.map(async (doc) => {
          if (doc.exists) {
            const post = await {
              id: doc.id,
              title: doc.data().title,
              caption: doc.data().caption,
              description: doc.data().description,
              creationTime: doc.data().creationTime.toDate(),
              topic: await topicModel.getTopicFromTopicName(doc.data().topicName),
              likesCount: await this.getLikesCountOnPost(doc.id),
              savedCount: await this.getSavedCountOnPost(doc.id)
            }

            posts.push(post)
          } else {
            throw new Error(`Some error occurred while fetching posts of topic with name : ${topicName}`, 'QUERY_FAILED')
          }

          return null
        })).catch((error) => {
          // eslint-disable-next-line
          console.error(error)
          return null
        })

        return posts
      } else {
        const checkIfTopicExists = await topicModel.checkIfTopicExists(topicName)

        if (!checkIfTopicExists) {
          return new Error(`Topic does not exist with name : ${topicName}`, 'INVALID_TOPIC_NAME')
        }

        return []
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
    }
  }

  /**
   * Checks if blogpost exists or not based on its id.
   * Returns true if blogpost exists; false otherwise.
   *
   * @param {string} postId - blogpost id.
   *
   * @returns {Promise<boolean>} checkIfPostExists - returns true if blogpost exists; false otherwise.
   */
  static async checkIfPostExists (postId) {
    try {
      const db = await this.db()

      const postRef = await db.collection('posts').doc(postId).get()

      if (postRef.exists) {
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
   * Returns post data of the provided blogpost id.
   *
   * @param {string} postId- blogpost id.
   *
   * @returns {Promise<object>} post - returns blogpost data.
   */
  static async getPostFromId (postId) {
    try {
      const db = await this.db()

      const doc = await db.collection('posts').doc(postId).get()

      if (doc.exists) {
        return {
          id: doc.id,
          title: doc.data().title,
          caption: doc.data().caption,
          description: doc.data().description,
          creationTime: doc.data().creationTime.toDate(),
          topic: await topicModel.getTopicFromTopicName(doc.data().topicName),
          likesCount: await this.getLikesCountOnPost(doc.id),
          savedCount: await this.getSavedCountOnPost(doc.id)
        }
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
  static async createPost (postInput) {
    try {
      const db = await this.db()
      const FieldValue = await this.FieldValue()

      const post = {
        title: postInput.title,
        caption: postInput.caption,
        description: postInput.description,
        topicName: postInput.topicName,
        creationTime: FieldValue.serverTimestamp(),
        likes: []
      }

      const postRef = await db.collection('posts').add(post)

      if (postRef.id) {
        return {
          id: postRef.id,
          title: postInput.title,
          caption: postInput.caption,
          description: postInput.description,
          creationTime: new Date().toISOString(),
          topic: await topicModel.getTopicFromTopicName(postInput.topicName),
          likesCount: await this.getLikesCountOnPost(postRef.id),
          savedCount: await this.getSavedCountOnPost(postRef.id)
        }
      } else {
        throw new Error('Some error occurred while creating post', 'POST_MUTATION_FAILED')
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
    }
  }

  /**
   * Edites and returns edited blogpost based on provided data and blogpost id.
   *
   * @param {object} postInput - minimum data required for creating a blogpost.
   * @param {string} postInput.title - title of the blogpost.
   * @param {string} postInput.caption - caption of the blogpost.
   * @param {string} postInput.topicName - name of the topic associated with blogpost.
   * @param {string} postInput.description - blogpost description body.
   *
   * @returns {Promise<object>} post - returns blogpost data.
   */
  static async editPost (postId, postInput) {
    try {
      const db = await this.db()

      const doc = await db.collection('posts').doc(postId).update({
        title: postInput.title,
        caption: postInput.caption,
        description: postInput.description,
        topicName: postInput.topicName
      })
      if (doc) {
        return {
          id: postId,
          title: postInput.title,
          caption: postInput.caption,
          description: postInput.description
        }
      } else {
        const checkIfPostExists = await this.checkIfPostExists(postId)

        if (checkIfPostExists) {
          throw new Error(`Post does not exist with id : ${postId}`, 'INVALID_POST_ID')
        }

        throw new Error('Some error occurred while editing post', 'POST_MUTATION_FAILED')
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
    }
  }

  /**
   * Deletes blogpost with the provided id.
   * Returns true if operation is successful; false otherwise.
   *
   * @param {string} postId - blogpost id.
   *
   * @returns {Promise<boolean>} checkIfPostIsDeleted - returns true if operation is successful; false otherwise.
   */
  static async deletePost (postId) {
    try {
      const db = await this.db()

      const value = await db.collection('posts').doc(postId).delete()

      if (value) {
        return true
      } else {
        const checkIfPostExists = await this.checkIfPostExists(postId)

        if (checkIfPostExists) {
          throw new Error(`Post does not exist with id : ${postId}`, 'INVALID_POST_ID')
        }

        throw new Error('Some error occurred while deleting post', 'POST_MUTATION_FAILED')
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
    }
  }

  /**
   * Returns likes count on blogpost with provided id.
   *
   * @param {string} postId - blogpost id.
   *
   * @returns {Promise<number>} - returns likes count on blogpost.
   */
  static async getLikesCountOnPost (postId) {
    try {
      const db = await this.db()

      const postRef = await db.collection('posts').doc(postId).get()

      if (postRef.exists) {
        const likesCount = await postRef.data().likes.length
        return likesCount
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
   * Returns count of the users which saved the blogpost with the provided id.
   *
   * @param {string} postId - blogpost id.
   *
   * @returns {Promise<number>} - returns saved count on blogpost.
   */
  static async getSavedCountOnPost (postId) {
    try {
      const db = await this.db()

      const usersRef = await db.collection('users').where('savedPosts', 'array-contains', postId).get()

      return usersRef.docs.length
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return null
    }
  }
}

export default PostModel
