import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import './CVModal.css'

const CV_FILENAME = 'CV_Muhammad_Rafi.pdf'
const CV_PREVIEW_URL = `${import.meta.env.BASE_URL}cv-muhammad-rafi.data`
const CV_DOWNLOAD_URL = `${import.meta.env.BASE_URL}cv-muhammad-rafi.pdf`

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

/** Modal preview CV dengan renderer PDF berbasis canvas dan fallback download. */
const CVModal = ({ open, onClose }) => {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [numPages, setNumPages] = useState(null)
  const [pageWidth, setPageWidth] = useState(760)
  const [error, setError] = useState(null)
  const viewerRef = useRef(null)
  const pdfSource = useMemo(() => ({
    url: CV_PREVIEW_URL,
    disableRange: true,
    disableStream: true,
  }), [])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsVisible(open)
      if (open) {
        setNumPages(null)
        setError(null)
      }
    })

    return () => cancelAnimationFrame(frame)
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    const updatePageWidth = () => {
      const width = viewerRef.current?.clientWidth ?? 760
      setPageWidth(Math.max(280, Math.min(width - 32, 760)))
    }

    updatePageWidth()
    const observer = new ResizeObserver(updatePageWidth)
    if (viewerRef.current) observer.observe(viewerRef.current)
    window.addEventListener('resize', updatePageWidth)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updatePageWidth)
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = CV_DOWNLOAD_URL
    link.download = CV_FILENAME
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const handleDocumentLoad = ({ numPages: totalPages }) => {
    setNumPages(totalPages)
    setError(null)
  }

  const handleDocumentError = () => {
    setError('CV tidak dapat ditampilkan di browser ini.')
  }

  if (!open) return null

  return createPortal(
    <div
      className={`cvm-backdrop${isVisible ? ' cvm-backdrop--visible' : ''}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cvm-title"
    >
      <section className={`cvm-modal${isVisible ? ' cvm-modal--visible' : ''}`}>
        <header className="cvm-header">
          <div className="cvm-header__left">
            <span className="cvm-header__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="13" y2="17" />
              </svg>
            </span>
            <div>
              <h2 id="cvm-title" className="cvm-header__title">{t('cv.title')}</h2>
              <p className="cvm-header__sub">Muhammad Rafi · PDF</p>
            </div>
          </div>

          <div className="cvm-header__actions">
            <button type="button" className="cvm-btn cvm-btn--primary cursor-target" onClick={handleDownload}>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{t('cv.downloadMobile')}</span>
            </button>
            <a className="cvm-btn cvm-btn--ghost cursor-target" href={CV_DOWNLOAD_URL} target="_blank" rel="noreferrer" aria-label={t('cv.openTab')}>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 3h7v7" />
                <path d="M10 14 21 3" />
                <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
              </svg>
              <span>{t('cv.open')}</span>
            </a>
            <button type="button" className="cvm-btn cvm-btn--close cursor-target" onClick={onClose} aria-label={t('cv.close')}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </header>

        <div ref={viewerRef} className="cvm-viewer">
          {!error && numPages === null && (
            <div className="cvm-loader" aria-live="polite">
              <span className="cvm-loader__spinner" />
              <span>{t('cv.loading')}</span>
            </div>
          )}

          {error ? (
            <div className="cvm-fallback">
              <strong>{t('cv.errorTitle')}</strong>
              <p>{t('cv.errorDescription')}</p>
              <div className="cvm-fallback__actions">
                <button type="button" className="cvm-btn cvm-btn--primary" onClick={handleDownload}>{t('cv.download')}</button>
                <a className="cvm-btn cvm-btn--ghost" href={CV_DOWNLOAD_URL} target="_blank" rel="noreferrer">{t('cv.open')}</a>
              </div>
            </div>
          ) : (
            <Document
              file={pdfSource}
              onLoadSuccess={handleDocumentLoad}
              onLoadError={handleDocumentError}
              loading={null}
              error={null}
              className="cvm-document"
            >
              {Array.from({ length: numPages ?? 0 }, (_, index) => (
                <div className="cvm-page" key={`page_${index + 1}`} aria-label={t('cv.page', { page: index + 1 })}>
                  <Page
                    pageNumber={index + 1}
                    width={pageWidth}
                    renderAnnotationLayer
                    renderTextLayer
                  />
                </div>
              ))}
            </Document>
          )}
        </div>
      </section>
    </div>,
    document.body,
  )
}

export default CVModal
