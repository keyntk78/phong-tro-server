import { categoryService } from '../services'
const getAllCategories = async (req, res) => {
  try {
    const response = await categoryService.getAllCategoriesService()

    res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'Failed at category controller: ' + error
    })
  }
}

export default {
  getAllCategories
}
