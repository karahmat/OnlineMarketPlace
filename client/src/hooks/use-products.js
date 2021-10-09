import { useEffect, useState } from 'react'

export const useProducts = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const url = 'https://fakestoreapi.com/products'

    const DummyProductsApiCall = () => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => setProducts(data))
    }
    DummyProductsApiCall()
  }, [])

  return { products }
}
