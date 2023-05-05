import express from 'express'
import { postController } from '../controller'
import { verifyToken } from '../middleware/index'

const router = express.Router()

router.get('/all', postController.getPosts)
router.get('/limit', postController.getPaginationPosts)
router.get('/new-post', postController.getNewPosts)
router.get('/post-byid', postController.getPostById)

router.use(verifyToken.verifyToken)
router.post('/create-post', postController.createNewPost)
router.get('/limit-admin', postController.getPaginationPostsAdmin)
router.put('/update-post', postController.updatePost)
router.delete('/delete-post', postController.deletePost)

export default router
