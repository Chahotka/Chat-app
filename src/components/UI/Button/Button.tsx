import React from 'react'
import cl from './button.module.css'

interface Props {
  text: string
  action: React.MouseEventHandler
}

const Button: React.FC<Props> = ({text, action}) => {

  return (
    <button 
      className={cl.button} 
      onClick={action} 
    > 
      { text } 
    </button>
  )
}

export default Button