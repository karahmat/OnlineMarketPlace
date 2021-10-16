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

      const isItemInCart = state.cartItems.find(
        (x) => x.productId === item.productId
      )

      if (isItemInCart) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.productId === isItemInCart.productId ? item : x
          ),
        }
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        }
      }
    },

    removeFromCart(state, action) {
      const itemId = action.payload

      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.productId !== itemId),
      }
    },
  },
})

export const cartActions = cartSlicer.actions
