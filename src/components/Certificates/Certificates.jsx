import useInView from '../../hooks/useInView.js'
import BlurText from '../BlurText/BlurText.jsx'
import './Certificates.css'

/**
 * Komponen Certificates - Menampilkan halaman/section daftar sertifikat pencapaian.
 * @param {Object} props
 * @param {string} [props.className] - Kelas CSS tambahan.
 * @returns {JSX.Element} Elemen section Certificates.
 */
const Certificates = ({ className = '' }) => {
  // INTERAKSI ANIMASI (VIEWPORT DETECT): Menggunakan custom hook useInView untuk mendeteksi
  // kapan section Sertifikat masuk ke viewport. Status 'reveal' akan bernilai true ketika masuk.
  const [revealRef, reveal] = useInView({ once: true, rootMargin: '-10% 0px -10% 0px' })

  return (
    <section className={`certificates${className ? ` ${className}` : ''}`} id="certificates">
      <div className="section-shell">
        
        {/* BAGIAN HEADER SECTION: Menampilkan kicker dan judul dengan animasi BlurText */}
        <div className="section-heading">
          <p className="section-kicker">04 / Sertifikat</p>
          <div className={`section-heading__copy reveal${reveal ? ' is-visible' : ''}`} ref={revealRef}>
            {/* Animasi teks masuk dengan efek blur per kata */}
            <BlurText
              text="Catatan proses belajar."
              className="section-title"
              delay={60}
              animateBy="words"
              direction="bottom"
              threshold={0.2}
              rootMargin="-80px"
            />
            <p className="section-description">Ruang untuk menyimpan pencapaian dan pembelajaran yang sedang saya kumpulkan.</p>
          </div>
        </div>

        {/* DATA SERTIFIKAT KOSONG (PLACEHOLDER):
            - Ditampilkan sebagai status sementara sebelum daftar sertifikat nyata dimasukkan. */}
        <div className="certificate-empty reveal is-visible" aria-label="Daftar sertifikat kosong">
          <span className="certificate-empty__number">01</span>
          <div>
            <h3>Daftar sertifikat menyusul.</h3>
            <p>Nama sertifikat, penerbit, dan tahun akan ditambahkan setelah data tersedia.</p>
          </div>
          <span className="certificate-empty__mark" aria-hidden="true">+</span>
        </div>
      </div>
    </section>
  )
}

export default Certificates
