import { createSlice } from '@reduxjs/toolkit'

const cartDataFromLocalStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : []

export const cartSlicer = createSlice({
  name: 'cart',
  initialState: { cartItems: cartDataFromLocalStorage },
  reducers: {
    addToCart(state, action) {
      const item = action.payload

      const isItemInCart = state.cartItems.find((x) => x.id === item.id)

      if (isItemInCart) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.id === isItemInCart.id ? item : x
          ),
        }
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        }
      }
    },
  },
})

export const cartActions = cartSlicer.actions
