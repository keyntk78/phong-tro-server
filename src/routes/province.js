import express from 'express'
import { provinceController } from '../controller'

const router = express.Router()

router.get('/all', provinceController.getAllProvince)

export default router
