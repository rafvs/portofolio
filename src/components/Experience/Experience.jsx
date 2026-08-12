import { useState, useRef, useEffect, lazy, Suspense } from 'react'
import useInView from '../../hooks/useInView.js'
import './Experience.css'

// The 3D lanyard drags in Three.js + Rapier (~3.8MB). Lazy-load it as its own
// chunk and only mount it once the section nears the viewport, so the hero
// loads instantly and physics never runs while the card is off-screen.
const Lanyard = lazy(() => import('../Lanyard/Lanyard.jsx'))

// "Pengalaman" section: left column animates on scroll-into-view (eyebrow ->
// title -> org -> periode -> 4 staggered points), right column is the draggable
// 3D lanyard card. The whole left sequence is driven by a single is-visible
// class toggled once the section enters the viewport (via useInView), so the
// order is always deterministic and nothing runs on page load.
const POINTS = [
  'Memimpin dan bertanggung jawab penuh sebagai penanggung jawab pada Seksi Bidang Dokumentasi dan Publikasi.',
  'Mengoordinasikan anggota tim secara komunikatif guna memastikan seluruh dokumentasi kegiatan sekolah berjalan lancar dan terpublikasi dengan baik.',
  'Mengembangkan kemampuan analisis dan kepemimpinan dalam mengidentifikasi serta membantu menyelesaikan berbagai permasalahan organisasi secara terstruktur dan solutif.',
  'Menjaga efektivitas kerja sama tim lintas seksi untuk mencapai target program kerja organisasi secara sukses.',
]

const Experience = ({ frontImage = null, backImage = null, className = '' }) => {
  // Reveal the whole left column once the section scrolls into view. Start a bit
  // early so the stagger has begun by the time it's fully on screen.
  const [revealRef, reveal] = useInView({ once: true, rootMargin: '-10% 0px -15% 0px' })

  const [showLanyard, setShowLanyard] = useState(false)
  const lanyardRef = useRef(null)

  useEffect(() => {
    const el = lanyardRef.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowLanyard(true)
          io.disconnect()
        }
      },
      // Start loading a little before it scrolls into view for a seamless entry.
      { rootMargin: '250px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className={`exp${className ? ` ${className}` : ''}`} id="pengalaman">
      <div className="exp-grid">
        {/* Left: experience copy — a single is-visible class staggers each row */}
        <div className={`exp-left${reveal ? ' is-visible' : ''}`} ref={revealRef}>
          <span className="exp-eyebrow">Pengalaman</span>

          <h2 className="exp-title">Koordinator OSIS</h2>

          <p className="exp-org">Organisasi Siswa Intra Sekolah</p>

          <p className="exp-period">07/2024 – 12/2026</p>

          <ul className="exp-points">
            {POINTS.map((point, i) => (
              <li key={i} style={{ '--i': i }}>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: draggable 3D lanyard card (mounted only when near viewport) */}
        <div className="exp-lanyard" ref={lanyardRef}>
          {showLanyard && (
            <Suspense fallback={<div className="exp-lanyard__loading">Memuat kartu…</div>}>
              <Lanyard
                frontImage={frontImage}
                backImage={backImage}
                position={[0, -2, 17]}
                fov={20}
              />
            </Suspense>
          )}
        </div>
      </div>
    </section>
  )
}

export default Experience
