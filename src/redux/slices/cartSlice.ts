import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// declaring the types for our state
export type AuthState = {
  productsInCard: any | null
}

const initialState: AuthState = {
  productsInCard: []
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProduct: (state: AuthState, action: PayloadAction<any>) => {
      state.productsInCard = [...state.productsInCard, action.payload]
    }
  }
})

// Here we are just exporting the actions from this slice, so that we can call them anywhere in our app.
export const { addProduct } = cartSlice.actions

// exporting the reducer here, as we need to add this to the store
const cartReducer = cartSlice.reducer
export default cartReducer
