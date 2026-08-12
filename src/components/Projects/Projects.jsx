import AccordionGallery from '../AccordionGallery/AccordionGallery.jsx'
import useInView from '../../hooks/useInView.js'
import './Projects.css'

// "Karya" (Projects) section. A React Bits AccordionGallery of project cards that
// expand on hover. The section heading reveals on scroll-into-view via the shared
// useInView hook.
//
// TODO: replace these placeholders with real projects — swap `image` for a real
// screenshot (drop files in public/assets/ and reference "/assets/…"), set the
// real `label`, and add a `link` (e.g. link: 'https://…') to make each card open
// the live site or repo. Placeholders intentionally omit `link` so they render as
// non-navigating panels.
const PROJECTS = [
  { image: 'https://picsum.photos/id/180/900/1200', label: 'Project 1', alt: 'Placeholder proyek 1' },
  { image: 'https://picsum.photos/id/0/900/1200', label: 'Project 2', alt: 'Placeholder proyek 2' },
  { image: 'https://picsum.photos/id/48/900/1200', label: 'Project 3', alt: 'Placeholder proyek 3' },
  { image: 'https://picsum.photos/id/60/900/1200', label: 'Project 4', alt: 'Placeholder proyek 4' },
  { image: 'https://picsum.photos/id/119/900/1200', label: 'Project 5', alt: 'Placeholder proyek 5' },
]

const Projects = ({ className = '' }) => {
  const [revealRef, reveal] = useInView({ once: true, rootMargin: '-10% 0px -10% 0px' })

  return (
    <section className={`projects${className ? ` ${className}` : ''}`} id="projects">
      <div className="projects-inner">
        <div className={`projects-head${reveal ? ' is-visible' : ''}`} ref={revealRef}>
          <span className="projects-eyebrow">Karya</span>
          <h2 className="projects-title">Proyek Pilihan</h2>
          <p className="projects-sub">
            Sebagian karya yang pernah saya kerjakan. Arahkan kursor ke setiap kartu untuk melihat lebih dekat.
          </p>
        </div>

        <div className="projects-gallery">
          <AccordionGallery
            items={PROJECTS}
            defaultIndex={2}
            accentColor="#cf9eff"
            overlayColor="#0b0616"
            textColor="#ffffff"
            height={480}
            gap={12}
            radius={18}
            expandRatio={0.54}
            trigger="hover"
            grayscale
            showLabels
          />
        </div>
      </div>
    </section>
  )
}

export default Projects
