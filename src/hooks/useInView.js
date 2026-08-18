import { useEffect, useRef, useState } from 'react'

/**
 * useInView — Custom hook berbasis IntersectionObserver untuk animasi
 * "reveal saat elemen masuk viewport".
 *
 * Cara kerja:
 *  - Mengembalikan [ref, inView]: `ref` ditempelkan ke elemen yang mau
 *    dipantau, `inView` berubah menjadi `true` begitu elemen masuk viewport.
 *  - Dengan `once: true` (default), observer langsung di-disconnect setelah
 *    intersection pertama, sehingga reveal tidak terulang saat scroll balik.
 *  - `rootMargin` memungkinkan reveal dimulai lebih awal / lebih lambat
 *    (misal "-10% 0px" = mulai saat elemen sudah 10% masuk layar).
 *  - Dipakai bersama oleh section Experience dan Education sehingga keduanya
 *    memakai satu mekanisme stagger-reveal yang sama.
 *
 * @param {Object}  [options]
 * @param {boolean} [options.once=true]        Hanya trigger sekali lalu disconnect.
 * @param {string}  [options.rootMargin='0px'] Margin tambahan pada viewport.
 * @param {number}  [options.threshold=0.2]    Seberapa banyak elemen terlihat
 *                                             sebelum dianggap "masuk" (0–1).
 * @returns {[React.RefObject, boolean]}       [ref untuk ditempelkan, status inView]
 */
export default function useInView({ once = true, rootMargin = '0px', threshold = 0.2 } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    // IntersectionObserver memantau elemen; callback dipanggil setiap kali
    // status persilangan elemen dengan viewport berubah.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect() // Hentikan observasi setelah sekali terlihat
        } else if (!once) {
          setInView(false) // Mode "replay": hilang dari layar => reset status
        }
      },
      { rootMargin, threshold }
    )
    io.observe(el)

    // Cleanup: lepaskan observer saat komponen unmount / dependensi berubah
    return () => io.disconnect()
  }, [once, rootMargin, threshold])

  return [ref, inView]
}