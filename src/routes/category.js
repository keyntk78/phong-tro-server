import express from 'express'
import { categoryController } from '../controller'

const router = express.Router()

router.get('/all', categoryController.getAllCategories)

export default router
