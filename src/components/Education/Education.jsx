import useInView from '../../hooks/useInView.js'
import SplitText from '../SplitText/SplitText.jsx'
import schoolPhoto from '../../assets/school-photo.webp'
import schoolLogo from '../../assets/shcool logo.png'
import './Education.css'

const TAGS = ['Web', 'PBO', 'Struktur Data', 'UI/UX']

const Education = ({ className = '' }) => {
  const [revealRef, reveal] = useInView({ once: true, rootMargin: '-10% 0px -10% 0px' })

  return (
    <section className={`education${className ? ` ${className}` : ''}`} id="education">
      <div className="section-shell">
        <div className="section-heading">
          <p className="section-kicker">03 / Pendidikan</p>
          <div className="section-heading__copy">
            <SplitText
              tag="h2"
              className="section-title"
              text="Fondasi untuk terus berkembang."
              splitType="words"
              delay={60}
              duration={0.7}
              from={{ opacity: 0, y: 26 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              rootMargin="-80px"
              textAlign="left"
            />
            <p className="section-description">Tempat saya memperdalam logika pemrograman, pengembangan web, dan cara mengubah ide menjadi antarmuka yang berguna.</p>
          </div>
        </div>

        <article className={`education-card cursor-target reveal${reveal ? ' is-visible' : ''}`} ref={revealRef}>
          <div className="education-card__topline">
            <span className="education-card__number">01</span>
            <span className="status-badge"><i /> Sedang Belajar</span>
          </div>
          <div className="education-card__body">
            <div className="education-card__content">
              <p className="card-eyebrow">Pengembangan Perangkat Lunak &amp; Gim</p>
              <h3>SMKN 7 Samarinda</h3>
              <p className="card-period">Kelas XII · 07/2024 — 07/2027</p>
              <p className="education-card__summary">Mendalami pengembangan web, PBO, dan struktur data sambil membangun proyek nyata secara kolaboratif di jurusan PPLG.</p>
              <div className="tag-list" aria-label="Bidang yang dieksplorasi">
                {TAGS.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>
            <div className="education-card__image-wrap">
              <img className="education-card__image" src={schoolPhoto} alt="Gedung SMKN 7 Samarinda" width="800" height="1201" loading="lazy" decoding="async" />
              <img className="education-card__logo" src={schoolLogo} alt="Logo SMKN 7 Samarinda" width="200" height="200" loading="lazy" decoding="async" />
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

export default Education
