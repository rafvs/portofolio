import { motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'

const buildKeyframes = (from, steps) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap((step) => Object.keys(step))])
  const keyframes = {}

  keys.forEach((key) => {
    keyframes[key] = [from[key], ...steps.map((step) => step[key])]
  })

  return keyframes
}

const BlurText = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = (value) => value,
  onAnimationComplete,
  stepDuration = 0.35,
  startWhen = true,
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('')
  const [inView, setInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { threshold, rootMargin }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold, rootMargin, text])

  const defaultFrom = useMemo(
    () =>
      direction === 'top'
        ? { filter: 'blur(10px)', opacity: 0, y: -50 }
        : { filter: 'blur(10px)', opacity: 0, y: 50 },
    [direction]
  )

  const defaultTo = useMemo(
    () => [
      {
        filter: 'blur(5px)',
        opacity: 0.5,
        y: direction === 'top' ? 5 : -5,
      },
      { filter: 'blur(0px)', opacity: 1, y: 0 },
    ],
    [direction]
  )

  const fromSnapshot = animationFrom ?? defaultFrom
  const toSnapshots = animationTo ?? defaultTo
  const stepCount = toSnapshots.length + 1
  const totalDuration = stepDuration * (stepCount - 1)
  const times = Array.from({ length: stepCount }, (_, index) => index / (stepCount - 1))
  const animate = startWhen && inView

  return (
    <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap' }}>
      {elements.map((segment, index) => (
        <motion.span
          key={`${segment}-${index}`}
          initial={fromSnapshot}
          animate={animate ? buildKeyframes(fromSnapshot, toSnapshots) : fromSnapshot}
          transition={{
            duration: totalDuration,
            times,
            delay: (index * delay) / 1000,
            ease: easing,
          }}
          onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
        >
          {segment === ' ' ? '\u00a0' : segment}
          {animateBy === 'words' && index < elements.length - 1 && '\u00a0'}
        </motion.span>
      ))}
    </p>
  )
}

export default BlurText
