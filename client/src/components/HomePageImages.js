import React from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'

const HomePageImages = () => {
  return (
    <Container my-5>
      <Row>
        <Col xs={6} md={4}>
          <Image src='/images/homepage1.jpg' thumbnail />
        </Col>
        <Col xs={6} md={4}>
          <Image src='/images/homepage2.jpg' thumbnail />
          <Image src='/images/homepage4.jpg' thumbnail />
        </Col>
        <Col xs={6} md={4}>
          <Image src='/images/homepage3.jpg' thumbnail />
        </Col>
      </Row>
    </Container>
  )
}

export default HomePageImages
