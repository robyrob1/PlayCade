import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateGame } from '../../store/gamesSlice'
import { useNavigate, useParams } from 'react-router-dom'

export default function EditGame(){
  const { gameId } = useParams()
  const [game, setGame] = useState(null)
  const [newTag, setNewTag] = useState('')
  const [err, setErr] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/games/${gameId}`, { credentials:'include' })
      if (res.ok) setGame((await res.json()).game)
    })()
  }, [gameId])

  if (!game) return <div className="container"><p className="muted">Loading…</p></div>

  const save = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      const payload = { id: game.id }
      for (const f of ['title','description','playUrl','thumbnailUrl']) payload[f] = game[f]
      payload.tags = game.tags
      const action = await dispatch(updateGame(payload))
      if (updateGame.fulfilled.match(action)) navigate('/creations')
    } catch(e){ setErr(String(e.message||e)) }
  }

  const remove = async () => {
    if (!confirm('Delete this game permanently?')) return
    const res = await fetch(`/api/games/${game.id}`, { method:'DELETE', credentials:'include' })
    if (res.ok) navigate('/creations')
  }

  return (
    <div className="page container">
      <h2 className="page-title">Edit Game</h2>
      <form onSubmit={save} className="card stack">
        <label className="field">Name<input className="input" value={game.title} onChange={e=>setGame(g=>({...g, title:e.target.value}))} /></label>
        <label className="field">Description<textarea className="input" value={game.description||''} onChange={e=>setGame(g=>({...g, description:e.target.value}))} /></label>
        <label className="field">Game URL<input className="input" value={game.playUrl||''} onChange={e=>setGame(g=>({...g, playUrl:e.target.value}))} /></label>
        <label className="field">Thumbnail URL<input className="input" value={game.thumbnailUrl||''} onChange={e=>setGame(g=>({...g, thumbnailUrl:e.target.value}))} /></label>
        <div>
          <strong>Tags</strong>
          <div className="chip-row">
            {(game.tags||[]).map((t, i) => (
              <span key={i} className="chip">
                {t} <button type="button" className="chip-x" onClick={()=>setGame(g=>({...g, tags:g.tags.filter(x=>x!==t)}))}>✕</button>
              </span>
            ))}
          </div>
          <div className="row">
            <input className="input" value={newTag} onChange={e=>setNewTag(e.target.value)} placeholder="New tag" />
            <button type="button" className="btn" onClick={() => { if(newTag.trim()) { setGame(g=>({...g, tags:[...(g.tags||[]), newTag.trim()]})); setNewTag('') } }}>Add</button>
          </div>
        </div>
        {err && <div className="error">{err}</div>}
        <div className="row">
          <button type="submit" className="btn btn-primary">Update</button>
          <button type="button" onClick={remove} className="btn btn-danger">Delete</button>
        </div>
      </form>

      <div className="section">
        <h3 className="section-title">Comments & Reviews</h3>
        <div className="stack">
          {(game.reviews||[]).map(rv => (
            <div key={rv.id} className="card">
              <div className="card-body">
                <div className="stars">{'★'.repeat(rv.rating)}{'☆'.repeat(5-rv.rating)}</div>
                <div>{rv.comment}</div>
                <div className="meta">by User {rv.userId}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
