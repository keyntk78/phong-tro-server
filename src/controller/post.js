import { postService } from '../services'

const getPosts = async (req, res) => {
  try {
    const response = await postService.getPostsService()

    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'Failed at got controller: ' + error
    })
  }
}

const getPaginationPosts = async (req, res) => {
  const { page, priceNumber, areaNumber, ...query } = req.query

  try {
    const response = await postService.getPostsPaginationService(page, query, { priceNumber, areaNumber })

    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'Failed at got controller: ' + error
    })
  }
}

const getPaginationPostsAdmin = async (req, res) => {
  const { page, ...query } = req.query
  const { id } = req.user

  try {
    if (!id) return res.status(400).json({ err: 1, msg: 'Missing input' })
    const response = await postService.getPostsPaginationAdminService(page, query, id)

    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'Failed at got controller: ' + error
    })
  }
}

const getNewPosts = async (req, res) => {
  try {
    const response = await postService.getNewPostsService()

    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'Failed at got controller: ' + error
    })
  }
}

const createNewPost = async (req, res) => {
  try {
    const { categoryCode, title, priceNumber, areaNumber, label, ...payload } = req.body
    const { id } = req.user

    if (!categoryCode || !id || !title || !priceNumber || !areaNumber || !label) {
      return res.status(400).json({ err: 1, msg: 'Missing Input' })
    }

    const response = await postService.createNewPostService(req.body, id)

    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'Failed at got controller: ' + error
    })
  }
}

const updatePost = async (req, res) => {
  const { postId, attributeId, imageId, overviewId, ...payload } = req.body
  const { id } = req.user
  try {
    if (!postId || !id || !attributeId || !imageId || !overviewId) {
      return res.status(400).json({ err: 1, msg: 'Missing Input' })
    }

    const response = await postService.updatePostService(req.body)

    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'Failed at got controller: ' + error
    })
  }
}

const deletePost = async (req, res) => {
  const { postId, attributeId, imageId, overviewId } = req.query
  const { id } = req.user
  try {
    if (!postId || !id || !attributeId || !imageId || !overviewId) {
      return res.status(400).json({ err: 1, msg: 'Missing Input' })
    }

    const response = await postService.deletePostService(postId, attributeId, imageId, overviewId)

    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'Failed at got controller: ' + error
    })
  }
}

const getPostById = async (req, res) => {
  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ err: 1, msg: 'Missing Input' })
    }

    const response = await postService.getPostByIdService(id)

    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'Failed at got controller: ' + error
    })
  }
}

export default {
  getPaginationPosts,
  getPosts,
  getNewPosts,
  createNewPost,
  getPaginationPostsAdmin,
  updatePost,
  deletePost,
  getPostById
}
