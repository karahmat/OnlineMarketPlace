import { orderActions } from './orderSlicer'

export const createOrder = (order) => {
  return async (dispatch) => {
    try {
      const { data } = await fetch(`/api/order`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(order),
      })

      console.log(order)

      dispatch(orderActions.addOrder(order))
    } catch (error) {
      console.error(error)
    }
  }
}
