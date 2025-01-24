const useLocalStorage = (key) => {
  const setItem = (value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.error(err)
    }
  }

  const getItem = () => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : undefined
    } catch (err) {
      console.error(err)
    }
  }

  const removeItem = () => {
    try {
      localStorage.removeItem(key)
    } catch (err) {
      console.error(err)
    }
  }

  return { setItem, getItem, removeItem }
}

export default useLocalStorage
