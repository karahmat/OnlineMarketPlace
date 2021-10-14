import { createSlice } from '@reduxjs/toolkit'

export const productsAllSlicer = createSlice({
  name: 'products',
  initialState: { products: [] },
  reducers: {
    listProducts(state, action) {
      state.products = action.payload
    },
  },
})

export const productsAllActions = productsAllSlicer.actions
