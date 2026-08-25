import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TargetCursor from './components/TargetCursor/TargetCursor.jsx'
import LoadingScreen from './components/LoadingScreen/LoadingScreen.jsx'
import TextType from './components/TextType/TextType.jsx'
import BlurText from './components/BlurText/BlurText.jsx'
import CountUp from './components/CountUp/CountUp.jsx'
import GlareHover from './components/GlareHover/GlareHover.jsx'
import Experience from './components/Experience/Experience.jsx'
import Education from './components/Education/Education.jsx'
import Certificates from './components/Certificates/Certificates.jsx'
import Projects from './components/Projects/Projects.jsx'
import TechStack from './components/TechStack/TechStack.jsx'
import LikeButton from './components/LikeButton/LikeButton.jsx'
import Footer from './components/Footer/Footer.jsx'
import CVModal from './components/CVModal/CVModal.jsx'
import heroImage from './assets/hero-photo.webp'
import frontImage from './assets/front-photo.webp'
import useSupabaseContent from './hooks/useSupabaseContent.js'
import profileGif from './assets/profile.gif'
import './App.css'

const NAV_ITEMS = [
  { key: 'works', href: '#projects' },
  { key: 'experience', href: '#pengalaman' },
  { key: 'education', href: '#education' },
  { key: 'certificates', href: '#certificates' },
  { key: 'stack', href: '#stack' },
  { key: 'contact', href: '#footer' },
]

const HERO_STATS = [
  { num: 5, suffix: '+', labelKey: 'hero.statProjects' },
  { num: 3, suffix: '+', labelKey: 'hero.statLearning' },
  { num: 10, suffix: '+', labelKey: 'hero.statTechnology' },
]

/**
 * Mengambil tema awal dari atribut HTML atau preferensi sistem pengguna.
 * @returns {string} Tema awal ('light' atau 'dark').
 */
const getInitialTheme = () => {
  const theme = document.documentElement.dataset.theme
  if (theme === 'light' || theme === 'dark') return theme
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

/**
 * Merender ikon SVG untuk tombol toggle tema berdasarkan tema aktif.
 * @param {Object} props
 * @param {string} props.theme - Tema saat ini ('light' atau 'dark').
 * @returns {JSX.Element} Elemen SVG ikon tema.
 */
function ThemeIcon({ theme }) {
  if (theme === 'dark') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3V1m0 22v-2M3 12H1m22 0h-2M5.64 5.64 4.22 4.22m15.56 15.56-1.42-1.42m0-12.72 1.42-1.42M4.22 19.78l1.42-1.42M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.7 15.1A8.5 8.5 0 0 1 8.9 3.3 8.5 8.5 0 1 0 20.7 15.1Z" />
    </svg>
  )
}

/**
 * Komponen utama aplikasi portfolio yang mengatur layout, navigasi, dan state tema global.
 * @returns {JSX.Element} Elemen utama aplikasi.
 */
