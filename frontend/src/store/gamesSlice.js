import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api'

export const fetchGames = createAsyncThunk('games/fetchGames', async (tag) => {
  const q = tag ? `?tag=${encodeURIComponent(tag)}` : ''
  const res = await apiGet(`/api/games${q}`)
  return res.games || []
})

export const fetchGameById = createAsyncThunk('games/fetchById', async (id) => {
  const res = await apiGet(`/api/games/${id}`)
  return res.game
})

export const createGame = createAsyncThunk('games/create', async (payload) => {
  const res = await apiPost('/api/games', payload)
  return res.game
})

export const updateGame = createAsyncThunk('games/update', async ({ id, ...payload }) => {
  const res = await apiPut(`/api/games/${id}`, payload)
  return res.game
})

export const deleteGame = createAsyncThunk('games/delete', async (id) => {
  await apiDelete(`/api/games/${id}`)
  return id
})

const slice = createSlice({
  name: 'games',
  initialState: { list: [], current: null, status: 'idle' },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchGames.pending, (s)=>{s.status='loading'})
     .addCase(fetchGames.fulfilled, (s,a)=>{s.status='succeeded'; s.list=a.payload})
     .addCase(fetchGames.rejected, (s)=>{s.status='failed'})
     .addCase(fetchGameById.fulfilled, (s,a)=>{s.current=a.payload})
     .addCase(createGame.fulfilled, (s,a)=>{s.list.unshift(a.payload)})
     .addCase(updateGame.fulfilled, (s,a)=>{
       const i = s.list.findIndex(g=>g.id===a.payload.id)
       if(i!==-1) s.list[i]=a.payload
       if(s.current?.id===a.payload.id) s.current=a.payload
     })
     .addCase(deleteGame.fulfilled, (s,a)=>{s.list=s.list.filter(g=>g.id!==a.payload)})
  }
})
export default slice.reducer
