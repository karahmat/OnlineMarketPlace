import { cartActions } from './cartSlicer'
export const addToCartAction = (id, qty) => {
  return async (dispatch, getState) => {
    const fetchProductData = async (id) => {
      const response = await fetch(`/api/products/product/${id}`)

      if (!response.ok) {
        throw new Error('could not fetch Products Data')
      }

      const data = response.json()

      console.log(data)
      return data
    }

    try {
      const { data } = await fetchProductData(id)
      console.log(data)
      dispatch(
        cartActions.addToCart({
          productId: data._id,
          name: data.name,
          image: data.image,
          price: data.price,
          stock: data.quantity,
          qty,
        })
      )
    } catch (error) {
      console.error(error)
    }

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
  }
}

export const removeFromCartAction = (id) => {
  return (dispatch, getState) => {
    dispatch(cartActions.removeFromCart(id))

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
  }
}
