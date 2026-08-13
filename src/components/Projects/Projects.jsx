import useInView from '../../hooks/useInView.js'
import AccordionGallery from '../AccordionGallery/AccordionGallery.jsx'
import BlurText from '../BlurText/BlurText.jsx'
import bellsHouseImg from '../../assets/proyek/bellshouse.png'
import rplCashImg from '../../assets/proyek/rplcash.png'
import './Projects.css'

const comingSoonImg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'%3E%3Crect width='800' height='1000' fill='%2308080c'/%3E%3Cg opacity='0.06'%3E%3Cline x1='0' y1='0' x2='800' y2='1000' stroke='%23ffffff' stroke-width='2'/%3E%3Cline x1='800' y1='0' x2='0' y2='1000' stroke='%23ffffff' stroke-width='2'/%3E%3C/g%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2333333e' font-family='system-ui, sans-serif' font-size='48' font-weight='800' letter-spacing='10'%3ECOMING SOON%3C/text%3E%3C/svg%3E`

const GALLERY_ITEMS = [
  {
    image: bellsHouseImg,
    label: 'Bells House',
    description: 'Sistem manajemen & informasi persewaan hunian terpadu.',
    stack: ['React', 'Tailwind', 'PHP'],
    github: 'https://github.com/rafvs/bellshouse',
    alt: 'Tampilan aplikasi Bells House',
  },
  {
    image: rplCashImg,
    label: 'RPL Cash',
    description: 'Aplikasi pengelolaan dana kas dan pencatatan keuangan kelas PPLG.',
    stack: ['Laravel', 'MySQL', 'Bootstrap'],
    github: 'https://github.com/rafvs/RPLCASh',
    alt: 'Tampilan aplikasi RPL Cash',
  },
  {
    image: comingSoonImg,
    label: 'Coming Soon #01',
    description: 'Proyek baru sedang dalam tahap perancangan & pengembangan.',
    stack: ['In Progress'],
    alt: 'Proyek mendatang',
  },
  {
    image: comingSoonImg,
    label: 'Coming Soon #02',
    description: 'Eksplorasi aplikasi web baru yang akan segera diluncurkan.',
    stack: ['In Progress'],
    alt: 'Proyek mendatang',
  },
  {
    image: comingSoonImg,
    label: 'Coming Soon #03',
    description: 'Eksplorasi visual & eksperimen antarmuka digital.',
    stack: ['In Progress'],
    alt: 'Proyek mendatang',
  },
]

const Projects = ({ className = '' }) => {
  const [revealRef, reveal] = useInView({ once: true, rootMargin: '-10% 0px -10% 0px' })

  return (
    <section className={`projects${className ? ` ${className}` : ''}`} id="projects">
      <div className="section-shell">
        <div className="section-heading">
          <p className="section-kicker">01 / Karya</p>
          <div className={`section-heading__copy reveal${reveal ? ' is-visible' : ''}`} ref={revealRef}>
            <BlurText
              text="Beberapa hal yang sedang saya bangun."
              className="section-title"
              delay={60}
              animateBy="words"
              direction="bottom"
              threshold={0.2}
              rootMargin="-80px"
            />
            <p className="section-description">Kumpulan karya akan ditambahkan satu per satu. Arahkan kursor pada setiap panel untuk melihatnya melebar — detail dan tautan proyek segera hadir.</p>
          </div>
        </div>

        <div className="projects-gallery cursor-target">
          <AccordionGallery
            items={GALLERY_ITEMS}
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
          />
        </div>
      </div>
    </section>
  )
}

export default Projects
