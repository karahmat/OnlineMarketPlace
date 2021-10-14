import { configureStore } from '@reduxjs/toolkit'
import { cartSlicer } from './cartSlicer'
import { productsAllSlicer } from './productsAllSlicer'

const store = configureStore({
  reducer: { cart: cartSlicer.reducer, products: productsAllSlicer.reducer },
})

export default store
