import { createSlice } from '@reduxjs/toolkit'

const cartDataFromLocalStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : []

const shippingAddressFromLocalStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {}

export const cartSlicer = createSlice({
  name: 'cart',
  initialState: {
    cartItems: cartDataFromLocalStorage,
    shippingAddress: shippingAddressFromLocalStorage,
  },
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

    saveShippingAddress(state, action) {
      return {
        ...state,
        shippingAddress: action.payload,
      }
    },

    savePaymentMethod(state, action) {
      return {
        ...state,
        paymentMethod: action.payload,
      }
    },
  },
})

export const cartActions = cartSlicer.actions
