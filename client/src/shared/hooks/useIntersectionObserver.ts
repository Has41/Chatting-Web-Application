import { useEffect, useRef, useState, RefObject } from "react"

interface IntersectionObserverOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
}

const useIntersectionObserver = (
  targetOrOptions: RefObject<Element> | IntersectionObserverOptions = {}
): [RefObject<HTMLDivElement>, boolean] | boolean => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)
  const isTargetRef = typeof targetOrOptions === "object" && targetOrOptions !== null && "current" in targetOrOptions
  const targetRef = isTargetRef ? (targetOrOptions as RefObject<Element>) : elementRef
  const options = isTargetRef ? {} : (targetOrOptions as IntersectionObserverOptions)

  useEffect(() => {
    const element = targetRef.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [options.root, options.rootMargin, options.threshold])

  if (isTargetRef) return isIntersecting
  return [elementRef, isIntersecting]
}

export default useIntersectionObserver
