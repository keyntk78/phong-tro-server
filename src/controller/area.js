import { areaService } from '../services'

const getAllArea = async (req, res) => {
  try {
    const response = await areaService.getAllAreaService()

    res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'Failed at area controller: ' + error
    })
  }
}

export default {
  getAllArea
}
