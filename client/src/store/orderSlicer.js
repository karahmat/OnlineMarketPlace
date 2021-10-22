import { createSlice } from '@reduxjs/toolkit'

export const orderSlicer = createSlice({
  name: 'order',
  initialState: [],
  reducers: {
    addOrder(state, action) {
      state = [...state, action.payload]
    },
  },
})

export const orderActions = orderSlicer.actions