function App() {
  const { t, i18n } = useTranslation()
  const profile = useSupabaseContent('profiles', { single: true })
  const contentLanguage = i18n.resolvedLanguage === 'en' ? 'en' : 'id'
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const [photoRevealed, setPhotoRevealed] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cvOpen, setCvOpen] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('nerravs-theme', theme)

    const themeColor = document.querySelector('meta[name="theme-color"]')
    themeColor?.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#fafafa')
  }, [theme])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  const currentLanguage = i18n.resolvedLanguage || i18n.language || 'id'
  const nextLanguage = currentLanguage === 'id' ? 'en' : 'id'
  const toggleLanguage = () => i18n.changeLanguage(nextLanguage)

  return (
    <div className={`app-shell${!loading ? ' is-ready' : ''}`}>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <TargetCursor spinDuration={2.5} />
      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <nav className="nav-bar" aria-label={t('nav.label')}>
          <a className="nav-logo cursor-target" href="#top" onClick={closeMenu}>
            Nerravs<span aria-hidden="true">.</span>
          </a>

          <div className="nav-links">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} className="nav-link cursor-target">
                {t(`nav.${item.key}`)}
              </a>
            ))}
          </div>

          <div className="nav-actions">
            <button
              type="button"
              className="theme-toggle"
              aria-label={theme === 'dark' ? t('nav.switchToLight') : t('nav.switchToDark')}
              title={theme === 'dark' ? t('nav.switchToLight') : t('nav.switchToDark')}
              onClick={toggleTheme}
            >
              <ThemeIcon theme={theme} />
            </button>
            <button
              type="button"
              className="theme-toggle language-toggle cursor-target"
              aria-label={nextLanguage === 'en' ? t('nav.switchToEnglish') : t('nav.switchToIndonesian')}
              title={nextLanguage === 'en' ? t('nav.switchToEnglish') : t('nav.switchToIndonesian')}
              onClick={toggleLanguage}
            >
              <span aria-hidden="true">{currentLanguage === 'id' ? 'ID' : 'EN'}</span>
            </button>
            <LikeButton />
            <a className="button button--small nav-cta cursor-target" href="#footer">{t('nav.contact')}</a>
            <button
              type="button"
              className="nav-burger"
              aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className={`nav-burger__bar${menuOpen ? ' is-open' : ''}`} />
              <span className={`nav-burger__bar${menuOpen ? ' is-open' : ''}`} />
            </button>
          </div>
        </nav>

        <div className={`nav-mobile${menuOpen ? ' is-open' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="nav-mobile__link cursor-target" onClick={closeMenu}>
              {t(`nav.${item.key}`)}
            </a>
          ))}
          <a className="nav-mobile__cta cursor-target" href="#footer" onClick={closeMenu}>{t('nav.contact')}</a>
        </div>
      </header>

      <main>
        <section className="hero-section" id="top">
          <div className="hero-grid">
            <div className="hero-left">
              <p className="hero-kicker"><span /> {t('hero.eyebrow')}</p>
              <TextType
                key={currentLanguage}
                as="h1"
                className="hero-headline"
                text={(() => {
                  const t1 = profile?.[`tagline_${contentLanguage}`]
                  const t2 = profile?.[`tagline2_${contentLanguage}`]
                  if (t1 || t2) return [t1, t2].filter(Boolean)
                  return t('hero.typingTexts', { returnObjects: true })
                })()}
                typingSpeed={65}
                deletingSpeed={35}
                pauseDuration={2500}
                showCursor={true}
                cursorCharacter="|"
                cursorClassName="hero-cursor"
                loop={true}
                startWhen={!loading}
              />
              <BlurText
                text={profile?.[`about_${contentLanguage}`] || t('hero.intro')}
                className="hero-sub"
                delay={40}
                animateBy="words"
                direction="bottom"
                threshold={0.1}
                startWhen={!loading}
              />

              <div className="hero-cta">
                <a className="button cursor-target" href="#projects">{t('hero.viewWorks')} <span aria-hidden="true">↘</span></a>
                <a className="button button--secondary cursor-target" href="#education">{t('hero.about')}</a>
                <button
                  type="button"
                  className="button button--secondary cursor-target"
                  onClick={() => setCvOpen(true)}
                >
                  {t('hero.cv')}
                </button>
              </div>

              <ul className="hero-stats" aria-label={t('hero.statsLabel')}>
                {HERO_STATS.map((stat) => (
                  <li key={stat.labelKey} className="hero-stat">
                    <span className="hero-stat__value">
                      <CountUp from={0} to={stat.num} duration={2.5} startWhen={!loading} />{stat.suffix}
                    </span>
                    <span className="hero-stat__label">{t(stat.labelKey)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <figure className="hero-visual">
              <div className="hero-visual__index" aria-hidden="true">01 / 06</div>
              <GlareHover
                width="100%"
                height="auto"
                background="transparent"
                borderRadius="0px"
                borderColor="transparent"
                glareColor="#ffffff"
                glareOpacity={0.2}
                glareAngle={-30}
                glareSize={300}
                transitionDuration={800}
                className="hero-photo-glare"
              >
                <div
                  className={`hero-photo${photoRevealed ? ' is-revealed' : ''}`}
                  onMouseEnter={() => setPhotoRevealed(true)}
                  onMouseLeave={() => setPhotoRevealed(false)}
                >
                  <img
                    className="hero-photo__gif"
                    src={profileGif}
                    alt={t('hero.gifAlt')}
                    width="900"
                    height="900"
                    decoding="async"
                  />
                  <img
                    className="hero-photo__main"
                    src={profile?.hero_url || profile?.photo_url || heroImage}
                    alt={t('hero.cameraAlt')}
                    width="900"
                    height="900"
                    fetchPriority="high"
                    decoding="async"
                  />
                </div>
              </GlareHover>
              <figcaption>
                <span>Samarinda, Indonesia</span>
                <span className="hero-availability"><i /> {t('hero.openForCollaboration')}</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <Projects className="deferred-section" />
        <Experience frontImage={frontImage} className="deferred-section" />
        <Education className="deferred-section" />
        <Certificates className="deferred-section" />
        <TechStack className="deferred-section" />
      </main>

      <Footer className="deferred-section" />

      {/* MODAL PREVIEW CV */}
      <CVModal open={cvOpen} onClose={() => setCvOpen(false)} />
    </div>
  )
}

export default App
