import express from 'express'
import { areaController } from '../controller'

const router = express.Router()

router.get('/all', areaController.getAllArea)

export default router
