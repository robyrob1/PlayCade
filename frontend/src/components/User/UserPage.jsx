import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function UserPage(){
  const { userId } = useParams()
  const [user, setUser] = useState(null)

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/users/${userId}`, { credentials:'include' })
      if (res.ok) setUser(await res.json())
    })()
  }, [userId])

  if (!user) return <div className="container"><p className="muted">Loading…</p></div>

  return (
    <div className="page container">
      <div style={{display:'flex', alignItems:'center', gap:16}}>
        <div style={{width:96, height:96, borderRadius:'50%', background:'#eee', overflow:'hidden'}}></div>
        <div>
          <h2 className="page-title" style={{margin:0}}>{user.username}</h2>
          <div className="muted">Recently played games</div>
        </div>
      </div>
      <div className="game-grid" style={{marginTop:16}}>
        {(user.recentGames||[]).map(g => (
          <a key={g.id} href={`/games/${g.id}`} className="card">
            <div className="thumb">{g.thumbnailUrl ? <img src={g.thumbnailUrl} alt={g.title} /> : null}</div>
            <div className="card-body"><strong>{g.title}</strong></div>
          </a>
        ))}
      </div>
    </div>
  )
}
