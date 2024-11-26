import jwt from "jsonwebtoken"
import errorHandler from "../utils/errorHandler.js"

const isAuthentic = (req, res, next) => {
  const token = req.cookies.accessToken

  if (!token) {
    const err = errorHandler(401, "Token not provided")
    return next(err)
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedData) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        const error = errorHandler(401, "Token has expired")
        return next(error)
      } else {
        const error = errorHandler(401, "Invalid Token")
        return next(error)
      }
    } else {
      req.user = decodedData
      return next()
    }
  })
}

export default isAuthentic
