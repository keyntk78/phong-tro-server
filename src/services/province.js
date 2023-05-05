import db from '../models'

// Get all Categories
export const getAllProvinceService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Province.findAll({
        raw: true,
        order: [['value', 'DESC']],
        attributes: ['code', 'value']
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
  getAllProvinceService
}
