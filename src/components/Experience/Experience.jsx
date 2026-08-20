import { useTranslation } from 'react-i18next'
import useInView from '../../hooks/useInView.js'
import SplitText from '../SplitText/SplitText.jsx'
import './Experience.css'

/**
 * Komponen Experience - Menampilkan riwayat organisasi dan pengalaman kerja/kepemimpinan.
 * @param {Object} props
 * @param {string} props.frontImage - Jalur/URL gambar utama dokumentasi.
 * @param {string} [props.className] - Kelas CSS tambahan.
 * @returns {JSX.Element} Elemen section Experience.
 */
const Experience = ({ frontImage, className = '' }) => {
  const { t } = useTranslation()
  const tags = t('experience.tags', { returnObjects: true })
  // INTERAKSI ANIMASI (VIEWPORT DETECT): Menggunakan custom hook useInView untuk mendeteksi
  // kapan kartu pengalaman masuk ke viewport. Status 'reveal' akan bernilai true ketika masuk.
  const [revealRef, reveal] = useInView({ once: true, rootMargin: '-10% 0px -10% 0px' })

  return (
    <section className={`experience${className ? ` ${className}` : ''}`} id="pengalaman">
      <div className="section-shell">
        
        {/* BAGIAN HEADER SECTION: Menampilkan nomor urut dan judul section */}
        <div className="section-heading">
          <p className="section-kicker">{t('sections.experienceKicker')}</p>
          <div className="section-heading__copy">
            {/* Animasi memecah kata (SplitText) untuk judul section */}
            <SplitText
              tag="h2"
              className="section-title"
              text={t('sections.experienceTitle')}
              splitType="words"
              delay={60}
              duration={0.7}
              from={{ opacity: 0, y: 26 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              rootMargin="-80px"
              textAlign="left"
            />
            <p className="section-description">{t('sections.experienceDescription')}</p>
          </div>
        </div>

        {/* KARTU PENGALAMAN (EXPERIENCE CARD):
            - Menggunakan class 'reveal' yang ditambahkan 'is-visible' secara reaktif saat hook useInView terpicu (reveal = true).
            - Menggunakan ref 'revealRef' untuk memantau elemen ini. */}
        <article className={`experience-card cursor-target reveal${reveal ? ' is-visible' : ''}`} ref={revealRef}>
          <div className="experience-card__topline">
            <span className="experience-card__number">01</span>
            <span className="status-badge"><i /> {t('experience.status')}</span>
          </div>
          <div className="experience-card__body">
            
            {/* KONTEN DETAIL PENGALAMAN */}
            <div className="experience-card__content">
              <p className="card-eyebrow">{t('experience.eyebrow')}</p>
              <h3>{t('experience.role')}</h3>
              <p className="card-period">{t('experience.period')}</p>
              <p className="experience-card__summary">{t('experience.summary')}</p>
              
              {/* DAFTAR BIDANG/TAGS PENGALAMAN */}
              <div className="tag-list" aria-label={t('experience.tagsLabel')}>
                {tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>

            {/* FOTO DOKUMENTASI KEGIATAN:
                - Menggunakan performa optimal dengan 'lazy' loading dan 'async' decoding.
                - Efek hitam-putih (grayscale) diatur pada CSS dan bertransisi warna saat kartu di-hover. */}
            <div className="experience-card__image-wrap">
              <img className="experience-card__image" src={frontImage} alt={t('experience.alt')} width="800" height="1000" loading="lazy" decoding="async" />
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

export default Experience
