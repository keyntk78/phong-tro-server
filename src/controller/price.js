import { priceService } from '../services'

const getAllPrice = async (req, res) => {
  try {
    const response = await priceService.getAllPriceService()

    res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'Failed at price controller: ' + error
    })
  }
}

export default {
  getAllPrice
}
