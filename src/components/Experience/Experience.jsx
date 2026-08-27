import { useTranslation } from 'react-i18next'
import useInView from '../../hooks/useInView.js'
import useSupabaseContent from '../../hooks/useSupabaseContent.js'
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
  const { t, i18n } = useTranslation()

  // 📥 MENGAMBIL DATA DARI DATABASE SUPABASE:
  // Memanggil custom hook useSupabaseContent untuk mengambil data dari tabel 'experiences'.
  const remoteExperiences = useSupabaseContent('experiences')

  const language = i18n.resolvedLanguage === 'en' ? 'en' : 'id'
  const [revealRef, reveal] = useInView({ once: true, rootMargin: '-10% 0px -10% 0px' })

  const experienceList = remoteExperiences && remoteExperiences.length > 0
    ? remoteExperiences
    : [
        {
          organization: t('experience.eyebrow'),
          [`role_${language}`]: t('experience.role'),
          period: t('experience.period'),
          [`summary_${language}`]: t('experience.summary'),
          tags: t('experience.tags', { returnObjects: true }),
          image_url: frontImage,
        },
      ]

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

        {/* DAFTAR KARTU PENGALAMAN (EXPERIENCE CARDS):
            - Menggunakan class 'reveal' yang ditambahkan 'is-visible' secara reaktif saat hook useInView terpicu (reveal = true). */}
        <div className={`experience-list reveal${reveal ? ' is-visible' : ''}`} ref={revealRef}>
          {experienceList.map((item, index) => {
            const tags = Array.isArray(item.tags)
              ? item.tags
              : (item.tags || (item.id ? [] : t('experience.tags', { returnObjects: true })))
            const role = item[`role_${language}`] || item.role_id || item.role || t('experience.role')
            const summary = item[`summary_${language}`] || item.summary_id || item.summary || t('experience.summary')
            const organization = item.organization || t('experience.eyebrow')
            const period = item.period || t('experience.period')
            const status = item[`status_${language}`] || item.status_id || item.status || t('experience.status')
            const image = item.image_url || frontImage

            return (
              <article key={item.id || index} className="experience-card cursor-target">
                <div className="experience-card__topline">
                  <span className="experience-card__number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="status-badge"><i /> {status}</span>
                </div>
                <div className="experience-card__body">
                  
                  {/* KONTEN DETAIL PENGALAMAN */}
                  <div className="experience-card__content">
                    <p className="card-eyebrow">{organization}</p>
                    <h3>{role}</h3>
                    <p className="card-period">{period}</p>
                    <p className="experience-card__summary">{summary}</p>
                    
                    {/* DAFTAR BIDANG/TAGS PENGALAMAN */}
                    {Array.isArray(tags) && tags.length > 0 && (
                      <div className="tag-list" aria-label={t('experience.tagsLabel')}>
                        {tags.map((tag) => <span key={tag}>{tag}</span>)}
                      </div>
                    )}
                  </div>

                  {/* FOTO DOKUMENTASI KEGIATAN */}
                  <div className="experience-card__image-wrap">
                    <img className="experience-card__image" src={image} alt={t('experience.alt')} width="800" height="1000" loading="lazy" decoding="async" />
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Experience
