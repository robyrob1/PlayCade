import { useState } from 'react'
import { useSelector } from 'react-redux'

export default function ReviewItem({ review, onChanged }){
  const me = useSelector(s => s.session.user)
  const isMine = me?.id === review.userId
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ rating: review.rating, comment: review.comment })
  const [err, setErr] = useState('')

  const save = async () => {
    setErr('')
    try{
      const res = await fetch(`/api/reviews/${review.id}`, { method:'PUT', credentials:'include', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
      if(!res.ok) throw new Error((await res.json()).message || 'Update failed')
      setEditing(false)
      onChanged?.()
    }catch(e){ setErr(String(e.message||e)) }
  }

  const remove = async () => {
    if(!confirm('Delete this review?')) return
    const res = await fetch(`/api/reviews/${review.id}`, { method:'DELETE', credentials:'include' })
    if(res.ok) onChanged?.()
  }

  if (!editing) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="stars">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</div>
          <div>{review.comment}</div>
          <div className="meta">by <a href={`/users/${review.userId}`}>{review.username || 'User'}</a></div>
          {isMine && (
            <div className="row" style={{marginTop:8}}>
              <button className="btn" onClick={()=>setEditing(true)}>Edit</button>
              <button className="btn btn-danger" onClick={remove}>Delete</button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-body stack">
        <label>Rating
          <select className="input" value={form.rating} onChange={e=>setForm(f=>({...f, rating:Number(e.target.value)}))}>
            {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <textarea className="input" value={form.comment} onChange={e=>setForm(f=>({...f, comment:e.target.value}))} />
        {err && <div className="error">{err}</div>}
        <div className="row">
          <button className="btn btn-primary" onClick={save}>Save</button>
          <button className="btn" onClick={()=>{setEditing(false); setForm({ rating: review.rating, comment: review.comment })}}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
