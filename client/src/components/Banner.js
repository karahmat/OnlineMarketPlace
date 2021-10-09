import React from 'react'
import { Container } from 'react-bootstrap'
import Logo from './Logo'
import { SearchBar } from './SearchBar'

const Banner = () => {
  return (
    <Container>
      <Logo />
      <SearchBar />
    </Container>
  )
}

export default Banner
