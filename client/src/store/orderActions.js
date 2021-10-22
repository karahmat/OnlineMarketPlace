import { orderActions } from './orderSlicer'

export const createOrder = (order) => {
  return async (dispatch) => {
    try {
      const response = await fetch(`/api/order`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(order),
      })

      const { data } = await response

      dispatch(orderActions.addOrder(data))
    } catch (error) {
      console.error(error)
    }
  }
}
