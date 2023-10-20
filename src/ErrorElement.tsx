import React from 'react'

const ErrorElement: React.FC = () => {

  return (
    <div
      style={{
        fontWeight: '700',
        color: '#ad4335',
        fontSize: '40px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        position: 'absolute',
      }}
    >
      Error occured
    </div>
  )
}

export default ErrorElement