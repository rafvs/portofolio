import useInView from '../../hooks/useInView.js'
import SplitText from '../SplitText/SplitText.jsx'
import './Experience.css'

const TAGS = ['Kepemimpinan', 'Dokumentasi', 'Koordinasi Tim']

const Experience = ({ frontImage, className = '' }) => {
  const [revealRef, reveal] = useInView({ once: true, rootMargin: '-10% 0px -10% 0px' })

  return (
    <section className={`experience${className ? ` ${className}` : ''}`} id="pengalaman">
      <div className="section-shell">
        <div className="section-heading">
          <p className="section-kicker">02 / Pengalaman</p>
          <div className="section-heading__copy">
            <SplitText
              tag="h2"
              className="section-title"
              text="Belajar memimpin lewat kerja nyata."
              splitType="words"
              delay={60}
              duration={0.7}
              from={{ opacity: 0, y: 26 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              rootMargin="-80px"
              textAlign="left"
            />
            <p className="section-description">Pengalaman yang membentuk cara saya bekerja bersama tim, merawat detail, dan menyelesaikan sesuatu sampai tuntas.</p>
          </div>
        </div>

        <article className={`experience-card cursor-target reveal${reveal ? ' is-visible' : ''}`} ref={revealRef}>
          <div className="experience-card__topline">
            <span className="experience-card__number">01</span>
            <span className="status-badge"><i /> Sedang Aktif</span>
          </div>
          <div className="experience-card__body">
            <div className="experience-card__content">
              <p className="card-eyebrow">Organisasi Siswa Intra Sekolah</p>
              <h3>Koordinator OSIS</h3>
              <p className="card-period">07/2024 — 12/2026</p>
              <p className="experience-card__summary">Memimpin Seksi Dokumentasi &amp; Publikasi dan mengoordinasikan tim agar kegiatan sekolah terdokumentasi serta terpublikasi dengan baik.</p>
              <div className="tag-list" aria-label="Bidang pengalaman">
                {TAGS.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>
            <div className="experience-card__image-wrap">
              <img className="experience-card__image" src={frontImage} alt="Dokumentasi kegiatan OSIS" width="800" height="1000" loading="lazy" decoding="async" />
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

export default Experience
