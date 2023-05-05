import express from 'express'
require('dotenv').config()
import cors from 'cors'
import initRoutes from './src/routes/index'
import connectDb from './src/config/database'

const app = express()
app.use(cors({ origin: process.env.CLIENT_URL, methods: ['POST', 'GET', 'PUT', 'DELETE'] }))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

initRoutes(app)
connectDb()

const port = process.env.PORT || 5000

const listener = app.listen(port, () => {
  console.log(`Server is running on port ${listener.address().port}`)
})
