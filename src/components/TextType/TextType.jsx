'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './TextType.css'

const TextType = ({
  text,
  as: Component = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  startWhen = true,
  reverseMode = false,
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(!startOnVisible)
  const cursorRef = useRef(null)
  const containerRef = useRef(null)

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text])

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [startOnVisible])

  useEffect(() => {
    if (!showCursor || !cursorRef.current) return undefined

    const tween = gsap.to(cursorRef.current, {
      opacity: 0,
      duration: cursorBlinkDuration,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
    })

    return () => tween.kill()
  }, [showCursor, cursorBlinkDuration])

  useEffect(() => {
    if (!startWhen || !isVisible || textArray.length === 0) return undefined

    let timeout
    const currentText = String(textArray[currentTextIndex] ?? '')
    const processedText = reverseMode ? currentText.split('').reverse().join('') : currentText

    if (isDeleting) {
      if (displayedText === '') {
        if (currentTextIndex === textArray.length - 1 && !loop) return undefined

        timeout = window.setTimeout(() => {
          setIsDeleting(false)
          onSentenceComplete?.(currentText, currentTextIndex)
          setCurrentTextIndex((index) => (index + 1) % textArray.length)
          setCurrentCharIndex(0)
        }, pauseDuration)
      } else {
        timeout = window.setTimeout(() => {
          setDisplayedText((value) => value.slice(0, -1))
        }, deletingSpeed)
      }
    } else if (currentCharIndex < processedText.length) {
      const characterDelay = variableSpeed
        ? Math.random() * (variableSpeed.max - variableSpeed.min) + variableSpeed.min
        : typingSpeed
      const speed = currentCharIndex === 0 && displayedText === ''
        ? initialDelay + characterDelay
        : characterDelay

      timeout = window.setTimeout(() => {
        setDisplayedText((value) => value + processedText[currentCharIndex])
        setCurrentCharIndex((index) => index + 1)
      }, speed)
    } else if (textArray.length > 1 || loop) {
      timeout = window.setTimeout(() => {
        setIsDeleting(true)
      }, pauseDuration)
    }

    return () => window.clearTimeout(timeout)
  }, [
    currentCharIndex,
    currentTextIndex,
    deletingSpeed,
    displayedText,
    initialDelay,
    isDeleting,
    isVisible,
    loop,
    onSentenceComplete,
    pauseDuration,
    reverseMode,
    startWhen,
    textArray,
    typingSpeed,
    variableSpeed,
  ])

  const currentText = String(textArray[currentTextIndex] ?? '')
  const shouldHideCursor = hideCursorWhileTyping && (currentCharIndex < currentText.length || isDeleting)
  const color = textColors.length > 0 ? textColors[currentTextIndex % textColors.length] : 'inherit'
  const Element = Component

  return (
    <Element ref={containerRef} className={`text-type ${className}`} {...props}>
      <span className="text-type__content" style={{ color }}>
        {displayedText}
      </span>
      {showCursor && (
        <span
          ref={cursorRef}
          className={`text-type__cursor ${cursorClassName} ${shouldHideCursor ? 'text-type__cursor--hidden' : ''}`}
        >
          {cursorCharacter}
        </span>
      )}
    </Element>
  )
}

export default TextType
