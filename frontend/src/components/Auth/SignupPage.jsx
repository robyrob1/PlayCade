import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signup } from '../../store/sessionSlice'
import { useNavigate, Link } from 'react-router-dom'

export default function SignupPage(){
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { user, error, status } = useSelector(s => s.session)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => { if (user) navigate('/') }, [user, navigate])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) return alert('Passwords must match')
    await dispatch(signup({ username, email, password }))
  }

  return (
    <div className="auth container">
      <h2 className="page-title">Sign Up</h2>
      <form onSubmit={onSubmit} className="card stack">
        <input className="input" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" required />
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" required />
        <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required />
        <input className="input" type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Re-type password" required />
        <button className="btn btn-primary" disabled={status==='loading'}>Create account</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>Already have an account? <Link to="/login" className="link">Log in</Link></p>
    </div>
  )
}
