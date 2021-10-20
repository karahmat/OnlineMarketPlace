import React, { useState } from 'react'

export const SearchBar = () => {
  
  const [inputValue, setInputValue] = useState()

  const handleSearch = (e) => {
    e.preventDefault()
    window.location.assign(`/products/search/${inputValue}`)
  }

  return (
    <form className='search-bar'>
      <label htmlFor='header-search'>
        <span className='visually-hidden'>Search your item here!</span>
      </label>
      <input
        type='text'
        id='header-search'
        placeholder='Search products'
        name='search-bar'
        style={{ width: '400px' }}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button type='submit' onClick={handleSearch}>
        <i className='fas fa-search'></i>
      </button>
    </form>
  )
}
