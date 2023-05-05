import db from '../models'

// Get all Categories
const getAllCategoriesService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Category.findAll({ raw: true })

      resolve({
        err: response ? 0 : 1,
        msg: response ? 'OK' : 'Failed to get categores',
        response
      })
    } catch (error) {
      reject(error)
    }
  })

export default { getAllCategoriesService }
