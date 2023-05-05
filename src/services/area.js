import db from '../models'

// Get all Categories
const getAllAreaService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Area.findAll({
        raw: true,
        order: [['order', 'ASC']],
        attributes: ['code', 'value', 'min', 'max']
      })

      resolve({
        err: response ? 0 : 1,
        msg: response ? 'OK' : 'Failed to get area',
        response
      })
    } catch (error) {
      reject(error)
    }
  })

export default {
  getAllAreaService
}
