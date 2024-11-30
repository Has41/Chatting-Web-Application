import { useState, useEffect } from "react"

const useIntersectionObserver = (ref, options = { root: null, rootMargin: "0px", threshold: 0.1 }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    }, options)

    observer.observe(element)

    return () => {
      if (observer && element) observer.unobserve(element)
    }
  }, [ref, options])

  return isVisible
}

export default useIntersectionObserver
