import React from 'react'
import { Container } from 'react-bootstrap'
import { SearchBar } from './SearchBar'

const Banner = () => {
  return (
    <Container fluid className='search-bar'>
      <SearchBar />
    </Container>
  )
}

export default Banner
