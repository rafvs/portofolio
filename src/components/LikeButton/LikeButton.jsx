import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import './LikeButton.css'

// Buat atau ambil device ID yang unik per browser/device
function getDeviceId() {
  let id = localStorage.getItem('nerravs_device_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('nerravs_device_id', id)
  }
  return id
}

export default function LikeButton() {
  const [likes, setLikes] = useState(0)
  const [hasLiked, setHasLiked] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`nerravs_liked_${getDeviceId()}`) === 'true'
    }
    return false
  })
  const [animating, setAnimating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Ambil like count dari DB saat mount
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
        setLikes(data.count)
      }
    }

    fetchLikes()
  }, [])

  const COOLDOWN_MS = 1500

  const handleLike = async () => {
    if (isUpdating) return

    const lastTime = Number(localStorage.getItem('nerravs_last_like_time') || 0)
    if (Date.now() - lastTime < COOLDOWN_MS) return

    setIsUpdating(true)
    const deviceId = getDeviceId()
    const isUndoing = hasLiked

    // Optimistic UI update
    setHasLiked(!isUndoing)
    setLikes(prev => isUndoing ? Math.max(0, prev - 1) : prev + 1)
    localStorage.setItem(`nerravs_liked_${deviceId}`, String(!isUndoing))

    if (!isUndoing) {
      setAnimating(true)
      setTimeout(() => setAnimating(false), 600)
    }

    // Panggil RPC atomic di Supabase
    const rpcName = isUndoing ? 'decrement_like' : 'increment_like'
    const { error } = await supabase.rpc(rpcName)

    if (error) {
      console.error('[LikeButton] RPC error:', error)
      // Rollback UI jika gagal
      setHasLiked(isUndoing)
      setLikes(prev => isUndoing ? prev + 1 : Math.max(0, prev - 1))
      localStorage.setItem(`nerravs_liked_${deviceId}`, String(isUndoing))
    } else {
      localStorage.setItem('nerravs_last_like_time', String(Date.now()))

      // Ambil count terbaru dari DB setelah update
      const { data } = await supabase
        .from('site_like')
        .select('count')
        .eq('id', 'main')
        .maybeSingle()

      if (data) setLikes(data.count)
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
