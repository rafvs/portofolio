import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import './ProjectModal.css'

/**
 * Komponen ProjectModal - Modal preview project dengan image slider dan deskripsi.
 * @param {Object} props
 * @param {Object|null} props.project - Data project yang akan ditampilkan.
 * @param {Function} props.onClose - Callback untuk menutup modal.
 */
const ProjectModal = ({ project, onClose }) => {
  const { t } = useTranslation()
  const [slideIndex, setSlideIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const backdropRef = useRef(null)
  const modalRef = useRef(null)

  const screenshots = project?.screenshots ?? (project?.image ? [project.image] : [])
  const total = screenshots.length

  /* ── Animasi masuk / keluar ── */
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsVisible(Boolean(project))
      if (project) setSlideIndex(0)
    })

    return () => cancelAnimationFrame(frame)
  }, [project])

  /* ── Tutup saat backdrop diklik ── */
  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === backdropRef.current) onClose()
    },
    [onClose]
  )

  /* ── Keyboard ESC ── */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setSlideIndex((p) => (p + 1) % total)
      if (e.key === 'ArrowLeft') setSlideIndex((p) => (p - 1 + total) % total)
    }
    if (project) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [project, onClose, total])

  /* ── Lock body scroll ── */
  useEffect(() => {
    if (!project) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [project])

  /* ── Slide helpers ── */
  const prev = () => setSlideIndex((p) => (p - 1 + total) % total)
  const next = () => setSlideIndex((p) => (p + 1) % total)

  /* ── Swipe / drag support ── */
  const handlePointerDown = (e) => {
    setIsDragging(true)
    setDragStart(e.clientX ?? e.touches?.[0]?.clientX ?? 0)
  }
  const handlePointerUp = (e) => {
    if (!isDragging) return
    setIsDragging(false)
    const end = e.clientX ?? e.changedTouches?.[0]?.clientX ?? 0
    const delta = dragStart - end
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev()
  }

  if (!project) return null

  return createPortal(
    <div
      ref={backdropRef}
      className={`pm-backdrop${isVisible ? ' pm-backdrop--visible' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={t('projectModal.preview', { label: project.label })}
    >
      <div
        ref={modalRef}
        className={`pm-modal${isVisible ? ' pm-modal--visible' : ''}`}
      >
        {/* ── Close Button ── */}
        <button
          className="pm-close cursor-target"
          onClick={onClose}
          aria-label={t('projectModal.close')}
          type="button"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* ── Slider ── */}
        <div
          className="pm-slider"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchEnd={handlePointerUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div
            className="pm-slider__track"
            style={{ transform: `translateX(-${slideIndex * 100}%)` }}
          >
            {screenshots.map((src, idx) => (
              <div key={idx} className="pm-slider__slide">
                <img
                  src={src}
                  alt={t('projectModal.screenshot', { label: project.label, index: idx + 1 })}
                  draggable="false"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>

          {total > 1 && (
            <>
              <button
                className="pm-slider__arrow pm-slider__arrow--prev cursor-target"
                onClick={(e) => { e.stopPropagation(); prev() }}
                aria-label={t('projectModal.previousSlide')}
                type="button"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                className="pm-slider__arrow pm-slider__arrow--next cursor-target"
                onClick={(e) => { e.stopPropagation(); next() }}
                aria-label={t('projectModal.nextSlide')}
                type="button"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          {/* Dots */}
          {total > 1 && (
            <div className="pm-slider__dots" role="tablist" aria-label={t('projectModal.slideNavigation')}>
              {screenshots.map((_, idx) => (
                <button
                  key={idx}
                  role="tab"
                  aria-selected={idx === slideIndex}
                  className={`pm-slider__dot${idx === slideIndex ? ' pm-slider__dot--active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setSlideIndex(idx) }}
                  aria-label={t('projectModal.selectSlide', { index: idx + 1 })}
                  type="button"
                />
              ))}
            </div>
          )}

          {/* Counter */}
          {total > 1 && (
            <div className="pm-slider__counter" aria-live="polite">
              {slideIndex + 1} / {total}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div className="pm-info">
          <div className="pm-info__header">
            <h2 className="pm-info__title">{project.label}</h2>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="pm-info__github cursor-target"
                onClick={(e) => e.stopPropagation()}
                aria-label={t('projectModal.viewOnGithub')}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
                </svg>
                GitHub
              </a>
            )}
          </div>

          {project.fullDescription && (
            <p className="pm-info__full-desc">{project.fullDescription}</p>
          )}
          {!project.fullDescription && project.description && (
            <p className="pm-info__full-desc">{project.description}</p>
          )}

          {project.stack && project.stack.length > 0 && (
            <div className="pm-info__stack-wrap">
              <span className="pm-info__stack-label">{t('projectModal.technologies')}</span>
              <div className="pm-info__stack">
                {project.stack.map((tech) => (
                  <span key={tech} className="pm-info__tag">{tech}</span>
                ))}
              </div>
            </div>
          )}

          {project.features && project.features.length > 0 && (
            <div className="pm-info__features">
              <span className="pm-info__stack-label">{t('projectModal.features')}</span>
              <ul className="pm-info__features-list">
                {project.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ProjectModal
