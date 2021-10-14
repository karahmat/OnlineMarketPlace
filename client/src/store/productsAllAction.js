import { productsAllActions } from './productsAllSlicer'

export const fetchProductsData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error('could not fetch Products Data')
      }

      const data = response.json()

      console.log(data)
      return data
    }

    try {
      const { data } = await fetchData()
      console.log(data)
      dispatch(productsAllActions.listProducts(data))
    } catch (error) {
      console.error(error)
    }
  }
}
