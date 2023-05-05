import express from 'express'
import { priceController } from '../controller'

const router = express.Router()

router.get('/all', priceController.getAllPrice)

export default router
