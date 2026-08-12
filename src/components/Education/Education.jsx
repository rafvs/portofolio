import ProfileCard from '../ProfileCard/ProfileCard.jsx'
import useInView from '../../hooks/useInView.js'
import schoolPhoto from '../../assets/school-photo.webp'
import schoolLogo from '../../assets/shcool logo.png'
import './Education.css'

// "Pendidikan" section. Two-column layout mirroring Experience: the left column
// reveals its copy on scroll-into-view (eyebrow → title → org → periode → points,
// staggered via CSS transition-delay driven by a single is-visible class), the
// right column is a React Bits ProfileCard styled for the school.
const POINTS = [
  'Mendalami Algoritma & Struktur Data, Pemrograman Berorientasi Objek (PBO), dan Pengembangan Web (HTML, CSS, PHP).',
  'Terlibat langsung dalam proyek front-end secara kolaboratif bersama tim.',
  'Membangun situs web responsif dan aplikasi manajemen tugas sebagai bagian dari portofolio proyek.',
  'Menguasai Tailwind CSS dan terbiasa mendesain antarmuka lewat Figma/Canva.',
]

const Education = ({ className = '' }) => {
  const [revealRef, reveal] = useInView({ once: true, rootMargin: '-10% 0px -15% 0px' })

  return (
    <section className={`edu${className ? ` ${className}` : ''}`} id="education">
      <div className="edu-grid">
        {/* Left: education copy — staggered reveal on scroll-in */}
        <div className={`edu-left${reveal ? ' is-visible' : ''}`} ref={revealRef}>
          <span className="edu-eyebrow">Pendidikan</span>

          <h2 className="edu-title">SMKN 7 Samarinda</h2>

          <p className="edu-org">Pengembangan Perangkat Lunak &amp; Gim (PPLG) — Kelas XII</p>

          <p className="edu-period">07/2024 – 07/2027</p>

          <ul className="edu-points">
            {POINTS.map((point, i) => (
              <li key={i} style={{ '--i': i }}>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: ProfileCard for the school. */}
        <div className="edu-card">
          <ProfileCard
            avatarUrl={schoolPhoto}
            iconUrl={schoolLogo}
            name="SMKN 7 Samarinda"
            title="PPLG · Kelas XII"
            enableTilt
            enableMobileTilt={false}
            behindGlowEnabled
            behindGlowColor="rgba(255, 255, 255, 0.4)"
            behindGlowSize="60%"
            innerGradient="linear-gradient(145deg, #2a2a2d80 0%, #55555a44 100%)"
            showUserInfo={false}
          />
        </div>
      </div>
    </section>
  )
}

export default Education
