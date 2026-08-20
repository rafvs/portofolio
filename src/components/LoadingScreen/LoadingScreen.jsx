import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useTranslation } from 'react-i18next'
import './LoadingScreen.css'

const GREETINGS = [
  { text: 'Hello', lang: 'English' },
  { text: 'Bonjour', lang: 'Français' },
  { text: 'Hola', lang: 'Español' },
  { text: 'こんにちは', lang: '日本語' },
  { text: '你好', lang: '中文' },
  { text: 'Willkommen', lang: 'Deutsch' },
  { text: 'नमस्ते', lang: 'हिन्दी' },
  { text: 'Selamat Datang', lang: 'Bahasa Indonesia' },
]

const INTRO = 0.2
const FADE_IN = 0.18
const HOLD = 0.3
const LAST_HOLD = 0.8
const FADE_OUT = 0.12

/**
 * Komponen LoadingScreen - Layar pemuatan awal (splash screen) dengan pesan sambutan multi-bahasa dan persentase loader.
 * @param {Object} props
 * @param {Function} props.onComplete - Callback yang dipicu setelah layar pemuatan selesai beranimasi keluar.
 * @returns {JSX.Element} Elemen layar pemuatan.
 */
const LoadingScreen = ({ onComplete }) => {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const langRef = useRef(null)
  const statusRef = useRef(null)
  const counterNumberRef = useRef(null)
  const barRef = useRef(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    // INTERAKSI SCROLL LOCK: Mengunci scrollbar halaman utama saat layar loading aktif
    document.body.style.overflow = 'hidden'

    const progress = { value: 0 }
    const count = GREETINGS.length
    const totalDuration =
      INTRO + count * FADE_IN + (count - 1) * (HOLD + FADE_OUT) + LAST_HOLD

    const tl = gsap.timeline({
      onComplete: () => {
        // INTERAKSI CURTAIN REVEAL: Membuka layar loading dengan menggesernya ke atas & mengaktifkan kembali scrollbar halaman utama
        document.body.style.overflow = ''
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 0.85,
          ease: 'power4.inOut',
          onComplete: () => {
            if (onComplete) onComplete()
          },
        })
      },
    })

    // Fade in baris status bagian bawah secara perlahan
    tl.fromTo(
      statusRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      0
    )

    // INTERAKSI PERSENTASE COUNTER: Menghitung 0% hingga 100% mengikuti jalannya total durasi loading
    tl.to(progress, {
      value: 100,
      duration: totalDuration,
      ease: 'power1.inOut',
      onUpdate: () => {
        if (counterNumberRef.current) {
          counterNumberRef.current.textContent = `${Math.round(progress.value)}%`
        }
      },
    }, 0)
    // INTERAKSI PROGRESS BAR: Memperlebar garis loading di bawah layar secara sinkron dengan counter persentase
    tl.to(barRef.current, {
      width: '100%',
      duration: totalDuration,
      ease: 'power1.inOut',
    }, 0)

    // INTERAKSI GREETINGS ROTATION (CROSSFADE): Mengubah kata sambutan dari berbagai bahasa secara berurutan dengan efek halus
    let cursor = INTRO
    GREETINGS.forEach((_, i) => {
      const isLast = i === count - 1

      tl.call(() => setIndex(i), null, cursor)
      tl.fromTo(
        [textRef.current, langRef.current],
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: FADE_IN, ease: 'power2.out' },
        cursor
      )

      cursor += FADE_IN + (isLast ? LAST_HOLD : HOLD)

      if (!isLast) {
        tl.to([textRef.current, langRef.current], {
          opacity: 0,
          y: -14,
          duration: FADE_OUT,
          ease: 'power2.in',
        }, cursor)
        cursor += FADE_OUT
      }
    })

    return () => {
      document.body.style.overflow = ''
      tl.kill()
    }
  }, [onComplete])

  const current = GREETINGS[index]

  return (
    <div className="loading-screen" ref={containerRef}>
      <div className="loading-screen__content">
        <h1
          className={`loading-screen__greeting${current.lang === '日本語' ? ' loading-screen__greeting--jp' : ''}`}
          ref={textRef}
        >
          {current.text}
        </h1>
        <p className="loading-screen__language" ref={langRef}>{current.lang}</p>
      </div>

      <div className="loading-screen__status" ref={statusRef}>
        <span className="loading-screen__reading">{t('loading.reading')}</span>
        <span className="loading-screen__counter" ref={counterNumberRef}>0%</span>
      </div>

      <div className="loading-screen__bar" ref={barRef} />
    </div>
  )
}

export default LoadingScreen
