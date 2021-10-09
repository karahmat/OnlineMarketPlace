import React from 'react'

export const SearchBar = () => {
  return (
    <form action='/' method='get' className='search-bar'>
      <label htmlFor='header-search'>
        <span className='visually-hidden'>Search your item here!</span>
      </label>
      <input
        type='text'
        id='header-search'
        placeholder='Search products'
        name='search-bar'
        style={{ width: '500px' }}
      />
      <button type='submit'>
        <i class='fas fa-search'></i>
      </button>
    </form>
  )
}
