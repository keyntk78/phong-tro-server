import * as services from '../services/inser'

export const insert = async (req, res) => {
  try {
    const response = await services.insertService()
    const response2 = await services.createPricesAndAreas()

    return res.status(200).json({ response, response2 })
  } catch (error) {
    return res.status(500).json({ err: -1, msg: 'Fail at auth controller: ' + error })
  }
}
