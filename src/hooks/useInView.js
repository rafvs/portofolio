import { useEffect, useRef, useState } from 'react'

// Small IntersectionObserver hook for scroll-into-view reveals. Returns a ref to
// attach to the element and a boolean that flips true once it enters the
// viewport. `once` (default) disconnects after the first intersection so the
// reveal doesn't replay on scroll-back; `rootMargin` lets callers start the
// reveal a little early. Shared by the Experience and Education sections so both
// use one staggered-reveal mechanism.
export default function useInView({ once = true, rootMargin = '0px', threshold = 0.2 } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin, threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [once, rootMargin, threshold])

  return [ref, inView]
}
