import { createSlice } from '@reduxjs/toolkit'

export const cartSlicer = createSlice({
  name: 'cart',
  initialState: { items: [], totalQuantity: 0, changed: false },
  reducers: {},
})

export const cartActions = cartSlicer.Actions
