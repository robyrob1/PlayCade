import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function CreationsPage(){
  const [mine, setMine] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/games?mine=true', { credentials:'include' })
      if (res.ok) setMine((await res.json()).games || [])
    })()
  }, [])

  return (
    <div className="page container">
      <div className="row-between">
        <h2 className="page-title">Creations</h2>
        <button onClick={()=>navigate('/upload')} className="btn btn-primary">Upload</button>
      </div>
      <div className="game-grid">
        {mine.map(g => (
          <div key={g.id} className="card">
            <div className="thumb">
              {g.thumbnailUrl ? <img src={g.thumbnailUrl} alt={g.title} /> : <div className="thumb-fallback">🕹️</div>}
            </div>
            <div className="card-body">
              <div className="row-between">
                <strong>{g.title}</strong>
                <Link to={`/edit/${g.id}`} className="btn btn-ghost">Edit</Link>
              </div>
              <div className="meta">Total plays: {g.totalPlays ?? 0} • Total comments: {g.totalComments ?? 0} • Avg rating: {g.avgRating ?? '—'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
