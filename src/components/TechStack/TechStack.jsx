import useInView from '../../hooks/useInView.js'
import BlurText from '../BlurText/BlurText.jsx'
import './TechStack.css'

const STACK = [
  { short: 'HTML', name: 'HTML5' },
  { short: 'CSS', name: 'CSS3' },
  { short: 'TW', name: 'Tailwind CSS' },
  { short: 'JS', name: 'JavaScript' },
  { short: 'PHP', name: 'PHP' },
  { short: 'SQL', name: 'MySQL' },
  { short: 'Git', name: 'Git' },
  { short: 'GH', name: 'GitHub' },
  { short: 'VS', name: 'VS Code' },
  { short: 'Fig', name: 'Figma' },
]

const TechStack = ({ className = '' }) => {
  const [revealRef, reveal] = useInView({ once: true, rootMargin: '-10% 0px -10% 0px' })
  const marqueeItems = [...STACK, ...STACK]

  return (
    <section className={`stack${className ? ` ${className}` : ''}`} id="stack">
      <div className="stack-inner section-shell">
        <div className={`section-heading reveal${reveal ? ' is-visible' : ''}`} ref={revealRef}>
          <p className="section-kicker">05 / Stack</p>
          <div className="section-heading__copy">
            <BlurText
              text="Alat yang membantu ide jadi nyata."
              className="section-title"
              delay={60}
              animateBy="words"
              direction="bottom"
              threshold={0.2}
              rootMargin="-80px"
            />
            <p className="section-description">Teknologi dan tools yang saya gunakan untuk merancang, membangun, dan menyempurnakan produk digital.</p>
          </div>
        </div>
      </div>

      <div className="stack-marquee" aria-label="Teknologi yang digunakan">
        <div className="stack-marquee__track">
          {marqueeItems.map((item, index) => (
            <div className="stack-item" key={`${item.name}-${index}`}>
              <span className="stack-mark" aria-hidden="true">{item.short}</span>
              <span>{item.name}</span>
              <i aria-hidden="true">/</i>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TechStack
