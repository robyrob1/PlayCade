import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createGame } from '../../store/gamesSlice'
import { useNavigate } from 'react-router-dom'

export default function UploadGame(){
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [playUrl, setPlayUrl] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [tags, setTags] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    const payload = { title, description, playUrl, thumbnailUrl, tags: tags.split(',').map(t=>t.trim()).filter(Boolean) }
    const action = await dispatch(createGame(payload))
    if (createGame.fulfilled.match(action)) navigate('/creations')
  }

  return (
    <div className="page container">
      <h2 className="page-title">Upload Game</h2>
      <form onSubmit={onSubmit} className="card stack">
        <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Name" required />
        <textarea className="input" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" />
        <input className="input" value={playUrl} onChange={e=>setPlayUrl(e.target.value)} placeholder="Game URL (e.g., itch.io embed)" />
        <input className="input" value={thumbnailUrl} onChange={e=>setThumbnailUrl(e.target.value)} placeholder="Thumbnail URL" />
        <input className="input" value={tags} onChange={e=>setTags(e.target.value)} placeholder="Tags (comma-separated)" />
        <button className="btn btn-primary">Save</button>
      </form>
    </div>
  )
}
