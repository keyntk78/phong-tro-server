import { userService } from '../services'

const getCurrentUser = async (req, res) => {
  const { id } = req.user

  try {
    const response = await userService.getCurrentUserService(id)
    res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'Failed at price controller: ' + error
    })
  }
}

const updateUser = async (req, res) => {
  const { id } = req.user
  const payload = req.body

  try {
    if (!payload || !id) {
      return res.status(400).json({ err: 1, msg: 'Missing Input' })
    }
    const response = await userService.updateUser(payload, id)
    res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'Failed at price controller: ' + error
    })
  }
}

export default {
  getCurrentUser,
  updateUser
}
