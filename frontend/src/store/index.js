import { configureStore } from '@reduxjs/toolkit'
import sessionReducer from './sessionSlice'
import gamesReducer from './gamesSlice'
import tagsReducer from './tagsSlice'

const store = configureStore({
  reducer: { session: sessionReducer, games: gamesReducer, tags: tagsReducer }
})
export default store
