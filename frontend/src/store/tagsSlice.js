import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGet } from '../utils/api'

export const fetchTags = createAsyncThunk('tags/fetchTags', async () => {
  const res = await apiGet('/api/tags')
  return res.tags || []
})

const slice = createSlice({
  name: 'tags',
  initialState: { list: [], status: 'idle' },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchTags.pending, (s)=>{s.status='loading'})
     .addCase(fetchTags.fulfilled, (s,a)=>{s.status='succeeded'; s.list=a.payload})
     .addCase(fetchTags.rejected, (s)=>{s.status='failed'})
  }
})
export default slice.reducer
