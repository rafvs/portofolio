import {
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiJavascript,
  SiPhp,
  SiMysql,
  SiGit,
  SiGithub,
  SiFigma,
} from 'react-icons/si'
import { TbBrandVscode } from 'react-icons/tb'
import LogoLoop from '../LogoLoop/LogoLoop.jsx'
import useInView from '../../hooks/useInView.js'
import './TechStack.css'

// Glow colour the LogoLoop's edge fade blends into. Matches the monochrome page
// backdrop so the marquee fades out into the dark instead of a coloured band.
const SECTION_BG = '#0b0b0c'

// Tech stack marquee. Each logo is a react-icons node tinted with its brand
// colour; the icons scale to the LogoLoop `logoHeight` (they render at 1em).
// Note: Simple Icons dropped the CSS3 mark (use SiCss) and VS Code entirely
// (use TbBrandVscode from react-icons/tb).
const LOGOS = [
  { node: <SiHtml5 style={{ color: '#E34F26' }} />, title: 'HTML5' },
  { node: <SiCss style={{ color: '#1572B6' }} />, title: 'CSS3' },
  { node: <SiTailwindcss style={{ color: '#38BDF8' }} />, title: 'Tailwind CSS' },
  { node: <SiJavascript style={{ color: '#F7DF1E' }} />, title: 'JavaScript' },
  { node: <SiPhp style={{ color: '#8892BF' }} />, title: 'PHP' },
  { node: <SiMysql style={{ color: '#4479A1' }} />, title: 'MySQL' },
  { node: <SiGit style={{ color: '#F05032' }} />, title: 'Git' },
  { node: <SiGithub style={{ color: '#ffffff' }} />, title: 'GitHub' },
  { node: <TbBrandVscode style={{ color: '#3B9EFF' }} />, title: 'VS Code' },
  { node: <SiFigma style={{ color: '#F24E1E' }} />, title: 'Figma' },
]

const TechStack = ({ className = '' }) => {
  const [revealRef, reveal] = useInView({ once: true, rootMargin: '-10% 0px -10% 0px' })

  return (
    <section className={`stack${className ? ` ${className}` : ''}`} id="stack">
      <div className="stack-inner">
        <div className={`stack-head${reveal ? ' is-visible' : ''}`} ref={revealRef}>
          <span className="stack-eyebrow">Tech Stack</span>
          <h2 className="stack-title">Teknologi yang Saya Gunakan</h2>
        </div>

        <div className="stack-loop">
          <LogoLoop
            logos={LOGOS}
            speed={90}
            direction="left"
            logoHeight={44}
            gap={56}
            fadeOut
            fadeOutColor={SECTION_BG}
            scaleOnHover
            ariaLabel="Teknologi yang saya gunakan"
          />
        </div>
      </div>
    </section>
  )
}

export default TechStack
