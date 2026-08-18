import useInView from '../../hooks/useInView.js'
import SplitText from '../SplitText/SplitText.jsx'
import './Footer.css'

const CONTACT_ITEMS = [
  {
    name: 'WhatsApp',
    value: 'Hubungi',
    href: 'https://wa.me/6289630415126',
    isExternal: true,
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z" />
      </svg>
    ),
  },
  {
    name: 'Email',
    value: 'vnoved@gmail.com',
    href: 'mailto:vnoved@gmail.com',
    isExternal: false,
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    value: 'github.com/rafvs',
    href: 'https://github.com/rafvs',
    isExternal: true,
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    value: '@nerravs',
    href: 'https://instagram.com/nerravs',
    isExternal: true,
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
]

/**
 * Komponen Footer - Menampilkan bagian kaki halaman dengan informasi kontak dan sosial media.
 * @param {Object} props
 * @param {string} [props.className] - Kelas CSS tambahan.
 * @returns {JSX.Element} Elemen footer halaman.
 */
const Footer = ({ className = '' }) => {
  // INTERAKSI ANIMASI (VIEWPORT DETECT): Menggunakan custom hook useInView untuk mendeteksi
  // kapan footer masuk ke viewport. Status 'reveal' akan bernilai true ketika masuk.
  const [revealRef, reveal] = useInView({ once: true, rootMargin: '-10% 0px -5% 0px' })

  return (
    <footer className={`footer${className ? ` ${className}` : ''}`} id="footer">
      <div className="footer-inner section-shell">
        
        {/* KARTU UTAMA FOOTER (CONTACT CARD):
            - Menggunakan class 'reveal' yang ditambahkan 'is-visible' secara reaktif saat hook useInView terpicu (reveal = true).
            - Menggunakan ref 'revealRef' untuk memantau elemen ini. */}
        <div className={`footer-card reveal${reveal ? ' is-visible' : ''}`} ref={revealRef}>
          <div>
            <div className="footer-header-brand">
              <img src="/logo.png" alt="Nerravs Logo" className="footer-logo-img" />
              <p className="section-kicker">06 / Kontak</p>
            </div>
            
            {/* Animasi memecah kata (SplitText) untuk judul footer */}
            <SplitText
              tag="h2"
              className="footer-title"
              text="Mari membuat sesuatu yang berarti."
              splitType="words"
              delay={60}
              duration={0.7}
              from={{ opacity: 0, y: 26 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              rootMargin="-80px"
              textAlign="left"
            />
            <p className="footer-copy">Punya ide, proyek, atau sekadar ingin bertukar cerita? Saya terbuka untuk mendengar dan berdiskusi.</p>
          </div>

          {/* DAFTAR KONTAK SOSIAL MEDIA */}
          <div className="footer-contacts">
            {CONTACT_ITEMS.map((item) => (
              <a
                key={item.name}
                className="footer-contact cursor-target"
                href={item.href}
                target={item.isExternal ? '_blank' : undefined}
                rel={item.isExternal ? 'noopener noreferrer' : undefined}
              >
                <span className="footer-contact__label">
                  <span className="footer-contact__icon">{item.icon}</span>
                  {item.name}
                </span>
                <strong>
                  {item.value} <i aria-hidden="true">↗</i>
                </strong>
              </a>
            ))}
          </div>
        </div>

        {/* LOGO & HAK CIPTA DI BAGIAN BAWAH FOOTER */}
        <div className="footer-bottom">
          <div className="footer-bottom__brand">
            <img src="/logo.png" alt="Logo" className="footer-bottom__logo" />
            <span>© 2026 Muhammad Rafi</span>
          </div>
          <span>Nerravs / Portfolio</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
