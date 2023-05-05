import db from '../models'

// Get all Categories
export const getAllPriceService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Price.findAll({
        raw: true,
        order: [['order', 'ASC']],
        attributes: ['code', 'value', 'min', 'max']
      })

      resolve({
        err: response ? 0 : 1,
        msg: response ? 'OK' : 'Failed to get price',
        response
      })
    } catch (error) {
      reject(error)
    }
  })

export default {
  getAllPriceService
}
