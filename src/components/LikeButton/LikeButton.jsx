import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import './LikeButton.css'

export default function LikeButton() {
  const initialLiked = localStorage.getItem('nerravs_has_liked') === 'true'
  const [likes, setLikes] = useState(0)
  const [hasLiked, setHasLiked] = useState(initialLiked)
  const [animating, setAnimating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  // Simpan nilai DB terbaru untuk rollback yang akurat
  const dbCountRef = useRef(0)

  useEffect(() => {
    async function fetchLikes() {
      const { data, error } = await supabase
        .from('site_like')
        .select('count')
        .eq('id', 'main')
        .maybeSingle()

      if (error) {
        console.error('[LikeButton] fetch error:', error)
        return
      }

      if (data) {
        console.log('[LikeButton] fetched count:', data.count)
        setLikes(data.count)
        dbCountRef.current = data.count
      } else {
        console.warn('[LikeButton] row "main" not found in site_like table')
      }
    }
    fetchLikes()
  }, [])

  const COOLDOWN_MS = 2000

  const handleLike = async () => {
    if (isUpdating) return

    const lastLikeTime = Number(localStorage.getItem('nerravs_last_like_time') || 0)
    if (Date.now() - lastLikeTime < COOLDOWN_MS) return

    setIsUpdating(true)
    const isUndoing = hasLiked
    const newCount = isUndoing ? Math.max(0, dbCountRef.current - 1) : dbCountRef.current + 1

    // Optimistic update
    setLikes(newCount)
    setHasLiked(!isUndoing)
    localStorage.setItem('nerravs_has_liked', String(!isUndoing))

    if (!isUndoing) {
      setAnimating(true)
      setTimeout(() => setAnimating(false), 600)
    }

    console.log('[LikeButton] updating count in DB:', newCount)

    const { error } = await supabase
      .from('site_like')
      .update({ count: newCount })
      .eq('id', 'main')

    if (error) {
      console.error('[LikeButton] update error:', error)
      // Rollback ke nilai DB terakhir yang diketahui
      setLikes(dbCountRef.current)
      setHasLiked(isUndoing)
      localStorage.setItem('nerravs_has_liked', String(isUndoing))
    } else {
      console.log('[LikeButton] saved to DB successfully:', newCount)
      dbCountRef.current = newCount
      localStorage.setItem('nerravs_last_like_time', String(Date.now()))
    }

    setIsUpdating(false)
  }

  return (
    <button
      type="button"
      className={`like-button cursor-target${hasLiked ? ' is-liked' : ''}${animating ? ' is-pop' : ''}`}
      onClick={handleLike}
      disabled={isUpdating}
      title={hasLiked ? 'Batalkan suka' : 'Sukai website portofolio ini'}
      aria-label={hasLiked ? 'Batalkan suka' : 'Sukai portofolio'}
    >
      <svg
        className="like-button__icon"
        viewBox="0 0 24 24"
        fill={hasLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span className="like-button__count">{likes}</span>
    </button>
  )
}

