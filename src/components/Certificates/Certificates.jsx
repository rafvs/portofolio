import { useTranslation } from 'react-i18next'
import useInView from '../../hooks/useInView.js'
import useSupabaseContent from '../../hooks/useSupabaseContent.js'
import BlurText from '../BlurText/BlurText.jsx'
import './Certificates.css'

/**
 * Komponen Certificates - Menampilkan halaman/section daftar sertifikat pencapaian.
 * @param {Object} props
 * @param {string} [props.className] - Kelas CSS tambahan.
 * @returns {JSX.Element} Elemen section Certificates.
 */
const Certificates = ({ className = '' }) => {
  const { t } = useTranslation()
  const certificates = useSupabaseContent('certificates')
  // INTERAKSI ANIMASI (VIEWPORT DETECT): Menggunakan custom hook useInView untuk mendeteksi
  // kapan section Sertifikat masuk ke viewport. Status 'reveal' akan bernilai true ketika masuk.
  const [revealRef, reveal] = useInView({ once: true, rootMargin: '-10% 0px -10% 0px' })

  return (
    <section className={`certificates${className ? ` ${className}` : ''}`} id="certificates">
      <div className="section-shell">
        
        {/* BAGIAN HEADER SECTION: Menampilkan kicker dan judul dengan animasi BlurText */}
        <div className="section-heading">
          <p className="section-kicker">{t('sections.certificatesKicker')}</p>
          <div className={`section-heading__copy reveal${reveal ? ' is-visible' : ''}`} ref={revealRef}>
            {/* Animasi teks masuk dengan efek blur per kata */}
            <BlurText
              text={t('sections.certificatesTitle')}
              className="section-title"
              delay={60}
              animateBy="words"
              direction="bottom"
              threshold={0.2}
              rootMargin="-80px"
            />
            <p className="section-description">{t('sections.certificatesDescription')}</p>
          </div>
        </div>

        {/* DATA SERTIFIKAT KOSONG (PLACEHOLDER):
            - Ditampilkan sebagai status sementara sebelum daftar sertifikat nyata dimasukkan. */}
        {certificates.length ? <div className="certificate-list">{certificates.map((certificate, index) => <a className="certificate-item reveal is-visible" href={certificate.url || certificate.image_url} target="_blank" rel="noreferrer" key={certificate.id}>{certificate.image_url && <img src={certificate.image_url} alt="" loading="lazy" />}<span>{String(index + 1).padStart(2, '0')}</span><div><h3>{certificate.title}</h3><p>{certificate.issuer} · {certificate.date}</p></div><b>↗</b></a>)}</div> : <div className="certificate-empty reveal is-visible" aria-label={t('certificates.emptyLabel')}>
          <span className="certificate-empty__number">01</span>
          <div>
            <h3>{t('certificates.empty')}</h3>
            <p>{t('certificates.emptyDescription')}</p>
          </div>
          <span className="certificate-empty__mark" aria-hidden="true">+</span>
        </div>}
      </div>
    </section>
  )
}

export default Certificates
