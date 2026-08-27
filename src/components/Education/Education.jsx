import { useTranslation } from 'react-i18next'
import useInView from '../../hooks/useInView.js'
import useSupabaseContent from '../../hooks/useSupabaseContent.js'
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
  const { t, i18n } = useTranslation()

  // 📥 MENGAMBIL DATA DARI DATABASE SUPABASE:
  // Memanggil custom hook useSupabaseContent untuk mengambil data dari tabel 'education'.
  const remoteEducation = useSupabaseContent('education')

  const language = i18n.resolvedLanguage === 'en' ? 'en' : 'id'
  const [revealRef, reveal] = useInView({ once: true, rootMargin: '-10% 0px -10% 0px' })

  // Jika remoteEducation ada isinya, gunakan data Supabase. Jika belum, gunakan fallback data default.
  const educationList = remoteEducation && remoteEducation.length > 0
    ? remoteEducation
    : [
        {
          institution: t('education.school'),
          [`major_${language}`]: t('education.eyebrow'),
          period: t('education.period'),
          [`summary_${language}`]: t('education.summary'),
          tags: t('education.tags', { returnObjects: true }),
          image_url: schoolPhoto,
          logo_url: schoolLogo,
        },
      ]

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

        {/* DAFTAR KARTU PENDIDIKAN (EDUCATION CARDS):
            - Menggunakan class 'reveal' yang ditambahkan 'is-visible' secara reaktif saat hook useInView terpicu (reveal = true). */}
        <div className={`education-list reveal${reveal ? ' is-visible' : ''}`} ref={revealRef}>
          {educationList.map((item, index) => {
            const tags = Array.isArray(item.tags)
              ? item.tags
              : (item.tags || (item.id ? [] : t('education.tags', { returnObjects: true })))
            const major = item[`major_${language}`] || item.major_id || item.major || t('education.eyebrow')
            const summary = item[`summary_${language}`] || item.summary_id || item.summary || t('education.summary')
            const institution = item.institution || t('education.school')
            const period = item.period || t('education.period')
            const status = item[`status_${language}`] || item.status_id || item.status || t('education.status')
            const image = item.image_url || schoolPhoto
            const logo = item.logo_url || schoolLogo

            return (
              <article key={item.id || index} className="education-card cursor-target">
                <div className="education-card__topline">
                  <span className="education-card__number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="status-badge"><i /> {status}</span>
                </div>
                <div className="education-card__body">
                  
                  {/* KONTEN DETAIL PENDIDIKAN */}
                  <div className="education-card__content">
                    <p className="card-eyebrow">{major}</p>
                    <h3>{institution}</h3>
                    <p className="card-period">{period}</p>
                    <p className="education-card__summary">{summary}</p>
                    
                    {/* DAFTAR BIDANG/TAGS */}
                    {Array.isArray(tags) && tags.length > 0 && (
                      <div className="tag-list" aria-label={t('education.tagsLabel')}>
                        {tags.map((tag) => <span key={tag}>{tag}</span>)}
                      </div>
                    )}
                  </div>

                  {/* FOTO & LOGO SEKOLAH */}
                  <div className="education-card__image-wrap">
                    <img className="education-card__image" src={image} alt={t('education.alt')} width="800" height="1201" loading="lazy" decoding="async" />
                    <img className="education-card__logo" src={logo} alt={t('education.logoAlt')} width="200" height="200" loading="lazy" decoding="async" />
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

export default Education
