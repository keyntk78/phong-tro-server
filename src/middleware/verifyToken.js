import jwt from 'jsonwebtoken'
require('dotenv').config()

const verifyToken = (req, res, next) => {
  const token = req.headers.token
  if (token) {
    const accessToken = token.split(' ')[1]
    jwt.verify(accessToken, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        res.status(403).json({ err: 1, msg: 'Token is not valid!' })
      } else {
        req.user = user
        next()
      }
    })
  } else {
    res.status(401).json({ err: 1, msg: "You're not authenticated" })
  }
}

export default { verifyToken }
