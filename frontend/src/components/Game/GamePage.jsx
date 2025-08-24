import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGameById } from '../../store/gamesSlice'
import { useParams } from 'react-router-dom'
import ReviewItem from './ReviewItem'
import CommentsSection from './CommentsSection'

export default function GamePage(){
  const { gameId } = useParams()
  const dispatch = useDispatch()
  const game = useSelector(s => s.games.current)
  const user = useSelector(s => s.session.user)
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => { dispatch(fetchGameById(gameId)) }, [dispatch, gameId])

  const postReview = async () => {
    setError('')
    if (!user) return alert('Log in to review')
    try {
      const res = await fetch(`/api/games/${gameId}/reviews`, { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ rating, comment }) })
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to add review')
      setComment(''); setRating(0)
      dispatch(fetchGameById(gameId))
    } catch(e){ setError(String(e.message||e)) }
  }

  if (!game) return <div className="container"><p className="muted">Loading…</p></div>

  return (
    <div className="page container">
      <h2 className="page-title">{game.title}</h2>

      <div className="screen nes-border">
        {game.playUrl ? (
          <iframe title={game.title} src={game.playUrl} allow="gamepad *; fullscreen;" />
        ) : (
          <div className="screen-fallback">Game area</div>
        )}
        <div className="scanlines" />
      </div>

      <div className="chip-row">
        {(game.tags||[]).map(t => (<span key={t} className="chip">{t}</span>))}
      </div>

      <section className="section">
        <h3 className="section-title">Ratings</h3>
        <div className="stack">
          {(game.reviews||[]).map(rv => (
            <ReviewItem key={rv.id} review={rv} onChanged={() => dispatch(fetchGameById(gameId))} />
          ))}
        </div>

        <div className="card">
          <div className="card-body stack">
            <label>Rating:
              <select className="input" value={rating} onChange={e=>setRating(Number(e.target.value))}>
                <option value={0}>No rating</option>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <textarea className="input" value={comment} onChange={e=>setComment(e.target.value)} placeholder="Your comment" />
            {error && <div className="error">{error}</div>}
            <button className="btn btn-primary" onClick={postReview}>Add</button>
          </div>
        </div>
      </section>

      <CommentsSection gameId={gameId} />
    </div>
  )
}
