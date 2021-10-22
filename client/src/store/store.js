import { configureStore } from '@reduxjs/toolkit'
import { cartSlicer } from './cartSlicer'
import { orderSlicer } from './orderSlicer'
import { productsAllSlicer } from './productsAllSlicer'

const store = configureStore({
  reducer: {
    cart: cartSlicer.reducer,
    products: productsAllSlicer.reducer,
    order: orderSlicer.reducer,
  },
})

export default store
