import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function useSupabaseContent(table, { single = false, published = false } = {}) {
  const [data, setData] = useState(single ? null : [])

  useEffect(() => {
    let active = true
    const load = async () => {
      let query = supabase.from(table).select('*')
      if (published) query = query.eq('is_published', true)
      if (!single) query = query.order('sort_order', { ascending: true })
      const { data: rows, error } = single ? await query.limit(1).maybeSingle() : await query
      if (active && !error && rows && (single || rows.length)) setData(rows)
    }
    load()
    return () => { active = false }
  }, [published, single, table])

  return data
}
