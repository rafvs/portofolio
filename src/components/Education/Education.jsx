import { useTranslation } from 'react-i18next'
import useInView from '../../hooks/useInView.js'
import SplitText from '../SplitText/SplitText.jsx'
import schoolPhoto from '../../assets/school-photo.webp'
import schoolLogo from '../../assets/shcool logo.png'
import './Education.css'

/**
 * Komponen Education - Menampilkan riwayat akademis dan bidang pembelajaran.
 * @param {Object} props
 * @param {string} [props.className] - Kelas CSS tambahan.
 * @returns {JSX.Element} Elemen section Education.
 */
const Education = ({ className = '' }) => {
  const { t } = useTranslation()
  const tags = t('education.tags', { returnObjects: true })
  // INTERAKSI ANIMASI (VIEWPORT DETECT): Menggunakan custom hook useInView untuk mendeteksi
  // kapan kartu pendidikan masuk ke viewport. Status 'reveal' akan bernilai true ketika masuk.
  const [revealRef, reveal] = useInView({ once: true, rootMargin: '-10% 0px -10% 0px' })

  return (
    <section className={`education${className ? ` ${className}` : ''}`} id="education">
      <div className="section-shell">
        
        {/* BAGIAN HEADER SECTION: Menampilkan kicker/nomor urut dan judul section */}
        <div className="section-heading">
          <p className="section-kicker">{t('sections.educationKicker')}</p>
          <div className="section-heading__copy">
            {/* Animasi memecah kata (SplitText) untuk judul section */}
            <SplitText
              tag="h2"
              className="section-title"
              text={t('sections.educationTitle')}
              splitType="words"
              delay={60}
              duration={0.7}
              from={{ opacity: 0, y: 26 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              rootMargin="-80px"
              textAlign="left"
            />
            <p className="section-description">{t('sections.educationDescription')}</p>
          </div>
        </div>

        {/* KARTU PENDIDIKAN (EDUCATION CARD):
            - Menggunakan class 'reveal' yang ditambahkan 'is-visible' secara reaktif saat hook useInView terpicu (reveal = true).
            - Menggunakan ref 'revealRef' untuk memantau elemen ini. */}
        <article className={`education-card cursor-target reveal${reveal ? ' is-visible' : ''}`} ref={revealRef}>
          <div className="education-card__topline">
            <span className="education-card__number">01</span>
            <span className="status-badge"><i /> {t('education.status')}</span>
          </div>
          <div className="education-card__body">
            
            {/* KONTEN DETAIL PENDIDIKAN */}
            <div className="education-card__content">
              <p className="card-eyebrow">{t('education.eyebrow')}</p>
              <h3>{t('education.school')}</h3>
              <p className="card-period">{t('education.period')}</p>
              <p className="education-card__summary">{t('education.summary')}</p>
              
              {/* DAFTAR BIDANG/TAGS */}
              <div className="tag-list" aria-label={t('education.tagsLabel')}>
                {tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>

            {/* FOTO & LOGO SEKOLAH:
                - Menggunakan performa optimal dengan 'lazy' loading dan 'async' decoding.
                - Logo SMKN 7 disembunyikan secara default (opacity: 0) dan akan muncul membesar saat kartu di-hover (diatur di CSS). */}
            <div className="education-card__image-wrap">
              <img className="education-card__image" src={schoolPhoto} alt={t('education.alt')} width="800" height="1201" loading="lazy" decoding="async" />
              <img className="education-card__logo" src={schoolLogo} alt={t('education.logoAlt')} width="200" height="200" loading="lazy" decoding="async" />
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

export default Education
