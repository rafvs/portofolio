import { useState } from 'react'
import FaultyTerminal from './components/FaultyTerminal/FaultyTerminal.jsx'
import GlassSurface from './components/GlassSurface/GlassSurface.jsx'
import TargetCursor from './components/TargetCursor/TargetCursor.jsx'
import BlurText from './components/BlurText/BlurText.jsx'
import SpecularButton from './components/SpecularButton/SpecularButton.jsx'
import RevealImage from './components/RevealImage/RevealImage.jsx'
import Experience from './components/Experience/Experience.jsx'
import Education from './components/Education/Education.jsx'
import Contrast from './components/Contrast/Contrast.jsx'
import Projects from './components/Projects/Projects.jsx'
import TechStack from './components/TechStack/TechStack.jsx'
import Footer from './components/Footer/Footer.jsx'
import heroImage from './assets/hero-photo.webp'
import frontImage from './assets/front-photo.webp'
import backImage from './assets/back-photo.webp'
import './App.css'

const heroImages = [heroImage]

// Navbar items are in-page scroll anchors. Native href="#id" + CSS
// scroll-behavior:smooth (see index.css) handles the smooth scroll; each target
// section sets scroll-margin-top so the fixed navbar doesn't cover its heading.
const NAV_ITEMS = [
  { label: 'Karya', href: '#projects' },
  { label: 'Pengalaman', href: '#pengalaman' },
  { label: 'Tentang', href: '#tentang' },
  { label: 'Stack', href: '#stack' },
  { label: 'Kontak', href: '#footer' },
]

