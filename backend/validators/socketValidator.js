import { validationResult } from "express-validator"

const validateSocketData = (socket, data, eventName) => {
  const errors = validationResult(data)
  if (!errors.isEmpty()) {
    socket.emit(`${eventName}ValidationError`, { errors: errors.array() })
    return false
  }
  return true
}

export default validateSocketData
