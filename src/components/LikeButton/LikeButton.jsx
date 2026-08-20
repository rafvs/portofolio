import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import './LikeButton.css'

export default function LikeButton() {
  const [likes, setLikes] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const likedInStorage = localStorage.getItem('nerravs_has_liked') === 'true'
    setHasLiked(likedInStorage)

    async function fetchLikes() {
      try {
        const { data, error } = await supabase
          .from('site_like')
          .select('count')
          .eq('id', 'main')
          .maybeSingle()

        if (data && data.count !== undefined) {
          setLikes(data.count)
        } else if (error) {
          console.error('Supabase fetch error:', error.message || error)
        }
      } catch (err) {
        console.error('Error fetching likes:', err)
      }
    }

    fetchLikes()
  }, [])

  const handleLike = async () => {
    const newLikes = likes + 1
    setLikes(newLikes)
    setHasLiked(true)
    setAnimating(true)

    setTimeout(() => setAnimating(false), 600)

    try {
      // Menggunakan update langsung ke row 'main'
      const { error } = await supabase
        .from('site_like')
        .update({ count: newLikes })
        .eq('id', 'main')

      if (error) {
        console.error('Supabase update error:', error.message || error)
      } else {
        console.log('Successfully updated likes to:', newLikes)
      }
    } catch (err) {
      console.error('Error updating likes:', err)
    }
  }

  return (
    <button
      type="button"
      className={`like-button cursor-target${hasLiked ? ' is-liked' : ''}${animating ? ' is-pop' : ''}`}
      onClick={handleLike}
      title="Sukai website portofolio ini"
      aria-label="Sukai portofolio"
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
