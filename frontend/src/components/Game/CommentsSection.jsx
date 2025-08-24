import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export default function CommentsSection({ gameId }){
  const me = useSelector(s => s.session.user)
  const [items, setItems] = useState([])
  const [text, setText] = useState('')
  const [err, setErr] = useState('')

  const load = async () => {
    const res = await fetch(`/api/comments?gameId=${gameId}`, { credentials:'include' })
    if (res.ok) setItems((await res.json()).comments || [])
  }

  useEffect(() => { load() }, [gameId])

  const add = async () => {
    setErr('')
    if (!me) return alert('Log in to comment')
    try{
      const res = await fetch('/api/comments', { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ gameId: Number(gameId), body: text }) })
      if(!res.ok) throw new Error((await res.json()).message || 'Failed to add comment')
      setText(''); load()
    }catch(e){ setErr(String(e.message||e)) }
  }

  const save = async (c) => {
    const body = prompt('Edit your comment:', c.body)
    if (body == null) return
    const res = await fetch(`/api/comments/${c.id}`, { method:'PUT', credentials:'include', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ body }) })
    if (res.ok) load()
  }

  const remove = async (c) => {
    if (!confirm('Delete this comment?')) return
    const res = await fetch(`/api/comments/${c.id}`, { method:'DELETE', credentials:'include' })
    if (res.ok) load()
  }

  return (
    <section className="section">
      <h3 className="section-title">Comments</h3>
      <div className="stack">
        {items.map(c => (
          <div key={c.id} className="card">
            <div className="card-body">
              <div>{c.body}</div>
              <div className="meta">by User {c.userId}</div>
              {me?.id === c.userId && (
                <div className="row" style={{marginTop:8}}>
                  <button className="btn" onClick={()=>save(c)}>Edit</button>
                  <button className="btn btn-danger" onClick={()=>remove(c)}>Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{marginTop:12}}>
        <div className="card-body stack">
          <textarea className="input" value={text} onChange={e=>setText(e.target.value)} placeholder="Write a comment" />
          {err && <div className="error">{err}</div>}
          <button className="btn btn-primary" onClick={add}>Post comment</button>
        </div>
      </div>
    </section>
  )
}
