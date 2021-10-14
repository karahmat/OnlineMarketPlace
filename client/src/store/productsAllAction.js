import { productsAllActions } from './productsAllSlicer'

export const fetchProductsData = (url) => {
  return async (dispatch) => {
    
    const fetchData = async (urlArg) => {
      const response = await fetch(urlArg)
      if (!response.ok) {
        throw new Error('could not fetch Products Data')
      }

      const data = response.json()

      console.log(data)
      return data
    }

    try {
      const { data } = await fetchData(url)
      console.log(data)
      dispatch(productsAllActions.listProducts(data))
    } catch (error) {
      console.error(error)
    }
  }
}
