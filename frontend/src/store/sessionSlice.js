import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGet, apiPost, apiDelete } from '../utils/api'

export const restoreUser = createAsyncThunk('session/restoreUser', async () => {
  const res = await apiGet('/api/session')
  return res?.user ?? null
})

export const login = createAsyncThunk('session/login', async (payload, { rejectWithValue }) => {
  try {
    const data = await apiPost('/api/session', payload)
    return data.user
  } catch (e) {
    return rejectWithValue(e?.message || 'Login failed')
  }
})

export const signup = createAsyncThunk('session/signup', async (payload, { rejectWithValue }) => {
  try {
    const data = await apiPost('/api/users', payload)
    return data.user
  } catch (e) {
    return rejectWithValue(e?.message || 'Signup failed')
  }
})

export const logout = createAsyncThunk('session/logout', async () => {
  await apiDelete('/api/session')
  return null
})

const sessionSlice = createSlice({
  name: 'session',
  initialState: { user: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(restoreUser.pending, (s) => { s.status = 'loading' })
     .addCase(restoreUser.fulfilled, (s,a) => { s.status='succeeded'; s.user=a.payload })
     .addCase(restoreUser.rejected, (s) => { s.status = 'failed' })

     .addCase(login.pending, (s)=>{s.status='loading'; s.error=null})
     .addCase(login.fulfilled, (s,a)=>{s.status='succeeded'; s.user=a.payload})
     .addCase(login.rejected, (s,a)=>{s.status='failed'; s.error=a.payload})

     .addCase(signup.pending, (s)=>{s.status='loading'; s.error=null})
     .addCase(signup.fulfilled, (s,a)=>{s.status='succeeded'; s.user=a.payload})
     .addCase(signup.rejected, (s,a)=>{s.status='failed'; s.error=a.payload})

     .addCase(logout.fulfilled, (s)=>{s.user=null; s.status='idle'})
  }
})
export default sessionSlice.reducer
