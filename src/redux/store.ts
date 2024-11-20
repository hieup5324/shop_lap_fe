import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'
import counterReducer from './slices/counterSlice'

export const store = configureStore({
  reducer: {
    // This is where we add reducers.
    counter: counterReducer,
    auth: authReducer,
    cart: cartReducer,
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
