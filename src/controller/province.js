import { provinceService } from '../services'

const getAllProvince = async (req, res) => {
  try {
    const response = await provinceService.getAllProvinceService()

    res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'Failed at price controller: ' + error
    })
  }
}

export default {
  getAllProvince
}
