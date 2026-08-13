import { useEffect, useRef, useCallback, useMemo } from 'react'
import { gsap } from 'gsap'
import './TargetCursor.css'

const getContainingBlock = (element) => {
  let node = element?.parentElement
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node)
    if (
      style.transform !== 'none' ||
      style.perspective !== 'none' ||
      style.filter !== 'none' ||
      style.willChange.includes('transform') ||
      style.willChange.includes('perspective') ||
      style.willChange.includes('filter') ||
      /paint|layout|strict|content/.test(style.contain)
    ) {
      return node
    }
    node = node.parentElement
  }
  return null
}

const getContainingBlockOffset = (block) => {
  if (!block) return { x: 0, y: 0 }
  const rect = block.getBoundingClientRect()
  return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop }
}

const TargetCursor = ({
  targetSelector = '.cursor-target',
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true,
  cursorColor = '#ffffff',
  cursorColorOnTarget,
}) => {
  const cursorRef = useRef(null)
  const cornersRef = useRef(null)
  const spinTl = useRef(null)
  const dotRef = useRef(null)
  const containingBlockRef = useRef(null)

  const isActiveRef = useRef(false)
  const targetCornerPositionsRef = useRef(null)
  const tickerFnRef = useRef(null)
  const activeStrengthRef = useRef(0)

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const isSmallScreen = window.innerWidth <= 768
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
    const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase())
    return (hasTouchScreen && isSmallScreen) || isMobileUserAgent
  }, [])

  const constants = useMemo(
    () => ({
      borderWidth: 3,
      cornerSize: 12,
    }),
    []
  )

  const moveCursor = useCallback((x, y) => {
    if (!cursorRef.current) return
    const { x: offsetX, y: offsetY } = getContainingBlockOffset(containingBlockRef.current)
    gsap.to(cursorRef.current, {
      x: x - offsetX,
      y: y - offsetY,
      duration: 0.1,
      ease: 'power3.out',
    })
  }, [])

  useEffect(() => {
    if (isMobile || !cursorRef.current) return

    const originalCursor = document.body.style.cursor
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none'
    }

    const cursor = cursorRef.current
    cornersRef.current = cursor.querySelectorAll('.target-cursor-corner')

    containingBlockRef.current = getContainingBlock(cursor)
    const getOffset = () => getContainingBlockOffset(containingBlockRef.current)

    let activeTarget = null
    let currentLeaveHandler = null
    let resumeTimeout = null

    const cleanupTarget = (target) => {
      if (currentLeaveHandler) {
        target.removeEventListener('mouseleave', currentLeaveHandler)
      }
      currentLeaveHandler = null
    }

    const initialOffset = getOffset()
    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2 - initialOffset.x,
      y: window.innerHeight / 2 - initialOffset.y,
    })

    const createSpinTimeline = () => {
      if (spinTl.current) {
        spinTl.current.kill()
      }
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' })
    }

    createSpinTimeline()

    const tickerFn = () => {
      if (!targetCornerPositionsRef.current || !cursorRef.current || !cornersRef.current) {
        return
      }

      const strength = activeStrengthRef.current
      if (strength === 0) return

      const cursorX = gsap.getProperty(cursorRef.current, 'x')
      const cursorY = gsap.getProperty(cursorRef.current, 'y')

      const corners = Array.from(cornersRef.current)
      corners.forEach((corner, i) => {
        const currentX = gsap.getProperty(corner, 'x')
        const currentY = gsap.getProperty(corner, 'y')

        const targetX = targetCornerPositionsRef.current[i].x - cursorX
        const targetY = targetCornerPositionsRef.current[i].y - cursorY

        const finalX = currentX + (targetX - currentX) * strength
        const finalY = currentY + (targetY - currentY) * strength

        const duration = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05

        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration,
          ease: duration === 0 ? 'none' : 'power1.out',
          overwrite: 'auto',
        })
      })
    }

    tickerFnRef.current = tickerFn

    const moveHandler = (e) => moveCursor(e.clientX, e.clientY)
    window.addEventListener('mousemove', moveHandler)

    const scrollHandler = () => {
      if (!activeTarget || !cursorRef.current) return
      const { x: offsetX, y: offsetY } = getOffset()
      const mouseX = gsap.getProperty(cursorRef.current, 'x') + offsetX
      const mouseY = gsap.getProperty(cursorRef.current, 'y') + offsetY
      const rect = activeTarget.getBoundingClientRect()
      const stillOver =
        mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom
      if (stillOver) return
      if (currentLeaveHandler) {
        activeTarget.removeEventListener('mouseleave', currentLeaveHandler)
        currentLeaveHandler = null
      }
      activeTarget = null
      if (cornersRef.current) {
        const corners = Array.from(cornersRef.current)
        gsap.killTweensOf(corners)
        const { cornerSize } = constants
        const positions = [
          { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
          { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
          { x: cornerSize * 0.5, y: cornerSize * 0.5 },
          { x: -cornerSize * 1.5, y: cornerSize * 0.5 },
        ]
        gsap.to(corners, {
          x: (i) => positions[i].x,
          y: (i) => positions[i].y,
          duration: 0.3,
          ease: 'power3.out',
        })
      }
      isActiveRef.current = false
      activeStrengthRef.current = 0
      if (dotRef.current) {
        gsap.to(dotRef.current, {
          backgroundColor: cursorColor,
          borderColor: cursorColor,
          duration: 0.3,
          ease: 'power3.out',
        })
      }
      gsap.to(cursorRef.current, {
        rotation: 0,
        duration: 0.3,
        ease: 'power3.out',
      })
      spinTl.current?.resume()
    }

    window.addEventListener('scroll', scrollHandler, { passive: true })

    const mouseOverHandler = (e) => {
      if (!e.target || !(e.target instanceof Element)) return
      const target = e.target.closest(targetSelector)
      if (!target) return
      if (activeTarget === target) return
      if (activeTarget) {
        cleanupTarget(activeTarget)
      }
      if (resumeTimeout) {
        clearTimeout(resumeTimeout)
        resumeTimeout = null
      }
      activeTarget = target
      isActiveRef.current = true
      activeStrengthRef.current = 0
      const rect = target.getBoundingClientRect()
      const { borderWidth, cornerSize } = constants
      const { x: offsetX, y: offsetY } = getOffset()
      targetCornerPositionsRef.current = [
        { x: rect.left - borderWidth - offsetX, y: rect.top - borderWidth - offsetY },
        { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.top - borderWidth - offsetY },
        {
          x: rect.right + borderWidth - cornerSize - offsetX,
          y: rect.bottom + borderWidth - cornerSize - offsetY,
        },
        {
          x: rect.left - borderWidth - offsetX,
          y: rect.bottom + borderWidth - cornerSize - offsetY,
        },
      ]
      if (cornersRef.current) {
        const corners = Array.from(cornersRef.current)
        gsap.killTweensOf(corners)
        gsap.to(corners, {
          x: (i) => targetCornerPositionsRef.current[i].x - gsap.getProperty(cursorRef.current, 'x'),
          y: (i) => targetCornerPositionsRef.current[i].y - gsap.getProperty(cursorRef.current, 'y'),
          duration: hoverDuration,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }
      if (cursorColorOnTarget && dotRef.current) {
        gsap.to(dotRef.current, {
          backgroundColor: cursorColorOnTarget,
          borderColor: cursorColorOnTarget,
          duration: 0.3,
          ease: 'power3.out',
        })
      }
      gsap.to(cursorRef.current, {
        rotation: 0,
        duration: 0.3,
        ease: 'power3.out',
      })
      spinTl.current?.pause()

      currentLeaveHandler = () => {
        activeTarget = null
        isActiveRef.current = false
        targetCornerPositionsRef.current = null
        if (cornersRef.current) {
          const corners = Array.from(cornersRef.current)
          gsap.killTweensOf(corners)
          const { cornerSize } = constants
          const positions = [
            { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: cornerSize * 0.5 },
            { x: -cornerSize * 1.5, y: cornerSize * 0.5 },
          ]
          gsap.to(corners, {
            x: (i) => positions[i].x,
            y: (i) => positions[i].y,
            duration: 0.3,
            ease: 'power3.out',
          })
        }
        if (dotRef.current) {
          gsap.to(dotRef.current, {
            backgroundColor: cursorColor,
            borderColor: cursorColor,
            duration: 0.3,
            ease: 'power3.out',
          })
        }
        gsap.to(cursorRef.current, {
          rotation: 0,
          duration: 0.3,
          ease: 'power3.out',
        })
        resumeTimeout = setTimeout(() => {
          if (!isActiveRef.current) {
            spinTl.current?.resume()
          }
        }, 100)
      }
      target.addEventListener('mouseleave', currentLeaveHandler)
      activeStrengthRef.current = 1
      gsap.ticker.add(tickerFnRef.current)
    }

    window.addEventListener('mouseover', mouseOverHandler)

    return () => {
      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current)
      }
      window.removeEventListener('mousemove', moveHandler)
      window.removeEventListener('mouseover', mouseOverHandler)
      window.removeEventListener('scroll', scrollHandler)
      if (activeTarget) {
        cleanupTarget(activeTarget)
      }
      if (resumeTimeout) {
        clearTimeout(resumeTimeout)
      }
      spinTl.current?.kill()
      if (hideDefaultCursor) {
        document.body.style.cursor = originalCursor
      }
    }
  }, [
    targetSelector,
    hideDefaultCursor,
    spinDuration,
    hoverDuration,
    parallaxOn,
    cursorColor,
    cursorColorOnTarget,
    constants,
    isMobile,
    moveCursor,
  ])

  if (isMobile) {
    return null
  }

  return (
    <div ref={cursorRef} className="target-cursor" aria-hidden="true">
      <div ref={dotRef} className="target-cursor-dot" style={{ backgroundColor: cursorColor, borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-tl" />
      <div className="target-cursor-corner corner-tr" />
      <div className="target-cursor-corner corner-br" />
      <div className="target-cursor-corner corner-bl" />
    </div>
  )
}

export default TargetCursor
