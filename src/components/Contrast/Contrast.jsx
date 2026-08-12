import useInView from '../../hooks/useInView.js'
import './Contrast.css'

// Light "contrast" band. The rest of the page is deep-space dark, so this
// bright section resets the eye and keeps the overall theme from feeling too
// heavy. It carries a short positioning statement plus a row of stat cards.
const STATS = [
  { value: '3+', label: 'Tahun berkarya', note: 'di bidang web & desain' },
  { value: '10+', label: 'Proyek selesai', note: 'web, UI, & konten digital' },
  { value: '5+', label: 'Teknologi inti', note: 'yang saya gunakan tiap hari' },
  { value: '100%', label: 'Komitmen', note: 'pada detail & kualitas' },
]

const Contrast = ({ className = '' }) => {
  const [revealRef, reveal] = useInView({ once: true, rootMargin: '-10% 0px -10% 0px' })

  return (
    <section className={`contrast${className ? ` ${className}` : ''}`} id="tentang">
      <div className={`contrast-inner${reveal ? ' is-visible' : ''}`} ref={revealRef}>
        <div className="contrast-head">
          <span className="contrast-eyebrow">Tentang Saya</span>
          <h2 className="contrast-title">
            Desain bersih. Kode rapi. <span className="contrast-title__accent">Hasil berkesan.</span>
          </h2>
          <p className="contrast-copy">
            Saya percaya produk digital yang baik lahir dari keseimbangan antara estetika dan
            fungsionalitas. Fokus saya adalah membangun antarmuka yang tidak hanya indah dipandang,
            tetapi juga cepat, mudah diakses, dan menyenangkan digunakan.
          </p>
        </div>

        <ul className="contrast-stats">
          {STATS.map((s, i) => (
            <li className="contrast-stat" key={s.label} style={{ '--i': i }}>
              <span className="contrast-stat__value">{s.value}</span>
              <span className="contrast-stat__label">{s.label}</span>
              <span className="contrast-stat__note">{s.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Contrast
