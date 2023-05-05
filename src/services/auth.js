import db from '../models'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'
require('dotenv').config()

const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(12))
const registerService = ({ phone, password, name }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOrCreate({
        where: { phone },
        defaults: {
          phone,
          name,
          password: hashPassword(password),
          id: v4()
        }
      })
      const token =
        response[1] &&
        jwt.sign({ id: response[0].id, phone: response[0].phone }, process.env.SECRET_KEY, { expiresIn: '2d' })

      resolve({
        err: token ? 0 : 2,
        msg: token ? 'Register successfully!' : 'Phone number has been already used!',
        token: token || null
      })
    } catch (error) {
      reject(error)
    }
  })

const loginService = ({ phone, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({
        where: { phone },
        raw: true
      })

      const isCorrectPassword = response && (await bcrypt.compareSync(password, response.password))

      const token =
        isCorrectPassword &&
        jwt.sign({ id: response.id, phone: response.phone }, process.env.SECRET_KEY, { expiresIn: '2d' })

      resolve({
        err: token ? 0 : 2,
        msg: token ? 'Login is successfully!' : response ? 'Password is not exist!' : 'Phone is not exist!',
        token: token || null
      })
    } catch (error) {
      reject(error)
    }
  })

export default {
  registerService,
  loginService
}
