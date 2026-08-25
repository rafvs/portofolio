import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useInView from '../../hooks/useInView.js'
import useSupabaseContent from '../../hooks/useSupabaseContent.js'
import AccordionGallery from '../AccordionGallery/AccordionGallery.jsx'
import BlurText from '../BlurText/BlurText.jsx'
import ProjectModal from '../ProjectModal/ProjectModal.jsx'
import bellsHouseImg from '../../assets/proyek/bellshouse.png'
import rplCashImg from '../../assets/proyek/rplcash.png'
import './Projects.css'

const comingSoonImg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'%3E%3Crect width='800' height='1000' fill='%2308080c'/%3E%3Cg opacity='0.06'%3E%3Cline x1='0' y1='0' x2='800' y2='1000' stroke='%23ffffff' stroke-width='2'/%3E%3Cline x1='800' y1='0' x2='0' y2='1000' stroke='%23ffffff' stroke-width='2'/%3E%3C/g%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2333333e' font-family='system-ui, sans-serif' font-size='48' font-weight='800' letter-spacing='10'%3ECOMING SOON%3C/text%3E%3C/svg%3E`

/** Buat dummy placeholder screenshot berwarna-warni untuk keperluan demo slider */
const makeDummy = (bg, label, idx) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
    <rect width="1200" height="700" fill="${bg}"/>
    <rect x="60" y="60" width="1080" height="580" rx="12" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <text x="600" y="320" text-anchor="middle" dominant-baseline="middle" fill="rgba(255,255,255,0.18)" font-family="system-ui,sans-serif" font-size="72" font-weight="800" letter-spacing="-2">${label}</text>
    <text x="600" y="400" text-anchor="middle" dominant-baseline="middle" fill="rgba(255,255,255,0.1)" font-family="system-ui,sans-serif" font-size="28">Screenshot ${idx}</text>
  </svg>`)}`

const PROJECT_VISUALS = [
  {
    key: 'bellsHouse',
    label: 'Bells House',
    image: bellsHouseImg,
    screenshots: [
      bellsHouseImg,
      makeDummy('#0f1e2e', 'Bells House', 2),
      makeDummy('#12202e', 'Bells House', 3),
      makeDummy('#0a1820', 'Bells House', 4),
    ],
    github: 'https://github.com/rafvs/bellshouse',
  },
  {
    key: 'rplCash',
    label: 'RPL Cash',
    image: rplCashImg,
    screenshots: [
      rplCashImg,
      makeDummy('#1a1208', 'RPL Cash', 2),
      makeDummy('#1c1410', 'RPL Cash', 3),
      makeDummy('#141008', 'RPL Cash', 4),
    ],
    github: 'https://github.com/rafvs/RPLCASh',
  },
]

/**
 * Komponen Projects - Menampilkan galeri akordeon berisi karya/proyek yang dikerjakan.
 * @param {Object} props
 * @param {string} [props.className] - Kelas CSS tambahan.
 * @returns {JSX.Element} Elemen section Projects.
 */
const Projects = ({ className = '' }) => {
  const { t, i18n } = useTranslation()
  const remoteProjects = useSupabaseContent('projects', { published: true })
  // INTERAKSI ANIMASI (VIEWPORT DETECT): Menggunakan custom hook useInView untuk mendeteksi
  // kapan section Karya/Proyek masuk ke viewport. Status 'reveal' akan bernilai true ketika masuk.
  const [revealRef, reveal] = useInView({ once: true, rootMargin: '-10% 0px -10% 0px' })
  const [modalProjectKey, setModalProjectKey] = useState(null)
  const projectItems = PROJECT_VISUALS.map((project) => ({
    ...project,
    alt: t('projects.altPrefix', { label: project.label }),
    description: t(`projects.items.${project.key}.description`),
    fullDescription: t(`projects.items.${project.key}.fullDescription`),
    stack: t(`projects.items.${project.key}.technologies`, { returnObjects: true }),
    features: t(`projects.items.${project.key}.features`, { returnObjects: true }),
  }))
  const comingSoonImage = comingSoonImg.replace(
    'COMING SOON',
    encodeURIComponent(t('projects.comingSoonImage')),
  )
  const comingSoonItems = t('projects.items.comingSoon.items', { returnObjects: true }).map((project, index) => ({
    ...project,
    key: `comingSoon-${index}`,
    label: t('projects.comingSoonLabel', { index: String(index + 1).padStart(2, '0') }),
    image: comingSoonImage,
    alt: t('projects.upcomingAlt'),
  }))
  const language = i18n.resolvedLanguage === 'en' ? 'en' : 'id'
  const remoteItems = remoteProjects.map((project) => ({
    key: project.slug || project.id,
    label: project.title,
    image: project.image_url || comingSoonImage,
    screenshots: project.gallery?.length ? project.gallery : [project.image_url || comingSoonImage],
    github: project.github_url,
    description: project[`description_${language}`],
    fullDescription: project[`full_description_${language}`],
    stack: project.technologies || [],
    features: project[`features_${language}`] || [],
    alt: project.title,
  }))
  const galleryItems = remoteItems.length ? remoteItems : [...projectItems, ...comingSoonItems]
  const modalProject = galleryItems.find((project) => project.key === modalProjectKey) ?? null

  return (
    <section className={`projects${className ? ` ${className}` : ''}`} id="projects">
      <div className="section-shell">
        
        {/* BAGIAN HEADER SECTION: Menampilkan kicker dan judul dengan animasi BlurText */}
        <div className="section-heading">
          <p className="section-kicker">{t('sections.projectsKicker')}</p>
          <div className={`section-heading__copy reveal${reveal ? ' is-visible' : ''}`} ref={revealRef}>
            {/* Animasi teks masuk dengan efek blur per kata */}
            <BlurText
              text={t('sections.projectsTitle')}
              className="section-title"
              delay={60}
              animateBy="words"
              direction="bottom"
              threshold={0.2}
              rootMargin="-80px"
            />
            <p className="section-description">{t('sections.projectsDescription')}</p>
          </div>
        </div>

        {/* GALERI PROYEK (ACCORDION GALLERY):
            - Menampilkan daftar karya interaktif dengan efek akordeon elastis GSAP.
            - Mengoperasikan item proyek (GALLERY_ITEMS) ke dalam komponen AccordionGallery.
            - Klik pada panel aktif akan membuka modal preview project. */}
        <div className="projects-gallery cursor-target">
          <AccordionGallery
            items={galleryItems}
            ariaLabel={t('projects.galleryLabel')}
            defaultIndex={0}
            height={420}
            gap={8}
            radius={4}
            expandRatio={0.55}
            duration={0.55}
            tilt={4}
            parallax={0.4}
            accentColor="#ffffff"
            overlayColor="#0a0a0a"
            textColor="#ffffff"
            grayscale
            onCardClick={(project) => setModalProjectKey(project.key)}
          />
        </div>
      </div>

      {/* MODAL PREVIEW PROJECT */}
      <ProjectModal project={modalProject} onClose={() => setModalProjectKey(null)} />
    </section>
  )
}

export default Projects
