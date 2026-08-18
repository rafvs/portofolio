import { useRef, useEffect, useState, useCallback } from 'react'
import { gsap } from 'gsap'

import './AccordionGallery.css'

/**
 * Komponen AccordionGallery - Galeri interaktif dengan efek akordeon elastis berbasis GSAP.
 * @param {Object} props
 * @param {Array} props.items - Daftar item galeri (gambar, label, deskripsi, tautan github, dsb).
 * @param {number} [props.defaultIndex=2] - Indeks item yang terbuka secara default.
 * ...
 */
const AccordionGallery = ({
  items = [],
  defaultIndex = 2,
  accentColor = '#ffffff',
  overlayColor = '#060010',
  textColor = '#ffffff',
  height = 460,
  gap = 10,
  radius = 16,
  expandRatio = 0.52,
  orientation = 'horizontal',
  duration = 0.6,
  ease = 'power3.out',
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  trigger = 'hover',
  showLabels = true,
  grayscale = true,
  className = '',
}) => {
  const rootRef = useRef(null)
  const panelRefs = useRef([])
  const mediaRefs = useRef([])
  const barRefs = useRef([])
  const textRefs = useRef([])
  const descRefs = useRef([])
  const stackRefs = useRef([])
  const actionRefs = useRef([])
  const centerLabelRefs = useRef([])
  const tlRef = useRef(null)
  const firstRunRef = useRef(true)
  const mediaSizeRef = useRef(320)

  const vertical = orientation === 'vertical'
  const count = items.length
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), count - 1))

  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  /**
   * INTERAKSI ANIMASI (GSAP):
   * Mengatur dan menganimasikan posisi/ukuran panel menggunakan GSAP.
   * - Menghitung seberapa lebar panel aktif membesar (flexGrow) dibanding panel tidak aktif.
   * - Melakukan rotasi 3D ringan pada panel non-aktif (efek tilt kiri/kanan).
   * - Menggeser posisi gambar di dalam panel non-aktif untuk menciptakan efek paralaks saat kursor bergerak.
   * - Mengatur efek stagger pada deskripsi dan teks agar muncul berurutan ketika panel terbuka.
   */
  const applyLayout = useCallback(
    (animate) => {
      const panels = panelRefs.current
      if (!panels.length) return

      const r = Math.min(Math.max(expandRatio, 0.2), 0.9)
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1
      const mediaSize = mediaSizeRef.current

      tlRef.current?.kill()
      const dur = animate && !prefersReduced ? duration : 0
      const tl = gsap.timeline()

      panels.forEach((panel, i) => {
        if (!panel) return
        const isActive = i === active
        const media = mediaRefs.current[i]
        const bar = barRefs.current[i]
        const text = textRefs.current[i]
        const desc = descRefs.current[i]
        const stack = stackRefs.current[i]
        const action = actionRefs.current[i]

        const rot = isActive ? 0 : i < active ? tilt : -tilt
        const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot }

        tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0)

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i))
          const shift = drift * parallax * mediaSize * 0.06
          const gray = grayscale ? (isActive ? 0 : 1) : 0
          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical ? 0 : isActive ? 0 : shift,
              y: vertical ? (isActive ? 0 : shift) : 0,
              '--ag-gray': gray,
              '--ag-dim': isActive ? 0.15 : 0.25,
              duration: dur,
              ease,
            },
            0
          )
        }

        if (showLabels) {
          const targets = [bar, text, desc, stack, action].filter(Boolean)
          const centerLabel = centerLabelRefs.current[i]
          if (isActive) {
            tl.to(targets, { opacity: 1, x: 0, y: 0, duration: dur, ease, stagger: prefersReduced ? 0 : stagger }, 0)
            if (centerLabel) tl.to(centerLabel, { opacity: 0, y: 8, duration: dur * 0.4, ease }, 0)
          } else {
            tl.to(targets, { opacity: 0, x: -14, duration: dur * 0.6, ease }, 0)
            if (centerLabel) tl.to(centerLabel, { opacity: 1, y: 0, duration: dur, ease }, 0)
          }
        }
      })

      tlRef.current = tl
    },
    [
      active,
      count,
      expandRatio,
      duration,
      ease,
      vertical,
      tilt,
      parallax,
      grayscale,
      showLabels,
      stagger,
      prefersReduced,
    ]
  )

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const measure = () => {
      const rect = el.getBoundingClientRect()
      const total = vertical ? rect.height : rect.width
      const usable = Math.max(total - gap * (count - 1), 120)
      const size = Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22)
      mediaSizeRef.current = size
      el.style.setProperty('--ag-media-size', `${size}px`)
      applyLayout(!firstRunRef.current)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [applyLayout, gap, count, expandRatio, vertical])

  useEffect(() => {
    applyLayout(!firstRunRef.current)
    firstRunRef.current = false
  }, [applyLayout])

  useEffect(
    () => () => {
      tlRef.current?.kill()
    },
    []
  )

  /**
   * INTERAKSI HOVER:
   * Handler hover panel. Jika konfigurasi pemicu adalah 'hover', panel yang didekati kursor
   * akan otomatis diatur sebagai panel aktif (membuka secara elastis).
   */
  const handleEnter = (i) => {
    if (trigger === 'hover') setActive(i)
  }

  /**
   * INTERAKSI KLIK:
   * Handler klik panel. Jika panel yang diklik belum aktif, interaksi default link dibatalkan
   * dan panel tersebut akan dibuka terlebih dahulu.
   */
  const handleClick = (i, e) => {
    if (i !== active) {
      e.preventDefault()
      setActive(i)
    }
  }

  /**
   * INTERAKSI KEYBOARD:
   * Mendukung aksesibilitas dengan tombol panah (ArrowRight/Down untuk maju, ArrowLeft/Up untuk mundur).
   * Menekan tombol panah akan langsung menggeser fokus aktif ke panel berikutnya/sebelumnya.
   */
  const handleKeyDown = (i, e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i + 1) % count)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i - 1 + count) % count)
    }
  }

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${vertical ? ' accordion-gallery--vertical' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--ag-accent': accentColor,
        '--ag-overlay': overlayColor,
        '--ag-text': textColor,
        '--ag-gap': `${gap}px`,
        '--ag-radius': `${radius}px`,
        height: vertical ? `${Math.round(height * 1.6)}px` : `${height}px`,
      }}
      role="list"
      aria-label="Image accordion gallery"
    >
      {items.map((item, i) => {
        const isActive = i === active
        return (
          <div
            key={i}
            ref={(el) => (panelRefs.current[i] = el)}
            className={`ag-panel${isActive ? ' ag-panel--active' : ''}`}
            style={{ borderRadius: `${radius}px` }}
            onClick={(e) => handleClick(i, e)}
            onMouseEnter={() => handleEnter(i)}
            onFocus={() => setActive(i)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? 'true' : undefined}
            aria-label={item.label}
          >
            <span className="ag-panel__frame">
              <span className="ag-panel__media" ref={(el) => (mediaRefs.current[i] = el)}>
                <img src={item.image} alt={item.alt || item.label || ''} draggable="false" loading={i === 0 ? 'eager' : 'lazy'} />
              </span>
              <span className="ag-panel__overlay" aria-hidden="true" />
              {!isActive && showLabels && (
                <span
                  className="ag-panel__center-label"
                  ref={(el) => (centerLabelRefs.current[i] = el)}
                  aria-hidden="true"
                >
                  {item.label}
                </span>
              )}
            </span>
            {showLabels && (
              <div className="ag-panel__content">
                <div className="ag-panel__label">
                  <span className="ag-panel__bar" ref={(el) => (barRefs.current[i] = el)} />
                  <span className="ag-panel__text" ref={(el) => (textRefs.current[i] = el)}>
                    {item.label}
                  </span>
                </div>

                {item.description && (
                  <p className="ag-panel__description" ref={(el) => (descRefs.current[i] = el)}>
                    {item.description}
                  </p>
                )}

                {item.stack && item.stack.length > 0 && (
                  <div className="ag-panel__stack" ref={(el) => (stackRefs.current[i] = el)}>
                    {item.stack.map((tech) => (
                      <span key={tech} className="ag-panel__tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {item.github && (
                  <div className="ag-panel__actions" ref={(el) => (actionRefs.current[i] = el)}>
                    <a
                      href={item.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ag-panel__github-btn cursor-target"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
                      </svg>
                      GitHub
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default AccordionGallery