// Programmatic smooth scroll for the SpecularButtons (they're <button>, not <a>).
const scrollToId = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function App() {
  const [showSub, setShowSub] = useState(false)
  const [showCta, setShowCta] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      {/* Custom targeting cursor */}
      <TargetCursor targetSelector=".cursor-target" spinDuration={2} parallaxOn={true} />

      {/* Glassmorphic navbar */}
      <header
        style={{
          position: 'fixed',
          top: '1.25rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          width: 'min(1100px, calc(100% - 2rem))',
        }}
      >
        <GlassSurface
          width="100%"
          height={64}
          borderRadius={32}
          backgroundOpacity={0.08}
          saturation={1.4}
          className="landing-navbar"
        >
          <nav className="nav-bar">
            <span className="nav-logo">Nerravs</span>

            {/* Desktop links — hidden on small screens (see App.css) */}
            <div className="nav-links">
              {NAV_ITEMS.map((item) => (
                <a key={item.href} href={item.href} className="nav-link cursor-target">
                  {item.label}
                </a>
              ))}
            </div>

            <div className="nav-actions">
              <SpecularButton
                size="sm"
                className="cursor-target nav-cta"
                lineColor="#e9d5ff"
                baseColor="#6d28d9"
                textColor="#ffffff"
                onClick={() => scrollToId('footer')}
              >
                Hubungi Saya
              </SpecularButton>

              {/* Hamburger — only rendered on small screens via CSS */}
              <button
                type="button"
                className="nav-burger cursor-target"
                aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((o) => !o)}
              >
                <span className={`nav-burger__bar${menuOpen ? ' is-open' : ''}`} />
                <span className={`nav-burger__bar${menuOpen ? ' is-open' : ''}`} />
                <span className={`nav-burger__bar${menuOpen ? ' is-open' : ''}`} />
              </button>
            </div>
          </nav>
        </GlassSurface>

        {/* Mobile dropdown menu — slides down under the navbar */}
        <div className={`nav-mobile${menuOpen ? ' is-open' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-mobile__link"
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            className="nav-mobile__cta"
            onClick={() => {
              closeMenu()
              scrollToId('footer')
            }}
          >
            Hubungi Saya
          </button>
        </div>
      </header>

      {/* Hero: two-column layout */}
      <main
        className="snap-section hero-section"
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'stretch',
          padding: '7rem 0 5rem',
          color: '#fff',
          overflow: 'hidden',
        }}
      >
        {/* FaultyTerminal — scoped to the hero only (fills the hero, not the page) */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <FaultyTerminal
            scale={1.4}
            gridMul={[2, 1]}
            digitSize={2.2}
            timeScale={0.7}
            pause={false}
            scanlineIntensity={0.8}
            glitchAmount={1}
            flickerAmount={1}
            noiseAmp={0.8}
            chromaticAberration={0}
            dither={0}
            curvature={0.21}
            tint="#6ea5fd"
            mouseReact={true}
            mouseStrength={1.3}
            pageLoadAnimation={true}
            brightness={0.3}
          />
        </div>

        <div className="hero-grid">
          {/* Left: text + CTA */}
          <div className="hero-left">
            <BlurText
              text="Membangun pengalaman digital yang berkesan."
              animateBy="words"
              direction="bottom"
              delay={90}
              className="hero-headline"
              onAnimationComplete={() => setShowSub(true)}
            />

            {showSub && (
              <BlurText
                text="Saya Rafi, seorang Frontend Developer & Digital Designer yang senang mengubah ide menjadi produk digital yang interaktif dan enak dipakai. Jelajahi karya saya di bawah ini."
                animateBy="words"
                direction="bottom"
                delay={28}
                stepDuration={0.3}
                className="hero-sub"
                onAnimationComplete={() => setShowCta(true)}
              />
            )}

            <div className={`hero-cta${showCta ? ' is-visible' : ''}`}>
              <SpecularButton
                className="cursor-target"
                lineColor="#e9d5ff"
                baseColor="#7c3aed"
                textColor="#ffffff"
                intensity={1.1}
                onClick={() => scrollToId('projects')}
              >
                Lihat Karya
              </SpecularButton>
              <SpecularButton
                className="cursor-target"
                lineColor="#a78bfa"
                baseColor="#3b2a5a"
                textColor="#e9d5ff"
                tintOpacity={0.04}
                intensity={0.8}
                onClick={() => scrollToId('education')}
              >
                Tentang Saya
              </SpecularButton>
            </div>

            {/* Quick facts — fills the empty space under the CTAs so the hero
                reads dense & informative instead of trailing off. */}
            <ul className={`hero-stats${showCta ? ' is-visible' : ''}`}>
              {[
                ['5+', 'Proyek Web'],
                ['3+', 'Tahun Belajar'],
                ['10+', 'Teknologi'],
              ].map(([value, label], i) => (
                <li key={label} className="hero-stat" style={{ '--i': i }}>
                  <span className="hero-stat__value">{value}</span>
                  <span className="hero-stat__label">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: interactive reveal + periodic glitch */}
          <div className="hero-right">
            <RevealImage
              images={heroImages}
              glitchImages={heroImages}
              revealRadius={300}
              glitchInterval={3000}
              glitchDuration={700}
              blendMode="lighten"
            />
          </div>
        </div>

        {/* Marquee strip at the base of the hero — fills the bottom edge and
            signals the page continues below. */}
        <div className="hero-marquee" aria-hidden="true">
          <div className="hero-marquee__track">
            {[0, 1].map((n) => (
              <span className="hero-marquee__set" key={n}>
                {['Frontend Developer', 'UI Design', 'React', 'Tailwind CSS', 'Figma', 'Digital Designer'].map((w) => (
                  <span className="hero-marquee__item" key={w}>
                    {w} <i>✦</i>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Pengalaman: scroll-triggered text + draggable 3D lanyard card */}
      <Experience frontImage={frontImage} backImage={backImage} className="snap-section" />

      {/* Pendidikan: scroll-reveal copy + tilting ProfileCard */}
      <Education className="snap-section" />

      {/* Tentang: bright contrast band to balance the dark theme */}
      <Contrast className="snap-section" />

      {/* Karya: hover-expand accordion gallery of projects */}
      <Projects className="snap-section" />

      {/* Tech Stack: continuous logo marquee */}
      <TechStack className="snap-section" />

      {/* Kontak: collaboration CTA + contact links */}
      <Footer className="snap-section" />
    </div>
  )
}

export default App
