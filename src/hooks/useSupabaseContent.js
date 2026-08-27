import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

/**
 * CUSTOM HOOK: useSupabaseContent
 * Fungsi: Mengambil data dari tabel Supabase secara otomatis saat komponen dimuat (mount).
 * 
 * @param {string} table - Nama tabel di Supabase (misal: 'projects', 'experiences', 'education')
 * @param {Object} options - Opsi query
 * @param {boolean} [options.single=false] - Jika true, hanya mengambil 1 baris data (misal untuk profile)
 * @param {boolean} [options.published=false] - Jika true, hanya mengambil data yang status is_published = true
 * @returns {Array|Object|null} State data dari Supabase
 */
export default function useSupabaseContent(table, { single = false, published = false } = {}) {
  // State penampung data (array jika banyak baris, null jika single)
  const [data, setData] = useState(single ? null : [])

  useEffect(() => {
    let active = true

    const load = async () => {
      // 1. Buat query dasar select all dari tabel
      let query = supabase.from(table).select('*')

      // 2. Filter jika hanya ingin yang dipublikasikan
      if (published) query = query.eq('is_published', true)

      // 3. Urutkan berdasarkan sort_order jika berupa daftar (list)
      if (!single) query = query.order('sort_order', { ascending: true })

      // 4. Eksekusi query (single row vs list)
      const { data: rows, error } = single ? await query.limit(1).maybeSingle() : await query

      // 5. Update state jika request masih aktif dan tidak ada error
      if (active && !error && rows && (single || rows.length)) setData(rows)
    }

    load()

    // Cleanup function untuk mencegah memory leak / state update pada unmounted component
    return () => { active = false }
  }, [published, single, table])

  return data
}

