import { FaEnvelope, FaWhatsapp, FaGithub } from 'react-icons/fa6'
import SpecularButton from '../SpecularButton/SpecularButton.jsx'
import useInView from '../../hooks/useInView.js'
import './Footer.css'

const WHATSAPP_URL = 'https://wa.me/6289630415126'
const EMAIL = 'vnoved@gmail.com'

// Contact links. GitHub is a placeholder until the real profile is known.
// TODO: replace the GitHub href with the real profile URL.
const CONTACTS = [
  { icon: <FaEnvelope />, label: EMAIL, href: `mailto:${EMAIL}`, external: false },
  { icon: <FaWhatsapp />, label: 'WhatsApp', href: WHATSAPP_URL, external: true },
  { icon: <FaGithub />, label: 'GitHub', href: 'https://github.com/username', external: true },
]

const Footer = ({ className = '' }) => {
  const [revealRef, reveal] = useInView({ once: true, rootMargin: '-10% 0px -5% 0px' })

  return (
    <footer className={`footer${className ? ` ${className}` : ''}`} id="footer">
      <div className="footer-inner">
        <div className={`footer-card${reveal ? ' is-visible' : ''}`} ref={revealRef}>
          <span className="footer-eyebrow">Kontak</span>
          <h2 className="footer-title">Mari Berkolaborasi</h2>
          <p className="footer-copy">
            Tertarik berkolaborasi atau punya proyek yang ingin didiskusikan? Hubungi saya — saya
            senang mengobrol soal ide, desain, dan produk digital.
          </p>

          <div className="footer-cta">
            <SpecularButton
              className="cursor-target"
              lineColor="#e9d5ff"
              baseColor="#7c3aed"
              textColor="#ffffff"
              intensity={1.1}
              onClick={() => window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer')}
            >
              Hubungi Saya via WhatsApp
            </SpecularButton>
          </div>

          <ul className="footer-links">
            {CONTACTS.map((c) => (
              <li key={c.label}>
                <a
                  className="footer-link cursor-target"
                  href={c.href}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span className="footer-link__icon">{c.icon}</span>
                  <span className="footer-link__label">{c.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="footer-note">
          © 2026 Muhammad Rafi · Dibuat dengan React &amp; Vite
        </p>
      </div>
    </footer>
  )
}

export default Footer
