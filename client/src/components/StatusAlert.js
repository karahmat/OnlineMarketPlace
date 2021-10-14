import React from 'react'
import { Alert } from 'react-bootsrap'

const StatusAlert = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>
}

export default StatusAlert
