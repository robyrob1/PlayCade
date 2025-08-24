import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGames } from '../../store/gamesSlice'
import { fetchTags } from '../../store/tagsSlice'
import { Link, useParams } from 'react-router-dom'

function GameCard({ game }){
  return (
    <Link to={`/games/${game.id}`} className="card game-card">
      <div className="thumb">
        {game.thumbnailUrl ? (<img src={game.thumbnailUrl} alt={game.title} />) : (<div className="thumb-fallback">🎮</div>)}
      </div>
      <div className="card-body">
        <h4 className="card-title">{game.title}</h4>
        <div className="card-sub">{(game.tags||[]).join(', ')}</div>
      </div>
    </Link>
  )
}

export default function LandingPage(){
  const dispatch = useDispatch()
  const { list, status } = useSelector(s => s.games)
  const { tagName } = useParams()

  useEffect(() => { dispatch(fetchTags()) }, [dispatch])
  useEffect(() => { dispatch(fetchGames(tagName)) }, [dispatch, tagName])

  const grouped = list.reduce((acc, g) => {
    const first = (g.tags&&g.tags[0]) || 'Untagged'
    acc[first] = acc[first] || []
    acc[first].push(g)
    return acc
  }, {})

  return (
    <div className="page container">
      <div className="ad-row">
        <div className="ad nes-border">Ad Placeholder</div>
        <div className="ad nes-border">Ad Placeholder</div>
      </div>

      {status==='loading' && <p className="muted">Loading games…</p>}

      {Object.entries(grouped).map(([tag, games]) => (
        <section key={tag} className="section">
          <h3 className="section-title">{tag}</h3>
          <div className="game-grid">
            {games.map(g => <GameCard key={g.id} game={g} />)}
          </div>
        </section>
      ))}

      {Object.keys(grouped).length === 0 && <p className="muted">No games yet.</p>}
    </div>
  )
}
