import { useEffect, useRef, useState, RefObject } from "react"

interface IntersectionObserverOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
}

const DEFAULT_OBSERVER_OPTIONS: IntersectionObserverOptions = {}

const useIntersectionObserver = (
  targetOrOptions: RefObject<Element> | IntersectionObserverOptions = DEFAULT_OBSERVER_OPTIONS
): [RefObject<HTMLDivElement | null>, boolean] | boolean => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)
  const isTargetRef = typeof targetOrOptions === "object" && targetOrOptions !== null && "current" in targetOrOptions
  const targetRef = isTargetRef ? (targetOrOptions as RefObject<Element>) : elementRef
  const options = isTargetRef ? DEFAULT_OBSERVER_OPTIONS : (targetOrOptions as IntersectionObserverOptions)

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
  }, [isTargetRef, options, options.root, options.rootMargin, options.threshold, targetOrOptions, targetRef])

  if (isTargetRef) return isIntersecting
  return [elementRef, isIntersecting]
}

export default useIntersectionObserver
