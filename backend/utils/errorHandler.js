const errorHandler = (status, msg) => {
  const err = new Error(msg)
  err.statusCode = status
  return err
}

export default errorHandler
