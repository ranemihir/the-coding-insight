import uploadImageToFirebase from './../image-uploader/image-uploader.js'
import createBlogPost from './../blog-post-layout/BlogPostLayout'
import BlogPostViewModel from '~/viewmodel/BlogPostViewModel'
import CreateTopicViewModel from '~/viewmodel/CreateTopicViewModel'
import PostEditorViewModel from '~/viewmodel/PostEditorViewModel'
import TopicContainerViewModel from '~/viewmodel/TopicContainerViewModel'
import UserProfileViewModel from '~/viewmodel/UserProfileViewModel'
import HomeViewModel from '~/viewmodel/HomeViewModel'
import FeedViewModel from '~/viewmodel/FeedViewModel'

import env from '~/environment/env'

/**
 * Injecting allows it be used globally directly from the app object.
 */
export default ({ app }, inject) => {
  inject('topicContainerViewModel', TopicContainerViewModel)
  inject('blogPostViewModel', BlogPostViewModel)
  inject('userProfileViewModel', UserProfileViewModel)
  inject('createTopicViewModel', CreateTopicViewModel)
  inject('postEditorViewModel', PostEditorViewModel)
  inject('createBlogPost', createBlogPost)
  inject('uploadImageToFirebase', uploadImageToFirebase)
  inject('homeViewModel', HomeViewModel)
  inject('feedViewModel', FeedViewModel)
  inject('env', env)
}
