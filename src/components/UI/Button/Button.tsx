import React from 'react'
import cl from './button.module.css'

interface Props {
  text: string
}

const Button: React.FC<Props> = ({text}) => {

  return (
    <button className={cl.button}> { text } </button>
  )
}

export default Button