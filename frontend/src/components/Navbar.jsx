import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/sessionSlice'

export default function Navbar() {
  const user = useSelector(s => s.session.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onLogout = async () => {
    await dispatch(logout())
    navigate('/')
  }

  return (
    <header className="nav nes-border">
      <Link to="/" className="brand">
        <span className="brand-emblem">▶</span> PlayCade
      </Link>
      <nav className="nav-links">
        <NavLink to="/tag/Fighters" className="link">Fighters</NavLink>
        <NavLink to="/tag/Role%20Playing" className="link">Role Playing</NavLink>
        <NavLink to="/tag/Racers" className="link">Racers</NavLink>
        <NavLink to="/tag/Simulation" className="link">Simulation</NavLink>
        <NavLink to="/tag/Adventure" className="link">Adventure</NavLink>
        <NavLink to="/tag/Puzzles" className="link">Puzzles</NavLink>
      </nav>
      <div className="nav-cta">
        {!user && (<><NavLink to="/login" className="btn btn-outline">Log In</NavLink><NavLink to="/signup" className="btn btn-primary">Sign Up</NavLink></>)}
        {user && (<>
          <NavLink to={`/users/${user.id}`} className="link userlink">{user.username}</NavLink>
          <NavLink to="/creations" className="btn btn-ghost">Creations</NavLink>
          <button onClick={onLogout} className="btn btn-danger">Logout</button>
        </>)}
      </div>
    </header>
  )
}
