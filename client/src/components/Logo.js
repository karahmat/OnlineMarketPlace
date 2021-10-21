import React from 'react'
import { Image } from 'react-bootstrap'

const Logo = () => {
  return <Image src='/images/logo.png' style={{width: '100%', minWidth: '60px', maxWidth: '100px'}} className='logo'></Image>
}

export default Logo
