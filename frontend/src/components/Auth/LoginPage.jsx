import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../store/sessionSlice'
import { useNavigate, Link } from 'react-router-dom'

export default function LoginPage(){
  const [credential, setCredential] = useState('')
  const [password, setPassword] = useState('')
  const { user, error, status } = useSelector(s => s.session)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => { if (user) navigate('/') }, [user, navigate])

  const onSubmit = async (e) => {
    e.preventDefault()
    await dispatch(login({ credential, password }))
  }

  return (
    <div className="auth container">
      <h2 className="page-title">Log In</h2>
      <form onSubmit={onSubmit} className="card stack">
        <input className="input" value={credential} onChange={e=>setCredential(e.target.value)} placeholder="Username or Email" required />
        <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required />
        <button className="btn btn-primary" disabled={status==='loading'}>Log In</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>Don’t have an account? <Link to="/signup" className="link">Sign up</Link></p>
    </div>
  )
}
